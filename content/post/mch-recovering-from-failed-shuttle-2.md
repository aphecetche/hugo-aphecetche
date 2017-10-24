---
title: "Recovering from a failed MCH Shuttle (2)"
date: "2017-10-24"
tags: ["aliroot","shuttle","mch","online" ]
jira: ["ALIROOT-7568" ]
---

> this is the same thing as [ Recovering from a failed MCH Shuttle ](/2017/06/28/mch-recovering-from-failed-shuttle) but for another period/run.

During LHC17o period, the MCH Shuttle failed for run 280729 (PHYSICS run), so the corresponding OCDB objects (HV,LV,occupancy
and bus patch evolution) were not uploaded. 

To recover from this, Chiara Zampolli sent the Shuttle input files : the outputs
 from the DAs (MCHbpevoDA, MCHoccDA) and the DCS map (for HV and LV) :

 ```
 ~/analysis/2017/LHC17o
 ❯ tree
 .
 └── MCH_280729
     ├── DAQ_MCH_280729_BPEVO_mon-DA-MCH-0.shuttle
     ├── DAQ_MCH_280729_OCCUPANCY_mon-DA-MCH-0.shuttle
     └── testDCSMap.root_MCH_1508551372_1508555974.root
```

Then renamed them to fit what the following macro expect :

```
~/analysis/2017/LHC17o/MCH_280729
❯ tree
.
├── run000280729_MCH_mon-DA-MCH-0_BPEVO
├── run000280729_MCH_mon-DA-MCH-0_OCCUPANCY
└── testDCSMap.root_MCH_1508551372_1508555974_run280729.root
```


From there, using the `MUON/macros/runMCHShuttleOffline.C` macro
 those files were read in by a `Test Shuttle` and uploaded to a local OCDB (in effect this macro is "replaying" the MCH Shuttle preprocessors offline). For this to work AliRoot must be built with TestShuttle support (e.g. build a regular AliRoot and do a `ccmake .` in the build directory, activate the `TEST_SHUTTLE` option and rebuild). Assuming also that `AliRoot-OCDB` package has been installed with [alibuild](https://alisw.github.io/alibuild/) and that an AliEn token is available (`alien-token-init username`).

The result is some files in the `AliRoot-OCDB` local OCDB :

```
~/alice/sw/osx_x86-64/AliRoot-OCDB/latest/OCDB/MUON/Calib
❯ find . -name '*280*'
./BPEVO/Run280729_280729_v0_s0.root
./HV/Run280729_280729_v0_s1.root
./LV/Run280729_280729_v0_s0.root
./OccupancyMap/Run280729_280729_v0_s1.root
```

The OCDB files were then visually checked with the `mchview` program [for occ,hv,lv](/post/mch-recovering-from-failed-shuttle-2/visual-check-with-mchview.png)
 and with the `MUON/macros/MUONBusPatchEvolution.C` macro for [bpevo](/post/mch-recovering-from-failed-shuttle-2/station-evo-280729.png)

```c++
AliCDBManager::Instance()->SetDefaultStorage("local:///Users/laurent/alice/sw/osx_x86-64/AliRoot-OCDB/latest/OCDB")
AliCDBManager::Instance()->SetRun(280729)
.L MUONBusPatchEvolution.C+
AliMergeableCollection* bp = BPEVO(280729,"bpevo280729.root")
PlotStationOccupancies(*bp);
```

Finally the object were archived and sent to Chiara (via [JIRA
ticket ALIROOT-7568](https://alice.its.cern.ch/jira/browse/ALIROOT-7568)) for upload to RAW ocdb.

```
> tar zcvf $HOME/recover-failed-mch-shuttle.tar.gz $(find MUON/Calib -name '*280*' | tr "\n" " ")
a MUON/Calib/BPEVO/Run280729_280729_v0_s0.root
a MUON/Calib/HV/Run280729_280729_v0_s1.root
a MUON/Calib/LV/Run280729_280729_v0_s0.root
a MUON/Calib/OccupancyMap/Run280729_280729_v0_s1.root
```

