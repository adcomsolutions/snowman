#!/usr/bin/env node
import yargs from "yargs";
import rollup from "rollup";
import rollupIncludesConfig from "./config/rollup-includes.js";

const argv = yargs.argv;

const buildBundle = async (inputFile, rollupOptions) => {
    const options = await rollupOptions(inputFile);
    const bundle = await rollup.rollup(options.input);
    return bundle.write(options.output);
};

buildBundle(argv.input, rollupIncludesConfig);
