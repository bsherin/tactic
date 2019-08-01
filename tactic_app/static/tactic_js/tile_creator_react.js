
import { TacticSocket } from "./tactic_socket.js";
import { Toolbar, Namebutton } from "./react_toolbar.js";
import { sendToRepository } from "./resource_viewer_react_app.js";
import { ReactCodemirror } from "./react-codemirror.js";
import { CombinedMetadata } from "./react_mdata_fields.js";
import { OptionModule, ExportModule } from "./creator_modules_react.js";
import { HorizontalPanes, VerticalPanes } from "./resizing_layouts.js";

var Rbs = window.ReactBootstrap;

const BOTTOM_MARGIN = 50;
const MARGIN_SIZE = 17;

const HEARTBEAT_INTERVAL = 10000; //milliseconds
var heartbeat_timer = setInterval(function () {
    postAjax("register_heartbeat", { "main_id": main_id }, function () {});
}, HEARTBEAT_INTERVAL);

class CreatorViewerSocket extends TacticSocket {
    initialize_socket_stuff() {
        this.socket.emit('join', { "room": user_id });
        this.socket.emit('join-main', { "room": module_viewer_id });
        this.socket.on('stop-spinner', stopSpinner);
        this.socket.on('start-spinner', startSpinner);
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
    startSpinner();
    statusMessageText("loading " + window.module_name);
    var tsocket = new CreatorViewerSocket("main", 5000);
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
        ReactDOM.render(React.createElement(CreatorApp, { tile_name: window.module_name,
            is_mpl: parsed_data.is_mpl,
            is_d3: parsed_data.is_d3,
            render_content_code: parsed_data.render_content_code,
            render_content_line_number: parsed_data.render_content_line_number,
            extra_methods_line_number: parsed_data.extra_methods_line_number,
            draw_plot_line_number: parsed_data.draw_plot_line_number,
            category: parsed_data.category,
            extra_functions: parsed_data.extra_functions,
            draw_plot_code: parsed_data.draw_plot_code,
            jscript_code: parsed_data.jscript_code,
            tags: data.tags.split(" "),
            notes: data.notes,
            option_list: parsed_data.option_dict,
            export_list: parsed_data.export_list,
            created: data.datestring

        }), domContainer);
        clearStatusMessage();
        stopSpinner();
    }).catch(function (data) {
        doFlash(data);
        clearStatusMessage();
        stopSpinner();
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
        let initial_usable_height = window.innerHeight - 45 - MARGIN_SIZE;
        let initial_usable_width = window.innerWidth - 2 * MARGIN_SIZE - 30;
        this.left_div_ref = React.createRef();
        this.right_div_ref = React.createRef();
        this.tc_span_ref = React.createRef();
        this.rc_span_ref = React.createRef();
        this.vp_ref = React.createRef();
        this.hp_ref = React.createRef();
        this.draw_plot_bounding_ref = React.createRef();
        this.state = {
            tile_name: this.props.tile_name,
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
            usable_width: initial_usable_width,
            usable_height: initial_usable_height,
            top_pane_height: this.props.is_mpl || this.props.is_d3 ? initial_usable_height / 2 - 25 : null,
            bottom_pane_height: this.props.is_mpl || this.props.is_d3 ? initial_usable_height / 2 - 25 : null,
            left_pane_width: initial_usable_width / 2 - 25,
            methodsTabRefreshRequired: true
        };
        this.saved_state_vars = ["tile_name", "render_content_code", "draw_plot_code", "jscript_code", "extra_functions", "tags", "notes", "option_list", "export_list", "category"];
        this.saved_state = {};
        this.update_saved_state();
        this.handleRename = this.handleRename.bind(this);
        this.handleNotesChange = this.handleNotesChange.bind(this);
        this.handleNotesAppend = this.handleNotesAppend.bind(this);
        this.handleTagsChange = this.handleTagsChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleRenderContentChange = this.handleRenderContentChange.bind(this);
        this.handleTopCodeChange = this.handleTopCodeChange.bind(this);
        this.update_window_dimensions = this.update_window_dimensions.bind(this);
        this.handleOptionsChange = this.handleOptionsChange.bind(this);
        this.handleExportsChange = this.handleExportsChange.bind(this);
        this.handleMethodsChange = this.handleMethodsChange.bind(this);
        this.handleTabSelect = this.handleTabSelect.bind(this);
        this.handleLeftPaneResize = this.handleLeftPaneResize.bind(this);
        this.handleTopPaneResize = this.handleTopPaneResize.bind(this);
    }

    update_saved_state() {
        for (let thevar of this.saved_state_vars) {
            this.saved_state[thevar] = this.state[thevar];
        }
    }

    dirty() {
        for (let thevar of this.saved_state_vars) {
            if (this.state[thevar] != this.saved_state[thevar]) {
                return true;
            }
        }
        return false;
    }

    get button_groups() {
        let bgs = [[{ "name_text": "Save", "icon_name": "save", "click_handler": this.saveMe }, { "name_text": "Mark", "icon_name": "map-marker-alt", "click_handler": this.saveAndCheckpoint }, { "name_text": "Save as...", "icon_name": "save", "click_handler": this.saveModuleAs }, { "name_text": "Load", "icon_name": "arrow-from-bottom", "click_handler": this.loadModule }, { "name_text": "Share", "icon_name": "share",
            "click_handler": () => {
                sendToRepository("tile", this.props.tile_name);
            } }], [{ "name_text": "History", "icon_name": "history", "click_handler": this.showHistoryViewer }, { "name_text": "Compare", "icon_name": "code-branch", "click_handler": this.showTileDiffer }]];

        for (let bg of bgs) {
            for (let but of bg) {
                but.click_handler = but.click_handler.bind(this);
            }
        }
        return bgs;
    }

    showHistoryViewer() {
        window.open(`${$SCRIPT_ROOT}/show_history_viewer/${this.props.tile_name}`);
    }

    showTileDiffer() {
        window.open(`${$SCRIPT_ROOT}/show_tile_differ/${this.props.tile_name}`);
    }

    loadModule() {
        let self = this;
        startSpinner();
        this.doSavePromise().then(function () {
            statusMessageText("Loading Module");
            postWithCallback("host", "load_tile_module_task", { "tile_module_name": self.state.tile_name, "user_id": user_id }, load_success);
        }).catch(doFlashStopSpinner);

        function load_success(data) {
            if (data.success) {
                self.update_saved_state();
                data.timeout = 2000;
            }
            doFlashStopSpinner(data);
            return false;
        }
    }

    saveModuleAs() {
        doFlash({ "message": "not implemented yet" });
        return false;
    }

    saveMe() {
        startSpinner();
        statusMessageText("Saving Module");
        this.doSavePromise().then(doFlashStopSpinner).catch(doFlashStopSpinner);
        return false;
    }

    saveAndCheckpoint() {
        startSpinner();
        let self = this;
        this.doSavePromise().then(function () {
            statusMessage("Checkpointing");
            self.doCheckpointPromise().then(doFlashStopSpinner).catch(doFlashStopSpinner);
        }).catch(doFlashStopSpinner);
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

    doSavePromise() {
        let self = this;
        return new Promise(function (resolve, reject) {

            let result_dict = {
                "module_name": self.state.tile_name,
                "category": self.state.category.length == 0 ? "basic" : self.state.category,
                "tags": self.get_tags_string(),
                "notes": self.state.notes,
                "exports": self.state.export_list,
                "options": self.state.option_list,
                "extra_methods": self.state.extra_functions,
                "render_content_body": self.state.render_content_code,
                "is_mpl": self.props.is_mpl,
                "is_d3": self.props.is_d3,
                "draw_plot_body": self.state.draw_plot_code,
                "jscript_body": self.state.jscript_code,
                "last_saved": "creator"
            };
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
        this.update_saved_state();
    }

    update_window_dimensions() {
        this.setState({
            "usable_width": window.innerWidth - 2 * MARGIN_SIZE - 30,
            "usable_height": window.innerHeight - 50
        });
    }

    componentDidMount() {
        this.setState({ "mounted": true });
        this.update_window_dimensions();
        window.addEventListener("resize", this.update_window_dimensions);
        stopSpinner();
    }

    handleTabSelect() {
        this.setState({ "methodsTabRefreshRequired": false }); // This is needed or the methods tab will be blank
    }

    handleNotesChange(event) {
        this.setState({ "notes": event.target.value });
    }

    handleNotesAppend(new_text) {
        this.setState({ "notes": this.state.notes + new_text });
    }

    handleCategoryChange(event) {
        this.setState({ "category": event.target.value });
    }

    handleTagsChange(field, editor, tags) {
        this.setState({ "tags": tags });
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

    get_height_minus_top_offset(element_ref) {
        if (this.state.mounted) {
            // This will be true after the initial render
            return this.state.usable_height - $(element_ref.current).offset().top;
        } else {
            return this.state.usable_height - 50;
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

    render() {
        let hp_height = this.get_height_minus_top_offset(this.hp_ref);
        let vp_height = this.get_height_minus_top_offset(this.vp_ref);

        let code_width = this.state.left_pane_width - 10;
        let ch_style = { "width": code_width };

        let tc_item;
        if (this.props.is_mpl || this.props.is_d3) {
            let tc_height = this.get_new_tc_height();
            let mode = this.props.is_mpl ? "python" : "javascript";
            let code_content = this.props.is_mpl ? this.state.draw_plot_code : this.state.jscript_code;
            let first_line_number = this.props.is_mpl ? this.state.draw_plot_line_number : 1;
            let title_label = this.props.is_mpl ? "draw_plot" : "d3javascript";
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
                    saveMe: this.saveAndCheckpoint,
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
                { ref: this.rc_span_ref },
                "render_content"
            ),
            React.createElement(ReactCodemirror, { code_content: this.state.render_content_code,
                handleChange: this.handleRenderContentChange,
                saveMe: this.saveAndCheckpoint,
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
        }{}

        let right_pane = React.createElement(
            React.Fragment,
            null,
            React.createElement(
                "div",
                { id: "creator-resources", className: "d-block mt-2" },
                React.createElement(
                    Rbs.Tabs,
                    { id: "resource_tabs", onSelect: this.handleTabSelect },
                    React.createElement(
                        Rbs.Tab,
                        { eventKey: "metadata", title: "metadata" },
                        React.createElement(CombinedMetadata, { tags: this.state.tags,
                            notes: this.state.notes,
                            created: this.props.created,
                            category: this.state.category,
                            res_type: "tile",
                            handleTagsChange: this.handleTagsChange,
                            handleNotesChange: this.handleNotesChange,
                            handleCategoryChange: this.handleCategoryChange,
                            outer_id: "metadata-pane"
                        })
                    ),
                    React.createElement(
                        Rbs.Tab,
                        { eventKey: "options", title: "options" },
                        React.createElement(OptionModule, { data_list: this.state.option_list,
                            handleChange: this.handleOptionsChange,
                            handleNotesAppend: this.handleNotesAppend
                        })
                    ),
                    React.createElement(
                        Rbs.Tab,
                        { eventKey: "exports", title: "exports" },
                        React.createElement(ExportModule, { data_list: this.state.export_list,
                            handleChange: this.handleExportsChange,
                            handleNotesAppend: this.handleNotesAppend
                        })
                    ),
                    React.createElement(
                        Rbs.Tab,
                        { eventKey: "methods", title: "methods" },
                        React.createElement(ReactCodemirror, { handleChange: this.handleMethodsChange,
                            code_content: this.state.extra_functions,
                            save_me: this.saveAndCheckpoint,
                            readOnly: false,
                            first_line_number: this.state.extra_methods_line_number,
                            refresh_required: this.methodsTabRefreshRequired
                        })
                    )
                )
            )
        );
        return React.createElement(
            React.Fragment,
            null,
            React.createElement("div", { ref: this.hp_ref }),
            React.createElement(HorizontalPanes, { left_pane: left_pane,
                right_pane: right_pane,
                available_height: hp_height,
                available_width: this.state.usable_width,
                handleSplitUpdate: this.handleLeftPaneResize
            })
        );
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

tile_creator_main();