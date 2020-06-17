import { getOutputFilePath } from '../src/vs-helper.js';

import rollupBabel from 'rollup-plugin-babel';
import rollupBabelConfig from './babel-rollup.js';
import rollupAlias from '@rollup/plugin-alias';
import { mainAliasConfig } from './alias-rollup.js';

const bundleBanner = [
    '/* eslint-disable */',
    `// Rollup file built on ${new Date().toGMTString()}`,
].join('\n');

export default (inputFile) => {
    return {
        input: {
            input: inputFile,
            plugins: [
                rollupBabel(rollupBabelConfig),
                rollupAlias(mainAliasConfig(inputFile)),
            ],
        },
        output: {
            file: getOutputFilePath(inputFile),
            banner: bundleBanner,
            format: 'iife',
            strict: false,
            interop: false,
        },
    };
};
