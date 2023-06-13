"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TileMenubar = exports.ProjectMenubar = exports.ListMenubar = exports.LibraryMenubar = exports.CollectionMenubar = exports.CodeMenubar = exports.AllMenubar = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _menu_utilities = require("./menu_utilities.js");
var _utilities_react = require("./utilities_react");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); } // noinspection JSCheckFunctionSignatures
var LibraryMenubar = /*#__PURE__*/function (_React$Component) {
  _inherits(LibraryMenubar, _React$Component);
  var _super = _createSuper(LibraryMenubar);
  function LibraryMenubar() {
    _classCallCheck(this, LibraryMenubar);
    return _super.apply(this, arguments);
  }
  _createClass(LibraryMenubar, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.context_menu_items) {
        this.props.sendContextMenuItems(this.props.context_menu_items);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var outer_style = {
        display: "flex",
        flexDirection: "row",
        position: "relative",
        left: this.props.left_position,
        marginBottom: 10
      };
      var disabled_items = [];
      if (this.props.multi_select) {
        for (var menu_name in this.props.menu_specs) {
          var _iterator = _createForOfIteratorHelper(this.props.menu_specs[menu_name]),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var menu_item = _step.value;
              if (!menu_item.multi_select) {
                disabled_items.push(menu_item.name_text);
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
      }
      for (var _menu_name in this.props.menu_specs) {
        if (this.props.multi_select) {
          var _iterator2 = _createForOfIteratorHelper(this.props.menu_specs[_menu_name]),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var _menu_item = _step2.value;
              if (!_menu_item.multi_select) {
                disabled_items.push(_menu_item.name_text);
              } else if (_menu_item.res_type && this.props.selected_type == "multi") {
                disabled_items.push(_menu_item.name_text);
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        } else {
          var _iterator3 = _createForOfIteratorHelper(this.props.menu_specs[_menu_name]),
            _step3;
          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var _menu_item2 = _step3.value;
              if (_menu_item2.res_type && _menu_item2.res_type != this.props.selected_type) {
                disabled_items.push(_menu_item2.name_text);
              } else if (_menu_item2.reqs) {
                for (var param in _menu_item2.reqs) {
                  if (!(param in this.props.selected_resource) || !(this.props.selected_resource[param] == _menu_item2.reqs[param])) {
                    disabled_items.push(_menu_item2.name_text);
                  }
                }
              }
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
        }
      }
      return /*#__PURE__*/_react["default"].createElement(_menu_utilities.TacticMenubar, {
        menu_specs: this.props.menu_specs,
        registerOmniGetter: this.props.registerOmniGetter,
        dark_theme: this.props.dark_theme,
        showRefresh: true,
        showClose: false,
        refreshTab: this.props.refreshTab,
        closeTab: null,
        disabled_items: disabled_items,
        resource_name: "",
        resource_icon: this.props.resource_icon,
        showErrorDrawerButton: this.props.showErrorDrawerButton,
        toggleErrorDrawer: this.props.toggleErrorDrawer
      });
    }
  }]);
  return LibraryMenubar;
}(_react["default"].Component);
exports.LibraryMenubar = LibraryMenubar;
LibraryMenubar.propTypes = {
  sendContextMenuItems: _propTypes["default"].func,
  menu_specs: _propTypes["default"].object,
  multi_select: _propTypes["default"].bool,
  selected_type: _propTypes["default"].string,
  dark_theme: _propTypes["default"].bool,
  refreshTab: _propTypes["default"].func,
  showErrorDrawerButton: _propTypes["default"].bool,
  toggleErrorDrawer: _propTypes["default"].func,
  resource_icon: _propTypes["default"].string
};
LibraryMenubar.defaultProps = {
  toggleErrorDrawer: null,
  resource_icon: null
};
var specializedMenubarPropTypes = {
  sendContextMenuItems: _propTypes["default"].func,
  view_func: _propTypes["default"].func,
  view_resource: _propTypes["default"].func,
  duplicate_func: _propTypes["default"].func,
  delete_func: _propTypes["default"].func,
  rename_func: _propTypes["default"].func,
  refresh_func: _propTypes["default"].func,
  send_repository_func: _propTypes["default"].func,
  selected_resource: _propTypes["default"].object,
  list_of_selected: _propTypes["default"].array,
  muti_select: _propTypes["default"].bool,
  add_new_row: _propTypes["default"].func
};
var AllMenubar = /*#__PURE__*/function (_React$Component2) {
  _inherits(AllMenubar, _React$Component2);
  var _super2 = _createSuper(AllMenubar);
  function AllMenubar(props) {
    var _this;
    _classCallCheck(this, AllMenubar);
    _this = _super2.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    return _this;
  }
  _createClass(AllMenubar, [{
    key: "context_menu_items",
    get: function get() {
      var _this2 = this;
      var menu_items = [{
        text: "open",
        icon: "document-open",
        onClick: this.props.view_resource
      }];
      if (window.in_context) {
        menu_items.push({
          text: "open in separate tab",
          icon: "document-open",
          onClick: function onClick(resource) {
            _this2.props.view_resource(resource, null, true);
          }
        });
      }
      menu_items = menu_items.concat([{
        text: "__divider__"
      }, {
        text: "rename",
        icon: "edit",
        onClick: this.props.rename_func
      }, {
        text: "duplicate",
        icon: "duplicate",
        onClick: this.props.duplicate_func
      }, {
        text: "__divider__"
      }, {
        text: "load",
        icon: "upload",
        onClick: this.props.load_tile,
        res_type: "tile"
      }, {
        text: "unload",
        icon: "undo",
        onClick: this.props.unload_module,
        res_type: "tile"
      }, {
        text: "__divider__"
      }, {
        text: "delete",
        icon: "trash",
        onClick: this.props.delete_func,
        intent: "danger"
      }]);
      return menu_items;
    }
  }, {
    key: "menu_specs",
    get: function get() {
      var _this3 = this;
      var self = this;
      var ms = {
        New: [{
          name_text: "New Notebook",
          icon_name: "new-text-box",
          click_handler: this.props.new_notebook
        }, {
          name_text: "divider1",
          icon_name: null,
          click_handler: "divider"
        }, {
          name_text: "Standard Tile",
          icon_name: "code",
          click_handler: function click_handler() {
            _this3.props.new_in_creator("BasicTileTemplate");
          }
        }, {
          name_text: "Matplotlib Tile",
          icon_name: "timeline-line-chart",
          click_handler: function click_handler() {
            _this3.props.new_in_creator("MatplotlibTileTemplate");
          }
        }, {
          name_text: "Javascript Tile",
          icon_name: "timeline-area-chart",
          click_handler: function click_handler() {
            _this3.props.new_in_creator("JSTileTemplate");
          }
        }, {
          name_text: "divider2",
          icon_name: null,
          click_handler: "divider"
        }, {
          name_text: "New List",
          icon_name: "new-text-box",
          click_handler: function click_handler() {
            _this3.props.new_list("nltk-english");
          }
        }, {
          name_text: "New Code",
          icon_name: "new-text-box",
          click_handler: function click_handler() {
            _this3.props.new_code("BasicCodeTemplate");
          }
        }],
        Open: [{
          name_text: "Open",
          icon_name: "document-open",
          click_handler: function click_handler() {
            self.props.view_func();
          },
          key_bindings: ["ctrl+o", "return"]
        }, {
          name_text: "Open In Separate Tab",
          icon_name: "document-share",
          click_handler: function click_handler() {
            self.props.view_resource(self.props.selected_resource, null, true);
          }
        }, {
          name_text: "Open As Raw Html",
          icon_name: "document-share",
          click_handler: function click_handler() {
            self.props.open_raw(self.props.selected_resource);
          },
          res_type: "collection"
        }, {
          name_text: "divider1",
          icon_name: null,
          click_handler: "divider"
        }, {
          name_text: "Open In Creator",
          icon_name: "document-open",
          click_handler: this.props.creator_view,
          res_type: "tile"
        }, {
          name_text: "Edit Raw Tile",
          icon_name: "document-open",
          click_handler: this.props.tile_view,
          res_type: "tile"
        }],
        Edit: [{
          name_text: "Rename Resource",
          icon_name: "edit",
          click_handler: function click_handler() {
            self.props.rename_func();
          }
        }, {
          name_text: "Duplicate Resource",
          icon_name: "duplicate",
          click_handler: function click_handler() {
            self.props.duplicate_func();
          }
        }, {
          name_text: "Delete Resources",
          icon_name: "trash",
          click_handler: function click_handler() {
            self.props.delete_func();
          },
          multi_select: true
        }, {
          name_text: "divider1",
          icon_name: null,
          click_handler: "divider"
        }, {
          name_text: "Combine Collections",
          icon_name: "merge-columns",
          click_handler: self.props.combineCollections,
          multi_select: true,
          res_type: "collection"
        }],
        Load: [{
          name_text: "Load",
          icon_name: "upload",
          click_handler: function click_handler() {
            _this3.props.load_tile();
          },
          res_type: "tile"
        }, {
          name_text: "Unload",
          icon_name: "undo",
          click_handler: function click_handler() {
            _this3.props.unload_module();
          },
          res_type: "tile"
        }, {
          name_text: "Reset",
          icon_name: "reset",
          click_handler: this.props.unload_all_tiles,
          res_type: "tile"
        }],
        Compare: [{
          name_text: "View History",
          icon_name: "history",
          click_handler: this.props.showHistoryViewer,
          res_type: "tile"
        }, {
          name_text: "Compare to Other Modules",
          icon_name: "comparison",
          click_handler: this.props.compare_tiles,
          multi_select: true,
          res_type: "tile"
        }],
        Transfer: [{
          name_text: "Import Data",
          icon_name: "cloud-upload",
          click_handler: self.props.showCollectionImport
        }, {
          name_text: "Download Collection",
          icon_name: "download",
          click_handler: function click_handler() {
            _this3.props.downloadCollection();
          },
          res_type: "collection"
        }, {
          name_text: "divider1",
          icon_name: null,
          click_handler: "divider"
        }, {
          name_text: "Import Jupyter Notebook",
          icon_name: "cloud-upload",
          click_handler: self.props.showJupyterImport
        }, {
          name_text: "Import List",
          icon_name: "cloud-upload",
          click_handler: this.props.showListImport
        }, {
          name_text: "Download As Jupyter Notebook",
          icon_name: "download",
          click_handler: self.props.downloadJupyter,
          res_type: "project",
          reqs: {
            type: "jupyter"
          }
        }, {
          name_text: "divider2",
          icon_name: null,
          click_handler: "divider"
        }, {
          name_text: "Share to repository",
          icon_name: "share",
          click_handler: this.props.send_repository_func,
          multi_select: true
        }]
      };
      for (var _i = 0, _Object$entries = Object.entries(ms); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          menu_name = _Object$entries$_i[0],
          menu = _Object$entries$_i[1];
        var _iterator4 = _createForOfIteratorHelper(menu),
          _step4;
        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var but = _step4.value;
            if (!but.name_text.startsWith("divider")) {
              but.click_handler = but.click_handler.bind(this);
            }
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      }
      return ms;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(LibraryMenubar, {
        sendContextMenuItems: this.props.sendContextMenuItems,
        registerOmniGetter: this.props.registerOmniGetter,
        context_menu_items: this.context_menu_items,
        selected_rows: this.props.selected_rows,
        selected_type: this.props.selected_type,
        selected_resource: this.props.selected_resource,
        resource_icon: _blueprint_mdata_fields.icon_dict["all"],
        menu_specs: this.menu_specs,
        multi_select: this.props.multi_select,
        dark_theme: this.props.dark_theme,
        controlled: this.props.controlled,
        am_selected: this.props.am_selected,
        tsocket: this.props.tsocket,
        refreshTab: this.props.refresh_func,
        closeTab: null,
        resource_name: "",
        showErrorDrawerButton: true,
        toggleErrorDrawer: this.props.toggleErrorDrawer
      });
    }
  }]);
  return AllMenubar;
}(_react["default"].Component);
exports.AllMenubar = AllMenubar;
AllMenubar.propTypes = specializedMenubarPropTypes;
var CollectionMenubar = /*#__PURE__*/function (_React$Component3) {
  _inherits(CollectionMenubar, _React$Component3);
  var _super3 = _createSuper(CollectionMenubar);
  function CollectionMenubar(props) {
    var _this4;
    _classCallCheck(this, CollectionMenubar);
    _this4 = _super3.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this4));
    _this4.upload_name = null;
    return _this4;
  }
  _createClass(CollectionMenubar, [{
    key: "menu_specs",
    get: function get() {
      var _this5 = this;
      var self = this;
      var ms = {
        Open: [{
          name_text: "Open",
          icon_name: "document-open",
          click_handler: function click_handler() {
            self.props.view_func();
          },
          key_bindings: ["ctrl+o", "return"]
        }, {
          name_text: "Open In Separate Tab",
          icon_name: "document-share",
          click_handler: function click_handler() {
            self.props.view_resource(self.props.selected_resource, null, true);
          }
        }],
        Edit: [{
          name_text: "Rename Collection",
          icon_name: "edit",
          click_handler: function click_handler() {
            self.props.rename_func();
          }
        }, {
          name_text: "Duplicate Collection",
          icon_name: "duplicate",
          click_handler: function click_handler() {
            _this5.props.duplicate_func();
          }
        }, {
          name_text: "Combine Collections",
          icon_name: "merge-columns",
          click_handler: this.props.combineCollections,
          multi_select: true
        }, {
          name_text: "Delete Collections",
          icon_name: "trash",
          click_handler: function click_handler() {
            _this5.delete_func();
          },
          multi_select: true
        }],
        Transfer: [{
          name_text: "Import Data",
          icon_name: "cloud-upload",
          click_handler: this.props.showCollectionImport
        }, {
          name_text: "Download Collection",
          icon_name: "download",
          click_handler: function click_handler() {
            _this5.props.downloadCollection();
          }
        }, {
          name_text: "Share to repository",
          icon_name: "share",
          click_handler: this.props.send_repository_func,
          multi_select: true
        }]
      };
      for (var _i2 = 0, _Object$entries2 = Object.entries(ms); _i2 < _Object$entries2.length; _i2++) {
        var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
          menu_name = _Object$entries2$_i[0],
          menu = _Object$entries2$_i[1];
        var _iterator5 = _createForOfIteratorHelper(menu),
          _step5;
        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var but = _step5.value;
            but.click_handler = but.click_handler.bind(this);
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      }
      return ms;
    }
  }, {
    key: "context_menu_items",
    get: function get() {
      var _this6 = this;
      var menu_items = [{
        text: "open",
        icon: "document-open",
        onClick: this.props.view_resource
      }];
      if (window.in_context) {
        menu_items.push({
          text: "open in separate tab",
          icon: "document-open",
          onClick: function onClick(resource) {
            _this6.props.view_resource(resource, null, true);
          }
        });
      }
      menu_items = menu_items.concat([{
        text: "__divider__"
      }, {
        text: "rename",
        icon: "edit",
        onClick: this.props.rename_func
      }, {
        text: "duplicate",
        icon: "duplicate",
        onClick: this.props.duplicate_func
      }, {
        text: "__divider__"
      }, {
        text: "download",
        icon: "cloud-download",
        onClick: this._downloadCollection
      }, {
        text: "__divider__"
      }, {
        text: "delete",
        icon: "trash",
        onClick: this.delete_func,
        intent: "danger"
      }]);
      return menu_items;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(LibraryMenubar, {
        sendContextMenuItems: this.props.sendContextMenuItems,
        menu_specs: this.menu_specs,
        resource_icon: _blueprint_mdata_fields.icon_dict["collection"],
        context_menu_items: this.context_menu_items,
        multi_select: this.props.multi_select,
        selected_rows: this.props.selected_rows,
        selected_type: this.props.selected_type,
        dark_theme: this.props.dark_theme,
        controlled: this.props.controlled,
        am_selected: this.props.am_selected,
        refreshTab: this.props.refresh_func,
        closeTab: null,
        resource_name: "",
        showErrorDrawerButton: true,
        toggleErrorDrawer: this.props.toggleErrorDrawer
      });
    }
  }]);
  return CollectionMenubar;
}(_react["default"].Component);
exports.CollectionMenubar = CollectionMenubar;
CollectionMenubar.propTypes = specializedMenubarPropTypes;
var ProjectMenubar = /*#__PURE__*/function (_React$Component4) {
  _inherits(ProjectMenubar, _React$Component4);
  var _super4 = _createSuper(ProjectMenubar);
  function ProjectMenubar(props) {
    var _this7;
    _classCallCheck(this, ProjectMenubar);
    _this7 = _super4.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this7));
    return _this7;
  }
  _createClass(ProjectMenubar, [{
    key: "context_menu_items",
    get: function get() {
      var _this8 = this;
      var menu_items = [{
        text: "open",
        icon: "document-open",
        onClick: this.props.view_resource
      }];
      if (window.in_context) {
        menu_items.push({
          text: "open in separate tab",
          icon: "document-open",
          onClick: function onClick(resource) {
            _this8.props.view_resource(resource, null, true);
          }
        });
      }
      menu_items = menu_items.concat([{
        text: "__divider__"
      }, {
        text: "rename",
        icon: "edit",
        onClick: this.props.rename_func
      }, {
        text: "duplicate",
        icon: "duplicate",
        onClick: this.props.duplicate_func
      }, {
        text: "__divider__"
      }, {
        text: "delete",
        icon: "trash",
        onClick: this._project_delete,
        intent: "danger"
      }]);
      return menu_items;
    }
  }, {
    key: "menu_specs",
    get: function get() {
      var self = this;
      var ms = {
        Open: [{
          name_text: "Open",
          icon_name: "document-open",
          click_handler: function click_handler() {
            self.props.view_func();
          },
          key_bindings: ["ctrl+o", "return"]
        }, {
          name_text: "Open In Separate Tab",
          icon_name: "document-share",
          click_handler: function click_handler() {
            self.props.view_resource(self.props.selected_resource, null, true);
          }
        }, {
          name_text: "New Notebook",
          icon_name: "new-text-box",
          click_handler: this.props.new_notebook,
          key_bindings: ["ctrl+n"]
        }],
        Edit: [{
          name_text: "Rename Project",
          icon_name: "edit",
          click_handler: function click_handler() {
            self.props.rename_func();
          }
        }, {
          name_text: "Duplicate Project",
          icon_name: "duplicate",
          click_handler: function click_handler() {
            self.props.duplicate_func();
          }
        }, {
          name_text: "Delete Projects",
          icon_name: "trash",
          click_handler: function click_handler() {
            self.props.delete_func();
          },
          multi_select: true
        }],
        Transfer: [{
          name_text: "Import Jupyter Notebook",
          icon_name: "cloud-upload",
          click_handler: self.props.showJupyterImport
        }, {
          name_text: "Download As Jupyter Notebook",
          icon_name: "download",
          click_handler: self.props.downloadJupyter
        }, {
          name_text: "Share To Repository",
          icon_name: "share",
          click_handler: this.props.send_repository_func,
          multi_select: true
        }]
      };
      for (var _i3 = 0, _Object$entries3 = Object.entries(ms); _i3 < _Object$entries3.length; _i3++) {
        var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i3], 2),
          menu_name = _Object$entries3$_i[0],
          menu = _Object$entries3$_i[1];
        var _iterator6 = _createForOfIteratorHelper(menu),
          _step6;
        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var but = _step6.value;
            but.click_handler = but.click_handler.bind(this);
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }
      }
      return ms;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(LibraryMenubar, {
        sendContextMenuItems: this.props.sendContextMenuItems,
        context_menu_items: this.context_menu_items,
        resource_icon: _blueprint_mdata_fields.icon_dict["project"],
        menu_specs: this.menu_specs,
        selected_rows: this.props.selected_rows,
        selected_type: this.props.selected_type,
        multi_select: this.props.multi_select,
        dark_theme: this.props.dark_theme,
        controlled: this.props.controlled,
        am_selected: this.props.am_selected,
        refreshTab: this.props.refresh_func,
        closeTab: null,
        resource_name: "",
        showErrorDrawerButton: true,
        toggleErrorDrawer: this.props.toggleErrorDrawer
      });
    }
  }]);
  return ProjectMenubar;
}(_react["default"].Component);
exports.ProjectMenubar = ProjectMenubar;
ProjectMenubar.propTypes = specializedMenubarPropTypes;
var TileMenubar = /*#__PURE__*/function (_React$Component5) {
  _inherits(TileMenubar, _React$Component5);
  var _super5 = _createSuper(TileMenubar);
  function TileMenubar(props) {
    var _this9;
    _classCallCheck(this, TileMenubar);
    _this9 = _super5.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this9));
    return _this9;
  }
  _createClass(TileMenubar, [{
    key: "context_menu_items",
    get: function get() {
      var _this10 = this;
      var menu_items = [{
        text: "edit",
        icon: "edit",
        onClick: this._view_named_tile
      }, {
        text: "edit in creator",
        icon: "annotation",
        onClick: this._creator_view_named_tile
      }];
      if (window.in_context) {
        menu_items.push({
          text: "edit in separate tab",
          icon: "edit",
          onClick: function onClick(resource) {
            _this10._view_named_tile(resource, true);
          }
        });
        menu_items.push({
          text: "edit in creator in separate tab",
          icon: "annotation",
          onClick: function onClick(resource) {
            _this10._creator_view_named_tile(resource, true);
          }
        });
      }
      menu_items = menu_items.concat([{
        text: "__divider__"
      }, {
        text: "load",
        icon: "upload",
        onClick: this._load_tile
      }, {
        text: "unload",
        icon: "undo",
        onClick: this._unload_module
      }, {
        text: "__divider__"
      }, {
        text: "rename",
        icon: "edit",
        onClick: this.props.rename_func
      }, {
        text: "duplicate",
        icon: "duplicate",
        onClick: this.props.duplicate_func
      }, {
        text: "__divider__"
      }, {
        text: "delete",
        icon: "trash",
        onClick: this.props.delete_func,
        intent: "danger"
      }]);
      return menu_items;
    }
  }, {
    key: "menu_specs",
    get: function get() {
      var _this11 = this;
      var self = this;
      var ms = {
        New: [{
          name_text: "Standard Tile",
          icon_name: "code",
          click_handler: function click_handler() {
            _this11.props.new_in_creator("BasicTileTemplate");
          },
          key_bindings: ["ctrl+n"]
        }, {
          name_text: "Matplotlib Tile",
          icon_name: "timeline-line-chart",
          click_handler: function click_handler() {
            _this11.props.new_in_creator("MatplotlibTileTemplate");
          }
        }, {
          name_text: "Javascript Tile",
          icon_name: "timeline-area-chart",
          click_handler: function click_handler() {
            _this11.props.new_in_creator("JSTileTemplate");
          }
        }],
        Open: [{
          name_text: "Open In Creator",
          icon_name: "document-open",
          click_handler: this.props.creator_view,
          key_bindings: ["ctrl+o", "return"]
        }, {
          name_text: "Open In Viewer",
          icon_name: "document-open",
          click_handler: this.props.tile_view
        }, {
          name_text: "Open In Creator in New Tab",
          icon_name: "document-share",
          click_handler: function click_handler() {
            self.props.creator_view_named_tile(self.props.selected_resource.name, true);
          }
        }, {
          name_text: "Open in Viewer in New Tab",
          icon_name: "document-share",
          click_handler: function click_handler() {
            self.props.view_named_tile(self.props.selected_resource.name, true);
          }
        }],
        Edit: [{
          name_text: "Rename Tile",
          icon_name: "edit",
          click_handler: function click_handler() {
            self.props.rename_func();
          }
        }, {
          name_text: "Duplicate Tile",
          icon_name: "duplicate",
          click_handler: function click_handler() {
            self.props.duplicate_func();
          }
        }, {
          name_text: "Delete Tiles",
          icon_name: "trash",
          click_handler: function click_handler() {
            self.props.delete_func();
          },
          multi_select: true
        }],
        Load: [{
          name_text: "Load",
          icon_name: "upload",
          click_handler: function click_handler() {
            _this11.props.load_tile();
          }
        }, {
          name_text: "Unload",
          icon_name: "undo",
          click_handler: function click_handler() {
            _this11.props.unload_module();
          }
        }, {
          name_text: "Reset",
          icon_name: "reset",
          click_handler: this.props.unload_all_tiles
        }],
        Compare: [{
          name_text: "View History",
          icon_name: "history",
          click_handler: this.props.showHistoryViewer,
          tooltip: "Show history viewer"
        }, {
          name_text: "Compare to Other Modules",
          icon_name: "comparison",
          click_handler: this.props.compare_tiles,
          multi_select: true,
          tooltip: "Compare to another tile"
        }],
        Transfer: [{
          name_text: "Share To Repository",
          icon_name: "share",
          click_handler: this.props.send_repository_func,
          multi_select: true
        }]
      };
      for (var _i4 = 0, _Object$entries4 = Object.entries(ms); _i4 < _Object$entries4.length; _i4++) {
        var _Object$entries4$_i = _slicedToArray(_Object$entries4[_i4], 2),
          menu_name = _Object$entries4$_i[0],
          menu = _Object$entries4$_i[1];
        var _iterator7 = _createForOfIteratorHelper(menu),
          _step7;
        try {
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            var but = _step7.value;
            but.click_handler = but.click_handler.bind(this);
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }
      }
      return ms;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(LibraryMenubar, {
        sendContextMenuItems: this.props.sendContextMenuItems,
        context_menu_items: this.context_menu_items,
        resource_icon: _blueprint_mdata_fields.icon_dict["tile"],
        menu_specs: this.menu_specs,
        selected_rows: this.props.selected_rows,
        selected_type: this.props.selected_type,
        multi_select: this.props.multi_select,
        dark_theme: this.props.dark_theme,
        controlled: this.props.controlled,
        am_selected: this.props.am_selected,
        tsocket: this.props.tsocket,
        refreshTab: this.props.refresh_func,
        closeTab: null,
        resource_name: "",
        showErrorDrawerButton: true,
        toggleErrorDrawer: this.props.toggleErrorDrawer
      });
    }
  }]);
  return TileMenubar;
}(_react["default"].Component);
exports.TileMenubar = TileMenubar;
TileMenubar.propTypes = specializedMenubarPropTypes;
var ListMenubar = /*#__PURE__*/function (_React$Component6) {
  _inherits(ListMenubar, _React$Component6);
  var _super6 = _createSuper(ListMenubar);
  function ListMenubar(props) {
    var _this12;
    _classCallCheck(this, ListMenubar);
    _this12 = _super6.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this12));
    return _this12;
  }
  _createClass(ListMenubar, [{
    key: "context_menu_items",
    get: function get() {
      var _this13 = this;
      var menu_items = [{
        text: "edit",
        icon: "document-open",
        onClick: this.props.view_func
      }];
      if (window.in_context) {
        menu_items.push({
          text: "open in separate tab",
          icon: "document-open",
          onClick: function onClick(resource) {
            _this13.props.view_resource(resource, null, true);
          }
        });
      }
      menu_items = menu_items.concat([{
        text: "__divider__"
      }, {
        text: "rename",
        icon: "edit",
        onClick: this.props.rename_func
      }, {
        text: "duplicate",
        icon: "duplicate",
        onClick: this.props.duplicate_func
      }, {
        text: "__divider__"
      }, {
        text: "delete",
        icon: "trash",
        onClick: this.props.delete_func,
        intent: "danger"
      }]);
      return menu_items;
    }
  }, {
    key: "menu_specs",
    get: function get() {
      var _this14 = this;
      var self = this;
      var ms = {
        Open: [{
          name_text: "New",
          icon_name: "new-text-box",
          click_handler: function click_handler() {
            _this14.props.new_list("nltk-english");
          }
        }, {
          name_text: "Open",
          icon_name: "document-open",
          click_handler: function click_handler() {
            self.props.view_func();
          },
          key_bindings: ["ctrl+o", "return"]
        }, {
          name_text: "Open In Separate Tab",
          icon_name: "document-share",
          click_handler: function click_handler() {
            self.props.view_resource(self.props.selected_resource, null, true);
          }
        }],
        Edit: [{
          name_text: "Rename List",
          icon_name: "edit",
          click_handler: function click_handler() {
            self.props.rename_func();
          }
        }, {
          name_text: "Duplicate List",
          icon_name: "duplicate",
          click_handler: function click_handler() {
            self.props.duplicate_func();
          }
        }, {
          name_text: "Delete Lists",
          icon_name: "trash",
          click_handler: function click_handler() {
            self.props.delete_func();
          },
          multi_select: true
        }],
        Transfer: [{
          name_text: "Import List",
          icon_name: "cloud-upload",
          click_handler: this.props.showListImport
        }, {
          name_text: "Share to repository",
          icon_name: "share",
          click_handler: this.props.send_repository_func,
          multi_select: true
        }]
      };
      for (var _i5 = 0, _Object$entries5 = Object.entries(ms); _i5 < _Object$entries5.length; _i5++) {
        var _Object$entries5$_i = _slicedToArray(_Object$entries5[_i5], 2),
          menu_name = _Object$entries5$_i[0],
          menu = _Object$entries5$_i[1];
        var _iterator8 = _createForOfIteratorHelper(menu),
          _step8;
        try {
          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var but = _step8.value;
            but.click_handler = but.click_handler.bind(this);
          }
        } catch (err) {
          _iterator8.e(err);
        } finally {
          _iterator8.f();
        }
      }
      return ms;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(LibraryMenubar, {
        sendContextMenuItems: this.props.sendContextMenuItems,
        context_menu_items: this.context_menu_items,
        selected_rows: this.props.selected_rows,
        selected_type: this.props.selected_type,
        resource_icon: _blueprint_mdata_fields.icon_dict["list"],
        menu_specs: this.menu_specs,
        multi_select: this.props.multi_select,
        dark_theme: this.props.dark_theme,
        controlled: this.props.controlled,
        am_selected: this.props.am_selected,
        tsocket: this.props.tsocket,
        refreshTab: this.props.refresh_func,
        closeTab: null,
        resource_name: "",
        showErrorDrawerButton: true,
        toggleErrorDrawer: this.props.toggleErrorDrawer
      });
    }
  }]);
  return ListMenubar;
}(_react["default"].Component);
exports.ListMenubar = ListMenubar;
ListMenubar.propTypes = specializedMenubarPropTypes;
var CodeMenubar = /*#__PURE__*/function (_React$Component7) {
  _inherits(CodeMenubar, _React$Component7);
  var _super7 = _createSuper(CodeMenubar);
  function CodeMenubar(props) {
    var _this15;
    _classCallCheck(this, CodeMenubar);
    _this15 = _super7.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this15));
    return _this15;
  }
  _createClass(CodeMenubar, [{
    key: "context_menu_items",
    get: function get() {
      var _this16 = this;
      var menu_items = [{
        text: "edit",
        icon: "document-open",
        onClick: this.props.view_resource
      }];
      if (window.in_context) {
        menu_items.push({
          text: "open in separate tab",
          icon: "document-open",
          onClick: function onClick(resource) {
            _this16.props.view_resource(resource, null, true);
          }
        });
      }
      menu_items = menu_items.concat([{
        text: "__divider__"
      }, {
        text: "rename",
        icon: "edit",
        onClick: this.props.rename_func
      }, {
        text: "duplicate",
        icon: "duplicate",
        onClick: this.props.duplicate_func
      }, {
        text: "__divider__"
      }, {
        text: "delete",
        icon: "trash",
        onClick: this.props.delete_func,
        intent: "danger"
      }]);
      return menu_items;
    }
  }, {
    key: "menu_specs",
    get: function get() {
      var _this17 = this;
      var self = this;
      var ms = {
        Open: [{
          name_text: "New",
          icon_name: "new-text-box",
          click_handler: function click_handler() {
            _this17.props.new_code("BasicCodeTemplate");
          }
        }, {
          name_text: "Open",
          icon_name: "document-open",
          click_handler: function click_handler() {
            self.props.view_func();
          },
          key_bindings: ["ctrl+o", "return"]
        }, {
          name_text: "Open In Separate Tab",
          icon_name: "document-share",
          click_handler: function click_handler() {
            self.props.view_resource(self.props.selected_resource, null, true);
          }
        }],
        Edit: [{
          name_text: "Rename Code",
          icon_name: "edit",
          click_handler: function click_handler() {
            self.props.rename_func();
          }
        }, {
          name_text: "Duplicate Code",
          icon_name: "duplicate",
          click_handler: function click_handler() {
            self.props.duplicate_func();
          }
        }, {
          name_text: "Delete Code",
          icon_name: "trash",
          click_handler: function click_handler() {
            self.props.delete_func();
          },
          multi_select: true
        }],
        Transfer: [{
          name_text: "Share to repository",
          icon_name: "share",
          click_handler: self.props.send_repository_func,
          multi_select: true
        }]
      };
      for (var _i6 = 0, _Object$entries6 = Object.entries(ms); _i6 < _Object$entries6.length; _i6++) {
        var _Object$entries6$_i = _slicedToArray(_Object$entries6[_i6], 2),
          menu_name = _Object$entries6$_i[0],
          menu = _Object$entries6$_i[1];
        var _iterator9 = _createForOfIteratorHelper(menu),
          _step9;
        try {
          for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
            var but = _step9.value;
            but.click_handler = but.click_handler.bind(this);
          }
        } catch (err) {
          _iterator9.e(err);
        } finally {
          _iterator9.f();
        }
      }
      return ms;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(LibraryMenubar, {
        sendContextMenuItems: this.props.sendContextMenuItems,
        context_menu_items: this.context_menu_items,
        resource_icon: _blueprint_mdata_fields.icon_dict["code"],
        selected_rows: this.props.selected_rows,
        selected_type: this.props.selected_type,
        menu_specs: this.menu_specs,
        multi_select: this.props.multi_select,
        dark_theme: this.props.dark_theme,
        controlled: this.props.controlled,
        am_selected: this.props.am_selected,
        tsocket: this.props.tsocket,
        refreshTab: this.props.refresh_func,
        closeTab: null,
        resource_name: "",
        showErrorDrawerButton: true,
        toggleErrorDrawer: this.props.toggleErrorDrawer
      });
    }
  }]);
  return CodeMenubar;
}(_react["default"].Component);
exports.CodeMenubar = CodeMenubar;
CodeMenubar.propTypes = specializedMenubarPropTypes;