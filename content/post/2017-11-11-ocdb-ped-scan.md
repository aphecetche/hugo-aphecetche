+++
title = "OCDB pedestal scan"
date = "2017-11-11T17:13:12+01:00"
description = "How to spot buspatches with recurrent pedestal issues"
author = ""
tags = [ "aliroot", "ocdb", "pedestals" ]
+++

In order to assess if some buspatches systematically have bad pedestal values,
 I've scanned the 2017 OCDB with the `AliMUONCDB::ShowFaultyPedestalsBusPatches`.

In order to do so, first task is to copy OCDB files locally (to speed up subsequent scans).

The simplest for that task is probably to make a list of all files : 

```
aliensh
> find /alice/data/2017/OCDB/MUON/Calib/Pedestals *.root > ped.txt
```

Edit the `ped.txt` to prepend `alien://` in front of all files.

Then use the `VAF::CopyFromRemote` method to copy the files locally.

Once done the scan can proceed on some [runlist](/post/2017-11-11-ocdb-ped-scan/runlist.ped.txt).

```
AliMUONCDB::ShowFaultyPedestalsBusPatches("runlist.ped",0.9,4000,4000,0.33,"buspatch.badped.33percent-of-the-time","local:///alice/data/2017/OCDB")
```

Leading, in this example, to the list of buspatches that have more than 90% of bad pedestal channels (where bad means
either mean larger than 4000 or sigma larger than 4000) more than 33% of
the time.

```
❯ cat buspatch.badped.33percent-of-the-time.txt
BP 0420 is bad for   4 runs in   4 ( 100.00%)
BP 0427 is bad for   4 runs in   4 ( 100.00%)
BP 0705 is bad for   3 runs in   8 (  37.50%)
BP 0811 is bad for 627 runs in 808 (  77.60%)
BP 0826 is bad for 672 runs in 800 (  84.00%)
BP 0827 is bad for 647 runs in 808 (  80.07%)
BP 1002 is bad for 654 runs in 814 (  80.34%)
BP 1120 is bad for 654 runs in 821 (  79.66%)
BP 1121 is bad for  10 runs in  30 (  33.33%)
BP 1336 is bad for 760 runs in 798 (  95.24%)
BP 1722 is bad for   6 runs in  10 (  60.00%)
```
