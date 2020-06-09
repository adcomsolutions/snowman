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

const getScriptIncludeNameFromFile = (filePath) =>
    path.basename(filePath, `.${config.jsExt}`);

// Exported functions

export const mapScriptIncludes = globalifyBase(getScriptIncludeNameFromFile);

export const mapLibraryIncludes = globalifyBase(
    async (filePath) =>
        `${await getScopeName(filePath)}.${getModuleNameFromFile(filePath)}`
);

export const getScriptIncludeFiles = async (inputPath) =>
    glob(path.join(getScriptIncludeDir(inputPath), `**/*.*.${config.jsExt}`), {
        absolute: true,
    });

export const getLibraryIncludeFiles = async (inputPath) =>
    glob(path.join(getLibraryIncludeDir(inputPath), `*.${config.jsExt}`), {
        absolute: true,
    });

export const mergeRollupConfigs = (...rollupConfigs) => ({
    input: mergeObjects(...rollupConfigs.map(extractProp('input'))),
    output: mergeObjects(...rollupConfigs.map(extractProp('output'))),
});

export const __private__ = {
    globalifyBase,
    getModuleNameFromFile,
    getScriptIncludeNameFromFile,
};
