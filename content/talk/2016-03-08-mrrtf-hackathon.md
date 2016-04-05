+++
author = "Laurent Aphecetche"
date = "2016-03-08T09:00:00+02:00"
description = ""
tags = [ "mrrtf","hackathon","alice","o2","coding" ]
title = "Muon Run3 Reconstruction Task Force"
headline = "Let's start at last !"
controls = false
progress = true
slidenumbers = true
homebutton = true
printbutton = true
+++

# Agenda

Tuesday (today)

- Introduction (this talk)
- Set personal goals
- Go for it = Coding and chatting (direct and/or Slack)

Wednesday

- Coding
- (14h00) Presentations about the readouts of MCH and MID
- Chatting and coding

Thursday

- Coding and closing

---
# Communication

Language for presentations and (Slack) discussions with remote = _english_

Local live discussions can be done in _french_ if that's easier / more natural to people

The only constraint is that we understand each others...

---
# Reminder of the context

In Run III, Alice will (mainly) becomes trigger-less and acquire MB Pb-Pb collisions at 50 kHz (instead of ~1 kHz currently). Input data to the readout will be huge (1-7 TB/s), and has to be reduced, online, to a more manageable value of 90 GB/s to disk (and 20 GB/s to T0).

This _data reduction_ is the top priority of the Run III reconstruction, Alice-wide.

For the muon detectors specifically the numbers are (much) smaller :

- input to read out ~ few GB/s
- output of EPN ~ same order (unless we drop the pad information completely)

So we can hope to actually perform _more than a mere data reduction_, i.e. do a _full reconstruction_ with _physics-grade quality_. That's what this group is supposed to deliver at some point.

---
# The scope(s)

- detector specific FEE + RO : not directly our concern (as far as writing code goes, anyway)

  - But certainly good to know how it will work (cf. wednesday afternoon session)

- Common Readout Unit (CRU) : the entrance door to O2

- First Level Processor (FLP) : hosting CRUs, that's where the detector data is coming from.
The FLP generates the (Sub)TimeFrames, containing data about one part of a detector only.

- Event Processor Node (EPN) : where the SubTimeFrames are collected to build a complete (all detectors) TimeFrame.

---
# O2 interfaces

![o2 detector readout interfaces](/talk/2016-03-08-mrrtf-hackathon/detector-readout-o2-interfaces.png)
---
# O2 Chain : synchronous part

![o2 synchronous part](/talk/2016-03-08-mrrtf-hackathon/o2-chain-part-1.png)

---
# O2 Chain : asynchronous part

![o2 asynchronous part](/talk/2016-03-08-mrrtf-hackathon/o2-chain-part-2.png)

---
# O2 Hardware

![o2 hardware facility](/talk/2016-03-08-mrrtf-hackathon/o2-hardware.png)

---
# The building blocks

- AliceO2 : [https://github.com/AliceO2Group/AliceO2](https://github.com/AliceO2Group/AliceO2)

  - in particular dir devices/aliceHLTwrapper

- FairRoot : [https://github.com/FairRootGroup/FairRoot/tree/dev](https://github.com/FairRootGroup/FairRoot/tree/dev)

  - in particular dir fairmq

- HLT/AliRoot : [https://github.com/FairRootGroup/FairSoft/tree/dev](https://github.com/FairRootGroup/FairSoft/tree/dev)

  - in particular dir HLT/MUON

---
# FairMQ

While it's true that Alfa is still in development the transport layer is and will be FairMQ.

Moreover there is an existing `aliceHLTwrapper` device that can run any HLT component as a FairMQDevice...

---
# O2 milestones 2016
![o2 milestones 2016](/talk/2016-03-08-mrrtf-hackathon/o2-milestones-2016.png)
---
# O2 milestones 2016-2018

![o2 milestones 2016-2018](/talk/2016-03-08-mrrtf-hackathon/o2-milestones.png)

---
# The Muon reconstruction chain

- raw data decoding
- raw data filtering
- (MCH) pre-clustering
- (MCH) clustering
- (MCH) tracking
- (MID) tracking (*)
- MCH-MID matching

(*) fallback solution (~reproducing current MTR behavior) if we must be able to drop full events

(Reminder of [MRRTF Kickoff meeting](https://indico.cern.ch/event/342718/session/0/attachments/673655/925797/MRTF-Kickoff-14-Oct-2014.pdf))

---
# The Muon reconstruction main "objects"

- raw data decoding -> RAW
- raw data filtering -> DIGITS
- (MCH) pre-clustering -> (PRE)CLUSTERS
- (MCH) clustering -> CLUSTERS
- (MCH) tracking -> TRACKS
- (MID) tracking -> TRACKLETS ?
- MCH-MID matching

Plus global O2 "objects", e.g. the most important TimeFrame

---
# Event vs Time Frame

In Run I, II the basic "data blocks" were about events

In Run III what will transit between tasks will be "Time Frames"

Nominal TimeFrame duration is 20ms (i.e. 1000 events)

---
# The Muon reconstruction condition data (and their sources)

Fixed

- mapping
- baseline geometry
- magnetic field

Varying

- alignment (tracks, EPN)
- MID scalers and masks (FLP)
- MCH occupancies (FLP)
- High and low voltages (DCS)
- readout configuration (?)

No longer needs MCH pedestals or gains for instance

---
# Data structures

- blocks in HLT parlance
- messages in FairMQ

As far as transport frameworks are concerned, what travels on the wires is up to the user.

i.e. serializing your objects to bare blobs (messages) is your responsability.

FairMQ does offer though support for several serialization frameworks (pro and cons of each being investigated in CWG13).

HLT does offer Root serialization but does not recommend it (was proven to be a severe slowing factor)

Efficient data structures are key to success

---
# Testing

Testing must be built into the system from the get-go

Immediate needs :

- get/generate/distribute some (realistic) input data

Probably requires to agree on some (even preliminary) data format(s) for the main objects

- a small (but bigger than a single laptop) testing cluster and instructions on how to use it

---
# Get input data

We do have on SAF the filtered raw data for 2 long LHC11h runs : 169099 (77 GB, 4k files) and 170387 (374 GB, 19k files)

Part of the run 169099 (932 MinBias events, 42 MBytes) was converted into a MCH digits file (Root format) for the preclustering studies.

More can be produced if needed. Code for that (undocumented so far) is in AliRoot (feature-muon-hlt branch) MUON/MUONo2 directory.

Should the same be done for MID ?

---
# Run 2,5

Any improvement to the current chain (as a by-product of a Run III intent) is of course welcome !

Examples :

- identification and removal of dead code (reco QA, gains, ...) : would ease to see what's to be ported to Run III)
- speedup of the Mathieson
- re-think our output(s), in particular in an AOD-only world
- error handling (e.g. how to account for clustering and tracking aborts)
- other ideas ?

---
# Your mission

- pick a reasonable goal
- implement something about it in those 3 days
- document it, commit/publish it

Don't fret about brilliant/final designs. Just get something to play with. Will be refined/re-written/trashed later on.

Alternatively, use those 3 days only to get in the (O2) zone by reading/trying examples of ZeroMQ/FairMQ/TBB/HLT/c++11/14/whatever...

Anyway, please try to stay focused on O2 business.

---
# Possible ideas

- setup a tutorial for running a (plain) HLT chain on the test cluster
- setup a tutorial on AliceO2 soft. dev. best practices
- attack the MCH mapping data structure
- setup a basic HLT chain (1 source + 1 processor + 1 sink) to develop your component(s)
- same as above but using FairMQDevices
- get a FairMQ chain with several instances of the same processor (on the same machine, on different ones)
- get a FairMQ chain configured with [DDS](https://github.com/FairRootGroup/DDS)
- get a FairMQ device with internal parallelism

---
# Various skills

We all have a different knowledge base.

Not knowing something is not a bug, it's a feature ;-)

Not asking about it *is* a bug though...

We also have different ways of working.

I'm counting on the engineers to limit the entropy physicists tend to generate ;-) and to share more efficient ways to work

---
# Some reference material

- [TDR : Upgrade of the Online-Offline Computing System (O2)](https://cds.cern.ch/record/2011297)
- [TDR : Upgrade of the ALICE Readout & Trigger System](http://cds.cern.ch/record/1603472)
- [HLT Tutorial](https://indico.cern.ch/event/279723/)
- [O2 Status and Plans (Dec. 2015)](https://indico.cern.ch/event/452733/session/4/contribution/23)
- [ALFA Framework Status (Dec. 2015)](https://indico.cern.ch/event/452733/session/4/contribution/25)
