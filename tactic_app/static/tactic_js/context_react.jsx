
import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/library_home.scss";
import "../tactic_css/tile_creator.scss";

import React from "react";
import * as ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';

import { Tab, Tabs, Button, Icon, Divider, Tooltip, Spinner } from "@blueprintjs/core";


import { FocusStyleManager } from "@blueprintjs/core";

FocusStyleManager.onlyShowFocusOnTabs();

import {TacticSocket} from "./tactic_socket";
import {handleCallback} from "./communication_react.js";
import {doFlash, withStatus} from "./toaster.js";
import {TacticNavbar} from "./blueprint_navbar";
import {library_in_context} from "./library_home_react.js";

import {doBinding, guid} from "./utilities_react.js";
import {module_viewer_in_context} from "./module_viewer_react.js";
import {tile_creator_main_in_context} from  "./tile_creator_react.js";
import {main_main_in_context} from "./main_app.js"
import {main_notebook_in_context} from "./notebook_app.js";
import {code_viewer_in_context} from "./code_viewer_react.js";
import {list_viewer_in_context} from "./list_viewer_react.js";
import {withErrorDrawer} from "./error_drawer.js";
import {getUsableDimensions, SIDE_MARGIN, USUAL_TOOLBAR_HEIGHT} from "./sizing_tools.js";

class ContextTacticSocket extends TacticSocket {

    initialize_socket_stuff(reconnect=false) {
        let self = this;
        this.socket.emit('join', {room: window.user_id});
        this.socket.emit('join-main', {"room": window.context_id, "user_id": window.user_id}, function (response) {
            });
        this.socket.on("window-open", data => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));
        this.socket.on('handle-callback', handleCallback);
        this.socket.on('close-user-windows', data => {
            if (!(data["originator"] === self.extra_args.library_id)) {
                window.close()
            }
        });
        this.socket.on('doflash', doFlash);
    }
}

function _context_main() {
    window.context_id = guid();
    window.main_id = window.context_id;
    let tsocket = new ContextTacticSocket("main",
        5000);
    // window.tsocket = tsocket;
    const ContextAppPlus = withErrorDrawer(withStatus(ContextApp, tsocket), tsocket);
    const domContainer = document.querySelector('#context-root');
    ReactDOM.render(<ContextAppPlus initial_theme={window.theme} tsocket={tsocket}/>, domContainer);
}

class ContextApp extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.socket_counter = null;
        const aheight = getUsableDimensions(true).usable_height_no_bottom;
        const awidth = getUsableDimensions(true).usable_width - 170;
        this.state = {
            tab_ids: [],
            library_panel: [],
            tab_panel_dict: {},
            dark_theme: props.initial_theme === "dark",
            selectedTabId: null,
            theme_setters: [],
            lastSelectedTabId: null,
            selectedLibraryTab: "collections"
        };
        this.libraryTabChange = null;
        this.top_ref = React.createRef();
        this.ref_dict = {}
    }

    _setTheme(dark_theme) {
        window.theme = dark_theme ? "dark" : "light";
        this.setState({dark_theme}, ()=> {
            // this.props.setStatusTheme(dark_theme);
            for (let setter of this.state.theme_setters) {
                setter(dark_theme)
            }
        })
    }

    _registerThemeSetter(setter) {
        this.setState({theme_setters: [...this.state.theme_setters, setter]})
    }

    _registerLibraryTabChanger(handleTabChange) {
        this.libraryTabChange = handleTabChange
    }

    _changeLibTab(res_type) {
        this.libraryTabChange(res_type + "-pane");
        this.setState({selectedLibraryTab: res_type})
    }
    
    get resTypes() {
        return ["collections", "projects", "tiles", "lists", "code"]
    }

    componentDidMount() {
        window.dark_theme = this.state.dark_theme;
        let library_panel = library_in_context(this._handleCreateViewer, this._registerLibraryTabChanger);
        this.setState({library_panel: library_panel, selectedTabId: "library"}, ()=>{
        })
    }

    componentDidUpdate() {
        if (this.props.tsocket.counter != this.socket_counter) {
            this.initSocket();
        }
    }

    initSocket() {
         // It is necessary to delete and remake these callbacks
         // If I dont delete I end up with duplicatesSelectList
         // If I just keep the original one then I end up something with a handler linked
         // to an earlier state
         this.props.tsocket.socket.off("create-viewer");
         this.props.tsocket.socket.on("create-viewer", this._handleCreateViewer);
         this.socket_counter = this.props.tsocket.counter
     }

     _closeTab(the_id) {
        let idx =this.state.tab_ids.indexOf(the_id);
        let copied_tab_panel_dict = {...this.state.tab_panel_dict};
        let copied_tab_ids = [...this.state.tab_ids];
        if (idx > -1) {
          copied_tab_ids.splice(idx, 1);
          delete copied_tab_panel_dict[the_id];
            delete this.ref_dict[the_id]
        }
        let new_state = {tab_panel_dict: copied_tab_panel_dict, tab_ids: copied_tab_ids};
        let currentlySelected = this.state.selectedTabId;
        let stateUpdate;
        if (the_id == this.state.selectedTabId) {
            let newSelectedId;
            if (this.state.lastSelectedTabId && copied_tab_ids.includes(this.state.lastSelectedTabId)) {
                newSelectedId = this.state.lastSelectedTabId;
            }
            else {
                newSelectedId = "library"
            }
            stateUpdate = {selectedTabId: newSelectedId, lastSelectedTabId: "library"}
        }
        else {
            stateUpdate = {selectedTabId: currentlySelected};
            if (this.state.lastSelectedTabId == the_id) {
                stateUpdate.lastSelectedTabId = "library"
            }
        }

        this.setState(new_state, ()=>{
            this.setState(stateUpdate)
        })
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

     get handlerDict() {
         return {
             "module-viewer": module_viewer_in_context,
             "code-viewer": code_viewer_in_context,
             "list-viewer": list_viewer_in_context,
             "creator-viewer": tile_creator_main_in_context,
             "main-viewer": main_main_in_context,
             "notebook-viewer": main_notebook_in_context
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

     _addPanel(new_id, kind, title, new_panel, callback=null) {
         let wrapped_panel = (
             <div id={new_id + "-holder"} className={this.panelRootDict[kind]}>
                 {new_panel}
             </div>
         );
         let new_tab_panels = {...this.state.tab_panels};
         new_tab_panels[new_id] = {kind: kind, title: title, panel: wrapped_panel};
         this.setState({
                 tab_panels: new_tab_panels,
                 tab_ids: [...this.state.tab_ids, new_id],
                 lastSelectedTabId: this.state.selectedTabId,
                 selectedTabId: new_id}, callback)
     }

     _updatePanel(the_id, new_panel) {
         let wrapped_panel = (
             <div id={the_id + "-holder"} className={this.panelRootDict[this.state.tab_panels[the_id].kind]}>
                 {new_panel}
             </div>
         );
         let new_tab_panels = {...this.state.tab_panels};
         new_tab_panels[the_id].panel = wrapped_panel;
         this.setState({tab_panels: new_tab_panels})
     }

     _handleCreateViewer(data) {
        let self = this;

         const new_id = `${data.kind}: ${data.resource_name}`;
         if (this.state.tab_ids.includes(new_id)) {
            this.setState({selectedTabId: new_id});
             return
         }
         let spinner_panel = (
             <div style={{height: "100%", position: "absolute", top: "50%", left: "50%"}}>
                 <Spinner size={100}/>
             </div>);
         let new_ref = React.createRef();
         this.ref_dict[new_id] = new_ref;
         this._addPanel(new_id, data.kind, data.resource_name, spinner_panel, ()=>{
                 this.handlerDict[data.kind](data, this._registerThemeSetter, (new_panel)=>{
                 self._updatePanel(new_id, new_panel);
             }, new_ref)
         })

     }

    _handleTabSelect(newTabId, prevTabId, event) {
        this.setState({selectedTabId: newTabId, lastSelectedTabId: prevTabId}, ()=>{
            if (this.ref_dict[newTabId] && this.ref_dict[newTabId].current) {
                this.ref_dict[newTabId].current._update_window_dimensions()
            }
        })
    }

    render() {
      let bstyle = {paddingTop: 0, paddingBotton: 0};
        let lib_buttons = [];
        for (let rt of this.resTypes) {
            let cname = "lib-tab-button";
            if (rt == this.state.selectedLibraryTab) {
                cname += " selected-lib-tab-button"
            }
            lib_buttons.push(
                <Button className={cname} alignText="left" minimal={true} onClick={() => {
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
        let ltab = (
            <Tab id="library" className="context-tab" panel={this.state.library_panel}>
                <div className={bclass}>
                    Library
                    <div style={{display: "flex", flexDirection: "column"}}>
                        {lib_buttons}
                        <Divider/>
                    </div>
                </div>
            </Tab>
        );
        let all_tabs = [ltab];
        for (let tab_id of this.state.tab_ids) {
            let tab_entry = this.state.tab_panels[tab_id];
            let bclass = "context-tab-button-content";
            if (this.state.selectedTabId == tab_id) {
                bclass += " selected-tab-button"
            }
            let visible_title;
            if (tab_entry.title.length > 15) {
                visible_title = (
                    <Tooltip content={tab_entry.title} hoverOpenDelay={1000}>
                        {tab_entry.title.slice(0, 13) + "…"}
                    </Tooltip>
                )
            }
            else {
                visible_title = tab_entry.title
            }
            let new_tab = (
                <Tab id={tab_id} panelClassname="context-tab" title="" panel={tab_entry.panel}>
                    <div className={bclass} style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <div style={{display: "table-cell", flexDirection: "row", justifyContent: "flex-start"}}>
                            <Icon icon={this.iconDict[tab_entry.kind]}
                                  style={{verticalAlign: "middle", marginRight: 5}}
                                  iconSize={14} tabIndex={-1}/>
                            {visible_title}
                        </div>
                        <Button icon="cross" minimal={true} tabIndex={-1} onClick={() => {
                            this._closeTab(tab_id)
                        }}/>
                    </div>
                </Tab>
            );
            all_tabs.push(new_tab)
        }

        let outer_class = "pane-holder ";
        if (this.state.dark_theme) {
            outer_class = `${outer_class} bp3-dark`;
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
                              selected={null}
                              show_api_links={true}
                              dark_theme={this.state.dark_theme}
                              set_parent_theme={this._setTheme}
                              user_name={window.username}/>
                    <div className={outer_class} style={outer_style} ref={this.top_ref}>
                        <div id="context-container" style={outer_style}>
                            <Tabs id="context-tabs" selectedTabId={this.state.selectedTabId}
                                  className="context-tab-list"
                                  vertical={true}
                                  onChange={this._handleTabSelect}>
                                {all_tabs}
                            </Tabs>
                        </div>
                    </div>
            </React.Fragment>
        )
    }

}


_context_main();