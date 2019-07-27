/**
 * Created by bls910
 */

import {SelectList} from "./react_widgets.js";
import {ReactCodemirrorMergeView} from "./react-codemirror-mergeview.js";
import {Toolbar} from "./react_toolbar.js";


class HistoryViewerSocket extends TacticSocket {
    initialize_socket_stuff() {
        this.socket.emit('join', {"room": user_id});
        this.socket.emit('join-main', {"room": resource_viewer_id});
        this.socket.on('handle-callback', handleCallback);
        this.socket.on('stop-spinner', stopSpinner);
        this.socket.on('start-spinner', startSpinner);
        this.socket.on('close-user-windows', (data) => {
            if (!(data["originator"] == resource_viewer_id)) {
                window.close()
            }
        });
        this.socket.on("doFlash", function(data) {
            doFlash(data)
        });
    }
}

function history_viewer_main ()  {
    let get_url = "get_module_code";

    var tsocket = new HistoryViewerSocket("main", 5000);
    postAjaxPromise(`${get_url}/${resource_name}`, {})
        .then(function (data) {
            var left_content = data.the_content;
            postAjaxPromise("get_checkpoint_dates", {"module_name": resource_name})
                .then(function (data) {
                    let history_list = data.checkpoints;
                    let domContainer = document.querySelector('#root');
                    ReactDOM.render(<HistoryViewerApp resource_name={resource_name}
                                                      history_list={history_list}
                                                      left_content={left_content}/>, domContainer);
                })
                .catch(doFlash)

            }
        )
        .catch(doFlash);
}

class HistoryViewerApp extends React.Component {

    constructor(props) {
        super(props);
        this.left_div_ref = React.createRef();
        this.above_main_ref = React.createRef();
        this.merge_element_ref = React.createRef();
        this.savedContent = props.left_content;
        let self = this;
        window.onbeforeunload = function(e) {
            if (self.dirty()) {
                return "Any unsaved changes will be lost."
            }
        };

        this.state = {
            "left_content": props.left_content,
            "right_content": "",
            "history_popup_val": props.history_list[0]["updatestring"],
            "history_list": props.history_list,
            "inner_height": window.innerHeight,
            "mounted": false,
        };
        this.resize_to_window = this.resize_to_window.bind(this);
        this.handleLeftChange = this.handleLeftChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    get button_groups() {
        let bgs = [[{"name_text": "Save", "icon_name": "save", "click_handler": this.checkpointThenSaveFromLeft}]];

        for (let bg of bgs) {
            for (let but of bg) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return bgs

    }

    handleSelectChange(new_value) {
        this.state.history_popup_val = new_value;
        let self = this;
        for (let item of this.state.history_list) {
            if (item["updatestring"] == new_value){
                let updatestring_for_sort = item["updatestring_for_sort"];
                postAjaxPromise("get_checkpoint_code", {"module_name": self.props.resource_name, "updatestring_for_sort": updatestring_for_sort})
                    .then((data) => {
                            self.setState({"right_content": data.module_code});
                        })
                    .catch(doFlash);
                return
            }
        }
    }

    handleLeftChange(new_code) {
        this.setState({"left_content": new_code})
    }
    
    componentDidMount() {
        window.addEventListener("resize", this.resize_to_window);
        this.setState({"mounted": true});
        this.handleSelectChange(this.state.history_list[0]["updatestring"]);
        this.resize_to_window();
        stopSpinner();
    }

    resize_to_window() {
        this.setState({
            "inner_height": window.innerHeight,
        });
    }

    get_new_heights (bottom_margin) {
        let new_ld_height;
        let max_merge_height;
        if (this.state.mounted) {  // This will be true after the initial render
            new_ld_height = this.state.inner_height - $(this.left_div_ref.current).offset().top - bottom_margin
            max_merge_height = new_ld_height - this.above_main_ref.current.offsetHeight;
        }
        else {
            new_ld_height = this.state.inner_height - 45 - bottom_margin
            max_merge_height = new_ld_height- 50;
        }
        return [new_ld_height, max_merge_height]
    }

    render() {
        let toolbar_holder_style = {"marginTop": 20};
        let new_ld_height;
        let max_merge_height;
        [new_ld_height, max_merge_height] = this.get_new_heights(40);
        let left_div_style = {
            "width": "100%",
            "height": new_ld_height
        };
        let current_style = {"bottom": 0};
        let option_list = this.state.history_list.map((item) => item["updatestring"]);
        return (
            <React.Fragment>
                <div style={toolbar_holder_style}>
                    <Toolbar button_groups={this.button_groups}/>
                </div>
                <div id="left-div" ref={this.left_div_ref} style={left_div_style} className="res-viewer-resizer">
                    <div id="above-main" ref={this.above_main_ref} className="d-flex flex-row justify-content-between">
                        <span className="align-self-end">Current</span>
                        <SelectList handleChange={this.handleSelectChange}
                                    option_list={option_list}
                                    value={this.state.history_popup_val}
                        />
                    </div>
                    <ReactCodemirrorMergeView handleEditorChange={this.handleLeftChange}
                                              editor_content={this.state.left_content}
                                              right_content={this.state.right_content}
                                              saveMe={this.saveFromLeft}
                                              max_height={max_merge_height}
                                              ref={this.merge_element_ref}

                    />
                </div>
            </React.Fragment>
        )
    }

    doCheckpointPromise() {
        let self = this;
        return new Promise (function (resolve, reject) {
            postAjax("checkpoint_module", {"module_name": self.props.resource_name}, function (data) {
                if (data.success) {
                    resolve(data)
                }
                else {
                    reject(data)
                }
            });
        })
    }

    checkpointThenSaveFromLeft() {
        let self = this;
        let current_popup_val = this.state.history_popup_val;
        this.doCheckpointPromise()
            .then(function () {
                postAjaxPromise("get_checkpoint_dates", {"module_name": self.props.resource_name})
                    .then((data) => {
                        self.setState({"history_list": data.checkpoints})
                    })
                    .catch(doFlash);
                self.saveFromLeft()
            })
            .catch(doFlash)
    }

    saveFromLeft() {
        let data_dict = {
            "module_name": this.props.resource_name,
            "module_code": this.state.left_content
        };
        postAjaxPromise("update_from_left", data_dict)
            .then(doFlash)
            .catch(doFlash)
    }


    dirty() {
        return this.state.left_content != this.savedContent
    }
}

HistoryViewerApp.propTypes = {
    resource_name: PropTypes.string,
    history_list: PropTypes.array,
    left_content: PropTypes.string,
};


history_viewer_main();