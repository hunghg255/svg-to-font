import { defineConfig } from '../dist/index.mjs';

export default defineConfig({
  src: 'svg', // svg path
  dist: 'dist', // output path
  fontName: 'Icon', // font name
  css: false, // Create CSS files.
  outSVGReactNative: true,
  typescript: true,
});
