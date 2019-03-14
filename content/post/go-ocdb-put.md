+++
author = "Laurent Aphecetche"
date = "2019-03-14"
lastmod = "2019-03-14"
description = ""
tags = [ "go", "ocdb", "aliroot", "o2" ]
title = "Upload Run2 OCDB objects to Run3 CCDB instance"
draft = true
+++

Personal notes on how to generate part of the code in [alice-go/aligo](https://github.com/alice-go/aligo).

## Generating groot streamers

Using [`root-gen-type`](https://github.com/go-hep/hep/tree/master/groot/cmd/root-gen-type)

```c++
root-gen-type -p ocdb -t AliDCSSensor -o dcssensor.go $HOME/cernbox/ocdbs/2018/OCDB/GRP/GRP/Data/Run295820_295820_v1_s0.root
root-gen-type -p ocdb -t AliSplineFit -o splinefit.go $HOME/cernbox/ocdbs/2018/OCDB/GRP/GRP/Data/Run295820_295820_v1_s0.root
```

Currently having an issue : https://github.com/go-hep/hep/issues/479


