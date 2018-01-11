+++
author = "Laurent Aphecetche"
date = "2018-01-11"
headline = ""
homebutton = true
printbutton = true
tags = ["talks","o2","mrrtf"]
title = "MCH Mapping Status"
theme = "simple"
center = true
controls = true
transition = "slide"
timeline = false
+++

## The Art Of The Spiral ...

![](/talk/2018-01-11-mrrtf-status/spiral-start.svg)

---

## Goal for mapping library

- Simple to use
- Fast (-er than current one, at least)
- Self-contained (i.e. no need to read in ASCII or OCDB files)
- [ Swappable implementation ]

---

## Detours

- [Boost test](http://www.boost.org/doc/libs/1_66_0/libs/test/doc/html/index.html),
    [TDD](https://www.amazon.fr/Modern-C-Programming-Test-Driven-Development/dp/1937785483/ref=sr_1_1?ie=UTF8&qid=1515660345&sr=8-1&keywords=c%2B%2B+test+driven+de)
- Modern CMake [<i class="fa fa-youtube-play" aria-hidden="true"></i>](https://www.youtube.com/watch?v=bsXLMQ6WgIk)
[<i class="fa fa-youtube-play" aria-hidden="true"></i>](https://www.youtube.com/watch?v=eC9-iRN2b04&t=2989s)
- [Google Benchmark](https://github.com/google/benchmark)
- [Boost Geometry Spatial Indices](http://www.boost.org/doc/libs/1_66_0/libs/geometry/doc/html/geometry/spatial_indexes.html)
- [Hourglass
    interfaces](https://github.com/CppCon/CppCon2014/tree/master/Presentations/Hourglass%20Interfaces%20for%20C%2B%2B%20APIs) [<i class="fa fa-youtube-play" aria-hidden="true"></i>](https://www.youtube.com/watch?v=PVYdHDm0q6Y)
- Two Implementations
- C++ Templates 
- Refactorings

---

## Reasons Behind Detours (1)

- Boost test, TDD 
    - code _must_ be testeable, no question here
- Modern CMake 
    - to understand how to deal properly with dependencies in vanilla CMake
- Google Benchmark
    - to learn how to (micro)benchmark code, as eventually we'll deal with performance... 

---

## Reasons Behind Detours (2)

- Boost Geometry Spatial Indices
    - to try not reinvent the algorithmic wheel 
- Hourglass interfaces
    - to offer clean library, easy to evolve, accessible to other languages
- Two Implementations
    - to get a fighting chance to have a good interface

---

## Reasons Behind Detours (3)

- C++ Templates
    - for performance
    - need(ed) a refresh as used to be a no-go in AliRoot
- Refactorings
    - safe with tests in place
    - is that even a detour btw ?

---

## Simplifications Or Complexifications

- Current (AliRoot) implementations differ for St12 and St345
    - different implementers, different times
    - but also different detectors
    - how much difference is justified ?

- Initial tests with Boost Geometry Indices show that maybe it's a good fit only for St12 ?

---

## The Norm And The Deviants

- "Regular" motif = (up to 64) _adjacent_ pads of _same_ size

- 210 motif types in total
    - but only 5 leading to non-regular motifs
    - localized in 2 (over 21) segmentation types

- Trying to avoid the minority of deviants to drive the implementation

---

## Current Status (finally...)

[alo](https://github.com/aphecetche/alo) branch "hourglass" for latest wip.

- Good : have a vs-aliroot **test** to check correctness of the implementations

- Good : have a vs-aliroot **bench** to check speed 

- (Almost) good : have a C-like interface (almost) defined 
 
- Bad : currently two incomplete implementations
    - impl1 is missing full channel access and is a template madness
    - impl2 is WIP (but promising ;-))

- Bad : I'm late

---

<!-- .slide: data-state="secondary-slide" -->
# Planning ...

---

## [JIRA "Agile" planning <i class="fa fa-calendar" aria-hidden="true"></i>](https://alice.its.cern.ch/jira/secure/RapidBoard.jspa?rapidView=242&projectKey=MRRTF&view=planning.nodetail&epics=visible)

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/mrrtf-jira.png)

---

## Reconstruction planning (1)

![](/talk/2017-11-09-alice-week-mrrtf-status/muon-reco-planning-1.png)

---

## Reconstruction planning (2)

![](/talk/2017-11-09-alice-week-mrrtf-status/muon-reco-planning-2.png)

---

## The Notion of Done

- Well underway is not the same as done...
- Done would be : in O2 repo, tests and documentation ready

---

## Integration

- should put what we have in AliceO2 repo 
- the sooner the better
- MID first ? 

---

## Next Hackathon

- @Subatech ?
- Would week 5 (Jan 30 - Feb 1) work ?

---

# <i class="fa fa-question" aria-hidden="true"></i> or <i class="fa fa-commenting" aria-hidden="true"></i> 

<!-- ### [Your Question Here] -->

---
<!-- .slide: data-state="secondary-slide" -->
# Backup

---

## Hourglass pattern

![](/talk/2018-01-11-mrrtf-status/hourglass.png)

---

### impl1 : find pad by (x,y) / [segtype] / [bending]

```
❯ ./benchSegmentation --benchmark_filter="(0|16)/(0|1)"
Run on (8 X 2800 MHz CPU s)
2018-01-11 11:32:18
---------------------------------------------------------------------------------------
Benchmark                                Time           CPU Iterations UserCounters...
---------------------------------------------------------------------------------------
BenchO2/hasPadByPosition/0/1          2000 us       1999 us        316 n=500.126k/s nin=428.108k/s
BenchO2/hasPadByPosition/0/0          2139 us       2139 us        320 n=467.447k/s nin=387.981k/s
BenchO2/hasPadByPosition/16/1          346 us        346 us       1881 n=2.88809M/s nin=2.80433M/s
BenchO2/hasPadByPosition/16/0          246 us        246 us       2791 n=4.05993M/s nin=3.95437M/s
BenchO2/hasPadByPosition/20/1          177 us        177 us       3934 n=5.65121M/s nin=5.65121M/s
BenchO2/hasPadByPosition/20/0          126 us        126 us       5234 n=7.9437M/s nin=7.9437M/s
BenchAliRoot/PadByPosition/0/1         353 us        353 us       1932 n=2.83682M/s nin=2.33754M/s
BenchAliRoot/PadByPosition/0/0        1611 us       1611 us        413 n=620.81k/s nin=516.514k/s
BenchAliRoot/PadByPosition/16/1        202 us        202 us       3287 n=4.94486M/s nin=4.7619M/s
BenchAliRoot/PadByPosition/16/0        172 us        172 us       3707 n=5.80993M/s nin=5.58334M/s
BenchAliRoot/PadByPosition/20/1        176 us        176 us       3471 n=5.68363M/s nin=5.68363M/s
BenchAliRoot/PadByPosition/20/0        156 us        156 us       4431 n=6.39301M/s nin=6.39301M/s
```

