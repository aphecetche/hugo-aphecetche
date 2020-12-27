---
author: "Laurent Aphecetche"
date: "2020-05-24"
lastmod: "2020-12-21"
description: ""
tags: ["geek","macos", "laptop", "ansible"]
title: "Development Oriented Machine from Scratch (using ansible and spack)"
draft: false
---

This is a variant of [the macos laptop
installation](/2018/10/09/macos-laptop-setup/) installation instructions, that
is not limited to macOS and uses [spack](https://spack.io) instead of
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
- if needed, install a base `Python3` to get spack running
- get `spack`
- install `ansible` using `spack`
- use `ansible` to automatically install most of the rest, using `spack` as a
  package manager mostly
- finalize a few things manually

> Note that `spack` is considered as the other basic tools like e.g. `git`, i.e.
 it will **not** be installed by `ansible`

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

The exact version is not relevant as long as `ansible` can work with it.

- on Ubuntu install with `apt install python3`
- on macOS Big Sur the system provided Python 3.8.2 can be used as is.

### Get spack

    mkdir -p $HOME/github.com/spack && cd $HOME/github.com/spack
    git clone https://github.com/spack/spack.git
    mkdir -p $HOME/github.com/aphecetche/ && cd $HOME/github.com/aphecetche
    git clone https://github.com/aphecetche/spack-aphecetche.git
    cp spack-aphecetche/config.yaml $HOME/.spack/config.yaml
    cp spack-aphecetche/repos.yaml $HOME/.spack/repos.yaml
    cp spack-aphecetche/packages.yaml $HOME/.spack/packages.yaml

The `spack-aphecetche` repository hosts a number of packages that are either not in the
global spack one, or that are not working in the upstream repo.

The configuration `~/.spack/config.yaml` sets the spack install tree (and various
 caches) to `~/opt/spack`. 

### Get ansible and custom ansible playbooks repository

    cd && mkdir -p github.com/aphecetche && cd github.com/aphecetche
    git clone https://github.com/aphecetche/ansible
    ~/github.com/spack/spack/bin/spack install py-ansible
    cd && spack view symlink -i $HOME/views/ansible py-ansible
    path=($path $HOME/views/ansible/bin)

Note that the `ansible-playbook` command (alongside the other ansible
executables) is installed in a [spack
view](https://spack.readthedocs.io/en/latest/workflows.html#filesystem-views)

## Automated installation using ansible

From now on most of the installation is to be done by ansible, with the aid of
spack.

The main playbook is the `laptop.yml` one which calls in turn other playbooks :

- `bare.yml` to install a minimal set of packages
- `basic.yml` to tailor the configuration of `zsh, ssh, git, tmux`
- `vim.yml` which setups `vim` to work with different programming languages
- `alice.yml` which setups things for developing Alice software
- `web.yml` for web development
- `mac.yml` (macOS only)

### bare.yml

The minimal set of packages, installed using spack, is currently : 

- [tmux](https://github.com/tmux/tmux), because I can no longer work without it
  ;-)
- [ncdu](https://dev.yorhel.nl/ncdu) to get an easy way to assess the disk
  space taken by things
- [tree](http://mama.indstate.edu/users/ice/tree/) to get a "graphical" view of
  directories
- [environment-modules](http://modules.sourceforge.net), because I'm actually
  using the `module` command quite a lot
- [ripgrep](https://github.com/BurntSushi/ripgrep), because it's faster and
  simpler than grep
- [jq](https://stedolan.github.io/jq/) to play with json files

The `bare` role may also need to install
distribution-specific packages, and hence might need the sudo password.

Some other things that I do need are : 

- [fzf](https://github.com/junegunn/fzf), because fuzzy finding is great
- [vim](https://github.com/vim/vim), well, because that's my editor

`vim` is generally already available and so does not need to be installed (and if not, it can easilly be using `spack install vim`).
`fzf` is  installed by the `bare` role using the ansible role.

> The bare installation takes quite some time, as spack is compiling things from sources. In particular `ripgrep` requires the compilation of `rust `...

The executables of this step are put into a spack view under `$HOME/views/bare`. That directory is added to the path by the `zsh_conf` role later on, but meanwhile you should do :

```
path=($path $HOME/views/bare)
```

to access those new installs.

Note that at the end of the bare step alone, the spack installation takes about 1 GB.

### basic.yml

    cd ~/github.com/aphecetche/ansible
    ansible-playbook -i inventory/localhost -l localhost basic.yml

will configure zsh, git, ssh, and tmux.

### vim.yml

This one is a big one. It configures `vim` to be used for various programming languages. 
The basis of the configuration is to use [CoC](https://github.com/neoclide/coc.nvim), 
which itself depends on `nodejs` (and `yarn`).

### laptop.yml
    
The laptop playbook is to be executed on localhost
(-K will ask for sudo password) :

    cd ~/github.com/aphecetche/ansible
    ansible-playbook -i inventory/localhost -l localhost laptop.yml -K

## Manual steps (macOS)

For those see  [the macos laptop
installation](/2018/10/09/macos-laptop-setup/) installation instructions.
