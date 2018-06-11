#!/bin/env sh

#
# import reveal directories from github checkout
#

gh="$HOME/github.com/aphecetche/reveal.js"

dest=static/reveal

# CSS

rm -rf $dest/css

mkdir $dest/css
mkdir $dest/css/theme
mkdir $dest/css/print


cp -f $gh/css/print/*.css $dest/css/print/
cp -f $gh/css/theme/*.css $dest/css/theme/
cp -f $gh/css/reveal.min.css $dest/css

# JS

rm -rf $dest/js
mkdir $dest/js

cp -f $gh/js/reveal.min.js $dest/js/

# LIB

rm -rf $dest/lib
mkdir $dest/lib
cp -f -a $gh/lib/* $dest/lib

# PLUGIN

# rm -rf $dest/plugin
# mkdir $dest/plugin
cp -f -a $gh/plugin/* $dest/plugin
