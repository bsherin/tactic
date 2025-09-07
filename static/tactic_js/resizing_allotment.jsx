import React, {useMemo, useRef, useState} from "react";
import {Allotment, setSashSize} from "allotment";
import "allotment/dist/style.css";
import {Button, Icon} from "@blueprintjs/core";

setSashSize(12);


export function HorizontalPanes({
                                    left_pane,
                                    right_pane,
                                    snap_left = false,
                                    widths = null,
                                    minWidth = 30,
                                    initial_width_fraction = 0.5,
                                    handleSplitUpdate = null,
                                    handleResizeStart = null,
                                    handleResizeEnd = null,
                                    left_margin = null,
                                    outer_style = {},
                                    className="",
                                    hide_me = false,
                                }) {
    const leftRef = useRef(null);
    const rightRef = useRef(null);
    const mainRef = useRef(null);
    const savedFraction = useRef(null);


    const [snapped, setSnapped] = useState(false);

    const outerStyle = {
        ...outer_style,
        width: "100%",
        height: "100%",

        display: hide_me ? "none" : "flex",
        flexDirection: "column",
        marginLeft: left_margin || undefined,
    };

    const handleChange = (sizes) => {
        let left = sizes[0];
        let right = sizes[1];
        let frac;
        const total = left + right;
        frac = total > 0 ? left / total : 0.5;
        if (handleSplitUpdate) handleSplitUpdate(left, right, frac);
    };

    const defaultSizes = useMemo(() => {
        let left;
        let right;
        if (widths) {
            left = widths[0];
            right = widths[1];
        } else {
            left = initial_width_fraction * 100;
            right = 100 - left;
        }

        return [left, right];
    }, [initial_width_fraction, widths]);

    function unSnap() {
        setSnapped(false);
    }

    function snap() {
        setSnapped(true);
    }

    function onDragStart() {
        if (snap_left) {
            let left = leftRef.current?.offsetWidth || 0;
            if (left < minWidth) {
                left = minWidth
            }

            let right = rightRef.current?.offsetWidth || 0;
            savedFraction.current = (left + right) > 0 ? left / (left + right) : 0.5;
        }
        if (handleResizeStart) {
            handleResizeStart()
        }
    }

    function onDragEnd() {
        let left = leftRef.current?.offsetWidth || 0;
        let right = rightRef.current?.offsetWidth || 0;
        let frac = (left + right) > 0 ? left / (left + right) : 0.5;
        if (snap_left) {
            if (left < minWidth) {
                setSnapped(true);
                if (savedFraction.current && savedFraction.current > 0) {
                    const left = savedFraction.current * 100;
                    const right = 100 - left;
                    mainRef.current.resize([left, right]);
                } else {
                    mainRef.current.resize(defaultSizes);
                }
            }
        }
        if (handleResizeEnd) {
            handleResizeEnd(frac);
        }
    }

    return (
        <div style={outerStyle} className={className}>
            <Allotment
                ref={mainRef}
                defaultSizes={defaultSizes}
                onChange={handleChange}
                onDragStart={onDragStart}
                minSize={snap_left ? 10 : minWidth}
                onDragEnd={onDragEnd}>

                <Allotment.Pane visible={!snapped}>
                    <div ref={leftRef}
                         className="horizontal-left-pane"
                         style={{
                             height: "100%", width: "100%",
                             overflow: "hidden", position: "relative"
                         }}>
                        {left_pane}
                        {snap_left && !snapped && <SnapButton snap={snap}/>}
                    </div>
                </Allotment.Pane>

                <Allotment.Pane>
                    <div ref={rightRef}
                         className="horizontal-right-pane"
                         style={{
                            height: "100%", width: "100%",
                            overflow: "hidden",
                            position: "relative",
                             display: "flex",
                             flexDirection: "column"
                        }}>
                        {snap_left && snapped && <UnsnapButton unSnap={unSnap}/>}
                        {right_pane}
                    </div>
                </Allotment.Pane>
            </Allotment>
        </div>
    );
}

function UnsnapButton(props) {
    props = {
        unSnap: null,
        ...props
    };
    return (
        <Button icon={<Icon icon="chevron-right" size={25}/>}
                style={{
                    paddingLeft: 0, paddingRight: 0,
                    position: "absolute", top: "50%",
                    left: -3,
                    zIndex: 1,
                    opacity: 0.5
                }}
                variant="minimal"
                size="small"
                tabIndex={-1}
                onClick={props.unSnap}/>
    )
}

function SnapButton(props) {
    props = {
        snap: null,
        ...props
    };
    return (
        <Button icon={<Icon icon="chevron-left" size={25}/>}
                style={{
                    paddingLeft: 0, paddingRight: 0,
                    position: "absolute", top: "50%",
                    right: 0,
                    zIndex: 1,
                    opacity: 0.5
                }}
                variant="minimal"
                size="small"
                tabIndex={-1}
                onClick={props.snap}/>
    )
}

export function VerticalPanes({
                                  top_pane,
                                  bottom_pane,
                                  initial_height_fraction = 0.5,
                                  handleSplitUpdate = null,
                                  handleResizeStart = null,
                                  handleResizeEnd = null,
                                  className = "",
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
        <div style={wrapperStyle} className={className}>
            <Allotment vertical defaultSizes={defaultSizes} onChange={handleChange} onDragStart={handleResizeStart}>
                <Allotment.Pane>
                    <div ref={topRef}
                         className="vertical-top-pane"
                         style={{width: "100%", height: "100%"}}>
                        {top_pane}
                    </div>
                </Allotment.Pane>

                <Allotment.Pane>
                    <div ref={bottomRef}
                         className="vertical-bottom-pane"
                         style={{width: "100%", height: "100%"}}>
                        {bottom_pane}
                    </div>
                </Allotment.Pane>
            </Allotment>
        </div>
    );
}