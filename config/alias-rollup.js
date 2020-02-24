import { getConfig } from '../src/config-helper.js';
import { resolve, join } from 'path';

const config = getConfig();

export const mainAliasConfig = {
    entries: [
        {
            find: new RegExp(
                join(config.libAlias, `(.+\\.${config.babelExt})$`)
            ),
            replacement: resolve(
                join(config.libDir, config.libActive, `${config.libName}.$1`)
            ),
        },
    ],
};
