---
title: Adding LV values to the reconstruction
tags: [ "DCS","LV","aliroot" ]
date: "2016-03-20"
lastmod : "2016-09-20"
jira: [ "ALIROOT-6590","ALIDCS-540" ]
---

## Mapping

The LV DCS mapping was not foreseen in the MCH mapping, so this is something that has to be added now.

LV channels belong to groups. Each group has 3 voltages : -2.5, 2.5 and 3.3 Volts. Note that the DCS values themselves are always positive (i.e 2.5 , 2.5, 3.3 Volts for the 3 groups).

The DCS aliases do have the form :

> note that alias naming changed on April 4th (just adding .MeasurementSenseVoltage at
the end of the names)...


```
// St 1-2 have 4 LV groups

MchHvLvLeft/Chamber[01..10]Left/Group[1..4]dig.MeasurementSenseVoltage
MchHvLvLeft/Chamber[01..10]Left/Group[1..4]ann.MeasurementSenseVoltage
MchHvLvLeft/Chamber[01..10]Left/Group[1..4]anp.MeasurementSenseVoltage
MchHvLvRight/Chamber[01..10]Right/Group[1..4]dig.MeasurementSenseVoltage
MchHvLvRight/Chamber[01..10]Right/Group[1..4]ann.MeasurementSenseVoltage
MchHvLvRight/Chamber[01..10]Right/Group[1..4]anp.MeasurementSenseVoltage

// St3 has 5 LV groups

MchHvLvLeft/Chamber[05..06]Left/Group[5..5]dig.MeasurementSenseVoltage
MchHvLvLeft/Chamber[05..06]Left/Group[5..5]ann.MeasurementSenseVoltage
MchHvLvLeft/Chamber[05..06]Left/Group[5..5]anp.MeasurementSenseVoltage
MchHvLvRight/Chamber[05..06]Right/Group[5..5]dig.MeasurementSenseVoltage
MchHvLvRight/Chamber[05..06]Right/Group[5..5]ann.MeasurementSenseVoltage
MchHvLvRight/Chamber[05..06]Right/Group[5..5]anp.MeasurementSenseVoltage

// St4-5 have 7 LV groups

MchHvLvLeft/Chamber[07..10]Left/Group[5..7]dig.MeasurementSenseVoltage
MchHvLvLeft/Chamber[07..10]Left/Group[5..7]ann.MeasurementSenseVoltage
MchHvLvLeft/Chamber[07..10]Left/Group[5..7]anp.MeasurementSenseVoltage
MchHvLvRight/Chamber[07..10]Right/Group[5..7]dig.MeasurementSenseVoltage
MchHvLvRight/Chamber[07..10]Right/Group[5..7]ann.MeasurementSenseVoltage
MchHvLvRight/Chamber[07..10]Right/Group[5..7]anp.MeasurementSenseVoltage
```

where `ann` stands for analog negative (-2.5 V), `anp` for analog positive (2.5 V) and `dig` for digital (3.3 V).

So we get a gran total of 324 ( = 3*108=3x(2x(4x4+2x5+4x7)) ) DCS LV aliases.

## OCDB

First, while waiting to get values from Pt2 (see https://alice.its.cern.ch/jira/browse/ALIDCS-540) generate fake values
 using `AliMUONCDB`, picking as reference run 246980 (LHC15o)

```c++
AliMpCDB::LoadAll2();
time_t refTime = 1449969676;
AliCDBManager::Instance()->SetDefaultStorage("alien://folder=/alice/cern.ch/user/l/laphecet/OCDB");
Bool_t defaultValue = kFALSE;
AliMUONCDB::WriteLV(defaultValue,246980,246980,refTime);
```

Then, use the new `AliMUONTrackerLV` class (coming from the refactoring of `AliMUONTrackerHV`, adding the `AliMUONTrackerVoltages` base class) to check the fake values are as expected :

```c++
AliMpCDB::LoadAll2();
AliMUONTrackerLV lv(246980,"alien://folder=/alice/cern.ch/user/l/laphecet/OCDB");
AliCDBManager::Instance()->SetSpecificStorage("GRP/GRP/Data","local:///cvmfs/alice-ocdb.cern.ch/calibration/data/2015/OCDB");
lv.Print("Chamber01");
lv.Plot("Chamber01");
```

Should printout values around 2.5 for the `ann` groups or `anp` groups and around 3.3 for the `dig` groups. Note that positive and negative groups both get positive values as that's the way it's done in DCS.

Setting a specific storage for GRP to point to a real OCDB (compared to the local one $ALICE_ROOT/OCDB) to get the run start and end time.

`mchview` has also been modified to get a graphical view on those values.
## Check I

From a list of [544 runs](/post/adding-lv-values-to-reco/runlist.lhc16hn) (from LHC16h to LHC16n periods -minus [run 255247](https://alice.its.cern.ch/jira/browse/ALIROOT-6344?focusedCommentId=182921&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-182921) for which the data is not available on cvmfs-), get the [list of detection elements](/post/adding-lv-values-to-reco/scan.lv.hn.txt) that had some trips, using the `AliMUONTrackerLV::Scan` method :

```
AliCDBManager::Instance()->SetDefaultStorage("local:///cvmfs/alice-ocdb.cern.ch/calibration/data/2016/OCDB")
AliCDBManager::Instance()->SetRun(260804)
AliMpCDB::LoadAll()
AliMUONTrackerLV lv("runlist.lhc16hn","local:///cvmfs/alice-ocdb.cern.ch/calibration/data/2016/OCDB")
lv.Scan(); 
```

## Check II

Make 3 reconstructions of 1000 events of the same data chunk (16000260804019.100.root) :

1. reference one, using the aliroot version in use for muon_calo_pass1 : AliRoot-v5-08-10-1, and the OCDB from cvmfs
2. use the code developped to cut on LV, but do not cut on them (i.e. use the default PadGoodnessMask from
    the default RecoParams), and the OCDB from cvmfs
3. as before, but this time using a specific storage to change the PadGoodnessMask of the RecoParam to cut on LV
    (mask = mask | 0x80000)

The difference between 2 and 3 should be a "hole" in the recpoints map in the zone affected by the LV trip
(Chamber09Left/Group7anp, corresponding to detection elements 916,917,918,919). That's indeed what's found (see the
figures below). The rest of the recpoints should be
the same. That has been checked using the `MUON/macros/CompareDigitsOrClusters.C` macro. This macro gives no output
when comparing 1 and 2 (as expected), but gives some output when comparing 2 and 3. The output comparison shows that
the differences are limited to the disappearance, in reco 3, of the clusters belonging to the detection elements
affected by the LV trip.

The difference between 1 and 2 should be void (i.e. checking that doing the same thing as before is indeed yielding the
same result...)

![(1) Reference recpoints map](/post/adding-lv-values-to-reco/recpoints-ref.png "1-Reference recpoints map")
![(2) recpoints map w/o cutting on LV](/post/adding-lv-values-to-reco/recpoints-no-lvcut.png "2- recpoints map w/o cutting on LV")
![(3) recpoints map w/ cutting on LV](/post/adding-lv-values-to-reco/recpoints-wlvcut.png "3-recpoints map w/ cutting on LV")

