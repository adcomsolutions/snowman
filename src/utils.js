import { cwd } from 'process';
import path from 'path';
import fs from 'fs-extra';

export const uniq = (items) => [...new Set(items)];
export const invertFn = (fn) => (...args) => !fn(...args);
export const escapeSpace = (string) => string.replace(/ /g, '\\ ');

// TODO: Uncomment new version when ECMAScript 2020 is supported in NodeJS
// export const testNullish = (_) => Boolean(_ ?? false);
export const testNullish = (_) => _ === null || _ === undefined;

export const mergeOptions = (...objs) => {
    const mergeTwo = (objA, objB) => {
        const baseMerge = { ...objA, ...objB };
        for (const prop in baseMerge) {
            if (testNullish(baseMerge[prop])) baseMerge[prop] = objA[prop];
        }
        return baseMerge;
    };
    return objs.reduce(mergeTwo, {});
};

export const squashObjs = (objects) =>
    objects.reduce(
        (memo, nextObj) => ({
            ...memo,
            ...nextObj,
        }),
        {}
    );

export const extractProp = (prop) => (object) => object[prop];

// Gets the topmost npm project from the current directory
export const getTopLevelProject = () => {
    const pieces = cwd().split(path.sep);

    const hasProject = (nextPath) =>
        fs.existsSync(path.join(nextPath, 'package.json'));

    return pieces.reduce(
        (lastPath, nextPiece) =>
            hasProject(lastPath) ? lastPath : path.join(lastPath, nextPiece),
        path.sep
    );
};

export const getLastDir = (pathName, isDir) => {
    const splitted = pathName.split(path.sep);
    const depth = isDir ? 1 : 2;
    return splitted[splitted.length - depth];
};
