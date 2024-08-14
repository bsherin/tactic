"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectedPaneContext = void 0;
exports.arrayMove = arrayMove;
exports.arraysMatch = arraysMatch;
exports.convertExtraKeys = void 0;
exports.debounce = debounce;
exports["default"] = void 0;
exports.get_ppi = get_ppi;
exports.guid = guid;
exports.hasAnyKey = hasAnyKey;
exports.isInt = isInt;
exports.propsAreEqual = propsAreEqual;
exports.remove_duplicates = remove_duplicates;
exports.renderSpinnerMessage = renderSpinnerMessage;
exports.scrollMeIntoView = scrollMeIntoView;
exports.throttle = throttle;
exports.useCallbackStack = useCallbackStack;
exports.useConnection = useConnection;
exports.useConstructor = void 0;
exports.useDebounce = useDebounce;
exports.useDeepCompareEffect = useDeepCompareEffect;
exports.useDidMount = void 0;
exports.useImmerReducerAndRef = useImmerReducerAndRef;
exports.useReducerAndRef = useReducerAndRef;
exports.useStateAndRef = useStateAndRef;
exports.useStateAndRefAndCounter = useStateAndRefAndCounter;
var _lodash = _interopRequireDefault(require("lodash"));
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _core = require("@blueprintjs/core");
var _useImmer = require("use-immer");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; } // noinspection ProblematicWhitespace,ConstantOnRightSideOfComparisonJS,JSUnusedLocalSymbols
/*jshint esversion: 6 */
function trueFunc() {
  return true;
}
var SelectedPaneContext = exports.SelectedPaneContext = /*#__PURE__*/(0, _react.createContext)({
  tab_id: "",
  selectedTabIdRef: "",
  amSelected: trueFunc,
  counter: 0
});
var convertExtraKeys = exports.convertExtraKeys = function convertExtraKeys(extraKeys) {
  var newExtraKeys = [];
  for (var key in extraKeys) {
    newExtraKeys.push({
      key: key,
      run: extraKeys[key],
      preventDefault: true,
      preventPropagation: true
    });
  }
  return newExtraKeys;
};
function isFunction(variable) {
  return typeof variable === 'function';
}

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
    if (myCallbacksList.current.length > 0) {
      myCallbacksList.current[0]();
      myCallbacksList.current.shift();
      if (myCallbacksList.current.length > 0) {
        setEffectCount(effectCountRef.current + 1);
      }
    }
  }, [effectCount]);
  return function (callback) {
    try {
      if (callback) {
        if (isFunction(callback)) {
          myCallbacksList.current.push(callback);
          setEffectCount(effectCountRef.current + 1);
        } else {
          console.log("Bad callback in useCallbackStack", myId);
        }
      }
    } catch (err) {
      console.log("Problem invoking callback in useCallbackStack", err);
    }
  };
}

// function useDeepCompareEffect(callback, dependencies) {
//     const currentDependenciesRef = useRef();
//     const changeCounter = useRef(0);
//
//   if (!_.isEqual(currentDependenciesRef.current, dependencies)) {
//       currentDependenciesRef.current = dependencies;
//       changeCounter.current += 1;
//   }
//
//   useEffect(callback, [changeCounter.current]);
// }

function useDeepCompareEffect(callback, dependencies) {
  var currentDependenciesRef = (0, _react.useRef)();
  if (!_lodash["default"].isEqual(currentDependenciesRef.current, dependencies)) {
    console.log('Dependencies changed:', dependencies);
    currentDependenciesRef.current = dependencies;
  }
  (0, _react.useEffect)(function () {
    return callback();
  }, [currentDependenciesRef.current]);
}
var _default = exports["default"] = useDeepCompareEffect;
var useConstructor = exports.useConstructor = function useConstructor() {
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
function useConnection(tsocket, initSocket) {
  if (!tsocket) return null;
  var _useState = (0, _react.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    connection_status = _useState2[0],
    set_connection_status = _useState2[1];
  function socketNotifier(connected) {
    set_connection_status(connected ? "up" : "down");
  }
  (0, _react.useEffect)(function () {
    initSocket(tsocket);
    tsocket.notifier = socketNotifier;
    socketNotifier(tsocket.socket.connected);
    return function () {
      tsocket.disconnect();
      tsocket.notifier = null;
    };
  }, []);
  return connection_status;
}
function useStateAndRef(initial) {
  var _useState3 = (0, _react.useState)(initial),
    _useState4 = _slicedToArray(_useState3, 2),
    value = _useState4[0],
    setValue = _useState4[1];
  var valueRef = (0, _react.useRef)(value);
  valueRef.current = value;
  return [value, setValue, valueRef];
}
function useStateAndRefAndCounter(initial) {
  function setMe(newValue) {
    setValue(newValue);
    setCounter(counter + 1);
  }
  var _useState5 = (0, _react.useState)(initial),
    _useState6 = _slicedToArray(_useState5, 2),
    value = _useState6[0],
    setValue = _useState6[1];
  var _useState7 = (0, _react.useState)(0),
    _useState8 = _slicedToArray(_useState7, 2),
    counter = _useState8[0],
    setCounter = _useState8[1];
  var valueRef = (0, _react.useRef)(value);
  valueRef.current = value;
  return [value, setMe, valueRef, counter];
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
function useImmerReducerAndRef(reducer, initial) {
  var _useImmerReducer = (0, _useImmer.useImmerReducer)(reducer, initial),
    _useImmerReducer2 = _slicedToArray(_useImmerReducer, 2),
    value = _useImmerReducer2[0],
    dispatch = _useImmerReducer2[1];
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
var useDidMount = exports.useDidMount = function useDidMount(func, deps) {
  var didMount = (0, _react.useRef)(false);
  (0, _react.useEffect)(function () {
    if (didMount.current) {
      func();
    } else {
      didMount.current = true;
    }
  }, deps);
};
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
function hasAnyKey(object, keysList) {
  return keysList.some(function (key) {
    return Object.keys(object).includes(key);
  });
}
String.prototype.format = function () {
  var str = this;
  for (var i = 0; i < arguments.length; i++) {
    var reg = new RegExp("\\{" + i + "\\}", "gm");
    str = str.replace(reg, arguments[i]);
  }
  return str;
};

// function get_ppi_old() {
//     const d = $("<div/>").css({
//         position: 'absolute',
//         top: '-1000in',
//         left: '-1000in',
//         height: '1000in',
//         width: '1000in'
//     }).appendTo('body');
//     const px_per_in = d.height() / 1000;
//     d.remove();
//     return px_per_in;
// }

function get_ppi() {
  var d = document.createElement("div");
  Object.assign(d.style, {
    position: 'absolute',
    top: '-1000in',
    left: '-1000in',
    height: '1000in',
    width: '1000in'
  });
  document.body.appendChild(d);
  var px_per_in = d.offsetHeight / 1000;
  document.body.removeChild(d);
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
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
function renderSpinnerMessage(msg) {
  var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "#main-root";
  var domContainer = document.querySelector(selector);
  var root = (0, _client.createRoot)(domContainer);
  root.render( /*#__PURE__*/_react["default"].createElement("div", {
    className: "screen-center",
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.Spinner, {
    size: 100
  }), /*#__PURE__*/_react["default"].createElement(_core.Text, {
    className: "pt-2"
  }, msg)));
}