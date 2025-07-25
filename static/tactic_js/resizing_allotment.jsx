import React, {useMemo, useRef} from "react";
import {Allotment} from "allotment";
import "allotment/dist/style.css";

export function HorizontalPanes({
                                    left_pane,
                                    right_pane,
                                    initial_width_fraction = 0.5,
                                    handleSplitUpdate = null,
                                    handleResizeStart = null,
                                    handleResizeEnd = null,
                                    left_margin = null,
                                    outer_style = {},
                                    separatorPadding = 0,
                                    hide_me = false,
                                }) {
    const leftRef = useRef(null);
    const rightRef = useRef(null);

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
                }}>
                <Allotment.Pane>
                    <div ref={leftRef}
                         style={{height: "100%", width: "100%", paddingRight: separatorPadding / 2,
                             overflow: "hidden"}}>
                            {left_pane}
                    </div>
                </Allotment.Pane>

                <Allotment.Pane>
                    <div ref={rightRef} style={{height: "100%", width: "100%",
                        paddingLeft: separatorPadding / 2,
                        overflow: "hidden"}}>
                            {right_pane}
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
                                  handleSplitUpdate = null,
                                  handleResizeStart = null,
                                  handleResizeEnd = null,
                                  separatorPadding = 0,
                                  outer_style = {},
                                  hide_top = false,
                              }) {
    const topRef = useRef(null);
    const bottomRef = useRef(null);

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
                            {top_pane}
                    </div>
                </Allotment.Pane>

                <Allotment.Pane>
                    <div ref={bottomRef} style={{width: "100%", height: "100%", paddingTop: separatorPadding / 2}}>
                            {bottom_pane}
                    </div>
                </Allotment.Pane>
            </Allotment>
        </div>
    );
}