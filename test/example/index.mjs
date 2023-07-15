import { svg2Font } from '../../dist/index.mjs';
import path from 'path';

const rootPath = path.resolve(process.cwd(), 'test', 'example');

svg2Font({
  src: path.resolve(rootPath, 'svg'), // svg path
  dist: path.resolve(rootPath, 'dist'), // output path
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
    favicon: path.resolve(rootPath, 'favicon.png'),
    // Must be a .svg format image.
    logo: path.resolve(rootPath, 'svg', 'git.svg'),
    // version: pkg.version,
    meta: {
      description: 'Converts SVG fonts to TTF/EOT/WOFF/WOFF2/SVG format.',
      keywords: 'svgtofont,TTF,EOT,WOFF,WOFF2,SVG',
    },
    description: ``,
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
}).then(() => {
  console.log('Example::::done!');
});
