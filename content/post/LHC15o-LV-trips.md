---
title: List of LHC15o runs with LV trips
date: "2015-12-15"
---

This is the list of physics runs that had a LV trip problem in MCH during LHC15o.

This list is constructed using  3 sources of information :

1. LB  : via the automatic log of the LV trip from DCS into the [logbook](https://alice-logbook.cern.ch/logbook/date_online.php?p_cont=lc&p_cvm=Compact&pcf_ctitle=LV+TRIP%2C&pcf_crn=244918%2C246994&p_cpn=1&pcf_ctc=unset). This should be the ultimate source but it did not work for some period of time, hence the double check here.
2. Using the AliAnalysisTriggerScalers::PlotTriggerEvolution to get the ratio L0A/L0B (aka livetime, LT) for CMUL7 trigger. When there is a LV trip, the readout of the corresponding detector parts goes to a timeout of 5ms. Knowing that livetime = 1 / ( 1 + busyTime x inputRate) = 1 / ( 1 + 5E-3 x 1000 Hz) , we thus look for periods where the livetime was around 16%. The PlotTriggerEvolution is actually looking for LT > 5% and < 60%, so it is getting more runs than just the LV tripped ones...
3. Finally a visual cross-check is made using the MAD display for the runs spotted above. Here we look for drops in the event rate (not down to zero, those are PARs).

In the table below are all the runs of [this list (158 runs at time of this writing)](https://alice-logbook.cern.ch/logbook/date_online.php?p_cont=sb&p_rsob=l.LHCperiod&p_rsob_dir=DESC&prsf_rpart=PHYSICS%25%2C&prsf_rwb=Yes&prsf_rtype=PHYSICS%2C&prsf_rdur=9+m%2C%2C&ptcf_rtc=%2CAt+least%2CMUON_TRG%3BMUON_TRK%3B%2CAt+least&prsf_rgmr=Yes&pqff_rq=Bad+run%2C1&psf_det_MUON_TRK=DONE%2C0&pqff_det_MUON_TRK=Bad+run%2C1&pqff_det_MUON_TRG=Bad+run%2C1&pqff_det_SPD=Bad+run%2C1&psf_det_MUON_TRG=DONE%2C0&psf_det_GLOBAL=DONE%2C0&psf_det_TRIGGER=DONE%2C0&p_rspn=1&prsf_rlp=LHC15o,) found by the step 2, for the record.

| RUN | Remark |
|:-----:|:-------|
| 245349 | [LB](https://alice-logbook.cern.ch/logbook/date_online.php?p_cont=rund&p_run=245349&p_tab=logs) - [LT](/images/LHC15o/RUN000245349-TriggerEvolution-CMUL7-B-NOPF-MUFAST-L0AOVERB.png ) - [MAD](https://aldaqweb.cern.ch/sd/replay/245349) trip very close to the end of the run |
| 245396 | [LB](https://alice-logbook.cern.ch/logbook/date_online.php?p_cont=rund&p_run=245396&p_tab=logs) - [LT](/images/LHC15o/RUN000245396-TriggerEvolution-CMUL7-B-NOPF-MUFAST-L0AOVERB.png) - [MAD](https://aldaqweb.cern.ch/sd/replay/245396) trip for last 30 minutes of the run|
| 245411 | [LB](https://alice-logbook.cern.ch/logbook/date_online.php?p_cont=rund&p_tab=logs&p_run=245411&p_tab=logs) - [LT](/images/LHC15o/) - [MAD](https://aldaqweb.cern.ch/sd/replay/245411) trip for the full run basically|
| 245439 | [LB](https://alice-logbook.cern.ch/logbook/date_online.php?p_cont=rund&p_run=245439&p_tab=logs) - [LT](/images/LHC15o/RUN000245439-TriggerEvolution-CMUL7-B-NOPF-MUFAST-L0AOVERB.png) - [MAD](https://aldaqweb.cern.ch/sd/replay/245439) trip for the last 20 minutes of the run |
| 245452 | [LB](https://alice-logbook.cern.ch/logbook/date_online.php?p_cont=rund&p_tab=logs&p_run=245452&p_tab=logs) - [LT](/images/LHC15o/RUN000245452-TriggerEvolution-CMUL7-B-NOPF-MUFAST-L0AOVERB.png) - [MAD](https://aldaqweb.cern.ch/sd/replay/245452) this one was not detected by step 2 but it's because Indra was there in ARC switching back the LV "live" but the 2 trips appear clearly in MAD (@49 min and 1h01) |
| 245453 | [LB](https://alice-logbook.cern.ch/logbook/date_online.php?p_cont=rund&p_run=245453&p_tab=logs) - [LT](/images/LHC15o/RUN000245453-TriggerEvolution-CMUL7-B-NOPF-MUFAST-L0AOVERB.png) - [MAD](https://aldaqweb.cern.ch/sd/replay/245453) trip towards the end of the run|
| 246036 | [LB](https://alice-logbook.cern.ch/logbook/date_online.php?p_cont=rund&p_run=246036&p_tab=logs) - [LT](/images/LHC15o/RUN000246036-TriggerEvolution-CMUL7-B-NOPF-MUFAST-L0AOVERB.png) - [MAD](https://aldaqweb.cern.ch/sd/replay/246036) not a LV trip but full CH10L occupancied hence a poor LT (busy 2ms) |
| 246271 | [LB](https://alice-logbook.cern.ch/logbook/date_online.php?p_cont=rund&p_run=246271&p_tab=logs) - [LT](/images/LHC15o/RUN000246271-TriggerEvolution-CMUL7-B-NOPF-MUFAST-L0AOVERB.png) - [MAD](https://aldaqweb.cern.ch/sd/replay/246271)  - this is an instance of the lack of automatic log for a LV trip (can be seen clearly in MAD @ 49min) |
| 246671 | [LB](https://alice-logbook.cern.ch/logbook/date_online.php?p_cont=rund&p_run=246671&p_tab=logs) - [LT](/images/LHC15o/RUN000246671-TriggerEvolution-CMUL7-B-NOPF-MUFAST-L0AOVERB.png) - [MAD](https://aldaqweb.cern.ch/sd/replay/246671) not a LV trip but a drop below 40% of LT |

So in summary there were 6 physics runs (total duration ~7h, CMUL7 lumi ~7.5 ub^-1) with a LV trip :

	245349 , 245396 , 245411 , 245439 , 245453 , 246271
