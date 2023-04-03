// rollup.config.ts
import cleanup from 'rollup-plugin-cleanup';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import type { RollupOptions, OutputOptions } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import shebang from 'rollup-plugin-add-shebang';


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
  // resolve(),
  // commonjs(),
  // json()
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

const config: RollupOptions = {
  input: './bin/command.tsx',
  output,
  watch: {
    include: ['src/**', 'bin/**'],
  },
  plugins,
  external: ['execa', 'yargs', "react", "ink"]
};

export default config;