import config from './config-helper.js';

const promiseQueue = [Promise.resolve('test')];
export const asyncSequential = (asyncFn) => (...fnArgs) => {
    const nextP = promiseQueue.splice(0, 1)[0];
    const newP = nextP.then(() => asyncFn(...fnArgs));
    promiseQueue.push(newP);
    return newP;
};

export const verboseLog = (...args) => {
    if (config.verbose) console.debug(...args);
};

export const debugLog = (...args) => {
    if (config.debug) console.debug(...args);
};
