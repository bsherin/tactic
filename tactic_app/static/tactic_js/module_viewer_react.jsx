/**
 * Created by bls910
 */

import "../tactic_css/tactic.scss";

import React from "react";
import {Fragment, useState, useEffect, useRef, memo} from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import {ResourceViewerApp, copyToLibrary, sendToRepository} from "./resource_viewer_react_app";
import {TacticSocket} from "./tactic_socket";
import {ReactCodemirror} from "./react-codemirror";
import {postAjax, postAjaxPromise, postWithCallback} from "./communication_react"
import {doFlash} from "./toaster"
import {withErrorDrawer} from "./error_drawer";
import {withStatus} from "./toaster";

import {getUsableDimensions, BOTTOM_MARGIN} from "./sizing_tools";
import {guid} from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";
import {showModalReact} from "./modal_react";
import {useCallbackStack, useConstructor, useStateAndRef} from "./utilities_react";

export {module_viewer_props, ModuleViewerApp}

function module_viewer_main() {
    function gotProps(the_props) {
        let ModuleViewerAppPlus = withErrorDrawer(withStatus(ModuleViewerApp));
        let the_element = <ModuleViewerAppPlus {...the_props}
                                               controlled={false}
                                               initial_theme={window.theme}
                                               changeName={null}
        />;
        let domContainer = document.querySelector('#root');
        ReactDOM.render(the_element, domContainer)
    }

    let target = window.is_repository ? "repository_view_module_in_context" : "view_module_in_context";
    postAjaxPromise(target, {"resource_name": window.resource_name})
        .then((data) => {
            module_viewer_props(data, null, gotProps, null);

        })
}

const controllable_props = ["resource_name", "usable_height", "usable_width"];

function module_viewer_props(data, registerDirtyMethod, finalCallback, registerOmniFunction) {

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
        icon: data.mdata.additional_mdata.icon,
        readOnly: data.read_only,
        is_repository: data.is_repository,
        meta_outer: "#right-div",
        registerDirtyMethod: registerDirtyMethod,
        registerOmniFunction: registerOmniFunction
    })
}

function ModuleViewerApp(props) {
    const top_ref = useRef(null);
    const cc_ref = useRef(null);
    const search_ref = useRef(null);
    const cc_bounding_top = useRef(null);

    const savedContent = useRef(props.the_content);
    const savedTags = useRef(props.split_tags);
    const savedNotes = useRef(props.notes);
    const savedIcon = useRef(props.icon);

    const [code_content, set_code_content, code_content_ref] = useStateAndRef(props.the_content);
    const [notes, set_notes, notes_ref] = useStateAndRef(props.notes);
    const [tags, set_tags, tags_ref] = useStateAndRef(props.split_tags);
    const [icon, set_icon, icon_ref] = useStateAndRef(props.icon);
    const [search_string, set_search_string] = useState("");
    const [regex, set_regex] = useState(false);
    const [search_matches, set_search_matches] = useState(props.null);

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
            cc_bounding_top.current = cc_ref.current.getBoundingClientRect().top;
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

    function _update_search_state(nstate, callback = null) {
        for (let field in nstate) {
            switch (field) {
                case "regex":
                    set_regex(nstate[field]);
                    break;
                case "search_string":
                    set_search_string(nstate[field]);
                    break;
            }
        }
    }

    function _setTheme(dark_theme) {
        set_dark_theme(dark_theme);
        if (!window.in_context) {
            pushCallback(() => {
                window.dark_theme = dark_theme
            })
        }
    }

    function menu_specs() {
        let ms;
        if (props.is_repository) {
            ms = {
                Transfer: [{
                    "name_text": "Copy to library", "icon_name": "import",
                    "click_handler": () => {
                        copyToLibrary("tile", _cProp("resource_name"))
                    }, tooltip: "Copy to library"
                }]
            }
        } else {
            ms = {
                Save: [{
                    "name_text": "Save",
                    "icon_name": "saved",
                    "click_handler": _saveMe,
                    key_bindings: ['ctrl+s'],
                    tooltip: "Save"
                    },
                    {
                        "name_text": "Save As...",
                        "icon_name": "floppy-disk",
                        "click_handler": _saveModuleAs,
                        tooltip: "Save as"
                    },
                    {
                        "name_text": "Save and Checkpoint",
                        "icon_name": "map-marker",
                        "click_handler": _saveAndCheckpoint,
                        key_bindings: ['ctrl+m'],
                        tooltip: "Save and checkpoint"
                    }],
                Load: [{
                    "name_text": "Save and Load",
                    "icon_name": "upload",
                    "click_handler": _saveAndLoadModule,
                    key_bindings: ['ctrl+l'],
                    tooltip: "Save and load module"
                },
                    {"name_text": "Load", "icon_name": "upload", "click_handler": _loadModule, tooltip: "Load tile"}],
                Compare: [{
                    "name_text": "View History",
                    "icon_name": "history",
                    "click_handler": _showHistoryViewer,
                    tooltip: "Show history viewer"
                },
                    {
                        "name_text": "Compare to Other Modules",
                        "icon_name": "comparison",
                        "click_handler": _showTileDiffer,
                        tooltip: "Compare to another tile"
                    }],
                Transfer: [{
                    name_text: "Share",
                    icon_name: "share",
                    click_handler: () => {
                        sendToRepository("list", _cProp("resource_name"))
                    },
                    tooltip: "Share to repository"
                },]
            }
        }
        for (const [menu_name, menu] of Object.entries(ms)) {
            for (let but of menu) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return ms
    }

    function _handleCodeChange(new_code) {
        set_code_content(new_code)
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

                case "icon":
                    set_icon(state_stuff[field]);
                    break;
            }
        }
    }

    function _doFlashStopSpinner(data) {
        props.stopSpinner();
        props.clearStatusMessage();
        doFlash(data)
    }

    function get_new_cc_height() {
        if (cc_bounding_top.current) {
            return window.innerHeight - cc_bounding_top.current - BOTTOM_MARGIN
        } else if (cc_ref && cc_ref.current) {
            return window.innerHeight - cc_ref.current.getBoundingClientRect().top - BOTTOM_MARGIN
        } else {
            return _cProp("usable_height") - 100
        }
    }

    function _setResourceNameState(new_name, callback = null) {
        if (props.controlled) {
            props.changeResourceName(new_name, callback)
        } else {
            set_resource_name(new_name);
            pushCallback(callback);
        }
    }

    function _extraKeys() {
        return {
            'Ctrl-S': _saveMe,
            'Ctrl-L': _saveAndLoadModule,
            'Ctrl-M': _saveAndCheckpoint,
            'Ctrl-F': () => {
                search_ref.current.focus()
            },
            'Cmd-F': () => {
                search_ref.current.focus()
            }
        }
    }

    function _saveMe() {
        if (!props.am_selected) {
            return false
        }
        props.startSpinner();
        props.statusMessage("Saving Module");
        doSavePromise()
            .then(_doFlashStopSpinner)
            .catch(_doFlashStopSpinner);
        return false
    }

    function doSavePromise() {
        return new Promise(function (resolve, reject) {
            const new_code = code_content;
            const tagstring = tags.join(" ");
            const local_notes = notes;
            const local_tags = tags;  // In case it's modified wile saving
            const local_icon = icon;
            let result_dict;
            let category;
            category = null;
            result_dict = {
                "module_name": _cProp("resource_name"),
                "category": category,
                "tags": tagstring,
                "notes": local_notes,
                "icon": local_icon,
                "new_code": new_code,
                "last_saved": "viewer"
            };
            postAjax("update_module", result_dict, function (data) {
                if (data.success) {
                    savedContent.current = new_code;
                    savedTags.current = local_tags;
                    savedNotes.current = local_notes;
                    savedIcon.current = local_icon;
                    data.timeout = 2000;
                    resolve(data)
                } else {
                    reject(data)
                }
            });
        })
    }

    function _saveModuleAs() {
        props.startSpinner();
        postWithCallback("host", "get_tile_names", {"user_id": window.user_id}, function (data) {
            let checkboxes;
            showModalReact("Save Module As", "New ModuleName Name", CreateNewModule,
                "NewModule", data["tile_names"], null, doCancel)
        }, null, props.main_id);

        function doCancel() {
            props.stopSpinner()
        }

        function CreateNewModule(new_name) {
            const result_dict = {
                "new_res_name": new_name,
                "res_to_copy": _cProp("resource_name")
            };
            postAjaxPromise('/create_duplicate_tile', result_dict)
                .then((data) => {
                        _setResourceNameState(new_name, () => {
                            _saveMe()
                        })
                    }
                )
                .catch(doFlash)
        }

    }

    function _saveAndLoadModule() {
        props.startSpinner();
        doSavePromise()
            .then(function () {
                props.statusMessage("Loading Module");
                postWithCallback(
                    "host",
                    "load_tile_module_task",
                    {"tile_module_name": _cProp("resource_name"), "user_id": window.user_id},
                    load_success,
                    null,
                    props.resource_viewer_id)
            })
            .catch(_doFlashStopSpinner);

        function load_success(data) {
            if (data.success) {
                data.timeout = 2000;
            }
            _doFlashStopSpinner(data);
            return false
        }
    }

    function _loadModule() {
        props.startSpinner();
        props.statusMessage("Loading Module");
        postWithCallback(
            "host",
            "load_tile_module_task",
            {"tile_module_name": _cProp("resource_name"), "user_id": window.user_id},
            load_success,
            null,
            props.resource_viewer_id
        );

        function load_success(data) {
            if (data.success) {
                data.timeout = 2000;
            }
            _doFlashStopSpinner(data);
            return false
        }
    }

    function _saveAndCheckpoint() {
        props.startSpinner();
        doSavePromise()
            .then(function () {
                props.statusMessage("Checkpointing");
                doCheckpointPromise()
                    .then(_doFlashStopSpinner)
                    .catch(_doFlashStopSpinner)
            })
            .catch(_doFlashStopSpinner);
        return false

    }

    function doCheckpointPromise() {
        return new Promise(function (resolve, reject) {
            postAjax("checkpoint_module", {"module_name": _cProp("resource_name")}, function (data) {
                if (data.success) {
                    resolve(data)
                } else {
                    reject(data)
                }
            });
        })
    }

    function _showHistoryViewer() {
        window.open(`${$SCRIPT_ROOT}/show_history_viewer/${_cProp("resource_name")}`)
    }

    function _showTileDiffer() {
        window.open(`${$SCRIPT_ROOT}/show_tile_differ/${_cProp("resource_name")}`)
    }

    function _dirty() {
        return !((code_content_ref.current == savedContent.current) && (icon_ref.current == savedIcon.current) &&
            (tags_ref.current == savedTags.current) && (notes_ref.current == savedNotes.current))
    }

    function _setSearchMatches(nmatches) {
        set_search_matches(nmatches);
    }

    let actual_dark_theme = props.controlled ? props.dark_theme : dark_theme;
    let the_context = {"readOnly": props.readOnly};
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
    let cc_height = get_new_cc_height();
    let outer_class = "resource-viewer-holder";
    if (!props.controlled) {
        // outer_class = "resource-viewer-holder";
        if (actual_dark_theme) {
            outer_class = outer_class + " bp4-dark";
        } else {
            outer_class = outer_class + " light-theme"
        }
    }
    return (
        <Fragment>
            {!props.controlled &&
                <TacticNavbar is_authenticated={window.is_authenticated}
                              dark_theme={actual_dark_theme}
                              setTheme={_setTheme}
                              selected={null}
                              show_api_links={true}
                              page_id={props.resource_viewer_id}
                              user_name={window.username}/>
            }
            <div className={outer_class} ref={top_ref} style={outer_style}>
                <ResourceViewerApp {...my_props}
                                   dark_theme={actual_dark_theme}
                                   setTheme={props.controlled ? null : _setTheme}
                                   resource_viewer_id={my_props.resource_viewer_id}
                                   setResourceNameState={_setResourceNameState}
                                   refreshTab={props.refreshTab}
                                   closeTab={props.closeTab}
                                   res_type="tile"
                                   resource_name={my_props.resource_name}
                                   menu_specs={menu_specs()}
                                   handleStateChange={_handleMetadataChange}
                                   created={props.created}
                                   notes={notes}
                                   tags={tags}
                                   mdata_icon={icon}
                                   saveMe={_saveMe}
                                   show_search={true}
                                   update_search_state={_update_search_state}
                                   search_string={search_string}
                                   search_matches={search_matches}
                                   regex={regex}
                                   allow_regex_search={true}
                                   search_ref={search_ref}
                                   meta_outer={props.meta_outer}
                                   showErrorDrawerButton={true}
                                   toggleErrorDrawer={props.toggleErrorDrawer}
                                   registerOmniFunction={props.registerOmniFunction}
                >
                    <ReactCodemirror code_content={code_content}
                                     dark_theme={actual_dark_theme}
                                     am_selected={props.am_selected}
                                     extraKeys={_extraKeys()}
                                     readOnly={props.readOnly}
                                     handleChange={_handleCodeChange}
                                     saveMe={_saveMe}
                                     search_term={search_string}
                                     update_search_state={_update_search_state}
                                     regex_search={regex}
                                     setSearchMatches={_setSearchMatches}
                                     code_container_height={cc_height}
                                     ref={cc_ref}
                    />
                </ResourceViewerApp>
            </div>
        </Fragment>
    )
}

ModuleViewerApp = memo(ModuleViewerApp);

ModuleViewerApp.propTypes = {
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
    dark_theme: PropTypes.bool,
    readOnly: PropTypes.bool,
    is_repository: PropTypes.bool,
    meta_outer: PropTypes.string,
    usable_height: PropTypes.number,
    usable_width: PropTypes.number
};

ModuleViewerApp.defaultProps = {
    am_selected: true,
    controlled: false,
    changeResourceName: null,
    changeResourceTitle: null,
    changeResourceProps: null,
    refreshTab: null,
    closeTab: null,
    updatePanel: null
};

if (!window.in_context) {
    module_viewer_main();
}
