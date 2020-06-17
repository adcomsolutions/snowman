import { mergeObjects, squashObjs, extractProp } from './utils.js';
import {
    getScopeName,
    getScriptIncludeDir,
    getLibraryIncludeDir,
} from './vs-helper.js';
import config from './config-helper.js';
import glob from 'fast-glob';
import path from 'path';

// Private functions, export these to __private__ at end of module
const globalifyBase = (fn) => async (libs) => {
    if (!libs.length) return {};
    const piecesP = libs.map(async (lib) => ({
        [lib]: await fn(lib),
    }));
    const pieces = Promise.all(piecesP);
    return squashObjs(await pieces);
};

const getModuleNameFromFile = (filePath) =>
    path.basename(filePath, `.${config.scriptSubext}.${config.jsExt}`);

const getIncludeFilesWith = (pathResolverFn) => async (inputFile) =>
    glob(
        path.join(
            pathResolverFn(inputFile),
            `*.${config.scriptSubext}.${config.jsExt}`
        ),
        { absolute: true }
    );

// Exported functions

export const mapScriptIncludes = globalifyBase(getModuleNameFromFile);

export const mapLibraryIncludes = globalifyBase(
    async (filePath) =>
        `${await getScopeName(filePath)}.${getModuleNameFromFile(filePath)}`
);

export const getScriptIncludeFiles = getIncludeFilesWith(getScriptIncludeDir);
export const getLibraryIncludeFiles = getIncludeFilesWith(getLibraryIncludeDir);

export const mergeRollupConfigs = (...rollupConfigs) => ({
    input: mergeObjects(...rollupConfigs.map(extractProp('input'))),
    output: mergeObjects(...rollupConfigs.map(extractProp('output'))),
});

export const __private__ = {
    getIncludeFilesWith,
    getModuleNameFromFile,
    globalifyBase,
};
