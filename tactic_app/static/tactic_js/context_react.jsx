// noinspection XmlDeprecatedElement

import "../tactic_css/tactic.scss";
import "../tactic_css/context.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/library_home.scss";
import "../tactic_css/tile_creator.scss";

import React from "react";
import {Fragment, useState, useEffect, useRef} from "react";
import * as ReactDOM from 'react-dom';

import {Tab, Tabs, Button, Icon, Spinner} from "@blueprintjs/core";
import {FocusStyleManager} from "@blueprintjs/core";

FocusStyleManager.onlyShowFocusOnTabs();

import {TacticSocket} from "./tactic_socket";
import {TacticOmnibar} from "./TacticOmnibar";
import {handleCallback} from "./communication_react.js";
import {doFlash, withStatus} from "./toaster.js";
import {TacticNavbar} from "./blueprint_navbar";
import {ErrorBoundary} from "./error_boundary.js";
import {icon_dict} from "./blueprint_mdata_fields.js";
import {LibraryHomeApp} from "./library_home_react.js";
import {view_views} from "./library_pane.js";
import {guid} from "./utilities_react.js";
import {module_viewer_props, ModuleViewerApp} from "./module_viewer_react.js";
import {creator_props, CreatorApp} from "./tile_creator_react.js";
import {main_props, MainApp} from "./main_app.js"
import {notebook_props, NotebookApp} from "./notebook_app.js";
import {code_viewer_props, CodeViewerApp} from "./code_viewer_react.js";
import {list_viewer_props, ListViewerApp} from "./list_viewer_react.js";
import {withErrorDrawer} from "./error_drawer.js";
import {getUsableDimensions, USUAL_TOOLBAR_HEIGHT} from "./sizing_tools.js";
import {showConfirmDialogReact} from "./modal_react.js";
import {postAjaxPromise} from "./communication_react.js";
import {KeyTrap} from "./key_trap";
import {DragHandle} from "./resizing_layouts.js";
import {res_types} from "./library_pane";
import {useCallbackStack, useStateAndRef} from "./utilities_react";

const spinner_panel = (
    <div style={{height: "100%", position: "absolute", top: "50%", left: "50%"}}>
        <Spinner size={100}/>
    </div>);

const MIN_CONTEXT_WIDTH = 45;
const MIN_CONTEXT_SAVED_WIDTH = 100;
const resTypes = ["all", "collections", "projects", "tiles", "lists", "code"];
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
    code: icon_dict["code"]
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

let tsocket = new TacticSocket("main", 5000, window.context_id);

const LibraryHomeAppPlus = withErrorDrawer(withStatus(LibraryHomeApp));
const ListViewerAppPlus = withStatus(ListViewerApp);
const CodeViewerAppPlus = withErrorDrawer(withStatus(CodeViewerApp));
const ModuleViewerAppPlus = withErrorDrawer(withStatus(ModuleViewerApp));
const CreatorAppPlus = withErrorDrawer(withStatus(CreatorApp));
const MainAppPlus = withErrorDrawer(withStatus(MainApp));
const NotebookAppPlus = withErrorDrawer(withStatus(NotebookApp));

const classDict = {
    "module-viewer": ModuleViewerAppPlus,
    "code-viewer": CodeViewerAppPlus,
    "list-viewer": ListViewerAppPlus,
    "creator-viewer": CreatorAppPlus,
    "main-viewer": MainAppPlus,
    "notebook-viewer": NotebookAppPlus
};

function _context_main() {
    const ContextAppPlus = ContextApp;
    const domContainer = document.querySelector('#context-root');
    ReactDOM.render(<ContextAppPlus initial_theme={window.theme} tsocket={tsocket}/>, domContainer);
}

function ContextApp(props) {
    const [didInit, setDidInit] = useState(false);
    const [selectedTabId, setSelectedTabId, selectedTabIdRef] = useStateAndRef("library");
    const [saved_width, set_saved_width] = useState(150);

    const [tab_panel_dict, set_tab_panel_dict, tab_panel_dict_ref] = useStateAndRef({});
    const library_omni_function = useRef(null);
    const [tab_ids, set_tab_ids, tab_ids_ref] = useStateAndRef([]);

    const [open_resources, set_open_resources] = useState({});
    const [dirty_methods, set_dirty_methods] = useState({});
    const [dark_theme, set_dark_theme] = useState(() => {
        return props.initial_theme === "dark"
    });
    const [theme_setters, set_theme_setters] = useState([]);
    const [lastSelectedTabId, setLastSelectedTabId] = useState(null);
    const [usable_width, set_usable_width] = useState(() => {
        return getUsableDimensions(true).usable_width - 170
    });
    const [usable_height, set_usable_height] = useState(() => {
        return getUsableDimensions(true).usable_height_no_bottom
    });
    const [tabWidth, setTabWidth] = useState(150);
    const [show_repository, set_show_repository] = useState(false);
    const [dragging_over, set_dragging_over] = useState(false);
    const [currently_dragging, set_currently_dragging] = useState(false);
    const [showOmnibar, setShowOmnibar] = useState(false);

    const top_ref = useRef(null);

    const key_bindings = [
        [["tab"], _goToNextPane],
        [["shift+tab"], _goToPreviousPane],
        [["ctrl+space"], _showOmnibar],
        [["ctrl+w"], () => {
            _closeTab(selectedTabIdRef.current)
        }]
    ];

    const pushCallback = useCallbackStack("context");

    useEffect(() => {  // for unmount
        initSocket();
        return (() => {
            tsocket.disconnect()
        })
    }, []);

    useEffect(() => {  // for mount
        window.dark_theme = dark_theme;
        window.addEventListener("resize", () => _update_window_dimensions(null));
        window.addEventListener("beforeunload", function (e) {
            e.preventDefault();
            e.returnValue = 'Are you sure you want to close? All changes will be lost.'
        });

        _update_window_dimensions(null);
        const tab_list_elem = document.querySelector("#context-container .context-tab-list > .bp4-tab-list");
        const resizeObserver = new ResizeObserver(entries => {
            _update_window_dimensions(null)
        });
        if (tab_list_elem) {
            resizeObserver.observe(tab_list_elem)
        }
    }, []);

    function _setTheme(local_dark_theme) {
        window.theme = local_dark_theme ? "dark" : "light";
        set_dark_theme(local_dark_theme)
    }

    function get_tab_list_elem() {
        return document.querySelector("#context-container .context-tab-list > .bp4-tab-list");
    }

    function _togglePane(pane_closed) {
        let w = pane_closed ? saved_width : MIN_CONTEXT_WIDTH;
        let tab_elem = get_tab_list_elem();
        tab_elem.setAttribute("style", `width:${w}px`);
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

        if (tab_elem.offsetWidth > 45) {
            let new_width = Math.max(tab_elem.offsetWidth, MIN_CONTEXT_SAVED_WIDTH);
            if (new_width != saved_width) {
                set_saved_width(new_width)
            }
        }
    }

    function _update_window_dimensions(callback = null) {
        const tab_list_elem = get_tab_list_elem();

        let uwidth;
        let uheight;
        let tabWidth;
        if (top_ref && top_ref.current) {
            uheight = window.innerHeight - top_ref.current.offsetTop;
        } else {
            uheight = window.innerHeight - USUAL_TOOLBAR_HEIGHT
        }
        if (tab_list_elem) {
            uwidth = window.innerWidth - tab_list_elem.offsetWidth;
            tabWidth = tab_list_elem.offsetWidth
        } else {
            uwidth = window.innerWidth - 150;
            tabWidth = 150
        }
        set_usable_height(uheight);
        set_usable_width(uwidth);
        setTabWidth(tabWidth);
        pushCallback(callback);
    }

    function _registerThemeSetter(setter) {
        set_theme_setters([...theme_setters, setter])
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
        props.tsocket.attachListener("doFlash", function (data) {
            doFlash(data)
        });
        props.tsocket.attachListener("doFlashUser", function (data) {
            doFlash(data)
        });
        props.tsocket.attachListener('handle-callback', (task_packet) => {
            handleCallback(task_packet, window.context_id)
        });
        props.tsocket.attachListener("create-viewer", _handleCreateViewer);
    }

    function _refreshTab(the_id) {
        if (the_id == "library") {
            return
        }
        if (!(the_id in dirty_methods) || dirty_methods[the_id]()) {
            const title = tab_panel_dict_ref.current[the_id].title;
            const confirm_text = `Are you sure that you want to reload the tab ${title}? Changes will be lost`;
            showConfirmDialogReact(`reload the tab ${title}`, confirm_text, "do nothing", "reload", do_the_refresh)
        } else {
            do_the_refresh()
        }

        function do_the_refresh() {
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
            _updatePanel(the_id, {panel: "spinner"}, () => {
                postAjaxPromise($SCRIPT_ROOT + the_view, {context_id: window.context_id, resource_name: resource_name})
                    .then((data) => {
                        let new_panel = propDict[data.kind](data, drmethod, (new_panel) => {
                            _updatePanel(the_id, {panel: new_panel, kind: data.kind});
                        });
                    })
                    .catch(doFlash);
            })
        }
    }

    function _closeATab(the_id, callback = null) {
        let idx = tab_ids_ref.current.indexOf(the_id);
        let copied_tab_panel_dict = {...tab_panel_dict_ref.current};
        let copied_tab_ids = [...tab_ids_ref.current];
        let copied_dirty_methods = {...dirty_methods};
        if (idx > -1) {
            copied_tab_ids.splice(idx, 1);
            delete copied_tab_panel_dict[the_id];
            delete copied_dirty_methods[the_id];
        }
        set_tab_panel_dict(copied_tab_panel_dict);
        set_tab_ids(copied_tab_ids);
        set_dirty_methods(copied_dirty_methods);
        set_tab_panel_dict(copied_tab_panel_dict);
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
                _updateOpenResources(() => _update_window_dimensions(callback))
            })
        });

    }

    function _closeTab(the_id) {
        if (the_id == "library") {
            return
        }
        if (!(the_id in dirty_methods) || dirty_methods[the_id]()) {
            const title = tab_panel_dict_ref.current[the_id].title;
            const confirm_text = `Are you sure that you want to close the tab ${title}? Changes will be lost`;
            showConfirmDialogReact(`close the tab ${title}"`, confirm_text, "do nothing",
                "close", () => {
                    _closeATab(the_id)
                })
        } else {
            _closeATab(the_id)
        }

    }

    function _addPanel(new_id, viewer_kind, res_type, title, new_panel, callback = null) {
        let new_tab_panel_dict = {...tab_panel_dict_ref.current};
        new_tab_panel_dict[new_id] = {
            kind: viewer_kind, res_type: res_type, title: title,
            panel: new_panel,
            omni_function: null
        };
        set_tab_panel_dict(new_tab_panel_dict);
        const new_tab_ids = [...tab_ids_ref.current, new_id];
        set_tab_ids(new_tab_ids);
        setLastSelectedTabId(selectedTabIdRef.current),
        setSelectedTabId(new_id);
        pushCallback(() => {
            _updateOpenResources(callback);
        });
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

    function _changeResourceTitle(the_id, new_title) {
        let new_tab_panel_dict = {...tab_panel_dict_ref.current};
        new_tab_panel_dict[the_id].title = new_title;
        set_tab_panel_dict(new_tab_panel_dict);

        pushCallback(() => {
            _updateOpenResources(() => _update_window_dimensions(null))
        });

    }

    function _changeResourceProps(the_id, new_props, callback = null) {
        let new_tab_panel_dict = {...tab_panel_dict_ref.current};
        for (let prop in new_props) {
            new_tab_panel_dict[the_id].panel[prop] = new_props[prop]
        }
        set_tab_panel_dict(new_tab_panel_dict);
        pushCallback(() => {
            _updateOpenResources(() => _update_window_dimensions(null))
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

    function _showOmnibar() {
        setShowOmnibar(true)
    }

    function _closeOmnibar() {
        setShowOmnibar(false)
    }

    function _registerOmniFunction(tab_id, the_function) {
        if (tab_id == "library") {
            library_omni_function.current = the_function
        } else {
            _updatePanel(tab_id, {omni_function: the_function})
        }
    }

    function _handleCreateViewer(data, callback = null) {
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
        _addPanel(new_id, data.kind, data.res_type, data.resource_name, "spinner", () => {
            let new_panel = propDict[data.kind](data, drmethod, (new_panel) => {
                _updatePanel(new_id, {panel: new_panel}, callback);
            }, (register_func) => _registerOmniFunction(new_id, register_func))
        })

    }

    function _goToNextPane(e) {
        let newId;
        if (selectedTabIdRef.current == "library") {
            newId = tab_ids_ref.current[0]
        } else {
            let tabIndex = tab_ids_ref.current.indexOf(selectedTabIdRef.current) + 1;
            newId = tabIndex === tab_ids_ref.current.length ? "library" : tab_ids_ref.current[tabIndex];
        }
        _handleTabSelect(newId, selectedTabIdRef.current);
        e.preventDefault()
    }

    function _goToPreviousPane(e) {
        let newId;
        if (selectedTabIdRef.current == "library") {
            newId = tab_ids_ref.current.at(-1)
        } else {
            let tabIndex = tab_ids_ref.current.indexOf(selectedTabIdRef.current) - 1;
            newId = tabIndex == -1 ? "library" : tab_ids_ref.current[tabIndex]
        }

        _handleTabSelect(newId, selectedTabIdRef.current);
        e.preventDefault();
    }

    function _handleTabSelect(newTabId, prevTabId, event = null, callback = null) {
        setSelectedTabId(newTabId);
        setLastSelectedTabId(prevTabId);
        pushCallback(() => _update_window_dimensions(callback));
    }

    function _goToModule(module_name, line_number) {
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
        postAjaxPromise($SCRIPT_ROOT + the_view, {context_id: window.context_id, resource_name: module_name})
            .then((data) => {
                const new_id = `${data.kind}: ${data.resource_name}`;
                const drmethod = (dmethod) => {
                    _registerDirtyMethod(new_id, dmethod)
                };
                _addPanel(new_id, data.kind, data.res_type, data.resource_name, "spinner", () => {
                    let new_panel = propDict[data.kind](data, drmethod, (new_panel) => {
                        _updatePanel(new_id, {panel: new_panel}, () => {
                            let pdict = tab_panel_dict_ref.current[new_id];
                        });
                    }, (register_func) => _registerOmniFunction(new_id, register_func));
                })
            })
            .catch(doFlash);
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
        // setState({"dragging_over": target_id});
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
        // this.setState({"dragging_over": null});
        event.stopPropagation();
        event.preventDefault();
    }

    function _getOpenResources() {
        let open_resources = {};
        for (let res_type of res_types) {
            open_resources[res_type] = [];
        }
        for (let the_id in tab_panel_dict_ref.current) {
            const entry = tab_panel_dict_ref.current[the_id];
            if (entry.panel != "spinner") {
                open_resources[entry.res_type].push(entry.panel.resource_name);
            }

        }
        open_resources["all"] = [];
        for (let rtype in open_resources) {
            open_resources["all"] = open_resources["all"].concat(open_resources[rtype])
        }
        return open_resources
    }

    function _updateOpenResources(callback = null) {
        set_open_resources(_getOpenResources());
        pushCallback(callback);
    }

    function _contextOmniItems() {
        if (tab_ids_ref.current.length == 0) return [];
        let omni_funcs = [
            ["Go To Next Panel", "context", _goToNextPane, "arrow-right"],
            ["Go To Previous Panel", "context", _goToPreviousPane, "arrow-left"],
        ];
        if (selectedTabIdRef.current != "library") {
            omni_funcs = omni_funcs.concat([
                ["Close Current Panel", "context", () => {
                    _closeTab(selectedTabIdRef.current)
                }, "delete"],
                ["Refresh Current Panel", "context", () => {
                    _refreshTab(selectedTabIdRef.current)
                }, "reset"]
            ])
        }

        let omni_items = [];
        for (let item of omni_funcs) {
            omni_items.push(
                {
                    category: item[1],
                    display_text: item[0],
                    search_text: item[0],
                    icon_name: item[3],
                    the_function: item[2]
                }
            )

        }
        return omni_items
    }

    // Create the library tab
    let bclass = "context-tab-button-content";
    if (selectedTabIdRef.current == "library") {
        bclass += " selected-tab-button"
    }

    const library_id = guid();
    const tsocket = new TacticSocket("main", 5000, library_id);
    const library_panel = (
        <div id="library-home-root">
            <LibraryHomeAppPlus library_id={library_id}
                                tsocket={tsocket}
                                library_style={window.library_style}
                                controlled={true}
                                am_selected={selectedTabIdRef.current == "library"}
                                open_resources={open_resources}
                                dark_theme={dark_theme}
                                setTheme={_setTheme}
                                registerOmniFunction={(register_func) => _registerOmniFunction("library", register_func)}
                                handleCreateViewer={_handleCreateViewer}
                                usable_width={usable_width}
                                usable_height={usable_height}
            />
        </div>
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
                              iconSize={16} tabIndex={-1}/>
                        <span>Library</span>
                    </div>
                </div>
            </Tab>

    );

    let all_tabs = [ltab];

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
            let the_panel = <TheClass {...tab_entry.panel}
                                      controlled={true}
                                      dark_theme={dark_theme}  // needed for error drawer and status
                                      handleCreateViewer={_handleCreateViewer}
                                      setTheme={_setTheme}
                                      am_selected={tab_id == selectedTabIdRef.current}
                                      changeResourceName={(new_name, callback = null, change_title = true) => {
                                          _changeResourceName(tab_id, new_name, change_title, callback)
                                      }}
                                      changeResourceTitle={(new_title) => _changeResourceTitle(tab_id, new_title)}
                                      changeResourceProps={(new_props, callback = null) => {
                                          _changeResourceProps(tab_id, new_props, callback)
                                      }}
                                      updatePanel={(new_panel, callback = null) => {
                                          _updatePanel(tab_id, new_panel, callback)
                                      }}
                                      goToModule={_goToModule}
                                      registerLineSetter={(rfunc) => _registerLineSetter(tab_id, rfunc)}
                                      refreshTab={() => {
                                          _refreshTab(tab_id)
                                      }}
                                      closeTab={() => {
                                          _closeTab(tab_id)
                                      }}
                                      tsocket={tab_entry.panel.tsocket}
                                      usable_width={usable_width}
                                      usable_height={usable_height}
            />;
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
                              iconSize={16} tabIndex={-1}/>
                        <span>{visible_title}</span>
                    </div>
                    <div>
                        <Icon icon="reset" style={icon_style} iconSize={13} className="context-close-button"
                              tabIndex={-1} onClick={() => {
                            _refreshTab(tab_id)
                        }}/>
                        <Icon icon="delete" style={icon_style} iconSize={13} className="context-close-button"
                              tabIndex={-1} onClick={() => {
                            _closeTab(tab_id)
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
    if (dark_theme) {
        outer_class = `${outer_class} bp4-dark`;
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
    let omniGetter;
    if (sid && sid in tab_panel_dict_ref.current) {
        let the_dict = tab_panel_dict_ref.current[sid];
        if ("omni_function" in the_dict) {
            omniGetter = the_dict.omni_function;
        } else {
            omniGetter = () => {
                return []
            };
        }
    } else if (sid == "library") {
        omniGetter = library_omni_function.current
    } else {
        omniGetter = () => {
            return []
        };  // Should never get here
    }
    return (
        <Fragment>
            <TacticNavbar is_authenticated={window.is_authenticated}
                          dark_theme={dark_theme}
                          setTheme={_setTheme}
                          selected={null}
                          show_api_links={false}
                          extra_text={window.database_type == "Local" ? "" : window.database_type}
                          page_id={window.context_id}
                          user_name={window.username}/>
            <div className={outer_class} style={outer_style} ref={top_ref}>
                <div id="context-container" style={outer_style}>
                    <Button icon={<Icon icon={pane_closed ? "drawer-left-filled" : "drawer-right-filled"}
                                        iconSize={18}/>}
                            style={{
                                paddingLeft: 4, paddingRight: 0,
                                position: "absolute", left: tabWidth - 30, bottom: 10,
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
                    <DragHandle position_dict={{position: "absolute", left: tabWidth - 5}}
                                onDrag={_handleTabResize}
                                dragStart={_handleTabResizeStart}
                                dragEnd={_handleTabResizeEnd}
                                direction="x"
                                barHeight="100%"
                                useThinBar={true}/>
                    <Tabs id="context-tabs" selectedTabId={selectedTabIdRef.current}
                          className={tlclass}
                          vertical={true}
                          onChange={_handleTabSelect}>
                        {all_tabs}
                    </Tabs>
                </div>
                <TacticOmnibar omniGetters={[omniGetter, _contextOmniItems]}
                               showOmnibar={showOmnibar}
                               closeOmnibar={_closeOmnibar}
                               is_authenticated={window.is_authenticated}
                               dark_theme={dark_theme}
                               setTheme={_setTheme}
                />
            </div>
            <KeyTrap global={true} bindings={key_bindings}/>
        </Fragment>
    );
}

_context_main();
