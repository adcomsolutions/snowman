import config from './config-helper.js';
import { asyncSequential, debugLog, verboseLog } from './debug-helper.js';
import rollupBackgroundConfig from '../config/rollup-background.js';
import rollupIncludesConfig from '../config/rollup-includes.js';
import { updateScript } from './sync-helper.js';

import { readFile, writeFile } from 'fs/promises';

import chokidar from 'chokidar';
import { rollup } from 'rollup';

// Scoped apps throw if you try to access __proto__, remap such attempts to the "type" field
// Rollup wants to clear out the prototype for spec compliance when doing namespace imports (by nulling out __proto__)
// Nulling out the type field instead is essentially a syntactic placeholder, not there for any particular effect
// HACK: I should probably try doing this within the Rollup API someday
const fixNsProto = (fileContents) =>
    fileContents.replace(/__proto__: null/g, 'type: null');

const postProcessOutput = async (outputFilePath) => {
    verboseLog(`Post-processing file: ${outputFilePath}`);
    const originalContents = await readFile(outputFilePath, 'utf8');
    return writeFile(outputFilePath, fixNsProto(originalContents));
};

const compileBundle = async (optionsP) => {
    const options = await optionsP;
    debugLog('Rollup options used:', options);
    verboseLog(`Compiling script: ${options.input.input}`);
    return rollup(options.input);
};

const writeBundle = async (bundleP, optionsP) => {
    const { output: outputOptions } = await optionsP;
    const bundle = await bundleP.catch(console.error);
    if (bundle === undefined) return null;

    verboseLog(`Writing artefact: ${outputOptions.file}`);
    const {
        output: [writeResult],
    } = await bundle.write(outputOptions);
    await postProcessOutput(outputOptions.file);
    return { ...writeResult, file: outputOptions.file };
};

const buildBundleAsync = (rollupOptionsFn) => (inputFile) => {
    const rollupOptionsP = rollupOptionsFn(inputFile);
    return writeBundle(compileBundle(rollupOptionsP), rollupOptionsP);
};

const buildBundleSequential = (rollupOptions) =>
    asyncSequential(buildBundleAsync(rollupOptions));

const buildBundle = config.debug ? buildBundleSequential : buildBundleAsync;

const buildGroupProcessor = (processorFn) => (buildGroup) =>
    buildGroup.forEach(async (buildP) => {
        const buildResult = await buildP;
        return buildResult === null ? null : processorFn(buildResult);
    });

const logBuiltFile = buildGroupProcessor(({ fileName }) =>
    console.log(`Built file: ${fileName}`)
);

const syncBuiltFile = buildGroupProcessor(
    ({ code, file, fileName: shortName }) => {
        verboseLog('Preparing to sync file:', shortName);

        const updateP = updateScript(file, code)
            .then(() => console.log('Synced file:', shortName))
            .catch((error) =>
                console.error(
                    `Sync failed for file ${file} with error:\n${error}`
                )
            );

        return updateP;
    }
);

export const doBuild = (backgroundFiles = [], includesFiles = []) => {
    debugLog('Snowman Config Data:', config);

    const buildPList = [
        backgroundFiles.map(buildBundle(rollupBackgroundConfig)),
        includesFiles.map(buildBundle(rollupIncludesConfig)),
    ];

    buildPList.forEach(logBuiltFile);

    if (config.sync) buildPList.forEach(syncBuiltFile);
};

const bindBackgroundWatcher = (backgroundFiles = []) => {
    if (!backgroundFiles.length) return null;
    const watcher = chokidar.watch(backgroundFiles, {
        persistent: true,
    });
    watcher.on('change', (path) => doBuild([path]));
    return watcher.close;
};

const bindIncludesWatcher = (includesFiles = []) => {
    if (!includesFiles.length) return null;
    const watcher = chokidar.watch(includesFiles, {
        persistent: true,
    });
    watcher.on('change', (path) => doBuild(undefined, [path]));
    return watcher.close;
};

export const bindWatchers = (backgroundFiles = [], includesFiles = []) => {
    const watchers = [
        bindBackgroundWatcher(backgroundFiles),
        bindIncludesWatcher(includesFiles),
    ];

    return async () =>
        Promise.allSettled(watchers.map((unbindFn) => unbindFn()));
};
