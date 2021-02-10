---
author: "Laurent Aphecetche"
date: "2021-02-08"
lastmod: "2021-02-08"
description: "aliBuild is not bad, but Spack is better."
tags: ["o2","spack", "build"]
title: "Migrating from aliBuild to Spack"
draft: true
---

While aliBuild is a fine product that has served us reasonably well, I would 
argue it has also enough defects to warrant we consider alternatives.

# Why shouldn't we keep aliBuild ? 

The primary issue with aliBuild is not a technical one, but a manpower one. 
 It is (mostly) a one-developer endeavour. Which means new features, support 
 requests, documentation needs can (mostly) only be dealt with by one person.

Then there is the very pertinent question (not really technical either) of 
why an experiment needs a (completely) custom tool to handle its software stack. 
As every HEP experiment out there needs to deal with (big) software stacks, 
surely there is a way of not reinventing the wheel within each experiment.
 
Turning to more "technical" issues, the aliBuild recipes, hosted in a 
separate [alidist](https://github.com/alisw/alidist) repository, basically deal with
one version of a package at a time. Which means that to use two versions of the
 same package, one has to juggle between alidist branches. 

Another annoyance is that aliBuild can only fetch sources from git. Meaning that
to get code from projects that don't use git (either providing only tarball 
releases, or using another versioning system for instance) we have to mirror
full git repositories to "adopt" that source code. And then the maintenance of 
those repositories adds to the maintenance of our directly managed repositories,
as we must follow the new versions, etc.. 
Currently [alidist](https://github.com/alisw/alidist)
  uses 45 [alisw repositories](https://github.com/alisw) that are 
 mirrors of external repositories. While in some cases we, as an experiment, 
 might well need special fixes that can not (or are not) be accepted by upstreams,
 and would warrant a full mirrored version. But it seems that most of those 
 do not really fall under this category, and are just a consequence of the
   inability of aliBuild to fetch anything but from git. 

Next is the somewhat fragile way to deal with reusing (when possible) packages 
from the system that, as the package version itself, is embeded into each 
recipe. And sometimes trying to identify why a system package cannot be used,
 by way of aliDoctor, just adds to the confusion, as aliDoctor and aliBuild 
 seem to be able to disagree.

Finally, as far as the end user experience goes, while it has improved over 
time, aliBuild is sometimes quite frustrating to work with, either because it
 is rebuilding a lot of stuff for no apparent reason or because it is not
 rebuilding a package that the user would want to rebuild...

I'm sure that many of the technical hurdles could be overcomed. With more 
manpower. Which is coming back to my first argument.

# The strengths of Spack

Just quoting from the [Spack github repo](https://github.com/spack/spack) : 

> Spack is a multi-platform package manager that builds and installs multiple
> versions and configurations of software. It works on Linux, macOS, and many
> supercomputers. Spack is non-destructive: installing a new version of a
> package does not break existing installations, so many configurations of the
> same package can coexist.

> Spack offers a simple "spec" syntax that allows users to specify versions and
> configuration options. Package files are written in pure Python, and specs
> allow package authors to write a single script for many different builds of
> the same package. With Spack, you can build your software all the ways you
> want to.

Spack and aliBuild actually share the idea of using recipes to describe the
building of the packages.  Spack recipes are python files (named
`name_of_the_package/package.py`) while aliBuild recipes are shell scripts
(e.g. `name_of_the_package.sh`).  The advantage of Python here is that Spack
offers a few base classes to ease the description of the builds, depending on
the [build system](https://spack.readthedocs.io/en/latest/build_systems.html)
used (e.g. cmake, autotools, meson, etc...). Also an advantage of Spack is that
a single package file potentially describes the building of many versions of
that package (which with aliBuild requires different versions of the recipe
itself). While the aliBuild recipes are kept in a single repo (alidist), the
 Spack packages can be kept in separated repos (note however that 
 Spack core comes with many packages).

Spack is an open source project with a sizeable community and a quite good
 [documentation](https://spack.readthedocs.io/en/latest/).

The number of readily available packages is pretty large (5213 as of Jan 25th 2021).

## The spec and the variants

Each package can have several _variants_ that can be installed separately. For
instance, installing `root` with arrow and aqua support, but without vmc, would
be done using : 

 ```
 spack install root +aqua +arrow ~vmc
 ```

The `root +aqua +arrow ~vmc` (can also be written without spaces as `root+aqua+arrow~vmc`)
 is what Spack calls a `spec`. It specifies what the user wants to build. 

The `spec` syntax is both simple and quite powerful (even if a bit hard to read
at times). It can contain variants as above, but also of course the package version,
 the compiler to be used, etc...

 ```
 spack install root@6.22.06 +x+opengl %gcc@7.4.0 cxxstd=17
 ```

The high level spec given by the user is actually converted in an actual and
 precise plan of what must be built exactly. That step is perfomed by the 
 so called _concretizer_ which resolves dependencies. The actual list of what 
 will be (or has been) installed for a given spec is given by the `spec` 
 command :

```
$ spack spec -It root@6.22.06~x
Input spec
--------------------------------
 -   [    ]  root~x

 Concretized
 --------------------------------
  -   [    ]  root@2021.02.06%apple-clang@12.0.0+aqua+arrow+dataframe+davix~emacs+examples~fftw~fits~fortran+gdml+gminimal~graphviz+gsl+http~ipo~jemalloc+math~memstat+minuit~mlp+monalisa~mysql~ninja+opengl~postgres~pythia6~pythia8+python~qt4~r+roofit~root7+rpath~shadow~spectrum~sqlite~ssl~table~tbb+threads~tmva+unuran~vc+vdt~vmc~x+xml~xrootd build_type=RelWithDebInfo cxxstd=17 patches=22af3471f3fd87c0fe8917bf9c811c6d806de6c8b9867d30a1e3d383a1b929d7 arch=darwin-bigsur-skylake
  [+]  [bl  ]      ^apmon-cpp@2.2.8-alice5%apple-clang@12.0.0 arch=darwin-bigsur-skylake
   -   [bl  ]      ^arrow@3.0.0%apple-clang@12.0.0~brotli+compute~cuda+gandiva~glog~hdfs+ipc~ipo~jemalloc+lz4~orc~parquet~python+shared~snappy~tensorflow+zlib~zstd build_type=Release cuda_arch=none cxxstd=17 arch=darwin-bigsur-skylake
    -   [bl  ]          ^boost@1.74.0%apple-clang@12.0.0+atomic+chrono~clanglibcpp~container~context~coroutine+date_time~debug+exception~fiber+filesystem+graph~icu+iostreams+locale+log+math~mpi+multithreaded~numpy~pic+program_options~python+random+regex+serialization+shared+signals~singlethreaded+system~taggedlayout+test+thread+timer~versionedlayout+wave cxxstd=17 visibility=hidden arch=darwin-bigsur-skylake
    [+]  [bl  ]              ^bzip2@1.0.8%apple-clang@12.0.0+shared arch=darwin-bigsur-skylake
    [+]  [b   ]                  ^diffutils@3.7%apple-clang@12.0.0 arch=darwin-bigsur-skylake
    [+]  [bl  ]                      ^libiconv@1.16%apple-clang@12.0.0 arch=darwin-bigsur-skylake
    [+]  [bl  ]              ^zlib@1.2.11%apple-clang@12.0.0+optimize+pic+shared arch=darwin-bigsur-skylake
    [+]  [b   ]          ^cmake@3.19.2%apple-clang@12.0.0~doc+ncurses+openssl+ownlibs~qt arch=darwin-bigsur-skylake
    [+]  [bl  ]              ^ncurses@6.2%apple-clang@12.0.0~symlinks+termlib arch=darwin-bigsur-skylake
    [+]  [b   ]                  ^pkgconf@1.7.3%apple-clang@12.0.0 arch=darwin-bigsur-skylake
    [+]  [bl  ]              ^openssl@1.1.1i%apple-clang@12.0.0+systemcerts arch=darwin-bigsur-skylake
    [+]  [b rt]                  ^perl@5.32.0%apple-clang@12.0.0+cpanm+shared+threads patches=517afe8ca1cb12f798f20b21583d91463fe3f4fa9244c6c8e054a92c8135da8f arch=darwin-bigsur-skylake
    [+]  [bl  ]                      ^berkeley-db@18.1.40%apple-clang@12.0.0 arch=darwin-bigsur-skylake
    [+]  [bl  ]                      ^gdbm@1.18.1%apple-clang@12.0.0 arch=darwin-bigsur-skylake
    [+]  [bl  ]                          ^readline@8.0%apple-clang@12.0.0 arch=darwin-bigsur-skylake
    [+]  [bl  ]          ^flatbuffers@1.12.0%apple-clang@12.0.0~ipo~python+shared build_type=RelWithDebInfo arch=darwin-bigsur-skylake
    [+]  [bl  ]          ^llvm@11.0.1%apple-clang@12.0.0~all_targets+clang~code_signing+compiler-rt~cuda~gold+internal_unwind~ipo+libcxx+lld~lldb+llvm_dylib~mlir~omp_debug~omp_tsan+polly~python~shared_libs~split_dwarf build_type=Release cuda_arch=none arch=darwin-bigsur-skylake
    [+]  [bl  ]              ^hwloc@2.4.0%apple-clang@12.0.0~cairo~cuda~gl~libudev+libxml2~netloc~nvml~pci+shared arch=darwin-bigsur-skylake
    [+]  [bl  ]                  ^libxml2@2.9.10%apple-clang@12.0.0~python arch=darwin-bigsur-skylake
    [+]  [blr ]                      ^xz@5.2.5%apple-clang@12.0.0~pic arch=darwin-bigsur-skylake
    [+]  [b   ]              ^perl-data-dumper@2.173%apple-clang@12.0.0 arch=darwin-bigsur-skylake
    [+]  [b r ]              ^python@3.8.7%apple-clang@12.0.0+bz2+ctypes+dbm~debug+libxml2+lzma~nis~optimizations+pic+pyexpat+pythoncmd+readline+shared+sqlite3+ssl~tix~tkinter~ucs4+uuid+zlib patches=0d98e93189bc278fbc37a50ed7f183bd8aaf249a8e1670a465f0db6bb4f8cf87 arch=darwin-bigsur-skylake
    [+]  [bl  ]                  ^apple-libuuid@1353.100.2%apple-clang@12.0.0 arch=darwin-bigsur-skylake
    [+]  [bl  ]                  ^expat@2.2.10%apple-clang@12.0.0~libbsd arch=darwin-bigsur-skylake
    [+]  [bl  ]                  ^gettext@0.21%apple-clang@12.0.0+bzip2+curses+git~libunistring+libxml2+tar+xz arch=darwin-bigsur-skylake
    [+]  [bl  ]                      ^tar@1.32%apple-clang@12.0.0 arch=darwin-bigsur-skylake
    [+]  [bl  ]                  ^libffi@3.3%apple-clang@12.0.0 patches=26f26c6f29a7ce9bf370ad3ab2610f99365b4bdd7b82e7c31df41a3370d685c0 arch=darwin-bigsur-skylake
    [+]  [bl  ]                  ^sqlite@3.34.0%apple-clang@12.0.0+column_metadata+fts~functions~rtree arch=darwin-bigsur-skylake
    [+]  [bl  ]              ^z3@4.8.9%apple-clang@12.0.0+python arch=darwin-bigsur-skylake
    [+]  [  r ]                  ^py-setuptools@50.3.2%apple-clang@12.0.0 arch=darwin-bigsur-skylake
    [+]  [bl  ]          ^lz4@1.9.2%apple-clang@12.0.0 arch=darwin-bigsur-skylake
    [+]  [b   ]          ^ninja@1.10.2%apple-clang@12.0.0 arch=darwin-bigsur-skylake
    [+]  [bl  ]          ^protobuf@3.12.2%apple-clang@12.0.0+shared build_type=Release arch=darwin-bigsur-skylake
    [+]  [bl  ]          ^rapidjson@2020.01.04%apple-clang@12.0.0~ipo build_type=RelWithDebInfo arch=darwin-bigsur-skylake
    [+]  [bl  ]          ^re2@2020-08-01%apple-clang@12.0.0~ipo+shared build_type=RelWithDebInfo arch=darwin-bigsur-skylake
    [+]  [bl  ]          ^utf8proc@2.6.1%apple-clang@12.0.0 arch=darwin-bigsur-skylake
    [+]  [bl  ]      ^davix@0.7.5%apple-clang@12.0.0~ipo build_type=RelWithDebInfo cxxstd=17 arch=darwin-bigsur-skylake
    [+]  [bl  ]      ^freetype@2.10.1%apple-clang@12.0.0 arch=darwin-bigsur-skylake
    [+]  [bl  ]          ^libpng@1.6.37%apple-clang@12.0.0 arch=darwin-bigsur-skylake
    [+]  [bl  ]      ^ftgl@2.4.0%apple-clang@12.0.0~ipo+shared build_type=RelWithDebInfo patches=001908e385de3940afd29f2cf36133dd33cb8931194cd5c419c8bc8f3096e3f0 arch=darwin-bigsur-skylake
    [+]  [bl  ]      ^gl2ps@1.4.2%apple-clang@12.0.0~doc~ipo+png+zlib build_type=RelWithDebInfo arch=darwin-bigsur-skylake
    [+]  [bl  ]          ^apple-glu@4.0.0%apple-clang@12.0.0 arch=darwin-bigsur-skylake
    [+]  [bl  ]          ^apple-opengl@4.0.0%apple-clang@12.0.0 arch=darwin-bigsur-skylake
    [+]  [bl  ]      ^glew@2.1.0%apple-clang@12.0.0~ipo build_type=RelWithDebInfo arch=darwin-bigsur-skylake
    [+]  [bl  ]          ^libice@1.0.9%apple-clang@12.0.0 arch=darwin-bigsur-skylake
    [+]  [b   ]              ^util-macros@1.19.1%apple-clang@12.0.0 arch=darwin-bigsur-skylake
    [+]  [bl  ]              ^xproto@7.0.31%apple-clang@12.0.0 arch=darwin-bigsur-skylake
    [+]  [bl  ]              ^xtrans@1.3.5%apple-clang@12.0.0 arch=darwin-bigsur-skylake
    [+]  [bl  ]          ^libsm@1.2.3%apple-clang@12.0.0 arch=darwin-bigsur-skylake
    [+]  [bl  ]      ^gsl@2.6%apple-clang@12.0.0~external-cblas arch=darwin-bigsur-skylake
    [+]  [bl  ]      ^libjpeg-turbo@2.0.6%apple-clang@12.0.0 arch=darwin-bigsur-skylake
    [+]  [b   ]          ^nasm@2.15.05%apple-clang@12.0.0 arch=darwin-bigsur-skylake
    [+]  [bl  ]      ^nlohmann-json@3.9.1%apple-clang@12.0.0~ipo+single_header build_type=RelWithDebInfo arch=darwin-bigsur-skylake
    [+]  [bl  ]      ^openblas@0.3.13%apple-clang@12.0.0~consistent_fpcsr~ilp64+pic+shared threads=none arch=darwin-bigsur-skylake
    [+]  [bl  ]      ^pcre@8.44%apple-clang@12.0.0~jit+multibyte+utf arch=darwin-bigsur-skylake
    [+]  [bl  ]      ^unuran@1.8.1%apple-clang@12.0.0~gsl+rngstreams+shared arch=darwin-bigsur-skylake
    [+]  [bl  ]          ^rngstreams@1.0.1%apple-clang@12.0.0 arch=darwin-bigsur-skylake
    [+]  [bl  ]      ^vdt@0.4.3%apple-clang@12.0.0~ipo build_type=RelWithDebInfo arch=darwin-bigsur-skylake
    [+]  [bl  ]      ^xxhash@0.7.4%apple-clang@12.0.0 arch=darwin-bigsur-skylake
    [+]  [bl  ]      ^zstd@1.4.5%apple-clang@12.0.0+pic arch=darwin-bigsur-skylake


```

The `[+]` indicates a dependency that is already installed while `-` a
dependency that will be installed. `[blr]` is the type of depency : **b**uild,
**l**ink, **r**un.

The way specs are concretized can be configured, e.g. to specify preferred
variants. Note that one part of the spec is the (micro)architecture : that's
not something we currently use in Alice, but Spack can in principle produce
binaries optimized for a given architecture.

## Dealing with externals

Externals here is to be understood as things not built with Spack. For instance
in the above concretized root spec you see `cmake` is part of the (build)
dependencies.  If you'd prefer that Spack reuses an existing cmake that you
already have in `/usr/local/bin`, that can be specified in a `packages.yaml`
file, e.g. :

```
packages:
  cmake:
    externals:
    - spec: cmake@3.19:
      prefix: /usr/local
```

and _that_ version of cmake (and that one only) would be used by any spec that 
needs cmake >= 3.19.

The externals can be specified by hand in the `packages.yaml` and also some 
can be discovered using the `spack external find` command.

## The beauty of the environment

A set of specs and configuration can be bundled into what is called a Spack
environment, to describe, in a compact way, all the needs of a given
installation.  For instance for o2 that could be something like : 

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

That environment can be installed at once using `spack env create o2 o2.yaml && spack install`
A `spack.lock` file is created with the concretized version of the
environment description, and that lock file can also be used to install _exactly_ the
 same specs on another machine (did not check that part yet)

## Modules

Spack automatically generates module files. Nothing to be done here. 
 Spack does _not_ require module files though.

## Build caches

We all know that building from source can be painfully slow. Spack does not
provide by itself binary packages but is able to deal with binary caches, 
including gpg signature of the binaries.
 I've started to experiment a bit with a S3 binary cache, and,
modulo a probable bug when using a non AWS S3 bucket, it's working fine.
My initial impression is that the binary package creation/upload is a bit slow, 
but I've not yet investigated in detail what exactly is slow.


## Configuration

There are a few files that can (should?) be used to configure Spack :

- packages.yaml : concretization and external preferences (possibly one such file per platform)
- config.yaml : general configuration like where to put the caches, the sources, etc...
- compilers.yaml : describes the list of available compilers
- mirrors.yaml : the list of source (and possible binary) mirrors
- repos.yaml : the list of package repos (package=recipe)

# Translating aliBuild workflows to Spack workflows

In order to check whether Spack could really replace aliBuild for O2, I've
tried to build our packages, as well as trying a few typical use cases in Spack
land.

## Initial setup 

Here, aliBuild is simpler, but the Spack installation could be automatized
 somehow, if need be (it's not terribly complex either).

|aliBuild | Spack |
|---|---|
|git clone https://github.com/alisw/alibuild | git clone https://github.com/spack/spack |
|pip install alibuild | N/A |
|aliBuild init (to get alidist)| git clone some_repo_with_packages|
|| spack repo add some_name some_repo_with_packages |
|git clone https://github.com/alidist| git clone some_repo_with_packages|
|| spack repo add some_name some_repo_with_packages |

Once aliBuild is there and alidist has been cloned at least one, aliBuild is
ready to go.  While Spack can work also right after the clone of the spack core
and the clone of one (or more) recipe's repo, some configuration might need to
be done.

### Setup compiler(s)

Can be as simple as `spack compiler find` to detect available compilers or as 
"complex" as editing `~/.spack/[platform]/compilers.yaml` to specify compiler(s).

### Setup some paths (optional)

If the default root tree `location_of_spack_clone/opt/spack` is not to
your liking, then `~/.spack/config.yaml` must be edited to change it.

### Setup externals (optional)

If you want to pick packages from the system, `spack external find` and/or
 edit `~/.spack/packages.yaml` (and/or the `/.spack/[platform]/packages.yaml`

### Setup mirrors (optional for source, needed for binaries)

`spack mirror add some_name some_mirror_url`

For instance, to use my toy S3, that would be : 

```
spack mirror add aphecetche https://spack-aphecetche-mirror.eu-central-1.linodeobjects.com
```

## One off install

Get an idea of what will be done :
```
spack spec -I o2-aliceo2
```

Do it :
```
spack install o2-aliceo2
```

## Full stack installation

Get an environment file (either a yaml or even better a .lock one) and use that
to install.

## Developing packages

```
spack dev-build ...
spack develop ...
```

## Uploading binaries

For this the mirror url has to be changed to s3://something (is using s3 of course)

```
spack mirror add aphecetche s3://spack-aphecetche-mirror
```

need then proper credentials for AWS (either using env. variables or in ~/.aws/config)

Must setup a GPG private key to sign the binaries.

Then a single command line will upload `o2-aliceo2` and its dependencies : 

```spack buildcache create --rebuild-index -f -a -m aphecetche o2-aliceo2```

(that part can be long)

## Build in docker (TBD)

spack version of the docker test described in :

https://aliceo2group.github.io/quickstart/devel.html

using toy S3 linode buildcache for CentOS7

