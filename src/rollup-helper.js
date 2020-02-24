import { getConfig } from './config-helper.js';
import { dirName, mergeOptions, squashObjs, extractProp } from './utils.js';
import path from 'path';
import glob from 'fast-glob';

const config = getConfig();

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

export const globalifyLibs = (libs) => {
    const pieces = libs.map((lib) => ({
        [lib]: getLastDir(lib),
    }));
    return squashObjs(pieces);
};

// Gets list of all "shared" libraries from the shared repo
// Typically, this list is used to exclude those imports from normal bundles
export const librariesP = glob(
    `${config.libDir}/${config.libPattern}/**.${config.babelExt}`
);
export const filterLibs = (bundleName, libs) =>
    libs.map(externalify).filter((lib) => getLastDir(lib) !== bundleName);

export const mergeRollupConfigs = (...rollupConfigs) => ({
    input: mergeOptions(...rollupConfigs.map(extractProp('input'))),
    output: mergeOptions(...rollupConfigs.map(extractProp('output'))),
});
