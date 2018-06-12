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
mkdir $dest/css/theme/template
mkdir $dest/css/theme/source
mkdir $dest/css/print


cp -f $gh/css/print/*.css $dest/css/print/
cp -f $gh/css/theme/*.css $dest/css/theme/
cp -f -a $gh/css/theme/template/* $dest/css/theme/template/
cp -f $gh/css/theme/source/la* $dest/css/theme/source/
cp -f $gh/css/theme/source/_w3* $dest/css/theme/source/
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
#cp -f -a $gh/plugin/* $dest/plugin
