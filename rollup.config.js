const path = require('path');
const clear = require('rollup-plugin-clear');
const { babel } = require('@rollup/plugin-babel');
const { terser } = require('rollup-plugin-terser');

module.exports = [
    {
        input: 'src/index.js',
        output: {
            file: 'dist/evt.js',
            format: 'umd',
            name: 'evt',
        },
        plugins: [
            clear({
                targets: [path.resolve(__dirname, 'dist')],
            }),
            babel({ presets: ['@babel/preset-env'] }),
        ],
    },
    {
        input: 'src/index.js',
        output: {
            file: 'dist/evt.min.js',
            format: 'umd',
            name: 'evt',
        },
        plugins: [babel({ presets: ['@babel/preset-env'] }), terser()],
    },
    {
        input: 'src/index.js',
        output: {
            file: 'dist/evt.cjs.js',
            format: 'cjs',
        },
        plugins: [babel({ presets: ['@babel/preset-env'] })],
    },
    {
        input: 'src/index.js',
        output: {
            file: 'dist/evt.cjs.min.js',
            format: 'cjs',
        },
        plugins: [babel({ presets: ['@babel/preset-env'] }), terser()],
    },
    {
        input: 'src/index.js',
        output: {
            file: 'dist/evt.esm.js',
            format: 'es',
        },
        plugins: [babel({ presets: ['@babel/preset-env'] })],
    },
    {
        input: 'src/index.js',
        output: {
            file: 'dist/evt.esm.min.js',
            format: 'es',
        },
        plugins: [babel({ presets: ['@babel/preset-env'] }), terser()],
    },
];
