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

export const postProcessOutput = async (outputFilePath) => {
    const originalContents = await readFile(outputFilePath, 'utf8');
    return writeFile(outputFilePath, fixNsProto(originalContents));
};

const buildBundleAsync = (rollupOptions) => async (inputFile) => {
    verboseLog(`Processing configuration: ${inputFile}`);
    const options = await rollupOptions(inputFile);
    debugLog('Build options used:', options);
    verboseLog(`Compiling script: ${inputFile}`);
    const bundle = await rollup(options.input).catch(console.error);
    if (bundle === undefined) return null;
    verboseLog(`Writing artefact: ${inputFile}`);
    const bundleOut = await bundle.write(options.output);
    return postProcessOutput(options.output.file).then(() => [
        bundleOut,
        options,
    ]);
};

const buildBundleSequential = (rollupOptions) =>
    asyncSequential(buildBundleAsync(rollupOptions));

const buildBundle = config.debug ? buildBundleSequential : buildBundleAsync;

const logBuiltFile = async (rollupResultP) => {
    const rollupResult = await rollupResultP;
    if (!rollupResult) return;
    const [{ output }] = rollupResult;
    console.log(`Built file: ${output[0].fileName}`);
};

const syncBuiltFile = async (rollupResultP) => {
    const rollupResult = await rollupResultP;
    if (!rollupResult) return;

    const [
        {
            output: [{ code, fileName: shortName }],
        },
        {
            output: { file },
        },
    ] = rollupResult;

    verboseLog('Preparing to sync file:', shortName);

    const updateP = updateScript(file, code)
        .then(() => console.log('Synced file:', shortName))
        .catch((error) =>
            console.error(`Sync failed for file ${file} with error:\n${error}`)
        );

    return updateP;
};

export const doBuild = (backgroundFiles = [], includesFiles = []) => {
    debugLog('Snowman Config Data:', config);

    const buildPList = [
        backgroundFiles.map(buildBundle(rollupBackgroundConfig)),
        includesFiles.map(buildBundle(rollupIncludesConfig)),
    ];

    buildPList.forEach((buildGroup) => buildGroup.map(logBuiltFile));

    if (config.sync)
        buildPList.forEach((buildGroup) => buildGroup.map(syncBuiltFile));
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
    ].filter((_) => _ !== null);

    return async () =>
        Promise.allSettled(watchers.map((unbindFn) => unbindFn()));
};
