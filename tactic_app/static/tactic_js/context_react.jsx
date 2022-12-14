
import "../tactic_css/tactic.scss";
import "../tactic_css/context.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/library_home.scss";
import "../tactic_css/tile_creator.scss";

const blip = "blah";
const tstr = `some text ${blip}`;

import React from "react";
import * as ReactDOM from 'react-dom';

import { Tab, Tabs, Button, Icon, Divider, Spinner } from "@blueprintjs/core";
import { FocusStyleManager } from "@blueprintjs/core";

FocusStyleManager.onlyShowFocusOnTabs();

import {TacticSocket} from "./tactic_socket";
import {handleCallback} from "./communication_react.js";
import {doFlash, withStatus} from "./toaster.js";
import {TacticNavbar} from "./blueprint_navbar";
import {ErrorBoundary} from "./error_boundary.js";

import {library_props, LibraryHomeApp} from "./library_home_react.js";
import {view_views} from "./library_pane.js";
import {doBinding, guid} from "./utilities_react.js";
import {module_viewer_props, ModuleViewerApp} from "./module_viewer_react.js";
import {creator_props, CreatorApp} from  "./tile_creator_react.js";
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
import {res_types} from "./library_home_react.js";

const spinner_panel = (
     <div style={{height: "100%", position: "absolute", top: "50%", left: "50%"}}>
         <Spinner size={100}/>
     </div>);


window.context_id = guid();
window.main_id = window.context_id;

let tsocket = new TacticSocket("main", 5000, window.context_id);

const LibraryHomeAppPlus = withErrorDrawer(withStatus(LibraryHomeApp));
// const RepositoryHomeAppPlus = withErrorDrawer(withStatus(RepositoryHomeApp));
const ListViewerAppPlus = withStatus(ListViewerApp);
const CodeViewerAppPlus = withErrorDrawer(withStatus(CodeViewerApp));
const ModuleViewerAppPlus = withErrorDrawer(withStatus(ModuleViewerApp));
const CreatorAppPlus = withErrorDrawer(withStatus(CreatorApp));
const MainAppPlus = withErrorDrawer(withStatus(MainApp));
const NotebookAppPlus = withErrorDrawer(withStatus(NotebookApp));

function _context_main() {


    const ContextAppPlus = ContextApp;
    const domContainer = document.querySelector('#context-root');
    ReactDOM.render(<ContextAppPlus initial_theme={window.theme} tsocket={tsocket}/>, domContainer);
}

// noinspection JSValidateTypes
class ContextApp extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.initSocket();
        this.socket_counter = null;
        let library_panel_props = library_props();
        // let repository_panel_props = repository_props();

        const aheight = getUsableDimensions(true).usable_height_no_bottom;
        const awidth = getUsableDimensions(true).usable_width - 170;
        this.state = {
            tab_ids: [],
            library_panel_props: library_panel_props,
            // repository_panel_props: repository_panel_props,
            tab_panel_dict: {},
            dirty_methods: {},
            dark_theme: props.initial_theme === "dark",
            selectedTabId: "library",
            theme_setters: [],
            lastSelectedTabId: null,
            selectedLibraryTab: "collections",
            // selectedRepositoryTab: "collections",
            usable_width: awidth,
            usable_height: aheight,
            tabWidth: 150,
            show_repository: false,
            dragging_over: null,
            currently_dragging: null
        };
        this.libraryTabChange = null;
        // this.repositoryTabChange = null;
        this.top_ref = React.createRef();
        this.key_bindings = [
            [["tab"], this._goToNextPane],
            [["shift+tab"], this._goToPreviousPane],
            [["ctrl+w"], ()=>{this._closeTab(this.state.selectedTabId)}]
        ];
    }

    _setTheme(dark_theme) {
        window.theme = dark_theme ? "dark" : "light";
        this.setState({dark_theme}, )
    }

    get_tab_list_elem() {
        return document.querySelector("#context-container .context-tab-list > .bp4-tab-list");
    }

    _handleTabResize(e, ui, lastX, lastY, dx, dy) {
        let tab_elem = this.get_tab_list_elem();
        tab_elem.setAttribute("style",`width:${lastX}px`);
    }

    _update_window_dimensions(callback=null) {
        const tab_list_elem = this.get_tab_list_elem();

        let uwidth;
        let uheight;
        let tabWidth;
        if (this.top_ref && this.top_ref.current) {
            uheight = window.innerHeight - this.top_ref.current.offsetTop;
        }
        else {
            uheight = window.innerHeight - USUAL_TOOLBAR_HEIGHT
        }
        if (tab_list_elem) {
            uwidth = window.innerWidth - tab_list_elem.offsetWidth;
            tabWidth =  tab_list_elem.offsetWidth
        }
        else {
            uwidth = window.innerWidth - 150;
            tabWidth = 150
        }
        this.setState({usable_height: uheight, usable_width: uwidth, tabWidth: tabWidth}, callback)
    }

    _registerThemeSetter(setter) {
        this.setState({theme_setters: [...this.state.theme_setters, setter]})
    }

    _registerDirtyMethod(tab_id, dirty_method) {
        let new_dirty_methods = {...this.state.dirty_methods};
        new_dirty_methods[tab_id] = dirty_method;
        this.setState({dirty_methods: new_dirty_methods})
    }


    _registerLibraryTabChanger(handleTabChange) {
        this.libraryTabChange = handleTabChange
    }

    _registerRepositoryTabChanger(handleTabChange) {
        this.repositoryTabChange = handleTabChange
    }


    _changeLibTab(res_type) {
        this.libraryTabChange(res_type + "-pane");
        this.setState({selectedLibraryTab: res_type})
    }
    
    get resTypes() {
        return ["collections", "projects", "tiles", "lists", "code"]
    }

    componentWillUnmount() {
        this.props.tsocket.disconnect();
    }

    componentDidMount() {
        window.dark_theme = this.state.dark_theme;
        window.addEventListener("resize", ()=>this._update_window_dimensions(null));
        window.addEventListener("beforeunload", function (e) {
                e.preventDefault();
                e.returnValue = 'Are you sure you want to close? All changes will be lost.'
        });
        
        this._update_window_dimensions(null);
        const tab_list_elem =  document.querySelector("#context-container .context-tab-list > .bp4-tab-list");
        let self = this;
        const resizeObserver = new ResizeObserver(entries => {
          self._update_window_dimensions(null)
        });
        if (tab_list_elem) {
            resizeObserver.observe(tab_list_elem)
        }

    }

    initSocket() {
         // It is necessary to delete and remake these callbacks
         // If I dont delete I end up with duplicatesSelectList
         // If I just keep the original one then I end up something with a handler linked
         // to an earlier state
        this.props.tsocket.attachListener("window-open", data => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));
        this.props.tsocket.attachListener('close-user-windows', data => {
            if (!(data["originator"] === window.context_id)) {
                window.close()
            }
        });
        this.props.tsocket.attachListener("doFlash", function(data) {
                doFlash(data)
            });
        this.props.tsocket.attachListener('handle-callback', (task_packet)=>{handleCallback(task_packet, window.context_id)});
        this.props.tsocket.attachListener("create-viewer", this._handleCreateViewer);

     }

     _refreshTab(the_id) {
        let self = this;
        if (!(the_id in this.state.dirty_methods) || this.state.dirty_methods[the_id]()) {
            const title = this.state.tab_panel_dict[the_id].title;
            const confirm_text = `Are you sure that you want to reload the tab ${title}? Changes will be lost`;
            let self = this;
            showConfirmDialogReact(`reload the tab ${title}`, confirm_text, "do nothing", "reload", do_the_refresh)
        }
        else {
            do_the_refresh()
        }

        function do_the_refresh() {
            let old_tab_panel = {...self.state.tab_panel_dict[the_id]};
            let resource_name = old_tab_panel.panel.resource_name;
            let res_type = old_tab_panel.res_type;
            let the_view;
            if (old_tab_panel.kind == "notebook-viewer" && !old_tab_panel.panel.is_project) {
                the_view = "/new_notebook_in_context/"
            }
            else {
                the_view = view_views()[res_type];
                const re = new RegExp("/$");
                the_view = the_view.replace(re, "_in_context");
            }
            const drmethod = (dmethod) => {self._registerDirtyMethod(the_id, dmethod)};
            self._updatePanel(the_id, {panel: "spinner"}, ()=>{
                postAjaxPromise($SCRIPT_ROOT + the_view, {context_id: window.context_id, resource_name: resource_name})
                    .then((data)=>{
                        let new_panel = self.propDict[data.kind](data, drmethod, (new_panel)=>{
                            self._updatePanel(the_id, {panel: new_panel, kind:data.kind});
                        });
                    })
                    .catch(doFlash);
            })

        }
     }

     _closeATab(the_id, callback=null){
         let idx = this.state.tab_ids.indexOf(the_id);
            let copied_tab_panel_dict = {...this.state.tab_panel_dict};
            let copied_tab_ids = [...this.state.tab_ids];
            let copied_dirty_methods = {...this.state.dirty_methods};
            if (idx > -1) {
                copied_tab_ids.splice(idx, 1);
                delete copied_tab_panel_dict[the_id];
                delete copied_dirty_methods[the_id];
            }
            let new_state = {
                tab_panel_dict: copied_tab_panel_dict,
                tab_ids: copied_tab_ids,
                dirty_methods: copied_dirty_methods
            };
            let currentlySelected = this.state.selectedTabId;
            let stateUpdate;
            if (the_id == this.state.selectedTabId) {
                let newSelectedId;
                if (this.state.lastSelectedTabId && copied_tab_ids.includes(this.state.lastSelectedTabId)) {
                    newSelectedId = this.state.lastSelectedTabId;
                } else {
                    newSelectedId = "library"
                }
                stateUpdate = {selectedTabId: newSelectedId, lastSelectedTabId: "library"}
            } else {
                stateUpdate = {selectedTabId: currentlySelected};
                if (this.state.lastSelectedTabId == the_id) {
                    stateUpdate.lastSelectedTabId = "library"
                }
            }

            this.setState(new_state, () => {
                this.setState(stateUpdate, ()=>this._update_window_dimensions(callback))
            })
     }

     _closeTab(the_id) {
        let self = this;
        if (the_id == "library") {
            return
        }
        if (!(the_id in this.state.dirty_methods) || this.state.dirty_methods[the_id]()) {
            const title = this.state.tab_panel_dict[the_id].title;
            const confirm_text = `Are you sure that you want to close the tab ${title}? Changes will be lost`;
            showConfirmDialogReact(`close the tab ${title}"`, confirm_text, "do nothing",
                "close", ()=>{self._closeATab(the_id)})
        }
        else {
            this._closeATab(the_id)
        }

     }


     get iconDict() {
        return {
            "module-viewer": "application",
            "code-viewer": "code",
            "list-viewer": "list",
            "creator-viewer": "application",
            "main-viewer": "projects",
            "notebook-viewer": "projects"
        }
     };

    get libIconDict() {
        return {
            collections: "database",
            projects: "projects",
            tiles: "application",
            lists: "list",
            code: "code"
        }
    }

     get propDict() {
         return {
             "module-viewer": module_viewer_props,
             "code-viewer": code_viewer_props,
             "list-viewer": list_viewer_props,
             "creator-viewer": creator_props,
             "main-viewer": main_props,
             "notebook-viewer": notebook_props
         }
     };

     get classDict() {
         return {
             "module-viewer": ModuleViewerAppPlus,
             "code-viewer": CodeViewerAppPlus,
             "list-viewer": ListViewerAppPlus,
             "creator-viewer": CreatorAppPlus,
             "main-viewer": MainAppPlus,
             "notebook-viewer": NotebookAppPlus
         }
     };


     get panelRootDict() {
         return {
             "module-viewer": "root",
             "code-viewer": "root",
             "list-viewer": "root",
             "creator-viewer": "creator-root",
             "main-viewer": "main-root",
             "notebook-viewer": "main-root"
         }
     }

     _addPanel(new_id, viewer_kind, res_type, title, new_panel, callback=null) {
         let new_tab_panel_dict = {...this.state.tab_panel_dict};
         new_tab_panel_dict[new_id] = {kind: viewer_kind, res_type: res_type, title: title, panel: new_panel};
         this.setState({
                 tab_panel_dict: new_tab_panel_dict,
                 tab_ids: [...this.state.tab_ids, new_id],
                 lastSelectedTabId: this.state.selectedTabId,
                 selectedTabId: new_id}, callback)
     }

     _updatePanel(the_id, new_panel, callback=null) {
         let new_tab_panel_dict = {...this.state.tab_panel_dict};
         for (let k in new_panel) {
             if (k != "panel") {
                 new_tab_panel_dict[the_id][k] = new_panel[k]
             }
         }

         if ("panel" in new_panel) {
              if (new_panel.panel == "spinner") {
                 new_tab_panel_dict[the_id].panel = "spinner";
              }
              else if (new_tab_panel_dict[the_id].panel != "spinner") {
                  for (let j in new_panel.panel) {
                      new_tab_panel_dict[the_id].panel[j] = new_panel.panel[j]
                  }
              }
              else {
                  new_tab_panel_dict[the_id].panel = new_panel.panel
              }
         }
         this.setState({tab_panel_dict: new_tab_panel_dict}, ()=>this._update_window_dimensions(callback))
     }

     _changeResourceName(the_id, new_name, change_title=true, callback=null) {
         let new_tab_panel_dict = {...this.state.tab_panel_dict};
         if (change_title) {
             new_tab_panel_dict[the_id].title = new_name;
         }
         new_tab_panel_dict[the_id].panel.resource_name = new_name;
         this.setState({tab_panel_dict: new_tab_panel_dict}, ()=>this._update_window_dimensions(callback))
     }

     _changeResourceTitle(the_id, new_title) {
         let new_tab_panel_dict = {...this.state.tab_panel_dict};
         new_tab_panel_dict[the_id].title = new_title;
         this.setState({tab_panel_dict: new_tab_panel_dict}, ()=>this._update_window_dimensions(null))
     }

     _changeResourceProps(the_id, new_props, callback=null) {
         let new_tab_panel_dict = {...this.state.tab_panel_dict};
         for (let prop in new_props) {
             new_tab_panel_dict[the_id].panel[prop] = new_props[prop]
         }
         this.setState({tab_panel_dict: new_tab_panel_dict},()=>{
             this._update_window_dimensions(null);
             if (callback) {
                 callback()
             }
         })
     }

     _getResourceId(res_name, res_type) {
         for (let the_id of this.state.tab_ids) {
             let the_panel = this.state.tab_panel_dict[the_id];
             if (the_panel.panel.resource_name == res_name && the_panel.res_type == res_type) {
                 return the_id
             }
         }
         return -1
     }

     _handleCreateViewer(data) {
        let self = this;

         // const new_id = `${data.kind}: ${data.resource_name}`;
         let existing_id = this._getResourceId(data.resource_name, data.res_type);
         if (existing_id != -1) {
            this.setState({selectedTabId: existing_id});
             return
         }
         const new_id = guid();
         const drmethod = (dmethod) => {self._registerDirtyMethod(new_id, dmethod)};
         this._addPanel(new_id, data.kind, data.res_type, data.resource_name, "spinner", ()=> {
             let new_panel = self.propDict[data.kind](data, drmethod, (new_panel)=>{
                this._updatePanel(new_id, {panel: new_panel});
             });
         })

     }

     _goToNextPane(e) {
         let newId;
         if (this.state.selectedTabId == "library") {
             newId = this.state.tab_ids[0]
         }
         else {
            let tabIndex = this.state.tab_ids.indexOf(this.state.selectedTabId) + 1;
            newId = tabIndex === this.state.tab_ids.length ? "library" : this.state.tab_ids[tabIndex];
         }
        this._handleTabSelect(newId, this.state.selectedTabId);
         e.preventDefault()
    }

    _goToPreviousPane(e) {
         let newId;
         if (this.state.selectedTabId == "library") {
             newId = this.state.tab_ids.at(-1)
         }
         else {
             let tabIndex = this.state.tab_ids.indexOf(this.state.selectedTabId) - 1;
             newId = tabIndex == -1 ? "library" : this.state.tab_ids[tabIndex]
         }

        this._handleTabSelect(newId, this.state.selectedTabId);
         e.preventDefault();
    }

    _handleTabSelect(newTabId, prevTabId, event=null, callback=null) {
        this.setState({selectedTabId: newTabId, lastSelectedTabId: prevTabId},
            ()=>this._update_window_dimensions(callback))
    }

    _goToModule(module_name, line_number){
        for (let tab_id in this.state.tab_panel_dict) {
            let pdict = this.state.tab_panel_dict[tab_id];
            if (pdict.kind == "creator-viewer" && pdict.panel.resource_name == module_name) {
                this._handleTabSelect(tab_id, this.state.selectedTabId, null,()=>{
                    if ("line_setter" in pdict) {
                        pdict.line_setter(line_number)
                    }
                });
                return
            }
        }
        let self = this;
        let the_view = view_views()["tile"];
        const re = new RegExp("/$");
        the_view = the_view.replace(re, "_in_context");
        postAjaxPromise($SCRIPT_ROOT + the_view, {context_id: window.context_id, resource_name: module_name})
            .then((data)=>{
                const new_id = `${data.kind}: ${data.resource_name}`;
                const drmethod = (dmethod) => {self._registerDirtyMethod(new_id, dmethod)};
                this._addPanel(new_id, data.kind, data.res_type, data.resource_name, "spinner", ()=> {
                     let new_panel = self.propDict[data.kind](data, drmethod, (new_panel)=>{
                        this._updatePanel(new_id, {panel: new_panel}, ()=>{
                            let pdict = self.state.tab_panel_dict[new_id];
                            pdict.line_setter(line_number)
                        });
                     });
                 })
            })
            .catch(doFlash);

        return
    }

    _registerLineSetter(tab_id, rfunc) {
         this._updatePanel(tab_id, {line_setter: rfunc})
    }

    _onDragStart(event, tab_id) {
         this.setState({currently_dragging: tab_id});
         event.stopPropagation()
    }

    _onDragEnd(event) {
         this.setState({dragging_over: null, currently_dragging: null});
         event.stopPropagation();
         event.preventDefault();
    }

    _nextTab(tab_id) {
         let tidx = this.state.tab_ids.indexOf(tab_id);
         if (tidx == -1) return null;
         if (tidx == this.state.tab_ids.length - 1) return "dummy";
         return this.state.tab_ids[tidx + 1]
    }

    _onDrop(event, target_id) {
        if (this.state.currently_dragging == null || this.state.currently_dragging == target_id) return;
        let current_index = this.state.tab_ids.indexOf(this.state.currently_dragging);
        let new_tab_ids = [...this.state.tab_ids];
        new_tab_ids.splice(current_index, 1);
        if (target_id == "dummy") {
            new_tab_ids.push(this.state.currently_dragging)
        }
        else {
            let target_index = new_tab_ids.indexOf(target_id);
            new_tab_ids.splice(target_index, 0, this.state.currently_dragging);
        }
        this.setState({"tab_ids": new_tab_ids, dragging_over: null});
        event.stopPropagation()
    }

    _onDragOver(event, target_id) {
         // this.setState({"dragging_over": target_id});
        event.stopPropagation();
        event.preventDefault();
    }

    _onDragEnter(event, target_id) {
         if (target_id == this.state.currently_dragging || target_id == this._nextTab(this.state.currently_dragging)) {
            this.setState({"dragging_over": null});
        }
         else {
             this.setState({"dragging_over": target_id});
         }
        event.stopPropagation();
        event.preventDefault();
    }

    _onDragLeave(event, target_id) {
         // this.setState({"dragging_over": null});
        event.stopPropagation();
        event.preventDefault();
    }

    render() {
      let bstyle = {paddingTop: 0, paddingBotton: 0};
        let lib_buttons = [];
        let selected_lib_button;
        let selected_bclass;
        selected_lib_button = this.state.selectedLibraryTab;
        selected_bclass = " selected-lib-tab-button";
        // }
        for (let rt of this.resTypes) {
            let cname = "lib-tab-button";
            if (rt == selected_lib_button) {
                cname += selected_bclass
            }
            lib_buttons.push(
                <Button key={rt} icon={this.libIconDict[rt]} className={cname} alignText="left"
                        small={true} minimal={true} onClick={() => {
                    this._changeLibTab(rt)
                }}>
                    {rt}
                </Button>
            )
        }
        let bclass = "context-tab-button-content";
        if (this.state.selectedTabId == "library") {
            bclass += " selected-tab-button"
        }
        let open_resources = {};
        for (let res_type of res_types) {
            open_resources[res_type] = [];
        }
        for (let the_id in this.state.tab_panel_dict) {
            const entry = this.state.tab_panel_dict[the_id];
            if (entry.panel != "spinner") {
                open_resources[entry.res_type].push(entry.panel.resource_name);
            }

        }
        let library_panel;
        library_panel = (
            <div id="library-home-root">
                <LibraryHomeAppPlus {...this.state.library_panel_props}
                                    controlled={true}
                                    am_selected={this.state.selectedTabId == "library"}
                                    open_resources={open_resources}
                                    registerLibraryTabChanger={this._registerLibraryTabChanger}
                                    dark_theme={this.state.dark_theme}
                                    setTheme={this._setTheme}
                                    handleCreateViewer={this._handleCreateViewer}
                                    usable_width={this.state.usable_width}
                                    usable_height={this.state.usable_height}
                    />
            </div>
        );
        // }

        let ltab = (
            <Tab id="library" tabIndex={-1} key="library" className="context-tab" panel={library_panel}>
                <div className={bclass}>
                        <Button minimal={true}
                                onClick={()=>{this._select_repository(false)}}>
                            <span className="context-library-title">Library</span>
                        </Button>
                    <div style={{display: "flex", flexDirection: "column", marginBottom: 5}}>
                        {lib_buttons}
                        {/*<Divider/>*/}
                    </div>
                </div>
            </Tab>
        );
        
        let all_tabs = [ltab];
        for (let tab_id of this.state.tab_ids) {
            let tab_entry = this.state.tab_panel_dict[tab_id];
            let bclass = "context-tab-button-content";
            if (this.state.selectedTabId == tab_id) {
                bclass += " selected-tab-button"
            }
            let visible_title = tab_entry.title;
            let wrapped_panel;
            if (tab_entry.panel == "spinner") {
                wrapped_panel = spinner_panel
            }
            else {
                let TheClass = this.classDict[tab_entry.kind];
                let the_panel = <TheClass {...tab_entry.panel}
                                          controlled={true}
                                          dark_theme={this.state.dark_theme}  // needed for error drawer and status
                                          handleCreateViewer={this._handleCreateViewer}
                                          setTheme={this._setTheme}
                                          am_selected={tab_id == this.state.selectedTabId}
                                          changeResourceName={(new_name, callback=null, change_title=true)=>{
                                              this._changeResourceName(tab_id, new_name, change_title, callback)
                                          }}
                                          changeResourceTitle={(new_title)=>this._changeResourceTitle(tab_id, new_title)}
                                          changeResourceProps={(new_props, callback=null)=>{
                                              this._changeResourceProps(tab_id, new_props, callback)
                                          }}
                                          updatePanel={(new_panel, callback=null)=>{
                                              this._updatePanel(tab_id, new_panel, callback)
                                          }}
                                          goToModule={this._goToModule}
                                          registerLineSetter={(rfunc)=>this._registerLineSetter(tab_id, rfunc)}
                                          refreshTab={()=>{this._refreshTab(tab_id)}}
                                          closeTab={()=>{this._closeTab(tab_id)}}
                                          tsocket={tab_entry.panel.tsocket}
                                          usable_width={this.state.usable_width}
                                          usable_height={this.state.usable_height}
                    />;
                wrapped_panel = (
                    <ErrorBoundary>
                         <div id={tab_id + "-holder"} className={this.panelRootDict[this.state.tab_panel_dict[tab_id].kind]}>
                             {the_panel}
                         </div>
                    </ErrorBoundary>
                 );
            }
            let icon_style = {verticalAlign: "middle", paddingLeft: 4};
            if (tab_id == this.state.dragging_over) {
                bclass += " hovering";
            }
            if (tab_id == this.state.currently_dragging) {
                bclass += " currently-dragging"
            }
            let new_tab = (
                <Tab id={tab_id} draggable="true"
                     onDragStart={(e)=>{this._onDragStart(e, tab_id)}}
                     onDrop={(e)=>{this._onDrop(e, tab_id)}}
                     onDragEnter={(e)=>{this._onDragEnter(e, tab_id)}}
                     onDragOver={(e)=>{this._onDragOver(e, tab_id)}}
                     onDragLeave={(e)=>{this._onDragLeave(e, tab_id)}}
                     onDragEnd={(e)=>{this._onDragEnd(e)}}
                     tabIndex={-1} key={tab_id} panelClassName="context-tab" title="" panel={wrapped_panel}>
                    <div className={bclass + " open-resource-tab"} style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <div style={{display: "table-cell", flexDirection: "row", justifyContent: "flex-start"}}>
                            <Icon icon={this.iconDict[tab_entry.kind]}
                                  style={{verticalAlign: "middle", marginRight: 5}}
                                  iconSize={13} tabIndex={-1}/>
                            <span >{visible_title}</span>
                        </div>
                        <div>
                            <Icon icon="reset" style={icon_style} iconSize={13} className="context-close-button" tabIndex={-1} onClick={() => {
                                this._refreshTab(tab_id)
                            }}/>
                            <Icon icon="delete" style={icon_style} iconSize={13} className="context-close-button" tabIndex={-1} onClick={() => {
                                this._closeTab(tab_id)
                            }}/>
                        </div>
                    </div>
                </Tab>
            );
            all_tabs.push(new_tab)
        }

        // The purpose of the dummy tab is to make it possible to drag a tab to the bottom of the list
        bclass = "context-tab-button-content";
        if (this.state.dragging_over == "dummy") {
            bclass += " hovering";
        }
        let dummy_tab = (
            <Tab id="dummy" draggable="false"
                 disabled={true}
                 onDrop={(e)=>{this._onDrop(e, "dummy")}}
                 onDragEnter={(e)=>{this._onDragEnter(e, "dummy")}}
                 onDragOver={(e)=>{this._onDragOver(e, "dummy")}}
                 onDragLeave={(e)=>{this._onDragLeave(e, "dummy")}}
                 tabIndex={-1} key="dummy" panelClassName="context-tab" title="" panel={null}>
                    <div className={bclass} style={{height: 30, display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    </div>
                </Tab>
        );
        all_tabs.push(dummy_tab);

        let outer_class = "pane-holder ";
        if (this.state.dark_theme) {
            outer_class = `${outer_class} bp4-dark`;
        }
        else {
            outer_class = `${outer_class} light-theme`;
        }
        let outer_style = {width: "100%",
            height: this.state.usable_height,
            paddingLeft: 0
        };
        return (
            <React.Fragment>
                <TacticNavbar is_authenticated={window.is_authenticated}
                              dark_theme={this.state.dark_theme}
                              setTheme={this._setTheme}
                              selected={null}
                              show_api_links={false}
                              extra_text={window.database_type == "Local" ? "" : window.database_type}
                              page_id={window.context_id}
                              user_name={window.username}/>
                    <div className={outer_class} style={outer_style} ref={this.top_ref}>
                        <div id="context-container" style={outer_style}>
                            <DragHandle position_dict={{position: "absolute", left: this.state.tabWidth - 5}}
                                    onDrag={this._handleTabResize}
                                    dragStart={null}
                                    dragEnd={null}
                                    direction="x"
                                    useVerticalBar={true}/>
                            <Tabs id="context-tabs" selectedTabId={this.state.selectedTabId}
                                  className="context-tab-list"
                                  vertical={true}
                                  onChange={this._handleTabSelect}>
                                {all_tabs}
                            </Tabs>
                        </div>
                    </div>
                    <KeyTrap global={true} bindings={this.key_bindings}/>
            </React.Fragment>
        )
    }

}

_context_main();
