
export {Sizer, getUsableDimensions, SIDE_MARGIN, USUAL_TOOLBAR_HEIGHT, TOP_MARGIN, BOTTOM_MARGIN, SizeContext}

const SIDE_MARGIN = 15;
const BOTTOM_MARGIN = 35;
const TOP_MARGIN = 25;
const INITIAL_DECREMENT = 50;
const USUAL_TOOLBAR_HEIGHT = 50;

function getUsableDimensions() {
    return {
        "usable_width": window.innerWidth - 2 * SIDE_MARGIN,
        "usable_height": window.innerHeight - BOTTOM_MARGIN - USUAL_TOOLBAR_HEIGHT,
        usable_height_no_bottom: window.innerHeight - USUAL_TOOLBAR_HEIGHT,
        body_height: window.innerHeight - BOTTOM_MARGIN
    }
}

const SizeContext = React.createContext({available_height: 500, available_width: 500});

class Sizer extends React.Component {
    constructor(props) {
        super(props);
        this.dref = React.createRef();
        this.state = {
            mounted: false,
            availableHeight: this.props.parentHeight - INITIAL_DECREMENT,
            availableWidth: this.props.parentWidth - INITIAL_DECREMENT,
            previousParentHeight: this.props.parentHeight,
            previousParentWidth: this.props.parentWidth,
            indent_left: 0
        };
        doBinding(this)
    }

    componentDidMount() {
        this.setState({mounted: true}, this._updateDimensions)
    }

    _dimensionsHaveChanged() {
        return (this.props.parentHeight != this.state.previousParentHeight) ||
            (this.props.parentWidth != this.state.previousParentWidth)
    }

    componentDidUpdate() {
        if (this._dimensionsHaveChanged()) {
            this.setState({previousParentHeight: this.props.parentHeight,
                previousParentWidth: this.props.parentWidth
            }, this._updateDimensions)
        }
    }

    _updateDimensions() {
        // if (this.state.mounted && this.dref.current) {
        //     let my_pos = $(this.dref.current).position();
        //     let top_offset = my_pos.top;
        //     let left_offset = my_pos.left;
        //     let bottom_offset = 0;
        //     let right_offset = 0;
        //     if (this.props.bottom_ref && this.props.bottom_ref.current) {
        //         bottom_offset = this.props.parentHeight - $(this.props.bottom_ref.current).position().top;
        //     }
        //     if (this.props.right_ref && this.props.right_ref.current) {
        //         right_offset = this.props.parentWidth - $(this.props.right_ref.current).position().left;
        //     }
        //     this.setState({
        //         availableHeight: this.props.parentHeight - top_offset - bottom_offset,
        //         availableWidth: this.props.parentWidth - left_offset - right_offset
        //     })
        // }
    }

    render() {
        var WrappedComponent = this.props.component;
        let dstyle = Object.assign({}, this.props.div_style);
        if (this.props.am_outer) {
            dstyle.position = "absolute";
            dstyle.left = SIDE_MARGIN;
        }
        if (this.props.apply_dimensions_to_div) {
            dstyle = Object.assign({width: this.state.availableWidth, height: this.state.availableHeight}, dstyle)
        }
        if (this.props.component) {
            return (
                <React.Fragment>
                    <div ref={this.dref} style={dstyle} className="sizer">
                        <WrappedComponent available_height={this.state.availableHeight}
                                          available_width={this.state.availableWidth}
                                          {...this.props}
                        />
                    </div>
                </React.Fragment>
            )
        }
        else {
            let context_value = {available_height: this.state.availableHeight,
                available_width: this.state.availableWidth};
            return (
                <React.Fragment>
                    <div ref={this.dref} style={dstyle} className="sizer"/>
                    <SizeContext.Provider value={context_value}>
                        {this.props.children}
                    </SizeContext.Provider>
                </React.Fragment>
            )
        }

    }
}

Sizer.propTypes = {
    parentHeight: PropTypes.number,
    parentWidth: PropTypes.number,
    component: PropTypes.func,
    bottom_ref: PropTypes.object,
    right_ref: PropTypes.object,
    am_outer: PropTypes.bool,
    div_style: PropTypes.object,
    apply_dimensions_to_div: PropTypes.bool
};

Sizer.defaultProps = {
    bottom_ref: null,
    right_ref: null,
    component: null,
    am_outer: false,
    div_style: {},
    apply_dimensions_to_div: false
};
