'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var cleanup = require('rollup-plugin-cleanup');
var rollupPluginTerser = require('rollup-plugin-terser');
var typescript = require('@rollup/plugin-typescript');
var define = require('rollup-plugin-define');
var shebang = require('rollup-plugin-add-shebang');
var path = require('path');
var fs = require('fs');
var pkgInfo = require('./package.json');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var path__namespace = /*#__PURE__*/_interopNamespaceDefault(path);
var fs__namespace = /*#__PURE__*/_interopNamespaceDefault(fs);

function getTsFiles(dir) {
    const result = [];
    const files = fs__namespace.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        const filePath = path__namespace.join(dir, file.name);
        if (file.isDirectory() && !file.name.startsWith('.')) {
            const indexFilePath = path__namespace.join(filePath, 'index.ts');
            if (fs__namespace.existsSync(indexFilePath)) {
                result.push(indexFilePath);
            }
        }
        else if (file.name.endsWith('.ts')) {
            result.push(filePath);
        }
    }
    return result;
}

const output = {
    preserveModules: true,
    dir: "dist",
    format: "commonjs",
};
const plugins = [
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
    output.sourcemap = true;
}
else {
    output.sourcemap = false;
    plugins.push(cleanup({
        comments: 'none',
        extensions: ['*'],
    }));
    plugins.push(rollupPluginTerser.terser());
}
const extraTsFiles = getTsFiles(path.join(__dirname, "./src/plugins"));
const config = {
    input: ['./bin/command.ts', "./index.ts", ...extraTsFiles],
    output,
    external: ['tslib'],
    watch: {
        include: ['src/**', 'bin/**'],
    },
    plugins
};

exports.default = config;
