+++
author = "Laurent Aphecetche"
date = "2016-05-21T17:05:38+02:00"
description = ""
tags = [ "geek", "play", "docker" ]
title = "docker mac beta"
draft = true
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


