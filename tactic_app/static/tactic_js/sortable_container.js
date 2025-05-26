"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SortableComponent = SortableComponent;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@dnd-kit/core");
var _sortable = require("@dnd-kit/sortable");
var _utilities = require("@dnd-kit/utilities");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SortableComponent(props) {
  var WrappedComponent = props.ElementComponent;
  var DraggableComponent = (0, _react.useMemo)(function () {
    return getDraggableComponent(props, WrappedComponent);
  }, []);
  var sensors = (0, _core.useSensors)((0, _core.useSensor)(_core.PointerSensor, {
    activationConstraint: {
      distance: 5
    }
  }));
  return /*#__PURE__*/_react["default"].createElement(_core.DndContext, {
    sensors: sensors,
    collisionDetection: _core.closestCenter,
    onDragEnd: function onDragEnd(event) {
      var active = event.active,
        over = event.over;
      if (active.id !== (over === null || over === void 0 ? void 0 : over.id)) {
        var oldIndex = props.item_list.findIndex(function (item) {
          return item[props.key_field_name] === active.id;
        });
        var newIndex = props.item_list.findIndex(function (item) {
          return item[props.key_field_name] === over.id;
        });
        props.onDragEnd(oldIndex, newIndex);
      }
    }
  }, /*#__PURE__*/_react["default"].createElement(_sortable.SortableContext, {
    items: props.item_list.map(function (entry) {
      return entry[props.key_field_name];
    }),
    strategy: _sortable.rectSortingStrategy
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: props.className,
    style: props.style
  }, props.item_list.map(function (entry, index) {
    return /*#__PURE__*/_react["default"].createElement(DraggableComponent, {
      key: entry[props.key_field_name],
      index: index,
      entry: entry,
      extraProps: props.extraProps
    });
  }))));
}
exports.SortableComponent = SortableComponent = /*#__PURE__*/_react["default"].memo(SortableComponent);

// Helper to create a wrapped, sortable component
function getDraggableComponent(initProps, WrappedComponent) {
  return /*#__PURE__*/_react["default"].memo(function (props) {
    var id = props.entry[initProps.key_field_name];
    var _useSortable = (0, _sortable.useSortable)({
        id: id
      }),
      attributes = _useSortable.attributes,
      listeners = _useSortable.listeners,
      setNodeRef = _useSortable.setNodeRef,
      transform = _useSortable.transform,
      transition = _useSortable.transition,
      isDragging = _useSortable.isDragging;
    var style = {
      zIndex: isDragging ? 9999 : "auto",
      // ✅ High enough to stay on top
      opacity: isDragging ? 0.8 : 1,
      transform: _utilities.CSS.Translate.toString(transform),
      transition: transition
    };
    return /*#__PURE__*/_react["default"].createElement("div", _extends({
      ref: setNodeRef,
      style: style
    }, attributes), /*#__PURE__*/_react["default"].createElement(WrappedComponent, _extends({
      key: id,
      index: props.index,
      dragHandleProps: listeners
    }, props.entry, props.extraProps)));
  });
}