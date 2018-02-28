+++
author = "Laurent Aphecetche"
tags = [ "talks","o2" ]
headline = "Muon Week 2018"
homebutton = true
printbutton = true
theme = "simple"
center = true
controls = true
transition = "slide"
timeline = false
title = "MRRTF Status"
date = 2018-02-28T12:30:27+01:00
draft = false
+++

## <i class="fa fa-plus" aria-hidden=true></i> Things are starting to move

### we are getting more comfortable with "new" software engineering technologies

- Continuous Integration (CI)
- Git Pull Requests (PR)
- CMake
- Boost Test
- Google Benchmark
- Modern C++

---

## <i class="fa fa-minus" aria-hidden=true></i> Still kind of slowly though

### New rules to learn ...
### New rules to discuss ;-)

---

## (Pieces of) Reconstruction

### 1st versions in [AliceO2 repo](https://github.com/aliceo2group/aliceo2)

- mch preclustering <i class="fa fa-check" aria-hidden-true></i>
- mch mapping (segmentation) [PR 866](https://github.com/AliceO2Group/AliceO2/pull/886)
- mid clustering PR soon

---

## (Pieces of) Simulation

- mch geometry porting : work started

---

## Still a long way to go

## ... if we compare to the <a href="https://alice.its.cern.ch/jira/secure/RapidBoard.jspa?rapidView=242&projectKey=MRRTF&view=planning.nodetail">work plan</a>

---

![](/talk/2018-03-01-muon-week-india-mrrtf/planning-1.png)

---

## A sample of work "done" :

## MCH mapping redux

---

## Self-contained Mapping

### No more OCDB (or ASCII) files to be loaded.
### You load the library, you get the mapping.

```c++
int detElemId{100}; bool isBendingPlane{true};

o2::mch::mapping::Segmentation seg{detElemId, isBendingPlane};

double x{1.5}; double y{18.6};

int paduid = seg.findPadByPosition(x, y);

if (seg.isValid(paduid)) {
  std::cout << "There is a pad at position " << x << "," << y << "\n"
            << " which belongs to dualSampa " << seg.padDualSampaId(paduid)
            << " and has a x-size of " << seg.padSizeX(paduid) << " cm\n";
}

assert(paduid == seg.findPadByFEE(76, 9));
```

---

## Collateral Improvements

- Debugging the mapping requires some sort of visualisation
- Used a web techno : SVGs
- A first step toward mchview-in-a-browser

---

````bash
> mch-mapping-svg-segmentation3 --help
Generic options:
  --help                produce help message
  --hidepads            hide pad outlines
  --hidedualsampas      hide dualsampa outlines
  --hidedes             hide detection element outline
  --hidepadchannels     hide pad channel numbering
  --de arg              which detection element to consider
  --prefix arg (=seg)   prefix used for outfile filename(s)
  --point arg           points to show
  --all                 use all detection elements
> mch-mapping-svg-segmentation3 --hidepadchannels --hidepads --de 501
> open seg-501-B.html
```

---


- A SVG is a web document.
- Can be styled using CSS.
- Rendered by the browser. No rendering code to write !

```html
<g class="dualsampas">
<polygon points="40,-4 40,-20 45,-20 45,-4 40,-4 "/>
<polygon points="45,-4 45,-20 50,-20 50,-4 45,-4 "/>
<polygon points="50,-4 50,-20 55,-20 55,-4 50,-4 "/>
...
```

```css
.detectionelements { fill: none; stroke: yellow; stroke-width: 0.5; } 
.dualsampas { fill: black; stroke: gray; stroke-width: 0.25; opacity: 0.2; }
```

<svg width="1024" height="264" viewBox="-75.000000 -20.000000 155.000000 40.000000">
<style>
.detectionelements { fill: none; stroke: yellow; stroke-width: 0.5; } 
.dualsampas { fill: black; stroke: gray; stroke-width: 0.25; fill-opacity: 0.2; }
</style>
<g class="dualsampas">
<polygon points="40,-4 40,-20 45,-20 45,-4 40,-4 "/>
<polygon points="45,-4 45,-20 50,-20 50,-4 45,-4 "/>
<polygon points="50,-4 50,-20 55,-20 55,-4 50,-4 "/>
<polygon points="55,-4 55,-17.5 57.5,-17.5 57.5,-15 60,-15 60,-13 62.5,-13 62.5,-5.5 60,-5.5 60,-4 55,-4 "/>
<polygon points="-75,12 -75,-20 -70,-20 -70,12 -75,12 "/>
<polygon points="-70,0 -70,-20 -65,-20 -65,-4 -60,-4 -60,0 -70,0 "/>
<polygon points="-65,-4 -65,-20 -55,-20 -55,-4 -65,-4 "/>
<polygon points="-60,0 -60,-4 -55,-4 -55,-20 -45,-20 -45,-12 -50,-12 -50,0 -60,0 "/>
<polygon points="-50,0 -50,-12 -45,-12 -45,-20 -40,-20 -40,0 -50,0 "/>
<polygon points="-40,0 -40,-20 -35,-20 -35,-12 -30,-12 -30,0 -40,0 "/>
<polygon points="-35,-12 -35,-20 -25,-20 -25,-4 -20,-4 -20,0 -30,0 -30,-12 -35,-12 "/>
<polygon points="-25,-4 -25,-20 -15,-20 -15,-4 -25,-4 "/>
<polygon points="-20,0 -20,-4 -15,-4 -15,-20 -5,-20 -5,-12 -10,-12 -10,0 -20,0 "/>
<polygon points="-10,0 -10,-12 -5,-12 -5,-20 0,-20 0,0 -10,0 "/>
<polygon points="0,0 0,-20 2.5,-20 2.5,-12 5,-12 5,0 0,0 "/>
<polygon points="2.5,-12 2.5,-20 7.5,-20 7.5,-4 10,-4 10,0 5,0 5,-12 2.5,-12 "/>
<polygon points="7.5,-4 7.5,-20 12.5,-20 12.5,-4 7.5,-4 "/>
<polygon points="10,0 10,-4 12.5,-4 12.5,-20 17.5,-20 17.5,-12 15,-12 15,0 10,0 "/>
<polygon points="15,0 15,-12 17.5,-12 17.5,-20 20,-20 20,0 15,0 "/>
<polygon points="20,0 20,-20 22.5,-20 22.5,-12 25,-12 25,0 20,0 "/>
<polygon points="22.5,-12 22.5,-20 27.5,-20 27.5,-4 30,-4 30,0 25,0 25,-12 22.5,-12 "/>
<polygon points="27.5,-4 27.5,-20 32.5,-20 32.5,-4 27.5,-4 "/>
<polygon points="30,0 30,-4 32.5,-4 32.5,-20 37.5,-20 37.5,-12 35,-12 35,0 30,0 "/>
<polygon points="35,0 35,-12 37.5,-12 37.5,-20 40,-20 40,0 35,0 "/>
<polygon points="-50,12 -50,0 -40,0 -40,20 -45,20 -45,12 -50,12 "/>
<polygon points="-60,4 -60,0 -50,0 -50,12 -45,12 -45,20 -55,20 -55,4 -60,4 "/>
<polygon points="-65,20 -65,4 -55,4 -55,20 -65,20 "/>
<polygon points="-75,20 -75,12 -70,12 -70,0 -60,0 -60,4 -65,4 -65,20 -75,20 "/>
<polygon points="-10,12 -10,0 0,0 0,20 -5,20 -5,12 -10,12 "/>
<polygon points="-20,4 -20,0 -10,0 -10,12 -5,12 -5,20 -15,20 -15,4 -20,4 "/>
<polygon points="-25,20 -25,4 -15,4 -15,20 -25,20 "/>
<polygon points="-35,20 -35,12 -30,12 -30,0 -20,0 -20,4 -25,4 -25,20 -35,20 "/>
<polygon points="-40,20 -40,0 -30,0 -30,12 -35,12 -35,20 -40,20 "/>
<polygon points="35,12 35,0 40,0 40,20 37.5,20 37.5,12 35,12 "/>
<polygon points="30,4 30,0 35,0 35,12 37.5,12 37.5,20 32.5,20 32.5,4 30,4 "/>
<polygon points="27.5,20 27.5,4 32.5,4 32.5,20 27.5,20 "/>
<polygon points="22.5,20 22.5,12 25,12 25,0 30,0 30,4 27.5,4 27.5,20 22.5,20 "/>
<polygon points="20,20 20,0 25,0 25,12 22.5,12 22.5,20 20,20 "/>
<polygon points="15,12 15,0 20,0 20,20 17.5,20 17.5,12 15,12 "/>
<polygon points="10,4 10,0 15,0 15,12 17.5,12 17.5,20 12.5,20 12.5,4 10,4 "/>
<polygon points="7.5,20 7.5,4 12.5,4 12.5,20 7.5,20 "/>
<polygon points="2.5,20 2.5,12 5,12 5,0 10,0 10,4 7.5,4 7.5,20 2.5,20 "/>
<polygon points="0,20 0,0 5,0 5,12 2.5,12 2.5,20 0,20 "/>
<polygon points="75,-1.5 75,-7 77.5,-7 77.5,-6.5 80,-6.5 80,20 77.5,20 77.5,-1.5 75,-1.5 "/>
<polygon points="72.5,3 72.5,-7.5 75,-7.5 75,-1.5 77.5,-1.5 77.5,20 75,20 75,3 72.5,3 "/>
<polygon points="70,7 70,-8 72.5,-8 72.5,3 75,3 75,20 72.5,20 72.5,7 70,7 "/>
<polygon points="67.5,20 67.5,1 70,1 70,7 72.5,7 72.5,20 67.5,20 "/>
<polygon points="65,20 65,-2.5 67.5,-2.5 67.5,-8.5 70,-8.5 70,1 67.5,1 67.5,20 65,20 "/>
<polygon points="62.5,20 62.5,-4.5 65,-4.5 65,-10 67.5,-10 67.5,-2.5 65,-2.5 65,20 62.5,20 "/>
<polygon points="60,20 60,-5.5 62.5,-5.5 62.5,-11 65,-11 65,-4.5 62.5,-4.5 62.5,20 60,20 "/>
<polygon points="55,20 55,12 57.5,12 57.5,-4 60,-4 60,20 55,20 "/>
<polygon points="52.5,20 52.5,4 55,4 55,-4 57.5,-4 57.5,12 55,12 55,20 52.5,20 "/>
<polygon points="50,20 50,-4 55,-4 55,4 52.5,4 52.5,20 50,20 "/>
<polygon points="45,20 45,12 47.5,12 47.5,-4 50,-4 50,20 45,20 "/>
<polygon points="42.5,20 42.5,4 45,4 45,-4 47.5,-4 47.5,12 45,12 45,20 42.5,20 "/>
<polygon points="40,20 40,-4 45,-4 45,4 42.5,4 42.5,20 40,20 "/>
</g>
<g class="detectionelements">
<polygon points="-75,20 -75,-20 55,-20 55,-17.5 57.5,-17.5 57.5,-15 60,-15 60,-13 62.5,-13 62.5,-11 65,-11 65,-10 67.5,-10 67.5,-8.5 70,-8.5 70,-8 72.5,-8 72.5,-7.5 75,-7.5 75,-7 77.5,-7 77.5,-6.5 80,-6.5 80,20 -75,20 "/>
</svg>

---

# <i class="fa fa-question" aria-hidden="true"></i> or <i class="fa fa-commenting" aria-hidden="true"></i> 
