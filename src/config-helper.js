import { getLastDir, getTopLevelProject, mergeOptions } from './utils.js';
import defaultConfig from '../config/default.js';

import path from 'path';
import dotenv from 'dotenv';

const resolveLibDir = (config) => ({
    ...config,
    libDir: path.isAbsolute(config.libDir)
        ? config.libDir
        : path.resolve(getTopLevelProject(), config.libDir),
});

const resolveProjectDir = (config) => ({
    ...config,
    projectDir: config.projectDir || getTopLevelProject(),
});

const resolveProjectName = (config) => ({
    ...config,
    projectName: config.projectName || getLastDir(config.projectDir, true),
});

const resolveIncludesPattern = (config) => ({
    ...config,
    includesPattern: config.includesPattern
        .replace('$TOPLEVEL', config.fieldFileTopLevel)
        .replace('$SCRIPTINCLUDE', config.scriptIncludeDirName)
        .replace('$SCRIPTINCLUDEACTIVE', config.scriptIncludeActiveSubdir),
});

const processConfig = (config) =>
    resolveProjectName(
        resolveProjectDir(resolveLibDir(resolveIncludesPattern(config)))
    );

dotenv.config();

const envConfig = {};

export default processConfig(mergeOptions(defaultConfig, envConfig));
