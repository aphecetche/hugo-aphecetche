+++
author = "Laurent Aphecetche"
date = "2016-05-21T17:05:38+02:00"
lastmod = "2016-05-30T09:59:00+02:00"
description = ""
tags = [ "geek", "play", "docker" ]
title = "Docker Mac Beta"
+++

# Access to Docker server

To access to the underlying VM (Alpine Linux), use : 

```
screen ~/Library/Containers/com.docker.docker/Data/com.docker.driver.amd64-linux/tty 
```

And hit enter to get to the login.
Username is root and no password...

Which I aliases do `dvm`

That way one can peek to the volumes for instance (under `/var/lib/docker/volumes`)...

# Getting list of dangling volumes

(volumes that used to be attached to now deleted containers)

```
docker volume ls -qf dangling=true
```

And to get rid of those simply use : 

```
docker volume rm $(docker volume ls -qf dangling=true)
```

# Not enough disk space...

In order to build e.g. Root6 within a container, the default 20 GB of the xhyve VM (from Docker Mac Beta) seems to be insufficient...

Using the information from that [post from the docker mac beta forum](https://forums.docker.com/t/consistently-out-of-disk-space-in-docker-beta/9438/9) I was able to increase the size to 30 GB. It's a two stage process :  first increase the size of the VM image and then resize the filesystem from within the VM. 

```
qemu-img resize Docker.qcow2 +10G
```

```
qemu-system-x86_64 -drive file=Docker.qcow2 -cdrom $HOME/Downloads/gparted-live-0.26.0-2-i686.iso -boot d -m 512 -device usb-mouse -usb
```

(and from parted, just let the docker partition take all the available space)


