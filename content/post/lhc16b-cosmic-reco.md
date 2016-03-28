+++
author = ""
date = "2016-03-28T13:09:45+02:00"
description = ""
tags = []
title = "lhc16b cosmic reco"
draft = true
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

So added a function `AliMUONCDB::WriteCosmicAliases(const char* triggerList, Int_t startRun, Int_t endRun)` to generate a fake aliases object, putting all the triggers in the coma separated `triggerList` in the `kCosmic` alias.

The cosmic specie issue being "solved", the test [reconstruction](/log/lhc16b-cosmic-reco/rundatareco.log) log still contains some strange messages...
