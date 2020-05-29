---
author:  "Laurent Aphecetche"
date:  "2020-05-24"
description:  ""
tags:  [ "geek","vmware","macos","laptop","ansible" ]
title: "Development Oriented Machine from Scratch (using Ansible and Spack)"
draft: false
---

This is a variant of [the macos laptop installation](2018/10/09/macos-laptop-setup/) installation instructions, that is not limited to macOS and uses [Spack](https://spack.io) instead of [asdf](https://asdf-vm.com).

# Preparation

Make a regular install of the target OS (e.g. macos, ubuntu, etc...)

During that you need to : 

-   create (at least) one user with admin rights (i.e. the user that can issue `sudo` commands)
-   change its shell to `zsh`.

Then the installation process in a nutshell will be :

-   turn ssh on so you can ssh into your newly installed machine
-   ensure `git` is installed
-   install a base `Python3` to get Spack running
-   get `Spack`
-   use `Spack` to install `Ansible`
-   then use `Ansible` to automatically install most of the rest
-   finalize a few things manually

## Turn ssh on (macOS)

Add `terminal` to the list of apps which have full access to the disk (in System Preferences/Security & Private/Privacy. And then, from the command line :

    sudo systemsetup -setremotelogin on

This can also be done in the `System Preferences` application -> Sharing -> Remote Login. 

From now on you should be able to interact with the machine through a simple terminal using ssh.

## Install Command Line Tools (macOS)

Launch `git` or `clang` a first time and follow the instructions to install CLT.

Set the proper time zone. From the command line that would mean something like : 

    sudo systemsetup -gettimezone
    sudo systemsetup -listtimezones
    sudo systemsetup -settimezone Europe/Paris
    sudo systemsetup -gettimezone

## Check there's a Python3 available

The exact version is not relevant as long as `Spack` can work with it.

-   on Ubuntu install with `apt install python3`
-   on macOS Catalina the system provided Python 3.7.3 can be used as is.

## Install Spack

    mkdir -p $HOME/github.com/spack && cd $HOME/github.com/spack && git clone https://github.com/spack/spack.git

## Install (and activate) Ansible

    cd ~/github.com/spack/spack/bin/
    ./spack install py-ansible
    ./spack activate py-ansible

Note that this may take a while (O(10) min), and it compiles its own Python 3...

The Spack disk usage at this stage `(~/github.com/spack/spack/opt)` is around 500 MB.

# Automated installation using Ansible

From now on most of the installation is to be done by Ansible.

## Clone ansible playbooks repository

    cd && mkdir -p github.com/aphecetche && cd github.com/aphecetche
    git clone https://github.com/aphecetche/ansible

The main playbook is the `laptop.yml` one, which is first installing the `bare` role for ensuring a bare minimum set of packages (exact set depends on platform, but is *very* minimal, e.g. only `ncdu` on macOS), and then calls other playbooks :

-   `basic.yml` to install and setup basic stuff like `zsh, ssh, (neo)vim, git, tmux`
-   `languages.yml` which setups `(neo)vim` to work with different programming languages
-   `alice.yml` which setups things for developing Alice software
-   `web.yml`  for web development
-   `mac.yml` (macOS only)

The laptop playbook is to be executed on localhost (-K will ask for sudo password) :

    cd ~/github.com/aphecetche/ansible
    rm -rf $HOME/.vim && ansible-playbook -i inventory/localhost -l localhost laptop.yml -K

The removal of the `.vim` directory is necessary to ensure proper installation of the neovim role, in case you've used vim at least once before launching this first ansible installation...

Might need to review the list of ssh public keys to be added to the user : see `roles/user/files`. For instance, the step above will create a `$HOME/.ssh/id_rsa.pub` that you might want to copy to `roles/user/files/mbp.pub`. So that they can be then installed with the *optional* `deploy_ssh_keys.yml` playbook (to be reviewed).

# Manual steps (macOS)

## Mouse and trackpad

Go the `System Preferences` to select e.g. right click for mouse, for trackpad, etc...

## hammerspoon

Launch the application once in order to :

-   enable it in the accessibility panel
-   enable it at login

## 1Password

Launch the application once to login.

## Docker

Launch the application once to login.

## Terminal configuration

Don't know how to automate this, so go to Preferences, of the chosen terminal app, and change font to one of the Nerd fonts (downloaded at the Ansible stage).
Currently using "Fura Code Regular Nerd Font Complete", size 14pt.

### iTerm2

`iTerm2` might be a preferable option over `Terminal.app` as it supports OSC-52 escape sequences (see e.g. [this blog post](https://www.freecodecamp.org/news/tmux-in-practice-integration-with-system-clipboard-bcd73c62ff7b/)), which are needed to get copy and paste working in tmux for remote cases.

For the color themes, see <https://iterm2colorschemes.com> for instance.

### Terminal

For the color themes, see [lysyi3m/macos-terminal-themes](https://github.com/lysyi3m/macos-terminal-themes), in particular the Pencil or Tomorrow ones.

### Allow debugging in tmux

Ensure the dev tools security is enabled :

    > DevToolsSecurity -status
    > sudo DevToolsSecurity -enable

## Mac App Store *and* iCloud

At this point should enter Apple ID into Mac App Store and iCloud and get :

-   Airmail (setup is stored on iCloud)
-   Things
-   MindNode
-   ByWord
-   AdBlock (for Safari)

And possibly Transmit (version 4 bought through the App Store. Note that there is now a version 5).

## Cloud setup

### DropBox, OneDrive, Google Drive, Box Drive

DropBox and similar apps were installed by ansible (using homebrew cask) but the setup itself has to be done manually.

### CERNBox

[Download the client](https://cernbox.cern.ch/cernbox/doc/clients.html) and install it manually (can select which subfolders of cernbox to sync to save some disk space on the laptop side, if needed).

> To get an idea of the retrieval speed : from Subatech Wifi, I was able to retrieve all of my Cernbox (28GB) in about 55 minutes) (13-FEB-2019).

### ownCloud CNRS (MyCore)

Like DropBox, the app was installed by ansible but configure has to be done manually (e.g. server is `https://mycore.core-cloud.net`, username is email @ lab). Note that the owncloud interface mixes very badly with the dark theme of Mojave... (e.g. most of the inputs are white on white !).

## Certificates

### GRID

Get it from 1Password document : just choose "Open With... Keychain" will add it to the keychain.

Put into under `.globus` for `alien` (using `~/scripts/alice/run2/grid/p12topem.sh` for instance to convert the p12 file obtained from 1Password to pem).

Visit the [MENESR CA page](http://cer.grid-fr.pncn.education.gouv.fr) to retrieve the root certificates. Install them into `System` Keychain. Mark the Root one (ac-grid-fr.cer) as `Always Trust`.

Visit the [CERN CA files](https://cafiles.cern.ch/cafiles/) site to download the CERN Root and Grid Certificates. Install them into `System` Keychain. Mark the Root one as `Always Trust` (that will make the Grid one valid for instance).

### CNRS

Get it from 1Password document : just choose "Open With... Keychain" will add it to the keychain.

Visit the [IGC CNRS page](https://igc.services.cnrs.fr/search_CA_certificate/?CA=CNRS2-Standard&lang=fr&body=view_ca.html) to get CNRS2 and CNRS2-Standard CAs. Mark the CNRS2 one as `Always Trust` (this will make the CNRS2-Standard one valid for instance).

## VIM

(only once) Launch vim and install go binaries for [vim-go](https://github.com/fatih/vim-go) using `:packadd vim-go | GoInstallBinaries`

Install `Vimmy` Safari extension.

## Google

Connect once to drive.google.com and allow access to Google account from some other apps, like Calendar or Notes for instance (not Mail as it's not needed with Airmail)

## LibreOffice

(for homework of my daughters...)

`brew cask install libreoffice`

And get the FR language pack from [libreoffice download center](https://www.libreoffice.org/download/download/?type=mac-x86_64&version=6.1.4&lang=pick)

## Encryption

At any point in the installation, might want to turn FileVault on, using the [lab key](https://support.apple.com/fr-fr/HT202385).

## SuperDuper

For some reason superduper installation from brew cask just hangs the ansible process, so it has to be done by hand afterwards.

## Lightroom CC

From Adobe site, if needed.

```

```
