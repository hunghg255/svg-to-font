<p align="center">
<a href="https://www.npmjs.com/package/csvg-to-font" target="_blank" rel="noopener noreferrer">
<img src="https://api.iconify.design/fluent:text-font-size-16-filled.svg?color=%23fdb4e2" alt="logo" width='100'/></a>
</p>

<p align="center">
  A library convert svg file to font
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/csvg-to-font" target="_blank" rel="noopener noreferrer"><img src="https://badge.fury.io/js/csvs-parsers.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/package/csvg-to-font" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/dt/csvs-parsers.svg?logo=npm" alt="NPM Downloads" /></a>
  <a href="https://bundlephobia.com/result?p=csvg-to-font" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/bundlephobia/minzip/csvg-to-font" alt="Minizip" /></a>
  <a href="https://github.com/hunghg255/csvg-to-font/graphs/contributors" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/all_contributors-1-orange.svg" alt="Contributors" /></a>
  <a href="https://github.com/hunghg255/csvg-to-font/blob/main/LICENSE" target="_blank" rel="noopener noreferrer"><img src="https://badgen.net/github/license/hunghg255/csvg-to-font" alt="License" /></a>
</p>

## Feature
- Convert svg to font
- Support React
- Support React Native
- Support Typescript

## Demo

[Github](https://github.com/hunghg255/react-svg-to-font)

[Demo](https://react-svg-to-font.vercel.app/)

## Install

```bash
npm i csvg-to-font@latest --save-dev
```

## Setup

### Create file: `svgtofont.config.{ts,js,mjs}`

```js
import { defineConfig } from 'csvg-to-font';

export default defineConfig({
  src: 'svg', // svg path
  dist: 'dist', // output path
  fontName: 'svgtofont', // font name
  css: true, // Create CSS files.
  outSVGReact: true,
  outSVGReactNative: true, // Create React native folder
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

- You can also use a custom config file instead of `svgtofont.config.{ts,js,mjs}`. Just create `<FILE_NAME>.config.{ts,js,mjs}` to build command

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
