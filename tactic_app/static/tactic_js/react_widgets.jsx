
export {LabeledSelectList, LabeledFormField, SelectList, OrderableTable}

var Rbs = window.ReactBootstrap;


class LabeledFormField extends React.Component {

    render() {
        let cname = this.props.show ? "form-group m-1" : "form-group m-1 d-none";
        return (
            <Rbs.Form.Group bsPrefix={cname}>
                <Rbs.Form.Label bsPrefix="form-label m-1">{this.props.label}</Rbs.Form.Label>
                <Rbs.Form.Control as="input" onChange={this.props.onChange} value={this.props.the_value}/>
            </Rbs.Form.Group>
        )
    }

}

LabeledFormField.propTypes = {
    show: PropTypes.bool,
    label: PropTypes.string,
    onChange: PropTypes.func,
    the_value: PropTypes.string
};

LabeledFormField.defaultProps = {
    show: true
};

function LabeledSelectList(props) {
    return (
        <Rbs.Form.Group bsPrefix="form-group m-1">
            <Rbs.Form.Label bsPrefix="form-label m-1">{props.label}</Rbs.Form.Label>
            <SelectList option_list={props.option_list} onChange={props.onChange} the_value={props.the_value}/>
        </Rbs.Form.Group>
    )

}

class SelectList extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        this.props.onChange(event.target.value)
    }
    render() {
        let sstyle = {"marginBottom": 5, "width": "auto"};
        let option_items = this.props.option_list.map((opt, index) =>
                <option key={index}>
                    {opt}
                </option>
        );
        return (
            <Rbs.Form.Control as="select"
                              style={sstyle}
                              onChange={this.handleChange}
                              value={this.props.the_value}
            >
                {option_items}
            </Rbs.Form.Control>
        )
    }
}

SelectList.propTypes = {
    option_list: PropTypes.array,
    handleChange: PropTypes.func,
    the_value: PropTypes.string
};


class SelectListNoRbs extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        this.props.handleChange(event.target.value)
    }
    render() {
        let sstyle = {"marginBottom": 5, "width": "auto"};
        let option_items = this.props.option_list.map((opt, index) =>
                <option key={index}>
                    {opt}
                </option>
        );
        return (
            <select style={sstyle}
                    className="form-control"
                    onChange={this.handleChange}
                    value={this.props.value}
            >
                {option_items}
            </select>
        )
    }
}

SelectListNoRbs.propTypes = {
    option_list: PropTypes.array,
    handleChange: PropTypes.func,
    value: PropTypes.string
};

class TableCell extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.td_ref = React.createRef()
    }

    handleChange(event) {
        let myval = this.td_ref.current.innerHTML.trim();
        this.props.handleCellChange(this.props.theRow, this.props.theCol, myval)
    }

    render () {
        return (
            <td contentEditable={this.props.content_editable}
                onBlur={this.handleChange}
                ref={this.td_ref}
                suppressContentEditableWarning={true}
            >
                {this.props.children}
            </td>
        )
    }
}

TableCell.propTypes = {
    content_editable: PropTypes.bool,
    handleCellChange:PropTypes.func,
    theRow: PropTypes.number,
    theColumn: PropTypes.string
};

class TableRow extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(){
        this.props.handleRowClick(this.props.row_index)
    }


    render() {

        let cells = this.props.columns.map((col, index) =>
            <TableCell key={index}
                       content_editable={this.props.content_editable}
                       theRow={this.props.row_index}
                       theCol={col}
                       handleCellChange={this.props.handleCellChange}
            >
                {this.props.data_dict[col]}
            </TableCell>
        );
        cells.push(
            <td key="999">
                <span className="ui-icon ui-icon-arrowthick-2-n-s"></span>
            </td>
        );

        let cname = this.props.active ? 'selector-button active' : 'selector-button';
        return (
            <tr className={cname} id={this.props.row_index} onClick={this.handleClick}>
                {cells}
            </tr>
        )
    }
}

TableRow.propTypes = {
    columns: PropTypes.array,
    row_index: PropTypes.number,
    data_dict: PropTypes.object,
    active: PropTypes.bool,
    handleRowClick: PropTypes.func,
    content_editable: PropTypes.bool,
    handleCellChange: PropTypes.func
};

TableRow.defaultProps = {
    content_editable: false
};

class TableHeader extends React.Component {
    render() {

        let cells = this.props.columns.map((col, index) =>
            <th key={index}>{col}</th>
        );
        cells.push(
            <th key="999"> </th>
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

TableHeader.propTypes = {
    columns: PropTypes.array,
};


class OrderableTable extends React.Component {
    constructor(props) {
        super(props);
        this.tbody_ref = React.createRef();
        this.update_option_order = this.update_option_order.bind(this);
        this.handleCellChange = this.handleCellChange.bind(this)
    }

    componentDidMount() {
        let self = this;
        $(this.tbody_ref.current).sortable( {
            handle: ".ui-icon",
            update: self.update_option_order
        })
    }

    handleCellChange(r, c, new_val) {
        let new_data_list = this.props.data_array;
        new_data_list[r][c] = new_val;
        this.props.handleChange(new_data_list)
    }

    update_option_order (event, ui) {
        let new_order = $(this.tbody_ref.current).sortable("toArray");
        let new_active_row = new_order.indexOf(String(this.props.active_row));
        let new_data_list = new_order.map((id, idx) => this.props.data_array[parseInt(id)]);
        this.props.handleChange(new_data_list);
        this.props.handleActiveRowChange(new_active_row)
    }

    render () {
        let trows = this.props.data_array.map((ddict, index) =>
            <TableRow columns={this.props.columns}
                      data_dict={ddict}
                      key={ddict[this.props.columns[0]]}
                      row_index={index}
                      active={index == this.props.active_row}
                      handleRowClick={this.props.handleActiveRowChange}
                      content_editable={this.props.content_editable}
                      handleCellChange={this.handleCellChange}
            />
        );
        return (
            <table className="tile-table table sortable table-striped table-bordered table-sm">
                <TableHeader columns={this.props.columns}/>
                <tbody ref={this.tbody_ref}>
                    {trows}
                </tbody>
            </table>
        )
    }

}

OrderableTable.propTypes = {
    columns: PropTypes.array,
    data_array: PropTypes.array,
    active_row: PropTypes.number,
    handleActiveRowChange: PropTypes.func,
    handleChange: PropTypes.func,
    content_editable: PropTypes.bool
};

OrderableTable.defaultProps = {
    content_editable: false
};