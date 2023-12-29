
import "../tactic_css/tactic.scss";

import React from "react";
import {Fragment, useState, useEffect, useRef, memo, useContext} from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import {TextArea} from "@blueprintjs/core";

import {ResourceViewerApp, copyToLibrary, sendToRepository} from "./resource_viewer_react_app";
import {TacticSocket} from "./tactic_socket";
import {postAjaxPromise, postPromise} from "./communication_react"
import {withStatus} from "./toaster"

import {getUsableDimensions, BOTTOM_MARGIN} from "./sizing_tools";
import {ErrorDrawerContext, withErrorDrawer} from "./error_drawer";
import {guid} from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";
import {useCallbackStack, useConstructor, useStateAndRef} from "./utilities_react";
import {ThemeContext, withTheme} from "./theme"
import {DialogContext, withDialogs} from "./modal_react";
import {StatusContext} from "./toaster";
import {SelectedPaneContext} from "./utilities_react";

export {list_viewer_props, ListViewerApp}


function list_viewer_props(data, registerDirtyMethod, finalCallback) {

    let resource_viewer_id = guid();
    var tsocket = new TacticSocket("main", 5000, "list_viewer", resource_viewer_id);


    finalCallback({
        resource_viewer_id: resource_viewer_id,
        main_id: resource_viewer_id,
        tsocket: tsocket,
        split_tags: data.mdata.tags == "" ? [] : data.mdata.tags.split(" "),
        created: data.mdata.datestring,
        resource_name: data.resource_name,
        the_content: data.the_content,
        notes: data.mdata.notes,
        readOnly: data.read_only,
        is_repository: data.is_repository,
        meta_outer: "#right-div",
        registerDirtyMethod: registerDirtyMethod,
    })
}

const LIST_PADDING_TOP = 15;

function ListEditor(props) {
    let tastyle = {
        resize: "horizontal",
        margin: 2,
        height: props.height - LIST_PADDING_TOP,
    };
    return (
        <div id="listarea-container"
             ref={props.outer_ref}
             style={{margin: 0, paddingTop: LIST_PADDING_TOP}}>
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
    outer_ref: PropTypes.object,
    height: PropTypes.number
};

function ListViewerApp(props) {
    const top_ref = useRef(null);
    const cc_ref = useRef(null);
    const search_ref = useRef(null);
    const cc_offset_top = useRef(null);

    const savedContent = useRef(props.the_content);
    const savedTags = useRef(props.split_tags);
    const savedNotes = useRef(props.notes);

    const [list_content, set_list_content, list_content_ref] = useStateAndRef(props.the_content);
    const [notes, set_notes, notes_ref] = useStateAndRef(props.notes);
    const [tags, set_tags, tags_ref] = useStateAndRef(props.split_tags);

    // The following only are used if not in context
    const [usable_width, set_usable_width] = useState(() => {
        return getUsableDimensions(true).usable_width - 170
    });
    const [usable_height, set_usable_height] = useState(() => {
        return getUsableDimensions(true).usable_height_no_bottom
    });

    const [resource_name, set_resource_name] = useState(props.resource_name);

    const theme = useContext(ThemeContext);
    const dialogFuncs = useContext(DialogContext);
    const statusFuncs = useContext(StatusContext);
    const selectedPane = useContext(SelectedPaneContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);


    useEffect(() => {
        statusFuncs.stopSpinner();
        if (cc_ref && cc_ref.current) {
            cc_offset_top.current = cc_ref.current.offsetTop;
        }
        if (!props.controlled) {
            window.addEventListener("resize", _update_window_dimensions);
            _update_window_dimensions();
        } else {
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
            usable_width: usable_width,
            usable_height: usable_height,
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

    function _handleListChange(event) {
        set_list_content(event.target.value);
    }

    function _update_window_dimensions() {
        set_usable_width(window.innerWidth - top_ref.current.offsetLeft);
        set_usable_height(window.innerHeight - top_ref.current.offsetTop)
    }

    function get_new_cc_height() {
        let uheight = _cProp("usable_height");
        if (cc_offset_top.current) {
            return uheight - cc_offset_top.current - BOTTOM_MARGIN
        } else if (cc_ref && cc_ref.current) {  // This will be true after the initial render
            return uheight - cc_ref.current.offsetTop - BOTTOM_MARGIN
        } else {
            return uheight - 100
        }
    }

    function am_selected() {
        return selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef)
    }

    async function _saveMe() {
        if (!am_selected()) {
            return false
        }
        const new_list_as_string = list_content;
        const tagstring = tags.join(" ");
        const local_notes = notes;
        const local_tags = tags;  // In case it's modified wile saving
        const result_dict = {
            "list_name": _cProp("resource_name"),
            "new_list_as_string": new_list_as_string,
            "tags": tagstring,
            "notes": notes
        };

        try {
            let data = await postAjaxPromise("update_list", result_dict, update_success);
            savedContent.current = new_list_as_string;
            savedTags.current = local_tags;
            savedNotes.current = local_notes;
            statusFuncs.statusMessage(`Saved list ${result_dict.list_name}`)
        }
        catch(e) {
            errorDrawerFuncs.addErrorDrawerEntry({
                title: `Error creating new notebook`,
                content: "message" in data ? data.message : ""
            });
        }
    }

    async function _saveMeAs(e) {
        if (!am_selected()) {
            return false
        }
        statusFuncs.startSpinner();
        try {
            let data = await postPromise("host", "get_list_names", {"user_id": window.user_id}, props.main_id);
            let new_name = dialogFuncs.showModalPromise("ModalDialog", {
                title: "Save List As",
                field_title: "New List Name",
                default_value: "NewList",
                existing_names: data.list_names,
                checkboxes: [],
                handleClose: dialogFuncs.hideModal,
                })
            const result_dict = {
                "new_res_name": new_name,
                "res_to_copy": _cProp("resource_name")
            };
            let data = await postAjaxPromise('/create_duplicate_list', result_dict);
            _setResourceNameState(new_name, () => {
                _saveMe()
            })
        }
        catch(e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError(`Error saving listy`, e);
                statusFuncs.stopSpinner();
            }
        }
    }

    function _dirty() {
        return !((list_content_ref.current == savedContent.current) &&
            (tags_ref.current == savedTags.current) && (notes_ref.current == savedNotes.current))
    }

    let my_props = {...props};
    if (!props.controlled) {
        my_props.resource_name = resource_name;
        my_props.usable_height = usable_height;
        my_props.usable_width = usable_width;
    }
    let outer_style = {
        width: "100%",
        height: my_props.usable_height,
        paddingLeft: 0,
        position: "relative"
    };
    let outer_class = "resource-viewer-holder";
    if (!props.controlled) {
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
                                   notes={notes}
                                   tags={tags}
                                   showErrorDrawerButton={false}
                                   saveMe={_saveMe}>
                    <ListEditor the_content={list_content}
                                readOnly={props.readOnly}
                                outer_ref={cc_ref}
                                height={get_new_cc_height()}
                                handleChange={_handleListChange}
                    />
                </ResourceViewerApp>
            </div>
        </Fragment>
    )
}

ListViewerApp = memo(ListViewerApp);

ListViewerApp.propTypes = {
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

ListViewerApp.defaultProps = {
    controlled: false,
    changeResourceName: null,
    updatePanel: null,
    refreshTab: null,
    closeTab: null,
};

async function list_viewer_main() {

    function gotProps(the_props) {
        let ListViewerAppPlus = withTheme(withDialogs(withErrorDrawer(withStatus(ListViewerApp))));
        let the_element = <ListViewerAppPlus {...the_props}
                                             controlled={false}
                                             initial_theme={window.theme}
                                             changeName={null}
        />;
        let domContainer = document.querySelector('#root');
        ReactDOM.render(the_element, domContainer)
    }

    let target = window.is_repository ? "repository_view_list_in_context" : "view_list_in_context";
    let data = await postAjaxPromise(target, {"resource_name": window.resource_name});
    list_viewer_props(data, null, gotProps, null);
}

if (!window.in_context) {
    await list_viewer_main();
}