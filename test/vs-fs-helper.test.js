import test from 'ava';
import sinon from 'sinon';

import { getMockFs } from './helper.js';
import { passthroughFn } from '../src/utils.js';
import * as me from '../src/vs-fs-helper.js';
import { __private__ as priv } from '../src/vs-fs-helper.js';
import config from '../config/default.js';

const workspaceName = 'workspaceName';
const appName = 'appName';
const appScope = 'x_app_name';
const libScope = 'x_lib_name';

const appPrefix = `${workspaceName}/${appName}`;

const inputFilePath = `/${appPrefix}/subdir1/subdir2/subdir3/file.txt`;

const sandbox = sinon.createSandbox();

const newMockFs = () =>
    getMockFs(
        config,
        workspaceName,
        appName,
        appScope,
        libScope,
        inputFilePath
    );

test.beforeEach(() => {
    sandbox.restore();
});

test('Private newWorkspaceWalker works', async (t) => {
    const spy = sandbox.spy(passthroughFn);
    const dummyWorkspaceWalker = priv.newWorkspaceWalker(spy)(newMockFs());
    const expected = `/${workspaceName}`;
    const res = dummyWorkspaceWalker(inputFilePath);
    t.is(res, expected);
    t.is(
        spy.callCount,
        6,
        spy.printf('Recursed an unexpected number of times (%c):%D')
    );
});

test('Private getAppName works', (t) => {
    const expected = appName;
    const res = priv.getAppName(newMockFs())(inputFilePath);
    t.is(res, expected);
});

test('getAppDir works', (t) => {
    const expected = `/${workspaceName}/${appName}`;
    const res = me.getAppDir(newMockFs())(inputFilePath);
    t.is(res, expected);
});

test('getScopeName works', async (t) => {
    const expected = appScope;
    const res = await me.getScopeName(newMockFs())(inputFilePath);
    t.is(res, expected);
});

test('getWorkspaceDir works', (t) => {
    const expected = `/${workspaceName}`;
    const res = me.getWorkspaceDir(newMockFs())(inputFilePath);
    t.is(res, expected);
});
