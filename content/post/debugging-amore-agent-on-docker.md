---
title: Debugging an Amore agent on Docker
date: "2017-04-11"
lastmod: "2017-04-11"
draft: "true"
tags: [ "aliroot","dqm","deroot","online","docker" ]
---

Massimiliano noticed on 2017 April 9th that the `amoreMCHQAshifter` agent 
started to show, on the
[ readout error plot ]( https://alice-logbook.cern.ch/logbook/download.php?p_downtarg=dqmimg&p_run=268552&p_dqmagent=MCHQAshifter) a negative number of "not readout
buspatch" (which is obviously impossible), followed, in some other runs, by
 the same number being around 90% (also highly unlikely).

In order to debug this, I asked him to take a standalone run (268552) with recording on,
so it can be investigated offline. That (short) run is worth 75 files, that I 
downloaded on my Mac. 

To debug the issue the idea would be to be able to feed the local amore docker setup
with all the data from those 75 files. The trick used for developping the
[BPEVODA](http://aphecetche.github.io/2015/09/08/mch-bpevo-da/) with
named unix pipes does not fly here as the named pipes are not (yet ?) supported in
 docker for mac.

 The other option found on various forum is to let the [socat](http://www.dest-unreach.org/socat/) utility convert 
 named pipes into TCP connections.

 That way, I add a container in the setup, called a `feeder`, which purpose is
 to read raw data in root format from a collection of `*.root` file and convert
 it into raw DATE format : 

 ```
 deroot collection://filelist.txt /tmp/derootout
 ```

 The `derootout` is a named pipe created beforehand using : 

 ```
 mkfifo /tmp/derootout
 ```

 The `socat` utility "publishes" in a way the pipe as a TCP server of sort :

 ```
 socat TCP-LISTEN:1234 PIPE:/tmp/derootout &
 ```

 Meaning that now if someone connects to port `1234` of the feeder machine (container)
  it will be able to read (and write, but that's not the point here...) from the pipe.

That connecting machine would then do the reverse operation, i.e. convert the TCP
 connection into a named pipe, from which a regular amore agent can run :


```
mkfifo /tmp/derootin
socat PIPE:/tmp/derootin TCP:feederIP:1234 &
amoreAgent ... -s /tmp/derootin
```
