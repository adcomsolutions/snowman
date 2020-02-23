import { testNaN } from '../Functions/tests.js';

export const validateDate = (date) =>
    date instanceof Date && !testNaN(date.getTime());

const testDateString = (dateString) =>
    dateString instanceof String && validateDate(new Date(dateString));

export const dateFromString = (dateString) =>
    testDateString(dateString) ? new Date(dateString) : null;

const testDurationString = (dateString) =>
    testDateString(dateString) && dateString.startsWith('197');

export const durationFromString = (durationString) =>
    testDurationString(durationString) ? new Date(durationString).now : null;
