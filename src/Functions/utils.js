import { sort } from '../BuiltIns/arrays.js';

import { partial } from './higherorder.js';

export const identityFn = (item) => item;
export const wrapperFn = (value) => partial(identityFn, value);

export const arrayify = (item) => (Array.isArray(item) ? item : [item]);

export const propertySort = (objectList, property, sortFn) =>
    sort(objectList, (object1, object2) =>
        sortFn(object1[property], object2[property])
    );
