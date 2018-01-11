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

---
## [alo](https://github.com/aphecetche/alo)

![](/talk/2018-01-11-mrrtf-status/github-alo.png)


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
- [Hourglass interfaces](https://www.youtube.com/watch?v=PVYdHDm0q6Y)
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

- Identified clearly the norm and the deviants in motif
    - regular motif = adjacent pads of same size
    - 210 motif types, but only 5 leading to non-regular motifs
    - split the non-regular -> 215 regular motif types

- Trying to avoid the minority of deviants to drive the implementation

---

## Current Status (finally...)

- Good : have a `vsaliroot` test to check correctness of the implementations

- Good : have a `vsaliroot` bench to check speed 

- (Almost) good : have a C-like interface (almost) defined 
 
- Bad : currently two incomplete implementations
    - impl1 is missing full channel access 
    - impl2 is WIP

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

