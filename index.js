#!/usr/bin/env node
import yargs from 'yargs';
import rollup from 'rollup';
import rollupIncludesConfig from './config/rollup-includes.js';
import rollupBackgroundConfig from './config/rollup-background.js';
import { postProcessOutput } from './src/build-helper.js';
import { invertFn, testNullish } from './src/utils.js';
import { resolve } from 'path';

yargs.array('includes');
yargs.default('includes', []);
yargs.alias('inc', 'includes');
yargs.array('background');
yargs.default('background', []);
yargs.alias('bg', 'background');
const argv = yargs.argv;

const resolveLocalFile = (_) => resolve(process.cwd(), _);
const includesSrcFiles = argv.includes.map(resolveLocalFile);
const backgroundSrcFiles = argv.background.map(resolveLocalFile);

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

const includesBuildP = includesSrcFiles.map(buildBundle(rollupIncludesConfig));
const backgroundBuildP = backgroundSrcFiles.map(
    buildBundle(rollupBackgroundConfig)
);

const allBuilds = [includesBuildP, backgroundBuildP].filter(
    invertFn(testNullish)
);

allBuilds.map((buildGroup) => buildGroup.map(logBuiltFile));
