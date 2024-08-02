"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectedPaneContext = void 0;
exports.arrayMove = arrayMove;
exports.arraysMatch = arraysMatch;
exports.convertExtraKeys = void 0;
exports.debounce = debounce;
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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// noinspection ProblematicWhitespace,ConstantOnRightSideOfComparisonJS,JSUnusedLocalSymbols

/*jshint esversion: 6 */

function trueFunc() {
  return true;
}
const SelectedPaneContext = exports.SelectedPaneContext = /*#__PURE__*/(0, _react.createContext)({
  tab_id: "",
  selectedTabIdRef: "",
  amSelected: trueFunc,
  counter: 0
});
const convertExtraKeys = extraKeys => {
  const newExtraKeys = [];
  for (const key in extraKeys) {
    newExtraKeys.push({
      key: key,
      run: extraKeys[key],
      preventDefault: true,
      preventPropagation: true
    });
  }
  return newExtraKeys;
};
exports.convertExtraKeys = convertExtraKeys;
function isFunction(variable) {
  return typeof variable === 'function';
}

// It's necessary to have effectcount be a ref. Otherwise there can be subtle bugs
function useCallbackStack() {
  let myId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  const [effectCount, setEffectCount, effectCountRef] = useStateAndRef(0);
  const myCallbacksList = (0, _react.useRef)([]);
  (0, _react.useEffect)(() => {
    if (myCallbacksList.current.length > 0) {
      myCallbacksList.current[0]();
      myCallbacksList.current.shift();
      if (myCallbacksList.current.length > 0) {
        setEffectCount(effectCountRef.current + 1);
      }
    }
  }, [effectCount]);
  return callback => {
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
const useConstructor = function () {
  let callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : () => {};
  const hasBeenCalled = (0, _react.useRef)(false);
  const returnVal = (0, _react.useRef)(null);
  if (hasBeenCalled.current) {
    return returnVal.current;
  }
  hasBeenCalled.current = true;
  returnVal.current = callback();
  return returnVal;
};
exports.useConstructor = useConstructor;
function useConnection(tsocket, initSocket) {
  if (!tsocket) return null;
  const [connection_status, set_connection_status] = (0, _react.useState)(null);
  function socketNotifier(connected) {
    set_connection_status(connected ? "up" : "down");
  }
  (0, _react.useEffect)(() => {
    initSocket(tsocket);
    tsocket.notifier = socketNotifier;
    socketNotifier(tsocket.socket.connected);
    return () => {
      tsocket.disconnect();
      tsocket.notifier = null;
    };
  }, []);
  return connection_status;
}
function useStateAndRef(initial) {
  const [value, setValue] = (0, _react.useState)(initial);
  const valueRef = (0, _react.useRef)(value);
  valueRef.current = value;
  return [value, setValue, valueRef];
}
function useStateAndRefAndCounter(initial) {
  function setMe(newValue) {
    setValue(newValue);
    setCounter(counter + 1);
  }
  const [value, setValue] = (0, _react.useState)(initial);
  const [counter, setCounter] = (0, _react.useState)(0);
  const valueRef = (0, _react.useRef)(value);
  valueRef.current = value;
  return [value, setMe, valueRef, counter];
}
function useReducerAndRef(reducer, initial) {
  const [value, dispatch] = (0, _react.useReducer)(reducer, initial);
  const valueRef = (0, _react.useRef)(value);
  valueRef.current = value;
  return [value, dispatch, valueRef];
}
function useImmerReducerAndRef(reducer, initial) {
  const [value, dispatch] = (0, _useImmer.useImmerReducer)(reducer, initial);
  const valueRef = (0, _react.useRef)(value);
  valueRef.current = value;
  return [value, dispatch, valueRef];
}
function useDebounce(callback) {
  let delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
  const current_timer = (0, _react.useRef)(null);
  const waiting = (0, _react.useRef)(false);
  return [waiting, function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    clearTimeout(current_timer.current);
    waiting.current = true;
    current_timer.current = setTimeout(() => {
      waiting.current = false;
      callback(...args);
    }, delay);
  }];
}
const useDidMount = (func, deps) => {
  const didMount = (0, _react.useRef)(false);
  (0, _react.useEffect)(() => {
    if (didMount.current) {
      func();
    } else {
      didMount.current = true;
    }
  }, deps);
};
exports.useDidMount = useDidMount;
function debounce(callback) {
  let delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
  var time;
  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    clearTimeout(time);
    time = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
function throttle(callback) {
  let delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
  let shouldWait = false;
  return function () {
    if (shouldWait) return;
    callback(...arguments);
    shouldWait = true;
    setTimeout(() => {
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
  let skipProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  if (!_lodash.default.isEqual(Object.keys(p1), Object.keys(p2))) {
    return false;
  }
  for (const option in p1) {
    if (skipProps.includes(option)) {
      continue;
    }
    if (typeof p1[option] == "function") {
      if (!(typeof p2[option] == "function")) {
        return false;
      }
      continue;
    }
    if (!_lodash.default.isEqual(p1[option], p2[option])) {
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
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  // Otherwise, return true
  return true;
}
function hasAnyKey(object, keysList) {
  return keysList.some(key => Object.keys(object).includes(key));
}
String.prototype.format = function () {
  let str = this;
  for (let i = 0; i < arguments.length; i++) {
    const reg = new RegExp("\\{" + i + "\\}", "gm");
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
  const d = document.createElement("div");
  Object.assign(d.style, {
    position: 'absolute',
    top: '-1000in',
    left: '-1000in',
    height: '1000in',
    width: '1000in'
  });
  document.body.appendChild(d);
  const px_per_in = d.offsetHeight / 1000;
  document.body.removeChild(d);
  return px_per_in;
}
function remove_duplicates(arrArg) {
  return arrArg.filter((elem, pos, arr) => arr.indexOf(elem) == pos);
}
Array.prototype.empty = function () {
  return this.length == 0;
};
function scrollMeIntoView(element) {
  const outer_element = element.parentNode.parentNode;
  const scrolled_element = element.parentNode;
  const outer_height = outer_element.offsetHeight;
  const distance_from_top = element.offsetTop - outer_element.scrollTop - scrolled_element.offsetTop;
  if (distance_from_top > outer_height - 35) {
    const distance_to_move = distance_from_top - 0.5 * outer_height;
    outer_element.scrollTop += distance_to_move;
  } else if (distance_from_top < 0) {
    const distance_to_move = 0.25 * outer_height - distance_from_top;
    outer_element.scrollTop -= distance_to_move;
  }
}
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
function renderSpinnerMessage(msg) {
  let selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "#main-root";
  const domContainer = document.querySelector(selector);
  const root = (0, _client.createRoot)(domContainer);
  root.render( /*#__PURE__*/_react.default.createElement("div", {
    className: "screen-center",
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/_react.default.createElement(_core.Spinner, {
    size: 100
  }), /*#__PURE__*/_react.default.createElement(_core.Text, {
    className: "pt-2"
  }, msg)));
}