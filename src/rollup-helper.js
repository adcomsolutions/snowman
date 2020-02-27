import config from './config-helper.js';
import { dirName, mergeOptions, squashObjs, extractProp } from './utils.js';
import path from 'path';
import glob from 'fast-glob';

export const getLastDir = (dir) => {
    const splitted = dir.split(path.sep);
    return splitted[splitted.length - 2];
};

export const baseify = (filePath) =>
    path.basename(filePath, `.${config.babelExt}`);
export const stripAppName = (baseName) =>
    baseName.replace(/^(x_.+|global)\./, '');

export const externalify = (libName) => path.resolve(dirName, libName);

export const getOutputFilePath = (inputFile) =>
    `${path.join(path.dirname(inputFile), baseify(inputFile))}.${config.jsExt}`;

const globalifyBase = (fn) => (libs) => {
    const pieces = libs.map((lib) => ({
        [path.resolve(lib)]: fn(lib),
    }));
    return squashObjs(pieces);
};

export const globalifySubmodules = globalifyBase(getLastDir);

export const globalifyModules = globalifyBase(baseify);

// Gets list of all "shared" libraries from the shared repo
// Typically, this list is used to exclude those imports from normal bundles
export const librarySubmodulesP = glob(
    `${config.libDir}/${config.libPattern}/*/**.${config.babelExt}`
);
export const libraryModulesP = glob(
    `${config.libDir}/${config.libPattern}/*.${config.babelExt}`
);

// Makes sure files within the same "BundleName" (folder) are bundled in
// This means only imports associated to the named folder get in, which is what we want for ScriptIncludes
export const filterLibs = (bundleName, libs) =>
    libs.map(externalify).filter((lib) => getLastDir(lib) !== bundleName);

export const mergeRollupConfigs = (...rollupConfigs) => ({
    input: mergeOptions(...rollupConfigs.map(extractProp('input'))),
    output: mergeOptions(...rollupConfigs.map(extractProp('output'))),
});
