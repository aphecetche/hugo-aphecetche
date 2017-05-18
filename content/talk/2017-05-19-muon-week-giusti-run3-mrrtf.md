+++
author = "Laurent Aphecetche"
date = "2017-05-19"
headline = ""
homebutton = true
printbutton = true
tags = ["talks","alice","o2","mrrtf"]
title = "Muon Week 2017  Run3 - MRRTF"
theme = "simple"
center = true
controls = true
transition = "slide"
timeline = true
+++


# Reminder of the problem at hand

+++

# Going from

## 8 kHz PbPb @ 1 kHz w/ triggers

+++

# To

## 50 kHz PbPb @ 50 kHz triggerless

+++

# Lots of data

## 3 TB/s <i class="fa fa-long-arrow-right" aria-hidden="true"></i> CRU
## 90 GB/s <i class="fa fa-long-arrow-right" aria-hidden="true"></i> <i class="fa fa-database" aria-hidden="true"></i>

+++

# Must fit in 

## Time budget : treat data fast
## Storage budget : compress data 

+++

# Alice (TPC) priority

## Data compression

+++

## Muon-only needs are more modest
## ~ few GB/s
## envision full online reco

---

# O2 Data Flow

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/alice-data-flow.png)

+++

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/alice-readout-block-diagram.png)

+++

# Frames everywhere

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/frames.png)

+++

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/heartbeats-cru-flp-epn.png)

+++

# ALFA

### Part of O2 is based on ALice FAir framework

- working unit is a **device**
- devices communicate through _messages_
- devices can be :
    - single or multi-core
    - on same machine or on different machines
    - in different languages

---

# General O2 news

+++

## Bye bye Computing Working Groups

+++

## Hello [Work Packages](https://docs.google.com/document/d/1D2U1xr1QNEaRiP3nezYcsrfti0cnBuDmjtHH_BRWFI4)

+++

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/O2-WPs-v3.5.png)

+++

## WPs <i class="fa fa-long-arrow-right" aria-hidden="true"></i>Institutional responsabilities

+++

## [<i class="fa fa-link" aria-hidden="true"></i>WP descriptions and planning](https://docs.google.com/document/d/1D2U1xr1QNEaRiP3nezYcsrfti0cnBuDmjtHH_BRWFI4)

- WP1 (data model) 
- WP3 (common tools and software infrastructure)
- WP4 (O2 software framework)
- WP11 (ALFA)
- **WP12 (detector simulation)**
- **WP13 (reconstruction and calibration)**

+++

## Also relevant for some of us

- _WP6_ (detector readout)
- _WP7_ (data quality control)
- _WP9_ (event display)
- WP10 (CCDB)
- WP14 (analysis framework and facilities)
- WP15 (data management)

+++

# O2 links

- [<i class="fa fa-book" aria-hidden="true"></i> TDR : Upgrade of the Online-Offline Computing System](https://cds.cern.ch/record/2011297)

- [<i class="fa fa-github" aria-hidden="true"></i> Code](https://github.com/AliceO2Group/AliceO2)

- [<i class="fa fa-bookmark" aria-hidden="true"></i> Web](https://alice-o2.web.cern.ch)

- [<i class="fa fa-calendar" aria-hidden="true"></i> Meetings]()
    - plenary 1/month
    - technical 1/month (alternate)
    - WPs meetings (1/1-2 weeks)

---

# MRRTF

+++

# Muon Run3 Reconstruction Task Force

+++

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

+++

# 1st priority 

## Reconstruction

+++

# 2nd priority 

## Simulation

+++

<div id="timeline"></div>
<!-- .slide: data-state="timeline" -->

+++

# Main issue so far is ... 

+++

# (wo)manpower

## <i class="fa fa-frown-o" aria-hidden="true"></i> how could you possibly guess ?

+++

## _Availability_ of manpower to be more precise

### We _do_ have volunteers <i class="fa fa-smile-o" aria-hidden="true"></i> 

### but some had little _free_ time so far

+++

# Net result being we're (almost) not moving

+++

# Remedies ? 

### 1 - Carve some time out for volunteers by finding other people to do part of their job

+++

### Example @ Subatech : trying to hire a post-doc focused on physics to free some time for permanent physicists

+++

# Remedies ?

### 2 - Hire some skilled people (PhD or otherwise) for a 2-3 years to do part of the job

## Easier said than done ?

---

# Some progress

### <i class="devicons devicons-go" aria-hidden="true"></i>[Go FairMQ device](http://talks.godoc.org/github.com/sbinet/talks/2017/20170331-alice-fer/talk.slide#1) 

#### ([March Alice Offline Week](https://indico.cern.ch/event/624025/), Sebastien)

Demonstrates FairMQ-like device can be written in a different (i.e. not C++) language

+++

# WIP

## [alo](https://gitpitch.com/mrrtf/alo)
## [sampa go](https://github.com/mrrtf/sampa)
## [mid occ](https://github.com/gabrielefronze/AliceO2/tree/my-dev-muon)

+++

## [mrrtf](https://mrrtf.github.io) "organization" [on <i class="fa fa-github" aria-hidden="true"></i>](https://github.com/mrrtf)

### host code before integration to AliceO2 repo

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/mrrtf-org.png)

+++

## [mrrtf on the <i class="fa fa-globe" aria-hidden="true"></i>](https://mrrtf.github.io)

### meant as an information tool for the team 

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/mrrtf-github-io.png)

+++

## [JIRA "Agile" planning <i class="fa fa-calendar" aria-hidden="true"></i>](https://alice.its.cern.ch/jira/secure/RapidBoard.jspa?rapidView=242&projectKey=MRRTF&view=planning.nodetail&epics=visible)

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/mrrtf-jira.png)

---

# <i class="fa fa-question" aria-hidden="true"></i> or <i class="fa fa-commenting" aria-hidden="true"></i> 

<!-- ### [Your Question Here] -->

---

# BACKUP

+++

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/cru-input-rates.png)

+++


[WP1](https://docs.google.com/document/d/1D2U1xr1QNEaRiP3nezYcsrfti0cnBuDmjtHH_BRWFI4/edit#heading=h.s1087skij9e8)

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/wp1.png)


+++


[WP2](https://docs.google.com/document/d/1D2U1xr1QNEaRiP3nezYcsrfti0cnBuDmjtHH_BRWFI4/edit#heading=h.s1087skij9e8)

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/wp2.png)

+++

[WP3](https://docs.google.com/document/d/1D2U1xr1QNEaRiP3nezYcsrfti0cnBuDmjtHH_BRWFI4/edit#heading=h.s1087skij9e8)

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/wp3.png)

+++


[WP4](https://docs.google.com/document/d/1D2U1xr1QNEaRiP3nezYcsrfti0cnBuDmjtHH_BRWFI4/edit#heading=h.s1087skij9e8)

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/wp4.png)

+++


[WP5](https://docs.google.com/document/d/1D2U1xr1QNEaRiP3nezYcsrfti0cnBuDmjtHH_BRWFI4/edit#heading=h.s1087skij9e8)

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/wp5.png)

+++


[WP6](https://docs.google.com/document/d/1D2U1xr1QNEaRiP3nezYcsrfti0cnBuDmjtHH_BRWFI4/edit#heading=h.s1087skij9e8)

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/wp6.png)

+++


[WP7](https://docs.google.com/document/d/1D2U1xr1QNEaRiP3nezYcsrfti0cnBuDmjtHH_BRWFI4/edit#heading=h.s1087skij9e8)

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/wp7.png)

+++


[WP8](https://docs.google.com/document/d/1D2U1xr1QNEaRiP3nezYcsrfti0cnBuDmjtHH_BRWFI4/edit#heading=h.s1087skij9e8)

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/wp8.png)

+++


[WP9](https://docs.google.com/document/d/1D2U1xr1QNEaRiP3nezYcsrfti0cnBuDmjtHH_BRWFI4/edit#heading=h.s1087skij9e8)

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/wp9.png)

+++


[WP10](https://docs.google.com/document/d/1D2U1xr1QNEaRiP3nezYcsrfti0cnBuDmjtHH_BRWFI4/edit#heading=h.s1087skij9e8)

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/wp10.png)

+++


[WP11](https://docs.google.com/document/d/1D2U1xr1QNEaRiP3nezYcsrfti0cnBuDmjtHH_BRWFI4/edit#heading=h.s1087skij9e8)

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/wp11.png)

+++


[WP12](https://docs.google.com/document/d/1D2U1xr1QNEaRiP3nezYcsrfti0cnBuDmjtHH_BRWFI4/edit#heading=h.s1087skij9e8)

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/wp12.png)

+++


[WP13](https://docs.google.com/document/d/1D2U1xr1QNEaRiP3nezYcsrfti0cnBuDmjtHH_BRWFI4/edit#heading=h.s1087skij9e8)

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/wp13.png)

+++


[WP14](https://docs.google.com/document/d/1D2U1xr1QNEaRiP3nezYcsrfti0cnBuDmjtHH_BRWFI4/edit#heading=h.s1087skij9e8)

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/wp14.png)

+++


[WP15](https://docs.google.com/document/d/1D2U1xr1QNEaRiP3nezYcsrfti0cnBuDmjtHH_BRWFI4/edit#heading=h.s1087skij9e8)

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/wp15.png)

+++


[WP16](https://docs.google.com/document/d/1D2U1xr1QNEaRiP3nezYcsrfti0cnBuDmjtHH_BRWFI4/edit#heading=h.s1087skij9e8)

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/wp16.png)


+++


[WP17](https://docs.google.com/document/d/1D2U1xr1QNEaRiP3nezYcsrfti0cnBuDmjtHH_BRWFI4/edit#heading=h.s1087skij9e8)

![](/talk/2017-05-19-muon-week-giusti-run3-mrrtf/wp17.png)
