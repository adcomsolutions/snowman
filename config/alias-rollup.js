import config from '../src/config-helper.js';
import { join } from 'path';
import { getScriptIncludesDir } from '../src/rollup-helper.js';

export const mainAliasConfig = (inputFile) => {
    const includesDir = getScriptIncludesDir(inputFile);
    return {
        entries: [
            {
                find: new RegExp(
                    `${config.libAlias}/(.+\\.${config.babelExt})$`
                ),
                replacement: join(
                    config.libDir,
                    config.libPath,
                    `${config.libName}.$1`
                ),
            },
            {
                find: new RegExp(
                    `${config.selfAlias}/(.+\\.(${config.jsExt}|${config.babelExt}))$`
                ),
                replacement: join(includesDir, `${config.projectName}.$1`),
            },
        ],
    };
};
