+++
author = "Laurent Aphecetche"
date = "2016-05-27T11:15:00"
tags = [ "mrrtf", "talks","alice","o2" ]
title = "Muon Week 2016 : Offline Status and Plans"
headline = "Run2 and Run3"
homebutton = true
printbutton = true
+++

<!-- .slide: data-state="secondary-slide" -->
# Run2

---

<!-- .slide: data-background-image="background-2.png" -->
# Run2 developments


See master JIRA ticket [ALIROOT-6564 : Muon 2016 reconstruction readiness](https://alice.its.cern.ch/jira/browse/ALIROOT-6564)

- [ALIROOT-6562](https://alice.its.cern.ch/jira/browse/ALIROOT-6564) Add MCH LV values to OCDB

- [ALIROOT-6563](https://alice.its.cern.ch/jira/browse/ALIROOT-6563) Add ClusteringAbort and TrackingAbort flags to the Muon ESD/AOD

- [ALIROOT-6615](https://alice.its.cern.ch/jira/browse/ALIROOT-6615) Reset MUON/Calib/RejectList in RAW OCDB 2016

- [ALIROOT-6599](https://alice.its.cern.ch/jira/browse/ALIROOT-6599) Remove unused OCDB objects
    - not started (but clearly not critical, more a spring cleaning issue)

- [ALIROOT-6561](https://alice.its.cern.ch/jira/browse/ALIROOT-6561) Flag the MUON/Calib/HV OCDB object as already patched for St12 
    - done

- MTR efficiencies (to be able to get their effect in simulations)

- Remove in-reco-QA

---
# Add MCH LV values to OCDB

<!-- .slide: data-background-image="background-2.png" -->

The issue :

- some LVPS were unstable end of 2015. LV trips could not be accounted for _automatically_ offline as the LV
    information is missing from OCDB

The solution :

- get low voltages stored in the OCDB, like the HV, so we can kill offline the detection elements that suffer from LV trips. 

The status :

- setup of the transfert from DCS archive to OCDB (via Shuttle) was quite an epic story but finally succeeded this thursday... 
- next step (TBD) is to test the rejection based on LV trips on reconstruction.

Fallback :

- remove runs with LV trips from the good run list
- that's the current situation actually

---
<!-- .slide: data-background-image="background-2.png" -->

# Add ClusteringAbort and TrackingAbort flags to the Muon ESD/AOD

The issue :

- for some events the clustering (or the tracking) is aborting for some reason (e.g. too many pads hit)
- we don't flag those events so we don't easily get an handle on them

The solution :

- flag the aborted events at ESD/AOD level so they can be studied / rejected later on

The status :

- not started

Fallback : 

- check with the reconstruction logs that the integrated fraction of affected events is small 
- close our eyes

---
<!-- .slide: data-background-image="background-2.png" -->
# Remove in-reco-qa

The issue :

- the QA-that-runs-within-AliReconstruction (not the one running on ESDs and giving us the runlists for analysis...) is no longer maintained 

The solution :

- amputate the related parts of our code from the repo.

The status :

- Currently some DQM agents rely on some QA classes
- So first the custom DQM agents for both MCH and MTR to be ready :
    - MCH is almost OK (though some testing still to be done)
    - MTR not quite ?

Fallback :

- continue as now to use non-maintained-and-poorly-written code

---
<!-- .slide: data-background-image="background-2.png" -->
# EVE updates 

As part of the EVE development for Run2 and Run3, Jeremi set up a table(["Run3 EVE
readiness"](https://docs.google.com/spreadsheets/d/14ZOmIrxn5UPbdUMRKz9aU5KYfYQcQGUILUxNVYzxvQI/edit#gid=0)) to follow the progress.

So far we are green.

<img src="/talk/2016-05-27-run2-run3-muon-offline-for-muon-week-pornichet/eve-table.png" width="900px"/>

---
<!-- .slide: data-state="secondary-slide" -->

# Run3

---
<!-- .slide: data-background-image="background-3.png" -->

# Reminder of the context

In Run III, Alice will (mainly) becomes trigger-less and acquire MB Pb-Pb collisions at 50 kHz (instead of ~1 kHz currently). Input data to the readout will be huge (1-7 TB/s), and has to be reduced, online, to a more manageable value of 90 GB/s to disk (and 20 GB/s to T0).

This _data reduction_ is the top priority of the Run III reconstruction, Alice-wide.

For the muon detectors specifically the numbers are (much) smaller :

- input to read out ~ few GB/s
- output of EPN ~ same order (unless we drop the pad information completely)

So we can hope to actually perform _more than a mere data reduction_, i.e. do a _full reconstruction_ with _physics-grade quality_. That's what this group is supposed to deliver at some point.

---
<!-- .slide: data-background-image="background-3.png" -->

# Muon Run3 Reconstruction Task Force 

a.k.a. MRRTF

To tackle the issue, a "task force" was setup end of 2014...

- Wrote a ["self-assigned" mandate](https://twiki.cern.ch/twiki/pub/ALICE/Run3MuonReconstructionTaskForce/mrtf.pdf) beginning of 2014 and started a [twiki](https://twiki.cern.ch/twiki/bin/view/ALICE/Run3MuonReconstructionTaskForce)

- [Kickoff meeting](https://indico.cern.ch/event/342718/) in oct 2014

- Nothing happened then for about a year

- Then tried to setup (bi) monthly meetings. 

- Made a [3 days hackathon](https://indico.cern.ch/event/503464/) in Subatech in march this year.

---
<!-- .slide: data-background-image="background-3.png" -->

<img src="snails.png" width="980px" />

---
<!-- .slide: data-background-image="background-3.png" -->

# Moving the snail(s)

Things are starting to move, but still quite slowly.


Conclusion I : team was set up way too early

Conclusion II : hard to get _available_ (wo)man power for the job (i.e. there's always more pressing issues than Run3 stuff)

Conclusion III : there are lots of things to learn, so slow start might actually not be _too_ worrysome...

---
<!-- .slide: data-background-image="background-3.png" -->
# Reconstruction chain "big picture view"

<img src="flowchart-cru-flp-epn-mch-mid.png" height="650px" />


---
<!-- .slide: data-background-image="background-3.png" -->
# Reconstruction chain status...

<img src="flowchart-cru-flp-epn-mch-mid-with-status.png" height="650px" />

---
<!-- .slide: data-background-image="background-3.png" -->

# Achieved so far

- [Play with AliceHLTWrapper](https://github.com/aphecetche/AliceO2/tree/muon-hltwrapper-basic-test/muon/hltwrapper)

- [Toy device in Go](https://github.com/FairRootGroup/FairRoot/tree/dev/examples/advanced/GoTutorial)

- Speedup of 100x for MCH preclustering stage

- Ability to stage filtered raw data (on SAF), i.e. keep only muon information in raw data chunks. 
    - not limited (nor driven by, originally...) to Run3, but quite usefull
    - e.g. two _full_ PbPb runs from 2011 are available on SAF

---
<!-- .slide: data-background-image="background-3.png" -->

# Some pointers...

... if you are interested, for your own personal use or because you want to join the game...


- [TDR : Upgrade of the Online-Offline Computing System (O2)](https://cds.cern.ch/record/2011297)

- [TDR : Upgrade of the ALICE Readout & Trigger System](http://cds.cern.ch/record/1603472)

- [HLT Tutorial](https://indico.cern.ch/event/279723/)

- [O2 Status and Plans (Dec. 2015)](https://indico.cern.ch/event/452733/session/4/contribution/23)

- [ALFA Framework Status (Dec. 2015)](https://indico.cern.ch/event/452733/session/4/contribution/25)

    <!-- 
[Relative memory access speed](http://www.overbyte.com.au/misc/Lesson3/CacheFun.html) -->

<!-- [Interactive latencies](http://www.eecs.berkeley.edu/~rcs/research/interactive_latency.html) -->

---

<!-- .slide: data-state="secondary-slide" -->
# Backup

---

# Playing with the MCH filtering stage

<img src="digit-inspector.png" height="650px" />

