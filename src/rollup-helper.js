import { mergeObjects, squashObjs, extractProp } from './utils.js';
import { getScopeName, getLibraryOutputFileName } from './vs-helper.js';

// Private functions, export these to __private__ at end of module
const globalifyBase = (fn) => async (libs) => {
    if (!libs.length) return {};
    const piecesP = libs.map(async (lib) => ({
        [lib]: await fn(lib),
    }));
    const pieces = Promise.all(piecesP);
    return squashObjs(await pieces);
};

// Exported functions

export const mapScriptIncludes = globalifyBase(getLibraryOutputFileName);

export const mapLibraryIncludes = globalifyBase(
    async (filePath) =>
        `${await getScopeName(filePath)}.${getLibraryOutputFileName(filePath)}`
);

export const mergeRollupConfigs = (...rollupConfigs) => ({
    input: mergeObjects(...rollupConfigs.map(extractProp('input'))),
    output: mergeObjects(...rollupConfigs.map(extractProp('output'))),
});

export const __private__ = {
    globalifyBase,
};
