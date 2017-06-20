+++
author = "Laurent Aphecetche"
center = true
controls = true
date = "2017-06-19T10:16:22+02:00"
headline = "A PIP for a WIP"
homebutton = true
printbutton = true
tags = ["talks"]
theme = "simple"
timeline = false
title = "The MCH Mapping"
transition = "none"
+++

# Talk's purpose

### Refresher about MCH mapping concepts
### Some ideas on its implementation evolution

---

# The Big Picture 

+++

![](/talk/2017-06-20-mch-mapping/alice.jpg)

+++

![](/talk/2017-06-20-mch-mapping/alice-muon.jpg)

+++

![](/talk/2017-06-20-mch-mapping/alice-muon-zoom.jpg)

+++

![](/talk/2017-06-20-mch-mapping/alice-muon-zoom-nb.jpg)

+++

![](/talk/2017-06-20-mch-mapping/alice-muon-zoom-absorber-mch-mid-in-color.jpg)

+++

![](/talk/2017-06-20-mch-mapping/alice-muon-zoom-slats-and-sectors-in-color.jpg)

---

# MCH Detector Parts

+++

- stations and chambers
- detection elements
   * sectors
   * slats
   * planes
- ddls
- buspatches
- manus
- pads


+++

## Stations (st) and Chambers (ch)

### 5 stations, 2 chambers each
### = 10 chambers

+++

## 10 chambers

![](/talk/2017-06-20-mch-mapping/chambers.png)

+++

## Detection Elements (de)

### Elementary parts of the detector 
### (re-moveable and hence should be aligned)
### 156 units

+++

![](/talk/2017-06-20-mch-mapping/des.png)

+++

## Sectors and slats

### Stations 1 and 2 : sectors (a.k.a. quadrants)
#### 8 units, 2 types
### Stations 3,4 and 5 : slats
#### 148 units, 19 types

+++

![](/talk/2017-06-20-mch-mapping/sectors.png)

+++

![](/talk/2017-06-20-mch-mapping/slats.png)

+++

## Planes

### Each DE has two planes
### Bending (b) & Non-Bending (nb) plane
### A plane is a set of pads

+++

## Motifs

### A group of <= 64 pads
### One FEE card
### 283 types (171 for slats)

+++

## <i class="fa fa-search" aria-hidden="true"></i> work

![](/talk/2017-06-20-mch-mapping/r2nx_mapping.png)

+++


![](/talk/2017-06-20-mch-mapping/motifs-sample.png)

+++

## DDLs & Buspatches

![](/talk/2017-06-20-mch-mapping/muon-daq-run2.png)

+++

## GBTs and CRUs

![](/talk/2017-06-20-mch-mapping/muon-daq-run3.png)

+++

## Voltages

![](/talk/2017-06-20-mch-mapping/sector-hv.png)

+++

## Numbers recap (Run 2)

- 20 DDLs
- 156 DEs
- 888 buspatches
- 16828 manus
- 1064008 pads

+++

## Numbers recap (Run 3)

- ~25 CRUs
- 156 DEs
- ~600 elinks
- 16828 dual sampas
- 1064008 pads

---

# The Mapping Roles

+++

## Finding pads

<br>

- by (ix,iy)
- by (x,y)
- by (fee,channel)

<br>
### a.k.a. Segmentation

+++

## Linking R/O and segmentation

- DE <-> DDLs
- DE <-> buspatches
- DDL <-> buspatches
- buspatches <-> FEE

+++

## Linking DCS and segmentation

- manu <-> HV
- DE <-> LV

+++

## Each role used in different parts of the code

e.g.

- find by position : clustering
- R/O to pad : raw data decoding
- HV/LV : data filtering

---

# Current (Run2) Implementation

+++

## Text files

- 666 (!) text files <i class="fa fa-file-text-o" aria-hidden="true"></i>
- several different formats (custom)
- interpreted w/ custom readers <i class="fa fa-filter" aria-hidden="true"></i>
- used to construct objects hierarchy

+++

## OCDB

- Text files [ <i class="fa fa-compress" aria-hidden="true"></i> in 1 ROOT obj in OCDB <i class="fa fa-database" aria-hidden="true"></i> ]
- Still treated as text files

+++

## All or nothing

### one single (big) set of objects 
   - in memory (but designed to be compact)
   - all the time
   - for all purposes

---

# Next (Run3) Implementation

+++

## Data source format

- custom and small text files were nice 
   - when developping the mapping
   - but mapping is now known and fixed
- still, human readable stays usefull

+++

##  Use JSON as the only text format

- still human readable / writeable
- but parser(s)'s coming "for free" this time
- in whatever language

+++

## Limit the number of files

### one per "detector level" (ch,de,seg,etc...)

+++

## Generators

- don't (necessarily) use JSON directly
- generate code for trivial/small things
- generate binary format(s) (e.g. FlatBuffers)

and

- be more "functional" and less OO ?

+++

## Split mapping

<br>

### natural level of work(*) is DE
### <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
###  one (binary) mapping <i class="fa fa-file-o" aria-hidden="true"></i> per DE

<br>
<br>

(*) up to tracking

+++

## Status : txt <i class="fa fa-long-arrow-right" aria-hidden="true"></i> <i class="devicons devicons-javascript" aria-hidden="true"></i>

- berg <i class="fa fa-check" aria-hidden="true"></i>
- bp <i class="fa fa-check" aria-hidden="true"></i>
- ch <i class="fa fa-check" aria-hidden="true"></i>
- ddl <i class="fa fa-check" aria-hidden="true"></i>
- de <i class="fa fa-check" aria-hidden="true"></i>
- motif <i class="fa fa-check" aria-hidden="true"></i>
- pcb <i class="fa fa-check" aria-hidden="true"></i>
- slat <i class="fa fa-check" aria-hidden="true"></i>
- sector

... _modulo_ tests, of course ...

+++

## Next Steps

- code the reverse conversion <i class="devicons devicons-javascript" aria-hidden="true"></i> <i class="fa fa-long-arrow-right" aria-hidden="true"></i> txt
- to check all information is actually still there...
- (re)write **tests**
- generate some code and some binary format

---

# <i class="fa fa-question" aria-hidden="true"></i> or <i class="fa fa-commenting" aria-hidden="true"></i> 


