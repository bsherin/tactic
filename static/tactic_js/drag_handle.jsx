import React from "react";
import {useDraggable, DndContext} from '@dnd-kit/core';
import {Icon} from "@blueprintjs/core";
import {useRef} from "react";

export {DragHandle}

function DragHandle(props) {
    props = {
        direction: "x",
        onDrag: null,
        dragStart: null,
        dragEnd: null,
        useThinBar: false,
        barHeight: null,
        barWidth: null,
        position_dict: {},
        ...props
    }
    const startX = useRef(null);
    const startY = useRef(null);
    const lastX = useRef(null);
    const lastY = useRef(null);


    const cursor_dict = {
        x: "ew-resize",
        y: "ns-resize",
        both: "se-resize"
    };

    const style = {
        ...props.position_dict,
        cursor: cursor_dict[props.direction],
    };
    if (props.direction === "both") {
        style.transform = "rotate(45deg)";
    }
    if (props.useThinBar) {
        if (props.barHeight != null) style.height = props.barHeight;
        if (props.barWidth != null) style.width = props.barWidth;
    }

    function handleDragStart(event) {
        const e = event.activatorEvent;
        startX.current = getMouseX(e);
        startY.current = getMouseY(e);
        lastX.current = startX.current;
        lastY.current = startY.current;
        if (props.dragStart) {
            props.dragStart(e, null, startX.current, startY.current);
        }
    }

    function handleDragMove(event) {
        const dx = event.delta.x;
        const dy = event.delta.y;
        lastX.current = startX.current + dx;
        lastY.current = startY.current + dy;

        if (props.onDrag) {
            props.onDrag(event, null, lastX.current, lastY.current, dx, dy);
        }
    }

    function handleDragEnd(event) {
        const e = event.activatorEvent;
        const dx = event.delta.x;
        const dy = event.delta.y;
        lastX.current = startX.current + dx;
        lastY.current = startY.current + dy;

        if (props.dragEnd) {
            props.dragEnd(e, null, lastX.current, lastY.current, dx, dy);
        }
    }

    function getMouseX(e) {
        if (!e) return null;
        if (e.type === "touchend") return null;
        if (e.touches && e.touches.length > 0) {
            return e.touches[0].clientX;
        }
        return e.clientX;
    }

    function getMouseY(e) {
        if (!e) return null;
        if (e.type === "touchend") return null;
        if (e.touches && e.touches.length > 0) {
            return e.touches[0].clientY;
        }
        return e.clientY;
    }

    return (
        <DndContext
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}>
            <DragHandleBody {...props} style={style}/>
        </DndContext>
    )

}

function DragHandleBody(props) {

    const icon_dict = {
        x: "drag-handle-vertical",
        y: "drag-handle-horizontal",
        both: "caret-right"
    };
    const {attributes, listeners, setNodeRef, } = useDraggable({id: 'drag-handle-id'});
    return props.useThinBar ? (
        <div ref={setNodeRef} {...listeners} {...attributes}
             className={props.direction === "x" ? "resize-border" : "horizontal-resize-border"}
             style={props.style}
        />
    ) : (
        <div ref={setNodeRef} {...listeners} {...attributes} className="drag-handle">
            <Icon icon={icon_dict[props.direction]} size={props.iconSize} style={props.style}/>
        </div>
    );
}