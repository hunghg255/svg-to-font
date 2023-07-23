import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'SVG to font',
  description: 'A library convert svg to font',
  outDir: 'docs',
  themeConfig: {
    socialLinks: [{ icon: 'github', link: 'https://github.com/hunghg255/svg-to-font' }],
  },
});
