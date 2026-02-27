
// noinspection TypeScriptUMDGlobal

import React from "react";


import markdownIt from 'markdown-it'
import 'markdown-it-latex/dist/index.css'
import markdownItLatex from 'markdown-it-latex'

import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('javascript', javascript);

import python from 'highlight.js/lib/languages/python';
hljs.registerLanguage('python', python);

const mdi = markdownIt({
    html: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return '<pre><code class="hljs">' +
                   hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                   '</code></pre>';
          } catch (__) {}
        }
        return '<pre><code class="hljs">' + mdi.utils.escapeHtml(str) + '</code></pre>';
    }
});
mdi.use(markdownItLatex);

import {useState, useEffect, useRef, memo, useContext, createContext, Fragment} from "react";
import {Button, Drawer, ButtonGroup} from "@blueprintjs/core";
import {Card, CardList, TextArea, ControlGroup} from "@blueprintjs/core";

import {useStateAndRef, useCallbackStack} from "./utilities_react";
import {useSocketListener} from "./tactic_socket";
import {postPromise} from "./communication_react";
import {SettingsContext} from "./settings";
import {ErrorDrawerContext} from "./error_drawer";
import {StatusContext} from "./toaster";
import {DialogContext} from "./modal_react";
const AssistantContext = createContext(null);

export {ChatModule,withAssistant, AssistantContext};

function formatLatexEquations(text) {
    const displayRegex = /\$\$(.+?)\$\$/gs;
    text = text.replace(displayRegex, (_, equation) => `\`$${equation}$\``);
    const inlineRegex = /\$(.+?)\$/g;
    text = text.replace(inlineRegex, (_, equation) => `\`$${equation}$\``);

    return text;
}

function withAssistant(WrappedComponent, lposition = "right", assistant_drawer_size = "45%") {
    function WithAssistant(props) {
        const [show_drawer, set_show_drawer] = useState(false);
        const [, set_item_list, item_list_ref] = useStateAndRef([]);
        const [, set_stream_text, stream_text_ref] = useStateAndRef("");
        const [, set_chat_status, chat_status_ref] = useStateAndRef(window.has_openapi_key ? "idle" : null);
        const [, set_assistant_prompt_value, assistant_prompt_value_ref] = useStateAndRef("");

        const initialized = useRef(false);

        const errorDrawerFuncs = useContext(ErrorDrawerContext);


        useEffect(()=>{
            if (show_drawer && window.has_openapi_key && !initialized.current) {
                getAssistant()
            }
        },[show_drawer]);

        function getPastMessages() {
            postPromise("assistant", "get_past_messages", {local_id: window.global_id})
                .then((data) => {
                    for (let msg of data["messages"]) {
                        if (msg["kind"] == "assistant") {
                            msg["text"] = formatLatexEquations(msg["text"]);
                            msg["text"] = mdi.render(msg["text"])
                        }
                    }
                    set_item_list(data["messages"])
                    initialized.current = true;
                })
                .catch((data)=>{
                        errorDrawerFuncs.addErrorDrawerEntry({
                            title: "Error getting past messages",
                            content: "message" in data ? data.message : ""})
                 })
        }

        function getAssistant() {
            postPromise("assistant", "start_session", {
                user_id: window.user_id,
                global_id: window.global_id,
                local_id: window.global_id
            })
                .then((response) => {
                    if (response.status == "exists") {
                        getPastMessages();
                    }
                })
                 .catch((data)=>{
                        errorDrawerFuncs.addErrorDrawerEntry({
                            title: "Error getting assistant",
                            content: "message" in data ? data.message : ""})
                 })
        }


        function _close() {
            set_show_drawer(false);
        }

        function _open() {
            set_show_drawer(true)
        }

        function _toggle() {
            set_show_drawer(!show_drawer)
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
            show_drawer: show_drawer
        };
        return (
            <AssistantContext.Provider value={assistantDrawerFuncs}>
                <Fragment>
                    {window.has_openapi_key &&
                            <Fragment>
                                <WrappedComponent {...props}/>
                                <AssistantDrawer show_drawer={show_drawer}
                                                 position={lposition}
                                                 tsocket={props.tsocket}
                                                 assistant_prompt_value_ref={assistant_prompt_value_ref}
                                                 set_assistant_prompt_value={set_assistant_prompt_value}
                                                 assistant_drawer_size={assistant_drawer_size}
                                                 closeAssistantDrawer={_close}
                                                 title="ChatBot"
                                                 size={assistant_drawer_size}
                                                 onClose={_onClose}/>
                            </Fragment>
                    }
                    {!window.has_openapi_key &&
                        <WrappedComponent {...props}/>
                    }
                </Fragment>
            </AssistantContext.Provider>
        )
    }
    return memo(WithAssistant)
}

function AssistantDrawer(props) {

    const settingsContext = useContext(SettingsContext);

    useEffect(() => {
        // console.log("theme changed")  // This is to force re-rendering because of highlight.js theme change
    }, [settingsContext.settings.theme]);


    return (
        <Drawer
            icon="chat"
            className={settingsContext.isDark() ? "bp6-dark" : "light-theme"}
            title={props.title}
            isOpen={props.show_drawer}
            position={props.position}
            canOutsideClickClose={false}
            onClose={props.onClose}
            enforceFocus={false}
            hasBackdrop={false}
            size={props.size}
            >
            <ChatModule tsocket={props.tsocket}
                        assistant_prompt_value_ref={props.assistant_prompt_value_ref}
                        set_assistant_prompt_value={props.set_assistant_prompt_value}
            />
        </Drawer>
    )
}

AssistantDrawer = memo(AssistantDrawer);

const input_style = {position: "relative", bottom: 0, margin: 10};
const idle_statuses = ["completed", "expired", "cancelled", "failed"];
function ChatModule(props) {
    const top_ref = useRef();
    const control_ref = useRef();
    const list_ref = useRef();
    const stream_dict_ref = useRef({});

    const [, set_response_counter, response_counter_ref] = useStateAndRef(0);

    const assistantDrawerFuncs = useContext(AssistantContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);
    const dialogFuncs = useContext(DialogContext);
    const statusFuncs = useContext(StatusContext);

    const pushCallback = useCallbackStack();

    useEffect(() => {
        stream_dict_ref.current = {};
    }, []);

    useEffect(() => {
        if (list_ref && list_ref.current) {
            list_ref.current.scrollTo(0, list_ref.current.scrollHeight)
        }
    });

    useSocketListener(props.tsocket, "chat_status", (data) => {
        if (idle_statuses.includes(data.status)) {
            assistantDrawerFuncs.set_chat_status("idle");
            if (Object.keys(stream_dict_ref.current).length == 0) return;
            const current_stream_text = assistantDrawerFuncs.stream_text_ref.current;
            assistantDrawerFuncs.set_stream_text({});
            _handleChatEnd(current_stream_text)
        }
        else {
            assistantDrawerFuncs.set_chat_status(data.status)
        }
    }, [])

    useSocketListener(props.tsocket, "chat_delta", (data) => {
        let current_stream_dict = stream_dict_ref.current;
        if (!current_stream_dict) {
            current_stream_dict = {};
        }
        current_stream_dict[data.counter] = data.delta;
        stream_dict_ref.current = current_stream_dict;
        const new_text = stream_dict_to_string();
        assistantDrawerFuncs.set_stream_text(new_text);
        pushCallback(() => {
            set_response_counter(response_counter_ref.current + 1)
        })
    }, []);

    function _onInputChange(event) {
        props.set_assistant_prompt_value(event.target.value);
    }

    function stream_dict_to_string() {
        const sortedKeys = Object.keys(stream_dict_ref.current).sort((a, b) => a - b);
        return sortedKeys.map(key => stream_dict_ref.current[key]).join('');
    }


    function _handleChatEnd(stream_text) {
        stream_dict_ref.current = {};
        stream_text = formatLatexEquations(stream_text);
        let converted_markdown = mdi.render(stream_text);
        const new_item_list = [...assistantDrawerFuncs.item_list_ref.current, {kind: "response", text: converted_markdown}];
        assistantDrawerFuncs.set_item_list(new_item_list);
        assistantDrawerFuncs.set_chat_status("idle");
    }

    async function _handleButton(event) {
        event.preventDefault();
        if (assistantDrawerFuncs.chat_status_ref.current == "idle") {
            await _promptSubmit()
        }
        else {
            await _cancelPrompt()
        }
    }

    async function _cancelPrompt() {
        try {
            await postPromise("assistant", "cancel_run_task", {local_id: window.global_id});
        } catch (error) {
            console.log(error.message)
        }
    }
    
    function _addEntry(entry) {
        const new_item_list = [...assistantDrawerFuncs.item_list_ref.current, entry];
        assistantDrawerFuncs.set_item_list(new_item_list);
    }

    async function _promptSubmit() {
        try {
            _addEntry({kind: "user", text: props.assistant_prompt_value_ref.current});
            props.set_assistant_prompt_value("");
            assistantDrawerFuncs.set_chat_status("posted");
            await postPromise("assistant", "post_prompt_stream",
                {prompt: props.assistant_prompt_value_ref.current, local_id: window.global_id})
        } catch (error) {
            console.log(error.message)
        }
    }

    async function handleKeyDown(event) {
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            await _promptSubmit(event)
        }
    }

    async function _clearThread() {
        try {
            await postPromise("assistant", "clear_thread", {local_id: window.global_id});
            assistantDrawerFuncs.set_item_list([])
        } catch (e) {
            errorDrawerFuncs.addFromError("error clearing thread", e)
        }
    }

    async function _saveThreadAs() {
        statusFuncs.startSpinner();
        let data = await postPromise("host", "get_project_names_task", {});

        try {
            let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                title: "Save Thread To Notebook",
                field_title: "New Notebook Name",
                default_value: "ThreadNotebook",
                existing_names: data.project_names,
                checkboxes: null,
                handleClose: dialogFuncs.hideModal,
            });
            await postPromise("host", "SaveAssistantThread", {
                room: window.global_id,
                local_id: window.global_id,
                new_name: new_name,
                user_id: window.user_id});
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();
            statusFuncs.statusMessage(`Saved project ${new_name}`)

        } catch (e) {
            if (e != "canceled") {
                let title = "title" in e ? e.title : "Error saving thread";
                errorDrawerFuncs.addFromError(title, e)
            }
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();
        }
    }

    let items = assistantDrawerFuncs.item_list_ref.current.map((item, index) => {
        if (item.kind == "user") {
            return <Prompt key={index} {...item}/>
        } else {
            return <Response key={index} {...item}/>
        }
    });
    if (assistantDrawerFuncs.chat_status_ref.current != "idle"){
        items.push(<ResponseInProgress key="response-in-progress"
                                       stream_text={assistantDrawerFuncs.stream_text_ref.current}/>)
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
    return (
        <div className="chat-module" ref={top_ref} style={chat_pane_style}>
            <div className="d-flex flex-row justify-content-end mt-2">
                <ButtonGroup>
                    <Button icon="trash" text="Clear" onClick={_clearThread}/>
                    <Button icon="floppy-disk" text="Save" onClick={_saveThreadAs}/>
                </ButtonGroup>
            </div>
            <CardList ref={list_ref} bordered={false}
                      style={{flex: "1 1 0", overflow: "auto", position: "relative"}}>
                {items}
            </CardList>
            <ControlGroup ref={control_ref}
                          vertical={false}
                          style={input_style}>
                <Button icon={assistantDrawerFuncs.chat_status_ref.current == "idle" ? "send-message" : "stop"}
                        variant="minimal"
                        size="large"
                        onClick={_handleButton}/>
                <TextArea type="text"
                          autoResize={true}
                          style={{width: "100%"}}
                          onChange={_onInputChange}
                          size="large"
                          fill={true}
                          onKeyDown={handleKeyDown}
                          value={props.assistant_prompt_value_ref.current}
                />
            </ControlGroup>
        </div>
    )
}

ChatModule = memo(ChatModule);

const chat_item_style = {display: "flex", flexDirection: "column", width: "100%"};

function Prompt(props) {
    return (
        <Card interactive={false}>
            <div style={chat_item_style}>
                <h6>You</h6>
                <div>{props.text}</div>
            </div>
        </Card>
    )
}

Prompt = memo(Prompt);

function Response(props) {

    let converted_dict = {__html: props.text};
    return (
        <Card interactive={false}>
            <div style={chat_item_style}>
                <h6>ChatBot</h6>
                <div className="chat-response markdown-heading-sizes"
                     dangerouslySetInnerHTML={converted_dict}/>
            </div>
        </Card>
    )
}

Response = memo(Response);

const dummy_text = `This is a test of the chatbot. This is only a test. 
If this were a real chatbot, you would be getting useful information.`;

function ResponseInProgress(props) {
    if (props.stream_text != "") {
        const sortedKeys = Object.keys(props.stream_text).sort((a, b) => a - b);
        let result = sortedKeys.map(key => props.stream_text[key]).join('');
        result = formatLatexEquations(result);
        let converted_markdown = mdi.render(result);
        return (
            <Response text={converted_markdown}/>
        )
    }
    let converted_dict = {__html: dummy_text};
    return (
        <Card className="bp-skeleton" interactive={false}>
            <div style={chat_item_style}>
                <h6>ChatBot</h6>
                <div style={{height: 100}} className="chat-response markdown-heading-sizes bp6-skeleton"
                     dangerouslySetInnerHTML={converted_dict}/>
            </div>
        </Card>
    )
}

ResponseInProgress = memo(ResponseInProgress);