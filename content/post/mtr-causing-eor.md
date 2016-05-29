+++
author = ""
date = "2016-05-29T19:02:17+02:00"
title = "Investigation of EOR for MTR"
tags = [ "aliroot","mtr","rc" ]
jira = ["RC-5286"]
+++

Following [Max's presentation](https://indico.cern.ch/event/505854/contributions/2160499/) at the [Muon Week 2016 in
Pornichet](https://indico.cern.ch/event/505854/) describing how a few runs are stopped by MTR, I've worked towards providing a relevant sample of raw data to our MTR readout experts. That sample should be the last events in each run, i.e. right before the crash.

To do so, part of the machinery already exists : using the SAF one can download the RAW data for the MUON spectrometer (by filtering out the other detector).

The remaining missing part was being able to extract events by timestamp. To that end two small executables are added (to AliPhysics PWG/muon/aaf directory, in order to be able to play a tinu bit with C++11) (see commit `162066596f0b1351a3aac8b24d9fb98dcebd70c2`):

```
aliraw-generate-entrylist --filelist collection.txt --entrylist entrylist.txt --from "2016-05-21 02:44:19" --to "2016-05-21 02:45:22"
```

which takes as input a list of raw data files (in ROOT format), e.g. :

```
/alice/data/2016/LHC16h/000254646/raw/16000254646019.1303.FILTER_RAWMUON_WITH_ALIPHYSICS_v5-06-04-01.root
/alice/data/2016/LHC16h/000254646/raw/16000254646033.1400.FILTER_RAWMUON_WITH_ALIPHYSICS_v5-06-04-01.root
/alice/data/2016/LHC16h/000254646/raw/16000254646033.503.FILTER_RAWMUON_WITH_ALIPHYSICS_v5-06-04-01.root
```

and generates a text file with the list of (TTree) entries which have an event timestamp in the required range :

```
/alice/data/2016/LHC16h/000254646/raw/16000254646019.1303.FILTER_RAWMUON_WITH_ALIPHYSICS_v5-06-04-01.root
26
346 349 350 351 352 353 354 355 356 357 359 360 361 362 363 364 365 358 366 367 368 369 372 373 370 371 
/alice/data/2016/LHC16h/000254646/raw/16000254646033.1400.FILTER_RAWMUON_WITH_ALIPHYSICS_v5-06-04-01.root
392
0 1 2 3 4 5 6 9 10 11 12 7 8 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 36 37 35 38 39 40 41 42 43 44 45 46 49 50 47 48 51 52 53 54 55 56 58 59 57 60 61 62 63 64 65 68 66 67 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 85 86 87 88 89 90 91 92 93 94 95 96 97 99 98 100 101 102 103 104 106 107 105 108 109 110 111 112 113 114 116 117 119 120 115 118 121 122 123 124 125 127 128 126 129 130 131 132 133 134 135 136 137 138 139 144 141 143 142 140 145 146 147 148 149 152 150 151 153 154 155 156 157 158 159 160 161 162 163 164 167 166 165 168 169 170 171 172 173 174 175 176 177 178 179 180 181 184 182 183 185 186 187 188 189 190 191 192 193 194 195 196 197 198 199 200 201 202 203 204 205 206 207 208 209 210 211 212 213 214 215 216 217 218 219 220 221 222 223 224 225 226 227 228 229 230 231 232 233 234 235 236 237 238 239 242 240 241 243 244 245 246 247 248 249 250 251 254 252 253 255 256 257 258 259 260 261 262 263 264 265 266 267 268 269 270 271 272 273 274 275 276 277 280 281 278 279 282 283 284 285 286 287 288 289 290 291 292 293 294 295 296 297 298 299 300 301 302 303 305 306 307 308 304 309 310 311 312 313 314 315 316 317 318 319 320 321 322 323 324 325 326 327 328 329 330 331 332 333 334 335 336 337 338 339 340 341 342 343 344 345 346 347 348 349 350 351 352 353 354 355 356 357 358 359 360 361 362 363 365 366 364 367 368 369 370 371 372 373 374 375 376 377 378 379 380 381 382 383 384 389 385 386 387 388 390 391 
```

Then the `entrylist.txt` file is used to extract from the `collection.txt` files a single root file with only those
entries.

```
aliraw-apply-entrylist --entrylist entrylist.txt --output toto.root
```
