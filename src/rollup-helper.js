import {getConfig} from './config-helper.js'
import {dirName, mergeOptions, squashObjs, extractProp} from './utils.js'
import path from 'path'

const config = getConfig()

export const getLastDir = (dir) => {
    const splitted = dir.split(path.sep);
    return splitted[splitted.length - 2];
};

export const baseify = (filePath) => path.basename(filePath, `.${config.babelExt}`);

console.log(dirName)
export const externalify = (libName) => path.resolve(dirName, libName);

export const getOutputPath = (inputPath) => `${
    baseify(inputPath)
}.${
    config.jsExt
}`

export const globalifyLibs = (libs) => {
    const pieces = libs.map((lib) => ({
        [lib]: getLastDir(lib),
    }));
    return squashObjs(pieces);
};

export const filterLibs = (bundleName, libs) =>
    libs.map(externalify).filter((lib) => getLastDir(lib) !== bundleName);

export const mergeRollupConfigs = (...rollupConfigs) => ({
    input: mergeOptions(
        ...rollupConfigs.map(extractProp('input'))
    ),
    output: mergeOptions(
        ...rollupConfigs.map(extractProp('output'))
    ),
})