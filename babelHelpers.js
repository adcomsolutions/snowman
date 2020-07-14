// Manually add this as globally accessible script include and set the name using the 'babelHelperName' configuration property
// The script MUST be saved as part of a Scoped Application, otherwise Scoped Scripts will fail when calling these helpers

/* eslint-disable */
var babelHelpers = (function () {
    var decoratorsApi = {
        cache: null,
        get api() {
            return {
                elementsDefinitionOrder: [['method'], ['field']],
                initializeInstanceElements: function (O, elements) {
                    ['method', 'field'].forEach(function (kind) {
                        elements.forEach(function (element) {
                            if (
                                element.kind === kind &&
                                element.placement === 'own'
                            ) {
                                this.defineClassElement(O, element);
                            }
                        }, this);
                    }, this);
                },
                initializeClassElements: function (F, elements) {
                    var proto = F.prototype;
                    ['method', 'field'].forEach(function (kind) {
                        elements.forEach(function (element) {
                            var placement = element.placement;

                            if (
                                element.kind === kind &&
                                (placement === 'static' ||
                                    placement === 'prototype')
                            ) {
                                var receiver =
                                    placement === 'static' ? F : proto;
                                this.defineClassElement(receiver, element);
                            }
                        }, this);
                    }, this);
                },
                defineClassElement: function (receiver, element) {
                    var descriptor = element.descriptor;

                    if (element.kind === 'field') {
                        var initializer = element.initializer;
                        descriptor = {
                            enumerable: descriptor.enumerable,
                            writable: descriptor.writable,
                            configurable: descriptor.configurable,
                            value:
                                initializer === void 0
                                    ? void 0
                                    : initializer.call(receiver),
                        };
                    }

                    Object.defineProperty(receiver, element.key, descriptor);
                },
                decorateClass: function (elements, decorators) {
                    var newElements = [];
                    var finishers = [];
                    var placements = {
                        static: [],
                        prototype: [],
                        own: [],
                    };
                    elements.forEach(function (element) {
                        this.addElementPlacement(element, placements);
                    }, this);
                    elements.forEach(function (element) {
                        if (!exports.hasDecorators(element))
                            return newElements.push(element);
                        var elementFinishersExtras = this.decorateElement(
                            element,
                            placements
                        );
                        newElements.push(elementFinishersExtras.element);
                        newElements.push.apply(
                            newElements,
                            elementFinishersExtras.extras
                        );
                        finishers.push.apply(
                            finishers,
                            elementFinishersExtras.finishers
                        );
                    }, this);

                    if (!decorators) {
                        return {
                            elements: newElements,
                            finishers: finishers,
                        };
                    }

                    var result = this.decorateConstructor(
                        newElements,
                        decorators
                    );
                    finishers.push.apply(finishers, result.finishers);
                    result.finishers = finishers;
                    return result;
                },
                addElementPlacement: function (element, placements, silent) {
                    var keys = placements[element.placement];

                    if (!silent && keys.includes(element.key)) {
                        throw new TypeError(
                            'Duplicated element (' + element.key + ')'
                        );
                    }

                    keys.push(element.key);
                },
                decorateElement: function (element, placements) {
                    var extras = [];
                    var finishers = [];

                    for (
                        var decorators = element.decorators,
                            i = decorators.length - 1;
                        i >= 0;
                        i--
                    ) {
                        var keys = placements[element.placement];
                        keys.splice(keys.indexOf(element.key), 1);
                        var elementObject = this.fromElementDescriptor(element);
                        var elementFinisherExtras = this.toElementFinisherExtras(
                            (0, decorators[i])(elementObject) || elementObject
                        );
                        element = elementFinisherExtras.element;
                        this.addElementPlacement(element, placements);

                        if (elementFinisherExtras.finisher) {
                            finishers.push(elementFinisherExtras.finisher);
                        }

                        var newExtras = elementFinisherExtras.extras;

                        if (newExtras) {
                            for (const newExtra of newExtras) {
                                this.addElementPlacement(newExtra, placements);
                            }

                            extras.push.apply(extras, newExtras);
                        }
                    }

                    return {
                        element: element,
                        finishers: finishers,
                        extras: extras,
                    };
                },
                decorateConstructor: function (elements, decorators) {
                    var finishers = [];

                    for (var i = decorators.length - 1; i >= 0; i--) {
                        var obj = this.fromClassDescriptor(elements);
                        var elementsAndFinisher = this.toClassDescriptor(
                            (0, decorators[i])(obj) || obj
                        );

                        if (elementsAndFinisher.finisher !== undefined) {
                            finishers.push(elementsAndFinisher.finisher);
                        }

                        if (elementsAndFinisher.elements !== undefined) {
                            elements = elementsAndFinisher.elements;

                            for (var j = 0; j < elements.length - 1; j++) {
                                for (var k = j + 1; k < elements.length; k++) {
                                    if (
                                        elements[j].key === elements[k].key &&
                                        elements[j].placement ===
                                            elements[k].placement
                                    ) {
                                        throw new TypeError(
                                            'Duplicated element (' +
                                                elements[j].key +
                                                ')'
                                        );
                                    }
                                }
                            }
                        }
                    }

                    return {
                        elements: elements,
                        finishers: finishers,
                    };
                },
                fromElementDescriptor: function (element) {
                    var obj = {
                        kind: element.kind,
                        key: element.key,
                        placement: element.placement,
                        descriptor: element.descriptor,
                    };
                    var desc = {
                        value: 'Descriptor',
                        configurable: true,
                    };
                    Object.defineProperty(obj, Symbol.toStringTag, desc);
                    if (element.kind === 'field')
                        obj.initializer = element.initializer;
                    return obj;
                },
                toElementDescriptors: function (elementObjects) {
                    if (elementObjects === undefined) return;
                    return exports
                        .toArray(elementObjects)
                        .map(function (elementObject) {
                            var element = this.toElementDescriptor(
                                elementObject
                            );
                            this.disallowProperty(
                                elementObject,
                                'finisher',
                                'An element descriptor'
                            );
                            this.disallowProperty(
                                elementObject,
                                'extras',
                                'An element descriptor'
                            );
                            return element;
                        }, this);
                },
                toElementDescriptor: function (elementObject) {
                    var kind = String(elementObject.kind);

                    if (kind !== 'method' && kind !== 'field') {
                        throw new TypeError(
                            'An element descriptor\'s .kind property must be either "method" or' +
                                ' "field", but a decorator created an element descriptor with' +
                                ' .kind "' +
                                kind +
                                '"'
                        );
                    }

                    var key = exports.toPropertyKey(elementObject.key);

                    var placement = String(elementObject.placement);

                    if (
                        placement !== 'static' &&
                        placement !== 'prototype' &&
                        placement !== 'own'
                    ) {
                        throw new TypeError(
                            'An element descriptor\'s .placement property must be one of "static",' +
                                ' "prototype" or "own", but a decorator created an element descriptor' +
                                ' with .placement "' +
                                placement +
                                '"'
                        );
                    }

                    var descriptor = elementObject.descriptor;
                    this.disallowProperty(
                        elementObject,
                        'elements',
                        'An element descriptor'
                    );
                    var element = {
                        kind: kind,
                        key: key,
                        placement: placement,
                        descriptor: Object.assign({}, descriptor),
                    };

                    if (kind !== 'field') {
                        this.disallowProperty(
                            elementObject,
                            'initializer',
                            'A method descriptor'
                        );
                    } else {
                        this.disallowProperty(
                            descriptor,
                            'get',
                            'The property descriptor of a field descriptor'
                        );
                        this.disallowProperty(
                            descriptor,
                            'set',
                            'The property descriptor of a field descriptor'
                        );
                        this.disallowProperty(
                            descriptor,
                            'value',
                            'The property descriptor of a field descriptor'
                        );
                        element.initializer = elementObject.initializer;
                    }

                    return element;
                },
                toElementFinisherExtras: function (elementObject) {
                    var element = this.toElementDescriptor(elementObject);

                    var finisher = exports.optionalCallableProperty(
                        elementObject,
                        'finisher'
                    );

                    var extras = this.toElementDescriptors(
                        elementObject.extras
                    );
                    return {
                        element: element,
                        finisher: finisher,
                        extras: extras,
                    };
                },
                fromClassDescriptor: function (elements) {
                    var obj = {
                        kind: 'class',
                        elements: elements.map(
                            this.fromElementDescriptor,
                            this
                        ),
                    };
                    var desc = {
                        value: 'Descriptor',
                        configurable: true,
                    };
                    Object.defineProperty(obj, Symbol.toStringTag, desc);
                    return obj;
                },
                toClassDescriptor: function (obj) {
                    var kind = String(obj.kind);

                    if (kind !== 'class') {
                        throw new TypeError(
                            'A class descriptor\'s .kind property must be "class", but a decorator' +
                                ' created a class descriptor with .kind "' +
                                kind +
                                '"'
                        );
                    }

                    this.disallowProperty(obj, 'key', 'A class descriptor');
                    this.disallowProperty(
                        obj,
                        'placement',
                        'A class descriptor'
                    );
                    this.disallowProperty(
                        obj,
                        'descriptor',
                        'A class descriptor'
                    );
                    this.disallowProperty(
                        obj,
                        'initializer',
                        'A class descriptor'
                    );
                    this.disallowProperty(obj, 'extras', 'A class descriptor');

                    var finisher = exports.optionalCallableProperty(
                        obj,
                        'finisher'
                    );

                    var elements = this.toElementDescriptors(obj.elements);
                    return {
                        elements: elements,
                        finisher: finisher,
                    };
                },
                runClassFinishers: function (constructor, finishers) {
                    for (const finisher of finishers) {
                        var newConstructor = (0, finisher)(constructor);

                        if (newConstructor !== undefined) {
                            if (typeof newConstructor !== 'function') {
                                throw new TypeError(
                                    'Finishers must return a constructor.'
                                );
                            }

                            constructor = newConstructor;
                        }
                    }

                    return constructor;
                },
                disallowProperty: function (obj, name, objectType) {
                    if (obj[name] !== undefined) {
                        throw new TypeError(
                            objectType + " can't have a ." + name + ' property.'
                        );
                    }
                },
            };
        },
    };

    var id = 0;

    function ownKeys(object, enumerableOnly) {
        var keys = Object.keys(object);

        if (Object.getOwnPropertySymbols) {
            var symbols = Object.getOwnPropertySymbols(object);
            if (enumerableOnly)
                symbols = symbols.filter(function (sym) {
                    return Object.getOwnPropertyDescriptor(
                        object,
                        sym
                    ).enumerable;
                });
            keys.push.apply(keys, symbols);
        }

        return keys;
    }

    function set(target, property, value, receiver) {
        var base = exports.superPropBase(target, property);

        var desc;

        if (base) {
            desc = Object.getOwnPropertyDescriptor(base, property);

            if (desc.set) {
                desc.set.call(receiver, value);
                return true;
            } else if (!desc.writable) {
                return false;
            }
        }

        desc = Object.getOwnPropertyDescriptor(receiver, property);

        if (desc) {
            if (!desc.writable) {
                return false;
            }

            desc.value = value;
            Object.defineProperty(receiver, property, desc);
        } else {
            exports.defineProperty(receiver, property, value);
        }

        return true;
    }

    var exports = {
        typeof: function (obj) {
            return typeof obj;
        },
        classCallCheck: function (instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError('Cannot call a class as a function');
            }
        },
        defineProperties: function (target, props) {
            for (const descriptor of props) {
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ('value' in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        },
        createClass: function (Constructor, protoProps, staticProps) {
            if (protoProps)
                exports.defineProperties(Constructor.prototype, protoProps);
            if (staticProps) exports.defineProperties(Constructor, staticProps);
            return Constructor;
        },
        defineEnumerableProperties: function (obj, descs) {
            for (var key in descs) {
                var desc = descs[key];
                desc.configurable = desc.enumerable = true;
                if ('value' in desc) desc.writable = true;
                Object.defineProperty(obj, key, desc);
            }

            if (Object.getOwnPropertySymbols) {
                var objectSymbols = Object.getOwnPropertySymbols(descs);

                for (const sym of objectSymbols) {
                    var desc = descs[sym];
                    desc.configurable = desc.enumerable = true;
                    if ('value' in desc) desc.writable = true;
                    Object.defineProperty(obj, sym, desc);
                }
            }

            return obj;
        },
        defaults: function (obj, defaults) {
            var keys = Object.getOwnPropertyNames(defaults);

            for (const key of keys) {
                var value = Object.getOwnPropertyDescriptor(defaults, key);

                if (value && value.configurable && obj[key] === undefined) {
                    Object.defineProperty(obj, key, value);
                }
            }

            return obj;
        },
        defineProperty: function (obj, key, value) {
            if (key in obj) {
                Object.defineProperty(obj, key, {
                    value: value,
                    enumerable: true,
                    configurable: true,
                    writable: true,
                });
            } else {
                obj[key] = value;
            }

            return obj;
        },
        extends: function (target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];

                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }

            return target;
        },
        objectSpread: function (target) {
            for (var i = 1; i < arguments.length; i++) {
                var source =
                    arguments[i] != null ? new Object(arguments[i]) : {};
                var ownKeys = Object.keys(source);

                if (typeof Object.getOwnPropertySymbols === 'function') {
                    ownKeys = ownKeys.concat(
                        Object.getOwnPropertySymbols(source).filter(function (
                            sym
                        ) {
                            return Object.getOwnPropertyDescriptor(source, sym)
                                .enumerable;
                        })
                    );
                }

                ownKeys.forEach(function (key) {
                    exports.defineProperty(target, key, source[key]);
                });
            }

            return target;
        },
        objectSpread2: function (target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i] != null ? arguments[i] : {};

                if (i % 2) {
                    ownKeys(new Object(source), true).forEach(function (key) {
                        exports.defineProperty(target, key, source[key]);
                    });
                } else if (Object.getOwnPropertyDescriptors) {
                    Object.defineProperties(
                        target,
                        Object.getOwnPropertyDescriptors(source)
                    );
                } else {
                    ownKeys(new Object(source)).forEach(function (key) {
                        Object.defineProperty(
                            target,
                            key,
                            Object.getOwnPropertyDescriptor(source, key)
                        );
                    });
                }
            }

            return target;
        },
        inherits: function (subClass, superClass) {
            if (typeof superClass !== 'function' && superClass !== null) {
                throw new TypeError(
                    'Super expression must either be null or a function'
                );
            }

            subClass.prototype = Object.create(
                superClass && superClass.prototype,
                {
                    constructor: {
                        value: subClass,
                        writable: true,
                        configurable: true,
                    },
                }
            );
            if (superClass)
                subClass = exports.setPrototypeOf(subClass, superClass);
        },
        inheritsLoose: function (subClass, superClass) {
            subClass = Object.extend(subClass, superClass);
            subClass.prototype = Object.create(superClass.prototype);
            subClass.prototype.constructor = subClass;
            subClass.initialize = subClass;
        },
        getPrototypeOf: function (o) {
            var O = new Object(o);
            if (
                typeof O.constructor === 'function' &&
                O instanceof O.constructor
            ) {
                return O.constructor.prototype;
            }
            return O instanceof Object ? Object.prototype : null;
        },
        setPrototypeOf: function (o, proto) {
            function Chain(o) {
                for (var k in o) {
                    if (Object.prototype.hasOwnProperty.call(o, k)) {
                        this[k] = o[k];
                    }
                }
                Chain.prototype = null;
            }
            Chain.prototype = proto;
            return new Chain(O);
        },
        isNativeReflectConstruct: function () {
            return false;
        },
        construct: function (Parent, args, Class) {
            var a = [null];
            a.push.apply(a, args);
            var Constructor = Function.bind.apply(Parent, a);
            var instance = new Constructor();
            if (Class)
                instance = exports.setPrototypeOf(instance, Class.prototype);
            return instance;
        },
        isNativeFunction: function (fn) {
            return Function.toString.call(fn).includes('[native code]');
        },
        wrapNativeSuper: function (Klass) {
            if (Klass === null || !exports.isNativeFunction(Klass))
                return Klass;

            if (typeof Klass !== 'function') {
                throw new TypeError(
                    'Super expression must either be null or a function'
                );
            }

            function Wrapper() {
                return exports.construct(
                    Klass,
                    arguments,
                    exports.getPrototypeOf(this).constructor
                );
            }

            Wrapper.prototype = Class.create(Klass.prototype, {
                constructor: {
                    value: Wrapper,
                    enumerable: false,
                    writable: true,
                    configurable: true,
                },
            });
            return exports.setPrototypeOf(Wrapper, Klass);
        },
        instanceof: function (left, right) {
            return left instanceof right;
        },
        interopRequireDefault: function (obj) {
            return obj && obj.__esModule
                ? obj
                : {
                      default: obj,
                  };
        },
        getRequireWildcardCache: function () {
            return null;
        },
        interopRequireWildcard: function (obj) {
            if (obj && obj.__esModule) {
                return obj;
            }

            if (
                obj === null ||
                (typeof obj !== 'object' && typeof obj !== 'function')
            ) {
                return {
                    default: obj,
                };
            }

            var newObj = {};

            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.getOwnPropertyDescriptor(obj, key);

                    if (desc && (desc.get || desc.set)) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }

            newObj.default = obj;

            return newObj;
        },
        newArrowCheck: function (innerThis, boundThis) {
            if (innerThis !== boundThis) {
                throw new TypeError('Cannot instantiate an arrow function');
            }
        },
        objectDestructuringEmpty: function (obj) {
            if (obj == null)
                throw new TypeError('Cannot destructure undefined');
        },
        objectWithoutPropertiesLoose: function (source, excluded) {
            if (source == null) return {};
            var target = {};
            var sourceKeys = Object.keys(source);
            var key, i;

            for (i = 0; i < sourceKeys.length; i++) {
                key = sourceKeys[i];
                if (excluded.includes(key)) continue;
                target[key] = source[key];
            }

            return target;
        },
        objectWithoutProperties: function (source, excluded) {
            if (source == null) return {};

            return exports.objectWithoutPropertiesLoose(source, excluded);
        },
        assertThisInitialized: function (self) {
            if (self === void 0) {
                throw new ReferenceError(
                    "this hasn't been initialised - super() hasn't been called"
                );
            }

            return self;
        },
        possibleConstructorReturn: function (self, call) {
            if (
                call &&
                (typeof call === 'object' || typeof call === 'function')
            ) {
                return call;
            }

            return exports.assertThisInitialized(self);
        },
        createSuper: function (Derived) {
            var Super = exports.getPrototypeOf(Derived);
            var result = Reflect.apply(Super, this, arguments);

            return exports.possibleConstructorReturn(this, result);
        },
        superPropBase: function (object, property) {
            while (!Object.prototype.hasOwnProperty.call(object, property)) {
                object = exports.getPrototypeOf(object);
                if (object === null) break;
            }

            return object;
        },
        get: function (target, property, receiver) {
            var base = exports.superPropBase(target, property);

            if (!base) return;
            var desc = Object.getOwnPropertyDescriptor(base, property);

            if (desc.get) {
                return desc.get.call(receiver);
            }

            return desc.value;
        },
        set: function (target, property, value, receiver, isStrict) {
            var s = set(target, property, value, receiver || target);

            if (!s && isStrict) {
                throw new Error('failed to set property');
            }

            return value;
        },
        taggedTemplateLiteral: function (strings, raw) {
            if (!raw) {
                raw = strings.slice(0);
            }

            return Object.freeze(
                Object.defineProperties(strings, {
                    raw: {
                        value: Object.freeze(raw),
                    },
                })
            );
        },
        taggedTemplateLiteralLoose: function (strings, raw) {
            if (!raw) {
                raw = strings.slice(0);
            }

            strings.raw = raw;
            return strings;
        },
        readOnlyError: function (name) {
            throw new Error('"' + name + '" is read-only');
        },
        classNameTDZError: function (name) {
            throw new Error(
                'Class "' +
                    name +
                    '" cannot be referenced in computed property keys.'
            );
        },
        temporalUndefined: function () {},
        tdz: function (name) {
            throw new ReferenceError(
                name + ' is not defined - temporal dead zone'
            );
        },
        temporalRef: function (val, name) {
            return val === exports.temporalUndefined ? exports.tdz(name) : val;
        },
        slicedToArray: function (arr, i) {
            return (
                exports.arrayWithHoles(arr) ||
                exports.iterableToArrayLimit(arr, i) ||
                exports.unsupportedIterableToArray(arr, i) ||
                exports.nonIterableRest()
            );
        },
        slicedToArrayLoose: function (arr, i) {
            return (
                exports.arrayWithHoles(arr) ||
                exports.iterableToArrayLimitLoose(arr, i) ||
                exports.unsupportedIterableToArray(arr, i) ||
                exports.nonIterableRest()
            );
        },
        toArray: function (arr) {
            return (
                exports.arrayWithHoles(arr) ||
                exports.iterableToArray(arr) ||
                exports.unsupportedIterableToArray(arr) ||
                exports.nonIterableRest()
            );
        },
        toConsumableArray: function (arr) {
            return (
                exports.arrayWithoutHoles(arr) ||
                exports.iterableToArray(arr) ||
                exports.unsupportedIterableToArray(arr) ||
                exports.nonIterableSpread()
            );
        },
        arrayWithoutHoles: function (arr) {
            if (Array.isArray(arr)) return exports.arrayLikeToArray(arr);
        },
        arrayWithHoles: function (arr) {
            if (Array.isArray(arr)) return arr;
        },
        maybeArrayLike: function (next, arr, i) {
            if (arr && !Array.isArray(arr) && typeof arr.length === 'number') {
                var len = arr.length;
                return exports.arrayLikeToArray(
                    arr,
                    i !== void 0 && i < len ? i : len
                );
            }

            return next(arr, i);
        },
        iterableToArray: function (iter) {},
        iterableToArrayLimit: function (arr, i) {},
        iterableToArrayLimitLoose: function (arr, i) {},
        unsupportedIterableToArray: function (o, minLen) {
            if (!o) return;
            if (typeof o === 'string')
                return exports.arrayLikeToArray(o, minLen);
            var n = Object.prototype.toString.call(o).slice(8, -1);
            if (n === 'Object' && o.constructor) n = o.constructor.name;
            if (
                n === 'Arguments' ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
            )
                return exports.arrayLikeToArray(o, minLen);
        },
        arrayLikeToArray: function (arr, len) {
            if (len == null || len > arr.length) len = arr.length;

            for (var i = 0, arr2 = new Array(len); i < len; i++)
                arr2[i] = arr[i];

            return arr2;
        },
        nonIterableSpread: function () {
            throw new TypeError(
                'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
            );
        },
        nonIterableRest: function () {
            throw new TypeError(
                'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
            );
        },
        createForOfIteratorHelper: function (o, allowArrayLike) {
            var it;

            if (
                Array.isArray(o) ||
                (it = exports.unsupportedIterableToArray(o)) ||
                (allowArrayLike && o && typeof o.length === 'number')
            ) {
                if (it) o = it;
                var i = 0;

                var F = function () {};

                return {
                    s: F,
                    n: function () {
                        if (i >= o.length)
                            return {
                                done: true,
                            };
                        return {
                            done: false,
                            value: o[i++],
                        };
                    },
                    e: function (e) {
                        throw e;
                    },
                    f: F,
                };
            }

            throw new TypeError(
                'Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
            );
        },
        createForOfIteratorHelperLoose: function (o, allowArrayLike) {
            var it;

            if (
                Array.isArray(o) ||
                (it = exports.unsupportedIterableToArray(o)) ||
                (allowArrayLike && o && typeof o.length === 'number')
            ) {
                if (it) o = it;
                var i = 0;
                return function () {
                    if (i >= o.length)
                        return {
                            done: true,
                        };
                    return {
                        done: false,
                        value: o[i++],
                    };
                };
            }

            throw new TypeError(
                'Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
            );
        },
        toPrimitive: function (input, hint) {
            if (typeof input !== 'object' || input === null) return input;

            return (hint === 'string' ? String : Number)(input);
        },
        toPropertyKey: function (arg) {
            var key = exports.toPrimitive(arg, 'string');

            return String(key);
        },
        initializerWarningHelper: function (descriptor, context) {
            throw new Error(
                'Decorating class property failed. Please ensure that proposal-class-properties is enabled and runs after the decorators transform.'
            );
        },
        initializerDefineProperty: function (
            target,
            property,
            descriptor,
            context
        ) {
            if (!descriptor) return;
            Object.defineProperty(target, property, {
                enumerable: descriptor.enumerable,
                configurable: descriptor.configurable,
                writable: descriptor.writable,
                value: descriptor.initializer
                    ? descriptor.initializer.call(context)
                    : void 0,
            });
        },
        applyDecoratedDescriptor: function (
            target,
            property,
            decorators,
            descriptor,
            context
        ) {
            var desc = {};
            Object.keys(descriptor).forEach(function (key) {
                desc[key] = descriptor[key];
            });
            desc.enumerable = !!desc.enumerable;
            desc.configurable = !!desc.configurable;

            if ('value' in desc || desc.initializer) {
                desc.writable = true;
            }

            desc = decorators
                .slice()
                .reverse()
                .reduce(function (desc, decorator) {
                    return decorator(target, property, desc) || desc;
                }, desc);

            if (context && desc.initializer !== void 0) {
                desc.value = desc.initializer
                    ? desc.initializer.call(context)
                    : void 0;
                desc.initializer = undefined;
            }

            if (desc.initializer === void 0) {
                Object.defineProperty(target, property, desc);
                desc = null;
            }

            return desc;
        },
        classPrivateFieldLooseKey: function (name) {
            return '__private_' + id++ + '_' + name;
        },
        classPrivateFieldLooseBase: function (receiver, privateKey) {
            if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) {
                throw new TypeError(
                    'attempted to use private field on non-instance'
                );
            }

            return receiver;
        },
        classPrivateFieldGet: function (receiver, privateMap) {
            var descriptor = privateMap.get(receiver);

            if (!descriptor) {
                throw new TypeError(
                    'attempted to get private field on non-instance'
                );
            }

            if (descriptor.get) {
                return descriptor.get.call(receiver);
            }

            return descriptor.value;
        },
        classPrivateFieldSet: function (receiver, privateMap, value) {
            var descriptor = privateMap.get(receiver);

            if (!descriptor) {
                throw new TypeError(
                    'attempted to set private field on non-instance'
                );
            }

            if (descriptor.set) {
                descriptor.set.call(receiver, value);
            } else {
                if (!descriptor.writable) {
                    throw new TypeError(
                        'attempted to set read only private field'
                    );
                }

                descriptor.value = value;
            }

            return value;
        },
        classPrivateFieldDestructureSet: function (receiver, privateMap) {
            if (!privateMap.has(receiver)) {
                throw new TypeError(
                    'attempted to set private field on non-instance'
                );
            }

            var descriptor = privateMap.get(receiver);

            if (descriptor.set) {
                if (!('__destrObj' in descriptor)) {
                    descriptor.__destrObj = {
                        set value(v) {
                            descriptor.set.call(receiver, v);
                        },
                    };
                }

                return descriptor.__destrObj;
            } else {
                if (!descriptor.writable) {
                    throw new TypeError(
                        'attempted to set read only private field'
                    );
                }

                return descriptor;
            }
        },
        classStaticPrivateFieldSpecGet: function (
            receiver,
            classConstructor,
            descriptor
        ) {
            if (receiver !== classConstructor) {
                throw new TypeError(
                    'Private static access of wrong provenance'
                );
            }

            if (descriptor.get) {
                return descriptor.get.call(receiver);
            }

            return descriptor.value;
        },
        classStaticPrivateFieldSpecSet: function (
            receiver,
            classConstructor,
            descriptor,
            value
        ) {
            if (receiver !== classConstructor) {
                throw new TypeError(
                    'Private static access of wrong provenance'
                );
            }

            if (descriptor.set) {
                descriptor.set.call(receiver, value);
            } else {
                if (!descriptor.writable) {
                    throw new TypeError(
                        'attempted to set read only private field'
                    );
                }

                descriptor.value = value;
            }

            return value;
        },
        classStaticPrivateMethodGet: function (
            receiver,
            classConstructor,
            method
        ) {
            if (receiver !== classConstructor) {
                throw new TypeError(
                    'Private static access of wrong provenance'
                );
            }

            return method;
        },
        classStaticPrivateMethodSet: function () {
            throw new TypeError(
                'attempted to set read only static private field'
            );
        },
        decorate: function (decorators, factory, superClass, mixins) {
            var api = exports.getDecoratorsApi();

            if (mixins) {
                for (const mixin of mixins) {
                    api = mixin(api);
                }
            }

            var r = factory(function initialize(O) {
                api.initializeInstanceElements(O, decorated.elements);
            }, superClass);
            var decorated = api.decorateClass(
                exports.coalesceClassElements(
                    r.d.map(exports.createElementDescriptor)
                ),
                decorators
            );
            api.initializeClassElements(r.F, decorated.elements);
            return api.runClassFinishers(r.F, decorated.finishers);
        },
        getDecoratorsApi: function () {
            // This is apparently a huuuuuge call, so it's hidden behind a getter and cached afterwards
            if (!decoratorsApi.cache) decoratorsApi.cache = decoratorsApi.api;

            return decoratorsApi.cache;
        },
        createElementDescriptor: function (def) {
            var key = exports.toPropertyKey(def.key);

            var descriptor;

            if (def.kind === 'method') {
                descriptor = {
                    value: def.value,
                    writable: true,
                    configurable: true,
                    enumerable: false,
                };
            } else if (def.kind === 'get') {
                descriptor = {
                    get: def.value,
                    configurable: true,
                    enumerable: false,
                };
            } else if (def.kind === 'set') {
                descriptor = {
                    set: def.value,
                    configurable: true,
                    enumerable: false,
                };
            } else if (def.kind === 'field') {
                descriptor = {
                    configurable: true,
                    writable: true,
                    enumerable: true,
                };
            }

            var element = {
                kind: def.kind === 'field' ? 'field' : 'method',
                key: key,
                placement: def.static
                    ? 'static'
                    : def.kind === 'field'
                    ? 'own'
                    : 'prototype',
                descriptor: descriptor,
            };
            if (def.decorators) element.decorators = def.decorators;
            if (def.kind === 'field') element.initializer = def.value;
            return element;
        },
        coalesceGetterSetter: function (element, other) {
            if (element.descriptor.get !== undefined) {
                other.descriptor.get = element.descriptor.get;
            } else {
                other.descriptor.set = element.descriptor.set;
            }
        },
        coalesceClassElements: function (elements) {
            var newElements = [];

            var isSameElement = function (other) {
                return (
                    other.kind === 'method' &&
                    other.key === element.key &&
                    other.placement === element.placement
                );
            };

            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                var other;

                if (
                    element.kind === 'method' &&
                    (other = newElements.find(isSameElement))
                ) {
                    if (
                        exports.isDataDescriptor(element.descriptor) ||
                        exports.isDataDescriptor(other.descriptor)
                    ) {
                        if (
                            exports.hasDecorators(element) ||
                            exports.hasDecorators(other)
                        ) {
                            throw new ReferenceError(
                                'Duplicated methods (' +
                                    element.key +
                                    ") can't be decorated."
                            );
                        }

                        other.descriptor = element.descriptor;
                    } else {
                        if (exports.hasDecorators(element)) {
                            if (exports.hasDecorators(other)) {
                                throw new ReferenceError(
                                    "Decorators can't be placed on different accessors with for " +
                                        'the same property (' +
                                        element.key +
                                        ').'
                                );
                            }

                            other.decorators = element.decorators;
                        }

                        exports.coalesceGetterSetter(element, other);
                    }
                } else {
                    newElements.push(element);
                }
            }

            return newElements;
        },
        hasDecorators: function (element) {
            return element.decorators && element.decorators.length;
        },
        isDataDescriptor: function (desc) {
            return (
                desc !== undefined &&
                !(desc.value === undefined && desc.writable === undefined)
            );
        },
        optionalCallableProperty: function (obj, name) {
            var value = obj[name];

            if (value !== undefined && typeof value !== 'function') {
                throw new TypeError("Expected '" + name + "' to be a function");
            }

            return value;
        },
        classPrivateMethodGet: function (receiver, privateSet, fn) {
            if (!privateSet.has(receiver)) {
                throw new TypeError(
                    'attempted to get private field on non-instance'
                );
            }

            return fn;
        },
        classPrivateMethodSet: function () {
            throw new TypeError('attempted to reassign private method');
        },
    };

    return exports;
})();
