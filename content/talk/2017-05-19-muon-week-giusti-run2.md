+++
author = "Laurent Aphecetche"
date = "2017-05-19"
headline = "News"
homebutton = true
printbutton = true
tags = ["talks","alice","offline","run2"]
title = "Muon Week 2017 - Run2 Computing"
theme = "simple"
center = true
controls = true
transition = "slide"
+++

# [<i class="fa fa-ticket" aria-hidden="true"></i> ALIROOT-6564](https://alice.its.cern.ch/jira/browse/ALIROOT-6564)

![](/talk/2017-05-19-muon-week-giusti-run2/jira-6564.png)

---

# LV

- Bring the treatment at the same level as the one from HV
- if there is a LV trip during a run, kill the affected channels for the _whole run_
- code is there (since october last year)
- **not** activated yet (matter of uploading a new recoparam OCDB object)
- should we do it now ? yes : no objections ?

---

## HV : the 1400 syndrom

![](/talk/2017-05-19-muon-week-giusti-run2/chamber03left-quad2sect1-run260751.png)

+++

- Current HV algorithm _clean-up_ the giant fluctuation around 1400 
- is then left with 1 perfectly fine HV value
- channel declared good for offline
- which is obviously wrong

+++

- need to change the algorithm
- **without** affecting the rest of the channels
- work started but not completed yet

+++

- current idea is to compute the fraction of time a channel is below working voltage
- then set a threshold on that fraction

---

# Config

- Config = set of active buspatches
- Buspatches can now be removed "on-the-fly" during a run by the MCH OnCall (See Vincent's talk)
- Like HV or LV, a buspatch removed for any length of time during a run will be killed for the full run
- i.e. we stay with (no more than) _one_ config per run

+++

- change of config is currently **not** transmitted to OCDB for each run
- but only at next pedestal runs
- will be fixed

---

# Not done yet and probably never

- flag(s) to know, at ESD level, if an event reconstruction was **aborted**
    - we lived w/o them so far, probably can til end of Run2 as well...
- remove unused OCDB objects
    - would be clean but not really needed actually

---

# Priority is now Run3

- only **critical** bugs will be fixed for Run2
- if workaround exist, use that instead of invest time in developping a proper fix
    - example of DQM MCH agent to be restarted when config changes a lot


---

# Communication

- Private emails are inefficient (for both the sender and the receiver)
    - sender can not get a timely answer if receiver not available
    - receiver might have to answer several time the same questions

+++

Please use mailing list(s) and/or JIRA for bug reports and questions

e.g. alice-dimuon-offline@cern.ch or alice-dimuon-pwg3@cern.ch

---


## [Your question here]
