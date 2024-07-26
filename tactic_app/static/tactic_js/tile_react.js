"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TileContainer = TileContainer;
exports.tilesReducer = tilesReducer;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _reactTransitionGroup = require("react-transition-group");
var _lodash = _interopRequireDefault(require("lodash"));
var _tile_form_react = require("./tile_form_react");
var _blueprint_react_widgets = require("./blueprint_react_widgets");
var _resizing_layouts = require("./resizing_layouts2");
var _sortable_container = require("./sortable_container");
var _communication_react = require("./communication_react");
var _utilities_react = require("./utilities_react");
var _error_boundary = require("./error_boundary");
var _menu_utilities = require("./menu_utilities");
var _searchable_console = require("./searchable_console");
var _sizing_tools = require("./sizing_tools");
var _settings = require("./settings");
var _modal_react = require("./modal_react");
var _error_drawer = require("./error_drawer");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// noinspection XmlDeprecatedElement

const using_touch = ("ontouchend" in document);
const click_event = using_touch ? "touchstart" : "click";
const TILE_DISPLAY_AREA_MARGIN = 15;
const ANI_DURATION = 300;
function composeObjs(base_style, new_style) {
  return Object.assign(Object.assign({}, base_style), new_style);
}
function tilesReducer(tile_list, action) {
  var new_items;
  switch (action.type) {
    case "initialize":
      new_items = action.new_items;
      break;
    case "delete_item":
      new_items = tile_list.filter(t => t.tile_id !== action.tile_id);
      break;
    case "change_item_value":
      new_items = tile_list.map(t => {
        if (t.tile_id === action.tile_id) {
          let new_t = {
            ...t
          };
          new_t[action.field] = action.new_value;
          return new_t;
        } else {
          return t;
        }
      });
      break;
    case "change_item_state":
      new_items = tile_list.map(t => {
        if (t.tile_id === action.tile_id) {
          let new_t = {
            ...t
          };
          for (let field in action.new_state) {
            new_t[field] = action.new_state[field];
          }
          return new_t;
        } else {
          return t;
        }
      });
      break;
    case "change_items_value":
      new_items = tile_list.map(t => {
        if (action.id_list.includes(t.tile_id)) {
          let new_t = {
            ...t
          };
          new_t[action.field] = action.new_value;
          return new_t;
        } else {
          return t;
        }
      });
      break;
    case "update_items":
      new_items = tile_list.map(t => {
        if (t.unique_id in action.updates) {
          const update_dict = action.updates[t.unique_id];
          return {
            ...t,
            ...update_dict
          };
        } else {
          return t;
        }
      });
      break;
    case "move_item":
      let old_list = [...tile_list];
      new_items = (0, _utilities_react.arrayMove)(old_list, action.oldIndex, action.newIndex);
      break;
    case "add_at_index":
      new_items = [...tile_list];
      new_items.splice(action.insert_index, 0, action.new_item);
      break;
    default:
      console.log("Got Unknown action: " + action.type);
      return [...tile_list];
  }
  return new_items;
}
function TileContainer(props) {
  const tile_div_ref = (0, _react.useRef)(null);
  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  const [dragging, setDragging] = (0, _react.useState)(false);
  const [usable_width, usable_height, topX, topY] = (0, _sizing_tools.useSize)(tile_div_ref, 0, "TileContainer");
  (0, _react.useEffect)(() => {
    initSocket();
  }, []);
  const pushCallback = (0, _utilities_react.useCallbackStack)();
  function _handleTileSourceChange(data) {
    _markSourceChange(data.tile_type);
  }
  function initSocket() {
    props.tsocket.attachListener("tile-message", _handleTileMessage);
    props.tsocket.attachListener('tile-source-change', _handleTileSourceChange);
  }
  function _resortTiles(_ref) {
    let {
      destination,
      source
    } = _ref;
    props.tileDispatch({
      type: "move_item",
      oldIndex: source.index,
      newIndex: destination.index
    });
    setDragging(false);
    if (props.table_is_shrunk) {
      let elements = document.querySelectorAll('.tile-panel');
      elements.forEach(element => {
        element.classList.add('tile-panel-float');
      });
    }
  }
  function _markSourceChange(tile_type) {
    let change_list = [];
    for (let entry of props.tile_list.current) {
      if (entry.tile_type == tile_type) {
        change_list.push(entry.tile_id);
      }
    }
    props.tileDispatch({
      type: "change_items_value",
      id_list: change_list,
      field: "source_changed",
      new_value: true
    });
  }
  function get_tile_entry(tile_id) {
    let tindex = tileIndex(tile_id);
    if (tindex == -1) return null;
    return _lodash.default.cloneDeep(props.tile_list.current[tileIndex(tile_id)]);
  }
  function tileIndex(tile_id) {
    let counter = 0;
    for (let entry of props.tile_list.current) {
      if (entry.tile_id == tile_id) {
        return counter;
      }
      ++counter;
    }
    return -1;
  }
  const _closeTile = (0, _react.useCallback)(tile_id => {
    props.tileDispatch({
      type: "delete_item",
      tile_id: tile_id
    });
    const data_dict = {
      main_id: props.main_id,
      tile_id: tile_id
    };
    (0, _communication_react.postWithCallback)(props.main_id, "RemoveTile", data_dict, null, null, props.main_id);
  }, []);
  const _setTileValue = (0, _react.useCallback)(function (tile_id, field, value) {
    let callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    props.tileDispatch({
      type: "change_item_value",
      tile_id: tile_id,
      field: field,
      new_value: value
    });
    pushCallback(callback);
  }, []);
  const _setTileState = (0, _react.useCallback)(function (tile_id, new_state) {
    let callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    props.tileDispatch({
      type: "change_item_state",
      tile_id: tile_id,
      new_state: new_state
    });
    pushCallback(callback);
  }, []);
  function _displayTileContentWithJavascript(tile_id, data) {
    _setTileState(tile_id, {
      front_content: data.html,
      javascript_code: data.javascript_code,
      javascript_arg_dict: data.arg_dict
    });
  }
  function _displayTileContent(tile_id, data) {
    _setTileState(tile_id, {
      front_content: data.html,
      javascript_code: null,
      javascript_arg_dict: null
    });
  }
  function _handleTileMessage(data) {
    let tile_id = data.tile_id;
    if (tileIndex(tile_id) != -1) {
      let handlerDict = {
        hideOptions: (tile_id, data) => _setTileValue(tile_id, "show_form", false),
        startSpinner: (tile_id, data) => _setTileValue(tile_id, "show_spinner", true),
        stopSpinner: (tile_id, data) => _setTileValue(tile_id, "show_spinner", false),
        displayTileContent: _displayTileContent,
        displayFormContent: (tile_id, data) => _setTileValue(tile_id, "form_data", data.form_data),
        displayTileContentWithJavascript: _displayTileContentWithJavascript
      };
      if (data.tile_message in handlerDict) {
        handlerDict[data.tile_message](tile_id, data);
      }
    }
  }
  function beforeCapture(_, event) {
    if (props.table_is_shrunk) {
      // Need to do this manually because of how react-dnd works
      let elements = document.querySelectorAll('.tile-panel.tile-panel-float');
      elements.forEach(element => {
        element.classList.remove('tile-panel-float');
      });
    }
    setDragging(true);
  }
  let outer_style = {
    height: usable_height
  };
  function makeTailoredTileComponent() {
    return /*#__PURE__*/(0, _react.memo)(function (tile_props) {
      return /*#__PURE__*/_react.default.createElement(TileComponent, (0, _extends2.default)({}, tile_props, {
        main_id: props.main_id,
        setTileValue: _setTileValue,
        setTileState: _setTileState,
        handleClose: _closeTile,
        goToModule: props.goToModule,
        broadcast_event: props.broadcast_event,
        tsocket: props.tsocket
      }));
    });
  }
  const TailoredTileComponent = (0, _react.useMemo)(() => {
    return makeTailoredTileComponent();
  }, []);
  return /*#__PURE__*/_react.default.createElement("div", {
    ref: tile_div_ref
  }, /*#__PURE__*/_react.default.createElement(_sortable_container.SortableComponent, {
    className: "tile-div",
    main_id: props.main_id,
    style: outer_style,
    helperClass: settingsContext.isDark() ? "bp5-dark" : "light-theme",
    ElementComponent: TailoredTileComponent,
    key_field_name: "tile_name",
    item_list: _lodash.default.cloneDeep(props.tile_list.current),
    handle: ".tile-name-div",
    onSortStart: (_, event) => event.preventDefault() // This prevents Safari weirdness
    ,
    onDragEnd: _resortTiles,
    onBeforeCapture: beforeCapture,
    direction: "vertical",
    useDragHandle: true,
    axis: "xy",
    extraProps: {
      dragging: dragging,
      current_doc_name: props.current_doc_name,
      selected_row: props.selected_row,
      table_is_shrunk: props.table_is_shrunk
    }
  }));
}
exports.TileContainer = TileContainer = /*#__PURE__*/(0, _react.memo)(TileContainer);
function SortHandle(props) {
  return /*#__PURE__*/_react.default.createElement("span", (0, _extends2.default)({
    className: "tile-name-div"
  }, props.dragHandleProps), /*#__PURE__*/_react.default.createElement(_core.Icon, {
    icon: "drag-handle-vertical",
    size: 15
  }), props.tile_name);
}
SortHandle = /*#__PURE__*/(0, _react.memo)(SortHandle);
const menu_icons = {
  "Kill and reload": "refresh",
  "Kill, reload, and resubmit": "social-media",
  "Run me": "play",
  "Stop me": "stop",
  "Toggle console": "console",
  "Log me": "clipboard",
  "Log parameters": "th",
  "Edit my source": "edit",
  "Delete me": "trash"
};
const menu_button = /*#__PURE__*/_react.default.createElement(_core.Button, {
  minimal: true,
  small: true,
  icon: "more"
});
const alt_button = () => menu_button;
function TileComponent(props) {
  props = {
    javascript_code: null,
    log_since: null,
    max_console_lines: 100,
    ...props
  };
  const my_ref = (0, _react.useRef)(null);
  const body_ref = (0, _react.useRef)(null);
  const inner_log_ref = (0, _react.useRef)(null);
  const tda_ref = (0, _react.useRef)(null);
  const log_ref = (0, _react.useRef)(null);
  const left_glyphs_ref = (0, _react.useRef)(null);
  const right_glyphs_ref = (0, _react.useRef)(null);
  const javascript_error_ref = (0, _react.useRef)(false);
  const last_front_content = (0, _react.useRef)("");
  const [header_height, set_header_height] = (0, _react.useState)(34);
  const [max_name_width, set_max_name_width] = (0, _react.useState)(1000);
  const [resizing, set_resizing] = (0, _react.useState)(false);
  const [dwidth, set_dwidth] = (0, _react.useState)(0);
  const [dheight, set_dheight] = (0, _react.useState)(0);

  // const menu_component_ref = useRef(null);

  const pushCallback = (0, _utilities_react.useCallbackStack)();
  const dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  (0, _react.useEffect)(() => {
    _broadcastTileSize(props.tile_width, props.tile_height);
    // menu_component_ref.current = _createMenu();
    executeEmbeddedScripts();
    // makeTablesSortable();
    if (props.javascript_code) {
      _executeJavascript();
    }
    listen_for_clicks();
  }, []);

  // useEffect(()=>{
  //     menu_component_ref.current = _createMenu();
  // }, [props.setTileState, props.form_data, props.tile_id, props.show_log, props.tile_type,
  //     props.broadcast_event, props.tile_name, props.main_id]); //

  (0, _react.useEffect)(() => {
    if (!resizing) {
      executeEmbeddedScripts();
    }
    // makeTablesSortable();
    if (props.javascript_code) {
      _executeJavascript();
    }
    listen_for_clicks();
    if (props.show_log) {
      if (log_ref && log_ref.current) {
        log_ref.current.scrollTo(0, log_ref.current.scrollHeight);
      }
    }
  });
  (0, _react.useEffect)(() => {
    javascript_error_ref.current = false;
  }, [props.javascript_code]);
  (0, _react.useEffect)(() => {
    _broadcastTileSize(props.tile_width, props.tile_height);
  }, [props.tile_width, props.tile_height]);

  // Broadcasting the tile size is necessary because some tiles (notably matplotlib tiles)
  // need to know the size of the display area.
  function _broadcastTileSize() {
    (0, _communication_react.postWithCallback)(props.tile_id, "TileSizeChange", {
      width: tdaWidth(),
      height: tdaHeight()
    }, null, null, props.main_id);
  }
  function _resizeTileArea(dx, dy) {
    let hheight = $(body_ref.current).position().top;
    set_header_height(hheight);
    let new_state = {
      tile_height: props.tile_height + dy,
      tile_width: props.tile_width + dx
    };
    props.setTileState(props.tile_id, new_state);
  }
  function executeEmbeddedScripts() {
    if (props.front_content != last_front_content.current) {
      // to avoid doubles of bokeh images
      last_front_content.current = props.front_content;
      let scripts = $("#" + props.tile_id + " .tile-display-area script").toArray();
      for (let script of scripts) {
        try {
          window.eval(script.text);
        } catch (e) {}
      }
    }
  }

  // function makeTablesSortable() {
  //     let tables = $("#" + props.tile_id + " table.sortable").toArray();
  //     for (let table of tables) {
  //         sorttable.makeSortable(table)
  //     }
  // }

  function tdaWidth() {
    return props.tile_width + dwidth - TILE_DISPLAY_AREA_MARGIN * 2;
  }
  function tdaHeight() {
    return props.tile_height + dheight - header_height - TILE_DISPLAY_AREA_MARGIN * 2;
  }
  function _executeJavascript() {
    try {
      if (!javascript_error_ref.current) {
        let selector = "[id='" + props.tile_id + "'] .jscript-target";
        eval(props.javascript_code)(selector, tdaWidth(), tdaHeight(), props.javascript_arg_dict, resizing);
      }
    } catch (err) {
      javascript_error_ref.current = true;
      errorDrawerFuncs.addErrorDrawerEntry({
        title: "Error evaluating javascript",
        content: err.message
      });
    }
  }
  function _toggleTileLog() {
    props.setTileState(props.tile_id, {
      show_log: !props.show_log,
      show_form: false
    });
  }
  function _toggleShrunk() {
    props.setTileValue(props.tile_id, "shrunk", !props.shrunk);
  }
  async function _closeTile() {
    try {
      await dialogFuncs.showModalPromise("ConfirmDialog", {
        title: "Delete Tile",
        text_body: `Delete tile ${props.tile_name}`,
        cancel_text: "do nothing",
        submit_text: "delete",
        handleClose: dialogFuncs.hideModal
      });
      props.handleClose(props.tile_id);
    } catch (e) {
      if (e != "canceled") {
        errorDrawerFuncs.addFromError(`Error closing tile`, e);
      }
    }
  }
  function _standard_click_data() {
    return {
      tile_id: props.tile_id,
      main_id: props.main_id,
      doc_name: props.current_doc_name,
      active_row_id: props.selected_row
    };
  }
  async function _updateOptionValue(option_name, value) {
    let callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    const data_dict = {
      tile_id: props.tile_id,
      option_name: option_name,
      value: value
    };
    try {
      let data = await (0, _communication_react.postPromise)(props.tile_id, "_update_single_option", data_dict);
      if (data && "form_data" in data) {
        props.setTileValue(props.tile_id, "form_data", data.form_data, callback);
      }
    } catch (e) {
      errorDrawerFuncs.addFromError("Error updating option value", e);
      return;
    }
  }
  function _toggleBack() {
    props.setTileState(props.tile_id, {
      show_log: false,
      show_form: !props.show_form
    });
  }
  function _setTileBack(show_form) {
    props.setTileValue(props.tile_id, "show_form", show_form);
  }
  function _handleSubmitOptions() {
    props.setTileState(props.tile_id, {
      show_form: false,
      show_spinner: true
    });
    let data = {};
    for (let opt of props.form_data) {
      data[opt.name] = opt.starting_value;
    }
    data.tile_id = props.tile_id;
    props.broadcast_event("UpdateOptions", data);
  }
  function _startSpinner() {
    props.setTileValue(props.tile_id, "show_spinner", true);
  }
  function _stopSpinner() {
    props.setTileValue(props.tile_id, "show_spinner", false);
  }
  function _displayFormContent(data) {
    props.setTileValue(props.tile_id, "form_data", data.form_data);
  }
  async function spin_and_refresh() {
    _startSpinner();
    await (0, _communication_react.postPromise)(props.tile_id, "RefreshTile", {}, props.main_id);
    _stopSpinner();
  }
  async function _reloadTile() {
    let resubmit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    const data_dict = {
      "tile_id": props.tile_id,
      "tile_name": props.tile_name
    };
    try {
      _startSpinner();
      let data = await (0, _communication_react.postPromise)(props.main_id, "reload_tile", data_dict, props.main_id);
      _displayFormContent(data);
      props.setTileValue(props.tile_id, "source_changed", false);
      if (data.options_changed || !resubmit) {
        _stopSpinner();
        _setTileBack(true);
      } else {
        await spin_and_refresh();
      }
    } catch (e) {
      _stopSpinner();
      errorDrawerFuncs.addFromError("Error reloading tile", e);
    }
  }
  function listen_for_clicks() {
    $(body_ref.current).off();
    $(body_ref.current).on(click_event, '.element-clickable', function (e) {
      let data_dict = _standard_click_data();
      const dset = e.target.dataset;
      data_dict.dataset = {};
      for (let key in dset) {
        if (!dset.hasOwnProperty(key)) continue;
        data_dict.dataset[key] = dset[key];
      }
      (0, _communication_react.postWithCallback)(props.tile_id, "TileElementClick", data_dict, null, null, props.main_id);
      e.stopPropagation();
    });
    $(body_ref.current).on(click_event, '.word-clickable', function (e) {
      let data_dict = _standard_click_data();
      const s = window.getSelection();
      const range = s.getRangeAt(0);
      const node = s.anchorNode;
      while (range.toString().indexOf(' ') !== 0 && range.startOffset !== 0) {
        range.setStart(node, range.startOffset - 1);
      }
      const nlen = node.textContent.length;
      if (range.startOffset !== 0) {
        range.setStart(node, range.startOffset + 1);
      }
      do {
        range.setEnd(node, range.endOffset + 1);
      } while (range.toString().indexOf(' ') == -1 && range.toString().trim() !== '' && range.endOffset < nlen);
      data_dict.clicked_text = range.toString().trim();
      (0, _communication_react.postWithCallback)(props.tile_id, "TileWordClick", data_dict, null, null, props.main_id);
    });
    $(body_ref.current).on(click_event, '.cell-clickable', function (e) {
      let data_dict = _standard_click_data();
      data_dict.clicked_cell = $(this).text();
      (0, _communication_react.postWithCallback)(props.tile_id, "TileCellClick", data_dict, null, null, props.main_id);
    });
    $(body_ref.current).on(click_event, '.row-clickable', function (e) {
      let data_dict = _standard_click_data();
      const cells = $(this).children();
      const row_vals = [];
      cells.each(function () {
        row_vals.push($(this).text());
      });
      data_dict["clicked_row"] = row_vals;
      (0, _communication_react.postWithCallback)(props.tile_id, "TileRowClick", data_dict, null, null, props.main_id);
    });
    $(body_ref.current).on(click_event, '.front button', function (e) {
      let data_dict = _standard_click_data();
      data_dict["button_value"] = e.target.value;
      (0, _communication_react.postWithCallback)(props.tile_id, "TileButtonClick", data_dict, null, null, props.main_id);
    });
    $(body_ref.current).on('submit', '.front form', function (e) {
      let data_dict = _standard_click_data();
      const form_data = {};
      let the_form = e.target;
      for (let i = 0; i < the_form.length; i += 1) {
        form_data[the_form[i]["name"]] = the_form[i]["value"];
      }
      data_dict["form_data"] = form_data;
      (0, _communication_react.postWithCallback)(props.tile_id, "TileFormSubmit", data_dict, null, null, props.main_id);
      return false;
    });
    $(body_ref.current).on("change", '.front select', function (e) {
      let data_dict = _standard_click_data();
      data_dict.select_value = e.target.value;
      data_dict.select_name = e.target.name;
      (0, _communication_react.postWithCallback)(props.tile_id, "SelectChange", data_dict, null, null, props.main_id);
    });
    $(body_ref.current).on('change', '.front textarea', function (e) {
      let data_dict = _standard_click_data();
      data_dict["text_value"] = e.target.value;
      (0, _communication_react.postWithCallback)(props.tile_id, "TileTextAreaChange", data_dict, null, null, props.main_id);
    });
  }
  var front_style;
  var tda_style;
  var back_style;
  var tile_log_style;
  var panel_body_style;
  var main_style;
  var transitionStylesAltUp;
  var transitionStylesAltDown;
  var transitionFadeStyles;
  var lg_style;
  function compute_styles() {
    let the_margin = 15;
    let tile_height = props.shrunk ? header_height : props.tile_height;
    front_style = {
      width: props.tile_width,
      height: tile_height - header_height
    };
    tda_style = {
      width: props.tile_width - TILE_DISPLAY_AREA_MARGIN * 2,
      height: tile_height - header_height - TILE_DISPLAY_AREA_MARGIN * 2
    };
    if (left_glyphs_ref.current && right_glyphs_ref.current) {
      let lg_rect = left_glyphs_ref.current.getBoundingClientRect();
      let rg_rect = right_glyphs_ref.current.getBoundingClientRect();
      let lg_width = rg_rect.x - lg_rect.x - 10;
      lg_style = {
        width: lg_width,
        overflow: "hidden"
      };
    } else {
      lg_style = {};
    }
    back_style = Object.assign({}, front_style);
    tile_log_style = {
      overflow: "auto",
      marginLeft: 20,
      marginRight: 20,
      marginTop: 10,
      marginBottom: 10,
      width: props.tile_width - 40,
      height: tile_height - header_height - 50
    };
    panel_body_style = {
      "width": props.tile_width
    };
    main_style = {
      width: props.tile_width + dwidth,
      height: tile_height + dheight,
      position: "relative"
    };
    if (!props.finished_loading) {
      main_style.opacity = .5;
    }
    front_style.transition = `top ${ANI_DURATION}ms ease-in-out`;
    back_style.transition = `top ${ANI_DURATION}ms ease-in-out`;
    transitionStylesAltUp = {
      transition: `top ${ANI_DURATION}ms ease-in-out`,
      entering: {
        top: header_height
      },
      entered: {
        top: header_height
      },
      exiting: {
        top: -1 * tile_height
      },
      exited: {
        top: -1 * tile_height
      }
    };
    transitionStylesAltDown = {
      entering: {
        top: header_height,
        opacity: 1
      },
      entered: {
        top: header_height,
        opacity: 1
      },
      exiting: {
        top: tile_height + 50
      },
      exited: {
        top: tile_height + 50,
        opacity: 0
      }
    };
    tile_log_style.transition = `opacity ${ANI_DURATION}ms ease-in-out`;
    transitionFadeStyles = {
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
  function logText(the_text) {
    (0, _communication_react.postWithCallback)(props.tile_id, "LogTile", {}, null, null, props.main_id);
  }
  function _stopMe() {
    (0, _communication_react.postWithCallback)("kill_" + props.tile_id, "StopMe", {}, null);
  }
  async function _editMe() {
    if (!window.in_context) {
      window.blur();
      try {
        let data = await (0, _communication_react.postPromise)("host", "go_to_module_viewer_if_exists", {
          user_id: window.user_id,
          tile_type: props.tile_type,
          line_number: 0
        }, props.main_id);
        window.open("", data.window_name);
      } catch (e) {
        window.open($SCRIPT_ROOT + "/view_location_in_creator/" + props.tile_type + "/" + "0");
      }
    } else {
      props.goToModule(props.tile_type, 0);
    }
  }
  function _logMe() {
    logText(props.front_content);
  }
  function _logParams() {
    const data_dict = {};
    data_dict["main_id"] = props.main_id;
    data_dict["tile_id"] = props.tile_id;
    data_dict["tile_name"] = props.tile_name;
    (0, _communication_react.postWithCallback)(props.tile_id, "LogParams", data_dict, null, null, props.main_id);
  }
  function _startResize(e, ui, startX, startY) {
    set_resizing(true);
    set_dwidth(0);
    set_dheight(0);
  }
  function _onResize(e, ui, x, y, dx, dy) {
    set_dwidth(dx);
    set_dheight(dy);
  }
  function _stopResize(e, ui, x, y, dx, dy) {
    set_resizing(false);
    set_dwidth(0);
    set_dheight(0);
    pushCallback(() => {
      _resizeTileArea(dx, dy);
    });
  }
  let show_front = !props.show_form && !props.show_log;
  let front_dict = {
    __html: props.front_content
  };
  compute_styles();
  let tile_class = props.table_is_shrunk && !props.dragging ? "tile-panel tile-panel-float" : "tile-panel";
  let tph_class = props.source_changed ? "tile-panel-heading tile-source-changed" : "tile-panel-heading";
  let draghandle_position_dict = {
    position: "absolute",
    bottom: 2,
    right: 1
  };
  let tile_menu_options = {
    "Run me": _handleSubmitOptions,
    "Stop me": _stopMe,
    "divider99": "divider",
    "Kill and reload": async () => {
      await _reloadTile(false);
    },
    "Kill, reload, and resubmit": async () => {
      await _reloadTile(true);
    },
    "divider0": "divider",
    "Toggle console": _toggleTileLog,
    "divider1": "divider",
    "Log me": _logMe,
    "Log parameters": _logParams,
    "divider2": "divider",
    "Edit my source": _editMe,
    "divider3": "divider",
    "Delete me": _closeTile
  };
  return /*#__PURE__*/_react.default.createElement(_core.Card, {
    ref: my_ref,
    elevation: 2,
    style: main_style,
    className: tile_class,
    id: props.tile_id
  }, /*#__PURE__*/_react.default.createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react.default.createElement("div", {
    className: tph_class
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "left-glyphs",
    ref: left_glyphs_ref,
    style: lg_style
  }, /*#__PURE__*/_react.default.createElement(_core.ButtonGroup, null, props.shrunk && /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-right",
    handleClick: _toggleShrunk
  }), !props.shrunk && /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-down",
    handleClick: _toggleShrunk
  }), /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.GlyphButton, {
    intent: "primary",
    handleClick: _toggleBack,
    icon: "cog"
  }), /*#__PURE__*/_react.default.createElement(SortHandle, {
    dragHandleProps: props.dragHandleProps,
    tile_name: props.tile_name
  }))), /*#__PURE__*/_react.default.createElement("div", {
    className: "right-glyphs",
    style: {
      marginRight: 10
    },
    ref: right_glyphs_ref
  }, /*#__PURE__*/_react.default.createElement(_core.ButtonGroup, null, props.show_log && /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.GlyphButton, {
    intent: "primary",
    handleClick: _toggleTileLog,
    icon: "console"
  }), props.source_changed && !props.show_spinner && /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.GlyphButton, {
    intent: "danger",
    handleClick: async () => {
      await _reloadTile(true);
    },
    icon: "social-media"
  }), props.show_spinner && /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.GlyphButton, {
    intent: "danger",
    handleClick: _stopMe,
    icon: "stop"
  }), props.show_spinner && /*#__PURE__*/_react.default.createElement(_core.Spinner, {
    size: 17
  }), /*#__PURE__*/_react.default.createElement(_menu_utilities.MenuComponent, {
    option_dict: tile_menu_options,
    icon_dict: menu_icons,
    createOmniItems: false,
    item_class: "tile-menu-item",
    position: _core.PopoverPosition.BOTTOM_RIGHT,
    alt_button: alt_button
  })))), /*#__PURE__*/_react.default.createElement(_error_boundary.ErrorBoundary, null, !props.shrunk && /*#__PURE__*/_react.default.createElement("div", {
    ref: body_ref,
    style: panel_body_style,
    className: "tile-body"
  }, /*#__PURE__*/_react.default.createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react.default.createElement(_reactTransitionGroup.Transition, {
    in: props.show_form,
    timeout: ANI_DURATION
  }, state => /*#__PURE__*/_react.default.createElement("div", {
    className: "back",
    style: composeObjs(back_style, transitionStylesAltUp[state])
  }, /*#__PURE__*/_react.default.createElement(_tile_form_react.TileForm, {
    options: _lodash.default.cloneDeep(props.form_data),
    tile_id: props.tile_id,
    updateValue: _updateOptionValue,
    handleSubmit: _handleSubmitOptions
  })))), /*#__PURE__*/_react.default.createElement(_error_boundary.ErrorBoundary, null, props.show_log && /*#__PURE__*/_react.default.createElement("div", {
    className: "tile-log",
    ref: log_ref
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "tile-log-area"
  }, /*#__PURE__*/_react.default.createElement(_searchable_console.SearchableConsole, {
    main_id: props.main_id,
    streaming_host: "host",
    container_id: props.tile_id,
    ref: inner_log_ref,
    outer_style: tile_log_style,
    showCommandField: true
  })))), /*#__PURE__*/_react.default.createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react.default.createElement(_reactTransitionGroup.Transition, {
    in: show_front,
    timeout: ANI_DURATION
  }, state => /*#__PURE__*/_react.default.createElement("div", {
    className: "front",
    style: composeObjs(front_style, transitionStylesAltDown[state])
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "tile-display-area",
    style: tda_style,
    ref: tda_ref,
    dangerouslySetInnerHTML: front_dict
  })))))), /*#__PURE__*/_react.default.createElement(_resizing_layouts.DragHandle, {
    position_dict: draghandle_position_dict,
    dragStart: _startResize,
    onDrag: _onResize,
    dragEnd: _stopResize,
    direction: "both"
  })));
}
TileComponent = /*#__PURE__*/(0, _react.memo)(TileComponent);