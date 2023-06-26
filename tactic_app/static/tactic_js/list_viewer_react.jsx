/**
 * Created by bls910
 */

import "../tactic_css/tactic.scss";

import React from "react";
import {Fragment, useState, useEffect, useRef, memo} from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import {TextArea} from "@blueprintjs/core";

import {ResourceViewerApp, copyToLibrary, sendToRepository} from "./resource_viewer_react_app";
import {TacticSocket} from "./tactic_socket";
import {postAjax, postAjaxPromise, postWithCallback} from "./communication_react"
import {doFlash, withStatus} from "./toaster"

import {getUsableDimensions, BOTTOM_MARGIN} from "./sizing_tools";
import {withErrorDrawer} from "./error_drawer";
import {guid} from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";
import {showModalReact} from "./modal_react";
import {useCallbackStack, useConstructor, useStateAndRef} from "./utilities_react";

export {list_viewer_props, ListViewerApp}

function list_viewer_main() {

    function gotProps(the_props) {
        let ListViewerAppPlus = withErrorDrawer(withStatus(ListViewerApp));
        let the_element = <ListViewerAppPlus {...the_props}
                                             controlled={false}
                                             initial_theme={window.theme}
                                             changeName={null}
        />;
        let domContainer = document.querySelector('#root');
        ReactDOM.render(the_element, domContainer)
    }

    let target = window.is_repository ? "repository_view_list_in_context" : "view_list_in_context";
    postAjaxPromise(target, {"resource_name": window.resource_name})
        .then((data) => {
            list_viewer_props(data, null, gotProps, null);
        })
}

function list_viewer_props(data, registerDirtyMethod, finalCallback, registerOmniFunction) {

    let resource_viewer_id = guid();
    var tsocket = new TacticSocket("main", 5000, resource_viewer_id);


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
        registerOmniFunction: registerOmniFunction
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
    const [dark_theme, set_dark_theme] = useState(() => {
        return props.initial_theme === "dark"
    });
    const [resource_name, set_resource_name] = useState(props.resource_name);

    useEffect(() => {
        props.stopSpinner();
        if (cc_ref && cc_ref.current) {
            cc_offset_top.current = cc_ref.current.offsetTop;
        }
        if (!props.controlled) {
            window.dark_theme = dark_theme;
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

    function _setTheme(dark_theme) {
        set_dark_theme(dark_theme);

        if (!window.in_context) {
            pushCallback(() => {
                window.dark_theme = dark_theme
            })
        }
    }

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
                    "click_handler": () => {
                        copyToLibrary("list", _cProp("resource_name"))
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
                        click_handler: () => {
                            sendToRepository("list", _cProp("resource_name"))
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

    function _saveMe() {
        if (!props.am_selected) {
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
        let self = this;
        postAjax("update_list", result_dict, update_success);

        function update_success(data) {
            if (data.success) {
                savedContent.current = new_list_as_string;
                savedTags.current = local_tags;
                savedNotes.current = local_notes;
                data.timeout = 2000;
            }
            doFlash(data);
            return false
        }
    }

    function _saveMeAs(e) {
        props.startSpinner();
        let self = this;
        postWithCallback("host", "get_list_names", {"user_id": window.user_id}, function (data) {
            let checkboxes;
            showModalReact("Save List As", "New List Name", CreateNewList,
                "NewList", data["list_names"], null, doCancel)
        }, null, props.main_id);

        function doCancel() {
            props.stopSpinner()
        }

        function CreateNewList(new_name) {
            const result_dict = {
                "new_res_name": new_name,
                "res_to_copy": _cProp("resource_name")
            };
            postAjaxPromise('/create_duplicate_list', result_dict)
                .then((data) => {
                        _setResourceNameState(new_name, () => {
                            _saveMe()
                        })
                    }
                )
                .catch(doFlash)
        }
    }

    function _dirty() {
        return !((list_content_ref.current == savedContent.current) &&
            (tags_ref.current == savedTags.current) && (notes_ref.current == savedNotes.current))
    }

    let actual_dark_theme = props.controlled ? props.dark_theme : dark_theme;
    let my_props = {...props};
    if (!props.controlled) {
        for (let prop_name of controllable_props) {
            my_props.resource_name = resource_name;
            my_props.usable_height = usable_height;
            my_props.usable_width = usable_width;
        }
    }
    let outer_style = {
        width: "100%",
        height: my_props.usable_height,
        paddingLeft: 0,
        position: "relative"
    };
    let outer_class = "resource-viewer-holder";
    if (!props.controlled) {
        if (dark_theme) {
            outer_class = outer_class + " bp4-dark";
        } else {
            outer_class = outer_class + " light-theme"
        }
    }
    return (
        <Fragment>
            {!props.controlled &&
                <TacticNavbar is_authenticated={window.is_authenticated}
                              dark_theme={dark_theme}
                              setTheme={_setTheme}
                              selected={null}
                              show_api_links={true}
                              page_id={props.resource_viewer_id}
                              user_name={window.username}/>
            }
            <div className={outer_class} ref={top_ref} style={outer_style}>
                <ResourceViewerApp {...my_props}
                                   dark_theme={dark_theme}
                                   setTheme={props.controlled ? null : _setTheme}
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
                                   registerOmniFunction={props.registerOmniFunction}
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
    am_selected: PropTypes.bool,
    changeResourceName: PropTypes.func,
    changeResourceTitle: PropTypes.func,
    changeResourceProps: PropTypes.func,
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
    am_selected: true,
    controlled: false,
    changeResourceName: null,
    changeResourceTitle: null,
    changeResourceProps: null,
    updatePanel: null,
    refreshTab: null,
    closeTab: null,
};


if (!window.in_context) {
    list_viewer_main();
}