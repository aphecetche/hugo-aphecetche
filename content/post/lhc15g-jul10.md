---
title: LHC15g first look - July 10th dataset
date: "2015-07-10"
description: First look at LHC15g data, using a limited dataset (aka "July 10" dataset, i.e. whatever was reconstructed up to July 10th)
jira: [ "ALIROOT-6171" ]
---


## Basic counts

### 4 fills  

Luminosity estimated assuming a T0VX cross-section of 39 mb

| fill number | filling scheme | \<mu\> | lumi trigger | estimated ALICE lumi (nb^-1) | CMUL-B-NOPF-MUON lumi (nb^-1) | eff (%) |
|:------------:|:-----------------|:-------------:|--------------:|:---:|:---:|:----:|
| 3962 | 50ns_50b_38_31_36_6bpi10inj_wp | 0.15 | C0TVX-B-NOPF-CENTNOTRD | 16.87 | 12.73 | 75 |
| 3965 | 50ns_152b_110_36_108_36bpi7inj_wp	| 0.28 | C0TVX-B-NOPF-CENTNOTRD | 4.24 | 3.53 | 83 |
| 3971 | 50ns_152b_110_36_108_36bpi7inj | 0.29 | C0TVX-B-NOPF-CENTNOTRD | 2.51 | 2.05 | 82 |
| 3976 | 50ns_152b_110_36_108_36bpi7inj | 0.26 and 0.69 | C0TVX-B-NOPF-CENTNOTRD and C0TVX-B-NOPF-MUON | 17.4 and 28.3  | 36.5 | 80 |

Total CMUL7 lumi 54.8 nb^-1

MB trigger is CINT7-B-NOPF-CENTNOTRD or CINT7-B-NOPF-MUON.

Note that run 229417 (fill 3976) miss the GRP/CTP/Config file, hence cannot be reconstructed.

### 17 runs

#### Coverage
trigger count coverage shows an issue : the number of analyzed event is above the expected counts from the logbook !
Not for all the runs, but for some run/trigger the delta is huge (e.g. 743% for CINT7 in run 228979)

	root [0] AliAnalysisMuMu m("ds.txt.saf.root")
	root [1] m.TriggerCountCoverage("CMUL7-B-NOPF-MUON CINT7-B-NOPF-CENTNOTRD",true,true)
		9601284 RUN 000228943         CINT7-B-NOPF-CENTNOTRD   9601284 expected   8512813 [!] fraction 112.8 %             CMUL7-B-NOPF-MUON     53309 expected     53617 [ ] fraction  99.4 % percentage of total =   29.30 %   1
   		6859017 RUN 000228978         CINT7-B-NOPF-CENTNOTRD   6859017 expected    795758 [!] fraction 861.9 %             CMUL7-B-NOPF-MUON     32346 expected     18304 [!] fraction 176.7 % percentage of total =   50.23 %   2
   		3895434 RUN 000228939         CINT7-B-NOPF-CENTNOTRD   3895434 expected   3899826 [ ] fraction  99.9 %             CMUL7-B-NOPF-MUON     29025 expected     29070 [ ] fraction  99.8 % percentage of total =   62.11 %   3
   		3786698 RUN 000229409         CINT7-B-NOPF-CENTNOTRD   3786698 expected    581285 [!] fraction 651.4 %             CMUL7-B-NOPF-MUON     98271 expected     49458 [!] fraction 198.7 % percentage of total =   73.67 %   4
   		2798106 RUN 000228948         CINT7-B-NOPF-CENTNOTRD   2798106 expected   2809429 [ ] fraction  99.6 %             CMUL7-B-NOPF-MUON     17332 expected     17406 [ ] fraction  99.6 % percentage of total =   82.21 %   5
   		1230876 RUN 000228979         CINT7-B-NOPF-CENTNOTRD   1230876 expected    165652 [!] fraction 743.0 %             CMUL7-B-NOPF-MUON     15842 expected     13370 [!] fraction 118.5 % percentage of total =   85.96 %   6
    	883553 RUN 000229355         CINT7-B-NOPF-CENTNOTRD    883553 expected    980129 [ ] fraction  90.1 %             CMUL7-B-NOPF-MUON     13825 expected     15485 [ ] fraction  89.3 % percentage of total =   88.66 %   7
    	676159 RUN 000229360         CINT7-B-NOPF-CENTNOTRD    676159 expected    720808 [ ] fraction  93.8 %             CMUL7-B-NOPF-MUON     15266 expected     16695 [ ] fraction  91.4 % percentage of total =   90.72 %   8
    	587948 RUN 000229101         CINT7-B-NOPF-CENTNOTRD    587948 expected    752430 [ ] fraction  78.1 %             CMUL7-B-NOPF-MUON     13327 expected     17963 [ ] fraction  74.2 % percentage of total =   92.52 %   9
    	581677 RUN 000229376         CINT7-B-NOPF-CENTNOTRD    581677 expected    637225 [ ] fraction  91.3 %             CMUL7-B-NOPF-MUON      7729 expected      8785 [ ] fraction  88.0 % percentage of total =   94.29 %  10
    	537364 RUN 000228936         CINT7-B-NOPF-CENTNOTRD    537364 expected    537299 [!] fraction 100.0 %             CMUL7-B-NOPF-MUON      7810 expected      7810 [ ] fraction 100.0 % percentage of total =   95.93 %  11
    	464715 RUN 000229371         CINT7-B-NOPF-CENTNOTRD    464715 expected    469622 [ ] fraction  99.0 %             CMUL7-B-NOPF-MUON      7113 expected      7390 [ ] fraction  96.3 % percentage of total =   97.35 %  12
    	389215 RUN 000229410         CINT7-B-NOPF-CENTNOTRD    389215 expected    433369 [ ] fraction  89.8 %             CMUL7-B-NOPF-MUON     24122 expected     28031 [ ] fraction  86.1 % percentage of total =   98.54 %  13
     	99066 RUN 000229423         CINT7-B-NOPF-CENTNOTRD         0 expected         0 [ ]              CMUL7-B-NOPF-MUON     99066 expected    106524 [ ] fraction  93.0 % percentage of total =   98.84 %  14
     	29864 RUN 000229398         CINT7-B-NOPF-CENTNOTRD         0 expected         0 [ ]              CMUL7-B-NOPF-MUON     29864 expected     30795 [ ] fraction  97.0 % percentage of total =   98.93 %  15
     	15715 RUN 000229431         CINT7-B-NOPF-CENTNOTRD         0 expected         0 [ ]              CMUL7-B-NOPF-MUON     15715 expected     16143 [ ] fraction  97.3 % percentage of total =   98.98 %  16
	--- TOTAL 32772008 expected 21732491 fraction 150.8 %

After some multiple checks (from ESDs, from non-merged AODs, from merged AODs), the conclusion would be that the logbook (and the OCDB scalers) information is wrong or the reconstructed CTP data (i.e. the trigger mask leading to the list of fired trigger classes) is wrong ?

We assume for the moment that the problem is not in the scalers (hence the luminosity can be trusted somehow) and just move on... To be x-checked more deeply of course... Follow-up on [JIRA ticket ALIROOT-6171](https://alice.its.cern.ch/jira/browse/ALIROOT-6171)

#### Rates

![CINT7-B-NOPF-CENTNOTRD rate](/post/lhc15g-jul10/CINT7-B-NOPF-CENTNOTRD-L2ARATE.png)
![CMUL7-B-NOPF-MUON rate](/post/lhc15g-jul10/CMUL7-B-NOPF-MUON-L2ARATE.png)
![&mu;](/post/lhc15g-jul10/CINT7-B-NOPF-CENTNOTRD-MU.png)
![Pile up correction factor](/post/lhc15g-jul10/CINT7-B-NOPF-CENTNOTRD-PILEUPFACTOR.png)

## Invariant mass

Brute force fitting (i.e. first try), using :

	func=PSIPSIPRIMECB2VWG:rebin=2:histoType=minv:alJPsi=0.984:nlJPsi=5.839:auJPsi=1.972:nuJPsi=3.444

gives :

	NRUNS 16 - NTRIGGER     959924 - PT CMUL7-B-NOPF-MUON-ALL-pRABSETAPAIRY-V0A  
		             NofJPsi  7427.739 +- 140.098 ( 1.89 %)
		               mJPsi     3.098 +- 0.002 (0.049 %)
		               sJPsi     0.076 +- 0.002 (2.136 %)

![inv. mass for cmul7-b-nopf-muon](/post/lhc15g-jul10/CMUL7-B-NOPF-MUON-ALL-pRABSETAPAIRY.png)

	NRUNS 16 - NTRIGGER   91879134 - PT NOTRIGGERSELECTION-ALL-pRABSETAPAIRY-V0A  
		             NofJPsi 10926.360 +- 219.390 ( 2.01 %)
		               mJPsi     3.097 +- 0.002 (0.055 %)
		               sJPsi     0.078 +- 0.002 (2.283 %)

![inv. mass for notriggerselection](/post/lhc15g-jul10/NOTRIGGERSELECTION-ALL-pRABSETAPAIRY.png)

The ratio in the number of J/&psi; seems in CMUL vs all triggers (~30% loss) seems consistent with the trigger threshold of 1 GeV/c (?)

## Acc x Eff

Again, first look = brute force = not tuned at all. Simulations using `pp503` parametrization.

	gSystem->Load("libpythia6_4_28");
	AliMuonAccEffSubmitter a("GenParam");
	a.ShouldOverwriteFiles(true);
	a.MakeNofEventsPropToTriggerCount("CMUL7-B-NOPF-MUON");
	a.SetRemoteDir("/alice/cern.ch/user/l/laphecet/Analysis/LHC15g/simjpsi/jul-10/pp503");
	a.SetRunList("runlist.txt")
	a.Run("test")
	a.Submit(false)

![Acc x Eff vs run number](/post/lhc15g-jul10/accxeff.png)

Acc x Eff averaged over the analyzed runs is ~ 0.18

## First guestimate of a total cross-section

sigma J/&psi; = NJ/&psi; / ( Acc x Eff x Lumi x BR ) = 7427 / ( 0.18 x 54.8 x 1E3 x 5.93E-2) = 12.7 &micro;b

That would mean a doubling wrt to 7 TeV (6.38 &micro;b )
