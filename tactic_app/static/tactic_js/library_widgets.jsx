
export {SearchForm}
export {SelectorTable}

var Rbs = window.ReactBootstrap;

class SearchForm extends React.Component {

    render() {
        return (
            <Rbs.Form inline={true}>
                <Rbs.Form.Control as="input"
                                  placeholder="Search"
                                  value={this.props.search_field_value}
                                  onChange={this.props.onChange}/>
                <Rbs.Button variant="outline-secondary" type="button" onClick={this.props.handleClear}>
                        clear
                </Rbs.Button>
                {this.props.allow_search_inside &&
                    <Rbs.Form.Check inline label="search inside"
                                    checked={this.props.search_inside_checked}
                                    onChange={this.props.handleSearchInsideChange}
                    />
                }
                {this.props.allow_search_metadata &&
                    <Rbs.Form.Check inline label="search metadata"
                                    checked={this.props.search_metadata_checked}
                                    onChange={this.props.handleSearchMetadataChange}
                    />
                }
            </Rbs.Form>
        )
    }
}

SearchForm.propTypes = {
    handleClear: PropTypes.func,
    allow_search_inside: PropTypes.bool,
    allow_search_metadata: PropTypes.bool,
    search_inside_checked: PropTypes.bool,
    search_metadata_checked: PropTypes.bool,
    handleSearchInsideChange: PropTypes.func,
    handleSearchMetadataChange: PropTypes.func,
    onChange: PropTypes.func,
    search_field_value: PropTypes.string
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
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(event){
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
            <tr className={cname} id={this.props.row_index} onClick={this.handleClick}>
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
        this.handleMyClick = this.handleMyClick.bind(this);
        this.state = {
            "next_sort": this.props.first_sort,
            "sorting": false,
        }
    }

    handleMyClick() {
        this.props.handleHeaderCellClick(this.props.sort_field, this.state.next_sort);
        let next_sort = this.state.next_sort == "ascending" ? "descending" : "ascending";
        this.setState({"next_sort": next_sort, "sorting": true})
    }

    render() {
        if (this.state.sorting) {
            let icon = this.state.next_sort == "ascending" ? "sort-down" : "sort-up";
            return (
                <th onClick={this.handleMyClick}>
                    {this.props.name}
                    <span className={`fas fa-${icon}`}></span>
                </th>
            )
        }
        return (
            <th onClick={this.handleMyClick}>
                {this.props.name}
            </th>
        )
    }
}

SelectorHeaderCell.propTypes = {
    name: PropTypes.string,
    handleHeaderCellClick: PropTypes.func,
    sort_field: PropTypes.string,
    first_sort: PropTypes.string
};

class SelectorTableHeader extends React.Component {
    render() {
        let colnames = Object.keys(this.props.columns);
        let cells = colnames.map((col, index) =>
            <SelectorHeaderCell key={index}
                                name={col}
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
    columns: PropTypes.object,
    handleHeaderCellClick: PropTypes.func
};

class SelectorTable extends React.Component {
    constructor(props) {
        super(props);
        this.tbody_ref = React.createRef();
    }

    componentDidMount() {
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
            <table className="tile-table table sortable table-striped table-bordered table-sm">
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
    handleRowClick: PropTypes.func
};

SelectorTable.defaultProps = {
    columns: {"name": {"sort_field": "name", "first_sort": "ascending"},
             "created": {"sort_field": "created_for_sort", "first_sort": "descending"},
            "updated": {"sort_field": "updated_for_sort", "first_sort": "ascending"},
            "tags": {"sort_field": "tags", "first_sort": "ascending"}},
    active_row: 0
};
