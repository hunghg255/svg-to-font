import { svg2Font } from '../dist/index.mjs';
import path from 'path';

const rootPath = path.resolve(process.cwd(), 'test');

svg2Font({
  src: path.resolve(rootPath, 'svg'), // svg path
  dist: path.resolve(rootPath, 'dist'), // output path
  fontName: 'svgtofont', // font name
  css: true, // Create CSS files.
  startUnicode: 20000, // unicode start number
  emptyDist: true,
}).then(() => {
  console.log('done!!!!');
});
