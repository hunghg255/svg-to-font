# Convert svg to font

[![npm version](https://badge.fury.io/js/csvg-to-font.svg)](https://badge.fury.io/js/csvg-to-font) [![npm](https://img.shields.io/npm/dw/csvg-to-font.svg?logo=npm)](https://www.npmjs.com/package/csvg-to-font) [![npm](https://img.shields.io/bundlephobia/minzip/csvg-to-font)](https://www.npmjs.com/package/csvg-to-font)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

# Demo

[Github](https://github.com/hunghg255/react-svg-to-font)

[Demo](https://react-svg-to-font.vercel.app/)

## Install

```bash
npm i csvg-to-font@latest --save-dev
```

## Setup

### Create file: `svgtofont.config.ts` or `svgtofont.config.mjs` or `svgtofont.config.js`

```js
import { defineConfig } from 'csvg-to-font';

export default defineConfig({
  src: 'svg', // svg path
  dist: 'dist', // output path
  fontName: 'svgtofont', // font name
  css: true, // Create CSS files.
  outSVGReact: true,
  outSVGPath: true,
  typescript: true,
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
    "svg-2-font": "csvg-to-font",
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
    "svg-2-font": "csvg-to-font -c awesome",
  },
  ...
}
```
### About

<a href="https://www.buymeacoffee.com/hunghg255" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

Gia Hung – [hung.hg](https://hung.thedev.id)
