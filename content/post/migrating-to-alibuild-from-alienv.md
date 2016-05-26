+++
author = "Laurent Aphecetche"
date = "2016-04-08T15:48:45+02:00"
description = ""
tags = [ "aliroot", "build", "alibuild", "alienv" ]
jira = [ "ALIROOT-6678" ]
title = "Migrating to aliBuild from alice-env"
draft = false
lastmod = "2016-05-09"
+++

This page is a short recap of what I have done to migrate my development environment from the usage of the [alice-env.conf way](https://dberzano.github.io/alice/install-aliroot/manual/) of installing things to the new [alibuild way](https://dberzano.github.io/alice/alibuild).

> The main issue is that I'm used to work with different workdirs, one for each major branch I'm developping in.

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

But to avoid wasting space and to retain all the information about my local branches (and being able to share that information between different working directories) I'd prefer use [worktrees](https://git-scm.com/docs/git-worktree), which should be the modern way of doing the equivalent of `git-new-workdir`...

The worktree stuff is not completely ideal. At least I did not succeed to get let's say a bare repo and several worktrees (including one with master). The problem being that the bare repo is itself considered at master, so one cannot checkout a master branch in a worktree (could use the -f option to force when doing worktree add but then a pull in the master worktree with convert the bare repo in a strange state, i.e. a directory without a .git directory but a checkout = workdir...). So I ended up having the primary clone be at master and the other worktress at different branches.

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

Note the master being a direct link to the "primary" clone, all the other ones were created with the `git worktree` command.

Then to build use : 

```
> cd $HOME/o2/o2work/aliroot-master
> aliBuild -z -w ../sw-run2 -d build AliRoot --disable GEANT3,GEANT4,GEANT4_VMC,fastjet,HepMC,EPOS,JEWEL
```

(there was an issue at first, fixed in [JIRA 6678](https://alice.its.cern.ch/jira/browse/ALIROOT-6678))

Note that in the above the destination directory is `sw-run2` while the default is assumed to be `sw`, so one then has
to specify it in the subsequent `alienv` command, e.g. :

```
> alienv -w $HOME/o2/o2work/sw-run2 q
VO_ALICE@AliEn-Runtime::latest
VO_ALICE@AliEn-Runtime::v2-19-le-1
VO_ALICE@AliRoot::0-1
VO_ALICE@AliRoot::latest
VO_ALICE@AliRoot::latest-aliroot-feature-muonhlt
VO_ALICE@AliRoot::latest-aliroot-master
VO_ALICE@AliRoot::latest-aliroot-reco-2016
VO_ALICE@BASE::1.0
VO_ALICE@GEANT3::latest
VO_ALICE@GEANT3::v2-1-1
VO_ALICE@GEANT4::latest
VO_ALICE@GEANT4::v4.10.01.p03-1
VO_ALICE@GEANT4_VMC::latest
VO_ALICE@GEANT4_VMC::v3-2-p1-1
VO_ALICE@GMP::latest
VO_ALICE@GMP::v6.0.0-1
VO_ALICE@GSL::latest
VO_ALICE@GSL::v1.16-1
VO_ALICE@MPFR::latest
VO_ALICE@MPFR::v3.1.3-1
VO_ALICE@ROOT::latest
VO_ALICE@ROOT::v5-34-30-alice-1
VO_ALICE@boost::latest
VO_ALICE@boost::v1.59.0-1
VO_ALICE@vgm::4.3-1
VO_ALICE@vgm::latest
> alienv -w $HOME/o2/o2work/sw-run2 enter VO_ALICE@AliRoot::latest-aliroot-reco-2016
```

or, simpler yet, have the `WORK_DIR` environment variable defined to point to it.

To setup a directory to work on an existing remote branch, use the `worktree` command and give the name of the remote
branch as the last argument :  

```
> mkdir ~/alicesw/run3/aliroot-ed-detector-experts
> cd ~/alicesw/repos/AliRoot 
> git worktree add ../../run3/aliroot-ed-detector-experts/Aliroot ed-detector-experts
> cd ~/alicesw/run3/aliroot-ed-detector-experts
> git clone https://github.com/alisw/alidist -b IB/v5-08/prod
> aliBuild -z -w ../sw -d build AliRoot --disable GEANT3,GEANT4,GEANT4_VMC,fastjet,HepMC,EPOS,JEWEL
```

In the end I decided on an organization where I have one directory will all the "master" clones I'm interested in, and
 two separate directories for the legacy (aka Run2) work and the new (aka Run3) work.

```
├── repos
│   ├── AliPhysics
│   ├── AliRoot
│   ├── FairRoot
│   ├── O2
│   └── ROOT
├── run2
│   ├── aliroot-master
│   ├── aliroot-reco-2016
│   ├── aliroot-tc-17
│   └── sw
└── run3
    ├── aliroot-ed-detector-experts
    └── aliroot-feature-muonhlt
    └── sw
```

The distinction between the two being made by aliases changing the value of the `WORK_DIR` environment variable :

```
run2=`export WORK_DIR=~/alicesw/run2/sw`
run3=`export WORK_DIR=~/alicesw/run3/sw`
```

Finally, to start working on a new directory for aliroot or o2 with a local dev repo, just prepare the directory with
the relevant worktree before issuing the `alibuild init -z directory` command.

```
> cd ~/alicesw/run3
> mkdir o2-dev
> cd ~/alicesw/repos/O2
> git worktree add ~/alicesw/run3/o2-dev/O2 upstream/dev
> cd ~/alicesw/run3/
> alibuild init -z o2-dev
```

The last command above will simply make a clone of `alidist` under `o2-dev` (at the same level as the O2 worktree).

Then good to go for the full build command :

```
cd ~/alicesw/run3/o2-dev
alibuild -z -w ~/alicesw/run3/sw --disable fastjet,GEANT4,GEANT4_VMC,HepMC,EPOS,JEWEL,DDS build O2
```
