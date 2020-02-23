import rollupBabel from 'rollup-plugin-babel';

import fs from 'fs-extra';
import path from 'path';
import glob from 'fast-glob';

const auxFileDir = 'lib';
const polyfillFile = path.join(__dirname, auxFileDir, 'rhino-polyfills.js');
const libDir = path.join(__dirname, 'src');
const jsExt = '.js';

// Only global imports from the top level modules need to go here
const ignoredGlobals = {
    global: 'global',
    Class: 'Class',
};

const bundleBanner = `// Rollup file built on ${new Date().toGMTString()}`;
const bundleIntroP = fs.readFile(polyfillFile, 'utf8');

const librariesP = glob(`${libDir}/*/**.js`);

const squashObjs = (objects) =>
    objects.reduce(
        (memo, nextObj) => ({
            ...memo,
            ...nextObj,
        }),
        {}
    );

const getLastDir = (dir) => {
    const splitted = dir.split(path.sep);
    return splitted[splitted.length - 2];
};

const baseify = (libName) => path.basename(libName, jsExt);

const externalify = (libName) => path.resolve(__dirname, libName);

const globalifyLibs = (libs) => {
    const pieces = libs.map((lib) => ({
        [lib]: getLastDir(lib),
    }));
    return squashObjs(pieces);
};

const filterLibs = (bundleName, libs) =>
    libs.map(externalify).filter((lib) => getLastDir(lib) !== bundleName);

export default async (args) => {
    const inputFile = args.input[0];
    const inputBase = baseify(inputFile);
    const libraries = filterLibs(inputBase, await librariesP);

    return {
        input: inputFile,
        external: [
            ...Object.keys(ignoredGlobals),
            ...libraries.map(externalify),
        ],
        output: {
            banner: bundleBanner,
            intro: await bundleIntroP,
            format: 'iife',
            name: inputBase,
            strict: false,
            globals: { ...globalifyLibs(libraries), ...ignoredGlobals },
        },
        plugins: rollupBabel({
            exclude: 'node_modules/**',
            plugins: [
                ['@babel/proposal-nullish-coalescing-operator'],
                ['@babel/proposal-optional-catch-binding'],
                ['@babel/proposal-optional-chaining'],
                ['@babel/transform-member-expression-literals'],
                ['@babel/transform-property-literals'],
                ['@babel/transform-arrow-functions'],
                ['@babel/transform-block-scoped-functions'],
                ['@babel/transform-block-scoping'],
                ['@babel/transform-computed-properties', { loose: true }],
                ['@babel/transform-destructuring', { loose: true }],
                ['@babel/transform-literals'],
                ['@babel/transform-parameters'],
                ['@babel/transform-shorthand-properties'],
                ['@babel/transform-spread', { loose: true }],
                [
                    '@babel/transform-template-literals',
                    { loose: true, spec: true },
                ],
                ['@babel/transform-exponentiation-operator'],
                ['transform-for-of-as-array'],
            ],
        }),
    };
};
