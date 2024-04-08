"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AssistantContext = void 0;
exports.ChatModule = ChatModule;
exports.withAssistant = withAssistant;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireWildcard(require("react"));
var _markdownIt = _interopRequireDefault(require("markdown-it"));
require("markdown-it-latex/dist/index.css");
var _markdownItLatex = _interopRequireDefault(require("markdown-it-latex"));
var _core = require("@blueprintjs/core");
var _utilities_react = require("./utilities_react");
var _communication_react = require("./communication_react");
var _theme = require("./theme");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// noinspection TypeScriptUMDGlobal

const mdi = (0, _markdownIt.default)({
  html: true
});
mdi.use(_markdownItLatex.default);
const AssistantContext = exports.AssistantContext = /*#__PURE__*/(0, _react.createContext)(null);
function withAssistant(WrappedComponent) {
  let lposition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "right";
  let assistant_drawer_size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "45%";
  function WithAssistant(props) {
    const [show_drawer, set_show_drawer] = (0, _react.useState)(false);
    const [item_list, set_item_list, item_list_ref] = (0, _utilities_react.useStateAndRef)([]);
    const [stream_text, set_stream_text, stream_text_ref] = (0, _utilities_react.useStateAndRef)("");
    const [assistant_id, set_assistant_id, assistant_id_ref] = (0, _utilities_react.useStateAndRef)(null);
    const [chat_status, set_chat_status, chat_status_ref] = (0, _utilities_react.useStateAndRef)(window.has_openapi_key ? "idle" : null);
    (0, _react.useEffect)(() => {
      if (window.has_openapi_key) {
        (0, _communication_react.postPromise)("host", "StartAssistant", {
          main_id: window.main_id,
          user_id: window.user_id
        }).then(response => {
          set_assistant_id(response.assistant_id);
        });
        function sendRemove() {
          if (assistant_id_ref.current) {
            navigator.sendBeacon("/delete_container_on_unload", JSON.stringify({
              "container_id": assistant_id_ref.current,
              "notify": false
            }));
          }
        }
        window.addEventListener("unload", sendRemove);
      }
      return () => {
        sendRemove();
        window.removeEventListener("unload", sendRemove);
      };
    }, []);
    function delete_my_container() {
      if (assistant_id_ref.current) {
        (0, _communication_react.postAjax)("/delete_container_on_unload", {
          "container_id": assistant_id_ref.current,
          "notify": false
        });
        assistant_id_ref.current = null;
      }
    }
    function _close(data) {
      if (data == null || !("main_id" in data) || data.main_id == window.main_id) {
        set_show_drawer(false);
      }
    }
    function _open(data) {
      if (data == null || !("main_id" in data) || data.main_id == window.main_id) {
        set_show_drawer(true);
      }
    }
    function _toggle(data) {
      if (data == null || !("main_id" in data) || data.main_id == window.main_id) {
        set_show_drawer(!show_drawer);
      }
    }
    function _postAjaxFailure(qXHR, textStatus, errorThrown) {
      _addEntry({
        title: "Post Ajax Failure: {}".format(textStatus),
        content: errorThrown
      });
    }
    function _onClose() {
      set_show_drawer(false);
    }
    let assistantDrawerFuncs = {
      showAssistantDrawerButton: window.has_openapi_key,
      openAssistantDrawer: _open,
      closeAssistantDrawer: _close,
      postAjaxFailure: _postAjaxFailure,
      toggleAssistantDrawer: _toggle,
      item_list_ref: item_list_ref,
      set_item_list: set_item_list,
      stream_text_ref: stream_text_ref,
      set_stream_text: set_stream_text,
      chat_status_ref: chat_status_ref,
      set_chat_status: set_chat_status,
      assistant_id_ref: assistant_id_ref,
      show_drawer: show_drawer
    };
    return /*#__PURE__*/_react.default.createElement(AssistantContext.Provider, {
      value: assistantDrawerFuncs
    }, /*#__PURE__*/_react.default.createElement(_react.Fragment, null, window.has_openapi_key && /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(WrappedComponent, props), /*#__PURE__*/_react.default.createElement(AssistantDrawer, {
      show_drawer: show_drawer,
      position: lposition,
      tsocket: props.tsocket,
      assistant_drawer_size: assistant_drawer_size,
      closeAssistantDrawer: _close,
      title: "ChatBot",
      size: assistant_drawer_size,
      onClose: _onClose
    })), !window.has_openapi_key && /*#__PURE__*/_react.default.createElement(WrappedComponent, props)));
  }
  return /*#__PURE__*/(0, _react.memo)(WithAssistant);
}
function AssistantDrawer(props) {
  const theme = (0, _react.useContext)(_theme.ThemeContext);
  return /*#__PURE__*/_react.default.createElement(_core.Drawer, {
    icon: "chat",
    className: theme.dark_theme ? "bp5-dark" : "light-theme",
    title: props.title,
    isOpen: props.show_drawer,
    position: props.position,
    canOutsideClickClose: true,
    onClose: props.onClose,
    enforceFocus: true,
    hasBackdrop: false,
    size: props.size
  }, /*#__PURE__*/_react.default.createElement(ChatModule, {
    tsocket: props.tsocket
  }));
}
AssistantDrawer = /*#__PURE__*/(0, _react.memo)(AssistantDrawer);
const input_style = {
  position: "relative",
  bottom: 0,
  margin: 10
};
const idle_statuses = ["completed", "expired", "cancelled", "failed"];
const BOTTOM_MARGIN = 25;
function ChatModule(props) {
  const top_ref = /*#__PURE__*/_react.default.createRef();
  const control_ref = /*#__PURE__*/_react.default.createRef();
  const list_ref = /*#__PURE__*/_react.default.createRef();
  const stream_dict_ref = /*#__PURE__*/_react.default.createRef();
  const [prompt_value, set_prompt_value, prompt_value_ref] = (0, _utilities_react.useStateAndRef)("");
  const [response_counter, set_response_counter, response_counter_ref] = (0, _utilities_react.useStateAndRef)(0);
  const [usable_height, set_usable_height] = (0, _react.useState)(() => {
    return window.innerHeight - 40 - BOTTOM_MARGIN;
  });
  const assistantDrawerFuncs = (0, _react.useContext)(AssistantContext);
  const pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _react.useEffect)(() => {
    initSocket();
    stream_dict_ref.current = {};
    window.addEventListener("resize", _update_window_dimensions);
    _update_window_dimensions();
    return () => {
      window.removeEventListener("resize", _update_window_dimensions);
    };
  }, []);
  (0, _react.useEffect)(() => {
    if (list_ref && list_ref.current) {
      list_ref.current.scrollTo(0, list_ref.current.scrollHeight);
    }
  });
  function initSocket() {
    props.tsocket.attachListener("chat_status", _handleChatStatus);
    props.tsocket.attachListener("chat_delta", _handleChatDelta);
  }
  function _update_window_dimensions() {
    let uheight;
    let top_rect;
    if (top_ref && top_ref.current) {
      top_rect = top_ref.current.getBoundingClientRect();
      uheight = window.innerHeight - top_rect.top - BOTTOM_MARGIN;
    } else {
      uheight = window.innerHeight - 40 - BOTTOM_MARGIN;
    }
    set_usable_height(uheight);
  }
  function _onInputChange(event) {
    set_prompt_value(event.target.value);
  }
  function stream_dict_to_string() {
    const sortedKeys = Object.keys(stream_dict_ref.current).sort((a, b) => a - b);
    return sortedKeys.map(key => stream_dict_ref.current[key]).join('');
  }
  function _handleChatDelta(data) {
    let current_stream_dict = stream_dict_ref.current;
    current_stream_dict[data.counter] = data.delta;
    const new_text = stream_dict_to_string();
    assistantDrawerFuncs.set_stream_text(new_text);
    pushCallback(() => {
      set_response_counter(response_counter_ref.current + 1);
    });
  }
  function _handleChatEnd(stream_text) {
    stream_dict_ref.current = {};
    let converted_markdown = mdi.render(stream_text);
    const new_item_list = [...assistantDrawerFuncs.item_list_ref.current, {
      kind: "response",
      text: converted_markdown
    }];
    assistantDrawerFuncs.set_item_list(new_item_list);
    assistantDrawerFuncs.set_chat_status("idle");
  }
  function _handleChatStatus(data) {
    if (idle_statuses.includes(data.status)) {
      assistantDrawerFuncs.set_chat_status("idle");
      if (Object.keys(stream_dict_ref.current).length == 0) return;
      const current_stream_text = assistantDrawerFuncs.stream_text_ref.current;
      assistantDrawerFuncs.set_stream_text({});
      _handleChatEnd(current_stream_text);
    } else {
      assistantDrawerFuncs.set_chat_status(data.status);
    }
  }
  async function _handleButton(event) {
    event.preventDefault();
    if (assistantDrawerFuncs.chat_status_ref.current == "idle") {
      await _promptSubmit();
    } else {
      await _cancelPrompt();
    }
  }
  async function _cancelPrompt() {
    try {
      await (0, _communication_react.postPromise)(assistantDrawerFuncs.assistant_id_ref.current, "cancel_run_task", {});
    } catch (error) {
      console.log(error.message);
    }
  }
  async function _promptSubmit(event) {
    try {
      const new_item_list = [...assistantDrawerFuncs.item_list_ref.current, {
        kind: "prompt",
        text: prompt_value_ref.current
      }];
      assistantDrawerFuncs.set_item_list(new_item_list);
      set_prompt_value("");
      assistantDrawerFuncs.set_chat_status("posted");
      await (0, _communication_react.postPromise)(assistantDrawerFuncs.assistant_id_ref.current, "post_prompt_stream", {
        prompt: prompt_value_ref.current
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  let items = assistantDrawerFuncs.item_list_ref.current.map((item, index) => {
    if (item.kind == "prompt") {
      return /*#__PURE__*/_react.default.createElement(Prompt, (0, _extends2.default)({
        key: index
      }, item));
    } else {
      return /*#__PURE__*/_react.default.createElement(Response, (0, _extends2.default)({
        key: index
      }, item));
    }
  });
  if (assistantDrawerFuncs.chat_status_ref.current != "idle") {
    items.push( /*#__PURE__*/_react.default.createElement(ResponseInProgress, {
      key: "response-in-progress",
      stream_text: assistantDrawerFuncs.stream_text_ref.current
    }));
  }
  let card_list_height = usable_height - 30;
  if (control_ref.current) {
    card_list_height = usable_height - control_ref.current.clientHeight;
  }
  const chat_pane_style = {
    marginTop: 10,
    marginLeft: 25,
    marginRight: 25,
    paddingTop: 10,
    height: usable_height,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "chat-module",
    ref: top_ref,
    style: chat_pane_style
  }, /*#__PURE__*/_react.default.createElement(_core.CardList, {
    ref: list_ref,
    bordered: false,
    style: {
      height: card_list_height
    }
  }, items), /*#__PURE__*/_react.default.createElement(_core.ControlGroup, {
    ref: control_ref,
    vertical: false,
    style: input_style
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    icon: assistantDrawerFuncs.chat_status_ref.current == "idle" ? "send-message" : "stop",
    minimal: true,
    large: true,
    onClick: _handleButton
  }), /*#__PURE__*/_react.default.createElement(_core.TextArea, {
    type: "text",
    autoResize: true,
    style: {
      width: "100%"
    },
    onChange: _onInputChange,
    large: true,
    fill: true,
    value: prompt_value_ref.current
  })));
}
exports.ChatModule = ChatModule = /*#__PURE__*/(0, _react.memo)(ChatModule);
const chat_item_style = {
  display: "flex",
  flexDirection: "column",
  width: "100%"
};
function Prompt(props) {
  return /*#__PURE__*/_react.default.createElement(_core.Card, {
    interactive: false
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: chat_item_style
  }, /*#__PURE__*/_react.default.createElement("h6", null, "You"), /*#__PURE__*/_react.default.createElement("div", null, props.text)));
}
Prompt = /*#__PURE__*/(0, _react.memo)(Prompt);
function Response(props) {
  let converted_dict = {
    __html: props.text
  };
  return /*#__PURE__*/_react.default.createElement(_core.Card, {
    interactive: false
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: chat_item_style
  }, /*#__PURE__*/_react.default.createElement("h6", null, "ChatBot"), /*#__PURE__*/_react.default.createElement("div", {
    className: "chat-response",
    dangerouslySetInnerHTML: converted_dict
  })));
}
Response = /*#__PURE__*/(0, _react.memo)(Response);
const dummy_text = `This is a test of the chatbot. This is only a test. 
If this were a real chatbot, you would be getting useful information.`;
function ResponseInProgress(props) {
  if (props.stream_text != "") {
    const sortedKeys = Object.keys(props.stream_text).sort((a, b) => a - b);
    const result = sortedKeys.map(key => props.stream_text[key]).join('');
    let converted_markdown = mdi.render(result);
    return /*#__PURE__*/_react.default.createElement(Response, {
      text: converted_markdown
    });
  }
  let converted_dict = {
    __html: dummy_text
  };
  return /*#__PURE__*/_react.default.createElement(_core.Card, {
    className: "bp-skeleton",
    interactive: false
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: chat_item_style
  }, /*#__PURE__*/_react.default.createElement("h6", null, "ChatBot"), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      height: 100
    },
    className: "chat-response bp5-skeleton",
    dangerouslySetInnerHTML: converted_dict
  })));
}
ResponseInProgress = /*#__PURE__*/(0, _react.memo)(ResponseInProgress);