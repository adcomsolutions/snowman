import { testNaN } from '../Functions/tests.js';
export const testNumberString = (numberString) =>
    numberString instanceof String && testNaN(Number(numberString));

export const numberFromString = (numberString) =>
    testNumberString(numberString) ? Number(numberString) : null;
