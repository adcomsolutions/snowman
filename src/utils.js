import {fileURLToPath} from 'url'
import {dirname, resolve} from 'path'

export const testDead = (_) => _ === undefined || _ === null

export const mergeOptions = (...objs) => {
    const mergeTwo = (objA, objB) => {
        const baseMerge = {...objA, ...objB}
        for(const prop in baseMerge) {
            if(testDead(baseMerge[prop])) baseMerge[prop] = objA[prop]
        }
        return baseMerge
    }
    return objs.reduce(mergeTwo, {})
}

export const squashObjs = (objects) =>
    objects.reduce(
        (memo, nextObj) => ({
            ...memo,
            ...nextObj,
        }),
        {}
    );

export const extractProp = (prop) => (object) => object[prop]

export const dirName = dirname(
    // TODO: Figure out a smarter way to resolve the index.js dir
    resolve(fileURLToPath(import.meta.url), '..')
)
