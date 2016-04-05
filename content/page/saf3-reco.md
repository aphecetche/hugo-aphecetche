---
type: page
title:  Reconstruction on SAF
url: saf3-reco
aliases:
 - saf/saf3reco
notoc: true
---

Warning : this is not for general use ! The scripts below are just given as examples and are not supposed to work out-of-the-box !

The idea here is to use the SAF3 batch system (condor) to do reconstruction on previously staged (filtered) raw data.

For that the following [condor job](/page/saf3-reco/recojob.condor) is used :

```bash
recodir=$ENV(HOME)/reco/LHC15m

universe=vanilla
executable=$(recodir)/runreco.sh
Notification = Never
Output        = runreco.out
Error         = runreco.err
Log           = runreco.log
should_transfer_files = YES
when_to_transfer_output = ON_EXIT
rank = -SlotID
transfer_input_files = $(recodir)/runDataReconstruction.C, $(recodir)/OCDB
include : $(recodir)/list-input.sh |
```

The reconstruction macro to be used should be in [$HOME/reco/runDataReconstruction.C](/page/saf3-reco/runDataReconstruction.C) and you can possibly use your own OCDB for specific storage (in this example MUON/Calib/RecoParam) on top of the normal OCDB which is taken from cvmfs.

The last line is probably the most important as it's the one which is actually queuing the jobs.

```bash
for file in $(cat filelist.txt)
do
 	search="/alice/data"
  	a=$(expr match "$file" ".*$search")
  	search="FILTER"
  	b=$(expr match "$file" ".*$search")
  	dir=${file:a+1:b-a - $(expr length "$search")-2}
  	search="raw"
  	d=$(expr match "$file" ".*$search")
  	desc=${file:d+12:b-d-13 - $(expr length "FILTER")}
  	mkdir -p $dir
  	if [ ! -e $dir/runreco.log ]; then
  		echo "initialdir = "$(pwd)"/$dir"
  		echo "arguments = $file $dir"
    	echo "description=$desc"
  		echo "queue"
  	fi
done
```

The input to [list-input.sh](/page/saf3-reco/list-input.sh) is a filelist.txt containing the list of input raw files, e.g.

```Text
	root://nansaf01.in2p3.fr//alice/data/2013/LHC13d/000195767/raw/13000195767000.10.FILTER_RAWMUON_WITH_ALIPHYSICS_v5-06-04-01.root
	root://nansaf05.in2p3.fr//alice/data/2013/LHC13d/000195767/raw/13000195767000.11.FILTER_RAWMUON_WITH_ALIPHYSICS_v5-06-04-01.root
	root://nansaf09.in2p3.fr//alice/data/2013/LHC13d/000195767/raw/13000195767000.12.FILTER_RAWMUON_WITH_ALIPHYSICS_v5-06-04-01.root
	root://nansaf07.in2p3.fr//alice/data/2013/LHC13d/000195767/raw/13000195767000.13.FILTER_RAWMUON_WITH_ALIPHYSICS_v5-06-04-01.root
```

The list-input.sh script will loop on those file and for each will create a local directory to store (temporarily) the output of the reconstruction of that file. Note that if the directory already exists and already contains a runreco.log that file is skipped. And for each file a queue instruction will be added to the condor job description file.

Then you simply do `condor_submit recojob.condor` which will submit as many jobs as there are files in the `filelist.txt`. Note that only 88 jobs are allowed to be running at the same time for a given user, though. Meaning that you can have a very long queue of idle jobs, but only 88 running concurrently.

As the output of the reconstruction is potentially large, the `runreco.sh` script below is copying the output of each job to the SAF3 storage.

```bash

source /cvmfs/alice.cern.ch/etc/login.sh

source `which alienv` setenv VO_ALICE@AliRoot::v5-07-08-1

aliroot -b -q runDataReconstruction.C\(\"$1\"\) 2>&1 | tee rundatareco.log

zip -n root root_archive *.root
zip log_archive rundatareco.log

xrdcp root_archive.zip root://nansafmaster2.in2p3.fr//PWG3/laphecet/$2/root_archive.zip

echo "Copying root archive to root://nansafmaster2.in2p3.fr//PWG3/laphecet/$2/root_archive.zip"

if [ $? -eq 0 ]; then
		echo "Successfully copied root archive to root://nansafmaster2.in2p3.fr//PWG3/laphecet/$2/root_archive.zip"
		rm -f *.root root_archive.zip
else
		echo "Could not copy output root archive !!!"
fi

xrdcp log_archive.zip root://nansafmaster2.in2p3.fr//PWG3/laphecet/$2/log_archive.zip

echo "Copying log archive to root://nansafmaster2.in2p3.fr//PWG3/laphecet/$2/log_archive.zip"

if [ $? -eq 0 ]; then
		echo "Successfully copied log archive to root://nansafmaster2.in2p3.fr//PWG3/laphecet/$2/log_archive.zip"
		rm -f rundatareco.log log_archive.zip
else
		echo "Could not copy output log archive !!!"
fi
rm -f syswatch* *.ps
```

### Checklist

In the scripts you'll have to change a few things.

- in runreco.sh :  the output destination to reflect your group/username, as well as the AliRoot version to be used.
- in recojob.condor : the top directory (recodir)
- in runDataReconstruction.C : whatever change to the reconstruction you'd like to perform

Note also that the reco is meant to run from the cvmfs OCDB, as there's no handling of the alien token whatsoever...
