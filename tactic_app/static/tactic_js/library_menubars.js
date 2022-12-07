"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LibraryMenubar = exports.CodeMenubar = exports.ListMenubar = exports.TileMenubar = exports.ProjectMenubar = exports.CollectionMenubar = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _menu_utilities = require("./menu_utilities.js");

var _utilities_react = require("./utilities_react");

var _modal_react = require("./modal_react");

var _toaster = require("./toaster");

var _communication_react = require("./communication_react");

var _import_dialog = require("./import_dialog");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

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

      return /*#__PURE__*/_react["default"].createElement(_menu_utilities.TacticMenubar, {
        menu_specs: this.props.menu_specs,
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

var CollectionMenubar = /*#__PURE__*/function (_React$Component2) {
  _inherits(CollectionMenubar, _React$Component2);

  var _super2 = _createSuper(CollectionMenubar);

  function CollectionMenubar(props) {
    var _this;

    _classCallCheck(this, CollectionMenubar);

    _this = _super2.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    _this.upload_name = null;
    return _this;
  }

  _createClass(CollectionMenubar, [{
    key: "_collection_duplicate",
    value: function _collection_duplicate() {
      var resource_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.props.duplicate_func("/duplicate_collection", resource_name);
    }
  }, {
    key: "_collection_delete",
    value: function _collection_delete() {
      var resource_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.props.delete_func("/delete_collection", resource_name);
    }
  }, {
    key: "_upgrade_collections",
    value: function _upgrade_collections() {
      $.getJSON("".concat($SCRIPT_ROOT, "/upgrade_user_collections"));
    }
  }, {
    key: "_remove_duplicates",
    value: function _remove_duplicates() {
      $.getJSON("".concat($SCRIPT_ROOT, "/remove_duplicate_collections"));
    }
  }, {
    key: "_combineCollections",
    value: function _combineCollections() {
      var res_name = this.props.selected_resource.name;
      var self = this;

      if (!this.props.multi_select) {
        var doTheCombine = function doTheCombine(other_name) {
          self.props.startSpinner(true);
          var target = "".concat($SCRIPT_ROOT, "/combine_collections/").concat(res_name, "/").concat(other_name);
          $.post(target, function (data) {
            self.props.stopSpinner();

            if (!data.success) {
              self.props.addErrorDrawerEntry({
                title: "Error combining collections",
                content: data.message
              });
            } else {
              (0, _toaster.doFlash)(data);
            }
          });
        };

        $.getJSON("".concat($SCRIPT_ROOT, "get_resource_names/collection"), function (data) {
          (0, _modal_react.showSelectDialog)("Select a new collection to combine with " + res_name, "Collection to Combine", "Cancel", "Combine", doTheCombine, data["resource_names"]);
        });
      } else {
        $.getJSON("".concat($SCRIPT_ROOT, "get_resource_names/collection"), function (data) {
          (0, _modal_react.showModalReact)("Combine Collections", "Name for combined collection", CreateCombinedCollection, "NewCollection", data["resource_names"]);
        });
      }

      function CreateCombinedCollection(new_name) {
        (0, _communication_react.postAjaxPromise)("combine_to_new_collection", {
          "original_collections": self.props.list_of_selected,
          "new_name": new_name
        }).then(function (data) {
          self.props.refresh_func();
          data.new_row;
        })["catch"](function (data) {
          self.props.addErrorDrawerEntry({
            title: "Error combining collections",
            content: data.message
          });
        });
      }
    }
  }, {
    key: "_downloadCollection",
    value: function _downloadCollection() {
      var resource_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var res_name = resource_name ? resource_name : this.props.selected_resource.name;
      (0, _modal_react.showModalReact)("Download Collection as Excel Notebook", "New File Name", function (new_name) {
        window.open("".concat($SCRIPT_ROOT, "/download_collection/") + res_name + "/" + new_name);
      }, res_name + ".xlsx");
    }
  }, {
    key: "_displayImportResults",
    value: function _displayImportResults(data) {
      var title = "Collection Created";
      var message = "";
      var number_of_errors;

      if (data.file_decoding_errors == null) {
        data.message = "No decoding errors were encounters";
        data.alert_type = "Success";
        (0, _toaster.doFlash)(data);
      } else {
        message = "<b>Decoding errors were enountered</b>";

        for (var filename in data.file_decoding_errors) {
          number_of_errors = String(data.file_decoding_errors[filename].length);
          message = message + "<br>".concat(filename, ": ").concat(number_of_errors, " errors");
        }

        this.props.addErrorDrawerEntry({
          title: title,
          content: message
        });
      }
    }
  }, {
    key: "_showImport",
    value: function _showImport() {
      (0, _import_dialog.showFileImportDialog)("collection", ".csv,.tsv,.txt,.xls,.xlsx,.html", [{
        "checkname": "import_as_freeform",
        "checktext": "Import as freeform"
      }], this._import_collection, this.props.tsocket, this.props.dark_theme, true, true);
    }
  }, {
    key: "_import_collection",
    value: function _import_collection(myDropZone, setCurrentUrl, new_name, check_results) {
      var _this2 = this;

      var csv_options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var doc_type;

      if (check_results["import_as_freeform"]) {
        doc_type = "freeform";
      } else {
        doc_type = "table";
      }

      (0, _communication_react.postAjaxPromise)("create_empty_collection", {
        "collection_name": new_name,
        "doc_type": doc_type,
        "library_id": this.props.library_id,
        "csv_options": csv_options
      }).then(function (data) {
        var new_url = "append_documents_to_collection/".concat(new_name, "/").concat(doc_type, "/").concat(_this2.props.library_id);
        myDropZone.options.url = new_url;
        setCurrentUrl(new_url);
        _this2.upload_name = new_name;
        myDropZone.processQueue();
      })["catch"](function (data) {});
    }
  }, {
    key: "menu_specs",
    get: function get() {
      var _this3 = this;

      var self = this;
      var ms = {
        Open: [{
          name_text: "Open",
          icon_name: "document-open",
          click_handler: function click_handler() {
            self.props.view_func();
          },
          key_bindings: ["space", "return", "ctrl+o"]
        }, {
          name_text: "Open In Separate Tab",
          icon_name: "document-share",
          click_handler: function click_handler() {
            self.props.view_resource(self.props.selected_resource.name, null, true);
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
            _this3._collection_duplicate();
          }
        }, {
          name_text: "Combine Collections",
          icon_name: "merge-columns",
          click_handler: this._combineCollections,
          multi_select: true
        }, {
          name_text: "Delete Collections",
          icon_name: "trash",
          click_handler: function click_handler() {
            _this3._collection_delete();
          },
          multi_select: true
        }, {
          name_text: "Upgrade All Collections",
          icon_name: "refresh",
          click_handler: function click_handler() {
            _this3._upgrade_collections();
          },
          multi_select: false
        }, {
          name_text: "Remove Duplicate Collections",
          icon_name: "refresh",
          click_handler: function click_handler() {
            _this3._remove_duplicates();
          },
          multi_select: false
        }],
        Transfer: [{
          name_text: "Import Data",
          icon_name: "cloud-upload",
          click_handler: this._showImport
        }, {
          name_text: "Download Collection",
          icon_name: "download",
          click_handler: function click_handler() {
            _this3._downloadCollection();
          }
        }, {
          name_text: "Share to repository",
          icon_name: "share",
          click_handler: this.props.send_repository_func
        }]
      };

      for (var _i = 0, _Object$entries = Object.entries(ms); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            menu_name = _Object$entries$_i[0],
            menu = _Object$entries$_i[1];

        var _iterator2 = _createForOfIteratorHelper(menu),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var but = _step2.value;
            but.click_handler = but.click_handler.bind(this);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }

      return ms;
    }
  }, {
    key: "context_menu_items",
    get: function get() {
      var _this4 = this;

      var menu_items = [{
        text: "open",
        icon: "document-open",
        onClick: this.props.view_resource
      }];

      if (window.in_context) {
        menu_items.push({
          text: "open in separate tab",
          icon: "document-open",
          onClick: function onClick(resource_name) {
            _this4.props.view_resource(resource_name, null, true);
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
        onClick: this._collection_duplicate
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
        onClick: this._collection_delete,
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
        resource_icon: "database",
        context_menu_items: this.context_menu_items,
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

  return CollectionMenubar;
}(_react["default"].Component);

exports.CollectionMenubar = CollectionMenubar;
CollectionMenubar.propTypes = specializedMenubarPropTypes;

var ProjectMenubar = /*#__PURE__*/function (_React$Component3) {
  _inherits(ProjectMenubar, _React$Component3);

  var _super3 = _createSuper(ProjectMenubar);

  function ProjectMenubar(props) {
    var _this5;

    _classCallCheck(this, ProjectMenubar);

    _this5 = _super3.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this5));
    return _this5;
  }

  _createClass(ProjectMenubar, [{
    key: "_project_duplicate",
    value: function _project_duplicate() {
      var resource_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.props.duplicate_func('/duplicate_project', resource_name);
    }
  }, {
    key: "_new_notebook",
    value: function _new_notebook() {
      var self = this;

      if (window.in_context) {
        var the_view = "".concat($SCRIPT_ROOT, "/new_notebook_in_context");
        (0, _communication_react.postAjaxPromise)(the_view, {
          resource_name: ""
        }).then(self.props.handleCreateViewer)["catch"](_toaster.doFlash);
      } else {
        window.open("".concat($SCRIPT_ROOT, "/new_notebook"));
      }
    }
  }, {
    key: "_downloadJupyter",
    value: function _downloadJupyter() {
      var res_name = this.props.selected_resource.name;
      (0, _modal_react.showModalReact)("Download Notebook as Jupyter Notebook", "New File Name", function (new_name) {
        window.open("".concat($SCRIPT_ROOT, "/download_jupyter/") + res_name + "/" + new_name);
      }, res_name + ".ipynb");
    }
  }, {
    key: "_showImport",
    value: function _showImport() {
      (0, _import_dialog.showFileImportDialog)("project", ".ipynb", [], this._import_jupyter, this.props.tsocket, this.props.dark_theme, false, false);
    }
  }, {
    key: "_import_jupyter",
    value: function _import_jupyter(myDropZone, setCurrentUrl) {
      var new_url = "import_jupyter/".concat(this.props.library_id);
      myDropZone.options.url = new_url;
      setCurrentUrl(new_url);
      myDropZone.processQueue();
    }
  }, {
    key: "_project_delete",
    value: function _project_delete() {
      var resource_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.props.delete_func("/delete_project", resource_name);
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
          onClick: function onClick(resource_name) {
            _this6.props.view_resource(resource_name, null, true);
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
        onClick: this._project_duplicate
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
      var _this7 = this;

      var self = this;
      var ms = {
        Open: [{
          name_text: "Open",
          icon_name: "document-open",
          click_handler: function click_handler() {
            self.props.view_func();
          },
          key_bindings: ["space", "return", "ctrl+o"]
        }, {
          name_text: "Open In Separate Tab",
          icon_name: "document-share",
          click_handler: function click_handler() {
            self.props.view_resource(self.props.selected_resource.name, null, true);
          }
        }, {
          name_text: "New Notebook",
          icon_name: "new-text-box",
          click_handler: this._new_notebook,
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
            _this7._project_duplicate();
          }
        }, {
          name_text: "Delete Projects",
          icon_name: "trash",
          click_handler: function click_handler() {
            _this7._project_delete();
          },
          multi_select: true
        }],
        Transfer: [{
          name_text: "Import Jupyter Notebook",
          icon_name: "cloud-upload",
          click_handler: this._showImport
        }, {
          name_text: "Download As Jupyter Notebook",
          icon_name: "download",
          click_handler: this._downloadJupyter
        }, {
          name_text: "Share To Repository",
          icon_name: "share",
          click_handler: this.props.send_repository_func
        }]
      };

      for (var _i2 = 0, _Object$entries2 = Object.entries(ms); _i2 < _Object$entries2.length; _i2++) {
        var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
            menu_name = _Object$entries2$_i[0],
            menu = _Object$entries2$_i[1];

        var _iterator3 = _createForOfIteratorHelper(menu),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var but = _step3.value;
            but.click_handler = but.click_handler.bind(this);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
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
        resource_icon: "projects",
        menu_specs: this.menu_specs,
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

var TileMenubar = /*#__PURE__*/function (_React$Component4) {
  _inherits(TileMenubar, _React$Component4);

  var _super4 = _createSuper(TileMenubar);

  function TileMenubar(props) {
    var _this8;

    _classCallCheck(this, TileMenubar);

    _this8 = _super4.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this8));
    return _this8;
  }

  _createClass(TileMenubar, [{
    key: "_tile_view",
    value: function _tile_view() {
      this.props.view_func("/view_module/");
    }
  }, {
    key: "_view_named_tile",
    value: function _view_named_tile(resource_name) {
      var in_new_tab = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      this.props.view_resource(resource_name, "/view_module/", in_new_tab);
    }
  }, {
    key: "_creator_view_named_tile",
    value: function _creator_view_named_tile(resource_name) {
      var in_new_tab = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      this.props.view_resource(resource_name, "/view_in_creator/", in_new_tab);
    }
  }, {
    key: "_creator_view",
    value: function _creator_view() {
      this.props.view_func("/view_in_creator/");
    }
  }, {
    key: "_showHistoryViewer",
    value: function _showHistoryViewer() {
      window.open("".concat($SCRIPT_ROOT, "/show_history_viewer/").concat(this.props.selected_resource.name));
    }
  }, {
    key: "_tile_duplicate",
    value: function _tile_duplicate() {
      var resource_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.props.duplicate_func('/create_duplicate_tile', resource_name);
    }
  }, {
    key: "_compare_tiles",
    value: function _compare_tiles() {
      var res_names = this.props.list_of_selected;
      if (res_names.length == 0) return;

      if (res_names.length == 1) {
        window.open("".concat($SCRIPT_ROOT, "/show_tile_differ/").concat(res_names[0]));
      } else if (res_names.length == 2) {
        window.open("".concat($SCRIPT_ROOT, "/show_tile_differ/both_names/").concat(res_names[0], "/").concat(res_names[1]));
      } else {
        (0, _toaster.doFlash)({
          "alert-type": "alert-warning",
          "message": "Select only one or two tiles before launching compare"
        });
      }
    }
  }, {
    key: "_load_tile",
    value: function _load_tile() {
      var resource_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var self = this;
      if (!resource_name) resource_name = this.props.list_of_selected[0];
      (0, _communication_react.postWithCallback)("host", "load_tile_module_task", {
        "tile_module_name": resource_name,
        "user_id": window.user_id
      }, function (data) {
        if (!data.success) {
          self.props.addErrorDrawerEntry({
            title: "Error loading tile",
            content: data.message
          });
        } else {
          (0, _toaster.doFlash)(data);
        }
      }, null, this.props.library_id);
    }
  }, {
    key: "_unload_all_tiles",
    value: function _unload_all_tiles() {
      $.getJSON("".concat($SCRIPT_ROOT, "/unload_all_tiles"), _toaster.doFlash);
    }
  }, {
    key: "_unload_module",
    value: function _unload_module() {
      var resource_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (!resource_name) resource_name = this.props.list_of_selected[0];
      $.getJSON("".concat($SCRIPT_ROOT, "/unload_one_module/").concat(resource_name), _toaster.doFlash);
    }
  }, {
    key: "_tile_delete",
    value: function _tile_delete() {
      var resource_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.props.delete_func("/delete_tile_module", resource_name);
    }
  }, {
    key: "_new_tile",
    value: function _new_tile(template_name) {
      $.getJSON($SCRIPT_ROOT + "get_resource_names/tile", function (data) {
        (0, _modal_react.showModalReact)("New Tile", "New Tile Name", CreateNewTileModule, "NewTileModule", data["resource_names"]);
      });
      var self = this;

      function CreateNewTileModule(new_name) {
        var result_dict = {
          "template_name": template_name,
          "new_res_name": new_name,
          "last_saved": "viewer"
        };
        (0, _communication_react.postAjaxPromise)("/create_tile_module", result_dict).then(function (data) {
          self.props.refresh_func();
          self.props.view_resource(String(new_name), "/view_module/");
        })["catch"](function (data) {
          self.props.addErrorDrawerEntry({
            title: "Error creating new tile",
            content: data.message
          });
        });
      }
    }
  }, {
    key: "_new_in_creator",
    value: function _new_in_creator(template_name) {
      $.getJSON("".concat($SCRIPT_ROOT, "/get_resource_names/tile"), function (data) {
        (0, _modal_react.showModalReact)("New Tile", "New Tile Name", CreateNewTileModule, "NewTileModule", data["resource_names"]);
      });
      var self = this;

      function CreateNewTileModule(new_name) {
        var result_dict = {
          "template_name": template_name,
          "new_res_name": new_name,
          "last_saved": "creator"
        };
        (0, _communication_react.postAjaxPromise)("/create_tile_module", result_dict).then(function (data) {
          self.props.refresh_func();
          self.props.view_resource(String(new_name), "/view_in_creator/");
        })["catch"](function (data) {
          self.props.addErrorDrawerEntry({
            title: "Error creating new tile",
            content: data.message
          });
        });
      }
    }
  }, {
    key: "context_menu_items",
    get: function get() {
      var _this9 = this;

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
          onClick: function onClick(resource_name) {
            _this9._view_named_tile(resource_name, true);
          }
        });
        menu_items.push({
          text: "edit in creator in separate tab",
          icon: "annotation",
          onClick: function onClick(resource_name) {
            _this9._creator_view_named_tile(resource_name, true);
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
        onClick: this._tile_duplicate
      }, {
        text: "__divider__"
      }, {
        text: "delete",
        icon: "trash",
        onClick: this._tile_delete,
        intent: "danger"
      }]);
      return menu_items;
    }
  }, {
    key: "menu_specs",
    get: function get() {
      var _this10 = this;

      var self = this;
      var ms = {
        New: [{
          name_text: "Standard Tile",
          icon_name: "code",
          click_handler: function click_handler() {
            _this10._new_in_creator("BasicTileTemplate");
          },
          key_bindings: ["ctrl+n"]
        }, {
          name_text: "Matplotlib Tile",
          icon_name: "timeline-line-chart",
          click_handler: function click_handler() {
            _this10._new_in_creator("MatplotlibTileTemplate");
          }
        }, {
          name_text: "D3Tile Tile",
          icon_name: "timeline-area-chart",
          click_handler: function click_handler() {
            _this10._new_in_creator("D3TileTemplate");
          }
        }],
        Open: [{
          name_text: "Open In Creator",
          icon_name: "document-open",
          click_handler: this._creator_view,
          key_bindings: ["space", "return", "ctrl+o"]
        }, {
          name_text: "Open In Viewer",
          icon_name: "document-open",
          click_handler: this._tile_view
        }, {
          name_text: "Open In Creator in New Tab",
          icon_name: "document-share",
          click_handler: function click_handler() {
            self._creator_view_named_tile(self.props.selected_resource.name, true);
          }
        }, {
          name_text: "Open in Viewer in New Tab",
          icon_name: "document-share",
          click_handler: function click_handler() {
            self._view_named_tile(self.props.selected_resource.name, true);
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
            _this10._tile_duplicate();
          }
        }, {
          name_text: "Delete Tiles",
          icon_name: "trash",
          click_handler: function click_handler() {
            _this10._tile_delete();
          },
          multi_select: true
        }],
        Load: [{
          name_text: "Load",
          icon_name: "upload",
          click_handler: function click_handler() {
            _this10._load_tile();
          }
        }, {
          name_text: "Unload",
          icon_name: "undo",
          click_handler: function click_handler() {
            _this10._unload_module();
          }
        }, {
          name_text: "Reset",
          icon_name: "reset",
          click_handler: this._unload_all_tiles
        }],
        Compare: [{
          name_text: "View History",
          icon_name: "history",
          click_handler: this._showHistoryViewer,
          tooltip: "Show history viewer"
        }, {
          name_text: "Compare to Other Modules",
          icon_name: "comparison",
          click_handler: this._compare_tiles,
          multi_select: true,
          tooltip: "Compare to another tile"
        }],
        Transfer: [{
          name_text: "Share To Repository",
          icon_name: "share",
          click_handler: this.props.send_repository_func
        }]
      };

      for (var _i3 = 0, _Object$entries3 = Object.entries(ms); _i3 < _Object$entries3.length; _i3++) {
        var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i3], 2),
            menu_name = _Object$entries3$_i[0],
            menu = _Object$entries3$_i[1];

        var _iterator4 = _createForOfIteratorHelper(menu),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var but = _step4.value;
            but.click_handler = but.click_handler.bind(this);
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
        context_menu_items: this.context_menu_items,
        resource_icon: "application",
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

  return TileMenubar;
}(_react["default"].Component);

exports.TileMenubar = TileMenubar;
TileMenubar.propTypes = specializedMenubarPropTypes;

var ListMenubar = /*#__PURE__*/function (_React$Component5) {
  _inherits(ListMenubar, _React$Component5);

  var _super5 = _createSuper(ListMenubar);

  function ListMenubar(props) {
    var _this11;

    _classCallCheck(this, ListMenubar);

    _this11 = _super5.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this11));
    return _this11;
  }

  _createClass(ListMenubar, [{
    key: "_new_code",
    value: function _new_code(template_name) {
      $.getJSON("".concat($SCRIPT_ROOT, "/get_resource_names/list"), function (data) {
        (0, _modal_react.showModalReact)("New List Resource", "New List Resource Name", CreateNewListResource, "NewListResource", data["resource_names"]);
      });
      var self = this;

      function CreateNewListResource(new_name) {
        var result_dict = {
          "template_name": template_name,
          "new_res_name": new_name
        };
        (0, _communication_react.postAjaxPromise)("/create_list", result_dict).then(function (data) {
          self.props.refresh_func();
          self.props.view_resource(String(new_name), "/view_list/");
        })["catch"](function (data) {
          self.props.addErrorDrawerEntry({
            title: "Error creating new list resource",
            content: data.message
          });
        });
      }
    }
  }, {
    key: "_list_duplicate",
    value: function _list_duplicate() {
      var resource_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.props.duplicate_func('/create_duplicate_list', resource_name);
    }
  }, {
    key: "_list_delete",
    value: function _list_delete() {
      var resource_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.props.delete_func("/delete_list", resource_name);
    }
  }, {
    key: "_add_list",
    value: function _add_list(myDropZone, setCurrentUrl) {
      var new_url = "import_list/".concat(this.props.library_id);
      myDropZone.options.url = new_url;
      setCurrentUrl(new_url);
      myDropZone.processQueue();
    }
  }, {
    key: "context_menu_items",
    get: function get() {
      var _this12 = this;

      var menu_items = [{
        text: "edit",
        icon: "document-open",
        onClick: this.props.view_resource
      }];

      if (window.in_context) {
        menu_items.push({
          text: "open in separate tab",
          icon: "document-open",
          onClick: function onClick(resource_name) {
            _this12.props.view_resource(resource_name, null, true);
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
        onClick: this._list_duplicate
      }, {
        text: "__divider__"
      }, {
        text: "delete",
        icon: "trash",
        onClick: this._list_delete,
        intent: "danger"
      }]);
      return menu_items;
    }
  }, {
    key: "_showImport",
    value: function _showImport() {
      (0, _import_dialog.showFileImportDialog)("list", "text/*", [], this._add_list, this.props.tsocket, this.props.dark_theme, false, false);
    }
  }, {
    key: "menu_specs",
    get: function get() {
      var _this13 = this;

      var self = this;
      var ms = {
        Open: [{
          name_text: "New",
          icon_name: "new-text-box",
          click_handler: function click_handler() {
            _this13._new_code("nltk-english");
          }
        }, {
          name_text: "Open",
          icon_name: "document-open",
          click_handler: function click_handler() {
            self.props.view_func();
          },
          key_bindings: ["space", "return", "ctrl+o"]
        }, {
          name_text: "Open In Separate Tab",
          icon_name: "document-share",
          click_handler: function click_handler() {
            self.props.view_resource(self.props.selected_resource.name, null, true);
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
            _this13._list_duplicate();
          }
        }, {
          name_text: "Delete Lists",
          icon_name: "trash",
          click_handler: function click_handler() {
            _this13._list_delete();
          },
          multi_select: true
        }],
        Transfer: [{
          name_text: "Import List",
          icon_name: "cloud-upload",
          click_handler: this._showImport
        }, {
          name_text: "Share to repository",
          icon_name: "share",
          click_handler: this.props.send_repository_func
        }]
      };

      for (var _i4 = 0, _Object$entries4 = Object.entries(ms); _i4 < _Object$entries4.length; _i4++) {
        var _Object$entries4$_i = _slicedToArray(_Object$entries4[_i4], 2),
            menu_name = _Object$entries4$_i[0],
            menu = _Object$entries4$_i[1];

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
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(LibraryMenubar, {
        sendContextMenuItems: this.props.sendContextMenuItems,
        context_menu_items: this.context_menu_items,
        resource_icon: "list",
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

var CodeMenubar = /*#__PURE__*/function (_React$Component6) {
  _inherits(CodeMenubar, _React$Component6);

  var _super6 = _createSuper(CodeMenubar);

  function CodeMenubar(props) {
    var _this14;

    _classCallCheck(this, CodeMenubar);

    _this14 = _super6.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this14));
    return _this14;
  }

  _createClass(CodeMenubar, [{
    key: "_new_code",
    value: function _new_code(template_name) {
      $.getJSON("".concat($SCRIPT_ROOT, "/get_resource_names/code"), function (data) {
        (0, _modal_react.showModalReact)("New Code Resource", "New Code Resource Name", CreateNewCodeResource, "NewCodeResource", data["resource_names"]);
      });
      var self = this;

      function CreateNewCodeResource(new_name) {
        var result_dict = {
          "template_name": template_name,
          "new_res_name": new_name
        };
        (0, _communication_react.postAjaxPromise)("/create_code", result_dict).then(function (data) {
          self.props.refresh_func();
          self.props.view_resource(String(new_name), "/view_code/");
        })["catch"](function (data) {
          self.props.addErrorDrawerEntry({
            title: "Error creating new code resource",
            content: data.message
          });
        });
      }
    }
  }, {
    key: "_code_duplicate",
    value: function _code_duplicate() {
      var resource_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.props.duplicate_func('/create_duplicate_code', resource_name);
    }
  }, {
    key: "_code_delete",
    value: function _code_delete() {
      var resource_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.props.delete_func("/delete_code", resource_name);
    }
  }, {
    key: "popup_buttons",
    get: function get() {
      var _this15 = this;

      return [["code", "new-text-box", [["BasicCodeTemplate", function () {
        _this15._new_code("BasicCodeTemplate");
      }, "code"]]]];
    }
  }, {
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
          onClick: function onClick(resource_name) {
            _this16.props.view_resource(resource_name, null, true);
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
        onClick: this._code_duplicate
      }, {
        text: "__divider__"
      }, {
        text: "delete",
        icon: "trash",
        onClick: this._code_delete,
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
            _this17._new_code("BasicCodeTemplate");
          }
        }, {
          name_text: "Open",
          icon_name: "document-open",
          click_handler: function click_handler() {
            self.props.view_func();
          },
          key_bindings: ["space", "return", "ctrl+o"]
        }, {
          name_text: "Open In Separate Tab",
          icon_name: "document-share",
          click_handler: function click_handler() {
            self.props.view_resource(self.props.selected_resource.name, null, true);
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
            _this17._code_duplicate();
          }
        }, {
          name_text: "Delete Code",
          icon_name: "trash",
          click_handler: function click_handler() {
            _this17._code_delete();
          },
          multi_select: true
        }],
        Transfer: [{
          name_text: "Share to repository",
          icon_name: "share",
          click_handler: this.props.send_repository_func
        }]
      };

      for (var _i5 = 0, _Object$entries5 = Object.entries(ms); _i5 < _Object$entries5.length; _i5++) {
        var _Object$entries5$_i = _slicedToArray(_Object$entries5[_i5], 2),
            menu_name = _Object$entries5$_i[0],
            menu = _Object$entries5$_i[1];

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
        resource_icon: "code",
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