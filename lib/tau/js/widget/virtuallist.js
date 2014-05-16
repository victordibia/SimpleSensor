/*
  * Copyright (c) 2013 Samsung Electronics Co., Ltd
  *
  * Licensed under the Flora License, Version 1.1 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://floralicense.org/license/
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

/*global window, define */
(function (ej, window) {
	
				/** @namespace tau */
			var orgTau = window.tau,
				tau = {};
			window.tau = tau;

			tau.noConflict = function () {
				var newTau = window.tau;
				window.tau = orgTau;
				return newTau;
			};
			}(window.ej, window));

/*global window, console, define */
/** @namespace ej */
(function (window) {
	
			var idCounter = 0,
			idNumberCounter = 0,
			currentDate = (new Date()).getTime(),
			slice = [].slice,
			/**
			* Ej core namespace
			* @class ej
			*/
			ej = {
				/**
				* Return unique id
				* @method getUniqueId
				* @static
				* @return {string}
				* @memberOf ej
				*/
				getUniqueId: function () {
					var uniqueId = "ej-" + idCounter + "-" + currentDate;
					idCounter += 1;
					return uniqueId;
				},

				/**
				* Return unique id
				* @method getNumberUniqueId
				* @static
				* @return {number}
				* @memberOf ej
				*/
				getNumberUniqueId: function () {
					var uniqueId = idNumberCounter;
					idNumberCounter += 1;
					return uniqueId;
				},

				/**
				* logs supplied messages/arguments
				* @method log
				* @static
				* @param {...*} argument
				* @memberOf ej
				*/
				log: function () {
					var args = slice.call(arguments),
						dateNow = new Date();
					args.unshift('[ej][' + dateNow.toLocaleString() + ']');
					if (console) {
						console.log.apply(console, args);
					}
				},

				/**
				* logs supplied messages/arguments ad marks it as warning
				* @method warn
				* @static
				* @param {...*} argument
				* @memberOf ej
				*/
				warn: function () {
					var args = slice.call(arguments),
						dateNow = new Date();
					args.unshift('[ej][' + dateNow.toLocaleString() + ']');
					if (console) {
						console.warn.apply(console, args);
					}
				},

				/**
				* logs supplied messages/arguments and marks it as error
				* @method error
				* @static
				* @param {...*} argument
				* @memberOf ej
				*/
				error: function () {
					var args = slice.call(arguments),
						dateNow = new Date();
					args.unshift('[ej][' + dateNow.toLocaleString() + ']');
					if (console) {
						console.error.apply(console, args);
					}
				},

				/**
				* get from ejConfig
				* @method get
				* @param {string} key
				* @param {Mixed} defaultValue
				* @return {Mixed}
				* @static
				* @memberOf ej
				*/
				get: function (key, defaultValue) {
					if (typeof window.ejConfig === "object") {
						return window.ejConfig[key] !== undefined ? window.ejConfig[key] : defaultValue;
					}
					return defaultValue;
				},

				/**
				* set in ejConfig
				* @method set
				* @param {string} key
				* @param {Mixed} value
				* @return {boolean}
				* @static
				* @memberOf ej
				*/
				set: function (key, value) {
					if (typeof window.ejConfig === "object") {
						window.ejConfig[key] = value;
						return true;
					}
					return false;
				},

				getFrameworkPath : function () {
					var scripts = document.getElementsByTagName('script'),
						countScripts = scripts.length,
						i,
						url,
						arrayUrl,
						count;
					for (i = 0; i < countScripts; i++) {
						url = scripts[i].src;
						arrayUrl = url.split('/');
						count = arrayUrl.length;
						if (arrayUrl[count - 1] === 'ej.js' || arrayUrl[count - 1] === 'ej.min.js') {
							return arrayUrl.slice(0, count - 1).join('/');
						}
					}
				}
			};

		window.ejConfig = window.ejConfig || {};

		window.ej = ej;
		}(window));

/*global window, define */
/*jslint nomen: true */
/** @namespace ej.utils */
/**
 * @class ej.utils
 */
(function (window, ej) {
	
					/**
				* return requestAnimationFrame function
				* @method requestAnimationFrame
				* @return {Function}
				* @memberOf ej.utils
				* @static
				*/
			var requestAnimationFrame = (function () {
					return window.requestAnimationFrame
						|| window.webkitRequestAnimationFrame
						|| window.mozRequestAnimationFrame
						|| window.oRequestAnimationFrame
						|| function (callback) {
							window.setTimeout(callback, 1000 / 60);
						};
				}()).bind(window),
				/**
				* return cancelAnimationFrame function
				* @method requestAnimationFrame
				* @return {Function}
				* @memberOf ej.utils
				* @static
				*/
				cancelAnimationFrame = (function () {
					return window.cancelAnimationFrame
						|| window.webkitCancelAnimationFrame
						|| window.mozCancelAnimationFrame
						|| window.oCancelAnimationFrame
						|| function (id) {
							window.clearTimeout(id);
						};
				}()).bind(window);

			/**
			* Class with utils functions
			* @class ej.utils
			*/
			/** @namespace ej.utils */
			ej.utils = {
				requestAnimationFrame: requestAnimationFrame,
				cancelAnimationFrame: cancelAnimationFrame,
				/**
				* @alias requestAnimationFrame
				*/
				async: requestAnimationFrame,

				/**
				* Checks if specified string is a number or not
				* @method isNumber
				* @return {boolean}
				* @memberOf ej.utils
				* @static
				*/
				isNumber: function (query) {
					return !isNaN(parseFloat(query)) && isFinite(query);
				}
			};

			}(window, window.ej));

/*global window, define, CustomEvent */
/*jslint nomen: true */
/**
 * @class ej.utils.events
 * Utils class with events functions
 */
(function (ej) {
	
				ej.utils.events = {
					/**
					* @method trigger
					* Triggers custom event on element
					* The return value is false, if at least one of the event
					* handlers which handled this event, called preventDefault.
					* Otherwise it returns true.
					* @param {HTMLElement} element
					* @param {string} type
					* @param {Mixed} data
					* @param {Boolean=} bubbles default true
					* @param {Boolean=} cancelable default true
					* @return {Boolean=}
					* @memberOf ej.utils.event
					* @static
					*/
				trigger: function ejUtilsEvents_trigger(element, type, data, bubbles, cancelable) {
					var evt = new CustomEvent(type, {
						"detail": data,
						//allow event to bubble up, required if we want to allow to listen on document etc
						bubbles: typeof bubbles === "boolean" ? bubbles : true,
						cancelable: typeof cancelable === "boolean" ? cancelable : true
					});
										return element.dispatchEvent(evt);
				},

				/**
				* Stop event propagation
				* @method stopPropagation
				* @param {CustomEvent} event
				* @memberOf ej.utils.events
				* @static
				*/
				stopPropagation: function (event) {
					var originalEvent = event._originalEvent;
					// @todo this.isPropagationStopped = returnTrue;
					if (!originalEvent) {
						return;
					}
					if (originalEvent.stopPropagation) {
						originalEvent.stopPropagation();
					}
					event.stopPropagation();
				},

				/**
				* Stop event propagation immediately
				* @method stopImmediatePropagation
				* @param {CustomEvent} event
				* @memberOf ej.utils.events
				* @static
				*/
				stopImmediatePropagation: function (event) {
					// @todo this.isImmediatePropagationStopped = returnTrue;
					this.stopPropagation(event);
				}
			};
			}(window.ej));

/*global window, define, console */
/*jslint nomen: true, plusplus: true */
/**
 * @class ej.engine
 * Main class with engine of library
 */
(function (window, document, ej) {
	
				var slice = [].slice,
				eventUtils = ej.utils.events,
				globalBindings = {},
				widgetDefs = {},
				widgetBindingMap = {},
				body = document.body,
				justBuild = window.location.hash === "#build",
				/**
				* Returns trimmed value
				* @method trim
				* @param {string} value
				* @return {string} trimmed string
				* @static
				* @private
				*/
				trim = function (value) {
					return value.trim();
				};
			/**
			* Function to define widget
			* @method defineWidget
			* @param {string} name
			* @param {string} binding
			* @param {string} selector
			* @param {Array} methods
			* @param {Object} widgetClass
			* @param {string} [namespace]
			* @param {boolean} [redefine]
			* @return {boolean}
			* @memberOf ej.engine
			* @static
			*/
			function defineWidget(name, binding, selector, methods, widgetClass, namespace, redefine) {
				var definition = {};
				if (!widgetDefs[name] || redefine) {
										definition.name = name;
					methods.push('destroy', 'disable', 'enable', 'option', 'refresh', 'value');
					definition.methods = methods || [];
					definition.selector = selector || "";
					definition.selectors = definition.selector ? definition.selector.split(',').map(trim) : [];
					definition.binding = binding || "";
					definition.widgetClass = widgetClass || null;
					definition.namespace = namespace || "";

					widgetDefs[name] = definition;
					eventUtils.trigger(document, "widgetdefined", definition, false);
					return true;
				}
								return false;
			}

			/**
			* Load widget
			* @method processWidget
			* @param definition
			* @param template
			* @param element
			* @param {Object} [options]
			* @private
			* @memberOf ej.engine
			*/
			function processWidget(definition, template, element, options) {
									var widgetOptions = options || {},
						Widget = definition.widgetClass,
						widgetInstance = Widget ? new Widget(element) : false,
						id,
						postBuildCallback;

					if (widgetInstance) {
												widgetInstance.configure(definition, element, options);
						if (typeof widgetOptions.create === "function") {
							element.addEventListener(definition.name.toLowerCase() + 'create', widgetOptions.create, false);
						}
						if (element) {
							id = element.getAttribute("id");
							if (id) {
								widgetInstance.id = id;
							}
							if (element.getAttribute("data-ej-built") !== "true") {
								element = widgetInstance.build(template, element);
							}
						}
						postBuildCallback = function (element) {
							element.removeEventListener("widgetbuilt", postBuildCallback, true);
							if (!justBuild) {
								widgetInstance.init(element);
								widgetInstance.bindEvents(element);
							} else {
								widgetInstance.bindEvents(element, true);
							}

							if (widgetBindingMap[widgetInstance.id] === undefined) {
								widgetBindingMap[widgetInstance.id] = {
									'elementId': widgetInstance.id,
									'binding': widgetInstance.binding,
									'instance': widgetInstance
								};
							} else {
															}

							eventUtils.trigger(element, "widgetbound", widgetInstance, false);
							eventUtils.trigger(body, "widgetbound", widgetInstance);
						}.bind(null, element);
						if (element) {
							element.addEventListener("widgetbuilt", postBuildCallback, true);
							eventUtils.trigger(element, "widgetbuilt", widgetInstance, false);
						} else {
							body.addEventListener("widgetbuilt", postBuildCallback, true);
							eventUtils.trigger(body, "widgetbuilt", widgetInstance, false);
						}
					}
								}

			/**
			* Call destroy method of widget and it's child. Remove bindings.
			* @param {type} widgetId
			*/
			function destroyWidget(widgetId) {
				var widgetMap = widgetBindingMap[widgetId],
					widgetInstance,
					childWidgets,
					elementCache,
					i;

								if (widgetMap) {
					widgetInstance = widgetMap.instance;
					if (typeof widgetInstance === 'object') {
						//cache widgets HTML Element
						elementCache = widgetInstance.element;

						//Destroy widget
						widgetInstance.destroy();

						//Destroy child widgets, if there something left.
						childWidgets = slice.call(elementCache.querySelectorAll('[data-ej-bound="true"]'));
						for (i = childWidgets.length - 1; i >= 0; i -= 1) {
							if (childWidgets[i]) {
								destroyWidget(childWidgets[i].id);
							}
						}
					}

					delete widgetBindingMap[widgetId];
				}
			}

			/**
			* Load widgets from data-* definition
			* @method processHollowWidget
			* @param _definition
			* @param element
			* @param {Object} [options]
			* @private
			* @memberOf ej.engine
			*/
			function processHollowWidget(_definition, element, options) {
				var name = element.getAttribute("data-ej-name"),
					definition = _definition || (name && widgetDefs[name] ?
							widgetDefs[name] : {
						"name": element.getAttribute("data-ej-name"),
						"selector": element.getAttribute("data-ej-selector"),
						"binding": element.getAttribute("data-ej-binding")
					});
				processWidget(definition, null, element, options);
			}

			/**
			* Build page
			* @method createWidgets
			* @param context
			* @memberOf ej.engine
			*/
			function createWidgets(context) {
				var builtWithoutTemplates = slice.call(context.querySelectorAll('*[data-ej-built=true][data-ej-binding][data-ej-selector][data-ej-name]:not([data-ej-bound])')),
					selectorKeys = Object.keys(widgetDefs),
					normal = [],
					excludeBuiltAndBound = ":not([data-ej-built]):not([data-ej-bound])",
					i,
					j,
					len = selectorKeys.length,
					lenNormal = 0,
					definition,
					buildQueue = [];

				
				// @TODO EXPERIMENTAL WIDGETS WITHOUT TEMPLATE DEFINITION
				builtWithoutTemplates.forEach(processHollowWidget.bind(null, null));

				/* NORMAL */
				for (i = 0; i < len; ++i) {
					definition = widgetDefs[selectorKeys[i]];
					if (definition.selectors.length) {
						normal = context.querySelectorAll(definition.selectors.join(excludeBuiltAndBound + ",") + excludeBuiltAndBound);
						for (j = 0, lenNormal = normal.length; j < lenNormal; ++j) {
														buildQueue.push(processHollowWidget.bind(null, definition, normal[j]));
						}
					}
				}

				for (i = 0, len = buildQueue.length; i < len; ++i) {
					buildQueue[i]();
				}

				eventUtils.trigger(body, "built");
				eventUtils.trigger(body, "bound");
							}

			/**
			* Get biding of widget
			* @method getBinding
			* @param element
			* @return {?Object}
			* @memberOf ej.engine
			*/
			function getBinding(element) {
				var id = !element || typeof element === "string" ? element : element.getAttribute('id');
				return (globalBindings[id] || null);
			}

			/**
			* Set binding of widget
			* @method setBinding
			* @param element
			* @param binding
			* @memberOf ej.engine
			*/
			function setBinding(element, binding) {
				var id = typeof element === "string" ? element : element.getAttribute('id') || binding.id;
				if (globalBindings[id]) {
									} else {
					globalBindings[id] = binding;
				}
			}

			/**
			* remove binding
			* @method removeBinding
			* @param element
			* @return {boolean}
			* @memberOf ej.engine
			*/
			function removeBinding(element) {
				var id = typeof element === "string" ? element : element.getAttribute('id');
				if (globalBindings[id]) {
					delete globalBindings[id];
					return true;
				}
				return false;
			}

			function createEventHandler(event) {
				var element = event.target;
				createWidgets(element, false);
			}

			document.addEventListener("bound", function () {
				window.ejWidgetBindingMap = widgetBindingMap;
			}, false);

			ej.globalBindings = {};
			ej.widgetDefinitions = {};
			ej.engine = {
				destroyWidget: destroyWidget,
				createWidgets: createWidgets,

				/**
				* Method to get all definitions of widgets
				* @method getDefinitions
				* @return {Array}
				* @memberOf ej.engine
				*/
				getDefinitions: function () {
					return widgetDefs;
				},
				getWidgetDefinition: function (name) {
					return widgetDefs[name];
				},
				defineWidget: defineWidget,
				getBinding: getBinding,
				setBinding: setBinding,
				removeBinding: removeBinding,

				//INTERNAL: only for tests:
				_clearBindings: function () {
					//clear and set references to the same object
					globalBindings = window.ej.globalBindings = {};
				},

				build: function () {
					var router = this.router;
					body = document.body;
					if (router && ej.get('autoInitializePage', true)) {
						router.init(justBuild);
					}
					eventUtils.trigger(document, "initrouter", router, false);
				},

				/**
				* Run engine
				* @method run
				* @memberOf ej.engine
				*/
				run: function () {
					var router = this.getRouter();
					this.stop();
					body = document.body;
					document.addEventListener('create', createEventHandler, false);

					eventUtils.trigger(document, "initengine", this, false);
					eventUtils.trigger(document, "initevents", ej.events, false);
					eventUtils.trigger(document, "initjqm");
					eventUtils.trigger(document, 'mobileinit');
					eventUtils.trigger(document, "beforeinitrouter", router, false);
					if (document.readyState === 'complete') {
						this.build();
					} else {
						document.addEventListener('DOMContentLoaded', this.build.bind(this));
					}
				},

				getRouter: function () {
					return this.router;
				},

				initRouter: function (RouterClass) {
					this.router = new RouterClass();
				},

				/**
				* Build instance of widget and binding events
				* @method instanceWidget
				* @memberOf {ej.engine}
				* @param {HTMLElement} element
				* @param {String} name
				* @param {Object} options
				* @return {Object}
				*/
				instanceWidget: function (element, name, options) {
					var binding = getBinding(element),
						built = element.getAttribute("data-ej-built") === "true",
						definition;

					if ((!binding || !built) && widgetDefs[name]) {
						definition = widgetDefs[name];
						processHollowWidget(definition, element, options);
						binding = getBinding(element);
					}
					return binding;
				},

				/**
				* Method to remove all listeners binded in run
				* @method stop
				* @static
				* @memberOf ej.engine
				*/
				stop: function () {
					var router = this.getRouter();
					if (router) {
						router.destroy();
					}
				},
				_createEventHandler : createEventHandler
			};
			}(window, window.document, window.ej));

/*global define: true, window: true */

/**
 * @class ej.utils.selectors
 * Utils class with selectors functions
 */
(function (document, ej) {
	
				var slice = [].slice,
				/**
				* @method matchesSelectorType
				* @return {string}
				* @private
				* @static
				* @memberOf ej.utils.selectors
				*/
				matchesSelectorType = (function () {
					var el = document.createElement("div");

					if (typeof el.webkitMatchesSelector === "function") {
						return "webkitMatchesSelector";
					}

					if (typeof el.mozMatchesSelector === "function") {
						return "mozMatchesSelector";
					}

					if (typeof el.msMatchesSelector === "function") {
						return "msMatchesSelector";
					}

					if (typeof el.matchesSelector === "function") {
						return "matchesSelector";
					}

					return false;
				}());

			function matchesSelector(element, selector) {
				if (matchesSelectorType) {
					return element[matchesSelectorType](selector);
				}
				return false;
			}

			function parents(element) {
				var items = [],
					current = element.parentNode;
				while (current && current !== document) {
					items.push(current);
					current = current.parentNode;
				}
				return items;
			}

			/**
			* Checks if given element and its ancestors matches given function
			* @method closest
			* @param {HTMLElement} element
			* @param {Function} testFunction
			* @return {?HTMLElement}
			* @static
			* @private
			* @memberOf ej.utils.selectors
			*/
			function closest(element, testFunction) {
				var current = element;
				while (current && current !== document) {
					if (testFunction(current)) {
						return current;
					}
					current = current.parentNode;
				}
				return null;
			}

			function testSelector(selector, node) {
				return matchesSelector(node, selector);
			}

			function testClass(className, node) {
				return node.classList.contains(className);
			}

			function testTag(tagName, node) {
				return node.tagName.toLowerCase() === tagName;
			}

			ej.utils.selectors = {
				/**
				* Runs matches implementation of matchesSelector
				* method on specified element
				* @method matchesSelector
				* @param {HTMLElement} element
				* @param {string} Selector
				* @return {boolean}
				* @static
				* @memberOf ej.utils.selectors
				*/
				matchesSelector: matchesSelector,

				/**
				* Return array with children pass by given selector.
				* @method getChildrenBySelector
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {Array}
				* @static
				* @memberOf ej.utils.selectors
				*/
				getChildrenBySelector: function (context, selector) {
					return slice.call(context.children).filter(testSelector.bind(null, selector));
				},

				/**
				* Return array with children pass by given data-namespace-selector.
				* @method getChildrenByDataNS
				* @param {HTMLElement} context
				* @param {string} dataSelector
				* @return {Array}
				* @static
				* @memberOf ej.utils.selectors
				*/
				getChildrenByDataNS: function (context, dataSelector) {
					var namespace = ej.get('namespace'),
						fullDataSelector = '[data-' + (namespace ? namespace + '-' : '') + dataSelector + ']';
					return slice.call(context.children).filter(testSelector.bind(null, fullDataSelector));
				},

				/**
				* Return array with children with given class name.
				* @method getChildrenByClass
				* @param {HTMLElement} context
				* @param {string} className
				* @return {Array}
				* @static
				* @memberOf ej.utils.selectors
				*/
				getChildrenByClass: function (context, className) {
					return slice.call(context.children).filter(testClass.bind(null, className));
				},

				/**
				* Return array with children with given tag name.
				* @method getChildrenByTag
				* @param {HTMLElement} context
				* @param {string} tagName
				* @return {Array}
				* @static
				* @memberOf ej.utils.selectors
				*/
				getChildrenByTag: function (context, tagName) {
					return slice.call(context.children).filter(testTag.bind(null, tagName));
				},

				/**
				* Return array with all parents of element.
				* @method getParents
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {Array}
				* @static
				* @memberOf ej.utils.selectors
				*/
				getParents: parents,

				/**
				* Return array with all parents of element pass by given selector.
				* @method getParentsBySelector
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {Array}
				* @static
				* @memberOf ej.utils.selectors
				*/
				getParentsBySelector: function (context, selector) {
					return parents(context).filter(testSelector.bind(null, selector));
				},

				/**
				* Return array with all parents of element pass by given selector with namespace.
				* @method getParentsBySelectorNS
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {Array}
				* @static
				* @memberOf ej.utils.selectors
				*/
				getParentsBySelectorNS: function (context, selector) {
					var namespace = ej.get('namespace'),
						fullSelector = '[data-' + (namespace ? namespace + '-' : '') + selector + ']';
					return parents(context).filter(testSelector.bind(null, fullSelector));
				},

				/**
				* Return array with all parents of element with given class name.
				* @method getParentsByClass
				* @param {HTMLElement} context
				* @param {string} className
				* @return {Array}
				* @static
				* @memberOf ej.utils.selectors
				*/
				getParentsByClass: function (context, className) {
					return parents(context).filter(testClass.bind(null, className));
				},

				/**
				* Return array with all parents of element with given tag name.
				* @method getParentsByTag
				* @param {HTMLElement} context
				* @param {string} tagName
				* @return {Array}
				* @static
				* @memberOf ej.utils.selectors
				*/
				getParentsByTag: function (context, tagName) {
					return parents(context).filter(testTag.bind(null, tagName));
				},

				/**
				* Return first element from parents of element pass by selector.
				* @method getClosestBySelector
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {HTMLElement}
				* @static
				* @memberOf ej.utils.selectors
				*/
				getClosestBySelector: function (context, selector) {
					return closest(context, testSelector.bind(null, selector));
				},

				/**
				* Return first element from parents of element pass by selector with namespace.
				* @method getClosestBySelectorNS
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {HTMLElement}
				* @static
				* @memberOf ej.utils.selectors
				*/
				getClosestBySelectorNS: function (context, selector) {
					var namespace = ej.get('namespace'),
						fullSelector = '[data-' + (namespace ? namespace + '-' : '') + selector + ']';
					return closest(context, testSelector.bind(null, fullSelector));
				},

				/**
				* Return first element from parents of element with given class name.
				* @method getClosestByClass
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {HTMLElement}
				* @static
				* @memberOf ej.utils.selectors
				*/
				getClosestByClass: function (context, selector) {
					return closest(context, testClass.bind(null, selector));
				},

				/**
				* Return first element from parents of element with given tag name.
				* @method getClosestByTag
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {HTMLElement}
				* @static
				* @memberOf ej.utils.selectors
				*/
				getClosestByTag: function (context, selector) {
					return closest(context, testTag.bind(null, selector));
				},

				/**
				* Return array of elements from context with given data-selector
				* @method getAllByDataNS
				* @param {HTMLElement} context
				* @param {string} dataSelector
				* @return {Array}
				* @static
				* @memberOf ej.utils.selectors
				*/
				getAllByDataNS: function (context, dataSelector) {
					var namespace = ej.get('namespace'),
						fullDataSelector = '[data-' + (namespace ? namespace + '-' : '') + dataSelector + ']';
					return slice.call(context.querySelectorAll(fullDataSelector));
				}
			};
			}(window.document, window.ej));

/*global window, define */
/*jslint plusplus: true */
/**
 * #DOM Object
 * Utilities object with function to manipulation DOM
 * #How to replace jQuery methods  by ej methods
 * ##append vs {@link ej.utils.DOM#method-appendNodes}
 *
 * HTML code before manipulation
 *
 *	@example
 *	<div>
 *		<div id="first">Hello</div>
 *		<div id="second">And</div>
 *		<div id="third">Goodbye</div>
 *	</div>
 *
 * jQuery manipulation
 *
 *	@example
 *	$( "#second" ).append( "<span>Test</span>" );
 *
 * ej manipulation
 *
 *	@example
 *	var context = document.getElementById("second"),
 *		element = document.createElement("span");
 *	element.innerHTML = "Test";
 *	ej.utils.DOM.appendNodes(context, element);
 *
 * HTML code after manipulation
 *
 *	@example
 *	<div>
 *		<div id="first">Hello</div>
 *		<div id="second">And
 *			<span>Test</span>
 *		</div>
 *		<div id="third">Goodbye</div>
 *	</div>
 *
 * ##replaceWith vs {@link ej.utils.DOM#method-replaceWithNodes}
 *
 * HTML code before manipulation
 *
 *	@example
 *	<div>
 *		<div id="first">Hello</div>
 *		<div id="second">And</div>
 *		<div id="third">Goodbye</div>
 *	</div>
 *
 * jQuery manipulation
 *
 *	@example
 *	$('#second').replaceWith("<span>Test</span>");
 *
 * ej manipulation
 *
 *	@example
 *	var context = document.getElementById("second"),
 *		element = document.createElement("span");
 *	element.innerHTML = "Test";
 *	ej.utils.DOM.replaceWithNodes(context, element);
 *
 * HTML code after manipulation
 *
 *	@example
 *	<div>
 *		<div id="first">Hello</div>
 *		<span>Test</span>
 *		<div id="third">Goodbye</div>
 *	</div>
 *
 * ##before vs {@link ej.utils.DOM#method-insertNodesBefore}
 *
 * HTML code before manipulation
 *
 *	@example
 *	<div>
 *		<div id="first">Hello</div>
 *		<div id="second">And</div>
 *		<div id="third">Goodbye</div>
 *	</div>
 *
 * jQuery manipulation
 *
 *	@example
 *	$( "#second" ).before( "<span>Test</span>" );
 *
 * ej manipulation
 *
 *	@example
 *	var context = document.getElementById("second"),
 *		element = document.createElement("span");
 *	element.innerHTML = "Test";
 *	ej.utils.DOM.insertNodesBefore(context, element);
 *
 * HTML code after manipulation
 *
 *	@example
 *	<div>
 *		<div id="first">Hello</div>
 *		<span>Test</span>
 *		<div id="second">And</div>
 *		<div id="third">Goodbye</div>
 *	</div>
 *
 * ##wrapInner vs {@link ej.utils.DOM#method-wrapInHTML}
 *
 * HTML code before manipulation
 *
 *	@example
 *	<div>
 *		<div id="first">Hello</div>
 *		<div id="second">And</div>
 *		<div id="third">Goodbye</div>
 *	</div>
 *
 * jQuery manipulation
 *
 *	@example
 *	$( "#second" ).wrapInner( "<span class="new"></span>" );
 *
 * ej manipulation
 *
 *	@example
 *	var element = document.getElementById("second");
 *	ej.utils.DOM.wrapInHTML(element, "<span class="new"></span>");
 *
 * HTML code after manipulation
 *
 *	@example
 *	<div>
 *		<div id="first">Hello</div>
 *		<div id="second">
 *			<span class="new">And</span>
 *		</div>
 *		<div id="third">Goodbye</div>
 *	</div>
 *
 * @class ej.utils.DOM
 */
(function (window, document, ej) {
	
				ej.utils.DOM = {};
			}(window, window.document, window.ej));

/*global window, define */
/*jslint plusplus: true */
(function (window, document, ej) {
	
	

			var selectors = ej.utils.selectors,
				DOM = ej.utils.DOM;

			/**
			* Returns given attribute set in closest elements from selector it in
			* closest form or fieldset.
			* @method inheritAttr
			* @memberOf ej.utils.DOM
			* @param {HTMLElement} element
			* @param {string} attr
			* @param {string} selector
			* @return {?string}
			* @static
			*/
			DOM.inheritAttr = function (element, attr, selector) {
				var value = element.getAttribute(attr),
					parent;
				if (!value) {
					parent = selectors.getClosestBySelector(element, selector);
					if (parent) {
						return parent.getAttribute(attr);
					}
				}
				return value;
			};

			/**
			* Returns Number from properties described in html tag
			* @method getNumberFromAttribute
			* @memberOf ej.utils.DOM
			* @param {HTMLElement} element
			* @param {string} attribute
			* @param {string=} [type] auto type casting
			* @param {number} [defaultValue] default returned value
			* @static
			* @return {number}
			*/
			DOM.getNumberFromAttribute = function (element, attribute, type, defaultValue) {
				var value = element.getAttribute(attribute),
					result = defaultValue;

				if (value) {
					if (type === "float") {
						value = parseFloat(value);
						if (value) {
							result = value;
						}
					} else {
						value = parseInt(value, 10);
						if (value) {
							result = value;
						}
					}
				}
				return result;
			};

			/**
			* This function set value of attribute data-{namespace}-{name} for element. If namespace is empty then use attribute name data-{name}.
			* @method setNSData
			* @param {HTMLElement} element Base element
			* @param {string} name Name of attribute
			* @param {string|number|boolean} value New value
			* @memberOf ej.utils.DOM
			* @static
			*/
			DOM.setNSData = function (element, name, value) {
				var namespace = ej.get('namespace'),
					dataNamespaceName = 'data-' + (namespace ? namespace + '-' : '') + name;
				element.setAttribute(dataNamespaceName, value);
			};

			/**
			* This function return value of attribute data-{namespace}-{name} for element. If namespace is empty then use attribute name data-{name}.
			* Method may return boolean in case of 'true' or 'false' strings as attribute value.
			* @method getNSData
			* @param {HTMLElement} element Base element
			* @param {string} name Name of attribute
			* @memberOf ej.utils.DOM
			* @return {?string|boolean}
			* @static
			*/
			DOM.getNSData = function (element, name) {
				var namespace = ej.get('namespace'),
					dataNamespaceName = 'data-' + (namespace ? namespace + '-' : '') + name,
					value = element.getAttribute(dataNamespaceName);

				if (value === 'true') {
					return true;
				}

				if (value === 'false') {
					return false;
				}

				return value;
			};

			/**
			* This function return true if attribute data-{namespace}-{name} for element is set or false in another case. If namespace is empty then use attribute name data-{name}.
			* @method hasNSData
			* @param {HTMLElement} element Base element
			* @param {string} name Name of attribute
			* @memberOf ej.utils.DOM
			* @return {boolean}
			* @static
			*/
			DOM.hasNSData = function (element, name) {
				var namespace = ej.get('namespace'),
					dataNamespaceName = 'data-' + (namespace ? namespace + '-' : '') + name;
				return element.hasAttribute(dataNamespaceName);
			};

			/**
			* This function remove attribute data-{namespace}-{name} from element. If namespace is empty then use attribute name data-{name}.
			* @method removeNSData
			* @param {HTMLElement} element Base element
			* @param {string} name Name of attribute
			* @memberOf ej.utils.DOM
			* @static
			*/
			DOM.removeNSData = function (element, name) {
				var namespace = ej.get('namespace'),
					dataNamespaceName = 'data-' + (namespace ? namespace + '-' : '') + name;
				element.removeAttribute(dataNamespaceName);
			};

			/**
			* Return object with all data-* attributes of element
			* @method getData
			* @param {HTMLElement} element Base element
			* @memberOf ej.utils.DOM
			* @return {Object}
			* @static
			*/
			DOM.getData = function (element) {
				var dataPrefix = "data-",
					data = {},
					attrs = element.attributes,
					attr,
					nodeName,
					i,
					length = attrs.length;

				for (i = 0; i < length; i++) {
					attr = attrs.item(i);
					nodeName = attr.nodeName;
					if (nodeName.indexOf(dataPrefix) > -1) {
						data[nodeName.replace(dataPrefix, "")] = attr.nodeValue;
					}
				}

				return data;
			};

			/**
			* Special function to remove attribute and property in the same time
			* @method removeAttribute
			* @param {HTMLElement} element
			* @param {string} name
			* @memberOf ej.utils.DOM
			* @static
			*/
			DOM.removeAttribute = function (element, name) {
				element.removeAttribute(name);
				element[name] = false;
			};

			/**
			* Special function to set attribute and property in the same time
			* @method setAttribute
			* @param {HTMLElement} element
			* @param {string} name
			* @param {Mixed} value
			* @memberOf ej.utils.DOM
			* @static
			*/
			DOM.setAttribute = function (element, name, value) {
				element[name] = value;
				element.setAttribute(name, value);
			};
			}(window, window.document, window.ej));

/*global window, define */
(function (ej) {
	
				/** @namespace ej.widget */
			ej.widget = {};
			}(window.ej));

/*global window, define */
/*jslint nomen: true */
/**
 * @class ej.widget.BaseWidget
 *
 * # Prototype class of widget
 * ## How to invoke creation of widget from JavaScript
 *
 * To build and initialize widget in JavaScript you have to use method {@link ej.engine#method-instanceWidget} . First argument for method
 * is HTMLElement and is base element of widget. Second parameter is name of widget to create.
 *
 * If you have loaded jQuery before initialize ej library you can use standard jQuery UI Widget notation.
 *
 * ### Examples
 * #### Build widget from JavaScript
 *
 *	@example
 *	var element = document.getElementById('id'),
 *		ej.engine.instanceWidget(element, 'Button');
 *
 * #### Build widget from jQuery
 *
 *	@example
 *	var element = $('#id').button();
 * ## How to create new widget
 *
 *	@example
 *	(function (ej) {
 *	
 *		 *				var BaseWidget = ej.widget.BaseWidget, // create alias to main objects
 *					...
 *					arrayOfElements, // example of private property
 *					Button = function () { // create local object with widget
 *					...
 *					};
 *
 *				function closestEnabledButton(element) { // example of private method
 *					...
 *				}
 *				...
 *
 *				Button.prototype = new BaseWidget(); // add ej.widget as prototype to widget's object
 *
 *				Button.prototype.options = { //add default options read from data- attributes
 *					theme: 's',
 *					...
 *				};
 *
 *				Button.prototype._build = function (template, element) { // method call on build of widget, should contains all HTML manipulation actions
 *					...
 *					return element;
 *				};
 *
 *				Button.prototype._init = function (element) { // method call on initialize of widget, should contains all action necessary on application start
 *					...
 *					return element;
 *				};
 *
 *				Button.prototype._bindEvents = function (element) { // method to bind all events, should contains all event bindings
 *					...
 *				};
 *
 *				Button.prototype._buildBindEvents = function (element) { // method to bind all events, should contains all event bindings necessary on build
 *					...
 *				};
 *
 *				Button.prototype._enable = function (element) { // method call on disable method invoke
 *					...
 *				};
 *
 *				Button.prototype._disable = function (element) { // method call on enable method invoke
 *					...
 *				};
 *
 *				Button.prototype.refresh = function (element) { // example of public method
 *					...
 *				};
 *
 *				Button.prototype._refresh = function () { // example of protected method
 *					...
 *				};
 *
 *				engine.defineWidget({ // define widget
 *					"name": "Button", //name of widget
 *					"binding": "./widget/ej.widget.Button", // name of widget's module (name of file)
 *					"selector": "[data-role='button'],button,[type='button'],[type='submit'],[type='reset']",  //widget's selector
 *					"methods": [ // public methods
 *						"enable",
 *						"disable",
 *						"refresh"
 *					]
 *				});
 *				ej.widget.Button = Button;
 *				 *	}(window.ej));
 */
/**
 * Triggered before the widget will be created.
 * @event beforecreate
 * @memberOf ej.widget.BaseWidget
 */
/**
 * Triggered when the widget is created.
 * @event create
 * @memberOf ej.widget.BaseWidget
 */
(function (document, ej) {
	
				/**
			* Alias to Array.slice function
			* @method slice
			* @memberOf ej.widget.BaseWidget
			* @private
			* @static
			*/
			var slice = [].slice,
				/**
				* @property {ej.engine} engine Alias to ej.engine
				* @memberOf ej.widget.BaseWidget
				* @private
				* @static
				*/
				engine = ej.engine,
				/**
				* @property {ej.utils.events} eventUtils Alias to ej.utils.events
				* @memberOf ej.widget.BaseWidget
				* @private
				* @static
				*/
				eventUtils = ej.utils.events,
				/**
				* @property {ej.utils.DOM} domUtils Alias to ej.utils.DOM
				* @private
				* @static
				*/
				domUtils = ej.utils.DOM,
				/**
				* @property {Object} BaseWidget Alias to ej.widget
				* @memberOf ej.widget.BaseWidget
				* @private
				* @static
				*/
				BaseWidget = function () {
					this.options = {};
					return this;
				};

			/*
			* @TODO
			* jquery.widget properies:
			*
			* document: The document that the widget's element is within. Useful if you need to interact with widgets within iframes.
			* element: A jQuery object containing the element used to instantiate the widget. If you select multiple elements and call .myWidget(), a separate widget instance will be created for each element. Therefore, this property will always contain one element.
			* namespace: The location on the global jQuery object that the widget's prototype is stored on. For example a namespace of "ui" indicates that the widget's prototype is stored on $.ui.
			* options: An object containing the options currently being used by the widget. On instantiation, any options provided by the user will automatically be merged with any default values defined in $.myNamespace.myWidget.prototype.options. User specified options override the defaults.
			* uuid: A unique integer identifier for the widget.
			* version: The string version of the widget. For jQuery UI widgets this will be set to the version of jQuery UI the widget is using. Widget developers have to set this property in their prototype explicitly.
			* widgetEventPrefix: The prefix prepended to the name of events fired from this widget. For example the widgetEventPrefix of the draggable widget is "drag", therefore when a draggable is created, the name of the event fired is "dragcreate". By default the widgetEventPrefix of a widget is its name. Note: This property is deprecated and will be removed in a later release. Event names will be changed to widgetName:eventName (e.g. "draggable:create".
			* widgetName: The name of the widget. For $.widget( "myNamespace.myWidget", {} ), widgetName will be "myWidget".
			* window: The window that the widget's element is within. Useful if you need to interact with widgets within iframes.
			*/

			/*
			* @todo default options
			* disabled: false
			* hide
			* show
			*/

			/*
			@todo methods:
			widget

			more information at:
			http://api.jqueryui.com/jQuery.widget/
			*/

			/**
			* configure widget object from definition
			* @method configure
			* @param {Object} definition
			* @param {string} definition.name Name of widget
			* @param {string} definition.selector Selector of widget
			* @param {string} definition.binding Path to file with widget (without extension)
			* @param {Object} options Configure options
			* @memberOf ej.widget.BaseWidget
			* @chainable
			* @instance
			*/
			BaseWidget.prototype.configure = function (definition, element, options) {
				var widgetOptions = this.options || {};
				this.options = widgetOptions;
				if (definition) {
					/**
					* @property {string} name Name of widget
					* @memberOf ej.widget.BaseWidget
					* @instance
					*/
					this.name = definition.name;

					/**
					* @property {string} widgetName Name of widget (in lower case)
					* @memberOf ej.widget.BaseWidget
					* @instance
					*/
					this.widgetName = definition.name.toLowerCase();

					/**
					* @property {number} uuid Number id of widget instance
					* @memberOf ej.widget.BaseWidget
					* @instance
					*/
					this.uuid = ej.getNumberUniqueId();

					/**
					* @property {string} eventNamespace Namespace of widget events (suffix for events)
					* @memberOf ej.widget.BaseWidget
					* @instance
					*/
					this.eventNamespace = '.' + this.widgetName + this.uuid;

					/**
					* @property {string} widgetEventPrefix Namespace of widget events
					* @memberOf ej.widget.BaseWidget
					* @instance
					*/
					this.widgetEventPrefix = this.widgetName;

					/**
					* @property {string} namespace Namespace of widget
					* @memberOf ej.widget.BaseWidget
					* @instance
					*/
					this.namespace = definition.namespace;

					/**
					* @property {string} widgetBaseClass Widget base class
					* @memberOf ej.widget.BaseWidget
					* @instance
					*/
					this.widgetBaseClass = this.namespace + '-' + this.widgetName;

					/**
					* @property {string} widgetFullName Full name of widget
					* @memberOf ej.widget.BaseWidget
					* @instance
					*/
					this.widgetFullName = ((definition.namespace ? definition.namespace + '-' : "") + this.name).toLowerCase();
					/**
					* @property {string} id Id of widget instance
					* @memberOf ej.widget.BaseWidget
					* @instance
					*/
					this.id = ej.getUniqueId();

					/**
					* @property {string} selector widget's selector
					* @memberOf ej.widget.BaseWidget
					* @instance
					*/
					this.selector = definition.selector;
					/**
					* @property {string} binding Path to file with widget (without extension)
					* @memberOf ej.widget.BaseWidget
					* @instance
					*/
					this.binding = definition.binding;
					/**
					* @property {HTMLElement} element Base element of widget
					* @memberOf ej.widget.BaseWidget
					* @instance
					*/
					this.element = null;

					/**
					* @property {string} [defaultElement='<div>'] Default element for widget
					* @memberOf ej.widget.BaseWidget
					* @instance
					*/
					this.defaultElement = '<div>';
				}

				if (typeof this._configure === "function") {
					this._configure();
				}

				this._getCreateOptions(element);

				if (typeof options === 'object') {
					Object.keys(options).forEach(function (key) {
						widgetOptions[key] = options[key];
					});
				}
				this.options = widgetOptions;
				return this;
			};

			/**
			* @property {Object} options Default options for widget
			* @memberOf ej.widget.BaseWidget
			* @template
			* @instance
			*/
			/**
			* Read data-* attributes and save to #options object
			* @method _getCreateOptions
			* @param {HTMLElement} element Base element of widget
			* @return {Object}
			* @memberOf ej.widget.BaseWidget
			* @protected
			* @instance
			*/
			BaseWidget.prototype._getCreateOptions = function (element) {
				var options = this.options;
				if (options !== undefined) {
					Object.keys(options).forEach(function (option) {
						// Get value from data-{namespace}-{name} element's attribute
						// based on widget.options property keys
						var value = domUtils.getNSData(element, (option.replace(/[A-Z]/g, function (c) {
							return "-" + c.toLowerCase();
						})));

						if (value !== null) {
							options[option] = value;
						}
					});
				}
				return options;
			};
			/**
			* Protected method to build widget
			* @method _build
			* @param template
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @memberOf ej.widget.BaseWidget
			* @protected
			* @template
			* @instance
			*/
			/**
			* Build widget. Call #\_getCreateOptions, #\_build
			* @method build
			* @param template
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @memberOf ej.widget.BaseWidget
			* @instance
			*/
			BaseWidget.prototype.build = function (template, element) {
				var id,
					node,
					name = this.widgetName,
					elementContainer;
				if (!element) {
					elementContainer = document.createElement('div');
					elementContainer.innerHTML = this.defaultElement;
					element = elementContainer.firstChild;
				}
				eventUtils.trigger(element, name + "beforecreate");
				element.setAttribute("data-ej-built", true);
				element.setAttribute("data-ej-binding", this.binding);
				element.setAttribute("data-ej-name", this.name);
				element.setAttribute("data-ej-selector", this.selector);
				id = element.getAttribute('id');
				if (!id) {
					element.setAttribute("id", this.id);
				} else {
					this.id = id;
				}

				if (typeof this._build === "function") {
					node = this._build(template, element);
					if (node) {
						this.element = node;
					}
					return node;
				}
				return node;
			};

			/**
			* Protected method to init widget
			* @method _init
			* @param {HTMLElement} element
			* @memberOf ej.widget.BaseWidget
			* @template
			* @protected
			* @instance
			*/
			/**
			* Init widget, call: #\_getCreateOptions, #\_init
			* @method init
			* @param {HTMLElement} element
			* @memberOf ej.widget.BaseWidget
			* @chainable
			* @instance
			*/
			BaseWidget.prototype.init = function (element) {
				var id = element.getAttribute("id");
				if (!id) {
					id = this.id;
				} else {
					this.id = id;
				}

				if (!this.element) {
					this.element = element;
				}

				if (typeof this._init === "function") {
					this._init(element);
				}

				if (element.getAttribute("disabled")) {
					this.disable();
				} else {
					this.enable();
				}

				return this;
			};

			/**
			* Bind widget events attached in build mode
			* @method _buildBindEvents
			* @param {HTMLElement} element Base element of widget
			* @memberOf ej.widget.BaseWidget
			* @template
			* @protected
			* @instance
			*/
			/**
			* Bind widget events attached in init mode
			* @method _bindEvents
			* @param {HTMLElement} element Base element of widget
			* @memberOf ej.widget.BaseWidget
			* @template
			* @protected
			* @instance
			*/
			/**
			* Bind widget events, call: #\_buildBindEvents, #\_bindEvents
			* @method bindEvents
			* @param {HTMLElement} element Base element of widget
			* @param {Boolean} onlyBuild Inform about type of bindings: build/init
			* @memberOf ej.widget.BaseWidget
			* @chainable
			* @instance
			*/
			BaseWidget.prototype.bindEvents = function (element, onlyBuild) {
				if (!onlyBuild) {
					element.setAttribute("data-ej-bound", "true");
				}
				engine.setBinding(element, this);
				if (typeof this._buildBindEvents === "function") {
					this._buildBindEvents(element);
				}
				if (!onlyBuild && typeof this._bindEvents === "function") {
					this._bindEvents(element);
				}

				eventUtils.trigger(element, this.widgetName + "create", this);

				return this;
			};

			/**
			* Protected method to destroy widget
			* @method _destroy
			* @template
			* @protected
			* @memberOf ej.widget.BaseWidget
			* @instance
			*/
			/**
			* Destroy widget, call #\_destroy
			* @method destroy
			* @memberOf ej.widget.BaseWidget
			* @instance
			*/
			BaseWidget.prototype.destroy = function () {
				if (typeof this._destroy === "function") {
					this._destroy();
				}
				// TODO: clean html markup
				this.element.removeAttribute("data-ej-bound");
				engine.removeBinding(this.element);
			};

			/**
			* Protected method to enable widget
			* @method _disable
			* @protected
			* @memberOf ej.widget.BaseWidget
			* @template
			* @instance
			*/
			/**
			* Disable widget, call: #\_disable
			* @method disable
			* @memberOf ej.widget.BaseWidget
			* @chainable
			* @instance
			*/
			BaseWidget.prototype.disable = function () {
				var element = this.element,
					elementClasses = element.classList;

				if (typeof this._disable === "function") {
					this._disable(element);
				}
				elementClasses.add(this.widgetFullName + "-disabled");
				elementClasses.add("ui-state-disabled");
				element.setAttribute("aria-disabled", true);
				// @TODO
				//this.hoverable.removeClass( "ui-state-hover" );
				//this.focusable.removeClass( "ui-state-focus" );

				return this;
			};

			/**
			* Protected method to enable widget
			* @method _enable
			* @protected
			* @memberOf ej.widget.BaseWidget
			* @template
			* @instance
			*/
			/**
			* Enable widget, call: #\_enable
			* @method enable
			* @memberOf ej.widget.BaseWidget
			* @chainable
			* @instance
			*/
			BaseWidget.prototype.enable = function () {
				var element = this.element,
					elementClasses = element.classList;

				if (typeof this._enable === "function") {
					this._enable(element);
				}
				elementClasses.remove(this.widgetFullName + "-disabled");
				elementClasses.remove("ui-state-disabled");
				element.setAttribute("aria-disabled", false);
				// @TODO
				//this.hoverable.removeClass( "ui-state-hover" );
				//this.focusable.removeClass( "ui-state-focus" );

				return this;
			};

			/**
			* Protected method to refresh widget
			* @method _refresh
			* @protected
			* @memberOf ej.widget.BaseWidget
			* @template
			* @instance
			*/
			/**
			* Refresh widget, call: #\_refresh
			* @method refresh
			* @memberOf ej.widget.BaseWidget
			* @chainable
			* @instance
			*/
			BaseWidget.prototype.refresh = function () {
				if (typeof this._refresh === "function") {
					this._refresh();
				}
				return this;
			};


			/**
			* Get/Set options of widget
			* @method option
			* @memberOf ej.widget.BaseWidget
			* @instance
			*/
			BaseWidget.prototype.option = function () {
				var args = slice.call(arguments),
					firstArgument = args.shift(),
					secondArgument = args.shift(),
					methodName;
				/*
				* @TODO fill content of function
				*/
				if (typeof firstArgument === "string") {
					if (secondArgument === undefined) {
						methodName = '_get' + (firstArgument[0].toUpperCase() + firstArgument.slice(1));
						if (typeof this[methodName] === "function") {
							return this[methodName]();
						}
						return this.options[firstArgument];
					}
					methodName = '_set' + (firstArgument[0].toUpperCase() + firstArgument.slice(1));
					if (typeof this[methodName] === "function") {
						this[methodName](this.element, secondArgument);
					} else {
						this.options[firstArgument] = secondArgument;
						if (this.element) {
							this.element.setAttribute('data-' + (firstArgument.replace(/[A-Z]/g, function (c) {
								return "-" + c.toLowerCase();
							})), secondArgument);
							this.refresh();
						}
					}
				}
			};

			BaseWidget.prototype.isBound = function () {
				var element = this.element;
				return element && element.getAttribute('data-ej-bound') ? true : false;
			};

			BaseWidget.prototype.isBuilt = function () {
				var element = this.element;
				return element && element.getAttribute('data-ej-built') ? true : false;
			};

			/**
			* Protected method to get value of widget
			* @method _getValue
			* @return {Mixed}
			* @memberOf ej.widget.BaseWidget
			* @template
			* @protected
			* @instance
			*/
			/**
			* Protected method to set value of widget
			* @method _setValue
			* @param {Mixed} value
			* @return {Mixed}
			* @memberOf ej.widget.BaseWidget
			* @template
			* @protected
			* @instance
			*/
			/**
			* Get/Set value of widget
			* @method value
			* @param {Mixed} [value]
			* @memberOf ej.widget.BaseWidget
			* @return {Mixed}
			* @instance
			*/
			BaseWidget.prototype.value = function (value) {
				if (value !== undefined) {
					if (typeof this._setValue === "function") {
						return this._setValue(value);
					}
					return this;
				}
				if (typeof this._getValue === "function") {
					return this._getValue();
				}
				return this;
			};

			/**
			* Return element of widget
			* @method widget
			* @memberOf ej.widget.BaseWidget
			* @return {HTMLElement}
			* @instance
			*/
			BaseWidget.prototype.widget = function () {
				return this.element;
			};

			/**
			* Throw exception
			* @method raise
			* @param {string?} msg Message of throw
			* @memberOf ej.widget.BaseWidget
			* @return {Mixed}
			* @instance
			*/
			BaseWidget.prototype.raise = function (msg) {
				throw "Widget [" + this.widgetName + "]: " + msg;
			};

			/**
			* @method enhanceWithin
			* @memberOf ej.widget.BaseWidget
			* @instance
			*/
			BaseWidget.prototype.enhanceWithin = function () {
				ej.log('method enhanceWithin is deprecated');
			};

			/**
			* @method enhance
			* @memberOf ej.widget.BaseWidget
			* @instance
			*/
			BaseWidget.prototype.enhance = function () {
				ej.log('method enhance is deprecated');
			};

			// definition
			ej.widget.BaseWidget = BaseWidget;

			}(window.document, window.ej));

/*global window, define */
/*jslint plusplus: true, nomen: true */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
/**
 * #jQuery Mobile mapping class
 * @class ej.jqm.widgets
 */
(function (window, document, ej, tau) {
	
				/**
			* Alias to ej.engine
			* @memberOf ej.jqm
			* @private
			* @static
			*/
			var engine = null,
				tauWidget = {
					/**
					* bind widget to jqm
					* @method init
					* @param {Object} engine ej.engine class
					* @param {Object} definition widget definition
					* @memberOf ej.jqm
					* @static
					*/
					init: function (engine, definition) {
						this.processDefinition(definition, engine);
					},

					/**
					* bind widget to jqm
					* @method processDefinition
					* @param {Object} definition widget definition
					* @param {Object} engine ej.engine class
					* @memberOf ej.jqm
					* @static
					*/
					processDefinition: function (definition, engine) {
						/*
						* name of widget
						* type string
						*/
						var name = definition.name;

						tau[name] = (function (definitionName) {
							return function (element, options) {
								return engine.instanceWidget(element, definitionName, options);
							};
						}(definition.name));
					}
				};

			document.addEventListener("widgetdefined", function (evt) {
				if (!engine) {
					engine = ej.engine;
				}
				tauWidget.init(engine, evt.detail);
			}, false);

			tau.widget = tauWidget;
			}(window, window.document, window.ej, window.tau));

/*global window, define */
(function (window, ej) {
	
				/** @namespace ej.widget.micro */
			ej.widget.micro = {};
			}(window, window.ej));

/*global window, define */
/*jslint nomen: true, white: true, plusplus: true*/

/**
 * @author Michał Szepielak <m.szepielak@samsung.com>
 *
 * @TODO: update docs
 */

(function(document, ej) {
	
					var BaseWidget = ej.widget.BaseWidget,
						/**
						 * @property {ej.engine} engine alias variable
						 * @private
						 * @static
						 */
						engine = ej.engine,
						// Constants definition
						/**
						 * @property {number} SCROLL_UP defines index of scroll `{@link ej.widget.VirtualListview._scroll#direction}.direction`
						 * to retrive if user is scrolling up
						 * @private
						 * @static
						 */
						SCROLL_UP = 0,
						/**
						 * @property {number} SCROLL_RIGHT defines index of scroll {@link ej.widget.VirtualListview._scroll#direction _scroll.direction}.direction
						 * to retrive if user is scrolling right
						 * @private
						 * @static
						 */
						SCROLL_RIGHT = 1,
						/**
						 * @property {number} SCROLL_DOWN defines index of scroll {@link ej.widget.VirtualListview._scroll#direction _scroll.direction}
						 * to retrive if user is scrolling down
						 * @private
						 * @static
						 */
						SCROLL_DOWN = 2,
						/**
						 * @property {number} SCROLL_LEFT defines index of scroll {@link ej.widget.VirtualListview._scroll#direction _scroll.direction}
						 * to retrive if user is scrolling left
						 * @private
						 * @static
						 */
						SCROLL_LEFT = 3,
						blockEvent = false,
						/**
						 * Local constructor function
						 * @method VirtualListview
						 * @private
						 * @memberOf ej.widget.VirtualListview
						 */
						VirtualListview = function() {
							/**
							 * @property {Object} ui VirtualListview widget's properties associated with
							 * User Interface
							 * @property {?HTMLElement} [ui.scrollview=null] Reference to associated
							 * {@link ej.widget.Scrollview Scrollview widget}
							 * @property {number} [ui.itemSize=0] Size of list element in piksels. If scrolling is
							 * vertically it's item width in other case it"s height of item element
							 * @memberOf ej.widget.VirtualListview
							 */
							this.ui = {
								scrollview: null,
								spacer: null,
								itemSize: 0
							};

							/**
							 * @property {Object} _scroll Holds information about scrolling state
							 * @property {Array} [_scroll.direction=[0,0,0,0]] Holds current direction of scrolling.
							 * Indexes suit to following order: [up, left, down, right]
							 * @property {number} [_scroll.lastPositionX=0] Last scroll position from top in pixels.
							 * @property {number} [_scroll.lastPositionY=0] Last scroll position from left in pixels.
							 * @property {number} [_scroll.lastJumpX=0] Difference between last and current
							 * position of horizontal scroll.
							 * @property {number} [_scroll.lastJumpY=0] Difference between last and current
							 * position of vertical scroll.
							 * @property {number} [_scroll.clipWidth=0] Width of clip - visible area for user.
							 * @property {number} [_scroll.clipHeight=0] Height of clip - visible area for user.
							 * @memberOf ej.widget.VirtualListview
							 */
							this._scroll = {
								direction: [0, 0, 0, 0],
								lastPositionX: 0,
								lastPositionY: 0,
								lastJumpX: 0,
								lastJumpY: 0,
								//@TODO: what if there is another element in scroll view? what size of clip should be?
								clipWidth: 0,
								clipHeight: 0
							};

							this.name = "VirtualListview";

							/**
							 * @property {number} _currentIndex Current zero-based index of data set.
							 * @memberOf ej.widget.VirtualListview
							 */
							this._currentIndex = 0;

							/**
							 * @property {Object} options VirtualListview widget options.
							 * @property {number} [options.bufferSize=100] Number of items of result set. The minimum
							 * value is 20 and the default value is 100. As the value gets higher, the loading
							 * time increases while the system performance improves. So you need to pick a value
							 * that provides the best performance without excessive loading time.
							 * @property {number} [options.dataLength=0] Total number of items.
							 */
							this.options = {
								bufferSize: 100,
								dataLength: 0,
								/**
								 * Method which modifies list item, depended at specified index from database.
								 * **Method should overrided by developer using {@link ej.widget.VirtualListview#create .create} method.**
								 * @method
								 * @param {HTMLElement} element List item to be modified.
								 * @param {number} index Index of data set.
								 * @memberOf ej.widget.VirtualListview
								 */
								listItemUpdater: function() {
									return null;
								}
							};

							//Event function handler
							this._scrollEventBound = null;
							return this;
						};


				//@TODO: Maybe this information should by provided by Scrollview
				/**
				 * Updates scroll information about position, direction and jump size.
				 * @param {ej.widget.VirtualListview} self VirtualListview widget reference
				 * @method _updateScrollInfo
				 * @private
				 */
				function _updateScrollInfo(self) {
					var scrollInfo = self._scroll,
							scrollDirection = scrollInfo.direction,
							scrollViewElement = self.ui.scrollview,
							scrollLastPositionX = scrollInfo.lastPositionX,
							scrollLastPositionY = scrollInfo.lastPositionY,
							scrollviewPosX = scrollViewElement.scrollLeft,
							scrollviewPosY = scrollViewElement.scrollTop;

					self._refreshScrollbar();
					//Reset scroll matrix
					scrollDirection = [0, 0, 0, 0];

					//Scrolling UP
					if (scrollviewPosY < scrollLastPositionY) {
						scrollDirection[SCROLL_UP] = 1;
					}

					//Scrolling RIGHT
					if (scrollviewPosX < scrollLastPositionX) {
						scrollDirection[SCROLL_RIGHT] = 1;
					}

					//Scrolling DOWN
					if (scrollviewPosY > scrollLastPositionY) {
						scrollDirection[SCROLL_DOWN] = 1;
					}

					//Scrolling LEFT
					if (scrollviewPosX > scrollLastPositionX) {
						scrollDirection[SCROLL_LEFT] = 1;
					}

					scrollInfo.lastJumpY = Math.abs(scrollviewPosY - scrollLastPositionY);
					scrollInfo.lastJumpX = Math.abs(scrollviewPosX - scrollLastPositionX);
					scrollInfo.lastPositionX = scrollviewPosX;
					scrollInfo.lastPositionY = scrollviewPosY;
					scrollInfo.direction = scrollDirection;
					scrollInfo.clipHeight = scrollViewElement.clientHeight;
					scrollInfo.clipWidth = scrollViewElement.clientWidth;
				}

				/**
				 * Updates list item with data using defined template
				 * @method _updateListItem
				 * @param {ej.widget.VirtualListview} self VirtualListview widget reference
				 * @param {HTMLElement} element List element to update
				 * @param {number} index Data row index
				 * @private
				 */
				function _updateListItem(self, element, index) {
					self.options.listItemUpdater(element, index);
				}

				function _computeElementHeight(element) {
					return parseInt(element.clientHeight, 10) + 1;
				}

				function _orderElementsByIndex(self, toIndex) {
					var element = self.element,
							options = self.options,
							scrollInfo = self._scroll,
							scrollClipHeight = scrollInfo.clipHeight,
							dataLength = options.dataLength,
							indexCorrection = 0,
							bufferedElements = 0,
							avgListItemSize = 0,
							bufferSize = options.bufferSize,
							i,
							offset = 0,
							index;

					//Compute average list item size
					avgListItemSize = _computeElementHeight(element) / bufferSize;

					//Compute average number of elements in each buffer (before and after clip)
					bufferedElements = Math.floor((bufferSize - Math.floor(scrollClipHeight / avgListItemSize)) / 2);

					if (toIndex - bufferedElements <= 0) {
						index = 0;
						indexCorrection = 0;
					} else {
						index = toIndex - bufferedElements;
					}

					if (index + bufferSize >= dataLength) {
						index = dataLength - bufferSize;
					}
					indexCorrection = toIndex - index;

					self._loadData(index);
					blockEvent = true;
					offset = index * avgListItemSize;
					if (offset < 0) {
						offset = 0;
					}
					element.style.top = offset + "px";

					for (i = 0; i < indexCorrection; i += 1) {
						offset += _computeElementHeight(element.children[i]);
					}


					self.ui.scrollview.scrollTop = offset;
					blockEvent = false;
					self._currentIndex = index;
				}

				/**
				 * Orders elements. Controls resultset visibility and does DOM manipulation.
				 * @method _orderElements
				 * @param {ej.widget.VirtualListview} self VirtualListview widget reference
				 * @private
				 */
				function _orderElements(self) {
					var element = self.element,
							scrollInfo = self._scroll,
							options = self.options,
							elementStyle = element.style,
							//Current index of data, first element of resultset
							currentIndex = self._currentIndex,
							//Number of items in resultset
							bufferSize = parseInt(options.bufferSize, 10),
							//Total number of items
							dataLength = options.dataLength,
							//Array of scroll direction
							scrollDirection = scrollInfo.direction,
							scrollClipWidth = scrollInfo.clipWidth,
							scrollClipHeight = scrollInfo.clipHeight,
							scrollLastPositionY = scrollInfo.lastPositionY,
							scrollLastPositionX = scrollInfo.lastPositionX,
							elementPositionTop = parseInt(elementStyle.top, 10) || 0,
							elementPositionLeft = parseInt(elementStyle.left, 10) || 0,
							elementsToLoad = 0,
							bufferToLoad = 0,
							elementsLeftToLoad = 0,
							temporaryElement = null,
							avgListItemSize = 0,
							resultsetSize = 0,
							childrenNodes,
							i = 0,
							jump = 0,
							hiddenPart = 0,
							newPosition;

					childrenNodes = element.children;
					for (i = childrenNodes.length - 1; i > 0; i -= 1) {
						resultsetSize += childrenNodes[i].clientHeight;
					}
					avgListItemSize = resultsetSize / options.bufferSize;

					//Compute hidden part of result set and number of elements, that needed to be loaded, while user is scrolling DOWN
					if (scrollDirection[SCROLL_DOWN]) {
						hiddenPart = scrollLastPositionY - elementPositionTop;
						elementsLeftToLoad = dataLength - currentIndex - bufferSize;
					}

					//Compute hidden part of result set and number of elements, that needed to be loaded, while user is scrolling UP
					if (scrollDirection[SCROLL_UP]) {
						hiddenPart = (elementPositionTop + resultsetSize) - (scrollLastPositionY + scrollClipHeight);
						elementsLeftToLoad = currentIndex;
					}

					//Compute hidden part of result set and number of elements, that needed to be loaded, while user is scrolling RIGHT
					if (scrollDirection[SCROLL_RIGHT]) {
						hiddenPart = scrollLastPositionX - elementPositionLeft;
						elementsLeftToLoad = dataLength - currentIndex - bufferSize;
					}

					//Compute hidden part of result set and number of elements, that needed to be loaded, while user is scrolling LEFT
					if (scrollDirection[SCROLL_LEFT]) {
						hiddenPart = (elementPositionLeft + resultsetSize) - (scrollLastPositionX - scrollClipWidth);
						elementsLeftToLoad = currentIndex;
					}

					//manipulate DOM only, when at least 2/3 of result set is hidden
					//NOTE: Result Set should be at least 3x bigger then clip size
					if (hiddenPart > 0 && (resultsetSize / hiddenPart) <= 1.5) {

						//Left half of hidden elements still hidden/cached
						elementsToLoad = Math.floor(hiddenPart / avgListItemSize) - Math.floor((bufferSize - scrollClipHeight / avgListItemSize) / 2);
						elementsToLoad = elementsLeftToLoad < elementsToLoad ? elementsLeftToLoad : elementsToLoad;
						bufferToLoad = Math.floor(elementsToLoad / bufferSize);
						elementsToLoad = elementsToLoad % bufferSize;

						// Scrolling more then buffer
						if (bufferToLoad > 0) {
							self._loadData(currentIndex + bufferToLoad * bufferSize);
							if (scrollDirection[SCROLL_DOWN] || scrollDirection[SCROLL_RIGHT]) {
								if (scrollDirection[SCROLL_DOWN] || scrollDirection[SCROLL_RIGHT]) {
									jump += bufferToLoad * bufferSize * avgListItemSize;
								}

								if (scrollDirection[SCROLL_UP] || scrollDirection[SCROLL_LEFT]) {
									jump -= bufferToLoad * bufferSize * avgListItemSize;
								}
							}
						}


						if (scrollDirection[SCROLL_DOWN] || scrollDirection[SCROLL_RIGHT]) {
							//Switch currentIndex to last
							currentIndex = currentIndex + bufferSize - 1;
						}
						for (i = elementsToLoad; i > 0; i -= 1) {
							if (scrollDirection[SCROLL_DOWN] || scrollDirection[SCROLL_RIGHT]) {
								temporaryElement = element.appendChild(element.firstElementChild);
								++currentIndex;

								//Updates list item using template
								_updateListItem.call(null, self, temporaryElement, currentIndex);
								jump += temporaryElement.clientHeight;
							}

							if (scrollDirection[SCROLL_UP] || scrollDirection[SCROLL_LEFT]) {
								temporaryElement = element.insertBefore(element.lastElementChild, element.firstElementChild);
								--currentIndex;

								//Updates list item using template
								_updateListItem.call(null, self, temporaryElement, currentIndex);
								jump -= temporaryElement.clientHeight;
							}
						}
						if (scrollDirection[SCROLL_UP] || scrollDirection[SCROLL_DOWN]) {
							newPosition = elementPositionTop + jump;
							if (newPosition < 0 || currentIndex <= 0) {
								newPosition = 0;
							}
							elementStyle.top = newPosition + "px";
						}

						if (scrollDirection[SCROLL_LEFT] || scrollDirection[SCROLL_RIGHT]) {
							newPosition = elementPositionLeft + jump;

							if (newPosition < 0 || currentIndex <= 0) {
								newPosition = 0;
							}

							elementStyle.left = newPosition + "px";
						}

						if (scrollDirection[SCROLL_DOWN] || scrollDirection[SCROLL_RIGHT]) {
							//Switch currentIndex to first
							currentIndex = currentIndex - bufferSize + 1;
						}
						//Save current index
						self._currentIndex = currentIndex;
					}
				}

				VirtualListview.prototype = new BaseWidget();

				/**
				 * @property {Object} classes Dictionary object containing commonly used wiget classes
				 * @static
				 * @memberOf ej.widget.VirtualListview
				 */
				VirtualListview.classes = {
					uiVirtualListContainer: "ui-virtual-list-container"
				};

				/**
				 * Build widget structure
				 * @method _build
				 * @protected
				 * @param {string} template
				 * @param {HTMLElement} element
				 * @return {HTMLElement}
				 * @memberOf ej.widget.VirtualListview
				 */
				VirtualListview.prototype._build = function(template, element) {
					var classes = VirtualListview.classes;

					element.classList.add(classes.uiVirtualListContainer);
					return element;
				};

				/**
				 * Updates list if it needed.
				 * @method _updateList
				 * @protected
				 * @param {ej.widget.VirtualListview} self VirtualListview widget reference
				 * @memberOf ej.widget.VirtualListview
				 */
				function _updateList(self) {
					_updateScrollInfo.call(null, self);
					if (self._scroll.lastJumpY > 0 || self._scroll.lastJumpX > 0) {
						if (!blockEvent) {
							_orderElements.call(null, self);
						}
					}
				}


				/**
				 * Initialize list on an element
				 * @method _init
				 * @protected
				 * @param {HTMLElement} element
				 * @memberOf ej.widget.VirtualListview
				 */
				VirtualListview.prototype._init = function(element) {
					var ui = this.ui,
							options = this.options,
							scrollview,
							spacer;

					//Get scrollview instance
					scrollview = this.element.parentElement;
					spacer = document.createElement("div");
					scrollview.appendChild(spacer);
					spacer.style.display = "block";
					spacer.style.position = "static";
					//Prepare element
					element.style.position = "relative";
					ui.spacer = spacer;
					ui.scrollview = scrollview;
					this.element = element;

					if (options.dataLength < options.bufferSize) {
						options.bufferSize = options.dataLength;
					}
				};

				/**
				 * Builds list items
				 * @method _buildList
				 * @protected
				 * @memberOf ej.widget.VirtualListview
				 */
				VirtualListview.prototype._buildList = function() {
					var listItem,
							list = this.element,
							numberOfItems = this.options.bufferSize,
							documentFragment = document.createDocumentFragment(),
							i;

					for (i = 0; i < numberOfItems; ++i) {
						listItem = document.createElement("li");
						_updateListItem.call(null, this, listItem, i);
						documentFragment.appendChild(listItem);
					}

					list.appendChild(documentFragment);
					this._refresh(true);
				};

				/**
				 * Refresh list
				 * @method _refresh
				 * @protected
				 * @param {boolean} create If it's true items will be recreated. Default is false.
				 * @memberOf ej.widget.VirtualListview
				 */
				VirtualListview.prototype._refresh = function(create) {
					//Set default value of variable create
					create = create || false;
					this._refreshScrollbar();
				};

				/**
				 * Loads data from specefied index to result set size.
				 * @method _loadData
				 * @protected
				 * @param {number} index Index of first row
				 * @memberOf ej.widget.VirtualListview
				 */
				VirtualListview.prototype._loadData = function(index) {
					var children = this.element.firstElementChild;

					if (this._currentIndex !== index) {
						this._currentIndex = index;
						do {
							_updateListItem.call(null, this, children, index);
							++index;
							children = children.nextElementSibling;
						} while (children);
					}
				};

				/**
				 * Sets proper scrollbar size: height (vertical), width (horizontal)
				 * @method _refreshScrollbar
				 * @protected
				 * @memberOf ej.widget.VirtualListview
				 */
				VirtualListview.prototype._refreshScrollbar = function() {
					var scrollingHorizontally = false,
						element = this.element,
						options = this.options,
						bufferSizePx,
						ui = this.ui,
						spacerStyle = ui.spacer.style;

					/**
					 * @TODO: add checking horizontal / vertical scroll
					 */
					if (scrollingHorizontally) {
						//Note: element.clientWidth is variable
						spacerStyle.width = (parseFloat(element.clientWidth) / options.bufferSize * (options.dataLength - 1) - (parseFloat(element.clientWidth) || 0)) + "px";
					} else {
						bufferSizePx = parseFloat(element.clientHeight) || 0;
						//Note: element.clientHeight is variable
						spacerStyle.height = (bufferSizePx / options.bufferSize * (options.dataLength - 1) - 4 / 3 * bufferSizePx) + "px";
					}
				};

				/**
				 * Binds VirtualListview events
				 * @method _bindEvents
				 * @protected
				 * @memberOf ej.widget.VirtualListview
				 */
				VirtualListview.prototype._bindEvents = function() {
					var scrollEventBound = _updateList.bind(null, this),
							scrollviewClip = this.ui.scrollview;

					if (scrollviewClip) {
						scrollviewClip.addEventListener("scroll", scrollEventBound, false);
						this._scrollEventBound = scrollEventBound;
					}
				};

				/**
				 * Cleans widget's resources
				 * @method _destroy
				 * @protected
				 * @memberOf ej.widget.VirtualListview
				 */
				VirtualListview.prototype._destroy = function() {
					var scrollviewClip = this.ui.scrollview,
							uiSpacer = this.ui.spacer,
							element = this.element;

					element.style.top = 0;
					if (scrollviewClip) {
						scrollviewClip.removeEventListener("scroll", this._scrollEventBound, false);
					}
					//Remove spacer element
					if (uiSpacer.parentNode) {
						uiSpacer.parentNode.removeChild(uiSpacer);
					}

					//Remove li elements.
					while (element.firstElementChild) {
						element.removeChild(element.firstElementChild);
					}

				};

				VirtualListview.prototype.scrollTo = function(position) {
					this.ui.scrollview.scrollTop = position;
				};

				VirtualListview.prototype.getTopByIndex = function(index) {
					var childrenNodes,
							element = this.element,
							resultsetSize = 0,
							options = this.options,
							avgListItemSize,
							i;

					childrenNodes = element.children;
					for (i = childrenNodes.length - 1; i > 0; --i) {
						resultsetSize += childrenNodes[i].clientHeight;
					}
					avgListItemSize = resultsetSize / options.bufferSize;

					return (index * avgListItemSize);
				};

				VirtualListview.prototype.scrollToIndex = function(index) {
					if (index < 0) {
						index = 0;
					}
					if (index > this.options.dataLength) {
						index = this.options.dataLength;
					}
					_updateScrollInfo.call(null, this);
					_orderElementsByIndex(this, index);
				};

				VirtualListview.prototype.draw = function() {
					this._buildList();
				};

				VirtualListview.prototype.setListItemUpdater = function(updateFunction) {
					this.options.listItemUpdater = updateFunction;
				};

				// definition
				ej.widget.micro.VirtualListview = VirtualListview;

				engine.defineWidget(
						"VirtualListview",
						"",
						"",
						["draw", "setListItemUpdater", "getTopByIndex", "scrollTo", "scrollToIndex"],
						VirtualListview,
						"micro"
						);
				}(window.document, window.ej));

/*global define, window */
(function (ej) {
	
				if (ej.get("autorun", true) === true) {
				ej.engine.run();
			}
			}(window.ej));

/*global define */
(function() {
var newTau = tau.noConflict();
tau.VirtualListview = newTau.VirtualListview.bind(newTau);
}());

