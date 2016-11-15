+++
author = ""
date = "2016-11-15"
lastmod = "2016-11-15"
description = ""
tags = [ "aliroot","simulation","grid" ]
title = "Making ideal simulations"
+++

Here are short notes on how to generate simulated ESDs for an ideal Muon spectrometer. The context is to get
input data to compute a quick acceptance times effiency correction, possibly online (in Amore for Run2 or in
whatever for Run3).

The setup is to use `$ALICE_PHYSICS/PWG/muondep/AliMuonAccEffSubmitter`, driven by a small `run.C` macro :

```
AliMuonAccEffSubmitter* run()
{
    AliMuonAccEffSubmitter* a = new AliMuonAccEffSubmitter;
    a->SetRemoteDir("/alice/cern.ch/user/l/laphecet/IdealSimulations3");
    a->SetTemplateDir("/Users/laurent/analysis/2016/IdealSimulations/AccEffTemplates");
    a->SetupPythia6("4_25");
    a->SetMaxEventsPerChunk(4000);
    a->SetGenerator("JPsiGenerator_13TeV");
    a->SetRunList(0);
    a->MakeNofEventsFixed(800000);
    a->ShouldOverwriteFiles(true);
    a->UseOCDBSnapshots(true);
    a->SetVar("VAR_USE_ITS_RECO","0");
    a->SetVar("VAR_TRIGGER_CONFIGURATION","p-p");
    a->SetCompactMode(0);
    a->SetAliPhysicsVersion("VO_ALICE@AliPhysics::v5-08-13o-01-1");
    return a;
}
```

The OCDB snapshots must be created beforehand using the `$HOME/github.com/alisw/AliDPG/MC/CreateSnapshot.C`
macro, from the "aliroot" default/plain/ideal OCDB using run 0 as an anchor.

```
AliCDBManager::Instance()->SetDefaultStorage("local:///Users/laurent/alicesw/run2/aliphysics-master/AliRoot/OCDB/"):
AliCDBManager::Instance()->SetRun(0);
```

```
> root
.L run.C
AliMuonAccEffSubmitter* a = run();
a->Run("localtest");
a->Run("full");
```


