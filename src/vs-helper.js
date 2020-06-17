import * as fsHelper from './vs-fs-helper.js';
import config from './config-helper.js';
import path from 'path';
import fs from 'fs';

export const VsHelper = (fsLike) => {
    // See src/vs-fs-helper.js and test/vs-fs-helper.js
    const getAppDir = fsHelper.getAppDir(fsLike);
    const getScopeName = fsHelper.getScopeName(fsLike);
    const getWorkspaceDir = fsHelper.getWorkspaceDir(fsLike);

    const getLibraryDir = (inputPath) =>
        path.join(getWorkspaceDir(inputPath), config.libName, config.sourceDir);

    const getLibraryIncludeDir = (inputPath) =>
        path.resolve(
            path.join(getLibraryDir(inputPath), config.scriptIncludeDir)
        );

    // Some background scripts are nested within an extra dir layer based on the record name
    // This output path resolver is used for the --bg2/--background2 args
    const getNestedOutputFilePath = (inputFile) =>
        path.join(
            getOutDir(inputFile),
            path.relative(getSourceDir(inputFile), path.dirname(inputFile)),
            path.basename(inputFile)
        );

    const getOutDir = (inputPath) =>
        path.join(getAppDir(inputPath), config.outDir);

    const getOutputFilePath = (inputFile) =>
        path.join(
            getOutDir(inputFile),
            path.relative(getSourceDir(inputFile), path.dirname(inputFile)),
            path.basename(inputFile)
        );

    const getScriptIncludeDir = (inputPath) =>
        path.resolve(
            path.join(getSourceDir(inputPath), config.scriptIncludeDir)
        );

    const getSourceDir = (inputPath) =>
        path.join(getAppDir(inputPath), config.sourceDir);

    const __private__ = {
        getLibraryDir,
        getOutDir,
        getSourceDir,
        getWorkspaceDir,
    };

    return {
        getLibraryIncludeDir,
        getNestedOutputFilePath,
        getOutputFilePath,
        getScopeName,
        getScriptIncludeDir,
        __private__,
    };
};

const vsHelper = VsHelper(fs);
export default vsHelper;
export const getLibraryIncludeDir = vsHelper.getLibraryIncludeDir;
export const getOutputFilePath = vsHelper.getOutputFilePath;
export const getNestedOutputFilePath = vsHelper.getNestedOutputFilePath;
export const getScopeName = vsHelper.getScopeName;
export const getScriptIncludeDir = vsHelper.getScriptIncludeDir;
export const getSrcDir = vsHelper.getSrcDir;
export const getWorkspaceDir = vsHelper.getWorkspaceDir;
