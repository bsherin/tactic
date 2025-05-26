import React, {useMemo} from "react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

export {SortableComponent};

function SortableComponent(props) {
    const WrappedComponent = props.ElementComponent;

    const DraggableComponent = useMemo(() => {
        return getDraggableComponent(props, WrappedComponent);
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {distance: 5},
        })
    );

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => {
                const {active, over} = event;
                if (active.id !== over?.id) {
                    const oldIndex = props.item_list.findIndex(
                        (item) => item[props.key_field_name] === active.id
                    );
                    const newIndex = props.item_list.findIndex(
                        (item) => item[props.key_field_name] === over.id
                    );
                    props.onDragEnd(oldIndex, newIndex);
                }
            }}
        >
            <SortableContext
                items={props.item_list.map((entry) => entry[props.key_field_name])}
                strategy={rectSortingStrategy}
            >
                <div className={props.className} style={props.style}>
                    {props.item_list.map((entry, index) => (
                        <DraggableComponent
                            key={entry[props.key_field_name]}
                            index={index}
                            entry={entry}
                            extraProps={props.extraProps}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}

SortableComponent = React.memo(SortableComponent);

// Helper to create a wrapped, sortable component
function getDraggableComponent(initProps, WrappedComponent) {
    return React.memo((props) => {
        const id = props.entry[initProps.key_field_name];
        const {attributes, listeners, setNodeRef, transform, transition, isDragging} =
            useSortable({id});

        const style = {
            zIndex: isDragging ? 9999 : "auto", // ✅ High enough to stay on top
            opacity: isDragging ? 0.8 : 1,
            transform: CSS.Translate.toString(transform),
            transition,
        };

        return (
            <div ref={setNodeRef} style={style} {...attributes} >
                <WrappedComponent
                    key={id}
                    index={props.index}
                    dragHandleProps={listeners}
                    {...props.entry}
                    {...props.extraProps}
                />
            </div>
        );
    });
}