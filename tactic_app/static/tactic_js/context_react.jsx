
import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/library_home.scss";
import "../tactic_css/tile_creator.scss";

import React from "react";
import * as ReactDOM from 'react-dom'

import { Tab, Tabs, Button, Icon } from "@blueprintjs/core";

import { FocusStyleManager } from "@blueprintjs/core";

FocusStyleManager.onlyShowFocusOnTabs();

import {TacticSocket} from "./tactic_socket";
import {handleCallback} from "./communication_react.js";
import {doFlash} from "./toaster.js";
import {TacticNavbar} from "./blueprint_navbar";
import {library_in_context} from "./library_home_react.js";

import {doBinding, guid} from "./utilities_react.js";
import {module_viewer_in_context} from "./module_viewer_react.js";
import {tile_creator_main_in_context} from  "./tile_creator_react.js";
import {main_main_in_context} from "./main_app.js"
import {main_notebook_in_context} from "./notebook_app.js";
import {code_viewer_in_context} from "./code_viewer_react.js";
import {list_viewer_in_context} from "./list_viewer_react.js";
import PropTypes from "../js/prop-types";



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
    const domContainer = document.querySelector('#context-root');
    ReactDOM.render(<ContextApp initial_theme={window.theme} tsocket={tsocket}/>, domContainer);
}

class ContextApp extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.socket_counter = null;
        this.state = {
            tab_list: [],
            tab_ids: [],
            dark_theme: props.initial_theme === "dark",
            selectedTabId: null,
            theme_setters: [],
            lastSelectedTabId: null,
            selectedLibraryTab: "collections"
        };
        this.libraryTabChange = null
    }

    _setTheme(dark_theme) {
        this.setState({dark_theme}, ()=> {
            // this.props.setStatusTheme(dark_theme);
            window.dark_theme = dark_theme;
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
        let lpanel = library_in_context(this._handleCreateViewer, this._registerLibraryTabChanger);
        let bstyle = {paddingTop: 0, paddingBotton: 0};
        let lib_buttons = [];
        for (let rt of this.resTypes) {
            lib_buttons.push(
                <Button className="lib-button" data-res-type={rt} alignText="left" minimal={true} onClick={() => {
                    this._changeLibTab(rt)
                }}>
                    {rt}
                </Button>
            )
        }
        let ltab = (
            <Tab id="library" className="context-tab" title="Library" panel={lpanel}>
                <div style={{display: "flex", flexDirection: "column"}}>
                    {lib_buttons}
                </div>
            </Tab>
        );
        this.setState({tab_list: [ltab], selectedTabId: "library",  tab_ids:["libary"]})
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
        let copied_tab_list = [...this.state.tab_list];
        let copied_tab_ids = [...this.state.tab_ids];
        if (idx > -1) {
          copied_tab_list.splice(idx, 1);
          copied_tab_ids.splice(idx, 1);
        }
        let new_state = {tab_list: copied_tab_list, tab_ids: copied_tab_ids};
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

     _handleCreateViewer(data) {
        let self = this;

         const new_id = `${data.kind}: ${data.resource_name}`;
         if (this.state.tab_ids.includes(new_id)) {
            this.setState({selectedTabId: new_id});
             return
         }
         this.handlerDict[data.kind](data, this._registerThemeSetter, (new_panel)=>{
             let wrapped_panel = (
                 <div className={this.panelRootDict[data.kind]}>
                     {new_panel}
                 </div>
             );
             const new_tab = (
                     <Tab id={new_id} className="context-tab" title="" panel={wrapped_panel}>
                         <Icon icon={this.iconDict[data.kind]}
                               style={{verticalAlign: "middle", marginRight: 5}}
                               iconSize={14} tabIndex={-1}/>
                         {data.resource_name}
                         <Button icon="cross" minimal={true} tabIndex={-1} onClick={()=>{this._closeTab(new_id)}}/>
                     </Tab>
             );

             this.setState({
                 tab_list: [...this.state.tab_list, new_tab],
                 tab_ids: [...this.state.tab_ids, new_id],
                 lastSelectedTabId: this.state.selectedTabId,
                 selectedTabId: new_id})
         })
     }

    _handleTabSelect(newTabId, prevTabId, event) {
        this.setState({selectedTabId: newTabId, lastSelectedTabId: prevTabId})
    }


    render() {
        let outer_class = "pane-holder ";
        if (this.state.dark_theme) {
            outer_class = `${outer_class} bp3-dark`;
        }
        return (
            <React.Fragment>
                <TacticNavbar is_authenticated={window.is_authenticated}
                              selected={null}
                              show_api_links={true}
                              dark_theme={this.state.dark_theme}
                              set_parent_theme={this._setTheme}
                              user_name={window.username}/>
                    <div className={outer_class}>
                        <div id="context-container">
                            <Tabs id="context-tabs" selectedTabId={this.state.selectedTabId}
                                  className={"context-tab-list " + this.state.selectedLibraryTab + "-selected"}
                                     vertical={true} onChange={this._handleTabSelect}>
                                {this.state.tab_list}
                            </Tabs>
                        </div>
                    </div>
            </React.Fragment>
        )
    }

}


_context_main();