---
title: "Recovering from a failed MCH Shuttle"
date: "2017-06-28"
tags: ["aliroot","shuttle","mch","online" ]
jira: ["ALIROOT-7352","ALIROOT-7357" ]
---

During LHC17h period, the MCH Shuttle failed for 3 runs : 

- 272763 PHYSICS run
- 272764 PHYSICS run
- 272781 PEDESTALS run (fill 5873)

and thus the corresponding OCDB objects (pedestals for run 272781 and HV,LV,occupancy
and bus patch evolution for the 2 physics runs) were not uploaded. 

To recover from this, Chiara Zampolli sent the Shuttle input files : the outputs
 from the DAs (MCHpedDA, MCHoccDA, MCHbpevoDA) and the DCS map (for HV and LV) :

```
 ./MCH_272763:
 run000272763_MCH_mon-DA-MCH-0_BPEVO
 run000272763_MCH_mon-DA-MCH-0_OCCUPANCY
 testDCSMap.root_MCH_1498419754_1498425527_run272763.root

 ./MCH_272764:
 run000272764_MCH_mon-DA-MCH-0_BPEVO
 run000272764_MCH_mon-DA-MCH-0_OCCUPANCY
 testDCSMap.root_MCH_1498425548_1498428314_run272764.root

 ./MCH_272781:
 run000272781_MCH_ldc-MUON_TRK-0_CONFIG
 run000272781_MCH_ldc-MUON_TRK-0_PEDESTALS
 run000272781_MCH_ldc-MUON_TRK-1_CONFIG
 run000272781_MCH_ldc-MUON_TRK-1_PEDESTALS
 run000272781_MCH_ldc-MUON_TRK-2_CONFIG
 run000272781_MCH_ldc-MUON_TRK-2_PEDESTALS
 run000272781_MCH_ldc-MUON_TRK-3_CONFIG
 run000272781_MCH_ldc-MUON_TRK-3_PEDESTALS
 run000272781_MCH_ldc-MUON_TRK-4_CONFIG
 run000272781_MCH_ldc-MUON_TRK-4_PEDESTALS
 run000272781_MCH_ldc-MUON_TRK-5_CONFIG
 run000272781_MCH_ldc-MUON_TRK-5_PEDESTALS
 run000272781_MCH_ldc-MUON_TRK-6_CONFIG
 run000272781_MCH_ldc-MUON_TRK-6_PEDESTALS
 ```

From there, using the `MUON/macros/runMCHShuttleOffline.C` macro (cooked for the occasion, see
[AliRoot PR 290](https://github.com/alisw/AliRoot/pull/290))
 those files were read in by a `Test Shuttle` and uploaded to a local OCDB (in effect
  this macro is "replaying" the MCH Shuttle preprocessors offline).

Note that for ped the validity range had been adjusted (changing the file name) 
by hand using the next valid run number (for that object) found in the RAW ocdb.


```
~/alice/sw/osx_x86-64/AliRoot-OCDB/latest/OCDB/MUON/Calib
❯ find . -name '*272*'
./BPEVO/Run272763_272763_v0_s0.root
./BPEVO/Run272764_272764_v0_s0.root
./Config/Run272781_999999999_v0_s1.root
./HV/Run272763_272763_v0_s1.root
./HV/Run272764_272764_v0_s1.root
./LV/Run272763_272763_v0_s0.root
./LV/Run272764_272764_v0_s0.root
./OccupancyMap/Run272763_272763_v0_s1.root
./OccupancyMap/Run272764_272764_v0_s1.root
./Pedestals/Run272781_272790_v0_s1.root
```

The OCDB files were then visually checked with the `mchview` program [for ped,conf,occ,hv,lv](/post/mch-recovering-from-failed-shuttle/visual-check-with-mchview.png)
 and with the `MUON/macros/MUONBusPatchEvolution.C` macro for bpevo (for [run 272763](/post/mch-recovering-from-failed-shuttle/station-evo-272763.png) and [run 273764](/post/mch-recovering-from-failed-shuttle/station-evo-272764.png))

```c++
AliCDBManager::Instance()->SetDefaultStorage("local:///Users/laurent/alice/sw/osx_x86-64/AliRoot-OCDB/latest/OCDB")
AliCDBManager::Instance()->SetRun(272781)
.L MUONBusPatchEvolution.C+
AliMergeableCollection* bp = BPEVO(272763,"bpevo272763.root")
PlotStationOccupancies(*bp);
```

Finally the object were archived and sent to Chiara (via [JIRA
ticket ALIROOT-7357](https://alice.its.cern.ch/jira/browse/ALIROOT-7357)) for upload to RAW ocdb.

```
> tar zcvf $HOME/recover-failed-mch-shuttle.tar.gz $(find MUON/Calib -name '*272*' | grep -v Config | tr "\n" " ")
a MUON/Calib/BPEVO/Run272763_272763_v0_s0.root
a MUON/Calib/BPEVO/Run272764_272764_v0_s0.root
a MUON/Calib/HV/Run272763_272763_v0_s1.root
a MUON/Calib/HV/Run272764_272764_v0_s1.root
a MUON/Calib/LV/Run272763_272763_v0_s0.root
a MUON/Calib/LV/Run272764_272764_v0_s0.root
a MUON/Calib/OccupancyMap/Run272763_272763_v0_s1.root
a MUON/Calib/OccupancyMap/Run272764_272764_v0_s1.root
a MUON/Calib/Pedestals/Run272781_272790_v0_s1.root
```

Note that the conf has not changed since the previous conf (from run 272642) and thus 
 is not included in the archived.

