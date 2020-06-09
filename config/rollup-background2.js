import { mergeRollupConfigs } from '../src/rollup-helper.js';
import { getNestedOutputFilePath } from '../src/vs-helper.js';

import rollupBackground from './rollup-background.js';

export default async (inputFile) => {
    return mergeRollupConfigs(await rollupBackground(inputFile), {
        output: {
            file: getNestedOutputFilePath(inputFile),
        },
    });
};
