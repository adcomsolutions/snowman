import config from '../src/config-helper.js';
import { join } from 'path';
import { getLibraryIncludeDir, getScriptIncludeDir } from '../src/vs-helper.js';

export const mainAliasConfig = (inputFile) => {
    const libIncludesDir = getLibraryIncludeDir(inputFile);
    const includesDir = getScriptIncludeDir(inputFile);
    return {
        entries: [
            {
                find: new RegExp(`${config.libAlias}/(.+)`),
                replacement: join(
                    libIncludesDir,
                    `$1.${config.scriptSubext}.${config.jsExt}`
                ),
            },
            {
                find: new RegExp(`${config.selfAlias}/(.+)`),
                replacement: join(
                    includesDir,
                    '$1',
                    `$1.${config.scriptSubext}.${config.jsExt}`
                ),
            },
        ],
    };
};
