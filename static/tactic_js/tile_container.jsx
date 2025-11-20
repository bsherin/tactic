import React, {memo, useContext, useEffect, useState, useCallback, useMemo} from "react";
import _ from "lodash";
import {useCallbackStack} from "./utilities_react";
import {postWithCallbackMain} from "./communication_react";
import {SortableComponent} from "./sortable_container";
import {SettingsContext} from "./settings";

import {TileComponent} from "./tile_component";

export {TileContainer}

function TileContainer(props) {

    const settingsContext = useContext(SettingsContext);
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        initSocket();
    }, []);

    const pushCallback = useCallbackStack();

    function _handleTileSourceChange(data) {
        _markSourceChange(data.tile_type)
    }

    function initSocket() {
        props.tsocket.attachListener("tile-message", _handleTileMessage);
        props.tsocket.attachListener('tile-source-change', _handleTileSourceChange);
    }

    function _resortTiles(oldIndex, newIndex) {

        props.tileDispatch({
            type: "move_item",
            oldIndex: oldIndex,
            newIndex: newIndex
        });
        setDragging(false);
    }

    function _markSourceChange(tile_type) {
        let change_list = [];
        for (let entry of props.tile_list.current) {
            if (entry.tile_type == tile_type) {
                change_list.push(entry.tile_id)
            }
        }
        props.tileDispatch({
            type: "change_items_value",
            id_list: change_list,
            field: "source_changed",
            new_value: true
        })
    }

    function tileIndex(tile_id) {
        let counter = 0;
        for (let entry of props.tile_list.current) {
            if (entry.tile_id == tile_id) {
                return counter
            }
            ++counter;
        }
        return -1
    }

    const _closeTile = useCallback((tile_id) => {
        props.tileDispatch({
            type: "delete_item",
            tile_id: tile_id
        });
        const data_dict = {
            local_id: props.local_id,
            tile_id: tile_id
        };
        postWithCallbackMain("RemoveTile", data_dict, null, null, props.local_id);
    }, []);

    const _setTileValue = useCallback((tile_id, field, value, callback = null) => {
        props.tileDispatch({
            type: "change_item_value",
            tile_id: tile_id,
            field: field,
            new_value: value
        });
        pushCallback(callback)
    }, []);

    const _setTileState = useCallback((tile_id, new_state, callback = null) => {
        props.tileDispatch({
            type: "change_item_state",
            tile_id: tile_id,
            new_state: new_state
        });
        pushCallback(callback)
    }, []);

    function _displayTileContentWithJavascript(tile_id, data) {
        _setTileState(tile_id, {
            front_content: data.html,
            javascript_code: data.javascript_code,
            javascript_arg_dict: data["arg_dict"]
        })
    }

    function _displayTileContent(tile_id, data) {
        _setTileState(tile_id, {
            front_content: data.html,
            javascript_code: null,
            javascript_arg_dict: null
        })
    }

    function _handleTileMessage(data) {
        let tile_id = data.tile_id;
        if (tileIndex(tile_id) != -1) {
            let handlerDict = {
                startSpinner: (tile_id,) => _setTileValue(tile_id, "show_spinner", true),
                stopSpinner: (tile_id,) => _setTileValue(tile_id, "show_spinner", false),
                displayTileContent: _displayTileContent,
                displayTileContentWithJavascript: _displayTileContentWithJavascript,
                tileWidgetUpdate: updateWidgetData
            };
            if (data["tile_message"] in handlerDict) {
                handlerDict[data["tile_message"]](tile_id, data)
            }
        }
    }

    function updateWidgetData(tile_id, data) {
        props.tileDispatch({
            type: "update_widget_data",
            tile_id: tile_id,
            widgetId: data["widgetId"],
            widgetData: data["widgetData"]
        })
    }

    function beforeCapture(_,) {
        setDragging(true)
    }

    function makeTailoredTileComponent() {
        return memo(function (tile_props) {
                return <TileComponent {...tile_props}
                                      local_id={props.local_id}
                                      setTileValue={_setTileValue}
                                      setTileState={_setTileState}
                                      handleClose={_closeTile}
                                      goToModule={props.goToModule}
                                      broadcast_event={props.broadcast_event}
                                      tsocket={props.tsocket}
                />
            }
        )
    }

    const TailoredTileComponent = useMemo(() => {
        return makeTailoredTileComponent();
    }, []);

    return (
        <SortableComponent className={props.table_is_shrunk ? "tile-div tile-container-float" : "tile-div"}
                           local_id={props.local_id}
                           style={{}}
                           helperClass={settingsContext.isDark() ? "bp6-dark" : "light-theme"}
                           ElementComponent={TailoredTileComponent}
                           key_field_name="tile_name"
                           item_list={_.cloneDeep(props.tile_list.current)}
                           handle=".tile-name-div"
                           onSortStart={(_, event) => event.preventDefault()} // This prevents Safari weirdness
                           onDragEnd={_resortTiles}
                           onBeforeCapture={beforeCapture}
                           direction="vertical"
                           useDragHandle={true}
                           axis="xy"
                           extraProps={{
                               dragging: dragging,
                               current_doc_name: props.current_doc_name,
                               selected_row: props.selected_row,
                               table_is_shrunk: props.table_is_shrunk
                           }}
        />
    )
}

TileContainer = memo(TileContainer);
