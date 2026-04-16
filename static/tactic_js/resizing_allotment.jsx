import React, { useMemo, useRef, useState } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { Button, Icon } from "@blueprintjs/core";

const HANDLE_SIZE = 6;

export function HorizontalPanes({
    left_pane,
    right_pane,
    snap_left = false,
    widths = null,
    minWidth = 30,
    initial_width_fraction = 0.5,
    handleSplitUpdate = null,
    handleResizeEnd = null,
    left_margin = null,
    outer_style = {},
    className = "",
    hide_me = false,
}) {
    const leftPanelRef = useRef(null);
    const leftElementRef = useRef(null);

    const savedFractionRef = useRef(null);
    const suppressRef = useRef(false);

    const [snapped, setSnapped] = useState(false);
    const [hover, setHover] = useState(false);

    const outerStyle = {
        ...outer_style,
        width: "100%",
        height: "100%",
        minHeight: 0,
        minWidgth: 0,
        overflow: "hidden",
        display: hide_me ? "none" : "flex",
        flexDirection: "column",
        marginLeft: left_margin || undefined,
    };

    const defaultLayout = useMemo(() => {
        if (widths && widths.length === 2) {
            return {
                left: widths[0],
                right: widths[1],
            };
        }

        const left = initial_width_fraction * 100;
        return {
            left,
            right: 100 - left,
        };
    }, [initial_width_fraction, widths]);

    function handleLayoutChange(layout) {
        const left = layout["horizontal-left"];
        const right = layout["horizontal-right"];
        if (left == null || right == null) return;

        const total = left + right;
        const frac = total > 0 ? left / total : 0.5;

        handleSplitUpdate?.(left, right, frac);
    }

    function handleLayoutChanged(layout) {
        const left = layout["horizontal-left"];
        const right = layout["horizontal-right"];
        if (left == null || right == null) return;

        const total = left + right;
        const frac = total > 0 ? left / total : 0.5;

        if (snap_left && !suppressRef.current) {
            const leftPixels = leftElementRef.current?.offsetWidth || 0;

            if (left > 0) {
                savedFractionRef.current = frac;
            }

            if (leftPixels > 0 && leftPixels < minWidth) {
                suppressRef.current = true;
                leftPanelRef.current?.collapse?.();
                setSnapped(true);

                queueMicrotask(() => {
                    suppressRef.current = false;
                });

                handleResizeEnd?.(0);
                return;
            }

            setSnapped(left === 0);
        }

        handleResizeEnd?.(frac);
    }

    function snap() {
        if (!snap_left) return;

        const currentSize = leftPanelRef.current?.getSize?.();
        if (typeof currentSize === "number" && currentSize > 0) {
            savedFractionRef.current = currentSize / 100;
        }

        suppressRef.current = true;
        leftPanelRef.current?.collapse?.();
        setSnapped(true);

        queueMicrotask(() => {
            suppressRef.current = false;
        });
    }

    function unSnap() {
        if (!snap_left) return;

        const savedFraction =
            savedFractionRef.current != null && savedFractionRef.current > 0
                ? savedFractionRef.current
                : defaultLayout.left / 100;

        suppressRef.current = true;
        leftPanelRef.current?.expand?.();
        leftPanelRef.current?.resize?.(`${savedFraction * 100}%`);
        setSnapped(false);

        queueMicrotask(() => {
            suppressRef.current = false;
        });
    }

    return (
        <div style={outerStyle} className={className}>
            <Group
                orientation="horizontal"
                onLayoutChange={handleLayoutChange}
                onLayoutChanged={handleLayoutChanged}
                style={{ width: "100%", height: "100%", minHeight: 0, minWidth: 0, overflow: "hidden" }}
                resizeTargetMinimumSize={HANDLE_SIZE}
            >
                <Panel
                    id="horizontal-left"
                    order={1}
                    defaultSize={`${defaultLayout.left}%`}
                    minSize={snap_left ? "10px" : `${minWidth}px`}
                    collapsible={snap_left}
                    collapsedSize="0%"
                    panelRef={leftPanelRef}
                    elementRef={leftElementRef}
                >
                    <div
                        className="horizontal-left-pane"
                        style={{
                            height: "100%",
                            width: "100%",
                            minHeight: 0,
                            minWidth: 0,
                            overflow: "hidden",
                            position: "relative",
                        }}
                    >
                        {left_pane}
                        {snap_left && !snapped && <SnapButton snap={snap} />}
                    </div>
                </Panel>

                <Separator disableDoubleClick style={horizontalSeparatorStyle}
                           onMouseEnter={() => setHover(true)}
    o                      onMouseLeave={() => setHover(false)}
                >
                    <div
                        style={{
                            ...horizontalSeparatorLineStyle,
                            width: hover ? 5: 1
                        }}
                        className="draggable-pane-separator"/>
                </Separator>

                <Panel
                    id="horizontal-right"
                    order={2}
                    defaultSize={`${defaultLayout.right}%`}
                    minSize="0px"
                >
                    <div
                        className="horizontal-right-pane"
                        style={{
                            height: "100%",
                            width: "100%",
                            minHeight: 0,
                            minWidth: 0,
                            position: "relative",
                            display: "flex",
                            overflow: "hidden",
                            flexDirection: "column",
                        }}
                    >
                        {snap_left && snapped && <UnsnapButton unSnap={unSnap} />}
                        {right_pane}
                    </div>
                </Panel>
            </Group>
        </div>
    );
}

export function VerticalPanes({
    top_pane,
    bottom_pane,
    initial_height_fraction = 0.5,
    handleSplitUpdate = null,
    handleResizeEnd = null,
    className = "",
    outer_style = {},
    hide_top = false,
}) {
    const [hover, setHover] = useState(false);
    const defaultLayout = useMemo(() => {
        const top = initial_height_fraction * 100;
        return {
            top,
            bottom: 100 - top,
        };
    }, [initial_height_fraction]);

    const wrapperStyle = {
        ...outer_style,
        width: "100%",
        height: "100%",
        display: hide_top ? "none" : undefined,
    };

    function handleLayoutChange(layout) {
        const top = layout["vertical-top"];
        const bottom = layout["vertical-bottom"];
        if (top == null || bottom == null) return;

        const total = top + bottom;
        const frac = total > 0 ? top / total : 0.5;

        handleSplitUpdate?.(top, bottom, frac);
    }

    function handleLayoutChanged(layout) {
        const top = layout["vertical-top"];
        const bottom = layout["vertical-bottom"];
        if (top == null || bottom == null) return;

        const total = top + bottom;
        const frac = total > 0 ? top / total : 0.5;

        handleResizeEnd?.(frac);
    }

    return (
        <div style={wrapperStyle} className={className}>
            <Group
                orientation="vertical"
                onLayoutChange={handleLayoutChange}
                onLayoutChanged={handleLayoutChanged}
                style={{ width: "100%", height: "100%" }}
                resizeTargetMinimumSize={HANDLE_SIZE}
            >
                <Panel
                    id="vertical-top"
                    order={1}
                    defaultSize={`${defaultLayout.top}%`}
                >
                    <div
                        className="vertical-top-pane"
                        style={{ width: "100%", height: "100%" }}
                    >
                        {top_pane}
                    </div>
                </Panel>

                <Separator disableDoubleClick
                           style={verticalSeparatorStyle}
                           onMouseEnter={() => setHover(true)}
                           onMouseLeave={() => setHover(false)}
                >
                    <div
                        style={{
                            ...verticalSeparatorLineStyle,
                            height: hover ? 5: 1
                        }}
                         className="draggable-pane-separator"/>
                </Separator>

                <Panel
                    id="vertical-bottom"
                    order={2}
                    defaultSize={`${defaultLayout.bottom}%`}
                >
                    <div
                        className="vertical-bottom-pane"
                        style={{ width: "100%", height: "100%" }}
                    >
                        {bottom_pane}
                    </div>
                </Panel>
            </Group>
        </div>
    );
}

function UnsnapButton(props) {
    props = {
        unSnap: null,
        ...props,
    };

    return (
        <Button
            icon={<Icon icon="chevron-right" size={25} />}
            style={{
                paddingLeft: 0,
                paddingRight: 0,
                position: "absolute",
                top: "50%",
                left: -3,
                zIndex: 1,
                opacity: 0.5,
            }}
            variant="minimal"
            size="small"
            tabIndex={-1}
            onClick={props.unSnap}
        />
    );
}

function SnapButton(props) {
    props = {
        snap: null,
        ...props,
    };

    return (
        <Button
            icon={<Icon icon="chevron-left" size={25} />}
            style={{
                paddingLeft: 0,
                paddingRight: 0,
                position: "absolute",
                top: "50%",
                right: 0,
                zIndex: 1,
                opacity: 0.5,
            }}
            variant="minimal"
            size="small"
            tabIndex={-1}
            onClick={props.snap}
        />
    );
}

const horizontalSeparatorStyle = {
    width: HANDLE_SIZE,
    position: "relative",
    flexShrink: 0,
    background: "transparent",
};

const horizontalSeparatorLineStyle = {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
};

const verticalSeparatorStyle = {
    height: HANDLE_SIZE,
    position: "relative",
    flexShrink: 0,
    width: "100%",
    background: "transparent",
};

const verticalSeparatorLineStyle = {
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    height: 1,
    width: "100%",
    transform: "translateY(-50%)",
};