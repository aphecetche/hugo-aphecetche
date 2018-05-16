+++
title = "Ninja vs Make"
date = "2018-05-09T09:19:50+02:00"
lastmod = "2018-05-10"
description = ""
author = ""
tags = ["o2","build" ]
+++

When developing some code for O2 I noticed that the _recompilation_ time of the project were quite noticeable. 

While the total build time might also be a concern to be addressed at some point, I'm only considering here the  turn-around time. By turn-around I mean the unit development phase, i.e. you change a single file, run the build to see if it compiles and run, then do it again, and again...

Good thing is we are using a build system generator (CMake). While we are currently using its "Unix Makefiles" generator, it can as well generate [`Ninja`](https://Ninja-build.org) files. So let's try that and run some timings to see how much we can gain with `Ninja` with respect to `make`.

> All the tests below are made on a Mid 2014 2,8 GHz Intel Core i7 MacBook Pro under macOS 10.13.4 with Apple LLVM version 9.1.0.

## Total build time

The starting points are two build directories obtained using the following commands from the same source code (located in `$HOME/alice/o2-dev/O2` , commit `912810e785056edcc919472b16171e81d266079a`)

```
> time aliBuild -w ../sw -z time-make --defaults o2 build O2  
3556.49s user 4457.25s system 501% cpu 26:36.96 total
```

```    
> time CMAKE_GENERATOR=Ninja aliBuild -w ../sw -z time-ninja --defaults o2 build O2  
2980.51s user 1515.54s system 423% cpu 17:41.40 total
```

So a complete build takes 26 mins with `make` and 17 mins with `Ninja`. Not a huge win here, but some gain already.

## Recompilation after modifying one single `cxx` file

First modify an implementation file somewhere deep in the O2 tree. `make` is taking a "lot" of time figuring out what he's already done and then recompile that one file and its dependencies. `Ninja` on the other hand is going straight to recompile/relink what must be compiled/linked.

```
> touch $HOME/alice/o2-dev/O2/Detectors/MUON/MCH/Mapping/Impl3/src/SegmentationCreator.cxx
> time cmake --build $HOME/alice/sw/BUILD/O2-latest-time-make/O2 -- -j 8
43.72s user 18.18s system 633% cpu 9.769 total
```

```
> touch $HOME/alice/o2-dev/O2/Detectors/MUON/MCH/Mapping/Impl3/src/SegmentationCreator.cxx
> time cmake --build $HOME/alice/sw/BUILD/O2-latest-time-ninja/O2 -- -j 8
1.61s user 0.26s system 105% cpu 1.766 total
```

## No-op recompilation

Actually, just trying a build without changing anything already shows how `make` is behaving poorly, spending its time trying to figure out if there's something to do, while `Ninja` "knows" there's nothing to do :

```
cmake --build ~/alice/sw/BUILD/O2-latest-time-make/O2 -- -j 8
39.86s user 16.53s system 588% cpu 9.576 total
cmake --build ~/alice/sw/BUILD/O2-latest-time-ninja/O2 -- -j 8
 0.13s user 0.07s system 93% cpu 0.211 total
```

## Recompilation after changing a top-level include file

Now change an implementation file higher in the food chain which will trigger a lot more stuff to be done. Again, `Ninja` is the clear winner.

```
> touch $HOME/alice/o2-dev/O2/Detectors/Base/include/DetectorsBase/Detector.h
> time cmake --build $HOME/alice/sw/BUILD/o2-latest-time-make/O2 -- -j 8
200.81s user 40.54s system 508% cpu 47.469 total
```

```
> touch $HOME/alice/o2-dev/O2/Detectors/Base/include/DetectorsBase/Detector.h
> time cmake --build $HOME/alice/sw/BUILD/o2-latest-time-ninja/O2 -- -j 8
136.24s user 13.39s system 533% cpu 28.053 total
```

## Install or not install

While rebuilding things with `Ninja` is a lot faster, _installing_ is still a painfully slow step that should be avoided as much as possible when developing.

```
> time cmake --build $HOME/alice/sw/BUILD/o2-latest-time-ninja/O2 -- install
4.22s user 5.26s system 80% cpu 11.766 total
```

And it's also quite a bit slower with `make` (and even more so if not using parallelism) :

```
cmake --build $HOME/alice/sw/BUILD/o2-latest-time-make/O2 -- -j 8 install
42.91s user 21.02s system 313% cpu 20.379 total

cmake --build $HOME/alice/sw/BUILD/o2-latest-time-make/O2 -- -j 1 install
29.35s user 14.08s system 93% cpu 46.614 total
```

### DDS

```
> time aliBuild -w ../sw -z time-dds-make --defaults o2 build DDS
aliBuild -w ../sw -z time-dds-make --defaults o2 build DDS  591.12s user 56.93s system 266% cpu 4:03.10 total

❯ time CMAKE_GENERATOR=Ninja aliBuild -w ../sw -z time-dds-ninja --defaults o2 build DDS
not compiling due to a strange syntax (incorrect ?) in add_custom_target(wn_bin)
which would require a change...
```

### FairRoot

