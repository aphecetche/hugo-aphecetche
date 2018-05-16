+++
title = "Build Times in Docker Containers"
date = "2018-05-16T21:40:09+02:00"
description = ""
author = ""
tags = [ "docker","build","shake","geek"]
+++

Out of curiosity (and also to try to optimize my workflow), I made a few tests to try to assess what kind of performance hit I'm accepting when building code within a (linux) container on my Mac using `Docker for Mac`. Docker is very convenient for development, but the disk access of Mac directories within the Docker VM is not exactly speedy...

As I was playing at the same time with O2 build times for other reasons, the test is done using O2 built by the build system [shake](https://shakebuild.com). Shake has a very nice (and inspect-able) report of the build times, which is not really needed here, but hey, that's cool.

In each case I compile a fresh O2 directory (after the proper [cmake configuration](https://github.com/aphecetche/scripts/blob/master/cmake/cmake-configure-o2.sh) for Ninja) using `shake -j4 --profile`. `-j4` as that's the maximum number of cores I allow in Docker for Mac.

Different variations of where the input (source code) and output (build artifacts) data are stored are explored :

1. reference case is the non-Docker build, i.e. _everything on the Mac_ : the source code, the compilation/linking processes and the build directory for the output.
1. source code on the Mac (bind mounted in the container), build in a [centos7 container](https://github.com/aphecetche/docker-alice-dev), and output within a docker volume (i.e. the output data stays in the Linux VM).
1. source code on the Mac (bind mounted in the container), but mounted using the `cached` mount option, other things as above
1. source code copied within a volume first (using the [`darchive2volume` command](https://github.com/aphecetche/scripts/blob/master/docker/darchive2volume)), and that volume mounted in the container. Other things as above. That's the _everything within the Linux VM_ case

Note that I've not tried to store both the input and the output on the Mac : I only expect that case to be the worst of all ;-) 


> Complete results are linked below, but the conclusions are that a)
the cached mount option is pretty effective
b) the build in a container is still twice slower than native one (don't quite understand why)


| mac | input on mac | input on mac with cached option | input in volume |
|:-----:|:---:|:---:|:---:|
| [7 minutes](/post/build-times-in-docker/shake-report-mac-native.html) | [19 minutes](/post/build-times-in-docker/shake-report-docker-centos7-source-on-mac-xcheck.html) | [13 minutes](/post/build-times-in-docker/shake-report-docker-centos7-source-on-mac-cached.html) | [12 minutes](/post/build-times-in-docker/shake-report-docker-centos7-source-in-a-volume.html) |



