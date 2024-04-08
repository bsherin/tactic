// noinspection XmlDeprecatedElement,JSXUnresolvedComponent

import "../tactic_css/tactic.scss";
import "../tactic_css/context.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/library_home.scss";
import "../tactic_css/tile_creator.scss";

import React from "react";
import { useState, useEffect, useRef, useContext, Fragment, useCallback } from "react";
import * as ReactDOM from 'react-dom'

import {Tab, Tabs, Button, Icon, Spinner} from "@blueprintjs/core";
import {FocusStyleManager} from "@blueprintjs/core";

FocusStyleManager.onlyShowFocusOnTabs();

import {SelectedPaneContext} from "./utilities_react";
import {TacticSocket} from "./tactic_socket";
import {OpenOmnibar} from "./TacticOmnibar";
import {handleCallback} from "./communication_react";
import {doFlash, StatusContext, withStatus} from "./toaster";
import {TacticNavbar} from "./blueprint_navbar";
import {ErrorBoundary} from "./error_boundary";
import {icon_dict} from "./blueprint_mdata_fields";
import {LibraryHomeApp} from "./library_home_react";
import {PoolBrowser} from "./pool_browser";
import {view_views} from "./library_pane";
import {guid} from "./utilities_react";
import {module_viewer_props, ModuleViewerApp} from "./module_viewer_react";
import {CreatorApp} from "./tile_creator_react";
import {creator_props} from "./tile_creator_support"
import {MainApp} from "./main_app"
import {main_props} from "./main_support";
import {NotebookApp} from "./notebook_app";
import {notebook_props} from "./notebook_support"
import {code_viewer_props, CodeViewerApp} from "./code_viewer_react";
import {list_viewer_props, ListViewerApp} from "./list_viewer_react";
import {ErrorDrawerContext, withErrorDrawer} from "./error_drawer";
import {withAssistant} from "./assistant";
import {SizeContext, getUsableDimensions, USUAL_NAVBAR_HEIGHT, INIT_CONTEXT_PANEL_WIDTH} from "./sizing_tools";
import {postAjaxPromise} from "./communication_react";
import {KeyTrap} from "./key_trap";
import {DragHandle} from "./resizing_layouts";
import {useCallbackStack, useStateAndRef, useDebounce, useStateAndRefAndCounter} from "./utilities_react";
import {ThemeContext, withTheme} from "./theme"

import {withDialogs, DialogContext} from "./modal_react";

const spinner_panel = (
    <div style={{height: "100%", position: "absolute", top: "50%", left: "50%"}}>
        <Spinner size={100}/>
    </div>);

const MIN_CONTEXT_WIDTH = 45;
const MIN_CONTEXT_SAVED_WIDTH = 100;

const iconDict = {
    "module-viewer": "application",
    "code-viewer": "code",
    "list-viewer": "list",
    "creator-viewer": "application",
    "main-viewer": "projects",
    "notebook-viewer": "projects"
};

const libIconDict = {
    all: icon_dict["all"],
    collections: icon_dict["collection"],
    projects: icon_dict["project"],
    tiles: icon_dict["tile"],
    lists: icon_dict["list"],
    code: icon_dict["code"],
    pool: icon_dict["pool"],
};
const propDict = {
    "module-viewer": module_viewer_props,
    "code-viewer": code_viewer_props,
    "list-viewer": list_viewer_props,
    "creator-viewer": creator_props,
    "main-viewer": main_props,
    "notebook-viewer": notebook_props
};

const panelRootDict = {
    "module-viewer": "root",
    "code-viewer": "root",
    "list-viewer": "root",
    "creator-viewer": "creator-root",
    "main-viewer": "main-root",
    "notebook-viewer": "main-root"
};

window.context_id = guid();
window.main_id = window.context_id;

let tsocket = new TacticSocket("main", 5000, "context", window.context_id);

const classDict = {
    "module-viewer": ModuleViewerApp,
    "code-viewer": CodeViewerApp,
    "list-viewer": ListViewerApp,
    "creator-viewer": CreatorApp,
    "main-viewer": MainApp,
    "notebook-viewer": NotebookApp
};

function _context_main() {
    const ContextAppPlus = withTheme(withDialogs(withAssistant(withErrorDrawer(withStatus(ContextApp)))));
    const domContainer = document.querySelector('#context-root');
    ReactDOM.render(<ContextAppPlus initial_theme={window.theme} tsocket={tsocket}/>, domContainer)
}

function ContextApp(props) {
    const [selectedTabId, setSelectedTabId, selectedTabIdRef, selectedTabIdCounter] = useStateAndRefAndCounter("library");
    const [saved_width, set_saved_width] = useState(INIT_CONTEXT_PANEL_WIDTH);

    const [tab_panel_dict, set_tab_panel_dict, tab_panel_dict_ref] = useStateAndRef({});
    const [tab_ids, set_tab_ids, tab_ids_ref] = useStateAndRef([]);

    const [open_resources, set_open_resources, open_resources_ref] = useStateAndRef([]);
    const [dirty_methods, set_dirty_methods] = useState({});

    const [lastSelectedTabId, setLastSelectedTabId] = useState(null);
    const [usable_width, set_usable_width] = useState(() => {
        return getUsableDimensions(true).usable_width - INIT_CONTEXT_PANEL_WIDTH
    });
    const [usable_height, set_usable_height] = useState(() => {
        return getUsableDimensions(true).usable_height_no_bottom
    });
    const [paneX, setPaneX] = useState(170);
    const [paneY, setPaneY] = useState(USUAL_NAVBAR_HEIGHT);
    const [tabWidth, setTabWidth] = useState(INIT_CONTEXT_PANEL_WIDTH);
    const [show_repository, set_show_repository] = useState(false);
    const [dragging_over, set_dragging_over] = useState(null);
    const [currently_dragging, set_currently_dragging] = useState(null);
    const [showOpenOmnibar, setShowOpenOmnibar] = useState(false);

    const theme = useContext(ThemeContext);
    const dialogFuncs = useContext(DialogContext);
    const statusFuncs = useContext(StatusContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);

    const [tabSelectCounter, setTabSelectCounter] = useState(0);

    const omniItemsRef = useRef({});

    const top_ref = useRef(null);

    const key_bindings = [
        [["tab"], _goToNextPane],
        [["shift+tab"], _goToPreviousPane],
        [["ctrl+space"], _showOpenOmnibar],
        [["ctrl+w"], async () => {
            await _closeTab(selectedTabIdRef.current)
        }]
    ];

    const pushCallback = useCallbackStack("context");

    useEffect(() => {
        initSocket();
        _addContextOmniItems();
        errorDrawerFuncs.registerGoToModule(_goToModule);
        return (() => {
            tsocket.disconnect()
        })
    }, []);

    const [waiting, doResize] = useDebounce(() => {
        _update_window_dimensions(null)
    }, 0);

    useEffect(() => {  // for mount
        window.addEventListener("resize", () => _update_window_dimensions(null));
        window.addEventListener("beforeunload", function (e) {
            e.preventDefault();
            e.returnValue = 'Are you sure you want to close? All changes will be lost.'
        });

        _update_window_dimensions(null);
        const tab_list_elem = document.querySelector("#context-container .context-tab-list > .bp5-tab-list");
        const resizeObserver = new ResizeObserver(entries => {
            _update_window_dimensions(null)
        });
        if (tab_list_elem) {
            resizeObserver.observe(tab_list_elem)
        }

    }, []);

    useEffect(() => {
        _update_window_dimensions(null)
    }, [selectedTabId]);

    function get_tab_list_elem() {
        return document.querySelector("#context-container .context-tab-list > .bp5-tab-list");
    }

    function _togglePane(pane_closed) {
        let w = pane_closed ? saved_width : MIN_CONTEXT_WIDTH;
        let tab_elem = get_tab_list_elem();
        tab_elem.setAttribute("style", `width:${w}px`);
        pushCallback(_update_window_dimensions)
    }

    function _handleTabResize(e, ui, lastX, lastY, dx, dy) {
        let tab_elem = get_tab_list_elem();
        let w = lastX > window.innerWidth / 2 ? window.innerWidth / 2 : lastX;
        w = w <= MIN_CONTEXT_WIDTH ? MIN_CONTEXT_WIDTH : w;
        tab_elem.setAttribute("style", `width:${w}px`);
    }

    function _handleTabResizeStart(e, ui, lastX, lastY, dx, dy) {
        let new_width = Math.max(tabWidth, MIN_CONTEXT_SAVED_WIDTH);
        if (new_width != saved_width) {
            set_saved_width(new_width)
        }
    }

    function _handleTabResizeEnd(e, ui, lastX, lastY, dx, dy) {
        let tab_elem = get_tab_list_elem();

        let tab_rect = tab_elem.getBoundingClientRect();
        if (tab_rect.width > 45) {
            let new_width = Math.max(tab_rect.width, MIN_CONTEXT_SAVED_WIDTH);
            if (new_width != saved_width) {
                set_saved_width(new_width)
            }
        }
        pushCallback(_update_window_dimensions)
    }

    function _update_window_dimensions(callback = null) {
        const tab_list_elem = get_tab_list_elem();
        let uwidth;
        let uheight;
        let tWidth;
        let top_rect;
        if (top_ref && top_ref.current) {
            top_rect = top_ref.current.getBoundingClientRect();
            uheight = window.innerHeight - top_rect.top
        } else {
            uheight = window.innerHeight - USUAL_NAVBAR_HEIGHT
        }
        if (tab_list_elem) {
            let tab_rect = tab_list_elem.getBoundingClientRect();
            uwidth = window.innerWidth - tab_rect.width;
            tWidth = tab_rect.width
        } else {
            uwidth = window.innerWidth - 150;
            tWidth = 150
        }
        set_usable_height(uheight);
        set_usable_width(uwidth);
        setPaneX(tWidth);
        setPaneY(top_ref.current ? top_rect.top : USUAL_NAVBAR_HEIGHT);
        setTabWidth(tWidth);
        statusFuncs.setLeftEdge(tWidth);
        pushCallback(callback);
    }

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
            if (!(data["originator"] === window.context_id)) {
                window.close()
            }
        });
        props.tsocket.attachListener("doFlashUser", function (data) {
            doFlash(data)
        });
        props.tsocket.attachListener('handle-callback', (task_packet) => {
            handleCallback(task_packet, window.context_id)
        });
        props.tsocket.attachListener("create-viewer", _handleCreateViewer);
    }

    async function _refreshTab(the_id) {
        if (the_id == "library") {
            return
        }
        try {
            if (!(the_id in dirty_methods) || dirty_methods[the_id]()) {
                const title = tab_panel_dict_ref.current[the_id].title;
                const confirm_text = `Are you sure that you want to reload the tab ${title}? Changes will be lost`;
                await dialogFuncs.showModalPromise("ConfirmDialog", {
                    title: `Reload the tab ${title}`,
                    text_body: confirm_text,
                    cancel_text: "do nothing",
                    submit_text: "reload",
                    handleClose: dialogFuncs.hideModal,
                    });
            }
            let old_tab_panel = {...tab_panel_dict_ref.current[the_id]};
            let resource_name = old_tab_panel.panel.resource_name;
            let res_type = old_tab_panel.res_type;
            let the_view;
            if (old_tab_panel.kind == "notebook-viewer" && !old_tab_panel.panel.is_project) {
                the_view = "/new_notebook_in_context/"
            } else {
                the_view = view_views()[res_type];
                const re = new RegExp("/$");
                the_view = the_view.replace(re, "_in_context");
            }
            const drmethod = (dmethod) => {
                _registerDirtyMethod(the_id, dmethod)
            };
            await _updatePanelPromise(the_id, {panel: "spinner"});
            let data = await postAjaxPromise($SCRIPT_ROOT + the_view, {context_id: window.context_id, resource_name: resource_name});
            let new_panel = propDict[data.kind](data, drmethod, (new_panel) => {
                _updatePanel(the_id, {panel: new_panel, kind: data.kind});
            });
        }
        catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError(`Error refreshing pane`, e)
            }
        }
    }

    async function _closeTab(the_id) {
        if (the_id == "library") {
            return
        }
        try {
            if (!(the_id in dirty_methods) || dirty_methods[the_id]()) {
                const title = tab_panel_dict_ref.current[the_id].title;
                const confirm_text = `Are you sure that you want to close the tab ${title}? Changes will be lost`;
                await dialogFuncs.showModalPromise("ConfirmDialog", {
                    title: `Close the tab ${title}"`,
                    text_body: confirm_text,
                    cancel_text: "do nothing",
                    submit_text: "close",
                    handleClose: dialogFuncs.hideModal,
                });
            }
            let idx = tab_ids_ref.current.indexOf(the_id);
            let copied_tab_panel_dict = {...tab_panel_dict_ref.current};
            let copied_tab_ids = [...tab_ids_ref.current];
            let copied_dirty_methods = {...dirty_methods};
            if (idx > -1) {
                copied_tab_ids.splice(idx, 1);
                delete copied_tab_panel_dict[the_id];
                delete copied_dirty_methods[the_id];
            }
            set_tab_ids(copied_tab_ids);
            set_dirty_methods(copied_dirty_methods);
            set_tab_panel_dict(copied_tab_panel_dict);
            if (the_id in omniItemsRef.current) {
                delete omniItemsRef.current[the_id];
            }

            pushCallback(() => {
                if (the_id == selectedTabIdRef.current) {
                    let newSelectedId;
                    if (lastSelectedTabId && copied_tab_ids.includes(lastSelectedTabId)) {
                        newSelectedId = lastSelectedTabId;
                    } else {
                        newSelectedId = "library"
                    }
                    setSelectedTabId(newSelectedId);
                    setLastSelectedTabId("library");
                } else {
                    setSelectedTabId(selectedTabId);
                    if (lastSelectedTabId == the_id) {
                        setLastSelectedTabId("library")
                    }
                }
                pushCallback(() => {
                    _updateOpenResources(() => _update_window_dimensions())
                })
            });
        }
        catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError(`Error closing tab`, e)
            }
        }
    }

    function _addPanel(new_id, viewer_kind, res_type, title, new_panel, callback = null) {
        let new_tab_panel_dict = {...tab_panel_dict_ref.current};
        new_tab_panel_dict[new_id] = {
            kind: viewer_kind, res_type: res_type, title: title,
            panel: new_panel,
        };
        set_tab_panel_dict(new_tab_panel_dict);
        const new_tab_ids = [...tab_ids_ref.current, new_id];
        set_tab_ids(new_tab_ids);
        setLastSelectedTabId(selectedTabIdRef.current);
        setSelectedTabId(new_id);
        pushCallback(() => {
            _updateOpenResources(callback);
        });
    }
    function _addPanelPromise(new_id, viewer_kind, res_type, title, new_panel) {
        return new Promise (function (resolve, reject) {
            _addPanel(new_id, viewer_kind, res_type, title, new_panel, resolve)
        })
    }

    function _updatePanel(the_id, new_panel, callback = null) {
        let new_tab_panel_dict = {...tab_panel_dict_ref.current};
        for (let k in new_panel) {
            if (k != "panel") {
                new_tab_panel_dict[the_id][k] = new_panel[k]
            }
        }

        if ("panel" in new_panel) {
            if (new_panel.panel == "spinner") {
                new_tab_panel_dict[the_id].panel = "spinner";
            } else if (new_tab_panel_dict[the_id].panel != "spinner") {
                for (let j in new_panel.panel) {
                    new_tab_panel_dict[the_id].panel[j] = new_panel.panel[j]
                }
            } else {
                new_tab_panel_dict[the_id].panel = new_panel.panel
            }
        }
        set_tab_panel_dict(new_tab_panel_dict);
        pushCallback(() => {
            _updateOpenResources(() => _update_window_dimensions(callback))
        });
    }

    function _updatePanelPromise(the_id, new_panel) {
        return new Promise (function (resolve, reject) {
            _updatePanel(the_id, new_panel, resolve)
        })
    }

    function _changeResourceName(the_id, new_name, change_title = true, callback = null) {
        let new_tab_panel_dict = {...tab_panel_dict_ref.current};
        if (change_title) {
            new_tab_panel_dict[the_id].title = new_name;
        }
        new_tab_panel_dict[the_id].panel.resource_name = new_name;
        set_tab_panel_dict(new_tab_panel_dict);
        pushCallback(() => {
            _updateOpenResources(() => _update_window_dimensions(callback))
        });
    }

    function _getResourceId(res_name, res_type) {
        for (let the_id of tab_ids_ref.current) {
            let the_panel = tab_panel_dict_ref.current[the_id];
            if (the_panel.panel.resource_name == res_name && the_panel.res_type == res_type) {
                return the_id
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

    const _handleCreateViewer = useCallback(async (data, callback = null)=>{
        let existing_id = _getResourceId(data.resource_name, data.res_type);
        if (existing_id != -1) {
            setSelectedTabId(existing_id);
            pushCallback(callback);
            return
        }
        const new_id = guid();
        const drmethod = (dmethod) => {
            _registerDirtyMethod(new_id, dmethod)
        };
        await _addPanelPromise(new_id, data.kind, data.res_type, data.resource_name, "spinner");
        let new_panel = propDict[data.kind](data, drmethod, (new_panel) => {
            _updatePanel(new_id, {panel: new_panel}, callback);
        });
    }, []);

    function _goToNextPane(e) {
        let templist = ["library"];
        if (window.has_pool) templist.push("pool");
        templist = [...templist, ...tab_ids_ref.current];
        let newId;
        let tabIndex = templist.indexOf(selectedTabIdRef.current) + 1;
        newId = tabIndex === templist.length ? "library" : templist[tabIndex];
        _handleTabSelect(newId, selectedTabIdRef.current);
        if (e) {
            e.preventDefault()
        }
    }

    function _goToPreviousPane(e) {
        let templist = ["library"];
        if (window.has_pool) templist.push("pool");
        templist = [...templist, ...tab_ids_ref.current];
        let tabIndex = templist.indexOf(selectedTabIdRef.current) - 1;
        let newId = tabIndex == -1 ? templist.at(-1) : templist[tabIndex];
        _handleTabSelect(newId, selectedTabIdRef.current);
        if (e) {
            e.preventDefault();
        }
    }

    function _handleTabSelect(newTabId, prevTabId, event = null, callback = null) {
        setSelectedTabId(newTabId);
        setLastSelectedTabId(prevTabId);
        pushCallback(() => {
            _update_window_dimensions(callback);
            setTabSelectCounter(tabSelectCounter + 1)
        });
    }

    async function _goToModule(module_name, line_number) {
        for (let tab_id in tab_panel_dict_ref.current) {
            let pdict = tab_panel_dict_ref.current[tab_id];
            if (pdict.kind == "creator-viewer" && pdict.panel.resource_name == module_name) {
                _handleTabSelect(tab_id, selectedTabIdRef.current, null, () => {
                    if ("line_setter" in pdict) {
                        pdict.line_setter(line_number)
                    }
                });
                return
            }
        }
        let the_view = view_views()["tile"];
        const re = new RegExp("/$");
        the_view = the_view.replace(re, "_in_context");
        let data;
        try {
            data = await postAjaxPromise(the_view, {context_id: window.context_id, resource_name: module_name});
            const new_id = `${data.kind}: ${data.resource_name}`;
            const drmethod = (dmethod) => {
                _registerDirtyMethod(new_id, dmethod)
            };
            await _addPanelPromise(new_id, data.kind, data.res_type, data.resource_name, "spinner");
            let new_panel = propDict[data.kind](data, drmethod, (new_panel) => {
                _updatePanel(new_id, {panel: new_panel}, () => {
                    let pdict = tab_panel_dict_ref.current[new_id];
                });
            });
        }
        catch(e) {
            errorDrawerFuncs.addFromError(`Error going to module ${module_name}`, e)
        }
        return
    }

    function _registerLineSetter(tab_id, rfunc) {
        _updatePanel(tab_id, {line_setter: rfunc})
    }

    function _onDragStart(event, tab_id) {
        set_currently_dragging(tab_id);
        event.stopPropagation()
    }

    function _onDragEnd(event) {
        set_dragging_over(null);
        set_currently_dragging(null);
        event.stopPropagation();
        event.preventDefault();
    }

    function _nextTab(tab_id) {
        let tidx = tab_ids_ref.current.indexOf(tab_id);
        if (tidx == -1) return null;
        if (tidx == tab_ids_ref.current.length - 1) return "dummy";
        return tab_ids_ref.current[tidx + 1]
    }

    function _onDrop(event, target_id) {
        if (currently_dragging == null || currently_dragging == target_id) return;
        let current_index = tab_ids_ref.current.indexOf(currently_dragging);
        let new_tab_ids = [...tab_ids_ref.current];
        new_tab_ids.splice(current_index, 1);
        if (target_id == "dummy") {
            new_tab_ids.push(currently_dragging)
        } else {
            let target_index = new_tab_ids.indexOf(target_id);
            new_tab_ids.splice(target_index, 0, currently_dragging);
        }
        set_tab_ids(new_tab_ids);
        set_dragging_over(null);
        event.stopPropagation()
    }

    function _onDragOver(event, target_id) {
        event.stopPropagation();
        event.preventDefault();
    }

    function _onDragEnter(event, target_id) {
        if (target_id == currently_dragging || target_id == _nextTab(currently_dragging)) {
            set_dragging_over(null);
        } else {
            set_dragging_over(target_id)
        }
        event.stopPropagation();
        event.preventDefault();
    }

    function _onDragLeave(event, target_id) {
        event.stopPropagation();
        event.preventDefault();
    }

    function _getOpenResources() {
        let open_resources = [];
        for (let the_id in tab_panel_dict_ref.current) {
            const entry = tab_panel_dict_ref.current[the_id];
            if (entry.panel != "spinner") {
                open_resources.push(entry.panel.resource_name);
            }

        }
        return open_resources
    }

    function _updateOpenResources(callback = null) {
        set_open_resources(_getOpenResources());
        pushCallback(callback);
    }

    function _addOmniItems(tid, items)  {
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

    let bclass = "context-tab-button-content";
    if (selectedTabIdRef.current == "library") {
        bclass += " selected-tab-button"
    }

    const library_panel = (
        <SelectedPaneContext.Provider value={{
            tab_id: "library",
            selectedTabIdRef,
            amSelected,
            counter: selectedTabIdCounter,
            addOmniItems: (items)=>{_addOmniItems("library", items)}
        }}>
            <div id="library-home-root">
                <LibraryHomeApp tsocket={tsocket}
                                library_style={window.library_style}
                                controlled={true}
                                am_selected={selectedTabIdRef.current == "library"}
                                open_resources_ref={open_resources_ref}
                                handleCreateViewer={_handleCreateViewer}
                                usable_width={usable_width}
                                usable_height={usable_height}
                />
            </div>
        </SelectedPaneContext.Provider>
    );

    const ltab = (
        <Tab id="library" tabIndex={-1} key={"library"} style={{paddingLeft: 10, marginBottom: 0}}
             panelClassName="context-tab" title="" panel={library_panel}>
            <div className={bclass + " open-resource-tab"}
                 style={{display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between"}}>
                    <div style={{
                        display: "table-cell", flexDirection: "row", justifyContent: "flex-start",
                        textOverflow: "ellipsis", overflow: "hidden"
                    }}>
                        <Icon icon={libIconDict["all"]}
                              style={{verticalAlign: "middle", marginRight: 5}}
                              size={16} tabIndex={-1}/>
                        <span>Library</span>
                    </div>
                </div>
            </Tab>
    );
    let all_tabs = [ltab];
    if (window.has_pool) {
        let pclass = "context-tab-button-content";
        if (selectedTabIdRef.current == "pool") {
            pclass += " selected-tab-button"
        }

        const pool_panel = (
            <SelectedPaneContext.Provider value={{
                tab_id: "pool",
                selectedTabIdRef, amSelected,
                counter: selectedTabIdCounter,
                addOmniItems: (items)=>{_addOmniItems("pool", items)}
            }}>
                <div id="pool-browser-root">
                    <PoolBrowser tsocket={tsocket}
                                 am_selected={selectedTabIdRef.current == "pool"}
                                 usable_width={usable_width}
                                 usable_height={usable_height}/>

                </div>
            </SelectedPaneContext.Provider>
        );

        const ptab = (
            <Tab id="pool" tabIndex={-1} key={"pool"} style={{paddingLeft: 10, marginBottom: 0}}
                 panelClassName="context-tab" title="" panel={pool_panel}>
                <div className={pclass + " open-resource-tab"}
                     style={{display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between"}}>
                    <div style={{
                        display: "table-cell", flexDirection: "row", justifyContent: "flex-start",
                        textOverflow: "ellipsis", overflow: "hidden"
                    }}>
                        <Icon icon={libIconDict["pool"]}
                              style={{verticalAlign: "middle", marginRight: 5}}
                              size={16} tabIndex={-1}/>
                        <span>Pool</span>
                    </div>
                </div>
            </Tab>
        );
        all_tabs.push(ptab)
    }

    function amSelected(ltab_id, lselectedTabIdRef) {
        return !window.in_context || ltab_id == lselectedTabIdRef.current
    }

    const _omni_view_func = useCallback(async (item) => {
        let the_view = view_views(false)[item.res_type];
        statusFuncs.setStatus({show_spinner: true, status_message: "Opening ..."});
        if (window.in_context) {
            const re = new RegExp("/$");
            the_view = the_view.replace(re, "_in_context");
            let data;
            try {
                data = await postAjaxPromise(the_view, {
                    context_id: context_id,
                    resource_name: item.name
                });
                await _handleCreateViewer(data, statusFuncs.clearStatus);
            }
            catch(e) {
                statusFuncs.clearstatus();
                errorDrawerFuncs.addFromError(`Error following ${the_view}`, e)

            }
        } else {
            statusFuncs.clearStatus();
            window.open($SCRIPT_ROOT + the_view + item.name)
        }
    });

    for (let tab_id of tab_ids_ref.current) {
        let tab_entry = tab_panel_dict_ref.current[tab_id];
        let bclass = "context-tab-button-content";
        if (selectedTabIdRef.current == tab_id) {
            bclass += " selected-tab-button"
        }
        let visible_title = tab_entry.title;
        let wrapped_panel;
        if (tab_entry.panel == "spinner") {
            wrapped_panel = spinner_panel
        } else {
            let TheClass = classDict[tab_entry.kind];
            let the_panel =
                <SelectedPaneContext.Provider value={{
                    tab_id,
                    selectedTabIdRef,
                    amSelected,
                    counter: selectedTabIdCounter,
                    addOmniItems: (items)=>{_addOmniItems(tab_id, items)}
                }}>
                    <TheClass {...tab_entry.panel}
                                          controlled={true}
                                          handleCreateViewer={_handleCreateViewer}
                                          tab_id={tab_id}
                                          selectedTabIdRef={selectedTabIdRef}
                                          changeResourceName={(new_name, callback = null, change_title = true) => {
                                              _changeResourceName(tab_id, new_name, change_title, callback)
                                          }}
                                          updatePanel={(new_panel, callback = null) => {
                                              _updatePanel(tab_id, new_panel, callback)
                                          }}
                                          goToModule={_goToModule}
                                          registerLineSetter={(rfunc) => _registerLineSetter(tab_id, rfunc)}
                                          refreshTab={async () => {
                                              await _refreshTab(tab_id)
                                          }}
                                          closeTab={async () => {
                                              await _closeTab(tab_id)
                                          }}
                                          tsocket={tab_entry.panel.tsocket}
                                          usable_width={usable_width}
                                          usable_height={usable_height}
                />
            </SelectedPaneContext.Provider>;
            wrapped_panel = (
                <ErrorBoundary>
                    <div id={tab_id + "-holder"} className={panelRootDict[tab_panel_dict_ref.current[tab_id].kind]}>
                        {the_panel}
                    </div>
                </ErrorBoundary>
            );
        }
        let icon_style = {verticalAlign: "middle", paddingLeft: 4};
        if (tab_id == dragging_over) {
            bclass += " hovering";
        }
        if (tab_id == currently_dragging) {
            bclass += " currently-dragging"
        }
        let new_tab = (
            <Tab id={tab_id} draggable="true"
                 onDragStart={(e) => {
                     _onDragStart(e, tab_id)
                 }}
                 onDrop={(e) => {
                     _onDrop(e, tab_id)
                 }}
                 onDragEnter={(e) => {
                     _onDragEnter(e, tab_id)
                 }}
                 onDragOver={(e) => {
                     _onDragOver(e, tab_id)
                 }}
                 onDragLeave={(e) => {
                     _onDragLeave(e, tab_id)
                 }}
                 onDragEnd={(e) => {
                     _onDragEnd(e)
                 }}
                 tabIndex={-1} key={tab_id} panelClassName="context-tab" title="" panel={wrapped_panel}>

                <div className={bclass + " open-resource-tab"}
                     style={{display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between"}}>
                    <div style={{
                        display: "table-cell", flexDirection: "row", justifyContent: "flex-start",
                        textOverflow: "ellipsis", overflow: "hidden"
                    }}>
                        <Icon icon={iconDict[tab_entry.kind]}
                              style={{verticalAlign: "middle", marginRight: 5}}
                              size={16} tabIndex={-1}/>
                        <span>{visible_title}</span>
                    </div>
                    <div>
                        <Icon icon="reset" style={icon_style} size={13} className="context-close-button"
                              tabIndex={-1} onClick={async () => {
                            await _refreshTab(tab_id)
                        }}/>
                        <Icon icon="delete" style={icon_style} size={13} className="context-close-button"
                              tabIndex={-1} onClick={async () => {
                            await _closeTab(tab_id)
                        }}/>
                    </div>
                </div>
            </Tab>
        );
        all_tabs.push(new_tab)
    }

    // The purpose of the dummy tab is to make it possible to drag a tab to the bottom of the list
    bclass = "context-tab-button-content";
    if (dragging_over == "dummy") {
        bclass += " hovering";
    }
    let dummy_tab = (
        <Tab id="dummy" draggable="false"
             disabled={true}
             onDrop={(e) => {
                 _onDrop(e, "dummy")
             }}
             onDragEnter={(e) => {
                 _onDragEnter(e, "dummy")
             }}
             onDragOver={(e) => {
                 _onDragOver(e, "dummy")
             }}
             onDragLeave={(e) => {
                 _onDragLeave(e, "dummy")
             }}
             tabIndex={-1} key="dummy" panelClassName="context-tab" title="" panel={null}>
            <div className={bclass}
                 style={{height: 30, display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
            </div>
        </Tab>
    );
    all_tabs.push(dummy_tab);

    let outer_class = "pane-holder ";
    if (theme.dark_theme) {
        outer_class = `${outer_class} bp5-dark`;
    } else {
        outer_class = `${outer_class} light-theme`;
    }
    let outer_style = {
        width: "100%",
        height: usable_height,
        paddingLeft: 0
    };
    let tlclass = "context-tab-list";
    let pane_closed = tabWidth <= MIN_CONTEXT_WIDTH;
    if (pane_closed) {
        tlclass += " context-pane-closed"
    }
    let sid = selectedTabIdRef.current;
    let commandItems = omniItemsRef.current["global"];
    if (sid in omniItemsRef.current) {
        commandItems = commandItems.concat(omniItemsRef.current[sid])
    }
    return (
        <Fragment>
            <TacticNavbar is_authenticated={window.is_authenticated}
                          selected={null}
                          show_api_links={false}
                          extra_text={window.database_type == "Local" ? "" : window.database_type}
                          page_id={window.context_id}
                          user_name={window.username}/>
            <div className={outer_class} style={outer_style} ref={top_ref}>
                <div id="context-container" style={outer_style}>
                    <Button icon={<Icon icon={pane_closed ? "drawer-left-filled" : "drawer-right-filled"}
                                        size={18}/>}
                            style={{
                                paddingLeft: 4, paddingRight: 0,
                                position: "fixed", left: tabWidth - 30, bottom: 10,
                                zIndex: 100
                            }}
                            minimal={true}
                            className="context-close-button"
                            small={true}
                            tabIndex={-1}
                            onClick={() => {
                                _togglePane(pane_closed)
                            }}
                    />
                    <DragHandle position_dict={{position: "fixed", left: tabWidth - 5}}
                                onDrag={_handleTabResize}
                                dragStart={_handleTabResizeStart}
                                dragEnd={_handleTabResizeEnd}
                                direction="x"
                                barHeight="100%"
                                useThinBar={true}/>
                    <SizeContext.Provider value={{
                        availableWidth: usable_width,
                        availableHeight: usable_height,
                        topX: paneX,
                        topY: paneY
                    }}>
                        <Tabs id="context-tabs" selectedTabId={selectedTabIdRef.current}
                              className={tlclass}
                              vertical={true}
                              onChange={_handleTabSelect}>
                            {all_tabs}
                        </Tabs>
                    </SizeContext.Provider>
                </div>
                <SelectedPaneContext.Provider value={{
                    tab_id: sid,
                    selectedTabIdRef,
                    amSelected,
                    addOmniItems: (items)=>{_addOmniItems(sid, items)}
                }}>
                    <OpenOmnibar commandItems={commandItems}
                                 page_id={window.context_id}
                                 showOmnibar={showOpenOmnibar}
                                 openFunc={_omni_view_func}
                                 is_authenticated={window.is_authenticated}
                                 closeOmnibar={_closeOpenOmnibar}/>
                </SelectedPaneContext.Provider>
            </div>
            <KeyTrap global={true} bindings={key_bindings}/>
        </Fragment>
    );
}

_context_main();
