

import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/tile_creator.scss";

import React from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import { Tab, Tabs, ResizeSensor } from "@blueprintjs/core";

import {TacticSocket} from "./tactic_socket.js";
import {Toolbar, Namebutton} from "./blueprint_toolbar.js";
import {sendToRepository} from "./resource_viewer_react_app.js";
import {ReactCodemirror} from "./react-codemirror.js";
import {CombinedMetadata} from "./blueprint_mdata_fields.js";
import {OptionModule, ExportModule} from "./creator_modules_react.js";
import {HorizontalPanes, VerticalPanes} from "./resizing_layouts.js";
import {handleCallback, postAjax, postAjaxPromise, postWithCallback} from "./communication_react.js"
import {withStatus, doFlash} from "./toaster.js"
import {getUsableDimensions, SIDE_MARGIN, USUAL_TOOLBAR_HEIGHT} from "./sizing_tools.js";
import {withErrorDrawer} from "./error_drawer.js";
import {doBinding} from "./utilities_react.js"
import {TacticNavbar} from "./blueprint_navbar";

const BOTTOM_MARGIN = 50;
const MARGIN_SIZE = 17;

window.main_id = window.module_viewer_id; // This matters for communication_react
window.name = window.module_viewer_id;


let tsocket;

// Note: it seems like the sendbeacon doesn't work if this callback has a line
// before the sendbeacon
window.addEventListener("unload", function sendRemove() {
    navigator.sendBeacon("/delete_container_on_unload",
        JSON.stringify({"container_id": window.module_viewer_id, "notify": false}));
});


class CreatorViewerSocket extends TacticSocket {

    initialize_socket_stuff (reconnect=false) {
        this.socket.emit('join', {"room": window.user_id});
        if (reconnect) {
            this.socket.emit('join-main', {"room": window.module_viewer_id, "user_id": window.user_id}, function (response) {
            })
        }
        this.socket.on('handle-callback', handleCallback);
        this.socket.on('close-user-windows', (data) => {
            if (!(data["originator"] == window.module_viewer_id)) {
                window.close()
            }
        });
        this.socket.on("doFlash", function(data) {
            doFlash(data)
        });
    }
}

function tile_creator_main() {
    tsocket = new CreatorViewerSocket("main", 5000);
    tsocket.socket.on("remove-ready-block", _everyone_ready);
    tsocket.socket.emit('join-main', {"room": window.module_viewer_id, "user_id": window.user_id}, function(response) {
        tsocket.socket.emit('client-ready', {"room": window.module_viewer_id, "user_id": window.user_id, "participant": "client",
                "rb_id": window.ready_block_id, "main_id": window.module_viewer_id})
    });
}

function _everyone_ready() {
    let the_content = {"module_name": window.module_name,
                    "module_viewer_id": window.module_viewer_id,
                    "tile_collection_name": window.tile_collection_name,
                    "user_id": window.user_id,
                    "version_string": window.version_string};
    postWithCallback(window.module_viewer_id, "initialize_parser", the_content, got_parsed_data);
}

function got_parsed_data (data_object) {
    let domContainer = document.querySelector('#creator-root');
    let parsed_data = data_object.the_content;
    let result_dict = {"res_type": "tile", "res_name": window.module_name, "is_repository": false};

    postAjaxPromise("grab_metadata", result_dict)
        .then(function (data) {
            let split_tags = data.tags == "" ? [] : data.tags.split(" ");
            let category = parsed_data.category ? parsed_data.category : "basic";
            ReactDOM.render(<CreatorAppPlus
                                            is_mpl={parsed_data.is_mpl}
                                            is_d3={parsed_data.is_d3}
                                            render_content_code={parsed_data.render_content_code}
                                            render_content_line_number={parsed_data.render_content_line_number}
                                            extra_methods_line_number={parsed_data.extra_methods_line_number}
                                            draw_plot_line_number={parsed_data.draw_plot_line_number}
                                            initial_line_number={window.line_number}
                                            category={category}
                                            extra_functions={parsed_data.extra_functions}
                                            draw_plot_code={parsed_data.draw_plot_code}
                                            jscript_code={parsed_data.jscript_code}
                                            tags={split_tags}
                                            notes={data.notes}
                                            initial_theme={window.theme}
                                            option_list={parsed_data.option_dict}
                                            export_list={parsed_data.export_list}
                                            created={data.datestring}

            />, domContainer);
        })
        .catch(function (data) {
            doFlash(data);
        })
}

function TileCreatorToolbar(props) {
    let tstyle = {"marginTop": 20, "paddingRight": 20, "width": "100%"};
    return (
        <div style={tstyle} className="d-flex flex-row justify-content-between">
            <Namebutton resource_name={props.tile_name}
                        setResourceNameState={props.setResourceNameState}
                        res_type={props.res_type}
            />
            <div>
                <Toolbar button_groups={props.button_groups}/>
            </div>
        </div>
    )
}

class CreatorApp extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.top_ref = React.createRef();
        let aheight = getUsableDimensions().usable_height;
        let awidth = getUsableDimensions().usable_width;
        let bheight = getUsableDimensions().body_height;
        this.options_ref = React.createRef();
        this.left_div_ref = React.createRef();
        this.right_div_ref = React.createRef();
        this.tc_span_ref = React.createRef();
        this.rc_span_ref = React.createRef();
        this.vp_ref = React.createRef();
        this.hp_ref = React.createRef();
        this.methods_ref = React.createRef();
        this.draw_plot_bounding_ref = React.createRef();
        this.last_save = {};
        this.dpObject = null;
        this.rcObject = null;
        this.emObject = null;
        this.line_number = this.props.initial_line_number;
        this.socket_counter = null;
        this.state = {
            tile_name: window.module_name,
            foregrounded_panes: {
                "metadata": true,
                "options": false,
                "exports": false,
                "methods": false
            },
            render_content_code: this.props.render_content_code,
            draw_plot_code: this.props.draw_plot_code,
            jscript_code: this.props.jscript_code,
            extra_functions: this.props.extra_functions,
            render_content_line_number: this.props.render_content_line_number,
            draw_plot_line_number: this.props.draw_plot_line_number,
            extra_methods_line_number: this.props.extra_methods_line_number,
            tags: this.props.tags,
            notes: this.props.notes,
            option_list: this.props.option_list,
            export_list: this.props.export_list,
            category: this.props.category,
            total_height: window.innerHeight,
            selectedTabId: "metadata",
            usable_width: awidth,
            old_usable_width: 0,
            usable_height: aheight,
            dark_theme: this.props.initial_theme == "dark",
            body_height: bheight,
            top_pane_height: this.props.is_mpl || this.props.is_d3 ? aheight / 2 - 25 : null,
            bottom_pane_height: this.props.is_mpl || this.props.is_d3 ? aheight / 2 - 25 : null,
            left_pane_width: awidth / 2 - 25,
            methodsTabRefreshRequired: true // This is toggled back and forth to force refresh
        };
        this._setResourceNameState = this._setResourceNameState.bind(this);
        this.handleStateChange = this.handleStateChange.bind(this);
        this.handleRenderContentChange = this.handleRenderContentChange.bind(this);
        this.handleTopCodeChange = this.handleTopCodeChange.bind(this);
        this.update_window_dimensions = this.update_window_dimensions.bind(this);
        this.handleOptionsChange = this.handleOptionsChange.bind(this);
        this.handleExportsChange = this.handleExportsChange.bind(this);
        this.handleMethodsChange = this.handleMethodsChange.bind(this);
        this.handleLeftPaneResize = this.handleLeftPaneResize.bind(this);
        this.handleTopPaneResize = this.handleTopPaneResize.bind(this);
        let self = this;
        window.addEventListener("beforeunload", function (e) {
            if (self.dirty()) {
                e.preventDefault();
                e.returnValue = ''
            }
        });
    }

    get button_groups() {
        let bgs = [
                    [{"name_text": "Save", "icon_name": "saved","click_handler": this._saveMe, key_bindings: ['ctrl+s', "command+s"], tooltip: "Save"},
                     {"name_text": "Mark", "icon_name": "map-marker", "click_handler": this._saveAndCheckpoint, key_bindings: ['ctrl+m'], tooltip: "Save and checkpoint"},
                     {"name_text": "SaveAs", "icon_name": "floppy-disk", "click_handler": this._saveModuleAs, tooltip: "Save as"},
                     {"name_text": "Load", "icon_name": "upload", "click_handler": this._loadModule, key_bindings: ['ctrl+l'], tooltip: "Load tile"},
                     {"name_text": "Share", "icon_name": "share",
                        "click_handler": () => {sendToRepository("tile", this.state.tile_name)}, tooltip: "Send to repository"}],
                    [{"name_text": "History", "icon_name": "history", "click_handler": this._showHistoryViewer, tooltip: "Show history viewer"},
                     {"name_text": "Compare", "icon_name": "comparison", "click_handler": this._showTileDiffer, tooltip: "Compare to another tile"}],
                    [{"name_text": "Drawer", "icon_name": "drawer-right", "click_handler": this.props.toggleErrorDrawer, tooltip: "Toggle error drawer"}]
            ];

        for (let bg of bgs) {
            for (let but of bg) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return bgs
    }

    _setTheme(dark_theme) {
        this.setState({dark_theme: dark_theme}, ()=> {
            this.props.setStatusTheme(dark_theme);
            window.dark_theme = this.state.dark_theme
        })
    }

    _showHistoryViewer () {
        window.open(`${$SCRIPT_ROOT}/show_history_viewer/${this.state.tile_name}`)
    }

    _showTileDiffer () {
        window.open(`${$SCRIPT_ROOT}/show_tile_differ/${this.state.tile_name}`)
    }

    _doFlashStopSpinner(data) {
        this.props.clearStatus();
        doFlash(data)
    }

    _selectLineNumber(lnumber) {
        this.line_number = lnumber;
        this._goToLineNumber()
    }

    _logErrorStopSpinner(content, title=null, open=true, line_number=null) {
        this.props.stopSpinner();
        this.props.addErrorDrawerEntry({title: title, content: content, line_number: line_number}, true);
        if (open) {
            this.props.openErrorDrawer();
        }
    }

  dirty() {
        let current_state = this._getSaveDict();
        for (let k in current_state) {
            if (current_state[k] != this.last_save[k]) {
                return true
            }
        }
        return false
    }


    _loadModule() {
        let self = this;
        this.props.startSpinner();
        this.doSavePromise()
            .then(function () {
                self.props.statusMessage("Loading Module");
                postWithCallback("host", "load_tile_module_task", {"tile_module_name": self.state.tile_name, "user_id": user_id}, load_success)
            })
            .catch((data)=>{self._logErrorStopSpinner(data.message, "Error loading module", true, data.line_number)});

        function load_success(data) {
            if (data.success) {
                data.timeout = 2000;
            }
            self._doFlashStopSpinner(data);
            return false
        }
    }

    _saveModuleAs() {
        doFlash({"message": "not implemented yet"});
        return false
    }

    _saveMe() {
        let self = this;
        this.props.startSpinner();
        this.props.statusMessage("Saving Module");
        this.doSavePromise()
            .then(self._doFlashStopSpinner)
            .catch((data)=> {self._logErrorStopSpinner(data.message, "Error saving module")});
        return false
    }


    _saveAndCheckpoint() {
        this.props.startSpinner();
        let self = this;
        this.doSavePromise()
            .then(function (){
                self.props.statusMessage("Checkpointing");
                self.doCheckpointPromise()
                    .then(self._doFlashStopSpinner)
                    .catch((data)=>{self._logErrorStopSpinner(data.message, "Error checkpointing module")})
            })
            .catch((data)=>{self._logErrorStopSpinner(data.message, "Error saving module")});
        return false

    }

    get_tags_string() {
        let taglist = this.state.tags;
        let tags = "";
        for (let tag of taglist) {
            tags = tags + tag + " "
        }
        return tags.trim();
    }

    _getSaveDict() {
        return {
                "module_name": this.state.tile_name,
                "category": this.state.category.length == 0 ? "basic" : this.state.category,
                "tags": this.get_tags_string(),
                "notes": this.state.notes,
                "exports": this.state.export_list,
                "options": this.state.option_list,
                "extra_methods": this.state.extra_functions,
                "render_content_body": this.state.render_content_code,
                "is_mpl": this.props.is_mpl,
                "is_d3": this.props.is_d3,
                "draw_plot_body": this.state.draw_plot_code,
                "jscript_body": this.state.jscript_code,
                "last_saved": "creator"
            };
    }

    doSavePromise() {
        let self = this;
        return new Promise (function (resolve, reject) {
            let result_dict = self._getSaveDict();

            postWithCallback(module_viewer_id, "update_module", result_dict, function (data) {
                if (data.success) {
                    self.save_success(data);
                    resolve(data)
                }
                else {
                    reject(data)
                }
            })
        })
    }

    doCheckpointPromise() {
        let self = this;
        return new Promise (function (resolve, reject) {
            postAjax("checkpoint_module", {"module_name": self.state.tile_name}, function (data) {
                if (data.success) {
                    resolve(data)
                }
                else {
                    reject(data)
                }
            });
        })
    }

    save_success(data) {
        let self = this;
        this.setState({"render_content_line_number": data.render_content_line_number,
            "extra_methods_line_number": data.extra_methods_line_number,
            "draw_plot_line_number": data.draw_plot_line_number

        });
        this._update_saved_state();
    }

    update_window_dimensions() {
        let uwidth = window.innerWidth - 2 * SIDE_MARGIN;
        let uheight = window.innerHeight - BOTTOM_MARGIN;
        if (this.top_ref && this.top_ref.current) {
            uheight = window.innerHeight - BOTTOM_MARGIN - this.top_ref.current.offsetTop;
        }
        else {
            uheight = uheight - USUAL_TOOLBAR_HEIGHT
        }
        this.setState({usable_height: uheight, usable_width: uwidth})
    }

    _update_saved_state() {
        this.last_save = this._getSaveDict();
    }

    _selectLine(cm, lnumber) {
        let doc = cm.getDoc();
        if (doc.getLine(lnumber)) {
            doc.setSelection(
                {line: lnumber, ch: 0},
                {line: lnumber, ch: doc.getLine(lnumber).length},
                {scroll: true})
        }

    }

    _goToLineNumber() {
        if (this.line_number) {
            if (this.props.is_mpl || this.props.is_d3) {
                if (this.line_number < this.state.draw_plot_line_number) {
                    if (this.emObject) {
                        this._handleTabSelect("methods")
                        this._selectLine(this.emObject, this.line_number - this.state.extra_methods_line_number);
                        this.line_number = null

                    } else {
                        return
                    }
                }
                else if (this.line_number < this.state.render_content_line_number) {
                    if (this.dpObject) {
                        this._selectLine(this.dpObject, this.line_number - this.state.draw_plot_line_number - 1)
                        this.line_number = null
                    } else {
                        return
                    }
                } else if (this.rcObject) {
                    this._selectLine(this.rcObject, this.line_number - this.state.render_content_line_number - 1)
                    this.line_number = null
                }
            }
            else {
                if (this.line_number < this.props.render_content_line_number) {
                    if (this.emObject) {
                        this._handleTabSelect("methods")
                        this._selectLine(this.emObject, this.line_number - this.state.extra_methods_line_number)
                        this.line_number = null
                    } else {
                        return
                    }
                } else {
                    if (this.rcObject) {
                        this._selectLine(this.rcObject, this.line_number - this.state.render_content_line_number - 1)
                        this.line_number = null
                    }
                }
            }
        }
    }

    componentDidMount() {
        this.setState({"mounted": true});
        document.title = this.state.tile_name;
        this._goToLineNumber();
        this.props.setGoToLineNumber(this._selectLineNumber)
        window.addEventListener("resize", this.update_window_dimensions);
        this.update_window_dimensions();
        this._update_saved_state();
        this.props.stopSpinner();
        this.props.setStatusTheme(this.state.dark_theme)
        this.initSocket();
        window.dark_theme = this.state.dark_theme
    }

    componentDidUpdate() {
        this._goToLineNumber();
        if (tsocket.counter != this.socket_counter) {
            this.initSocket();
        }
    }
    
    initSocket() {
        tsocket.socket.on('focus-me', (data)=>{
            window.focus();
            this._selectLineNumber(data.line_number)
        });
        this.socket_counter = tsocket.counter
    }

    // This toggles methodsTabRefreshRequired back and forth to force a refresh
    _refreshMethodsIfNecessary(newTabId){
        if (newTabId == "methods") {
            this.setState({methodsTabRefreshRequired: !this.state.methodsTabRefreshRequired})
        }
    }

    _handleTabSelect(newTabId, prevTabid, event) {
        this._refreshMethodsIfNecessary(newTabId);
        // if (this.state.foregrounded_panes[newTabId]) return;
        let new_fg = Object.assign({}, this.state.foregrounded_panes);
        new_fg[newTabId] = true;
        this.setState({selectedTabId: newTabId, foregrounded_panes: new_fg}, ()=>{
            this.update_window_dimensions();
        })
    }

    _handleNotesAppend(new_text) {
        this.setState({"notes": this.state.notes + new_text});
    }

    handleStateChange(state_stuff) {
        this.setState(state_stuff)
    }
    
    handleOptionsChange(new_option_list) {
        this.setState({"option_list": new_option_list})
    }
    
    handleExportsChange(new_export_list) {
        this.setState({"export_list": new_export_list})
    }

    handleMethodsChange(new_methods) {
        this.setState({"extra_functions": new_methods})
    }

    get_height_minus_top_offset (element_ref, min_offset = 0, default_offset = 100) {
        if (this.state.mounted) {  // This will be true after the initial render
            let offset = $(element_ref.current).offset().top;
            if (offset < min_offset) {
                offset = min_offset
            }
            return this.state.body_height - offset
        }
        else {
            return this.state.body_height - default_offset
        }
    }

    get_new_tc_height () {
        if (this.state.mounted) {  // This will be true after the initial render
            return this.state.top_pane_height - this.tc_span_ref.current.offsetHeight
        }
        else {
            return this.state.top_pane_height - 50
        }
    }

    get_new_rc_height (outer_rc_height) {
        if (this.state.mounted) {
            return outer_rc_height - this.rc_span_ref.current.offsetHeight
        }
        else {
            return outer_rc_height - 50
        }
    }

    handleTopPaneResize (top_height, bottom_height, top_fraction) {
        this.setState({"top_pane_height": top_height,
            "bottom_pane_height": bottom_height
        })
    }
    
    handleLeftPaneResize(left_width, right_width, left_fraction) {
        this.setState({"left_pane_width": left_width,
        })
    }

    handleTopCodeChange(new_code) {
        if (this.props.is_mpl) {
            this.setState({"draw_plot_code": new_code})
        }
        else {
            this.setState({"jscript_code": new_code})
        }

    }
    handleRenderContentChange(new_code) {
        this.setState({"render_content_code": new_code})
    }

    _setResourceNameState(new_name) {
        this.setState({"tile_name": new_name})
    }

    _handleResize(entries) {
        for (let entry of entries) {
            if (entry.target.id == "creator-root") {
                // Must used window.innerWidth here otherwise we get the wrong value during initial mounting
                this.setState({usable_width: window.innerWidth - 2 * SIDE_MARGIN,
                    usable_height: entry.contentRect.height - BOTTOM_MARGIN - entry.target.getBoundingClientRect().top,
                    body_height: entry.contentRect.height - BOTTOM_MARGIN
                });
                return
            }
        }
    }

    _setDpObject(cmobject){
        this.dpObject = cmobject
    }

    _setRcObject(cmobject){
        this.rcObject = cmobject
    }

    _setEmObject(cmobject){
        this.emObject = cmobject
    }

    render() {
        //let hp_height = this.get_height_minus_top_offset(this.hp_ref);
        let vp_height = this.get_height_minus_top_offset(this.vp_ref);

        let code_width = this.state.left_pane_width - 10;
        let ch_style = {"width": code_width};

        let tc_item;
        if (this.props.is_mpl || this.props.is_d3) {
            let tc_height = this.get_new_tc_height();
            let mode = this.props.is_mpl ? "python" : "javascript";
            let code_content = this.props.is_mpl ? this.state.draw_plot_code : this.state.jscript_code;
            let first_line_number =this.props.is_mpl ? this.state.draw_plot_line_number + 1: 1;
            let title_label = this.props.is_mpl ? "draw_plot" : "(selector, w, h, arg_dict) =>";
            tc_item = (
                <div key="dpcode" style={ch_style} className="d-flex flex-column align-items-baseline code-holder">
                    <span ref={this.tc_span_ref}>{title_label}</span>
                    <ReactCodemirror code_content={code_content}
                                     mode={mode}
                                     handleChange={this.handleTopCodeChange}
                                     saveMe={this._saveAndCheckpoint}
                                     readOnly={false}
                                     setCMObject={this._setDpObject}
                                     dark_theme={this.state.dark_theme}
                                     first_line_number={first_line_number}
                                     code_container_height={tc_height}
                    />
                </div>
             );
        }
        let rc_height;
        if (this.props.is_mpl || this.props.is_d3) {
            rc_height = this.get_new_rc_height(this.state.bottom_pane_height)
        }
        else {
            rc_height = this.get_new_rc_height(vp_height)
        }

        let bc_item = (
            <div key="rccode" id="rccode" style={ch_style} className="d-flex flex-column align-items-baseline code-holder">
                <span className="bp3-ui-text" ref={this.rc_span_ref}>render_content</span>
                <ReactCodemirror code_content={this.state.render_content_code}
                                 handleChange={this.handleRenderContentChange}
                                 saveMe={this._saveAndCheckpoint}
                                 readOnly={false}
                                 setCMObject={this._setRcObject}
                                 dark_theme={this.state.dark_theme}
                                 first_line_number={this.state.render_content_line_number + 1}
                                 code_container_height={rc_height}
                />
            </div>
         );
        let left_pane;
        if (this.props.is_mpl || this.props.is_d3) {
            left_pane = (
                <React.Fragment>
                    <TileCreatorToolbar tile_name={this.state.tile_name}
                                        setResourceNameState={this._setResourceNameState}
                                        res_type="tile"
                                        button_groups={this.button_groups}
                                        key="toolbar"
                                        />
                    <div ref={this.vp_ref}/>
                    <VerticalPanes top_pane={tc_item}
                                   bottom_pane={bc_item}
                                   show_handle={true}
                                   available_height={vp_height}
                                   available_width={this.state.left_pane_width}
                                   handleSplitUpdate={this.handleTopPaneResize}
                                   id="creator-left"
                                   />
                </React.Fragment>
            );
        }
        else {
            left_pane = (
                <React.Fragment>
                    <TileCreatorToolbar tile_name={this.state.tile_name}
                                        setResourceNameState={this._setResourceNameState}
                                        res_type="tile"
                                        button_groups={this.button_groups}
                                        key="toolbar"
                                        />
                    <div ref={this.vp_ref}>
                        {bc_item}
                    </div>

                </React.Fragment>
            );
        }

        let mdata_panel = (<CombinedMetadata tags={this.state.tags}
                                                  notes={this.state.notes}
                                                  created={this.props.created}
                                                  category={this.state.category}
                                                  res_type="tile"
                                                  handleChange={this.handleStateChange}
                                                />);
        let option_panel = (
            <OptionModule options_ref={this.options_ref}
                          data_list={this.state.option_list}
                          foregrounded={this.state.foregrounded_panes["options"]}
                          handleChange={this.handleOptionsChange}
                          handleNotesAppend={this._handleNotesAppend}
                                />
        );
        let export_panel = (
            <ExportModule data_list={this.state.export_list}
                          foregrounded={this.state.foregrounded_panes["exports"]}
                          handleChange={this.handleExportsChange}
                          handleNotesAppend={this._handleNotesAppend}
                                />
        );
        let methods_height = this.get_height_minus_top_offset(this.methods_ref, 128, 128);
        let methods_panel = (
            <div style={{marginTop: 30}}>
                <ReactCodemirror handleChange={this.handleMethodsChange}
                                 code_content={this.state.extra_functions}
                                 saveMe={this._saveAndCheckpoint}
                                 setCMObject={this._setEmObject}
                                 readOnly={false}
                                 code_container_ref={this.methods_ref}
                                 code_container_height={methods_height}
                                 dark_theme={this.state.dark_theme}
                                 first_line_number={this.state.extra_methods_line_number}
                                 refresh_required={this.state.methodsTabRefreshRequired}/>
             </div>

        );
        let right_pane = (
                <React.Fragment>
                    <div id="creator-resources" className="d-block mt-2">
                        <Tabs id="resource_tabs" selectedTabId={this.state.selectedTabId}
                                 large={true} onChange={this._handleTabSelect}>
                            <Tab id="metadata" title="metadata" panel={mdata_panel}/>
                            <Tab id="options" title="options" panel={option_panel}/>
                            <Tab id="exports" title="exports" panel={export_panel}/>
                            <Tab id="methods" title="methods" panel={methods_panel}/>
                        </Tabs>
                    </div>
                </React.Fragment>
        );
        let outer_style = {
            width: "100%",
            height: this.state.usable_height,
            paddingLeft: SIDE_MARGIN
        };
        let outer_class = "resource-viewer-holder"
        if (this.state.dark_theme) {
            outer_class = outer_class + " bp3-dark";
        }
        else {
            outer_class = outer_class + " light-theme"
        }
        return (
            <React.Fragment>
                <TacticNavbar is_authenticated={window.is_authenticated}
                              selected={null}
                              show_api_links={true}
                              dark_theme={this.state.dark_theme}
                              set_parent_theme={this._setTheme}
                              user_name={window.username}/>
                <ResizeSensor onResize={this._handleResize} observeParents={true}>
                    <div className={outer_class} ref={this.top_ref} style={outer_style}>
                        <HorizontalPanes left_pane={left_pane}
                                         right_pane={right_pane}
                                         show_handle={true}
                                         available_height={this.state.usable_height}
                                         available_width={this.state.usable_width}
                                         handleSplitUpdate={this.handleLeftPaneResize}
                        />
                    </div>
                </ResizeSensor>
            </React.Fragment>
        )

    }
}

CreatorApp.propTypes = {
    is_mpl: PropTypes.bool,
    render_content_code: PropTypes.string,
    render_content_line_number: PropTypes.number,
    extra_methods_line_number: PropTypes.number,
    category: PropTypes.string,
    extra_functions: PropTypes.string,
    draw_plot_code: PropTypes.string,
    jscript_code: PropTypes.string,
    tags: PropTypes.array,
    notes: PropTypes.string,
    option_list: PropTypes.array,
    export_list: PropTypes.array,
    created: PropTypes.string
};

var CreatorAppPlus = withStatus(withErrorDrawer(CreatorApp, tsocket));

tile_creator_main();