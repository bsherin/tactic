// noinspection XmlDeprecatedElement

import React from "react";
import {useState, useEffect, useRef, memo, useMemo, useCallback, useContext} from "react";

import {Icon, Card, Button, ButtonGroup, Spinner, PopoverPosition} from "@blueprintjs/core";
import {Transition} from "react-transition-group";
import _ from 'lodash';

import {TileForm} from "./tile_form_react";
import {GlyphButton} from "./blueprint_react_widgets";
import {DragHandle} from "./resizing_layouts2"

import {SortableComponent} from "./sortable_container";
import {postWithCallback, postPromise} from "./communication_react"
import {arrayMove, useCallbackStack} from "./utilities_react";
import {ErrorBoundary} from "./error_boundary";
import {MenuComponent} from "./menu_utilities"
import {SearchableConsole} from "./searchable_console";
import {useSize} from "./sizing_tools";

import {SettingsContext} from "./settings";
import {DialogContext} from "./modal_react";
import {ErrorDrawerContext} from "./error_drawer";

export {TileContainer, tilesReducer}

const using_touch = "ontouchend" in document;

const click_event = using_touch ? "touchstart" : "click";

const TILE_DISPLAY_AREA_MARGIN = 15;
const ANI_DURATION = 300;

function composeObjs(base_style, new_style) {
    return Object.assign(Object.assign({}, base_style), new_style)
}

function tilesReducer(tile_list, action) {
    var new_items;
    switch (action.type) {
        case "initialize":
            new_items = action.new_items;
            break;
        case "delete_item":
            new_items = tile_list.filter(t => t.tile_id !== action.tile_id);
            break;
        case "change_item_value":
            new_items = tile_list.map(t => {
                if (t.tile_id === action.tile_id) {
                    let new_t = {...t};
                    new_t[action.field] = action.new_value;
                    return new_t;
                } else {
                    return t;
                }
            });
            break;
        case "change_item_state":
            new_items = tile_list.map(t => {
                if (t.tile_id === action.tile_id) {
                    let new_t = {...t};
                    for (let field in action.new_state) {
                        new_t[field] = action.new_state[field]
                    }
                    return new_t;
                } else {
                    return t;
                }
            });
            break;

        case "change_items_value":
            new_items = tile_list.map(t => {
                if (action.id_list.includes(t.tile_id)) {
                    let new_t = {...t};
                    new_t[action.field] = action.new_value;
                    return new_t;
                } else {
                    return t;
                }
            });
            break;
        case "update_items":
            new_items = tile_list.map(t => {
                if (t.unique_id in action.updates) {
                    const update_dict = action.updates[t.unique_id];
                    return {...t, ...update_dict};
                } else {
                    return t;
                }
            });
            break;
        case "move_item":
            let old_list = [...tile_list];
            new_items = arrayMove(old_list, action.oldIndex, action.newIndex);
            break;
        case "add_at_index":
            new_items = [...tile_list];
            new_items.splice(action.insert_index, 0, action.new_item);
            break;
        default:
            console.log("Got Unknown action: " + action.type);
            return [...tile_list]
    }
    return new_items
}

function TileContainer(props) {
    const tile_div_ref = useRef(null);

    const settingsContext = useContext(SettingsContext);
    const [dragging, setDragging] = useState(false);
    
    const [usable_width, usable_height, topX, topY] = useSize(tile_div_ref, 0, "TileContainer");

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

    function _resortTiles({destination, source}) {

        props.tileDispatch({
            type: "move_item",
            oldIndex: source.index,
            newIndex: destination.index
        });
        setDragging(false);
        if (props.table_is_shrunk) {
            let elements = document.querySelectorAll('.tile-panel');
            elements.forEach((element) => {
                element.classList.add('tile-panel-float');
            })
        }
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

    function get_tile_entry(tile_id) {
        let tindex = tileIndex(tile_id);
        if (tindex == -1) return null;
        return _.cloneDeep(props.tile_list.current[tileIndex(tile_id)])
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

    const _closeTile = useCallback((tile_id)=>{
        props.tileDispatch({
            type: "delete_item",
            tile_id: tile_id
        });
        const data_dict = {
            main_id: props.main_id,
            tile_id: tile_id
        };
        postWithCallback(props.main_id, "RemoveTile", data_dict, null, null, props.main_id);
    }, []);

    const _setTileValue = useCallback((tile_id, field, value, callback = null)=>{
        props.tileDispatch({
            type: "change_item_value",
            tile_id: tile_id,
            field: field,
            new_value: value
        });
        pushCallback(callback)
    }, []);

    const _setTileState = useCallback((tile_id, new_state, callback = null)=>{
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
            javascript_arg_dict: data.arg_dict
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
                hideOptions: (tile_id, data) => _setTileValue(tile_id, "show_form", false),
                startSpinner: (tile_id, data) => _setTileValue(tile_id, "show_spinner", true),
                stopSpinner: (tile_id, data) => _setTileValue(tile_id, "show_spinner", false),
                displayTileContent: _displayTileContent,
                displayFormContent: (tile_id, data) => _setTileValue(tile_id, "form_data", data.form_data),
                displayTileContentWithJavascript: _displayTileContentWithJavascript,
            };
            if (data.tile_message in handlerDict) {
                handlerDict[data.tile_message](tile_id, data)
            }
        }
    }
    function beforeCapture(_, event) {
        if (props.table_is_shrunk) {
            // Need to do this manually because of how react-dnd works
            let elements = document.querySelectorAll('.tile-panel.tile-panel-float');
            elements.forEach((element) => {
                element.classList.remove('tile-panel-float');
            });
        }
        setDragging(true)
    }

    let outer_style = {height: usable_height};

    function makeTailoredTileComponent() {
        return memo(function(tile_props) {
            return <TileComponent {...tile_props}
                main_id={props.main_id}
                setTileValue={_setTileValue}
                setTileState={_setTileState}
                handleClose={_closeTile}
                goToModule={props.goToModule}
                broadcast_event={props.broadcast_event}
                tsocket={props.tsocket}
            />}
        )
    }

    const TailoredTileComponent = useMemo(()=>{
        return makeTailoredTileComponent();
    }, []);

    return (
        <div ref={tile_div_ref}>
            <SortableComponent className="tile-div"
                               main_id={props.main_id}
                               style={outer_style}
                               helperClass={settingsContext.isDark() ? "bp5-dark" : "light-theme"}
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
        </div>
    )
}

TileContainer = memo(TileContainer);

function SortHandle(props) {
    return (
        <span className="tile-name-div" {...props.dragHandleProps} ><Icon icon="drag-handle-vertical"
                                                                          size={15}/>{props.tile_name}</span>
    )
}

SortHandle = memo(SortHandle);


const menu_icons = {
    "Kill and reload": "refresh",
    "Kill, reload, and resubmit": "social-media",
    "Run me": "play",
    "Stop me": "stop",
    "Toggle console": "console",
    "Log me": "clipboard",
    "Log parameters": "th",
    "Edit my source": "edit",
    "Delete me": "trash"
};

const menu_button = (<Button minimal={true}
                           small={true}
                           icon="more"/>);

const alt_button = () => (menu_button);

function TileComponent(props) {
    props = {
        javascript_code: null,
        log_since: null,
        max_console_lines: 100,
        ...props
    };

    const my_ref = useRef(null);
    const body_ref = useRef(null);
    const inner_log_ref = useRef(null);
    const tda_ref = useRef(null);
    const log_ref = useRef(null);
    const left_glyphs_ref = useRef(null);
    const right_glyphs_ref = useRef(null);
    const javascript_error_ref = useRef(false);

    const last_front_content = useRef("");

    const [header_height, set_header_height] = useState(34);
    const [max_name_width, set_max_name_width] = useState(1000);
    const [resizing, set_resizing] = useState(false);
    const [dwidth, set_dwidth] = useState(0);
    const [dheight, set_dheight] = useState(0);

    // const menu_component_ref = useRef(null);

    const pushCallback = useCallbackStack();
    const dialogFuncs = useContext(DialogContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);

    useEffect(() => {
        _broadcastTileSize(props.tile_width, props.tile_height);
        // menu_component_ref.current = _createMenu();
        executeEmbeddedScripts();
        // makeTablesSortable();
        if (props.javascript_code) {
            _executeJavascript()
        }
        listen_for_clicks();
    }, []);

    // useEffect(()=>{
    //     menu_component_ref.current = _createMenu();
    // }, [props.setTileState, props.form_data, props.tile_id, props.show_log, props.tile_type,
    //     props.broadcast_event, props.tile_name, props.main_id]); //

    useEffect(() => {
        if (!resizing) {
            executeEmbeddedScripts();
        }
        // makeTablesSortable();
        if (props.javascript_code) {
            _executeJavascript()
        }
        listen_for_clicks();
        if (props.show_log) {
            if (log_ref && log_ref.current) {
                log_ref.current.scrollTo(0, log_ref.current.scrollHeight)
            }
        }
    });

    useEffect(()=>{
        javascript_error_ref.current = false
    }, [props.javascript_code]);

    useEffect(() => {
        _broadcastTileSize(props.tile_width, props.tile_height)
    }, [props.tile_width, props.tile_height]);



    // Broadcasting the tile size is necessary because some tiles (notably matplotlib tiles)
    // need to know the size of the display area.
    function _broadcastTileSize() {
        postWithCallback(props.tile_id, "TileSizeChange",
            {width: tdaWidth(), height: tdaHeight()}, null, null, props.main_id)
    }

    function _resizeTileArea(dx, dy) {
        let hheight = $(body_ref.current).position().top;
        set_header_height(hheight);
        let new_state = {
            tile_height: props.tile_height + dy,
            tile_width: props.tile_width + dx
        };

        props.setTileState(props.tile_id, new_state)
    }

    function executeEmbeddedScripts() {
        if (props.front_content != last_front_content.current) { // to avoid doubles of bokeh images
            last_front_content.current = props.front_content;
            let scripts = $("#" + props.tile_id + " .tile-display-area script").toArray();
            for (let script of scripts) {
                try {
                    window.eval(script.text)
                } catch (e) {

                }
            }
        }
    }

    // function makeTablesSortable() {
    //     let tables = $("#" + props.tile_id + " table.sortable").toArray();
    //     for (let table of tables) {
    //         sorttable.makeSortable(table)
    //     }
    // }

    function tdaWidth() {
        return props.tile_width + dwidth - TILE_DISPLAY_AREA_MARGIN * 2
    }

    function tdaHeight() {
        return props.tile_height + dheight - header_height - TILE_DISPLAY_AREA_MARGIN * 2
    }

    function _executeJavascript() {
        try {
            if (!javascript_error_ref.current) {
                let selector = "[id='" + props.tile_id + "'] .jscript-target";
                eval(props.javascript_code)(selector, tdaWidth(), tdaHeight(), props.javascript_arg_dict, resizing)
            }
        } catch (err) {
            javascript_error_ref.current = true;
            errorDrawerFuncs.addErrorDrawerEntry({
                title: "Error evaluating javascript",
                content: err.message
            });
        }
    }

    function _toggleTileLog() {
        props.setTileState(props.tile_id, {show_log: !props.show_log, show_form: false});
    }

    function _toggleShrunk() {
        props.setTileValue(props.tile_id, "shrunk", !props.shrunk);
    }

    async function _closeTile() {
        try {
            await dialogFuncs.showModalPromise("ConfirmDialog", {
                title: "Delete Tile",
                text_body: `Delete tile ${props.tile_name}`,
                cancel_text: "do nothing",
                submit_text: "delete",
                handleClose: dialogFuncs.hideModal,
            });
            props.handleClose(props.tile_id);
        }
        catch (e) {
        if (e != "canceled") {
            errorDrawerFuncs.addFromError(`Error closing tile`, e)
        }
    }
    }

    function _standard_click_data() {
        return {
            tile_id: props.tile_id,
            main_id: props.main_id,
            doc_name: props.current_doc_name,
            active_row_id: props.selected_row
        }
    }

    async function _updateOptionValue(option_name, value, callback = null) {
        const data_dict = {tile_id: props.tile_id, option_name: option_name, value: value};
        try {
            let data = await postPromise(props.tile_id, "_update_single_option", data_dict);
            if (data && ("form_data" in data)) {
                props.setTileValue(props.tile_id, "form_data", data.form_data, callback)
            }
        }
        catch (e) {
            errorDrawerFuncs.addFromError("Error updating option value", e);
            return
        }
    }

    function _toggleBack() {
        props.setTileState(props.tile_id, {show_log: false, show_form: !props.show_form});
    }

    function _setTileBack(show_form) {
        props.setTileValue(props.tile_id, "show_form", show_form)
    }

    function _handleSubmitOptions() {
        props.setTileState(props.tile_id, {
            show_form: false,
            show_spinner: true

        });
        let data = {};
        for (let opt of props.form_data) {
            data[opt.name] = opt.starting_value
        }
        data.tile_id = props.tile_id;
        props.broadcast_event("UpdateOptions", data)
    }

    function _startSpinner() {
        props.setTileValue(props.tile_id, "show_spinner", true)
    }

    function _stopSpinner() {
        props.setTileValue(props.tile_id, "show_spinner", false)
    }

    function _displayFormContent(data) {
        props.setTileValue(props.tile_id, "form_data", data.form_data)
    }

    async function spin_and_refresh() {
        _startSpinner();
        await postPromise(props.tile_id, "RefreshTile", {}, props.main_id);
        _stopSpinner();
    }

    async function _reloadTile(resubmit = false) {
        const data_dict = {"tile_id": props.tile_id, "tile_name": props.tile_name};
        try {
            _startSpinner();
            let data = await postPromise(props.main_id, "reload_tile", data_dict, props.main_id);
            _displayFormContent(data);
            props.setTileValue(props.tile_id, "source_changed", false);
            if (data.options_changed || !resubmit) {
                _stopSpinner();
                _setTileBack(true)
            } else {
                await spin_and_refresh()
            }
        }
        catch (e) {
            _stopSpinner();
            errorDrawerFuncs.addFromError("Error reloading tile", e)
        }
    }

    function listen_for_clicks() {
        $(body_ref.current).off();
        $(body_ref.current).on(click_event, '.element-clickable', function (e) {
            let data_dict = _standard_click_data();
            const dset = e.target.dataset;
            data_dict.dataset = {};
            for (let key in dset) {
                if (!dset.hasOwnProperty(key)) continue;
                data_dict.dataset[key] = dset[key]
            }
            postWithCallback(props.tile_id, "TileElementClick", data_dict, null, null, props.main_id);
            e.stopPropagation()
        });
        $(body_ref.current).on(click_event, '.word-clickable', function (e) {
            let data_dict = _standard_click_data();
            const s = window.getSelection();
            const range = s.getRangeAt(0);
            const node = s.anchorNode;
            while ((range.toString().indexOf(' ') !== 0) && (range.startOffset !== 0)) {
                range.setStart(node, (range.startOffset - 1));
            }
            const nlen = node.textContent.length;
            if (range.startOffset !== 0) {
                range.setStart(node, range.startOffset + 1);
            }
            do {
                range.setEnd(node, range.endOffset + 1);
            } while (range.toString().indexOf(' ') == -1 && range.toString().trim() !== '' && range.endOffset < nlen);
            data_dict.clicked_text = range.toString().trim();
            postWithCallback(props.tile_id, "TileWordClick", data_dict, null, null, props.main_id)
        });
        $(body_ref.current).on(click_event, '.cell-clickable', function (e) {
            let data_dict = _standard_click_data();
            data_dict.clicked_cell = $(this).text();
            postWithCallback(props.tile_id, "TileCellClick", data_dict, null, null, props.main_id)
        });
        $(body_ref.current).on(click_event, '.row-clickable', function (e) {
            let data_dict = _standard_click_data();
            const cells = $(this).children();
            const row_vals = [];
            cells.each(function () {
                row_vals.push($(this).text())
            });
            data_dict["clicked_row"] = row_vals;
            postWithCallback(props.tile_id, "TileRowClick", data_dict, null, null, props.main_id)
        });
        $(body_ref.current).on(click_event, '.front button', function (e) {
            let data_dict = _standard_click_data();
            data_dict["button_value"] = e.target.value;
            postWithCallback(props.tile_id, "TileButtonClick", data_dict, null, null, props.main_id)
        });
        $(body_ref.current).on('submit', '.front form', function (e) {
            let data_dict = _standard_click_data();
            const form_data = {};
            let the_form = e.target;
            for (let i = 0; i < the_form.length; i += 1) {
                form_data[the_form[i]["name"]] = the_form[i]["value"]
            }
            data_dict["form_data"] = form_data;
            postWithCallback(props.tile_id, "TileFormSubmit", data_dict, null, null, props.main_id);
            return false
        });
        $(body_ref.current).on("change", '.front select', function (e) {
            let data_dict = _standard_click_data();
            data_dict.select_value = e.target.value;
            data_dict.select_name = e.target.name;
            postWithCallback(props.tile_id, "SelectChange", data_dict, null, null, props.main_id)
        });
        $(body_ref.current).on('change', '.front textarea', function (e) {
            let data_dict = _standard_click_data();
            data_dict["text_value"] = e.target.value;
            postWithCallback(props.tile_id, "TileTextAreaChange", data_dict, null, null, props.main_id)
        });
    }

    var front_style;
    var tda_style;
    var back_style;
    var tile_log_style;
    var panel_body_style;
    var main_style;
    var transitionStylesAltUp;
    var transitionStylesAltDown;
    var transitionFadeStyles;
    var lg_style;

    function compute_styles() {
        let the_margin = 15;
        let tile_height = props.shrunk ? header_height : props.tile_height;
        front_style = {
            width: props.tile_width,
            height: tile_height - header_height,
        };
        tda_style = {
            width: props.tile_width - TILE_DISPLAY_AREA_MARGIN * 2,
            height: tile_height - header_height - TILE_DISPLAY_AREA_MARGIN * 2
        };
        if (left_glyphs_ref.current && right_glyphs_ref.current) {
            let lg_rect = left_glyphs_ref.current.getBoundingClientRect();
            let rg_rect = right_glyphs_ref.current.getBoundingClientRect();
            let lg_width = rg_rect.x - lg_rect.x - 10;
            lg_style = {width: lg_width, overflow: "hidden"};
        } else {
            lg_style = {};
        }

        back_style = Object.assign({}, front_style);
        tile_log_style = {
            overflow: "auto",
            marginLeft: 20,
            marginRight: 20,
            marginTop: 10,
            marginBottom: 10,
            width: props.tile_width - 40,
            height: tile_height - header_height - 50
        };
        panel_body_style = {"width": props.tile_width};
        main_style = {
            width: props.tile_width + dwidth,
            height: tile_height + dheight,
            position: "relative"
        };
        if (!props.finished_loading) {
            main_style.opacity = .5
        }
        front_style.transition = `top ${ANI_DURATION}ms ease-in-out`;
        back_style.transition = `top ${ANI_DURATION}ms ease-in-out`;
        transitionStylesAltUp = {
            transition: `top ${ANI_DURATION}ms ease-in-out`,
            entering: {top: header_height},
            entered: {top: header_height},
            exiting: {top: -1 * tile_height},
            exited: {top: -1 * tile_height}
        };
        transitionStylesAltDown = {
            entering: {top: header_height, opacity: 1},
            entered: {top: header_height, opacity: 1},
            exiting: {top: tile_height + 50},
            exited: {top: tile_height + 50, opacity: 0}
        };
        tile_log_style.transition = `opacity ${ANI_DURATION}ms ease-in-out`;
        transitionFadeStyles = {
            entering: {opacity: 1},
            entered: {opacity: 1},
            exiting: {opacity: 0, width: 0, height: 0, padding: 0},
            exited: {opacity: 0, width: 0, height: 0, padding: 0}
        }
    }

    function logText(the_text) {
        postWithCallback(props.tile_id, "LogTile", {}, null, null, props.main_id);
    }

    function _stopMe() {
        postWithCallback("kill_" + props.tile_id, "StopMe", {}, null)
    }

    async function _editMe() {
        if (!window.in_context) {
            window.blur();
            try {
                let data = await postPromise("host", "go_to_module_viewer_if_exists", {
                    user_id: window.user_id,
                    tile_type: props.tile_type,
                    line_number: 0
                }, props.main_id);
                window.open("", data.window_name);
            }
            catch (e) {
                window.open($SCRIPT_ROOT + "/view_location_in_creator/" + props.tile_type + "/" + "0");
            }
        } else {
            props.goToModule(props.tile_type, 0)
        }
    }

    function _logMe() {
        logText(props.front_content)
    }

    function _logParams() {
        const data_dict = {};
        data_dict["main_id"] = props.main_id;
        data_dict["tile_id"] = props.tile_id;
        data_dict["tile_name"] = props.tile_name;
        postWithCallback(props.tile_id, "LogParams", data_dict, null, null, props.main_id)
    }

    function _startResize(e, ui, startX, startY) {
        set_resizing(true);
        set_dwidth(0);
        set_dheight(0);
    }

    function _onResize(e, ui, x, y, dx, dy) {
        set_dwidth(dx);
        set_dheight(dy);
    }

    function _stopResize(e, ui, x, y, dx, dy) {
        set_resizing(false);
        set_dwidth(0);
        set_dheight(0);
        pushCallback(() => {
            _resizeTileArea(dx, dy)
        })
    }

    let show_front = (!props.show_form) && (!props.show_log);
    let front_dict = {__html: props.front_content};
    compute_styles();
    let tile_class = props.table_is_shrunk && !props.dragging ? "tile-panel tile-panel-float" : "tile-panel";
    let tph_class = props.source_changed ? "tile-panel-heading tile-source-changed" : "tile-panel-heading";
    let draghandle_position_dict = {position: "absolute", bottom: 2, right: 1};

    let tile_menu_options = {
        "Run me": _handleSubmitOptions,
        "Stop me": _stopMe,
        "divider99": "divider",
        "Kill and reload": async () => {
            await _reloadTile(false)
        },
        "Kill, reload, and resubmit": async () => {
            await _reloadTile(true)
        },
        "divider0": "divider",
        "Toggle console": _toggleTileLog,
        "divider1": "divider",
        "Log me": _logMe,
        "Log parameters": _logParams,
        "divider2": "divider",
        "Edit my source": _editMe,
        "divider3": "divider",
        "Delete me": _closeTile
    };

    return (
        <Card ref={my_ref} elevation={2} style={main_style} className={tile_class} id={props.tile_id}>
            <ErrorBoundary>
                <div className={tph_class}>
                    <div className="left-glyphs" ref={left_glyphs_ref} style={lg_style}>
                        <ButtonGroup>
                            {props.shrunk &&
                                <GlyphButton
                                    icon="chevron-right"
                                    handleClick={_toggleShrunk}/>}

                            {!props.shrunk &&
                                <GlyphButton
                                    icon="chevron-down"
                                    handleClick={_toggleShrunk}/>}
                            <GlyphButton intent="primary"
                                         handleClick={_toggleBack}
                                         icon="cog"/>
                            <SortHandle dragHandleProps={props.dragHandleProps} tile_name={props.tile_name}/>
                        </ButtonGroup>
                    </div>

                    <div className="right-glyphs"
                         style={{marginRight: 10}}
                         ref={right_glyphs_ref}>
                        <ButtonGroup>
                            {props.show_log && <GlyphButton intent="primary"
                                                            handleClick={_toggleTileLog}
                                                            icon="console"/>}
                            {props.source_changed && !props.show_spinner &&
                                <GlyphButton intent="danger"
                                             handleClick={async () => {
                                                 await _reloadTile(true)
                                             }}
                                             icon="social-media"/>}
                            {props.show_spinner && <GlyphButton intent="danger"
                                                                handleClick={_stopMe}
                                                                icon="stop"/>}
                            {props.show_spinner && <Spinner size={17}/>}
                            <MenuComponent
                                option_dict={tile_menu_options}
                                icon_dict={menu_icons}
                                createOmniItems={false}
                                item_class="tile-menu-item"
                                position={PopoverPosition.BOTTOM_RIGHT}
                                alt_button={alt_button}/>
                        </ButtonGroup>
                    </div>
                </div>
                <ErrorBoundary>
                    {!props.shrunk &&
                        <div ref={body_ref} style={panel_body_style} className="tile-body">
                            <ErrorBoundary>
                                <Transition in={props.show_form} timeout={ANI_DURATION}>
                                    {state => (
                                        <div className="back" style={composeObjs(back_style, transitionStylesAltUp[state])}>
                                            <TileForm options={_.cloneDeep(props.form_data)}
                                                      tile_id={props.tile_id}
                                                      updateValue={_updateOptionValue}
                                                      handleSubmit={_handleSubmitOptions}/>
                                        </div>
                                    )}
                                </Transition>
                            </ErrorBoundary>
                             <ErrorBoundary>
                                {props.show_log &&
                                    <div className="tile-log" ref={log_ref}>
                                        <div className="tile-log-area">
                                            <SearchableConsole main_id={props.main_id}
                                                               streaming_host="host"
                                                               container_id={props.tile_id}
                                                               ref={inner_log_ref}
                                                               outer_style={tile_log_style}
                                                               showCommandField={true}
                                            />
                                        </div>
                                    </div>
                                }
                            </ErrorBoundary>
                            <ErrorBoundary>
                                <Transition in={show_front} timeout={ANI_DURATION}>
                                    {state => (
                                        <div className="front" style={composeObjs(front_style, transitionStylesAltDown[state])}>
                                            <div className="tile-display-area" style={tda_style} ref={tda_ref}
                                                 dangerouslySetInnerHTML={front_dict}></div>
                                        </div>
                                    )}
                                </Transition>
                             </ErrorBoundary>
                        </div>
                    }
                </ErrorBoundary>
                <DragHandle position_dict={draghandle_position_dict}
                            dragStart={_startResize}
                            onDrag={_onResize}
                            dragEnd={_stopResize}
                            direction="both"/>
            </ErrorBoundary>
        </Card>
    )
}

TileComponent = memo(TileComponent);
