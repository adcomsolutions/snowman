import { getOutputFilePath, getRelativeFilePath } from '../src/vs-helper.js';
import config from '../src/config-helper.js';

import rollupSynthetic from './rollup-enable-synthetic-imports.js';
import rollupExportFix from './rollup-named-export-to-default.js';

import includePaths from 'rollup-plugin-includepaths';
import includePathsConfig from './includepaths-rollup.js';
import rollupBabel from '@rollup/plugin-babel';
import rollupBabelConfig from './babel-rollup.js';
import rollupAlias from '@rollup/plugin-alias';
import { mainAliasConfig } from './alias-rollup.js';

const bundleBannerFn = (inputFile) =>
    `/* eslint-disable */ // ${getRelativeFilePath(inputFile)}`;

const babelHelperDeclaration = `var babelHelpers = ${config.babelHelperName};`;

export default (inputFile) => {
    return {
        input: {
            input: inputFile,
            plugins: [
                rollupBabel.babel(rollupBabelConfig),
                rollupAlias(mainAliasConfig(inputFile)),
                includePaths(includePathsConfig(inputFile)),
                rollupSynthetic,
                rollupExportFix,
            ],
        },
        output: {
            file: getOutputFilePath(inputFile),
            banner: bundleBannerFn(inputFile),
            intro: babelHelperDeclaration,
            format: 'iife',
            strict: false,
            interop: false,
        },
    };
};
