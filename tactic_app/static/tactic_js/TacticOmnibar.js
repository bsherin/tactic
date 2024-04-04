"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OmniContext = void 0;
exports.OpenOmnibar = OpenOmnibar;
exports.TacticOmnibar = TacticOmnibar;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _select = require("@blueprintjs/select");
var _core = require("@blueprintjs/core");
var _communication_react = require("./communication_react");
var _theme = require("./theme");
var _utilities_react = require("./utilities_react");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var context_url = $SCRIPT_ROOT + '/context';
var library_url = $SCRIPT_ROOT + '/library';
var repository_url = $SCRIPT_ROOT + '/repository';
var account_url = $SCRIPT_ROOT + '/account_info';
var login_url = $SCRIPT_ROOT + "/login";
var icon_dict = {
  collection: "database",
  project: "projects",
  tile: "application",
  list: "list",
  code: "code"
};
var OmniContext = /*#__PURE__*/(0, _react.createContext)(null);
exports.OmniContext = OmniContext;
function OpenOmnibarItem(props) {
  function _handleClick() {
    props.handleClick(props.item);
    return null;
  }
  return /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
    icon: icon_dict[props.item.res_type],
    active: props.modifiers.active,
    text: props.item.name,
    label: props.item.res_type,
    key: props.item.name,
    onClick: _handleClick,
    shouldDismissPopover: true
  });
}
var resources_to_grab = 20;
function OpenOmnibar(props) {
  // const [commandItems, setCommandItems] = useState([]);
  var _useState = (0, _react.useState)([]),
    _useState2 = _slicedToArray(_useState, 2),
    item_list = _useState2[0],
    set_item_list = _useState2[1];
  var theme = (0, _react.useContext)(_theme.ThemeContext);
  var old_search_string = (0, _react.useRef)("");
  var selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  (0, _react.useEffect)(function () {
    set_item_list([]);
  }, [selectedPane.tab_id]);
  var grabChunk = (0, _react.useCallback)( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(search_string) {
      var search_spec, data, result_data, fItems, gItems, rItems, _i2, _rItems, the_item;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            search_spec = {
              active_tag: null,
              search_string: search_string,
              search_inside: false,
              search_metadata: false,
              show_hidden: false,
              sort_field: "updated",
              sort_direction: "descending"
            };
            data = {
              pane_type: "all",
              search_spec: search_spec,
              row_number: 0,
              number_to_get: 20,
              is_repository: false
            };
            _context.prev = 2;
            _context.next = 5;
            return (0, _communication_react.postAjaxPromise)("grab_all_list_chunk", data);
          case 5:
            result_data = _context.sent;
            fItems = props.commandItems.filter(function (item) {
              return commandItemPredicate(search_string, item);
            });
            gItems = _globalOmniItems().filter(function (item) {
              return commandItemPredicate(search_string, item);
            });
            fItems = fItems.concat(gItems);
            rItems = Object.values(result_data.chunk_dict);
            for (_i2 = 0, _rItems = rItems; _i2 < _rItems.length; _i2++) {
              the_item = _rItems[_i2];
              the_item.item_type = "resource";
            }
            fItems = fItems.concat(rItems);
            set_item_list(fItems);
            _context.next = 18;
            break;
          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](2);
            errorDrawerFuncs.addFromError("Error grabbing resource chunk", _context.t0);
          case 18:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[2, 15]]);
    }));
    return function (_x2) {
      return _ref.apply(this, arguments);
    };
  }());
  var _useDebounce = (0, _utilities_react.useDebounce)(grabChunk),
    _useDebounce2 = _slicedToArray(_useDebounce, 2),
    waiting = _useDebounce2[0],
    doUpdate = _useDebounce2[1];
  function commandItemPredicate(query, item) {
    if (query.length == 0) {
      return false;
    }
    var lquery = query.toLowerCase();
    var re = new RegExp(lquery);
    return re.test(item.search_text.toLowerCase());
  }
  function openItemListPredicate(search_string, items) {
    if (!props.showOmnibar) return [];
    if (search_string == "" && !waiting.current) {
      old_search_string.current = "";
      return [];
    }
    if (search_string == old_search_string.current) {
      return items;
    }
    old_search_string.current = search_string;
    doUpdate(search_string);
    return item_list;
  }
  function openItemRenderer(item, _ref2) {
    var modifiers = _ref2.modifiers,
      handleClick = _ref2.handleClick;
    if (item.item_type == "command") {
      return /*#__PURE__*/_react["default"].createElement(TacticOmnibarItem, {
        modifiers: modifiers,
        item: item,
        handleClick: handleClick
      });
    }
    return /*#__PURE__*/_react["default"].createElement(OpenOmnibarItem, {
      modifiers: modifiers,
      item: item,
      handleClick: handleClick
    });
  }
  function _onItemSelect(item) {
    if (item.item_type == "command") {
      item.the_function();
    } else {
      props.openFunc(item);
    }
    props.closeOmnibar();
  }
  function renderQueryList(listProps) {
    var handleKeyDown = listProps.handleKeyDown,
      handleKeyUp = listProps.handleKeyUp;
    var handlers = props.showOmnibar ? {
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp
    } : {};
    return /*#__PURE__*/_react["default"].createElement(_core.Overlay, {
      hasBackdrop: true,
      isOpen: props.showOmnibar,
      className: _select.Classes.OMNIBAR_OVERLAY,
      onClose: props.closeOmnibar
    }, /*#__PURE__*/_react["default"].createElement("div", _extends({
      className: "".concat(_select.Classes.OMNIBAR, " ").concat(listProps.className)
    }, handlers), /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
      autoFocus: true,
      large: true,
      leftIcon: "cube",
      placeholder: "Search resources...",
      onChange: listProps.handleQueryChange,
      value: listProps.query
    }), listProps.itemList));
  }
  function _handle_signout() {
    window.open($SCRIPT_ROOT + "/logout/" + props.page_id, "_self");
    return false;
  }
  function _globalOmniItems() {
    function wopenfunc(the_url) {
      return function () {
        window.open(the_url);
      };
    }
    var omni_funcs = [["Toggle Theme", "account", _toggleTheme, "contrast"], ["Docs", "documentation", wopenfunc("https://tactic.readthedocs.io/en/latest/Object-Oriented-API.html"), "log-out"], ["Tile Commands", "documentation", wopenfunc("https://tactic.readthedocs.io/en/latest/Tile-Commands.html"), "code-block"], ["Object Api", "documentation", wopenfunc("https://tactic.readthedocs.io/en/latest/Object-Oriented-API.html"), "code-block"]];
    if (props.is_authenticated) {
      var new_funcs = [["New Context Tab", "window", wopenfunc(context_url), "add"], ["New Tabbed Window", "window", wopenfunc(library_url), "add"], ["Show Repository", "window", wopenfunc(repository_url), "database"], ["Show Account Info", "account", wopenfunc(account_url), "person"], ["Logout", "account", _handle_signout, "log-out"]];
      omni_funcs = omni_funcs.concat(new_funcs);
    }
    var omni_items = [];
    var _iterator = _createForOfIteratorHelper(omni_funcs),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;
        omni_items.push({
          category: "Global",
          display_text: item[0],
          search_text: item[0],
          icon_name: item[3],
          the_function: item[2],
          item_type: "command"
        });
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return omni_items;
  }
  function _toggleTheme() {
    var result_dict = {
      "user_id": window.user_id,
      "theme": !theme.dark_theme ? "dark" : "light"
    };
    (0, _communication_react.postWithCallback)("host", "set_user_theme", result_dict, null, null);
    theme.setTheme(!theme.dark_theme);
  }
  return /*#__PURE__*/_react["default"].createElement(_select.QueryList, {
    items: item_list,
    className: theme.dark_theme ? "bp5-dark" : "",
    isOpen: props.showOmnibar,
    onItemSelect: _onItemSelect,
    itemRenderer: openItemRenderer,
    itemListPredicate: openItemListPredicate,
    resetOnSelect: true,
    resetOnQuery: false,
    renderer: renderQueryList,
    onClose: props.closeOmnibar
  });
}
exports.OpenOmnibar = OpenOmnibar = /*#__PURE__*/(0, _react.memo)(OpenOmnibar);
function TacticOmnibarItem(props) {
  function _handleClick() {
    props.handleClick(props.item);
  }
  return /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
    icon: props.item.icon_name,
    active: props.modifiers.active,
    text: props.item.display_text,
    label: props.item.category,
    key: props.item.search_text,
    onClick: _handleClick,
    shouldDismissPopover: true
  });
}
TacticOmnibarItem.propTypes = {
  item: _propTypes["default"].object,
  modifiers: _propTypes["default"].object,
  handleClick: _propTypes["default"].func
};
TacticOmnibarItem = /*#__PURE__*/(0, _react.memo)(TacticOmnibarItem);
function _itemRenderer(item, _ref3) {
  var modifiers = _ref3.modifiers,
    handleClick = _ref3.handleClick;
  return /*#__PURE__*/_react["default"].createElement(TacticOmnibarItem, {
    modifiers: modifiers,
    item: item,
    handleClick: handleClick
  });
}
function _itemPredicate(query, item) {
  if (query.length == 0) {
    return false;
  }
  var lquery = query.toLowerCase();
  var re = new RegExp(lquery);
  return re.test(item.search_text.toLowerCase()) || re.test(item.category.toLowerCase());
}
function TacticOmnibar(props) {
  var theme = (0, _react.useContext)(_theme.ThemeContext);
  function _onItemSelect(item) {
    item.the_function();
    props.closeOmnibar();
  }
  function _handle_signout() {
    window.open($SCRIPT_ROOT + "/logout/" + props.page_id, "_self");
    return false;
  }
  function _globalOmniItems() {
    function wopenfunc(the_url) {
      return function () {
        window.open(the_url);
      };
    }
    var omni_funcs = [["Toggle Theme", "account", _toggleTheme, "contrast"], ["Docs", "documentation", wopenfunc("https://tactic.readthedocs.io/en/latest/Object-Oriented-API.html"), "log-out"], ["Tile Commands", "documentation", wopenfunc("https://tactic.readthedocs.io/en/latest/Tile-Commands.html"), "code-block"], ["Object Api", "documentation", wopenfunc("https://tactic.readthedocs.io/en/latest/Object-Oriented-API.html"), "code-block"]];
    if (props.is_authenticated) {
      var new_funcs = [["New Context Tab", "window", wopenfunc(context_url), "add"], ["New Tabbed Window", "window", wopenfunc(library_url), "add"], ["Show Repository", "window", wopenfunc(repository_url), "database"], ["Show Account Info", "account", wopenfunc(account_url), "person"], ["Logout", "account", _handle_signout, "log-out"]];
      omni_funcs = omni_funcs.concat(new_funcs);
    }
    var omni_items = [];
    var _iterator2 = _createForOfIteratorHelper(omni_funcs),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var item = _step2.value;
        omni_items.push({
          category: item[1],
          display_text: item[0],
          search_text: item[0],
          icon_name: item[3],
          the_function: item[2]
        });
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    return omni_items;
  }
  function _toggleTheme() {
    var result_dict = {
      "user_id": window.user_id,
      "theme": !theme.dark_theme ? "dark" : "light"
    };
    (0, _communication_react.postWithCallback)("host", "set_user_theme", result_dict, null, null);
    theme.setTheme(!theme.dark_theme);
  }
  var the_items = [];
  if (props.showOmnibar) {
    var _iterator3 = _createForOfIteratorHelper(props.omniGetters),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var ogetter = _step3.value;
        the_items = the_items.concat(ogetter());
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    the_items = the_items.concat(_globalOmniItems());
  }
  return /*#__PURE__*/_react["default"].createElement(_select.Omnibar, {
    items: the_items,
    className: theme.dark_theme ? "bp5-dark" : "",
    isOpen: props.showOmnibar,
    onItemSelect: _onItemSelect,
    itemRenderer: _itemRenderer,
    itemPredicate: _itemPredicate,
    resetOnSelect: true,
    onClose: props.closeOmnibar
  });
}
TacticOmnibar.propTypes = {
  omniGetters: _propTypes["default"].array,
  showOmniBar: _propTypes["default"].bool,
  closeOmniBar: _propTypes["default"].func
};
TacticOmnibar.defaultProps = {
  showOmnibar: false,
  omniGetters: null
};
exports.TacticOmnibar = TacticOmnibar = /*#__PURE__*/(0, _react.memo)(TacticOmnibar);