import { env } from 'process';
import { mergeObjects, objToTuples, tuplesToObj, zip } from './utils.js';
import { getConfigYargs } from './yargs-helper.js';
import defaultConfig from '../config/default.js';

const envifyConfigKey = (configKey) =>
    'SNOWMAN_' + configKey.replace(/[A-Z]/g, '_$&').toUpperCase();

const loadEnvConfigForObj = (configObj) => {
    const configKeys = Object.keys(configObj);
    const envifiedKeys = configKeys.map(envifyConfigKey);
    const envToConfigDict = tuplesToObj(zip(envifiedKeys, configKeys));
    const filteredEnvTuples = objToTuples(env).filter(([key]) =>
        envifiedKeys.includes(key)
    );
    return tuplesToObj(
        filteredEnvTuples.map(([key, value]) => [envToConfigDict[key], value])
    );
};

export default mergeObjects(
    defaultConfig,
    loadEnvConfigForObj(defaultConfig),
    getConfigYargs()
);

export const __private__ = {
    envifyConfigKey,
    loadEnvConfigForObj,
};
