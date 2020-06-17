import config from '../src/config-helper.js';
import { join } from 'path';
import { getLibraryIncludeDir, getScriptIncludeDir } from '../src/vs-helper.js';

const getIncludeAliasConfig = (aliasName, aliasDir) => ({
    find: new RegExp(`${aliasName}/(.+)`),
    replacement: join(aliasDir, '$1'),
});

export const mainAliasConfig = (inputFile) => ({
    entries: [
        getIncludeAliasConfig(config.libAlias, getLibraryIncludeDir(inputFile)),
        getIncludeAliasConfig(config.selfAlias, getScriptIncludeDir(inputFile)),
    ],
});
