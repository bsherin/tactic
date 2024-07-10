
import React from "react";
// import _ from 'lodash';
import {useMemo} from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export {SortableComponent}

function SortableComponent(props) {
    const WrappedComponent = props.ElementComponent;
    const DraggableComponent = useMemo(()=>{ return (
        getDraggableComponent(props, WrappedComponent)
        )
    }, []);

    return (
      <DragDropContext onDragEnd={props.onDragEnd}
                       onBeforeCapture={props.onBeforeCapture}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div className={props.className} style={props.style} ref={provided.innerRef} {...provided.droppableProps}>
              {props.item_list.map((entry, index) => (
                  <DraggableComponent key={entry[props.key_field_name]}
                                      index={index}
                                      entry={entry}
                                      extraProps={props.extraProps}
                  />
              ))}
                {provided.placeholder}
            </div>
          )}
        </Droppable>
  </DragDropContext>
    )
}
SortableComponent = React.memo(SortableComponent);

// The purpose of the manuever below is to create a new component that is memorized
// And includes the outer <Draggable> component
// This helped with preventing extra renders of the Draggable component
function getDraggableComponent(initProps, WrappedComponent) {
    return React.memo((props) => {
        return (
          <Draggable
              key={props.entry[initProps.key_field_name]}
              index={props.index}
              draggableId={props.entry[initProps.key_field_name]}>
              {(provided, snapshot) => (
                  <div ref={provided.innerRef}
                       {...provided.draggableProps}>
                      <WrappedComponent key={props.entry[initProps.key_field_name]}
                                        index={props.index}
                                        dragHandleProps={provided.dragHandleProps}
                                        {...props.entry}
                                        {...props.extraProps}
                      />

                  </div>
              )
              }
          </Draggable>
        )
    });
}