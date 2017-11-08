+++
author = "Laurent Aphecetche"
date = "2017-11-09"
headline = ""
homebutton = true
printbutton = true
tags = ["talks","alice","o2","mrrtf"]
title = "Planning for Muon sim/reco"
theme = "simple"
center = true
controls = true
transition = "slide"
timeline = true
+++

## Muon Run3 Reconstruction Task Force

A group of Muon (MCH+MID) people tasked to write the Run3 reconstruction software, fitting the :

- time budget (_aka_ treat data fast)
- storage budget (_aka_ compress data)

---

### 1st priority

## Reconstruction

### 2nd priority

## Simulation

---

<div id="timeline"></div>
<!-- .slide: data-state="timeline" -->

---

## Hackathons

- 2/3 days of coding within the same room
- 5 so far (1 virtual)
- (too) often « Groundhog Day » for full stack installation
- playing with FairMQ devices and/or aliceHLTwrapper
- somewhat weak throughput
- but at least a sure way to have people working on Run3 during some time <i class="fa fa-smile-o" aria-hidden="true"></i>

---

## <i class="fa fa-users" aria-hidden="true"></i> Current cast

<ul style="list-style:none">
<li> Diego <i class="devicons devicons-ionic" aria-hidden="true"></i> <div class="w3-dark-grey w3-xlarge"><div class="w3-container w3-blue" style="width:30%">30%</div></div></li>
<li> Gabriele <i class="fa fa-graduation-cap" aria-hidden="true"></i> <div class="w3-dark-grey w3-xlarge"><div class="w3-container w3-blue" style="width:40%">40%</div></div></li>
<li> Laurent <i class="devicons devicons-ionic" aria-hidden="true"></i> <div class="w3-dark-grey w3-xlarge"><div class="w3-container w3-blue" style="width:60%">60%</div></div></li>
<li> Philippe <i class="devicons devicons-ionic" aria-hidden="true"></i> <div class="w3-dark-grey w3-xlarge"><div class="w3-container w3-blue" style="width:20%">20%</div></div></li>
</ul>

<ul style="list-style:none">
<li> Hugo <i class="devicons devicons-ionic" aria-hidden="true"></i> <div class="w3-dark-grey w3-xlarge"><div class="w3-container w3-blue" style="width:30%">30%</div></div></li>
</ul>

<ul style="list-style:none">
<li>Ivana <i class="fa fa-cogs" aria-hidden="true"></i> <div class="w3-dark-grey w3-xlarge"><div class="w3-container w3-blue" style="width:20%">20%</div></div></li>
</ul>

<ul style="list-style:none">
<li> Bogdan <i class="fa fa-cogs" aria-hidden="true"></i> <div class="w3-dark-grey w3-xlarge"><div class="w3-container w3-blue" style="width:20%">20%</div></div> </li>
<li> Sebastien <i class="fa fa-cogs" aria-hidden="true"></i> <i class="devicons devicons-go" aria-hidden="true"></i> <div class="w3-dark-grey w3-xlarge"><div class="w3-container w3-blue" style="width:30%">30%</div></div></li>
</ul>

<ul style="list-style:none">
<li> Sean <i class="fa fa-graduation-cap" aria-hidden="true"></i> <i class="fa fa-cogs" aria-hidden="true"></i>  <div class="w3-dark-grey w3-xlarge"><div class="w3-container w3-blue" style="width:40%">40%</div></div></li>
</ul>

...FTE numbers are just wishes for the moment...

---

## [mrrtf](https://mrrtf.github.io) "organization" [on <i class="fa fa-github" aria-hidden="true"></i>](https://github.com/mrrtf)

### host code before integration to AliceO2 repo

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/mrrtf-org.png)

---

## [mrrtf on the <i class="fa fa-globe" aria-hidden="true"></i>](https://mrrtf.github.io)

meant as an information tool for the team 

![](/talk/2017-11-09-alice-week-mrrtf-status/mrrtf-github-io.png)

---

## [alo](https://github.com/aphecetche/alo)

![](/talk/2017-11-09-alice-week-mrrtf-status/alo.png)

---

## [JIRA "Agile" planning <i class="fa fa-calendar" aria-hidden="true"></i>](https://alice.its.cern.ch/jira/secure/RapidBoard.jspa?rapidView=242&projectKey=MRRTF&view=planning.nodetail&epics=visible)

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/mrrtf-jira.png)

---

## Simulation. Starting next year only.

![](/talk/2017-11-09-alice-week-mrrtf-status/muon-sim-planning.png)

---

## Reconstruction planning

![](/talk/2017-11-09-alice-week-mrrtf-status/muon-reco-planning.png)

---


## Reconstruction planning (1)

![](/talk/2017-11-09-alice-week-mrrtf-status/muon-reco-planning-1.png)

---

## Reconstruction planning (2)

![](/talk/2017-11-09-alice-week-mrrtf-status/muon-reco-planning-2.png)

---

## Caveats

- Well underway is not the same as done...
- Done would be : in O2 repo, tests and documentation ready

---

## To Go or Not To Go

### <i class="devicons devicons-go" aria-hidden="true"></i>[Go FairMQ device](http://talks.godoc.org/github.com/sbinet/talks/2017/20170331-alice-fer/talk.slide#1) 

#### ([March Alice Offline Week](https://indico.cern.ch/event/624025/), Sebastien)

Demonstrates FairMQ-like device can be written in a different (i.e. not C++) language


---


initial <i class="fa fa-lightbulb-o" aria-hidden="true"></i> : use a "simple" (at least simpler than C++) language with built-in concurrency from the get-go to enter the
concurrency world more easily, with a fresh mindset


did not really realized _so far_, unfortunately, due to other constrains


still like the idea though

---

# <i class="fa fa-question" aria-hidden="true"></i> or <i class="fa fa-commenting" aria-hidden="true"></i> 

<!-- ### [Your Question Here] -->

