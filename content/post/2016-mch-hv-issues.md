+++
author = ""
date = "2016-11-08"
description = ""
tags = [ "aliroot","reco","hv" ]
title = "2016 MCH HV issues"
+++

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


