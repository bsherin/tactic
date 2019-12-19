
import "../tactic_css/tactic_select.scss"

import React from "react";
import PropTypes from 'prop-types';

import { InputGroup, Menu, MenuItem, Button, Switch, Card } from "@blueprintjs/core";
import { Cell, Column, Table, ColumnHeaderCell, RegionCardinality } from "@blueprintjs/table";
import {Omnibar} from "@blueprintjs/select"
import _ from 'lodash';

import {postAjax} from "./communication_react.js"
import {doBinding} from "./utilities_react.js";

export {SearchForm}
export {BpSelectorTable}
export {LoadedTileList}
export {LibraryOmnibar}

function renderOmnibar (item, { modifiers, handleClick}) {
    return <SuggestionItem item={item} handleClick={handleClick}/>
}

class OmnibarItem extends React.Component{
    constructor(props) {
        super(props);
        doBinding(this)
    }

    _handleClick() {
        this.props.handleClick(this.props.item)
    }

    render() {
        return (
            <MenuItem
                active={this.props.modifiers.active}
                text={this.props.item.name}
                key={this.props.item.name}
                onClick={this._handleClick}
                shouldDismissPopover={true}
            />
        );
    }
}
OmnibarItem.propTypes = {
    item: PropTypes.string,
    modifiers: PropTypes.object,
    handleClick: PropTypes.func
};

class LibraryOmnibar extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
    }

    _itemRenderer(item, { modifiers, handleClick}) {
         return <OmnibarItem modifiers={modifiers} item={item} handleClick={handleClick}/>
    }

    _itemPredicate(query, item) {
        if (query.length == 0) {
            return false
        }
        let lquery = query.toLowerCase();
        let re = new RegExp("^" + query);

        return re.test(item.name.toLowerCase())
    }

    render () {
        return (
            <Omnibar items={this.props.items}
                         isOpen={this.props.showOmnibar}
                         onItemSelect={this.props.onItemSelect}
                         itemRenderer={this._itemRenderer}
                         itemPredicate={this._itemPredicate}
                         resetOnSelect={true}
                         onClose={this.props.handleClose}
                         />
        )
    }

}

LibraryOmnibar.propTypes = {
    items: PropTypes.array,
    onItemSelect: PropTypes.func,
    showOmnibar: PropTypes.bool,
    handleClose: PropTypes.func
};


class SearchForm extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
    }

    _handleSearchFieldChange(event) {
        this.props.update_search_state({"search_field_value": event.target.value});
    }

    _handleClearSearch() {
        this.props.update_search_state({"search_field_value": ""});
    }

    _handleSearchMetadataChange(event) {
        this.props.update_search_state({"search_metadata_checked": event.target.checked});
    }

    _handleSearchInsideChange(event) {
        this.props.update_search_state({"search_inside_checked": event.target.checked});

    }

    _handleSubmit(event) {
        event.preventDefault()
    }

    render() {
        return (
            <React.Fragment>
                <div className="d-flex flex-row mb-2 mt-2">
                    <InputGroup type="search"
                                      placeholder="Search"
                                   leftIcon="search"
                                      value={this.props.search_field_value}
                                      onChange={this._handleSearchFieldChange}
                                      style={{"width": 265}}
                                    autoCapitalize="none"
                                       autoCorrect="off"
                    />
                    <Button onClick={this._handleClearSearch} className="ml-2">
                            clear
                    </Button>

                {this.props.allow_search_metadata &&
                    <Switch label="metadata"
                                 className="ml-2"
                                large={false}
                                checked={this.props.search_metadata_checked}
                                onChange={this._handleSearchMetadataChange}
                    />
                }
                {this.props.allow_search_inside &&
                    <Switch label="inside"
                               className="ml-2"
                               large={false}
                               checked={this.props.search_inside_checked}
                               onChange={this._handleSearchInsideChange}
                    />
                }
                </div>
            </React.Fragment>
        )
    }
}

SearchForm.propTypes = {
    allow_search_inside: PropTypes.bool,
    allow_search_metadata: PropTypes.bool,
    update_search_state: PropTypes.func,
    search_field_value: PropTypes.string,
    search_inside_checked: PropTypes.bool,
    search_metadata_checked: PropTypes.bool
};

class BpSelectorTable extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {columnWidths: null}
        this.saved_data_list = null;
    }

    componentDidMount() {
        this.computeColumnWidths();
        this.saved_data_list = this.props.data_list;
    }

    computeColumnWidths() {
        if (this.props.data_list.length == 0) return;
        let column_names = Object.keys(this.props.columns);
        let cwidths = compute_initial_column_widths(column_names, this.props.data_list);
        this.setState({columnWidths: cwidths})
    }

    componentDidUpdate() {
        // this.props.my_ref.current.scrollTop = this.props.scroll_top;
        if ((this.state.columnWidths == null) || !_.isEqual(this.props.data_list, this.saved_data_list)) {
            this.computeColumnWidths();
            this.saved_data_list = this.props.data_list;
        }
    }

    _cellRendererCreator(column_name) {
        let self = this;
        return (rowIndex) => {
            let the_text;
            if (rowIndex >= self.props.data_list.length) {
                the_text = ""
            }
            else if (Object.keys(self.props.data_list[rowIndex]).includes(column_name)) {
                the_text = self.props.data_list[rowIndex][column_name];
            }
            else {
                the_text = ""
            }
            return (

                <Cell key={column_name}
                          interactive={true}
                          truncated={true}
                          tabIndex={-1}
                          wrapText={true}>
                    <React.Fragment>
                        <div onDoubleClick={()=>self.props.handleRowDoubleClick(self.props.data_list[rowIndex])}>{the_text}</div>
                    </React.Fragment>
                </Cell>
            )
        };
    }

    _renderMenu(sortColumn) {
            let sortAsc = () => {this.props.sortColumn(sortColumn, this.props.columns[sortColumn].sort_field, "ascending")};
            let sortDesc = () => {this.props.sortColumn(sortColumn, this.props.columns[sortColumn].sort_field, "descending")};
            return (
                <Menu>
                    <MenuItem icon="sort-asc" onClick={sortAsc} text="Sort Asc"/>
                    <MenuItem icon="sort-desc" onClick={sortDesc} text="Sort Desc"/>
                </Menu>
            );
        }

    render() {
        let self = this;
        let column_names = Object.keys(this.props.columns);
        let numRows = this.props.data_list.length;
        let columns = column_names.map((column_name)=> {
            const cellRenderer = self._cellRendererCreator(column_name);
            const columnHeaderCellRenderer = () => <ColumnHeaderCell name={column_name}
                        menuRenderer={()=>{return(self._renderMenu(column_name))}}/>;

            return <Column cellRenderer={cellRenderer}
                               enableColumnReordering={false}
                               columnHeaderCellRenderer={columnHeaderCellRenderer}
                               key={column_name}
                               name={column_name}/>
        });
        return (
            <Table numRows={numRows}
                   bodyContextMenuRenderer={(mcontext)=>this.props.renderBodyContextMenu(mcontext, this.props.data_list)}
                   enableColumnReordering={false}
                   enableColumnResizing={false}
                   enableMultipleSelection={true}
                   defaultRowHeight={23}
                   selectedRegions={this.props.selectedRegions}
                   enableRowHeader={false}
                   columnWidths={this.state.columnWidths}
                   selectionModes={[RegionCardinality.FULL_ROWS, RegionCardinality.CELLS]}
                   onSelection={(regions)=>this.props.onSelection(regions, this.props.data_list)}
                   >
                        {columns}
                </Table>
        )
    }
}

BpSelectorTable.propTypes = {
    columns: PropTypes.object,
    selectedRegions: PropTypes.array,
    data_list: PropTypes.array,
    sortColumn: PropTypes.func,
    onSelection: PropTypes.func,
    handleRowDoubleClick: PropTypes.func,
    identifier_field: PropTypes.string,
    handleAddTag: PropTypes.func
};

BpSelectorTable.defaultProps = {
    columns: {"name": {"sort_field": "name", "first_sort": "ascending"},
             "created": {"sort_field": "created_for_sort", "first_sort": "descending"},
            "updated": {"sort_field": "updated_for_sort", "first_sort": "ascending"},
            "tags": {"sort_field": "tags", "first_sort": "ascending"}},
    identifier_field: "name",
    active_row: 0,
    show_animations: false,
    handleSpaceBarPress: null,
    draggable: true
};

class LoadedTileList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {default_list: [],
                failed_list: [],
                other_list: []

        }
    }

    set_state_from_dict(tldict) {
        this.setState({
            default_list: tldict.default_tiles,
            failed_list: tldict.failed_loads,
            other_list: tldict.nondefault_tiles
        })
    }

    componentDidMount() {
        let self = this;
        this.props.tsocket.socket.on('update-loaded-tile-list', (data)=>self.set_state_from_dict(data.tile_load_dict));
        postAjax("get_loaded_tile_lists", {}, function(data) {
            let tldict = data.tile_load_dict;
            self.set_state_from_dict(tldict)
        })
    }

    render () {
        let default_items = this.state.default_list.map((tile_name) => (
            <p key={tile_name}>
                {tile_name}
            </p>
        ));
        let failed_items = this.state.failed_list.map((tile_name) => (
            <p key={tile_name}>
                <a style={{color: "red"}}>
                    {tile_name + "(failed)"}
                </a>
            </p>
        ));
        let other_loads = this.state.other_list.map((tile_name) => (
            <p key={tile_name}>
                {tile_name}
            </p>
        ));
        return (
            <div id="loaded_tile_widget" className="d-flex flex-row">
                <Card>
                    <h6>
                        Loaded Default
                    </h6>
                        {default_items}
                        {failed_items}
                </Card>
                <Card style={{marginLeft: 10}}>
                    <h6>
                        Loaded Other
                    </h6>
                        {other_loads}
                </Card>
            </div>
        )
    }
}

LoadedTileList.propTypes = {
    tsocket: PropTypes.object
};

const MAX_INITIAL_CELL_WIDTH = 300;

function compute_initial_column_widths(header_list, data_list) {
    const ncols = header_list.length;
    const max_field_width = MAX_INITIAL_CELL_WIDTH;

    // Get sample header and body cells

    // set up a canvas so that we can use it to compute the width of text
    let body_font = $($(".bp3-table-truncated-text")[0]).css("font");
    let canvas_element = document.getElementById("measure-canvas");
    let ctx = canvas_element.getContext("2d");
    let added_body_width = 15;

    let column_widths = {};
    let columns_remaining = [];
    for (let c of header_list) {
        column_widths[c] = 0;
        columns_remaining.push(c)
    }

    let the_row;
    let the_width;
    let the_text;
    let the_child;

    // Find the width of each body cell
    // Keep track of the largest value for each column
    // Once a column has the max value can ignore that column in the future.
    ctx.font = body_font;
    for (let r = 0; r < data_list.length; ++r) {
        if (columns_remaining.length == 0) {
            break;
        }
        the_row = data_list[r];
        let cols_to_remove = [];
        for (let c of columns_remaining) {
            the_text = the_row[c];
            the_width = ctx.measureText(the_text).width + added_body_width;

            if (the_width > max_field_width) {
                the_width = max_field_width;
                cols_to_remove.push(c)
            }

            if (the_width > column_widths[c]) {
                column_widths[c] = the_width
            }
        }
        for (let c of cols_to_remove) {
            let index = columns_remaining.indexOf(c);
            if (index !== -1) {
                columns_remaining.splice(index, 1);
            }
        }
    }
    let result = [];
    for (let c of header_list) {
        result.push(column_widths[c])
    }
    return result
}