+++
author = ""
date = "2016-11-08"
lastmod = "2016-12-05"
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

## Patching the OCDB

After `muon_calo_pass1` we decided to patch the OCDB itself instead of the AliRoot code. That is tweak the HV map from `MUON/Calib/HV` to swap Quad2Sect1 and Quad2Sect2 in Chamber03Left, using the following code :

```
#include "AliAnalysisTriggerScalers.h"
#include <iostream>
#include "AliCDBEntry.h"
#include "TMap.h"
#include "AliCDBManager.h"
#include "AliMUONCDB.h"
#include "AliDCSValue.h"
#include <vector>
#include <algorithm>

void PatchCDB(const char* runlist, const char* runlist1400, const char* srcOCDBPath="alien://folder=/alice/data/2016/OCDB", const char* destOCDBPath="alien://folder=/alice/cern.ch/user/l/laphecet/OCDBCH3L")
{
    // function to patch the OCDB MUON/Calib/HV for the swap of CH3L Q2S1 and Q2S2
    // runlist = full list of runs where Chamber03Left/Quad2Sect1 has an HV problem (trips, too low, plus the 1400 V
    // below)
    // runlist1400 = list of runs where Chamber03Left/Quad2Sect1 was struggling at 1400 V
    // for the runs in runlist1400, the HV will be forced to zero for that sector
    // note that Chamber03Left/Quad2Sect1 = Chamber02Left/Quad1Sect0 in DCS alias world
     
  AliAnalysisTriggerScalers ts(runlist,srcOCDBPath);

  std::vector<int> vrunlist = ts.GetRunList();

  AliAnalysisTriggerScalers ts1400(runlist1400,srcOCDBPath);
  std::vector<int> vrunlist1400 = ts1400.GetRunList();

  AliCDBManager* man = AliCDBManager::Instance();

  TObjString sector2("MchHvLvLeft/Chamber02Left/Quad1Sect0.actual.vMon");
  TObjString sector1("MchHvLvLeft/Chamber02Left/Quad1Sect1.actual.vMon");

  for ( auto r : vrunlist )
  {
      man->SetDefaultStorage(srcOCDBPath);
      man->SetRun(r);
      std::cout << "Run " << r << std::endl;

      AliCDBEntry* entry = man->Get("MUON/Calib/HV");
      TMap* hvmap = static_cast<TMap*>(entry->GetObject()->Clone());

      TPair* p1 = hvmap->RemoveEntry(&sector2);

      if ( std::find(vrunlist1400.begin(),vrunlist.end(),r) != vrunlist1400.end() )
      {
        TObjArray* a1 = static_cast<TObjArray*>(p1->Value());
        AliDCSValue* first = static_cast<AliDCSValue*>(a1->First());
        AliDCSValue* last = static_cast<AliDCSValue*>(a1->Last());
        a1->Delete();
        a1->Add(new AliDCSValue(0.0f,first->GetTimeStamp()));
        a1->Add(new AliDCSValue(0.0f,last->GetTimeStamp()));
      }
      TPair* p2 = hvmap->RemoveEntry(&sector1);

      hvmap->Add(new TObjString(sector2),p2->Value());
      hvmap->Add(new TObjString(sector1),p1->Value());

      delete p1->Key();
      delete p2->Key();

      man->SetDefaultStorage(destOCDBPath);
      hvmap->SetUniqueID( hvmap->GetUniqueID() | ( 1 << 9 ) );
      AliMUONCDB::WriteToCDB(hvmap,"MUON/Calib/HV",r,r,"Patched for CH3L Quad2Sect1 vs 0 swapping","L. Aphecetche");
      man->ClearCache();
  }
}
```

where `runlist` was

```
266518,266520,266522,266523,266525,266533,266534,266539,266543,266549,266587,266588,266588,266618,266619,266619,266621,266630,266657,266658,266659,266665,266668,266669,266674,266676,266700,266702,266703,266706,266708,266775,266776,266800,266800,266805,266807,266808,266878,266880,266882,266883,266885,266886,266912,266915,266940,266940,266942,266943,266944,267109,267110,267130,267131
```

and `runlist.1400` was 

```
266518,266587,266588,266618,266619,266700,266800,266940
```

<!--- The resulting object were put into `alien://folder=/alice/cern.ch/user/l/laphecet/OCDBCH3L` and requested for upload in --->
<!--- JIRA Ticket #... --->
