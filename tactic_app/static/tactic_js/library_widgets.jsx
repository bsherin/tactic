

import {Toolbar} from "./react_toolbar.js";

export {SearchForm}
export {SelectorTable}

var Rbs = window.ReactBootstrap;


class SearchForm extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            search_field_value: "",
            search_inside_checked: false,
            search_metadata_checked: false
        }
    }

    componentDidMount() {
        this._do_update()
    }

    _handleSearchFieldChange(event) {
        this.setState({"search_field_value": event.target.value}, this._do_update);

    }

    _handleClearSearch() {
        this.setState({"search_field_value": ""}, this._do_update);
    }

    _handleSearchMetadataChange(event) {
        this.setState({"search_metadata_checked": event.target.checked}, this._do_update);
    }

    _handleSearchInsideChange(event) {
        this.setState({"search_inside_checked": event.target.checked}, this._do_update);

    }

    _do_update() {
        this.props._update_match_lists(this.state.search_field_value,
            this.state.search_inside_checked,
            this.state.search_metadata_checked)
    }

    _handleSubmit(event) {
        event.preventDefault()
    }

    render() {
        return (
            <Rbs.Form inline={true}
                      onSubmit={this._handleSubmit}
            >
                <Rbs.Form.Control as="input"
                                  placeholder="Search"
                                  value={this.state.search_field_value}
                                  onChange={this._handleSearchFieldChange}/>
                <Rbs.Button variant="outline-secondary" type="button" onClick={this._handleClearSearch}>
                        clear
                </Rbs.Button>
                {this.props.allow_search_inside &&
                    <Rbs.Form.Check inline label="search inside"
                                    checked={this.state.search_inside_checked}
                                    onChange={this._handleSearchInsideChange}
                    />
                }
                {this.props.allow_search_metadata &&
                    <Rbs.Form.Check inline label="search metadata"
                                    checked={this.state.search_metadata_checked}
                                    onChange={this._handleSearchMetadataChange}
                    />
                }
            </Rbs.Form>
        )
    }
}

SearchForm.propTypes = {
    allow_search_inside: PropTypes.bool,
    allow_search_metadata: PropTypes.bool,
    _update_match_lists: PropTypes.func
};

class SelectorTableCell extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <td>
                {this.props.children}
            </td>
        )
    }
}


class SelectorTableRow extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this)
    }

    _handleClick(event){
        this.props.handleRowClick(this.props.data_dict, event.shiftKey);
        event.preventDefault()
    }

    render() {

        let cells = this.props.columns.map((col, index) =>
            <SelectorTableCell key={index}>
                {this.props.data_dict[col]}
            </SelectorTableCell>
        );

        let cname = this.props.active ? 'selector-button active' : 'selector-button';
        return (
            <tr className={cname} id={this.props.row_index} onClick={this._handleClick}
            >
                {cells}
            </tr>
        )
    }
}

SelectorTableRow.propTypes = {
    columns: PropTypes.array,
    row_index: PropTypes.number,
    data_dict: PropTypes.object,
    active: PropTypes.bool,
    handleRowClick: PropTypes.func,
};

class SelectorHeaderCell extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            "next_sort": this.props.first_sort,
        }
    }

    _handleMyClick() {
        this.props.handleHeaderCellClick(this.props.sort_field, this.state.next_sort);
        this.props.handleSetSortColumn(this.props.name);
        let next_sort = this.state.next_sort == "ascending" ? "descending" : "ascending";
        this.setState({"next_sort": next_sort, "sorting": true})
    }

    render() {
        if (this.props.sorting_column == this.props.name) {
            let icon = this.state.next_sort == "ascending" ? "sort-down" : "sort-up";
            return (
                <th onClick={this._handleMyClick}>
                    {this.props.name}
                    <span className={`fas fa-${icon}`} style={{marginLeft: 5}}></span>
                </th>
            )
        }
        return (
            <th onClick={this._handleMyClick}>
                {this.props.name}
            </th>
        )
    }
}

SelectorHeaderCell.propTypes = {
    name: PropTypes.string,
    sorting_column: PropTypes.string,
    handleSetSortColumn: PropTypes.func,
    handleHeaderCellClick: PropTypes.func,
    sort_field: PropTypes.string,
    first_sort: PropTypes.string
};

class SelectorTableHeader extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            sorting_column: null
        }
    }

    _handleSort(name) {
        this.setState({"sorting_column": name})
    }

    _setSortColumn(name) {
        this.setState({"sorting_column": name})
    }
    render() {
        let colnames = Object.keys(this.props.columns);
        let cells = colnames.map((col, index) =>
            <SelectorHeaderCell key={index}
                                name={col}
                                sorting_column={this.state.sorting_column}
                                sort_field={this.props.columns[col]["sort_field"]}
                                first_sort={this.props.columns[col]["first_sort"]}
                                handleHeaderCellClick={this.props.handleHeaderCellClick}
                                handleSetSortColumn={this._setSortColumn}
            />
        );
        return (
            <thead>
                <tr className='selector-button' key="header">
                    {cells}
                </tr>
            </thead>
        )
    }
}

SelectorTableHeader.propTypes = {
    columns: PropTypes.object,
    handleHeaderCellClick: PropTypes.func
};

class SelectorTable extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.tbody_ref = React.createRef();
    }

    componentDidMount() {
    }

    _handleKeyDown(event) {
        if (["ArrowDown", "ArrowUp"].includes(event.key)) {
            this.props.handleArrowKeyPress(event.key);
            event.preventDefault()
        }
    }

    render () {
        let colnames = Object.keys(this.props.columns);
        let trows = this.props.data_list.map((ddict, index) =>
            <SelectorTableRow columns={colnames}
                      data_dict={ddict}
                      key={ddict[colnames[0]]}
                      row_index={index}
                      active={this.props.selected_resource_names.includes(ddict.name)}
                      handleRowClick={this.props.handleRowClick}
            />
        );
        return (
            <table tabIndex="0"
                   onKeyDown={this._handleKeyDown}
                   className="tile-table table sortable table-striped table-bordered table-sm">
                <SelectorTableHeader columns={this.props.columns}
                                     handleHeaderCellClick={this.props.handleHeaderCellClick}
                />
                <tbody ref={this.tbody_ref}>
                    {trows}
                </tbody>
            </table>
        )
    }

}

SelectorTable.propTypes = {
    columns: PropTypes.object,
    data_list: PropTypes.array,
    selected_resource_names: PropTypes.array,
    handleHeaderCellClick: PropTypes.func,
    content_editable: PropTypes.bool,
    handleRowClick: PropTypes.func,
    handleArrowKeyPress: PropTypes.func
};

SelectorTable.defaultProps = {
    columns: {"name": {"sort_field": "name", "first_sort": "ascending"},
             "created": {"sort_field": "created_for_sort", "first_sort": "descending"},
            "updated": {"sort_field": "updated_for_sort", "first_sort": "ascending"},
            "tags": {"sort_field": "tags", "first_sort": "ascending"}},
    active_row: 0
};

