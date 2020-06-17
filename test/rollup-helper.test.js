import test from 'ava';
import sinon from 'sinon';

import config from '../config/default.js';
import { passthroughFn } from '../src/utils.js';
import {
    mapScriptIncludes,
    mergeRollupConfigs,
    __private__ as priv,
} from '../src/rollup-helper.js';

const workspaceName = 'workspaceName';
const appName = 'appName';
const aModulesDir = `${workspaceName}/${appName}/${config.srcDir}/${config.scriptIncludeDir}`;
const includesDir = `${workspaceName}/${config.libName}/${config.outDir}/${config.scriptIncludeDir}`;

test.beforeEach((t) => {
    t.context.sandbox = sinon.createSandbox();
});

test('Private getModuleNameFromFile works', (t) => {
    const fakeFilePath = `${aModulesDir}/myModule/myModule.${config.scriptSubext}.${config.jsExt}`;
    const expected = 'myModule';
    const res = priv.getModuleNameFromFile(fakeFilePath);
    t.is(res, expected);
});

test('Private globalifyBase works', async (t) => {
    const testableGlobalifyBaseP = priv.globalifyBase(passthroughFn);
    const input = ['input_a', 'input_b'];
    const expected = {
        [input[0]]: input[0],
        [input[1]]: input[1],
    };
    const res = await testableGlobalifyBaseP(input);
    t.deepEqual(res, expected);
});

test('Private getIncludeFilesWith works', async (t) => {
    const spy = t.context.sandbox.spy(passthroughFn);
    const inputFile = '/fakepath/fakefile.js';
    const testableFn = priv.getIncludeFilesWith(spy);
    await testableFn(inputFile);
    t.assert(
        spy.calledOnceWith(inputFile),
        'Resolver function should be called once'
    );
});

test('mapScriptIncludes works', async (t) => {
    const fakeScriptIncludes = [
        `${includesDir}/include_a.${config.scriptSubext}.${config.jsExt}`,
        `${includesDir}/include_b.${config.scriptSubext}.${config.jsExt}`,
        `${includesDir}/include_c.${config.scriptSubext}.${config.jsExt}`,
    ];

    const expected = {
        [fakeScriptIncludes[0]]: 'include_a',
        [fakeScriptIncludes[1]]: 'include_b',
        [fakeScriptIncludes[2]]: 'include_c',
    };

    const res = await mapScriptIncludes(fakeScriptIncludes);
    t.deepEqual(res, expected);
});

test('mergeRollupConfigs works', (t) => {
    const fakeConfigs = [
        {
            input: {
                prop_a: 'input1_value_a',
                prop_b: 'input1_value_b',
                prop_c: 'input1_value_c',
                originallyempty: '',
                objWontMerge: { propToBeDiscarded: 'Should not be merged' },
            },
            output: {
                prop_a: 'output1_value_a',
                prop_b: 'output1_value_b',
                prop_c: 'output1_value_c',
                originallynull: null,
            },
            extraneous: {
                discard: 'this',
            },
        },
        {
            input: {
                prop_a: 'input2_value_a',
                prop_b: 'input2_value_b',
                prop_d: 'input2_value_d',
                originallyempty: 'successfully overwrote empty string',
                objWontMerge: {
                    propToBeKept: 'This should be the only remaining property',
                },
            },
            output: {
                prop_a: 'output2_value_a',
                prop_b: 'output2_value_b',
                prop_d: 'output2_value_d',
                originallynull: 'successfully overwrote null',
            },
        },
    ];

    const expected = {
        input: {
            prop_a: 'input2_value_a',
            prop_b: 'input2_value_b',
            prop_c: 'input1_value_c',
            prop_d: 'input2_value_d',
            originallyempty: 'successfully overwrote empty string',
            objWontMerge: {
                propToBeKept: 'This should be the only remaining property',
            },
        },
        output: {
            prop_a: 'output2_value_a',
            prop_b: 'output2_value_b',
            prop_c: 'output1_value_c',
            prop_d: 'output2_value_d',
            originallynull: 'successfully overwrote null',
        },
    };

    const res = mergeRollupConfigs(...fakeConfigs);
    t.deepEqual(res, expected);
});
