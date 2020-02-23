Object.setPrototypeOf =
    Object.setPrototypeOf ||
    function(obj, proto) {
        var type = typeof proto;
        if (
            (typeof obj === 'object' || typeof obj === 'function') &&
            (type === 'object' || type === 'function')
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
            throw new TypeError('Expected both the arguments to be objects.');
    };
