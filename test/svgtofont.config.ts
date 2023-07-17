import { defineConfig } from '../dist/index.mjs';

export default defineConfig({
  src: 'svg', // svg path
  dist: 'dist', // output path
  fontName: 'hihi', // font name
  css: true, // Create CSS files.
  outSVGReact: true,
  outSVGPath: true,
  typescript: true,
});
