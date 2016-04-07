+++
author = "Laurent Aphecetche"
date = "2016-04-07T09:27:46+02:00"
description = ""
tags = [ "aliroot","hlt","o2" ]
jira = [ "ALIHLT-142" ]
title = "Using HLT recraw local macro"
draft = true
+++

The proper way to test for reconstruction modules in HLT (according to [David Rorh](https://alice.its.cern.ch/jira/browse/ALICEHLT-142)) is to use the `HLT/exe/recraw-local.C`
 macro. See also [TPC_Offline_HOWTOS](https://twiki.cern.ch/twiki/bin/viewauth/ALICE/TPC_Offline_HOWTOS)

The idea is to launch, prior to the `recraw-local.C` itself, another macro that will setup the HLT chain to be ran.

```
aliroot -b -q preClusteringChain.C+ recraw-local.C
```

where in `recraw-local.C` the `hltOptions` parameter is set to the sink of the chain defined in the prior macro (`preClusteringChain.C` in this example)

The prior macro is something like (sparing the list of includes to save space) :

```c++
void preClusteringChain()
{
  AliHLTSystem* pHLT = AliHLTPluginBase::GetInstance();

  pHLT->ScanOptions(Form("loglevel=%d",kHLTLogWarning|kHLTLogError|kHLTLogFatal));

  pHLT->LoadComponentLibraries("libAliHLTUtil.so");
  pHLT->LoadComponentLibraries("libAliHLTMUON.so");

  // Build the DDL file publishers using AliRawReaderPublisher components.
  TString cmd;
  TString pubName;
  TString sources = "";


  for (Int_t i = 0; i < 20; ++i) {

    pubName.Form("pubDDL%d",i+1);
    sources += pubName + " ";

    Int_t ddlId = 2560+i;
    cmd.Form("-skipempty -minid %d -datatype 'DDL_RAW ' 'MUON'  -dataspec 0x%06x",ddlId,(1<<i));
    new AliHLTConfiguration(pubName.Data(),"AliRawReaderPublisher",NULL,cmd.Data());
  }

  AliHLTConfiguration digitLoader("digitLoader","MUONDigitLoader",sources.Data(),"-cdbpath local://$ALICE_ROOT/OCDB -run 0");

  AliHLTConfiguration preClustering("preClustering","MUONPreclusterFinder","digitLoader","-cdbpath local://$ALICE_ROOT/OCDB -run 0");

  AliHLTConfiguration clWriting("clWriting","MUONClusterWriter","preClustering","-datafile MUON.RecPoints.root");
}
```

So in that case the `recraw-local.C` should have the parameter `hltOptions` set to `chains=clWriting` (i.e. the "end-point" of the chain setup by the prior macro)

```c++
void recraw_local(const char   *filename="/alice/data/2011/LHC11h/000169099/raw/11000169099032.133.FILTER_RAWMUON_WITH_ALIPHYSICS_vAN-20150213.root",
		  const char *cdbURI="raw://",
		  int minEvent=-1,
		  int maxEvent=-1,
		  const char *modules="HLT",
		  const char *hltOptions="chains=clWriting ignore-hltout loglevel=0x7c",
		  const char *cdbDrain=NULL)
```

Worth noting as well is that the components used in the chain _must not_ try to set the default OCDB storage, as this is done already in the reconstruction.
