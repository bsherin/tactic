
import "../tactic_css/tactic.scss";

import React from "react";
import {Fragment, useState, useEffect, useRef, memo, useMemo, useContext} from "react";
import { createRoot } from 'react-dom/client';
import PropTypes from 'prop-types';

import {TextArea} from "@blueprintjs/core";
import { useHotkeys } from "@blueprintjs/core";

import {ResourceViewerApp, copyToLibrary, sendToRepository} from "./resource_viewer_react_app";
import {TacticSocket} from "./tactic_socket";
import {postAjaxPromise, postPromise} from "./communication_react"
import {withStatus} from "./toaster.js"
import {withAssistant} from "./assistant";

import {withSettings} from "./settings"
import {ErrorDrawerContext, withErrorDrawer} from "./error_drawer.js";
import {guid} from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";
import {useCallbackStack, useConstructor, useStateAndRef} from "./utilities_react";
import {SettingsContext} from "./settings"
import {DialogContext, withDialogs} from "./modal_react";
import {StatusContext} from "./toaster";
import {SelectedPaneContext} from "./utilities_react";
import {ICON_BAR_WIDTH} from "./sizing_tools";

export {list_viewer_props, ListViewerApp}


function list_viewer_props(data, registerDirtyMethod, finalCallback) {

    let resource_viewer_id = guid();
    if (!window.in_context) {
        window.main_id = resource_viewer_id;
    }
    let tsocket = new TacticSocket("main", 5000, "list_viewer", resource_viewer_id);


    finalCallback({
        resource_viewer_id: resource_viewer_id,
        main_id: resource_viewer_id,
        tsocket: tsocket,
        split_tags: data.mdata.tags == "" ? [] : data.mdata.tags.split(" "),
        created: data.mdata["datestring"],
        resource_name: data.resource_name,
        the_content: data.the_content,
        notes: data.mdata.notes,
        readOnly: data["read_only"],
        is_repository: data.is_repository,
        registerDirtyMethod: registerDirtyMethod,
    })
}

const LIST_PADDING_TOP = 20;

function ListEditor(props) {
    const top_ref = useRef(null);

    let tastyle = {
        resize: "horizontal",
        margin: 2,
        flexGrow: 1
    };
    return (
        <div id="listarea-container"
             ref={top_ref}
             style={{display: "flex", margin: 2, paddingTop: LIST_PADDING_TOP}}>
            <TextArea
                cols="50"
                style={tastyle}
                disabled={props.readOnly}
                onChange={props.handleChange}
                value={props.the_content}
            />
        </div>
    )

}

ListEditor = memo(ListEditor);

ListEditor.propTypes = {
    the_content: PropTypes.string,
    handleChange: PropTypes.func,
    readOnly: PropTypes.bool,
    height: PropTypes.number
};

function ListViewerApp(props) {
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

    const [list_content, set_list_content, list_content_ref] = useStateAndRef(props.the_content);

    const [resource_name, set_resource_name] = useState(props.resource_name);

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

    const pushCallback = useCallbackStack("code_viewer");

        const hotkeys = useMemo(
        () => [
            {
                combo: "Ctrl+S",
                global: false,
                group: "Module Viewer",
                label: "Save Code",
                onKeyDown: _saveMe
            },
        ],
        [_saveMe],
    );
    const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys);

    useConstructor(() => {
        if (!props.controlled) {
            window.addEventListener("beforeunload", function (e) {
                if (_dirty()) {
                    e.preventDefault();
                }
            })
        }
    });

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
                        key_bindings: ['Ctrl+S'],
                        tooltip: "Save"
                    },
                    {
                        name_text: "Save As...",
                        icon_name: "floppy-disk",
                        click_handler: _saveMeAs,
                        tooltip: "Save as"
                    },
                ],
                Transfer: [
                    {
                        name_text: "Share",
                        icon_name: "share",
                        click_handler: async () => {
                            await sendToRepository("list", _cProp("resource_name"), dialogFuncs, statusFuncs, errorDrawerFuncs)
                        },
                        tooltip: "Share to repository"
                    },
                ]

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

    function _handleListChange(event) {
        set_list_content(event.target.value);
    }

    function am_selected() {
        return selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef)
    }

    async function _saveMe() {
        if (!am_selected()) {
            return false
        }
        const new_list_as_string = list_content_ref.current;
        const result_dict = {
            "list_name": _cProp("resource_name"),
            "new_list_as_string": new_list_as_string,
        };

        try {
            await postAjaxPromise("update_list", result_dict);
            savedContent.current = new_list_as_string;
            statusFuncs.statusMessage(`Saved list ${result_dict.list_name}`)
        }
        catch(e) {
            errorDrawerFuncs.addErrorDrawerEntry({
                title: `Error creating new notebook`,
                content: "message" in data ? data.message : ""
            });
        }
    }

    async function _saveMeAs() {
        if (!am_selected()) {
            return false
        }
        try {
            let ln_result = await postPromise("host", "get_list_names", {"user_id": window.user_id}, props.main_id);
            let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                title: "Save List As",
                field_title: "New List Name",
                default_value: "NewList",
                existing_names: ln_result["list_names"],
                checkboxes: [],
                handleClose: dialogFuncs.hideModal,
                });
            const result_dict = {
                "new_res_name": new_name,
                "res_to_copy": _cProp("resource_name")
            };
            await postAjaxPromise('/create_duplicate_list', result_dict);
            _setResourceNameState(new_name, () => {
                _saveMe();
            })
        }
        catch(e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError(`Error saving listy`, e);
            }
        }
    }

    function _dirty() {
        return !(list_content_ref.current == savedContent.current)
    }

    let my_props = {...props};
    let outer_style = {
        width: `calc(100% - ${ICON_BAR_WIDTH}px)`,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 0,
        position: "relative"
    };
    let outer_class = "resource-viewer-holder";
    if (!props.controlled) {
        my_props.resource_name = resource_name;
        if (settingsContext.isDark()) {
            outer_class = outer_class + " bp6-dark";
        } else {
            outer_class = outer_class + " light-theme"
        }
    }
    return (
        <Fragment>
            {!props.controlled &&
                <TacticNavbar is_authenticated={window.is_authenticated}
                              selected={null}
                              show_api_links={true}
                              page_id={props.resource_viewer_id}
                              user_name={window.username}/>
            }
            <div className={outer_class} ref={top_ref} style={outer_style}
                tabIndex="0" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} >
                <ResourceViewerApp {...my_props}
                                   resource_viewer_id={props.resource_viewer_id}
                                   setResourceNameState={_setResourceNameState}
                                   refreshTab={props.refreshTab}
                                   closeTab={props.closeTab}
                                   res_type="list"
                                   resource_name={my_props.resource_name}
                                   menu_specs={menu_specs()}
                                   created={props.created}
                                   showErrorDrawerButton={false}
                                   saveMe={_saveMe}>
                    <ListEditor the_content={list_content}
                                readOnly={props.readOnly}
                                handleChange={_handleListChange}
                    />
                </ResourceViewerApp>
            </div>
        </Fragment>
    )
}

ListViewerApp = memo(ListViewerApp);

async function list_viewer_main() {

    function gotProps(the_props) {
        let ListViewerAppPlus = withSettings(withDialogs(withErrorDrawer(withStatus(withAssistant(ListViewerApp)))));
        let the_element = <ListViewerAppPlus {...the_props}
                                             controlled={false}
                                             changeName={null}
        />;
        const domContainer = document.querySelector('#root');
        const root = createRoot(domContainer);
        root.render(
                <div style={{display: "flex", flexDirection: "column",
                                position: "relative",
                                height: "100%",
                                width: "100%"}}>
                {the_element}
            </div>
        )
    }

    let target = window.is_repository ? "repository_view_list_in_context" : "view_list_in_context";
    let data = await postAjaxPromise(target, {"resource_name": window.resource_name});
    list_viewer_props(data, null, gotProps);
}

if (!window.in_context) {
    list_viewer_main().then();
}