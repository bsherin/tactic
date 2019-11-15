
const MARGIN_SIZE = 17;
const HANDLE_WIDTH = 20;

var Bp = blueprint;

let DraggableCore = window.react_draggable.DraggableCore;

export { HorizontalPanes, VerticalPanes, HANDLE_WIDTH, DragHandle };

class DragHandle extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.startX = null;
        this.startY = null;
        this.lastX = null;
        this.lastY = null;
    }

    get icon_dict() {
        return { x: "drag-handle-vertical",
            y: "drag-handle-horizontal",
            both: "caret-right"
        };
    }

    _dragStart(e, ui) {
        this.startX = this.getMouseX(e);
        this.startY = this.getMouseY(e);
        this.lastX = this.startX;
        this.lastY = this.startY;
        if (this.props.dragStart) {
            this.props.dragStart(e, ui, this.startX, this.startY);
        }
        e.preventDefault();
    }

    _onDrag(e, ui) {
        this.lastX = this.getMouseX(e);
        this.lastY = this.getMouseY(e);
        let dx = this.lastX - this.startX;
        let dy = this.lastY - this.startY;
        if (this.props.onDrag) {
            this.props.onDrag(e, ui, this.lastX, this.lastY, dx, dy);
        }
        e.preventDefault();
    }

    _dragEnd(e, ui) {
        let x = this.getMouseX(e);
        if (x) {
            this.lastX = x;
        }
        let y = this.getMouseY(e);
        if (y) {
            this.lastY = y;
        }
        let dx = this.lastX - this.startX;
        let dy = this.lastY - this.startY;
        if (this.props.dragEnd) {
            this.props.dragEnd(e, ui, this.lastX, this.lastY, dx, dy);
        }
        e.preventDefault();
    }

    getMouseX(e) {
        if (e.type == "touchend") return null;
        if (e.type == "touchmove" || e.type == "touchstart") {
            return e.touches[0].clientX;
        } else {
            return e.clientX;
        }
    }

    getMouseY(e) {
        if (e.type == "touchend") return null;
        if (e.type == "touchmove" || e.type == "touchstart") {
            return e.touches[0].clientY;
        } else {
            return e.clientY;
        }
    }

    get cursor_dict() {
        return { x: "ew-resize",
            y: "ns-resize",
            both: "se-resize"
        };
    }

    render() {
        let style = this.props.position_dict;
        style.cursor = this.cursor_dict[this.props.direction];
        if (this.props.direction == "both") {
            style.transform = "rotate(45deg)";
        }
        return React.createElement(
            DraggableCore,
            {
                onStart: this._dragStart,
                onStop: this._dragEnd,
                onDrag: this._onDrag,
                grid: [5, 5],
                scale: 1 },
            React.createElement(Bp.Icon, { icon: this.icon_dict[this.props.direction],
                iconSize: this.props.iconSize,
                style: style
            })
        );
    }
}

DragHandle.propTypes = {
    position_dict: PropTypes.object,
    onDrag: PropTypes.func,
    dragStart: PropTypes.func,
    dragEnd: PropTypes.func,
    direction: PropTypes.string,
    iconSize: PropTypes.number
};
DragHandle.defaultProps = {
    direction: "x",
    iconSize: 20,
    onDrag: null,
    dragStart: null,
    dragEnd: null
};

class HorizontalPanes extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.left_pane_ref = React.createRef();
        this.right_pane_ref = React.createRef();
        this.drag_handle_ref = React.createRef();
        this.scroll_bases = {};
        this.top_ref = this.props.top_ref == null ? React.createRef() : this.props.top_ref;
        this.old_left_width = 0;
        this.old_right_width = 0;
        this.unique_id = guid();
        this.state = {
            "current_width_fraction": this.props.initial_width_fraction,
            "mounted": false,
            deltaPosition: { x: 0, y: 0 }
        };
    }

    componentDidMount() {
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

    _handleDrag(e, ui, x, y, dx, dy) {
        let new_width_fraction = (x - this.left_pane_ref.current.offsetLeft) / this.props.available_width;
        this.update_width_fraction(new_width_fraction);
        this._resetScrolls();
    }

    _getSelectorElements() {
        let result = {};
        if (this.props.scrollAdjustSelectors && this.top_ref && this.top_ref.current) {
            for (let selector of this.props.scrollAdjustSelectors) {
                let els = $(this.top_ref.current).find(selector);
                if (els.length > 0) {
                    result[selector] = els[0];
                }
            }
        }
        return result;
    }

    _resetScrolls() {
        let selector_element_dict = this._getSelectorElements();
        for (let selector in selector_element_dict) {
            let el = selector_element_dict[selector];
            el.scrollLeft = this.scroll_bases[selector].left;
            el.scrollTop = this.scroll_bases[selector].top;
        }
    }

    _handleDragStart(e, ui, x, y, dx, dy) {
        let selector_element_dict = this._getSelectorElements();
        for (let selector in selector_element_dict) {
            let el = selector_element_dict[selector];
            this.scroll_bases[selector] = { left: el.scrollLeft, top: el.scrollTop };
        }
        if (this.props.handleResizeStart) {
            this.props.handleResizeStart(e, ui, x, y, dx, dy);
        }
    }

    _handleDragEnd(e, ui, x, y, dx, dy) {
        let new_width_fraction = (x - this.left_pane_ref.current.offsetLeft) / this.props.available_width;
        if (this.props.handleResizeEnd) {
            this.props.handleResizeEnd(new_width_fraction);
        }

        this._resetScrolls();
    }

    render() {
        let left_div_style = {
            width: this.left_width,
            height: this.props.available_height - this.props.bottom_margin,
            flexDirection: "column",
            overflow: "hidden"
        };
        // noinspection JSSuspiciousNameCombination
        let right_div_style = {
            width: this.right_width,
            height: this.props.available_height - this.props.bottom_margin,
            flexDirection: "column",
            overflowY: this.props.right_pane_overflow
        };

        let dstyle = this.props.hide_me ? { display: "none" } : {};
        let position_dict = { position: "relative", left: 0, top: (this.props.available_height - this.props.bottom_margin) / 2 };
        return React.createElement(
            "div",
            { id: this.unique_id, className: "d-flex flex-row horizontal-panes", ref: this.top_ref },
            React.createElement(
                "div",
                { ref: this.left_pane_ref, style: left_div_style, className: "res-viewer-resizer" },
                this.props.left_pane
            ),
            this.props.show_handle && React.createElement(DragHandle, { position_dict: position_dict,
                onDrag: this._handleDrag,
                dragStart: this._handleDragStart,
                dragEnd: this._handleDragEnd,
                direction: "x",
                iconSize: this.props.dragIconSize

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
    scrollAdjustSelectors: PropTypes.array,
    handleSplitUpdate: PropTypes.func,
    handleResizeStart: PropTypes.func,
    handleResizeEnd: PropTypes.func,
    initial_width_fraction: PropTypes.number,
    top_ref: PropTypes.object,
    bottom_margin: PropTypes.number,
    show_handle: PropTypes.bool,
    dragIconSize: PropTypes.number
};

HorizontalPanes.defaultProps = {
    handleSplitUpdate: null,
    handleResizeStart: null,
    handleResizeEnd: null,
    scrollAdjustSelectors: null,
    initial_width_fraction: .5,
    hide_me: false,
    left_margin: null,
    right_margin: null,
    right_pane_overflow: "visible",
    top_ref: null,
    bottom_margin: 0,
    show_handle: true,
    dragIconSize: 20
};

class VerticalPanes extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.top_ref = React.createRef();
        this.top_pane_ref = React.createRef();
        this.bottom_pane_ref = React.createRef();
        this.scroll_bases = {};
        this.old_bottom_height = 0;
        this.old_top_height = 0;
        this.unique_id = guid();
        this.state = this.state = {
            "current_height_fraction": this.props.initial_height_fraction,
            "mounted": false
        };
    }

    componentDidMount() {
        this.setState({ "mounted": true });
        window.addEventListener("resize", this.resize_to_window);
    }

    componentDidUpdate() {
        this.notifySplitUpate();
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

    _handleDrag(e, ui, x, y, dx, dy) {
        let new_height_fraction = (y - this.top_pane_ref.current.offsetTop) / this.props.available_height;
        this.update_height_fraction(new_height_fraction);
    }

    _getSelectorElements() {
        let result = {};
        if (this.props.scrollAdjustSelectors && this.top_ref && this.top_ref.current) {
            for (let selector of this.props.scrollAdjustSelectors) {
                let els = $(this.top_ref.current).find(selector);
                if (els.length > 0) {
                    result[selector] = els[0];
                }
            }
        }
        return result;
    }

    _resetScrolls() {
        let selector_element_dict = this._getSelectorElements();
        for (let selector in selector_element_dict) {
            let el = selector_element_dict[selector];
            el.scrollLeft = this.scroll_bases[selector].left;
            el.scrollTop = this.scroll_bases[selector].top;
        }
    }

    _handleDragStart(e, ui, x, y, dx, dy) {
        let selector_element_dict = this._getSelectorElements();
        for (let selector in selector_element_dict) {
            let el = selector_element_dict[selector];
            this.scroll_bases[selector] = { left: el.scrollLeft, top: el.scrollTop };
        }
        if (this.props.handleResizeStart) {
            this.props.handleResizeStart(e, ui, x, y, dx, dy);
        }
    }

    _handleDragEnd(e, ui, x, y, dx, dy) {
        let new_height_fraction = (y - this.top_pane_ref.current.offsetTop) / this.props.available_height;
        if (this.props.handleResizeEnd) {
            this.props.handleResizeEnd(new_height_fraction);
        }
        this._resetScrolls();
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
        let position_dict = { position: "relative", left: this.props.available_width / 2, top: 0 };
        return React.createElement(
            "div",
            { id: this.unique_id, className: "d-flex flex-column", ref: this.top_ref },
            React.createElement(
                "div",
                { ref: this.top_pane_ref, style: top_div_style },
                this.props.top_pane
            ),
            this.props.show_handle && React.createElement(DragHandle, { position_dict: position_dict,
                onDrag: this._handleDrag,
                direction: "y",
                iconSize: this.props.dragIconSize,
                dragStart: this._handleDragStart,
                dragEnd: this._handleDragEnd
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
    handleResizeStart: PropTypes.func,
    handleResizeEnd: PropTypes.func,
    scrollAdjustSelectors: PropTypes.array,
    initial_height_fraction: PropTypes.number,
    overflow: PropTypes.string,
    show_handle: PropTypes.bool,
    dragIconSize: PropTypes.number
};

VerticalPanes.defaultProps = {
    handleSplitUpdate: null,
    handleResizeStart: null,
    handleResizeEnd: null,
    scrollAdjustSelectors: null,
    initial_height_fraction: .5,
    hide_top: false,
    overflow: "scroll",
    show_handle: true,
    dragIconSize: 20
};