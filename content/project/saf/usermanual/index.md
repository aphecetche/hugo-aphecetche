---
layout: default
title: SAF3 quick-start documentation
---

## Connecting to SAF3

You need to use GSISSH to connect to nansafmaster3, i.e. you will connect using your grid certificate.

To get gsissh (and related commands), install the Globus Toolkit. [Version 6](http://toolkit.globus.org/toolkit/downloads/6.0/) has a Mac package.

Then define those two aliases in your .bashrc :

	alias gscp='gsiscp -S `which gsissh` -P 1975'
	alias gssh='gsissh -p 1975'

To connect to saf3, use :

	grid-proxy-init
	gssh nansafmaster3.in2p3.fr

This will work if your environment is OK. One sure way is to use Dario's script alice-env.sh to set it (whatever aliroot and/or aliphysics version)

Once you are in nansafmaster3, setup your env using :

	saf3-enter

the next steps are like on the [VCAF](https://dberzano.github.io/alice/vcaf/usersguide/). In a nutshell, once you have selected your AliPhysics (or AliRoot version) in ~/.vaf/vaf.conf, start a proof server :

	vafctl start

request some workers :

	vafreq 88

wait a bit for them to start :

	vafcount

then start a proof session :

	> root -b
	root[0] TProof::Open("pod://");
	root[1] .x runXXX.C

Your `runXXX.C` must Upload and Enable the special AliceVaf.par package (note that you can *not* use the same as for the VAF), like this :

```C++
TList *list = new TList();
list->Add(new TNamed("ALIROOT_EXTRA_LIBS", "OADB:ESD"));
list->Add(new TNamed("ALIROOT_ENABLE_ALIEN", "1"));

 TFile::Cp("https://github.com/aphecetche/aphecetche.github.io/blob/master/saf/saf3/AliceVaf.par?raw=true","AliceVaf.par");
gProof->UploadPackage("AliceVaf.par");
gProof->EnablePackage("AliceVaf");
```

## Getting files in and out from SAF3

You can of course simply use `gsiscp` if you're happy with that. But the usual way to work on an AF (well, at least that's the way I work)
typically involves having a text editor opened with at least the steering macro (`runXXX.C`) and the `AddTaskXXX.C`. Having to gsiscp those each time you make a modification is clearly unpractical, IMO.

A better option is to use `SSHFS` to mount your saf3 home on your local machine.

	sshfs -o ssh_command="gsissh -p1975" nansafmaster3.in2p3.fr:/home/username ~/saf3

and then you can access your files on saf3 (under $HOME/~saf3 in the example above) e.g. with your local editor.

## Datasets

The syntax for datasets is in principle the same as in SAF2, with a small temporary change (until the [root bug]( https://sft.its.cern.ch/jira/browse/ROOT-7703) is fixed), namely you have to add "Mode=cache" in the end of the query string. So, for the time being, the recommend procedure to work with a dataset is :

- connect to SAF2 master and issue there a ShowDataSet to check whether the dataset is staged (if not, request the staging from SAF2 as well)
- then connect to SAF3 and use the same query but with adding "Mode=cache"

Note that you can also use the recent interface method introduced to the `AliAnalysisManager` (commit a2d8ed5 to aliroot, Nov. 20th 2015) to use a `TFileCollection` directly (that _must_ be named "dataset"), e.g.

```C++
TFile* d = TFile::Open("dataset.root");
TFileCollection* fc = static_cast<TFileCollection*>(d->Get("dataset"));
...
mgr->StartAnalysis("proof",fc);
```

where the `dataset.root` might be created on SAF2 or manually.

## When things go wrong ...

You may want to inspect the log files from the Proof session. For this you need to :

1. take note of the condor master job id of your session, using condor_q
2. cd into an empty directory and use the following script to extract the logs : the first parameter is the id of step 1

```bash
#!/bin/bash

condorpid=$1

for archive in $(ls /tmp/pod-log-$USER/$condorpid/proof_log.*.tgz)
do
	tar -zvxf $archive --wildcards --no-anchored '*.log'
done

for log in $(find var -name *.log)
do
	cp $log .
done

#rm -rf var
```
