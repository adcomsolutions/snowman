import { mergeRollupConfigs } from '../src/rollup-helper.js';
import {
    getLibraryOutputBaseName,
    getLibraryOutputFilePath,
} from '../src/vs-helper.js';

import rollupBackground from './rollup-background.js';
import rollupJsdocFix from './rollup-fix-default-jsdoc.js';

export default async (inputFile) => {
    const outputName = getLibraryOutputBaseName(inputFile);

    return mergeRollupConfigs(await rollupBackground(inputFile), {
        output: {
            file: getLibraryOutputFilePath(inputFile),
            name: outputName,
            plugins: [rollupJsdocFix],
        },
    });
};
