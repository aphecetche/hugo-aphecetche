+++
author = "Laurent Aphecetche"
date = "2016-04-09T17:17:15+02:00"
description = ""
tags = [ "geek", "play" ]
title = "pimp up the terminal"

+++


On this first day of holidays, decided to play a bit with my terminal (iTerm2 actually) and  make it a bit more awesome...

Started by installing [powerline fonts](https://powerline.readthedocs.org). Changed the `iTerm2` to the `Hack` font.

Then forked the [bash-it](https://github.com/Bash-it/bash-it) script(s).

```
git clone --depth=1 https://github.com/Bash-it/bash-it.git ~/.bash_it
~/.bash_it/install.sh
```

# Aliases

Copied the relevant aliases from `$HOME/Scripts/bash_profile` to `~/.bash_it/aliases/xxx.aliases.bash` where I made `xxx=cern, saf3, la` and enabled them :

```
bash-it enable alias cern
bash-it enable alias saf3
bash-it enable alias la
```

# colors

copied the `~/.bash_it/themes/powerline` to my own `powerline-la` to be able to tweak a bit the [colors](https://upload.wikimedia.org/wikipedia/en/1/15/xterm_256color_chart.svg).
Edited the `.bash_profile` to change the theme to `powerline-la`

```
export BASH_IT_THEME='powerline-la'
```

# Completions

Enabled the git completions, so that when I type `git<TAB>` I get a list of git command, or `git pu<TAB>` will bring me pull and push, etc...

```
bash-it enable completion git
```

# To vim or not to vim ?

Was always curious about vi(m). Actually know (and already use from time to time) the _very very_ basic stuff like open and close/write a file, enter insert mode and get out of it, delete a bunch of lines, but that's about it.

Curiously, that's the usage of the [Atom](https://atom.io/) editor that got me thinking about vim again, as I came across some blog posts about why editor xxx is better than yyy. A matter of preference ? Certainly. But I had the gut feeling that vim is more than what it looks like (an editor for nuts, frankly speaking...), so I decided to take a serious jump at it. Even if at the end I [get back to Atom](http://revelry.co/learn-vim-use-atom/)...

Using this [primer manual first](https://danielmiessler.com/study/vim).

http://www.viemu.com/a_vi_vim_graphical_cheat_sheet_tutorial.html

## Usefull plugins for vim


