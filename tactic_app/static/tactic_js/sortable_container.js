"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SortableComponent = SortableComponent;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireDefault(require("react"));
var _lodash = _interopRequireDefault(require("lodash"));
var _reactBeautifulDnd = require("react-beautiful-dnd");
function SortableComponent(props) {
  let WrappedComponent = props.ElementComponent;
  var lprops = _lodash.default.clone(props);
  delete lprops.item_list;
  return /*#__PURE__*/_react.default.createElement(_reactBeautifulDnd.DragDropContext, {
    onDragEnd: props.onDragEnd,
    onBeforeCapture: props.onBeforeCapture
  }, /*#__PURE__*/_react.default.createElement(_reactBeautifulDnd.Droppable, {
    droppableId: "droppable"
  }, provided => /*#__PURE__*/_react.default.createElement("div", (0, _extends2.default)({
    id: props.id,
    style: props.style,
    ref: provided.innerRef
  }, provided.droppableProps), props.item_list.map((entry, index) => /*#__PURE__*/_react.default.createElement(_reactBeautifulDnd.Draggable, {
    key: entry[props.key_field_name],
    index: index,
    draggableId: entry[props.key_field_name]
  }, (provided, snapshot) => /*#__PURE__*/_react.default.createElement("div", (0, _extends2.default)({
    ref: provided.innerRef
  }, provided.draggableProps), /*#__PURE__*/_react.default.createElement(WrappedComponent, (0, _extends2.default)({
    key: entry[props.key_field_name],
    index: index,
    dragHandleProps: provided.dragHandleProps
  }, lprops, entry))))), provided.placeholder)));
}