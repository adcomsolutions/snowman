import { serverGlobals } from './snow-globals.js';
import {
    getBackgroundSubmodulesP,
    getBackgroundModulesP,
    globalifyModules,
    globalifySubmodules,
    libraryModulesP,
    librarySubmodulesP,
    mergeRollupConfigs,
} from '../src/rollup-helper.js';

import rollupBase from './rollup-base.js';

export default async (inputFile) => {
    // All import statements from the shared library are *not* bundled
    // Calls are instead translated to the scoped name automatically
    // This is so we're calling the logic from Script Includes, not rebundling the same code
    const libSubmodules = await librarySubmodulesP;
    const libModules = await libraryModulesP;
    const backgroundModules = await getBackgroundModulesP(inputFile);
    const backgroundSubmodules = await getBackgroundSubmodulesP(inputFile);

    return mergeRollupConfigs(await rollupBase(inputFile), {
        input: {
            external: [
                ...Object.keys(serverGlobals),
                ...libSubmodules,
                ...libModules,
                ...backgroundSubmodules,
                ...backgroundModules,
            ],
        },
        output: {
            globals: {
                ...globalifySubmodules(libSubmodules),
                ...globalifyModules(libModules),
                ...globalifyModules(backgroundSubmodules),
                ...globalifyModules(backgroundModules),
                ...serverGlobals,
            },
        },
    });
};
