
// noinspection TypeScriptUMDGlobal

import React from "react";
import markdownIt from 'markdown-it'
import 'markdown-it-latex/dist/index.css'
import markdownItLatex from 'markdown-it-latex'

const mdi = markdownIt({html: true});
mdi.use(markdownItLatex);

import {useState, useEffect, memo, useContext, createContext, Fragment} from "react";
import {Button, Drawer} from "@blueprintjs/core";
import {Card, CardList, TextArea, ControlGroup} from "@blueprintjs/core";

import {useStateAndRef, useCallbackStack} from "./utilities_react";
import {postAjax, postPromise} from "./communication_react";
import {ThemeContext} from "./theme";
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
        const [item_list, set_item_list, item_list_ref] = useStateAndRef([]);
        const [stream_text, set_stream_text, stream_text_ref] = useStateAndRef("");
        const [assistant_id, set_assistant_id, assistant_id_ref] = useStateAndRef(null);
        const [chat_status, set_chat_status, chat_status_ref] = useStateAndRef(window.has_openapi_key ? "idle" : null);

        useEffect(()=>{
            if (window.has_openapi_key) {
                postPromise("host", "StartAssistant", {main_id: window.main_id, user_id: window.user_id})
                    .then((response) => {
                        set_assistant_id(response.assistant_id)
                    });

                function sendRemove() {
                    if (assistant_id_ref.current) {
                        navigator.sendBeacon("/delete_container_on_unload",
                            JSON.stringify({"container_id": assistant_id_ref.current, "notify": false}));
                    }
                }

                window.addEventListener("unload", sendRemove);
            }
            return (() => {
                sendRemove();
                window.removeEventListener("unload", sendRemove)
            })
        }, []);

        function delete_my_container() {
            if (assistant_id_ref.current) {
                postAjax("/delete_container_on_unload", {"container_id": assistant_id_ref.current, "notify": false});
                assistant_id_ref.current = null
            }
        }

        function _close(data) {
            if (data == null || !("main_id" in data) || (data.main_id == window.main_id)) {
                set_show_drawer(false)
            }
        }

        function _open(data) {
            if (data == null || !("main_id" in data) || (data.main_id == window.main_id)) {
                set_show_drawer(true)
            }
        }

        function _toggle(data) {
            if (data == null || !("main_id" in data) || (data.main_id == window.main_id)) {
                set_show_drawer(!show_drawer)
            }
        }

        function _postAjaxFailure(qXHR, textStatus, errorThrown) {
            _addEntry({
                title: "Post Ajax Failure: {}".format(textStatus),
                content: errorThrown
            })
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
        return (
            <AssistantContext.Provider value={assistantDrawerFuncs}>
                <Fragment>
                    {window.has_openapi_key &&
                            <Fragment>
                                <WrappedComponent {...props}/>
                                <AssistantDrawer show_drawer={show_drawer}
                                                 position={lposition}
                                                 tsocket={props.tsocket}
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

    const theme = useContext(ThemeContext);

    return (
        <Drawer
            icon="chat"
            className={theme.dark_theme ? "bp5-dark" : "light-theme"}
            title={props.title}
            isOpen={props.show_drawer}
            position={props.position}
            canOutsideClickClose={true}
            onClose={props.onClose}
            enforceFocus={true}
            hasBackdrop={false}
            size={props.size}
            >
            <ChatModule tsocket={props.tsocket}/>
        </Drawer>
    )
}

AssistantDrawer = memo(AssistantDrawer);

const input_style = {position: "relative", bottom: 0, margin: 10};
const idle_statuses = ["completed", "expired", "cancelled", "failed"];
const BOTTOM_MARGIN = 25;
function ChatModule(props) {
    const top_ref = React.createRef();
    const control_ref = React.createRef();
    const list_ref = React.createRef();
    const stream_dict_ref = React.createRef();

    const [prompt_value, set_prompt_value, prompt_value_ref] = useStateAndRef("");
    const [response_counter, set_response_counter, response_counter_ref] = useStateAndRef(0);
    const [usable_height, set_usable_height] = useState(() => {
        return window.innerHeight - 40 - BOTTOM_MARGIN
    });

    const assistantDrawerFuncs = useContext(AssistantContext);

    const pushCallback = useCallbackStack();

    useEffect(() => {
        initSocket();
        stream_dict_ref.current = {};
        window.addEventListener("resize", _update_window_dimensions);
        _update_window_dimensions();
        return (() => {
            window.removeEventListener("resize", _update_window_dimensions);
        })
    }, []);

    useEffect(() => {
        if (list_ref && list_ref.current) {
            list_ref.current.scrollTo(0, list_ref.current.scrollHeight)
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
            uheight = window.innerHeight - top_rect.top - BOTTOM_MARGIN
        } else {
            uheight = window.innerHeight - 40 - BOTTOM_MARGIN
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
            set_response_counter(response_counter_ref.current + 1)
        })
    }

    function _handleChatEnd(stream_text) {
        stream_dict_ref.current = {};
        stream_text = formatLatexEquations(stream_text);
        let converted_markdown = mdi.render(stream_text);
        const new_item_list = [...assistantDrawerFuncs.item_list_ref.current, {kind: "response", text: converted_markdown}];
        assistantDrawerFuncs.set_item_list(new_item_list);
        assistantDrawerFuncs.set_chat_status("idle");
    }

    function _handleChatStatus(data) {
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
            await postPromise(assistantDrawerFuncs.assistant_id_ref.current, "cancel_run_task", {})
        } catch (error) {
            console.log(error.message)
        }
    }

    async function _promptSubmit(event) {
        try {
            const new_item_list = [...assistantDrawerFuncs.item_list_ref.current, {kind: "prompt", text: prompt_value_ref.current}];
            assistantDrawerFuncs.set_item_list(new_item_list);
            set_prompt_value("");
            assistantDrawerFuncs.set_chat_status("posted");
            await postPromise(assistantDrawerFuncs.assistant_id_ref.current, "post_prompt_stream", {prompt: prompt_value_ref.current});
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

    let items = assistantDrawerFuncs.item_list_ref.current.map((item, index) => {
        if (item.kind == "prompt") {
            return <Prompt key={index} {...item}/>
        } else {
            return <Response key={index} {...item}/>
        }
    });
    if (assistantDrawerFuncs.chat_status_ref.current != "idle"){
        items.push(<ResponseInProgress key="response-in-progress"
                                       stream_text={assistantDrawerFuncs.stream_text_ref.current}/>)
    }
    let card_list_height = usable_height - 30;
    if (control_ref.current) {
        card_list_height = usable_height - control_ref.current.clientHeight
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

    return (
        <div className="chat-module" ref={top_ref} style={chat_pane_style} >
            <CardList ref={list_ref} bordered={false} style={{height: card_list_height}}>
                {items}
            </CardList>
            <ControlGroup ref={control_ref}
                          vertical={false}
                          style={input_style}>
                <Button icon={assistantDrawerFuncs.chat_status_ref.current == "idle" ? "send-message" : "stop"}
                        minimal={true}
                        large={true}
                        onClick={_handleButton}/>
                <TextArea type="text"
                          autoResize={true}
                          style={{width: "100%"}}
                          onChange={_onInputChange}
                          large={true}
                          fill={true}
                          onKeyDown={handleKeyDown}
                          value={prompt_value_ref.current}
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
                <div className="chat-response"
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
                <div style={{height: 100}} className="chat-response bp5-skeleton"
                     dangerouslySetInnerHTML={converted_dict}/>
            </div>
        </Card>
    )
}

ResponseInProgress = memo(ResponseInProgress);