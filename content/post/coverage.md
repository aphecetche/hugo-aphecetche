---
author: "Laurent Aphecetche"
date: "2020-05-26"
description: ""
tags: [ "o2","coverage","c++","build" ]
title: "C++ Code Coverage"
draft: false
---

A few notes on how to get code coverage for O2.

In a nutshell : 

-   must compile with `--coverage -g -O0` 
-   the run the tests
-   then use lcov (or gcovr) to get e.g. html reports

The compilation phase will create `*.gcno` files.
The running phase will create `*.gdca` files.
Both lcov and gcovr are using gcov to go from the `*.gcno` and `*.gcda` files to produce `*.gcov` files and then work from the `*.gcov` files.

With my current setup, that would be (assuming O2 has been built already at least once
 successfully with aliBuild)

    cd someemptybuildplace
    enter-alice-dev
    buildenv O2
    cmake $HOME/alice/dev/O2 \
      -DCMAKE_GENERATOR=Ninja \
      -DBUILD_TEST_ROOT_MACROS=OFF \
      -DBUILD_EXAMPLES=OFF \
      -DCMAKE_CXX_FLAGS="--coverage -g -O0"

At this stage can check in `build.ninja` that indeed the different targets use the required flags : should get `--coverage -g -O0` in the `FLAGS` of the `build` edges.

Then build all or part of the project (in the example below all the targets of MCH) :

    cmake --build . --target $(ninja -t targets | grep -i "^O2" | grep -i mch | cut -d ':' -f 1 | tr "\n" " ")

And check that `*.gdco` files have indeed been produced : 

    find . -name '*.gc*'

Now run (some) tests :

    ctest -L mch -L raw -E Detectors/Raw -j 16

And check that `*.gcda` files have been produced besides the `*.gcdo` ones

    find . -name '*.gc*'

One can then run `lcov` to collect and filter the coverage data (from the `*.gcno` and `*.gcda` files).

    dir=Detectors/MUON/MCH/Raw
    lcov -c -d $dir -i -o coverage.info.zero
    lcov --exclude "$(pwd)/*" --exclude '*/osx_x86-64/*' --exclude '*/Xcode.app/*' -c -d $dir -o coverage.info.test --rc lcov_branch_coverage=1
    lcov -a coverage.info.zero -a coverage.info.test -o coverage.info.total
    lcov -e coverage.info.total "*/$dir/*" -o coverage.info
    lcov --remove coverage.info '*/test*' -o coverage.info

First note that we make two passes of collection (`lcov -c`) : one with `-i` to get the baseline (i.e. using all `gcdo` files) and a second one (with some exclusions as well, see below) which will only get relevant information from existing `gcda` files. The initial pass is necessary to get a fair view of the coverage (otherwise not tested parts simply do not appear in the `coverage.info.test`). The two passes are merged using the `-a` option.

Then, the `--exclude` options are there to avoid having information from places we do not care about. The `-d` option specify where to start in the current directory : here we use `Detectors/MUON/MCH` as we only ran mch-based tests so there's no point looking elsewhere.

Finally we remove from the coverage information the unit tests themselves and anything that was found in the build directory (e.g. Root dictionaries) using the `--remove` option.

At this point one can have a textual dump of the coverage using : 

    lcov --list coverage.info

And a html report can be produced using the `genhtml` command : 

    genhtml --legend --branch-coverage -s --ignore-errors source -o html coverage.info && open html/index.html 
