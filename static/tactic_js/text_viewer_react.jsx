if (!window.in_context) {
    import("../tactic_css/tactic.scss");
    import ("../tactic_css/themeable.scss");
}

import React from "react";
import {Fragment, useState, useEffect, useRef, memo, useMemo, useContext} from "react";
import { createRoot } from 'react-dom/client';

import {TextArea} from "@blueprintjs/core";
import { useHotkeys } from "@blueprintjs/core";

import {ResourceViewerApp, copyToLibrary} from "./resource_viewer_react_app";
import {TacticSocket} from "./tactic_socket";
import {handleCallback, postPromise, postWithCallback} from "./communication_react"
import {withStatus} from "./toaster.js"

import {ErrorDrawerContext, withErrorDrawer} from "./error_drawer.js";
import {guid} from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";
import {useCallbackStack, useStateAndRef, withRegisterActivity} from "./utilities_react";
import {SettingsContext, withSettings} from "./settings"
import {DialogContext, withDialogs} from "./modal_react";
import {StatusContext} from "./toaster";
import {SelectedPaneContext} from "./utilities_react";
import {ICON_BAR_WIDTH} from "./sizing_tools";

export {text_viewer_props, TextViewerApp}

function text_viewer_props(data, registerDirtyMethod, finalCallback) {

    if (!window.in_context) {
        window.global_id = data.local_id;
    }

    finalCallback({
        local_id: data.local_id,
        tsocket: data.tsocket,
        file_path: data.file_path,
        resource_name: data.resource_name,
        readOnly: data.read_only,
        is_repository: data.is_repository,
        registerDirtyMethod: registerDirtyMethod,
        size: data.size
    })
}

function TextEditor(props) {
    const top_ref = useRef(null);

    let tastyle = {
        resize: "horizontal",
        height: "100%"
    };
    return (
        <div id="textarea-container"
             ref={top_ref}
             style={{height: "100%", position: "relative"}}>
            <TextArea
                cols="150"
                style={tastyle}
                disabled={props.readOnly}
                onChange={props.handleChange}
                value={props.the_content}
            />
        </div>
    )

}

TextEditor = memo(TextEditor);

function TextViewerApp(props) {
    props = {
        controlled: false,
        changeResourceName: null,
        updatePanel: null,
        refreshTab: null,
        closeTab: null,
        ...props
    };
    const top_ref = useRef(null);

    const savedContent = useRef(props.the_content);

    const [text_content, set_text_content, text_content_ref] = useStateAndRef(props.the_content);

    const [resource_name, set_resource_name] = useState(props.resource_name);

    const [created, set_created] = useState(null);
    const [updated, set_updated] = useState(null);

    const settingsContext = useContext(SettingsContext);
    const dialogFuncs = useContext(DialogContext);
    const statusFuncs = useContext(StatusContext);
    const selectedPane = useContext(SelectedPaneContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);

    useEffect(() => {
        statusFuncs.stopSpinner();
        if (props.controlled) {
            props.registerDirtyMethod(_dirty)
        }
    }, []);

    const hotkeys = useMemo(
        () => [
            {
                combo: "Ctrl+S",
                global: false,
                group: "Text Viewer",
                label: "Save Text",
                onKeyDown: _saveMe
            },
        ],
        [_saveMe],
    );
    const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys);

    const pushCallback = useCallbackStack("code_viewer");

    useEffect(() => {
        if (!props.controlled) {
            window.addEventListener("beforeunload", function (e) {
                if (_dirty()) {
                    e.preventDefault();
                    e.returnValue = ''
                }
                postWithCallback("host", "end_client_session_task", {global_id: window.global_id, force_forward: true})
                props.tsocket.disconnect()
            })
        }
        statusFuncs.setStatus({show_spinner: true, status_message: "Reading text file ..."});
        postPromise("host", "get_text_from_pool_task", {"file_path": props.file_path})
            .then(data => {
                const the_content = data["the_content"];
                set_text_content(the_content);
                set_created(data.created);
                set_updated(data.updated);
                savedContent.current = the_content;
                statusFuncs.clearStatus();

            })
            .catch(()=>{
                errorDrawerFuncs.addFromError("Error reading text file", e);
                statusFuncs.clearStatus()
            })
    }, []);

    function cPropGetters() {
        return {
            resource_name: resource_name
        }
    }

    function _cProp(pname) {
        return props.controlled ? props[pname] : cPropGetters()[pname]
    }

    function menu_specs() {
        let ms;
        if (props.is_repository) {
            ms = {
                Transfer: [{
                    "name_text": "Copy to library", "icon_name": "import",
                    "click_handler": async () => {
                        await copyToLibrary("list", _cProp("resource_name"), dialogFuncs, statusFuncs, errorDrawerFuncs)
                    }, tooltip: "Copy to library"
                }]
            }
        } else {
            ms = {
                Save: [
                    {
                        name_text: "Save",
                        icon_name: "saved",
                        click_handler: _saveMe,
                        key_bindings: ['Ctrl-S'],
                        tooltip: "Save"
                    }
                ],
            }
        }
        for (const [, menu] of Object.entries(ms)) {
            for (let but of menu) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return ms
    }

    function _setResourceNameState(new_name, callback = null) {
        if (props.controlled) {
            props.changeResourceName(new_name, callback)
        } else {
            set_resource_name(new_name);
            pushCallback(callback);
        }
    }

    function _handleTextChange(event) {
        set_text_content(event.target.value);
    }

    function am_selected() {
        return selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef)
    }

    async function _saveMe() {
        if (!am_selected()) {
            return false
        }
        const result_dict = {
            file_path: props.file_path,
            the_content: text_content_ref.current
        };

        try {
            let data = await postPromise("host", "save_text_file_task", result_dict);
            if (data.success) {
                statusFuncs.statusMessage(`Saved text file ${props.resource_name}`)
            }
            else {
                  errorDrawerFuncs.addErrorDrawerEntry({
                    title: `Error saving text file`,
                    content: "message" in data ? data.message : ""
                });
            }
        }
        catch(e) {
            errorDrawerFuncs.addFromError(`Error saving text file`, e)
        }
    }

    function _dirty() {
        return text_content_ref.current != savedContent.current
    }

    let my_props = {...props};
    let outer_style = {
        width: `calc(100% - ${ICON_BAR_WIDTH}px)`,
        height: "100%",
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 0,
        position: "relative"
    };
    let outer_class = "resource-viewer-holder";
    if (!props.controlled) {
        my_props.resource_name = resource_name;
        outer_class = `${outer_class} pane-holder ${settingsContext.isDark() ? "bp6-dark" : "light-theme"}`
    }
    return (
        <Fragment>
            {!props.controlled &&
                <TacticNavbar is_authenticated={window.is_authenticated}
                              selected={null}
                              show_api_links={true}
                              user_name={window.username}/>
            }
            <div className={outer_class} ref={top_ref} style={outer_style}
                tabIndex="0" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} >
                <ResourceViewerApp {...my_props}
                                   local_id={props.local_id}
                                   padTop={true}
                                   setResourceNameState={_setResourceNameState}
                                   refreshTab={props.refreshTab}
                                   closeTab={props.closeTab}
                                   res_type="list"
                                   resource_name={my_props.resource_name}
                                   menu_specs={menu_specs()}
                                   created={created}
                                   showErrorDrawerButton={false}
                                   additional_metadata={{
                                       path: props.file_path,
                                       size: `${props.size} bytes`
                                  }}
                                   saveMe={_saveMe}>
                    <TextEditor the_content={text_content}
                                readOnly={props.readOnly}
                                handleChange={_handleTextChange}
                    />
                </ResourceViewerApp>
            </div>
        </Fragment>
    )
}

TextViewerApp = memo(TextViewerApp);

async function text_viewer_main() {
    let local_id = "a" + guid();
    function gotProps(the_props) {
        let TextViewerAppPlus = withRegisterActivity(withSettings(withDialogs(withErrorDrawer(withStatus(TextViewerApp)))));
        let the_element = <TextViewerAppPlus {...the_props}
                                             controlled={false}
                                             changeName={null}
        />;
        const domContainer = document.querySelector('#root');
        const root = createRoot(domContainer);
        root.render(the_element)
    }

    let tsocket = new TacticSocket("main", 5000, "list_viewer", local_id, async () => {
        tsocket.attachListener('handle-callback', (task_packet) => {
            handleCallback(task_packet, local_id)
        });
        let data = {resource_name: resource_name, res_type: "list", local_id, tsocket};
        data.read_only = window.read_only;
        data.is_repository = window.is_repository;
        text_viewer_props(data, null, gotProps);
    })
}

if (!window.in_context) {
    text_viewer_main().then();
}