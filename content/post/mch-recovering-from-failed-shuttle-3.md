---
title: "Recovering from a failed MCH Shuttle (3)"
date: "2017-11-12"
tags: ["aliroot","shuttle","mch","online" ]
jira: ["ALIROOT-7587","ALIROOT-7588"]
---

> this is the same thing as [ Recovering from a failed MCH Shuttle ](/2017/06/28/mch-recovering-from-failed-shuttle) but for another period/run.

During LHC17o/p period, the MCH Shuttle failed for pedestal runs :

282046 
282034 
282006 
281971
281969

Basically all pedestal runs after Nov 9 around 23:30. The issue is that the latest Config file
Run281937_999999999_v105_s0.root on the OCDB is not accessible due to an EOS problem.

To recover from this, Chiara Zampolli sent the Shuttle input files : the outputs
 from the ped DA : 

 ```
 ~/analysis/2017/LHC17p
 ❯ tree -L 2
.
├── MCH_process_281969
│   ├── DAQ_MCH_281969_CONFIG_ldc-MUON_TRK-0.shuttle
│   ├── DAQ_MCH_281969_CONFIG_ldc-MUON_TRK-1.shuttle
│   ├── DAQ_MCH_281969_CONFIG_ldc-MUON_TRK-2.shuttle
│   ├── DAQ_MCH_281969_CONFIG_ldc-MUON_TRK-3.shuttle
│   ├── DAQ_MCH_281969_CONFIG_ldc-MUON_TRK-4.shuttle
│   ├── DAQ_MCH_281969_CONFIG_ldc-MUON_TRK-5.shuttle
│   ├── DAQ_MCH_281969_CONFIG_ldc-MUON_TRK-6.shuttle
│   ├── DAQ_MCH_281969_PEDESTALS_ldc-MUON_TRK-0.shuttle
│   ├── DAQ_MCH_281969_PEDESTALS_ldc-MUON_TRK-1.shuttle
│   ├── DAQ_MCH_281969_PEDESTALS_ldc-MUON_TRK-2.shuttle
│   ├── DAQ_MCH_281969_PEDESTALS_ldc-MUON_TRK-3.shuttle
│   ├── DAQ_MCH_281969_PEDESTALS_ldc-MUON_TRK-4.shuttle
│   ├── DAQ_MCH_281969_PEDESTALS_ldc-MUON_TRK-5.shuttle
│   └── DAQ_MCH_281969_PEDESTALS_ldc-MUON_TRK-6.shuttle
├── MCH_process_281971
│   ├── DAQ_MCH_281971_CONFIG_ldc-MUON_TRK-0.shuttle
│   ├── DAQ_MCH_281971_CONFIG_ldc-MUON_TRK-1.shuttle
│   ├── DAQ_MCH_281971_CONFIG_ldc-MUON_TRK-2.shuttle
│   ├── DAQ_MCH_281971_CONFIG_ldc-MUON_TRK-3.shuttle
│   ├── DAQ_MCH_281971_CONFIG_ldc-MUON_TRK-4.shuttle
│   ├── DAQ_MCH_281971_CONFIG_ldc-MUON_TRK-5.shuttle
│   ├── DAQ_MCH_281971_CONFIG_ldc-MUON_TRK-6.shuttle
│   ├── DAQ_MCH_281971_PEDESTALS_ldc-MUON_TRK-0.shuttle
│   ├── DAQ_MCH_281971_PEDESTALS_ldc-MUON_TRK-1.shuttle
│   ├── DAQ_MCH_281971_PEDESTALS_ldc-MUON_TRK-2.shuttle
│   ├── DAQ_MCH_281971_PEDESTALS_ldc-MUON_TRK-3.shuttle
│   ├── DAQ_MCH_281971_PEDESTALS_ldc-MUON_TRK-4.shuttle
│   ├── DAQ_MCH_281971_PEDESTALS_ldc-MUON_TRK-5.shuttle
│   └── DAQ_MCH_281971_PEDESTALS_ldc-MUON_TRK-6.shuttle
├── MCH_process_282006
│   ├── DAQ_MCH_282006_CONFIG_ldc-MUON_TRK-0.shuttle
│   ├── DAQ_MCH_282006_CONFIG_ldc-MUON_TRK-1.shuttle
│   ├── DAQ_MCH_282006_CONFIG_ldc-MUON_TRK-2.shuttle
│   ├── DAQ_MCH_282006_CONFIG_ldc-MUON_TRK-3.shuttle
│   ├── DAQ_MCH_282006_CONFIG_ldc-MUON_TRK-4.shuttle
│   ├── DAQ_MCH_282006_CONFIG_ldc-MUON_TRK-5.shuttle
│   ├── DAQ_MCH_282006_CONFIG_ldc-MUON_TRK-6.shuttle
│   ├── DAQ_MCH_282006_PEDESTALS_ldc-MUON_TRK-0.shuttle
│   ├── DAQ_MCH_282006_PEDESTALS_ldc-MUON_TRK-1.shuttle
│   ├── DAQ_MCH_282006_PEDESTALS_ldc-MUON_TRK-2.shuttle
│   ├── DAQ_MCH_282006_PEDESTALS_ldc-MUON_TRK-3.shuttle
│   ├── DAQ_MCH_282006_PEDESTALS_ldc-MUON_TRK-4.shuttle
│   ├── DAQ_MCH_282006_PEDESTALS_ldc-MUON_TRK-5.shuttle
│   └── DAQ_MCH_282006_PEDESTALS_ldc-MUON_TRK-6.shuttle
├── MCH_process_282034
│   ├── DAQ_MCH_282034_CONFIG_ldc-MUON_TRK-0.shuttle
│   ├── DAQ_MCH_282034_CONFIG_ldc-MUON_TRK-1.shuttle
│   ├── DAQ_MCH_282034_CONFIG_ldc-MUON_TRK-2.shuttle
│   ├── DAQ_MCH_282034_CONFIG_ldc-MUON_TRK-3.shuttle
│   ├── DAQ_MCH_282034_CONFIG_ldc-MUON_TRK-4.shuttle
│   ├── DAQ_MCH_282034_CONFIG_ldc-MUON_TRK-5.shuttle
│   ├── DAQ_MCH_282034_CONFIG_ldc-MUON_TRK-6.shuttle
│   ├── DAQ_MCH_282034_PEDESTALS_ldc-MUON_TRK-0.shuttle
│   ├── DAQ_MCH_282034_PEDESTALS_ldc-MUON_TRK-1.shuttle
│   ├── DAQ_MCH_282034_PEDESTALS_ldc-MUON_TRK-2.shuttle
│   ├── DAQ_MCH_282034_PEDESTALS_ldc-MUON_TRK-3.shuttle
│   ├── DAQ_MCH_282034_PEDESTALS_ldc-MUON_TRK-4.shuttle
│   ├── DAQ_MCH_282034_PEDESTALS_ldc-MUON_TRK-5.shuttle
│   └── DAQ_MCH_282034_PEDESTALS_ldc-MUON_TRK-6.shuttle
└── MCH_process_282046
    ├── DAQ_MCH_282046_CONFIG_ldc-MUON_TRK-0.shuttle
    ├── DAQ_MCH_282046_CONFIG_ldc-MUON_TRK-1.shuttle
    ├── DAQ_MCH_282046_CONFIG_ldc-MUON_TRK-2.shuttle
    ├── DAQ_MCH_282046_CONFIG_ldc-MUON_TRK-3.shuttle
    ├── DAQ_MCH_282046_CONFIG_ldc-MUON_TRK-4.shuttle
    ├── DAQ_MCH_282046_CONFIG_ldc-MUON_TRK-5.shuttle
    ├── DAQ_MCH_282046_CONFIG_ldc-MUON_TRK-6.shuttle
    ├── DAQ_MCH_282046_PEDESTALS_ldc-MUON_TRK-0.shuttle
    ├── DAQ_MCH_282046_PEDESTALS_ldc-MUON_TRK-1.shuttle
    ├── DAQ_MCH_282046_PEDESTALS_ldc-MUON_TRK-2.shuttle
    ├── DAQ_MCH_282046_PEDESTALS_ldc-MUON_TRK-3.shuttle
    ├── DAQ_MCH_282046_PEDESTALS_ldc-MUON_TRK-4.shuttle
    ├── DAQ_MCH_282046_PEDESTALS_ldc-MUON_TRK-5.shuttle
    └── DAQ_MCH_282046_PEDESTALS_ldc-MUON_TRK-6.shuttle

5 directories, 70 files
```

Then tweaked the `MUON/macros/runMCHShuttleOffline.C` macro to change
the filename convention it expected and use it 
 read in those files by a `Test Shuttle` and uploaded to a local OCDB (in effect this macro is "replaying" the MCH Shuttle preprocessors offline). For this to work AliRoot must be built with TestShuttle support (e.g. build a regular AliRoot and do a `ccmake .` in the build directory, activate the `TEST_SHUTTLE` option and rebuild). Assuming also that `AliRoot-OCDB` package has been installed with [alibuild](https://alisw.github.io/alibuild/) and that an AliEn token is available (`alien-token-init username`).

The result is some files in the `AliRoot-OCDB` local OCDB :

```
❯ find ~/alice/sw/osx_x86-64/AliRoot-OCDB/latest/OCDB/MUON/Calib -name '*28*' -atime -10m
/Users/laurent/alice/sw/osx_x86-64/AliRoot-OCDB/latest/OCDB/MUON/Calib/Config/Run281969_999999999_v0_s1.root
/Users/laurent/alice/sw/osx_x86-64/AliRoot-OCDB/latest/OCDB/MUON/Calib/Pedestals/Run281969_999999999_v0_s1.root
/Users/laurent/alice/sw/osx_x86-64/AliRoot-OCDB/latest/OCDB/MUON/Calib/Pedestals/Run281971_999999999_v0_s2.root
/Users/laurent/alice/sw/osx_x86-64/AliRoot-OCDB/latest/OCDB/MUON/Calib/Pedestals/Run282006_999999999_v0_s3.root
/Users/laurent/alice/sw/osx_x86-64/AliRoot-OCDB/latest/OCDB/MUON/Calib/Pedestals/Run282034_999999999_v0_s4.root
/Users/laurent/alice/sw/osx_x86-64/AliRoot-OCDB/latest/OCDB/MUON/Calib/Pedestals/Run282046_999999999_v0_s5.root
```

The OCDB files were then visually checked with the `mchview` program [for pedestal and config](/post/mch-recovering-from-failed-shuttle-3/visual-check-with-mchview.png).

Finally the object were archived (one per archive as there is a 10MB upload limit on JIRA...) and sent to Chiara (via [JIRA
ticket ALIROOT-7588](https://alice.its.cern.ch/jira/browse/ALIROOT-7588)) for upload to RAW ocdb.

```
~/alice/sw/osx_x86-64/AliRoot-OCDB/4e9547a691-1/OCDB
❯ tar zcvf $HOME/recover-failed-mch-shuttle-281969.tar.gz $(find MUON/Calib -name '*281969*' | tr "\n" " ")
a MUON/Calib/Config/Run281969_999999999_v0_s1.root
a MUON/Calib/Pedestals/Run281969_999999999_v0_s1.root

~/alice/sw/osx_x86-64/AliRoot-OCDB/4e9547a691-1/OCDB
❯ tar zcvf $HOME/recover-failed-mch-shuttle-281971.tar.gz $(find MUON/Calib -name '*281971*' | tr "\n" " ")
a MUON/Calib/Pedestals/Run281971_999999999_v0_s2.root

~/alice/sw/osx_x86-64/AliRoot-OCDB/4e9547a691-1/OCDB
❯ tar zcvf $HOME/recover-failed-mch-shuttle-282006.tar.gz $(find MUON/Calib -name '*282006*' | tr "\n" " ")
a MUON/Calib/Pedestals/Run282006_999999999_v0_s3.root

~/alice/sw/osx_x86-64/AliRoot-OCDB/4e9547a691-1/OCDB
❯ tar zcvf $HOME/recover-failed-mch-shuttle-282034.tar.gz $(find MUON/Calib -name '*282034*' | tr "\n" " ")
a MUON/Calib/Pedestals/Run282034_999999999_v0_s4.root

~/alice/sw/osx_x86-64/AliRoot-OCDB/4e9547a691-1/OCDB
❯ tar zcvf $HOME/recover-failed-mch-shuttle-282046.tar.gz $(find MUON/Calib -name '*282046*' | tr "\n" " ")
a MUON/Calib/Pedestals/Run282046_999999999_v0_s5.root

~/alice/sw/osx_x86-64/AliRoot-OCDB/4e9547a691-1/OCDBtar zcvf $HOME/recover-failed-mch-shuttle.tar.gz $(find MUON/Calib -name '*28*' -atime -10m | tr "\n" " ")
```

