"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get_all_parent_tags = get_all_parent_tags;
exports.TagButtonList = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _modal_react = require("./modal_react.js");

var _utilities_react = require("./utilities_react.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

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

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function has_slash(tag_text) {
  return tag_text.search("/") != -1;
}

function get_immediate_tag_parent(the_tag) {
  var re = /\/\w*$/;
  return the_tag.replace(re, "");
}

function get_all_parent_tags(tag_list) {
  var ptags = [];

  if (tag_list != undefined) {
    var _iterator = _createForOfIteratorHelper(tag_list),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var the_tag = _step.value;
        ptags = ptags.concat(get_parent_tags(the_tag));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  ptags = (0, _utilities_react.remove_duplicates)(ptags);
  return ptags;
}

function get_parent_tags(the_tag) {
  if (the_tag.search("/") == -1) {
    return [];
  } else {
    var parent_tag = get_immediate_tag_parent(the_tag);
    var ptags = get_parent_tags(parent_tag);
    ptags.push(parent_tag);
    return ptags;
  }
}

function tag_to_list(the_tag) {
  return the_tag.split("/");
}

var TagMenu = /*#__PURE__*/function (_React$Component) {
  _inherits(TagMenu, _React$Component);

  var _super = _createSuper(TagMenu);

  function TagMenu() {
    _classCallCheck(this, TagMenu);

    return _super.apply(this, arguments);
  }

  _createClass(TagMenu, [{
    key: "render",
    value: function render() {
      var _this = this;

      var disabled = this.props.tagstring == "all";
      return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "edit",
        disabled: disabled,
        onClick: function onClick() {
          return _this.props.rename_tag(_this.props.tagstring);
        },
        text: "Rename"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "trash",
        disabled: disabled,
        onClick: function onClick() {
          return _this.props.delete_tag(_this.props.tagstring);
        },
        text: "Delete"
      }));
    }
  }]);

  return TagMenu;
}(_react["default"].Component);

var TagButtonList = /*#__PURE__*/function (_React$Component2) {
  _inherits(TagButtonList, _React$Component2);

  var _super2 = _createSuper(TagButtonList);

  function TagButtonList(props) {
    var _this2;

    _classCallCheck(this, TagButtonList);

    _this2 = _super2.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this2));
    return _this2;
  }

  _createClass(TagButtonList, [{
    key: "_edit_tags",
    value: function _edit_tags(e) {
      this.setState({
        "edit_tags": !this.state.edit_tags
      });
      e.preventDefault();
    }
  }, {
    key: "_renameTagPrep",
    value: function _renameTagPrep(old_tag, new_tag_base) {
      var old_tag_list = tag_to_list(old_tag);
      var ot_length = old_tag_list.length;
      var tag_changes = [];

      var _iterator2 = _createForOfIteratorHelper(this.props.tag_list),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var atag = _step2.value;
          var atag_list = tag_to_list(atag);

          if ((0, _utilities_react.arraysMatch)(atag_list.slice(0, ot_length), old_tag_list)) {
            atag_list[ot_length - 1] = new_tag_base;
            tag_changes.push([atag, atag_list.join("/")]);
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      this.props.doTagRename(tag_changes);
    }
  }, {
    key: "_newNode",
    value: function _newNode(name, prelist) {
      var full_list = _toConsumableArray(prelist);

      full_list.push(name);
      var tag_string = full_list.join("/");
      return {
        id: tag_string,
        childNodes: [],
        label: name,
        icon: "tag",
        hasCaret: false,
        className: name == "hidden" && prelist.length == 0 ? "hidden-tag" : "",
        isSelected: tag_string == this.props.active_tag,
        isExpanded: this.props.expanded_tags.includes(tag_string),
        nodeData: {
          tag_string: tag_string
        }
      };
    }
  }, {
    key: "_nodeChild",
    value: function _nodeChild(node, child_name) {
      var _iterator3 = _createForOfIteratorHelper(node.childNodes),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var c = _step3.value;

          if (c.label == child_name) {
            return c;
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return null;
    }
  }, {
    key: "_handleNodeExpand",
    value: function _handleNodeExpand(node) {
      if (!this.props.expanded_tags.includes(node.nodeData.tag_string)) {
        var expanded_tags = _toConsumableArray(this.props.expanded_tags);

        expanded_tags.push(node.nodeData.tag_string);
        this.props.updateTagState({
          "expanded_tags": expanded_tags
        });
      }
    }
  }, {
    key: "_handleNodeShrink",
    value: function _handleNodeShrink(node) {
      if (this.props.expanded_tags.includes(node.nodeData.tag_string)) {
        var expanded_tags = _toConsumableArray(this.props.expanded_tags);

        var index = expanded_tags.indexOf(node.nodeData.tag_string);
        if (index !== -1) expanded_tags.splice(index, 1);
        this.props.updateTagState({
          "expanded_tags": expanded_tags
        });
      }
    }
  }, {
    key: "_handleNodeClick",
    value: function _handleNodeClick(node) {
      this.props.updateTagState({
        active_tag: node.nodeData.tag_string
      });
    }
  }, {
    key: "addChildren",
    value: function addChildren(node, tlist, prelist) {
      if (tlist.length == 0) return;

      var new_child = this._newNode(tlist[0], prelist);

      node.childNodes.push(new_child);
      node.icon = "folder-close";
      node.hasCaret = true;

      var new_tlist = _toConsumableArray(tlist);

      var new_prelist = _toConsumableArray(prelist);

      var first_tag = new_tlist.shift();
      new_prelist.push(first_tag);
      this.addChildren(new_child, new_tlist, new_prelist);
    }
  }, {
    key: "_digNode",
    value: function _digNode(node, tlist, prelist) {
      if (tlist.length == 0) return;

      var res = this._nodeChild(node, tlist[0]);

      if (res == null) {
        this.addChildren(node, tlist, prelist);
      } else {
        var new_tlist = _toConsumableArray(tlist);

        var new_prelist = _toConsumableArray(prelist);

        var first_tag = new_tlist.shift();
        new_prelist.push(first_tag);
        tlist.shift();

        this._digNode(res, new_tlist, new_prelist);
      }
    }
  }, {
    key: "_buildTree",
    value: function _buildTree(tag_list) {
      var all_node = this._newNode("all", []);

      all_node.icon = "clean";
      var tree = {
        childNodes: [all_node]
      };

      var _iterator4 = _createForOfIteratorHelper(tag_list),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var tag = _step4.value;
          var tlist = tag_to_list(tag);

          this._digNode(tree, tlist, [], true);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      return tree.childNodes;
    }
  }, {
    key: "get_tag_base",
    value: function get_tag_base(tagstring) {
      if (!has_slash(tagstring)) {
        return tagstring;
      } else {
        var re = /\/\w*$/;
        return re.exec(tagstring)[0].slice(1);
      }
    }
  }, {
    key: "_rename_tag",
    value: function _rename_tag(tagstring) {
      var self = this;
      var tag_base = this.get_tag_base(tagstring);
      (0, _modal_react.showModalReact)("Rename tag \"".concat(tag_base, "\""), "New name for this tag", RenameTag, tag_base);

      function RenameTag(new_tag_base) {
        self._renameTagPrep(tagstring, new_tag_base);
      }
    }
  }, {
    key: "_delete_tag",
    value: function _delete_tag(tagstring) {
      var confirm_text = "Are you sure that you want to delete the tag \"".concat(tagstring, "\" for this resource type?");
      var self = this;
      (0, _modal_react.showConfirmDialogReact)("Delete tag \"".concat(tagstring, "\""), confirm_text, "do nothing", "delete", function () {
        self.props.doTagDelete(tagstring);
      });
    }
  }, {
    key: "_showContextMenu",
    value: function _showContextMenu(node, nodepath, e) {
      e.preventDefault();

      var tmenu = /*#__PURE__*/_react["default"].createElement(TagMenu, {
        tagstring: node.nodeData.tag_string,
        delete_tag: this._delete_tag,
        rename_tag: this._rename_tag
      });

      _core.ContextMenu.show(tmenu, {
        left: e.clientX,
        top: e.clientY
      });
    }
  }, {
    key: "render",
    value: function render() {
      var tlist = this.props.tag_list == undefined ? [] : this.props.tag_list;
      var parent_tags = get_all_parent_tags(tlist);

      var tag_list = _toConsumableArray(tlist);

      tag_list = tag_list.concat(parent_tags);
      tag_list = (0, _utilities_react.remove_duplicates)(tag_list);
      tag_list.sort();

      var tree = this._buildTree(tag_list);

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "tactic-tag-button-list"
      }, /*#__PURE__*/_react["default"].createElement(_core.Tree, {
        contents: tree,
        onNodeContextMenu: this._showContextMenu,
        onNodeClick: this._handleNodeClick,
        onNodeCollapse: this._handleNodeShrink,
        onNodeExpand: this._handleNodeExpand
      }));
    }
  }]);

  return TagButtonList;
}(_react["default"].Component);

exports.TagButtonList = TagButtonList;
TagButtonList.propTypes = {
  tag_list: _propTypes["default"].array,
  updateTagState: _propTypes["default"].func,
  doTagDelete: _propTypes["default"].func,
  doTagRename: _propTypes["default"].func
};