import config from '../src/config-helper.js';
import { join } from 'path';
import { getLibraryDir, getScriptIncludeDir } from '../src/vs-helper.js';

const getIncludeAliasConfig = (aliasName, aliasDir) => ({
    find: new RegExp(`${aliasName}/(.+)`),
    replacement: join(aliasDir, `$1.${config.scriptSubext}.${config.jsExt}`),
});

export const mainAliasConfig = (inputFile) => ({
    entries: [
        getIncludeAliasConfig(config.libAlias, getLibraryDir(inputFile)),
        getIncludeAliasConfig(config.selfAlias, getScriptIncludeDir(inputFile)),
    ],
});
