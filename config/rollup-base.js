import { getOutputFilePath } from '../src/vs-helper.js';

import rollupSynthetic from './rollup-enable-synthetic-imports.js';
import rollupExportFix from './rollup-named-export-to-default.js';

import rollupBabel from '@rollup/plugin-babel';
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
                rollupBabel.babel(rollupBabelConfig),
                rollupAlias(mainAliasConfig(inputFile)),
                rollupSynthetic,
                rollupExportFix,
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
