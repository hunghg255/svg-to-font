/// <reference types="./types" />

import path from 'node:path';

import color from 'colors-cli';
import fs from 'fs-extra';
import { SvgIcons2FontOptions } from 'svgicons2svgfont';
import { Config } from 'svgo';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { generateIconsSource, generateReactIcons } from './generate';
import { log } from './log';
import {
  createSVG,
  createTTF,
  createEOT,
  createWOFF,
  createWOFF2,
  CSSOptions,
  createHTML,
  createTypescript,
  TypescriptOptions,
} from './utils';
import { stylesTemplate } from './templates/styles';
import { readConfig } from 'unreadconfig';

export type SvgToFontOptions = {
  /** Support for .svgtofontrc and more configuration files. */
  // config?: AutoConfOption<SvgToFontOptions>;
  /** A value of `false` disables logging */
  log?: boolean;
  /** log callback function  */
  logger?: (message: string) => void;
  /**
   * The output directory.
   * @default fonts
   * @example
   * ```
   * ```
   */
  dist: string;
  /**
   * svg path
   * @default svg
   * @example
   * ```
   * ```
   */
  src: string;
  /**
   * The font family name you want.
   * @default iconfont
   */
  fontName?: string;
  /**
   * Create CSS/LESS/Scss/Styl files, default `true`.
   */
  css?: boolean | CSSOptions;
  /**
   * Output `./dist/react/`, SVG generates `react` components.
   */
  outSVGReact?: boolean;
  /**
   * Output `./dist/svgtofont.json`, The content is as follows:
   * @example
   * ```js
   * {
   *   "adobe": ["M14.868 3H23v19L14.868 3zM1 3h8.8.447z...."],
   *   "git": ["M2.6 10.59L8.38 4.8l1.69 1.7c-.24c-.6.34-1 .99-1..."],
   *   "stylelint": ["M129.74 243.648c28-100.5.816c2.65..."]
   * }
   * ```
   */
  outSVGPath?: boolean;
  /**
   * Output `./dist/info.json`, The content is as follows:
   * @example
   * ```js
   * {
   *    "adobe": {
   *      "encodedCode": "\\ea01",
   *      "prefix": "svgtofont",
   *      "className": "svgtofont-adobe",
   *      "unicode": "&#59905;"
   *    },
   *    .....
   * }
   * ```
   */
  generateInfoData?: boolean;
  /**
   * This is the setting for [svgicons2svgfont](https://github.com/nfroidure/svgicons2svgfont/tree/dd713bea4f97afa59f7dba6a21ff7f22db565bcf#api)
   */
  svgicons2svgfont?: SvgIcons2FontOptions;
  /** Some options can be configured with svgoOptions though it. [svgo](https://github.com/svg/svgo#configuration) */
  svgoOptions?: Config;
  /**
   * Create font class name prefix, default value font name.
   * @default fontName
   */
  classNamePrefix?: SvgToFontOptions['fontName'];
  /**
   * Symbol Name Delimiter, @default `-`
   */
  symbolNameDelimiter?: string;
  /**
   * Directory of custom templates.
   */
  styleTemplates?: string;
  /**
   * unicode start number
   * @default 10000
   */
  startUnicode?: number;
  /** Get Icon Unicode */
  getIconUnicode?: (name: string, unicode: string, startUnicode: number) => [string, number];
  /**
   * should the name(file name) be used as unicode? this switch allows for the support of ligatures.
   * @default false
   */
  useNameAsUnicode?: boolean;
  /**
   * consoles whenever {{ cssString }} template outputs unicode characters or css vars
   * @default false
   */
  useCSSVars?: boolean;
  /**
   * Clear output directory contents
   * @default false
   */
  emptyDist?: boolean;
  /**
   * This is the setting for [svg2ttf](https://github.com/fontello/svg2ttf/tree/c33a126920f46b030e8ce960cc7a0e38a6946bbc#svg2ttfsvgfontstring-options---buf)
   */
  svg2ttf?: unknown;
  website?: {
    /**
     * @default unicode
     */
    index?: 'font-class' | 'unicode' | 'symbol';
    /**
     * website title
     */
    title?: string;
    description?: string;
    template?: string;
    footerInfo?: string;
    links: Array<{
      title: string;
      url: string;
    }>;
  };

  /**
   * Create typescript file with declarations for icon classnames
   * @default false
   */
  typescript?: boolean | TypescriptOptions;
};

interface IDefineConfig {
  src: string;
  dist: string;
  fontName: string;
  css: boolean;
  outSVGReact?: boolean;
  outSVGPath?: boolean;
  typescript?: boolean;
}

declare global {
  const options: any;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export type IconInfo = {
  prefix: string;
  symbol: string;
  unicode: string;
  className: string;
  encodedCode: string | number;
};
export type InfoData = Record<string, Partial<IconInfo>>;

export const defineConfig = (options: IDefineConfig) => {
  return options;
};

export const svg2Font = async (options: SvgToFontOptions) => {
  const defaultOptions: SvgToFontOptions = Object.assign(
    {},
    {
      dist: path.resolve(process.cwd(), options.dist),
      src: path.resolve(process.cwd(), options.src),
      startUnicode: 0xea_01,
      svg2ttf: {},
      svgicons2svgfont: {
        fontName: 'iconfont',
      },
      fontName: 'iconfont',
      symbolNameDelimiter: '-',
    },
    options,
  );
  const data = readConfig('svgtofont', {
    mustExist: true,
    default: defaultOptions,
  });

  options = Object.assign({}, defaultOptions, data);

  if (options.log === undefined) {
    options.log = true;
  }
  log.disabled = !options.log;
  if (options.logger && typeof options.logger === 'function') {
    (log as any).logger = options.logger;
  }

  //@ts-ignore
  options.svgicons2svgfont.fontName = options.fontName;
  options.classNamePrefix = options.classNamePrefix || options.fontName;

  const fontSize =
    options.css && typeof options.css !== 'boolean' && options.css.fontSize
      ? options.css.fontSize
      : '16px';
  // If you generate a font you need to generate a style.
  if (options.website && !options.css) {
    options.css = true;
  }
  const infoDataPath = path.resolve(options.dist as any, 'info.json');
  try {
    if (options.emptyDist) {
      await fs.emptyDir(options.dist as any);
    }
    // Ensures that the directory exists.
    await fs.ensureDir(options.dist as any);
    const unicodeObject = await createSVG(options);

    const cssToVars: string[] = [];
    let cssString: string[] = [];
    const cssRootVars: string[] = [];
    const cssIconHtml: string[] = [];
    const unicodeHtml: string[] = [];
    const symbolHtml: string[] = [];
    const prefix = options.classNamePrefix || options.fontName;
    const infoData: InfoData = {};

    Object.keys(unicodeObject).forEach((name, index, self) => {
      if (!infoData[name]) {
        infoData[name] = {};
      }
      const _code = unicodeObject[name];
      //@ts-ignore
      let symbolName = options.classNamePrefix + options.symbolNameDelimiter + name;
      let iconPart = symbolName + '">';
      let encodedCodes: string | number = _code.charCodeAt(0);

      if (options.useNameAsUnicode) {
        symbolName = name;
        iconPart = prefix + '">' + name;
        encodedCodes = _code
          .split('')
          .map((x) => x.charCodeAt(0))
          .join(';&amp;#');
      } else {
        cssToVars.push(`$${symbolName}: "\\${encodedCodes.toString(16)}";\n`);
        if (options.useCSSVars) {
          if (index === 0) {
            cssRootVars.push(':root {\n');
          }
          cssRootVars.push(`--${symbolName}: "\\${encodedCodes.toString(16)}";\n`);
          cssString.push(`.${symbolName}:before { content: var(--${symbolName}); }\n`);
          if (index === self.length - 1) {
            cssRootVars.push('}\n');
          }
        } else {
          cssString.push(`.${symbolName}:before { content: "\\${encodedCodes.toString(16)}"; }\n`);
        }
      }
      infoData[name].encodedCode = `\\${encodedCodes.toString(16)}`;
      infoData[name].prefix = prefix;
      infoData[name].className = symbolName;
      infoData[name].unicode = `&#${encodedCodes};`;
      cssIconHtml.push(
        `<li class="class-icon"><i class="${iconPart}</i><p class="name">${symbolName}</p></li>`,
      );
      unicodeHtml.push(
        `<li class="unicode-icon"><span class="iconfont">${_code}</span><h4>${name}</h4><span class="unicode">&amp;#${encodedCodes};</span></li>`,
      );
      symbolHtml.push(`
        <li class="symbol">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="${options.fontName}.symbol.svg#${symbolName}"></use>
          </svg>
          <h4>${symbolName}</h4>
        </li>
      `);
    });

    if (options.useCSSVars) {
      cssString = [...cssRootVars, ...cssString];
    }

    if (options.generateInfoData) {
      await fs.writeJSON(infoDataPath, infoData, { spaces: 2 });
      log.log(`${color.green('SUCCESS')} Created ${infoDataPath} `);
    }
    const ttf = await createTTF(options);
    await createEOT(options, ttf);
    await createWOFF(options, ttf);
    await createWOFF2(options, ttf);
    // await createSvgSymbol(options);

    if (options.css) {
      fs.writeFileSync(
        `${options.dist}/${options.fontName}.css`,
        stylesTemplate({
          fontname: options.fontName,
          cssString: cssString.join(''),
          cssToVars: cssToVars.join(''),
          fontSize,
          timestamp: Date.now(),
          prefix,
        }),
      );
    }

    if (options.typescript) {
      await createTypescript({ ...options, typescript: options.typescript });
    }

    if (options.website) {
      const pageName = ['font-class', 'unicode', 'symbol'];
      let fontClassPath = path.join(options.dist as any, 'index.html');

      // setting default home page.
      const indexName = pageName.includes(options.website.index as any)
        ? pageName.indexOf(options.website.index as any)
        : 0;

      for (const [index, name] of pageName.entries()) {
        const _path = path.join(
          options.dist as any,
          indexName === index ? 'index.html' : `${name}.html`,
        );
        if (name === 'font-class') {
          fontClassPath = _path;
        }
      }
      // default template
      options.website.template =
        options.website.template || path.join(__dirname, 'website', 'index.ejs');
      // template data
      const tempData: SvgToFontOptions['website'] & {
        fontname: string;
        classNamePrefix: string;
        _type: string;
        _link: string;
        _IconHtml: string;
        _title: string;
      } = {
        footerInfo: null,
        ...options.website,
        fontname: options.fontName,
        classNamePrefix: options.classNamePrefix,
        _type: 'font-class',
        _link: `${
          (options.css && typeof options.css !== 'boolean' && options.css.fileName) ||
          options.fontName
        }.css`,
        _IconHtml: cssIconHtml.join(''),
        _title: options.website.title || options.fontName,
      } as any;
      log.log(`${color.green('SUCCESS')} Created ${fs.existsSync(fontClassPath)} `);
      if (!fs.existsSync(fontClassPath)) {
        fs.createFileSync(fontClassPath);
      }

      const classHtmlStr = await createHTML(tempData.template as string, tempData);

      fs.outputFileSync(fontClassPath, classHtmlStr);
      log.log(`${color.green('SUCCESS')} Created ${fontClassPath} `);
    }

    if (options.outSVGPath) {
      const outPath = await generateIconsSource(options);
      log.log(`${color.green('SUCCESS')} Created ${outPath} `);
    }
    if (options.outSVGReact) {
      const outPath = await generateReactIcons(options);
      log.log(`${color.green('SUCCESS')} Created React Components. `);
    }
  } catch (error) {
    log.log('SvgToFont:CLI:ERR:', error);
  }
};
