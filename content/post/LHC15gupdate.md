---
layout: post
title : LHC15g update
date: 2015-07-16
---

Just more runs added as compared to [July 10th](/LHC15g) and the first signs of the up(otato)silon.

## Fills

Luminosity estimated assuming a T0VX cross-section of 39 mb

| fill number | filling scheme | \<mu\> | lumi trigger | estimated ALICE lumi (nb^-1) | CMUL-B-NOPF-MUON lumi (nb^-1) | eff (%) |
|:------------:|:-----------------|:-------------:|--------------:|:---:|:---:|:----:|
| 3962 | 50ns_50b_38_31_36_6bpi10inj_wp | 0.15 | C0TVX-B-NOPF-CENTNOTRD | 16.87 | 12.73 | 75 |
| 3965 | 50ns_152b_110_36_108_36bpi7inj_wp	| 0.28 | C0TVX-B-NOPF-CENTNOTRD | 4.24 | 3.53 | 83 |
| 3971 | 50ns_152b_110_36_108_36bpi7inj | 0.29 | C0TVX-B-NOPF-CENTNOTRD | 2.51 | 2.05 | 82 |
| 3976 | 50ns_152b_110_36_108_36bpi7inj | 0.26 and 0.69 | C0TVX-B-NOPF-CENTNOTRD and C0TVX-B-NOPF-MUON | 17.4 and 28.3  | 36.5 | 80 |
| 3983 | 50ns_296b_254_36_246_36bpi11inj | 0.44 | C0TVX-B-NOPF-MUON | 2.33 | 2.13 | 91 |
| 3986 | 50ns_296b_254_36_246_36bpi11inj | 0.73 | C0TVX-B-NOPF-MUON | 2.10 | 1.81 | 86 |
| 3988 | 50ns_296b_254_36_246_36bpi11inj | 0.88 | C0TVX-B-NOPF-MUON | 51.0 | 42.4 | 83 |
| 3992 | 50ns_476b_414_32_397_72bpi10inj | 0.81 | C0TVX-B-NOPF-MUON | 44.7 | 37.0 | 83 |
| 3996 | 50ns_476b_414_32_397_72bpi10inj | 1.07 | C0TVX-B-NOPF-MUON | 44.6 | 38.0 | 85 |
| 4008 | 50ns_298b_256_38_246_36bpi13inj | 1.00 | C0TVX-B-NOPF-MUON | 18.0 | 13.5 | 75 |
| 4019 | 50ns_482b_420_32_397_72bpi11inj | 1.18 | C0TVX-B-NOPF-MUON | 7.1 | 3.0 | 42 |
| 4020 | 50ns_482b_420_32_397_72bpi11inj | 1.14 | C0TVX-B-NOPF-MUON | 3.6 | 2.5 | 68 |

Total CMUL7 lumi 195 nb^-1

![C0MUL rate](/images/lhc15g/jul-16/C0MUL-B-NOPF-MUON-L2ARATE.png)
![CINT7 rate](/images/lhc15g/jul-16/CINT7-B-NOPF-MUON-MU.png)
![CMUL7 rate](/images/lhc15g/jul-16/CMUL7-B-NOPF-MUON-L2ARATE.png)

## Acc x Eff
![Acc x Eff](/images/lhc15g/jul-16/acceff.png)

Note that the weighted (by number of triggers) mean of Acc x Eff is around 0.16

Concerning the Acc x Eff, please note that there is no matching condition on any of the tracks themselves (just like on data for the moment), but I do require the `CMULLO-B-NOPF-MUON` to be present in the simulated AOD.

## Minv

And, just for the fun, an invariant mass plot extended towards the up(otato)silon.

![Minv Spectra](/images/lhc15g/jul-16/CMUL7-B-NOPF-MUON-PSALL-pRABSETAMATCHLOWPAIRY-PP.png)

Note that the selection on event and pairs is a bit more strict (more like usual in fact) than before : I request physics selection and track matching to the trigger.
