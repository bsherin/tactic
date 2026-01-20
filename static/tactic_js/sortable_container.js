"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SortableComponent = void 0;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@dnd-kit/core");
var _sortable = require("@dnd-kit/sortable");
var _utilities = require("@dnd-kit/utilities");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
var SortableComponent = exports.SortableComponent = /*#__PURE__*/_react["default"].memo(function SortableComponent(props) {
  var WrappedComponent = props.ElementComponent;
  var sensors = (0, _core.useSensors)((0, _core.useSensor)(_core.PointerSensor, {
    activationConstraint: {
      distance: 5
    }
  }));
  var ids = (0, _react.useMemo)(function () {
    return props.item_list.map(function (e) {
      return e[props.key_field_name];
    });
  }, [props.item_list, props.key_field_name]);
  var handleDragEnd = (0, _react.useCallback)(function (event) {
    var active = event.active,
      over = event.over;
    if (!over || active.id === over.id) return;
    var oldIndex = props.item_list.findIndex(function (item) {
      return item[props.key_field_name] === active.id;
    });
    var newIndex = props.item_list.findIndex(function (item) {
      return item[props.key_field_name] === over.id;
    });
    props.onDragEnd(oldIndex, newIndex);
  }, [props.item_list, props.key_field_name, props.onDragEnd]);
  return /*#__PURE__*/_react["default"].createElement(_core.DndContext, {
    sensors: sensors,
    collisionDetection: _core.closestCenter,
    onDragEnd: handleDragEnd
  }, /*#__PURE__*/_react["default"].createElement(_sortable.SortableContext, {
    items: ids,
    strategy: _sortable.rectSortingStrategy
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: props.className,
    style: props.style
  }, props.item_list.map(function (entry, index) {
    var id = entry[props.key_field_name];
    return /*#__PURE__*/_react["default"].createElement(DraggableItem, {
      key: id,
      id: id,
      index: index,
      entry: entry,
      WrappedComponent: WrappedComponent,
      extraProps: props.extraProps
    });
  }))));
});
function useStableListeners(listeners) {
  var ref = _react["default"].useRef(listeners);
  _react["default"].useEffect(function () {
    ref.current = listeners;
  }, [listeners]);
  return _react["default"].useMemo(function () {
    if (!listeners) return listeners;
    var wrapped = {};
    var _loop = function _loop() {
      var key = _Object$keys[_i];
      wrapped[key] = function () {
        var _ref$current, _ref$current$key;
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        return (_ref$current = ref.current) === null || _ref$current === void 0 || (_ref$current$key = _ref$current[key]) === null || _ref$current$key === void 0 ? void 0 : _ref$current$key.call.apply(_ref$current$key, [_ref$current].concat(args));
      };
    };
    for (var _i = 0, _Object$keys = Object.keys(listeners); _i < _Object$keys.length; _i++) {
      _loop();
    }
    return wrapped;
  }, []);
}
var DraggableItem = /*#__PURE__*/_react["default"].memo(function DraggableItem(_ref) {
  var id = _ref.id,
    index = _ref.index,
    entry = _ref.entry,
    WrappedComponent = _ref.WrappedComponent,
    extraProps = _ref.extraProps;
  var _useSortable = (0, _sortable.useSortable)({
      id: id
    }),
    attributes = _useSortable.attributes,
    listeners = _useSortable.listeners,
    setNodeRef = _useSortable.setNodeRef,
    transform = _useSortable.transform,
    transition = _useSortable.transition,
    isDragging = _useSortable.isDragging;
  var stableListeners = useStableListeners(listeners); // or remove if you move handle into wrapper

  var style = {
    zIndex: isDragging ? 9999 : "auto",
    opacity: isDragging ? 0.8 : 1,
    transform: _utilities.CSS.Translate.toString(transform),
    transition: transition
  };
  return /*#__PURE__*/_react["default"].createElement("div", _extends({
    ref: setNodeRef,
    style: style
  }, attributes), /*#__PURE__*/_react["default"].createElement(WrappedComponent, _extends({
    index: index,
    dragHandleProps: stableListeners
  }, entry, extraProps)));
});