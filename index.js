#!/usr/bin/env node
import yargs from 'yargs';
import rollup from 'rollup';
import rollupIncludesConfig from './config/rollup-includes.js';
import rollupBackgroundConfig from './config/rollup-background.js';
import { postProcessOutput } from './src/build-helper.js';

yargs.array('includes');
yargs.default('includes', []);
yargs.array('background');
yargs.default('background', []);
const argv = yargs.argv;

const buildBundle = (rollupOptions) => async (inputFile) => {
    const options = await rollupOptions(inputFile);
    const bundle = await rollup.rollup(options.input);
    const bundleOut = await bundle.write(options.output);
    return postProcessOutput(options.output.file).then(() => bundleOut);
};

const logBuiltFiles = async (rollupResultP) =>
    console.log(`Built file: ${(await rollupResultP).output[0].fileName}`);

argv.includes.map(buildBundle(rollupIncludesConfig)).map(logBuiltFiles);
argv.background.map(buildBundle(rollupBackgroundConfig)).map(logBuiltFiles);
