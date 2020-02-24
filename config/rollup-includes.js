import { getConfig } from '../src/config-helper.js';
import { serverGlobals } from './snow-globals.js';
import {
    externalify,
    baseify,
    globalifyLibs,
    filterLibs,
    mergeRollupConfigs,
    stripAppName,
} from '../src/rollup-helper.js';
import rollupBase from './rollup-base.js';
import glob from 'fast-glob';

const config = getConfig();

const auxGlobals = {
    ClientIncludes: config.clientIncludesImport,
};

export default async (inputFile) => {
    const librariesP = glob(
        `${config.libDir}/${config.libPattern}/**.${config.babelExt}`
    );
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
            format: 'iife',
            name: stripAppName(inputBase),
            strict: false,
            interop: false,
            globals: {
                ...globalifyLibs(libraries),
                ...auxGlobals,
                ...serverGlobals,
            },
        },
    });
};
