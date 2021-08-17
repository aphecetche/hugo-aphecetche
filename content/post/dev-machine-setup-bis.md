---
author: "Laurent Aphecetche"
date: "2021-08-17"
lastmod: "2021-08-17"
description: ""
tags: ["geek","macos", "laptop", "ansible","spack"]
title: "Development Oriented Machine from scratch"
draft: true
---

## Prior work

This is an update of the [Development Oriented Machine from scratch (using
ansible and spack)](/2020/05/24/dev-machine-setup/). The main change is that
development tools are now installed natively as much as possible (instead of
relying on Spack), in order to speed up the first install (and remove the
dependency on Spack for machines that don't really need it).

## Preparation

The installation will be done with the help of [Ansible](https://docs.ansible.com/ansible/latest/index.html).

Two machines are involved in the process : the _control_ node and the _managed_
node. Ansible need only be installed on the control node. The managed and
control nodes can be the same machine.  For any of the two nodes you must first
make a regular install of the target OS (e.g.  macos, ubuntu, etc...)

During that regular installation you need to :

- create (at least) one user with admin rights (i.e. the user that can issue
  `sudo` commands)
- change its shell to `zsh`.

Then the installation process in a nutshell will be :

- check a few prerequisites
- (on control node only) install `ansible`
- use `ansible` to automatically install most of the rest, using a mix of
  native package managers or binary downloads, or using `spack` as a package
  manager
- finalize a few things manually

### Prerequisites

You must turn ssh on the _managed_ node in order for Ansible to be able to ssh
into your newly installed machine.

#### Turn ssh on (macOS)

Add `terminal` to the list of apps which have full access to the disk (in
System Preferences/Security & Private/Privacy. And then, from the command line
:

    sudo systemsetup -setremotelogin on

This can also be done in the `System Preferences` application -> Sharing ->
Remote Login.

From now on you should be able to interact with the machine through a simple
terminal using ssh.

#### Install XCode (macOS)

On a Mac you'd probably better off by accepting the fact that developper
things go smoother if XCode is installed simply. Using only the command line
tools might work in most cases but for some corner cases you might run into
(difficult to debug) problems.

#### Set proper time zone (macOS)

From the command line that would mean something like :

    sudo systemsetup -gettimezone
    sudo systemsetup -listtimezones
    sudo systemsetup -settimezone Europe/Paris
    sudo systemsetup -gettimezone

### Install Ansible

Refer to the [Ansible installation
instructions](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#)
for details, but for macOS that would be :

    pip3 install --upgrade pip3
    python3 -m pip install --user ansible

Assuming your PATH is not yet modified at this stage, you'll have to add the
local python binary path to it, before being able to use the `ansible` or
`ansible-playbook` commands. For instance :

    path+=$HOME/Library/Python/3.8/bin

for macOS with Python3.8

### Clone custom ansible playbooks repository

    cd && mkdir -p github.com/aphecetche && cd github.com/aphecetche
    git clone https://github.com/aphecetche/ansible

You can check that ansible is working fine (here on the ubuntu-20 managed
virtual machine) using :

    ansible-playbook -i inventory/localhost -l ubuntu-20 verify.yml --verbose

which should create a `ceci-est-un-test` file under the user home directory on
the target machine.

## Automated installation using ansible

From now on most of the installation is to be done by ansible, with the help of spack.

The main playbook is the `laptop.yml` one which calls in turn other playbooks :

- `bare.yml` to install a minimal set of packages, including `spack`
- `basic.yml` to tailor the configuration of `zsh, ssh, git, tmux`
- `vim.yml` which setups `vim` to work with different programming languages
- `web.yml` for web development
- `alice.yml` which setups things for developing Alice software
- `mac.yml` (macOS only)

### bare.yml

    ansible-playbook -i inventory/localhost -l localhost bare.yml -K

The minimal set of packages is currently :

- [spack](https://spack.io), because it's needed for all the rest...
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

The `bare` role may also need to install distribution-specific packages (in
particular to satisfy the [requirements of
spack](https://spack.readthedocs.io/en/latest/getting_started.html#prerequisites),
e.g a compiler, etc...), and thus might need the sudo password, hence the `-K`
option of `ansible-playbook`. Most of the other playbooks do _not_ require to
become root, except the `web` one.

Some other things that I do need are :

- [fzf](https://github.com/junegunn/fzf), because fuzzy finding is great
- [vim](https://github.com/vim/vim), well, because that's my editor

`vim` installation is made within the `bare` role, while its configuration is
taken care of by the `vim_conf` role called by the `vim.yml` playbook below.
`fzf` is installed by the `bare` role using the corresponding ansible fzf role.

> The bare installation takes quite some time, as spack is compiling things
> from sources. In particular `ripgrep` requires the compilation of `rust`...

The executables of this step are put into a spack view under
`$HOME/views/bare`. That directory is added to the path by the `zsh_conf` role
later on, but meanwhile you should do :

    path=($path $HOME/views/bare)

to access those new installs.

Note that at the end of the bare step alone, the spack installation takes about
1 GB.

### basic.yml

    cd ~/github.com/aphecetche/ansible
    ansible-playbook -i inventory/localhost -l localhost basic.yml

will configure zsh, git, ssh, and tmux.

### vim.yml

This one is a big one. It configures `vim` to be used for various programming
languages.  The basis of the configuration is to use
[CoC](https://github.com/neoclide/coc.nvim), which itself depends on `nodejs`
(and `yarn`).

### laptop.yml

The laptop playbook is to be executed on localhost
(-K will ask for sudo password) :

    cd ~/github.com/aphecetche/ansible
    ansible-playbook -i inventory/localhost -l localhost laptop.yml -K

## Manual steps (macOS)

For those see  [the macos laptop
installation](/2018/10/09/macos-laptop-setup/) installation instructions.
