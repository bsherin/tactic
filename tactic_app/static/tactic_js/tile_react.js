"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TileContainer = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _reactTransitionGroup = require("react-transition-group");

var _reactSortableHoc = require("react-sortable-hoc");

var _lodash = _interopRequireDefault(require("lodash"));

var _tile_form_react = require("./tile_form_react.js");

var _blueprint_react_widgets = require("./blueprint_react_widgets.js");

var _resizing_layouts = require("./resizing_layouts.js");

var _sortable_container = require("./sortable_container.js");

var _communication_react = require("./communication_react.js");

var _toaster = require("./toaster.js");

var _utilities_react = require("./utilities_react.js");

var _tactic_context = require("./tactic_context.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

var using_touch = ("ontouchend" in document);
var click_event;

if (using_touch) {
  click_event = "touchstart";
} else {
  click_event = "click";
}

var TILE_DISPLAY_AREA_MARGIN = 15;
var ANI_DURATION = 300;

function composeObjs(base_style, new_style) {
  return Object.assign(Object.assign({}, base_style), new_style);
}

var TileContainer = /*#__PURE__*/function (_React$Component) {
  _inherits(TileContainer, _React$Component);

  var _super = _createSuper(TileContainer);

  function TileContainer(props) {
    var _this;

    _classCallCheck(this, TileContainer);

    _this = _super.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    _this.socket_counter = null;
    return _this;
  }

  _createClass(TileContainer, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !(0, _utilities_react.propsAreEqual)(nextProps, this.props);
    }
  }, {
    key: "_handleTileFinishedLoading",
    value: function _handleTileFinishedLoading(data) {
      this._setTileValue(data.tile_id, "finished_loading", true);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        "mounted": true
      });
      this.initSocket();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {// if (this.context.tsocket.counter != this.socket_counter) {
      //     this.initSocket();
      // }
    }
  }, {
    key: "_handleTileSourceChange",
    value: function _handleTileSourceChange(data) {
      this._markSourceChange(data.tile_type);
    }
  }, {
    key: "initSocket",
    value: function initSocket() {
      this.context.tsocket.attachListener("tile-message", this._handleTileMessage);
      this.context.tsocket.attachListener("tile-finished-loading", this._handleTileFinishedLoading);
      this.context.tsocket.attachListener('tile-source-change', this._handleTileSourceChange);
      this.socket_counter = this.context.tsocket.counter;
    }
  }, {
    key: "_resortTilesOld",
    value: function _resortTilesOld(new_sort_list) {
      var new_tile_list = [];

      var _iterator = _createForOfIteratorHelper(new_sort_list),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var tid = _step.value;
          var new_entry = this.get_tile_entry(tid);
          new_tile_list.push(new_entry);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      this.props.setMainStateValue("tile_list", new_tile_list);
    }
  }, {
    key: "_resortTiles",
    value: function _resortTiles(_ref) {
      var oldIndex = _ref.oldIndex,
          newIndex = _ref.newIndex;

      var old_tile_list = _toConsumableArray(this.props.tile_list);

      var new_tile_list = (0, _utilities_react.arrayMove)(old_tile_list, oldIndex, newIndex);
      this.props.setMainStateValue("tile_list", new_tile_list);
    }
  }, {
    key: "_markSourceChange",
    value: function _markSourceChange(tile_type) {
      var new_tile_list = _toConsumableArray(this.props.tile_list);

      var change_list = [];

      var _iterator2 = _createForOfIteratorHelper(new_tile_list),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var entry = _step2.value;

          if (entry.tile_type == tile_type) {
            change_list.push(entry.tile_id);
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      for (var _i = 0, _change_list = change_list; _i < _change_list.length; _i++) {
        var tid = _change_list[_i];

        this._setTileValue(tid, "source_changed", true);
      }
    }
  }, {
    key: "get_tile_entry",
    value: function get_tile_entry(tile_id) {
      var tindex = this.tileIndex(tile_id);
      if (tindex == -1) return null;
      return _lodash["default"].cloneDeep(this.props.tile_list[this.tileIndex(tile_id)]);
    }
  }, {
    key: "replace_tile_entry",
    value: function replace_tile_entry(tile_id, new_entry) {
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var new_tile_list = _toConsumableArray(this.props.tile_list);

      var tindex = this.tileIndex(tile_id);
      new_tile_list.splice(tindex, 1, new_entry);
      this.props.setMainStateValue("tile_list", new_tile_list, callback);
    }
  }, {
    key: "tileIndex",
    value: function tileIndex(tile_id) {
      var counter = 0;

      var _iterator3 = _createForOfIteratorHelper(this.props.tile_list),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var entry = _step3.value;

          if (entry.tile_id == tile_id) {
            return counter;
          }

          ++counter;
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return -1;
    }
  }, {
    key: "_closeTile",
    value: function _closeTile(tile_id) {
      var tindex = this.tileIndex(tile_id);

      var new_tile_list = _toConsumableArray(this.props.tile_list);

      new_tile_list.splice(tindex, 1);
      this.props.setMainStateValue("tile_list", new_tile_list);
      var data_dict = {
        main_id: this.props.main_id,
        tile_id: tile_id
      };
      (0, _communication_react.postWithCallback)(this.props.main_id, "RemoveTile", data_dict, null, null, this.props.main_id);
    }
  }, {
    key: "_addToLog",
    value: function _addToLog(tile_id, new_line) {
      var entry = this.get_tile_entry(tile_id);
      var new_log = entry["log_content"] + new_line;
      var self = this;

      this._setTileValue(tile_id, "log_content", new_log);
    }
  }, {
    key: "_setTileValue",
    value: function _setTileValue(tile_id, field, value) {
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var entry = this.get_tile_entry(tile_id);

      if (entry) {
        entry[field] = value;
        this.replace_tile_entry(tile_id, entry, callback);
      }
    }
  }, {
    key: "_setTileState",
    value: function _setTileState(tile_id, new_state) {
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var entry = this.get_tile_entry(tile_id);

      for (var field in new_state) {
        entry[field] = new_state[field];
      }

      this.replace_tile_entry(tile_id, entry, callback);
    }
  }, {
    key: "_displayTileContentWithJavascript",
    value: function _displayTileContentWithJavascript(tile_id, data) {
      this._setTileState(tile_id, {
        front_content: data.html,
        javascript_code: data.javascript_code,
        javascript_arg_dict: data.arg_dict
      });
    }
  }, {
    key: "_displayTileContent",
    value: function _displayTileContent(tile_id, data) {
      this._setTileState(tile_id, {
        front_content: data.html,
        javascript_code: null,
        javascript_arg_dict: null
      });
    }
  }, {
    key: "_handleTileMessage",
    value: function _handleTileMessage(data) {
      var tile_id = data.tile_id;

      if (this.tileIndex(tile_id) != -1) {
        var self = this;
        var handlerDict = {
          hideOptions: function hideOptions(tile_id, data) {
            return self._setTileValue(tile_id, "show_form", false);
          },
          startSpinner: function startSpinner(tile_id, data) {
            return self._setTileValue(tile_id, "show_spinner", true);
          },
          stopSpinner: function stopSpinner(tile_id, data) {
            return self._setTileValue(tile_id, "show_spinner", false);
          },
          displayTileContent: self._displayTileContent,
          displayFormContent: function displayFormContent(tile_id, data) {
            return self._setTileValue(tile_id, "form_data", data.form_data);
          },
          displayTileContentWithJavascript: self._displayTileContentWithJavascript,
          updateLog: function updateLog(tile_id, data) {
            return self._addToLog(tile_id, data.new_line);
          }
        };
        handlerDict[data.tile_message](tile_id, data);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var outer_style = {
        height: this.props.height
      };

      if (this.props.table_is_shrunk) {
        outer_style.marginLeft = "0.5rem";
      }

      return /*#__PURE__*/_react["default"].createElement(_sortable_container.SortableComponent, {
        id: "tile-div",
        main_id: this.props.main_id,
        style: outer_style,
        helperClass: this.context.dark_theme ? "bp3-dark" : "light-theme",
        container_ref: this.props.tile_div_ref,
        ElementComponent: STileComponent,
        key_field_name: "tile_name",
        item_list: _lodash["default"].cloneDeep(this.props.tile_list),
        handle: ".tile-name-div",
        onSortStart: function onSortStart(_, event) {
          return event.preventDefault();
        } // This prevents Safari weirdness
        ,
        onSortEnd: this._resortTiles,
        handleClose: this._closeTile,
        setTileValue: this._setTileValue,
        setTileState: this._setTileState,
        table_is_shrunk: this.props.table_is_shrunk,
        current_doc_name: this.props.current_doc_name,
        selected_row: this.props.selected_row,
        broadcast_event: this.props.broadcast_event,
        useDragHandle: true,
        axis: "xy"
      });
    }
  }]);

  return TileContainer;
}(_react["default"].Component);

exports.TileContainer = TileContainer;
TileContainer.propTypes = {
  setMainStateValue: _propTypes["default"].func,
  table_is_shrunk: _propTypes["default"].bool,
  tile_list: _propTypes["default"].array,
  tile_div_ref: _propTypes["default"].object,
  current_doc_name: _propTypes["default"].string,
  height: _propTypes["default"].number,
  broadcast_event: _propTypes["default"].func,
  selected_row: _propTypes["default"].number
};
TileContainer.contextType = _tactic_context.TacticContext;

var RawSortHandle = /*#__PURE__*/function (_React$Component2) {
  _inherits(RawSortHandle, _React$Component2);

  var _super2 = _createSuper(RawSortHandle);

  function RawSortHandle() {
    _classCallCheck(this, RawSortHandle);

    return _super2.apply(this, arguments);
  }

  _createClass(RawSortHandle, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState, nextContext) {
      return !(0, _utilities_react.propsAreEqual)(nextProps, this.props);
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement("span", {
        className: "tile-name-div"
      }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
        icon: "drag-handle-vertical",
        iconSize: 15
      }), this.props.tile_name);
    }
  }]);

  return RawSortHandle;
}(_react["default"].Component);

RawSortHandle.propTypes = {
  tile_name: _propTypes["default"].string
};
var Shandle = (0, _reactSortableHoc.SortableHandle)(RawSortHandle);

var TileComponent = /*#__PURE__*/function (_React$Component3) {
  _inherits(TileComponent, _React$Component3);

  var _super3 = _createSuper(TileComponent);

  function TileComponent(props) {
    var _this2;

    _classCallCheck(this, TileComponent);

    _this2 = _super3.call(this, props);
    _this2.my_ref = /*#__PURE__*/_react["default"].createRef();
    _this2.body_ref = /*#__PURE__*/_react["default"].createRef();
    _this2.tda_ref = /*#__PURE__*/_react["default"].createRef();
    _this2.log_ref = /*#__PURE__*/_react["default"].createRef();
    _this2.left_glyphs_ref = /*#__PURE__*/_react["default"].createRef();
    _this2.right_glyphs_ref = /*#__PURE__*/_react["default"].createRef();
    _this2.state = {
      header_height: 34,
      max_name_width: 1000,
      mounted: false,
      resizing: false,
      dwidth: 0,
      dheight: 0,
      log_content: null
    };
    _this2.last_front_content = "";
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this2));
    return _this2;
  }

  _createClass(TileComponent, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState, nextContext) {
      return !(0, _utilities_react.propsAreEqual)(nextProps, this.props) || !(0, _utilities_react.propsAreEqual)(nextState, this.state);
    } // Broadcasting the tile size is necessary because some tiles (notably matplotlib tiles)
    // need to know the size of the display area.

  }, {
    key: "_broadcastTileSize",
    value: function _broadcastTileSize() {
      (0, _communication_react.postWithCallback)(this.props.tile_id, "TileSizeChange", {
        width: this.tdaWidth,
        height: this.tdaHeight
      }, null, null, this.props.main_id);
    }
  }, {
    key: "_resizeTileAreaOld",
    value: function _resizeTileAreaOld(event, ui) {
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var hheight = $(this.body_ref.current).position().top;
      this.setState({
        header_height: hheight
      });
      var new_state = {
        tile_height: ui.size.height,
        tile_width: ui.size.width
      };
      this.props.setTileState(this.props.tile_id, new_state, callback);
    }
  }, {
    key: "_resizeTileArea",
    value: function _resizeTileArea(dx, dy) {
      var hheight = $(this.body_ref.current).position().top;
      this.setState({
        header_height: hheight
      });
      var new_state = {
        tile_height: this.props.tile_height + dy,
        tile_width: this.props.tile_width + dx
      };
      this.props.setTileState(this.props.tile_id, new_state, this._broadcastTileSize);
    }
  }, {
    key: "executeEmbeddedScripts",
    value: function executeEmbeddedScripts() {
      if (this.props.front_content != this.last_front_content) {
        // to avoid doubles of bokeh images
        this.last_front_content = this.props.front_content;
        var scripts = $("#" + this.props.tile_id + " .tile-display-area script").toArray();

        var _iterator4 = _createForOfIteratorHelper(scripts),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var script = _step4.value;

            try {
              window.eval(script.text);
            } catch (e) {}
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      }
    }
  }, {
    key: "makeTablesSortable",
    value: function makeTablesSortable() {
      var tables = $("#" + this.props.tile_id + " table.sortable").toArray();

      var _iterator5 = _createForOfIteratorHelper(tables),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var table = _step5.value;
          sorttable.makeSortable(table);
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    }
  }, {
    key: "tdaWidth",
    get: function get() {
      return this.props.tile_width - TILE_DISPLAY_AREA_MARGIN * 2;
    }
  }, {
    key: "tdaHeight",
    get: function get() {
      return this.props.tile_height - this.state.header_height - TILE_DISPLAY_AREA_MARGIN * 2;
    }
  }, {
    key: "_executeJavascript",
    value: function _executeJavascript() {
      try {
        var selector = "[id='" + this.props.tile_id + "'] .jscript-target";
        eval(this.props.javascript_code)(selector, this.tdaWidth, this.tdaHeight, this.props.javascript_arg_dict);
      } catch (err) {
        (0, _toaster.doFlash)({
          "alert-type": "alert-warning",
          "message": "Error evaluating javascript: " + err.message
        });
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var self = this;
      this.setState({
        mounted: true
      });

      this._broadcastTileSize(this.props.tile_width, this.props.tile_height);

      this.executeEmbeddedScripts();
      this.makeTablesSortable();

      if (this.props.javascript_code) {
        this._executeJavascript();
      }

      this.listen_for_clicks();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.executeEmbeddedScripts();
      this.makeTablesSortable();

      if (this.props.javascript_code) {
        this._executeJavascript();
      }

      this.listen_for_clicks();

      if (this.props.show_log) {
        if (this.log_ref && this.log_ref.current) {
          this.log_ref.current.scrollTo(0, this.log_ref.current.scrollHeight);
        }
      }
    }
  }, {
    key: "_toggleTileLog",
    value: function _toggleTileLog() {
      var self = this;

      if (this.props.show_log) {
        this.props.setTileState(this.props.tile_id, {
          show_log: false,
          show_form: false
        });

        this._stopLogStreaming();

        return;
      }

      (0, _communication_react.postWithCallback)("host", "get_container_log", {
        "container_id": this.props.tile_id
      }, function (res) {
        self.props.setTileState(self.props.tile_id, {
          show_log: true,
          show_form: false,
          log_content: res.log_text
        });

        self._startLogStreaming();

        self._setTileBack(false);
      }, null, this.props.main_id);
    }
  }, {
    key: "_startLogStreaming",
    value: function _startLogStreaming() {
      (0, _communication_react.postWithCallback)(this.props.main_id, "StartLogStreaming", {
        tile_id: this.props.tile_id
      }, null, null, this.props.main_id);
    }
  }, {
    key: "_stopLogStreaming",
    value: function _stopLogStreaming() {
      (0, _communication_react.postWithCallback)(this.props.main_id, "StopLogStreaming", {
        tile_id: this.props.tile_id
      }, null, null, this.props.main_id);
    }
  }, {
    key: "_toggleShrunk",
    value: function _toggleShrunk() {
      this.props.setTileValue(this.props.tile_id, "shrunk", !this.props.shrunk);
    }
  }, {
    key: "_closeTile",
    value: function _closeTile() {
      this.props.handleClose(this.props.tile_id);
    }
  }, {
    key: "_standard_click_data",
    value: function _standard_click_data() {
      return {
        tile_id: this.props.tile_id,
        main_id: this.props.main_id,
        doc_name: this.props.current_doc_name,
        active_row_id: this.props.selected_row
      };
    }
  }, {
    key: "_updateOptionValue",
    value: function _updateOptionValue(option_name, value) {
      var options = _lodash["default"].cloneDeep(this.props.form_data);

      var _iterator6 = _createForOfIteratorHelper(options),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var opt = _step6.value;

          if (opt.name == option_name) {
            opt.starting_value = value;
            break;
          }
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }

      this.props.setTileValue(this.props.tile_id, "form_data", options);
    }
  }, {
    key: "_toggleBack",
    value: function _toggleBack() {
      if (this.props.show_log) {
        this._stopLogStreaming();
      }

      this.props.setTileState(this.props.tile_id, {
        show_log: false,
        show_form: !this.props.show_form
      });
    }
  }, {
    key: "_setTileBack",
    value: function _setTileBack(show_form) {
      this.props.setTileValue(this.props.tile_id, "show_form", show_form);
    }
  }, {
    key: "_handleSubmitOptions",
    value: function _handleSubmitOptions() {
      this.props.setTileValue(this.props.tile_id, "show_form", false);

      this._startSpinner();

      this.props.setTileValue(this.props.tile_id, "show_spinner", true);
      var data = {};

      var _iterator7 = _createForOfIteratorHelper(this.props.form_data),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var opt = _step7.value;
          data[opt.name] = opt.starting_value;
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }

      data.tile_id = this.props.tile_id;
      this.props.broadcast_event("UpdateOptions", data);
    }
  }, {
    key: "_startSpinner",
    value: function _startSpinner() {
      this.props.setTileValue(this.props.tile_id, "show_spinner", true);
    }
  }, {
    key: "_stopSpinner",
    value: function _stopSpinner() {
      this.props.setTileValue(this.props.tile_id, "show_spinner", false);
    }
  }, {
    key: "_displayFormContent",
    value: function _displayFormContent(data) {
      this.props.setTileValue(this.props.tile_id, "form_data", data.form_data);
    }
  }, {
    key: "spin_and_refresh",
    value: function spin_and_refresh() {
      this._startSpinner();

      var self = this;
      (0, _communication_react.postWithCallback)(this.props.tile_id, "RefreshTile", {}, function () {
        self._stopSpinner();
      }, null, self.props.main_id);
    }
  }, {
    key: "_reloadTile",
    value: function _reloadTile() {
      var self = this;
      var data_dict = {
        "tile_id": this.props.tile_id,
        "tile_name": this.props.tile_name
      };

      this._startSpinner();

      (0, _communication_react.postWithCallback)(self.props.main_id, "reload_tile", data_dict, reload_success, null, this.props.main_id);

      function reload_success(data) {
        if (data.success) {
          self._displayFormContent(data);

          self.props.setTileValue(self.props.tile_id, "source_changed", false);

          if (data.options_changed) {
            self._stopSpinner();

            self._setTileBack(true);
          } else {
            self.spin_and_refresh();
          }
        }
      }
    }
  }, {
    key: "listen_for_clicks",
    value: function listen_for_clicks() {
      var self = this;
      $(this.body_ref.current).off();
      $(this.body_ref.current).on(click_event, '.element-clickable', function (e) {
        var data_dict = self._standard_click_data();

        var dset = e.target.dataset;
        data_dict.dataset = {};

        for (var key in dset) {
          if (!dset.hasOwnProperty(key)) continue;
          data_dict.dataset[key] = dset[key];
        }

        (0, _communication_react.postWithCallback)(self.props.tile_id, "TileElementClick", data_dict, null, null, self.props.main_id);
        e.stopPropagation();
      });
      $(this.body_ref.current).on(click_event, '.word-clickable', function (e) {
        var data_dict = self._standard_click_data();

        var s = window.getSelection();
        var range = s.getRangeAt(0);
        var node = s.anchorNode;

        while (range.toString().indexOf(' ') !== 0 && range.startOffset !== 0) {
          range.setStart(node, range.startOffset - 1);
        }

        var nlen = node.textContent.length;

        if (range.startOffset !== 0) {
          range.setStart(node, range.startOffset + 1);
        }

        do {
          range.setEnd(node, range.endOffset + 1);
        } while (range.toString().indexOf(' ') == -1 && range.toString().trim() !== '' && range.endOffset < nlen);

        data_dict.clicked_text = range.toString().trim();
        (0, _communication_react.postWithCallback)(self.props.tile_id, "TileWordClick", data_dict, null, null, self.props.main_id);
      });
      $(this.body_ref.current).on(click_event, '.cell-clickable', function (e) {
        var data_dict = self._standard_click_data();

        data_dict.clicked_cell = $(self).text();
        (0, _communication_react.postWithCallback)(self.props.tile_id, "TileCellClick", data_dict, null, null, self.props.main_id);
      });
      $(this.body_ref.current).on(click_event, '.row-clickable', function (e) {
        var data_dict = self._standard_click_data();

        var cells = $(self).children();
        var row_vals = [];
        cells.each(function () {
          row_vals.push($(self).text());
        });
        data_dict["clicked_row"] = row_vals;
        (0, _communication_react.postWithCallback)(self.props.tile_id, "TileRowClick", data_dict, null, null, self.props.main_id);
      });
      $(this.body_ref.current).on(click_event, '.front button', function (e) {
        var data_dict = self._standard_click_data();

        data_dict["button_value"] = e.target.value;
        (0, _communication_react.postWithCallback)(self.props.tile_id, "TileButtonClick", data_dict, null, null, self.props.main_id);
      });
      $(this.body_ref.current).on('submit', '.front form', function (e) {
        var data_dict = self._standard_click_data();

        var form_data = {};
        var the_form = e.target;

        for (var i = 0; i < the_form.length; i += 1) {
          form_data[the_form[i]["name"]] = the_form[i]["value"];
        }

        data_dict["form_data"] = form_data;
        (0, _communication_react.postWithCallback)(self.props.tile_id, "TileFormSubmit", data_dict, null, null, self.props.main_id);
        return false;
      });
      $(this.body_ref.current).on("change", '.front select', function (e) {
        var data_dict = self._standard_click_data();

        data_dict.select_value = e.target.value;
        data_dict.select_name = e.target.name;
        (0, _communication_react.postWithCallback)(self.props.tile_id, "SelectChange", data_dict, null, null, self.props.main_id);
      });
      $(this.body_ref.current).on('change', '.front textarea', function (e) {
        var data_dict = self._standard_click_data();

        data_dict["text_value"] = e.target.value;
        (0, _communication_react.postWithCallback)(self.props.tile_id, "TileTextAreaChange", data_dict, null, null, self.props.main_id);
      });
    }
  }, {
    key: "compute_styles",
    value: function compute_styles() {
      var the_margin = 15;
      var tile_height = this.props.shrunk ? this.state.header_height : this.props.tile_height;
      this.front_style = {
        width: this.props.tile_width,
        height: tile_height - this.state.header_height
      };
      this.tda_style = {
        width: this.props.tile_width - TILE_DISPLAY_AREA_MARGIN * 2,
        height: tile_height - this.state.header_height - TILE_DISPLAY_AREA_MARGIN * 2
      };

      if (this.state.mounted) {
        var lg_rect = this.left_glyphs_ref.current.getBoundingClientRect();
        var rg_rect = this.right_glyphs_ref.current.getBoundingClientRect();
        var lg_width = rg_rect.x - lg_rect.x - 10;
        this.lg_style = {
          width: lg_width,
          overflow: "hidden"
        };
      } else {
        this.lg_style = {};
      }

      this.back_style = Object.assign({}, this.front_style);
      this.tile_log_style = Object.assign({}, this.front_style);
      this.panel_body_style = {
        "width": this.props.tile_width
      };
      this.main_style = {
        width: this.props.tile_width + this.state.dwidth,
        height: tile_height + this.state.dheight,
        position: "relative"
      };

      if (!this.props.finished_loading) {
        this.main_style.opacity = .5;
      }

      this.front_style.transition = "top ".concat(ANI_DURATION, "ms ease-in-out");
      this.back_style.transition = "top ".concat(ANI_DURATION, "ms ease-in-out");
      this.transitionStylesAltUp = {
        transition: "top ".concat(ANI_DURATION, "ms ease-in-out"),
        entering: {
          top: this.state.header_height
        },
        entered: {
          top: this.state.header_height
        },
        exiting: {
          top: -1 * tile_height
        },
        exited: {
          top: -1 * tile_height
        }
      };
      this.transitionStylesAltDown = {
        entering: {
          top: this.state.header_height
        },
        entered: {
          top: this.state.header_height
        },
        exiting: {
          top: tile_height + 50
        },
        exited: {
          top: tile_height + 50
        }
      };
      this.tile_log_style.transition = "opacity ".concat(ANI_DURATION, "ms ease-in-out");
      this.transitionFadeStyles = {
        entering: {
          opacity: 1
        },
        entered: {
          opacity: 1
        },
        exiting: {
          opacity: 0,
          width: 0,
          height: 0,
          padding: 0
        },
        exited: {
          opacity: 0,
          width: 0,
          height: 0,
          padding: 0
        }
      };
    }
  }, {
    key: "logText",
    value: function logText(the_text) {
      var self = this;
      (0, _communication_react.postWithCallback)(this.props.tile_id, "LogTile", {}, null, null, this.props.main_id);
    }
  }, {
    key: "_logMe",
    value: function _logMe() {
      this.logText(this.props.front_content);
    }
  }, {
    key: "_logParams",
    value: function _logParams() {
      var data_dict = {};
      data_dict["main_id"] = this.props.main_id;
      data_dict["tile_id"] = this.props.tile_id;
      data_dict["tile_name"] = this.props.tile_name;
      (0, _communication_react.postWithCallback)(this.props.tile_id, "LogParams", data_dict, null, null, this.props.main_id);
    }
  }, {
    key: "_startResize",
    value: function _startResize(e, ui, startX, startY) {
      this.setState({
        resizing: true,
        dwidth: 0,
        dheight: 0
      });
    }
  }, {
    key: "_onResize",
    value: function _onResize(e, ui, x, y, dx, dy) {
      this.setState({
        dwidth: dx,
        dheight: dy
      });
    }
  }, {
    key: "_stopResize",
    value: function _stopResize(e, ui, x, y, dx, dy) {
      var _this3 = this;

      this.setState({
        resizing: false,
        dwidth: 0,
        dheight: 0
      }, function () {
        _this3._resizeTileArea(dx, dy);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var show_front = !this.props.show_form && !this.props.show_log;
      var front_dict = {
        __html: this.props.front_content
      };
      this.compute_styles();
      var tile_class = this.props.table_is_shrunk ? "tile-panel tile-panel-float" : "tile-panel";
      var tph_class = this.props.source_changed ? "tile-panel-heading tile-source-changed" : "tile-panel-heading";
      var draghandle_position_dict = {
        position: "absolute",
        bottom: 2,
        right: 1
      };
      return /*#__PURE__*/_react["default"].createElement(_core.Card, {
        ref: this.my_ref,
        elevation: 2,
        style: this.main_style,
        className: tile_class,
        id: this.props.tile_id
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: tph_class
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "left-glyphs",
        ref: this.left_glyphs_ref,
        style: this.lg_style
      }, /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, null, this.props.shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        icon: "chevron-right",
        handleClick: this._toggleShrunk
      }), !this.props.shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        icon: "chevron-down",
        handleClick: this._toggleShrunk
      }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        intent: "primary",
        handleClick: this._toggleBack,
        icon: "cog"
      }), /*#__PURE__*/_react["default"].createElement(Shandle, {
        tile_name: this.props.tile_name
      }))), /*#__PURE__*/_react["default"].createElement("div", {
        className: "right-glyphs",
        ref: this.right_glyphs_ref
      }, /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, null, this.props.show_spinner && /*#__PURE__*/_react["default"].createElement(_core.Spinner, {
        size: 17
      }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._toggleTileLog,
        tooltip: "Show tile container log",
        icon: "console"
      }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._logMe,
        tooltip: "Send current display to log",
        icon: "clipboard"
      }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._logParams,
        tooltip: "Send current parameters to log",
        icon: "th"
      }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        intent: "warning",
        handleClick: this._reloadTile,
        tooltip: "Reload tile source from library and rerun",
        icon: "refresh"
      }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        intent: "danger",
        handleClick: this._closeTile,
        ttooltip: "Remove tile",
        icon: "trash"
      })))), !this.props.shrunk && /*#__PURE__*/_react["default"].createElement("div", {
        ref: this.body_ref,
        style: this.panel_body_style,
        className: "tile-body"
      }, /*#__PURE__*/_react["default"].createElement(_reactTransitionGroup.Transition, {
        "in": this.props.show_form,
        timeout: ANI_DURATION
      }, function (state) {
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: "back",
          style: composeObjs(_this4.back_style, _this4.transitionStylesAltUp[state])
        }, /*#__PURE__*/_react["default"].createElement(_tile_form_react.TileForm, {
          options: _lodash["default"].cloneDeep(_this4.props.form_data),
          tile_id: _this4.props.tile_id,
          updateValue: _this4._updateOptionValue,
          handleSubmit: _this4._handleSubmitOptions
        }));
      }), /*#__PURE__*/_react["default"].createElement(_reactTransitionGroup.Transition, {
        "in": this.props.show_log,
        timeout: ANI_DURATION
      }, function (state) {
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: "tile-log",
          ref: _this4.log_ref,
          style: composeObjs(_this4.tile_log_style, _this4.transitionFadeStyles[state])
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "tile-log-area"
        }, /*#__PURE__*/_react["default"].createElement("pre", {
          style: {
            fontSize: 12
          }
        }, _this4.props.log_content)));
      }), /*#__PURE__*/_react["default"].createElement(_reactTransitionGroup.Transition, {
        "in": show_front,
        timeout: ANI_DURATION
      }, function (state) {
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: "front",
          style: composeObjs(_this4.front_style, _this4.transitionStylesAltDown[state])
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "tile-display-area",
          style: _this4.state.tda_style,
          ref: _this4.tda_ref,
          dangerouslySetInnerHTML: front_dict
        }));
      })), /*#__PURE__*/_react["default"].createElement(_resizing_layouts.DragHandle, {
        position_dict: draghandle_position_dict,
        dragStart: this._startResize,
        onDrag: this._onResize,
        dragEnd: this._stopResize,
        direction: "both",
        iconSize: 15
      }));
    }
  }]);

  return TileComponent;
}(_react["default"].Component);

TileComponent.propTypes = {
  tile_name: _propTypes["default"].string,
  tile_id: _propTypes["default"].string,
  form_data: _propTypes["default"].array,
  front_content: _propTypes["default"].string,
  javascript_code: _propTypes["default"].string,
  javascript_arg_dict: _propTypes["default"].object,
  source_changed: _propTypes["default"].bool,
  tile_width: _propTypes["default"].number,
  tile_height: _propTypes["default"].number,
  show_form: _propTypes["default"].bool,
  show_spinner: _propTypes["default"].bool,
  shrunk: _propTypes["default"].bool,
  show_log: _propTypes["default"].bool,
  current_doc_name: _propTypes["default"].string,
  setTileValue: _propTypes["default"].func,
  setTileState: _propTypes["default"].func,
  broadcast_event: _propTypes["default"].func,
  handleReload: _propTypes["default"].string,
  handleClose: _propTypes["default"].func
};
TileComponent.defaultProps = {
  javascript_code: null
};
var STileComponent = (0, _reactSortableHoc.SortableElement)(TileComponent);