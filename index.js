#!/usr/bin/env node
import yargs from 'yargs';
import rollup from 'rollup';
import rollupBackgroundConfig from './config/rollup-background.js';
import rollupBackground2Config from './config/rollup-background2.js';
import rollupIncludesConfig from './config/rollup-includes.js';
import { postProcessOutput } from './src/build-helper.js';
import { invertFn, testNullish } from './src/utils.js';
import { resolve } from 'path';

yargs.array('background');
yargs.default('background', []);
yargs.alias('bg', 'background');
yargs.array('background2');
yargs.default('background2', []);
yargs.alias('bg2', 'background2');
yargs.array('includes');
yargs.default('includes', []);
yargs.alias('inc', 'includes');
const argv = yargs.argv;

const resolveLocalFile = (_) => resolve(process.cwd(), _);
// For Regular background scripts that run in an IIFE
const backgroundSrcFiles = argv.background.map(resolveLocalFile);
// Same as backgroundSrcFiles, but for the weird record types that use a nested path (not sure why vscode does this...)
// example: Scheduled Script Executions/My Script/My Script.script.js
const background2SrcFiles = argv.background2.map(resolveLocalFile);
// Script Includes that must add their own variable to scope
const includesSrcFiles = argv.includes.map(resolveLocalFile);

const buildBundle = (rollupOptions) => async (inputFile) => {
    const options = await rollupOptions(inputFile);
    const bundle = await rollup.rollup(options.input);
    const bundleOut = await bundle.write(options.output);
    return postProcessOutput(options.output.file).then(() => [
        bundleOut,
        options,
    ]);
};

const logBuiltFile = async (rollupResultP) => {
    const [{ output }] = await rollupResultP;
    console.log(output[0].fileName);
};

const backgroundBuildP = backgroundSrcFiles.map(
    buildBundle(rollupBackgroundConfig)
);

const background2BuildP = background2SrcFiles.map(
    buildBundle(rollupBackground2Config)
);

const includesBuildP = includesSrcFiles.map(buildBundle(rollupIncludesConfig));

const allBuilds = [includesBuildP, backgroundBuildP, background2BuildP].filter(
    invertFn(testNullish)
);

allBuilds.map((buildGroup) => buildGroup.map(logBuiltFile));
