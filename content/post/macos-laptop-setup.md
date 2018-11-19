+++
author = "Laurent Aphecetche"
date = "2018-10-09"
lastmod = "2018-11-13"
description = ""
tags = [ "geek", "vmware", "macos","laptop","ansible" ]
title = "MacOS Laptop Setup from scratch using Ansible"
+++

The following procedure has been so far tested on a VMWare Fusion 11 Pro virtual machine running MacOS 10.14
(Mojave).

The initial idea was to be able to drive completely a new MacOS laptop _installation_ from another machine using
Ansible. But unfortunately I was not able to install Homebrew that way because the installation script does not clearly separate parts that require `sudo` and those that do not. In addition some brew casks (e.g. gfortran) also require a sudo password in their installation process.
So the plan B is to drive the show from the new laptop itself, with a couple of manual steps and then hand over most of the work to Ansible (working on the laptop itself).

# Manual installation

Make a regular install if MacOS Mojave if need be.

During that you get to create one user with admin rights (i.e. the user that can issue `sudo` commands).

# Turn ssh on

From the command line : 

```
sudo systemsetup -setremotelogin on
```

This can also be done in the `System Preferences` application -> Sharing -> Remote Login.

# Install Homebrew

See [brew.sh](https://brew.sh) for instructions, but it's as simple as : 

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Note that this will install Command Line Tools if needed (which is the case if you're starting from a brand new
laptop), which include `git` and `gcc` for instance.

# Install Python2 using Homebrew

```
brew install python@2
```

Note that this will bring `pip` (version 2) along...

# Install Ansible using Homebrew

```
brew install ansible
```

# Clone ansible playbooks repository


```
cd && mkdir -p github.com/aphecetche && cd github.com/aphecetche
git clone https://github.com/aphecetche/ansible
```

Execute the laptop playbook on localhost (-K will ask for sudo password) :

```
cd ~/github.com/aphecetche
ansible-playbook -i inventory/localhost laptop.yml -K
```

Might need to review the list of ssh public keys to be added to the user : see `roles/user/files`. For instance, the step above will create a `$HOME/.ssh/id_rsa.pub` that you might want to copy to `roles/user/files/mbp.pub`

# Manual steps

## Mouse and trackpad

Go the `System Preferences` to select e.g. right click for mouse, for trackpad, etc...

## hammerspoon

Launch the application once in order to :

- enable it in the accessibility panel
- enable it at login

## 1Password

Launch the application once to login.

## Terminal configuration

Don't know how to automate this, so go to Preferences and change font to one of the Nerd fonts (downloaded at the Ansible stage). 
For the color themes, see [lysyi3m/macos-terminal-themes](https://github.com/lysyi3m/macos-terminal-themes), in particular the Pencil or Tomorrow ones.

## Mac App Store and iCloud 

At this point should enter Apple ID into Mac App Store and iCloud and get :

- Airmail (setup is stored on iCloud)

## Cloud setup

### DropBox

DropBox app can be installed using homebrew cask. The setup itself has to be manual though.

### CERNBox

[Download the client](https://cernbox.cern.ch/cernbox/doc/clients.html) and install it manually (can select which subfolders of cernbox to sync to save some disk space on the laptop side).


### ownCloud CNRS (MyCore)

```
brew cask install owncloud
```

Launch it to configure it manually (e.g. server is `https://mycore.core-cloud.net`)

## Certificates

### GRID

Get it from 1Password document : just choose "Open With... Keychain" will add it to the keychain.

Put into under `.globus` for `alien`.

Visit the [MENESR CA page](http://cer.grid-fr.pncn.education.gouv.fr) to retrieve the root certificates. Install them into `System` Keychain. Mark the Root one (ac-grid-fr.cer) as `Always Trust`.

Visit the [CERN CA files](https://cafiles.cern.ch/cafiles/) site to download the CERN Root and Grid Certificates. Install them into `System` Keychain. Mark the Root one as `Always Trust` (that will make the Grid one valid for instance).

### CNRS

Get it from 1Password document : just choose "Open With... Keychain" will add it to the keychain.

Visit the [IGC CNRS page](https://igc.services.cnrs.fr/search_CA_certificate/?CA=CNRS2-Standard&lang=fr&body=view_ca.html) to get CNRS2 and CNRS2-Standard CAs. Mark the CNRS2 one as `Always Trust` (this will make the CNRS2-Standard one valid for instance).

## VIM

(only once) Launch vim (neovim really) and use `:PackUpdate` to install plugins.

(only once) Launch vim and install go binaries for [vim-go](https://github.com/fatih/vim-go) using `:packadd vim-go | GoInstallBinaries` 

Install `Vimmy` Safari extension.

## Google

Connect once to drive.google.com and allow access to Google account from some other apps, like Calendar or Notes for instance (not Mail as it's not needed with Airmail)


