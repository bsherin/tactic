
import "../tactic_css/tactic.scss";

import React from "react";
import {Fragment, useState, useEffect, useRef, memo, useContext} from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import {TextArea} from "@blueprintjs/core";

import {ResourceViewerApp, copyToLibrary} from "./resource_viewer_react_app";
import {TacticSocket} from "./tactic_socket";
import {postAjaxPromise} from "./communication_react"
import {withStatus} from "./toaster.js"

import {withTheme} from "./theme"
import {ErrorDrawerContext, withErrorDrawer} from "./error_drawer.js";
import {guid} from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";
import {useCallbackStack, useConstructor, useStateAndRef} from "./utilities_react";
import {ThemeContext,} from "./theme"
import {DialogContext, withDialogs} from "./modal_react";
import {StatusContext} from "./toaster";
import {SelectedPaneContext} from "./utilities_react";
import {SizeContext, useSize, withSizeContext} from "./sizing_tools";

export {text_viewer_props, TextViewerApp}

function text_viewer_props(data, registerDirtyMethod, finalCallback) {

    let resource_viewer_id = guid();
    var tsocket = new TacticSocket("main", 5000, "text_viewer", resource_viewer_id);


    finalCallback({
        resource_viewer_id: resource_viewer_id,
        main_id: resource_viewer_id,
        tsocket: tsocket,
        split_tags: [],
        file_path: data.file_path,
        resource_name: data.resource_name,
        the_content: data.the_content,
        notes: null,
        readOnly: data.read_only,
        is_repository: data.is_repository,
        meta_outer: "#right-div",
        registerDirtyMethod: registerDirtyMethod,
        created: data.created,
        updated: data.updated,
        size: data.size
    })
}

const LIST_PADDING_TOP = 20;

function TextEditor(props) {
    const top_ref = useRef(null);
    const [usable_width, usable_height, topX, topY] = useSize(top_ref, 0, "TextEditor");

    let tastyle = {
        resize: "horizontal",
        margin: 2,
        height: usable_height - LIST_PADDING_TOP - 4
    };
    return (
        <div id="textarea-container"
             ref={top_ref}
             style={{margin: 2, paddingTop: LIST_PADDING_TOP}}>
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

TextEditor.propTypes = {
    the_content: PropTypes.string,
    handleChange: PropTypes.func,
    readOnly: PropTypes.bool,
    height: PropTypes.number
};

function TextViewerApp(props) {
    const top_ref = useRef(null);
    const search_ref = useRef(null);

    const savedContent = useRef(props.the_content);
    const savedTags = useRef(props.split_tags);
    const savedNotes = useRef(props.notes);

    const [text_content, set_text_content, text_content_ref] = useStateAndRef(props.the_content);
    const [notes, set_notes, notes_ref] = useStateAndRef(props.notes);
    const [tags, set_tags, tags_ref] = useStateAndRef(props.split_tags);

    const [usable_width, usable_height, topX, topY] = useSize(top_ref, 0, "TextViewer");

    const [resource_name, set_resource_name] = useState(props.resource_name);

    const theme = useContext(ThemeContext);
    const dialogFuncs = useContext(DialogContext);
    const statusFuncs = useContext(StatusContext);
    const selectedPane = useContext(SelectedPaneContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);
    const sizeInfo = useContext(SizeContext);

    useEffect(() => {
        statusFuncs.stopSpinner();
        if (props.controlled) {
            props.registerDirtyMethod(_dirty)
        }
    }, []);

    const pushCallback = useCallbackStack("code_viewer");

    useConstructor(() => {
        if (!props.controlled) {
            window.addEventListener("beforeunload", function (e) {
                if (_dirty()) {
                    e.preventDefault();
                    e.returnValue = ''
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
                        key_bindings: ['ctrl+s'],
                        tooltip: "Save"
                    },
                    // {
                    //     name_text: "Save As...",
                    //     icon_name: "floppy-disk",
                    //     click_handler: _saveMeAs,
                    //     tooltip: "Save as"
                    // },
                ],
            }
        }
        for (const [menu_name, menu] of Object.entries(ms)) {
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

    function _handleMetadataChange(state_stuff) {
        for (let field in state_stuff) {
            switch (field) {
                case "tags":
                    set_tags(state_stuff[field]);
                    break;
                case "notes":
                    set_notes(state_stuff[field]);
                    break;
            }
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
            let data = await postAjaxPromise("save_text_file", result_dict);
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

    async function _saveMeAs(e) {
        if (!am_selected()) {
            return false
        }
        try {
            // let ln_result = await postPromise("host", "get_list_names", {"user_id": window.user_id}, props.main_id);
            let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                title: "Save File As",
                field_title: "New File Name",
                default_value: "NewList",
                existing_names: ln_result.list_names,
                checkboxes: [],
                handleClose: dialogFuncs.hideModal,
                });
            const result_dict = {
                "new_res_name": new_name,
                "res_to_copy": _cProp("resource_name")
            };
            let data = await postAjaxPromise('/create_duplicate_list', result_dict);
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
        return !((text_content_ref.current == savedContent.current) &&
            (tags_ref.current == savedTags.current) && (notes_ref.current == savedNotes.current))
    }

    let my_props = {...props};
    let outer_style = {
        width: "100%",
        height: sizeInfo.availableHeight,
        paddingLeft: 0,
        position: "relative"
    };
    let outer_class = "resource-viewer-holder";
    if (!props.controlled) {
        my_props.resource_name = resource_name;
        if (theme.dark_theme) {
            outer_class = outer_class + " bp5-dark";
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
            <div className={outer_class} ref={top_ref} style={outer_style}>
                <ResourceViewerApp {...my_props}
                                   resource_viewer_id={props.resource_viewer_id}
                                   setResourceNameState={_setResourceNameState}
                                   refreshTab={props.refreshTab}
                                   closeTab={props.closeTab}
                                   res_type="list"
                                   resource_name={my_props.resource_name}
                                   menu_specs={menu_specs()}
                                   handleStateChange={_handleMetadataChange}
                                   created={props.created}
                                   meta_outer={props.meta_outer}
                                   notes={null}
                                   tags={null}
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

TextViewerApp.propTypes = {
    controlled: PropTypes.bool,
    changeResourceName: PropTypes.func,
    updatePanel: PropTypes.func,
    refreshTab: PropTypes.func,
    closeTab: PropTypes.func,
    the_content: PropTypes.string,
    created: PropTypes.string,
    tags: PropTypes.array,
    notes: PropTypes.string,
    readOnly: PropTypes.bool,
    is_repository: PropTypes.bool,
    meta_outer: PropTypes.string,
    tsocket: PropTypes.object,
    usable_height: PropTypes.number,
    usable_width: PropTypes.number
};

TextViewerApp.defaultProps = {
    controlled: false,
    changeResourceName: null,
    updatePanel: null,
    refreshTab: null,
    closeTab: null,
};

async function text_viewer_main() {
    function gotProps(the_props) {
        let TextViewerAppPlus = withSizeContext(withTheme(withDialogs(withErrorDrawer(withStatus(TextViewerApp)))));
        let the_element = <TextViewerAppPlus {...the_props}
                                             controlled={false}
                                             initial_theme={window.theme}
                                             changeName={null}
        />;
        let domContainer = document.querySelector('#root');
        ReactDOM.render(the_element, domContainer)
    }

    let target = window.is_repository ? "repository_view_list_in_context" : "view_list_in_context";
    let data = await postAjaxPromise(target, {"resource_name": window.resource_name});
    text_viewer_props(data, null, gotProps);
}

if (!window.in_context) {
    list_viewer_main().then();
}