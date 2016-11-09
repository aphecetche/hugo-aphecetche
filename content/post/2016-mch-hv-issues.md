+++
author = ""
date = "2016-11-08"
lastmod = "2016-11-09"
description = ""
tags = [ "aliroot","reco","hv" ]
title = "2016 MCH HV issues"
+++

## Probable cable swapping

Following work done by Philippe Pillot concerning the comparison of the cluster maps for real data and simulated ones
(see [HitMaps for LHC16n](/post/2016-mch-hv-issues/20161030_HitMapsLHC16n.pdf)) we found a suspicious thing in CH3L
top (DE 301). Looks like the HV cables might be swapped between sector 1 and 2 (out of 3).

If we look at slide 4 of the presentation above, we see : 

![Chamber3 Hit Maps](/post/2016-mch-hv-issues/Chamber3.png)

that in the data 2 HV sectors are dead, while in the simulation only 1 is killed by the status map. One plausible
explanation for this observation is that the sector that has been found dead by the status map is incorrectly mapped and hence 2 sectors end up
dead (the real one that is dead and the one erroenously mapped).

To confirm this fully would require a reconstruction without any HV cut, but we can already see a hint of
confirmation by looking at the occupancy maps for that chamber and one of the affected runs, 260700 :

![Occupancy map for Chamber3 in run 260700](/post/2016-mch-hv-issues/occupancy-chamber3-run260700.png)

where we can indeed see that sector 2, not sector 1, seems a bit weak...

Using a scan of the HV values for the [698 runs](/post/2016-mch-hv-issues/runlist.2016.txt) of the periods LHC16h - LHC16p (the interesting part of the 2016 pp run) :

```
AliMUONTrackerHV hv("runlist.2016.txt","local:///cvmfs/alice-ocdb.cern.ch/calibration/data/2016/OCDB")
hv.Scan(1); > scan.hv.2016.log
```

one can investigate a bit the behaviour of that sector. We find 11 runs where the HV status is not "normal" (labelled
"Brave New World" in the log file, see AliMUONCalibrationData::PatchHVValues method for more details)

```
> grep "DE  301" scan.hv.2016.log | grep -v "Brave New World" | grep "Quad1Sect0" | grep ": RUN" | cut -c 40-45
260700
260704
260710
260713
260719
260722
260723
260727
260728
260752
260782
```

## Struggling HVs

Besides this probable mapping problem, the channel itself (whatever one it is really) has some strange behavior,
where it starts a run at nominal value but then decrease to around 1400 V and fluctuates there.

![RUN 260695 - CH3L - "Quad2Sect1"](/post/2016-mch-hv-issues/chamber03left-quad2sect1-run260695.png)
![RUN 260751 - CH3L - "Quad2Sect1"](/post/2016-mch-hv-issues/chamber03left-quad2sect1-run260751.png)

The current "HV cleaning" algorithm defined in `AliMUONCalibrationData::PatchHVValues` currently does not
detect this pattern and considers the channel is OK. Which is problably not, is it not ?

Actually this behavior is not limited to CH3. See below examples of other channels showing a somewhat similar pattern,
where it seems the HV power supply is "struggling" to stay at nominal voltage, without tripping...

<!--- ![RUN 255252 - CH4R - Quad4Sect2](/post/2016-mch-hv-issues/chamber04right-quad4sect2-run255252.png) --->

![RUN 260780 - CH7L - Slat07](/post/2016-mch-hv-issues/chamber07left-slat07-run260780.png)
![RUN 260781 - CH7L - Slat07](/post/2016-mch-hv-issues/chamber07left-slat07-run260781.png)
![RUN 260804 - CH7L - Slat07](/post/2016-mch-hv-issues/chamber07left-slat07-run260804.png)
![RUN 260936 - CH7L - Slat07](/post/2016-mch-hv-issues/chamber07left-slat07-run260936.png)
![RUN 261027 - CH9L - Slat13](/post/2016-mch-hv-issues/chamber09left-slat13-run261027.png)
![RUN 260780 - CH10L - Slat04](/post/2016-mch-hv-issues/chamber10left-slat04-run260780.png)

The question now is how to deal with those channels, which are currently not rejected at all during the
reconstruction. Should they be ?


