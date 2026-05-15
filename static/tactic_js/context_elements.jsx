import React from "react";
import {Fragment, useContext} from "react";
import {withUndo} from "./undo";

import {
    DndContext,
    useSensor,
    useSensors,
    PointerSensor,
    rectIntersection
} from '@dnd-kit/core';

import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {SelectedPaneContext} from "./utilities_react";
import {Button, Divider} from "@blueprintjs/core";

import {icon_dict} from "./combined_metadata";
import {CSS} from "@dnd-kit/utilities";

const iconDict = {
    "library": icon_dict["all"],
    "pool": icon_dict["pool"],
    "module-viewer": "application",
    "code-viewer": "code",
    "list-viewer": "list",
    "text-viewer": "list",
    "creator-viewer": "application",
    "main-viewer": "projects",
    "notebook-viewer": "projects"
};


export {ContextPaneElement, ContextNavigator}

function ContextPaneElement(props) {
    props = {
        identifier: null,
        children: null,
        ...props
    };

    const selectedPane = useContext(SelectedPaneContext);

    function am_selected() {
        return selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef)
    }

    return (
        <div style={{
            width: "100%",
            opacity: am_selected() ? 1 : 0,
            height: am_selected() ? "100%" : 0,
            position: "relative",
            display: "flex",
            minHeight: 0, minWidth: 0,
            flexDirection: "column",
        }}>
            {props.children}
        </div>
    )
}

ContextPaneElement = withUndo(ContextPaneElement);

function ContextNavigator(props) {
    props = {
        handleTabSelect: () => {},
        closeTab: () => {},
        refreshTab: () => {},
        tabPanelList: null,
        selectedItem: null,
        paneClosed: false,
        ...props
    };

    const [activeId, setActiveId] = React.useState(null);

    const sensors = useSensors(useSensor(PointerSensor, {activationConstraint: {distance: 5}}));

    const handleDragEnd = (event) => {
        const {active, over} = event;
        if (!over || active.id === over.id) return;

        const oldIndex = props.tabPanelList.findIndex((i) => i.identifier === active.id);
        const newIndex = over.id === '__drop_spacer__'
            ? props.tabPanelList.length
            : props.tabPanelList.findIndex(i => i.identifier === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            setActiveId(active.id);
            props.dispatch({
                type: "move_item",
                oldIndex,
                newIndex
            });
        }
        props.pushCallback(() => {
            setActiveId(null);
        })
    };
    return (
        <div className="context-navigator">
            <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragEnd={handleDragEnd}>
                <SortableContext items={[...props.tabPanelList.map(i => i.identifier), '__drop_spacer__']}
                                 strategy={verticalListSortingStrategy}>
                    {props.tabPanelList.map((entry) => (
                        entry.identifier == "library" || entry.identifier == "pool" ?
                            <Fragment key={entry.identifier}>
                                <div className="context-item-holder">
                                    <ContextNavigatorItem identifier={entry.identifier} key={entry.identifier}
                                                          selectedItem={props.selectedItem}
                                                          icon={iconDict[entry.identifier]}
                                                          handleTabSelect={props.handleTabSelect}
                                                          title={entry.title}/>

                                </div>
                                {window.has_pool && entry.identifier == "pool" &&
                                    <Divider className="context-tab-button-content-divider"/>
                                }
                                {!window.has_pool && entry.identifier == "library" &&
                                    <Divider className="context-tab-button-content-divider"/>
                                }
                            </Fragment> :
                            <SortableContextNavigatorItem key={entry.identifier}
                                                          identifier={entry.identifier}
                                                          selectedItem={props.selectedItem}
                                                          icon={iconDict[entry.kind]}
                                                          handleTabSelect={props.handleTabSelect}
                                                          closeTab={props.closeTab}
                                                          refreshTab={props.refreshTab}
                                                          title={entry.title}
                                                          activeId={activeId}
                            />
                    ))}
                    <SortableContextNavigatorItem
                        key="__drop_spacer__"
                        identifier="__drop_spacer__"
                        activeId={activeId}
                        isSpacer={true}
                    />
                </SortableContext>
            </DndContext>
        </div>
    )
}

function SortableContextNavigatorItem(props) {
    props = {
        identifier: null,
        activeId: null,
        icon: null,
        title: null,
        isSpacer: false,
        selectedItem: null,
        closeTab: () => {
        },
        refreshTab: () => {
        },
        handleTabSelect: () => {
        },
        ...props,
    };
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: props.identifier});


    const style = {
        transform: CSS.Transform.toString(transform)
    };

    if (props.isSpacer) {
        style.opacity = 0;
        style.transition = 'none'
    }
    else if (props.activeId) {
        style.transition = 'none'
    }
    else {
        style.transition = transition
    }

    function closeMe() {
        props.closeTab(props.identifier);
    }

    function refreshMe() {
        props.refreshTab(props.identifier);
    }

    return (
        <div ref={setNodeRef} {...attributes} {...listeners} style={style}
             className="context-item-holder">
                <ContextNavigatorItem {...props} />
                {props.isSpacer ? null :
                    <div style={{alignContent: "center"}}>
                        <Button icon="reset" size="small" variant="minimal"
                                className="show-on-hover context-close-button"
                                tabIndex={-1} onClick={async () => {
                            await refreshMe()
                        }}/>
                        <Button icon="delete" size="small" variant="minimal"
                                className="show-on-hover context-close-button"
                                tabIndex={-1} onClick={async () => {
                            await closeMe()
                        }}/>
                    </div>
                }
        </div>
    );
}

function ContextNavigatorItem(props) {
    props = {
        identifier: null,
        selectedItem: null,
        activeId: null,
        icon: null,
        title: null,
        isSpacer: false,
        refreshTab: null,
        closeTab: null,
        handleTabSelect: () => {
        },
        ...props
    };

    let outerClass = "context-nav-item";
    if (props.selectedItem == props.identifier) {
        outerClass += " selected-tab-button"
    }
    if (props.isSpacer) {
        return (
            <div style={{flex: "1 1 0", minWidth: 0, minHeight: 0}}>
                <Button icon={null}
                        intent="none"
                        size="medium"
                        variant="minimal"
                        className={outerClass}
                        onClick={() => {
                        }}>
                </Button>
            </div>)
    }
    return (
        <div
            style={{flex: "1 1 0", minWidth: 0, minHeight: 0}}>
            <Button
                icon={props.icon}
                fill={true}
                alignText="left"
                size="medium"
                variant="minimal"
                className={outerClass}
                ellipsizeText={true}
                onClick={() => {
                    props.handleTabSelect(props.identifier)
                }}>
                {props.title}
            </Button>
        </div>
    );

}


