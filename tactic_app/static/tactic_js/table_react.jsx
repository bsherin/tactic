
import {SelectList} from "./react_widgets.js";

export {MainTableCard}

var Rbs = window.ReactBootstrap;

class HeaderCell extends React.Component {

    render () {
        if (this.props.width == null) {
            return (
                <th>{this.props.header}</th>
            )
        }
        else {
            return (
                <th style={{width: this.props.width}}>{this.props.header}</th>
            )
        }

    }
}

HeaderCell.propTypes = {
    header: PropTypes.string,
    width: PropTypes.number
};

class TableHeader extends React.Component {

    render () {
        let header_cells;
        if (this.props.column_widths == null) {
            header_cells = this.props.column_names.map((name, index)=> (
                <HeaderCell header={name} key={name} width={null}/>
                )
            );
        }
        else {
            header_cells = this.props.column_names.map((name, index)=> (
                <HeaderCell header={name} key={name} width={this.props.column_widths[index]}/>
                )
            );
        }

        return (
            <thead><tr>
            {header_cells}
            </tr></thead>
        )
    }

}

TableHeader.propTypes = {
    column_names: PropTypes.array,
    column_widths: PropTypes.array
};

class BodyCell extends React.Component {

    render () {
        if (this.props.width == null) {
            return (
                <td contentEditable={this.props.editable}>{this.props.value}</td>
            )
        }
        else {
            return (
                <td style={{width: this.props.width}}
                    contentEditable={this.props.editable}>{this.props.value}</td>
            )
        }

    }
}

BodyCell.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    column_name: PropTypes.string,
    row_number: PropTypes.number,
    width: PropTypes.number
};

class BodyRow extends React.Component {

    render () {
        let cells;

        if (this.props.column_widths == null) {
            cells = this.props.column_names.map((colname) => (
                    <BodyCell value={this.props.row_dict[colname]}
                              key={colname}
                              column_name={colname}
                              width={null}
                              row_number={this.props.row_number}/>
                )
            );
        }
        else {
            cells = this.props.column_names.map((colname, index) => (
                    <BodyCell value={this.props.row_dict[colname]}
                              key={colname}
                              column_name={colname}
                              width={this.props.column_widths[index]}
                              row_number={this.props.row_number}/>
                )
            );
        }

        return (
            <tr>{cells}</tr>
        )
    }
}

BodyRow.propTypes = {
    column_names: PropTypes.array,
    row_dict: PropTypes.object,
    row_number: PropTypes.number,
    column_widths: PropTypes.array
};

class TableBody extends React.Component {
    render () {
        let style = {display: "block",
            overflowY: "auto",
            overflowX: "hidden",
            height: this.props.height
        };
        let rows = this.props.data_rows.map((row_dict, index) => (
            <BodyRow column_names={this.props.column_names}
                     row_dict={row_dict}
                     row_number={index}
                     key={index}
                     column_widths={this.props.column_widths}
            />
        ));
        return (
            <tbody ref={this.props.my_ref} style={style}>{rows}</tbody>
        )
    }
}

TableBody.propTypes = {
    data_rows: PropTypes.array,
    column_names: PropTypes.array,
    height: PropTypes.number,
    column_widths: PropTypes.array
};

function SmallSpinner () {
    return (
        <div className="d-flex">
            <span className=" loader-small"></span>
        </div>
    )
}

class MainTableCardHeader extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            search_field_value: null
        }
    }

    _handleSearchFieldChange(event) {
        this.setState({search_field_value: event.target.value})
    }

    _handleFilter() {
        this.props.handleFilter(this.state.search_field_value)
    }

    render () {
        return (
            <Rbs.Card.Header className="d-flex pl-2 pt-2 justify-content-between align-baseline">
                <div className="d-flex">
                    <div className="main-heading-element">
                        <Rbs.Button onClick={this.props.handleTableShrink}
                                    variant="outline-secondary"
                                    className="notclose">
                            <span className="far fa-minus-circle"></span>
                        </Rbs.Button>
                    </div>
                    <div className="main-heading-element">
                        <Rbs.Form inline={true}>
                            <Rbs.Form.Group>
                                <Rbs.Form.Label className="mx-2">{this.props.short_collection_name}</Rbs.Form.Label>
                                <SelectList option_list={this.props.doc_names}
                                            onChange={this.props.handleChangeDoc}
                                            value={this.props.doc_names[0]}
                                            height={35}
                                />
                            </Rbs.Form.Group>
                        </Rbs.Form>
                    </div>

                </div>
                <div className="d-flex">
                    {this.props.show_table_spinner && <SmallSpinner/>}
                    <div className="main-heading-element">
                        <Rbs.Form inline={true}
                                  onSubmit={this._handleSubmit}
                                  style={{flex: "flow:unset"}}>
                            <Rbs.Form.Control as="input"
                                              placeholder="Search"
                                              value={this.props.search_field_value}
                                              onChange={this._handleSearchFieldChange}
                                              size="sm"
                                              className="mr-2"/>
                            <Rbs.Button variant="outline-secondary" className="my-2 mr-1" type="button" size="sm"
                                        onClick={this._handleFilter}>
                                Filter
                            </Rbs.Button>
                            <Rbs.Button variant="outline-secondary" className="my-2 mr-1" type="button" size="sm"
                                        onClick={this.props.handleUnFilter}>
                                Unfilter
                            </Rbs.Button>
                        </Rbs.Form>

                    </div>

                </div>
            </Rbs.Card.Header>
        )
    }
}

MainTableCardHeader.propTypes = {
    handleTableShrink: PropTypes.func,
    handleFilter: PropTypes.func,
    handleUnFilter: PropTypes.func,
    short_collection_name: PropTypes.string,
    handleChangeDoc: PropTypes.func,
    doc_names: PropTypes.array,
    show_table_spinner: PropTypes.bool
};

const MAX_INITIAL_CELL_WIDTH = 400;
const EXTRA_TABLE_AREA_SPACE = 500;

class MainTableCard extends React.Component {

    constructor(props) {
        super(props);
        this.card_ref = React.createRef();
        this.tbody_ref = React.createRef();
        this.state = {
            mounted: false,
            column_widths: this.props.initial_column_widths
        };
        doBinding(this);
    }

    componentDidMount() {
        let cwidths = compute_initial_column_widths(this.props.column_names);
        this.setState({mounted: true, column_widths: cwidths});
    }

    _getBodyHeight() {
        if (!this.state.mounted) {
            return this.props.available_height - 50;
        }
        else {
            let top_offset = this.tbody_ref.current.getBoundingClientRect().top - this.card_ref.current.getBoundingClientRect().top;
            return this.props.available_height - top_offset
        }
    }

    render () {

        return (
            <Rbs.Card id="main-panel" ref={this.card_ref}>
                <MainTableCardHeader handleTableShink={this.props.handleTableShrink}
                                     handleFilter={this.props.handleFilter}
                                     handleUnFilter={this.props.handleUnFilter}
                                     short_collection_name={this.props.short_collection_name}
                                     handleChangeDoc={this.props.handleChangeDoc}
                                     doc_names={this.props.doc_names}
                                     show_table_spinner={this.props.show_table_spinner}/>
                <Rbs.Card.Body  id="table-wrapper">
                    <table id="table-area" style={{display: "block"}}>
                        <TableHeader column_names={this.props.column_names}
                                     column_widths={this.state.column_widths}
                        />
                        <TableBody my_ref={this.tbody_ref}
                                   data_rows={this.props.data_rows}
                                   column_names={this.props.column_names}
                                   column_widths={this.state.column_widths}
                                   height={this._getBodyHeight()}
                        />
                    </table>

                </Rbs.Card.Body>
            </Rbs.Card>
        )
    }
}

MainTableCard.propTypes = {
    handleTableShrink: PropTypes.func,
    handleFilter: PropTypes.func,
    handleUnFilter: PropTypes.func,
    short_collection_name: PropTypes.string,
    handleChangeDoc: PropTypes.func,
    doc_names: PropTypes.array,
    column_names: PropTypes.array,
    data_rows: PropTypes.array,
    show_table_spinner: PropTypes.bool,
    available_height: PropTypes.number
};


function compute_initial_column_widths(header_list) {
    const ncols = header_list.length;
    const max_field_width = MAX_INITIAL_CELL_WIDTH;

    // Get sample header and body cells
    let header_cell = $($("#table-wrapper th")[0]);
    let body_cell = $($("#table-wrapper td")[0]);

    // set up a canvas so that we can use it to compute the width of text
    let header_font = header_cell.css("font");
    let body_font = body_cell.css("font");
    let canvas_element = document.getElementById("measure-canvas");
    let ctx = canvas_element.getContext("2d");
    let added_header_width = parseInt(header_cell.css("padding-right")) + parseInt(header_cell.css("padding-left")) + 2;
    let added_body_width = parseInt(body_cell.css("padding-right")) + parseInt(body_cell.css("padding-left")) + 2;

    let header_row = $("#table-area thead tr")[0];
    let body_rows = $("#table-area tbody tr");

    let column_widths = [];
    let columns_remaining = [];
    for (let c = 0; c < ncols; ++c) {
        column_widths.push(0);
        columns_remaining.push(c)
    }
    // Get the width for each header column
    ctx.font = header_font;
    let the_row;
    let the_width;
    let the_text;
    let the_child;
    for (let c of columns_remaining) {
        the_child = header_row.cells[c];
        the_text = the_child.innerHTML;
        the_width = ctx.measureText(the_text).width + added_header_width;

        if (the_width > max_field_width) {
            the_width = max_field_width;
            let index = columns_remaining.indexOf(c);
            if (index !== -1) {
                columns_remaining.splice(index, 1);
            }
        }
        if (the_width > column_widths[c]) {
            column_widths[c] = the_width
        }
    }

    // Find the width of each body cell
    // Keep track of the largest value for each column
    // Once a column has the max value can ignore that column in the future.
    ctx.font = body_font;
    for (let r = 0; r < body_rows.length; ++r) {
        if (columns_remaining.length == 0) {
            break;
        }
        the_row = body_rows[r];
        let cols_to_remove = [];
        for (let c of columns_remaining) {
            the_child = the_row.cells[c];
            the_text = the_child.innerHTML;
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
    return column_widths;
}
