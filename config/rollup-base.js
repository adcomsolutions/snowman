import {
    baseify,
    getOutputFilePath,
    stripAppName,
} from '../src/rollup-helper.js';

import rollupBabel from 'rollup-plugin-babel';
import rollupBabelConfig from './babel-rollup.js';
import rollupAlias from '@rollup/plugin-alias';
import { mainAliasConfig } from './alias-rollup.js';

const bundleBanner = `// Rollup file built on ${new Date().toGMTString()}`;

export default async (inputFile) => {
    const inputBase = baseify(inputFile);

    return {
        input: {
            input: inputFile,
            plugins: [
                rollupBabel(rollupBabelConfig),
                rollupAlias(mainAliasConfig),
            ],
        },
        output: {
            name: stripAppName(inputBase),
            file: getOutputFilePath(inputFile),
            banner: bundleBanner,
            format: 'iife',
            strict: false,
            interop: false,
        },
    };
};
