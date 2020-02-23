export const bindRule = (fn) => {
    executeRule = fn;
    executeRule(current, previous);
    return fn;
};
