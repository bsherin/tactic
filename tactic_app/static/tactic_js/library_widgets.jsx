

export {SearchForm}
export {SelectorTable}
export {LoadedTileList}

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
        this.clickTimeout = null;
        this.state = {in: false,
            drag_hover: false}
    }

    _handleClick(event){
        this.props.handleRowClick(this.props.data_dict, event.shiftKey);
        event.preventDefault();
    }

    _handleClicks(event) {
        let self = this;
        event.persist();
        if (this.clickTimeout !== null) {
            this.props.handleRowDoubleClick(this.props.data_dict);
            clearTimeout(this.clickTimeout);
            this.clickTimeout = null
        }
        else {
            this.clickTimeout = setTimeout(()=>{
                self._handleClick(event);
                clearTimeout(this.clickTimeout);
                this.clickTimeout = null}, 300)
        }
    }

    componentDidMount() {
       this.setState({"in": true})
    }

    _handleDragStart(e) {
        set_datum(e, "resourcename", this.props.data_dict[this.props.identifier_field]);
    }

     _handleDragOver(e) {
        e.preventDefault();
        this.setState({"drag_hover": true});

    }

    _handleDragLeave(e) {
        e.preventDefault();
        this.setState({"drag_hover": false});
    }

    _handleDrop(e, index, targetName) {
        this.setState({"drag_hover": false});
        let tagname = get_datum(e, "tagname");
        if (tagname != "") {
            this.props.handleAddTag(this.props.data_dict[this.props.identifier_field], tagname);
        }
    }

    render() {
        let cells = this.props.columns.map((col, index) =>
            <SelectorTableCell key={index}>
                {this.props.data_dict[col]}
            </SelectorTableCell>
        );

        let cname = this.props.active ? 'selector-button active' : 'selector-button';
        if (this.state.drag_hover) {
            cname = cname + " draghover"
        }
        return (
            <tr className={cname}
                draggable={this.props.draggable}
                id={this.props.row_index}
                onClick={this._handleClicks}
                onDragStart={this._handleDragStart}
                onDrop={this._handleDrop}
                onDragOver={this._handleDragOver}
                onDragLeave={this._handleDragLeave}
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
    draggable: PropTypes.bool,
    identifier_field: PropTypes.string,
    handleAddTag: PropTypes.func,
    handleRowDoubleClick: PropTypes.func
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
                                  active={this.props.selected_resource_names.includes(ddict[this.props.identifier_field])}
                                  handleRowClick={this.props.handleRowClick}
                                  handleRowDoubleClick={this.props.handleRowDoubleClick}
                                  draggable={this.props.draggable}
                                  identifier_field={this.props.identifier_field}
                                  handleAddTag={this.props.handleAddTag}
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
    handleRowDoubleClick: PropTypes.func,
    handleArrowKeyPress: PropTypes.func,
    show_animations: PropTypes.bool,
    handleSpaceBarPress: PropTypes.func,
    identifier_field: PropTypes.string,
    draggable: PropTypes.bool,
    handleAddTag: PropTypes.func
};

SelectorTable.defaultProps = {
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
            <Rbs.Card.Text key={tile_name}>
                {tile_name}
            </Rbs.Card.Text>
        ));
        let failed_items = this.state.failed_list.map((tile_name) => (
            <Rbs.Card.Text key={tile_name}>
                <a style={{color: "red"}}>
                    {tile_name + "(failed)"}
                </a>
            </Rbs.Card.Text>
        ));
        let other_loads = this.state.other_list.map((tile_name) => (
            <Rbs.Card.Text key={tile_name}>
                {tile_name}
            </Rbs.Card.Text>
        ));
        return (
            <Rbs.CardGroup id="loaded_tile_widget" className="mt-3 ml-3">
                <Rbs.Card>
                    <Rbs.Card.Header className="pt-1 pb-1">
                        Loaded Default
                    </Rbs.Card.Header>
                    <Rbs.Card.Body className="pt-3 pb-3">
                        {default_items}
                        {failed_items}
                    </Rbs.Card.Body>
                </Rbs.Card>
                <Rbs.Card>
                    <Rbs.Card.Header className="pt-1 pb-1">
                        Loaded Other
                    </Rbs.Card.Header>
                    <Rbs.Card.Body className="pt-3 pb-3">
                        {other_loads}
                    </Rbs.Card.Body>
                </Rbs.Card>
            </Rbs.CardGroup>
        )
    }
}

LoadedTileList.propTypes = {
    tsocket: PropTypes.object
};

