"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdminPane = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _table = require("@blueprintjs/table");

var _library_widgets = require("./library_widgets.js");

var _resizing_layouts = require("./resizing_layouts.js");

var _communication_react = require("./communication_react.js");

var _sizing_tools = require("./sizing_tools.js");

var _utilities_react = require("./utilities_react.js");

var _lodash = _interopRequireDefault(require("../js/lodash"));

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

var AdminPane = /*#__PURE__*/function (_React$Component) {
  _inherits(AdminPane, _React$Component);

  var _super = _createSuper(AdminPane);

  function AdminPane(props) {
    var _this;

    _classCallCheck(this, AdminPane);

    _this = _super.call(this, props);
    _this.top_ref = /*#__PURE__*/_react["default"].createRef();
    _this.table_ref = /*#__PURE__*/_react["default"].createRef();
    _this.console_text_ref = /*#__PURE__*/_react["default"].createRef();
    var aheight = (0, _sizing_tools.getUsableDimensions)().usable_height_no_bottom;
    var awidth = (0, _sizing_tools.getUsableDimensions)().usable_width - 170;
    _this.get_url = "grab_".concat(props.res_type, "_list_chunk");
    _this.state = {
      data_dict: {},
      num_rows: 0,
      awaiting_data: false,
      mounted: false,
      available_height: aheight,
      available_width: awidth,
      top_pane_height: aheight / 2 - 50,
      total_width: 500
    };
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    _this.previous_search_spec = null;
    _this.socket_counter = null;

    _this.initSocket();

    return _this;
  }

  _createClass(AdminPane, [{
    key: "initSocket",
    value: function initSocket() {
      if (this.props.tsocket != null) {
        this.props.tsocket.attachListener("update-".concat(this.props.res_type, "-selector-row"), this._handleRowUpdate);
        this.props.tsocket.attachListener("refresh-".concat(this.props.res_type, "-selector"), this._refresh_func);
      }
    }
  }, {
    key: "_getSearchSpec",
    value: function _getSearchSpec() {
      return {
        search_string: this.props.search_string,
        sort_field: this.props.sort_field,
        sort_direction: this.props.sort_direction
      };
    }
  }, {
    key: "_onTableSelection",
    value: function _onTableSelection(regions) {
      if (regions.length == 0) return; // Without this get an error when clicking on a body cell

      var selected_rows = [];
      var revised_regions = [];

      var _iterator = _createForOfIteratorHelper(regions),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var region = _step.value;

          if (region.hasOwnProperty("rows")) {
            var first_row = region["rows"][0];
            revised_regions.push(_table.Regions.row(first_row));
            var last_row = region["rows"][1];

            for (var i = first_row; i <= last_row; ++i) {
              selected_rows.push(this.state.data_dict[i]);
              revised_regions.push(_table.Regions.row(i));
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      this._handleRowSelection(selected_rows);

      this._updatePaneState({
        selectedRegions: revised_regions
      });
    }
  }, {
    key: "get_height_minus_top_offset",
    value: function get_height_minus_top_offset(element_ref) {
      if (this.state.mounted) {
        // This will be true after the initial render
        return this.props.usable_height - $(element_ref.current).offset().top;
      } else {
        return this.props.usable_height - 50;
      }
    }
  }, {
    key: "get_width_minus_left_offset",
    value: function get_width_minus_left_offset(element_ref) {
      if (this.state.mounted) {
        // This will be true after the initial render
        return this.props.usable_width - $(element_ref.current).offset().left;
      } else {
        return this.props.usable_width - 50;
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var self = this;
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

      var data = {
        search_spec: search_spec,
        row_number: row_index
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
          num_rows: data.num_rows
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
      var _this2 = this;

      this.setState({
        awaiting_data: true
      }, function () {
        _this2._grabNewChunkWithRow(row_index);
      });
    }
  }, {
    key: "_handleRowUpdate",
    value: function _handleRowUpdate(res_dict) {
      var res_name = res_dict.name;
      var ind = this.get_data_dict_index(res_name);

      var new_data_dict = _lodash["default"].cloneDeep(this.state.data_dict);

      var the_row = new_data_dict[ind];

      for (var field in res_dict) {
        the_row[field] = res_dict[field];
      }

      if (res_name == this.props.selected_resource.name) {
        this.props.updatePaneState({
          "selected_resource": the_row
        });
      }

      var new_state = {
        "data_dict": new_data_dict
      };
      this.setState(new_state);
    }
  }, {
    key: "_updatePaneState",
    value: function _updatePaneState(new_state, callback) {
      this.props.updatePaneState(this.props.res_type, new_state, callback);
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
    key: "_delete_row",
    value: function _delete_row(idval) {
      var ind = this.get_data_list_index(idval);

      var new_data_list = _toConsumableArray(this.state.data_list);

      new_data_list.splice(ind, 1);
      this.setState({
        data_list: new_data_list
      });
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
    key: "_handleSplitResize",
    value: function _handleSplitResize(left_width, right_width, width_fraction) {
      this._updatePaneState({
        left_width_fraction: width_fraction
      });
    }
  }, {
    key: "_handleRowClick",
    value: function _handleRowClick(row_dict) {
      var shift_key_down = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      this._updatePaneState({
        selected_resource: row_dict,
        multi_select: false,
        list_of_selected: [row_dict[this.props.id_field]]
      });
    }
  }, {
    key: "_handleRowSelection",
    value: function _handleRowSelection(selected_rows) {
      var row_dict = selected_rows[0];

      this._updatePaneState({
        selected_resource: row_dict,
        multi_select: false,
        list_of_selected: [row_dict.name]
      });
    }
  }, {
    key: "_filter_func",
    value: function _filter_func(resource_dict, search_string) {
      for (var key in resource_dict) {
        if (resource_dict[key].toLowerCase().search(search_string) != -1) {
          return true;
        }
      }

      return resource_dict[this.props.id_field].toLowerCase().search(search_string) != -1;
    }
  }, {
    key: "_update_search_state",
    value: function _update_search_state(new_state) {
      var _this3 = this;

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
        if (new_spec.hasOwnProperty(key)) {
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
          selectedRegions: new_regions
        });
      }
    }
  }, {
    key: "_refresh_func",
    value: function _refresh_func() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      this._grabNewChunkWithRow(0, true, null, true, callback);
    }
  }, {
    key: "_setConsoleText",
    value: function _setConsoleText(the_text) {
      var self = this;

      this._updatePaneState({
        "console_text": the_text
      }, function () {
        if (self.console_text_ref && self.console_text_ref.current) {
          self.console_text_ref.current.scrollTop = self.console_text_ref.current.scrollHeight;
        }
      });
    }
  }, {
    key: "_handleResize",
    value: function _handleResize(entries) {
      var _iterator2 = _createForOfIteratorHelper(entries),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var entry = _step2.value;

          if (entry.target.className == "pane-holder") {
            this.setState({
              available_width: entry.contentRect.width - this.top_ref.current.offsetLeft,
              available_height: entry.contentRect.height - this.top_ref.current.offsetTop
            });
            return;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "_communicateColumnWidthSum",
    value: function _communicateColumnWidthSum(total_width) {
      this.setState({
        total_width: total_width + 50
      });
    }
  }, {
    key: "render",
    value: function render() {
      var new_button_groups;
      var left_width = this.state.available_width * this.props.left_width_fraction;
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

      var right_pane = /*#__PURE__*/_react["default"].createElement("div", {
        className: "d-flex d-inline",
        ref: this.console_text_ref,
        style: {
          overflow: "auto",
          verticalAlign: "top",
          marginTop: 12,
          marginLeft: 10,
          width: "100%",
          height: "100%",
          border: "1px solid black",
          padding: 10
        }
      }, /*#__PURE__*/_react["default"].createElement("pre", null, /*#__PURE__*/_react["default"].createElement("small", null, this.props.console_text)));

      var th_style = {
        "display": "inline-block",
        "verticalAlign": "top",
        "maxHeight": "100%",
        "overflowY": "scroll",
        "lineHeight": 1,
        "whiteSpace": "nowrap",
        "overflowX": "hidden"
      };
      var MenubarClass = this.props.MenubarClass;
      var column_specs = {};

      var _iterator3 = _createForOfIteratorHelper(this.props.colnames),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var col = _step3.value;
          column_specs[col] = {
            "sort_field": col,
            "first_sort": "ascending"
          };
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      var table_width;

      if (this.table_ref && this.table_ref.current) {
        table_width = left_width - this.table_ref.current.offsetLeft;
      } else {
        table_width = left_width - 150;
      }

      var left_pane = /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "d-flex flex-row",
        style: {
          "maxHeight": "100%"
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        ref: this.table_ref,
        style: {
          width: table_width,
          maxWidth: this.state.total_width,
          padding: 15,
          marginTop: 10,
          backgroundColor: "white"
        }
      }, /*#__PURE__*/_react["default"].createElement(_library_widgets.SearchForm, {
        allow_search_inside: false,
        allow_search_metadata: false,
        update_search_state: this._update_search_state,
        search_string: this.props.search_string
      }), /*#__PURE__*/_react["default"].createElement(_library_widgets.BpSelectorTable, {
        data_dict: this.state.data_dict,
        num_rows: this.state.num_rows,
        awaiting_data: this.state.awaiting_data,
        enableColumnResizing: false,
        maxColumnWidth: 225,
        sortColumn: this._set_sort_state,
        selectedRegions: this.props.selectedRegions,
        communicateColumnWidthSum: this._communicateColumnWidthSum,
        onSelection: this._onTableSelection,
        initiateDataGrab: this._initiateDataGrab,
        columns: column_specs,
        identifier_field: this.props.id_field
      }))));

      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(MenubarClass, _extends({
        selected_resource: this.props.selected_resource,
        list_of_selected: this.props.list_of_selected,
        setConsoleText: this._setConsoleText,
        delete_row: this._delete_row,
        refresh_func: this._refresh_func,
        startSpinner: this.props.startSpinner,
        stopSpinner: this.props.stopSpinner,
        clearStatusMessage: this.props.clearStatusMessage
      }, this.props.errorDrawerFuncs)), /*#__PURE__*/_react["default"].createElement(_core.ResizeSensor, {
        onResize: this._handleResize,
        observeParents: true
      }, /*#__PURE__*/_react["default"].createElement("div", {
        ref: this.top_ref,
        className: "d-flex flex-column mt-3"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          width: this.state.available_width,
          height: this.state.available_height
        }
      }, /*#__PURE__*/_react["default"].createElement(_resizing_layouts.HorizontalPanes, {
        left_pane: left_pane,
        right_pane: right_pane,
        show_handle: true,
        available_width: this.state.available_width,
        available_height: this.state.available_height,
        initial_width_fraction: .65,
        handleSplitUpdate: this._handleSplitResize
      })))));
    }
  }]);

  return AdminPane;
}(_react["default"].Component);

exports.AdminPane = AdminPane;
AdminPane.propTypes = {
  usable_height: _propTypes["default"].number,
  usable_width: _propTypes["default"].number,
  res_type: _propTypes["default"].string,
  allow_search_inside: _propTypes["default"].bool,
  allow_search_metadata: _propTypes["default"].bool,
  search_inside_view: _propTypes["default"].string,
  search_metadata_view: _propTypes["default"].string,
  MenubarClass: _propTypes["default"].func,
  is_repository: _propTypes["default"].bool,
  tsocket: _propTypes["default"].object,
  colnames: _propTypes["default"].array,
  id_field: _propTypes["default"].string
};
AdminPane.defaultProps = {
  is_repository: false,
  tsocket: null
};