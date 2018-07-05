# FAQ

## How to convert a talk into a PDF ?

```bash
npm run pdf -- [URL] [filename.pdf]
```

where `URL` is most likely a local one when developing, e.g. `http://localhost:1313/talk/2017-11-09-alice-week-mrrtf-status`

Note that it's not a very fast process... and not completely correct either. 

The other option is actually the one from `revealjs` site itself. Open the presentation in `Google Chrome` with `?print-pdf` appended to the URL. Command-P -> change margins to 0 -> print to pdf.

## There is a new version of revealjs. How to take advantage of it ?

```
. ./import-reveal.sh
```

The script assumes that :

- the reveal you want to import is at gh = `$HOME/github.com/[github username]/revealjs`
- it is fine to replace files in `static/reveal` hierarchy

## Adding/removing code known by highlight.js plugin

The [highlight.js](https://highlightjs.org) plugin shipped by default with `revealjs` has all languages incorporated, meaning the `js` file is about half a megabyte. This can be shrinked by :

- [download](https://highlightjs.org/download) a version with only the required languages included. You get a `highlight.pack.js`
- repackage it by replace the end (L74-) of the `plugin/hightlight/hightlight.js` by the content of `hightlight.pack.js`, e.g. by removing end of file and doing `cat $HOME/Downloads/highlight/highlight.pack.js >> highlight.js`

Note also that by default `revealjs` only has the `zenburn` css style for highlight. Others can be found in the `styles` directory of the downloaded custom highlight pack, and copied into the reveal `lib/css/` directory.