import config from '../src/config-helper.js';
import { resolve, join } from 'path';

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
