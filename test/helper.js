import { objToTuples } from '../src/utils.js';
import { env } from 'process';
import memfs from 'memfs';
import fsMonkey from 'fs-monkey';
import sinon from 'sinon';

export const getMockFs = (
    config,
    workspaceName,
    appName,
    appScope,
    libScope,
    fakeFilePaths
) => {
    const appPrefix = `${workspaceName}/${appName}`;
    const scopedDummyName = 'A Normal Scoped Application';
    const scopedDummyScope = 'x_admso_scopeddummy';
    const scopedDummyPrefix = `${workspaceName}/${scopedDummyName}`;

    const fakeProject = {
        [`/${appPrefix}/${config.outDir}/Server Development/Business Rules/helper`]: {},
        [`/${appPrefix}/${config.sourceDir}/${config.scriptIncludeDir}/helper/helper.${config.scriptSubext}.${config.jsExt}`]: 'const helper = {foo: "bar"};',
        [`/${workspaceName}/${config.libName}/${config.outDir}/${config.scriptIncludeDir}/lib.${config.jsExt}`]: 'var lib = "foobar"',
        [`/${scopedDummyPrefix}/${config.sourceDir}/${config.scriptIncludeDir}/a_scoped_script_include.${config.scriptSubext}.${config.jsExt}`]: 'export default const "foobar";',
        [`/${scopedDummyPrefix}/${config.outDir}/${config.scriptIncludeDir}/a_scoped_script_include.${config.jsExt}`]: 'var a_scoped_script_include = "foobar";',
        [`/${workspaceName}/system/sn-workspace.json`]: JSON.stringify({
            ALL_APPLICATIONS: {
                [appName]: {
                    sys_id: 'baaaaaaaaaa28c9014cec7ec0b961921',
                    sys_scope: appScope,
                    package_type: 'sys_app',
                },
                [config.libName]: {
                    sys_id: 'caaaaaaaaaa28c9014cec7ec0b961921',
                    sys_scope: libScope,
                    package_type: 'sys_app',
                },
                [scopedDummyName]: {
                    sys_id: 'daaaaaaaaaa28c9014cec7ec0b961921',
                    sys_scope: scopedDummyScope,
                    package_type: 'sys_app',
                },
            },
        }),
    };

    fakeFilePaths.forEach((fakePath) => {
        fakeProject[fakePath] = 'console.log("foobar");';
    });

    const mockVol = memfs.Volume.fromJSON(fakeProject);
    const fs = import('fs');
    fsMonkey.patchFs(mockVol, fs);
    return fs;
};

export const withTempEnvVariables = (varObj) => (fn) => {
    const sandbox = sinon.createSandbox();
    const needsDeleteList = objToTuples(varObj)
        .map(([key, value]) => {
            const needsDelete = env[key] === undefined ? key : null;

            if (needsDelete !== null) env[key] = '';
            sandbox.stub(env, key).value(value);

            return needsDelete;
        })
        .filter((value) => value !== null);

    const result = fn();

    sandbox.restore();

    needsDeleteList.forEach((key) => {
        delete env[key];
    });

    return result;
};
