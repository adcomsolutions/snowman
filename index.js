#!/usr/bin/env node
import yargs from 'yargs';
import rollup from 'rollup';
import rollupIncludesConfig from './config/rollup-includes.js';
import { postProcessOutput } from './src/build-helper.js';

yargs.array('includes');
const argv = yargs.argv;

const buildBundle = (rollupOptions) => async (inputFile) => {
    const options = await rollupOptions(inputFile);
    const bundle = await rollup.rollup(options.input);
    const bundleOut = await bundle.write(options.output);
    return postProcessOutput(options.output.file).then(() => bundleOut);
};

const logOutputPath = async (rollupResultP) =>
    console.log(`Built file: ${(await rollupResultP).output[0].fileName}`);

argv.includes.map(buildBundle(rollupIncludesConfig)).map(logOutputPath);
