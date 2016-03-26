---
layout: post
title: V0 performance
date: 2015-07-15
---

Started with a mail from Cvetan : "In order to assess the V0 performance one has to look at the single and di-muon spectra taken with C0M* and CM*7, both with and without phys selection, and for each beam-beam BC separately. Who can produce these?"

## Run 230301 - Fill 3992 - 50ns_476b_414_32_397_72bpi10inj

Dumb method : run once the `AliAnalysisMuMuGlobal` to get the BCX histogram to know the bunch crossing numbers  : bunch-crossing IDs = 2404, 2406, 2408 .. 2462 (train, 30 bunches) and 2472 and 2474.

Then add an event selection IsBCX method to `AliAnalysisMuMuGlobal` :

	Bool_t AliAnalysisMuMuGlobal::IsBCX(const AliVEvent& event, const Int_t bunchCrossingNumber) const
	{
 	 return Event()->GetBunchCrossNumber() == bunchCrossingNumber;
	}

	void AliAnalysisMuMuGlobal::NameOfIsBCX(TString& name, const Int_t bunchCrossingNumber) const
	{
  	name.Form("BCX%d",bunchCrossingNumber);
	}

And use it in the AddTaskMuMuMinv... Seems to bog down the SAF => too much memory used ?

So instead I'm adding histograms per BCX,  for a given event selection (i.e. either physics selected or not)... => a bit more intrusive in the code itself (AliAnalysisMuMuSingle.cxx), but it's working fine...

    TH1* h = Histo(eventSelection,triggerClassName,centrality,trackCutName,Form("PtEtaMu%s",charge.Data()));

    h->Fill(p.Eta(),p.Pt());

    TH1* hbcx = Histo(eventSelection,triggerClassName,centrality,trackCutName,Form("PtEtaMu%sBCX%d",charge.Data(),Event()->GetBunchCrossNumber()));

    if (!hbcx)
    {
      hbcx = static_cast<TH1*>(h->Clone(Form("PtEtaMu%sBCX%d",charge.Data(),Event()->GetBunchCrossNumber())));
      HistogramCollection()->Adopt(Form("/%s/%s/%s/%s",eventSelection,triggerClassName,centrality,trackCutName),hbcx);
    }

## Results : CMUL7 / C0MUL

![BCX ratio for sRABSETA tracks in all events](/images/lhc15g/jul-10/bcxtrackratio-all.png)
![BCX ratio for sRABSETA tracks in V0BB events](/images/lhc15g/jul-10/bcxtrackratio-v0bb.png)
![ratio of pT spectra for sRABSETA tracks in all events](/images/lhc15g/jul-10/pttrackratio-all.png)
![ratio of pT spectra for sRABSETA tracks in V0BB events](/images/lhc15g/jul-10/pttrackratio-v0bb.png)

where V0BB is a VZERO-only physics selection :

	Bool_t AliAnalysisMuMuGlobal::IsV0BB(const AliVEvent& event) const
	{
  	return
  	Event()->GetVZEROData()->GetV0ADecision() == AliVVZERO::kV0BB &&
  	Event()->GetVZEROData()->GetV0CDecision() == AliVVZERO::kV0BB ;
	}

The conclusion is that the effect (on physics selected events) is small (1-2%) and not BCX-dependent (at least < 1%)
