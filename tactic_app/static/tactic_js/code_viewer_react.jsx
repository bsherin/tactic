import "../tactic_css/tactic.scss";

import React from "react";
import {Fragment, useState, useEffect, useRef, useMemo, memo, useContext} from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import {ReactCodemirror} from "./react-codemirror";

import {ResourceViewerApp, copyToLibrary, sendToRepository} from "./resource_viewer_react_app";
import {TacticSocket} from "./tactic_socket";
import {postAjaxPromise, postWithCallback} from "./communication_react.js"
import {doFlash, withStatus, StatusContext} from "./toaster.js"

import {getUsableDimensions, BOTTOM_MARGIN} from "./sizing_tools.js";
import {withErrorDrawer} from "./error_drawer.js";
import {guid, SelectedPaneContext} from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";
import {useCallbackStack, useConstructor, useStateAndRef} from "./utilities_react";

import {ThemeContext, withTheme} from "./theme"
import {DialogContext, withDialogs} from "./modal_react";

export {code_viewer_props, CodeViewerApp}

function code_viewer_props(data, registerDirtyMethod, finalCallback, registerOmniFunction) {

    let resource_viewer_id = guid();
    var tsocket = new TacticSocket("main", 5000, "code_viewer", resource_viewer_id);

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

function CodeViewerApp(props) {

    const top_ref = useRef(null);
    const cc_ref = useRef(null);
    const search_ref = useRef(null);
    const cc_bounding_top = useRef(null);

    const savedContent = useRef(props.the_content);
    const savedTags = useRef(props.split_tags);
    const savedNotes = useRef(props.notes);

    const [code_content, set_code_content, code_content_ref] = useStateAndRef(props.the_content);
    const [notes, set_notes, notes_ref] = useStateAndRef(props.notes);
    const [tags, set_tags, tags_ref] = useStateAndRef(props.split_tags);
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

    const [resource_name, set_resource_name] = useState(props.resource_name);

    const theme = useContext(ThemeContext);
    const dialogFuncs = useContext(DialogContext);
    const statusFuncs = useContext(StatusContext);

    useEffect(() => {
        statusFuncs.stopSpinner();
        if (cc_ref && cc_ref.current) {
            cc_bounding_top.current = cc_ref.current.getBoundingClientRect().top;
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

    const selectedPane = useContext(SelectedPaneContext);

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

    const menu_specs = useMemo(() => {
        var ms;
        if (props.is_repository) {
            ms = {
                Transfer: [{
                    "name_text": "Copy to library", "icon_name": "import",
                    "click_handler": () => {
                        copyToLibrary("list", _cProp("resource_name"), dialogFuncs)
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
                            sendToRepository("list", _cProp("resource_name"), dialogFuncs)
                        },
                        tooltip: "Share to repository"
                    },
                ]
            }
        }
        return ms
    });

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

    function _handleCodeChange(new_code) {
        set_code_content(new_code)
    }

    function _update_window_dimensions() {
        set_usable_width(window.innerWidth - top_ref.current.offsetLeft);
        set_usable_height(window.innerHeight - top_ref.current.offsetTop)
    }

    function get_new_cc_height() {
        if (cc_bounding_top.current) {
            return window.innerHeight - cc_bounding_top.current - BOTTOM_MARGIN
        } else if (cc_ref && cc_ref.current) {  // This will be true after the initial render
            return window.innerHeight - cc_ref.current.getBoundingClientRect().top - BOTTOM_MARGIN
        } else {
            return _cProp("usable_height") - 100
        }
    }

    function _setSearchMatches(nmatches) {
        set_search_matches(nmatches);
    }

    function _extraKeys() {
        return {
            'Ctrl-S': _saveMe,
            'Ctrl-F': () => {
                search_ref.current.focus()
            },
            'Cmd-F': () => {
                search_ref.current.focus()
            }
        }
    }


    function am_selected() {
        return !window.in_context || selectedPane.tab_id == selectedPane.selectedTabIdRef.current
    }

    function _saveMe() {
        if (!am_selected()) {
            return false
        }
        const new_code = code_content;
        const tagstring = tags.join(" ");
        const local_notes = notes;
        const local_tags = tags;  // In case it's modified wile saving
        const result_dict = {
            "code_name": _cProp("resource_name"),
            "new_code": new_code,
            "tags": tagstring,
            "notes": local_notes,
            "user_id": window.user_id
        };
        postWithCallback("host", "update_code_task", result_dict,
            update_success, null, props.resource_viewer_id);

        function update_success(data) {
            if (data.success) {
                savedContent.current = new_code;
                savedTags.current = local_tags;
                savedNotes.current = local_notes;
                data.timeout = 2000;
            }
            doFlash(data);
            return false
        }
    }

    function _saveMeAs(e) {
        if (!am_selected()) {
            return false
        }
        statusFuncs.startSpinner();
        postWithCallback("host", "get_code_names", {"user_id": window.user_id}, function (data) {
            let checkboxes;
            dialogFuncs.showModal("ModalDialog", {
                    title: "Save Code As",
                    field_title: "New Code Name",
                    handleSubmit: CreateNewList,
                    default_value: "NewCode",
                    existing_names: data.code_names,
                    checkboxes: [],
                    handleCancel: doCancel,
                    handleClose: dialogFuncs.hideModal,
                })
        }, null, props.main_id);

        function doCancel() {
            statusFuncs.stopSpinner()
        }

        function CreateNewList(new_name) {
            const result_dict = {
                "new_res_name": new_name,
                "res_to_copy": _cProp("resource_name")
            };
            postAjaxPromise('/create_duplicate_code', result_dict)
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
        return !((code_content_ref.current == savedContent.current) &&
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
                                   res_type="code"
                                   resource_name={my_props.resource_name}
                                   menu_specs={menu_specs}
                                   handleStateChange={_handleMetadataChange}
                                   created={props.created}
                                   meta_outer={props.meta_outer}
                                   notes={notes}
                                   tags={tags}
                                   saveMe={_saveMe}
                                   search_ref={search_ref}
                                   show_search={true}
                                   update_search_state={_update_search_state}
                                   search_string={search_string}
                                   search_matches={search_matches}
                                   regex={regex}
                                   allow_regex_search={true}
                                   showErrorDrawerButton={true}
                                   toggleErrorDrawer={props.toggleErrorDrawer}
                                   registerOmniFunction={props.registerOmniFunction}
                >
                    <ReactCodemirror code_content={code_content}
                                     am_selected={am_selected()}
                                     extraKeys={_extraKeys()}
                                     readOnly={props.readOnly}
                                     handleChange={_handleCodeChange}
                                     saveMe={_saveMe}
                                     search_term={search_string}
                                     update_search_state={_update_search_state}
                                     regex_search={regex}
                                     setSearchMatches={_setSearchMatches}
                                     code_container_height={get_new_cc_height()}
                                     ref={cc_ref}
                    />
                </ResourceViewerApp>
            </div>
        </Fragment>
    )
}

CodeViewerApp = memo(CodeViewerApp);

CodeViewerApp.propTypes = {
    controlled: PropTypes.bool,
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

CodeViewerApp.defaultProps = {
    controlled: false,
    changeResourceName: null,
    changeResourceTitle: null,
    changeResourceProps: null,
    updatePanel: null,
    refreshTab: null,
    closeTab: null,
};

function code_viewer_main() {
    function gotProps(the_props) {
        let CodeViewerAppPlus = withTheme(withDialogs(withErrorDrawer(withStatus(CodeViewerApp))));
        let the_element = <CodeViewerAppPlus {...the_props}
                                             controlled={false}
                                             initial_theme={window.theme}
                                             changeName={null}
        />;
        let domContainer = document.querySelector('#root');
        ReactDOM.render(the_element, domContainer)
    }

    let target = window.is_repository ? "repository_view_code_in_context" : "view_code_in_context";
    postAjaxPromise(target, {"resource_name": window.resource_name})
        .then((data) => {
            code_viewer_props(data, null, gotProps, null);
        })
}


if (!window.in_context) {
    code_viewer_main();
}