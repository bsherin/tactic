"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CommandsModule = exports.ExportModule = exports.OptionModule = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _blueprint_toolbar = require("./blueprint_toolbar.js");

var _communication_react = require("./communication_react.js");

var _library_widgets = require("./library_widgets.js");

var _blueprint_react_widgets = require("./blueprint_react_widgets.js");

var _toaster = require("./toaster.js");

var _lodash = _interopRequireDefault(require("lodash"));

var _utilities_react = require("./utilities_react");

var _blueprint_mdata_fields = require("./blueprint_mdata_fields");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

var OptionModuleForm = /*#__PURE__*/function (_React$Component) {
  _inherits(OptionModuleForm, _React$Component);

  var _super = _createSuper(OptionModuleForm);

  function OptionModuleForm(props) {
    var _this;

    _classCallCheck(this, OptionModuleForm);

    _this = _super.call(this, props);
    _this.option_types = ['text', 'int', 'float', 'boolean', 'textarea', 'codearea', 'column_select', 'document_select', 'list_select', 'collection_select', 'palette_select', 'pipe_select', 'custom_list', 'function_select', 'class_select', 'tile_select'];
    _this.taggable_types = ["class_select", "function_select", "pipe_select", "list_select", "collection_select"];
    _this.state = {
      "name": "",
      "type": "text",
      "default": "",
      "special_list": "",
      "tags": ""
    };
    _this.handleNameChange = _this.handleNameChange.bind(_assertThisInitialized(_this));
    _this.handleDefaultChange = _this.handleDefaultChange.bind(_assertThisInitialized(_this));
    _this.handleTagChange = _this.handleTagChange.bind(_assertThisInitialized(_this));
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_this));
    _this.handleTypeChange = _this.handleTypeChange.bind(_assertThisInitialized(_this));
    _this.handleSpecialListChange = _this.handleSpecialListChange.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(OptionModuleForm, [{
    key: "handleNameChange",
    value: function handleNameChange(event) {
      this.setState({
        "name": event.target.value
      });
    }
  }, {
    key: "handleDefaultChange",
    value: function handleDefaultChange(event) {
      this.setState({
        "default": event.target.value
      });
    }
  }, {
    key: "handleTagChange",
    value: function handleTagChange(event) {
      this.setState({
        "tags": event.target.value
      });
    }
  }, {
    key: "handleSpecialListChange",
    value: function handleSpecialListChange(event) {
      this.setState({
        "special_list": event.currentTarget.value
      });
    }
  }, {
    key: "handleTypeChange",
    value: function handleTypeChange(event) {
      var new_type = event.currentTarget.value;
      var updater = {
        "type": new_type
      };

      if (new_type != "custom_list") {
        updater["special_list"] = "";
      }

      if (!this.taggable_types.includes(new_type)) {
        updater["tags"] = "";
      }

      this.setState(updater);
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit() {
      this.props.handleCreate(this.state);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return /*#__PURE__*/_react["default"].createElement("form", null, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          display: "flex",
          flexDirection: "row",
          padding: 25
        }
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.LabeledFormField, {
        label: "Name",
        onChange: this.handleNameChange,
        the_value: this.state.name
      }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.LabeledSelectList, {
        label: "Type",
        option_list: this.option_types,
        onChange: this.handleTypeChange,
        the_value: this.state.type
      }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.LabeledFormField, {
        label: "Default",
        onChange: this.handleDefaultChange,
        the_value: this.state.default_value
      }), this.state.type == "custom_list" && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.LabeledFormField, {
        label: "Special List",
        onChange: this.handleSpecialListChange,
        the_value: this.state.special_list
      }), this.taggable_types.includes(this.state.type) && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.LabeledFormField, {
        label: "Tag",
        onChange: this.handleTagChange,
        the_value: this.state.tag
      })), /*#__PURE__*/_react["default"].createElement(_core.Button, {
        type: "submit",
        text: "Create",
        onClick: function onClick(e) {
          e.preventDefault();

          _this2.handleSubmit();
        }
      }));
    }
  }]);

  return OptionModuleForm;
}(_react["default"].Component);

OptionModuleForm.propTypes = {
  handleCreate: _propTypes["default"].func
};

var OptionModule = /*#__PURE__*/function (_React$Component2) {
  _inherits(OptionModule, _React$Component2);

  var _super2 = _createSuper(OptionModule);

  function OptionModule(props) {
    var _this3;

    _classCallCheck(this, OptionModule);

    _this3 = _super2.call(this, props);
    _this3.state = {
      "active_row": 0
    };
    _this3.handleActiveRowChange = _this3.handleActiveRowChange.bind(_assertThisInitialized(_this3));
    _this3.handleCreate = _this3.handleCreate.bind(_assertThisInitialized(_this3));
    return _this3;
  }

  _createClass(OptionModule, [{
    key: "delete_option",
    value: function delete_option() {
      var new_data_list = _lodash["default"].cloneDeep(this.props.data_list);

      new_data_list.splice(this.state.active_row, 1);
      this.props.handleChange(new_data_list);
    }
  }, {
    key: "send_doc_text",
    value: function send_doc_text() {
      var res_string = "\n\noptions: \n\n";

      var _iterator = _createForOfIteratorHelper(this.props.data_list),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var opt = _step.value;
          res_string += " * `".concat(opt.name, "` (").concat(opt.type, "): \n");
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      this.props.handleNotesAppend(res_string);
    }
  }, {
    key: "handleCreate",
    value: function handleCreate(new_row) {
      var new_data_list = this.props.data_list;
      new_data_list.push(new_row);
      this.props.handleChange(new_data_list);
    }
  }, {
    key: "handleActiveRowChange",
    value: function handleActiveRowChange(row_index) {
      this.setState({
        "active_row": row_index
      });
    }
  }, {
    key: "button_groups",
    get: function get() {
      var bgs = [[{
        "name_text": "delete",
        "icon_name": "trash",
        "click_handler": this.delete_option,
        tooltip: "Delete option"
      }, {
        "name_text": "toMeta",
        "icon_name": "properties",
        "click_handler": this.send_doc_text,
        tooltip: "Append info to notes field"
      }]];

      for (var _i = 0, _bgs = bgs; _i < _bgs.length; _i++) {
        var bg = _bgs[_i];

        var _iterator2 = _createForOfIteratorHelper(bg),
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

      return bgs;
    }
  }, {
    key: "render",
    value: function render() {
      var cols = ["name", "type", "default", "special_list", "tags"];
      var options_pane_style = {
        "marginTop": 10,
        "marginLeft": 10,
        "marginRight": 10
      };

      if (this.state.active_row >= this.props.data_list.length) {
        this.state.active_row = this.props.data_list.length - 1;
      }

      return /*#__PURE__*/_react["default"].createElement(_core.Card, {
        elevation: 1,
        id: "options-pane",
        className: "d-flex flex-column",
        style: options_pane_style
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "d-flex flex-row mb-2"
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_toolbar.Toolbar, {
        button_groups: this.button_groups
      })), this.props.foregrounded && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.BpOrderableTable, {
        columns: cols,
        data_array: this.props.data_list,
        active_row: this.state.active_row,
        handleActiveRowChange: this.handleActiveRowChange,
        handleChange: this.props.handleChange,
        content_editable: true
      }), /*#__PURE__*/_react["default"].createElement(OptionModuleForm, {
        handleCreate: this.handleCreate
      }));
    }
  }]);

  return OptionModule;
}(_react["default"].Component);

exports.OptionModule = OptionModule;
OptionModule.propTypes = {
  data_list: _propTypes["default"].array,
  foregrounded: _propTypes["default"].bool,
  handleChange: _propTypes["default"].func,
  handleNotesAppend: _propTypes["default"].func
};

var ExportModuleForm = /*#__PURE__*/function (_React$Component3) {
  _inherits(ExportModuleForm, _React$Component3);

  var _super3 = _createSuper(ExportModuleForm);

  function ExportModuleForm(props) {
    var _this4;

    _classCallCheck(this, ExportModuleForm);

    _this4 = _super3.call(this, props);
    _this4.state = {
      "name": "",
      "tags": ""
    };
    _this4.handleNameChange = _this4.handleNameChange.bind(_assertThisInitialized(_this4));
    _this4.handleTagChange = _this4.handleTagChange.bind(_assertThisInitialized(_this4));
    _this4.handleSubmit = _this4.handleSubmit.bind(_assertThisInitialized(_this4));
    return _this4;
  }

  _createClass(ExportModuleForm, [{
    key: "handleNameChange",
    value: function handleNameChange(event) {
      this.setState({
        "name": event.target.value
      });
    }
  }, {
    key: "handleTagChange",
    value: function handleTagChange(event) {
      this.setState({
        "tags": event.target.value
      });
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit() {
      this.props.handleCreate(this.state);
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      return /*#__PURE__*/_react["default"].createElement("form", null, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          display: "flex",
          flexDirection: "row",
          padding: 25
        }
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.LabeledFormField, {
        label: "Name",
        onChange: this.handleNameChange,
        the_value: this.state.name
      }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.LabeledFormField, {
        label: "Tag",
        onChange: this.handleTagChange,
        the_value: this.state.tag
      })), /*#__PURE__*/_react["default"].createElement(_core.Button, {
        text: "Create",
        type: "submit",
        onClick: function onClick(e) {
          e.preventDefault();

          _this5.handleSubmit();
        }
      }));
    }
  }]);

  return ExportModuleForm;
}(_react["default"].Component);

ExportModuleForm.propTypes = {
  handleCreate: _propTypes["default"].func
};

var ExportModule = /*#__PURE__*/function (_React$Component4) {
  _inherits(ExportModule, _React$Component4);

  var _super4 = _createSuper(ExportModule);

  function ExportModule(props) {
    var _this6;

    _classCallCheck(this, ExportModule);

    _this6 = _super4.call(this, props);
    _this6.state = {
      "active_row": 0
    };
    _this6.handleActiveRowChange = _this6.handleActiveRowChange.bind(_assertThisInitialized(_this6));
    _this6.handleCreate = _this6.handleCreate.bind(_assertThisInitialized(_this6));
    return _this6;
  }

  _createClass(ExportModule, [{
    key: "delete_export",
    value: function delete_export() {
      var new_data_list = this.props.data_list;
      new_data_list.splice(this.state.active_row, 1);
      this.props.handleChange(new_data_list);
    }
  }, {
    key: "send_doc_text",
    value: function send_doc_text() {
      var res_string = "\n\nexports: \n\n";

      var _iterator3 = _createForOfIteratorHelper(this.props.data_list),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var exp = _step3.value;
          res_string += " * `".concat(exp.name, "` : \n");
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      this.props.handleNotesAppend(res_string);
    }
  }, {
    key: "handleCreate",
    value: function handleCreate(new_row) {
      var new_data_list = this.props.data_list;
      new_data_list.push(new_row);
      this.props.handleChange(new_data_list);
    }
  }, {
    key: "handleActiveRowChange",
    value: function handleActiveRowChange(row_index) {
      this.setState({
        "active_row": row_index
      });
    }
  }, {
    key: "button_groups",
    get: function get() {
      var bgs = [[{
        "name_text": "delete",
        "icon_name": "trash",
        "click_handler": this.delete_export,
        tooltip: "Delete export"
      }, {
        "name_text": "toMeta",
        "icon_name": "properties",
        "click_handler": this.send_doc_text,
        tooltip: "Append info to notes field"
      }]];

      for (var _i2 = 0, _bgs2 = bgs; _i2 < _bgs2.length; _i2++) {
        var bg = _bgs2[_i2];

        var _iterator4 = _createForOfIteratorHelper(bg),
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

      return bgs;
    }
  }, {
    key: "render",
    value: function render() {
      var cols = ["name", "tags"];
      var exports_pane_style = {
        "marginTop": 10,
        "marginLeft": 10,
        "marginRight": 10
      };

      if (this.state.active_row >= this.props.data_list.length) {
        this.state.active_row = this.props.data_list.length - 1;
      }

      return /*#__PURE__*/_react["default"].createElement(_core.Card, {
        elevation: 1,
        id: "exports-pane",
        className: "d-flex flex-column",
        style: exports_pane_style
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "d-flex flex-row mb-2"
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_toolbar.Toolbar, {
        button_groups: this.button_groups
      })), this.props.foregrounded && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.BpOrderableTable, {
        columns: cols,
        data_array: this.props.data_list,
        active_row: this.state.active_row,
        handleActiveRowChange: this.handleActiveRowChange,
        handleChange: this.props.handleChange,
        content_editable: true
      }), /*#__PURE__*/_react["default"].createElement(ExportModuleForm, {
        handleCreate: this.handleCreate
      }));
    }
  }]);

  return ExportModule;
}(_react["default"].Component);

exports.ExportModule = ExportModule;
ExportModule.propTypes = {
  data_list: _propTypes["default"].array,
  foregrounded: _propTypes["default"].bool,
  handleChange: _propTypes["default"].func,
  handleNotesAppend: _propTypes["default"].func
};

var CommandsModule = /*#__PURE__*/function (_React$Component5) {
  _inherits(CommandsModule, _React$Component5);

  var _super5 = _createSuper(CommandsModule);

  function CommandsModule(props) {
    var _this7;

    _classCallCheck(this, CommandsModule);

    _this7 = _super5.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this7));
    _this7.state = {
      search_string: "",
      api_dict: {},
      ordered_categories: [],
      object_api_dict: {},
      ordered_object_categories: []
    };
    return _this7;
  }

  _createClass(CommandsModule, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var self = this;
      (0, _communication_react.postAjax)("get_api_dict", {}, function (data) {
        self.setState({
          api_dict: data.api_dict_by_category,
          object_api_dict: data.object_api_dict_by_category,
          ordered_object_categories: data.ordered_object_categories,
          ordered_categories: data.ordered_api_categories
        });
      });
    }
  }, {
    key: "_updateSearchState",
    value: function _updateSearchState(new_state) {
      this.setState(new_state);
    }
  }, {
    key: "render",
    value: function render() {
      var commands_pane_style = {
        "marginTop": 10,
        "marginLeft": 10,
        "marginRight": 10,
        "paddingTop": 10
      };
      var menu_items = [];
      var object_items = [];

      var _iterator5 = _createForOfIteratorHelper(this.state.ordered_object_categories),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var category = _step5.value;

          var res = /*#__PURE__*/_react["default"].createElement(ObjectCategoryEntry, {
            category_name: category,
            key: category,
            search_string: this.state.search_string,
            class_list: this.state.object_api_dict[category]
          });

          object_items.push(res);
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      var command_items = [];

      var _iterator6 = _createForOfIteratorHelper(this.state.ordered_categories),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var _category = _step6.value;

          var _res = /*#__PURE__*/_react["default"].createElement(CategoryEntry, {
            category_name: _category,
            key: _category,
            search_string: this.state.search_string,
            command_list: this.state.api_dict[_category]
          });

          command_items.push(_res);
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }

      return /*#__PURE__*/_react["default"].createElement(_core.Card, {
        elevation: 1,
        id: "commands-pane",
        className: "d-flex flex-column",
        style: commands_pane_style
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          display: "flex",
          justifyContent: "flex-end",
          marginRight: 25
        }
      }, /*#__PURE__*/_react["default"].createElement(_library_widgets.SearchForm, {
        update_search_state: this._updateSearchState,
        search_string: this.state.search_string
      })), /*#__PURE__*/_react["default"].createElement("div", {
        ref: this.props.commands_ref,
        style: {
          fontSize: 13,
          overflow: "auto",
          height: this.props.available_height
        }
      }, /*#__PURE__*/_react["default"].createElement("h4", null, "Object api"), object_items, /*#__PURE__*/_react["default"].createElement("h4", {
        style: {
          marginTop: 20
        }
      }, "TileBase methods (accessed with self)"), command_items));
    }
  }]);

  return CommandsModule;
}(_react["default"].Component);

exports.CommandsModule = CommandsModule;
CommandsModule.propTypes = {
  commands_ref: _propTypes["default"].object,
  available_height: _propTypes["default"].number
};

function stringIncludes(str1, str2) {
  return str1.toLowerCase().includes(str2.toLowerCase());
}

var ObjectCategoryEntry = /*#__PURE__*/function (_React$Component6) {
  _inherits(ObjectCategoryEntry, _React$Component6);

  var _super6 = _createSuper(ObjectCategoryEntry);

  function ObjectCategoryEntry(props) {
    var _this8;

    _classCallCheck(this, ObjectCategoryEntry);

    _this8 = _super6.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this8));
    return _this8;
  }

  _createClass(ObjectCategoryEntry, [{
    key: "render",
    value: function render() {
      var classes = [];
      var show_whole_category = false;
      var show_category = false;

      if (this.props.search_string == "" || stringIncludes(this.props.category_name, this.props.search_string)) {
        show_whole_category = true;
        show_category = true;
      }

      var _iterator7 = _createForOfIteratorHelper(this.props.class_list),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var class_entry = _step7.value;
          var entries = [];
          var show_class = false;

          if (class_entry[2] == "class") {
            var show_whole_class = false;

            if (show_whole_category || stringIncludes(class_entry[0], this.props.search_string)) {
              show_whole_class = true;
              show_category = true;
              show_class = true;
            }

            var _iterator8 = _createForOfIteratorHelper(class_entry[1]),
                _step8;

            try {
              for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                var entry = _step8.value;
                entry["kind"] = "class_" + entry["kind"];
                var show_entry = false;

                if (show_whole_class || stringIncludes(entry.signature, this.props.search_string)) {
                  entries.push( /*#__PURE__*/_react["default"].createElement(CommandEntry, entry));
                  show_class = true;
                  show_category = true;
                }
              }
            } catch (err) {
              _iterator8.e(err);
            } finally {
              _iterator8.f();
            }

            if (show_class) {
              classes.push( /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("h6", {
                style: {
                  marginTop: 20,
                  fontFamily: "monospace"
                }
              }, "class " + class_entry[0]), entries));
            }
          } else {
            var _entry = class_entry[1];

            if (show_whole_category || stringIncludes(_entry.signature, this.props.search_string)) {
              entries.push( /*#__PURE__*/_react["default"].createElement(CommandEntry, _entry));
              show_category = true;
            }
          }
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }

      if (show_category) {
        return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("h5", {
          style: {
            marginTop: 20
          }
        }, this.props.category_name), classes, /*#__PURE__*/_react["default"].createElement(_core.Divider, null));
      } else {
        return null;
      }
    }
  }]);

  return ObjectCategoryEntry;
}(_react["default"].Component);

ObjectCategoryEntry.propTypes = {
  category_name: _propTypes["default"].string,
  class_list: _propTypes["default"].array,
  search_string: _propTypes["default"].string
};

var CategoryEntry = /*#__PURE__*/function (_React$Component7) {
  _inherits(CategoryEntry, _React$Component7);

  var _super7 = _createSuper(CategoryEntry);

  function CategoryEntry(props) {
    var _this9;

    _classCallCheck(this, CategoryEntry);

    _this9 = _super7.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this9));
    return _this9;
  }

  _createClass(CategoryEntry, [{
    key: "render",
    value: function render() {
      var show_whole_category = false;
      var show_category = false;

      if (this.props.search_string == "" || stringIncludes(this.props.category_name, this.props.search_string)) {
        show_whole_category = true;
        show_category = true;
      }

      var entries = [];

      var _iterator9 = _createForOfIteratorHelper(this.props.command_list),
          _step9;

      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var entry = _step9.value;

          if (show_whole_category || stringIncludes(entry.signature, this.props.search_string)) {
            show_category = true;
            entries.push( /*#__PURE__*/_react["default"].createElement(CommandEntry, entry));
          }
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }

      if (show_category) {
        return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("h5", {
          style: {
            marginTop: 20
          }
        }, this.props.category_name), entries, /*#__PURE__*/_react["default"].createElement(_core.Divider, null));
      } else {
        return null;
      }
    }
  }]);

  return CategoryEntry;
}(_react["default"].Component);

CategoryEntry.propTypes = {
  category_name: _propTypes["default"].string,
  command_list: _propTypes["default"].array,
  search_string: _propTypes["default"].string
};

var CommandEntry = /*#__PURE__*/function (_React$Component8) {
  _inherits(CommandEntry, _React$Component8);

  var _super8 = _createSuper(CommandEntry);

  function CommandEntry(props) {
    var _this10;

    _classCallCheck(this, CommandEntry);

    _this10 = _super8.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this10));
    _this10.state = {
      isOpen: false
    };
    return _this10;
  }

  _createClass(CommandEntry, [{
    key: "_handleClick",
    value: function _handleClick() {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }
  }, {
    key: "_doCopy",
    value: function _doCopy() {
      if (navigator.clipboard && window.isSecureContext) {
        if (this.props.kind == "method" || this.props.kind == "attribute") {
          navigator.clipboard.writeText("self." + this.props.signature);
        } else {
          navigator.clipboard.writeText(this.props.signature);
        }

        (0, _toaster.doFlash)({
          message: "command copied",
          "timeout": 2000,
          "alert_type": "alert-success"
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var md_style = {
        "display": "block",
        // "maxHeight": this.state.md_height,
        "fontSize": 13
      };
      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_core.Button, {
        minimal: true,
        outlined: this.state.isOpen,
        className: "bp3-monospace-text",
        onClick: this._handleClick
      }, this.props.signature), /*#__PURE__*/_react["default"].createElement(_core.Collapse, {
        isOpen: this.state.isOpen
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          maxWidth: 700,
          position: "relative"
        }
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        style: {
          position: "absolute",
          right: 5,
          top: 5,
          marginTop: 0
        },
        icon: "clipboard",
        small: true,
        handleClick: this._doCopy
      }), /*#__PURE__*/_react["default"].createElement("div", {
        style: md_style,
        className: "notes-field-markdown-output bp3-button bp3-outlined",
        dangerouslySetInnerHTML: {
          __html: this.props.body
        }
      }))));
    }
  }]);

  return CommandEntry;
}(_react["default"].Component);

CommandEntry.propTypes = {
  name: _propTypes["default"].string,
  signature: _propTypes["default"].string,
  body: _propTypes["default"].string,
  kind: _propTypes["default"].string
};

var ApiMenu = /*#__PURE__*/function (_React$Component9) {
  _inherits(ApiMenu, _React$Component9);

  var _super9 = _createSuper(ApiMenu);

  function ApiMenu(props) {
    var _this11;

    _classCallCheck(this, ApiMenu);

    _this11 = _super9.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this11));
    _this11.state = {
      currently_selected: null,
      menu_created: false
    };
    return _this11;
  }

  _createClass(ApiMenu, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!this.state.menu_created && this.props.item_list.length > 0) {
        this.setState({
          current_selected: this.props.item_list[0].name,
          menu_created: true
        });
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (!this.state.menu_created && this.props.item_list.length > 0) {
        this.setState({
          current_selected: this.props.item_list[0].name,
          menu_created: true
        });
      }
    }
  }, {
    key: "_buildMenu",
    value: function _buildMenu() {
      var choices = [];

      var _iterator10 = _createForOfIteratorHelper(this.props.item_list),
          _step10;

      try {
        for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
          var item = _step10.value;

          if (item.kind == "header") {
            choices.push( /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, {
              title: item.name
            }));
          } else {
            choices.push( /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
              text: item.name
            }));
          }
        }
      } catch (err) {
        _iterator10.e(err);
      } finally {
        _iterator10.f();
      }

      return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, choices);
    }
  }, {
    key: "_handleChange",
    value: function _handleChange(value) {
      this.setState({
        currently_selected: value
      });
    }
  }, {
    key: "render",
    value: function render() {
      var option_list = [];

      var _iterator11 = _createForOfIteratorHelper(this.props.item_list),
          _step11;

      try {
        for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
          var item = _step11.value;
          option_list.push(item.name);
        }
      } catch (err) {
        _iterator11.e(err);
      } finally {
        _iterator11.f();
      }

      return (
        /*#__PURE__*/
        // <Popover minimal={true} content={this.state.the_menu} position={PopoverPosition.BOTTOM_LEFT}>
        //     <Button text="jump to..." small={true} minimal={true}/>
        // </Popover>
        _react["default"].createElement(_blueprint_mdata_fields.BpSelect, {
          options: option_list,
          onChange: this._handleChange,
          buttonIcon: "application",
          value: this.state.currently_selected
        })
      );
    }
  }]);

  return ApiMenu;
}(_react["default"].Component);

ApiMenu.propTypes = {
  item_list: _propTypes["default"].array
};