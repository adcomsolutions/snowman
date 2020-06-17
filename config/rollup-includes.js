import { basename } from 'path';
import config from '../src/config-helper.js';
import { mergeRollupConfigs } from '../src/rollup-helper.js';

import rollupBackground from './rollup-background.js';

export default async (inputFile) => {
    const outputName = basename(
        inputFile,
        `.${config.scriptSubext}.${config.jsExt}`
    );

    return mergeRollupConfigs(await rollupBackground(inputFile), {
        output: {
            name: outputName,
            exports: 'default',
        },
    });
};
