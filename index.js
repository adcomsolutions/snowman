#!/usr/bin/env node
import { resolve } from 'path';
import { rollup } from 'rollup';

import config from './src/config-helper.js';
import rollupBackgroundConfig from './config/rollup-background.js';
import rollupIncludesConfig from './config/rollup-includes.js';
import { getFileYargs } from './src/yargs-helper.js';
import { postProcessOutput } from './src/build-helper.js';
import { invertFn, testNullish } from './src/utils.js';

import { asyncSequential, debugLog, verboseLog } from './src/debug-helper.js';

const resolveLocalFile = (_) => resolve(process.cwd(), _);

const buildFiles = getFileYargs();
// For Regular background scripts that run in an IIFE
const backgroundSrcFiles = buildFiles.background.map(resolveLocalFile);
// Script Includes that must add their own variable to scope
const includesSrcFiles = buildFiles.includes.map(resolveLocalFile);

const buildBundle = (rollupOptions) => async (inputFile) => {
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

const buildBundleSync = (rollupOptions) =>
    asyncSequential(buildBundle(rollupOptions));

const logBuiltFile = async (rollupResultP) => {
    const rollupResult = await rollupResultP;
    if (!rollupResult) return;
    const [{ output }] = rollupResult;
    console.log(`Built file: ${output[0].fileName}`);
};

verboseLog('Snowman Config Data:', config);

const buildBundleFn = config.debug ? buildBundleSync : buildBundle;

const buildPList = [
    backgroundSrcFiles.map(buildBundleFn(rollupBackgroundConfig)),
    includesSrcFiles.map(buildBundleFn(rollupIncludesConfig)),
];

buildPList
    .filter(invertFn(testNullish))
    .forEach((buildGroup) => buildGroup.map(logBuiltFile));
