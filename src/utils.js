import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

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

export const dirName = dirname(
    // TODO: Figure out a smarter way to resolve the index.js dir
    resolve(fileURLToPath(import.meta.url), '..')
);
