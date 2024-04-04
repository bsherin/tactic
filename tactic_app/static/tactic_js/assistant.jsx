
import React from "react";
import markdownIt from 'markdown-it'
import 'markdown-it-latex/dist/index.css'
import markdownItLatex from 'markdown-it-latex'

const mdi = markdownIt({html: true});
mdi.use(markdownItLatex);

import {useEffect, memo} from "react";
import {Button} from "@blueprintjs/core";
import {Card, CardList, TextArea, ControlGroup} from "@blueprintjs/core";

import {useConnection, useStateAndRef} from "./utilities_react";
import {useSize} from "./sizing_tools";
import {postPromise} from "./communication_react";

export {ChatModule};

const chat_input_style = {position: "relative", bottom: 0, margin: 10, width: "100%"};
const idle_statuses = ["completed", "expired", "cancelled", "failed"];
function ChatModule(props) {
    const top_ref = React.createRef();
    const control_ref = React.createRef();
    const list_ref = React.createRef();
    const [item_list, set_item_list, item_list_ref] = useStateAndRef([]);
    const [prompt_value, set_prompt_value, prompt_value_ref] = useStateAndRef("");
    const [chat_status, set_chat_status, chat_status_ref] = useStateAndRef("idle");

    const [usable_width, usable_height, topX, topY] = useSize(top_ref, props.tabSelectCounter, "ChatModule");
    const connection_status = useConnection(props.tsocket, initSocket);

    useEffect(() => {
        if (list_ref && list_ref.current) {
            list_ref.current.scrollTo(0, list_ref.current.scrollHeight)
        }
    });

    function initSocket() {
        props.tsocket.attachListener("chat_response", _handleChatResponse);
        props.tsocket.attachListener("chat_status", _handleChatStatus)
    }

    function _onInputChange(event) {
        set_prompt_value(event.target.value);
    }

    function _handleChatResponse(data) {
        let converted_markdown = mdi.render(data.response);
        const new_item_list = [...item_list_ref.current, {kind: "response", text: converted_markdown}];
        set_item_list(new_item_list);
        set_chat_status("idle")
    }

    function _handleChatStatus(data) {
        if (idle_statuses.includes(data.status)) {
            set_chat_status("idle")
        }
        else {
            set_chat_status(data.status)
        }
    }

    async function _handleButton(event) {
        event.preventDefault();
        if (chat_status_ref.current == "idle") {
            await _promptSubmit()
        }
        else {
            await _cancelPrompt()
        }
    }

    async function _cancelPrompt() {
        try {
            await postPromise(props.module_viewer_id, "cancel_run_task", {})
        } catch (error) {
            console.log(error.message)
        }
    }

    async function _promptSubmit(event) {
        try {
            const new_item_list = [...item_list_ref.current, {kind: "prompt", text: prompt_value_ref.current}];
            set_item_list(new_item_list);
            set_prompt_value("");
            set_chat_status("posted");
            await postPromise(props.module_viewer_id, "post_prompt", {prompt: prompt_value_ref.current});
        } catch (error) {
            console.log(error.message)
        }
    }

    let items = item_list.map((item, index) => {
        if (item.kind == "prompt") {
            return <Prompt key={index} {...item}/>
        } else {
            return <Response key={index} {...item}/>
        }
    });
    let card_list_height = usable_height - 30;
    if (control_ref.current) {
        card_list_height = usable_height - 20 - control_ref.current.clientHeight
    }
    const chat_pane_style = {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        paddingTop: 10,
        width: usable_width - 20,
        height: usable_height,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
    };
    const chat_input_style = {
        position: "relative",
        bottom: 0,
        margin: 10,
        width: usable_width - 20,
        marginLeft: 0
    };

    return (
        <div className="chat-module" ref={top_ref} style={chat_pane_style} >
            <CardList ref={list_ref} bordered={false} style={{height: card_list_height}}>
                {items}
            </CardList>
            <ControlGroup ref={control_ref} vertical={false} style={chat_input_style}>
                <Button icon={chat_status_ref.current == "idle" ? "send-message" : "stop"}
                        minimal={true}
                        large={true}
                        onClick={_handleButton}/>
                <TextArea type="text"
                          autoResize={true}
                          style={{width: "100%"}}
                          onChange={_onInputChange}
                          large={true}
                          fill={true}
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