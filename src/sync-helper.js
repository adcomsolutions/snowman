import keytar from 'keytar';
import bent from 'bent';

import config from './config-helper.js';
import nameMap from '../config/name-map.js';
import {
    getAppDir,
    getGroupData,
    getFieldName,
    getFileId,
} from './vs-helper.js';

const getAuthString = (username, password) =>
    'Basic ' +
    Buffer.from(`${username}:${password}`, 'binary').toString('base64');

const getPatchFn = (serverUri, username, password) =>
    bent('PATCH', 'json', `${serverUri}/api/now/v2/table/`, {
        Authorization: getAuthString(username, password),
    });

export const updateScript = async (builtFilePath, code) => {
    const appDir = getAppDir(builtFilePath);
    const secretData = await keytar.getPassword(appDir, config.secretAccount);
    if (secretData === null)
        throw new Error(
            `Credentials for this file were never set up in VSCode. Aborting sync!`
        );

    const [, username, password, instanceUri] = secretData.split(
        config.secretSep
    );

    const patch = getPatchFn(instanceUri, username, password);

    const { group, subgroup } = getGroupData(builtFilePath);
    if (!group || !subgroup)
        throw new Error('Unable to find group classification. Aborting sync!');

    const tableName = nameMap[group][subgroup];
    const fieldName = getFieldName(builtFilePath);
    const fileId = await getFileId(builtFilePath);

    if (!tableName)
        throw new Error(
            `Unable to find table name with data ${group}/${subgroup}. Aborting sync!`
        );
    if (!fieldName)
        throw new Error(
            'Unable to find field name in file name. Aborting sync!'
        );
    if (!fileId)
        throw new Error(
            'This file appears to have never been synced to the server by VSCode. Aborting sync!'
        );

    return patch(
        `${tableName}/${fileId}?sysparm_suppress_auto_sys_field=true`,
        { [fieldName]: code }
    );
};
