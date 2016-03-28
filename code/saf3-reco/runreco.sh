#!/bin/bash

echo $(pwd)
echo $(uname -a)

rm -rf *.ps *.root *.log *.out.* *.err.*

ls -alR

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

