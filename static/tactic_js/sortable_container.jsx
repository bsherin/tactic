import React, {useMemo, useCallback} from "react";
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

const SortableComponent = React.memo(function SortableComponent(props) {
  const WrappedComponent = props.ElementComponent;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const ids = useMemo(
    () => props.item_list.map(e => e[props.key_field_name]),
    [props.item_list, props.key_field_name]
  );

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = props.item_list.findIndex(
      (item) => item[props.key_field_name] === active.id
    );
    const newIndex = props.item_list.findIndex(
      (item) => item[props.key_field_name] === over.id
    );
    props.onDragEnd(oldIndex, newIndex);
  }, [props.item_list, props.key_field_name, props.onDragEnd]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={rectSortingStrategy}>
        <div className={props.className} style={props.style}>
          {props.item_list.map((entry, index) => {
            const id = entry[props.key_field_name];
            return (
              <DraggableItem
                key={id}
                id={id}
                index={index}
                entry={entry}
                WrappedComponent={WrappedComponent}
                extraProps={props.extraProps}
              />
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
});

function useStableListeners(listeners) {
  const ref = React.useRef(listeners);
  React.useEffect(() => { ref.current = listeners; }, [listeners]);

  return React.useMemo(() => {
    if (!listeners) return listeners;
    const wrapped = {};
    for (const key of Object.keys(listeners)) {
      wrapped[key] = (...args) => ref.current?.[key]?.(...args);
    }
    return wrapped;
  }, []);
}

const DraggableItem = React.memo(function DraggableItem({
  id, index, entry, WrappedComponent, extraProps
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const stableListeners = useStableListeners(listeners); // or remove if you move handle into wrapper

  const style = {
    zIndex: isDragging ? 9999 : "auto",
    opacity: isDragging ? 0.8 : 1,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <WrappedComponent
        index={index}
        dragHandleProps={stableListeners}
        {...entry}
        {...extraProps}
      />
    </div>
  );
});