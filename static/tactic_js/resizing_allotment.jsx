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
                                    hide_me = false,
                                }) {
    const leftRef = useRef(null);
    const rightRef = useRef(null);

    const [leftWidth, leftHeight] = useElementSize(leftRef);
    const [rightWidth, rightHeight] = useElementSize(rightRef);

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
                    <div ref={leftRef} style={{height: "100%", width: "100%", overflow: "hidden"}}>
                        <SizeContext.Provider
                            value={{
                                topX: 0,
                                topY: 0,
                                availableWidth: leftWidth,
                                availableHeight: leftHeight,
                            }}
                        >
                            {left_pane}
                        </SizeContext.Provider>
                    </div>
                </Allotment.Pane>

                <Allotment.Pane>
                    <div ref={rightRef} style={{height: "100%", width: "100%", overflow: "hidden"}}>
                        <SizeContext.Provider
                            value={{
                                topX: leftWidth,
                                topY: 0,
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