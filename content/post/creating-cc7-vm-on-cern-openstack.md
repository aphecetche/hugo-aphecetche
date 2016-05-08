+++
author = "Laurent Aphecetche"
date = "2016-04-07T18:03:46+02:00"
description = ""
tags = [ "geek", "cern", "lxplus", "openstack", "cloud" ]
title = "Creating a CC7 VM on CERN OpenStack"
draft = true
+++

Tried today to create a VM on CERN OpenStack, using the [CERN openstack doc](https://clouddocs.web.cern.ch/clouddocs) to get acquainted with the process and
 get a CentOS7 build machine at hand as well...

The hostname of that VM is `laphecet-cc7.cern.ch`.

I've added it to my `$HOME/.ssh/config` to get an easy connection to it.

```
Host laphecet-cc7
  HostName laphecet-cc7.cern.ch
  User laurent
  ProxyCommand ssh laphecet@lxplus.cern.ch -W %h:%p
```

The first step was to `adduser laurent` and get it in the sudoers list with `sudo gpasswd -a laurent wheel`.

Then got some dev tools :

```
yum install git
yum install gcc
```

Then followed the [`alibuild`](https://indico.cern.ch/event/508147/session/5/contribution/7/attachments/1250734/1844016/2016-offline-week-alibuild.pdf) from the last offline week to install aliroot on that machine.

```
pip install alibuild
mkdir -p o2/o2work
git clone https://git.cern.ch/reps/AliRoot
aliBuild build AliRoot
```

and that did not work...

Let's come back to this a little bit later on...
