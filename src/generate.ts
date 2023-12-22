import path from 'node:path';

import fs from 'fs-extra';
import { optimize } from 'svgo';

import { SvgToFontOptions } from './';
import { filterSvgFiles, toPascalCase } from './utils';

/**
 * Generate Icon SVG Path Source
 * <font-name>.json
 */
export async function generateIconsSource(options: SvgToFontOptions) {
  const ICONS_PATH = filterSvgFiles(options.src as any);
  const data = await buildPathsObject(ICONS_PATH, options);
  const outPath = path.join(options.dist as any, `${options.fontName}.json`);
  await fs.outputFile(outPath, `{${data}\n}`);
  return outPath;
}

/**
 * Loads SVG file for each icon, extracts path strings `d="path-string"`,
 * and constructs map of icon name to array of path strings.
 * @param {array} files
 */
async function buildPathsObject(files: string[], options: SvgToFontOptions) {
  const svgoOptions = options.svgoOptions || {};
  return Promise.all(
    files.map(async (filepath) => {
      const name = path.basename(filepath, '.svg');
      const svg = fs.readFileSync(filepath, 'utf8');
      const pathStrings = optimize(svg, {
        path: filepath,
        ...options,
        plugins: [
          'convertTransform',
          ...(svgoOptions.plugins || []),
          // 'convertShapeToPath'
        ],
      });
      const str: string[] = (pathStrings.data.match(/ d="[^"]+"/g) || []).map((s) => s.slice(3));
      return `\n"${name}": [${str.join(',\n')}]`;
    }),
  );
}

const reactSource = (
  name: string,
  size: string,
  fontName: string,
  source: string,
) => `import React from 'react';
export const ${name} = props => (
  <svg viewBox="0 0 20 20" width="${size}" height="${size}" {...props} className={\`${fontName} \${props.className ? props.className : ''}\`}>${source}</svg>
);
`;

const reactTypeSource = (name: string) => `import React from 'react';
export declare const ${name}: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
`;

/**
 * Generate React Icon
 * <font-name>.json
 */
export async function generateReactIcons(options: SvgToFontOptions) {
  const ICONS_PATH = filterSvgFiles(options.src as any);
  const data = await outputReactFile(ICONS_PATH, options);
  const outPath = path.join(options.dist as any, 'react', 'index.js');
  fs.outputFileSync(outPath, data.join('\n'));
  fs.outputFileSync(outPath.replace(/\.js$/, '.d.ts'), data.join('\n'));
  return outPath;
}

async function outputReactFile(files: string[], options: SvgToFontOptions) {
  const svgoOptions = options.svgoOptions || {};
  const fontSize =
    options.css && typeof options.css !== 'boolean' && options.css.fontSize
      ? options.css.fontSize
      : '16px';
  const fontName = options.classNamePrefix || options.fontName;
  return Promise.all(
    files.map(async (filepath) => {
      let name = toPascalCase(path.basename(filepath, '.svg'));
      if (/^[Rr]eact$/.test(name)) {
        name = name + toPascalCase(fontName as any);
      }
      const svg = fs.readFileSync(filepath, 'utf8');
      const pathData = optimize(svg, {
        path: filepath,
        ...svgoOptions,
        plugins: [
          'removeXMLNS',
          'removeEmptyAttrs',
          'convertTransform',
          // 'convertShapeToPath',
          // 'removeViewBox'
          ...(svgoOptions.plugins || []),
        ],
      });
      const str: string[] = (pathData.data.match(/ d="[^"]+"/g) || []).map((s) => s.slice(3));
      const outDistPath = path.join(options.dist as any, 'react', `${name}.js`);
      const pathStrings = str.map((d, i) => `<path d=${d} fillRule="evenodd" />`);
      const comName = isNaN(Number(name.charAt(0))) ? name : toPascalCase(fontName as any) + name;
      fs.outputFileSync(
        outDistPath,
        reactSource(comName, fontSize, fontName as any, pathStrings.join(',\n')),
      );
      fs.outputFileSync(outDistPath.replace(/\.js$/, '.d.ts'), reactTypeSource(comName));
      return `export * from './${name}';`;
    }),
  );
}

const reactNativeSource = (
  fontName: string,
  defaultSize: number,
  iconMap: Map<string, string>,
) => `import { Text } from 'react-native';

const icons = ${JSON.stringify(Object.fromEntries(iconMap))};

export const ${fontName} = props => {
  const {name, ...rest} = props;
  return (<Text style={{fontFamily: '${fontName}', fontSize: ${defaultSize}, color: '#000000', ...rest}}>
    {icons[name]}
  </Text>);
};
`;

const reactNativeTypeSource = (
  name: string,
  iconMap: Map<string, string>,
) => `import { TextStyle } from 'react-native';

export type ${name}Names = ${[...iconMap.keys()].reduce((acc, key, index) => {
  if (index === 0) {
    acc = `'${key}'`;
  } else {
    acc += `| '${key}'`;
  }
  return acc;
}, `${'string'}`)}

export interface ${name}Props extends Omit<TextStyle, 'fontFamily' | 'fontStyle' | 'fontWeight'> {
  name: ${name}Names
}

export declare const ${name}: (props: ${name}Props) => JSX.Element;
`;

/**
 * Generate ReactNative Icon
 * <font-name>.json
 */
export function generateReactNativeIcons(
  options: SvgToFontOptions = {
    dist: '',
    src: '',
  },
  unicodeObject: Record<string, string>,
) {
  const ICONS_PATH = filterSvgFiles(options.src);
  outputReactNativeFile(ICONS_PATH, options, unicodeObject);
}

function outputReactNativeFile(
  files: string[],
  options: SvgToFontOptions = {
    dist: '',
    src: '',
  },
  unicodeObject: Record<string, string>,
) {
  //@ts-ignore
  const fontSizeOpt = typeof options.css !== 'boolean' && options.css.fontSize;
  //@ts-ignore
  const fontSize = typeof fontSizeOpt === 'boolean' ? 16 : parseInt(fontSizeOpt);
  const fontName = options.classNamePrefix || options.fontName;
  const iconMap = new Map<string, string>();
  files.map((filepath) => {
    const baseFileName = path.basename(filepath, '.svg');
    let name = toPascalCase(baseFileName);
    if (/^[rR]eactNative$/.test(name)) {
      //@ts-ignore
      name = name + toPascalCase(fontName);
    }
    iconMap.set(name, unicodeObject[baseFileName]);
  });
  const outDistPath = path.join(options.dist, 'reactNative', `${fontName}.js`);
  //@ts-ignore
  const comName = isNaN(Number(fontName.charAt(0))) ? fontName : toPascalCase(fontName) + name;
  //@ts-ignore
  fs.outputFileSync(outDistPath, reactNativeSource(comName, fontSize, iconMap));
  //@ts-ignore
  fs.outputFileSync(outDistPath.replace(/\.js$/, '.d.ts'), reactNativeTypeSource(comName, iconMap));
}
