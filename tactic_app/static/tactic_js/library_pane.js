"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.view_views = view_views;
exports.LibraryPane = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _table = require("@blueprintjs/table");

var _lodash = _interopRequireDefault(require("lodash"));

var _tag_buttons_react = require("./tag_buttons_react.js");

var _blueprint_mdata_fields = require("./blueprint_mdata_fields.js");

var _library_widgets = require("./library_widgets.js");

var _resizing_layouts = require("./resizing_layouts.js");

var _modal_react = require("./modal_react.js");

var _communication_react = require("./communication_react.js");

var _tactic_context = require("./tactic_context.js");

var _toaster = require("./toaster.js");

var _key_trap = require("./key_trap.js");

var _utilities_react = require("./utilities_react.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

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

function view_views() {
  var is_repository = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  if (is_repository) {
    return {
      collection: null,
      project: null,
      tile: "/repository_view_module/",
      list: "/repository_view_list/",
      code: "/repository_view_code/"
    };
  } else {
    return {
      collection: "/main_collection/",
      project: "/main_project/",
      tile: "/last_saved_view/",
      list: "/view_list/",
      code: "/view_code/"
    };
  }
}

var BodyMenu = /*#__PURE__*/function (_React$Component) {
  _inherits(BodyMenu, _React$Component);

  var _super = _createSuper(BodyMenu);

  function BodyMenu() {
    _classCallCheck(this, BodyMenu);

    return _super.apply(this, arguments);
  }

  _createClass(BodyMenu, [{
    key: "getIntent",
    value: function getIntent(item) {
      return item.intent ? item.intent : null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      var disabled = false;
      var menu_items = this.props.items.map(function (item, index) {
        if (item.text == "__divider__") {
          return /*#__PURE__*/_react["default"].createElement(_core.Menu.Divider, {
            key: index
          });
        } else {
          return /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
            icon: item.icon,
            disabled: disabled,
            onClick: function onClick() {
              return item.onClick(_this.props.selected_rows[0].name);
            },
            intent: _this.getIntent(item),
            key: item.text,
            text: item.text
          });
        }
      });
      return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.Menu.Divider, {
        title: this.props.selected_rows[0].name,
        className: "context-menu-header"
      }), menu_items);
    }
  }]);

  return BodyMenu;
}(_react["default"].Component);

BodyMenu.propTypes = {
  items: _propTypes["default"].array,
  selected_rows: _propTypes["default"].array
};

var LibraryPane = /*#__PURE__*/function (_React$Component2) {
  _inherits(LibraryPane, _React$Component2);

  var _super2 = _createSuper(LibraryPane);

  function LibraryPane(props) {
    var _this2;

    _classCallCheck(this, LibraryPane);

    _this2 = _super2.call(this, props);
    _this2.top_ref = /*#__PURE__*/_react["default"].createRef();
    _this2.table_ref = /*#__PURE__*/_react["default"].createRef();
    _this2.resizing = false; // let aheight = getUsableDimensions(true).usable_height_no_bottom;
    // let awidth = getUsableDimensions(true).usable_width - 200;

    _this2.get_url = "grab_".concat(props.res_type, "_list_chunk");
    _this2.state = {
      data_dict: {},
      num_rows: 0,
      mounted: false,
      // available_height: aheight,
      // available_width: awidth,
      // top_pane_height: aheight / 2 - 50,
      // match_list: [],
      tag_list: [],
      auxIsOpen: false,
      showOmnibar: false,
      contextMenuItems: [],
      total_width: 500
    };
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this2));
    _this2.toolbarRef = null;
    _this2.previous_search_spec = null;
    _this2.socket_counter = null;
    return _this2;
  }

  _createClass(LibraryPane, [{
    key: "initSocket",
    value: function initSocket() {
      if (this.context.tsocket != null && !this.props.is_repository) {
        this.context.tsocket.socket.off("update-".concat(this.props.res_type, "-selector-row"));
        this.context.tsocket.socket.off("refresh-".concat(this.props.res_type, "-selector"));
        this.context.tsocket.socket.on("update-".concat(this.props.res_type, "-selector-row"), this._handleRowUpdate);
        this.context.tsocket.socket.on("refresh-".concat(this.props.res_type, "-selector"), this._refresh_func);
      }

      this.socket_counter = this.context.tsocket.counter;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.context.tsocket.counter != this.socket_counter) {
        this.initSocket();
      }
    }
  }, {
    key: "_sendContextMenuItems",
    value: function _sendContextMenuItems(items) {
      this.setState({
        contextMenuItems: items
      });
    }
  }, {
    key: "_getSearchSpec",
    value: function _getSearchSpec() {
      return {
        active_tag: this.props.tag_button_state.active_tag == "all" ? null : this.props.tag_button_state.active_tag,
        search_string: this.props.search_string,
        search_inside: this.props.search_inside,
        search_metadata: this.props.search_metadata,
        sort_field: this.props.sorting_column,
        sort_direction: this.props.sorting_direction
      };
    }
  }, {
    key: "_renderBodyContextMenu",
    value: function _renderBodyContextMenu(menu_context) {
      var regions = menu_context.regions;
      if (regions.length == 0) return null; // Without this get an error when clicking on a body cell

      var selected_rows = [];

      var _iterator = _createForOfIteratorHelper(regions),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var region = _step.value;

          if (region.hasOwnProperty("rows")) {
            var first_row = region["rows"][0];
            var last_row = region["rows"][1];

            for (var i = first_row; i <= last_row; ++i) {
              if (!selected_rows.includes(i)) {
                selected_rows.push(this.state.data_dict[i]);
              }
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return /*#__PURE__*/_react["default"].createElement(BodyMenu, {
        items: this.state.contextMenuItems,
        selected_rows: selected_rows
      });
    }
  }, {
    key: "_onTableSelection",
    value: function _onTableSelection(regions) {
      if (regions.length == 0) return; // Without this get an error when clicking on a body cell

      var selected_rows = [];
      var selected_row_indices = [];
      var revised_regions = [];

      var _iterator2 = _createForOfIteratorHelper(regions),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var region = _step2.value;

          if (region.hasOwnProperty("rows")) {
            var first_row = region["rows"][0];
            revised_regions.push(_table.Regions.row(first_row));
            var last_row = region["rows"][1];

            for (var i = first_row; i <= last_row; ++i) {
              if (!selected_row_indices.includes(i)) {
                selected_row_indices.push(i);
                selected_rows.push(this.state.data_dict[i]);
                revised_regions.push(_table.Regions.row(i));
              }
            }
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      this._handleRowSelection(selected_rows);

      this._updatePaneState({
        selectedRegions: revised_regions
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var self = this;
      this.initSocket();
      this.setState({
        "mounted": true
      });
      var path;

      this._grabNewChunkWithRow(0, true, null, true, null);
    }
  }, {
    key: "_grabNewChunkWithRow",
    value: function _grabNewChunkWithRow(row_index) {
      var flush = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var spec_update = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var select = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var select_by_name = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var callback = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

      var search_spec = this._getSearchSpec();

      if (spec_update) {
        search_spec = Object.assign(search_spec, spec_update);
      }

      if (search_spec.active_tag && search_spec.active_tag[0] != "/") {
        search_spec.active_tag = "/" + search_spec.active_tag;
      }

      var data = {
        search_spec: search_spec,
        row_number: row_index,
        is_repository: this.props.is_repository
      };
      var self = this;
      (0, _communication_react.postAjax)(this.get_url, data, function (data) {
        var new_data_dict;

        if (flush) {
          new_data_dict = data.chunk_dict;
        } else {
          new_data_dict = _lodash["default"].cloneDeep(self.state.data_dict);
          new_data_dict = Object.assign(new_data_dict, data.chunk_dict);
        }

        self.previous_search_spec = search_spec;
        self.setState({
          data_dict: new_data_dict,
          num_rows: data.num_rows,
          tag_list: data.all_tags
        }, function () {
          if (callback) {
            callback();
          } else if (select) {
            self._selectRow(row_index);
          } else if (select_by_name) {
            var ind = self.get_data_dict_index(select_by_name);

            if (!ind) {
              ind = 0;
            }

            self._selectRow(ind);
          }
        });
      });
    }
  }, {
    key: "_initiateDataGrab",
    value: function _initiateDataGrab(row_index) {
      this._grabNewChunkWithRow(row_index);
    }
  }, {
    key: "_handleRowUpdate",
    value: function _handleRowUpdate(res_dict) {
      var res_name = res_dict.name;
      var res_tags = res_dict.tags.split(" ");
      var ind = this.get_data_dict_index(res_name);

      var new_data_dict = _lodash["default"].cloneDeep(this.state.data_dict);

      var the_row = new_data_dict[ind];

      for (var field in res_dict) {
        if ("new_name" in res_dict && field == "name") {} else if (field == "new_name") {
          the_row["name"] = res_dict[field];
        } else {
          the_row[field] = res_dict[field];
        }
      }

      if (res_name == this.props.selected_resource.name) {
        this.props.updatePaneState({
          "selected_resource": the_row
        });
      }

      var new_state = {
        "data_dict": new_data_dict
      };

      var new_tag_list = _lodash["default"].cloneDeep(this.state.tag_list);

      var new_tag_found = false;

      var _iterator3 = _createForOfIteratorHelper(res_tags),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var tag = _step3.value;

          if (!new_tag_list.includes(tag)) {
            new_tag_list.push(tag);
            new_tag_found = true;
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      if (new_tag_found) {
        new_state["tag_list"] = new_tag_list;
      }

      this.setState(new_state);
    }
  }, {
    key: "update_tag_list",
    value: function update_tag_list() {}
  }, {
    key: "delete_row",
    value: function delete_row(name) {
      var ind = this.get_data_list_index(name);

      var new_data_list = _toConsumableArray(this.state.data_list);

      new_data_list.splice(ind, 1);

      if (this.props.list_of_selected.includes(name)) {
        this._updatePaneState({
          list_of_selected: [],
          multi_select: false,
          selected_resource: {
            "name": "",
            "tags": "",
            "notes": "",
            "updated": "",
            "created": ""
          }
        });
      }

      this.setState({
        data_list: new_data_list
      }, this.update_tag_list);
    }
  }, {
    key: "get_data_dict_entry",
    value: function get_data_dict_entry(name) {
      for (var index in this.state.data_dict) {
        if (this.state.data_dict[index].name == name) {
          return this.state.data_dict[index];
        }
      }

      return null;
    }
  }, {
    key: "set_in_data_dict",
    value: function set_in_data_dict(names, new_val_dict, data_dict) {
      var new_data_dict = {};

      for (var index in data_dict) {
        var entry = data_dict[index];

        if (names.includes(data_dict[index].name)) {
          for (var k in new_val_dict) {
            entry[k] = new_val_dict[k];
          }
        }

        new_data_dict[index] = entry;
      }

      return new_data_dict;
    }
  }, {
    key: "get_data_dict_index",
    value: function get_data_dict_index(name) {
      for (var index in this.state.data_dict) {
        if (this.state.data_dict[index].name == name) {
          return index;
        }
      }

      return null;
    }
  }, {
    key: "_saveFromSelectedResource",
    value: function _saveFromSelectedResource() {
      var result_dict = {
        "res_type": this.props.res_type,
        "res_name": this.props.list_of_selected[0],
        "tags": this.props.selected_resource.tags,
        "notes": this.props.selected_resource.notes
      };
      var saved_selected_resource = Object.assign({}, this.props.selected_resource);

      var saved_list_of_selected = _toConsumableArray(this.props.list_of_selected);

      var self = this;
      (0, _communication_react.postAjaxPromise)("save_metadata", result_dict).then(function (data) {
        var new_data_list = self.set_in_data_dict(saved_list_of_selected, saved_selected_resource, self.state.data_dict);
        self.setState({
          "data_dict": new_data_list
        });
      })["catch"](_toaster.doFlash);
    }
  }, {
    key: "_overwriteCommonTags",
    value: function _overwriteCommonTags() {
      var result_dict = {
        "res_type": this.props.res_type,
        "res_names": this.props.list_of_selected,
        "tags": this.props.selected_resource.tags
      };
      var self = this;
      (0, _communication_react.postAjaxPromise)("overwrite_common_tags", result_dict).then(function (data) {
        var utags = data.updated_tags;

        var new_data_dict = _lodash["default"].cloneDeep(self.state.data_dict);

        for (var res_name in utags) {
          new_data_dict = self.set_in_data_dict([res_name], {
            tags: utags[res_name]
          }, new_data_dict);
        }

        self.setState({
          data_dict: new_data_dict
        }, function () {
          self.update_tag_list();
        });
      })["catch"](_toaster.doFlash);
    }
  }, {
    key: "_handleMetadataChange",
    value: function _handleMetadataChange(changed_state_elements) {
      if (!this.props.multi_select) {
        var revised_selected_resource = Object.assign({}, this.props.selected_resource);
        revised_selected_resource = Object.assign(revised_selected_resource, changed_state_elements);

        if (Object.keys(changed_state_elements).includes("tags")) {
          revised_selected_resource["tags"] = revised_selected_resource["tags"].join(" ");

          this._updatePaneState({
            selected_resource: revised_selected_resource
          }, this._saveFromSelectedResource);
        } else {
          this._updatePaneState({
            selected_resource: revised_selected_resource
          });
        }
      } else {
        var _revised_selected_resource = Object.assign({}, this.props.selected_resource);

        _revised_selected_resource = Object.assign(_revised_selected_resource, changed_state_elements);
        _revised_selected_resource["tags"] = _revised_selected_resource["tags"].join(" ");

        this._updatePaneState({
          selected_resource: _revised_selected_resource
        }, this._overwriteCommonTags);
      }
    }
  }, {
    key: "addOneTag",
    value: function addOneTag(res_name, the_tag) {
      var dl_entry = this.get_data_dict_entry(res_name);
      if (dl_entry.tags.split(' ').includes(the_tag)) return;
      var new_tags = dl_entry.tags + " " + the_tag;
      new_tags = new_tags.trim();
      var result_dict = {
        "res_type": this.props.res_type,
        "res_name": res_name,
        "tags": new_tags,
        "notes": dl_entry.notes
      };
      var self = this;
      (0, _communication_react.postAjaxPromise)("save_metadata", result_dict).then(function () {
        self._handleRowUpdate({
          "name": res_name,
          "tags": new_tags
        });
      })["catch"](_toaster.doFlash);
    }
  }, {
    key: "_updatePaneState",
    value: function _updatePaneState(new_state, callback) {
      this.props.updatePaneState(this.props.res_type, new_state, callback);
    }
  }, {
    key: "_updateTagState",
    value: function _updateTagState(new_state) {
      var old_tb_state = Object.assign({}, this.props.tag_button_state);
      var new_tb_state = Object.assign(old_tb_state, new_state);
      var new_pane_state = {
        tag_button_state: new_tb_state
      };

      this._update_search_state(new_pane_state);
    }
  }, {
    key: "_handleAddTag",
    value: function _handleAddTag(res_name, the_tag) {
      if (this.props.list_of_selected.includes(res_name) && this.props.multi_select) {
        var _iterator4 = _createForOfIteratorHelper(this.props.list_of_selected),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var the_name = _step4.value;
            this.addOneTag(the_name, the_tag);
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }

        var selected_tags = this.props.selected_resource.tags;

        if (!selected_tags.includes(the_tag)) {
          selected_tags = selected_tags + " " + the_tag;
          selected_tags = selected_tags.trim();
          var new_selected_resource = this.props.selected_resource;
          new_selected_resource["tags"] = selected_tags;

          this._updatePaneState({
            "selected_resource": new_selected_resource
          });
        }
      } else {
        this.addOneTag(res_name, the_tag);
      }
    }
  }, {
    key: "_handleSplitResize",
    value: function _handleSplitResize(left_width, right_width, width_fraction) {
      if (!this.resizing) {
        this._updatePaneState({
          left_width_fraction: width_fraction
        });
      }
    }
  }, {
    key: "_handleSplitResizeStart",
    value: function _handleSplitResizeStart() {
      this.resizing = true;
    }
  }, {
    key: "_handleSplitResizeEnd",
    value: function _handleSplitResizeEnd(width_fraction) {
      this.resizing = false;

      this._updatePaneState({
        left_width_fraction: width_fraction
      });
    }
  }, {
    key: "_doTagDelete",
    value: function _doTagDelete(tag) {
      var result_dict = {
        "res_type": this.props.res_type,
        "tag": tag
      };
      var self = this;
      (0, _communication_react.postAjaxPromise)("delete_tag", result_dict).then(function (data) {
        self._refresh_func();
      })["catch"](_toaster.doFlash);
    }
  }, {
    key: "_doTagRename",
    value: function _doTagRename(tag_changes) {
      var result_dict = {
        "res_type": this.props.res_type,
        "tag_changes": tag_changes
      };
      var self = this;
      (0, _communication_react.postAjaxPromise)("rename_tag", result_dict).then(function (data) {
        self._refresh_func();
      })["catch"](_toaster.doFlash);
    }
  }, {
    key: "_handleRowDoubleClick",
    value: function _handleRowDoubleClick(row_dict) {
      var self = this;
      var view_view = view_views(this.props.is_repostory)[this.props.res_type];
      if (view_view == null) return;

      this._updatePaneState({
        selected_resource: row_dict,
        multi_select: false,
        list_of_selected: [row_dict.name]
      });

      if (window.in_context) {
        var re = new RegExp("/$");
        view_view = view_view.replace(re, "_in_context");
        (0, _communication_react.postAjaxPromise)($SCRIPT_ROOT + view_view, {
          context_id: context_id,
          resource_name: row_dict.name
        }).then(self.props.handleCreateViewer)["catch"](_toaster.doFlash);
      } else {
        window.open($SCRIPT_ROOT + view_view + row_dict.name);
      }
    }
  }, {
    key: "_handleRowSelection",
    value: function _handleRowSelection(selected_rows) {
      if (!this.props.multi_select && this.props.selected_resource.name != "" && this.props.selected_resource.notes != this.get_data_dict_entry(this.props.selected_resource.name).notes) {
        this._saveFromSelectedResource();
      }

      if (selected_rows.length > 1) {
        var common_tags = selected_rows[0].tags.split(" ");
        var other_rows = selected_rows.slice(1, selected_rows.length);

        var _iterator5 = _createForOfIteratorHelper(other_rows),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var row_dict = _step5.value;
            var new_common_tags = [];
            var new_tag_list = row_dict.tags.split(" ");

            var _iterator6 = _createForOfIteratorHelper(new_tag_list),
                _step6;

            try {
              for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                var tag = _step6.value;

                if (common_tags.includes(tag)) {
                  new_common_tags.push(tag);
                }

                common_tags = new_common_tags;
              }
            } catch (err) {
              _iterator6.e(err);
            } finally {
              _iterator6.f();
            }
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }

        var multi_select_list = selected_rows.map(function (row_dict) {
          return row_dict.name;
        });
        var new_selected_resource = {
          name: "__multiple__",
          tags: common_tags.join(" "),
          notes: ""
        };

        this._updatePaneState({
          multi_select: true,
          selected_resource: new_selected_resource,
          list_of_selected: multi_select_list
        });
      } else {
        var _row_dict = selected_rows[0];

        this._updatePaneState({
          selected_resource: _row_dict,
          multi_select: false,
          list_of_selected: [_row_dict.name]
        });
      }
    }
  }, {
    key: "_filter_func",
    value: function _filter_func(resource_dict, search_string) {
      try {
        return resource_dict.name.toLowerCase().search(search_string) != -1;
      } catch (e) {
        return false;
      }
    }
  }, {
    key: "_update_search_state",
    value: function _update_search_state(new_state) {
      var _this3 = this;

      //new_state.search_from_tags = false;
      this._updatePaneState(new_state, function () {
        if (_this3.search_spec_changed(new_state)) {
          _this3._grabNewChunkWithRow(0, true, new_state, true);
        }
      });
    }
  }, {
    key: "search_spec_changed",
    value: function search_spec_changed(new_spec) {
      if (!this.previous_search_spec) {
        return true;
      }

      for (var key in this.previous_search_spec) {
        if (key == "active_tag") {
          if (new_spec.hasOwnProperty("tag_button_state")) {
            if (new_spec.tag_button_state.active_tag != this.previous_search_spec.active_tag) {
              return true;
            }
          }
        } else if (new_spec.hasOwnProperty(key)) {
          // noinspection TypeScriptValidateTypes
          if (new_spec[key] != this.previous_search_spec[key]) {
            return true;
          }
        }
      }

      return false;
    }
  }, {
    key: "_set_sort_state",
    value: function _set_sort_state(column_name, sort_field, direction) {
      var _this4 = this;

      var spec_update = {
        sort_field: column_name,
        sort_direction: direction
      };

      this._updatePaneState(spec_update, function () {
        if (_this4.search_spec_changed(spec_update)) {
          _this4._grabNewChunkWithRow(0, true, spec_update, true);
        }
      });
    }
  }, {
    key: "_handleArrowKeyPress",
    value: function _handleArrowKeyPress(key) {
      if (this.props.multi_select) return;
      var current_index = parseInt(this.get_data_dict_index(this.props.selected_resource.name));
      var new_index;
      var new_selected_res;

      if (key == "ArrowDown") {
        new_index = current_index + 1;
      } else {
        new_index = current_index - 1;
        if (new_index < 0) return;
      }

      this._selectRow(new_index);
    }
  }, {
    key: "_handleTableKeyPress",
    value: function _handleTableKeyPress(key) {
      if (key.code == "ArrowUp") {
        this._handleArrowKeyPress("ArrowUp");
      } else if (key.code == "ArrowDown") {
        this._handleArrowKeyPress("ArrowDown");
      }
    }
  }, {
    key: "_selectRow",
    value: function _selectRow(new_index) {
      var _this5 = this;

      if (!Object.keys(this.state.data_dict).includes(String(new_index))) {
        this._grabNewChunkWithRow(new_index, false, null, false, null, function () {
          _this5._selectRow(new_index);
        });
      } else {
        var new_regions = [_table.Regions.row(new_index)];

        this._updatePaneState({
          selected_resource: this.state.data_dict[new_index],
          list_of_selected: [this.state.data_dict[new_index].name],
          multi_select: false,
          selectedRegions: new_regions
        });
      }
    }
  }, {
    key: "_view_func",
    value: function _view_func() {
      var the_view = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var self = this;

      if (the_view == null) {
        the_view = view_views(this.props.is_repository)[this.props.res_type];
      }

      if (window.in_context) {
        var re = new RegExp("/$");
        the_view = the_view.replace(re, "_in_context");
        (0, _communication_react.postAjaxPromise)($SCRIPT_ROOT + the_view, {
          context_id: context_id,
          resource_name: this.props.selected_resource.name
        }).then(self.props.handleCreateViewer)["catch"](_toaster.doFlash);
      } else if (!this.state.multi_select) {
        window.open($SCRIPT_ROOT + the_view + this.props.selected_resource.name);
      }
    }
  }, {
    key: "_view_resource",
    value: function _view_resource(resource_name) {
      var the_view = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var self = this;

      if (the_view == null) {
        the_view = view_views(this.props.is_repository)[this.props.res_type];
      }

      if (window.in_context) {
        var re = new RegExp("/$");
        the_view = the_view.replace(re, "_in_context");
        (0, _communication_react.postAjaxPromise)($SCRIPT_ROOT + the_view, {
          context_id: context_id,
          resource_name: resource_name
        }).then(self.props.handleCreateViewer)["catch"](_toaster.doFlash);
      } else {
        window.open($SCRIPT_ROOT + the_view + resource_name);
      }
    }
  }, {
    key: "_duplicate_func",
    value: function _duplicate_func(duplicate_view) {
      var resource_name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var res_type = this.props.res_type;
      var res_name = resource_name ? resource_name : this.props.selected_resource.name;
      $.getJSON($SCRIPT_ROOT + "get_resource_names/" + res_type, function (data) {
        (0, _modal_react.showModalReact)("Duplicate ".concat(res_type), "New Name", DuplicateResource, res_name, data.resource_names);
      });
      var self = this;

      function DuplicateResource(new_name) {
        var result_dict = {
          "new_res_name": new_name,
          "res_to_copy": res_name
        };
        (0, _communication_react.postAjaxPromise)(duplicate_view, result_dict).then(function (data) {
          self._grabNewChunkWithRow(0, true, null, false, new_name);
        })["catch"](_toaster.doFlash);
      }
    }
  }, {
    key: "_delete_func",
    value: function _delete_func(delete_view) {
      var resource_name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var res_type = this.props.res_type;
      var res_names = resource_name ? [resource_name] : this.props.list_of_selected;
      var confirm_text;

      if (res_names.length == 1) {
        var res_name = res_names[0];
        confirm_text = "Are you sure that you want to delete ".concat(res_name, "?");
      } else {
        confirm_text = "Are you sure that you want to delete multiple items?";
      }

      var self = this;
      var first_index = 99999;

      var _iterator7 = _createForOfIteratorHelper(res_names),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var res = _step7.value;
          var ind = parseInt(this.get_data_dict_index(res));

          if (ind < first_index) {
            first_index = ind;
          }
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }

      (0, _modal_react.showConfirmDialogReact)("Delete ".concat(res_type), confirm_text, "do nothing", "delete", function () {
        (0, _communication_react.postAjaxPromise)(delete_view, {
          "resource_names": res_names
        }).then(function () {
          var new_index = 0;

          if (first_index > 0) {
            new_index = first_index - 1;
          }

          self._grabNewChunkWithRow(new_index, true, null, true);
        })["catch"](_toaster.doFlash);
      });
    }
  }, {
    key: "_rename_func",
    value: function _rename_func() {
      var resource_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var res_type = this.props.res_type;
      var res_name = resource_name ? resource_name : this.props.selected_resource.name;
      var self = this;
      $.getJSON($SCRIPT_ROOT + "get_resource_names/" + res_type, function (data) {
        var res_names = data["resource_names"];
        var index = res_names.indexOf(res_name);

        if (index >= 0) {
          res_names.splice(index, 1);
        }

        (0, _modal_react.showModalReact)("Rename ".concat(res_type), "New Name", RenameResource, res_name, res_names);
      });

      function RenameResource(new_name) {
        var the_data = {
          "new_name": new_name
        };
        (0, _communication_react.postAjax)("rename_resource/".concat(res_type, "/").concat(res_name), the_data, renameSuccess);

        function renameSuccess(data) {
          if (!data.success) {
            (0, _toaster.doFlash)(data);
            return false;
          } else {
            var ind = self.get_data_dict_index(res_name);

            var new_data_dict = _lodash["default"].cloneDeep(self.state.data_dict);

            new_data_dict[ind].name = new_name;
            self.setState({
              data_dict: new_data_dict
            }, function () {
              self._selectRow(ind);
            });
            return true;
          }
        }
      }
    }
  }, {
    key: "_repository_copy_func",
    value: function _repository_copy_func() {
      var res_type = this.props.res_type;
      var res_name = this.props.selected_resource.name;
      $.getJSON($SCRIPT_ROOT + "get_resource_names/" + res_type, function (data) {
        (0, _modal_react.showModalReact)("Import " + res_type, "New Name", ImportResource, res_name, data["resource_names"]);
      });

      function ImportResource(new_name) {
        var result_dict = {
          "res_type": res_type,
          "res_name": res_name,
          "new_res_name": new_name
        };
        (0, _communication_react.postAjaxPromise)("/copy_from_repository", result_dict).then(_toaster.doFlash)["catch"](_toaster.doFlash);
      }

      return res_name;
    }
  }, {
    key: "_send_repository_func",
    value: function _send_repository_func() {
      var res_type = this.props.res_type;
      var res_name = this.props.selected_resource.name;
      $.getJSON($SCRIPT_ROOT + "get_repository_resource_names/" + res_type, function (data) {
        (0, _modal_react.showModalReact)("Share ".concat(res_type), "New ".concat(res_type, " Name"), ShareResource, res_name, data["resource_names"]);
      });

      function ShareResource(new_name) {
        var result_dict = {
          "res_type": res_type,
          "res_name": res_name,
          "new_res_name": new_name
        };
        (0, _communication_react.postAjaxPromise)('/send_to_repository', result_dict).then(_toaster.doFlash)["catch"](_toaster.doFlash);
      }

      return res_name;
    }
  }, {
    key: "_refresh_func",
    value: function _refresh_func() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      this._grabNewChunkWithRow(0, true, null, true, callback);
    } // _handleTopRightPaneResize (top_height, bottom_height, top_fraction) {
    //     this.setState({"top_pane_height": top_height
    //     })
    // }

  }, {
    key: "_handleResize",
    value: function _handleResize(entries) {// if (this.resizing) return;
      // for (let entry of entries) {
      //     if (entry.target.className.includes("pane-holder")) {
      //         this.setState({available_width: entry.contentRect.width - this.top_ref.current.offsetLeft - 30,
      //             available_height: entry.contentRect.height - this.top_ref.current.offsetTop
      //         });
      //         return
      //     }
      // }
    }
  }, {
    key: "_toggleAuxVisibility",
    value: function _toggleAuxVisibility() {
      this.setState({
        auxIsOpen: !this.state.auxIsOpen
      });
    }
  }, {
    key: "_showOmnibar",
    value: function _showOmnibar() {
      this.setState({
        showOmnibar: true
      });
    }
  }, {
    key: "_omnibarSelect",
    value: function _omnibarSelect(item) {
      var the_view = view_views(this.props.is_repository)[this.props.res_type];
      window.open($SCRIPT_ROOT + the_view + item);

      this._closeOmnibar();
    }
  }, {
    key: "_closeOmnibar",
    value: function _closeOmnibar() {
      this.setState({
        showOmnibar: false
      });
    }
  }, {
    key: "_sendToolbarRef",
    value: function _sendToolbarRef(the_ref) {
      this.toolbarRef = the_ref;
    } // This total_width machinery is all part of a trick to get the table to fully render all rows
    // It seems to matter that the containing box is very tight.

  }, {
    key: "_communicateColumnWidthSum",
    value: function _communicateColumnWidthSum(total_width) {
      this.setState({
        total_width: total_width
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this6 = this;

      var new_button_groups;
      var left_width = (this.props.usable_width - _resizing_layouts.HANDLE_WIDTH - 200) * this.props.left_width_fraction;
      var primary_mdata_fields = ["name", "created", "created_for_sort", "updated", "updated_for_sort", "tags", "notes"];
      var additional_metadata = {};

      for (var field in this.props.selected_resource) {
        if (!primary_mdata_fields.includes(field)) {
          additional_metadata[field] = this.props.selected_resource[field];
        }
      }

      if (Object.keys(additional_metadata).length == 0) {
        additional_metadata = null;
      }

      var right_pane;
      var split_tags = this.props.selected_resource.tags == "" ? [] : this.props.selected_resource.tags.split(" ");
      var outer_style = {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 90,
        overflow: "auto",
        padding: 15
      };

      var mdata_element = /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.CombinedMetadata, {
        tags: split_tags,
        elevation: 2,
        name: this.props.selected_resource.name,
        created: this.props.selected_resource.created,
        updated: this.props.selected_resource.updated,
        notes: this.props.selected_resource.notes,
        handleChange: this._handleMetadataChange,
        res_type: this.props.res_type,
        outer_style: outer_style,
        handleNotesBlur: this.props.multi_select ? null : this._saveFromSelectedResource,
        additional_metadata: additional_metadata
      });

      if (this.props.aux_pane == null) {
        right_pane = mdata_element;
      } else {
        var button_base = this.state.auxIsOpen ? "Hide" : "Show";
        right_pane = /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, mdata_element, /*#__PURE__*/_react["default"].createElement("div", {
          className: "d-flex flex-row justify-content-around",
          style: {
            marginTop: 20
          }
        }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
          fill: false,
          small: true,
          minimal: false,
          onClick: this._toggleAuxVisibility
        }, button_base + " " + this.props.aux_pane_title)), /*#__PURE__*/_react["default"].createElement(_core.Collapse, {
          isOpen: this.state.auxIsOpen,
          keepChildrenMounted: true
        }, this.props.aux_pane));
      }

      var th_style = {
        "display": "inline-block",
        "verticalAlign": "top",
        "maxHeight": "100%",
        "overflowY": "scroll",
        "overflowX": "scroll",
        "lineHeight": 1,
        "whiteSpace": "nowrap"
      }; // let filtered_data_list = _.cloneDeep(this.state.data_list.filter(this._filter_on_match_list));

      var ToolbarClass = this.props.ToolbarClass;
      var table_width;
      var toolbar_left;

      if (this.table_ref && this.table_ref.current) {
        table_width = left_width - this.table_ref.current.offsetLeft + this.top_ref.current.offsetLeft;

        if (this.toolbarRef && this.toolbarRef.current) {
          var tbwidth = this.toolbarRef.current.getBoundingClientRect().width;
          toolbar_left = this.table_ref.current.offsetLeft + .5 * table_width - .5 * tbwidth;
          if (toolbar_left < 0) toolbar_left = 0;
        } else {
          toolbar_left = 175;
        }
      } else {
        table_width = left_width - 150;
        toolbar_left = 175;
      }

      var key_bindings = [[["up"], function () {
        return _this6._handleArrowKeyPress("ArrowUp");
      }], [["down"], function () {
        return _this6._handleArrowKeyPress("ArrowDown");
      }], [["ctrl+space"], this._showOmnibar]];

      var left_pane = /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "d-flex flex-row",
        style: {
          "maxHeight": "100%"
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "d-flex justify-content-around",
        style: {
          paddingRight: 10
        }
      }, /*#__PURE__*/_react["default"].createElement(_tag_buttons_react.TagButtonList, _extends({
        res_type: this.props.res_type,
        tag_list: this.state.tag_list
      }, this.props.tag_button_state, {
        updateTagState: this._updateTagState,
        handleAddTag: this._handleAddTag,
        doTagDelete: this._doTagDelete,
        doTagRename: this._doTagRename
      }))), /*#__PURE__*/_react["default"].createElement("div", {
        ref: this.table_ref // className="d-flex flex-column"
        ,
        style: {
          width: table_width,
          maxWidth: this.state.total_width,
          padding: 5
        }
      }, /*#__PURE__*/_react["default"].createElement(_library_widgets.SearchForm, {
        allow_search_inside: this.props.allow_search_inside,
        allow_search_metadata: this.props.allow_search_metadata,
        update_search_state: this._update_search_state,
        search_string: this.props.search_string,
        search_inside: this.props.search_inside,
        search_metadata: this.props.search_metadata
      }), /*#__PURE__*/_react["default"].createElement(_library_widgets.BpSelectorTable, {
        data_dict: this.state.data_dict,
        num_rows: this.state.num_rows,
        sortColumn: this._set_sort_state,
        selectedRegions: this.props.selectedRegions,
        communicateColumnWidthSum: this._communicateColumnWidthSum,
        onSelection: this._onTableSelection,
        keyHandler: this._handleTableKeyPress,
        initiateDataGrab: this._initiateDataGrab,
        renderBodyContextMenu: this._renderBodyContextMenu,
        handleRowDoubleClick: this._handleRowDoubleClick,
        handleAddTag: this._handleAddTag
      }))));

      return /*#__PURE__*/_react["default"].createElement(_core.ResizeSensor, {
        onResize: this._handleResize,
        observeParents: true
      }, /*#__PURE__*/_react["default"].createElement("div", {
        ref: this.top_ref,
        className: "d-flex flex-column mt-3"
      }, /*#__PURE__*/_react["default"].createElement(ToolbarClass, _extends({
        selected_resource: this.props.selected_resource,
        multi_select: this.props.multi_select,
        list_of_selected: this.props.list_of_selected,
        view_func: this._view_func,
        send_repository_func: this._send_repository_func,
        repository_copy_func: this._repository_copy_func,
        duplicate_func: this._duplicate_func,
        refresh_func: this._refresh_func,
        delete_func: this._delete_func,
        rename_func: this._rename_func,
        startSpinner: this.props.startSpinner,
        stopSpinner: this.props.stopSpinner,
        clearStatusMessage: this.props.clearStatusMessage,
        left_position: toolbar_left,
        sendRef: this._sendToolbarRef,
        sendContextMenuItems: this._sendContextMenuItems,
        view_resource: this._view_resource
      }, this.props.errorDrawerFuncs, {
        handleCreateViewer: this.props.handleCreateViewer,
        library_id: this.props.library_id // dark_theme={this.props.dark_theme}
        // tsocket={this.props.tsocket}

      })), /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          width: this.props.usable_width - 200,
          height: this.props.usable_height
        }
      }, /*#__PURE__*/_react["default"].createElement(_resizing_layouts.HorizontalPanes, {
        available_width: this.props.usable_width - 200,
        available_height: this.props.usable_height - 100,
        show_handle: true,
        left_pane: left_pane,
        right_pane: right_pane,
        right_pane_overflow: "auto",
        initial_width_fraction: .75,
        scrollAdjustSelectors: [".bp3-table-quadrant-scroll-container"],
        handleSplitUpdate: this._handleSplitResize,
        handleResizeStart: this._handleSplitResizeStart,
        handleResizeEnd: this._handleSplitResizeEnd
      })), /*#__PURE__*/_react["default"].createElement(_key_trap.KeyTrap, {
        global: true,
        bindings: key_bindings
      }), /*#__PURE__*/_react["default"].createElement(_library_widgets.LibraryOmnibar, {
        res_type: this.props.res_type,
        onItemSelect: this._omnibarSelect,
        handleClose: this._closeOmnibar,
        showOmnibar: this.state.showOmnibar
      })));
    }
  }]);

  return LibraryPane;
}(_react["default"].Component);

exports.LibraryPane = LibraryPane;
LibraryPane.propTypes = {
  res_type: _propTypes["default"].string,
  allow_search_inside: _propTypes["default"].bool,
  allow_search_metadata: _propTypes["default"].bool,
  ToolbarClass: _propTypes["default"].func,
  updatePaneState: _propTypes["default"].func,
  is_repository: _propTypes["default"].bool,
  tsocket: _propTypes["default"].object,
  aux_pane: _propTypes["default"].object,
  left_width_fraction: _propTypes["default"].number,
  selected_resource: _propTypes["default"].object,
  sorting_column: _propTypes["default"].string,
  sorting_field: _propTypes["default"].string,
  sorting_direction: _propTypes["default"].string,
  multi_select: _propTypes["default"].bool,
  list_of_selected: _propTypes["default"].array,
  search_string: _propTypes["default"].string,
  search_inside: _propTypes["default"].bool,
  search_metadata: _propTypes["default"].bool,
  search_tag: _propTypes["default"].string,
  tag_button_state: _propTypes["default"].object,
  contextItems: _propTypes["default"].array,
  dark_theme: _propTypes["default"].bool,
  library_id: _propTypes["default"].string
};
LibraryPane.defaultProps = {
  is_repository: false,
  tsocket: null,
  aux_pane: null,
  dark_theme: false
};
LibraryPane.contextType = _tactic_context.TacticContext;