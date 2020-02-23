export const reverse = (array) => [...array].reverse();
export const sort = (array, sortFn) => [...array].sort(sortFn);
export const tail = (array) => array.slice(1);

// HACK: Soft equality because Rhino native objects cast funny
export const includes = (array, value) =>
    array.reduce((memo, item) => item == value || memo, false); // eslint-disable-line eqeqeq
