import {getConfig} from '../src/config-helper.js'
import {serverGlobals} from './snow-globals.js'
import {externalify, baseify, globalifyLibs, filterLibs, mergeRollupConfigs} from '../src/rollup-helper.js'

const config = getConfig()
import rollupBase from './rollup-base.js'
import glob from 'fast-glob';

const auxGlobals = {
    ClientIncludes: config.clientIncludesImport
};

export default async (inputFile) => {
    const librariesP = glob(`${config.libDir}/*/**.${config.babelExt}`);
    const inputBase = baseify(inputFile);
    const libraries = filterLibs(inputBase, await librariesP);

    return mergeRollupConfigs(
        await rollupBase(inputFile),
        {
            input: {
                external: [
                    ...Object.keys(serverGlobals),
                    ...Object.keys(auxGlobals),
                    ...libraries.map(externalify),
                ]
            },
            output: {
                format: 'iife',
                name: inputBase,
                strict: false,
                interop: false,
                globals: {
                    ...globalifyLibs(libraries),
                    ...auxGlobals,
                    ...serverGlobals,
                },
            },
        }
    )
};
