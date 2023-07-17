import path from 'node:path';
import jiti from 'jiti';
import * as commander from 'commander';
import { svg2Font } from './index';

function tryRequire(id: string, rootDir: string = process.cwd()) {
  const _require = jiti(rootDir, { interopDefault: true, esmResolve: true });
  try {
    return _require(id);
  } catch (error: any) {
    if (error.code !== 'MODULE_NOT_FOUND') {
      console.error(`Error trying import ${id} from ${rootDir}`, error);
    }
    return {};
  }
}

const COLORS = {
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  console_color: '\x1b[0m',
} as const;

const colorConsoleText = (text: string, color: keyof typeof COLORS) => {
  const coloredText = `${COLORS[color]}${text}${COLORS.console_color}`;
  return console.log(coloredText);
};

const DEFAULT_FILE_NAME = 'svgtofont';

export async function startCli(cwd = process.cwd(), argv = process.argv) {
  try {
    commander.program.option('-c, --config <file_name>', 'File name config').parse(argv);
    const options = commander.program.opts();

    const FILE_NAME_CONFIG = options.config ?? DEFAULT_FILE_NAME;

    const configDir = path.resolve(cwd, FILE_NAME_CONFIG);

    const defineConfig = tryRequire(`./${FILE_NAME_CONFIG}.config`, configDir) || {};

    if (JSON.stringify(defineConfig) === '{}') {
      throw new Error('Not Found Config');
    }

    const optionsConfig = defineConfig();

    svg2Font({
      ...optionsConfig,
      website: {
        index: 'font-class',
        title: optionsConfig?.fontName || 'svgtofont',
        links: [
          {
            title: 'GitHub',
            url: 'https://github.com/hunghg255/svg-to-font',
          },
        ],
      },
      svgicons2svgfont: {
        fontHeight: 1000,
        normalize: true,
      },
      startNumber: 20000,
    });
  } catch (error: any) {
    colorConsoleText('❌ csvg-to-svg Error: ' + error.message, 'red');
  }
}
