"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrayMove = arrayMove;
exports.arraysMatch = arraysMatch;
exports.debounce = debounce;
exports.doBinding = doBinding;
exports.doSignOut = doSignOut;
exports.get_ppi = get_ppi;
exports.guid = guid;
exports.isInt = isInt;
exports.propsAreEqual = propsAreEqual;
exports.remove_duplicates = remove_duplicates;
exports.renderSpinnerMessage = renderSpinnerMessage;
exports.scrollMeIntoView = scrollMeIntoView;
exports.throttle = throttle;
exports.useCallbackStack = useCallbackStack;
exports.useConstructor = void 0;
exports.useDebounce = useDebounce;
exports.useReducerAndRef = useReducerAndRef;
exports.useStateAndRef = useStateAndRef;
var _lodash = _interopRequireDefault(require("lodash"));
var _react = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _core = require("@blueprintjs/core");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; } // noinspection ProblematicWhitespace,ConstantOnRightSideOfComparisonJS,JSUnusedLocalSymbols
/**
 * Created by bls910 much later
 */ /*jshint esversion: 6 */
// It's necessary to have effectcount be a ref. Otherwise there can be subtle bugs
function useCallbackStack() {
  var myId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var _useStateAndRef = useStateAndRef(0),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    effectCount = _useStateAndRef2[0],
    setEffectCount = _useStateAndRef2[1],
    effectCountRef = _useStateAndRef2[2];
  var myCallbacksList = (0, _react.useRef)([]);
  (0, _react.useEffect)(function () {
    // console.log(`${myId} Entering effect with length ${String(myCallbacksList.current.length)} and effectcount${String(effectCountRef.current)}`);
    if (myCallbacksList.current.length > 0) {
      myCallbacksList.current[0]();
      myCallbacksList.current.shift();
      if (myCallbacksList.current.length > 0) {
        setEffectCount(effectCountRef.current + 1);
      }
    }
    // console.log(`${myId} leaving with length ${String(myCallbacksList.current.length)} and effectcount${String(effectCountRef.current)}`)
  }, [effectCount]);
  return function (callback) {
    if (callback) {
      myCallbacksList.current.push(callback);
      setEffectCount(effectCountRef.current + 1);
      // console.log(`${myId} Pushed callback length ${String(myCallbacksList.current.length)} and effectcount${String(effectCountRef.current)}`);
      // console.log(String(callback))
    }
  };
}

var useConstructor = function useConstructor() {
  var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
  var hasBeenCalled = (0, _react.useRef)(false);
  var returnVal = (0, _react.useRef)(null);
  if (hasBeenCalled.current) {
    return returnVal.current;
  }
  hasBeenCalled.current = true;
  returnVal.current = callback();
  return returnVal;
};
exports.useConstructor = useConstructor;
function useStateAndRef(initial) {
  var _useState = (0, _react.useState)(initial),
    _useState2 = _slicedToArray(_useState, 2),
    value = _useState2[0],
    setValue = _useState2[1];
  var valueRef = (0, _react.useRef)(value);
  valueRef.current = value;
  return [value, setValue, valueRef];
}
function useReducerAndRef(reducer, initial) {
  var _useReducer = (0, _react.useReducer)(reducer, initial),
    _useReducer2 = _slicedToArray(_useReducer, 2),
    value = _useReducer2[0],
    dispatch = _useReducer2[1];
  var valueRef = (0, _react.useRef)(value);
  valueRef.current = value;
  return [value, dispatch, valueRef];
}
function useDebounce(callback) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
  var current_timer = (0, _react.useRef)(null);
  var waiting = (0, _react.useRef)(false);
  return [waiting, function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    clearTimeout(current_timer.current);
    waiting.current = true;
    current_timer.current = setTimeout(function () {
      waiting.current = false;
      callback.apply(void 0, args);
    }, delay);
  }];
}
function debounce(callback) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
  var time;
  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    clearTimeout(time);
    time = setTimeout(function () {
      callback.apply(void 0, args);
    }, delay);
  };
}
function throttle(callback) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
  var shouldWait = false;
  return function () {
    if (shouldWait) return;
    callback.apply(void 0, arguments);
    shouldWait = true;
    setTimeout(function () {
      shouldWait = false;
    }, delay);
  };
}
function doBinding(obj) {
  var seq = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "_";
  var proto = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  if (!proto) {
    proto = Object.getPrototypeOf(obj);
  }
  var _iterator = _createForOfIteratorHelper(Object.getOwnPropertyNames(proto)),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var key = _step.value;
      if (key.startsWith(seq)) {
        obj[key] = obj[key].bind(obj);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}
function isInt(value) {
  if (isNaN(value)) {
    return false;
  }
  return parseFloat(value) == parseInt(value);
}
function propsAreEqual(p1, p2) {
  var skipProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  if (!_lodash["default"].isEqual(Object.keys(p1), Object.keys(p2))) {
    return false;
  }
  for (var option in p1) {
    if (skipProps.includes(option)) {
      continue;
    }
    if (typeof p1[option] == "function") {
      if (!(typeof p2[option] == "function")) {
        return false;
      }
      continue;
    }
    if (!_lodash["default"].isEqual(p1[option], p2[option])) {
      return false;
    }
  }
  return true;
}
function arrayMoveMutate(array, from, to) {
  array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
}
function arrayMove(array, from, to) {
  array = array.slice();
  arrayMoveMutate(array, from, to);
  return array;
}
function arraysMatch(arr1, arr2) {
  // Check if the arrays are the same length
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Check if all items exist and are in the same order
  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  // Otherwise, return true
  return true;
}
String.prototype.format = function () {
  var str = this;
  for (var i = 0; i < arguments.length; i++) {
    var reg = new RegExp("\\{" + i + "\\}", "gm");
    str = str.replace(reg, arguments[i]);
  }
  return str;
};
function get_ppi() {
  var d = $("<div/>").css({
    position: 'absolute',
    top: '-1000in',
    left: '-1000in',
    height: '1000in',
    width: '1000in'
  }).appendTo('body');
  var px_per_in = d.height() / 1000;
  d.remove();
  return px_per_in;
}
function remove_duplicates(arrArg) {
  return arrArg.filter(function (elem, pos, arr) {
    return arr.indexOf(elem) == pos;
  });
}
Array.prototype.empty = function () {
  return this.length == 0;
};
function doSignOut(page_id) {
  window.open($SCRIPT_ROOT + "/logout/" + window.page_id, "_self");
  return false;
}
function scrollIntoView(element, container) {
  var containerTop = $(container).scrollTop();
  var containerBottom = containerTop + $(container).height();
  var elemTop = element.offsetTop;
  var elemBottom = elemTop + $(element).height();
  if (elemTop < containerTop) {
    $(container).scrollTop(elemTop);
  } else if (elemBottom > containerBottom) {
    $(container).scrollTop(elemBottom - $(container).height());
  }
}
function scrollMeIntoView(element) {
  var outer_element = element.parentNode.parentNode;
  var scrolled_element = element.parentNode;
  var outer_height = outer_element.offsetHeight;
  var distance_from_top = element.offsetTop - outer_element.scrollTop - scrolled_element.offsetTop;
  if (distance_from_top > outer_height - 35) {
    var distance_to_move = distance_from_top - 0.5 * outer_height;
    outer_element.scrollTop += distance_to_move;
  } else if (distance_from_top < 0) {
    var _distance_to_move = 0.25 * outer_height - distance_from_top;
    outer_element.scrollTop -= _distance_to_move;
  }
}
function altScrollIntoView(element, container) {
  var containerTop = $(container).scrollTop();
  var containerBottom = containerTop + $(container).height();
  var elemTop = element.offsetTop;
  var elemBottom = elemTop + $(element).height();
  if (elemTop < containerTop) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  } else if (elemBottom > containerBottom) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest"
    });
  }
}
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
function renderSpinnerMessage(msg) {
  var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "#main-root";
  var domContainer = document.querySelector(selector);
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement("div", {
    className: "screen-center",
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.Spinner, {
    size: 100
  }), /*#__PURE__*/_react["default"].createElement(_core.Text, {
    className: "pt-2"
  }, msg)), domContainer);
}