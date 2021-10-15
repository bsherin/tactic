var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from "react";
import PropTypes from 'prop-types';

import { doBinding } from "./utilities_react.js";

export { Sizer, getUsableDimensions, SIDE_MARGIN, USUAL_TOOLBAR_HEIGHT, TOP_MARGIN, BOTTOM_MARGIN, MENU_BAR_HEIGHT, SizeContext };

const SIDE_MARGIN = 15;
const BOTTOM_MARGIN = 35;
const TOP_MARGIN = 25;
const INITIAL_DECREMENT = 50;
const USUAL_TOOLBAR_HEIGHT = 50;
const USUAL_NAVBAR_HEIGHT = 50;
const MENU_BAR_HEIGHT = 30;

function getUsableDimensions(subtract_navbar = false) {
    let subtractor;
    if (subtract_navbar) {
        subtractor = USUAL_NAVBAR_HEIGHT
    }
    else {
        subtractor = 0
    }
    return {
        usable_width: window.innerWidth - 2 * SIDE_MARGIN,
        usable_height: window.innerHeight - BOTTOM_MARGIN - USUAL_TOOLBAR_HEIGHT - subtractor,
        usable_height_no_bottom: window.innerHeight - USUAL_TOOLBAR_HEIGHT - subtractor,
        body_height: window.innerHeight - BOTTOM_MARGIN -  subtractor
    };
}

const SizeContext = React.createContext({ available_height: 500, available_width: 500 });

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
        doBinding(this);
    }

    componentDidMount() {
        this.setState({ mounted: true }, this._updateDimensions);
    }

    _dimensionsHaveChanged() {
        return this.props.parentHeight != this.state.previousParentHeight || this.props.parentWidth != this.state.previousParentWidth;
    }

    componentDidUpdate() {
        if (this._dimensionsHaveChanged()) {
            this.setState({ previousParentHeight: this.props.parentHeight,
                previousParentWidth: this.props.parentWidth
            }, this._updateDimensions);
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
            dstyle = Object.assign({ width: this.state.availableWidth, height: this.state.availableHeight }, dstyle);
        }
        if (this.props.component) {
            return React.createElement(
                React.Fragment,
                null,
                React.createElement(
                    "div",
                    { ref: this.dref, style: dstyle, className: "sizer" },
                    React.createElement(WrappedComponent, _extends({ available_height: this.state.availableHeight,
                        available_width: this.state.availableWidth
                    }, this.props))
                )
            );
        } else {
            let context_value = { available_height: this.state.availableHeight,
                available_width: this.state.availableWidth };
            return React.createElement(
                React.Fragment,
                null,
                React.createElement("div", { ref: this.dref, style: dstyle, className: "sizer" }),
                React.createElement(
                    SizeContext.Provider,
                    { value: context_value },
                    this.props.children
                )
            );
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