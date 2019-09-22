
import {ReactCodemirrorMergeView} from "./react-codemirror-mergeview.js";
import {Toolbar} from "./react_toolbar.js";
import {TacticSocket} from "./tactic_socket.js";
import {doFlash} from "./toaster.js";
import {handleCallback} from "./communication_react.js"

export{MergeViewerApp, MergeViewerSocket}

let Bp = blueprint;

class MergeViewerSocket extends TacticSocket {
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


class MergeViewerApp extends React.Component {

    constructor(props) {
        super(props);
        this.left_div_ref = React.createRef();
        this.above_main_ref = React.createRef();
        this.merge_element_ref = React.createRef();
        let self = this;

        this.state = {
            "inner_height": window.innerHeight,
            "mounted": false,
        };
        this.resize_to_window = this.resize_to_window.bind(this);
    }

    get button_groups() {
        return [[{"name_text": "Save", "icon_name": "save", "click_handler": this.props.saveHandler}]];

    }

    componentDidMount() {
        window.addEventListener("resize", this.resize_to_window);
        this.setState({"mounted": true});
        let fake_event = {currentTarget: {value: this.props.select_val}};
        this.props.handleSelectChange(fake_event);
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
            new_ld_height = this.state.inner_height - $(this.left_div_ref.current).offset().top - bottom_margin;
            max_merge_height = new_ld_height - this.above_main_ref.current.offsetHeight;
        }
        else {
            new_ld_height = this.state.inner_height - 45 - bottom_margin;
            max_merge_height = new_ld_height- 50;
        }
        return [new_ld_height, max_merge_height]
    }

    render() {
        let toolbar_holder_style = {"marginTop": 20, paddingLeft: 50};
        let new_ld_height;
        let max_merge_height;
        [new_ld_height, max_merge_height] = this.get_new_heights(40);
        let left_div_style = {
            "width": "100%",
            "height": new_ld_height,
            paddingLeft: 25,
            paddingRight: 25

        };
        let current_style = {"bottom": 0};
        return (
            <React.Fragment>
                <div style={toolbar_holder_style}>
                    <Toolbar button_groups={this.button_groups}/>
                </div>
                <div id="left-div" ref={this.left_div_ref} style={left_div_style}>
                    <div id="above-main" ref={this.above_main_ref} className="d-flex flex-row justify-content-between mb-2">
                        <span className="align-self-end">Current</span>
                        <Bp.HTMLSelect options={this.props.option_list}
                                       onChange={this.props.handleSelectChange}
                                       value={this.props.select_val}/>
                    </div>
                    <ReactCodemirrorMergeView handleEditChange={this.props.handleEditChange}
                                              editor_content={this.props.edit_content}
                                              right_content={this.props.right_content}
                                              saveMe={this.props.saveHandler}
                                              max_height={max_merge_height}
                                              ref={this.merge_element_ref}

                    />
                </div>
            </React.Fragment>
        )
    }
}

MergeViewerApp.propTypes = {
    resource_name: PropTypes.string,
    option_list: PropTypes.array,
    select_val: PropTypes.string,
    edit_content: PropTypes.string,
    right_content: PropTypes.string,
    handleSelectChange: PropTypes.func,
    handleEditChange: PropTypes.func,
    saveHandler: PropTypes.func
};