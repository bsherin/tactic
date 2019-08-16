

export {SearchForm}
export {SelectorTable}

var Rbs = window.ReactBootstrap;

var Rtg = window.ReactTransitionGroup;


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
            <Rbs.Form inline={true}
                      className="my-2"
                      onSubmit={this._handleSubmit}
            >
                <Rbs.Form.Control as="input"
                                  placeholder="Search"
                                  value={this.props.search_field_value}
                                  onChange={this._handleSearchFieldChange}
                                  size="sm"
                                  className="mr-2"
                                  style={{"width": 265}}
                />
                <Rbs.Button variant="outline-secondary" type="button" size="sm" onClick={this._handleClearSearch}>
                        clear
                </Rbs.Button>
                {this.props.allow_search_inside &&
                    <Rbs.Form.Check inline label="search inside"
                                    size="sm"
                                    className="ml-3 form-control-sm"
                                    checked={this.props.search_inside_checked}
                                    onChange={this._handleSearchInsideChange}
                    />
                }
                {this.props.allow_search_metadata &&
                    <Rbs.Form.Check inline label="search metadata"
                                    size="sm"
                                    className="ml-3 form-control-sm"
                                    checked={this.props.search_metadata_checked}
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
    update_search_state: PropTypes.func,
    search_field_value: PropTypes.string,
    search_inside_checked: PropTypes.bool,
    search_metadata_checked: PropTypes.bool
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
        doBinding(this);
        this.state = {"in": false}
    }

    _handleClick(event){
        this.props.handleRowClick(this.props.data_dict, event.shiftKey);
        event.preventDefault();
    }

    componentDidMount() {
       this.setState({"in": true})
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
        this.props.handleHeaderCellClick(this.props.name, this.props.sort_field, this.state.next_sort);
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
    handleHeaderCellClick: PropTypes.func,
    sort_field: PropTypes.string,
    first_sort: PropTypes.string
};

class SelectorTableHeader extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    render() {
        let colnames = Object.keys(this.props.columns);
        let cells = colnames.map((col, index) =>
            <SelectorHeaderCell key={index}
                                name={col}
                                sorting_column={this.props.sorting_column}
                                sort_field={this.props.columns[col]["sort_field"]}
                                first_sort={this.props.columns[col]["first_sort"]}
                                handleHeaderCellClick={this.props.handleHeaderCellClick}
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
    sorting_column: PropTypes.string,
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
        if ((event.key == "Space") && (this.props.handleSpaceBarPress != null)) {
            this.props.handleSpaceBarPress(event.key);
            event.preventDefault()
        }
    }

    render () {
        let colnames = Object.keys(this.props.columns);
        let trows = this.props.data_list.map((ddict, index) =>
            <Rtg.CSSTransition key={ddict[colnames[0]]}
                               timeout={500}
                               classNames="table-row"
            >
                <SelectorTableRow columns={colnames}
                          data_dict={ddict}
                          row_index={index}
                          active={this.props.selected_resource_names.includes(ddict.name)}
                          handleRowClick={this.props.handleRowClick}
                />
            </Rtg.CSSTransition>
        );
        return (
            <table tabIndex="0"
                   onKeyDown={this._handleKeyDown}
                   className="tile-table table sortable table-striped table-bordered table-sm">
                <SelectorTableHeader columns={this.props.columns}
                                     sorting_column={this.props.sorting_column}
                                     handleHeaderCellClick={this.props.handleHeaderCellClick}
                />
                <Rtg.TransitionGroup component="tbody"
                                     ref={this.tbody_ref}
                                     enter={this.props.show_animations}
                                     exit={this.props.show_animations}
                >
                    {trows}
                </Rtg.TransitionGroup>
            </table>
        )
    }

}

SelectorTable.propTypes = {
    columns: PropTypes.object,
    sorting_column: PropTypes.string,
    data_list: PropTypes.array,
    selected_resource_names: PropTypes.array,
    handleHeaderCellClick: PropTypes.func,
    content_editable: PropTypes.bool,
    handleRowClick: PropTypes.func,
    handleArrowKeyPress: PropTypes.func,
    show_animations: PropTypes.bool,
    handleSpaceBarPress: PropTypes.func
};

SelectorTable.defaultProps = {
    columns: {"name": {"sort_field": "name", "first_sort": "ascending"},
             "created": {"sort_field": "created_for_sort", "first_sort": "descending"},
            "updated": {"sort_field": "updated_for_sort", "first_sort": "ascending"},
            "tags": {"sort_field": "tags", "first_sort": "ascending"}},
    active_row: 0,
    show_animations: false,
    handleSpaceBarPress: null
};

