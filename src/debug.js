const promiseQueue = [Promise.resolve('test')];
export const asyncSequential = (asyncFn) => (...fnArgs) => {
    const nextP = promiseQueue.splice(0, 1)[0];
    const newP = nextP.then(() => asyncFn(...fnArgs));
    promiseQueue.push(newP);
    return newP;
};
