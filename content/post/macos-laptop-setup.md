\+++
author = "Laurent Aphecetche"
date = "2018-10-09"
lastmod = "2020-03-22"
description = ""
tags = [ "geek", "vmware", "macos","laptop","ansible" ]
title = "MacOS Laptop Setup from scratch using Ansible"
\+++

The following procedure has been so far tested on :

-   a VMWare Fusion 11 Pro virtual machine running MacOS 10.14
    (Mojave).
-   2 MacBook Pro from 2013 (Diego and Philippe old ones) with a fresh Mojave installation

    The initial idea was to be able to drive completely a new MacOS laptop *installation* from another machine using
    Ansible. But unfortunately I was not able to install Homebrew that way because the installation script does not clearly separate parts that require `sudo` and those that do not. In addition some brew casks (e.g. gfortran) also require a sudo password in their installation process.
    So the plan B is to drive the show from the new laptop itself, with a couple of manual steps and then hand over most of the work to Ansible (working on the laptop itself).

    > Note to self : further usage of Ansible teached me how to (more) properly use the `-K` and `-become` options, so might revisit plan A at some point, as it should work just fine (March 2019) ? Not critical though.

> The last installation (Sep 21st, 2019) was not completely painless (python installations kind of failed, java asdf plugin changed java names, etc...). Plus there are still some things that should be migrated to asdf (e.g. hugo itself and golang)

# Manual installation

Make a regular install if MacOS Mojave if need be.

During that you get to create one user with admin rights (i.e. the user that can issue `sudo` commands). And change its shell to `zsh`.

# Turn ssh on

From the command line :

    sudo systemsetup -setremotelogin on

This can also be done in the `System Preferences` application -> Sharing -> Remote Login.

# Install Homebrew

See [brew.sh](https://brew.sh) for instructions, but it's as simple as :

    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

Note that this will install Command Line Tools if needed (which is the case if you're starting from a brand new
laptop), which include `git` and `gcc` for instance.

# Install Ansible

> Starting from May 2019, I no longer install Ansible with brew. That would otherwise
> bring a brew python along, which I don't really want or need, as I've moved
> to `pyenv` first and then to [asdf](https://github.com/asdf-vm/asdf) to deal with python versions.
>
> So the idea now is to setup `asdf` first and then use that to get a virtualenv
> with Ansible in it.

    git clone https://github.com/asdf-vm/asdf.git $HOME/.asdf

Now we *do* need some python to use Ansible. Let's install one and make it the default.

    . $HOME/.asdf/asdf.sh
    asdf plugin-add python
    asdf install python 3.7.3
    asdf global python 3.7.3

(Use `$HOME/.asdf/asdf.sh` instead of `~/.asdf/asdf.sh` as got into trouble on the FLP with the ~).

There might be some [prerequisites](https://github.com/pyenv/pyenv/wiki#suggested-build-environment) to check first depending on the platform.
Also, on Mac, you probably want to make pythons of the (apple) framework variety :

    PYTHON_CONFIGURE_OPTS="--enable-framework" asdf install python 3.7.3

That's anyway what the ansible python roles defined in the github.com/aphecetche/ansible repo are doing later on, so better be consistent right off the bat.

Before going further, double check that the python version is the one you expect :

    > asdf current python
    /Users/laurent/.asdf/installs/python/3.7.3/bin/python
    > python -V
    Python 3.7.3

Now let's create *and* activate a virtualenv that will be used exclusively by Ansible.

    > mkdir ~/.virtualenvs
    > cd ~/.virtualenvs
    > python -m venv ansible
    > source ~/.virtualenvs/ansible/bin/activate

And install in that virtualenv ansible itself as well as one extra package that is needed to hash the passwords (later on when generating users for external machines, e.g. Linode ones)

    pip install ansible passlib

    > pip list
    Package      Version
    ------------ --------
    ansible      2.7.10
    asn1crypto   0.24.0
    bcrypt       3.1.6
    certifi      2019.3.9
    cffi         1.12.3
    cryptography 2.6.1
    Jinja2       2.10.1
    MarkupSafe   1.1.1
    paramiko     2.4.2
    passlib      1.7.1
    pip          19.1
    pyasn1       0.4.5
    pycparser    2.19
    PyNaCl       1.3.0
    PyYAML       5.1
    setuptools   41.0.1
    six          1.12.0
    wheel        0.33.1

From there ansible is useable as long as the `ansible` virtualenv is activated.

# Clone ansible playbooks repository

    cd && mkdir -p github.com/aphecetche && cd github.com/aphecetche
    git clone https://github.com/aphecetche/ansible

Review the `laptop.yml` file, in particular the value of the `user_must_generate_keys` of the `user` role.

Then execute the laptop playbook on localhost (-K will ask for sudo password) :

    cd ~/github.com/aphecetche/ansible
    rm -rf $HOME/.vim && ansible-playbook -i inventory/localhost -l localhost laptop.yml -K

The removal of the `.vim` directory is necessary to ensure proper installation of the neovim role, in case you've used vim at least once before launching this first ansible installation...

Might need to review the list of ssh public keys to be added to the user : see `roles/user/files`. For instance, the step above will create a `$HOME/.ssh/id_rsa.pub` that you might want to copy to `roles/user/files/mbp.pub`. So that they can be then installed with the *optional* `deploy_ssh_keys.yml` playbook (to be reviewed).

# Manual steps

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

# Encryption

At any point in the installation, might want to turn FileVault on, using the [lab key](https://support.apple.com/fr-fr/HT202385).

# SuperDuper

For some reason superduper installation from brew cask just hangs the ansible process, so it has to be done by hand afterwards.

# Lightroom CC

From Adobe site, if needed.
