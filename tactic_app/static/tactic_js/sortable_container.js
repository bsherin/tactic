"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SortableComponent = SortableComponent;
var _react = _interopRequireWildcard(require("react"));
var _reactBeautifulDnd = require("react-beautiful-dnd");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } // import _ from 'lodash';
function SortableComponent(props) {
  var WrappedComponent = props.ElementComponent;
  var DraggableComponent = (0, _react.useMemo)(function () {
    return getDraggableComponent(props, WrappedComponent);
  }, []);
  return /*#__PURE__*/_react["default"].createElement(_reactBeautifulDnd.DragDropContext, {
    onDragEnd: props.onDragEnd,
    onBeforeCapture: props.onBeforeCapture
  }, /*#__PURE__*/_react["default"].createElement(_reactBeautifulDnd.Droppable, {
    droppableId: "droppable"
  }, function (provided) {
    return /*#__PURE__*/_react["default"].createElement("div", _extends({
      id: props.id,
      style: props.style,
      ref: provided.innerRef
    }, provided.droppableProps), props.item_list.map(function (entry, index) {
      return /*#__PURE__*/_react["default"].createElement(DraggableComponent, {
        key: entry[props.key_field_name],
        index: index,
        entry: entry,
        extraProps: props.extraProps
      });
    }), provided.placeholder);
  }));
}
exports.SortableComponent = SortableComponent = /*#__PURE__*/_react["default"].memo(SortableComponent);

// The purpose of the manuever below is to create a new component that is memorized
// And includes the outer <Draggable> component
// This helped with preventing extra renders of the Draggable component
function getDraggableComponent(initProps, WrappedComponent) {
  return /*#__PURE__*/_react["default"].memo(function (props) {
    return /*#__PURE__*/_react["default"].createElement(_reactBeautifulDnd.Draggable, {
      key: props.entry[initProps.key_field_name],
      index: props.index,
      draggableId: props.entry[initProps.key_field_name]
    }, function (provided, snapshot) {
      return /*#__PURE__*/_react["default"].createElement("div", _extends({
        ref: provided.innerRef
      }, provided.draggableProps), /*#__PURE__*/_react["default"].createElement(WrappedComponent, _extends({
        key: props.entry[initProps.key_field_name],
        index: props.index,
        dragHandleProps: provided.dragHandleProps
      }, props.entry, props.extraProps)));
    });
  });
}