import { getConfig } from '../src/config-helper.js';
import { getOutputFilePath } from '../src/rollup-helper.js';

import fs from 'fs-extra';

const config = getConfig();
const bundleIntroP = fs.readFile(config.rhinoPolyfillPath, 'utf8');
const bundleBanner = `// Rollup file built on ${new Date().toGMTString()}`;

export default async (inputFile) => ({
    input: {
        input: inputFile,
    },
    output: {
        file: getOutputFilePath(inputFile),
        banner: bundleBanner,
        intro: await bundleIntroP,
        format: 'iife',
        strict: false,
        interop: false,
    },
});
