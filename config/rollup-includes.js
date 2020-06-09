import { getLastDirFromFile } from '../src/utils.js';
import { mergeRollupConfigs } from '../src/rollup-helper.js';

import rollupBackground from './rollup-background.js';

export default async (inputFile) => {
    const outputName = getLastDirFromFile(inputFile);

    return mergeRollupConfigs(await rollupBackground(inputFile), {
        output: {
            name: outputName,
        },
    });
};
