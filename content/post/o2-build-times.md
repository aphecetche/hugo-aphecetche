---
author: "Laurent Aphecetche"
date: "2020-03-09"
lastmod: "2020-12-01"
description: ""
tags: [ "o2","ninja","build","timing" ]
title: "AliceO2 build times"
draft: false
---

This is nothing new but the build time of AliceO2 is quite sizeable (see
already the [timings I got a while ago with ninja](/2018/05/09/ninja-vs-make/)
and/or [shake](https://alice-talk.web.cern.ch/t/ninja-anyone/66/13))

I'm here considering only the case where we're using the Ninja CMake generator
(i.e. excluding the Makefiles one).

## How to investigate build times ?

### Shake

One nice way would be to use [Shake](https://shakebuild.com) which understands
`build.ninja` files 
(so *could* be used directly from a build directory)
and outputs html reports out of the box. But
there is an [issue with Shake](https://github.com/ndmitchell/shake/issues/679)
which makes it choke on the `build.ninja` file produced by CMake.  I did cooked
up a [tiny
script](https://github.com/aphecetche/scripts/blob/master/ninja/filter-order-only-depends-on-dir.sh)
to "patch" the `build.ninja` file, but that's not really bullet-proof neither
future proof.

### Ninja + Chrome tracing format

Ninja output itself could be used, with the addition of some external tools to convert it into 
 a form digestible by Chrome tracing tools.

Use `ninjatracing` script to convert `.ninja_log` file to `trace.json`

    $HOME/github.com/nico/ninjatracing/ninjatracing $ALIBUILD_WORK_DIR/BUILD/O2-latest/O2/.ninja_log > trace.json

The `trace.json` can then be converted to `html` using `trace2html`
(assuming there's a python 2.7 in the path) for a very detailed inspection.

    $HOME/googlesource.com/catapult/tracing/bin/trace2html trace.json --output=trace.html

Or fed to a small python script  : 

```python
#!/usr/bin/env python3

"""Merge results from all cpu cores into one

Run with (e.g.): python combine-trace-json.py trace.json

output is combined.json"""

import json
import sys

if __name__ == '__main__':
    combined_data = []
    with open(sys.argv[1],'r') as f:
        for event in json.load(f):
            # merge all cpu traces into one
            event['tid']=0
            combined_data.append(event)
    with open('combined.json', 'w') as f:
        json.dump(sorted(combined_data, key=lambda k: k['ts']), f)
```

to merge all core results into one and then use 
<https://www.speedscope.app> to display the result.

That is usable but not completely satisfactory either.

### Ninja + custom python script to feed data into speedscope

My preferred way so far...

    $HOME/github.com/aphecetche/scripts/ninja/ninja-log-2-speedscope.py $HOME/alice/dev/sw/BUILD/O2-latest/O2/.ninja_log > $HOME/build-times.txt

Which should be done after a clean build (as ninja_log accumlates data from several builds otherwise).

The [`ninja-log-2-speedscope.py`](https://github.com/aphecetche/scripts/blob/master/ninja/ninja-log-2-speedscope.py) is quick-and-dirty-and-manual (hope it's still correct though...). Feel free to tweak it for your needs, e.g. to group things differently.

Here's an example of [resulting file](/post/o2-build-times/aliceo2-build-10-march-2020.txt) and the [speedscope display](https://www.speedscope.app#profileURL=https://aphecetche.netlify.app/post/o2-build-times/aliceo2-build-10-march-2020.txt). Select the "Left Heavy" tab (keyboard shortcut = 2) to see a flamegraph of build times, or "Sandwich" tab (keyboard shortcut = 3) to see the most time consuming files. + and - to zoom-in / out and 0 to zoom back to see all.

## Some results

- [March 2020](https://www.speedscope.app#profileURL=https://aphecetche.netlify.app/post/o2-build-times/aliceo2-build-10-march-2020.txt)
- [December 2020](https://www.speedscope.app#profileURL=https://aphecetche.netlify.app/post/o2-build-times/aliceo2-build-01-december-2020.txt)


