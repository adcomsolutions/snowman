import test from 'ava';

import { getMockFs } from './helper.js';

import config from '../config/default.js';
import { VsHelper } from '../src/vs-helper.js';

const workspaceName = 'workspaceName';
const appName = 'appName';
const appScope = 'x_app_name';
const libScope = 'x_lib_name';

const appPrefix = `${workspaceName}/${appName}`;
const sourceDir = `${appPrefix}/${config.sourceDir}`;
const normalScriptExt = `${config.scriptSubext}.${config.jsExt}`;
const fakeTaskName = 'Fake Task';
const fakeIncludeName = 'fake business rule';
const fakeRuleName = 'Fake Rule';

const inputLibraryFile = `/${sourceDir}/${config.scriptIncludeDir}/${fakeIncludeName}.${normalScriptExt}`;
const inputNestedFile = `/${sourceDir}/Server Development/Scheduled Script Executions/${fakeTaskName}/${fakeTaskName}.${normalScriptExt}`;
const inputNormalFile = `/${sourceDir}/Server Development/Business Rules/${fakeRuleName}.${normalScriptExt}`;

let vsHelper;
const refreshHelper = () => {
    const mockFs = getMockFs(
        config,
        workspaceName,
        appName,
        appScope,
        libScope,
        [inputLibraryFile, inputNestedFile, inputNormalFile]
    );
    vsHelper = VsHelper(mockFs);
    vsHelper.priv = vsHelper.__private__;
};

test.beforeEach(refreshHelper);

test('Private getLibraryDir works', async (t) => {
    const libraryDir = `/${workspaceName}/${config.libName}/${config.outDir}`;
    const expected = libraryDir;
    const res = vsHelper.priv.getLibraryDir(inputNormalFile);
    t.is(res, expected);
});

test('Private getOutDir works', (t) => {
    const expected = `/${workspaceName}/${appName}/${config.outDir}`;
    const res = vsHelper.priv.getOutDir(inputNormalFile);
    t.is(res, expected);
});

test('Private getSourceDir works', (t) => {
    const expected = `/${workspaceName}/${appName}/${config.sourceDir}`;
    const res = vsHelper.priv.getSourceDir(inputNormalFile);
    t.is(res, expected);
});

test('Private getWorkspaceDir works', (t) => {
    const expected = `/${workspaceName}`;
    const res = vsHelper.priv.getWorkspaceDir(inputNormalFile);
    t.is(res, expected);
});

test('getLibraryIncludeDir works', async (t) => {
    const librarySrcDir = `/${workspaceName}/${config.libName}/${config.outDir}/${config.scriptIncludeDir}`;
    const expected = librarySrcDir;
    const res = vsHelper.getLibraryIncludeDir(inputNormalFile);
    t.is(res, expected);
});

test('getNestedOutputFilePath works', (t) => {
    const outputFileFragment = `${config.scriptIncludeDir}/my business rule/my business rule.${config.scriptSubext}.${config.jsExt}`;
    const expected = `${vsHelper.priv.getOutDir(
        inputNestedFile
    )}/${outputFileFragment}`;
    const res = vsHelper.getNestedOutputFilePath(inputNestedFile);
    t.is(res, expected);
});

test('getOutputFilePath works', (t) => {
    const outputFileFragment = `${config.scriptIncludeDir}/my business rule.${config.scriptSubext}.${config.jsExt}`;
    const expected = `${vsHelper.priv.getOutDir(
        inputNormalFile
    )}/${outputFileFragment}`;
    const res = vsHelper.getOutputFilePath(inputNormalFile);
    t.is(res, expected);
});

test('getScriptIncludeDir works', async (t) => {
    const expected = `${vsHelper.priv.getSourceDir(inputNormalFile)}/${
        config.scriptIncludeDir
    }`;
    const res = await vsHelper.getScriptIncludeDir(inputNormalFile);
    t.is(res, expected);
});
