
import {SelectList} from "./react_widgets.js";

export {MainTableCard}

var Rbs = window.ReactBootstrap;

class HeaderCell extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this)
    }

    _handleDragStart(e) {
        set_datum(e, "colname", this.props.header);
    }

    _handleDragOver(e) {
        e.preventDefault();
    }

    _handleDragLeave(e) {
        e.preventDefault();
    }

    _setSelected() {
        if (this.props.header == this.props.selected_column) {
            this.props.setSelectedColumn(null)
        }
        else {
            this.props.setSelectedColumn(this.props.header)
        }
    }

    _handleDrop(e, index, targetname) {
        this.props.moveColumn(get_datum(e, "colname"), this.props.header)
    }

    render () {
        let style = {};
        if (this.props.width != null) {
            style.width = this.props.width
        }
        if (!this.props.visible) {
            style.display = "none"
        }
        return (
            <th style={style}
                onClick={this._setSelected}
                draggable={true}
                onDragStart={this._handleDragStart}
                onDrop={this._handleDrop}
                onDragOver={this._handleDragOver}
                onDragLeave={this._handleDragLeave}
                className="can-resize">
                {this.props.header}
            </th>
        )
    }
}

HeaderCell.propTypes = {
    header: PropTypes.string,
    width: PropTypes.number,
    visible: PropTypes.bool,
    selected_column: PropTypes.string,
    setSelectedColumn: PropTypes.func,
    moveColumn: PropTypes.func,
    handleColumnDrag: PropTypes.func
};


class TableHeader extends React.Component {

    render () {
        let header_cells;
        if (this.props.column_widths == null) {
            header_cells = this.props.column_names.map((name, index)=> (
                <HeaderCell header={name}
                            visible={!this.props.hidden_columns_list.includes(name)}
                            key={name}
                            width={null}
                            moveColumn={this.props.moveColumn}
                            selected_column={this.props.selected_column}
                            setSelectedColumn={this.props.setSelectedColumnm}
                    />
                )
            );
        }
        else {
            header_cells = this.props.column_names.map((name, index)=> (
                <HeaderCell header={name}
                            visible={!this.props.hidden_columns_list.includes(name)}
                            key={name}
                            width={this.props.column_widths[index]}
                            moveColumn={this.props.moveColumn}
                            selected_column={this.props.selected_column}
                            setSelectedColumn={this.props.setSelectedColumn}/>
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
    column_widths: PropTypes.array,
    hidden_columns_list: PropTypes.array,
    selected_column: PropTypes.string,
    setSelectedColumn: PropTypes.func,
    moveColumn: PropTypes.func

};

class BodyCell extends React.Component {

    render () {
        let style = {};
        if (this.props.width != null) {
            style.width = this.props.width
        }
        if (!this.props.visible) {
            style.display = "none"
        }
        let className;
        if (this.props.column_name == this.props.selected_column) {
            className= "selected-column"
        }
        else {
            className= ""
        }
        let the_text = this.props.value;
        if ((this.props.alt_search_text != null) && (this.props.alt_search_text != "")) {
            const regex = new RegExp(this.props.alt_search_text, "gi");
            the_text = String(the_text).replace(regex, function (matched) {
                    return "<mark>" + matched + "</mark>";
                })
        }
        else if ((this.props.search_text != null) && (this.props.search_text != "")) {
            const regex = new RegExp(this.props.search_text, "gi");
            the_text = String(the_text).replace(regex, function (matched) {
                    return "<mark>" + matched + "</mark>";
                })
        }
        let converted_dict = {__html: the_text};
        return (
            <td style={style} className={className}
                contentEditable={this.props.editable}
                dangerouslySetInnerHTML={converted_dict}></td>
        )
    }
}

BodyCell.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    column_name: PropTypes.string,
    row_number: PropTypes.number,
    width: PropTypes.number,
    visible: PropTypes.bool,
    selected_column: PropTypes.string,
    search_text: PropTypes.string,
    alt_search_text: PropTypes.string
};

class SpinnerRow extends React.Component {

    constructor(props) {
        super(props);
            this.row_ref = React.createRef()
    }

    componentDidMount() {
        let self = this;
        var intersectionObserver = new IntersectionObserver(function(entries) {
          if (entries[0].intersectionRatio <= 0) return;
          if (self.props.first_or_last == "first") {
              self.props.handleFirstInView()
          }
          else {
              self.props.handleLastInView()
          }
        });
        intersectionObserver.observe(this.row_ref.current);
    }

    render () {
        let cells = [];
        if (this.props.column_widths != null) {
            for (let c=0; c < this.props.column_widths.length; ++c) {
                if (!this.props.hidden_columns_list.includes(this.props.column_names[c])) {
                    cells.push(
                        <td style={{width: this.props.column_widths[c]}} key={c}>
                            {c == 0 && <span className="loader-small"></span>}
                        </td>
                    )
                }
            }
        }
        else {
            cells = <td ><span className="loader-small"></span></td>;
        }
        return (
            <tr className="spinner-row" ref={this.row_ref}>
                {cells}
            </tr>
        )
    }
}

SpinnerRow.propTypes = {
    first_or_last: PropTypes.string,
    hidden_columns_list: PropTypes.array,
    column_names: PropTypes.array,
    handleLastInView: PropTypes.func,
    handleFirstInView: PropTypes.func
};

class BodyRow extends React.Component {
     constructor(props) {
        super(props);
        doBinding(this)
    }

    _handleClick() {
         if (this.props.selected_row == this.props.row_number) {
            this.props.setSelectedRow(null)
         }
         else {
             this.props.setSelectedRow(this.props.row_number)
         }
    }

    render () {
        let cells;
        if (this.props.column_widths == null) {
            cells = this.props.column_names.map((colname) => (
                    <BodyCell value={this.props.row_dict[colname]}
                              key={colname}
                              column_name={colname}
                              width={null}
                              visible={!this.props.hidden_columns_list.includes(colname)}
                              row_number={this.props.row_number}
                              selected_column={this.props.selected_column}
                              search_text={this.props.search_text}
                    />
                )
            );
        }
        else {
            cells = this.props.column_names.map((colname, index) => (
                    <BodyCell value={this.props.row_dict[colname]}
                              key={colname}
                              column_name={colname}
                              width={this.props.column_widths[index]}
                              visible={!this.props.hidden_columns_list.includes(colname)}
                              row_number={this.props.row_number}
                              selected_column={this.props.selected_column}
                              search_text={this.props.search_text}
                              alt_search_text={this.props.alt_search_text}
                    />
                )
            );
        }
        let className = this.props.selected_row == this.props.row_number ? "selected-row" : "";
        return (
            <tr className={className} onClick={this._handleClick}>{cells}</tr>
        )
    }
}

BodyRow.propTypes = {
    index: PropTypes.number,
    column_names: PropTypes.array,
    row_dict: PropTypes.object,
    row_number: PropTypes.number,
    column_widths: PropTypes.array,
    hidden_columns_list: PropTypes.array,
    selected_column: PropTypes.string,
    selected_row: PropTypes.number,
    setSelectedRow: PropTypes.func,
    search_text: PropTypes.string,
    alt_search_text: PropTypes.string
};

class TableBody extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this)
    }

    _handleScroll() {
        this.props.handleScroll(this.props.my_ref.current.scrollTop)
    }

    componentDidUpdate() {
        this.props.my_ref.current.scrollTop = this.props.scroll_top;
    }

    render () {
        let style = {display: "block",
            overflowY: "auto",
            overflowX: "hidden",
            height: this.props.height
        };
        let rows = [];

        if (!this.props.is_first_chunk){
            rows.push(<SpinnerRow key="first_spinner_row"
                                  first_or_last="first"
                                  handleFirstInView={this.props.handleFirstInView}
                                  column_widths={this.props.column_widths}
                                  column_names={this.props.column_names}
                                  hidden_columns_list={this.props.hidden_columns_list}
            />)
        }

        let new_rows =  this.props.data_rows.map((row_dict, index) => (
            <BodyRow column_names={this.props.column_names}
                     row_dict={row_dict}
                     row_number={index}
                     key={index}
                     column_widths={this.props.column_widths}
                     hidden_columns_list={this.props.hidden_columns_list}
                     index={index}
                     selected_column={this.props.selected_column}
                     selected_row={this.props.selected_row}
                     setSelectedRow={this.props.setSelectedRow}
                     search_text={this.props.search_text}
                     alt_search_text={this.props.alt_search_text}
            />
            ));
        rows.push(new_rows);
        if (!this.props.is_last_chunk) {
            rows.push(<SpinnerRow key="last_spinner_row"
                                  first_or_last="last"
                                  handleLastInView={this.props.handleLastInView}
                                  column_widths={this.props.column_widths}
                                  column_names={this.props.column_names}
                                  hidden_columns_list={this.props.hidden_columns_list}
            />)
        }
        return (
            <tbody onScroll={this._handleScroll} ref={this.props.my_ref} style={style}>{rows}</tbody>
        )
    }
}

TableBody.propTypes = {
    data_rows: PropTypes.array,
    column_names: PropTypes.array,
    height: PropTypes.number,
    column_widths: PropTypes.array,
    hidden_columns_list: PropTypes.array,
    handleFirstInView: PropTypes.func,
    handleLastInView: PropTypes.func,
    scroll_top: PropTypes.number,
    handleScroll: PropTypes.func,
    selected_column: PropTypes.string,
    selected_row: PropTypes.number,
    setSelectedRow: PropTypes.func,
    search_text: PropTypes.string,
    alt_search_text:PropTypes.string
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
    }

    _handleSearchFieldChange(event) {
        this.props.handleSearchFieldChange(event.target.value)
    }

    _handleFilter() {
        // this.props.handleFilter(this.state.search_field_value);
        let self = this;
        const data_dict = {"text_to_find": this.props.search_text};
        this.props.broadcast_event_to_server("UnfilterTable", data_dict, function () {
            if (self.props.search_text !== "") {
                self.props.broadcast_event_to_server("FilterTable", data_dict);
            }
        });
    }

    _handleUnFilter() {
        this.props.handleSearchFieldChange(null);
        this.props.broadcast_event_to_server("UnfilterTable", {});
    }

    _handleSubmit(e) {
        e.preventDefault();
    }

    render () {
        return (
            <Rbs.Card.Header className="d-flex pl-2 pt-2 justify-content-between align-baseline">
                <div className="d-flex">
                    <div className="main-heading-element">
                        <Rbs.Button onClick={this.props.toggleShrink}
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
                                            height={30}
                                            maxWidth={200}
                                            fontSize={14}
                                />
                            </Rbs.Form.Group>
                        </Rbs.Form>
                    </div>

                </div>
                <div className="d-flex">
                    {this.props.show_table_spinner && <SmallSpinner/>}
                    <div className="main-heading-element d-flex">
                        <Rbs.Form inline={true}
                                  onSubmit={this._handleSubmit}
                                  style={{flexFlow: "unset"}}>
                            <Rbs.Form.Control as="input"
                                              placeholder="Search"
                                              value={!this.props.search_text ? "" : this.props.search_text}
                                              onChange={this._handleSearchFieldChange}
                                              size="sm"
                                              className="mr-2"/>
                            <Rbs.Button variant="outline-secondary" className="my-2 mr-1" type="button" size="sm"
                                        onClick={this._handleFilter}>
                                Filter
                            </Rbs.Button>
                            <Rbs.Button variant="outline-secondary" className="my-2 mr-1" type="button" size="sm"
                                        onClick={this._handleUnFilter}>
                                Clear
                            </Rbs.Button>
                        </Rbs.Form>

                    </div>

                </div>
            </Rbs.Card.Header>
        )
    }
}

MainTableCardHeader.propTypes = {
    toggleShrink: PropTypes.func,
    handleSearchFieldChange: PropTypes.func,
    search_text: PropTypes.string,
    handleFilter: PropTypes.func,
    short_collection_name: PropTypes.string,
    handleChangeDoc: PropTypes.func,
    doc_names: PropTypes.array,
    show_table_spinner: PropTypes.bool,
    broadcast_event_to_server: PropTypes.func

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
            selected_row: null,
        };
        doBinding(this);
    }

    componentDidMount() {
        this.setState({mounted: true});
        this.computeColumnWidths();
        let self = this;
        $(".can-resize").resizable({
                handles: "e",
                resize: handle_resize,
                stop: handle_stop_resize
            });

        function handle_resize(event, ui) {
            // dirty = true;

            let cwidths = self.props.table_spec.column_widths;
            cwidths[ui.element[0].cellIndex] = ui.size.width;
            self.props.updateTableSpec({column_widths: cwidths}, false)
        }

        function handle_stop_resize()  {
            self.broadcast_column_widths(self.props.table_spec.current_doc_name,
                self.props.table_spec.column_widths)
        }
    }

    componentDidUpdate() {
        if (this.props.table_spec.column_widths == null) {
            this.computeColumnWidths()
        }
    }

    computeColumnWidths() {
        let cwidths = compute_initial_column_widths(this.props.table_spec.column_names);
        this.props.updateTableSpec({column_widths: cwidths}, true)
    }

    broadcast_column_widths(docname, cwidths) {
        this.props.broadcast_event_to_server("UpdateColumnWidths", {"doc_to_update": docname,
            "column_widths": cwidths}, null)
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

    compute_table_width() {
        let self = this;
        function reducer(accumulator, current_value, index) {
            if (self.props.table_spec.hidden_columns_list.includes(self.props.table_spec.column_names[index])) {
                return accumulator
            }
            else{
                return accumulator + current_value
            }
        }
        return this.props.table_spec.column_widths.reduce(reducer) + EXTRA_TABLE_AREA_SPACE;
    }

    render () {
        let table_style = {display: "block", tableLayout: "fixed"};
        if (this.props.table_spec.column_widths != null) {
            table_style["width"] = this.compute_table_width();
        }
        return (
            <Rbs.Card id="main-panel" ref={this.card_ref}>
                <MainTableCardHeader toggleShrink={this.props.toggleShrink}
                                     handleFilter={this.props.handleFilter}
                                     handleUnFilter={this.props.handleUnFilter}
                                     short_collection_name={this.props.short_collection_name}
                                     handleChangeDoc={this.props.handleChangeDoc}
                                     doc_names={this.props.doc_names}
                                     show_table_spinner={this.props.show_table_spinner}
                                     handleSearchFieldChange={this.props.handleSearchFieldChange}
                                     search_text={this.props.search_text}
                                     broadcast_event_to_server={this.props.broadcast_event_to_server}
                />
                <Rbs.Card.Body  id="table-wrapper">
                    <table id="table-area" style={table_style}>
                        <TableHeader column_names={this.props.table_spec.column_names}
                                     column_widths={this.props.table_spec.column_widths}
                                     hidden_columns_list={this.props.table_spec.hidden_columns_list}
                                     selected_column={this.props.selected_column}
                                     setSelectedColumn={this.props.setSelectedColumn}
                                     moveColumn={this.props.moveColumn}
                        />
                        <TableBody my_ref={this.tbody_ref}
                                   data_rows={this.props.data_rows}
                                   column_names={this.props.table_spec.column_names}
                                   column_widths={this.props.table_spec.column_widths}
                                   hidden_columns_list={this.props.table_spec.hidden_columns_list}
                                   height={this._getBodyHeight()}
                                   handleFirstInView={this.props.handleFirstInView}
                                   handleLastInView={this.props.handleLastInView}
                                   scroll_top={this.props.scroll_top}
                                   handleScroll={this.props.handleScroll}
                                   is_last_chunk={this.props.is_last_chunk}
                                   is_first_chunk={this.props.is_first_chunk}
                                   selected_column={this.props.selected_column}
                                   selected_row={this.props.selected_row}
                                   setSelectedRow={this.props.setSelectedRow}
                                   search_text={this.props.search_text}
                                   alt_search_text={this.props.alt_search_text}
                        />
                    </table>

                </Rbs.Card.Body>
            </Rbs.Card>
        )
    }
}

MainTableCard.propTypes = {
    updateTableSpec: PropTypes.func,
    toggleShrink: PropTypes.func,
    handleFilter: PropTypes.func,
    handleUnFilter: PropTypes.func,
    handleSearchFieldChange: PropTypes.func,
    search_text: PropTypes.string,
    alt_search_text: PropTypes.string,
    handleFirstInView: PropTypes.func,
    handleLastInView: PropTypes.func,
    short_collection_name: PropTypes.string,
    handleChangeDoc: PropTypes.func,
    doc_names: PropTypes.array,
    table_spec: PropTypes.object,
    data_rows: PropTypes.array,
    show_table_spinner: PropTypes.bool,
    available_height: PropTypes.number,
    scroll_top: PropTypes.number,
    handleScroll: PropTypes.func,
    selected_column: PropTypes.string,
    setSelectedColumn: PropTypes.func,
    selected_row: PropTypes.number,
    setSelectedRow: PropTypes.func,
    moveColumn: PropTypes.func,
    broadcast_event_to_server: PropTypes.func
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
        the_text = the_child.innerText;
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
        if ($(the_row).hasClass("spinner-row")) continue;
        let cols_to_remove = [];
        for (let c of columns_remaining) {
            the_child = the_row.cells[c];
            the_text = the_child.innerText;
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
