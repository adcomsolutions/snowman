#!/usr/bin/env node
import config from './src/config-helper.js';
import { doBuild, bindWatchers } from './src/build-helper.js';
import { getFileYargs } from './src/yargs-helper.js';

import { resolve } from 'path';

const resolveLocalFile = (_) => resolve(process.cwd(), _);

const buildFiles = getFileYargs();
// For Regular background scripts that run in an IIFE
const backgroundSrcFiles = buildFiles.background.map(resolveLocalFile);
// Script Includes that must add their own variable to scope
const includesSrcFiles = buildFiles.includes.map(resolveLocalFile);

if (config.watch) bindWatchers(backgroundSrcFiles, includesSrcFiles);
else doBuild(backgroundSrcFiles, includesSrcFiles);
