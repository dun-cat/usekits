import type { RollupOptions, OutputOptions } from 'rollup';
import cleanup from 'rollup-plugin-cleanup';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import define from 'rollup-plugin-define';
import shebang from 'rollup-plugin-add-shebang';
import { getTsFiles } from './scripts/getTsFile';
import path from 'path';
import pkgInfo from './package.json';

const output: OutputOptions = {
  preserveModules: true,
  dir: "dist",
  format: "commonjs",
};

const plugins = [
  shebang({
    include: 'dist/bin/command.js'
  }),
  typescript({
    tsconfig: './tsconfig.json',
  }),
  define({
    replacements: {
      DEFINE_PACKAGE_VERSION: `"${pkgInfo.version}"`
    }
  })
];
if (process.env.NODE_ENV === 'development') {
  // During development include a source map. We don't ship this to npm,
  // because it significantly increases the module size:
  output.sourcemap = true;
} else {
  plugins.push(cleanup({
    comments: 'none',
    extensions: ['*'],
  }))
  // Minify code when publishing, this significantly decreases the module
  // size increased introduced by shipping both ESM and CJS:
  plugins.push(terser());
}
const extraTsFiles = getTsFiles(path.join(__dirname, "./src/plugins"));
const config: RollupOptions = {
  input: ['./bin/command.ts', ...extraTsFiles],
  output,
  watch: {
    include: ['src/**', 'bin/**'],
  },
  plugins,
  external: ['execa', "inquirer", "chalk", "axios", "ora", "commander", "fs-extra"]
};

export default config;