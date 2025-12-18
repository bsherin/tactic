"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectedPaneContext = void 0;
exports.arrayMove = arrayMove;
exports.arraysMatch = arraysMatch;
exports.convertExtraKeys = void 0;
exports.copyToClipboard = copyToClipboard;
exports.debounce = debounce;
exports["default"] = void 0;
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
exports.useConstructor = void 0;
exports.useDebounce = useDebounce;
exports.useDeepCompareEffect = useDeepCompareEffect;
exports.useDidMount = void 0;
exports.useImmerReducerAndRef = useImmerReducerAndRef;
exports.useReducerAndRef = useReducerAndRef;
exports.useRegisterActivity = useRegisterActivity;
exports.useStateAndRef = useStateAndRef;
exports.useStateAndRefAndCounter = useStateAndRefAndCounter;
exports.useWidget = useWidget;
exports.withRegisterActivity = withRegisterActivity;
var _lodash = _interopRequireDefault(require("lodash"));
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _core = require("@blueprintjs/core");
var _communication_react = require("./communication_react");
var _useImmer = require("use-immer");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; } // noinspection ProblematicWhitespace,ConstantOnRightSideOfComparisonJS,JSUnusedLocalSymbols
/*jshint esversion: 6 */
function amSelected(ltab_id, lselectedTabIdRef) {
  return !window.in_context || ltab_id === lselectedTabIdRef.current;
}
var SelectedPaneContext = exports.SelectedPaneContext = /*#__PURE__*/(0, _react.createContext)({
  tab_id: "",
  selectedTabIdRef: "",
  amSelected: amSelected,
  counter: 0,
  addOmniItems: function addOmniItems() {},
  closeTab: function closeTab() {},
  refreshTab: function refreshTab() {}
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
function useWidget() {
  var widgetIdArg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var widgetTypeArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var widgetDataArg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _useState = (0, _react.useState)(widgetIdArg),
    _useState2 = _slicedToArray(_useState, 2),
    widgetId = _useState2[0],
    setWidgetId = _useState2[1];
  var _useState3 = (0, _react.useState)(widgetTypeArg),
    _useState4 = _slicedToArray(_useState3, 2),
    widgetType = _useState4[0],
    setWidgetType = _useState4[1];
  var _useState5 = (0, _react.useState)(widgetDataArg),
    _useState6 = _slicedToArray(_useState5, 2),
    widgetData = _useState6[0],
    setWidgetData = _useState6[1];
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
function useDeepCompareEffect(callback, dependencies) {
  var currentDependenciesRef = (0, _react.useRef)();
  if (!_lodash["default"].isEqual(currentDependenciesRef.current, dependencies)) {
    currentDependenciesRef.current = dependencies;
  }
  (0, _react.useEffect)(function () {
    return callback();
  }, [currentDependenciesRef.current]);
}
var RegisterActivityContext = /*#__PURE__*/_react["default"].createContext(null);
var activity_interval_msecs = window.activity_interval * 1000;
function useLocalRegisterActivity() {
  var current_timer = (0, _react.useRef)(null);
  var waiting = (0, _react.useRef)(false);
  var registerActivity = (0, _react.useCallback)(function () {
    if (waiting.current) {
      return;
    }
    waiting.current = true;
    current_timer.current = setTimeout(function () {
      waiting.current = false;
      (0, _communication_react.postPromise)("host", "register_client_interaction", {
        global_id: window.global_id
      }).then(function () {});
    }, activity_interval_msecs);
  }, []);
  return [waiting, registerActivity];
}
function useRegisterActivity() {
  var contextValue = _react["default"].useContext(RegisterActivityContext);
  if (contextValue) {
    return contextValue;
  }
  return useLocalRegisterActivity();
}
function ActivityTracker() {
  var _useRegisterActivity = useRegisterActivity(),
    _useRegisterActivity2 = _slicedToArray(_useRegisterActivity, 2),
    registerActivity = _useRegisterActivity2[1];
  (0, _react.useEffect)(function () {
    (0, _communication_react.postPromise)("host", "register_client_interaction", {
      global_id: window.global_id
    }).then(function () {});
  }, []);
  (0, _react.useEffect)(function () {
    var handler = function handler() {
      registerActivity();
    };
    var events = ["click", "keydown", "mousedown", "touchstart", "scroll"];
    events.forEach(function (evt) {
      return window.addEventListener(evt, handler, {
        passive: true
      });
    });
    return function () {
      events.forEach(function (evt) {
        return window.removeEventListener(evt, handler);
      });
    };
  }, [registerActivity]);
  return null; // nothing to render
}
function withRegisterActivity(WrappedComponent) {
  function WithRegisterActivity(props) {
    var value = useLocalRegisterActivity();
    return /*#__PURE__*/_react["default"].createElement(RegisterActivityContext.Provider, {
      value: value
    }, /*#__PURE__*/_react["default"].createElement(ActivityTracker, null), /*#__PURE__*/_react["default"].createElement(WrappedComponent, props));
  }
  return /*#__PURE__*/(0, _react.memo)(WithRegisterActivity);
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
function useStateAndRef(initial) {
  var _useState7 = (0, _react.useState)(initial),
    _useState8 = _slicedToArray(_useState7, 2),
    value = _useState8[0],
    setValue = _useState8[1];
  var valueRef = (0, _react.useRef)(value);
  valueRef.current = value;
  return [value, setValue, valueRef];
}
function useStateAndRefAndCounter(initial) {
  function setMe(newValue) {
    setValue(newValue);
    setCounter(counter + 1);
  }
  var _useState9 = (0, _react.useState)(initial),
    _useState0 = _slicedToArray(_useState9, 2),
    value = _useState0[0],
    setValue = _useState0[1];
  var _useState1 = (0, _react.useState)(0),
    _useState10 = _slicedToArray(_useState1, 2),
    counter = _useState10[0],
    setCounter = _useState10[1];
  var valueRef = (0, _react.useRef)(value);
  valueRef.current = value;
  return [value, setMe, valueRef, counter];
}
function useReducerAndRef(reducer, initial) {
  var _useReducer = (0, _react.useReducer)(reducer, initial),
    _useReducer2 = _slicedToArray(_useReducer, 2),
    value = _useReducer2[0],
    customDispatch = _useReducer2[1];
  var valueRef = (0, _react.useRef)(value);
  valueRef.current = value;
  return [value, customDispatch, valueRef];
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
  root.render(/*#__PURE__*/_react["default"].createElement("div", {
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
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function () {})["catch"](function (error) {
      console.error('Failed to copy text: ', error);
    });
  } else {
    // Fallback: Create a temporary text area for copying
    var textArea = document.createElement('textarea');
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
  var dotIndex = filePath.lastIndexOf('.');
  if (dotIndex === -1) {
    return ''; // No extension found
  }
  return filePath.substring(dotIndex + 1);
}