import test from 'ava';
import sinon from 'sinon';

import { passthroughFn } from '../src/utils.js';
import {
    mergeRollupConfigs,
    __private__ as priv,
} from '../src/rollup-helper.js';

test.beforeEach((t) => {
    t.context.sandbox = sinon.createSandbox();
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
