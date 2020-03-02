import config from '../src/config-helper.js';
import { serverGlobals } from './snow-globals.js';
import {
    baseify,
    getBackgroundModulesP,
    globalifyModules,
    libraryModulesP,
    mergeRollupConfigs,
    stripAppName,
} from '../src/rollup-helper.js';

import rollupBase from './rollup-base.js';

const auxGlobals = {
    ClientIncludes: config.clientIncludesImport,
};

export default async (inputFile) => {
    const libModules = await libraryModulesP;
    const backgroundModules = await getBackgroundModulesP(inputFile);
    const inputBase = baseify(inputFile);

    return mergeRollupConfigs(await rollupBase(inputFile), {
        input: {
            external: [
                ...Object.keys(serverGlobals),
                ...Object.keys(auxGlobals),
                ...backgroundModules,
                ...libModules,
            ],
        },
        output: {
            name: stripAppName(inputBase),
            globals: {
                ...globalifyModules(backgroundModules),
                ...globalifyModules(libModules),
                ...auxGlobals,
                ...serverGlobals,
            },
        },
    });
};
