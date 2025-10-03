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
var _core = _interopRequireDefault(require("highlight.js/lib/core"));
var _javascript = _interopRequireDefault(require("highlight.js/lib/languages/javascript"));
var _python = _interopRequireDefault(require("highlight.js/lib/languages/python"));
var _core2 = require("@blueprintjs/core");
var _utilities_react = require("./utilities_react");
var _communication_react = require("./communication_react");
var _settings = require("./settings");
var _error_drawer = require("./error_drawer");
var _toaster = require("./toaster");
var _modal_react = require("./modal_react");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
// noinspection TypeScriptUMDGlobal

_core.default.registerLanguage('javascript', _javascript.default);
_core.default.registerLanguage('python', _python.default);
const mdi = (0, _markdownIt.default)({
  html: true,
  highlight: function (str, lang) {
    if (lang && _core.default.getLanguage(lang)) {
      try {
        return '<pre><code class="hljs">' + _core.default.highlight(str, {
          language: lang,
          ignoreIllegals: true
        }).value + '</code></pre>';
      } catch (__) {}
    }
    return '<pre><code class="hljs">' + mdi.utils.escapeHtml(str) + '</code></pre>';
  }
});
mdi.use(_markdownItLatex.default);
const AssistantContext = exports.AssistantContext = /*#__PURE__*/(0, _react.createContext)(null);
function formatLatexEquations(text) {
  const displayRegex = /\$\$(.+?)\$\$/gs;
  text = text.replace(displayRegex, (_, equation) => `\`$${equation}$\``);
  const inlineRegex = /\$(.+?)\$/g;
  text = text.replace(inlineRegex, (_, equation) => `\`$${equation}$\``);
  return text;
}
function withAssistant(WrappedComponent, lposition = "right", assistant_drawer_size = "45%") {
  function WithAssistant(props) {
    const [show_drawer, set_show_drawer] = (0, _react.useState)(false);
    const [, set_item_list, item_list_ref] = (0, _utilities_react.useStateAndRef)([]);
    const [, set_stream_text, stream_text_ref] = (0, _utilities_react.useStateAndRef)("");
    const [, set_assistant_id, assistant_id_ref] = (0, _utilities_react.useStateAndRef)(null);
    const [, set_chat_status, chat_status_ref] = (0, _utilities_react.useStateAndRef)(window.has_openapi_key ? "idle" : null);
    const [, set_assistant_prompt_value, assistant_prompt_value_ref] = (0, _utilities_react.useStateAndRef)("");
    const errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
    (0, _react.useEffect)(() => {
      if (window.has_openapi_key) {
        getAssistant();
      }
      return () => {};
    }, []);
    (0, _react.useEffect)(() => {
      if (show_drawer) {
        getAssistant();
      }
    }, [show_drawer]);
    const pushCallback = (0, _utilities_react.useCallbackStack)();
    function getPastMessages() {
      if (assistant_id_ref.current == null) return;
      (0, _communication_react.postPromise)(assistant_id_ref.current, "get_past_messages", {}).then(data => {
        for (let msg of data["messages"]) {
          if (msg["kind"] == "assistant") {
            msg["text"] = formatLatexEquations(msg["text"]);
            msg["text"] = mdi.render(msg["text"]);
          }
        }
        set_item_list(data["messages"]);
      }).catch(data => {
        errorDrawerFuncs.addErrorDrawerEntry({
          title: "Error getting past messages",
          content: "message" in data ? data.message : ""
        });
      });
    }
    function getAssistant() {
      (0, _communication_react.postPromise)("host", "GetAssistant", {
        user_id: window.user_id
      }).then(response => {
        if (response.assistant_id == null) {
          startAssistant();
        } else if (response.assistant_id != assistant_id_ref.current) {
          set_assistant_id(response.assistant_id);
          pushCallback(getPastMessages);
        }
      }).catch(data => {
        errorDrawerFuncs.addErrorDrawerEntry({
          title: "Error getting assistant",
          content: "message" in data ? data.message : ""
        });
      });
    }
    function startAssistant() {
      (0, _communication_react.postPromise)("host", "StartAssistant", {
        parent_id: window.global_id,
        user_id: window.user_id
      }).then(response => {
        set_assistant_id(response.assistant_id);
      });
    }
    function _close(data) {
      set_show_drawer(false);
    }
    function _open(data) {
      set_show_drawer(true);
    }
    function _toggle(data) {
      set_show_drawer(!show_drawer);
    }
    function _onClose() {
      set_show_drawer(false);
    }
    let assistantDrawerFuncs = {
      showAssistantDrawerButton: window.has_openapi_key,
      openAssistantDrawer: _open,
      closeAssistantDrawer: _close,
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
      assistant_prompt_value_ref: assistant_prompt_value_ref,
      set_assistant_prompt_value: set_assistant_prompt_value,
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
  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  (0, _react.useEffect)(() => {
    // console.log("theme changed")  // This is to force re-rendering because of highlight.js theme change
  }, [settingsContext.settings.theme]);
  return /*#__PURE__*/_react.default.createElement(_core2.Drawer, {
    icon: "chat",
    className: settingsContext.isDark() ? "bp6-dark" : "light-theme",
    title: props.title,
    isOpen: props.show_drawer,
    position: props.position,
    canOutsideClickClose: false,
    onClose: props.onClose,
    enforceFocus: false,
    hasBackdrop: false,
    size: props.size
  }, /*#__PURE__*/_react.default.createElement(ChatModule, {
    tsocket: props.tsocket,
    assistant_prompt_value_ref: props.assistant_prompt_value_ref,
    set_assistant_prompt_value: props.set_assistant_prompt_value
  }));
}
AssistantDrawer = /*#__PURE__*/(0, _react.memo)(AssistantDrawer);
const input_style = {
  position: "relative",
  bottom: 0,
  margin: 10
};
const idle_statuses = ["completed", "expired", "cancelled", "failed"];
function ChatModule(props) {
  const top_ref = /*#__PURE__*/_react.default.createRef();
  const control_ref = /*#__PURE__*/_react.default.createRef();
  const list_ref = /*#__PURE__*/_react.default.createRef();
  const stream_dict_ref = /*#__PURE__*/_react.default.createRef();
  const [, set_response_counter, response_counter_ref] = (0, _utilities_react.useStateAndRef)(0);
  const assistantDrawerFuncs = (0, _react.useContext)(AssistantContext);
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  const dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  const pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _react.useEffect)(() => {
    initSocket();
    stream_dict_ref.current = {};
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
  function _onInputChange(event) {
    props.set_assistant_prompt_value(event.target.value);
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
    stream_text = formatLatexEquations(stream_text);
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
  function _addEntry(entry) {
    const new_item_list = [...assistantDrawerFuncs.item_list_ref.current, entry];
    assistantDrawerFuncs.set_item_list(new_item_list);
  }
  async function _promptSubmit() {
    try {
      _addEntry({
        kind: "user",
        text: props.assistant_prompt_value_ref.current
      });
      props.set_assistant_prompt_value("");
      assistantDrawerFuncs.set_chat_status("posted");
      await (0, _communication_react.postPromise)(assistantDrawerFuncs.assistant_id_ref.current, "post_prompt_stream", {
        prompt: props.assistant_prompt_value_ref.current,
        local_id: window.global_id
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  async function handleKeyDown(event) {
    if (event.ctrlKey && event.key === 'Enter') {
      event.preventDefault();
      await _promptSubmit(event);
    }
  }
  async function _clearThread() {
    try {
      await (0, _communication_react.postPromise)(assistantDrawerFuncs.assistant_id_ref.current, "clear_thread", {});
      assistantDrawerFuncs.set_item_list([]);
    } catch (e) {
      errorDrawerFuncs.addFromError(title, e);
    }
  }
  async function _saveThreadAs() {
    statusFuncs.startSpinner();
    let data = await (0, _communication_react.postPromise)("host", "get_project_names_task", {});
    try {
      let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
        title: "Save Thread To Notebook",
        field_title: "New Notebook Name",
        default_value: "ThreadNotebook",
        existing_names: data.project_names,
        checkboxes: null,
        handleClose: dialogFuncs.hideModal
      });
      await (0, _communication_react.postPromise)("host", "SaveAssistantThread", {
        room: window.global_id,
        assistant_id: assistantDrawerFuncs.assistant_id_ref.current,
        new_name: new_name,
        user_id: window.user_id
      });
      statusFuncs.clearStatusMessage();
      statusFuncs.stopSpinner();
      statusFuncs.statusMessage(`Saved project ${new_name}`);
    } catch (e) {
      if (e != "canceled") {
        let title = "title" in e ? e.title : "Error saving thread";
        errorDrawerFuncs.addFromError(title, e);
      }
      statusFuncs.clearStatusMessage();
      statusFuncs.stopSpinner();
    }
  }
  let items = assistantDrawerFuncs.item_list_ref.current.map((item, index) => {
    if (item.kind == "user") {
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
    items.push(/*#__PURE__*/_react.default.createElement(ResponseInProgress, {
      key: "response-in-progress",
      stream_text: assistantDrawerFuncs.stream_text_ref.current
    }));
  }
  const chat_pane_style = {
    marginLeft: 25,
    marginRight: 25,
    flex: "1 1 0",
    minHeight: 0,
    overflow: "auto",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "chat-module",
    ref: top_ref,
    style: chat_pane_style
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "d-flex flex-row justify-content-end mt-2"
  }, /*#__PURE__*/_react.default.createElement(_core2.ButtonGroup, null, /*#__PURE__*/_react.default.createElement(_core2.Button, {
    icon: "trash",
    text: "Clear",
    onClick: _clearThread
  }), /*#__PURE__*/_react.default.createElement(_core2.Button, {
    icon: "floppy-disk",
    text: "Save",
    onClick: _saveThreadAs
  }))), /*#__PURE__*/_react.default.createElement(_core2.CardList, {
    ref: list_ref,
    bordered: false,
    style: {
      flex: "1 1 0",
      overflow: "auto",
      position: "relative"
    }
  }, items), /*#__PURE__*/_react.default.createElement(_core2.ControlGroup, {
    ref: control_ref,
    vertical: false,
    style: input_style
  }, /*#__PURE__*/_react.default.createElement(_core2.Button, {
    icon: assistantDrawerFuncs.chat_status_ref.current == "idle" ? "send-message" : "stop",
    variant: "minimal",
    size: "large",
    onClick: _handleButton
  }), /*#__PURE__*/_react.default.createElement(_core2.TextArea, {
    type: "text",
    autoResize: true,
    style: {
      width: "100%"
    },
    onChange: _onInputChange,
    size: "large",
    fill: true,
    onKeyDown: handleKeyDown,
    value: props.assistant_prompt_value_ref.current
  })));
}
exports.ChatModule = ChatModule = /*#__PURE__*/(0, _react.memo)(ChatModule);
const chat_item_style = {
  display: "flex",
  flexDirection: "column",
  width: "100%"
};
function Prompt(props) {
  return /*#__PURE__*/_react.default.createElement(_core2.Card, {
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
  return /*#__PURE__*/_react.default.createElement(_core2.Card, {
    interactive: false
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: chat_item_style
  }, /*#__PURE__*/_react.default.createElement("h6", null, "ChatBot"), /*#__PURE__*/_react.default.createElement("div", {
    className: "chat-response markdown-heading-sizes",
    dangerouslySetInnerHTML: converted_dict
  })));
}
Response = /*#__PURE__*/(0, _react.memo)(Response);
const dummy_text = `This is a test of the chatbot. This is only a test. 
If this were a real chatbot, you would be getting useful information.`;
function ResponseInProgress(props) {
  if (props.stream_text != "") {
    const sortedKeys = Object.keys(props.stream_text).sort((a, b) => a - b);
    let result = sortedKeys.map(key => props.stream_text[key]).join('');
    result = formatLatexEquations(result);
    let converted_markdown = mdi.render(result);
    return /*#__PURE__*/_react.default.createElement(Response, {
      text: converted_markdown
    });
  }
  let converted_dict = {
    __html: dummy_text
  };
  return /*#__PURE__*/_react.default.createElement(_core2.Card, {
    className: "bp-skeleton",
    interactive: false
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: chat_item_style
  }, /*#__PURE__*/_react.default.createElement("h6", null, "ChatBot"), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      height: 100
    },
    className: "chat-response markdown-heading-sizes bp6-skeleton",
    dangerouslySetInnerHTML: converted_dict
  })));
}
ResponseInProgress = /*#__PURE__*/(0, _react.memo)(ResponseInProgress);