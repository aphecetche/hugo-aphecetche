+++
author = "Laurent Aphecetche"
tags = [ "talks", "mrrtf" ]
headline = " "
homebutton = true
printbutton = true
theme = "lasimple"
center = true
controls = false
transition = "none"
timeline = false
code_theme = "tomorrow-night"
title = "MchView 2.0"
date = 2019-04-04
draft = false
footer = "L. Aphecetche | MchView 2.0 | April 4th 2019"
+++

## Current mchview

- based on old Root GUI
- visually and technically outdated
- difficult to maintain
- difficult to develop further

---

## Replace with something

- with a better looking UI.
- easier to develop
- easier to maintain
- easier to use from ~anywhere
- with more origins for data sources (e.g. clusters...)

---

## The mockup

<img src="mchview-mockup.png" width="70%" />

---

## UI elements

<img src="mchview-mockup-legend.png" width="90%" />

---

## UI elements = components

- Each component can be developped independently
- using a Javascript framework (Mithril or React)

---

## Current status

- [WIP](http://mchmapping.aphecetche.me:5678/)
- Not quite as the mockup yet
- more a proof-of-concept for the moment
- but progressing ...

---

## Trying it locally

```
> git clone https://github.com/mrrtf/mchview.git

> echo "MCHVIEW_PORT=4444\nMCH_MAPPING_API=http://mchmapping.aphecetche.me:3333\n
MCH_MAPPING_API_PORT=3333\n" > .env
```

### With Docker

```
> docker compose up -d mchview
```

### With npm

```
> git clone https://github.com/mrrtf/mchview.git

> npm install

> npm start
```

Open browser at `http://localhost:4444`
