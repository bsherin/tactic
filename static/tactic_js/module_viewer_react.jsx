if (!window.in_context) {
    import("../tactic_css/tactic.scss");
    import("../tactic_css/resource_viewer.scss");
    import ("../tactic_css/themeable.scss");
}

import React from "react";
import {Fragment, useState, useEffect, useRef, memo, useMemo, useContext} from "react";
import {createRoot} from 'react-dom/client';
import {useHotkeys} from "@blueprintjs/core";

import {ResourceViewerApp, copyToLibrary, sendToRepository} from "./resource_viewer_react_app";
import {TacticSocket} from "./tactic_socket";
import {ReactCodemirror6} from "./react-codemirror6";
import {postPromise, handleCallback} from "./communication_react"
import {ErrorDrawerContext, withErrorDrawer} from "./error_drawer";
import {withStatus, StatusContext} from "./toaster";
import {withAssistant} from "./assistant";

import {ICON_BAR_WIDTH} from "./sizing_tools";
import {guid} from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";
import {useCallbackStack, useStateAndRef} from "./utilities_react";
import {SettingsContext, withSettings} from "./settings";
import {DialogContext, withDialogs} from "./modal_react";
import {SelectedPaneContext, convertExtraKeys} from "./utilities_react";

export {module_viewer_props, ModuleViewerApp}

function module_viewer_props(data, registerDirtyMethod, finalCallback) {

    let tsocket = data.tsocket;
    if (!window.in_context) {
        window.global_id = data.local_id;
    }
    finalCallback({
        local_id: data.local_id,
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

function ModuleViewerApp(props) {
    props = {
        controlled: false,
        changeResourceName: null,
        refreshTab: null,
        closeTab: null,
        updatePanel: null,
        ...props
    };
    const top_ref = useRef(null);
    const search_ref = useRef(null);

    const savedContent = useRef(props.the_content);

    const [code_content, set_code_content, code_content_ref] = useStateAndRef("");
    const [current_search_number, set_current_search_number, current_search_number_ref] = useStateAndRef(null);
    const [search_string, set_search_string] = useState("");
    const [regex, set_regex] = useState(false);
    const [search_matches, set_search_matches, search_matches_ref] = useStateAndRef(null);

    const settingsContext = useContext(SettingsContext);
    const dialogFuncs = useContext(DialogContext);
    const statusFuncs = useContext(StatusContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);

    const [resource_name, set_resource_name] = useState(props.resource_name);

    const selectedPane = useContext(SelectedPaneContext);

    useEffect(() => {
        statusFuncs.stopSpinner();
        if (props.controlled) {
            props.registerDirtyMethod(_dirty)
        }
    }, []);

    const pushCallback = useCallbackStack("module_viewer");

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
    const {handleKeyDown, handleKeyUp} = useHotkeys(hotkeys);

    useEffect(() => {
        statusFuncs.stopSpinner();
        if (!props.controlled) {
            window.addEventListener("beforeunload", function (e) {
                if (_dirty()) {
                    e.preventDefault();
                    e.returnValue = ''
                }
                props.tsocket.disconnect()
            })
        }

        if (props.controlled) {
            props.registerDirtyMethod(_dirty);
        }
        postPromise("host", "get_tile_content_with_metadata_task", {"tile_module_name": props.resource_name})
            .then(data => {
                if (!data["success"]) {
                    errorDrawerFuncs.addErrorDrawerEntry({
                        title: "Error getting tile content",
                        content: "Tile module not found"
                    });
                    props.closeTab()
                }
                else {
                    const the_code = data["tile_module"];
                    set_code_content(the_code);
                    savedContent.current = the_code;
                }
            })
    }, []);

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

    function menu_specs() {
        let ms;
        if (props.is_repository) {
            ms = {
                Transfer: [{
                    "name_text": "Copy to library", "icon_name": "import",
                    "click_handler": async () => {
                        await copyToLibrary("tile", _cProp("resource_name"), dialogFuncs, statusFuncs, errorDrawerFuncs)
                    }, tooltip: "Copy to library"
                }]
            }
        } else {
            ms = {
                Save: [{
                    "name_text": "Save",
                    "icon_name": "saved",
                    "click_handler": _saveMe,
                    key_bindings: ['Ctrl+S'],
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
                        key_bindings: ['Ctrl+M'],
                        tooltip: "Save and checkpoint"
                    }],
                Load: [{
                    "name_text": "Save and Load",
                    "icon_name": "upload",
                    "click_handler": _saveAndLoadModule,
                    key_bindings: ['Ctrl+L'],
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
                    click_handler: async () => {
                        await sendToRepository("tile", _cProp("resource_name"), dialogFuncs, statusFuncs, errorDrawerFuncs)
                    },
                    tooltip: "Share to repository"
                },
                ]
            }
        }
        return ms
    }

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

    function _extraKeys() {
        const ekeys = {
            'Ctrl-s': _saveMe,
            'Ctrl-l': _saveAndLoadModule,
            'Ctrl-m': _saveAndCheckpoint,
            'Ctrl-f': () => {
                search_ref.current.focus();
            },
            'Cmd-f': () => {
                search_ref.current.focus()
            }
        };
        let convertedKeys = convertExtraKeys(ekeys);
        let moreKeys = [
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
        ];
        return [...convertedKeys, ...moreKeys]
    }

    function am_selected() {
        return selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef)
    }

    async function _saveMe() {
        if (!am_selected()) {
            return false
        }
        statusFuncs.startSpinner();
        statusFuncs.statusMessage("Saving nodule");
        try {
            await doSavePromise();
            statusFuncs.stopSpinner();
            statusFuncs.statusMessage("Saved module");
        } catch (e) {
            errorDrawerFuncs.addFromError("Error saving module", e);
            statusFuncs.stopSpinner()
        }
        return false
    }

    function doSavePromise() {
        return new Promise(async function (resolve, reject) {
            const new_code = code_content_ref.current;
            let result_dict;
            result_dict = {
                "tile_module_name": _cProp("resource_name"),
                "new_tile_module": new_code,
                "last_saved": "viewer"
            };
            try {
                let data = await postPromise("host", "update_tile_task", result_dict, props.resource_viewer_id);
                savedContent.current = new_code;
                data.timeout = 2000;
                resolve(data)
            } catch (e) {
                reject(e)
            }
        })
    }

    async function _saveModuleAs() {
        statusFuncs.startSpinner();
        try {
            let data = await postPromise("host", "get_tile_names_task", {"user_id": window.user_id}, props.local_id);
            let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                title: "Save Module As",
                field_title: "New Module Name",
                default_value: "NewModule",
                existing_names: data["tile_names"],
                checkboxes: [],
                handleClose: dialogFuncs.hideModal,
            });
            const result_dict = {
                "new_res_name": new_name,
                "res_to_copy": _cProp("resource_name")
            };
            await postPromise("host", 'create_duplicate_tile_task', result_dict);
            _setResourceNameState(new_name, () => {
                _saveMe()
            });
            statusFuncs.stopSpinner();
        } catch (e) {
            statusFuncs.stopSpinner();
            statusFuncs.clearstatus();
            if (e != "canceled") {
                errorDrawerFuncs.addFromError(`Error saving module`, e)
            }

        }
    }

    async function _saveAndLoadModule() {
        if (!am_selected()) {
            return false
        }
        statusFuncs.startSpinner();
        try {
            await doSavePromise();
            statusFuncs.statusMessage("Loading Module");
            await postPromise("host", "load_tile_module_task",
                {"tile_module_name": _cProp("resource_name"), "user_id": window.user_id},
                props.local_id);
            statusFuncs.statusMessage("Saved and loaded module");
            statusFuncs.stopSpinner();
        } catch (e) {
            errorDrawerFuncs.addFromError("Error saving and loading module", e);
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();

        }
    }

    async function _loadModule() {
        if (!am_selected()) {
            return false
        }
        try {
            statusFuncs.startSpinner();
            statusFuncs.statusMessage("Loading Module");
            await postPromise("host", "load_tile_module_task",
                {"tile_module_name": _cProp("resource_name"), "user_id": window.user_id},
                props.local_id);
            statusFuncs.statusMessage("Loaded module");
            statusFuncs.stopSpinner();
        } catch (e) {
            errorDrawerFuncs.addFromError("Error loading module", e);
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();
        }
    }

    async function _saveAndCheckpoint() {
        if (!am_selected()) {
            return false
        }
        try {
            statusFuncs.startSpinner();
            statusFuncs.statusMessage("Saving...");
            await doSavePromise();
            statusFuncs.statusMessage("Checkpointing...");
            await doCheckpointPromise();
            statusFuncs.stopSpinner();
            statusFuncs.statusMessage("Saved and checkpointed");
        } catch (e) {
            errorDrawerFuncs.addFromError("Error saving and checkpointing", e);
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();

        }
    }

    function doCheckpointPromise() {
        return postPromise("host", "checkpoint_module_task", {"module_name": _cProp("resource_name")});
    }

    function _showHistoryViewer() {
        window.open(`${$SCRIPT_ROOT}/show_history_viewer/${_cProp("resource_name")}`)
    }

    function _showTileDiffer() {
        window.open(`${$SCRIPT_ROOT}/show_tile_differ/${_cProp("resource_name")}`)
    }

    function _dirty() {
        return !(code_content_ref.current == savedContent.current)
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

    let my_props = {...props};
    if (!props.controlled) {
        my_props.resource_name = resource_name;
    }
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
                                   local_id={my_props.local_id}
                                   refreshTab={props.refreshTab}
                                   closeTab={props.closeTab}
                                   res_type="tile"
                                   resource_name={my_props.resource_name}
                                   menu_specs={menu_specs()}
                                   created={props.created}
                                   show_search={false}
                                   showErrorDrawerButton={true}
                >
                    <ReactCodemirror6 code_content={code_content_ref.current}
                                      controlled={true}
                                      show_fold_button={true}
                                      flex_size={true}
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

ModuleViewerApp = memo(ModuleViewerApp);

function module_viewer_main() {
    let local_id = "a" + guid();
    function gotProps(the_props) {
        let ModuleViewerAppPlus = withSettings(withDialogs(withErrorDrawer(withStatus(withAssistant(ModuleViewerApp)))));
        let the_element = <ModuleViewerAppPlus {...the_props}
                                               controlled={false}
                                               changeName={null}
        />;
        let domContainer = document.querySelector('#root');
        const root = createRoot(domContainer);
        root.render(the_element)
    }

    let tsocket = new TacticSocket("main", 5000, "module_viewer", local_id, async () => {
        tsocket.attachListener('handle-callback', (task_packet) => {
            handleCallback(task_packet, local_id)
        });
        let data = {resource_name: resource_name, res_type: "tile", local_id, tsocket};
        data.read_only = window.read_only;
        data.is_repository = window.is_repository;
        module_viewer_props(data, null, gotProps);
    })
}

if (!window.in_context) {
    module_viewer_main();
}
