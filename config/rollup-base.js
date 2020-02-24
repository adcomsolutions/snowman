import { getConfig } from '../src/config-helper.js';
import {
    baseify,
    getOutputFilePath,
    stripAppName,
} from '../src/rollup-helper.js';

import fs from 'fs-extra';
import rollupBabel from 'rollup-plugin-babel';
import rollupBabelConfig from './babel-rollup.js';
import rollupAlias from '@rollup/plugin-alias';
import { mainAliasConfig } from './alias-rollup.js';

const config = getConfig();
const bundleIntroP = fs.readFile(config.rhinoPolyfillPath, 'utf8');
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
            intro: await bundleIntroP,
            format: 'iife',
            strict: false,
            interop: false,
        },
    };
};
