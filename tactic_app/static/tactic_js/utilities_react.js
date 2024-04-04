"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectedPaneContext = void 0;
exports.arrayMove = arrayMove;
exports.arraysMatch = arraysMatch;
exports.debounce = debounce;
exports.get_ppi = get_ppi;
exports.guid = guid;
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
exports.useDidMount = void 0;
exports.useReducerAndRef = useReducerAndRef;
exports.useStateAndRef = useStateAndRef;
exports.useStateAndRefAndCounter = useStateAndRefAndCounter;
var _lodash = _interopRequireDefault(require("lodash"));
var _react = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _core = require("@blueprintjs/core");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; } // noinspection ProblematicWhitespace,ConstantOnRightSideOfComparisonJS,JSUnusedLocalSymbols
/*jshint esversion: 6 */
var SelectedPaneContext = /*#__PURE__*/(0, _react.createContext)({
  tab_id: "",
  selectedTabIdRef: "",
  amSelected: function amSelected() {
    return true;
  },
  counter: 0
});

// It's necessary to have effectcount be a ref. Otherwise there can be subtle bugs
exports.SelectedPaneContext = SelectedPaneContext;
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
    if (callback) {
      myCallbacksList.current.push(callback);
      setEffectCount(effectCountRef.current + 1);
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
function useConnection(tsocket, initSocket) {
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
var useDidMount = function useDidMount(func, deps) {
  var didMount = (0, _react.useRef)(false);
  (0, _react.useEffect)(function () {
    if (didMount.current) {
      func();
    } else {
      didMount.current = true;
    }
  }, deps);
};
exports.useDidMount = useDidMount;
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