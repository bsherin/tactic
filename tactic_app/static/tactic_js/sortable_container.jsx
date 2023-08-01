
import React from "react";
import _ from 'lodash';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export {SortableComponent}

function SortableComponent(props) {
    let WrappedComponent = props.ElementComponent;
    var lprops = _.clone(props);
    delete lprops.item_list;

    return (
      <DragDropContext onDragEnd={props.onDragEnd} onBeforeCapture={props.onBeforeCapture}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div id={props.id} style={props.style} ref={provided.innerRef} {...provided.droppableProps}>
              {props.item_list.map((entry, index) => (
                  <Draggable
                      key={entry[props.key_field_name]}
                      index={index}
                      draggableId={entry[props.key_field_name]}>
                      {(provided, snapshot) => (
                          <div ref={provided.innerRef}
                               {...provided.draggableProps}>
                              <WrappedComponent key={entry[props.key_field_name]}
                                                index={index}
                                                dragHandleProps={provided.dragHandleProps}
                                                {...lprops}
                                                {...entry}/>

                          </div>
                      )
                      }
                  </Draggable>
              ))}
                {provided.placeholder}
            </div>
          )}
        </Droppable>
  </DragDropContext>
    )
}

