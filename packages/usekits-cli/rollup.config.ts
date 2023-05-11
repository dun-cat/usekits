import type { RollupOptions, OutputOptions } from 'rollup';
import cleanup from 'rollup-plugin-cleanup';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import define from 'rollup-plugin-define';
import copy from 'rollup-plugin-copy';
import shebang from 'rollup-plugin-add-shebang';
import { getTsFiles } from './scripts/getTsFile';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import path from 'path';
import pkgInfo from './package.json';

const output: OutputOptions = {
  // exports: 'named',
  preserveModules: true,
  dir: "dist",
  format: "commonjs",
};

const plugins = [
  nodeResolve(),
  shebang({
    include: 'dist/bin/command.js'
  }),
  define({
    replacements: {
      DEFINE_PACKAGE_VERSION: `"${pkgInfo.version}"`
    }
  }),
  typescript({
    tsconfig: './tsconfig.json',
  })
];
if (process.env.NODE_ENV === 'development') {
  // During development include a source map. We don't ship this to npm,
  // because it significantly increases the module size:
  output.sourcemap = true;
} else {
  output.sourcemap = false;
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
  input: ['./bin/command.ts', "./index.ts", ...extraTsFiles],
  output,
  external: Object.keys(pkgInfo.dependencies),
  watch: {
    include: ['src/**', 'bin/**'],
  },
  plugins
};

export default config;