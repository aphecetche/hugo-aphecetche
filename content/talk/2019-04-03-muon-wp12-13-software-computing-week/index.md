+++
author = "Laurent Aphecetche"
tags = [ "talks", "mrrtf" ]
headline = " "
homebutton = true
printbutton = true
theme = "lasimple"
center = true
controls = false
transition = "none"
timeline = false
code_theme = "tomorrow-night"
title = "MCH/MID Status"
date = 2019-04-03
draft = false
footer = "L. Aphecetche | MCH/MID Status | April 3rd 2019"
+++

### Simulation

---

### What is completed (or nearing completion)

|     |          |              |                                                                                 |
| --- | -------- | ------------ | ------------------------------------------------------------------------------- |
|     | geometry | hit creation | digitization                                                                    |
| MCH | ~final   | basic        | digit creation done                                                             |
|     |          |              | workflow done                                                                   |
|     |          |              | digit (& label) merging almost ready                                            |
|     |          |              | [discussed in Michael's repo for now](https://github.com/mwinn2/AliceO2/pull/5) |

---

### What is completed (or nearing completion)

|     |                            |              |                                        |
| --- | -------------------------- | ------------ | -------------------------------------- |
|     | geometry                   | hit creation | digitization                           |
| MID | ~final                     | done         | digit creation and merging done        |
|     | (last updated in March 19) |              | (but with "hard-coded" condition data) |
|     |                            |              | workflow done                          |

---

### What is still to be done

|     |                               |                              |                                               |
| --- | ----------------------------- | ---------------------------- | --------------------------------------------- |
|     | geometry                      | hit creation                 | digitization                                  |
| MCH | Run3 specifics                | mag. field and angle effects | resp. modification due to new electronics     |
|     | (flex and PCB thickness St12) |                              |                                               |
| MID |                               |                              | use HV, efficiency, response params from CCDB |

#### Both : (physics and computing) performance measurements.

---

## MID Reconstruction

- digit filtering : work done. Needs to be integrated to O2
- (pre+)clustering : done
- tracking : first version done. To be qualified (e.g. fake tracks)
- reconstruction workflow : work ~done. Needs to be integrated to O2

---

## MCH Clustering

#### No news

---

## MCH Tracking

- extrapolation tools : "cut and pasted" from AliRoot. In AliceO2 repo.
- track fitting : first version (extracted from AliRoot) in AliceO2 repo.
- track finding : adapted from AliRoot. Under dev. In private repo so far.

---

## Raw Data Decoder and MC2Raw

### MID

#### format ~defined. Coding should not be long.

### MCH

#### Format _not completely defined_

#### Discussion to be (re)started with MCH readout people to see what is / what will be done in CRU and what remains to be done in FLP.

---

## Time travel

Need more info ?

See MCH/MID/MFT O2 session _tomorrow_, during Muon Week in Cape Town

https://indico.cern.ch/event/796503/
