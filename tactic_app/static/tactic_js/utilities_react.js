"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.doBinding = doBinding;
exports.propsAreEqual = propsAreEqual;
exports.arrayMove = arrayMove;
exports.arraysMatch = arraysMatch;
exports.get_ppi = get_ppi;
exports.isInt = isInt;
exports.remove_duplicates = remove_duplicates;
exports.doSignOut = doSignOut;
exports.guid = guid;
exports.scrollMeIntoView = scrollMeIntoView;
exports.renderSpinnerMessage = renderSpinnerMessage;

var _lodash = _interopRequireDefault(require("lodash"));

var _react = _interopRequireDefault(require("react"));

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _core = require("@blueprintjs/core");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
  } // Check if all items exist and are in the same order


  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  } // Otherwise, return true


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