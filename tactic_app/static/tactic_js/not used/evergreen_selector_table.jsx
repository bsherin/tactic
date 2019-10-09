
export {SelectorTable}

var Et = evergreen;

class SelectorTableHeader extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    render() {
        let colnames = Object.keys(this.props.columns);
        let cells = colnames.map((col, index) =>
            <Et.Table.TextHeaderCell key={col}>{col}</Et.Table.TextHeaderCell>
        );
        return (
            <Et.Table.Head>
                {cells}
            </Et.Table.Head>
        )
    }
}

SelectorTableHeader.propTypes = {
    sorting_column: PropTypes.string,
    columns: PropTypes.object,
    handleHeaderCellClick: PropTypes.func
};

class SelectorTableRow extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.clickTimeout = null;
        this.state = {in: false,
            drag_hover: false}
    }

    _handleClick(){
        this.props.handleRowClick(this.props.data_dict);
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
            <Et.Table.TextCell key={index}>
                {this.props.data_dict[col]}
            </Et.Table.TextCell>
        );

        return (
            <Et.Table.Row className={""}
                          height={25}
                id={this.props.row_index}
                onSelect={this._handleClick}
                          isSelectable={true}
                          isSelected={this.props.active}
            >
                {cells}
            </Et.Table.Row>
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
    handleRowDoubleClick: PropTypes.func,
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
            <SelectorTableRow columns={colnames}
                              key={index}
                              data_dict={ddict}
                              row_index={index}
                              active={this.props.selected_resource_names.includes(ddict[this.props.identifier_field])}
                              handleRowClick={this.props.handleRowClick}
                              handleRowDoubleClick={this.props.handleRowDoubleClick}
                              draggable={this.props.draggable}
                              identifier_field={this.props.identifier_field}
                              handleAddTag={this.props.handleAddTag}
            />
        );
        return (
            <Et.Table>
                <SelectorTableHeader columns={this.props.columns}
                                     sorting_column={this.props.sorting_column}
                                     handleHeaderCellClick={this.props.handleHeaderCellClick}
                />
                <Et.Table.Body height={500}>
                    {trows}
                </Et.Table.Body>
            </Et.Table>
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