+++
author = ""
date = "2016-03-28T13:09:45+02:00"
description = ""
tags = []
title = "LHC16b cosmic reco"
jira = [ "ALIROOT-6607", "ALIROOT-6608", "ALIROOT-6601" ]
+++

Preparation steps for the reconstruction of the LHC16b period, containing only cosmic data. Main purpose is to get some first data for the 2016 alignment.

Tests performed on one chunk :

```
/alice/data/2016/LHC16b/000250050/raw/16000250050019.9900.root
```

That has been filtered, and reading only one trigger of interest : `C0MSL-ABCE-NOPF-ALLNOTRD` :

```
16000250050019.9900.FILTER_RAWMUON_WITH_ALIPHYSICS_v5-06-04-01.root?Trigger=C0MSL-ABCE-NOPF-ALLNOTRD
```

On the Muon side, there is one thing to change : the reco params.
Usually we used a custom RecoParam with 2 species : Cosmic (default) and Calib, thus disregarding completely the specie used in the reconstruction. Put differently, whatever the `AliReconstruction` thought about the specie of an event, we used the same recoparams (the default ones, hence Cosmic).

The idea for this year would be to do thing "properly", i.e. prepare a RecoParam containing 3 species : Low Mult (default), Cosmic (to be used for this reco) and Calib, and let the reconstruction pick the right one for the job at hand.

Problem with this plan is that cosmic event specie is only set for triggers that are in the `kCosmic` trigger alias (`GRP/CTP/Aliases`).

So added a function `AliMUONCDB::WriteCosmicAliases(const char* triggerList, Int_t startRun, Int_t endRun)` to generate a fake aliases object, putting all the triggers in the comma separated `triggerList` in the `kCosmic` alias.

> Actually the [production team prefers to stay with the old way of doing it](https://alice.its.cern.ch/jira/browse/ALIROOT-6607), so I saved the changes in the
`feature-lhc16b-cosmic-reco` branch (in `/Users/laurent/alicesw/aliroot/git` repo)

The cosmic specie issue being "solved", the test [reconstruction](/log/lhc16b-cosmic-reco/rundatareco.log) log still contains some strange messages...

First some errors about the geometry :

```
I-TGeoManager::Voxelize: Voxelizing...
E-TGeoVoxelFinder::SortAll: Wrong bounding box for volume S0R2
E-TGeoVoxelFinder::SortAll: Wrong bounding box for volume SC1A
E-TGeoVoxelFinder::SortAll: Wrong bounding box for volume S0R8
E-TGeoVoxelFinder::SortAll: Wrong bounding box for volume SC1A
E-TGeoVoxelFinder::SortAll: Wrong bounding box for volume S0L2
E-TGeoVoxelFinder::SortAll: Wrong bounding box for volume SC1A
E-TGeoVoxelFinder::SortAll: Wrong bounding box for volume S0L8
E-TGeoVoxelFinder::SortAll: Wrong bounding box for volume SC1A
E-TGeoVoxelFinder::SortAll: Wrong bounding box for volume SV11E0
E-TGeoVoxelFinder::SortAll: Wrong bounding box for volume SV11E1
E-TGeoVoxelFinder::SortAll: Wrong bounding box for volume SV11E2
...etc...
```

<i class="fa fa-check"></i> This one has been fixed in [ALIROOT-6601](https://alice.its.cern.ch/jira/browse/ALIROOT-6601).

Then some worrisome warnings about the alignment :

```
W-AliGeomManager::LoadAlignObjsFromCDBSingleDet: 73 alignment objects loaded for TPC, which has 72 alignable volumes
W-AliGeomManager::LoadAlignObjsFromCDBSingleDet: 16 alignment objects loaded for PHOS, which has 11 alignable volumes
W-AliGeomManager::LoadAlignObjsFromCDBSingleDet: 176 alignment objects loaded for MUON, which has 248 alignable volumes
W-AliGeomManager::LoadAlignObjsFromCDBSingleDet: 2 alignment objects loaded for T0, which has 24 alignable volumes
```

<i class="fa fa-check"></i> Apparently not an issue either, just indicates that the volumes from MTR are not aligned.

And an information message that appear at each event (while I would expect the OCDB to be accessed only once ?)

```
I-AliCentralTrigger::LoadConfiguration: Getting trigger configuration from OCDB
```

Those put aside, the reconstruction seems to perform correctly. The number of `C0MSL` is much lower than the number of events in the chunk (16 over 8000), and hence the reco is pretty fast.
