---
type: page
title: SAF3 User Manual
url: saf3-usermanual
aliases:
 - /saf/saf3
tags: [ saf" ]
---

# What is SAF ?

SAF3 is a [PoD](http://pod.gsi.de) Alice Analysis Facility, similar to the CERN [VCAF](https://dberzano.github.io/alice/vcaf/usersguide/), located in Subatech, Nantes, France.

Unlike the `VCAF`, `SAF` is relying on a physical cluster (not a virtual one), of 11 machines, with a dedicated storage of about 30 TB. Contrary to `VCAF` where the data is accessed directly through AliEn, on SAF data must be staged before it can be used.

Also unlike `VCAF`, access to `SAF` is not opened to anyone in Alice, but only to _selected_ people from the Muon community.

The underlying (to PoD) resource management system is [HTCondor](https://research.cs.wisc.edu/htcondor/).

> Support is based on best-effort only.
> If you have questions / issues, use the `alice-saf at subatech` mailing list.

# Using the SAF3

## Regular (aka manual) way

In this mode of operation you do connect to the SAF to perform your work.

You need to use GSISSH to connect to nansafmaster3, i.e. you will connect using your grid certificate.

To get gsissh (and related commands), install the Globus Toolkit. Note that [Version 6](http://toolkit.globus.org/toolkit/downloads/6.0/) has a Mac package, for instance.

Then define those two aliases in your .bashrc :

```bash
alias gscp='gsiscp -S `which gsissh` -P 1975'
alias gssh='gsissh -p 1975'
```

To connect to saf3, use :

```bash
grid-proxy-init
gssh nansafmaster3.in2p3.fr
```

This will work if your environment is OK. One sure way is to use Dario's script alice-env.sh to set it (whatever aliroot and/or aliphysics version)

Once you are in nansafmaster3, setup your env using :

```bash
saf3-enter
```

The next steps are like on the [VCAF](https://dberzano.github.io/alice/vcaf/usersguide/). In a nutshell, once you have selected your AliPhysics (or AliRoot version) in ~/.vaf/vaf.conf, start a proof server :

```bash
vafctl start
```

request some workers (note that each user can only have 88 condor jobs running at the same time)

```bash
vafreq 88
```

wait a bit for them to start and start a proof session :

```bash
vafwait 88 && root -b
```

```c++
root[0] TProof::Open("pod://");
root[1] .x runXXX.C
```

Your `runXXX.C` must Upload and Enable the special AliceVaf.par package (note that you can *not* use the same as for the VAF), like this :

```c++
TList *list = new TList();
list->Add(new TNamed("ALIROOT_EXTRA_LIBS", "OADB:ESD"));
list->Add(new TNamed("ALIROOT_ENABLE_ALIEN", "1"));

TFile::Cp("https://github.com/aphecetche/aphecetche.github.io/blob/master/saf/saf3/AliceVaf.par?raw=true","AliceVaf.par");
gProof->UploadPackage("AliceVaf.par");
gProof->EnablePackage("AliceVaf");
```

## Clever (aka automated) way

If you want to work completely from your local machine and be shielded from all the SAF3 details, have a look at the
[alice-analysis-utils](https://github.com/dstocco/alice-analysis-utils) developped by Diego Stocco.

## Getting files in and out from SAF3

If you work in the manual way you'll have to transfer files to/from the SAF3. You can of course simply use `gsiscp` if you're happy with that. But the manual way to work on an AF
typically involves having a text editor opened with at least the steering macro (`runXXX.C`) and the `AddTaskXXX.C`. Having to gsiscp those each time you make a modification is clearly unpractical.

A better option is to use `SSHFS` to mount your saf3 home on your local machine.

```bash
sshfs -o ssh_command="gsissh -p1975" nansafmaster3.in2p3.fr:/home/username ~/saf3
```

and then you can access your files on saf3 (under `$HOME/~saf3` in the example above) e.g. with your local editor.

> Please note that you should consider your home directory on SAF3 as a scratch, i.e. there's no guarantee about the lifetime of your files over there.

# Working with datasets

## Recommended way

Use the recent interface method introduced to the `AliAnalysisManager` (commit a2d8ed5 to aliroot, Nov. 20th 2015) to use a `TFileCollection` directly (that _must_ be named "dataset"), e.g.

```C++
TFile* d = TFile::Open("dataset.root");
TFileCollection* fc = static_cast<TFileCollection*>(d->Get("dataset"));
...
mgr->StartAnalysis("proof",fc);
```

where the `dataset.root` might be created in any way you like or obtained from someone else.

## Not recommended way

The syntax for datasets could in principle the same as in `VCAF`, but due to a [root bug]( https://sft.its.cern.ch/jira/browse/ROOT-7703) (fixed in root but not in alice/root), you have to add "Mode=cache" in the end of the query string. So, for the time being, the procedure to work with a dataset in that way is :

- connect to SAF2 master and issue there a ShowDataSet to check whether the dataset is staged (if not, request the staging from SAF2 as well)
- then connect to SAF3 and use the same query but with adding "Mode=cache"

This way of working must be used with _great care_ as if you make a mistake you might actually trigger a (potential large) staging...

# When things go wrong ...

## Condor basics

The Proof jobs are ran by Condor so you can actually use basic condor commands to interact with your jobs in case of problems.

For instance, look at the jobs :

```bash
condor_q

 ID      OWNER            SUBMITTED     RUN_TIME ST PRI SIZE CMD
2428.0   user        3/30 11:25   0+00:09:17 R  0   0.3  PoDWorker.sh
2428.1   user        3/30 11:25   0+00:09:17 R  0   0.3  PoDWorker.sh
2428.2   user        3/30 11:25   0+00:09:17 R  0   0.3  PoDWorker.sh
2428.3   user        3/30 11:25   0+00:09:17 R  0   0.3  PoDWorker.sh
2428.4   user        3/30 11:25   0+00:09:17 R  0   0.3  PoDWorker.sh
```

Only your jobs :

```bash
condor_q -submitter user
```

Kill your jobs :

```bash
condor_rm JID
```

where `JID` is the masterjob id (part before the dot in the `ID` column of `condor_q` printout, ie.g. `2428` in the example above).

## Condor logs

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
