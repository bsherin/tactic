"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SortableComponent = SortableComponent;
var _react = _interopRequireDefault(require("react"));
var _lodash = _interopRequireDefault(require("lodash"));
var _reactBeautifulDnd = require("react-beautiful-dnd");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function SortableComponent(props) {
  var WrappedComponent = props.ElementComponent;
  var lprops = _lodash["default"].clone(props);
  delete lprops.item_list;
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
      return /*#__PURE__*/_react["default"].createElement(_reactBeautifulDnd.Draggable, {
        key: entry[props.key_field_name],
        index: index,
        draggableId: entry[props.key_field_name]
      }, function (provided, snapshot) {
        return /*#__PURE__*/_react["default"].createElement("div", _extends({
          ref: provided.innerRef
        }, provided.draggableProps), /*#__PURE__*/_react["default"].createElement(WrappedComponent, _extends({
          key: entry[props.key_field_name],
          index: index,
          dragHandleProps: provided.dragHandleProps
        }, lprops, entry)));
      });
    }), provided.placeholder);
  }));
}