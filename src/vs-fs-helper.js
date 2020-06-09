// This helper exists so we can build tests around FS access functions without dependency injection
// See src/vs-helper.js for the "real"
import config from './config-helper.js';
import { getLastDirFromDir } from './utils.js';
import { promisify } from 'util';
import path from 'path';

// Private functions, exported at end of file as __private__
const getAppName = (fs) => (inputPath) =>
    getLastDirFromDir(getAppDir(fs)(inputPath));

const newWorkspaceWalker = (pathTestFn) => (fs) => (inputPath) => {
    const pieces = inputPath.split(path.sep).slice(1);

    const isWorkspaceDir = (myPath) =>
        fs.existsSync(path.join(myPath, config.workspaceFilePath));

    const recurse = (rPieces) => {
        if (!rPieces.length) throw new Error('Not a workspace directory!');
        const possibleWorkspaceFile = path.join(
            path.sep,
            ...pathTestFn(rPieces)
        );
        return isWorkspaceDir(possibleWorkspaceFile)
            ? path.join(path.sep, ...rPieces)
            : recurse(rPieces.slice(0, -1));
    };

    return recurse(pieces);
};

// Public exports
export const getWorkspaceDir = newWorkspaceWalker((pieces) => pieces);
export const getAppDir = newWorkspaceWalker((pieces) => pieces.slice(0, -1));

export const getScopeName = (fs) => async (inputPath) => {
    const appName = getAppName(fs)(inputPath);
    const jsonPath = path.join(
        getWorkspaceDir(fs)(inputPath),
        config.workspaceFilePath
    );
    const rawData = promisify(fs.readFile)(jsonPath, 'utf8');
    const scopeData = JSON.parse(await rawData);
    return scopeData.ALL_APPLICATIONS[appName].sys_scope;
};

// Export private functions for testing
export const __private__ = {
    newWorkspaceWalker,
    getAppName,
};
