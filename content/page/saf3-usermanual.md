---
type: page
title: SAF3 User Manual
url: saf3-usermanual
aliases:
 - /saf/saf3
tags: [ saf" ]
date: "2015-10-15"
lastmod: "2016-04-06"
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

TFile::Cp("https://github.com/aphecetche/aphecetche.github.io/blob/master/page/saf3-usermanual/AliceVaf.par?raw=true","AliceVaf.par");
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

## Datasets basics

The dataset used on SAF3 are so called _dynamic datasets_, i.e. what they really are *queries* (strings) to the alien central catalog.

```
Find;FileName=AliAOD.Muons.root;BasePath=/alice/data/2011/LHC11h/000169838/ESDs/pass2_muon/AOD119
```

The query string must start with `Find;`. It must include the two keywords `FileName` (file to look for) and `BasePath` (where to start the search in the alien catalog). Mind the fact that keywords are case sensitive. In addition the query string can optionally include more keywords :

- `Tree` : the name of the tree in the file
- `Anchor` : the name of the anchor in case the FileName is Root archive


To speed up things the result of the alien query is cached, so not all queries actually go to the alien catalog. How long a query is cached is a parameter of SAF3 and is currently set to 30 days.

To look at a dataset use the `gProof->ShowDataSet` command in your proof session :

```c++
root[1] gProof->ShowDataSet("Find;FileName=AliAOD.Muons.root;BasePath=/alice/data/2011/LHC11h/000169838/ESDs/pass2_muon/AOD119");
```

The first time you issue this command it might take some time (as an actual connection to the alien central catalog is made), but subsequent calls should return immediately as the information is retrieved from the local cache. The command displays the files referenced by the query, their sizes, their staging and corruption status, as well as the total number of files and total size.

```
 #. SC | Entries | Size       | URL
 1. Sc | n.a.    |   73.1 MiB | root://nansaf08.in2p3.fr//alice/data/2011/LHC11h/000169838/ESDs/pass2_muon/AOD119/0001/AliAOD.Muons.root
       |         |            | root://nansafmaster2.in2p3.fr//alice/data/2011/LHC11h/000169838/ESDs/pass2_muon/AOD119/0001/AliAOD.Muons.root
       |         |            | alien:///alice/data/2011/LHC11h/000169838/ESDs/pass2_muon/AOD119/0001/AliAOD.Muons.root
 2. Sc | n.a.    |   73.0 MiB | root://nansaf10.in2p3.fr//alice/data/2011/LHC11h/000169838/ESDs/pass2_muon/AOD119/0002/AliAOD.Muons.root
       |         |            | root://nansafmaster2.in2p3.fr//alice/data/2011/LHC11h/000169838/ESDs/pass2_muon/AOD119/0002/AliAOD.Muons.root
       |         |            | alien:///alice/data/2011/LHC11h/000169838/ESDs/pass2_muon/AOD119/0002/AliAOD.Muons.root
...
>> There are 32 file(s) in dataset: 32 (100.0%) matched your criteria (SsCc)
>> Total size    : 1.2 GiB
>> Staged (S)    :  96.9 %
>> Corrupted (C) :   0.0 %
>> Default tree  : (no default tree)       
```

In the table above the first column will indicate the status of the file :

- s (lower case S letter) means the file is *not* staged
- S (upper case S letter) means the file *is* staged
- c (lower case C letter) means the file is *not* corrupted (and/or not staged)
- C (upper case C letter) means the file *is* corrupted

The second column gives the number of entries in the tree (if available, i.e. if the file is not staged it cannot be opened to read the tree so that information can not be accessible), the third gives the file size (available in any case as this information is part of the catalog), and the fourth one gives the URLs of the file. The last URL is always the alien path : it is the "raw" result of the query, so to speak. The first URL is the actual path on the SAF. If it's starting with the master URL then it means the file is *not* staged (yet). The hostname of a staged file would be that of one of the servers (nansafXXX)
Note that the local URLs (if the file is staged) can be used to access the file locally (meaning the SAF3 itself, or any machine in the Subatech intranet) from your Root session  :

```
root [6] TFile* f = TFile::Open("root://nansafmaster2.in2p3.fr//alice/data/2011/LHC11h/000169838/ESDs/pass2_muon/AOD119/0002/AliAOD.Muons.root");
root [7] f->ls();
TXNetFile**		root://nansafmaster2.in2p3.fr//alice/data/2011/LHC11h/000169838/ESDs/pass2_muon/AOD119/0002/AliAOD.Muons.root
 TXNetFile*		root://nansafmaster2.in2p3.fr//alice/data/2011/LHC11h/000169838/ESDs/pass2_muon/AOD119/0002/AliAOD.Muons.root
  KEY: TProcessID	ProcessID0;1	1a0d9078-447a-11e2-9717-2eaa8e80beef
  KEY: TTree	aodTree;3	AliAOD tree
  KEY: TTree	aodTree;2	AliAOD tree
```

## Saving a dataset for later use

You will probably need to _save_ the dataset itself in Root format in order to use it later on (see below). That's easy enough as a dataset is a `TFileCollection` object. The only requirement to be able to use it in your analysis is that it must have a name of `dataset`.

```
root[1] TFileCollection* fc = gProof->GetDataSet("Find;FileName=AliAOD.Muons.root;BasePath=/alice/data/2011/LHC11h/000169838/ESDs/pass2_muon/AOD119");
root[2] fc->Print();
TFileCollection  -  contains: 32 files with a size of 1293148706 bytes, 96.9 % staged - default tree name: '(null)'
root[3] fc->Print("f"); // to show list of files
root[4] TFile* save = TFile::Open("mydata.root","recreate");
root[5] fc->Write("dataset");
root[6] save->Close();
```

## Using datasets

### Recommended way

Use the recent interface method introduced to the `AliAnalysisManager` (commit a2d8ed5 to aliroot, Nov. 20th 2015) to use a `TFileCollection` directly (that _must_ be named "dataset"), e.g.

```C++
TFile* d = TFile::Open("dataset.root");
TFileCollection* fc = static_cast<TFileCollection*>(d->Get("dataset"));
...
mgr->StartAnalysis("proof",fc);
```

where the `dataset.root` might be created in any way you like (see [above](#saving-a-dataset-for-later-use) for instance) or obtained from someone else.

### Not recommended way

The syntax for datasets could in principle the same as in `VCAF`, but due to a [root bug]( https://sft.its.cern.ch/jira/browse/ROOT-7703) (fixed in root but not in alice/root), you have to add "Mode=cache" in the end of the query string. So, for the time being, the procedure to work with a dataset in that way is :

- connect to SAF2 master and issue there a ShowDataSet to check whether the dataset is staged (if not, request the staging from SAF2 as well)
- then connect to SAF3 and use the same query but with adding "Mode=cache"

This way of working must be used with _great care_ as if you make a mistake you might actually trigger a (potential large) staging...

## Available datasets

The disadvantage of dynamic datasets is that we don't have a central place with the list of the available datasets to be used...

But what we have is a script is in place to generate, at a given frequency (once per day), [HTML reports](https://nansafmaster2.in2p3.fr "saf disk reports") of the data sitting on SAF3 disks.

When the data you want to use is not available, you'll have to request a staging for it. You can do it all by yourself (see next sections) or ask for help (send a mail to `alice-saf at subatech dot in2p3 dot fr`).

## Staging datasets

### Requesting the staging

The actual staging request can be performed in two ways (basic and libmyaf), see the next two sections below. In both cases, please assess first the total size of the data you request. Then use common sense as to which size is reasonable or not, baring in mind that the total available storage space on SAF3 is about 30 TB.

> For the time being, due to a bug in the versions of Root we currently use, the
staging can *not* be done from SAF3 directly, you'll have to go through the previous
incarnation, that is SAF2 (i.e. `nansafmaster2` instead of `nansafmaster3`)

#### Basic method

This method is the most direct one, but also probably the most cumbersome one. Nevertheless it's good to know and will certainly help if the following method (AF class) does not work for some reason...

First thing is to construct a query string for the data you want to stage. The query string closely ressembles what you would use directly from alien to search for files :

```c++
const char* query = "Find;FileName=AliAOD.Muons.root;BasePath=/alice/data/2011/LHC11h/000169838/ESDs/pass2_muon/AOD119";
```

Then, before requesting an actual staging, it's always a good idea to see if your query returns the list of files you expected :

```c++
gProof->ShowDataSet(query);
```

which should bring you (immediately or after some delay, depending on the cache status) a list of the files corresponding to your query.

Once you're happy with the list of files returned by your query, you can actually ask for the staging :

```c++
gProof->RequestStagingDataSet(query);
```

You can then monitor the progress using :

```c++
gProof->ShowStagingStatusDataSet(query,opt);
```

where `opt` can be "" (by default) or `"C"` to show files marked as corrupted, or `"Sc"` to show files that have been staged and are not corrupted, for instance.

Note that with a recent enough Root version (>= 5.34/18), the query string can also contain the keyword `ForceUpdate` (case sensitive, as the other keywords) to force the query to actually go to the catalog (and refresh the status of the local files) whatever the cache status is.

#### The libmyaf method

Using the `myaf` library can make the staging somewhat easier, in particular if you are dealing with run lists. Note there's nothing in that library that you cannot do using the basic commands above. It's just supposed to be more user friendly, by constructing the query string for you and looping over a run list.

##### installing libmyaf

The code is kept in GitHub. You can obtain it using `git clone https://github.com/aphecetche/aafu.git`.
In the code directory, just do `make`.
This will create both a `libmyaf.so` library and a `myaf` executable.

##### using libmyaf

Start root and load the `libmyaf.so`library (note that if you start `root` from the code directory, the `rootlogon.C` found there will be used and it is already loading the `libmyaf.so` library for you).

Then create an object of class VAF :

```c++
VAF* vaf = VAF::Create("saf2");
```

the parameter is the name of the analysis facility you want to deal with. It will only work if you have in your `$HOME` directory a `.aaf` file which define a number of variables for the relevant analysis facility. For instance :

```
saf2.user: yourusername
saf2.master: nansafmaster2.in2p3.fr
saf2.dynamic: true
saf2.home: /home/PROOF-AAF
saf2.log: /var/log
saf2.datadisk: /data
```

Then the key method of the `VAF` class is `CreateDataSets(whichRuns, dataType,esdPass,aodPassNumber,basename)` where :

- whichRuns is either a single runNumber (integer) or the name of a text file containing one run number per line
- dataType (case insensitive) tells which type of data is to be staged. The following are recognized currently :
	-  *stat* -> [EventStat_temp.root]
  	- *zip* -> [root_archive.zip] or [aod_archive.zip]
  	- *esd* -> [AliESDs.root]
    - *esd_outer* -> [AliESDs_Outer.root]
   	- *esd_barrel* -> [AliESDs_Barrel.root]
  	- *aod* -> [AliAOD.root]
  	- *aodmuon* -> [AliAOD.Muons.root]
  	- *aoddimuon* -> [AliAOD.Dimuons.root]
  	- *esd.tag* -> [ESD.tag]
  	- *raw* -> [raw data file]
 - esdPass is the reconstruction pass (e.g. muon_pass2)
 - aodPassNumber is the filtering pass number :
		- < 0 to use AODs produced during the reconstruction stage (1 per original ESDs)
		- = 0 to use the merged version of the AODs produced during the reconstruction stage (1 per several original ESDs
		- > 0 to indicate a filtering pass
- basename is the alien path of where to start looking for the data, generally of the form /alice/data/year/period/ESDs/... The more specific you can be with that basename, the faster the alien catalog query will be. That basename is sometimes a bit tricky to get right, so please see the examples below.

Note that by default the AF class is in "dry" mode, so the CreateDataSets method will _not_ actually create a dataset but show you what would be staged if we were not in dry mode. Once happy with the returned list of files, you can go for the real thing.

For instance, to create a dataset with all the muon AODs for run 197341 (period LHC13f) you would do :

```c++
// see if we get the expected list of files
root [1] vaf->CreateDataSets(197341,"aodmuon","muon_pass2",0,"/alice/data/2013/LHC13f");
Starting master: opening connection ...
Starting master: OK                                                 
PROOF set to sequential mode
Find;BasePath=/alice/data/2013/LHC13f/000197341/ESDs/muon_pass2/AOD/	*;FileName=AliAOD.Muons.root;Tree=/aodTree
TFileCollection  -  contains: 38 files with a size of 145870354 bytes, 0.0 % staged - default tree name: '/aodTree'
The collection contains the following files:
Collection name='THashList', class='THashList', size=38
root://nansafmaster2.in2p3.fr//alice/data/2013/LHC13f/000197341/ESDs/muon_pass2/AOD/001/AliAOD.Muons.root -|-|- feeb35f2b70df1de8535c93398efaf33
root://nansafmaster2.in2p3.fr//alice/data/2013/LHC13f/000197341/ESDs/muon_pass2/AOD/002/AliAOD.Muons.root -|-|- f1c14dd02a07164fc8e25af8778550a5
root://nansafmaster2.in2p3.fr//alice/data/2013/LHC13f/000197341/ESDs/muon_pass2/AOD/003/AliAOD.Muons.root -|-|- 86715f3f3716b41c16eb6089b3cb5207
root://nansafmaster2.in2p3.fr//alice/data/2013/LHC13f/000197341/ESDs/muon_pass2/AOD/004/
etc...
nruns=1 nfiles = 38 | size =    0.14 GB
```

Note that in the first lines you get the query that is used internally, as in the basic method above

You might see a bunch of those messages : "Srv err: No servers have the file" : they are harmless.

Once the list of file is ok, you switch to "do-something-for-real" mode :

```c++
vaf->DryRun(false);
// do it for real
vaf->CreateDataSets(197341,"aodmuon","muon_pass2",0,"/alice/data/2013/LHC13f");
```

And you should see a line indicating the _request_ has been issued :

```bash
Mst-0 | Info in <TXProofServ::HandleDataSets>: Staging request registered for Find;BasePath=/alice/data/2013/LHC13f/000197341/ESDs/muon_pass2/AOD/*;FileName=AliAOD.Muons.root;Tree=/aodTree
```

### Monitoring staging progress

Directly from root you can, given a query string, ask what is the status of that query :

```bash
gProof->ShowStagingStatusDataSet("Find;BasePath=/alice/data/2013/LHC13f/000197341/ESDs/muon_pass2/AOD/*;FileName=AliAOD.Muons.root;Tree=/aodTree")
```

This information is only available during the staging and a little while after it has been completed. Once the staging is completed you can use `gProof->ShowDataSet()` to e.g. list corrupted files, if any.

Another way to see if something is actually happening is to look at the stager daemon log using the myaf program.

### myaf program

The little utility program `myaf` will help you perform some operations on an AF.  Like libmyaf there's nothing magic in it, it's just for convenience.

```bash
> myaf
Usage : myaf aaf command [detail]
- aaf is the nickname of the AAF you want to connect to (must be including in the $HOME/.aaf configuration file)
- command is what you want myaf to do :
-- reset [hard] : reset the AF
-- ds pattern : show the list of dataset(s) matching the pattern
-- showds : show the content of one dataset (or several if option is the name of a text file containing the IDs of datasets)
-- clear : clear the list of packages from the user
-- packages : show the list of available packages
-- stagerlog : (advanced) show the logfile of the stager daemon
-- df : (advanced) get the disk usage on the AF
-- xferlog filename : (advanced) get the log of a failed transfer
-- conf : (advanced) show the configuration files of the AF
```

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
