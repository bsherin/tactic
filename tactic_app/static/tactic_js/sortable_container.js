"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SortableComponent = SortableComponent;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireWildcard(require("react"));
var _reactBeautifulDnd = require("react-beautiful-dnd");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// import _ from 'lodash';

function SortableComponent(props) {
  const WrappedComponent = props.ElementComponent;
  const DraggableComponent = (0, _react.useMemo)(() => {
    return getDraggableComponent(props, WrappedComponent);
  }, []);
  return /*#__PURE__*/_react.default.createElement(_reactBeautifulDnd.DragDropContext, {
    onDragEnd: props.onDragEnd,
    onBeforeCapture: props.onBeforeCapture
  }, /*#__PURE__*/_react.default.createElement(_reactBeautifulDnd.Droppable, {
    droppableId: "droppable"
  }, provided => /*#__PURE__*/_react.default.createElement("div", (0, _extends2.default)({
    className: props.className,
    style: props.style,
    ref: provided.innerRef
  }, provided.droppableProps), props.item_list.map((entry, index) => /*#__PURE__*/_react.default.createElement(DraggableComponent, {
    key: entry[props.key_field_name],
    index: index,
    entry: entry,
    extraProps: props.extraProps
  })), provided.placeholder)));
}
exports.SortableComponent = SortableComponent = /*#__PURE__*/_react.default.memo(SortableComponent);

// The purpose of the manuever below is to create a new component that is memorized
// And includes the outer <Draggable> component
// This helped with preventing extra renders of the Draggable component
function getDraggableComponent(initProps, WrappedComponent) {
  return /*#__PURE__*/_react.default.memo(props => {
    return /*#__PURE__*/_react.default.createElement(_reactBeautifulDnd.Draggable, {
      key: props.entry[initProps.key_field_name],
      index: props.index,
      draggableId: props.entry[initProps.key_field_name]
    }, (provided, snapshot) => /*#__PURE__*/_react.default.createElement("div", (0, _extends2.default)({
      ref: provided.innerRef
    }, provided.draggableProps), /*#__PURE__*/_react.default.createElement(WrappedComponent, (0, _extends2.default)({
      key: props.entry[initProps.key_field_name],
      index: props.index,
      dragHandleProps: provided.dragHandleProps
    }, props.entry, props.extraProps))));
  });
}