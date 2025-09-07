"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResponsiveFlex = ResponsiveFlex;
exports.SearchableConsole = SearchableConsole;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _search_form = require("./search_form");
var _communication_react = require("./communication_react");
var _utilities_react = require("./utilities_react");
var _tactic_socket = require("./tactic_socket");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function SearchableConsole(props, inner_ref) {
  const [search_string, set_search_string] = (0, _react.useState)(null);
  const [search_helper_text, set_search_helper_text] = (0, _react.useState)(null);
  const [filter, set_filter] = (0, _react.useState)(false);
  const [console_command_value, set_console_command_value] = (0, _react.useState)("");
  const [livescroll, set_livescroll] = (0, _react.useState)(true);
  const [log_since, set_log_since] = (0, _react.useState)(null);

  // I need to have these as refs because they are accessed within the _handleUpdateMessage
  // callback. So they would have the old value.
  const [max_console_lines, set_max_console_lines, max_console_lines_ref] = (0, _utilities_react.useStateAndRef)(100);
  const [, set_log_content, log_content_ref] = (0, _utilities_react.useStateAndRef)("");
  const cont_id = (0, _react.useRef)(props.container_id);
  const my_room = (0, _react.useRef)(null);
  const streamer_id = (0, _react.useRef)(null);
  const tsocket = (0, _react.useRef)(null);
  const past_commands = (0, _react.useRef)([]);
  const past_commands_index = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
    if (livescroll && inner_ref && inner_ref.current) {
      inner_ref.current.scrollTo(0, inner_ref.current.scrollHeight);
    }
  });
  (0, _react.useEffect)(() => {
    my_room.current = (0, _utilities_react.guid)();
    tsocket.current = new _tactic_socket.TacticSocket("main", 5000, "searchable-console", props.main_id);
    tsocket.current.socket.emit("join", {
      "room": my_room.current
    });
    function cleanup() {
      _stopLogStreaming().then(() => {
        tsocket.current.disconnect();
      });
    }
    initSocket();
    _getLogAndStartStreaming().then(() => {
      window.addEventListener('beforeunload', cleanup);
    });
    return () => {
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
    };
  }, []);
  (0, _react.useEffect)(() => {
    if (!streamer_id.current) {
      _getLogAndStartStreaming().then(() => {
        console.log("streamer_id.current", streamer_id.current);
      });
    }
  }, [streamer_id.current]);
  (0, _utilities_react.useDidMount)(async () => {
    await _stopLogStreaming(_getLogAndStartStreaming);
  }, [max_console_lines]);
  (0, _utilities_react.useDidMount)(async () => {
    await _stopLogStreaming();
    cont_id.current = props.container_id;
    set_log_since(null);
    set_max_console_lines(100);
    await _getLogAndStartStreaming();
  }, [props.container_id]);
  function initSocket() {
    tsocket.current.attachListener("searchable-console-message", _handleUpdateMessage);
  }
  function _handleUpdateMessage(data) {
    if (data.message == "streamerExited") {
      streamer_id.current = null;
      return;
    }
    if (data.message != "updateLog") return;
    _addToLog(data["new_line"]);
  }
  function _setLogSince() {
    const now = new Date().getTime();
    set_log_since(now);
    set_log_content("");
  }
  function _setMaxConsoleLines(event) {
    set_max_console_lines(parseInt(event.target.value));
  }
  async function _getLogAndStartStreaming() {
    function gotStreamerId(data) {
      streamer_id.current = data.streamer_id;
    }
    let res = await (0, _communication_react.postPromise)("host", "get_container_log", {
      container_id: cont_id.current,
      since: log_since,
      max_lines: max_console_lines_ref.current
    }, props.main_id);
    set_log_content(res["log_text"]);
    let data = await (0, _communication_react.postPromise)(props.streaming_host, "StartLogStreaming", {
      container_id: cont_id.current,
      room: my_room.current,
      user_id: window.user_id
    }, props.main_id);
    gotStreamerId(data);
  }
  async function _stopLogStreaming(callback = null) {
    if (streamer_id && streamer_id.current) {
      await (0, _communication_react.postPromise)(props.streaming_host, "StopLogStreaming", {
        streamer_id: streamer_id.current
      }, props.main_id);
      if (callback) {
        callback();
      }
    }
    return null;
  }
  function _addToLog(new_line) {
    set_log_content(prev_log_content => prev_log_content + new_line);
  }
  function _prepareText() {
    let the_text = "";
    if (log_content_ref.current) {
      // without this can get an error if project saved with tile log showing
      let tlist = log_content_ref.current.split(/\r?\n/);
      tlist = tlist.slice(-1 * max_console_lines_ref.current);
      if (search_string) {
        if (filter) {
          let new_tlist = [];
          for (let t of tlist) {
            if (t.includes(search_string)) {
              new_tlist.push(t);
            }
          }
          tlist = new_tlist;
        }
        for (let t of tlist) {
          the_text = the_text + t + "<br>";
        }
        const regex = new RegExp(search_string, "gi");
        the_text = String(the_text).replace(regex, function (matched) {
          return "<mark>" + matched + "</mark>";
        });
      } else {
        for (let t of tlist) {
          the_text = the_text + t + "<br>";
        }
      }
    }
    return `<div style="white-space:pre">${the_text}</div>`;
  }
  function _handleSearchFieldChange(event) {
    set_search_helper_text(null);
    set_search_string(event.target.value);
  }
  function _handleFilter() {
    set_filter(true);
  }
  function _handleUnFilter() {
    set_search_helper_text(null);
    set_search_string(null);
    set_filter(false);
  }
  async function _logExec(command) {
    return await (0, _communication_react.postPromise)(cont_id.current, "os_command_exec", {
      "the_code": command
    }, props.main_id);
  }
  async function _commandSubmit(e) {
    e.preventDefault();
    past_commands.current.push(console_command_value);
    past_commands_index.current = null;
    await _logExec(console_command_value);
    set_console_command_value("");
  }
  function _setLiveScroll(event) {
    set_livescroll(event.target.checked);
  }
  function _onInputChange(event) {
    set_console_command_value(event.target.value);
  }
  function _handleKeyDown(event) {
    let charCode = event.keyCode;
    let new_val;
    if (charCode == 38) {
      // down arraw
      if (past_commands.current.length == 0) {
        return;
      }
      if (past_commands_index.current == null) {
        past_commands_index.current = past_commands.current.length - 1;
      }
      new_val = past_commands.current[past_commands_index.current];
      if (past_commands_index.current > 0) {
        past_commands_index.current -= 1;
      }
    } else if (charCode == 40) {
      // up arro
      if (past_commands.current.length == 0 || past_commands_index.current == null || past_commands_index.current == past_commands.current.length - 1) {
        return;
      }
      past_commands_index.current += 1;
      new_val = past_commands.current[past_commands_index.current];
    } else {
      return;
    }
    set_console_command_value(new_val);
  }
  let the_text = {
    __html: _prepareText()
  };
  const inner_style = {
    whiteSpace: "nowrap",
    fontSize: 12,
    fontFamily: "monospace",
    flex: "1 1 0",
    minHeight: 0,
    overflow: "auto"
  };
  const outer_style = {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    ...props.outer_style
  };
  const leftContent = /*#__PURE__*/_react.default.createElement(_core.ControlGroup, {
    vertical: false
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    onClick: _setLogSince,
    style: {
      height: 30
    },
    variant: "minimal",
    size: "small",
    icon: "trash"
  }), /*#__PURE__*/_react.default.createElement(_core.HTMLSelect, {
    onChange: _setMaxConsoleLines,
    large: false,
    variant: "minimal",
    value: max_console_lines_ref.current,
    options: [100, 250, 500, 1000, 2000]
  }), /*#__PURE__*/_react.default.createElement(_core.Switch, {
    label: "livescroll",
    size: "medium",
    checked: livescroll,
    onChange: _setLiveScroll,
    style: {
      marginBottom: 0,
      marginLeft: 5,
      alignSelf: "center"
    }
  }));
  const rightContent = /*#__PURE__*/_react.default.createElement(_search_form.FilterSearchForm, {
    search_string: search_string,
    handleSearchFieldChange: _handleSearchFieldChange,
    handleFilter: _handleFilter,
    handleUnFilter: _handleUnFilter,
    searchNext: null,
    searchPrevious: null,
    search_helper_text: search_helper_text,
    margin_right: 25
  });
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "searchable-console",
    style: outer_style
  }, /*#__PURE__*/_react.default.createElement(ResponsiveFlex, {
    leftContent: leftContent,
    rightContent: rightContent
  }), /*#__PURE__*/_react.default.createElement("div", {
    ref: inner_ref,
    style: inner_style,
    dangerouslySetInnerHTML: the_text
  }), props.showCommandField && /*#__PURE__*/_react.default.createElement("form", {
    onSubmit: _commandSubmit
  }, /*#__PURE__*/_react.default.createElement(_core.InputGroup, {
    type: "text",
    className: "bp6-monospace-text",
    onChange: _onInputChange,
    size: "small",
    leftIcon: "chevron-right",
    fill: true,
    onKeyDown: e => _handleKeyDown(e),
    value: console_command_value
  })));
}
exports.SearchableConsole = SearchableConsole = /*#__PURE__*/(0, _react.memo)(/*#__PURE__*/(0, _react.forwardRef)(SearchableConsole));
function ResponsiveFlex(props) {
  props = {
    gapThreshold: 100,
    leftContent: null,
    rightContent: null,
    ...props
  };
  const containerRef = (0, _react.useRef)(null);
  const leftContentRef = (0, _react.useRef)(null);
  const rightContentRef = (0, _react.useRef)(null);
  const [hideRight, setHideRight] = (0, _react.useState)(false);
  (0, _react.useEffect)(() => {
    const observer = new ResizeObserver(([entry]) => {
      const {
        width
      } = entry.contentRect;
      const le_width = leftContentRef.current.getBoundingClientRect().width;
      const re_width = rightContentRef.current.getBoundingClientRect().width;
      if (width - (re_width + le_width) < props.gapThreshold) {
        setHideRight(true);
      } else {
        setHideRight(false);
      }
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);
  return /*#__PURE__*/_react.default.createElement("div", {
    ref: containerRef,
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "self-start",
      width: "100%",
      position: "relative"
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    ref: leftContentRef
  }, props.leftContent), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      opacity: hideRight ? 0 : 1
    },
    ref: rightContentRef
  }, props.rightContent));
}