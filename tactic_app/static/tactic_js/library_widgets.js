
import { postAjax } from "./communication_react.js";

export { SearchForm };
export { BpSelectorTable };
export { LoadedTileList };
export { LibraryOmnibar };

var Rtg = window.ReactTransitionGroup;
var Bp = blueprint;
let Bps = bpselect;
let Bpt = bptable;

function renderOmnibar(item, { modifiers, handleClick }) {
    return React.createElement(SuggestionItem, { item: item, handleClick: handleClick });
}

class OmnibarItem extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    _handleClick() {
        this.props.handleClick(this.props.item);
    }

    render() {
        return React.createElement(Bp.MenuItem, {
            active: this.props.modifiers.active,
            text: this.props.item.name,
            key: this.props.item.name,
            onClick: this._handleClick,
            shouldDismissPopover: true
        });
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

    _itemRenderer(item, { modifiers, handleClick }) {
        return React.createElement(OmnibarItem, { modifiers: modifiers, item: item, handleClick: handleClick });
    }

    _itemPredicate(query, item) {
        if (query.length == 0) {
            return false;
        }
        let lquery = query.toLowerCase();
        let re = new RegExp("^" + query);

        return re.test(item.name.toLowerCase());
    }

    render() {
        return React.createElement(Bps.Omnibar, { items: this.props.items,
            isOpen: this.props.showOmnibar,
            onItemSelect: this.props.onItemSelect,
            itemRenderer: this._itemRenderer,
            itemPredicate: this._itemPredicate,
            resetOnSelect: true,
            onClose: this.props.handleClose
        });
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
        this.props.update_search_state({ "search_field_value": event.target.value });
    }

    _handleClearSearch() {
        this.props.update_search_state({ "search_field_value": "" });
    }

    _handleSearchMetadataChange(event) {
        this.props.update_search_state({ "search_metadata_checked": event.target.checked });
    }

    _handleSearchInsideChange(event) {
        this.props.update_search_state({ "search_inside_checked": event.target.checked });
    }

    _handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        return React.createElement(
            React.Fragment,
            null,
            React.createElement(
                "div",
                { className: "d-flex flex-row mb-2 mt-2" },
                React.createElement(Bp.InputGroup, { type: "search",
                    placeholder: "Search",
                    leftIcon: "search",
                    value: this.props.search_field_value,
                    onChange: this._handleSearchFieldChange,
                    style: { "width": 265 },
                    autoCapitalize: "none",
                    autoCorrect: "off"
                }),
                React.createElement(
                    Bp.Button,
                    { onClick: this._handleClearSearch, className: "ml-2" },
                    "clear"
                ),
                this.props.allow_search_metadata && React.createElement(Bp.Switch, { label: "metadata",
                    className: "ml-2",
                    large: false,
                    checked: this.props.search_metadata_checked,
                    onChange: this._handleSearchMetadataChange
                }),
                this.props.allow_search_inside && React.createElement(Bp.Switch, { label: "inside",
                    className: "ml-2",
                    large: false,
                    checked: this.props.search_inside_checked,
                    onChange: this._handleSearchInsideChange
                })
            )
        );
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
        this.state = { columnWidths: null };
    }

    componentDidMount() {
        this.computeColumnWidths();
    }

    computeColumnWidths() {
        if (this.props.data_list.length == 0) return;
        let column_names = Object.keys(this.props.columns);
        let cwidths = compute_initial_column_widths(column_names, this.props.data_list);
        this.setState({ columnWidths: cwidths });
    }

    componentDidUpdate() {
        // this.props.my_ref.current.scrollTop = this.props.scroll_top;
        if (this.state.columnWidths == null) {
            this.computeColumnWidths();
        }
    }

    _cellRendererCreator(column_name) {
        let self = this;
        return rowIndex => {
            let the_text;
            if (Object.keys(self.props.data_list[rowIndex]).includes(column_name)) {
                the_text = self.props.data_list[rowIndex][column_name];
            } else {
                the_text = "";
            }
            return React.createElement(
                Bpt.Cell,
                { key: column_name,
                    interactive: true,
                    truncated: true,
                    tabIndex: -1,
                    wrapText: true },
                React.createElement(
                    React.Fragment,
                    null,
                    React.createElement(
                        "div",
                        { onDoubleClick: () => self.props.handleRowDoubleClick(self.props.data_list[rowIndex]) },
                        the_text
                    )
                )
            );
        };
    }

    _renderMenu(sortColumn) {
        let sortAsc = () => {
            this.props.sortColumn(sortColumn, this.props.columns[sortColumn].sort_field, "ascending");
        };
        let sortDesc = () => {
            this.props.sortColumn(sortColumn, this.props.columns[sortColumn].sort_field, "descending");
        };
        return React.createElement(
            Bp.Menu,
            null,
            React.createElement(Bp.MenuItem, { icon: "sort-asc", onClick: sortAsc, text: "Sort Asc" }),
            React.createElement(Bp.MenuItem, { icon: "sort-desc", onClick: sortDesc, text: "Sort Desc" })
        );
    }

    render() {
        let self = this;
        let column_names = Object.keys(this.props.columns);
        let columns = column_names.map(column_name => {
            const cellRenderer = self._cellRendererCreator(column_name);
            const columnHeaderCellRenderer = () => React.createElement(Bpt.ColumnHeaderCell, { name: column_name,
                menuRenderer: () => {
                    return self._renderMenu(column_name);
                } });
            return React.createElement(Bpt.Column, { cellRenderer: cellRenderer,
                enableColumnReordering: false,
                columnHeaderCellRenderer: columnHeaderCellRenderer,
                key: column_name,
                name: column_name });
        });
        return React.createElement(
            Bpt.Table,
            { numRows: this.props.data_list.length,
                bodyContextMenuRenderer: mcontext => this.props.renderBodyContextMenu(mcontext, this.props.data_list),
                enableColumnReordering: false,
                enableMultipleSelection: true,
                defaultRowHeight: 23,
                selectedRegions: this.props.selectedRegions,
                enableRowHeader: false,
                columnWidths: this.state.columnWidths,
                selectionModes: [Bpt.RegionCardinality.FULL_ROWS, Bpt.RegionCardinality.CELLS],
                onSelection: regions => this.props.onSelection(regions, this.props.data_list)
            },
            columns
        );
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
    columns: { "name": { "sort_field": "name", "first_sort": "ascending" },
        "created": { "sort_field": "created_for_sort", "first_sort": "descending" },
        "updated": { "sort_field": "updated_for_sort", "first_sort": "ascending" },
        "tags": { "sort_field": "tags", "first_sort": "ascending" } },
    identifier_field: "name",
    active_row: 0,
    show_animations: false,
    handleSpaceBarPress: null,
    draggable: true
};

class LoadedTileList extends React.Component {

    constructor(props) {
        super(props);
        this.state = { default_list: [],
            failed_list: [],
            other_list: []

        };
    }

    set_state_from_dict(tldict) {
        this.setState({
            default_list: tldict.default_tiles,
            failed_list: tldict.failed_loads,
            other_list: tldict.nondefault_tiles
        });
    }

    componentDidMount() {
        let self = this;
        this.props.tsocket.socket.on('update-loaded-tile-list', data => self.set_state_from_dict(data.tile_load_dict));
        postAjax("get_loaded_tile_lists", {}, function (data) {
            let tldict = data.tile_load_dict;
            self.set_state_from_dict(tldict);
        });
    }

    render() {
        let default_items = this.state.default_list.map(tile_name => React.createElement(
            "p",
            { key: tile_name },
            tile_name
        ));
        let failed_items = this.state.failed_list.map(tile_name => React.createElement(
            "p",
            { key: tile_name },
            React.createElement(
                "a",
                { style: { color: "red" } },
                tile_name + "(failed)"
            )
        ));
        let other_loads = this.state.other_list.map(tile_name => React.createElement(
            "p",
            { key: tile_name },
            tile_name
        ));
        return React.createElement(
            "div",
            { id: "loaded_tile_widget", className: "d-flex flex-row" },
            React.createElement(
                Bp.Card,
                null,
                React.createElement(
                    "h6",
                    null,
                    "Loaded Default"
                ),
                default_items,
                failed_items
            ),
            React.createElement(
                Bp.Card,
                { style: { marginLeft: 10 } },
                React.createElement(
                    "h6",
                    null,
                    "Loaded Other"
                ),
                other_loads
            )
        );
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
        columns_remaining.push(c);
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
                cols_to_remove.push(c);
            }

            if (the_width > column_widths[c]) {
                column_widths[c] = the_width;
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
        result.push(column_widths[c]);
    }
    return result;
}