
import React from "react";
import { useState, useEffect, useRef, memo, useContext } from "react";
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Icon } from "@blueprintjs/core";
import { DraggableCore } from "react-draggable"
import { guid } from "./utilities_react.js";

import { SizeContext } from "./sizing_tools";
import {SelectedPaneContext} from "./utilities_react";

export {HorizontalPanes, VerticalPanes, HANDLE_WIDTH, DragHandle}

const MARGIN_SIZE = 17;
const HANDLE_WIDTH = 10;

function DragHandle(props) {
    const startX = useRef(null);
    const startY = useRef(null);
    const lastX = useRef(null);
    const lastY = useRef(null);

    const icon_dict = {
        x: "drag-handle-vertical",
        y: "drag-handle-horizontal",
        both: "caret-right"
    };

    function _dragStart(e, ui) {
        startX.current = getMouseX(e);
        startY.current = getMouseY(e);
        lastX.current = startX.current;
        lastY.current = startY.current;
        if (props.dragStart) {
            props.dragStart(e, ui, startX.current, startY.current);
        }
        e.preventDefault();
    }

    function _onDrag(e, ui) {
        if (props.direction == "y") {
            lastX.current = startX.current;
        }
        else {
            lastX.current = getMouseX(e);
        }
        if (props.direction == "x") {
            lastY.current = startY.current;
        }
        else {
            lastY.current = getMouseY(e);
        }
        let dx = lastX.current - startX.current;
        let dy = lastY.current - startY.current;
        if (props.onDrag) {
            props.onDrag(e, ui, lastX.current, lastY.current, dx, dy)
        }
        e.preventDefault();
    }

    function _dragEnd(e, ui) {
        if (props.direction == "y") {
            lastX.current = startX.current;
        }
        else {
            lastX.current = getMouseX(e);
        }
        if (props.direction == "x") {
            lastY.current = startY.current;
        }
        else {
            lastY.current = getMouseY(e);
        }
        let dx = lastX.current - startX.current;
        let dy = lastY.current - startY.current;
        if (props.dragEnd) {
            props.dragEnd(e, ui, lastX.current, lastY.current, dx, dy);
        }
        e.preventDefault();
    }

    function getMouseX(e) {
        if (e.type == "touchend") return null;
        if ((e.type == "touchmove") || (e.type == "touchstart")) {
            return e.touches[0].clientX
        }
        else {
            return e.clientX
        }
    }

    function getMouseY(e) {
        if (e.type == "touchend") return null;
        if ((e.type == "touchmove") || (e.type == "touchstart")) {
            return e.touches[0].clientY
        }
        else {
            return e.clientY
        }
    }

    const cursor_dict = {
        x: "ew-resize",
        y: "ns-resize",
        both: "se-resize"
    };

    let style = props.position_dict;
    style.cursor = cursor_dict[props.direction];
    if (props.direction == "both") {
        style.transform = "rotate(45deg)"
    }
    let wrappedElement;
    if (props.useThinBar) {
        let the_class = props.direction == "x" ? "resize-border" : "horizontal-resize-border";
        if (props.barHeight != null) {
            style.height = props.barHeight;
        }
        if (props.barWidth != null) {
            style.width = props.barWidth
        }
        wrappedElement = <div className={the_class} style={style}/>
    }
    else {
        wrappedElement = <Icon icon={icon_dict[props.direction]}
                               size={props.iconSize}
                               style={style}/>
    }
    return (
        <DraggableCore
            onStart={_dragStart}
            onStop={_dragEnd}
            onDrag={_onDrag}
            grid={[5, 5]}
            scale={1}>
            {wrappedElement}
        </DraggableCore>
    )
}

DragHandle = memo(DragHandle);

DragHandle.propTypes = {
    position_dict: PropTypes.object,
    onDrag: PropTypes.func,
    dragStart: PropTypes.func,
    dragEnd: PropTypes.func,
    direction: PropTypes.string,
    size: PropTypes.number,
    useThinBar: PropTypes.bool,
    barheight: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    barWidth: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number])
};
DragHandle.defaultProps = {
    direction: "x",
    size: 20,
    onDrag: null,
    dragStart: null,
    dragEnd: null,
    useThinBar: false,
    barHeight: null,
    barWidth: null
};

function HorizontalPanes(props) {
    const currentlyDragging = useRef(false);
    const left_pane_ref = useRef(null);
    const right_pane_ref = useRef(null);
    const scroll_bases = useRef({});
    const top_ref = useRef(props.top_ref == null ? useRef(null) : props.top_ref);
    const old_left_width = useRef(0);
    const old_right_width = useRef(0);
    const unique_id = useRef(guid());

    const [current_width_fraction, set_current_width_fraction] = useState(props.initial_width_fraction);
    const [deltaPosition, setDeltaPosition] = useState({x: 0, y: 0});

    const [leftHeight, setLeftHeight] = useState(0);
    const [rightHeight, setRightHeight] = useState(0);
    const [leftWidth, setLeftWidth] = useState(0);
    const [rightWidth, setRightWidth] = useState(0);
    const [leftBoundingRect, setLeftBoundingRect] = useState({x: 0, y: 0, width: 0, height: 0, left: 0, top: 0, bottom: 0});
    const [rightBoundingRect, setRightBoundingRect] = useState({x: 0, y: 0, width: 0, height: 0, left: 0, top: 0, bottom: 0});

    const sizeInfo = useContext(SizeContext);
    const selectedPane = useContext(SelectedPaneContext);

    useEffect(() => {
        if (props.handleSplitUpdate) {
            props.handleSplitUpdate(left_width(), right_width(), current_width_fraction)
        }
    }, []);

    useEffect(() => {
        notifySplitUpdate();
    }, [current_width_fraction]);

    useEffect(() => {
        updateDimensions()
    }, [sizeInfo.availableWidth, sizeInfo.availableHeight,
        selectedPane.selectedTabIdRef.current, current_width_fraction]);

    function am_selected() {
        return selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef)
    }

    function updateDimensions() {
        if (!am_selected()) {
            return
        }
        let left_height = sizeInfo.availableHeight - props.bottom_margin;
        let right_height = left_height;

        if (right_pane_ref && right_pane_ref.current) {
            let right_rect = right_pane_ref.current.getBoundingClientRect();
            if (!props.fixed_height) {
                right_height = right_height - right_rect.top + sizeInfo.topY;
            }
            setRightBoundingRect(right_rect)
        }
        if (left_pane_ref.current && !props.fixed_height) {
            let left_rect = left_pane_ref.current.getBoundingClientRect();
            if (!props.fixed_height) {
                left_height = left_height - left_rect.top + sizeInfo.topY;
            }
            setLeftBoundingRect(left_rect)
        }

        setLeftHeight(left_height);
        setRightHeight(right_height);
        setLeftWidth(left_width());
        setRightWidth(right_width());
    }

    function left_width() {
        if (props.show_handle) {
            return (sizeInfo.availableWidth - HANDLE_WIDTH) * current_width_fraction
        }
        return sizeInfo.availableWidth * current_width_fraction
    }

    function right_width() {
        if (props.show_handle) {
            return (1 - current_width_fraction) * (sizeInfo.availableWidth - HANDLE_WIDTH)
        }
        return (1 - current_width_fraction) * sizeInfo.availableWidth
    }

    function width_has_changed() {
       return (leftWidth != old_left_width.current) || (rightWidth != old_right_width.current)
    }

    function notifySplitUpdate() {
        if (width_has_changed() && (props.handleSplitUpdate != null)) {
            old_left_width.current = leftWidth;
            old_right_width.current = rightWidth;
            props.handleSplitUpdate(leftWidth, rightWidth, current_width_fraction)
        }
    }

    function _handleDrag (e, ui, x, y, dx, dy){
        let new_width_fraction = (x - sizeInfo.topX) / sizeInfo.availableWidth;
        new_width_fraction = new_width_fraction > 1 ? 1 : new_width_fraction;
        new_width_fraction = new_width_fraction < 0 ? 0 : new_width_fraction;
        set_current_width_fraction(new_width_fraction);
        _resetScrolls();
     }

    function _getSelectorElements() {
        let result = {};
        if (props.scrollAdjustSelectors && top_ref && top_ref.current) {
            for (let selector of props.scrollAdjustSelectors) {
                // let els = $(top_ref.current).find(selector);
                let els = top_ref.current.querySelectorAll(selector);
                if (els.length > 0) {
                    result[selector] = els[0]
                }
            }
        }
        return result
    }

    function _resetScrolls() {
        let selector_element_dict = _getSelectorElements();
        for (let selector in selector_element_dict) {
            let el = selector_element_dict[selector];
            el.scrollLeft = scroll_bases.current[selector].left;
            el.scrollTop = scroll_bases.current[selector].top;
        }
    }

    function _handleDragStart(e, ui, x, y, dx, dy) {
        currentlyDragging.current = true;
        let selector_element_dict = _getSelectorElements();
        for (let selector in selector_element_dict) {
            let el = selector_element_dict[selector];
            scroll_bases.current[selector] = {left: el.scrollLeft, top: el.scrollTop}
        }
        if (props.handleResizeStart) {
            props.handleResizeStart(e, ui, x, y, dx, dy)
        }
    }

    function _handleDragEnd(e, ui, x, y, dx, dy) {
        currentlyDragging.current = false;
        let new_width_fraction = (x - sizeInfo.topX) / sizeInfo.availableWidth;
        new_width_fraction = new_width_fraction > 1 ? 1 : new_width_fraction;
        new_width_fraction = new_width_fraction < 0 ? 0 : new_width_fraction;
        if (props.handleResizeEnd) {
            props.handleResizeEnd(new_width_fraction);
        }
        _resetScrolls();
        updateDimensions()
    }

    let left_div_style = {
        width: leftWidth,
        height: leftHeight,
        flexDirection: "column",
        overflow: "hidden",
        paddingLeft: window.in_context ? 5 : 12
    };
    // noinspection JSSuspiciousNameCombination
    let right_div_style = {
        width: rightWidth,
        height: rightHeight,
        flexDirection: "column",
        marginLeft: 0
    };
    let cname = "";
    if (props.right_pane_overflow == "auto") {
        cname = "contingent-scroll"
    }
    else {
        right_div_style["overflowY"] = props.right_pane_overflow
    }

    let dstyle = props.hide_me ? {display: "none"} : {};

    let outer_hp_style;
    if (props.outer_style) {
        outer_hp_style = _.cloneDeep(props.outer_style)
    }
    else {
        outer_hp_style = {}
    }
    outer_hp_style["width"] = "100%";
    if (props.left_margin) {
        outer_hp_style["marginLeft"] = props.left_margin
    }

    return (
        <div id={unique_id.current} className="d-flex flex-row horizontal-panes" style={outer_hp_style} ref={top_ref}>
            <div ref={left_pane_ref} style={left_div_style} className="res-viewer-resizer">
                <SizeContext.Provider value={{
                    topX: sizeInfo.topX,  // Using leftBoundingRect here doesn't work consistently
                    topY: leftBoundingRect.top,
                    availableWidth: leftWidth,
                    availableHeight: leftHeight}}>
                    {props.left_pane}
                </SizeContext.Provider>
            </div>
            {props.show_handle &&
                <DragHandle position_dict={{}}
                            onDrag={_handleDrag}
                            dragStart={_handleDragStart}
                            dragEnd={_handleDragEnd}
                            direction="x"
                            size={props.dragIconSize}
                            useThinBar={true}
                            barHeight={leftHeight}

                />
            }
            <div ref={right_pane_ref} className={cname} style={right_div_style}>
                <SizeContext.Provider value={{
                    topX: sizeInfo.topX + leftWidth,
                    topY: rightBoundingRect.top,
                    availableWidth: rightWidth,
                    availableHeight: rightHeight}}>
                    {props.right_pane}
                </SizeContext.Provider>
            </div>
        </div>
    )
}

HorizontalPanes = memo(HorizontalPanes);

HorizontalPanes.propTypes = {
    fixed_height:PropTypes.bool,
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
    fixed_height: false,
    handleSplitUpdate: null,
    handleResizeStart: null,
    handleResizeEnd: null,
    scrollAdjustSelectors: null,
    initial_width_fraction: .5,
    hide_me: false,
    left_margin: null,
    right_pane_overflow: "visible",
    top_ref: null,
    bottom_margin: 0,
    right_margin: 0,
    show_handle: true,
    dragIconSize: 20
};

function VerticalPanes(props) {
    const top_ref = useRef(null);

    const top_pane_ref = useRef(null);
    const bottom_pane_ref = useRef(null);
    const scroll_bases = useRef({});

    const old_bottom_height = useRef(0);
    const old_top_height = useRef(0);
    const unique_id = useRef(guid());

    const [topWidth, setTopWidth] = useState(0);
    const [bottomWidth, setBottomWidth] = useState(0);
    const [topHeight, setTopHeight] = useState(0);
    const [bottomHeight, setBottomHeight] = useState(0);
    const [bottomBoundingRect, setBottomBoundingRect] = useState({x: 0, y: 0, width: 0, height: 0, left: 0, top: 0, bottom: 0});
    const [topBoundingRect, setTopBoundingRect] = useState({x: 0, y: 0, width: 0, height: 0, left: 0, top: 0, bottom: 0});

    const [current_height_fraction, set_current_height_fraction] = useState(props.initial_height_fraction);

    const sizeInfo = useContext(SizeContext);

    useEffect(() => {
        notifySplitUpdate();
    }, [current_height_fraction]);

    useEffect(() => {
        let top_width = sizeInfo.availableWidth;
        let bottom_width = top_width;

        if (bottom_pane_ref && bottom_pane_ref.current) {
            let bottom_rect = bottom_pane_ref.current.getBoundingClientRect();
            bottom_width = bottom_width - bottom_rect.left + sizeInfo.topX;
            setBottomBoundingRect(bottom_rect)
        }
        if (top_pane_ref.current) {
            let top_rect = top_pane_ref.current.getBoundingClientRect();
            top_width  = top_width - top_rect.left + sizeInfo.topX;
            setTopBoundingRect(top_rect)
        }

        setTopWidth(top_width);
        setBottomWidth(bottom_width);
        setTopHeight(top_height());
        setBottomHeight(bottom_height());

    }, [sizeInfo.availableWidth, sizeInfo.availableHeight, current_height_fraction]);

    function top_height() {
        return sizeInfo.availableHeight * current_height_fraction - 2.5
    }

    function bottom_height() {
        return (1 - current_height_fraction) * sizeInfo.availableHeight - 2.5
    }

    function notifySplitUpdate() {
        if (props.handleSplitUpdate != null && height_has_changed()) {
            old_top_height.current = top_height();
            old_bottom_height.current = bottom_height();
            props.handleSplitUpdate(topHeight, bottomHeight, current_height_fraction)
        }
    }

    function height_has_changed() {
       return (topHeight != old_top_height.current) || (bottomHeight != old_bottom_height.current)
    }

    function _handleDrag (e, ui, x, y, dx, dy){
        let new_height_fraction = (y - top_pane_ref.current.offsetTop) / sizeInfo.availableHeight;
        new_height_fraction = new_height_fraction > 1 ? 1 : new_height_fraction;
        new_height_fraction = new_height_fraction < 0 ? 0 : new_height_fraction;
        set_current_height_fraction(new_height_fraction)
     }

    function _getSelectorElements() {
        let result = {};
        if (props.scrollAdjustSelectors && top_ref && top_ref.current) {
            for (let selector of props.scrollAdjustSelectors) {
                // let els = $(top_ref.current).find(selector);
                let els = top_ref.current.querySelectorAll(selector);
                if (els.length > 0) {
                    result[selector] = els[0]
                }
            }
        }
        return result
    }

    function _resetScrolls() {
        let selector_element_dict = _getSelectorElements();
        for (let selector in selector_element_dict) {
            let el = selector_element_dict[selector];
            el.scrollLeft = scroll_bases.current[selector].left;
            el.scrollTop = scroll_bases.current[selector].top;
        }
    }

    function _handleDragStart(e, ui, x, y, dx, dy) {
        let selector_element_dict = _getSelectorElements();
        for (let selector in selector_element_dict) {
            let el = selector_element_dict[selector];
            scroll_bases.current[selector] = {left: el.scrollLeft, top: el.scrollTop}
        }
        if (props.handleResizeStart) {
            props.handleResizeStart(e, ui, x, y, dx, dy)
        }
    }

    function _handleDragEnd(e, ui, x, y, dx, dy) {
        let new_height_fraction = (y - top_pane_ref.current.offsetTop) / sizeInfo.availableHeight;
        new_height_fraction = new_height_fraction > 1 ? 1 : new_height_fraction;
        new_height_fraction = new_height_fraction < 0 ? 0 : new_height_fraction;
        if (props.handleResizeEnd) {
            props.handleResizeEnd(new_height_fraction);
        }
        _resetScrolls();
    }

    let top_div_style = {
        width: topWidth,
        height: topHeight,
        overflowY: props.overflow
    };
    if (props.hide_top) {
        top_div_style.display = "none";
    }
    let bottom_div_style = {
        width: bottomWidth,
        height: bottomHeight,
        overflowY: props.overflow,
        marginTop: 10
    };

    return (
        <div id={unique_id.current} className="d-flex flex-column" ref={top_ref}>
            <div ref={top_pane_ref} style={top_div_style}>
                <SizeContext.Provider value={{
                    topX: topBoundingRect.left,
                    topY: topBoundingRect.top,
                    availableWidth: topWidth,
                    availableHeight: topHeight
                }}>
                    {props.top_pane}
                </SizeContext.Provider>
            </div>
            {props.show_handle &&
                <DragHandle position_dict={{}}
                            onDrag={_handleDrag}
                            direction="y"
                            size={props.dragIconSize}
                            dragStart={_handleDragStart}
                            dragEnd={_handleDragEnd}
                            useThinBar={true}
                            barWidth={topWidth}
                />
            }
            <div ref={bottom_pane_ref} style={bottom_div_style}>
                <SizeContext.Provider value={{
                    topX: bottomBoundingRect.left,
                    topY: sizeInfo.topY + topHeight,
                    availableWidth: bottomWidth,
                    availableHeight: bottomHeight
                }}>
                    {props.bottom_pane}
                </SizeContext.Provider>
            </div>
        </div>
    )
}

VerticalPanes = memo(VerticalPanes);

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


