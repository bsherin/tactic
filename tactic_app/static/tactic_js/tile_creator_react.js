"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

require("../tactic_css/tactic.scss");

require("../tactic_css/tactic_table.scss");

require("../tactic_css/tile_creator.scss");

require("codemirror/mode/javascript/javascript.js");

var _react = _interopRequireDefault(require("react"));

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _tactic_socket = require("./tactic_socket.js");

var _blueprint_toolbar = require("./blueprint_toolbar.js");

var _resource_viewer_react_app = require("./resource_viewer_react_app.js");

var _reactCodemirror = require("./react-codemirror.js");

var _blueprint_mdata_fields = require("./blueprint_mdata_fields.js");

var _creator_modules_react = require("./creator_modules_react.js");

var _resizing_layouts = require("./resizing_layouts.js");

var _communication_react = require("./communication_react.js");

var _toaster = require("./toaster.js");

var _sizing_tools = require("./sizing_tools.js");

var _error_drawer = require("./error_drawer.js");

var _utilities_react = require("./utilities_react.js");

var _blueprint_navbar = require("./blueprint_navbar");

var _library_widgets = require("./library_widgets");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

var BOTTOM_MARGIN = 50;
var MARGIN_SIZE = 17;
window.main_id = window.module_viewer_id; // This matters for communication_react

window.name = window.module_viewer_id;
var tsocket; // Note: it seems like the sendbeacon doesn't work if this callback has a line
// before the sendbeacon

window.addEventListener("unload", function sendRemove() {
  navigator.sendBeacon("/delete_container_on_unload", JSON.stringify({
    "container_id": window.module_viewer_id,
    "notify": false
  }));
});

var CreatorViewerSocket = /*#__PURE__*/function (_TacticSocket) {
  _inherits(CreatorViewerSocket, _TacticSocket);

  var _super = _createSuper(CreatorViewerSocket);

  function CreatorViewerSocket() {
    _classCallCheck(this, CreatorViewerSocket);

    return _super.apply(this, arguments);
  }

  _createClass(CreatorViewerSocket, [{
    key: "initialize_socket_stuff",
    value: function initialize_socket_stuff() {
      var reconnect = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      this.socket.emit('join', {
        "room": window.user_id
      });

      if (reconnect) {
        this.socket.emit('join-main', {
          "room": window.module_viewer_id,
          "user_id": window.user_id
        }, function (response) {});
      }

      this.socket.on('handle-callback', _communication_react.handleCallback);
      this.socket.on('close-user-windows', function (data) {
        if (!(data["originator"] == window.module_viewer_id)) {
          window.close();
        }
      });
      this.socket.on("doFlash", function (data) {
        (0, _toaster.doFlash)(data);
      });
    }
  }]);

  return CreatorViewerSocket;
}(_tactic_socket.TacticSocket);

function tile_creator_main() {
  tsocket = new CreatorViewerSocket("main", 5000);
  tsocket.socket.on("remove-ready-block", _everyone_ready);
  tsocket.socket.emit('join-main', {
    "room": window.module_viewer_id,
    "user_id": window.user_id
  }, function (response) {
    tsocket.socket.emit('client-ready', {
      "room": window.module_viewer_id,
      "user_id": window.user_id,
      "participant": "client",
      "rb_id": window.ready_block_id,
      "main_id": window.module_viewer_id
    });
  });
}

function _everyone_ready() {
  var the_content = {
    "module_name": window.module_name,
    "module_viewer_id": window.module_viewer_id,
    "tile_collection_name": window.tile_collection_name,
    "user_id": window.user_id,
    "version_string": window.version_string
  };
  (0, _communication_react.postWithCallback)(window.module_viewer_id, "initialize_parser", the_content, got_parsed_data);
}

function got_parsed_data(data_object) {
  var domContainer = document.querySelector('#creator-root');
  var parsed_data = data_object.the_content;
  var result_dict = {
    "res_type": "tile",
    "res_name": window.module_name,
    "is_repository": false
  };
  var odict = parsed_data.option_dict;

  var _iterator = _createForOfIteratorHelper(odict),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var option = _step.value;

      for (var param in option) {
        if (Array.isArray(option[param])) {
          var nstring = "[";
          var isfirst = true;

          var _iterator2 = _createForOfIteratorHelper(option[param]),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var item = _step2.value;

              if (!isfirst) {
                nstring += ", ";
              } else {
                isfirst = false;
              }

              nstring += "'" + String(item) + "'";
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          nstring += "]";
          option[param] = nstring;
        }
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  (0, _communication_react.postAjaxPromise)("grab_metadata", result_dict).then(function (data) {
    var split_tags = data.tags == "" ? [] : data.tags.split(" ");
    var category = parsed_data.category ? parsed_data.category : "basic";
    ReactDOM.render( /*#__PURE__*/_react["default"].createElement(CreatorAppPlus, {
      is_mpl: parsed_data.is_mpl,
      is_d3: parsed_data.is_d3,
      render_content_code: parsed_data.render_content_code,
      render_content_line_number: parsed_data.render_content_line_number,
      extra_methods_line_number: parsed_data.extra_methods_line_number,
      draw_plot_line_number: parsed_data.draw_plot_line_number,
      initial_line_number: window.line_number,
      category: category,
      extra_functions: parsed_data.extra_functions,
      draw_plot_code: parsed_data.draw_plot_code,
      jscript_code: parsed_data.jscript_code,
      tags: split_tags,
      notes: data.notes,
      initial_theme: window.theme,
      option_list: parsed_data.option_dict,
      export_list: parsed_data.export_list,
      created: data.datestring
    }), domContainer);
  })["catch"](function (data) {
    (0, _toaster.doFlash)(data);
  });
}

function TileCreatorToolbar(props) {
  var tstyle = {
    "marginTop": 20,
    "paddingRight": 20,
    "width": "100%"
  };
  var toolbar_outer_style = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 0,
    marginTop: 7
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: tstyle,
    className: "d-flex flex-row justify-content-between"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_toolbar.Namebutton, {
    resource_name: props.tile_name,
    setResourceNameState: props.setResourceNameState,
    res_type: props.res_type,
    large: false
  }), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_blueprint_toolbar.Toolbar, {
    button_groups: props.button_groups,
    alternate_outer_style: toolbar_outer_style
  })), /*#__PURE__*/_react["default"].createElement(_library_widgets.SearchForm, {
    update_search_state: props.update_search_state,
    search_string: props.search_string
  }));
}

var CreatorApp = /*#__PURE__*/function (_React$Component) {
  _inherits(CreatorApp, _React$Component);

  var _super2 = _createSuper(CreatorApp);

  function CreatorApp(props) {
    var _this;

    _classCallCheck(this, CreatorApp);

    _this = _super2.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    _this.top_ref = /*#__PURE__*/_react["default"].createRef();
    var aheight = (0, _sizing_tools.getUsableDimensions)().usable_height;
    var awidth = (0, _sizing_tools.getUsableDimensions)().usable_width;
    var bheight = (0, _sizing_tools.getUsableDimensions)().body_height;
    _this.options_ref = /*#__PURE__*/_react["default"].createRef();
    _this.left_div_ref = /*#__PURE__*/_react["default"].createRef();
    _this.right_div_ref = /*#__PURE__*/_react["default"].createRef();
    _this.tc_span_ref = /*#__PURE__*/_react["default"].createRef();
    _this.rc_span_ref = /*#__PURE__*/_react["default"].createRef();
    _this.vp_ref = /*#__PURE__*/_react["default"].createRef();
    _this.hp_ref = /*#__PURE__*/_react["default"].createRef();
    _this.methods_ref = /*#__PURE__*/_react["default"].createRef();
    _this.commands_ref = /*#__PURE__*/_react["default"].createRef();
    _this.draw_plot_bounding_ref = /*#__PURE__*/_react["default"].createRef();
    _this.last_save = {};
    _this.dpObject = null;
    _this.rcObject = null;
    _this.emObject = null;
    _this.line_number = _this.props.initial_line_number;
    _this.socket_counter = null;
    _this.state = {
      tile_name: window.module_name,
      foregrounded_panes: {
        "metadata": true,
        "options": false,
        "exports": false,
        "methods": false,
        "commands": false
      },
      search_string: "",
      render_content_code: _this.props.render_content_code,
      draw_plot_code: _this.props.draw_plot_code,
      jscript_code: _this.props.jscript_code,
      extra_functions: _this.props.extra_functions,
      render_content_line_number: _this.props.render_content_line_number,
      draw_plot_line_number: _this.props.draw_plot_line_number,
      extra_methods_line_number: _this.props.extra_methods_line_number,
      tags: _this.props.tags,
      notes: _this.props.notes,
      option_list: _this.props.option_list,
      export_list: _this.props.export_list,
      category: _this.props.category,
      total_height: window.innerHeight,
      selectedTabId: "metadata",
      usable_width: awidth,
      old_usable_width: 0,
      usable_height: aheight,
      dark_theme: _this.props.initial_theme == "dark",
      body_height: bheight,
      top_pane_height: _this.props.is_mpl || _this.props.is_d3 ? aheight / 2 - 25 : null,
      bottom_pane_height: _this.props.is_mpl || _this.props.is_d3 ? aheight / 2 - 25 : null,
      left_pane_width: awidth / 2 - 25,
      methodsTabRefreshRequired: true // This is toggled back and forth to force refresh

    };
    _this._setResourceNameState = _this._setResourceNameState.bind(_assertThisInitialized(_this));
    _this.handleStateChange = _this.handleStateChange.bind(_assertThisInitialized(_this));
    _this.handleRenderContentChange = _this.handleRenderContentChange.bind(_assertThisInitialized(_this));
    _this.handleTopCodeChange = _this.handleTopCodeChange.bind(_assertThisInitialized(_this));
    _this.update_window_dimensions = _this.update_window_dimensions.bind(_assertThisInitialized(_this));
    _this.handleOptionsChange = _this.handleOptionsChange.bind(_assertThisInitialized(_this));
    _this.handleExportsChange = _this.handleExportsChange.bind(_assertThisInitialized(_this));
    _this.handleMethodsChange = _this.handleMethodsChange.bind(_assertThisInitialized(_this));
    _this.handleLeftPaneResize = _this.handleLeftPaneResize.bind(_assertThisInitialized(_this));
    _this.handleTopPaneResize = _this.handleTopPaneResize.bind(_assertThisInitialized(_this));

    var self = _assertThisInitialized(_this);

    window.addEventListener("beforeunload", function (e) {
      if (self.dirty()) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
    return _this;
  }

  _createClass(CreatorApp, [{
    key: "button_groups",
    get: function get() {
      var _this2 = this;

      var bgs = [[{
        "name_text": "Save",
        "icon_name": "saved",
        "click_handler": this._saveMe,
        key_bindings: ['ctrl+s', "command+s"],
        tooltip: "Save"
      }, {
        "name_text": "Mark",
        "icon_name": "map-marker",
        "click_handler": this._saveAndCheckpoint,
        key_bindings: ['ctrl+m'],
        tooltip: "Save and checkpoint"
      }, {
        "name_text": "SaveAs",
        "icon_name": "floppy-disk",
        "click_handler": this._saveModuleAs,
        tooltip: "Save as"
      }, {
        "name_text": "Load",
        "icon_name": "upload",
        "click_handler": this._loadModule,
        key_bindings: ['ctrl+l'],
        tooltip: "Load tile"
      }, {
        "name_text": "Share",
        "icon_name": "share",
        "click_handler": function click_handler() {
          (0, _resource_viewer_react_app.sendToRepository)("tile", _this2.state.tile_name);
        },
        tooltip: "Send to repository"
      }], [{
        "name_text": "History",
        "icon_name": "history",
        "click_handler": this._showHistoryViewer,
        tooltip: "Show history viewer"
      }, {
        "name_text": "Compare",
        "icon_name": "comparison",
        "click_handler": this._showTileDiffer,
        tooltip: "Compare to another tile"
      }], [{
        "name_text": "Drawer",
        "icon_name": "drawer-right",
        "click_handler": this.props.toggleErrorDrawer,
        tooltip: "Toggle error drawer"
      }]];

      for (var _i = 0, _bgs = bgs; _i < _bgs.length; _i++) {
        var bg = _bgs[_i];

        var _iterator3 = _createForOfIteratorHelper(bg),
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

      return bgs;
    }
  }, {
    key: "_updateSearchState",
    value: function _updateSearchState(new_state) {
      this.setState(new_state);
    }
  }, {
    key: "_setTheme",
    value: function _setTheme(dark_theme) {
      var _this3 = this;

      this.setState({
        dark_theme: dark_theme
      }, function () {
        _this3.props.setStatusTheme(dark_theme);

        window.dark_theme = _this3.state.dark_theme;
      });
    }
  }, {
    key: "_showHistoryViewer",
    value: function _showHistoryViewer() {
      window.open("".concat($SCRIPT_ROOT, "/show_history_viewer/").concat(this.state.tile_name));
    }
  }, {
    key: "_showTileDiffer",
    value: function _showTileDiffer() {
      window.open("".concat($SCRIPT_ROOT, "/show_tile_differ/").concat(this.state.tile_name));
    }
  }, {
    key: "_doFlashStopSpinner",
    value: function _doFlashStopSpinner(data) {
      this.props.clearStatus();
      (0, _toaster.doFlash)(data);
    }
  }, {
    key: "_selectLineNumber",
    value: function _selectLineNumber(lnumber) {
      this.line_number = lnumber;

      this._goToLineNumber();
    }
  }, {
    key: "_logErrorStopSpinner",
    value: function _logErrorStopSpinner(content) {
      var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var open = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var line_number = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      this.props.stopSpinner();
      this.props.addErrorDrawerEntry({
        title: title,
        content: content,
        line_number: line_number
      }, true);

      if (open) {
        this.props.openErrorDrawer();
      }
    }
  }, {
    key: "dirty",
    value: function dirty() {
      var current_state = this._getSaveDict();

      for (var k in current_state) {
        if (current_state[k] != this.last_save[k]) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "_loadModule",
    value: function _loadModule() {
      var self = this;
      this.props.startSpinner();
      this.doSavePromise().then(function () {
        self.props.statusMessage("Loading Module");
        (0, _communication_react.postWithCallback)("host", "load_tile_module_task", {
          "tile_module_name": self.state.tile_name,
          "user_id": user_id
        }, load_success);
      })["catch"](function (data) {
        self._logErrorStopSpinner(data.message, "Error loading module", true, data.line_number);
      });

      function load_success(data) {
        if (data.success) {
          data.timeout = 2000;
        }

        self._doFlashStopSpinner(data);

        return false;
      }
    }
  }, {
    key: "_saveModuleAs",
    value: function _saveModuleAs() {
      (0, _toaster.doFlash)({
        "message": "not implemented yet"
      });
      return false;
    }
  }, {
    key: "_saveMe",
    value: function _saveMe() {
      var self = this;
      this.props.startSpinner();
      this.props.statusMessage("Saving Module");
      this.doSavePromise().then(self._doFlashStopSpinner)["catch"](function (data) {
        self._logErrorStopSpinner(data.message, "Error saving module");
      });
      return false;
    }
  }, {
    key: "_saveAndCheckpoint",
    value: function _saveAndCheckpoint() {
      this.props.startSpinner();
      var self = this;
      this.doSavePromise().then(function () {
        self.props.statusMessage("Checkpointing");
        self.doCheckpointPromise().then(self._doFlashStopSpinner)["catch"](function (data) {
          self._logErrorStopSpinner(data.message, "Error checkpointing module");
        });
      })["catch"](function (data) {
        self._logErrorStopSpinner(data.message, "Error saving module");
      });
      return false;
    }
  }, {
    key: "get_tags_string",
    value: function get_tags_string() {
      var taglist = this.state.tags;
      var tags = "";

      var _iterator4 = _createForOfIteratorHelper(taglist),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var tag = _step4.value;
          tags = tags + tag + " ";
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      return tags.trim();
    }
  }, {
    key: "_getSaveDict",
    value: function _getSaveDict() {
      return {
        "module_name": this.state.tile_name,
        "category": this.state.category.length == 0 ? "basic" : this.state.category,
        "tags": this.get_tags_string(),
        "notes": this.state.notes,
        "exports": this.state.export_list,
        "options": this.state.option_list,
        "extra_methods": this.state.extra_functions,
        "render_content_body": this.state.render_content_code,
        "is_mpl": this.props.is_mpl,
        "is_d3": this.props.is_d3,
        "draw_plot_body": this.state.draw_plot_code,
        "jscript_body": this.state.jscript_code,
        "last_saved": "creator"
      };
    }
  }, {
    key: "doSavePromise",
    value: function doSavePromise() {
      var self = this;
      return new Promise(function (resolve, reject) {
        var result_dict = self._getSaveDict();

        (0, _communication_react.postWithCallback)(module_viewer_id, "update_module", result_dict, function (data) {
          if (data.success) {
            self.save_success(data);
            resolve(data);
          } else {
            reject(data);
          }
        });
      });
    }
  }, {
    key: "doCheckpointPromise",
    value: function doCheckpointPromise() {
      var self = this;
      return new Promise(function (resolve, reject) {
        (0, _communication_react.postAjax)("checkpoint_module", {
          "module_name": self.state.tile_name
        }, function (data) {
          if (data.success) {
            resolve(data);
          } else {
            reject(data);
          }
        });
      });
    }
  }, {
    key: "save_success",
    value: function save_success(data) {
      var self = this;
      this.setState({
        "render_content_line_number": data.render_content_line_number,
        "extra_methods_line_number": data.extra_methods_line_number,
        "draw_plot_line_number": data.draw_plot_line_number
      });

      this._update_saved_state();
    }
  }, {
    key: "update_window_dimensions",
    value: function update_window_dimensions() {
      var uwidth = window.innerWidth - 2 * _sizing_tools.SIDE_MARGIN;
      var uheight = window.innerHeight - BOTTOM_MARGIN;

      if (this.top_ref && this.top_ref.current) {
        uheight = window.innerHeight - BOTTOM_MARGIN - this.top_ref.current.offsetTop;
      } else {
        uheight = uheight - _sizing_tools.USUAL_TOOLBAR_HEIGHT;
      }

      this.setState({
        usable_height: uheight,
        usable_width: uwidth
      });
    }
  }, {
    key: "_update_saved_state",
    value: function _update_saved_state() {
      this.last_save = this._getSaveDict();
    }
  }, {
    key: "_selectLine",
    value: function _selectLine(cm, lnumber) {
      var doc = cm.getDoc();

      if (doc.getLine(lnumber)) {
        doc.setSelection({
          line: lnumber,
          ch: 0
        }, {
          line: lnumber,
          ch: doc.getLine(lnumber).length
        }, {
          scroll: true
        });
      }
    }
  }, {
    key: "_goToLineNumber",
    value: function _goToLineNumber() {
      if (this.line_number) {
        if (this.props.is_mpl || this.props.is_d3) {
          if (this.line_number < this.state.draw_plot_line_number) {
            if (this.emObject) {
              this._handleTabSelect("methods");

              this._selectLine(this.emObject, this.line_number - this.state.extra_methods_line_number);

              this.line_number = null;
            } else {
              return;
            }
          } else if (this.line_number < this.state.render_content_line_number) {
            if (this.dpObject) {
              this._selectLine(this.dpObject, this.line_number - this.state.draw_plot_line_number - 1);

              this.line_number = null;
            } else {
              return;
            }
          } else if (this.rcObject) {
            this._selectLine(this.rcObject, this.line_number - this.state.render_content_line_number - 1);

            this.line_number = null;
          }
        } else {
          if (this.line_number < this.props.render_content_line_number) {
            if (this.emObject) {
              this._handleTabSelect("methods");

              this._selectLine(this.emObject, this.line_number - this.state.extra_methods_line_number);

              this.line_number = null;
            } else {
              return;
            }
          } else {
            if (this.rcObject) {
              this._selectLine(this.rcObject, this.line_number - this.state.render_content_line_number - 1);

              this.line_number = null;
            }
          }
        }
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        "mounted": true
      });
      document.title = this.state.tile_name;

      this._goToLineNumber();

      this.props.setGoToLineNumber(this._selectLineNumber);
      window.addEventListener("resize", this.update_window_dimensions);
      this.update_window_dimensions();

      this._update_saved_state();

      this.props.stopSpinner();
      this.props.setStatusTheme(this.state.dark_theme);
      this.initSocket();
      window.dark_theme = this.state.dark_theme;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this._goToLineNumber();

      if (tsocket.counter != this.socket_counter) {
        this.initSocket();
      }
    }
  }, {
    key: "initSocket",
    value: function initSocket() {
      var _this4 = this;

      tsocket.socket.on('focus-me', function (data) {
        window.focus();

        _this4._selectLineNumber(data.line_number);
      });
      this.socket_counter = tsocket.counter;
    } // This toggles methodsTabRefreshRequired back and forth to force a refresh

  }, {
    key: "_refreshMethodsIfNecessary",
    value: function _refreshMethodsIfNecessary(newTabId) {
      if (newTabId == "methods") {
        this.setState({
          methodsTabRefreshRequired: !this.state.methodsTabRefreshRequired
        });
      }
    }
  }, {
    key: "_handleTabSelect",
    value: function _handleTabSelect(newTabId, prevTabid, event) {
      var _this5 = this;

      this._refreshMethodsIfNecessary(newTabId); // if (this.state.foregrounded_panes[newTabId]) return;


      var new_fg = Object.assign({}, this.state.foregrounded_panes);
      new_fg[newTabId] = true;
      this.setState({
        selectedTabId: newTabId,
        foregrounded_panes: new_fg
      }, function () {
        _this5.update_window_dimensions();
      });
    }
  }, {
    key: "_handleNotesAppend",
    value: function _handleNotesAppend(new_text) {
      this.setState({
        "notes": this.state.notes + new_text
      });
    }
  }, {
    key: "handleStateChange",
    value: function handleStateChange(state_stuff) {
      this.setState(state_stuff);
    }
  }, {
    key: "handleOptionsChange",
    value: function handleOptionsChange(new_option_list) {
      this.setState({
        "option_list": new_option_list
      });
    }
  }, {
    key: "handleExportsChange",
    value: function handleExportsChange(new_export_list) {
      this.setState({
        "export_list": new_export_list
      });
    }
  }, {
    key: "handleMethodsChange",
    value: function handleMethodsChange(new_methods) {
      this.setState({
        "extra_functions": new_methods
      });
    }
  }, {
    key: "get_height_minus_top_offset",
    value: function get_height_minus_top_offset(element_ref) {
      var min_offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var default_offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;

      if (this.state.mounted) {
        // This will be true after the initial render
        var offset = $(element_ref.current).offset().top;

        if (offset < min_offset) {
          offset = min_offset;
        }

        return this.state.body_height - offset;
      } else {
        return this.state.body_height - default_offset;
      }
    }
  }, {
    key: "get_new_tc_height",
    value: function get_new_tc_height() {
      if (this.state.mounted) {
        // This will be true after the initial render
        return this.state.top_pane_height - this.tc_span_ref.current.offsetHeight;
      } else {
        return this.state.top_pane_height - 50;
      }
    }
  }, {
    key: "get_new_rc_height",
    value: function get_new_rc_height(outer_rc_height) {
      if (this.state.mounted) {
        return outer_rc_height - this.rc_span_ref.current.offsetHeight;
      } else {
        return outer_rc_height - 50;
      }
    }
  }, {
    key: "handleTopPaneResize",
    value: function handleTopPaneResize(top_height, bottom_height, top_fraction) {
      this.setState({
        "top_pane_height": top_height,
        "bottom_pane_height": bottom_height
      });
    }
  }, {
    key: "handleLeftPaneResize",
    value: function handleLeftPaneResize(left_width, right_width, left_fraction) {
      this.setState({
        "left_pane_width": left_width
      });
    }
  }, {
    key: "handleTopCodeChange",
    value: function handleTopCodeChange(new_code) {
      if (this.props.is_mpl) {
        this.setState({
          "draw_plot_code": new_code
        });
      } else {
        this.setState({
          "jscript_code": new_code
        });
      }
    }
  }, {
    key: "handleRenderContentChange",
    value: function handleRenderContentChange(new_code) {
      this.setState({
        "render_content_code": new_code
      });
    }
  }, {
    key: "_setResourceNameState",
    value: function _setResourceNameState(new_name) {
      this.setState({
        "tile_name": new_name
      });
    }
  }, {
    key: "_handleResize",
    value: function _handleResize(entries) {
      var _iterator5 = _createForOfIteratorHelper(entries),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var entry = _step5.value;

          if (entry.target.id == "creator-root") {
            // Must used window.innerWidth here otherwise we get the wrong value during initial mounting
            this.setState({
              usable_width: window.innerWidth - 2 * _sizing_tools.SIDE_MARGIN,
              usable_height: entry.contentRect.height - BOTTOM_MARGIN - entry.target.getBoundingClientRect().top,
              body_height: entry.contentRect.height - BOTTOM_MARGIN
            });
            return;
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    }
  }, {
    key: "_setDpObject",
    value: function _setDpObject(cmobject) {
      this.dpObject = cmobject;
    }
  }, {
    key: "_setRcObject",
    value: function _setRcObject(cmobject) {
      this.rcObject = cmobject;
    }
  }, {
    key: "_setEmObject",
    value: function _setEmObject(cmobject) {
      this.emObject = cmobject;
    }
  }, {
    key: "render",
    value: function render() {
      //let hp_height = this.get_height_minus_top_offset(this.hp_ref);
      var vp_height = this.get_height_minus_top_offset(this.vp_ref);
      var code_width = this.state.left_pane_width - 10;
      var ch_style = {
        "width": code_width
      };
      var tc_item;

      if (this.props.is_mpl || this.props.is_d3) {
        var tc_height = this.get_new_tc_height();
        var mode = this.props.is_mpl ? "python" : "javascript";
        var code_content = this.props.is_mpl ? this.state.draw_plot_code : this.state.jscript_code;
        var first_line_number = this.props.is_mpl ? this.state.draw_plot_line_number + 1 : 1;
        var title_label = this.props.is_mpl ? "draw_plot" : "(selector, w, h, arg_dict) =>";
        tc_item = /*#__PURE__*/_react["default"].createElement("div", {
          key: "dpcode",
          style: ch_style,
          className: "d-flex flex-column align-items-baseline code-holder"
        }, /*#__PURE__*/_react["default"].createElement("span", {
          ref: this.tc_span_ref
        }, title_label), /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror, {
          code_content: code_content,
          mode: mode,
          handleChange: this.handleTopCodeChange,
          saveMe: this._saveAndCheckpoint,
          readOnly: false,
          setCMObject: this._setDpObject,
          search_term: this.state.search_string,
          dark_theme: this.state.dark_theme,
          first_line_number: first_line_number,
          code_container_height: tc_height
        }));
      }

      var rc_height;

      if (this.props.is_mpl || this.props.is_d3) {
        rc_height = this.get_new_rc_height(this.state.bottom_pane_height);
      } else {
        rc_height = this.get_new_rc_height(vp_height);
      }

      var bc_item = /*#__PURE__*/_react["default"].createElement("div", {
        key: "rccode",
        id: "rccode",
        style: ch_style,
        className: "d-flex flex-column align-items-baseline code-holder"
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "bp3-ui-text",
        ref: this.rc_span_ref
      }, "render_content"), /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror, {
        code_content: this.state.render_content_code,
        handleChange: this.handleRenderContentChange,
        saveMe: this._saveAndCheckpoint,
        readOnly: false,
        setCMObject: this._setRcObject,
        search_term: this.state.search_string,
        dark_theme: this.state.dark_theme,
        first_line_number: this.state.render_content_line_number + 1,
        code_container_height: rc_height
      }));

      var left_pane;

      if (this.props.is_mpl || this.props.is_d3) {
        left_pane = /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(TileCreatorToolbar, {
          tile_name: this.state.tile_name,
          setResourceNameState: this._setResourceNameState,
          res_type: "tile",
          button_groups: this.button_groups,
          update_search_state: this._updateSearchState,
          search_string: this.state.search_string,
          key: "toolbar"
        }), /*#__PURE__*/_react["default"].createElement("div", {
          ref: this.vp_ref
        }), /*#__PURE__*/_react["default"].createElement(_resizing_layouts.VerticalPanes, {
          top_pane: tc_item,
          bottom_pane: bc_item,
          show_handle: true,
          available_height: vp_height,
          available_width: this.state.left_pane_width,
          handleSplitUpdate: this.handleTopPaneResize,
          id: "creator-left"
        }));
      } else {
        left_pane = /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(TileCreatorToolbar, {
          tile_name: this.state.tile_name,
          setResourceNameState: this._setResourceNameState,
          res_type: "tile",
          button_groups: this.button_groups,
          update_search_state: this._updateSearchState,
          search_string: this.state.search_string,
          key: "toolbar"
        }), /*#__PURE__*/_react["default"].createElement("div", {
          ref: this.vp_ref
        }, bc_item));
      }

      var mdata_panel = /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.CombinedMetadata, {
        tags: this.state.tags,
        notes: this.state.notes,
        created: this.props.created,
        category: this.state.category,
        res_type: "tile",
        handleChange: this.handleStateChange
      });

      var option_panel = /*#__PURE__*/_react["default"].createElement(_creator_modules_react.OptionModule, {
        options_ref: this.options_ref,
        data_list: this.state.option_list,
        foregrounded: this.state.foregrounded_panes["options"],
        handleChange: this.handleOptionsChange,
        handleNotesAppend: this._handleNotesAppend
      });

      var export_panel = /*#__PURE__*/_react["default"].createElement(_creator_modules_react.ExportModule, {
        data_list: this.state.export_list,
        foregrounded: this.state.foregrounded_panes["exports"],
        handleChange: this.handleExportsChange,
        handleNotesAppend: this._handleNotesAppend
      });

      var methods_height = this.get_height_minus_top_offset(this.methods_ref, 128, 128);

      var methods_panel = /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          marginTop: 30
        }
      }, /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror, {
        handleChange: this.handleMethodsChange,
        code_content: this.state.extra_functions,
        saveMe: this._saveAndCheckpoint,
        setCMObject: this._setEmObject,
        readOnly: false,
        code_container_ref: this.methods_ref,
        code_container_height: methods_height,
        search_term: this.state.search_string,
        dark_theme: this.state.dark_theme,
        first_line_number: this.state.extra_methods_line_number,
        refresh_required: this.state.methodsTabRefreshRequired
      }));

      var commands_height = this.get_height_minus_top_offset(this.commands_ref, 128, 128);

      var commands_panel = /*#__PURE__*/_react["default"].createElement(_creator_modules_react.CommandsModule, {
        foregrounded: this.state.foregrounded_panes["commands"],
        available_height: commands_height,
        commands_ref: this.commands_ref
      });

      var right_pane = /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
        id: "creator-resources",
        className: "d-block mt-2"
      }, /*#__PURE__*/_react["default"].createElement(_core.Tabs, {
        id: "resource_tabs",
        selectedTabId: this.state.selectedTabId,
        large: true,
        onChange: this._handleTabSelect
      }, /*#__PURE__*/_react["default"].createElement(_core.Tab, {
        id: "metadata",
        title: "metadata",
        panel: mdata_panel
      }), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
        id: "options",
        title: "options",
        panel: option_panel
      }), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
        id: "exports",
        title: "exports",
        panel: export_panel
      }), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
        id: "methods",
        title: "methods",
        panel: methods_panel
      }), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
        id: "commands",
        title: "tactic api",
        panel: commands_panel
      }))));

      var outer_style = {
        width: "100%",
        height: this.state.usable_height,
        paddingLeft: _sizing_tools.SIDE_MARGIN
      };
      var outer_class = "resource-viewer-holder";

      if (this.state.dark_theme) {
        outer_class = outer_class + " bp3-dark";
      } else {
        outer_class = outer_class + " light-theme";
      }

      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
        is_authenticated: window.is_authenticated,
        selected: null,
        show_api_links: true,
        dark_theme: this.state.dark_theme,
        set_parent_theme: this._setTheme,
        user_name: window.username
      }), /*#__PURE__*/_react["default"].createElement(_core.ResizeSensor, {
        onResize: this._handleResize,
        observeParents: true
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: outer_class,
        ref: this.top_ref,
        style: outer_style
      }, /*#__PURE__*/_react["default"].createElement(_resizing_layouts.HorizontalPanes, {
        left_pane: left_pane,
        right_pane: right_pane,
        show_handle: true,
        available_height: this.state.usable_height,
        available_width: this.state.usable_width,
        handleSplitUpdate: this.handleLeftPaneResize
      }))));
    }
  }]);

  return CreatorApp;
}(_react["default"].Component);

CreatorApp.propTypes = {
  is_mpl: _propTypes["default"].bool,
  render_content_code: _propTypes["default"].string,
  render_content_line_number: _propTypes["default"].number,
  extra_methods_line_number: _propTypes["default"].number,
  category: _propTypes["default"].string,
  extra_functions: _propTypes["default"].string,
  draw_plot_code: _propTypes["default"].string,
  jscript_code: _propTypes["default"].string,
  tags: _propTypes["default"].array,
  notes: _propTypes["default"].string,
  option_list: _propTypes["default"].array,
  export_list: _propTypes["default"].array,
  created: _propTypes["default"].string
};
var CreatorAppPlus = (0, _toaster.withStatus)((0, _error_drawer.withErrorDrawer)(CreatorApp, tsocket));
tile_creator_main();