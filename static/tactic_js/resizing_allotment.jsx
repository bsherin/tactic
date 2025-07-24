import React, {useEffect, useMemo, useRef} from "react";
import {Allotment} from "allotment";
import "allotment/dist/style.css";

import {SizeContext} from "./sizing_tools";
import {useElementSize} from "./sizing_tools"; // your custom hook

export function HorizontalPanes({
                                    left_pane,
                                    right_pane,
                                    initial_width_fraction = 0.5,
                                    handleSplitUpdate = null,
                                    handleResizeStart = null,
                                    handleResizeEnd = null,
                                    show_handle = true,
                                    left_margin = null,
                                    outer_style = {},
                                    separatorPadding = 0,
                                    hide_me = false,
                                }) {
    const leftRef = useRef(null);
    const rightRef = useRef(null);

    const [leftWidth, leftHeight, leftTopY, leftTopX] = useElementSize(leftRef);
    const [rightWidth, rightHeight, rightTopY, rightTopX] = useElementSize(rightRef);

    const outerStyle = {
        ...outer_style,
        width: "100%",
        height: "100%",

        display: hide_me ? "none" : "flex",
        flexDirection: "column",
        marginLeft: left_margin || undefined,
    };

    // Called on pane resize
    const handleChange = (sizes) => {
        const left = sizes[0];
        const right = sizes[1];
        const total = left + right;
        const frac = total > 0 ? left / total : 0.5;

        if (handleSplitUpdate) handleSplitUpdate(left, right, frac);
        if (handleResizeEnd) handleResizeEnd(frac);
    };

    // Set up initial fraction
    const preferredSizes = useMemo(() => {
        const left = initial_width_fraction * 100;
        const right = 100 - left;
        return [left, right];
    }, [initial_width_fraction]);

    return (
        <div style={outerStyle}>
            <Allotment
                defaultSizes={preferredSizes}
                onChange={handleChange}
                onDragStart={handleResizeStart}
                onDragEnd={() => {
                    if (handleResizeEnd) {
                        const left = leftRef.current?.offsetWidth || 0;
                        const right = rightRef.current?.offsetWidth || 0;
                        const frac = (left + right) > 0 ? left / (left + right) : 0.5;
                        handleResizeEnd(frac);
                    }
                }}
            >
                <Allotment.Pane>
                    <div ref={leftRef}
                         style={{height: "100%", width: "100%", paddingRight: separatorPadding / 2,
                             overflow: "hidden"}}>
                        <SizeContext.Provider
                            value={{
                                topX: leftTopX,
                                topY: leftTopY,
                                availableWidth: leftWidth,
                                availableHeight: leftHeight,
                            }}
                        >
                            {left_pane}
                        </SizeContext.Provider>
                    </div>
                </Allotment.Pane>

                <Allotment.Pane>
                    <div ref={rightRef} style={{height: "100%", width: "100%",
                        paddingLeft: separatorPadding / 2,
                        overflow: "hidden"}}>
                        <SizeContext.Provider
                            value={{
                                topX: rightTopX,
                                topY: rightTopY,
                                availableWidth: rightWidth,
                                availableHeight: rightHeight,
                            }}
                        >
                            {right_pane}
                        </SizeContext.Provider>
                    </div>
                </Allotment.Pane>
            </Allotment>
        </div>
    );
}

export function VerticalPanes({
                                  top_pane,
                                  bottom_pane,
                                  initial_height_fraction = 0.5,
                                  adjust_bottom_height = 0, // optional correction (e.g., fixed footer)
                                  handleSplitUpdate = null,
                                  handleResizeStart = null,
                                  handleResizeEnd = null,
    separatorPadding = 0,
                                  show_handle = true,
                                  outer_style = {},
                                  hide_top = false,
                              }) {
    const topRef = useRef(null);
    const bottomRef = useRef(null);

    const [topWidth, topHeight, topTopY, topTopX] = useElementSize(topRef);
    const [bottomWidth, bottomHeight, bottomTopY, bottomTopX] = useElementSize(bottomRef);

    const defaultSizes = useMemo(() => {
        const top = initial_height_fraction * 100;
        const bottom = 100 - top;
        return [top, bottom];
    }, [initial_height_fraction]);

    const wrapperStyle = {
        ...outer_style,
        width: "100%",
        height: "100%",
        display: hide_top ? "none" : undefined,
    };

    const handleChange = (sizes) => {
        const top = sizes[0];
        const bottom = sizes[1];
        const total = top + bottom;
        const frac = total > 0 ? top / total : 0.5;

        if (handleSplitUpdate) handleSplitUpdate(top, bottom, frac);
        if (handleResizeEnd) handleResizeEnd(frac);
    };

    return (
        <div style={wrapperStyle}>
            <Allotment vertical defaultSizes={defaultSizes} onChange={handleChange} onDragStart={handleResizeStart}>
                <Allotment.Pane>
                    <div ref={topRef}
                         style={{width: "100%", height: "100%", paddingBottom: separatorPadding / 2}}>
                        <SizeContext.Provider
                            value={{
                                topX: topTopX,
                                topY: topTopY,
                                availableWidth: topWidth,
                                availableHeight: topHeight,
                            }}
                        >
                            {top_pane}
                        </SizeContext.Provider>
                    </div>
                </Allotment.Pane>

                <Allotment.Pane>
                    <div ref={bottomRef} style={{width: "100%", height: "100%", paddingTop: separatorPadding / 2}}>
                        <SizeContext.Provider
                            value={{
                                topX: bottomTopX,
                                topY: bottomTopY,
                                availableWidth: bottomWidth,
                                availableHeight: Math.max(bottomHeight - adjust_bottom_height, 0),
                            }}
                        >
                            {bottom_pane}
                        </SizeContext.Provider>
                    </div>
                </Allotment.Pane>
            </Allotment>
        </div>
    );
}