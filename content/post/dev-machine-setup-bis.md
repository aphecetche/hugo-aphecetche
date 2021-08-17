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
development tools are now installed in a "mixed way" : natively as much as
possible (instead of relying on Spack for almost everything), in order to speed
up the first install, and remove the dependency on Spack for machines that
don't really need it.

By natively we mean brew on macOS and apt or dnf on linux
machines. One very important point though : on macOS we try to keep brew usage
to a minimum and mainly for (common) programs (e.g. tmux, ripgrep, etc..).
For libraries Spack should be preferred (as brew does not handle multiple versions)

At some point the reasoning was that Spack would be a somewhat platform
independant way of installing stuff. That is true, but compiling everything
from source makes for a quite bad installation experience in the end. So a more
realistic approach is to leverage native package managers when possible and use
Spack for the rest.

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

#### Install homebrew (macOS)

See [Homebrew](https://brew.sh), but it should be something like :

    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

As mentioned in the introduction, we try to keep brew usage to a minimum,
 because there are a few things I dislike about brew :

- only one version of each package can be used, and that's always the latest,
so brew updates are always kind of risky (as you're living on the bleeding edge)
- initial installation insist on installing Command Line Tools for XCode even
 if full XCode is already installed

But it's unpractical (while possible, especially with Spack) to leave without,
simply because brew provides a lot of bottles (binary packages) where Spack
does not (at least not yet). As an example, installing ripgrep takes seconds
with brew while it takes hour(s) with Spack (because it depends on a rust
compiler that must be compiled first...)

### Install Ansible

Refer to the [Ansible installation
instructions](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#)
for details, but that could be as simple as using pip within a virtualenv :

    python3 -m venv ~/.virtualenvs/ansible
    source ~/.virtualenvs/ansible/bin/activate
    python -m pip install pip --upgrade
    python -m pip install ansible

Each time you want to use Ansible you'll have to setup the virtualenv first :

    source ~/.virtualenvs/ansible/bin/activate
    ansible --version

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

- `bare.yml` to install a very minimal set of packages
- `devtools.yml` to install development tools I'm using all the time
- `basic.yml` to tailor the configuration of `zsh, ssh, git, tmux`
- `vim.yml` which setups `vim` to work with different programming languages
- `web.yml` for web development

- `spack.yml` for spack itself
- `alice.yml` which setups things for developing Alice software
- `mac.yml` (macOS only)

### bare.yml

    ansible-playbook -i inventory/localhost -l localhost bare.yml -K

The minimal set of packages is currently :

- [tmux](https://github.com/tmux/tmux), because I can no longer work without it
  ;-)
- [environment-modules](http://modules.sourceforge.net), because I'm actually
  using the `module` command quite a lot
- [ncdu](https://dev.yorhel.nl/ncdu) to get an easy way to assess the disk
  space taken by things. Might be replaced by [dust](https://github.com/bootandy/dust)
- [tree](http://mama.indstate.edu/users/ice/tree/) to get a "graphical" view of
  directories. Might be replaced by [exa](https://the.exa.website) `--tree` option.
- [vim](https://github.com/vim/vim), well, because that's my editor

`vim` installation is made within the `bare` role, while its configuration is
taken care of by the `vim_conf` role called by the `vim.yml` playbook below.
`fzf` is installed by the `bare` role using the corresponding ansible fzf role.

### devtools.yml

Some other things that I do need are :

- [ripgrep](https://github.com/BurntSushi/ripgrep), because it's faster and
  simpler than grep
- [jq](https://stedolan.github.io/jq/) to play with json files
- [fzf](https://github.com/junegunn/fzf), because fuzzy finding is great

[https://github.com/ibraheemdev/modern-unix](Modern Unix Tools)

### basic.yml

    cd ~/github.com/aphecetche/ansible
    ansible-playbook -i inventory/localhost -l localhost basic.yml

will configure zsh, git, ssh, and tmux.

### spack.yml

The [spack](https://spack.io) role may also need to install
distribution-specific packages (in particular to satisfy the [requirements of
spack](https://spack.readthedocs.io/en/latest/getting_started.html#prerequisites),
e.g a compiler, etc...), and thus might need the sudo password, hence the `-K`
option of `ansible-playbook`.

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
