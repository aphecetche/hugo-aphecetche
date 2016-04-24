+++
author = "Laurent Aphecetche"
date = "2016-04-08T15:48:45+02:00"
description = ""
tags = [ "aliroot", "build", "alibuild", "alienv" ]
title = "Migrating to aliBuild from alice-env"
draft = false
+++

This page is a short recap of what I ~~have done~~ am trying to do to migrate my development environment from the usage of the [alice-env.conf way](https://dberzano.github.io/alice/install-aliroot/manual/) of installing things to the new [alibuild way](https://dberzano.github.io/alice/alibuild).

The main issue is that I'm used to work with different workdirs, one for each major branch I'm developping in.

For instance, for AliRoot, my existing setup was :

```
> ls  -1 ~/alicesw/aliroot
bugfix
feature-muonhlt
git
master
master-cxx11
reco-2016
tc-17
```

Those directories actually contains 3 subdirectories : `src`, `build` and `inst` (or only 1, `src`, if the installation has been removed for some reason)

```
> tree -a  -L 2 -I ".DS_Store|git"
.
├── feature-muonhlt
│   ├── build
│   ├── inst
│   └── src
├── master
│   └── src
├── master-cxx11
│   ├── build
│   ├── inst
│   └── src
├── reco-2016
│   ├── build
│   ├── inst
│   └── src
├── tc-17
│   ├── build
│   ├── inst
│   └── src
```

`git` is the actual _original_ clone while all the other directories were made using the (now depreacated, btw, see below) [git-new-wordir](http://nuclearsquid.com/writings/git-new-workdir/) script, meaning a lot of their `.git` was pointing back to the original one.

```
> ls -al ~/alicesw/aliroot/master/src/.git
ls -al .git
total 3424
drwxr-xr-x+ 18 laurent  staff      612  8 avr 15:54 .
drwxr-xr-x+ 86 laurent  staff     2924 23 mar 16:32 ..
-rw-r--r--@  1 laurent  staff       84  7 avr 18:56 COMMIT_EDITMSG
-rw-r--r--@  1 laurent  staff      329 17 déc 11:22 COMMIT_EDITMSG.sb-eb83c4bc-uPRKg5
-rw-r--r--+  1 laurent  staff    10964  8 avr 09:22 FETCH_HEAD
-rw-r--r--+  1 laurent  staff       23  8 avr 09:22 HEAD
-rw-r--r--+  1 laurent  staff       41  8 avr 09:22 ORIG_HEAD
lrwxr-xr-x   1 laurent  staff       46 16 déc  2014 config -> /Users/laurent/alicesw/aliroot/git/.git/config
lrwxr-xr-x   1 laurent  staff       45 16 déc  2014 hooks -> /Users/laurent/alicesw/aliroot/git/.git/hooks
-rw-r--r--+  1 laurent  staff  1686150  8 avr 09:22 index
lrwxr-xr-x   1 laurent  staff       44 16 déc  2014 info -> /Users/laurent/alicesw/aliroot/git/.git/info
drwxr-xr-x+  4 laurent  staff      136  6 jan 15:06 logs
lrwxr-xr-x   1 laurent  staff       47 16 déc  2014 objects -> /Users/laurent/alicesw/aliroot/git/.git/objects
lrwxr-xr-x   1 laurent  staff       51 16 déc  2014 packed-refs -> /Users/laurent/alicesw/aliroot/git/.git/packed-refs
lrwxr-xr-x   1 laurent  staff       44 16 déc  2014 refs -> /Users/laurent/alicesw/aliroot/git/.git/refs
lrwxr-xr-x   1 laurent  staff       47 16 déc  2014 remotes -> /Users/laurent/alicesw/aliroot/git/.git/remotes
lrwxr-xr-x   1 laurent  staff       48 16 déc  2014 rr-cache -> /Users/laurent/alicesw/aliroot/git/.git/rr-cache
lrwxr-xr-x   1 laurent  staff       43 16 déc  2014 svn -> /Users/laurent/alicesw/aliroot/git/.git/svn
```

In the `alibuild` world, the way to avoid to have a clone made for any package when using the `aliBuild init -z AliRoot destdir` command is to *prepare* the `destdir` and pre-populate it with an `AliRoot` clone *before* issuing the command. Mind the case, it has to be `AliRoot`, not aliroot or ALIROOT or aliRoot... (the actual case is to be found in the Package key of the alidist recipe for the package, see e.g. `alidist/aliroot.sh`).

But to avoid wasting space I'd prefer use [worktrees](https://git-scm.com/docs/git-worktree), which should be the modern way of doing the equivalent of `git-new-workdir`...

The worktree stuff is not completely ideal. At least I did not succeed to get let's say a bare repo and several worktrees (including one with master). So I ended up having the primary clone be at master and the other worktress at different branches.

I chose the following simple naming convention transformation :

```
aliroot/xxx -> aliroot-xxx/AliRoot
```

So the recipe (pun intended ;-) ) to go from my old directories to the new structure is the following.

- Move the primary clone from `~/alicesw/aliroot/git` to `NEWWORKDIR/AliRoot` (where `NEWWORKDIR` is currently `~/o2/o2work` on my machine, for the record).

- For each (git-new-)workdir `xxx` in `~/alicesw/aliroot` :

  1. create a subdirectory `NEWWORKDIR/aliroot-xxx`
  2. create a `worktree` under that subdirectory :
  `cd NEWWORKDIR/AliRoot; git worktree add ../aliroot-xxx/AliRoot xxx` where I assume here that `xxx` is the actual name of a branch in my primary (local) clone.
  3. `cd NEWWORKDIR/aliroot-xxx`
  4. run `aliBuild -z -w ../sw build AliRoot --disable GEANT3,GEANT4,GEANT4_VMC,fastjet,HepMC,EPOS,JEWEL`

The resulting structure is something like this :

```
├── aliroot-feature-muonhlt
│   ├── AliRoot
│   └── alidist
├── aliroot-master
│   ├── AliRoot -> ../AliRoot
│   └── alidist
├── aliroot-reco-2016
│   └── Aliroot
│   └── alidist
├── aliroot-tc-17
│   └── AliRoot
│   └── alidist
```

Note the master being a direct link to the "primary" clone, all the other ones where created with the `git worktree` command.

But then it simply does not work :

```
> cd $HOME/o2/o2work/aliroot-master
> aliBuild -z -w ../sw -d build AliRoot --disable GEANT3,GEANT4,GEANT4_VMC,fastjet,HepMC,EPOS,JEWEL
....
ERROR:AliRoot:0: Error while executing /Users/laurent/o2/o2work/sw/SPECS/osx_x86-64/AliRoot/0-1/build.sh
ERROR:AliRoot:0: Log can be found in /Users/laurent/o2/o2work/sw/BUILD/AliRoot-latest/log
```

Don't understand what's going on [in the log](/post/migrating-to-alibuild-from-alienv/BUILD-AliRoot-latest.log). Tried to add a message in the  top of the `CheckGitVersion.cmake` but I don't see it ??? (btw, looking at this file I see that my idea of git worktree might not fly without a modification, as there's no `.git` in a worktree... but that'll be for later on...)

So, back to basics to be sure the regular thing is working. Simple thing from scratch :

```
```

That is, as expected, working fine. So the issue is really in my organization of clones / worktrees...
