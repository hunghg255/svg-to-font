import path from 'node:path';
import jiti from 'jiti';
import * as commander from 'commander';
import http from 'http';
import fs from 'node:fs';
import * as globby from 'globby';
import * as chokidar from 'chokidar';
import { json2ts } from 'json-ts';

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

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const DEFAULT_FILE_NAME = 'i18n-typesafe';

export async function startCli(cwd = process.cwd(), argv = process.argv) {
  try {
    commander.program
      .option('-p, --port <number>', 'port to listen on', parseInt)
      .option('-w, --watch', 'watch for changes and reload')
      .option('-c, --config <file_name>', 'File name config')
      .parse(argv);
    const options = commander.program.opts();

    const PORT = options.port || 4321;
    const server = http.createServer();
    const FILE_NAME_CONFIG = options.config ?? DEFAULT_FILE_NAME;

    const configDir = path.resolve(cwd, FILE_NAME_CONFIG);

    const defineConfig = tryRequire(`./${FILE_NAME_CONFIG}.config`, configDir) || {};

    if (JSON.stringify(defineConfig) === '{}') {
      throw new Error('Not Found Config');
    }

    const { input: configInput, output: configOutput, library } = defineConfig();

    const input = configInput || './srcTest';

    const saveData = (file: any) => {
      fs.readFile(path.resolve(cwd, file), 'utf8', (err, data) => {
        if (err) {
          throw err;
        }

        let fileName = file.split('/');
        fileName = fileName[fileName.length - 1];
        fileName = fileName.split('.')[0];

        fs.writeFile(
          path.resolve(process.cwd(), `${configOutput}/${fileName}.d.ts`),
          `export ${json2ts(data, { rootName: `${fileName}` })}`,
          function (err) {
            if (err) {
              return console.log(err);
            }
            colorConsoleText('The file was saved!', 'green');
          },
        );
      });
    };

    const handleFiles = (files: any) => {
      const pathArr = files.map((file: string) => {
        let fileName: any = file.split('/');
        fileName = fileName[fileName.length - 1];
        fileName = fileName.split('.')[0];

        return fileName;
      });

      const interfaceNames = files.map((file: string) => {
        let fileName: any = file.split('/');
        fileName = fileName[fileName.length - 1];
        fileName = fileName.split('.')[0];

        return `I${capitalizeFirstLetter(fileName)}`;
      });

      // fs.writeFile(
      //   path.resolve(process.cwd(), `${configOutput}/index.ts`),
      //   templates({ paths: pathArr, interfaceNames, library }),
      //   function (err) {
      //     if (err) {
      //       return console.log(err);
      //     }
      //     colorConsoleText('The file was saved!', 'green');
      //   }
      // );

      for (let i = 0; i < files.length; i++) {
        saveData(files[i]);
      }
    };

    const initial = () => {
      if (typeof input === 'string') {
        const files = globby.globbySync(input);
        handleFiles(files);
      }
    };

    const watchFiles = () => {
      chokidar.watch(configInput).on('change', initial);
    };

    if (options.watch) {
      server.listen(PORT, () => {
        initial();
        watchFiles();
        colorConsoleText(`🚀 i18n typesafe is running at port ${PORT}`, 'yellow');
      });
    } else {
      initial();
    }
  } catch (error: any) {
    colorConsoleText('❌ i18n typesafe Error: ' + error.message, 'red');
  }
}
