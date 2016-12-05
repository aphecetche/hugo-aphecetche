+++
author = ""
date = "2016-11-15"
lastmod = "2016-11-25"
description = ""
tags = [ "aliroot","simulation","grid" ]
title = "Making ideal simulations"
+++

Here are short notes on how to generate simulated ESDs for an ideal Muon spectrometer. The context is to get
input data to compute a quick acceptance times effiency correction, possibly online (in Amore for Run2 or in
whatever for Run3).

The setup is to use `$ALICE_PHYSICS/PWG/muondep/AliMuonAccEffSubmitter` :

```
AliMuonAccEffSubmitter a("GenJPsi13TeV",kFALSE,"4_25",800000,4000);
a->SetRemoteDir("/alice/cern.ch/user/l/laphecet/IdealSimulations5");
a->SetRunList(228936);
a->SetAliPhysicsVersion("VO_ALICE@AliPhysics::v5-08-13o-01-1");
a->Run("localtest");
a->Run("full");
```

Note that this will create (if not already done otherwise) OCDB snapshots in the local directory `./OCDB/228396/`.
Those snapshots are automatically generated (see class `AliMuonOCDBSnapshotGenerator`) from a local OCDB created by the submitter in `./OCDB` with default objects for
Config, Pedestals, OccupancyMap, HV,LV, RejectList. The other objects in the snapshots are taken directly from the `raw://` OCDB (or any OCDB the submitter is configured with by the `SetOCDBPath` method), except the RecoParam which
is patched to remove the cut on any of the defaults objects in the local OCDB (the idea being to produce an ideal
 but realistic simulation, as far as geometry, alignment, tracking and trigger parameters are concerned).

The produced ESDs (on the grid) are then processed to "compact" them as much as possible, using the `ConvertESD`
function in [QuickAccEff.C](https://github.com/aphecetche/acode/blob/master/perfcheck/QuickAccEff.C) using a little script :

```
#!/bin/sh

echo "root -b <<EOF"
echo ".L /source/QuickAccEff.C+"

for file in $(find /data/simulations/FromHugoAndAstrid13TeVConfig -name AliESDs.root)
do
    dest=${file/AliESDs/compact}
    echo "ConvertESD(\"$file\",\"$dest\");"
    done
echo "EOF"
```    

And the compact files are then packed together into a single one : 

```
hadd compact.root $(find . -name 'compact*' | tr "\n" " ")
```

To get an idea, making a simulation of 796k J/psi (800000 intended but one grid job failed and I did not bother
resubmiting it) leads to about 6GB of ESDs : 

```
~/mchoncall/simulations/FromHugoAndAstrid13TeVConfig
❯ du -ch */AliESDs.root
...
32M    196/AliESDs.root
32M    197/AliESDs.root
32M    198/AliESDs.root
32M    199/AliESDs.root
32M    200/AliESDs.root
6,1G    total
```

and once compacted the ~330k events remaining are shrinked to 45MB :

```
❯ du -ch compact.root
45M    compact.root
```
