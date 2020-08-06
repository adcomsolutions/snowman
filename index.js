#!/usr/bin/env node
import yargs from 'yargs';
import { resolve } from 'path';

import { rollup } from 'rollup';
import rollupBackgroundConfig from './config/rollup-background.js';
import rollupIncludesConfig from './config/rollup-includes.js';
import { postProcessOutput } from './src/build-helper.js';
import { invertFn, testNullish } from './src/utils.js';

import { asyncSequential } from './src/debug.js';

const addInputType = (name, shortName) => {
    yargs.array(name);
    yargs.default(name, []);
    yargs.alias(shortName, name);
};

// Set up verbose logging flag
yargs.boolean('verbose');
yargs.default('verbose', false);
yargs.alias('v', 'verbose');
// Set up debugging flag
yargs.boolean('debug');
yargs.default('debug', false);

// Set up input parameters
addInputType('background', 'bg');
addInputType('includes', 'inc');
const argv = yargs.argv;

const verboseLog = (...args) => {
    if (argv.verbose) console.debug(...args);
};

const resolveLocalFile = (_) => resolve(process.cwd(), _);
// For Regular background scripts that run in an IIFE
const backgroundSrcFiles = argv.background.map(resolveLocalFile);
// Script Includes that must add their own variable to scope
const includesSrcFiles = argv.includes.map(resolveLocalFile);

const buildBundle = (rollupOptions) => async (inputFile) => {
    verboseLog(`Processing configuration: ${inputFile}`);
    const options = await rollupOptions(inputFile);
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

const buildBundleFn = argv.debug ? buildBundleSync : buildBundle;

const buildPList = [
    backgroundSrcFiles.map(buildBundleFn(rollupBackgroundConfig)),
    includesSrcFiles.map(buildBundleFn(rollupIncludesConfig)),
];

buildPList
    .filter(invertFn(testNullish))
    .forEach((buildGroup) => buildGroup.map(logBuiltFile));
