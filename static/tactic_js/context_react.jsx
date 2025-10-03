// noinspection XmlDeprecatedElement,JSXUnresolvedComponent


import "../tactic_css/tactic.scss";
import "../tactic_css/context.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/tactic_main.scss"
import("../tactic_css/tactic_console.scss");
import "../tactic_css/library_home.scss";
import "../tactic_css/tile_creator.scss";
import "../tactic_css/resource_viewer.scss";
import "../tactic_css/themeable.scss";


import React from "react";
import {useState, useEffect, useRef, useContext, Fragment, useCallback, useMemo} from "react";
import {createRoot} from 'react-dom/client';

import {Spinner, useHotkeys} from "@blueprintjs/core";
import {FocusStyleManager} from "@blueprintjs/core";

FocusStyleManager.onlyShowFocusOnTabs();

import {SelectedPaneContext} from "./utilities_react";
import {TacticSocket} from "./tactic_socket";
import {OpenOmnibar} from "./TacticOmnibar";
import {handleCallback, postPromise} from "./communication_react";
import {doFlash, StatusContext, withStatus} from "./toaster";
import {TacticNavbar} from "./blueprint_navbar";
import {ErrorBoundary} from "./error_boundary";
import {LibraryHomeApp} from "./library_home_react";
import {PoolBrowser} from "./pool_browser";
import {withPool, getBasename} from "./pool_tree";
import {guid} from "./utilities_react";
import {module_viewer_props, ModuleViewerApp} from "./module_viewer_react";
import {CreatorApp} from "./tile_maker_react";
import {creator_props} from "./tile_maker_support"
import {MainApp} from "./main_app"
import {main_props} from "./main_support";
import {NotebookApp} from "./notebook_app";
import {notebook_props} from "./notebook_support"
import {code_viewer_props, CodeViewerApp} from "./code_viewer_react";
import {list_viewer_props, ListViewerApp} from "./list_viewer_react";
import {text_viewer_props, TextViewerApp} from "./text_viewer_react";
import {ErrorDrawerContext, withErrorDrawer} from "./error_drawer";
import {HorizontalPanes} from "./resizing_allotment";
import {usePropertyList} from "./property_list";
import {withAssistant} from "./assistant";
import {Metabook} from "./metabook";
import {
    INIT_CONTEXT_PANEL_WIDTH,
} from "./sizing_tools";
import {useCallbackStack, useStateAndRef} from "./utilities_react";
import {SettingsContext, withSettings} from "./settings"

import {ContextPaneElement, ContextNavigator} from "./context_elements";

import {withDialogs, DialogContext} from "./modal_react";

const spinner_panel = (
    <div style={{height: "100%", position: "absolute", top: "50%", left: "50%"}} key="spinner">
        <Spinner size={100}/>
    </div>);

const propDict = {
    "module-viewer": module_viewer_props,
    "code-viewer": code_viewer_props,
    "list-viewer": list_viewer_props,
    "text-viewer": text_viewer_props,
    "creator-viewer": creator_props,
    "main-viewer": main_props,
    "notebook-viewer": notebook_props
};

const panelRootDict = {
    "module-viewer": "root",
    "code-viewer": "root",
    "list-viewer": "root",
    "text-viewer": "root",
    "creator-viewer": "creator-root",
    "main-viewer": "main-root",
    "notebook-viewer": "main-root"
};

window.global_id = guid();

let tsocket = new TacticSocket("main", 5000, "context", window.global_id);

const classDict = {
    "module-viewer": ModuleViewerApp,
    "code-viewer": CodeViewerApp,
    "list-viewer": ListViewerApp,
    "creator-viewer": CreatorApp,
    "main-viewer": MainApp,
    "notebook-viewer": NotebookApp,
    "text-viewer": TextViewerApp
};

let initialList = [ {
    identifier: "library",
    title: "Library"
}];

if (window.has_pool) {
    initialList.push({
        identifier: "pool",
        title: "Pool"
    })
}

function _context_main() {
    const ContextAppPlus = withPool(withSettings(withDialogs(withErrorDrawer(withStatus(withAssistant(ContextApp))))));
    const domContainer = document.querySelector('#context-root');
    const root = createRoot(domContainer);
    root.render(
        <ContextAppPlus tsocket={tsocket} local_id={window.global_id}/>
    )
}

function ContextApp(props) {
    const [selectedTabId, setSelectedTabId, selectedTabIdRef] = useStateAndRef("library");
    const [tabPanelList, tabPanelListDispatch, tabPanelListRef] = usePropertyList(initialList);

    const [, set_open_resources, open_resources_ref] = useStateAndRef([]);
    const [dirty_methods, set_dirty_methods] = useState({});
    const [metabookState, setMetabookState] = useState({meta_id: null, visible: false, position: "right"});

    const [lastSelectedTabId, setLastSelectedTabId] = useState(null);
    const [showOpenOmnibar, setShowOpenOmnibar] = useState(false);

    const settingsContext = useContext(SettingsContext);
    const dialogFuncs = useContext(DialogContext);
    const statusFuncs = useContext(StatusContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);

    const [tabSelectCounter, setTabSelectCounter] = useState(0);

    const omniItemsRef = useRef({});

    const top_ref = useRef(null);

    const hotkeys = useMemo(
        () => [
            {
                combo: "Tab",
                global: true,
                label: "Go To Next Pane",
                onKeyDown: _goToNextPane
            },
            {
                combo: "Shift+Tab",
                global: true,
                label: "Go To Previous Pane",
                onKeyDown: _goToPreviousPane
            },
            {
                combo: "Ctrl+Space",
                global: true,
                label: "Show Omnibar",
                onKeyDown: _showOpenOmnibar,
            },
            {
                combo: "Ctrl+W",
                global: true,
                label: "Close Tab",
                onKeyDown: async () => {
                    await _closeTab(selectedTabIdRef.current)
                }
            }
        ], [_goToNextPane, _goToPreviousPane, _showOpenOmnibar, _closeTab, selectedTabIdRef.current],
    );

    const {handleKeyDown, handleKeyUp} = useHotkeys(hotkeys);
    const pushCallback = useCallbackStack("context");

    useEffect(() => {
        initSocket();
        _addContextOmniItems();
        errorDrawerFuncs.registerGoToModule(_goToModule);
        return (() => {
            tsocket.disconnect()
        })
    }, []);

    useEffect(() => {  // for mount
        window.addEventListener("beforeunload", function (e) {
            e.preventDefault();
            e.returnValue = 'Are you sure you want to close? All changes will be lost.'
        });
    }, []);

    function _registerDirtyMethod(tab_id, dirty_method) {
        let new_dirty_methods = {...dirty_methods};
        new_dirty_methods[tab_id] = dirty_method;
        set_dirty_methods(new_dirty_methods)
    }

    function initSocket() {
        props.tsocket.attachListener("window-open", data => {
                window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`)
            }
        );
        props.tsocket.attachListener('close-user-windows', data => {
            if (!(data["originator"] === window.global_id)) {
                window.close()
            }
        });
        props.tsocket.attachListener("doFlashUser", function (data) {
            doFlash(data)
        });
        props.tsocket.attachListener('handle-callback', (task_packet) => {
            handleCallback(task_packet,  props.local_id)
        });
    }

    function getItemFromdentifier(identifier) {
        for (let item of tabPanelListRef.current) {
            if (item.identifier === identifier) {
                return item
            }
        }
        return null
    }

    async function _refreshTab(the_id) {
        if (the_id === "library") {
            return
        }
        try {
            const item = getItemFromdentifier(the_id);
            const title = item.title;
            if (!(the_id in dirty_methods) || dirty_methods[the_id]()) {
                const confirm_text = `Are you sure that you want to reload the tab ${title}? Changes will be lost`;
                await dialogFuncs.showModalPromise("ConfirmDialog", {
                    title: `Reload the tab ${title}`,
                    text_body: confirm_text,
                    cancel_text: "do nothing",
                    submit_text: "reload",
                    handleClose: dialogFuncs.hideModal,
                });
            }
            let old_tab_panel = {...item};
            let resource_name = old_tab_panel.panel.resource_name;
            let res_type;
            const drmethod = (dmethod) => {
                _registerDirtyMethod(the_id, dmethod)
            };
            let data;
            if (old_tab_panel.kind === "notebook-viewer" && !old_tab_panel.panel.is_project) {
                res_type = "new-notebook";
                // data = await postPromise("host", "initiate_new_notebook_in_context", {})
            }
            else if (old_tab_panel.kind === "main-viewer" && !old_tab_panel.panel.is_project
                && old_tab_panel.panel.original_res_type != "collection") {
                res_type = "new-project";
                // data = await postPromise("host", "initiate_new_project_in_context", {})
            }
            else {
                res_type = old_tab_panel.panel.original_res_type
            }

            data = await getViewerDataForResSocket(res_type, resource_name, null, old_tab_panel.panel.file_path);
            await _updatePanelPromise(the_id, {panel: "spinner"});
            propDict[data.kind](data, drmethod, (new_panel) => {
                new_panel.original_res_type = res_type;
                _updatePanel(the_id, {panel: new_panel, kind: data.kind});
            });
        } catch (e) {
            if (String(e) !== "canceled") {
                errorDrawerFuncs.addFromError(`Error refreshing pane`, e)
            }
        }
    }

    function getViewerDataForResSocket(res_type, resource_name, temp_data_id = null, file_path = null) {
        let new_viewer_id = "a" + guid();
        return new Promise((resolve, reject) => {
            let tsocket = new TacticSocket("main", 5000, resource_name, new_viewer_id, async () => {
                tsocket.attachListener('handle-callback', (task_packet) => {
                    handleCallback(task_packet, new_viewer_id)
                });
                await getViewerDataForRes(res_type, resource_name, tsocket, new_viewer_id, temp_data_id,
                    file_path, resolve)
            })
        })
    }

    async function getViewerDataForRes(res_type, resource_name, tsocket, new_viewer_id, temp_data_id = null,
                                       file_path = null, resolve = null) {
        let data;
        if (["list", "code", "text"].includes(res_type)) {
            data = {
                kind: `${res_type}-viewer`,
                resource_name: file_path == null ? resource_name : getBasename(file_path),
                res_type: res_type,
                local_id: new_viewer_id,
                file_path: file_path
            };
        }
        else {
            switch (res_type) {
                case "raw-tile":
                    data = {
                        kind: "module-viewer",
                        resource_name: resource_name,
                        res_type: "tile",
                        original_res_type: "raw-tile",
                        local_id: new_viewer_id
                    };
                    break;
                case "tile":
                    let ls_result = await postPromise("host", "get_last_saved_task", {tile_module_name: resource_name});
                    let last_saved = ls_result.last_saved;
                    if (last_saved == "creator") {
                        data = await postPromise("host", "initiate_creator_in_context",
                            {tile_module_name: resource_name, local_id: new_viewer_id});
                    }
                    else {
                        data = {
                            kind: "module-viewer",
                            resource_name: resource_name,
                            res_type: "tile",
                            original_res_type: "raw-tile",
                            local_id: new_viewer_id
                        };
                    }
                    break;
                case "collection":
                    data = await postPromise("host", "initiate_collection_in_context", {collection_name: resource_name,
                        local_id: new_viewer_id});
                    break;
                case "project":
                    data = await postPromise("host", "initiate_project_in_context", {project_name: resource_name,
                        local_id: new_viewer_id});
                    break;
                case "new-notebook":
                    if (temp_data_id) {
                        data = await postPromise("host", "initiate_new_notebook_in_context", {temp_data_id: temp_data_id,
                            local_id: new_viewer_id});
                    } else {
                        data = await postPromise("host", "initiate_new_notebook_in_context", {local_id: new_viewer_id});
                    }
                    break;
                case "new-project":
                    data = await postPromise("host", "initiate_new_project_in_context", {local_id: new_viewer_id});
                    break;
                case "text":
                    data = await postPromise("host", "initiate_text_viewer_in_context", {"file_path": file_path});
                    break;
                default:
                    data = {}

            }
        }
        data.original_res_type = res_type;
        data.file_path = file_path;
        data.tsocket = tsocket;
        data.read_only = false;
        data.is_repository = false;
        if (resolve) {
            resolve(data);
        }
        else {
             return data
        }
    }

    async function _closeTab(the_id) {
        if (the_id === "library") {
            return
        }
        const item = getItemFromdentifier(the_id);
        try {
            if (!(the_id in dirty_methods) || dirty_methods[the_id]()) {
                const title = item.title;
                const confirm_text = `Are you sure that you want to close the tab ${title}? Changes will be lost`;
                await dialogFuncs.showModalPromise("ConfirmDialog", {
                    title: `Close the tab ${title}"`,
                    text_body: confirm_text,
                    cancel_text: "do nothing",
                    submit_text: "close",
                    handleClose: dialogFuncs.hideModal,
                });
            }
            tabPanelListDispatch({type: "delete_item", identifier: the_id});

            let copied_dirty_methods = {...dirty_methods};
            delete copied_dirty_methods[the_id];
            set_dirty_methods(copied_dirty_methods);
            if (the_id in omniItemsRef.current) {
                delete omniItemsRef.current[the_id];
            }

            pushCallback(() => {
                if (the_id === selectedTabIdRef.current) {
                    let newSelectedId;
                    if (lastSelectedTabId && getItemFromdentifier(lastSelectedTabId)) {
                        newSelectedId = lastSelectedTabId;
                    } else {
                        newSelectedId = "library"
                    }
                    setSelectedTabId(newSelectedId);
                    setLastSelectedTabId("library");
                } else {
                    setSelectedTabId(selectedTabId);
                    if (lastSelectedTabId === the_id) {
                        setLastSelectedTabId("library")
                    }
                }
            });
        } catch (e) {
            if (e !== "canceled") {
                errorDrawerFuncs.addFromError(`Error closing tab`, e)
            }
        }
    }

    function _addPanel(new_id, viewer_kind, res_type, title, new_panel, callback = null, data = null) {
        new_panel = {
            kind: viewer_kind, res_type: res_type, title: title,
            panel: new_panel, data: data, identifier: new_id
        };
        tabPanelListDispatch({type: "add_at_end", new_item: new_panel});
        setLastSelectedTabId(selectedTabIdRef.current);
        setSelectedTabId(new_id);
        pushCallback(() => {
            _updateOpenResources(callback);
        });
    }

    function _addPanelPromise(new_id, viewer_kind, res_type, title, new_panel, data = null) {
        return new Promise(function (resolve) {
            _addPanel(new_id, viewer_kind, res_type, title, new_panel, resolve, data)
        })
    }

    function _updatePanel(the_id, new_panel, callback = null) {

        let lnew_panel = getItemFromdentifier(the_id);
        for (let k in new_panel) {
            if (k !== "panel") {
                lnew_panel[k] = new_panel[k]
            }
        }
        if ("panel" in new_panel) {
            if (new_panel.panel === "spinner") {
                lnew_panel.panel = "spinner";
            } else if (lnew_panel.panel !== "spinner") {
                lnew_panel.panel = {...lnew_panel.panel, ...new_panel.panel}
            } else {
                lnew_panel.panel = new_panel.panel
            }
        }
        tabPanelListDispatch({type: "update_item", identifier: the_id, new_item: lnew_panel});
        pushCallback(() => {
            _updateOpenResources(callback)
        });
    }

    function _updatePanelPromise(the_id, new_panel) {
        return new Promise(function (resolve) {
            _updatePanel(the_id, new_panel, resolve)
        })
    }

    function _changeResourceName(the_id, new_name, change_title = true, callback = null) {
        let lnew_panel = {...getItemFromdentifier(the_id)};
        if (change_title) {
            lnew_panel.title = new_name;
        }
        lnew_panel.panel.resource_name = new_name;
        tabPanelListDispatch({type: "update_item", identifier: the_id, new_item: lnew_panel});
        pushCallback(() => {
            _updateOpenResources(callback)
        });
    }

    function isStandardTab(entry) {
        return ["library", "pool"].includes(entry.identifier)
    }

    function _getResourceId(res_name, res_type) {
        for (let the_panel of tabPanelListRef.current) {
            if (isStandardTab(the_panel)) {
                continue
            }
            if (the_panel.panel.resource_name === res_name && the_panel.res_type === res_type) {
                return the_panel.identifier
            }
        }
        return -1
    }

    function _showOpenOmnibar() {
        setShowOpenOmnibar(true)
    }

    function _closeOpenOmnibar() {
        setShowOpenOmnibar(false)
    }

    function _setCurrentMetabook(meta_id) {
        setMetabookState({
            meta_id: meta_id,
            visible: true
        });
    }

    const handleCreateViewer = useCallback(async (res_type, resource_name, callback = null, temp_data_id = null, file_path = null) => {
        let existing_id = _getResourceId(resource_name, resource_name);
        if (existing_id !== -1) {
            setSelectedTabId(existing_id);
            pushCallback(callback);
            return
        }
        const new_id = "a" + guid();
        const drmethod = (dmethod) => {
            _registerDirtyMethod(new_id, dmethod)
        };
        let data = await getViewerDataForResSocket(res_type, resource_name, temp_data_id, file_path);
        await _addPanelPromise(new_id, data.kind, data.res_type, data.resource_name, "spinner");
        propDict[data.kind](data, drmethod, (new_panel) => {
            new_panel.original_res_type = res_type;
            if (callback != null) {
                _updatePanel(new_id, {panel: new_panel}, () => {
                    callback(data.local_id)
                });
            }
            else {
                _updatePanel(new_id, {panel: new_panel});
            }
        });
    }, []);

    function getIdList() {
        return tabPanelListRef.current.map((item) => item.identifier)
    }

    function _goToNextPane(e) {
        let templist = getIdList();
        let newId;
        let tabIndex = templist.indexOf(selectedTabIdRef.current) + 1;
        newId = tabIndex === templist.length ? "library" : templist[tabIndex];
        _handleTabSelect(newId);
        if (e) {
            e.preventDefault()
        }
    }

    function _goToPreviousPane(e) {
        let templist = getIdList();
        let tabIndex = templist.indexOf(selectedTabIdRef.current) - 1;
        let newId = tabIndex === -1 ? templist.at(-1) : templist[tabIndex];
        _handleTabSelect(newId);
        if (e) {
            e.preventDefault();
        }
    }

    function _handleTabSelect(newTabId, callback = null) {
        setSelectedTabId(newTabId);
        setLastSelectedTabId(selectedTabIdRef.current,);
        pushCallback(() => {
            setTabSelectCounter(tabSelectCounter + 1);
            if (callback) {
                callback();
            }
        });
    }

    async function _goToModule(module_name, line_number) {
        for (let pdict of tabPanelListRef.current) {
            if (pdict.kind === "creator-viewer" && pdict.panel.resource_name === module_name) {
                _handleTabSelect(pdict.identifier, () => {
                    if ("line_setter" in pdict) {
                        pdict.line_setter(line_number)
                    }
                });
                return
            }
        }
        let data;
        try {
            data = await getViewerDataForResSocket("tile", resource_name);
            const new_id = `${data.kind}: ${data.resource_name}`;
            const drmethod = (dmethod) => {
                _registerDirtyMethod(new_id, dmethod)
            };
            await _addPanelPromise(new_id, data.kind, data.res_type, data.resource_name, "spinner");
            propDict[data.kind](data, drmethod, (new_panel) => {
                new_panel.original_res_type = "tile";
                _updatePanel(new_id, {panel: new_panel});
            });
        } catch (e) {
            errorDrawerFuncs.addFromError(`Error going to module ${module_name}`, e)
        }
    }

    function _registerLineSetter(tab_id, rfunc) {
        _updatePanel(tab_id, {line_setter: rfunc})
    }

    function _getOpenResources() {
        let open_resources = [];
        for (let entry of tabPanelListRef.current) {
            if (!isStandardTab(entry) && entry.panel !== "spinner") {
                open_resources.push({
                    id: entry.identifier,
                    resource_name: entry.panel.resource_name,
                    res_type: entry.res_type,
                    local_id: entry.panel.local_id
                });
            }

        }
        return open_resources
    }

    function _updateOpenResources(callback = null) {
        set_open_resources(_getOpenResources());
        pushCallback(callback);
    }

    function _addOmniItems(tid, items) {
        if (!(tid in omniItemsRef.current)) {
            omniItemsRef.current[tid] = []
        }
        omniItemsRef.current[tid] = omniItemsRef.current[tid].concat(items);
    }

    function _addContextOmniItems() {
        let omni_funcs = [
            ["Go To Next Panel", "context", _goToNextPane, "arrow-right"],
            ["Go To Previous Panel", "context", _goToPreviousPane, "arrow-left"],
        ];

        let omni_items = [];
        for (let item of omni_funcs) {
            omni_items.push(
                {
                    category: "Global",
                    display_text: item[0],
                    search_text: item[0],
                    icon_name: item[3],
                    the_function: item[2],
                    item_type: "command"
                }
            )
        }
        _addOmniItems("global", omni_items)
    }

    function amSelected(ltab_id, lselectedTabIdRef) {
        return !window.in_context || ltab_id === lselectedTabIdRef.current
    }

    const library_panel = (
        <SelectedPaneContext.Provider  key="library" value={{
                tab_id: "library",
                selectedTabIdRef,
                amSelected,
                addOmniItems: (items)=>{_addOmniItems("libary", items)}
            }}>
            <ContextPaneElement identifier="library">
                <div id="library-home-root"
                    style={{display: "flex", flexDirection: "column",
                        position: "relative",
                        height: "100%",
                        width: "100%"}}>
                    <LibraryHomeApp tsocket={tsocket}
                                    library_style={window.library_style}
                                    controlled={true}
                                    am_selected={selectedTabIdRef.current === "library"}
                                    open_resources_ref={open_resources_ref}
                                    handleCreateViewer={handleCreateViewer}
                                    setCurrentMetabook={_setCurrentMetabook}
                    />
                </div>
        </ContextPaneElement>
        </SelectedPaneContext.Provider>
    );


    let all_panels = [library_panel];
    if (window.has_pool) {
        const pool_panel = (
        <SelectedPaneContext.Provider key="pool" value={{
                tab_id: "pool",
                selectedTabIdRef,
                amSelected,
                addOmniItems: (items)=>{_addOmniItems("pool", items)}
            }}>
            <ContextPaneElement
                identifier="pool">
                <PoolBrowser tsocket={tsocket}
                         am_selected={selectedTabIdRef.current === "pool"}
                         getOpenResources={_getOpenResources}
                         setSelectedTabId={setSelectedTabId}
                         handleCreateViewer={handleCreateViewer}/>
            </ContextPaneElement>
            </SelectedPaneContext.Provider>
        );

        all_panels.push(pool_panel)
    }


    const _omni_view_func = useCallback(async (item) => {
        statusFuncs.setStatus({show_spinner: true, status_message: "Opening ..."});
        if (window.in_context) {
            try {
                await handleCreateViewer(item.res_type, item.name, statusFuncs.clearStatus);
            } catch (e) {
                statusFuncs.clearStatus();
                errorDrawerFuncs.addFromError(`Error following ${the_view}`, e)

            }
        } else {
            statusFuncs.clearStatus();
            window.open($SCRIPT_ROOT + the_view + item.name)
        }
    }, []);

    for (let entry of tabPanelListRef.current) {
        let wrapped_panel;
        if (["library", "pool"].includes(entry.identifier)) {
            continue
        }
        if (entry.panel === "spinner") {
            wrapped_panel = spinner_panel
        } else {
            let TheClass = classDict[entry.kind];
            let the_panel = (
                <SelectedPaneContext.Provider value={{
                        tab_id: entry.identifier,
                        selectedTabIdRef,
                        amSelected,
                        addOmniItems: (items)=>{_addOmniItems(entry.identifier, items)}
                    }}>
                    <ContextPaneElement
                        identifier={entry.identifier}>
                        <TheClass {...entry.panel}
                                  controlled={true}
                                  handleCreateViewer={handleCreateViewer}
                                  tab_id={entry.identifier}
                                  selectedTabIdRef={selectedTabIdRef}
                                  changeResourceName={(new_name, callback = null, change_title = true) => {
                                      _changeResourceName(entry.identifier, new_name, change_title, callback)
                                  }}
                                  updatePanel={(new_panel, callback = null) => {
                                      _updatePanel(entry.identifier, new_panel, callback)
                                  }}
                                  goToModule={_goToModule}
                                  registerLineSetter={(rfunc) => _registerLineSetter(entry.identifier, rfunc)}
                                  refreshTab={async () => {
                                      await _refreshTab(entry.identifier)
                                  }}
                                  closeTab={async () => {
                                      await _closeTab(entry.identifier)
                                  }}
                                  tsocket={entry.panel.tsocket}
                        />
                    </ContextPaneElement>
                </SelectedPaneContext.Provider>
            );
            wrapped_panel = (
                <Fragment key={entry.identifier}>
                    <ErrorBoundary>
                        <div id={`${entry.identifier}-holder`}
                             style={{display: "flex", flexDirection: "column",
                                position: "relative",
                                height: selectedTabIdRef.current == entry.identifier ? "100%" : 0,
                                width: "100%"}}
                                className={panelRootDict[entry.kind]}>
                            {the_panel}
                        </div>
                    </ErrorBoundary>
                </Fragment>
            );
        }

        all_panels.push(wrapped_panel);
    }

    let sid = selectedTabIdRef.current;
    let commandItems = omniItemsRef.current["global"];
    if (sid in omniItemsRef.current) {
        commandItems = commandItems.concat(omniItemsRef.current[sid])
    }
    let left_pane = (
        <ContextNavigator
            handleTabSelect={_handleTabSelect}
            selectedItem={selectedTabIdRef.current}
            closeTab={_closeTab}
            refreshTab={_refreshTab}
            dispatch={tabPanelListDispatch}
            tabPanelList={tabPanelList}
        />
    );
    let right_main_panes = (
        <Fragment>
            {all_panels}
        </Fragment>
    );

    let right_pane;

    if (metabookState.visible) {
        let right_metabook_pane = (
            <Metabook {...metabookState} tsocket={tsocket}/>
        );
        right_pane = (
            <HorizontalPanes left_pane={right_main_panes}
                             snap_left={true}
                             minWidth={100}
                             right_pane={right_metabook_pane}
                             show_handle={true}
                             widths={[window.innerWidth - INIT_CONTEXT_PANEL_WIDTH - 200, 200]}
                             handleResizeEnd={null}
            />
        )
    }
    else {
        right_pane = right_main_panes
    }

    let outer_class = `pane-holder ${settingsContext.isDark() ? "bp6-dark" : "light-theme"}`;
    let outer_style = {
        width: "100%",
        height: "100%",
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'row',
        paddingLeft: 0,
        position: "relative"
    };

    return (
        <div style={{display: "flex", flexDirection: "column",
            position: "relative",
            height: "100%",
            width: "100%"}}>
            <TacticNavbar is_authenticated={window.is_authenticated}
                          selected={null}
                          show_api_links={false}
                          extra_text={window.database_type === "Local" ? "" : window.database_type}
                          global_id={props.global_id}
                          user_name={window.username}/>
            <div className={outer_class} tabIndex="0" style={outer_style} ref={top_ref}
                 id="context-container"
                 onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>

                <HorizontalPanes left_pane={left_pane}
                                 snap_left={true}
                                 minWidth={100}
                                 right_pane={right_pane}
                                 show_handle={true}
                                 widths={[INIT_CONTEXT_PANEL_WIDTH, window.innerWidth - INIT_CONTEXT_PANEL_WIDTH]}
                                 initial_width_fraction={.1}
                                 handleResizeEnd={null}
                />
            </div>
                <SelectedPaneContext.Provider value={{
                    tab_id: sid,
                    selectedTabIdRef,
                    amSelected,
                    addOmniItems: (items)=>{_addOmniItems(sid, items)}
                }}>
                    <OpenOmnibar commandItems={commandItems}
                                 local_id={props.local_id}
                                 showOmnibar={showOpenOmnibar}
                                 openFunc={_omni_view_func}
                                 is_authenticated={window.is_authenticated}
                                 closeOmnibar={_closeOpenOmnibar}/>

                </SelectedPaneContext.Provider>
        </div>
    );
}

_context_main();
