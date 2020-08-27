// Manually add this as globally accessible script include and set the name using the 'babelHelperName' configuration property
// The script MUST be saved as part of a Scoped Application, otherwise Scoped Scripts will fail when calling these helpers

// If using decorators, babelHelpers_decoratorsApi.script.js must also be uploaded to the same scoped application

/* eslint-disable */
var babelHelpers = (function() {
	var id = 0;

	function ownKeys(object, enumerableOnly) {
		var keys = Object.keys(object);

		if (Object.getOwnPropertySymbols) {
			var symbols = Object.getOwnPropertySymbols(object);
			if (enumerableOnly) {
				symbols = symbols.filter(function(sym) {
					return Object.getOwnPropertyDescriptor(object, sym).enumerable;
				});
			}
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
			if (!desc.writable)
				return false;

			desc.value = value;
			Object.defineProperty(receiver, property, desc);
		} else {
			exports.defineProperty(receiver, property, value);
		}

		return true;
	}

	var exports = {
		typeof: function(obj) {
			return typeof obj;
		},
		classCallCheck: function(instance, Constructor) {
			if (!(instance instanceof Constructor))
				throw new TypeError('Cannot call a class as a function');
		},
		defineProperties: function(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ('value' in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		},
		createClass: function(Constructor, protoProps, staticProps) {
			if (protoProps) exports.defineProperties(Constructor.prototype, protoProps);
			if (staticProps) exports.defineProperties(Constructor, staticProps);
			return Constructor;
		},
		defineEnumerableProperties: function(obj, descs) {
			for (var key in descs) {
				var desc = descs[key];
				desc.configurable = desc.enumerable = true;
				if ('value' in desc) desc.writable = true;
				Object.defineProperty(obj, key, desc);
			}

			if (Object.getOwnPropertySymbols) {
				var objectSymbols = Object.getOwnPropertySymbols(descs);

				for (var i = 0; i < objectSymbols.length; i++) {
					var sym = objectSymbols[i];
					var desc = descs[sym];
					desc.configurable = desc.enumerable = true;
					if ('value' in desc) desc.writable = true;
					Object.defineProperty(obj, sym, desc);
				}
			}

			return obj;
		},
		defaults: function(obj, defaults) {
			var keys = Object.getOwnPropertyNames(defaults);

			for (var i = 0; i < keys.length; i++) {
				var key = keys[i];
				var value = Object.getOwnPropertyDescriptor(defaults, key);

				if (value && value.configurable && obj[key] === undefined)
					Object.defineProperty(obj, key, value);
			}

			return obj;
		},
		defineProperty: function(obj, key, value) {
			if (key in obj) {
				Object.defineProperty(obj, key, {
					value: value,
					enumerable: true,
					configurable: true,
					writable: true
				});
			} else {
				obj[key] = value;
			}

			return obj;
		},
		extends: function(target) {
			for (var i = 1; i < arguments.length; i++) {
				var source = arguments[i];

				for (var key in source) {
					if (Object.prototype.hasOwnProperty.call(source, key))
						target[key] = source[key];
				}
			}

			return target;
		},
		objectSpread: function(target) {
			for (var i = 1; i < arguments.length; i++) {
				var source = arguments[i] != null ? Object(arguments[i]) : {};
				var ownKeys = Object.keys(source);

				if (typeof Object.getOwnPropertySymbols === 'function') {
					ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
						return Object.getOwnPropertyDescriptor(source, sym).enumerable;
					}));
				}

				ownKeys.forEach(function(key) {
					exports.defineProperty(target, key, source[key]);
				});
			}

			return target;
		},
		objectSpread2: function(target) {
			for (var i = 1; i < arguments.length; i++) {
				var source = arguments[i] != null ? arguments[i] : {};

				if (i % 2) {
					ownKeys(Object(source), true).forEach(function(key) {
						exports.defineProperty(target, key, source[key]);
					});
				} else if (Object.getOwnPropertyDescriptors) {
					Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
				} else {
					ownKeys(Object(source)).forEach(function(key) {
						Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
					});
				}
			}

			return target;
		},
		inherits: function(subClass, superClass) {
			if (typeof superClass !== 'function' && superClass !== null)
				throw new TypeError('Super expression must either be null or a function');

			if (superClass) Object.extend(subClass, superClass);
			subClass.prototype = Object.create(superClass && superClass.prototype, {
				constructor: {
					value: subClass,
					enumerable: false,
					writable: true,
					configurable: true
				}
			});
			subClass.initialize = subClass;
		},
		inheritsLoose: function(subClass, superClass) {
			if (superClass) Object.extend(subClass, superClass);
			subClass.prototype = Object.create(superClass && superClass.prototype);
			subClass.prototype.constructor = subClass;
			subClass.initialize = subClass;
		},
		getPrototypeOf: function(o) {
			var O = Object(o);
			if (typeof O.constructor == 'function' && O instanceof O.constructor)
				return O.constructor.prototype;

			return O instanceof Object ? Object.prototype : null;
		},
		setPrototypeOf: function(O, proto) {
			/**
			 * @param o
			 */
			function Chain(o) {
				for (var k in o) {
					if (Object.prototype.hasOwnProperty.call(o, k))
						this[k] = o[k];
				}
				Chain.prototype = null;
			}
			Chain.prototype = proto;
			return new Chain(O);
		},
		isNativeReflectConstruct: function() {
			return false;
		},
		construct: function(Parent, args, Klass) {
			var a = [null];
			a.push.apply(a, args);
			var Constructor = Function.bind.apply(Parent, a);
			var instance = new Constructor();
			if (Klass) instance = exports.setPrototypeOf(instance, Klass.prototype);
			return instance;
		},
		isNativeFunction: function(fn) {
			return Function.toString.call(fn).indexOf('[native code') !== -1;
		},
		wrapNativeSuper: function(Klass) {
			if (Klass === null || !exports.isNativeFunction(Klass)) return Klass;

			if (typeof Klass !== 'function')
				throw new TypeError('Super expression must either be null or a function');

			function Wrapper() {
				return exports.construct(Klass, arguments, exports.getPrototypeOf(this).constructor);
			}

			Object.extend(Wrapper, Klass);
			Wrapper.prototype = null;

			Wrapper.prototype = Object.create(Klass.prototype, {
				constructor: {
					value: Wrapper,
					enumerable: false,
					writable: true,
					configurable: true
				}
			});

			return Wrapper;
		},
		instanceof: function(left, right) {
			return left instanceof right;
		},
		interopRequireDefault: function(obj) {
			return obj && obj.__esModule ? obj : {
				default: obj
			};
		},
		getRequireWildcardCache: function() {
			return null;
		},
		interopRequireWildcard: function(obj) {
			if (obj && obj.__esModule)
				return obj;

			if (obj === null || typeof obj !== 'object' && typeof obj !== 'function') {
				return {
					default: obj
				};
			}

			var newObj = {};

			for (var key in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, key)) {
					var desc = Object.getOwnPropertyDescriptor(obj, key);

					if (desc && (desc.get || desc.set))
						Object.defineProperty(newObj, key, desc);
					else
						newObj[key] = obj[key];
				}
			}

			newObj.default = obj;

			return newObj;
		},
		newArrowCheck: function(innerThis, boundThis) {
			if (innerThis !== boundThis)
				throw new TypeError('Cannot instantiate an arrow function');
		},
		objectDestructuringEmpty: function(obj) {
			if (obj == null) throw new TypeError('Cannot destructure undefined');
		},
		objectWithoutPropertiesLoose: function(source, excluded) {
			if (source == null) return {};
			var target = {};
			var sourceKeys = Object.keys(source);
			var key, i;

			for (i = 0; i < sourceKeys.length; i++) {
				key = sourceKeys[i];
				if (excluded.indexOf(key) >= 0) continue;
				target[key] = source[key];
			}

			return target;
		},
		objectWithoutProperties: function(source, excluded) {
			if (source == null) return {};

			return exports.objectWithoutPropertiesLoose(source, excluded);
		},
		assertThisInitialized: function(self) {
			if (self === void 0)
				throw new ReferenceError("this hasn't been initialised - super() hasn't been called");

			return self;
		},
		possibleConstructorReturn: function(self, call) {
			if (call && (typeof call === 'object' || typeof call === 'function'))
				return call;

			return exports.assertThisInitialized(self);
		},
		createSuper: function(Derived) {
			var Super = exports.getPrototypeOf(Derived);
			var result = Super.apply(this, arguments);

			return exports.possibleConstructorReturn(this, result);
		},
		superPropBase: function(object, property) {
			while (!Object.prototype.hasOwnProperty.call(object, property)) {
				object = exports.getPrototypeOf(object);
				if (object === null) break;
			}

			return object;
		},
		get: function(target, property, receiver) {
			var base = exports.superPropBase(target, property);

			if (!base) return;
			var desc = Object.getOwnPropertyDescriptor(base, property);

			if (desc.get)
				return desc.get.call(receiver);

			return desc.value;
		},
		set: function(target, property, value, receiver, isStrict) {
			var s = set(target, property, value, receiver || target);

			if (!s && isStrict)
				throw new Error('failed to set property');

			return value;
		},
		taggedTemplateLiteral: function(strings, raw) {
			if (!raw)
				raw = strings.slice(0);

			return Object.freeze(Object.defineProperties(strings, {
				raw: {
					value: Object.freeze(raw)
				}
			}));
		},
		taggedTemplateLiteralLoose: function(strings, raw) {
			if (!raw)
				raw = strings.slice(0);

			strings.raw = raw;
			return strings;
		},
		readOnlyError: function(name) {
			throw new Error('"' + name + '" is read-only');
		},
		classNameTDZError: function(name) {
			throw new Error('Class "' + name + '" cannot be referenced in computed property keys.');
		},
		temporalUndefined: function() {},
		tdz: function(name) {
			throw new ReferenceError(name + ' is not defined - temporal dead zone');
		},
		temporalRef: function(val, name) {
			return val === exports.temporalUndefined ? exports.tdz(name) : val;
		},
		slicedToArray: function(arr, i) {
			return exports.arrayWithHoles(arr) || exports.iterableToArrayLimit(arr, i) || exports.unsupportedIterableToArray(arr, i) || exports.nonIterableRest();
		},
		slicedToArrayLoose: function(arr, i) {
			return exports.arrayWithHoles(arr) || exports.iterableToArrayLimitLoose(arr, i) || exports.unsupportedIterableToArray(arr, i) || exports.nonIterableRest();
		},
		toArray: function(arr) {
			return exports.arrayWithHoles(arr) || exports.iterableToArray(arr) || exports.unsupportedIterableToArray(arr) || exports.nonIterableRest();
		},
		toConsumableArray: function(arr) {
			return exports.arrayWithoutHoles(arr) || exports.iterableToArray(arr) || exports.unsupportedIterableToArray(arr) || exports.nonIterableSpread();
		},
		arrayWithoutHoles: function(arr) {
			if (Array.isArray(arr)) return exports.arrayLikeToArray(arr);
		},
		arrayWithHoles: function(arr) {
			if (Array.isArray(arr)) return arr;
		},
		maybeArrayLike: function(next, arr, i) {
			if (arr && !Array.isArray(arr) && typeof arr.length === 'number') {
				var len = arr.length;
				return exports.arrayLikeToArray(arr, i !== void 0 && i < len ? i : len);
			}

			return next(arr, i);
		},
		iterableToArray: function(iter) {},
		iterableToArrayLimit: function(arr, i) {},
		iterableToArrayLimitLoose: function(arr, i) {},
		unsupportedIterableToArray: function(o, minLen) {
			if (!o) return;
			if (typeof o === 'string') return exports.arrayLikeToArray(o, minLen);
			var n = Object.prototype.toString.call(o).slice(8, -1);
			if (n === 'Object' && o.constructor) n = o.constructor.name;
			if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return exports.arrayLikeToArray(o, minLen);
		},
		arrayLikeToArray: function(arr, len) {
			if (len == null || len > arr.length) len = arr.length;

			for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

			return arr2;
		},
		nonIterableSpread: function() {
			throw new TypeError('Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.');
		},
		nonIterableRest: function() {
			throw new TypeError('Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.');
		},
		createForOfIteratorHelper: function(o, allowArrayLike) {
			var it;

			if (Array.isArray(o) || (it = exports.unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === 'number') {
				if (it) o = it;
				var i = 0;

				var F = function() {};

				return {
					s: F,
					n: function() {
						if (i >= o.length) {
							return {
								done: true
							};
						}
						return {
							done: false,
							value: o[i++]
						};
					},
					e: function(e) {
						throw e;
					},
					f: F
				};
			}

			throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.');
		},
		createForOfIteratorHelperLoose: function(o, allowArrayLike) {
			var it;

			if (Array.isArray(o) || (it = exports.unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === 'number') {
				if (it) o = it;
				var i = 0;
				return function() {
					if (i >= o.length) {
						return {
							done: true
						};
					}
					return {
						done: false,
						value: o[i++]
					};
				};
			}

			throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.');
		},
		toPrimitive: function(input, hint) {
			if (typeof input !== 'object' || input === null) return input;

			return (hint === 'string' ? String : Number)(input);
		},
		toPropertyKey: function(arg) {
			var key = exports.toPrimitive(arg, 'string');

			return String(key);
		},
		initializerWarningHelper: function(descriptor, context) {
			throw new Error('Decorating class property failed. Please ensure that proposal-class-properties is enabled and runs after the decorators transform.');
		},
		initializerDefineProperty: function(target, property, descriptor, context) {
			if (!descriptor) return;
			Object.defineProperty(target, property, {
				enumerable: descriptor.enumerable,
				configurable: descriptor.configurable,
				writable: descriptor.writable,
				value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
			});
		},
		applyDecoratedDescriptor: function(target, property, decorators, descriptor, context) {
			var desc = {};
			Object.keys(descriptor).forEach(function(key) {
				desc[key] = descriptor[key];
			});
			desc.enumerable = !!desc.enumerable;
			desc.configurable = !!desc.configurable;

			if ('value' in desc || desc.initializer)
				desc.writable = true;

			desc = decorators.slice().reverse().reduce(function(desc, decorator) {
				return decorator(target, property, desc) || desc;
			}, desc);

			if (context && desc.initializer !== void 0) {
				desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
				desc.initializer = undefined;
			}

			if (desc.initializer === void 0) {
				Object.defineProperty(target, property, desc);
				desc = null;
			}

			return desc;
		},
		classPrivateFieldLooseKey: function(name) {
			return '__private_' + id++ + '_' + name;
		},
		classPrivateFieldLooseBase: function(receiver, privateKey) {
			if (!Object.prototype.hasOwnProperty.call(receiver, privateKey))
				throw new TypeError('attempted to use private field on non-instance');

			return receiver;
		},
		classPrivateFieldGet: function(receiver, privateMap) {
			var descriptor = privateMap.get(receiver);

			if (!descriptor)
				throw new TypeError('attempted to get private field on non-instance');

			if (descriptor.get)
				return descriptor.get.call(receiver);

			return descriptor.value;
		},
		classPrivateFieldSet: function(receiver, privateMap, value) {
			var descriptor = privateMap.get(receiver);

			if (!descriptor)
				throw new TypeError('attempted to set private field on non-instance');

			if (descriptor.set) {
				descriptor.set.call(receiver, value);
			} else {
				if (!descriptor.writable)
					throw new TypeError('attempted to set read only private field');

				descriptor.value = value;
			}

			return value;
		},
		classPrivateFieldDestructureSet: function(receiver, privateMap) {
			if (!privateMap.has(receiver))
				throw new TypeError('attempted to set private field on non-instance');

			var descriptor = privateMap.get(receiver);

			if (descriptor.set) {
				if (!('__destrObj' in descriptor)) {
					descriptor.__destrObj = {
						set value(v) {
							descriptor.set.call(receiver, v);
						}

					};
				}

				return descriptor.__destrObj;
			} else {
				if (!descriptor.writable)
					throw new TypeError('attempted to set read only private field');

				return descriptor;
			}
		},
		classStaticPrivateFieldSpecGet: function(receiver, classConstructor, descriptor) {
			if (receiver !== classConstructor)
				throw new TypeError('Private static access of wrong provenance');

			if (descriptor.get)
				return descriptor.get.call(receiver);

			return descriptor.value;
		},
		classStaticPrivateFieldSpecSet: function(receiver, classConstructor, descriptor, value) {
			if (receiver !== classConstructor)
				throw new TypeError('Private static access of wrong provenance');

			if (descriptor.set) {
				descriptor.set.call(receiver, value);
			} else {
				if (!descriptor.writable)
					throw new TypeError('attempted to set read only private field');

				descriptor.value = value;
			}

			return value;
		},
		classStaticPrivateMethodGet: function(receiver, classConstructor, method) {
			if (receiver !== classConstructor)
				throw new TypeError('Private static access of wrong provenance');

			return method;
		},
		classStaticPrivateMethodSet: function() {
			throw new TypeError('attempted to set read only static private field');
		},
		decorate: function(decorators, factory, superClass, mixins) {
			var api = exports.getDecoratorsApi();

			if (mixins) {
				for (var i = 0; i < mixins.length; i++)
					api = mixins[i](api);
			}

			var r = factory(function initialize(O) {
				api.initializeInstanceElements(O, decorated.elements);
			}, superClass);
			var decorated = api.decorateClass(exports.coalesceClassElements(r.d.map(exports.createElementDescriptor)), decorators);
			api.initializeClassElements(r.F, decorated.elements);
			return api.runClassFinishers(r.F, decorated.finishers);
		},
		getDecoratorsApi: function() {
			return babelHelpers_decoratorsApi;
		},
		createElementDescriptor: function(def) {
			var key = exports.toPropertyKey(def.key);

			var descriptor;

			if (def.kind === 'method') {
				descriptor = {
					value: def.value,
					writable: true,
					configurable: true,
					enumerable: false
				};
			} else if (def.kind === 'get') {
				descriptor = {
					get: def.value,
					configurable: true,
					enumerable: false
				};
			} else if (def.kind === 'set') {
				descriptor = {
					set: def.value,
					configurable: true,
					enumerable: false
				};
			} else if (def.kind === 'field') {
				descriptor = {
					configurable: true,
					writable: true,
					enumerable: true
				};
			}

			var element = {
				kind: def.kind === 'field' ? 'field' : 'method',
				key: key,
				placement: def.static ? 'static' : def.kind === 'field' ? 'own' : 'prototype',
				descriptor: descriptor
			};
			if (def.decorators) element.decorators = def.decorators;
			if (def.kind === 'field') element.initializer = def.value;
			return element;
		},
		coalesceGetterSetter: function(element, other) {
			if (element.descriptor.get !== undefined)
				other.descriptor.get = element.descriptor.get;
			else
				other.descriptor.set = element.descriptor.set;
		},
		coalesceClassElements: function(elements) {
			var newElements = [];

			var isSameElement = function(other) {
				return other.kind === 'method' && other.key === element.key && other.placement === element.placement;
			};

			for (var i = 0; i < elements.length; i++) {
				var element = elements[i];
				var other;

				if (element.kind === 'method' && (other = newElements.find(isSameElement))) {
					if (exports.isDataDescriptor(element.descriptor) || exports.isDataDescriptor(other.descriptor)) {
						if (exports.hasDecorators(element) || exports.hasDecorators(other))
							throw new ReferenceError('Duplicated methods (' + element.key + ") can't be decorated.");

						other.descriptor = element.descriptor;
					} else {
						if (exports.hasDecorators(element)) {
							if (exports.hasDecorators(other))
								throw new ReferenceError("Decorators can't be placed on different accessors with for " + 'the same property (' + element.key + ').');

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
		hasDecorators: function(element) {
			return element.decorators && element.decorators.length;
		},
		isDataDescriptor: function(desc) {
			return desc !== undefined && !(desc.value === undefined && desc.writable === undefined);
		},
		optionalCallableProperty: function(obj, name) {
			var value = obj[name];

			if (value !== undefined && typeof value !== 'function')
				throw new TypeError("Expected '" + name + "' to be a function");

			return value;
		},
		classPrivateMethodGet: function(receiver, privateSet, fn) {
			if (!privateSet.has(receiver))
				throw new TypeError('attempted to get private field on non-instance');

			return fn;
		},
		classPrivateMethodSet: function() {
			throw new TypeError('attempted to reassign private method');
		}
	};

	return exports;
})();
