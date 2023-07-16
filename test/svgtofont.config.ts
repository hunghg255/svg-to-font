import { defineConfig } from '../dist/index.mjs';

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
