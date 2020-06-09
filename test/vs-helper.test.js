import test from 'ava';

import { getMockFs } from './helper.js';

import config from '../config/default.js';
import { VsHelper } from '../src/vs-helper.js';

const workspaceName = 'workspaceName';
const appName = 'appName';
const appScope = 'x_app_name';
const libScope = 'x_lib_name';

const appPrefix = `${workspaceName}/${appName}`;

const inputFile = `/${appPrefix}/${config.sourceDir}/${config.scriptIncludeDir}/my business rule/my business rule.${config.scriptSubext}.${config.jsExt}`;

let vsHelper;
const refreshHelper = () => {
    const mockFs = getMockFs(
        config,
        workspaceName,
        appName,
        appScope,
        libScope,
        inputFile
    );
    vsHelper = VsHelper(mockFs);
    vsHelper.priv = vsHelper.__private__;
};

test.beforeEach(refreshHelper);

test('Private getLibraryDir works', async (t) => {
    const libraryDir = `/${workspaceName}/${config.libName}/${config.outDir}`;
    const expected = libraryDir;
    const res = vsHelper.priv.getLibraryDir(inputFile);
    t.is(res, expected);
});

test('Private getOutDir works', (t) => {
    const expected = `/${workspaceName}/${appName}/${config.outDir}`;
    const res = vsHelper.priv.getOutDir(inputFile);
    t.is(res, expected);
});

test('Private getSourceDir works', (t) => {
    const expected = `/${workspaceName}/${appName}/${config.sourceDir}`;
    const res = vsHelper.priv.getSourceDir(inputFile);
    t.is(res, expected);
});

test('Private getWorkspaceDir works', (t) => {
    const expected = `/${workspaceName}`;
    const res = vsHelper.priv.getWorkspaceDir(inputFile);
    t.is(res, expected);
});

test('getLibraryIncludeDir works', async (t) => {
    const librarySrcDir = `/${workspaceName}/${config.libName}/${config.outDir}/${config.scriptIncludeDir}`;
    const expected = librarySrcDir;
    const res = vsHelper.getLibraryIncludeDir(inputFile);
    t.is(res, expected);
});

test('getNestedOutputFilePath works', (t) => {
    const outputFileFragment = `${config.scriptIncludeDir}/my business rule/my business rule.${config.scriptSubext}.${config.jsExt}`;
    const outputFile = `/${appPrefix}/${config.outDir}/${outputFileFragment}`;
    const expected = outputFile;
    const res = vsHelper.getNestedOutputFilePath(inputFile);
    t.is(res, expected);
});

test('getOutputFilePath works', (t) => {
    const outputFileFragment = `${config.scriptIncludeDir}/my business rule.${config.scriptSubext}.${config.jsExt}`;
    const outputFile = `/${appPrefix}/${config.outDir}/${outputFileFragment}`;
    const expected = outputFile;
    const res = vsHelper.getOutputFilePath(inputFile);
    t.is(res, expected);
});

test('getScriptIncludeDir works', async (t) => {
    const expected = `/${appPrefix}/${config.sourceDir}/${config.scriptIncludeDir}`;
    const res = await vsHelper.getScriptIncludeDir(inputFile);
    t.is(res, expected);
});
