import * as fsHelper from './vs-fs-helper.js';
import config from './config-helper.js';
import path from 'path';
import fs from 'fs';

export const VsHelper = (fsLike) => {
    // See src/vs-fs-helper.js and test/vs-fs-helper.js
    const getAppDir = fsHelper.getAppDir(fsLike);
    const getScopeName = fsHelper.getScopeName(fsLike);
    const getWorkspaceDir = fsHelper.getWorkspaceDir(fsLike);
    const getIncludeFilesWith = fsHelper.getIncludeFilesWith(fsLike);

    const getLibraryDir = (inputPath) =>
        path.resolve(
            path.join(
                getWorkspaceDir(inputPath),
                config.libName,
                config.sourceDir,
                config.scriptIncludeDir
            )
        );

    const getLibraryIncludeFiles = getIncludeFilesWith(getLibraryDir);

    const getOutDir = (inputPath) =>
        path.join(getAppDir(inputPath), config.outDir);

    const getOutputFilePath = (inputFile) =>
        path.join(
            getOutDir(inputFile),
            path.relative(getSourceDir(inputFile), path.dirname(inputFile)),
            path.basename(inputFile)
        );

    const getLibraryOutputFileName = (inputFile) => {
        const rawPath = path.relative(
            getScriptIncludeDir(inputFile),
            path.dirname(inputFile)
        );

        // Flatten nested directories into a flat filename with _ separators
        return rawPath
            .split(path.sep)
            .filter((_) => _ !== '')
            .concat(path.basename(inputFile))
            .join('_');
    };

    const getLibraryOutputFilePath = (inputFile) =>
        path.join(
            getOutDir(inputFile),
            config.scriptIncludeDir,
            getLibraryOutputFileName(inputFile)
        );

    const getScriptIncludeDir = (inputPath) =>
        path.resolve(
            path.join(getSourceDir(inputPath), config.scriptIncludeDir)
        );

    const getScriptIncludeFiles = getIncludeFilesWith(getScriptIncludeDir);

    const getSourceDir = (inputPath) =>
        path.join(getAppDir(inputPath), config.sourceDir);

    const __private__ = {
        getIncludeFilesWith,
        getOutDir,
        getSourceDir,
        getWorkspaceDir,
    };

    return {
        getLibraryDir,
        getLibraryIncludeFiles,
        getLibraryOutputFileName,
        getLibraryOutputFilePath,
        getOutputFilePath,
        getScopeName,
        getScriptIncludeDir,
        getScriptIncludeFiles,
        __private__,
    };
};

const vsHelper = VsHelper(fs);
export default vsHelper;
export const getLibraryDir = vsHelper.getLibraryDir;
export const getLibraryIncludeFiles = vsHelper.getLibraryIncludeFiles;
export const getLibraryOutputFileName = vsHelper.getLibraryOutputFileName;
export const getLibraryOutputFilePath = vsHelper.getLibraryOutputFilePath;
export const getOutputFilePath = vsHelper.getOutputFilePath;
export const getScopeName = vsHelper.getScopeName;
export const getScriptIncludeDir = vsHelper.getScriptIncludeDir;
export const getScriptIncludeFiles = vsHelper.getScriptIncludeFiles;
export const getSrcDir = vsHelper.getSrcDir;
export const getWorkspaceDir = vsHelper.getWorkspaceDir;
