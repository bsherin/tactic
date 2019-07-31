
import {TacticSocket} from "./tactic_socket.js";
import {Toolbar, Namebutton} from "./react_toolbar.js";
import {sendToRepository} from "./resource_viewer_react_app.js";
import {ReactCodemirror} from "./react-codemirror.js";
import {CombinedMetadata} from "./react_mdata_fields.js";
import {OptionModule, ExportModule} from "./creator_modules_react.js";

var Rbs = window.ReactBootstrap;

const BOTTOM_MARGIN = 50;
const MARGIN_SIZE = 17;

const HEARTBEAT_INTERVAL = 10000; //milliseconds
var heartbeat_timer = setInterval( function(){
   postAjax("register_heartbeat", {"main_id": main_id}, function () {});
}, HEARTBEAT_INTERVAL );

class CreatorViewerSocket extends TacticSocket {
    initialize_socket_stuff () {
        this.socket.emit('join', {"room": user_id});
        this.socket.emit('join-main', {"room": module_viewer_id});
        this.socket.on('stop-spinner', stopSpinner);
        this.socket.on('start-spinner', startSpinner);
        this.socket.on('handle-callback', handleCallback);
        this.socket.on('close-user-windows', (data) => {
            if (!(data["originator"] == module_viewer_id)) {
                window.close()
            }
        });
        this.socket.on('stop-heartbeat', function(data) {
            clearInterval(heartbeat_timer)
        });
        this.socket.on("doFlash", function(data) {
            doFlash(data)
        });
    }
}

function tile_creator_main() {
    startSpinner();
    statusMessageText("loading " + window.module_name);
    var tsocket = new CreatorViewerSocket("main", 5000);
    tsocket.socket.on("begin-post-load", function () {
            let the_content = {"module_name": window.module_name,
                                "module_viewer_id": window.module_viewer_id,
                                "tile_collection_name": window.tile_collection_name,
                                "user_id": window.user_id,
                                "version_string": window.version_string};
            postWithCallback(window.module_viewer_id, "initialize_parser", the_content, got_parsed_data);
        });
    tsocket.socket.emit('ready-to-begin', {"room": window.main_id});
}

function got_parsed_data (data_object) {
    let domContainer = document.querySelector('#root');
    let parsed_data = data_object.the_content;
    let result_dict = {"res_type": "tile", "res_name": window.module_name, "is_repository": false};
    postAjaxPromise("grab_metadata", result_dict)
        .then(function (data) {
            ReactDOM.render(<CreatorApp tile_name={window.module_name}
                                        is_mpl={parsed_data.is_mpl}
                                        is_d3={parsed_data.is_d3}
                                        render_content_code={parsed_data.render_content_code}
                                        render_content_line_number={parsed_data.render_content_line_number}
                                        extra_methods_line_number={parsed_data.extra_methods_line_number}
                                        draw_plot_line_number={parsed_data.draw_plot_line_number}
                                        category={parsed_data.category}
                                        extra_functions={parsed_data.extra_functions}
                                        draw_plot_code={parsed_data.draw_plot_code}
                                        jscript_code={parsed_data.jscript_code}
                                        tags={data.tags.split(" ")}
                                        notes={data.notes}
                                        option_list={parsed_data.option_dict}
                                        export_list={parsed_data.export_list}
                                        created={data.datestring}

            />, domContainer);
            clearStatusMessage();
            stopSpinner()
        })
        .catch(function (data) {
            doFlash(data);
            clearStatusMessage();
            stopSpinner()
        })
}

function TileCreatorToolbar(props) {
    let tstyle = {"marginTop": 20, "width": "100%"};
    return (
        <div style={tstyle} className="d-flex flex-row justify-content-between">
            <Namebutton resource_name={props.tile_name}
                        res_type={props.res_type}
                        handleRename={props.handleRename}
            />
            <div>
                <Toolbar button_groups={props.button_groups}/>
            </div>
        </div>
    )
}

class MetadataModule extends React.Component {

}

class CreatorApp extends React.Component {
    constructor(props) {
        super(props);
        this.left_div_ref = React.createRef();
        this.right_div_ref = React.createRef();
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
            usable_width: this.get_usable_width(),
            usable_height: window.innerHeight - 45 - MARGIN_SIZE,
            current_width_fraction: .5,
            current_height_fraction: .5,
            inner_height: window.innerHeight,
            methodsTabRefreshRequired: true
        };
        this.saved_state_vars = ["tile_name", "render_content_code", "draw_plot_code", "jscript_code",
            "extra_functions", "tags", "notes", "option_list", "export_list", "category"];
        this.saved_state = {};
        this.update_saved_state();
        this.handleRename = this.handleRename.bind(this);
        this.handleNotesChange = this.handleNotesChange.bind(this);
        this.handleNotesAppend = this.handleNotesAppend.bind(this);
        this.handleTagsChange = this.handleTagsChange.bind(this);
        this.handleRenderContentChange = this.handleRenderContentChange.bind(this);
        this.handleDrawPlotCodeChange = this.handleDrawPlotCodeChange.bind(this);
        this.resize_to_window = this.resize_to_window.bind(this);
        this.handleOptionsChange = this.handleOptionsChange.bind(this);
        this.handleExportsChange = this.handleExportsChange.bind(this);
        this.handleMethodsChange = this.handleMethodsChange.bind(this);
        this.handleTabSelect = this.handleTabSelect.bind(this);
        let self = this;
        window.onbeforeunload = function(e) {
            if (self.dirty()) {
                return "Any unsaved changes will be lost."
            }
        };
    }


    update_saved_state() {
        for (let thevar of this.saved_state_vars) {
            this.saved_state[thevar] = this.state[thevar]
        }
    }


    dirty() {
        for (let thevar of this.saved_state_vars) {
            if (this.state[thevar] != this.saved_state[thevar]) {
                return true
            }
        }
        return false
    }

    get_usable_width() {
        return window.innerWidth - 2 * MARGIN_SIZE - 30;
    }

    get button_groups() {
        let bgs = [
                    [{"name_text": "Save", "icon_name": "save","click_handler": this.saveMe},
                     {"name_text": "Mark", "icon_name": "map-marker-alt", "click_handler": this.saveAndCheckpoint},
                     {"name_text": "Save as...", "icon_name": "save", "click_handler": this.saveModuleAs},
                     {"name_text": "Load", "icon_name": "arrow-from-bottom", "click_handler": this.loadModule},
                     {"name_text": "Share", "icon_name": "share",
                        "click_handler": () => {sendToRepository("tile", this.props.tile_name)}}],
                    [{"name_text": "History", "icon_name": "history", "click_handler": this.showHistoryViewer},
                     {"name_text": "Compare", "icon_name": "code-branch", "click_handler": this.showTileDiffer}]
            ];

        for (let bg of bgs) {
            for (let but of bg) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return bgs
    }

    showHistoryViewer () {
        window.open(`${$SCRIPT_ROOT}/show_history_viewer/${this.props.tile_name}`)
    }

    showTileDiffer () {
        window.open(`${$SCRIPT_ROOT}/show_tile_differ/${this.props.tile_name}`)
    }


    loadModule() {
        let self = this;
        startSpinner();
        this.doSavePromise()
            .then(function () {
                statusMessageText("Loading Module");
                postWithCallback("host", "load_tile_module_task", {"tile_module_name": self.state.tile_name, "user_id": user_id}, load_success)
            })
            .catch(doFlashStopSpinner);

        function load_success(data) {
            if (data.success) {
                self.update_saved_state();
                data.timeout = 2000;
            }
            doFlashStopSpinner(data);
            return false
        }
    }

    saveModuleAs() {
        doFlash({"message": "not implemented yet"});
        return false
    }

    saveMe() {
        startSpinner();
        statusMessageText("Saving Module");
        this.doSavePromise()
            .then(doFlashStopSpinner)
            .catch(doFlashStopSpinner);
        return false
    }


    saveAndCheckpoint() {
        startSpinner();
        let self = this;
        this.doSavePromise()
            .then(function (){
                statusMessage("Checkpointing");
                self.doCheckpointPromise()
                    .then(doFlashStopSpinner)
                    .catch(doFlashStopSpinner)
            })
            .catch(doFlashStopSpinner);
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

    doSavePromise() {
        let self = this;
        return new Promise (function (resolve, reject) {

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
        this.update_saved_state();
    }


    update_width(new_width_fraction) {
        this.setState({"current_width_fraction": new_width_fraction})
    }

    update_height(new_height_fraction) {
        this.setState({"current_height_fraction": new_height_fraction})
    }

    get_new_height (element_ref, bottom_margin) {
        if (this.state.mounted) {  // This will be true after the initial render
            return this.state.inner_height- $(element_ref.current).offset().top - bottom_margin
        }
        else {
            return this.state.inner_height - 45 - bottom_margin
        }
    }

    resize_to_window() {
        this.setState({
            "inner_height": window.innerHeight,
            "usable_width": this.get_usable_width(),
            "usable_height": this.get_usable_height()
        });
    }

    componentDidMount() {
        this.turn_on_horizontal_resize();
        if (this.props.is_mpl) {
            this.turn_on_vertical_resize();
        }
        window.addEventListener("resize", this.resize_to_window);
        this.setState({"mounted": true});
        this.resize_to_window();
        stopSpinner();
    }

    turn_on_horizontal_resize () {
        let self = this;
        $(this.left_div_ref.current).resizable({
            handles: "e",
            resize: function (event, ui) {
                const usable_width = self.get_usable_width();
                let new_width_fraction = 1.0 * ui.size.width / usable_width;
                ui.position.left = ui.originalPosition.left;
                self.update_width(new_width_fraction)
            }
        });
    }

    get_usable_height() {
        if (this.state.mounted) {
            return window.innerHeight - $(this.draw_plot_bounding_ref.current).offset().top - MARGIN_SIZE;
        }
        else {
            return window.innerHeight - 45 - MARGIN_SIZE;
        }


    }

    turn_on_vertical_resize() {
        let self = this;
        let dpba = $(this.draw_plot_bounding_ref.current);
        dpba.resizable({
            handles: "s",
            resize: function (event, ui) {
                const usable_height = self.get_usable_height();
                let new_height_fraction = 1.0 * ui.size.height / usable_height;
                self.update_height(new_height_fraction)
            }
        });
    }
    
    handleTabSelect() {
        this.setState({"methodsTabRefreshRequired": false})  // This is needed or the methods tab will be blank
    }

    handleNotesChange(event) {
        this.setState({"notes": event.target.value});
    }

    handleNotesAppend(new_text) {
        this.setState({"notes": this.state.notes + new_text});
    }


    handleTagsChange(field, editor, tags){
        this.setState({"tags": tags})
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

    render() {
        let left_div_style = {
            "width": this.state.usable_width * this.state.current_width_fraction,
            "height": this.get_new_height(this.left_div_ref, 40),

        };
        let right_div_style = {
            "width": (1 - this.state.current_width_fraction) * this.state.usable_width,
            "height": this.get_new_height(this.right_div_ref, 40),

        };
        let dp_style;
        let rc_style;
        let dp_cc_height;
        let rc_cc_height;
        if (this.props.is_mpl) {
            dp_style = {
                "height": this.state.usable_height * this.state.current_height_fraction
            };
            dp_cc_height = dp_style.height - 50;
            rc_style = {
                "height": (1 - this.state.current_height_fraction) * this.state.usable_height,

            };
            rc_cc_height = rc_style.height - 50;
        }
        else {
            rc_style = {};
            rc_cc_height = "100%"
        }
        let code_items = [];

        code_items.push (
                <TileCreatorToolbar tile_name={this.state.tile_name}
                                    res_type="tile"
                                    handleRename={this.handleRename}
                                    button_groups={this.button_groups}
                                    key="toolbar"
                />
        );
        if (this.props.is_mpl) {
            code_items.push(
                <div key="dpcode" style={dp_style} ref={this.draw_plot_bounding_ref} className="d-flex flex-column align-items-baseline code-holder">
                    <span>draw_plot</span>
                    <ReactCodemirror code_content={this.state.draw_plot_code}
                                     handleChange={this.handleDrawPlotCodeChange}
                                     saveMe={this.saveAndCheckpoint}
                                     readOnly={false}
                                     first_line_number={this.state.draw_plot_line_number}
                                     code_container_height={dp_cc_height}
                    />
                </div>
             );
        }
        code_items.push(
            <div key="regcode" style={rc_style} className="d-flex flex-column align-items-baseline code-holder">
                <span>render_content</span>
                <ReactCodemirror code_content={this.state.render_content_code}
                                 handleChange={this.handleRenderContentChange}
                                 saveMe={this.saveAndCheckpoint}
                                 readOnly={false}
                                 first_line_number={this.state.render_content_line_number}
                                 code_container_height={rc_cc_height}
                />
            </div>
         );
        return (
            <React.Fragment>
                <div id="creator-left-div" ref={this.left_div_ref} className="d-flex flex-column" style={left_div_style}>
                    {code_items}
                </div>
                <div id="creator-right-div" ref={this.right_div_ref} className="d-inline-block"  style={right_div_style}>
                    <div id="creator-resources" className="d-block">
                        <Rbs.Tabs id="resource_tabs" onSelect={this.handleTabSelect}>
                            <Rbs.Tab eventKey="metadata" title="metadata">
                                <CombinedMetadata tags={this.state.tags}
                                                  notes={this.state.notes}
                                                  created={this.props.created}
                                                  category={this.state.category}
                                                  res_type="tile"
                                                  handleTagsChange={this.handleTagsChange}
                                                  handleNotesChange={this.handleNotesChange}
                                                  outer_id="metadata-pane"
                                                />
                            </Rbs.Tab>
                            <Rbs.Tab eventKey="options" title="options">
                                <OptionModule data_list={this.state.option_list}
                                              handleChange={this.handleOptionsChange}
                                              handleNotesAppend={this.handleNotesAppend}
                                />
                            </Rbs.Tab>
                            <Rbs.Tab eventKey="exports" title="exports">
                                <ExportModule data_list={this.state.export_list}
                                              handleChange={this.handleExportsChange}
                                              handleNotesAppend={this.handleNotesAppend}
                                />
                            </Rbs.Tab>
                            <Rbs.Tab eventKey="methods" title="methods">
                                <ReactCodemirror handleChange={this.handleMethodsChange}
                                                 code_content={this.state.extra_functions}
                                                 save_me={this.saveAndCheckpoint}
                                                 readOnly={false}
                                                 first_line_number={this.state.extra_methods_line_number}
                                                 refresh_required={this.methodsTabRefreshRequired}
                                />
                            </Rbs.Tab>
                        </Rbs.Tabs>
                    </div>
                </div>
            </React.Fragment>
        )

    }

    handleDrawPlotCodeChange(new_code) {
        this.setState({"draw_plot_code": new_code})
    }
    handleRenderContentChange(new_code) {
        this.setState({"render_content_code": new_code})
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