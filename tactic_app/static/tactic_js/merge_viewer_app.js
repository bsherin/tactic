import { SelectList } from "./react_widgets.js";
import { ReactCodemirrorMergeView } from "./react-codemirror-mergeview.js";
import { Toolbar } from "./react_toolbar.js";
import { TacticSocket } from "./tactic_socket.js";

export { MergeViewerApp, MergeViewerSocket };

class MergeViewerSocket extends TacticSocket {
    initialize_socket_stuff() {
        this.socket.emit('join', { "room": user_id });
        this.socket.emit('join-main', { "room": resource_viewer_id });
        this.socket.on('handle-callback', handleCallback);
        this.socket.on('stop-spinner', stopSpinner);
        this.socket.on('start-spinner', startSpinner);
        this.socket.on('close-user-windows', data => {
            if (!(data["originator"] == resource_viewer_id)) {
                window.close();
            }
        });
        this.socket.on("doFlash", function (data) {
            doFlash(data);
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
            "mounted": false
        };
        this.resize_to_window = this.resize_to_window.bind(this);
    }

    get button_groups() {
        let bgs = [[{ "name_text": "Save", "icon_name": "save", "click_handler": this.props.saveHandler }]];
        return bgs;
    }

    componentDidMount() {
        window.addEventListener("resize", this.resize_to_window);
        this.setState({ "mounted": true });
        this.props.handleSelectChange(this.props.select_val);
        this.resize_to_window();
        stopSpinner();
    }

    resize_to_window() {
        this.setState({
            "inner_height": window.innerHeight
        });
    }

    get_new_heights(bottom_margin) {
        let new_ld_height;
        let max_merge_height;
        if (this.state.mounted) {
            // This will be true after the initial render
            new_ld_height = this.state.inner_height - $(this.left_div_ref.current).offset().top - bottom_margin;
            max_merge_height = new_ld_height - this.above_main_ref.current.offsetHeight;
        } else {
            new_ld_height = this.state.inner_height - 45 - bottom_margin;
            max_merge_height = new_ld_height - 50;
        }
        return [new_ld_height, max_merge_height];
    }

    render() {
        let toolbar_holder_style = { "marginTop": 20 };
        let new_ld_height;
        let max_merge_height;
        [new_ld_height, max_merge_height] = this.get_new_heights(40);
        let left_div_style = {
            "width": "100%",
            "height": new_ld_height
        };
        let current_style = { "bottom": 0 };
        return React.createElement(
            React.Fragment,
            null,
            React.createElement(
                "div",
                { style: toolbar_holder_style },
                React.createElement(Toolbar, { button_groups: this.button_groups })
            ),
            React.createElement(
                "div",
                { id: "left-div", ref: this.left_div_ref, style: left_div_style },
                React.createElement(
                    "div",
                    { id: "above-main", ref: this.above_main_ref, className: "d-flex flex-row justify-content-between" },
                    React.createElement(
                        "span",
                        { className: "align-self-end" },
                        "Current"
                    ),
                    React.createElement(SelectList, { handleChange: this.props.handleSelectChange,
                        option_list: this.props.option_list,
                        value: this.props.select_val
                    })
                ),
                React.createElement(ReactCodemirrorMergeView, { handleEditChange: this.props.handleEditChange,
                    editor_content: this.props.edit_content,
                    right_content: this.props.right_content,
                    saveMe: this.props.saveHandler,
                    max_height: max_merge_height,
                    ref: this.merge_element_ref

                })
            )
        );
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