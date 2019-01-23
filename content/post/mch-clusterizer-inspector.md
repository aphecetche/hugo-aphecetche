+++
title = "Mch Clusterizer Inspector"
date = "2018-11-29T16:58:10+01:00"
description = ""
author = ""
tags = ["o2","mrrtf","clustering"]
draft = true
+++

# The various steps of the inspection

- use `alo-aliroot` to extract from ESDs the events in FlatBuffer format
- use `alo-aliroot` to convert FlatBuffer events into YAML format
- use `galo` to convert cluster in YAML in processed cluster (including pixels at each step) in HTML format

## Converting ESD to FlatBuffer

See `alo-aliroot/aliroot/r23/esdconverter`. Produce a `MCH-EVENTS-100.dat` for instance.

## Dumping clusters to YAML format

```
mch-dump-run2 --input-file $HOME/cernbox/o2muon/MCH-EVENTS-100.dat --max-events 100 --silent false 
```

Produces a bunch of `cluster-#.yaml` files. Each YAML file contains the cluster(s) of a single event.

## Feeding a YAML cluster to the clusterizer -> pixel files

```
mch-clusterizer-inspector -i cluster-959.yaml -o pixels-959.yaml
```

## From YAML pixel to HTML for display

```
galo cluster convert -f $HOME/cernbox/o2muon/pixels-959.yaml && open /Users/laurent/cernbox/o2muon/pixels-959.html
```
