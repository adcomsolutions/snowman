import { getConfig } from '../src/config-helper.js';
import { serverGlobals } from './snow-globals.js';
import {
    baseify,
    externalify,
    filterLibs,
    globalifyLibs,
    librariesP,
    mergeRollupConfigs,
} from '../src/rollup-helper.js';

import rollupBase from './rollup-base.js';

const config = getConfig();

const auxGlobals = {
    ClientIncludes: config.clientIncludesImport,
};

export default async (inputFile) => {
    const inputBase = baseify(inputFile);
    const libraries = filterLibs(inputBase, await librariesP);

    return mergeRollupConfigs(await rollupBase(inputFile), {
        input: {
            external: [
                ...Object.keys(serverGlobals),
                ...Object.keys(auxGlobals),
                ...libraries.map(externalify),
            ],
        },
        output: {
            globals: {
                ...globalifyLibs(libraries),
                ...auxGlobals,
                ...serverGlobals,
            },
        },
    });
};
