import { existsSync } from 'fs';
import path from 'path';
import { cwd } from 'process';

export const uniq = (items) => [...new Set(items)];
export const escapeSpace = (string) => string.replace(/ /g, '\\ ');
export const invertFn = (fn) => (...args) => !fn(...args);
export const flatPassthroughFn = (...args) => args;
export const passthroughFn = (firstArg) => firstArg;

// TODO: Uncomment new version when ECMAScript 2020 is supported in NodeJS
// export const testNullish = (_) => Boolean(_ ?? false);
export const testNullish = (_) => _ === null || _ === undefined;

export const mergeObjects = (...objs) => {
    const mergeTwo = (objA, objB) => {
        const baseMerge = { ...objA, ...objB };
        for (const prop in baseMerge) {
            if (testNullish(baseMerge[prop])) baseMerge[prop] = objA[prop];
        }
        return baseMerge;
    };
    return objs.reduce(mergeTwo, {});
};

export const zip = (arr, ...arrs) =>
    arr.map((val, i) => arrs.reduce((a, arr) => [...a, arr[i]], [val]));

export const squashObjs = (objects) =>
    objects.reduce(
        (memo, nextObj) => ({
            ...memo,
            ...nextObj,
        }),
        {}
    );

export const extractProp = (prop) => (object) => object[prop];

export const objToTuples = (obj) => {
    const out = [];
    for (const key in obj) {
        out.push([key, obj[key]]);
    }
    return out;
};

export const tuplesToObj = (tuples) => {
    const out = {};
    tuples.forEach(([key, value]) => {
        out[key] = value;
    });
    return out;
};

// Gets the topmost npm project from the current directory
export const getTopLevelProject = () => {
    const pieces = cwd().split(path.sep);

    const hasProject = (nextPath) =>
        existsSync(path.join(nextPath, 'package.json'));

    return pieces.reduce(
        (lastPath, nextPiece) =>
            hasProject(lastPath) ? lastPath : path.join(lastPath, nextPiece),
        path.sep
    );
};

export const getLastDirFromDir = (pathName, depth) => {
    const splitted = pathName.split(path.sep);
    return splitted[splitted.length - (depth || 1)];
};

export const getLastDirFromFile = (pathName, depth) =>
    getLastDirFromDir(pathName, depth || 2);
