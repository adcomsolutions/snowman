import config from '../src/config-helper.js';
import { serverGlobals } from './snow-globals.js';
import {
    externalify,
    globalifyModules,
    libraryModulesP,
    mergeRollupConfigs,
} from '../src/rollup-helper.js';

import rollupBase from './rollup-base.js';

const auxGlobals = {
    ClientIncludes: config.clientIncludesImport,
};

export default async (inputFile) => {
    const libModules = await libraryModulesP;

    return mergeRollupConfigs(await rollupBase(inputFile), {
        input: {
            external: [
                ...Object.keys(serverGlobals),
                ...Object.keys(auxGlobals),
                ...libModules.map(externalify),
            ],
        },
        output: {
            globals: {
                ...globalifyModules(libModules),
                ...auxGlobals,
                ...serverGlobals,
            },
        },
    });
};
