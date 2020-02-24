#!/usr/bin/env node
import yargs from 'yargs';
import rollup from 'rollup';
import rollupIncludesConfig from './config/rollup-includes.js';

yargs.array('includes');
const argv = yargs.argv;

const buildBundle = (rollupOptions) => async (inputFile) => {
    const options = await rollupOptions(inputFile);
    const bundle = await rollup.rollup(options.input);
    return bundle.write(options.output);
};

const logOutputPath = async (rollupResultP) =>
    console.log(`Built file: ${(await rollupResultP).output[0].fileName}`);

argv.includes.map(buildBundle(rollupIncludesConfig)).map(logOutputPath);
