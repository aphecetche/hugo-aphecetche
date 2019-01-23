+++
author = "Laurent Aphecetche"
tags = [ "talks", "mrrtf", "o2", "muon plenary" ]
headline = " "
homebutton = true
printbutton = true
theme = "lasimple"
center = false
controls = false
transition = "none"
timeline = false
code_theme = "tomorrow-night"
title = "MRRTF Status"
date = 2019-01-23
draft = false
footer = "L. Aphecetche | Muon Plenary MRRTF Status | Jan 23rd 2019"
d3 = "/talk/2019-01-23-muon-plenary-mrrtf-status/d3.js"
+++

## Next Steps
### (Sep, 26th 2018)


- MID workflow on FLP
- Basic MCH clustering workflow
- MCH digitization
- MID geometry in simulation

---
## Janv 2019 status

### Postponed
- MID workflow on FLP 
    - some missing bit and pieces to be finalized
- Basic MCH clustering workflow
    - priority shifted to (re)assessing the clustering situation

### Done
- MCH digitization : first basic version merged
- MID geometry in simulation : done

---

## Simulation

<div id="simulation-d3"></div>
<!-- .slide: data-state="d3" -->

- Progress shows _current_ O2 repo situation
- MID situation is actually _much_ better (both hit creation and digitization
 are not far from pull requests)
---

## Reconstruction

<div id="reconstruction-d3"></div>
<!-- .slide: data-state="d3" -->

- Not much in O2 repo for MCH reco
- But things are moving on dev (private) repos

---

## MCH clustering

- Still in heavy R&D phase
- Extracted reference data set (of Run2 clusters) from one PbPb run of 2015
- Some tooling prepared (e.g. to visualize the clusters)
- Some investigation on the speedup of Mathieson integral computation
- Establishing "unit" tests along the way (e.g. ~closure tests : generate charge distribution and fit them, check we get back original ones, or quantify residuals if any)

---

## Some links

- Playground repos for clustering : [galo](https://github.com/aphecetche/galo) (and [pigiron](https://github.com/aphecetche/pigiron))
- Clustering status given at [WP12/13 meeting end of november](https://indico.cern.ch/event/773211/) (slide >=10)
- [Ongoing MID work](https://github.com/dstocco/AliceO2/tree/midSimulation)

---

## Next Steps
### (Jan 23rd 2019)

- MID reco in O2 repo (short term, i.e. couple of weeks)
- MCH tracking (medium term ?)
- MCH clustering (long term, i.e. months probably)
- MCH QC ?

---

## Manpower

Hopefully better situation in 2019

- Michael entering the game 
- Philippe and Diego should have more time to work on Run3 software
- Andrea contributing to MCH QC (until summer)
