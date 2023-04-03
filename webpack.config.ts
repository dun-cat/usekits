import path from "path";
import webpack from 'webpack';
const config: webpack.Configuration = {
  target: 'node',
  entry: './bin/command.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.cjs$/,
        type: 'javascript/auto',
      },
    ],
  },
  devtool: 'inline-source-map',
  // externals: ["yargs", "execa"],
  externalsPresets: {
    node: true // in order to ignore built-in modules like path, fs, etc. 
  },
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, 'src'),
    },
    extensions: ['.tsx', '.ts', '.js', '.cjs', '.mjs'],
  },
  output: {
    filename: "command.js",
    path: path.resolve(__dirname, 'dist/bin'),
    library: {
      type: "commonjs"
    }
  },
}

export default config;