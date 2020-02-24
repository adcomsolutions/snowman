// Rollup file built on Mon, 24 Feb 2020 03:55:48 GMT
var BuiltIns = (function(tests_mjs) {
    Object.setPrototypeOf =
        Object.setPrototypeOf ||
        function(obj, proto) {
            var type = typeof proto;
            if (
                (typeof obj === "object" || typeof obj === "function") &&
                (type === "object" || type === "function")
            ) {
                var constructor = function(obj) {
                    var ownPropertyNames = Object.getOwnPropertyNames(obj);
                    var length = ownPropertyNames.length;
                    for (var i = 0; i < length; i++) {
                        var ownPropertyName = ownPropertyNames[i];
                        this[ownPropertyName] = obj[ownPropertyName];
                    }
                };
                constructor.prototype = proto;
                constructor.type = proto;
                return new constructor(obj);
            } else
                throw new TypeError(
                    "Expected both the arguments to be objects."
                );
        };

    var reverse = function(array) {
        return [].concat(array).reverse();
    };
    var sort = function(array, sortFn) {
        return [].concat(array).sort(sortFn);
    };
    var tail = function(array) {
        return array.slice(1);
    }; // HACK: Soft equality because Rhino native objects cast funny

    var includes = function(array, value) {
        return array.reduce(function(memo, item) {
            return item == value || memo;
        }, false);
    }; // eslint-disable-line eqeqeq

    var arrays = /* #__PURE__ */ Object.freeze({
        __proto__: null,
        reverse: reverse,
        sort: sort,
        tail: tail,
        includes: includes
    });

    var testBooleanString = function(booleanString) {
        return booleanString === "true" || booleanString === "false";
    };
    var booleanFromString = function(booleanString) {
        return testBooleanString(booleanString)
            ? Boolean.valueOf(booleanString)
            : null;
    };

    var booleans = /* #__PURE__ */ Object.freeze({
        __proto__: null,
        testBooleanString: testBooleanString,
        booleanFromString: booleanFromString
    });

    var validateDate = function(date) {
        return date instanceof Date && !tests_mjs.testNaN(date.getTime());
    };

    var testDateString = function(dateString) {
        return (
            dateString instanceof String && validateDate(new Date(dateString))
        );
    };

    var dateFromString = function(dateString) {
        return testDateString(dateString) ? new Date(dateString) : null;
    };

    var testDurationString = function(dateString) {
        return testDateString(dateString) && dateString.startsWith("197");
    };

    var durationFromString = function(durationString) {
        return testDurationString(durationString)
            ? new Date(durationString).now
            : null;
    };

    var dates = /* #__PURE__ */ Object.freeze({
        __proto__: null,
        validateDate: validateDate,
        dateFromString: dateFromString,
        durationFromString: durationFromString
    });

    var testNumberString = function(numberString) {
        return (
            numberString instanceof String &&
            tests_mjs.testNaN(Number(numberString))
        );
    };
    var numberFromString = function(numberString) {
        return testNumberString(numberString) ? Number(numberString) : null;
    };

    var numbers = /* #__PURE__ */ Object.freeze({
        __proto__: null,
        testNumberString: testNumberString,
        numberFromString: numberFromString
    });

    var BuiltIns = {
        arrays: arrays,
        booleans: booleans,
        dates: dates,
        numbers: numbers,
        type: "BuiltIns"
    };

    return BuiltIns;
})(Functions);
