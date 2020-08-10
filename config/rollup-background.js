import { serverGlobals } from './snow-globals.js';
import {
    mergeRollupConfigs,
    mapLibraryIncludes,
} from '../src/rollup-helper.js';
import { getScopeName, getAllIncludeFiles } from '../src/vs-helper.js';

import rollupBase from './rollup-base.js';

export default async (inputFile) => {
    const includesFilesP = getAllIncludeFiles(inputFile);
    const includesMapP = includesFilesP.then(mapLibraryIncludes);

    return mergeRollupConfigs(rollupBase(inputFile), {
        input: {
            context: await getScopeName(inputFile),
            external: [
                ...Object.keys(serverGlobals),
                ...(await includesFilesP),
            ],
        },
        output: {
            globals: {
                ...serverGlobals,
                ...(await includesMapP),
            },
        },
    });
};
