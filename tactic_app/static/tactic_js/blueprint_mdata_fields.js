"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BpSelectAdvanced = exports.BpSelect = exports.CombinedMetadata = exports.NotesField = exports.icon_dict = void 0;

require("../tactic_css/tactic_select.scss");

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _select = require("@blueprintjs/select");

var _markdownIt = _interopRequireDefault(require("markdown-it"));

require("markdown-it-latex/dist/index.css");

var _markdownItLatex = _interopRequireDefault(require("markdown-it-latex"));

var _lodash = _interopRequireDefault(require("lodash"));

var _communication_react = require("./communication_react.js");

var _utilities_react = require("./utilities_react.js");

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

var mdi = (0, _markdownIt["default"])({
  html: true
});
mdi.use(_markdownItLatex["default"]);
var icon_dict = {
  collection: "database",
  project: "projects",
  tile: "application",
  list: "list",
  code: "code"
};
exports.icon_dict = icon_dict;

var BpSelectAdvanced = /*#__PURE__*/function (_React$Component) {
  _inherits(BpSelectAdvanced, _React$Component);

  var _super = _createSuper(BpSelectAdvanced);

  function BpSelectAdvanced(props) {
    var _this;

    _classCallCheck(this, BpSelectAdvanced);

    _this = _super.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    _this.state = {
      activeItem: _this.props.value
    };
    return _this;
  }

  _createClass(BpSelectAdvanced, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !(0, _utilities_react.propsAreEqual)(nextProps, this.props);
    }
  }, {
    key: "_filterSuggestion",
    value: function _filterSuggestion(query, item) {
      if (query.length === 0 || item["isgroup"]) {
        return true;
      }

      var re = new RegExp(query.toLowerCase());
      return re.test(item["text"].toLowerCase());
    }
  }, {
    key: "_handleActiveItemChange",
    value: function _handleActiveItemChange(newActiveItem) {// this.setState({activeItem: newActiveItem})
    }
  }, {
    key: "_getActiveItem",
    value: function _getActiveItem(val) {
      var _iterator = _createForOfIteratorHelper(this.props.options),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var option = _step.value;

          if (_lodash["default"].isEqual(option, val)) {
            return option;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return null;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_select.Select, {
        activeItem: this._getActiveItem(this.props.value),
        onActiveItemChange: this._handleActiveItemChange,
        itemRenderer: renderSuggestionAdvanced,
        itemPredicate: this._filterSuggestion,
        items: this.props.options,
        onItemSelect: this.props.onChange,
        popoverProps: {
          minimal: true,
          boundary: "window",
          modifiers: {
            flip: false,
            preventOverflow: true
          },
          position: _core.PopoverPosition.BOTTOM_LEFT
        }
      }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
        text: this.props.value["text"],
        className: "button-in-select",
        icon: this.props.buttonIcon
      }));
    }
  }]);

  return BpSelectAdvanced;
}(_react["default"].Component);

exports.BpSelectAdvanced = BpSelectAdvanced;
BpSelectAdvanced.propTypes = {
  options: _propTypes["default"].array,
  onChange: _propTypes["default"].func,
  value: _propTypes["default"].object,
  buttonIcon: _propTypes["default"].string
};
BpSelectAdvanced.defaultProps = {
  buttonIcon: null
};

var SuggestionItemAdvanced = /*#__PURE__*/function (_React$Component2) {
  _inherits(SuggestionItemAdvanced, _React$Component2);

  var _super2 = _createSuper(SuggestionItemAdvanced);

  function SuggestionItemAdvanced(props) {
    var _this2;

    _classCallCheck(this, SuggestionItemAdvanced);

    _this2 = _super2.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this2));
    return _this2;
  }

  _createClass(SuggestionItemAdvanced, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !(0, _utilities_react.propsAreEqual)(nextProps, this.props);
    }
  }, {
    key: "render",
    value: function render() {
      if (this.props.item["isgroup"]) {
        return /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, {
          className: "tile-form-menu-item",
          title: this.props.item["text"]
        });
      } else {
        return /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
          className: "tile-form-menu-item",
          text: this.props.item["text"],
          key: this.props.item,
          onClick: this.props.handleClick,
          active: this.props.modifiers.active,
          shouldDismissPopover: true
        });
      }
    }
  }]);

  return SuggestionItemAdvanced;
}(_react["default"].Component);

SuggestionItemAdvanced.propTypes = {
  item: _propTypes["default"].object,
  modifiers: _propTypes["default"].object,
  handleClick: _propTypes["default"].func
};

function renderSuggestionAdvanced(item, _ref) {
  var modifiers = _ref.modifiers,
      handleClick = _ref.handleClick,
      index = _ref.index;
  return /*#__PURE__*/_react["default"].createElement(SuggestionItemAdvanced, {
    item: item,
    key: index,
    modifiers: modifiers,
    handleClick: handleClick
  });
}

var BpSelect = /*#__PURE__*/function (_React$Component3) {
  _inherits(BpSelect, _React$Component3);

  var _super3 = _createSuper(BpSelect);

  function BpSelect(props) {
    var _this3;

    _classCallCheck(this, BpSelect);

    _this3 = _super3.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this3));
    _this3.state = {
      activeItem: _this3.props.value
    };
    return _this3;
  }

  _createClass(BpSelect, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !(0, _utilities_react.propsAreEqual)(nextProps, this.props, ["buttonTextObject"]);
    }
  }, {
    key: "_filterSuggestion",
    value: function _filterSuggestion(query, item) {
      if (query.length === 0) {
        return true;
      }

      var re = new RegExp(query.toLowerCase());
      return re.test(item.toLowerCase());
    }
  }, {
    key: "_handleActiveItemChange",
    value: function _handleActiveItemChange(newActiveItem) {
      this.setState({
        activeItem: newActiveItem
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_select.Select, {
        className: "tile-form-menu-item",
        activeItem: this.state.activeItem,
        filterable: this.props.filterable,
        onActiveItemChange: this._handleActiveItemChange,
        itemRenderer: renderSuggestion,
        itemPredicate: this._filterSuggestion,
        items: _lodash["default"].cloneDeep(this.props.options),
        onItemSelect: this.props.onChange,
        popoverProps: {
          minimal: true,
          boundary: "window",
          modifiers: {
            flip: false,
            preventOverflow: true
          },
          position: this.props.popoverPosition
        }
      }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
        className: "button-in-select",
        style: this.props.buttonStyle,
        small: this.props.small,
        text: this.props.buttonTextObject ? this.props.buttonTextObject : this.props.value,
        icon: this.props.buttonIcon
      }));
    }
  }]);

  return BpSelect;
}(_react["default"].Component);

exports.BpSelect = BpSelect;
BpSelect.propTypes = {
  options: _propTypes["default"].array,
  onChange: _propTypes["default"].func,
  filterable: _propTypes["default"].bool,
  small: _propTypes["default"].bool,
  value: _propTypes["default"].string,
  buttonTextObject: _propTypes["default"].object,
  buttonIcon: _propTypes["default"].string,
  buttonStyle: _propTypes["default"].object,
  popoverPosition: _propTypes["default"].object
};
BpSelect.defaultProps = {
  buttonIcon: null,
  buttonStyle: {},
  popoverPosition: _core.PopoverPosition.BOTTOM_LEFT,
  buttonTextObject: null,
  filterable: true,
  small: undefined
};

var SuggestionItem = /*#__PURE__*/function (_React$Component4) {
  _inherits(SuggestionItem, _React$Component4);

  var _super4 = _createSuper(SuggestionItem);

  function SuggestionItem(props) {
    var _this4;

    _classCallCheck(this, SuggestionItem);

    _this4 = _super4.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this4));
    return _this4;
  }

  _createClass(SuggestionItem, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !(0, _utilities_react.propsAreEqual)(nextProps, this.props);
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        className: "tile-form-menu-item",
        text: this.props.item,
        active: this.props.modifiers.active,
        onClick: this.props.handleClick,
        shouldDismissPopover: true
      });
    }
  }]);

  return SuggestionItem;
}(_react["default"].Component);

SuggestionItem.propTypes = {
  item: _propTypes["default"].string,
  index: _propTypes["default"].number,
  modifiers: _propTypes["default"].object,
  handleClick: _propTypes["default"].func
};

function renderSuggestion(item, _ref2) {
  var modifiers = _ref2.modifiers,
      handleClick = _ref2.handleClick,
      index = _ref2.index;
  return /*#__PURE__*/_react["default"].createElement(SuggestionItem, {
    item: item,
    key: index,
    modifiers: modifiers,
    handleClick: handleClick
  });
}

var renderCreateNewTag = function renderCreateNewTag(query, active, handleClick) {
  var hclick = handleClick;
  return /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
    icon: "add",
    key: "create_item",
    text: "Create \"".concat(query, "\""),
    active: active,
    onClick: handleClick,
    shouldDismissPopover: false
  });
};

var NativeTags = /*#__PURE__*/function (_React$Component5) {
  _inherits(NativeTags, _React$Component5);

  var _super5 = _createSuper(NativeTags);

  function NativeTags(props) {
    var _this5;

    _classCallCheck(this, NativeTags);

    _this5 = _super5.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this5));
    _this5.state = {
      query: "",
      suggestions: []
    };
    return _this5;
  }

  _createClass(NativeTags, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var self = this;
      var data_dict = {
        "res_type": this.props.res_type,
        "is_repository": false
      };
      (0, _communication_react.postAjaxPromise)("get_tag_list", data_dict).then(function (data) {
        var all_tags = data.tag_list;
        self.setState({
          "suggestions": all_tags
        });
      });
    }
  }, {
    key: "renderTag",
    value: function renderTag(item) {
      return item;
    }
  }, {
    key: "_handleDelete",
    value: function _handleDelete(tag, i) {
      var new_tlist = _toConsumableArray(this.props.tags);

      new_tlist.splice(i, 1);
      this.props.handleChange(new_tlist);
    }
  }, {
    key: "_handleAddition",
    value: function _handleAddition(tag) {
      var new_tlist = _toConsumableArray(this.props.tags);

      new_tlist.push(tag);
      this.props.handleChange(new_tlist);
    }
  }, {
    key: "_filterSuggestion",
    value: function _filterSuggestion(query, item) {
      if (query.length === 0) {
        return false;
      }

      var re = new RegExp("^".concat(query));
      return re.test(item);
    }
  }, {
    key: "_createItemFromQuery",
    value: function _createItemFromQuery(name) {
      return name;
    }
  }, {
    key: "render",
    value: function render() {
      if (this.props.readOnly) {
        return /*#__PURE__*/_react["default"].createElement(_core.TagInput, {
          values: this.props.tags,
          disabled: true
        });
      }

      return /*#__PURE__*/_react["default"].createElement(_select.MultiSelect, {
        allowCreate: true,
        openOnKeyDown: true,
        createNewItemFromQuery: this._createItemFromQuery,
        createNewItemRenderer: renderCreateNewTag,
        resetOnSelect: true,
        itemRenderer: renderSuggestion,
        selectedItems: this.props.tags,
        allowNew: true,
        items: this.state.suggestions,
        itemPredicate: this._filterSuggestion,
        tagRenderer: this.renderTag,
        tagInputProps: {
          onRemove: this._handleDelete
        },
        onItemSelect: this._handleAddition
      });
    }
  }]);

  return NativeTags;
}(_react["default"].Component);

NativeTags.proptypes = {
  tags: _propTypes["default"].array,
  handleChange: _propTypes["default"].func,
  res_type: _propTypes["default"].string
};

var NotesField = /*#__PURE__*/function (_React$Component6) {
  _inherits(NotesField, _React$Component6);

  var _super6 = _createSuper(NotesField);

  function NotesField(props) {
    var _this6;

    _classCallCheck(this, NotesField);

    _this6 = _super6.call(this, props);
    _this6.state = {
      "md_height": 500,
      "show_markdown": _this6.hasOnlyWhitespace ? false : _this6.props.show_markdown_initial
    };
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this6)); // this.notes_ref = React.createRef();

    _this6.md_ref = /*#__PURE__*/_react["default"].createRef();
    _this6.awaiting_focus = false;
    return _this6;
  }

  _createClass(NotesField, [{
    key: "getNotesField",
    value: function getNotesField() {
      return $(this.notes_ref);
    }
  }, {
    key: "hasOnlyWhitespace",
    get: function get() {
      return !this.props.notes.trim().length;
    }
  }, {
    key: "getMarkdownField",
    value: function getMarkdownField() {
      return $(this.md_ref.current);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, snapShot) {
      if (this.awaiting_focus) {
        this.focusNotes();
        this.awaiting_focus = false;
      } else if (!this.state.show_markdown && this.notes_ref !== document.activeElement) {
        // If we are here it means the change was initiated externally
        this._showMarkdown();
      }
    }
  }, {
    key: "focusNotes",
    value: function focusNotes() {
      this.getNotesField().focus();
    }
  }, {
    key: "_hideMarkdown",
    value: function _hideMarkdown() {
      if (this.props.readOnly) return;
      this.awaiting_focus = true; // We can't set focus until the input is visible

      this.setState({
        "show_markdown": false
      });
    }
  }, {
    key: "_handleMyBlur",
    value: function _handleMyBlur() {
      this._showMarkdown();

      if (this.props.handleBlur != null) {
        this.props.handleBlur();
      }
    }
  }, {
    key: "_showMarkdown",
    value: function _showMarkdown() {
      if (!this.hasOnlyWhitespace) {
        this.setState({
          "show_markdown": true
        });
      }
    }
  }, {
    key: "_notesRefHandler",
    value: function _notesRefHandler(the_ref) {
      this.notes_ref = the_ref;
    }
  }, {
    key: "render",
    value: function render() {
      var really_show_markdown = this.hasOnlyWhitespace ? false : this.state.show_markdown;
      var notes_style = {
        "display": really_show_markdown ? "none" : "block",
        fontSize: 13,
        resize: "both" // fontSize: 14

      };
      var md_style = {
        "display": really_show_markdown ? "block" : "none",
        "maxHeight": this.state.md_height,
        "fontSize": 13
      };
      var converted_markdown;

      if (really_show_markdown) {
        // converted_markdown = this.converter.makeHtml(this.props.notes);
        converted_markdown = mdi.render(this.props.notes);
      }

      var converted_dict = {
        __html: converted_markdown
      };
      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_core.TextArea, {
        rows: "20",
        cols: "75",
        inputRef: this._notesRefHandler,
        growVertically: false,
        onBlur: this._handleMyBlur,
        onChange: this.props.handleChange,
        value: this.props.notes,
        disabled: this.props.readOnly,
        style: notes_style
      }), /*#__PURE__*/_react["default"].createElement("div", {
        ref: this.md_ref,
        style: md_style,
        onClick: this._hideMarkdown,
        className: "notes-field-markdown-output",
        dangerouslySetInnerHTML: converted_dict
      }));
    }
  }]);

  return NotesField;
}(_react["default"].Component);

exports.NotesField = NotesField;
NotesField.propTypes = {
  notes: _propTypes["default"].string,
  handleChange: _propTypes["default"].func,
  show_markdown_initial: _propTypes["default"].bool,
  handleBlur: _propTypes["default"].func
};
NotesField.defaultProps = {
  handleBlur: null
};

var CombinedMetadata = /*#__PURE__*/function (_React$Component7) {
  _inherits(CombinedMetadata, _React$Component7);

  var _super7 = _createSuper(CombinedMetadata);

  function CombinedMetadata(props) {
    var _this7;

    _classCallCheck(this, CombinedMetadata);

    _this7 = _super7.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this7));
    _this7.state = {
      auxIsOpen: false
    };
    return _this7;
  }

  _createClass(CombinedMetadata, [{
    key: "_handleNotesChange",
    value: function _handleNotesChange(event) {
      this.props.handleChange({
        "notes": event.target.value
      });
    }
  }, {
    key: "_handleTagsChange",
    value: function _handleTagsChange(tags) {
      this.props.handleChange({
        "tags": tags
      });
    }
  }, {
    key: "_handleTagsChangeNative",
    value: function _handleTagsChangeNative(tags) {
      this.props.handleChange({
        "tags": tags
      });
    }
  }, {
    key: "_handleCategoryChange",
    value: function _handleCategoryChange(event) {
      this.props.handleChange({
        "category": event.target.value
      });
    }
  }, {
    key: "_toggleAuxVisibility",
    value: function _toggleAuxVisibility() {
      this.setState({
        auxIsOpen: !this.state.auxIsOpen
      });
    }
  }, {
    key: "render",
    value: function render() {
      var addition_field_style = {
        fontSize: 14
      };
      var additional_items;

      if (this.props.additional_metadata != null) {
        additional_items = [];

        for (var field in this.props.additional_metadata) {
          var md = this.props.additional_metadata[field];

          if (Array.isArray(md)) {
            md = md.join(", ");
          } else if (field == "collection_name") {
            var sresult = /\.\w*$/.exec(md);
            if (sresult != null) md = sresult[0].slice(1);
          }

          additional_items.push( /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
            label: field + ": ",
            key: field,
            inline: true
          }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
            disabled: true,
            value: md,
            fill: true
          })));
        }
      }

      var button_base = this.state.auxIsOpen ? "Hide" : "Show";
      return /*#__PURE__*/_react["default"].createElement(_core.Card, {
        elevation: this.props.elevation,
        className: "combined-metadata accent-bg",
        style: this.props.outer_style
      }, this.props.name != null && /*#__PURE__*/_react["default"].createElement("h6", null, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
        icon: icon_dict[this.props.res_type],
        style: {
          marginRight: 4
        }
      }), this.props.name), /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        label: "Tags"
      }, /*#__PURE__*/_react["default"].createElement(NativeTags, {
        tags: this.props.tags,
        readOnly: this.props.readOnly,
        handleChange: this._handleTagsChange,
        res_type: this.props.res_type
      })), this.props.category != null && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        label: "Category"
      }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
        onChange: this._handleCategoryChange,
        value: this.props.category
      })), /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        label: "Notes"
      }, /*#__PURE__*/_react["default"].createElement(NotesField, {
        notes: this.props.notes,
        readOnly: this.props.readOnly,
        handleChange: this._handleNotesChange,
        show_markdown_initial: true,
        handleBlur: this.props.handleNotesBlur
      })), /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        label: "Created ",
        inline: true
      }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
        disabled: true,
        value: this.props.created
      })), this.props.updated != null && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        label: "Updated: ",
        inline: true
      }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
        disabled: true,
        value: this.props.updated
      })), this.props.additional_metadata != null && additional_items, this.props.aux_pane != null && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
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
      }, this.props.aux_pane)), /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          height: 100
        }
      }));
    }
  }]);

  return CombinedMetadata;
}(_react["default"].Component);

exports.CombinedMetadata = CombinedMetadata;
CombinedMetadata.propTypes = {
  outer_style: _propTypes["default"].object,
  elevation: _propTypes["default"].number,
  res_type: _propTypes["default"].string,
  name: _propTypes["default"].string,
  created: _propTypes["default"].string,
  updated: _propTypes["default"].string,
  tags: _propTypes["default"].array,
  notes: _propTypes["default"].string,
  category: _propTypes["default"].string,
  handleChange: _propTypes["default"].func,
  handleNotesBlur: _propTypes["default"].func,
  additional_metadata: _propTypes["default"].object,
  aux_pane: _propTypes["default"].object
};
CombinedMetadata.defaultProps = {
  outer_style: {
    marginLeft: 20,
    overflow: "auto",
    padding: 15
  },
  elevation: 0,
  handleNotesBlur: null,
  category: null,
  name: null,
  updated: null,
  additional_metadata: null,
  aux_pane: null
};