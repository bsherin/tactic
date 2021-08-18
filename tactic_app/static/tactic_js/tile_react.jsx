
import React from "react";
import PropTypes from 'prop-types';

import { Icon, Card, ButtonGroup, Spinner } from "@blueprintjs/core";
import {Transition} from "react-transition-group";
import { SortableHandle, SortableElement } from 'react-sortable-hoc';
import _ from 'lodash';

import {TileForm} from "./tile_form_react.js";
import {GlyphButton} from "./blueprint_react_widgets.js";
import {DragHandle} from "./resizing_layouts.js"

import {SortableComponent} from "./sortable_container.js";
import {postWithCallback} from "./communication_react.js"
import {doFlash} from "./toaster.js"
import {doBinding, propsAreEqual, arrayMove} from "./utilities_react.js";

export {TileContainer}

const using_touch = "ontouchend" in document;

var click_event;

if (using_touch) {
    click_event = "touchstart"
}
else {
    click_event = "click"
}

const TILE_DISPLAY_AREA_MARGIN = 15;
const ANI_DURATION = 300;


function composeObjs(base_style, new_style) {
    return Object.assign(Object.assign({}, base_style), new_style)
}



class TileContainer extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this)
        this.socket_counter = null;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !propsAreEqual(nextProps, this.props)
    }

    _handleTileFinishedLoading(data) {
        this._setTileValue(data.tile_id, "finished_loading", true)
    }

    componentDidMount() {
        this.setState({"mounted": true});
        this.initSocket()
    }

    componentDidUpdate () {
        if (this.props.tsocket.counter != this.socket_counter) {
            this.initSocket();
        }
    }

    initSocket() {
        let self = this;
        this.props.tsocket.socket.off("tile-message");
        this.props.tsocket.socket.on("tile-message", this._handleTileMessage);
        this.props.tsocket.socket.off("tile-finished-loading");
        this.props.tsocket.socket.on("tile-finished-loading", (data) => {
            self._handleTileFinishedLoading(data)
        });
        this.props.tsocket.socket.off("tile-source-change");
        this.props.tsocket.socket.on('tile-source-change', function (data) {
            self._markSourceChange(data.tile_type)
        });
        this.socket_counter = this.props.tsocket.counter
    }

     _resortTilesOld(new_sort_list) {
        let new_tile_list = [];
        for (let tid of new_sort_list) {
            let new_entry = this.get_tile_entry(tid);
            new_tile_list.push(new_entry)
        }
        this.props.setMainStateValue("tile_list", new_tile_list)
    }

    _resortTiles({oldIndex, newIndex}) {
        let old_tile_list = [...this.props.tile_list];
        let new_tile_list = arrayMove(old_tile_list, oldIndex, newIndex);
        this.props.setMainStateValue("tile_list", new_tile_list)
    }

    _markSourceChange(tile_type) {
        let new_tile_list = [...this.props.tile_list];
        let change_list = [];
        for (let entry of new_tile_list) {
            if (entry.tile_type == tile_type) {
                change_list.push(entry.tile_id)
            }
        }
        for (let tid of change_list) {
            this._setTileValue(tid, "source_changed", true)
        }
    }

    get_tile_entry(tile_id) {
        let tindex = this.tileIndex(tile_id);
        if (tindex == -1) return null;
        return _.cloneDeep(this.props.tile_list[this.tileIndex(tile_id)])
    }

    replace_tile_entry(tile_id, new_entry, callback=null) {
        let new_tile_list = [...this.props.tile_list];
        let tindex = this.tileIndex(tile_id);
        new_tile_list.splice(tindex, 1, new_entry);
        this.props.setMainStateValue("tile_list", new_tile_list, callback)
    }

    tileIndex(tile_id) {
        let counter = 0;
        for (let entry of this.props.tile_list) {
            if (entry.tile_id == tile_id) {
                return counter
            }
            ++counter;
        }
        return -1
    }

    _closeTile(tile_id) {
        let tindex = this.tileIndex(tile_id);
        let new_tile_list = [...this.props.tile_list];
        new_tile_list.splice(tindex, 1);
        this.props.setMainStateValue("tile_list", new_tile_list);
        const data_dict = {
            main_id: window.main_id,
            tile_id: tile_id
        };
        postWithCallback(window.main_id, "RemoveTile", data_dict);
    }

    _addToLog(tile_id, new_line) {
        let entry = this.get_tile_entry(tile_id);
        let new_log = entry["log_content"] + new_line;
        let self = this;
        this._setTileValue(tile_id, "log_content", new_log)
    }

    _setTileValue(tile_id, field, value, callback=null) {
        let entry = this.get_tile_entry(tile_id);
        entry[field] = value;
        this.replace_tile_entry(tile_id, entry, callback)
    }

    _setTileState(tile_id, new_state, callback=null) {
        let entry = this.get_tile_entry(tile_id);
        for (let field in new_state) {
            entry[field] = new_state[field]
        }
        this.replace_tile_entry(tile_id, entry, callback)
    }

    _displayTileContentWithJavascript(tile_id, data) {
        this._setTileState(tile_id, {front_content: data.html,
            javascript_code: data.javascript_code,
            javascript_arg_dict: data.arg_dict})
    }

    _displayTileContent(tile_id, data) {
        this._setTileState(tile_id, {front_content: data.html,
            javascript_code: null,
            javascript_arg_dict: null})
    }

    _handleTileMessage(data) {
        let self = this;
        let handlerDict = {
            hideOptions: (tile_id, data)=>self._setTileValue(tile_id, "show_form", false),
            startSpinner: (tile_id, data)=>self._setTileValue(tile_id, "show_spinner", true),
            stopSpinner: (tile_id, data)=>self._setTileValue(tile_id, "show_spinner", false),
            displayTileContent: self._displayTileContent,
            displayFormContent: (tile_id, data)=>self._setTileValue(tile_id, "form_data", data.form_data),
            displayTileContentWithJavascript: self._displayTileContentWithJavascript,
            updateLog: (tile_id, data)=>self._addToLog(tile_id, data.new_line)
        };
        let tile_id = data.tile_id;
        handlerDict[data.tile_message](tile_id, data)
    }

    render() {
        let outer_style = {height: this.props.height};
        if (this.props.table_is_shrunk) {
            outer_style.marginLeft = "0.5rem"
        }
        return (
            <SortableComponent id="tile-div"
                               style={outer_style}
                               helperClass={this.props.dark_theme ? "bp3-dark" : "light-theme"}
                               container_ref={this.props.tile_div_ref}
                               ElementComponent={STileComponent}
                               key_field_name="tile_name"
                               item_list={_.cloneDeep(this.props.tile_list)}
                               handle=".tile-name-div"
                               onSortStart={(_, event) => event.preventDefault()} // This prevents Safari weirdness
                               onSortEnd={this._resortTiles}
                               handleClose={this._closeTile}
                               setTileValue={this._setTileValue}
                               setTileState={this._setTileState}
                               table_is_shrunk={this.props.table_is_shrunk}
                               current_doc_name={this.props.current_doc_name}
                               selected_row={this.props.selected_row}
                               broadcast_event={this.props.broadcast_event}
                               useDragHandle={true}
                               axis="xy"

            />
        )
    }
}

TileContainer.propTypes = {
    setMainStateValue: PropTypes.func,
    dark_theme: PropTypes.bool,
    table_is_shrunk: PropTypes.bool,
    tile_list: PropTypes.array,
    tile_div_ref: PropTypes.object,
    current_doc_name: PropTypes.string,
    height: PropTypes.number,
    broadcast_event: PropTypes.func,
    selected_row: PropTypes.number,
    tsocket: PropTypes.object
};

class RawSortHandle extends React.Component {

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !propsAreEqual(nextProps, this.props)
    }

    render () {
        return (
            <span className="tile-name-div" ><Icon icon="drag-handle-vertical" iconSize={15}/>{this.props.tile_name}</span>
        )
    }
}

RawSortHandle.propTypes = {
    tile_name: PropTypes.string
};


const Shandle = SortableHandle(RawSortHandle);

class TileComponent extends React.Component {
    constructor(props) {
        super(props);
        this.my_ref = React.createRef();
        this.body_ref = React.createRef();
        this.tda_ref = React.createRef();
        this.log_ref = React.createRef();
        this.left_glyphs_ref = React.createRef();
        this.right_glyphs_ref = React.createRef();
        this.state = {
            header_height: 34,
            max_name_width: 1000,
            mounted: false,
            resizing: false,
            dwidth: 0,
            dheight: 0,
            log_content: null
        };
        this.last_front_content = "";
        doBinding(this);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !propsAreEqual(nextProps, this.props) || !propsAreEqual(nextState, this.state)
    }


    // Broadcasting the tile size is necessary because some tiles (notably matplotlib tiles)
    // need to know the size of the display area.
    _broadcastTileSize() {
        postWithCallback(this.props.tile_id, "TileSizeChange",
            {width: this.tdaWidth, height: this.tdaHeight})
    }

    _resizeTileAreaOld(event, ui, callback=null) {
        let hheight = $(this.body_ref.current).position().top;
        this.setState({
            header_height: hheight
        });
        let new_state = {tile_height: ui.size.height,
            tile_width: ui.size.width};

        this.props.setTileState(this.props.tile_id, new_state, callback)
    }

    _resizeTileArea(dx, dy) {
        let hheight = $(this.body_ref.current).position().top;
        this.setState({
            header_height: hheight
        });
        let new_state = {tile_height: this.props.tile_height + dy,
            tile_width: this.props.tile_width + dx};

        this.props.setTileState(this.props.tile_id, new_state, this._broadcastTileSize)
    }

    executeEmbeddedScripts() {
        if (this.props.front_content != this.last_front_content) { // to avoid doubles of bokeh images
            this.last_front_content = this.props.front_content;
            let scripts = $("#" + this.props.tile_id + " .tile-display-area script").toArray();
            for (let script of scripts) {
                try {
                    window.eval(script.text)
                }
                catch (e) {

                }
            }
        }

    }

    makeTablesSortable() {
        let tables = $("#" + this.props.tile_id + " table.sortable").toArray();
        for (let table of tables) {
            sorttable.makeSortable(table)
        }
    }

    get tdaWidth() {
        return this.props.tile_width - TILE_DISPLAY_AREA_MARGIN * 2
    }

    get tdaHeight() {
         return this.props.tile_height - this.state.header_height - TILE_DISPLAY_AREA_MARGIN * 2
    }

    _executeJavascript(){
        try{
            let selector = "[id='" + this.props.tile_id + "'] .jscript-target";
            eval(this.props.javascript_code)(selector, this.tdaWidth, this.tdaHeight, this.props.javascript_arg_dict)
        }
        catch(err) {
            doFlash({"alert-type": "alert-warning", "message": "Error evaluating javascript: " + err.message})
        }
    }

    componentDidMount() {
        let self = this;
        this.setState({mounted: true});
        this._broadcastTileSize(this.props.tile_width, this.props.tile_height);
        this.executeEmbeddedScripts();
        this.makeTablesSortable();
        if (this.props.javascript_code) {
            this._executeJavascript()
        }
        this.listen_for_clicks();
    }

    componentDidUpdate() {
        this.executeEmbeddedScripts();
        this.makeTablesSortable();
        if (this.props.javascript_code) {
            this._executeJavascript()
        }
        this.listen_for_clicks();
        if (this.props.show_log) {
            if (this.log_ref && this.log_ref.current) {
                this.log_ref.current.scrollTo(0, this.log_ref.current.scrollHeight)
            }
        }
    }

    _toggleTileLog() {
        const self = this;
        if (this.props.show_log) {
            this.props.setTileState(this.props.tile_id, {show_log: false, show_form: false});
            this._stopLogStreaming();
            return
        }

        postWithCallback("host", "get_container_log", {"container_id": this.props.tile_id}, function (res) {
            self.props.setTileState(self.props.tile_id, {show_log: true, show_form: false, log_content: res.log_text});
            self._startLogStreaming();
            self._setTileBack(false);
        })
    }

    _startLogStreaming() {
        postWithCallback(window.main_id, "StartLogStreaming", {tile_id: this.props.tile_id});
    }

    _stopLogStreaming() {
        postWithCallback(window.main_id, "StopLogStreaming", {tile_id: this.props.tile_id});
    }

    _toggleShrunk() {
        this.props.setTileValue(this.props.tile_id, "shrunk", !this.props.shrunk);
    }

    _closeTile() {
        this.props.handleClose(this.props.tile_id)
    }

    _standard_click_data() {
        return{
            tile_id: this.props.tile_id,
            main_id: window.main_id,
            doc_name: this.props.current_doc_name,
            active_row_id: this.props.selected_row
        }
    }

    _updateOptionValue(option_name, value) {
        let options = _.cloneDeep(this.props.form_data);
        for (let opt of options) {
            if (opt.name == option_name) {
                opt.starting_value = value;
                break
            }
        }
        this.props.setTileValue(this.props.tile_id, "form_data", options)
    }

    _toggleBack() {
        if (this.props.show_log) {
            this._stopLogStreaming()
        }
        this.props.setTileState(this.props.tile_id, {show_log: false, show_form: !this.props.show_form});
    }

    _setTileBack(show_form) {
        this.props.setTileValue(this.props.tile_id, "show_form", show_form)
    }

    _handleSubmitOptions() {
        this.props.setTileValue(this.props.tile_id, "show_form", false);
        this._startSpinner();
        this.props.setTileValue(this.props.tile_id, "show_spinner", true);
        let data = {};
        for (let opt of this.props.form_data) {
            data[opt.name] = opt.starting_value
        }
        data.tile_id = this.props.tile_id;
        this.props.broadcast_event("UpdateOptions", data)
    }

    _startSpinner() {
        this.props.setTileValue(this.props.tile_id, "show_spinner", true)
    }

    _stopSpinner() {
        this.props.setTileValue(this.props.tile_id, "show_spinner", false)
    }

    _displayFormContent(data) {
        this.props.setTileValue(this.props.tile_id, "form_data", data.form_data)
    }

    spin_and_refresh() {
        this._startSpinner();
        const self = this;
        postWithCallback(this.props.tile_id, "RefreshTile", {}, function() {
            self._stopSpinner();
        })
    }

    _reloadTile () {
        const self = this;
        const data_dict = {"tile_id": this.props.tile_id, "tile_name": this.props.tile_name};
        this._startSpinner();
        postWithCallback(main_id, "reload_tile", data_dict, reload_success);

        function reload_success (data) {
            if (data.success) {
                self._displayFormContent(data);
                self.props.setTileValue(self.props.tile_id, "source_changed", false);
                if (data.options_changed) {
                    self._stopSpinner();
                    self._setTileBack(true)
                }
                else {
                    self.spin_and_refresh()
                }
            }
        }
    }

    listen_for_clicks () {
         let self = this;
         $(this.body_ref.current).off();
         $(this.body_ref.current).on(click_event, '.element-clickable', function(e) {
             let data_dict = self._standard_click_data();
             const dset = e.target.dataset;
             data_dict.dataset = {};
             for (let key in dset) {
                 if (!dset.hasOwnProperty(key)) continue;
                 data_dict.dataset[key] = dset[key]
             }
             postWithCallback(self.props.tile_id, "TileElementClick", data_dict);
             e.stopPropagation()
         });
         $(this.body_ref.current).on(click_event, '.word-clickable', function(e) {
             let data_dict = self._standard_click_data();
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
             postWithCallback(self.props.tile_id, "TileWordClick", data_dict)
         });
         $(this.body_ref.current).on(click_event, '.cell-clickable', function(e) {
             let data_dict = self._standard_click_data();
             data_dict.clicked_cell = $(this).text();
             postWithCallback(self.props.tile_id, "TileCellClick", data_dict)
         });
         $(this.body_ref.current).on(click_event, '.row-clickable', function(e) {
             let data_dict = self._standard_click_data();
             const cells = $(this).children();
             const row_vals = [];
             cells.each(function() {
                row_vals.push($(this).text())
             });
             data_dict["clicked_row"] = row_vals;
             postWithCallback(self.props.tile_id, "TileRowClick", data_dict)
         });
         $(this.body_ref.current).on(click_event, '.front button', function(e) {
             let data_dict = self._standard_click_data();
             data_dict["button_value"] = e.target.value;
             postWithCallback(self.props.tile_id, "TileButtonClick", data_dict)
         });
         $(this.body_ref.current).on('submit', '.front form', function(e) {
             let data_dict = self._standard_click_data();
             const form_data = {};
             let the_form = e.target;
             for (let i = 0; i < the_form.length; i += 1) {
                form_data[the_form[i]["name"]] = the_form[i]["value"]
             }
             data_dict["form_data"] = form_data;
             postWithCallback(self.props.tile_id, "TileFormSubmit", data_dict);
             return false
         });
         $(this.body_ref.current).on("change", '.front select', function (e) {
             let data_dict = self._standard_click_data();
             data_dict.select_value = e.target.value;
             data_dict.select_name = e.target.name;
             postWithCallback(self.props.tile_id, "SelectChange", data_dict)
         });
         $(this.body_ref.current).on('change', '.front textarea', function(e) {
             let data_dict = self._standard_click_data();
             data_dict["text_value"] = e.target.value;
             postWithCallback(self.props.tile_id, "TileTextAreaChange", data_dict)
         });
    }

    compute_styles() {
        let the_margin = 15;
        let tile_height = this.props.shrunk ? this.state.header_height : this.props.tile_height;
        this.front_style = {
            width: this.props.tile_width,
            height: tile_height - this.state.header_height,
        };
        this.tda_style = {
            width: this.props.tile_width - TILE_DISPLAY_AREA_MARGIN * 2,
            height: tile_height - this.state.header_height - TILE_DISPLAY_AREA_MARGIN * 2
        };
        if (this.state.mounted) {
            let lg_rect = this.left_glyphs_ref.current.getBoundingClientRect();
            let rg_rect = this.right_glyphs_ref.current.getBoundingClientRect();
            let lg_width = rg_rect.x - lg_rect.x - 10;
            this.lg_style = {width: lg_width, overflow: "hidden"};
        }
        else {
            this.lg_style = {};
        }

        this.back_style = Object.assign({}, this.front_style);
        this.tile_log_style = Object.assign({}, this.front_style);
        this.panel_body_style = {"width": this.props.tile_width};
        this.main_style = {width: this.props.tile_width + this.state.dwidth,
                height: tile_height + this.state.dheight,
                position: "relative"
            };
        if (!this.props.finished_loading) {
            this.main_style.opacity = .5
        }
        this.front_style.transition = `top ${ANI_DURATION}ms ease-in-out`;
        this.back_style.transition = `top ${ANI_DURATION}ms ease-in-out`;
        this.transitionStylesAltUp = {
            transition: `top ${ANI_DURATION}ms ease-in-out`,
          entering: {top: this.state.header_height},
          entered:  {top: this.state.header_height},
          exiting: {top: -1 * tile_height},
          exited:  {top: -1 * tile_height}
        };
        this.transitionStylesAltDown = {
          entering: {top: this.state.header_height},
          entered:  {top: this.state.header_height},
          exiting: {top: tile_height + 50},
          exited:  {top: tile_height + 50}
        };
        this.tile_log_style.transition = `opacity ${ANI_DURATION}ms ease-in-out`;
        this.transitionFadeStyles = {
              entering: { opacity: 1 },
              entered:  { opacity: 1 },
              exiting:  { opacity: 0, width: 0, height: 0, padding: 0},
              exited:  { opacity: 0, width: 0, height: 0, padding: 0}
        }
    }

    logText(the_text) {
        let self = this;
        postWithCallback(this.props.tile_id, "LogTile", {});
    }
    _logMe() {
        this.logText(this.props.front_content)
    }

    _logParams () {
        const data_dict = {};
        data_dict["main_id"] = window.main_id;
        data_dict["tile_id"] = this.props.tile_id;
        data_dict["tile_name"] = this.props.tile_name;
        postWithCallback(this.props.tile_id, "LogParams", data_dict)
    }

    _startResize(e, ui, startX, startY) {
        this.setState({resizing: true, dwidth: 0, dheight: 0})
    }

    _onResize(e, ui, x, y, dx, dy) {
        this.setState({dwidth: dx, dheight: dy})
    }

    _stopResize(e, ui, x, y, dx, dy) {
        this.setState({resizing: false, dwidth: 0, dheight:0}, ()=>{this._resizeTileArea(dx, dy)})
    }

    render () {
        let show_front = (!this.props.show_form) && (!this.props.show_log);
        let front_dict = {__html: this.props.front_content};
        this.compute_styles();
        let tile_class = this.props.table_is_shrunk ? "tile-panel tile-panel-float" : "tile-panel";
        let tph_class = this.props.source_changed ? "tile-panel-heading tile-source-changed" : "tile-panel-heading";
        let draghandle_position_dict = {position: "absolute", bottom: 2, right: 1};
        return (
            <Card ref={this.my_ref} elevation={2} style={this.main_style} className={tile_class} id={this.props.tile_id}>
                <div className={tph_class} >
                    <div className="left-glyphs" ref={this.left_glyphs_ref} style={this.lg_style}>
                        <ButtonGroup>
                        {this.props.shrunk &&
                            <GlyphButton
                                         icon="chevron-right"
                                         handleClick={this._toggleShrunk} />}

                        {!this.props.shrunk &&
                            <GlyphButton
                                         icon="chevron-down"
                                         handleClick={this._toggleShrunk} />}
                        <GlyphButton intent="primary"
                                     handleClick={this._toggleBack}
                                     icon="cog"/>
                         <Shandle tile_name={this.props.tile_name}/>
                        </ButtonGroup>
                    </div>

                    <div className="right-glyphs" ref={this.right_glyphs_ref}>
                        <ButtonGroup>
                        {this.props.show_spinner && <Spinner size={17} />}

                        <GlyphButton handleClick={this._toggleTileLog}
                                     tooltip="Show tile container log"
                                     icon="console"/>
                        <GlyphButton handleClick={this._logMe}
                                     tooltip="Send current display to log"
                                     icon="clipboard"/>
                        <GlyphButton handleClick={this._logParams}
                                     tooltip="Send current parameters to log"
                                     icon="th"/>
                        <GlyphButton intent="warning"
                                     handleClick={this._reloadTile}
                                     tooltip="Reload tile source from library and rerun"
                                     icon="refresh"/>
                        <GlyphButton intent="danger"
                                     handleClick={this._closeTile}
                                     ttooltip="Remove tile"
                                     icon="trash"/>
                        </ButtonGroup>
                    </div>
                </div>
                {!this.props.shrunk &&
                    <div ref={this.body_ref} style={this.panel_body_style} className="tile-body">
                        <Transition in={this.props.show_form} timeout={ANI_DURATION}>
                            {state => (
                                <div className="back" style={composeObjs(this.back_style, this.transitionStylesAltUp[state])}>
                                    <TileForm options={_.cloneDeep(this.props.form_data)}
                                              tile_id={this.props.tile_id}
                                              updateValue={this._updateOptionValue}
                                              handleSubmit={this._handleSubmitOptions}/>
                                </div>
                            )}
                        </Transition>
                        <Transition in={this.props.show_log} timeout={ANI_DURATION}>
                            {state => (
                                <div className="tile-log" ref={this.log_ref} 
                                     style={composeObjs(this.tile_log_style, this.transitionFadeStyles[state])}>
                                    <div className="tile-log-area">
                                        <pre style={{fontSize: 12}}>{this.props.log_content}</pre>
                                    </div>
                                </div>
                            )}
                        </Transition>
                        <Transition in={show_front} timeout={ANI_DURATION}>
                            {state => (
                            <div className="front" style={composeObjs(this.front_style, this.transitionStylesAltDown[state])}>
                                <div className="tile-display-area" style={this.state.tda_style} ref={this.tda_ref} dangerouslySetInnerHTML={front_dict}></div>
                            </div>
                            )}
                        </Transition>
                    </div>
                }
                <DragHandle position_dict={draghandle_position_dict}
                            dragStart={this._startResize}
                            onDrag={this._onResize}
                            dragEnd={this._stopResize}
                            direction="both"
                            iconSize={15}/>
            </Card>
        )
    }
}

TileComponent.propTypes = {
    tile_name: PropTypes.string,
    tile_id: PropTypes.string,
    form_data: PropTypes.array,
    front_content: PropTypes.string,
    javascript_code: PropTypes.string,
    javascript_arg_dict: PropTypes.object,
    source_changed: PropTypes.bool,
    tile_width: PropTypes.number,
    tile_height: PropTypes.number,
    show_form: PropTypes.bool,
    show_spinner: PropTypes.bool,
    shrunk: PropTypes.bool,
    show_log: PropTypes.bool,
    current_doc_name: PropTypes.string,
    setTileValue: PropTypes.func,
    setTileState: PropTypes.func,
    broadcast_event: PropTypes.func,
    handleReload: PropTypes.string,
    handleClose: PropTypes.func,
};

TileComponent.defaultProps = {
    javascript_code: null
};

let STileComponent = SortableElement(TileComponent);