
import "../tactic_css/tactic_select.scss"

import React from "react";
import PropTypes from 'prop-types';
import hash from "object-hash"

import { InputGroup, HotkeysProvider, Menu, MenuItem, Icon, FormGroup, Switch, Button, ButtonGroup } from "@blueprintjs/core";
import { Cell, Column, Table2, ColumnHeaderCell, RegionCardinality, TruncatedFormat, Regions } from "@blueprintjs/table";
import {Omnibar} from "@blueprintjs/select"
import _ from 'lodash';


import {doBinding} from "./utilities_react.js";

export {SearchForm}
export {BpSelectorTable}
export {LibraryOmnibar}

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
                text={this.props.item}
                key={this.props.item}
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
        this.state = {items: []}
    }

    componentDidUpdate(prevProps) {
        if (this.props.showOmnibar && !prevProps.showOmnibar) {
            let self = this;
            $.getJSON($SCRIPT_ROOT + `get_resource_names/${this.props.res_type}`, function (data) {
                self.setState({items: data["resource_names"]});
            })
        }
    }

    static _itemRenderer(item, { modifiers, handleClick}) {
         return <OmnibarItem modifiers={modifiers} item={item} handleClick={handleClick}/>
    }

    static _itemPredicate(query, item) {
        if (query.length == 0) {
            return false
        }
        let lquery = query.toLowerCase();
        let re = new RegExp(query);

        return re.test(item.toLowerCase())
    }

    render () {
        return (
            <Omnibar items={this.state.items}
                     className={window.dark_theme ? "bp4-dark" : ""}
                     isOpen={this.props.showOmnibar}
                     onItemSelect={this.props.onItemSelect}
                     itemRenderer={LibraryOmnibar._itemRenderer}
                     itemPredicate={LibraryOmnibar._itemPredicate}
                     resetOnSelect={true}
                     onClose={this.props.handleClose}
                     />
        )
    }

}

LibraryOmnibar.propTypes = {
    res_type: PropTypes.string,
    onItemSelect: PropTypes.func,
    showOmnibar: PropTypes.bool,
    handleClose: PropTypes.func,
    dark_theme: PropTypes.bool,
};

LibraryOmnibar.defaultProps = {
    dark_theme: false
};


class SearchForm extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.current_timer = null;
        this.state = {
            temp_text: null
        };
        this.temp_text = null;
    }

    _handleSearchFieldChange(event) {
        if (this.current_timer) {
            clearTimeout(this.current_timer);
            this.current_timer = null;
        }
        let self = this;
        let newval = event.target.value;
        this.current_timer = setTimeout(()=> {
                self.current_timer = null;
                self.props.update_search_state({"search_string": newval})
            }, self.props.update_delay);
        this.setState({temp_text: newval});
    }

    _handleClearSearch() {
        this.props.update_search_state({"search_string": ""});
    }

    _handleSearchMetadataChange(event) {
        this.props.update_search_state({"search_metadata": event.target.checked});
    }

    _handleSearchInsideChange(event) {
        this.props.update_search_state({"search_inside": event.target.checked});

    }

    _handleShowHiddenChange(event) {
        this.props.update_search_state({"show_hidden": event.target.checked});
    }

    _handleRegexChange(event) {
        this.props.update_search_state({"regex": event.target.checked});
    }

    static _handleSubmit(event) {
        event.preventDefault()
    }

    render() {
        let match_text;
        if (this.props.number_matches != null && this.props.search_string && this.props.search_string != "") {
            switch (this.props.number_matches) {
                case 0:
                    match_text = "no matches";
                    break;
                case 1:
                    match_text = "1 match";
                    break;
                default:
                    match_text = `${this.props.number_matches} matches`;
                    break;
            }
        }
        else {
            match_text = null
        }
        let current_text = this.current_timer ? this.state.temp_text : this.props.search_string;
        return (
            <React.Fragment>
                <FormGroup ref={this.form_ref} helperText={match_text} style={{marginBottom: 0}}>
                    <div className="d-flex flex-row" style={{marginTop: 5, marginBottom: 5}}>
                        <InputGroup type="search"
                                    className="search-input"
                                    placeholder="Search"
                                    leftIcon="search"
                                    value={current_text}
                                    onChange={this._handleSearchFieldChange}
                                    style={{"width": this.props.field_width}}
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    small={true}
                                    inputRef={this.props.search_ref}
                        />
                    {this.props.allow_regex &&
                        <Switch label="regexp"
                                   className="ml-3 mb-0 mt-1"
                                   large={false}
                                   checked={this.props.regex}
                                   onChange={this._handleRegexChange}
                        />
                    }
                    {this.props.allow_search_metadata &&
                        <Switch label="metadata"
                                     className="ml-3 mb-0 mt-1"
                                    large={false}
                                    checked={this.props.search_metadata}
                                    onChange={this._handleSearchMetadataChange}
                        />
                    }
                    {this.props.allow_search_inside &&
                        <Switch label="inside"
                                   className="ml-3 mb-0 mt-1"
                                   large={false}
                                   checked={this.props.search_inside}
                                   onChange={this._handleSearchInsideChange}
                        />
                    }
                    {this.props.allow_show_hidden &&
                        <Switch label="show hidden"
                                   className="ml-3 mb-0 mt-1"
                                   large={false}
                                   checked={this.props.show_hidden}
                                   onChange={this._handleShowHiddenChange}
                        />
                    }
                        {this.props.include_search_jumper &&
                            <ButtonGroup style={{marginLeft: 5, padding: 2}}>
                                <Button onClick={this.props.searchNext} icon="caret-down" text={undefined} small={true}/>
                                <Button onClick={this.props.searchPrev} icon="caret-up" text={undefined} small={true}/>
                            </ButtonGroup>

                        }
                    </div>
                </FormGroup>
            </React.Fragment>
        )
    }
}

SearchForm.propTypes = {
    allow_search_inside: PropTypes.bool,
    allow_search_metadata: PropTypes.bool,
    allow_show_hidden: PropTypes.bool,
    allow_regex: PropTypes.bool,
    regex: PropTypes.bool,
    update_search_state: PropTypes.func,
    search_string: PropTypes.string,
    search_inside: PropTypes.bool,
    search_metadata: PropTypes.bool,
    show_hidden: PropTypes.bool,
    field_with: PropTypes.number,
    include_search_jumper: PropTypes.bool,
    searchNext: PropTypes.func,
    searchPrev: PropTypes.func,
    search_ref: PropTypes.object,
    number_matches: PropTypes.number,
    update_delay: PropTypes.number
};

SearchForm.defaultProps = {
    allow_search_inside: false,
    allow_search_metadata: false,
    allow_show_hidden: false,
    allow_regex: false,
    regex: false,
    search_inside: false,
    search_metadata: false,
    show_hidden: false,
    field_width: 265,
    include_search_jumper: false,
    current_search_number: null,
    searchNext: null,
    searchPrev: null,
    search_ref: null,
    number_matches: null,
    update_delay: 500
};

class BpSelectorTable extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {columnWidths: null};
        this.saved_data_dict = null;
        this.data_update_required = null;
        this.table_ref = React.createRef();
    }

    componentDidMount() {
        this.computeColumnWidths();
        this.saved_data_dict = this.props.data_dict;
    }

    computeColumnWidths() {
        if (Object.keys(this.props.data_dict).length == 0) return;
        let column_names = Object.keys(this.props.columns);
        let bcwidths = compute_initial_column_widths(column_names, Object.values(this.props.data_dict));
        let cwidths = [];
        if (this.props.maxColumnWidth) {
            for (let c of bcwidths) {
                if (c > this.props.maxColumnWidth) {
                    cwidths.push(this.props.maxColumnWidth)
                }
                else {
                    cwidths.push(c)
                }
            }
        }
        else {
            cwidths = bcwidths
        }

        let self = this;
        this.setState({columnWidths: cwidths}, ()=>{
            let the_sum = this.state.columnWidths.reduce((a,b) => a + b, 0);
            self.props.communicateColumnWidthSum(the_sum)
        })
    }

    componentDidUpdate() {
        // this.props.my_ref.current.scrollTop = this.props.scroll_top;
        if ((this.state.columnWidths == null) || !_.isEqual(this.props.data_dict, this.saved_data_dict)) {
            this.computeColumnWidths();
            this.saved_data_dict = this.props.data_dict;
        }
    }

    _onCompleteRender() {
        if (this.data_update_required != null) {
            this.props.initiateDataGrab(this.data_update_required);
            this.data_update_required = null
        }
        const lastColumnRegion = Regions.column(Object.keys(this.props.columns).length - 1);
        const firstColumnRegion = Regions.column(0);
        this.table_ref.current.scrollToRegion(lastColumnRegion);
        this.table_ref.current.scrollToRegion(firstColumnRegion)
    }

    haveRowData(rowIndex) {
        return this.props.data_dict.hasOwnProperty(rowIndex)
    }

    _cellRendererCreator(column_name) {
        let self = this;
        return (rowIndex) => {
            if (!this.haveRowData(rowIndex)) {
                if (self.data_update_required == null) {
                    self.data_update_required = rowIndex;
                }

                return (<Cell key={column_name}
                              loading={true}>
                    </Cell>
                )
            }
            let the_body;
            let the_class = "";
            if (Object.keys(self.props.data_dict[rowIndex]).includes(column_name)) {

                if ("hidden" in self.props.data_dict[rowIndex] && self.props.data_dict[rowIndex]["hidden"]) {
                    the_class = "hidden_cell"
                }
                let the_text = String(self.props.data_dict[rowIndex][column_name]);
                if (the_text.startsWith("icon:")) {
                    the_text = the_text.replace(/(^icon:)/gi, "");
                    the_body = <Icon icon={the_text} size={14}/>
                }
                else {
                    the_body = (<TruncatedFormat className={the_class}>
                                {the_text}
                            </TruncatedFormat>)
                }

            }
            else {
                the_body = ""
            }
            let tclass;
            if (this.props.open_resources &&
                this.props.open_resources.includes(this.props.data_dict[rowIndex][this.props.identifier_field])) {
                tclass = "open-selector-row";
            }
            else {
                tclass = ""
            }
            return (
                <Cell key={column_name}
                          interactive={true}
                          truncated={true}
                          tabIndex={-1}
                          onKeyDown={this.props.keyHandler}
                          wrapText={true}>
                    <React.Fragment>
                        <div className={tclass} onDoubleClick={()=>self.props.handleRowDoubleClick(self.props.data_dict[rowIndex])}>
                                {the_body}
                        </div>
                    </React.Fragment>
                </Cell>
            )
        };
    }

    _renderMenu(sortColumn) {
        if (!this.props.columns[sortColumn].sort_field) return null;
        let sortAsc = () => {this.props.sortColumn(sortColumn, this.props.columns[sortColumn].sort_field, "ascending")};
        let sortDesc = () => {this.props.sortColumn(sortColumn, this.props.columns[sortColumn].sort_field, "descending")};
        return (
            <Menu>
                <MenuItem icon="sort-asc" onClick={sortAsc} text="Sort Asc"/>
                <MenuItem icon="sort-desc" onClick={sortDesc} text="Sort Desc"/>
            </Menu>
        );
    }

    static _columnHeaderNameRenderer(the_text) {
        let the_body;
        the_text = String(the_text);
        if (the_text.startsWith("icon:")) {
            the_text = the_text.replace(/(^icon:)/gi, "");
            the_body = <Icon icon={the_text} size={14}/>
        }
        else {
            the_body = <div className="bp4-table-truncated-text">{the_text}</div>
        }
        return the_body
    }

    render() {
        let self = this;
        let column_names = Object.keys(this.props.columns);
        let columns = column_names.map((column_name)=> {
            const cellRenderer = self._cellRendererCreator(column_name);
            const columnHeaderCellRenderer = () => <ColumnHeaderCell name={column_name}
                                                                     nameRenderer={BpSelectorTable._columnHeaderNameRenderer}
                        menuRenderer={()=>{return(self._renderMenu(column_name))}}/>;

            return <Column cellRenderer={cellRenderer}
                               enableColumnReordering={false}
                               columnHeaderCellRenderer={columnHeaderCellRenderer}
                               key={column_name}
                               name={column_name}/>
        });
        let obj = {cwidths: this.state.columnWidths, nrows: this.props.num_rows};
        let hsh = hash(obj);

        return (
            <HotkeysProvider>
            <Table2 numRows={this.props.num_rows}
                   // key={this.props.num_rows}
                   ref={this.table_ref}
                    cellRendererDependencies={[self.props.data_dict]}
                   bodyContextMenuRenderer={(mcontext)=>this.props.renderBodyContextMenu(mcontext)}
                   enableColumnReordering={false}
                   enableColumnResizing={this.props.enableColumnResizing}
                   maxColumnWidth={this.props.maxColumnWidth}
                   enableMultipleSelection={true}
                   defaultRowHeight={23}
                   selectedRegions={this.props.selectedRegions}
                   enableRowHeader={false}
                   columnWidths={this.state.columnWidths}
                   onCompleteRender={this._onCompleteRender}
                   selectionModes={[RegionCardinality.FULL_ROWS, RegionCardinality.CELLS]}
                   onSelection={(regions)=>this.props.onSelection(regions)}
                   >
                        {columns}
                </Table2>
            </HotkeysProvider>
        )
    }
}

BpSelectorTable.propTypes = {
    columns: PropTypes.object,
    open_resources: PropTypes.array,
    maxColumnWidth: PropTypes.number,
    enableColumnResizing: PropTypes.bool,
    selectedRegions: PropTypes.array,
    data_dict: PropTypes.object,
    num_rows: PropTypes.number,
    keyHandler: PropTypes.func,
    communicateColumnWidthSum: PropTypes.func,
    sortColumn: PropTypes.func,
    onSelection: PropTypes.func,
    handleRowDoubleClick: PropTypes.func,
    identifier_field: PropTypes.string,
};

BpSelectorTable.defaultProps = {
    columns: {"name": {"sort_field": "name", "first_sort": "ascending"},
             "created": {"sort_field": "created_for_sort", "first_sort": "descending"},
            "updated": {"sort_field": "updated_for_sort", "first_sort": "ascending"},
            "tags": {"sort_field": "tags", "first_sort": "ascending"}},
    identifier_field: "name",
    enableColumnResigin: false,
    maxColumnWidth: null,
    active_row: 0,
    show_animations: false,
    handleSpaceBarPress: null,
    keyHandler: null,
    draggable: true
};

const MAX_INITIAL_CELL_WIDTH = 300;
const ICON_WIDTH = 35;

function compute_initial_column_widths(header_list, data_list) {
    const ncols = header_list.length;
    const max_field_width = MAX_INITIAL_CELL_WIDTH;

    // Get sample header and body cells

    // set up a canvas so that we can use it to compute the width of text
    let body_font = $($(".bp4-table-truncated-text")[0]).css("font");
    let header_font = $($(".bp4-table-column-name-text")[0]).css("font");
    let canvas_element = document.getElementById("measure-canvas");
    let ctx = canvas_element.getContext("2d");
    let added_body_width = 20;
    let added_header_width = 30;

    let column_widths = {};
    let columns_remaining = [];
    ctx.font = header_font;
    for (let c of header_list) {
        let cstr = String(c);
        if (cstr.startsWith("icon:")) {
            column_widths[cstr] = ICON_WIDTH
        }
        else {
            column_widths[cstr] = ctx.measureText(cstr).width + added_header_width;
        }
        columns_remaining.push(cstr)
    }
    let the_row;
    let the_width;
    let the_text;
    let the_child;

    // Find the width of each body cell
    // Keep track of the largest value for each column
    // Once a column has the max value can ignore that column in the future.
    ctx.font = body_font;
    for (const item of data_list) {
        if (columns_remaining.length == 0) {
            break;
        }
        the_row = item;
        let cols_to_remove = [];
        for (let c of columns_remaining) {
            the_text = String(the_row[c]);
            if (the_text.startsWith("icon:")) {
                the_width = ICON_WIDTH
            }
            else {
                the_width = ctx.measureText(the_text).width + added_body_width;
            }

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