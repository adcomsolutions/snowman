import config from './config-helper.js';
import { getLastDir, mergeOptions, squashObjs, extractProp } from './utils.js';
import path from 'path';
import glob from 'fast-glob';

export const baseify = (filePath) =>
    path.basename(filePath, `.${config.babelExt}`);
export const stripAppName = (baseName) =>
    baseName.replace(/^(x_.+|global)\./, '');

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

const getFieldFileTopLevelDir = (inputFile) => {
    const pieces = inputFile.split(path.sep);

    const atGroupName = (currentPath) =>
        getLastDir(currentPath) === config.fieldFileTopLevel;

    return pieces.reduce(
        (lastPath, nextPiece) =>
            atGroupName(lastPath) ? lastPath : path.join(lastPath, nextPiece),
        path.sep
    );
};

export const getScriptIncludesDir = (inputFile) => {
    const topLevel = getFieldFileTopLevelDir(inputFile);
    return path.join(
        topLevel,
        config.scriptIncludeDirName,
        config.scriptIncludeActiveSubdir
    );
};

// Gets list of all "shared" libraries from the shared repo
// Typically, this list is used to exclude those imports from normal bundles
export const librarySubmodulesP = glob(
    path.join(config.libDir, config.includesPattern, `*/**.${config.babelExt}`),
    { absolute: true }
);

export const libraryModulesP = glob(
    path.join(config.libDir, config.includesPattern, `**.${config.babelExt}`),
    { absolute: true }
);

export const getBackgroundSubmodulesP = async (inputFile) =>
    glob(
        path.join(getScriptIncludesDir(inputFile), `*/**.${config.babelExt}`),
        {
            absolute: true,
        }
    );

export const getBackgroundModulesP = async (inputFile) =>
    glob(path.join(getScriptIncludesDir(inputFile), `**.${config.babelExt}`), {
        absolute: true,
    });

// Makes sure files within the same "BundleName" (folder) are bundled in
// This means only imports associated to the named folder get in, which is what we want for ScriptIncludes
export const filterLibs = (bundleName, libs) =>
    libs.filter((lib) => getLastDir(lib) !== bundleName);

export const mergeRollupConfigs = (...rollupConfigs) => ({
    input: mergeOptions(...rollupConfigs.map(extractProp('input'))),
    output: mergeOptions(...rollupConfigs.map(extractProp('output'))),
});
