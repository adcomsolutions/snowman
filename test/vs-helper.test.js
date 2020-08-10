import test from 'ava';
import sinon from 'sinon';

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
const fakeIncludePath = 'deeply/nested/path/MyScriptInclude';
const fakeRuleName = 'Fake Rule';

const inputLibraryFile = `/${sourceDir}/${config.scriptIncludeDir}/${fakeIncludePath}.${normalScriptExt}`;
const inputNormalFile = `/${sourceDir}/Server Development/Business Rules/${fakeRuleName}.${normalScriptExt}`;

let vsHelper;
const refreshHelper = () => {
    const mockFs = getMockFs(
        config,
        workspaceName,
        appName,
        appScope,
        libScope,
        [inputLibraryFile, inputNormalFile]
    );
    vsHelper = VsHelper(mockFs);
    vsHelper.priv = vsHelper.__private__;
};

test.beforeEach(refreshHelper);
test.beforeEach((t) => {
    t.context.sandbox = sinon.createSandbox();
});

test('Private getLibraryOutputFileName works', (t) => {
    const expected = `deeply_nested_path_MyScriptInclude.${normalScriptExt}`;
    const res = vsHelper.priv.getLibraryOutputFileName()(inputLibraryFile);
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

test('getLibraryDir works', async (t) => {
    const libraryDir = `/${workspaceName}/${config.libName}/${config.sourceDir}`;
    const expected = `${libraryDir}/${config.scriptIncludeDir}`;
    const res = vsHelper.getLibraryDir(inputNormalFile);
    t.is(res, expected);
});

test('getOutputFilePath works', (t) => {
    const outputFileFragment = `Server Development/Business Rules/${fakeRuleName}.${normalScriptExt}`;
    const expected = `${vsHelper.priv.getOutDir(
        inputNormalFile
    )}/${outputFileFragment}`;
    const res = vsHelper.getOutputFilePath(inputNormalFile);
    t.is(res, expected);
});

test('getLibraryOutputFilePath works', (t) => {
    const expected = `${vsHelper.priv.getOutDir(inputLibraryFile)}/${
        config.scriptIncludeDir
    }/${vsHelper.priv.getLibraryOutputFileName()(inputLibraryFile)}`;
    const res = vsHelper.getLibraryOutputFilePath(inputLibraryFile);
    t.is(res, expected);
});

test('getScriptIncludeDir works', async (t) => {
    const expected = `${vsHelper.priv.getSourceDir(inputNormalFile)}/${
        config.scriptIncludeDir
    }`;
    const res = await vsHelper.getScriptIncludeDir(inputNormalFile);
    t.is(res, expected);
});
