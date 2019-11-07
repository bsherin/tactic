
const MARGIN_SIZE = 17;
const HANDLE_WIDTH = 20;

var Bp = blueprint;

export { HorizontalPanes, VerticalPanes, HANDLE_WIDTH };

class HorizontalPanes extends React.Component {
    constructor(props) {
        super(props);
        this.left_pane_ref = React.createRef();
        this.right_pane_ref = React.createRef();
        this.drag_handle_ref = React.createRef();
        this.top_ref = this.props.top_ref == null ? React.createRef() : this.props.top_ref;
        this.old_left_width = 0;
        this.old_right_width = 0;
        this.unique_id = guid();
        this.state = this.state = {
            "current_width_fraction": this.props.initial_width_fraction,
            "mounted": false
        };
    }

    componentDidMount() {
        this.turn_on_horizontal_resize();
        window.addEventListener("resize", this.resize_to_window);
        this.setState({ "mounted": true }, () => {
            if (this.props.handleSplitUpdate) {
                this.props.handleSplitUpdate(this.left_width, this.right_width, this.state.current_width_fraction);
            }
        });
    }

    componentDidUpdate() {
        this.notifySplitUpate();
    }

    turn_on_horizontal_resize() {
        let self = this;
        let the_handles = this.props.show_handle ? { "e": $("#" + this.unique_id + " .ui-resizable-e") } : "e";
        $(this.left_pane_ref.current).resizable({
            handles: the_handles,
            resize: function (event, ui) {
                let awidth = self.props.show_handle ? self.props.available_width - HANDLE_WIDTH : self.props.available_width;
                let new_width_fraction = 1.0 * ui.size.width / self.props.available_width;
                ui.position.left = ui.originalPosition.left;
                self.update_width_fraction(new_width_fraction);
            }
        });
    }

    get left_width() {
        if (this.props.show_handle) {
            return (this.props.available_width - HANDLE_WIDTH) * this.state.current_width_fraction;
        }
        return this.props.available_width * this.state.current_width_fraction;
    }

    get right_width() {
        if (this.props.show_handle) {
            return (1 - this.state.current_width_fraction) * (this.props.available_width - HANDLE_WIDTH);
        }
        return (1 - this.state.current_width_fraction) * this.props.available_width;
    }

    update_width_fraction(new_width_fraction) {
        this.setState({ "current_width_fraction": new_width_fraction });
    }

    get width_has_changed() {
        return this.left_width != this.old_left_width || this.right_width != this.old_right_width;
    }

    notifySplitUpate() {
        if (this.width_has_changed && this.props.handleSplitUpdate != null) {
            this.old_left_width = this.left_width;
            this.old_right_width = this.right_width;
            this.props.handleSplitUpdate(this.left_width, this.right_width, this.state.current_width_fraction);
        }
    }

    render() {
        let left_div_style = {
            width: this.left_width,
            height: this.props.available_height - this.props.bottom_margin,
            flexDirection: "column"
        };
        // noinspection JSSuspiciousNameCombination
        let right_div_style = {
            width: this.right_width,
            height: this.props.available_height - this.props.bottom_margin,
            flexDirection: "column",
            overflowY: this.props.right_pane_overflow
        };

        let dstyle = this.props.hide_me ? { display: "none" } : {};
        return React.createElement(
            "div",
            { id: this.unique_id, className: "d-flex flex-row horizontal-panes", ref: this.props.top_ref },
            React.createElement(
                "div",
                { ref: this.left_pane_ref, style: left_div_style, className: "res-viewer-resizer" },
                this.props.left_pane
            ),
            this.props.show_handle && React.createElement(Bp.Icon, { icon: "drag-handle-vertical", iconSize: 20,
                ref: this.drag_handle_ref,
                className: "ui-resizable-handle ui-resizable-e",
                style: {
                    position: "relative",
                    zIndex: 15,
                    top: (this.props.available_height - this.props.bottom_margin) / 2,
                    left: -5
                }
            }),
            React.createElement(
                "div",
                { ref: this.right_pane_ref, style: right_div_style },
                this.props.right_pane
            )
        );
    }
}

HorizontalPanes.propTypes = {
    available_width: PropTypes.number,
    available_height: PropTypes.number,
    left_pane: PropTypes.object,
    right_pane: PropTypes.object,
    right_pane_overflow: PropTypes.string,
    handleSplitUpdate: PropTypes.func,
    initial_width_fraction: PropTypes.number,
    top_ref: PropTypes.object,
    bottom_margin: PropTypes.number,
    show_handle: PropTypes.bool
};

HorizontalPanes.defaultProps = {
    handleSplitUpdate: null,
    initial_width_fraction: .5,
    hide_me: false,
    left_margin: null,
    right_margin: null,
    right_pane_overflow: "visible",
    top_ref: null,
    bottom_margin: 0,
    show_handle: false
};

class VerticalPanes extends React.Component {
    constructor(props) {
        super(props);
        this.top_pane_ref = React.createRef();
        this.bottom_pane_ref = React.createRef();
        this.old_bottom_height = 0;
        this.old_top_height = 0;
        this.unique_id = guid();
        this.state = this.state = {
            "current_height_fraction": this.props.initial_height_fraction,
            "mounted": false
        };
    }

    componentDidMount() {
        this.turn_on_vertical_resize();
        this.setState({ "mounted": true });
        window.addEventListener("resize", this.resize_to_window);
    }

    componentDidUpdate() {
        this.notifySplitUpate();
    }

    turn_on_vertical_resize() {
        let self = this;
        let the_handles = this.props.show_handle ? { "s": $("#" + this.unique_id + " .ui-resizable-s") } : "s";
        $(this.top_pane_ref.current).resizable({
            handles: the_handles,
            resize: function (event, ui) {
                let new_height_fraction = 1.0 * ui.size.height / self.props.available_height;
                self.update_height_fraction(new_height_fraction);
            }
        });
    }

    get top_height() {
        return this.props.available_height * this.state.current_height_fraction;
    }

    get bottom_height() {
        return (1 - this.state.current_height_fraction) * this.props.available_height;
    }

    notifySplitUpate() {
        if (this.props.handleSplitUpdate != null && this.height_has_changed) {
            this.old_top_height = this.top_height;
            this.old_bottom_height = this.bottom_height;
            this.props.handleSplitUpdate(this.top_height, this.bottom_height, this.state.current_height_fraction);
        }
    }

    update_height_fraction(new_height_fraction) {
        this.setState({ "current_height_fraction": new_height_fraction });
    }

    get height_has_changed() {
        return this.top_height != this.old_top_height || this.bottom_height != this.old_bottom_height;
    }

    render() {
        let top_div_style = {
            "width": this.props.available_width,
            "height": this.top_height,
            // borderBottom: "0.5px solid rgb(238, 238, 238)",
            overflowY: this.props.overflow
        };
        if (this.props.hide_top) {
            top_div_style.display = "none";
        }
        let bottom_div_style = {
            "width": this.props.available_width,
            "height": this.bottom_height,
            overflowY: this.props.overflow
        };
        return React.createElement(
            "div",
            { id: this.unique_id, className: "d-flex flex-column" },
            React.createElement(
                "div",
                { ref: this.top_pane_ref, style: top_div_style },
                this.props.top_pane
            ),
            this.props.show_handle && React.createElement(Bp.Icon, { icon: "drag-handle-horizontal", iconSize: 20,
                className: "ui-resizable-handle ui-resizable-s",
                style: {
                    position: "relative",
                    zIndex: 15,
                    left: this.props.available_width / 2,
                    bottom: 0 }
            }),
            React.createElement(
                "div",
                { ref: this.bottom_pane_ref, style: bottom_div_style },
                this.props.bottom_pane
            )
        );
    }
}

VerticalPanes.propTypes = {
    available_width: PropTypes.number,
    available_height: PropTypes.number,
    top_pane: PropTypes.object,
    hide_top: PropTypes.bool,
    bottom_pane: PropTypes.object,
    handleSplitUpdate: PropTypes.func,
    initial_height_fraction: PropTypes.number,
    overflow: PropTypes.string,
    show_handle: PropTypes.bool
};

VerticalPanes.defaultProps = {
    handleSplitUpdate: null,
    initial_height_fraction: .5,
    hide_top: false,
    overflow: "scroll",
    show_handle: false
};