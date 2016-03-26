---
layout: post
title : ALIROOT 6402 bug
date: 2015-11-09
aliases:
    - /ALIROOT-6402/
    - /test-old-name/
---
		
This bug is about the runs and reconstruction passes affected by the double remapping of the St1 HV DCS aliases. See details in [this Jira ticket](https://alice.its.cern.ch/jira/browse/ALIROOT-6402)

## LHC12hi

Most of the runs potentially affected (because of a HV sector -the one closest to the beam- of DE202 that is at 1400 V < 1590 V). But the OCDB was [manually changed](https://alice.its.cern.ch/jira/browse/ALIROOT-4805) at the time so the PatchSt1DCSAliases was not applied, hence no problem ;-)

| Pass | AliRoot version | approx. reco date | affected |
|:-----:|:------------------:|:--------------------:|:---------:|
| pass2 | v5-05-Rev-30 | apr '15 | yes (but OCDB was patched, so no) |
| muon_calo_pass2 | v5-04-Rev-08 | oct '13 | no |

## LHC13d

Only 1 run affected : 195767, because, again, of DE202 which had a voltage below nominal (1400 instead of 1600 V). Still the efficiency is not zero in this region (see below the recpoints map, built with a special reconstruction pass on SAF3 without any cut on the chamber 2 HV values), but the resolution should be pretty poor.

![rec point map of chamber 2 for run 195767](/images/ALIROOT-6402/cluster-pos-chamber2.png)

| Pass | AliRoot version | approx. reco date | affected |
|:-----:|:------------------:|:--------------------:|:---------:|
| pass4 | v5-05-Rev-32-01 | july '15 | yes |
| pass2 | v5-03-Rev-28 | jun '13 | no |
| mtrg_full | v5-03-Rev-18| mar '13 | no |
| muon_pass2 | v5-03-Rev-18| mar '13 | no |

To confirm the affected versions, tried the recontruction of two chunks of this run, which gives, in the affected pass, a different number of bad pads (to find out, just grep "human" in the rec.log)
By looking at the output of the grep command we find two suitable chunks :

	/alice/data/2013/LHC13d/000195767//pass4/13000195767000.10/rec.log:According to mask 400be9b (human readable form below) 112848 pads are bad (over a total of 1064008, i.e.   10.61 %)
	/alice/data/2013/LHC13d/000195767//pass4/13000195767000.16/rec.log:According to mask 400be9b (human readable form below) 116688 pads are bad (over a total of 1064008, i.e.   10.97 %)

Btw, to find the number of different cases we have :

	find /alice/data/2013/LHC13d/000195767/ -type f -name rec.log | xargs grep -i human > tata
	cut -d ' ' -f 9 tata | sort -u
	112848
	116688

(i.e. two different cases for the 1243 reco logs we have for this run)

## LHC15g-l

All the pp periods before the bug was fixed are affected, so basically all of LHC15a-l. The first version with the fix is AliRoot v5-07-06 :

	git tag --contains e2d1ec0
	v5-07-06
	v5-07-07
	v5-07-08
	etc...

The lists of runs potentially affected are below. Potentially affected means there was a non-nominal HV for one of the HV sector (in St1) for which the DCS alias remapping was performed.

[List of tested runs for LHC15g](/files/ALIROOT-6402/checkhv6402.lhc15g.txt)

[List of tested runs for LHC15h](/files/ALIROOT-6402/checkhv6402.lhc15h.txt)

[List of tested runs for LHC15i](/files/ALIROOT-6402/checkhv6402.lhc15i.txt)

[List of tested runs for LHC15j](/files/ALIROOT-6402/checkhv6402.lhc15j.txt)

[List of tested runs for LHC15k](/files/ALIROOT-6402/checkhv6402.lhc15k.txt)

[List of tested runs for LHC15l](/files/ALIROOT-6402/checkhv6402.lhc15l.txt)
