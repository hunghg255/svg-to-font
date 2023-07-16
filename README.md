# Convert svg to font

[![npm version](https://badge.fury.io/js/csvg-to-font.svg)](https://badge.fury.io/js/csvg-to-font) [![npm](https://img.shields.io/npm/dw/csvg-to-font.svg?logo=npm)](https://www.npmjs.com/package/csvg-to-font) [![npm](https://img.shields.io/bundlephobia/minzip/csvg-to-font)](https://www.npmjs.com/package/csvg-to-font)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

## Install

```bash
npm i csvg-to-font@latest --save-dev
```

## Setup

### Create file: `svgtofont.config.ts` or `svgtofont.config.mjs` or `svgtofont.config.js`

```js
import { defineConfig } from 'csvg-to-font';

export default defineConfig({
  src: './test/svg', // svg path
  dist: './test/dist', // output path
  // emptyDist: true, // Clear output directory contents
  fontName: 'svgtofont', // font name
  css: true, // Create CSS files.
  outSVGReact: true,
  outSVGPath: true,
  startNumber: 20000, // unicode start number
  svgicons2svgfont: {
    fontHeight: 1000,
    normalize: true,
  },
  typescript: true,
  // website = null, no demo html files
  website: {
    index: 'font-class',
    title: 'svgtofont',
    links: [
      {
        title: 'GitHub',
        url: 'https://github.com/hunghg255/svg-to-font',
      },
      {
        title: 'Font Class Demo',
        url: 'font-class.html',
      },
    ],
    footerInfo: `Licensed under MIT. (Yes it's free and <a target="_blank" href="https://github.com/hunghg255/svg-to-font">open-sourced</a>)`,
  },
});
```

## CLI (file package.json)

```
-c: Config
```

```json
{
  ...
  "scripts": {
    ...
    "svg-2-font": "svg-2-font",
  },
  ...
}
```

### Custom config file

- You can also use a custom config file instead of `svgtofont.config.ts`. Just create `<FILE_NAME>.config.ts` to build command

```js
Exp: awesome.config.ts;
```

```json
{
  ...
  "scripts": {
    ...
    "svg-2-font": "svg-2-font -c awesome",
  },
  ...
}
```
