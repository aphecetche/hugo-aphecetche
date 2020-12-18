---
author: "Laurent Aphecetche"
date: "2020-05-24"
lastmod: "2020-12-03"
description: ""
tags: ["geek", "vmware", "macos", "laptop", "ansible"]
title: "Development Oriented Machine from Scratch (using Ansible and Spack)"
draft: false
---

This is a variant of [the macos laptop
installation](/2018/10/09/macos-laptop-setup/) installation instructions, that
is not limited to macOS and uses [Spack](https://spack.io) instead of
[asdf](https://asdf-vm.com).

## Preparation

Make a regular install of the target OS (e.g. macos, ubuntu, etc...)

During that you need to :

- create (at least) one user with admin rights (i.e. the user that can issue
  `sudo` commands)
- change its shell to `zsh`.

Then the installation process in a nutshell will be :

- turn ssh on so you can ssh into your newly installed machine
- ensure `git` is installed
- install a base `Python3` to get Ansible running
- get `Ansible`
- use `Ansible` to automatically install most of the rest, using `Spack` as a
  package manager mostly
- finalize a few things manually

### Turn ssh on (macOS)

Add `terminal` to the list of apps which have full access to the disk (in
System Preferences/Security & Private/Privacy. And then, from the command line
:

    sudo systemsetup -setremotelogin on

This can also be done in the `System Preferences` application -> Sharing ->
Remote Login.

From now on you should be able to interact with the machine through a simple
terminal using ssh.

### Install XCode (recommended) or Command Line Tools (macOS)

> Actually on a Mac you'd probably better off by accepting the fact that
> developper things go smoother if XCode is installed simply. Using only the
> command line tools might work in most cases but for some corner cases you
> might run into (difficult to debug) problems.

#### For XCode just use the AppStore

#### Command line tools

Launch `git` or `clang` a first time and follow the instructions to install CLT.

Set the proper time zone. From the command line that would mean something like :

    sudo systemsetup -gettimezone
    sudo systemsetup -listtimezones
    sudo systemsetup -settimezone Europe/Paris
    sudo systemsetup -gettimezone

### Check there's a Python3 available

The exact version is not relevant as long as `Ansible` can work with it.

- on Ubuntu install with `apt install python3`
- on macOS Catalina the system provided Python 3.7.3 can be used as is.

### Get (and activate) Ansible

Install `Ansible` inside a python virtualenv.

    mkdir -p $HOME/.virtualenvs && cd $HOME/.virtualenvs
    python3 -m venv ansible
    source $HOME/.virtualenvs/ansible
    python -m pip install ansible

## Automated installation using Ansible

From now on most of the installation is to be done by Ansible, with the aid of
Spack, which is one of the first package that will be installed.

### Clone ansible playbooks repository

    cd && mkdir -p github.com/aphecetche && cd github.com/aphecetche
    git clone https://github.com/aphecetche/ansible

The main playbook is the `laptop.yml` one which calls in turn other playbooks :

- `bare.yml` to install a minimal set of packages
- `basic.yml` to install and setup basic stuff like `zsh, ssh, (neo)vim, git, tmux`
- `languages.yml` which setups `(neo)vim` to work with different programming languages
- `alice.yml` which setups things for developing Alice software
- `web.yml` for web development
- `mac.yml` (macOS only)

The `bare` playbook starts with installing `Spack` with a per-user
configuration in `~/.spack/config.yaml`. That configuration sets the Spack
install tree to `~/opt/spack`. Then a minimal set of packages is
installed using Spack, currently : 

- [tmux](https://github.com/tmux/tmux), because I can no longer work without it ;-)
- [ncdu](https://dev.yorhel.nl/ncdu) to get an easy way to assess the disk space taken by things
- [tree](http://mama.indstate.edu/users/ice/tree/) to get a "graphical" view of directories
- [environment-modules](http://modules.sourceforge.net), because I'm actually using the `module` command quite a lot
- [ripgrep](https://github.com/BurntSushi/ripgrep), because it's way simpler than grep
- [fzf](https://github.com/junegunn/fzf), because fuzzy finding is great
- [vim](https://github.com/vim/vim), well, because that's my editor
- [jq](https://stedolan.github.io/jq/) to play with json files 

The `bare` role may also need to install
distribution-specific packages, and hence might need the sudo password.

> The bare installation takes quite some time, as Spack is compiling things from sources.

Note that at the end of the bare alone, the Spack installation takes about XXX MB.

The laptop playbook is to be executed on localhost
(-K will ask for sudo password) :

    cd ~/github.com/aphecetche/ansible
    rm -rf $HOME/.vim && ansible-playbook -i inventory/localhost -l localhost laptop.yml -K

The removal of the `.vim` directory is necessary to ensure proper installation
of the neovim role, in case you've used vim at least once before launching this
first ansible installation...

## Manual steps (macOS)

For those see  [the macos laptop
installation](/2018/10/09/macos-laptop-setup/) installation instructions.
