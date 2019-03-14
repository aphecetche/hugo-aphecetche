+++
author = "Laurent Aphecetche"
date = "2018-10-09"
lastmod = "2019-03-14"
description = ""
tags = [ "geek", "vmware", "macos","laptop","ansible" ]
title = "MacOS Laptop Setup from scratch using Ansible"
+++

The following procedure has been so far tested on :

- a VMWare Fusion 11 Pro virtual machine running MacOS 10.14
    (Mojave).
- a MacBook Pro from 2015 (Diego's old one) with a fresh Mojave installation

    The initial idea was to be able to drive completely a new MacOS laptop _installation_ from another machine using
    Ansible. But unfortunately I was not able to install Homebrew that way because the installation script does not clearly separate parts that require `sudo` and those that do not. In addition some brew casks (e.g. gfortran) also require a sudo password in their installation process.
    So the plan B is to drive the show from the new laptop itself, with a couple of manual steps and then hand over most of the work to Ansible (working on the laptop itself).

    > Note to self : further usage of Ansible teached me how to (more) properly use the `-K` and `-become` options, so might revisit plan A at some point, as it should work just fine (March 2019) ? Not critical though.

# Manual installation

Make a regular install if MacOS Mojave if need be.

During that you get to create one user with admin rights (i.e. the user that can issue `sudo` commands). And change its shell to `zsh`.

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

# Install Ansible using Homebrew

```
brew install ansible
```

# Clone ansible playbooks repository


```
cd && mkdir -p github.com/aphecetche && cd github.com/aphecetche
git clone https://github.com/aphecetche/ansible
```

Review the `laptop.yml` file, in particular the value of the `user_must_generate_keys` of the `user` role.

Then execute the laptop playbook on localhost (-K will ask for sudo password) :

```
cd ~/github.com/aphecetche/ansible
ansible-playbook -i inventory/localhost laptop.yml -K
```

Might need to review the list of ssh public keys to be added to the user : see `roles/user/files`. For instance, the step above will create a `$HOME/.ssh/id_rsa.pub` that you might want to copy to `roles/user/files/mbp.pub`. So that they can be then installed with the _optional_ `deploy_ssh_keys.yml` playbook (to be reviewed).

# Manual steps

## Mouse and trackpad

Go the `System Preferences` to select e.g. right click for mouse, for trackpad, etc...

## hammerspoon

Launch the application once in order to :

- enable it in the accessibility panel
- enable it at login

## 1Password

Launch the application once to login.

## Docker

Launch the application once to login.

## Terminal configuration

Don't know how to automate this, so go to Preferences and change font to one of the Nerd fonts (downloaded at the Ansible stage).
For the color themes, see [lysyi3m/macos-terminal-themes](https://github.com/lysyi3m/macos-terminal-themes), in particular the Pencil or Tomorrow ones.

## Mac App Store and iCloud

At this point should enter Apple ID into Mac App Store and iCloud and get :

- Airmail (setup is stored on iCloud)
- Transmit (version 4 bought through the App Store. Note that there is now a version 5)

## Cloud setup

### DropBox

DropBox app was installed by ansible (using homebrew cask) but the setup itself has to be done manually.

### CERNBox

[Download the client](https://cernbox.cern.ch/cernbox/doc/clients.html) and install it manually (can select which subfolders of cernbox to sync to save some disk space on the laptop side, if needed).

> To get an idea of the retrieval speed : from Subatech Wifi, I was able to retrieve all of my Cernbox (28GB) in about 55 minutes) (13-FEB-2019).

### ownCloud CNRS (MyCore)

Like DropBox, the app was installed by ansible but configure has to be done manually (e.g. server is `https://mycore.core-cloud.net`, username is email @ lab). Note that the owncloud interface mixes very badly with the dark theme of Mojave... (e.g. most of the inputs are white on white !).

## Certificates

### GRID

Get it from 1Password document : just choose "Open With... Keychain" will add it to the keychain.

Put into under `.globus` for `alien` (using `~/scripts/alice/run2/p12topem.sh` for instance to convert the p12 file obtained from 1Password to pem).

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


## LibreOffice

(for homework of my daughters...)

`brew cask install libreoffice`

And get the FR language pack from [libreoffice download center](https://www.libreoffice.org/download/download/?type=mac-x86_64&version=6.1.4&lang=pick)

# Encryption

At any point in the installation, might want to turn FileVault on, using the [lab key](https://support.apple.com/fr-fr/HT202385).
