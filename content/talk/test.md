+++
title = "Test"
date = "2018-06-09"
description = ""
author = "L. Aphecetche"
tags = [ "talks" ]
headline = "headline"
homebutton = true
printbutton = true
theme = "lasimple"
code_theme = "tomorrow-night"
center = false
controls = true
transition = "slide"
footer = "© L. Aphecetche 2018 | Test | June 9th 2018"
+++

# a super test


:svg-smile:

---

# slide 2

---

# slide 3

```c++
// do we start from an existing context
    auto incontextstring = ctx.options().get<std::string>("incontext");
    LOG(INFO) << "INCONTEXTSTRING " << incontextstring;
    if (incontextstring.size() > 0) {
      auto success = mgr.setupRunFromExistingContext(incontextstring.c_str());
      if (!success) {
        LOG(FATAL) << "Could not read collision context from " << incontextstring;
      }
    } else {
      // number of collisions asked?
      auto col = ctx.options().get<int>("ncollisions");
      if (col != 0) {
        mgr.setupRun(col);
      } else {
        mgr.setupRun();
      }
      LOG(INFO) << "Initializing Spec ... have " << mgr.getRunContext().getEventRecords().size() << " times ";
      LOG(INFO) << "Serializing Context for later reuse";
      mgr.writeRunContext(ctx.options().get<std::string>("outcontext").c_str());
    }

    return doit;
  };
```

