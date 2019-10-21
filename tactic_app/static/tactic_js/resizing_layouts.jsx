
const MARGIN_SIZE = 17;

import {Sizer} from "./sizing_tools.js";

export {HorizontalPanes, VerticalPanes}

class HorizontalPanes extends React.Component {
    constructor(props) {
        super(props);
        this.left_pane_ref = React.createRef();
        this.right_pane_ref = React.createRef();
        this.top_ref = this.props.top_ref == null ? React.createRef() : this.props.top_ref;
        this.old_left_width = 0;
        this.old_right_width = 0;
        this.state = this.state = {
            "current_width_fraction": this.props.initial_width_fraction,
            "mounted": false
        };
    }

    componentDidMount() {
        this.turn_on_horizontal_resize();
        window.addEventListener("resize", this.resize_to_window);
        this.setState({"mounted": true}, ()=>{
            if (this.props.handleSplitUpdate) {
                this.props.handleSplitUpdate(this.left_width, this.right_width, this.state.current_width_fraction)
            }

        });
    }

    componentDidUpdate() {
        this.notifySplitUpate();
    }

    turn_on_horizontal_resize () {
        let self = this;
        $(this.left_pane_ref.current).resizable({
            handles: "e",
            resize: function (event, ui) {
                let new_width_fraction = 1.0 * ui.size.width / self.props.available_width;
                ui.position.left = ui.originalPosition.left;
                self.update_width_fraction(new_width_fraction)
            }
        });
    }

    get left_width() {
        return this.props.available_width * this.state.current_width_fraction
    }

    get right_width() {
        return (1 - this.state.current_width_fraction) * this.props.available_width
    }

    update_width_fraction(new_width_fraction) {
        this.setState({"current_width_fraction": new_width_fraction});
    }

    get width_has_changed() {
       return (this.left_width != this.old_left_width) || (this.right_width != this.old_right_width)
    }

    notifySplitUpate() {
        if (this.width_has_changed && (this.props.handleSplitUpdate != null)) {
            this.old_left_width = this.left_width;
            this.old_right_width = this.right_width;
            this.props.handleSplitUpdate(this.left_width, this.right_width, this.state.current_width_fraction)
        }
    }

    render () {
        let left_div_style = {
            width: this.left_width,
            height: this.props.available_height - this.props.bottom_margin,
            flexDirection: "column"
        };
        let right_div_style = {
            width: this.right_width,
            height: this.props.available_height - this.props.bottom_margin,
            flexDirection: "column"
        };

        let dstyle = this.props.hide_me ? {display: "none"} : {};
        return (
            <div className="d-flex flex-row horizontal-panes" ref={this.props.top_ref}>
                <div ref={this.left_pane_ref} style={left_div_style} className="res-viewer-resizer">
                    {this.props.left_pane}
                </div>
                <div ref={this.right_pane_ref} style={right_div_style}>
                    {this.props.right_pane}
                </div>
            </div>
        )
    }
}

HorizontalPanes.propTypes = {
    available_width: PropTypes.number,
    available_height: PropTypes.number,
    left_pane: PropTypes.object,
    right_pane: PropTypes.object,
    handleSplitUpdate: PropTypes.func,
    initial_width_fraction: PropTypes.number,
    top_ref: PropTypes.object,
    bottom_margin: PropTypes.number
};

HorizontalPanes.defaultProps = {
    handleSplitUpdate: null,
    initial_width_fraction: .5,
    hide_me: false,
    left_margin: null,
    right_margin: null,
    top_ref: null,
    bottom_margin: 0
};


class VerticalPanes extends React.Component {
    constructor(props) {
        super(props);
        this.top_pane_ref = React.createRef();
        this.bottom_pane_ref = React.createRef();
        this.old_bottom_height = 0;
        this.old_top_height = 0;
        this.state = this.state = {
            "current_height_fraction": this.props.initial_height_fraction,
            "mounted": false
        };
    }

    componentDidMount() {
        this.turn_on_vertical_resize();
        this.setState({"mounted": true});
        window.addEventListener("resize", this.resize_to_window);
    }

    componentDidUpdate() {
        this.notifySplitUpate()
    }


    turn_on_vertical_resize() {
        let self = this;
        $(this.top_pane_ref.current).resizable({
            handles: "s",
            resize: function (event, ui) {
                let new_height_fraction = 1.0 * ui.size.height / self.props.available_height;
                self.update_height_fraction(new_height_fraction)
            }
        });
    }

    get top_height() {
        return this.props.available_height * this.state.current_height_fraction
    }

    get bottom_height() {
        return (1 - this.state.current_height_fraction) * this.props.available_height
    }

    notifySplitUpate() {
        if (this.props.handleSplitUpdate != null && this.height_has_changed) {
            this.old_top_height = this.top_height;
            this.old_bottom_height = this.bottom_height;
            this.props.handleSplitUpdate(this.top_height, this.bottom_height, this.state.current_height_fraction)
        }
    }

    update_height_fraction(new_height_fraction) {
        this.setState({"current_height_fraction": new_height_fraction});
    }

    get height_has_changed() {
       return (this.top_height != this.old_top_height) || (this.bottom_height != this.old_bottom_height)
    }

    render () {
        let top_div_style = {
            "width": this.props.available_width,
            "height": this.top_height,
            // borderBottom: "0.5px solid rgb(238, 238, 238)",
            overflowY: "scroll"
        };
        if (this.props.hide_top) {
            top_div_style.display = "none";
        }
        let bottom_div_style = {
            "width": this.props.available_width,
            "height": this.bottom_height,
            overflowY: "scroll"
        };
        return (
            <div className="d-flex flex-column">
                <div ref={this.top_pane_ref} style={top_div_style}>
                        {this.props.top_pane}
                </div>
                <div ref={this.bottom_pane_ref} style={bottom_div_style}>
                        {this.props.bottom_pane}
                </div>
            </div>
        )
    }
}

VerticalPanes.propTypes = {
    available_width: PropTypes.number,
    available_height: PropTypes.number,
    top_pane: PropTypes.object,
    hide_top: PropTypes.bool,
    bottom_pane: PropTypes.object,
    handleSplitUpdate: PropTypes.func,
    initial_height_fraction: PropTypes.number
};

VerticalPanes.defaultProps = {
    handleSplitUpdate: null,
    initial_height_fraction: .5,
    hide_top: false
};


