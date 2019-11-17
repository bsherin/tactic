
import { TacticSocket } from "./tactic_socket.js";
import { Toolbar, Namebutton } from "./blueprint_toolbar.js";
import { sendToRepository } from "./resource_viewer_react_app.js";
import { ReactCodemirror } from "./react-codemirror.js";
import { CombinedMetadata } from "./blueprint_mdata_fields.js";
import { OptionModule, ExportModule } from "./creator_modules_react.js";
import { HorizontalPanes, VerticalPanes } from "./resizing_layouts.js";
import { render_navbar } from "./blueprint_navbar.js";
import { handleCallback, postAjax, postAjaxPromise, postWithCallback } from "./communication_react.js";
import { withStatus, doFlash } from "./toaster.js";
import { getUsableDimensions, SIDE_MARGIN, USUAL_TOOLBAR_HEIGHT } from "./sizing_tools.js";
import { withErrorDrawer } from "./error_drawer.js";

var Bp = blueprint;

const BOTTOM_MARGIN = 50;
const MARGIN_SIZE = 17;

const HEARTBEAT_INTERVAL = 10000; //milliseconds
var heartbeat_timer = setInterval(function () {
    postAjax("register_heartbeat", { "main_id": window.main_id }, function () {});
}, HEARTBEAT_INTERVAL);

let tsocket;

class CreatorViewerSocket extends TacticSocket {
    initialize_socket_stuff() {
        this.socket.emit('join', { "room": user_id });
        this.socket.emit('join-main', { "room": module_viewer_id });
        this.socket.on('handle-callback', handleCallback);
        this.socket.on('close-user-windows', data => {
            if (!(data["originator"] == module_viewer_id)) {
                window.close();
            }
        });
        this.socket.on('stop-heartbeat', function (data) {
            clearInterval(heartbeat_timer);
        });
        this.socket.on("doFlash", function (data) {
            doFlash(data);
        });
    }
}

function tile_creator_main() {
    render_navbar(null, true);
    tsocket = new CreatorViewerSocket("main", 5000);
    tsocket.socket.on("begin-post-load", function () {
        let the_content = { "module_name": window.module_name,
            "module_viewer_id": window.module_viewer_id,
            "tile_collection_name": window.tile_collection_name,
            "user_id": window.user_id,
            "version_string": window.version_string };
        postWithCallback(window.module_viewer_id, "initialize_parser", the_content, got_parsed_data);
    });
    tsocket.socket.emit('ready-to-begin', { "room": window.main_id });
}

function got_parsed_data(data_object) {
    let domContainer = document.querySelector('#creator-root');
    let parsed_data = data_object.the_content;
    let result_dict = { "res_type": "tile", "res_name": window.module_name, "is_repository": false };

    postAjaxPromise("grab_metadata", result_dict).then(function (data) {
        let split_tags = data.tags == "" ? [] : data.tags.split(" ");
        let category = parsed_data.category ? parsed_data.category : "basic";
        ReactDOM.render(React.createElement(CreatorAppPlus, { tile_name: window.module_name,
            is_mpl: parsed_data.is_mpl,
            is_d3: parsed_data.is_d3,
            render_content_code: parsed_data.render_content_code,
            render_content_line_number: parsed_data.render_content_line_number,
            extra_methods_line_number: parsed_data.extra_methods_line_number,
            draw_plot_line_number: parsed_data.draw_plot_line_number,
            category: category,
            extra_functions: parsed_data.extra_functions,
            draw_plot_code: parsed_data.draw_plot_code,
            jscript_code: parsed_data.jscript_code,
            tags: split_tags,
            notes: data.notes,
            option_list: parsed_data.option_dict,
            export_list: parsed_data.export_list,
            created: data.datestring

        }), domContainer);
    }).catch(function (data) {
        doFlash(data);
    });
}

function TileCreatorToolbar(props) {
    let tstyle = { "marginTop": 20, "paddingRight": 20, "width": "100%" };
    return React.createElement(
        "div",
        { style: tstyle, className: "d-flex flex-row justify-content-between" },
        React.createElement(Namebutton, { resource_name: props.tile_name,
            res_type: props.res_type,
            handleRename: props.handleRename
        }),
        React.createElement(
            "div",
            null,
            React.createElement(Toolbar, { button_groups: props.button_groups })
        )
    );
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
        this.state = {
            tile_name: this.props.tile_name,
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
            usable_width: awidth,
            old_usable_width: 0,
            usable_height: aheight,
            body_height: bheight,
            top_pane_height: this.props.is_mpl || this.props.is_d3 ? aheight / 2 - 25 : null,
            bottom_pane_height: this.props.is_mpl || this.props.is_d3 ? aheight / 2 - 25 : null,
            left_pane_width: awidth / 2 - 25,
            methodsTabRefreshRequired: true
        };
        this.handleRename = this.handleRename.bind(this);
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
                e.returnValue = '';
            }
        });
    }

    get button_groups() {
        let bgs = [[{ "name_text": "Save", "icon_name": "saved", "click_handler": this._saveMe, key_bindings: ['ctrl+s', "command+s"], tooltip: "Save" }, { "name_text": "Mark", "icon_name": "map-marker", "click_handler": this._saveAndCheckpoint, key_bindings: ['ctrl+m'], tooltip: "Save and checkpoint" }, { "name_text": "SaveAs", "icon_name": "floppy-disk", "click_handler": this._saveModuleAs, tooltip: "Save as" }, { "name_text": "Load", "icon_name": "upload", "click_handler": this._loadModule, key_bindings: ['ctrl+l'], tooltip: "Load tile" }, { "name_text": "Share", "icon_name": "share",
            "click_handler": () => {
                sendToRepository("tile", this.props.tile_name);
            }, tooltip: "Send to repository" }], [{ "name_text": "History", "icon_name": "history", "click_handler": this._showHistoryViewer, tooltip: "Show history viewer" }, { "name_text": "Compare", "icon_name": "comparison", "click_handler": this._showTileDiffer, tooltip: "Compare to another tile" }], [{ "name_text": "Drawer", "icon_name": "console", "click_handler": this.props.toggleErrorDrawer, tooltip: "Toggle error drawer" }]];

        for (let bg of bgs) {
            for (let but of bg) {
                but.click_handler = but.click_handler.bind(this);
            }
        }
        return bgs;
    }

    _showHistoryViewer() {
        window.open(`${$SCRIPT_ROOT}/show_history_viewer/${this.props.tile_name}`);
    }

    _showTileDiffer() {
        window.open(`${$SCRIPT_ROOT}/show_tile_differ/${this.props.tile_name}`);
    }

    _doFlashStopSpinner(data) {
        this.props.clearStatus();
        doFlash(data);
    }

    _logErrorStopSpinner(content, title = null, open = true) {
        this.props.stopSpinner();
        this.props.addErrorDrawerEntry({ title: title, content: content });
        if (open) {
            this.props.openErrorDrawer();
        }
    }

    dirty() {
        let current_state = this._getSaveDict();
        for (let k in current_state) {
            if (current_state[k] != this.last_save[k]) {
                return true;
            }
        }
        return false;
    }

    _loadModule() {
        let self = this;
        this.props.startSpinner();
        this.doSavePromise().then(function () {
            self.props.statusMessage("Loading Module");
            postWithCallback("host", "load_tile_module_task", { "tile_module_name": self.state.tile_name, "user_id": user_id }, load_success);
        }).catch(data => {
            self._logErrorStopSpinner(data.message, "Error loading module");
        });

        function load_success(data) {
            if (data.success) {
                data.timeout = 2000;
            }
            self._doFlashStopSpinner(data);
            return false;
        }
    }

    _saveModuleAs() {
        doFlash({ "message": "not implemented yet" });
        return false;
    }

    _saveMe() {
        let self = this;
        this.props.startSpinner();
        this.props.statusMessage("Saving Module");
        this.doSavePromise().then(self._doFlashStopSpinner).catch(data => {
            self._logErrorStopSpinner(data.message, "Error saving module");
        });
        return false;
    }

    _saveAndCheckpoint() {
        this.props.startSpinner();
        let self = this;
        this.doSavePromise().then(function () {
            self.props.statusMessage("Checkpointing");
            self.doCheckpointPromise().then(self._doFlashStopSpinner).catch(data => {
                self._logErrorStopSpinner(data.message, "Error checkpointing module");
            });
        }).catch(data => {
            self._logErrorStopSpinner(data.message, "Error saving module");
        });
        return false;
    }

    get_tags_string() {
        let taglist = this.state.tags;
        let tags = "";
        for (let tag of taglist) {
            tags = tags + tag + " ";
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
        return new Promise(function (resolve, reject) {
            let result_dict = self._getSaveDict();

            postWithCallback(module_viewer_id, "update_module", result_dict, function (data) {
                if (data.success) {
                    self.save_success(data);
                    resolve(data);
                } else {
                    reject(data);
                }
            });
        });
    }

    doCheckpointPromise() {
        let self = this;
        return new Promise(function (resolve, reject) {
            postAjax("checkpoint_module", { "module_name": self.state.tile_name }, function (data) {
                if (data.success) {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
        });
    }

    save_success(data) {
        let self = this;
        this.setState({ "render_content_line_number": data.render_content_line_number,
            "extra_methods_line_number": data.extra_methods_line_number,
            "draw_plot_line_number": data.draw_plot_line_number

        });
        this._update_saved_state();
    }

    update_window_dimensions() {
        let uwidth = window.innerWidth - 2 * SIDE_MARGIN;
        let uheight = window.innerHeight - BOTTOM_MARGIN;
        if (this.top_ref && this.top_ref.current) {
            uheight = uheight - this.top_ref.current.offsetTop;
        } else {
            uheight = uheight - USUAL_TOOLBAR_HEIGHT;
        }
        this.setState({ usable_height: uheight, usable_width: uwidth });
    }

    _update_saved_state() {
        this.last_save = this._getSaveDict();
    }

    componentDidMount() {
        this.setState({ "mounted": true });
        document.title = this.state.tile_name;

        window.addEventListener("resize", this.update_window_dimensions);
        this.update_window_dimensions();
        this._update_saved_state();
        this.props.stopSpinner();
    }

    _handleTabSelect(newTabId) {
        if (this.state.foregrounded_panes[newTabId]) return;
        let new_fg = Object.assign({}, this.state.foregrounded_panes);
        new_fg[newTabId] = true;
        this.setState({ foregrounded_panes: new_fg }, this.update_window_dimensions);
    }

    _handleNotesAppend(new_text) {
        this.setState({ "notes": this.state.notes + new_text });
    }

    handleStateChange(state_stuff) {
        this.setState(state_stuff);
    }

    handleOptionsChange(new_option_list) {
        this.setState({ "option_list": new_option_list });
    }

    handleExportsChange(new_export_list) {
        this.setState({ "export_list": new_export_list });
    }

    handleMethodsChange(new_methods) {
        this.setState({ "extra_functions": new_methods });
    }

    get_height_minus_top_offset(element_ref, min_offset = 0, default_offset = 100) {
        if (this.state.mounted) {
            // This will be true after the initial render
            let offset = $(element_ref.current).offset().top;
            if (offset < min_offset) {
                offset = min_offset;
            }
            return this.state.body_height - offset;
        } else {
            return this.state.body_height - default_offset;
        }
    }

    get_new_tc_height() {
        if (this.state.mounted) {
            // This will be true after the initial render
            return this.state.top_pane_height - this.tc_span_ref.current.offsetHeight;
        } else {
            return this.state.top_pane_height - 50;
        }
    }

    get_new_rc_height(outer_rc_height) {
        if (this.state.mounted) {
            return outer_rc_height - this.rc_span_ref.current.offsetHeight;
        } else {
            return outer_rc_height - 50;
        }
    }

    handleTopPaneResize(top_height, bottom_height, top_fraction) {
        this.setState({ "top_pane_height": top_height,
            "bottom_pane_height": bottom_height
        });
    }

    handleLeftPaneResize(left_width, right_width, left_fraction) {
        this.setState({ "left_pane_width": left_width
        });
    }

    handleTopCodeChange(new_code) {
        if (this.props.is_mpl) {
            this.setState({ "draw_plot_code": new_code });
        } else {
            this.setState({ "jscript_code": new_code });
        }
    }
    handleRenderContentChange(new_code) {
        this.setState({ "render_content_code": new_code });
    }

    handleRename(new_name) {
        // this.setState({"tile_name": new_name})
    }

    _handleResize(entries) {
        for (let entry of entries) {
            if (entry.target.id == "creator-root") {
                // Must used window.innerWidth here otherwise we get the wrong value during initial mounting
                this.setState({ usable_width: window.innerWidth - 2 * SIDE_MARGIN,
                    usable_height: entry.contentRect.height - BOTTOM_MARGIN - entry.target.getBoundingClientRect().top,
                    body_height: entry.contentRect.height - BOTTOM_MARGIN
                });
                return;
            }
        }
    }

    render() {
        //let hp_height = this.get_height_minus_top_offset(this.hp_ref);
        let vp_height = this.get_height_minus_top_offset(this.vp_ref);

        let code_width = this.state.left_pane_width - 10;
        let ch_style = { "width": code_width };

        let tc_item;
        if (this.props.is_mpl || this.props.is_d3) {
            let tc_height = this.get_new_tc_height();
            let mode = this.props.is_mpl ? "python" : "javascript";
            let code_content = this.props.is_mpl ? this.state.draw_plot_code : this.state.jscript_code;
            let first_line_number = this.props.is_mpl ? this.state.draw_plot_line_number : 1;
            let title_label = this.props.is_mpl ? "draw_plot" : "(selector, w, h, arg_dict) =>";
            tc_item = React.createElement(
                "div",
                { key: "dpcode", style: ch_style, className: "d-flex flex-column align-items-baseline code-holder" },
                React.createElement(
                    "span",
                    { ref: this.tc_span_ref },
                    title_label
                ),
                React.createElement(ReactCodemirror, { code_content: code_content,
                    mode: mode,
                    handleChange: this.handleTopCodeChange,
                    saveMe: this._saveAndCheckpoint,
                    readOnly: false,
                    first_line_number: first_line_number,
                    code_container_height: tc_height
                })
            );
        }
        let rc_height;
        if (this.props.is_mpl || this.props.is_d3) {
            rc_height = this.get_new_rc_height(this.state.bottom_pane_height);
        } else {
            rc_height = this.get_new_rc_height(vp_height);
        }

        let bc_item = React.createElement(
            "div",
            { key: "rccode", id: "rccode", style: ch_style, className: "d-flex flex-column align-items-baseline code-holder" },
            React.createElement(
                "span",
                { className: "bp3-ui-text", ref: this.rc_span_ref },
                "render_content"
            ),
            React.createElement(ReactCodemirror, { code_content: this.state.render_content_code,
                handleChange: this.handleRenderContentChange,
                saveMe: this._saveAndCheckpoint,
                readOnly: false,
                first_line_number: this.state.render_content_line_number,
                code_container_height: rc_height
            })
        );
        let left_pane;
        if (this.props.is_mpl || this.props.is_d3) {
            left_pane = React.createElement(
                React.Fragment,
                null,
                React.createElement(TileCreatorToolbar, { tile_name: this.state.tile_name,
                    res_type: "tile",
                    handleRename: this.handleRename,
                    button_groups: this.button_groups,
                    key: "toolbar"
                }),
                React.createElement("div", { ref: this.vp_ref }),
                React.createElement(VerticalPanes, { top_pane: tc_item,
                    bottom_pane: bc_item,
                    show_handle: true,
                    available_height: vp_height,
                    available_width: this.state.left_pane_width,
                    handleSplitUpdate: this.handleTopPaneResize,
                    id: "creator-left"
                })
            );
        } else {
            left_pane = React.createElement(
                React.Fragment,
                null,
                React.createElement(TileCreatorToolbar, { tile_name: this.state.tile_name,
                    res_type: "tile",
                    handleRename: this.handleRename,
                    button_groups: this.button_groups,
                    key: "toolbar"
                }),
                React.createElement(
                    "div",
                    { ref: this.vp_ref },
                    bc_item
                )
            );
        }

        let mdata_panel = React.createElement(CombinedMetadata, { tags: this.state.tags,
            notes: this.state.notes,
            created: this.props.created,
            category: this.state.category,
            res_type: "tile",
            handleChange: this.handleStateChange
        });
        let option_panel = React.createElement(OptionModule, { options_ref: this.options_ref,
            data_list: this.state.option_list,
            foregrounded: this.state.foregrounded_panes["options"],
            handleChange: this.handleOptionsChange,
            handleNotesAppend: this._handleNotesAppend
        });
        let export_panel = React.createElement(ExportModule, { data_list: this.state.export_list,
            foregrounded: this.state.foregrounded_panes["exports"],
            handleChange: this.handleExportsChange,
            handleNotesAppend: this._handleNotesAppend
        });
        let methods_height = this.get_height_minus_top_offset(this.methods_ref, 128, 128);
        let methods_panel = React.createElement(ReactCodemirror, { handleChange: this.handleMethodsChange,
            code_content: this.state.extra_functions,
            saveMe: this._saveAndCheckpoint,
            readOnly: false,
            code_container_ref: this.methods_ref,
            code_container_height: methods_height,
            first_line_number: this.state.extra_methods_line_number,
            refresh_required: this.methodsTabRefreshRequired
        });
        let right_pane = React.createElement(
            React.Fragment,
            null,
            React.createElement(
                "div",
                { id: "creator-resources", className: "d-block mt-2" },
                React.createElement(
                    Bp.Tabs,
                    { id: "resource_tabs",
                        large: true, onChange: this._handleTabSelect },
                    React.createElement(Bp.Tab, { id: "metadata", title: "metadata", panel: mdata_panel }),
                    React.createElement(Bp.Tab, { id: "options", title: "options", panel: option_panel }),
                    React.createElement(Bp.Tab, { id: "exports", title: "exports", panel: export_panel }),
                    React.createElement(Bp.Tab, { id: "methods", title: "methods", panel: methods_panel })
                )
            )
        );
        let outer_style = {
            width: this.state.usable_width,
            height: this.state.usable_height,
            paddingLeft: SIDE_MARGIN
        };
        return React.createElement(
            React.Fragment,
            null,
            React.createElement(
                Bp.ResizeSensor,
                { onResize: this._handleResize, observeParents: true },
                React.createElement(
                    "div",
                    { className: "resource-viewer-holder", ref: this.top_ref, style: outer_style },
                    React.createElement(HorizontalPanes, { left_pane: left_pane,
                        right_pane: right_pane,
                        show_handle: true,
                        available_height: this.state.usable_height,
                        available_width: this.state.usable_width,
                        handleSplitUpdate: this.handleLeftPaneResize
                    })
                )
            )
        );
    }
}

CreatorApp.propTypes = {
    tile_name: PropTypes.string,
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

var CreatorAppPlus = withStatus(withErrorDrawer(CreatorApp));

tile_creator_main();