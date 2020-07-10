import { serverGlobals } from './snow-globals.js';
import {
    mapScriptIncludes,
    mapLibraryIncludes,
    mergeRollupConfigs,
} from '../src/rollup-helper.js';
import {
    getScriptIncludeFiles,
    getLibraryIncludeFiles,
} from '../src/vs-helper.js';

import rollupBase from './rollup-base.js';

export default async (inputFile) => {
    const includesFilesP = getScriptIncludeFiles(inputFile);
    const libIncludesFilesP = getLibraryIncludeFiles(inputFile);
    const includesMapP = includesFilesP.then(mapScriptIncludes);
    const libIncludesMapP = libIncludesFilesP.then(mapLibraryIncludes);

    return mergeRollupConfigs(rollupBase(inputFile), {
        input: {
            external: [
                ...Object.keys(serverGlobals),
                ...(await libIncludesFilesP),
                ...(await includesFilesP),
            ],
        },
        output: {
            globals: {
                ...serverGlobals,
                ...(await libIncludesMapP),
                ...(await includesMapP),
            },
        },
    });
};
