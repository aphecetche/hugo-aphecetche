+++
author = "Laurent Aphecetche"
date = "2017-12-10"
description = ""
tags = [ "geek", "vmware", "network" ]
title = "VMWare Fusion Network Setup"
+++

To setup MAC reservations, modify end of the VMWare `dhcpd.conf` file :



```
> sudo vim /Library/Preferences/VMware Fusion/vmnet8/dhcpd.conf
host slc6 {  
        hardware ethernet 00:0C:29:FA:9C:72;
        fixed-address 172.16.66.142;
}
host macos {
       hardware ethernet 00:0C:29:B7:2F:64; 
       fixed-address 172.16.66.243;
}
```

(the hardware ethernet is to be found under "Network card" parameter window of
the virtual machine).

Then use `$HOME/Scripts/vmware-restart-network.sh` : 

```
sudo /Applications/VMware\ Fusion.app/Contents/Library/vmnet-cli  --configure  
sudo /Applications/VMware\ Fusion.app/Contents/Library/vmnet-cli  --stop
sudo /Applications/VMware\ Fusion.app/Contents/Library/vmnet-cli  --start
```

And add a convenience alias in `/etc/hosts` :

```
> sudo vim /etc/hosts
##  
# Host Database  
#  
# localhost is used to configure the loopback interface  
# when the system is booting.  Do not change this entry.  
##  
127.0.0.1 localhost  
255.255.255.255 broadcasthost  
::1             localhost  
fe80::1%lo0 localhost  
  
# SLC6 eth0 under VMWare Fusion  
172.16.66.142 alice-online-dev  
  
# CENTOS 7 eth0 under VMWare Fusion  
172.16.66.242 o2-dev  

# High Sierra eth0 under VMWare Fusion
172.16.66.243 blade-runner

# Altera DE1-SoC dev Kit
192.168.33.2 de1soc
```
