import "../tactic_css/tactic.scss";
import React from "react";
import {Fragment, useState, useEffect, useRef, useMemo, memo, useContext, useCallback} from "react";
import {createRoot} from 'react-dom/client';
import {useHotkeys} from "@blueprintjs/core";

import {ResourceViewerApp, copyToLibrary, sendToRepository} from "./resource_viewer_react_app";
import {TacticSocket} from "./tactic_socket";
import {ReactCodemirror6} from "./react-codemirror6";
import {postAjaxPromise, postPromise} from "./communication_react.js"
import {withStatus, StatusContext} from "./toaster.js"

import {withErrorDrawer} from "./error_drawer.js";
import {guid, SelectedPaneContext} from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";
import {useCallbackStack, useConstructor, useStateAndRef} from "./utilities_react";

import {SettingsContext, withSettings} from "./settings"
import {withAssistant} from "./assistant";
import {DialogContext, withDialogs} from "./modal_react";
import {ErrorDrawerContext} from "./error_drawer";
import {SizeContext, useSize, withSizeContext} from "./sizing_tools";

export {code_viewer_props, CodeViewerApp}

function code_viewer_props(data, registerDirtyMethod, finalCallback) {

    let resource_viewer_id = guid();
    if (!window.in_context) {
        window.main_id = resource_viewer_id;
    }
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
        registerDirtyMethod: registerDirtyMethod,
    })
}

function CodeViewerApp(props) {
    props = {
        controlled: false,
        changeResourceName: null,
        updatePanel: null,
        refreshTab: null,
        closeTab: null,
        ...props
    };

    const top_ref = useRef(null);
    const search_ref = useRef(null);

    const savedContent = useRef(props.the_content);

    const [code_content, set_code_content, code_content_ref] = useStateAndRef(props.the_content);
    const [current_search_number, set_current_search_number, current_search_number_ref] = useStateAndRef(null);
    const [search_string, set_search_string] = useState("");
    const [regex, set_regex] = useState(false);
    const [search_matches, set_search_matches, search_matches_ref] = useStateAndRef(null);

    const [usable_width, usable_height, topX, topY] = useSize(top_ref, 0, "CodeViewer");

    const [resource_name, set_resource_name] = useState(props.resource_name);

    const settingsContext = useContext(SettingsContext);
    const dialogFuncs = useContext(DialogContext);
    const statusFuncs = useContext(StatusContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);
    const sizeInfo = useContext(SizeContext);

    useEffect(() => {
        statusFuncs.stopSpinner();
        if (props.controlled) {
            props.registerDirtyMethod(_dirty)
        }
    }, []);

    const pushCallback = useCallbackStack("code_viewer");

    const _saveMe = useCallback(async () => {
        if (!am_selected()) {
            return false
        }
        const new_code = code_content_ref.current;
        const result_dict = {
            "code_name": _cProp("resource_name"),
            "new_code": new_code,
            "user_id": window.user_id
        };
        try {
            await postPromise("host", "update_code_task", result_dict, props.resource_viewer_id);
            savedContent.current = new_code;
            statusFuncs.statusMessage(`Updated code resource ${_cProp("resource_name")}`, 7)
        } catch (e) {
            errorDrawerFuncs.addFromError("Error saving code", e)

        }
        return false
    }, [code_content]);

    const hotkeys = useMemo(
        () => [
            {
                combo: "Ctrl+S",
                global: false,
                group: "Code Viewer",
                label: "Save Code",
                onKeyDown: _saveMe
            },
        ],
        [_saveMe],
    );
    const {handleKeyDown, handleKeyUp} = useHotkeys(hotkeys);

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
        set_current_search_number(0);
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
        return ms
    });


    function _handleCodeChange(new_code) {
        set_code_content(new_code)
    }

    function _setResourceNameState(new_name, callback = null) {
        if (props.controlled) {
            props.changeResourceName(new_name, callback)
        } else {
            set_resource_name(new_name);
            pushCallback(callback);
        }
    }

    async function _setResourceNameStatePromise(new_name) {
        return new Promise((resolve, reject) => {
            _setResourceNameState(new_name, resolve)
        })
    }


    function _setSearchMatches(nmatches) {
        set_search_matches(nmatches);
    }

    function _searchNext() {
        if (current_search_number_ref.current < search_matches_ref.current - 1) {
            set_current_search_number(current_search_number_ref.current + 1);
        }
    }

    function _searchPrev() {
        if (current_search_number_ref.current > 0) {
            set_current_search_number(current_search_number_ref.current - 1);
        }
    }

    function _extraKeys() {
        return [
            {key: 'Ctrl-s', run: _saveMe},
            {
                key: 'Ctrl-f', run: () => {
                    search_ref.current.focus();
                }, preventDefault: true
            },
            {
                key: 'Cmd-f', run: () => {
                    search_ref.current.focus();
                }, preventDefault: true
            },
            {
                key: 'Ctrl-g', run: () => {
                    _searchNext();
                }, preventDefault: true
            },
            {
                key: 'Cmd-g', run: () => {
                    _searchNext();
                }, preventDefault: true
            },
            {
                key: 'Ctrl-Shift-g', run: () => {
                    _searchPrev();
                }, preventDefault: true
            },
            {
                key: 'Cmd-Shift-g', run: () => {
                    _searchPrev();
                }, preventDefault: true
            }
        ]
    }

    function am_selected() {
        return selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef)
    }

    async function _saveMeAs(e) {
        if (!am_selected()) {
            return false
        }
        statusFuncs.startSpinner();
        try {
            let data = await postPromise("host", "get_code_names", {"user_id": window.user_id}, props.main_id);
            let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                title: "Save Code As",
                field_title: "New Code Name",
                default_value: "NewCode",
                existing_names: data.code_names,
                checkboxes: [],
                handleClose: dialogFuncs.hideModal,
            });
            const result_dict = {
                "new_res_name": new_name,
                "res_to_copy": _cProp("resource_name")
            };
            await postAjaxPromise('/create_duplicate_code', result_dict);
            await _setResourceNameStatePromise(new_name);
            await _saveMe()
        } catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError(`Error saving code`, e)
            }
        }
        statusFuncs.stopSpinner()
    }

    function _dirty() {
        return !(code_content_ref.current == savedContent.current)
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
        if (settingsContext.isDark()) {
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
            <div className={outer_class} ref={top_ref} style={outer_style}
                 tabIndex="0" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
                <ResourceViewerApp {...my_props}
                                   resource_viewer_id={props.resource_viewer_id}
                                   refreshTab={props.refreshTab}
                                   closeTab={props.closeTab}
                                   res_type="code"
                                   resource_name={my_props.resource_name}
                                   menu_specs={menu_specs}
                                   created={props.created}
                                   show_search={false}
                                   showErrorDrawerButton={true}
                >
                    <ReactCodemirror6 code_content={code_content}
                                      show_fold_button={true}
                                      no_width={true}
                                      extraKeys={_extraKeys()}
                                      readOnly={props.readOnly}
                                      handleChange={_handleCodeChange}
                                      saveMe={_saveMe}
                                      show_search={true}
                                      search_term={search_string}
                                      search_ref={search_ref}
                                      search_matches={search_matches}
                                      updateSearchState={_update_search_state}
                                      regex_search={regex}
                                      searchPrev={_searchPrev}
                                      searchNext={_searchNext}
                                      highlight_active_line={true}
                                      current_search_number={current_search_number}
                                      setSearchMatches={_setSearchMatches}
                    />
                </ResourceViewerApp>
            </div>
        </Fragment>
    )
}

CodeViewerApp = memo(CodeViewerApp);

function code_viewer_main() {
    function gotProps(the_props) {
        let CodeViewerAppPlus = withSizeContext(withSettings(withDialogs(withErrorDrawer(withStatus(withAssistant(CodeViewerApp))))));
        let the_element = <CodeViewerAppPlus {...the_props}
                                             controlled={false}
                                             changeName={null}
        />;
        const domContainer = document.querySelector('#root');
        const root = createRoot(domContainer);
        root.render(
            the_element
        )
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