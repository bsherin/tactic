if (!window.in_context) {
    import("../tactic_css/tactic.scss");
    import("../tactic_css/resource_viewer.scss");
    import ("../tactic_css/themeable.scss");
}
import React from "react";
import {Fragment, useState, useEffect, useRef, useMemo, memo, useContext, useCallback} from "react";
import {createRoot} from 'react-dom/client';
import {useHotkeys} from "@blueprintjs/core";
import {ResourceViewerApp, copyToLibrary, sendToRepository} from "./resource_viewer_react_app";
import {TacticSocket} from "./tactic_socket";
import {ReactCodemirror6} from "./react-codemirror6";
import {postPromise, handleCallback} from "./communication_react"
import {withStatus, StatusContext} from "./toaster"

import {withErrorDrawer} from "./error_drawer.js";
import {guid, SelectedPaneContext} from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";
import {useCallbackStack, useConstructor, useStateAndRef} from "./utilities_react";

import {SettingsContext, withSettings} from "./settings"
import {withAssistant} from "./assistant";
import {DialogContext, withDialogs} from "./modal_react";
import {ErrorDrawerContext} from "./error_drawer";
import {ICON_BAR_WIDTH} from "./sizing_tools";

export {code_viewer_props, CodeViewerApp}

function code_viewer_props(data, registerDirtyMethod, finalCallback) {
    const local_id = data.local_id || guid();
    let tsocket = data.tsocket;

    if (!window.in_context) {
        window.global_id = local_id;
    }
    finalCallback({
        local_id: local_id,
        tsocket: tsocket,
        split_tags: [],
        created: "",
        resource_name: data.resource_name,
        the_content: "",
        notes: "",
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
        the_content: "",
        ...props
    };

    const top_ref = useRef(null);
    const search_ref = useRef(null);
    const cmObjectRef = useRef(null);

    const savedContent = useRef("");
    const initialized = useRef(false);

    const [code_content, set_code_content, code_content_ref] = useStateAndRef("");
    const [current_search_number, set_current_search_number, current_search_number_ref] = useStateAndRef(null);
    const [search_string, set_search_string] = useState("");
    const [regex, set_regex] = useState(false);
    const [search_matches, set_search_matches, search_matches_ref] = useStateAndRef(null);

    const [resource_name, set_resource_name] = useState(props.resource_name);

    const settingsContext = useContext(SettingsContext);
    const dialogFuncs = useContext(DialogContext);
    const statusFuncs = useContext(StatusContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);

    useEffect(() => {
        statusFuncs.stopSpinner();
        if (props.controlled) {
            props.registerDirtyMethod(_dirty)
        }
        postPromise("host", "get_code_content_with_metadata_task", {"code_name": props.resource_name})
            .then(data => {
                if (!data["success"]) {
                    errorDrawerFuncs.addErrorDrawerEntry({
                        title: "Error getting code content",
                        content: "Code not found"
                    });
                    props.closeTab()
                }
                else {
                    const the_code = data["the_code"];
                    const metadata = data["metadata"];
                    set_code_content(the_code);
                    savedContent.current = the_code;
                    initialized.current = true;
                }

            });
        return (() => {
            cmObjectRef.current = null;
            set_code_content(null);
            if (!props.controlled) {
                window.removeEventListener("beforeunload", function (e) {
                    if (_dirty()) {
                        e.preventDefault();
                    }
                    props.tsocket.disconnect();
                })
            }
        })
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
            await postPromise("host", "update_code_task", result_dict, props.local_id);
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
                }
                props.tsocket.disconnect()
            })

        }
    });

    const selectedPane = useContext(SelectedPaneContext);

    function _update_search_state(nstate) {
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
                            await sendToRepository("code", _cProp("resource_name"), dialogFuncs, statusFuncs, errorDrawerFuncs)
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
        return new Promise((resolve) => {
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

    function _setCmObject(cm) {
        cmObjectRef.current = cm;
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

    async function _saveMeAs() {
        if (!am_selected()) {
            return false
        }
        statusFuncs.startSpinner();
        try {
            let data = await postPromise("host", "get_code_names_task", {"user_id": window.user_id}, props.local_id);
            let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                title: "Save Code As",
                field_title: "New Code Name",
                default_value: "NewCode",
                existing_names: data["code_names"],
                checkboxes: [],
                handleClose: dialogFuncs.hideModal,
            });
            const result_dict = {
                "new_res_name": new_name,
                "res_to_copy": _cProp("resource_name")
            };
            await postPromise("host", "create_duplicate_code_task", result_dict, props.local_id);
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
        width: `calc(100% - ${ICON_BAR_WIDTH}px)`,
        height: "100%",
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
                              global_id={props.global_id}
                              user_name={window.username}/>
            }
            <div className={outer_class} ref={top_ref} style={outer_style}
                 tabIndex="0" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
                <ResourceViewerApp {...my_props}
                                   local_id={props.local_id}
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
                                      controlled={true}
                                      show_fold_button={true}
                                      flex_size={true}
                                      extraKeys={_extraKeys()}
                                      readOnly={props.readOnly}
                                      handleChange={_handleCodeChange}
                                      saveMe={_saveMe}
                                      show_search={true}
                                      setCMObject={_setCmObject}
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
    let local_id = "a" + guid();
    function gotProps(the_props) {
        let CodeViewerAppPlus = withSettings(withDialogs(withErrorDrawer(withStatus(withAssistant(CodeViewerApp)))));
        let the_element = <CodeViewerAppPlus {...the_props}
                                             controlled={false}
                                             changeName={null}
        />;
        const domContainer = document.querySelector('#root');
        const root = createRoot(domContainer);
        root.render(the_element)
    }

    let tsocket = new TacticSocket("main", 5000, "code_viewer", local_id, async () => {
        tsocket.attachListener('handle-callback', (task_packet) => {
            handleCallback(task_packet, local_id)
        });
        let data = {resource_name: resource_name, res_type: "code", local_id, tsocket};
        data.read_only = window.read_only;
        data.is_repository = window.is_repository;
        code_viewer_props(data, null, gotProps);
    })
}


if (!window.in_context) {
    code_viewer_main();
}