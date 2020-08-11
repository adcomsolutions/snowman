#!/usr/bin/env node
import { resolve } from 'path';

import { doBuild } from './src/build-helper.js';
import { getFileYargs } from './src/yargs-helper.js';

const resolveLocalFile = (_) => resolve(process.cwd(), _);

const buildFiles = getFileYargs();
// For Regular background scripts that run in an IIFE
const backgroundSrcFiles = buildFiles.background.map(resolveLocalFile);
// Script Includes that must add their own variable to scope
const includesSrcFiles = buildFiles.includes.map(resolveLocalFile);

doBuild(backgroundSrcFiles, includesSrcFiles);
