"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FreeformBody = FreeformBody;
exports.MainTableCard = MainTableCard;
exports.MainTableCardHeader = MainTableCardHeader;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _blueprint_react_widgets = require("./blueprint_react_widgets");
var _reactCodemirror = require("./react-codemirror6");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _communication_react = require("./communication_react");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function FreeformBody(props) {
  const top_ref = (0, _react.useRef)(null);
  const cmobject = (0, _react.useRef)(null);
  const overlay = (0, _react.useRef)(null);
  function _setCMObject(lcmobject) {
    cmobject.current = lcmobject;
  }
  function _clearSearch() {
    if (cmobject.current && overlay.current) {
      cmobject.current.removeOverlay(overlay.current);
      overlay.current = null;
    }
  }
  function _doSearch() {
    if (props.mState.alt_search_text && props.mState.alt_search_text != "" && cmobject.current) {
      overlay.current = mySearchOverlay(props.mState.alt_search_text, true);
      cmobject.current.addOverlay(overlay.current);
    } else if (props.mState.search_text && props.mState.search_text != "" && cmobject) {
      overlay.current = mySearchOverlay(props.mState.search_text, true);
      cmobject.current.addOverlay(overlay.current);
    }
  }
  function mySearchOverlay(query, caseInsensitive) {
    if (typeof query == "string") {
      // noinspection RegExpRedundantEscape
      query = new RegExp(query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), caseInsensitive ? "gi" : "g");
    } else if (!query.global) query = new RegExp(query.source, query.ignoreCase ? "gi" : "g");
    return {
      token: function (stream) {
        query.lastIndex = stream.pos;
        const match = query.exec(stream.string);
        if (match && match.index == stream.pos) {
          stream.pos += match[0].length || 1;
          return "searching"; // I believe this causes the style .cm-searching to be applied
        } else if (match) {
          stream.pos = match.index;
        } else {
          stream.skipToEnd();
        }
      }
    };
  }
  function _handleBlur(new_data_text) {
    (0, _communication_react.postWithCallback)(props.main_id, "add_freeform_document", {
      document_name: props.mState.table_spec.current_doc_name,
      doc_text: new_data_text
    }, null);
  }
  function _handleChange(new_data_text) {}
  _clearSearch();
  _doSearch();
  return /*#__PURE__*/_react.default.createElement("div", {
    ref: top_ref
  }, /*#__PURE__*/_react.default.createElement(_reactCodemirror.ReactCodemirror6, {
    handleChange: null,
    handleBlur: _handleBlur,
    code_content: props.mState.data_text,
    sync_to_prop: true,
    soft_wrap: props.mState.soft_wrap,
    mode: "text",
    controlled: true,
    setCMObject: _setCMObject,
    readOnly: !props.mState.spreadsheet_mode
  }));
}
exports.FreeformBody = FreeformBody = /*#__PURE__*/(0, _react.memo)(FreeformBody);
function SmallSpinner() {
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: " loader-small"
  }));
}
function MainTableCardHeader(props) {
  props = {
    is_freeform: false,
    soft_wrap: false,
    handleSoftWrapChange: null,
    ...props
  };
  const heading_left_ref = (0, _react.useRef)(null);
  const heading_right_ref = (0, _react.useRef)(null);
  const [hide_right_element, set_hide_right_element] = (0, _react.useState)(false);
  (0, _react.useEffect)(() => {
    let hide_right = _getHideRight();
    if (hide_right != hide_right_element) {
      set_hide_right_element(hide_right);
    }
  });
  function _getHideRight() {
    let le_rect = heading_left_ref.current.getBoundingClientRect();
    let re_rect = heading_right_ref.current.getBoundingClientRect();
    return re_rect.x < le_rect.x + le_rect.width + 10;
  }
  function _handleSearchFieldChange(event) {
    props.handleSearchFieldChange(event.target.value);
  }
  async function _handleFilter() {
    const data_dict = {
      "text_to_find": props.mState.search_text
    };
    try {
      await (0, _communication_react.postPromise)(props.main_id, "UnfilterTable", data_dict);
      if (props.search_text !== "") {
        await (0, _communication_react.postPromise)(props.main_id, "FilterTable", data_dict);
        props.setMainStateValue({
          "table_is_filtered": true,
          "selected_regions": null,
          "selected_row": null
        });
      }
    } catch (e) {
      errorDrawerFuncs.addFromError("Error filtering table", e);
    }
  }
  async function _handleUnFilter() {
    props.handleSearchFieldChange(null);
    try {
      if (props.mState.table_is_filtered) {
        await (0, _communication_react.postPromise)(props.main_id, "UnfilterTable", {
          selected_row: props.mState.selected_row
        });
        props.setMainStateValue({
          "table_is_filtered": false,
          "selected_regions": null,
          "selected_row": null
        });
      }
    } catch (e) {
      errorDrawerFuncs.addFromError("Error unfiltering table", e);
      return;
    }
  }
  function _handleSubmit(e) {
    e.preventDefault();
  }
  function _onChangeDoc(value) {
    props.handleChangeDoc(value);
  }
  let heading_right_opacity = hide_right_element ? 0 : 100;
  let select_style = {
    height: 30,
    maxWidth: 250
  };
  let doc_button_text = /*#__PURE__*/_react.default.createElement(_core.Text, {
    ellipsize: true
  }, props.mState.table_spec.current_doc_name);
  let self = this;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "d-flex pl-2 pr-2 justify-content-between align-baseline main-heading",
    style: {
      height: 50
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    id: "heading-left",
    ref: heading_left_ref,
    className: "d-flex flex-column justify-content-around"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "d-flex flex-row"
  }, /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: props.toggleShrink,
    icon: "minimize"
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "d-flex flex-column justify-content-around"
  }, /*#__PURE__*/_react.default.createElement("form", {
    className: "d-flex flex-row"
  }, /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: props.mState.short_collection_name,
    inline: true,
    style: {
      marginBottom: 0,
      marginLeft: 5,
      marginRight: 10
    }
  }, /*#__PURE__*/_react.default.createElement(_blueprint_mdata_fields.BpSelect, {
    options: props.mState.doc_names,
    onChange: _onChangeDoc,
    buttonStyle: select_style,
    buttonTextObject: doc_button_text,
    value: props.mState.table_spec.current_doc_name
  })), props.mState.show_table_spinner && /*#__PURE__*/_react.default.createElement(_core.Spinner, {
    size: 15
  }))))), /*#__PURE__*/_react.default.createElement("div", {
    id: "heading-right",
    ref: heading_right_ref,
    style: {
      opacity: heading_right_opacity
    },
    className: "d-flex flex-column justify-content-around"
  }, /*#__PURE__*/_react.default.createElement("form", {
    onSubmit: _handleSubmit,
    style: {
      alignItems: "center"
    },
    className: "d-flex flex-row"
  }, props.is_freeform && /*#__PURE__*/_react.default.createElement(_core.Switch, {
    label: "soft wrap",
    className: "mr-2 mb-0",
    large: false,
    checked: props.mState.soft_wrap,
    onChange: props.handleSoftWrapChange
  }), /*#__PURE__*/_react.default.createElement(_core.Switch, {
    label: "edit",
    className: "mr-4 mb-0",
    large: false,
    checked: props.mState.spreadsheet_mode,
    onChange: props.handleSpreadsheetModeChange
  }), /*#__PURE__*/_react.default.createElement(_core.InputGroup, {
    type: "search",
    leftIcon: "search",
    placeholder: "Search",
    value: !props.mState.search_text ? "" : props.mState.search_text,
    onChange: _handleSearchFieldChange,
    autoCapitalize: "none",
    autoCorrect: "off",
    className: "mr-2"
  }), /*#__PURE__*/_react.default.createElement(_core.ButtonGroup, null, props.show_filter_button && /*#__PURE__*/_react.default.createElement(_core.Button, {
    onClick: _handleFilter
  }, "Filter"), /*#__PURE__*/_react.default.createElement(_core.Button, {
    onClick: _handleUnFilter
  }, "Clear")))));
}
exports.MainTableCardHeader = MainTableCardHeader = /*#__PURE__*/(0, _react.memo)(MainTableCardHeader);
const MAX_INITIAL_CELL_WIDTH = 400;
const EXTRA_TABLE_AREA_SPACE = 500;
function MainTableCard(props) {
  return /*#__PURE__*/_react.default.createElement(_core.Card, {
    id: "main-panel",
    elevation: 2
  }, props.card_header, /*#__PURE__*/_react.default.createElement("div", {
    id: "table-wrapper"
  }, props.card_body));
}
MainTableCard.propTypes = {
  card_body: _propTypes.default.object,
  card_header: _propTypes.default.object
};
exports.MainTableCard = MainTableCard = /*#__PURE__*/(0, _react.memo)(MainTableCard);