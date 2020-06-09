import test from 'ava';
import { __private__ as me } from '../src/config-helper.js';
import { withTempEnvVariables } from './helper.js';
import { env } from 'process';

test('envifyConfigKey works', (t) => {
    const expected = 'SNOWMAN_TEST_KEY';
    const input = 'testKey';
    const res = me.envifyConfigKey(input);
    t.is(expected, res);
});

test.serial('loadEnvConfigForObj works', (t) => {
    const expected = { jsExt: 'foo', sourceDir: 'bar' };
    const envInput = {
        SNOWMAN_JS_EXT: 'foo',
        SNOWMAN_SOURCE_DIR: 'bar',
        SNOWMAN_SHOULD_NOT_APPEAR: 'Needs to be discarded',
        SHOULD_NOT_APPEAR: 'Also should be discarded',
    };
    // Ensure SNOWMAN_JS_EXT does not already exist to guarantee that it shouldn't exist after running withTempEnvVariables
    delete env.SNOWMAN_JS_EXT;
    withTempEnvVariables(envInput)(() => {
        const res = me.loadEnvConfigForObj({ jsExt: 'js', sourceDir: 'mod' });
        t.deepEqual(res, expected);
    });
    t.is(env.SNOWMAN_JS_EXT, undefined);
    t.not(env.SNOWMAN_SOURCE_DIR, 'bar');
});
