"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectedPaneContext = void 0;
exports.arrayMove = arrayMove;
exports.arraysMatch = arraysMatch;
exports.convertExtraKeys = void 0;
exports.copyToClipboard = copyToClipboard;
exports.debounce = debounce;
exports.default = void 0;
exports.getFileExtension = getFileExtension;
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
exports.useWidget = useWidget;
var _lodash = _interopRequireDefault(require("lodash"));
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _core = require("@blueprintjs/core");
var _useImmer = require("use-immer");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
// noinspection ProblematicWhitespace,ConstantOnRightSideOfComparisonJS,JSUnusedLocalSymbols

/*jshint esversion: 6 */

function amSelected(ltab_id, lselectedTabIdRef) {
  return !window.in_context || ltab_id === lselectedTabIdRef.current;
}
const SelectedPaneContext = exports.SelectedPaneContext = /*#__PURE__*/(0, _react.createContext)({
  tab_id: "",
  selectedTabIdRef: "",
  amSelected: amSelected,
  counter: 0,
  addOmniItems: () => {},
  closeTab: () => {},
  refreshTab: () => {}
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
function useWidget(widgetIdArg = null, widgetTypeArg = null, widgetDataArg = {}) {
  const [widgetId, setWidgetId] = (0, _react.useState)(widgetIdArg);
  const [widgetType, setWidgetType] = (0, _react.useState)(widgetTypeArg);
  const [widgetData, setWidgetData] = (0, _react.useState)(widgetDataArg);
  function setWidget(newWidget) {
    if ("widgetId" in newWidget) {
      setWidgetId(newWidget.widgetId);
    }
    if ("type" in newWidget) {
      setWidgetType(newWidget.type);
    }
    if ("data" in newWidget) {
      setWidgetData(newWidget.data);
    }
  }
  return [widgetId, widgetType, widgetData, setWidget];
}

// It's necessary to have effectcount be a ref. Otherwise there can be subtle bugs
function useCallbackStack(myId = "") {
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
  const currentDependenciesRef = (0, _react.useRef)();
  if (!_lodash.default.isEqual(currentDependenciesRef.current, dependencies)) {
    currentDependenciesRef.current = dependencies;
  }
  (0, _react.useEffect)(() => {
    return callback();
  }, [currentDependenciesRef.current]);
}
var _default = exports.default = useDeepCompareEffect;
const useConstructor = (callback = () => {}) => {
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
  const [value, customDispatch] = (0, _react.useReducer)(reducer, initial);
  const valueRef = (0, _react.useRef)(value);
  valueRef.current = value;
  return [value, customDispatch, valueRef];
}
function useImmerReducerAndRef(reducer, initial) {
  const [value, dispatch] = (0, _useImmer.useImmerReducer)(reducer, initial);
  const valueRef = (0, _react.useRef)(value);
  valueRef.current = value;
  return [value, dispatch, valueRef];
}
function useDebounce(callback, delay = 500) {
  const current_timer = (0, _react.useRef)(null);
  const waiting = (0, _react.useRef)(false);
  return [waiting, (...args) => {
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
function debounce(callback, delay = 1000) {
  let time;
  return (...args) => {
    clearTimeout(time);
    time = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
function throttle(callback, delay = 1000) {
  let shouldWait = false;
  return (...args) => {
    if (shouldWait) return;
    callback(...args);
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
function propsAreEqual(p1, p2, skipProps = []) {
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
function renderSpinnerMessage(msg, selector = "#main-root") {
  const domContainer = document.querySelector(selector);
  const root = (0, _client.createRoot)(domContainer);
  root.render(/*#__PURE__*/_react.default.createElement("div", {
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
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function () {}).catch(function (error) {
      console.error('Failed to copy text: ', error);
    });
  } else {
    // Fallback: Create a temporary text area for copying
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
  }
}
function getFileExtension(filePath) {
  const dotIndex = filePath.lastIndexOf('.');
  if (dotIndex === -1) {
    return ''; // No extension found
  }
  return filePath.substring(dotIndex + 1);
}