---
author: "Laurent Aphecetche"
date: "2021-02-08"
lastmod: "2021-02-08"
description: "aliBuild is not bad, but Spack is better."
tags: ["o2","spack", "build"]
title: "Migrating from aliBuild to Spack"
draft: false
---

# From aliBuild to Spack

> :construction: This WIP document is documenting a WIP :construction_worker:
> 
> I'm not claiming everything works in this WIP
> 
> I'm not claiming I have all the answers
>
> But I'm claiming it should be considered :wink:
>  
> I've probably forgotten a few things here and there :hole:
> 
> Please comment :writing_hand: 
> 

While aliBuild is a fine product that has served us reasonably well, I would argue it has also enough defects to warrant we consider alternatives.

If you want to cut to the chase and forego the initial [argumentation](#Why-shouldn’t-we-keep-aliBuild-), you can go directly to a general [Spack description](#The-strengths-of-Spack) or to a [proto-tutorial](#Translating-aliBuild-workflows-to-Spack-workflows) on how we could use it for O2.

## Why shouldn't we keep aliBuild ? 
The primary issue with aliBuild is not a technical one, but a manpower one. It is (mostly) a one-developer endeavour. Which means new features, support requests, documentation needs can (mostly) only be dealt with by one person.
Which is already a problem, but is worsen by the fact that the same developer is also vital for a very central part of our software, namely the DPL framework, which is used in reconstruction, simulation and analysis.

Then there is the very pertinent question (not really technical either) of why an experiment needs a (completely) custom tool to handle its software stack. 
As every HEP experiment out there needs to deal with (big) software stacks, surely there is a way of not reinventing the wheel within each experiment.
 
Coming now to more "technical" issues, the aliBuild recipes, hosted in a separate [alidist](https://github.com/alisw/alidist) repository, basically deal with one version of a package at a time. Which means that to use two versions of the same package, one has to juggle between alidist branches. 

Another annoyance is that aliBuild can only fetch sources from git. Meaning that to get code from projects that don't use git (either providing only tarball releases, or using another versioning system for instance) we have to mirror full git repositories to "adopt" that source code. And then the maintenance of those repositories adds to the maintenance of our directly managed repositories, as we must follow the new versions, etc.. 
Currently [alidist](https://github.com/alisw/alidist) uses 45 [alisw repositories](https://github.com/alisw) that are mirrors of external repositories. In some cases we, as an experiment, indeed need special fixes that can not be (or are) be accepted by upstreams, and so have to be under our control. And thus could warrant a full mirrored version. But it seems that most of those 45 packages do not really fall under this category, and are just a consequence of the inability of aliBuild to fetch anything but from git. 

Next is the somewhat fragile way to deal with reusing (when possible) packages from the system. That part, as the package version itself, is embeded into each recipe and is not easily/globally controllable. And sometimes trying to identify why a system package cannot be used, by way of aliDoctor, just adds to the confusion, as aliDoctor and aliBuild seem to be able to disagree...

Finally, as far as the end user experience goes, while it has improved over time, aliBuild is sometimes quite frustrating to work with, either because it is rebuilding a lot of stuff for no apparent reason or because it is not rebuilding a package that the user would want to rebuild... Cleaning stuff is also not as user friendly as it could be for sure.

I'm sure that many of the technical hurdles could be overcome. With more manpower. That we don't have (and even if we had, should we throw it to the task of develop a build system for only one experiment ?) Which is coming back to my first argument(s).

Anyway, enough "ranting" about aliBuild, let's turn to Spack to see whether the grass is greener on the other side. 

## The strengths of Spack

As a quick introduction to Spack, let me just quote directly from the [Spack github repo](https://github.com/spack/spack) : 

> Spack is a multi-platform package manager that builds and installs multiple versions and configurations of software. It works on Linux, macOS, and many supercomputers. Spack is non-destructive: installing a new version of a package does not break existing installations, so many configurations of the same package can coexist.

> Spack offers a simple "spec" syntax that allows users to specify versions and configuration options. Package files are written in pure Python, and specs allow package authors to write a single script for many different builds of the same package. With Spack, you can build your software all the ways you want to.

### Recipes == packages

Spack and aliBuild actually share the idea of using recipes to describe the building of the packages.  Spack "recipes" are actually called packages :package: and are python files  (while aliBuild recipes are shell scripts).  The advantage of Python here is that Spack offers a few base classes to ease the description of the builds, depending on the [build system](https://spack.readthedocs.io/en/latest/build_systems.html) used (e.g. cmake, autotools, meson, etc...). Also an advantage of Spack is that a single package file usually describes the building of many versions of that package (which with aliBuild requires different versions of the recipe itself). While the aliBuild recipes are kept in a single repo (alidist), the Spack core packages (more than 5200 as of Jan 25th, 2021) come with Spack itself. Extra packages can be kept in separated repos.


Spack is an open source project with a sizeable and active community. Is offers a quite good [documentation](https://spack.readthedocs.io/en/latest/), a very complete [tutorial](https://spack-tutorial.readthedocs.io/en/latest/) and its developers have been so far quite responsive (on Slack). 

### The spec and the variants

Each package can have several _variants_ that can be installed separately. For instance, installing `root` with arrow and aqua support, but without vmc, would be done using : 

 ```
 spack install root +aqua +arrow ~vmc
 ```

The `root +aqua +arrow ~vmc` (can also be written without spaces as `root+aqua+arrow~vmc`) is what Spack calls a _spec_. It specifies what the user wants to build. 

The _spec_ syntax is both simple and quite powerful (even if a bit hard to read at times). It can contain variants as above, but also the package version, the compiler to be used, etc...

 ```
 spack install root@6.22.06 +x+opengl %gcc@7.4.0 cxxstd=17
 ```

The high level spec (called an _abstract spec_) given by the user is actually converted in an actual plan of what must be built exactly. That step is performed by the so called _concretizer_ which resolves dependencies. The actual list of what will be (or has been) installed for a given spec called a _concrete spec_ and is given by the `spec` 
 command :

```
$ ~ % spack spec -It boost@1.74.0
Input spec
--------------------------------
 -   [    ]  boost@1.74.0

Concretized
--------------------------------
 -   [    ]  boost@1.74.0%apple-clang@12.0.0+atomic+chrono~clanglibcpp~container~context~coroutine+date_time~debug+exception~fiber+filesystem+graph~icu+iostreams+locale+log+math~mpi+multithreaded~numpy~pic+program_options~python+random+regex+serialization+shared+signals~singlethreaded+system~taggedlayout+test+thread+timer~versionedlayout+wave cxxstd=98 visibility=hidden arch=darwin-bigsur-skylake
[+]  [bl  ]      ^bzip2@1.0.8%apple-clang@12.0.0+shared arch=darwin-bigsur-skylake
 -   [b   ]          ^diffutils@3.7%apple-clang@12.0.0 arch=darwin-bigsur-skylake
[+]  [bl  ]              ^libiconv@1.16%apple-clang@12.0.0 arch=darwin-bigsur-skylake
[+]  [bl  ]      ^zlib@1.2.11%apple-clang@12.0.0+optimize+pic+shared arch=darwin-bigsur-skylake
```

The `[+]` indicates a dependency that is already installed while `-` a dependency that will be installed. `[blr]` is the type of depency : **b**uild, **l**ink, **r**un.

The way specs are concretized can be configured, e.g. to specify preferred variants. Note that one part of the spec is the (micro)architecture : that's not something we currently use in Alice, but Spack can in principle produce binaries optimized for a given architecture.

### Dealing with externals

Externals here is to be understood as things not built with Spack. For instance if you don't want Spack to build its own version of CMake (as a build dependency of some package) you can tell it to use an existing cmake that you already have in `/usr/local/bin`. That is specified in a `packages.yaml` file, e.g. :

```
packages:
  cmake:
    externals:
    - spec: cmake@3.19:
      prefix: /usr/local
```

and then _that_ version of cmake (and that one only) would be used by any spec that needs cmake >= 3.19.

The externals can be specified by hand in the `packages.yaml` and also some can be discovered using the `spack external find` command.

### Save the environment

A set of specs and configuration can be bundled into what is called a Spack environment, to describe, in a compact way, all the needs of a given installation.  For instance for o2 that could be something like : 

```
$ cat o2.yaml
spack:
  view: true
  concretization: together
  config:
    install_missing_compilers: true
  specs:
    - o2-aliceo2@21.03
  packages:
    all:
      compiler: [gcc@7.4.0]
      variants: cxxstd=17
    cmake:
      buildable: false
      externals:
      - spec: cmake@3.19:
        prefix: /usr/local
```

That environment can be installed at once using `spack env create o2 o2.yaml && spack install`. A `spack.lock` file is created with the concretized version of the environment description, and that lock file can also be used to install _exactly_ the same specs on another machine (did not check that part myself yet though).

### Modules

Spack automatically generates module files. The generated module files have a hash in their name, e.g. :

```
~$ module avail o2-co
------------------------- /Users/laurent/opt/spack/share/spack/modules/darwin-bigsur-skylake -------------------------
o2-common-1.5.0-apple-clang-12.0.0-64lsch2         o2-configuration-2.5.0-apple-clang-12.0.0-z52cums
o2-common-1.5.0-apple-clang-12.0.0-s3pwx5p         o2-control-occplugin-0.18.0-apple-clang-12.0.0-5jwjzrw
o2-configuration-2.5.0-apple-clang-12.0.0-mv5lien
```
which makes their direct usage a bit cumbersome. Fortunately spack provides the `load` command to alleviate this :

```
~$ spack load o2-common
~$ spack find --loaded
==> 4 installed packages
-- darwin-bigsur-skylake / apple-clang@12.0.0 -------------------
boost@1.74.0  bzip2@1.0.8  o2-common@1.5.0  zlib@1.2.11

```

Note that Spack does _not_ actually require module files to work (and the `spack load` command works even without the `module` command). Binaries can also be used as they are (Spack is using RPATH, so no fussing with LD_LIBRARY_PARTH needed). And it also offers [filesystem views](https://spack.readthedocs.io/en/latest/workflows.html#filesystem-views), that may be useful in some cases.

### :rocket: Build caches

We all know that building from source can be painfully slow :sleeping:. The Spack project does not provide by itself binary packages but is able to deal with binary caches and to (gpg-) sign the binaries.

### :wrench: Configuration

There are a few files that can be used to configure Spack for different use cases / facilities : 

- `packages.yaml` : concretization and external preferences (possibly one such file per platform)
- `config.yaml` : general configuration like where to put the caches, the sources, etc...
- `compilers.yaml` : describes the list of available compilers
- `mirrors.yaml` : the list of source (and possible binary) mirrors
- `repos.yaml` : the list of package repos (package=recipe)



---


## Translating aliBuild workflows to Spack workflows

In order to check whether Spack could really replace aliBuild for O2, I've tried to build (most of) our packages, on macOS BigSur (x86_64 and arm64) laptops and on a CentOS7 VM. I'm trying to address a few typical use cases : 

- as a [end user](#Basic-package-installation), I want to install aliceo2 to run some of its executable (o2-sim, o2-det-xxx). I want the install to be as fast as possible but I cannot use RPMs or cvmfs, because I'm not on a CentOS system for instance
- as a [o2 developper](#Develop-packages), I want to install aliceo2 as a development package to work on it. I also want the install to be as fast as possible to focus on my dev work
- as a [wp3 member / power user](#Creating-build-caches), I want to produce pre-built packages so they are available for anyone to profit from fast(er) installs
- as a flp-project member, I want to provide RPMs of the pre-built packages my wp3 fellows have done (TBD)

As this work is (as of yet at least) a solo project, some edges are still quite rough... but I've not identified real showstoppers (yet?).

### Initial setup (one time)

aliBuild initial setup is simpler/shorter, but the Spack installation certainly could be automatized somehow, if need be. It's not terribly complex, but could be streamlined for sure (in particular the cp config part), e.g. within a little shell script. But for this document, I guess it's better to actually show all the steps required. Of course the `*aphecetche*` paths would be replaced with more "official" (e.g. `alisw`) ones.

|aliBuild | Spack |
|---|---|
|git clone https://github.com/alisw/alibuild  or pip install alibuild | git clone https://github.com/spack/spack ~/alispack/spack |
|aliBuild init or git clone https://github.com/alidist |git clone https://github.com/aphecetche/spack-aliceo2 ~/alispack/spack-aliceo2|
|| git clone https://github.com/aphecetche/spack-aphecetche ~/alispack/spack-aphecetche|
|| spack repo add ~/alispack/spack-aliceo2 |
|| spack repo add ~/alispack/spack-aphecetche |
|| spack mirror add aphecetche https://spack-aphecetche-mirror.eu-central-1.linodeobjects.com |
||curl -LO https://aphecetche.xyz/gpg-laurent-aphecetche.pub |
||spack gpg trust gpg-laurent-aphecetche.pub|
|| cp ~/alispack/spack-aliceo2/config/packages.yaml $HOME/.spack/packages.yaml|
|| cp ~/alispack/spack-aliceo2/config/darwin-x86_64.packages.yaml $HOME/.spack/darwin/packages.yaml |

The `~/alispack` path is just a choice, you may of course pick a different one. The fact that there are two repos for the package (`spack-aliceo2` and `spack-aphecetche`) is temporary (I believe it just has to do with some changes for Apple Silicon that should be back-ported to upstream eventually, but I would have to cross-check). The last line is only needed on macOS (Intel).

Then the spack command should be made available to the path. One way to do it is : 

```
$ source ~/alispack/spack/share/spack/setup-env.sh
```

From then one the `spack` command (and its subcommands) are available on the command line : 
```
$ spack --help
```

Once aliBuild is there and alidist has been cloned/init-ed at least once, aliBuild is ready to go.  While Spack can also work right after the clone of the spack core and the clone of one (or more) recipe's repos, some configuration might need to be done still.

You can check the current Spack configuration using : 

- `spack repo list` to get the list of repos used to get packages
- `spack mirror list` to get the list of mirrors that hosts sources and/or binaries packages
- `spack compiler list` to get the list of configured compilers (the first time this one is executing, and if you have not specifically configure compilers in any other way, it will take a few moments to detect the compiler(s))
- `spack config get [xxx]` to get the section \[xxx\] of the configuration, where xxx can be compilers, mirrors, repos, packages, etc... (note the plural). See also `spack config get --help`
- `spack config blame [xxx]` to see where the configuration parts are coming from

#### Setup compiler(s)

Can be as simple as `spack compiler find` to detect available compilers or as "complex" as using `spack config edit compilers` command (which basically is editing `~/.spack/[platform]/compilers.yaml`). In particular on macOS one has to install a Fortran compiler and ensure that Spack knows about it.

#### Setup some paths (optional)

If the default root tree `location_of_spack_clone/opt/spack` is not to your liking, then `~/.spack/config.yaml` must be edited to change it.

#### Setup externals (optional)

If you want to pick packages from the system, `spack external find` and/or edit `~/.spack/packages.yaml` (and/or the `/.spack/[platform]/packages.yaml`

#### Setup mirrors (optional for source, needed for binaries)

By default only the sources are cached by Spack, but adding a binary-capable mirror also give access to binary packages.

`spack mirror add some_name some_mirror_url`

### Basic package installation

Get an idea of what will be done :mag:
```
spack spec -It o2-aliceo2
```

And then do it :tada: (well, actually don't do it yet, read ahead first for a possibly better option)

```
spack install --fail-fast o2-aliceo2
```

> Note once again that all this in WIP so I can offer no guarantee at this stage that the relevant variants (sim, analysis, etc..) of AliceO2 are actually already in the buildcache, or even that they all work.

The `fail-fast` option will make Spack fails at the first package failure. Spack uses parallel installation and without this flag  it tries hard to install as many dependencies as possible before failing. Generally you want to notice early if you have a problem, hence this flag.

Depending on whether you install from source only or have buildcache(s) properly configured, this can take quite a bit of time. 

If you want to be sure you're _only_ using pre-built binaries, and don't accept to do _any_ compilation yourself, do : 

```
spack buildcache install o2-aliceo2
```

or : 

```
spack install --cache-only o2-aliceo2
```

For this to work someone must have of course populated one of the buildcaches specified in the mirror list.

Note that a very first install on an empty system, even from a buildcache, will take long. The packages have to be downloaded for one, and then relocated.

To set what is installed : 

```
spack find
```

To see what's available on buildcache(s) do : 

```
spack buildcache list
```

To use you brand new installed software, you can either use directly an executable (Spack uses RPATH consistently, so no LD_LIBRARY_PATH should be needed) or load that package.

For direct usage, find the installation path (e.g. using `spack find` or any other mean) then use the executable. Once you know the path, spack is no longer involved in the process.

```
~ % spack find -p o2-aliceo2
==> 1 installed package
-- darwin-bigsur-skylake / apple-clang@12.0.0 -------------------
o2-aliceo2@21.03  /Users/testuser/alispack/spack/opt/spack/darwin-bigsur-skylake/apple-clang-12.0.0/o2-aliceo2-21.03-yhtdx2g5jtwa4ig7a5pdilnpyiu2jmlc
~ % /Users/testuser/alispack/spack/opt/spack/darwin-bigsur-skylake/apple-clang-12.0.0/o2-aliceo2-21.03-yhtdx2g5jtwa4ig7a5pdilnpyiu2jmlc/bin/o2-ccdb-upload --help
Allowed options:
  --host arg (=ccdb-test.cern.ch:8080) CCDB server
  -p [ --path ] arg                    CCDB path
  -f [ --file ] arg                    ROOT file
  -k [ --key ] arg                     Key of object to upload
  -m [ --meta ] arg                    List of key=value pairs for
                                       meta-information (k1=v1;k2=v2;k3=v3)
  --starttimestamp arg (=-1)           timestamp - default -1 = now
  --endtimestamp arg (=-1)             end of validity - default -1 = 1 year
                                       from now
  -h [ --help ]                        Produce help message.
```

You can also the package and then use it. This requires that the spack `setup-env.sh` has been sourced at some point in that shell : 

```
source ~/alispack/spack/share/spack/setup-env.sh
...
spack load o2-aliceo2
o2-ccdb-upload --help
```

_If_ you have the module command available, you can also use that (but it's more cumbersome as the module name contains some hash).



### Develop packages

> The instructions below are to develop ONE local package. For several packages there's probably a better way (using spack environments and spack develop command) that I still have to investigate.

> Note that currently Spack is _not_ uploading purely build (and test) dependencies to buildcaches, so the dev-build below might still require the compilation of some packages even if you have a properly configured buildcache. I'm trying to see how/if that can be changed.

> And even in the case everything is setup correctly, you _might_ still get some recompilation if your configuration for externals is different from the one used on the machine populating the buildcache ...
> 

Clone your fork of the package you want to develop, AliceO2 in this example : 

```
git clone https://github.com/aphecetche/AliceO2.git ~/custom-dev/this-is-my-o2
cd ~/custom-dev/this-is-my-o2
git checkout -b my-new-killer-feature
edit some code...
```

Then use the `spack dev-build` to get into a properly configured build environment : 

```
$ spack dev-build -u cmake --drop-in zsh o2-aliceo2@dev+sim~analysis
```

The last parameter of this command is the spec corresponding to the package you want to develop (if/once installed, that will be the spec used to reference it).

The `-u` option tells Spack **u**ntil which step it should go in the installation procedure (aka installation phases, that depends on the package, see e.g. `spack info pkg`). Without that option Spack will go through the full installation. In the case above, Spack would stop after the cmake step.

In the new shell specified by the `--drop-in` option all the builds dependencies are available to the build system (for cmake thanks to the CMAKE_PREFIX_PATH env variable, for pkgconfig thanks to the PKG_CONFIG_PATH env variable, etc...).  You can try a `printenv` in that shell to actually see what Spack has prepared for you. Spack has also added a couple of files and a subdirectory : 

```
~/custom-dev/this-is-my-o2 % ls -ldF spack-*
-rw-r--r--   1 testuser  staff  55328 Feb 12 16:27 spack-build-env.txt
-rw-r--r--   1 testuser  staff  30683 Feb 12 16:28 spack-build-out.txt
drwxr-xr-x  41 testuser  staff   1312 Feb 12 16:28 spack-build-pb2cksx/
-rw-r--r--   1 testuser  staff    109 Feb 12 16:27 spack-configure-args.txt
```

You can have a look at the `*.txt` files but to actually build you'd go the spack-build-xxx directory and do a `ninja`or `cmake --build .` as usual. Edit the code, ninja, edit the code, ninja, rince and repeat.


Ok, now assume you're exiting this subshell and then want to get another one, but without redoing the cmake phase. c

```
$ cd ~/custom-dev/this-is-my-o2
$ spack dev-build -i -b cmake --drop-in zsh o2-aliceo2@dev+sim~analysis
```

Note the `-b cmake` (b like in before) instead of `-u cmake` in the `dev-build` call, and the `-i` which skips the installation of the dependencies, as they are already there.

A variation on those dev instructions _might_ be usable when : 

- you are not changing the dependencies of the package you are developing 
- you already have a version (with the relevant variants) of it installed 
- you are using the default compiler on your machine and/or are setting up the compiler all by yourself (in the previous method Spack is handling compilers through shims)
- you do _not_ want to install it as a Spack package (you cannot because you miss e.g. proper RPATH-ing and things like that when not using Spack compiler wrappers)

Then you can let Spack do the heavy lifting of setting up the CMAKE_PREFIX_PATH and PKG_CONFIG_PATH variables that are used by cmake to find the dependencies and then use a simple cmake command :  

```
$ spack load --only dependencies o2-aliceo2+sim~analysis
$ cd whetever
$ cmake ~/custom-dev/this-is-my-o2 -GNinja
$ ninja
```


### Creating build caches

For this part the mirror url has to be changed to s3://something (if using s3 of course)

```
spack mirror add aphecetche s3://spack-aphecetche-mirror
```

You would then need proper credentials for AWS (either using env. variables or in ~/.aws/config) to have (write) access to that S3 bucket.

You might setup a GPG private key to sign the binaries (there is a way to produce unsigned binaries for testing purposes).

Then a single command line will upload `o2-aliceo2` and its dependencies : 

```spack buildcache create --rebuild-index -f -a -m aphecetche o2-aliceo2```

(that part can be long). I'm not too sure the `--rebuild-index` should be part of this command (seems it is executed after each dep and hence quite slow). Probably better would be to run : 

```
spack buildcache update-index -d s3://spack-aphecetche-mirror
```

once done with the actual creation.

Note that you must get a recent enough python with boto3 module (or install py-boto3 with spack...)

At least with S3 linode buildcaches objects are created private (as well as the buildcache index), so _must_ make them public afterwards using :

```
s3cmd setacl --acl-public --recursive s3://spack-aphecetche-mirror/build_cache/
```

A symptom of failing to do so is to get an empty result from `spack buildcache list` even if you happen to know that the buildcache is _not_ empty.

### Full stack installation (TBD)

Getting an environment file (either a yaml or even better a .lock one) and use that to install.

### Build in docker (TBD)

Try a spack version of the docker test described in :

https://aliceo2group.github.io/quickstart/devel.html

## Misc

The (>5K) core packages that come with Spack are in `~/alispack/spack/var/spack/repos/builtin/packages`


### Finding more info about packages

`spack list` to get the list of available packages (in the configured repos)

`spack info pkg` to get information about a package (versions, variants, build phases, dependencies)

`spack versions -s pkg` to get the list of possible versions for a spec

`spack edit pkg` to look at/edit the package file

### Debugging Spack builds

What to do if `spack install spec` fails ?

If it's really a build failure (and e.g. a fetch failure), you should be able to cd into the temporary directory Spack is setting up for the build.

```
spack cd spec
```

and have a look at the `./spack-*` files there.

If you want to go further and actually try the build yourself, you can then setup the same env Spack is using for that spec with : 

```
spack build-env package_name zsh
```

that will drop you in a shell (zsh in this example) with the env set. Then it's probably a matter of `cd ../spack-build-xxxx && cmake --build . ` for a cmake-based package.
