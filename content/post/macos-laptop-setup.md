+++
author = "Laurent Aphecetche"
date = "2018-10-09"
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

# Install Ansible using Homebrew

```
brew install ansible
```

Note that this will bring `pip` (version 2) along...

# Clone ansible playbooks repository


```
cd && mkdir -p github.com/aphecetche && cd github.com/aphecetche
git clone https://github.com/aphecetche/ansible
```

Execute the laptop playbook on localhost (-K will ask for sudo password) :

```
ansible-playbook -i inventory/localhost laptop.yml -K
```

Might need to review the list of ssh public keys to be added to the user : see `roles/user/files`

# Manual steps

## hammerspoon

Launch the application once in order to :

- enable it in the accessibility panel
- enable it at login

## 1Password

Launch the application once to login.

## Terminal configuration

Don't know how to automate this, so go to Preferences and change font to one of the Nerd fonts (downloaded at the Ansible stage). For the color themes, see [https://github.com/lysyi3m/macos-terminal-themes](https://github.com/lysyi3m/macos-terminal-themes), in particular the Pencil ones.

## Mac App Store and iCloud 

At this point should enter Apple ID into Mac App Store and iCloud and get :

- Airmail (setup is stored on iCloud)

## Cloud setup

- DropBox
- CERNBox
- ownCloud CNRS (MyCore)

