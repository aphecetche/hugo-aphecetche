---
title: O2 - Creating MCH digit files from filtered RAW data
date: "2016-03-13"
tags: [ "o2","hlt","aliroot","raw","digits","saf","condor" ]
---

First, get the code from AliRoot (feature-muonhlt) branch in MUON/MUON2 directory, and put it on SAF3

```bash
sshfs -o ssh_command="gsissh -p1975" nansafmaster3.in2p3.fr:/home/laphecet ~/saf3
mkdir -p $HOME/saf3/o2
cp $ALICE_ROOT/../src/MUON/MUONO2/O2Muon.* $HOME/saf3/o2
```

Check on SAF3 that the code is compiling under Root :

```bash
saf3-enter
root
```

```c++
gSystem->SetIncludePath("-I$ALICE_ROOT/include");
.L O2Muon.cxx++
```

And test on a single file that the code is behaving as expected :

```bash
echo "root://nansafmaster2//alice/data/2011/LHC11h/000169099/raw/11000169099032.133.FILTER_RAWMUON_WITH_ALIPHYSICS_vAN-20150213.root" > input.txt
```

```c++
gSystem->SetIncludePath("-I$ALICE_ROOT/include")
.L O2Muon.cxx++
O2Muon o2m("local:///cvmfs/alice-ocdb.cern.ch/calibration/data/2011/OCDB");
o2m.makeDigitFiles("input.txt","CPBI2_B1-B-NOPF-ALLNOTRD",true);
```

Then use `condor` for the heavy lifting. Prepare a file list for a given run or part of it, in a file ending with the extension `.list`

```
root://nansafmaster2//alice/data/2011/LHC11h/000169099/raw/11000169099032.133.FILTER_RAWMUON_WITH_ALIPHYSICS_vAN-20150213.root
root://nansafmaster2//alice/data/2011/LHC11h/000169099/raw/11000169099063.163.FILTER_RAWMUON_WITH_ALIPHYSICS_vAN-20150213.root
root://nansafmaster2//alice/data/2011/LHC11h/000169099/raw/11000169099065.113.FILTER_RAWMUON_WITH_ALIPHYSICS_vAN-20150213.root
root://nansafmaster2//alice/data/2011/LHC11h/000169099/raw/11000169099054.124.FILTER_RAWMUON_WITH_ALIPHYSICS_vAN-20150213.root
root://nansafmaster2//alice/data/2011/LHC11h/000169099/raw/11000169099060.150.FILTER_RAWMUON_WITH_ALIPHYSICS_vAN-20150213.root
root://nansafmaster2//alice/data/2011/LHC11h/000169099/raw/11000169099065.166.FILTER_RAWMUON_WITH_ALIPHYSICS_vAN-20150213.root
...
```

Use the following `makedigits.condor` file :

```bash
universe=vanilla

executable=$ENV(HOME)/o2/makedigits/makedigits.sh

# Don't send annoying email notifications
Notification = Never

# stdout and stderr of PoD jobs
Output        = makedigits.out
Error         = makedigits.err
Log           = makedigits.log

# we want to transfer files
should_transfer_files = YES
when_to_transfer_output = ON_EXIT

rank = -SlotID

Input = $ENV(HOME)/.PoD/user_worker_env.sh

include : $ENV(HOME)/o2/makedigits/list-input.sh |
```

where the `list-input.sh` script is generating the `queue` commands from any file with extension `.list`. In that file you might want to change the `ninput` parameter which decide how many files you will process per condor job.

```bash

# split by chunks of n raw files
ninput=50

for file in $(ls $HOME/o2/makedigits/*.list)
do

	n=0
	index=0

	f=$(basename $file)

	mkdir -p $HOME/o2/makedigits/$f.dir

	cd $HOME/o2/makedigits/$f.dir
	rm -rf input.*

	for l in $(cat $file)
	do
		echo $l >> input.$index
		(( n += 1))
		if (( $n % $ninput == 0 ))
		then
			echo "transfer_input_files=\$ENV(HOME)/o2/makedigits/$f.dir/input.$index,\$ENV(HOME)/o2/O2Muon.cxx,\$ENV(HOME)/o2/O2Muon.h"
			echo "arguments = input.$index"
			echo "queue"
			(( index +=1 ))
			n=0
		fi
	done
done

if (( $n > 0 && $n < $ninput ))
then
	echo "transfer_input_files=\$ENV(HOME)/o2/makedigits/$f.dir/input.$index,\$ENV(HOME)/o2/O2Muon.cxx,\$ENV(HOME)/o2/O2Muon.h"
	echo "arguments = input.$index"
	echo "queue"
fi
```

And finally the script doing the job, `makedigits.sh`, which is using the `O2Muon` class from AliRoot/MUON/MUONo2 package.

```bash
#!/bin/bash

source  /cvmfs/alice.cern.ch/etc/login.sh
source `which alienv` setenv VO_ALICE@AliRoot::v5-08-02-1

alienv list

echo "arg=$1"

pwd
ls -al

  root -b << EOF
    gSystem->SetIncludePath("-I$ALICE_ROOT/include");
    .L O2Muon.cxx++
    O2Muon o2m("local:///cvmfs/alice-ocdb.cern.ch/calibration/data/2011/OCDB");
    o2m.makeDigitFiles("$1","CPBI2_B1-B-NOPF-ALLNOTRD",true);
    .q
EOF
```
