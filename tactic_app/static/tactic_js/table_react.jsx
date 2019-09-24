
import {GlyphButton} from "./blueprint_react_widgets.js";
import {ReactCodemirror} from "./react-codemirror.js";

export {MainTableCard, MainTableCardHeader, TableBody, FreeformBody, TableHeader, compute_added_column_width}

let Bp = blueprint;


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
    constructor(props) {
        super(props);
        doBinding(this)
    }

    _setSelectedColumn(column_name) {
        this.props.setMainStateValue("selected_column", column_name)
    }

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
                            setSelectedColumn={this._setSelectedColumn}
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
                            setSelectedColumn={this._setSelectedColumn}/>
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
    setMainStateValue: PropTypes.func,
    moveColumn: PropTypes.func

};

class ColoredWord extends React.Component {

    render() {
        let style = {backgroundColor: this.props.the_color};
        return (
            <span style={style}>{this.props.the_word}</span>
        )
    }
}

ColoredWord.propTypes = {
    the_color: PropTypes.string,
    the_word: PropTypes.string,
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
        if (this.props.text_color_dict) {
            let color_dict = this.props.text_color_dict.color_dict;
            let token_text = this.props.text_color_dict.token_text;
            let revised_text = [];
            let index = 0;
            for (let w of token_text) {
                if (color_dict.hasOwnProperty(w)) {
                    revised_text.push(<ColoredWord key={index} the_color={color_dict[w]} the_word={w}/>)
                }
                else {
                    revised_text.push(w + " ")
                }
                index += 1;
            }
            the_text = revised_text;
            return (
                <td style={style} className={className}>{the_text}</td>
            )
        }
        else {
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
}

BodyCell.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    text_color_dict: PropTypes.object,
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
        this.tr_ref = React.createRef();
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

    componentDidMount() {
         if (this.props.force_me_to_top) {
             this.props.forceToTop(this.tr_ref.current.offsetTop)
         }
    }


    componentDidUpdate() {
         if (this.props.force_me_to_top) {
             this.props.forceToTop(this.tr_ref.current.offsetTop)
         }
    }

    _text_to_color(colname) {
         if (this.props.text_color_dict && this.props.text_color_dict.hasOwnProperty(colname)) {
             return this.props.text_color_dict[colname]
         }
         else {
             return null
         }

    }

    render () {
        let cells;
        if (this.props.column_widths == null) {
            cells = this.props.column_names.map((colname) => (
                    <BodyCell value={this.props.row_dict[colname]}
                              key={colname}
                              text_color_dict={this._text_to_color(colname)}
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
                              text_color_dict={this._text_to_color(colname)}
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
            <tr ref={this.tr_ref} className={className} onClick={this._handleClick}>{cells}</tr>
        )
    }
}

BodyRow.propTypes = {
    index: PropTypes.number,
    row_id: PropTypes.number,
    column_names: PropTypes.array,
    force_me_to_top: PropTypes.bool,
    forceToTop: PropTypes.func,
    text_color_dict: PropTypes.object,
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
        this.props.setMainStateValue("scroll_top", this.props.my_ref.current.scrollTop)
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
            let cwidths = self.props.table_spec.column_widths;
            cwidths[ui.element[0].cellIndex] = ui.size.width;
            self.props.updateTableSpec({column_widths: cwidths}, false)
        }

        function handle_stop_resize()  {
            self.broadcast_column_widths(self.props.table_spec.current_doc_name,
                self.props.table_spec.column_widths)
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

    componentDidUpdate() {
        this.props.my_ref.current.scrollTop = this.props.scroll_top;
        if (this.props.table_spec.column_widths == null) {
            this.computeColumnWidths()
        }
    }
    
    _row_to_color(row_id) {
        if (this.props.cells_to_color_text.hasOwnProperty(row_id)) {
            return this.props.cells_to_color_text[row_id]

        }
        return null
    }

    _setSelectedRow(row_number) {
        this.props.setMainStateValue("selected_row", row_number)
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
                     text_color_dict={this._row_to_color(row_dict.__id__)}
                     row_number={index}
                     row_id={row_dict.__id__}
                     key={index}
                     force_me_to_top={index == this.props.force_row_to_top}
                     forceToTop={this.props.forceRowToTop}
                     column_widths={this.props.column_widths}
                     hidden_columns_list={this.props.hidden_columns_list}
                     index={index}
                     selected_column={this.props.selected_column}
                     selected_row={this.props.selected_row}
                     setSelectedRow={this._setSelectedRow}
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
    my_ref: PropTypes.object,
    data_rows: PropTypes.array,
    cells_to_color_text: PropTypes.object,
    column_names: PropTypes.array,
    force_row_to_top: PropTypes.number,
    forceRowToTop: PropTypes.func,
    height: PropTypes.number,
    column_widths: PropTypes.array,
    hidden_columns_list: PropTypes.array,
    scroll_top: PropTypes.number,
    selected_column: PropTypes.string,
    selected_row: PropTypes.number,
    search_text: PropTypes.string,
    alt_search_text:PropTypes.string,
    setMainStateValue: PropTypes.func,
    handleFirstInView: PropTypes.func,
    handleLastInView: PropTypes.func,
};

class FreeformBody extends React.Component{
    constructor(props) {
        super(props);
        this.cmobject = null;
        this.overlay = null;
        doBinding(this);
    }


    _setCMObject(cmobject) {
        this.cmobject = cmobject
    }

    _clearSearch() {
        if (this.cmobject && this.overlay) {
            this.cmobject.removeOverlay(this.overlay);
            this.overlay = null
        }
    }

    _doSearch(){
        if (this.props.alt_search_text && (this.props.alt_search_text != "") && this.cmobject) {
            this.overlay = this.mySearchOverlay(this.props.alt_search_text, true);
            this.cmobject.addOverlay(this.overlay)
        }
        else if (this.props.search_text && (this.props.search_text != "") && this.cmobject) {
            this.overlay = this.mySearchOverlay(this.props.search_text, true);
            this.cmobject.addOverlay(this.overlay)
        }
    }

    mySearchOverlay(query, caseInsensitive) {
        if (typeof query == "string")
          { // noinspection RegExpRedundantEscape
              query = new RegExp(query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), caseInsensitive ? "gi" : "g");
          }
        else if (!query.global)
          query = new RegExp(query.source, query.ignoreCase ? "gi" : "g");

        return {token: function(stream) {
          query.lastIndex = stream.pos;
          const match = query.exec(stream.string);
          if (match && match.index == stream.pos) {
            stream.pos += match[0].length || 1;
            return "searching"; // I believe this causes the style .cm-searching to be applied
          } else if (match) {
            stream.pos = match.index;
          } else {
            stream.skipToEnd();
          }
        }};
      }

    _handleChange() {

    }

    render() {
        this._clearSearch();
        this._doSearch();
        return (
            <div ref={this.props.my_ref}>
                <ReactCodemirror handleChange={this._handleChange}
                                 code_content={this.props.data_text}
                                 sync_to_prop={true}
                                 mode="Plain Text"
                                 code_container_height={this.props.code_container_height}
                                 setCMObject={this._setCMObject}
                                 readOnly={true}/>
            </div>
        )
    }

}

FreeformBody.propTypes = {
    my_ref: PropTypes.object,
    data_text: PropTypes.string,
    code_container_height: PropTypes.number,
    search_text: PropTypes.string,
    alt_search_text: PropTypes.string
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
        this.heading_left_ref = React.createRef();
        this.heading_right_ref = React.createRef();
        this.state = {hide_right_element: false}
    }

    componentDidUpdate() {
        let le_rect = this.heading_left_ref.current.getBoundingClientRect();
        let re_rect = this.heading_right_ref.current.getBoundingClientRect();
        let hide_right = re_rect.x < (le_rect.x + le_rect.width + 10);
        if (hide_right != this.state.hide_right_element) {
            this.setState({hide_right_element: hide_right})
        }
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
                self.props.setMainStateValue("table_is_filtered", true)
            }
        });
    }

    _handleUnFilter() {
        this.props.handleSearchFieldChange(null);
        if (this.props.table_is_filtered) {
            this.props.broadcast_event_to_server("UnfilterTable", {});
            this.props.setMainStateValue("table_is_filtered", false)
        }

    }

    _handleSubmit(e) {
        e.preventDefault();
    }

    _onChangeDoc(event) {
        this.props.handleChangeDoc(event.target.value)
    }

    render () {
        let heading_right_opacity = this.state.hide_right_element ? 0 : 100;
        let select_style = {height: 30, maxWidth: 200};
        return (
            <div className="d-flex pl-2 pr-2 justify-content-between align-baseline main-heading" style={{height: 50}}>
                <div id="heading-left" ref={this.heading_left_ref} className="d-flex flex-column justify-content-around">
                    <div className="d-flex flex-row">
                        <GlyphButton handleClick={this.props.toggleShrink} icon="minimize"/>
                        <div className="d-flex flex-column justify-content-around">
                            <form className="d-flex flex-row">
                                <Bp.FormGroup label={this.props.short_collection_name} inline={true} style={{marginBottom: 0, marginLeft: 5}}>
                                    <Bp.HTMLSelect options={this.props.doc_names}
                                                    onChange={this._onChangeDoc}
                                                    value={this.props.current_doc_name}
                                                   style={select_style}
                                    />
                                </Bp.FormGroup>
                            </form>
                        </div>
                    </div>

                </div>
                <div id="heading-right" ref={this.heading_right_ref} style={{opacity: heading_right_opacity}} className="d-flex flex-column justify-content-around">
                    {this.props.show_table_spinner && <SmallSpinner/>}
                    <form onSubmit={this._handleSubmit} className="d-flex flex-row">
                            <Bp.InputGroup type="search"
                                           leftIcon="search"
                                           placeholder="Search"
                                           value={!this.props.search_text ? "" : this.props.search_text}
                                           onChange={this._handleSearchFieldChange}
                                           className="mr-2"/>
                           <Bp.ButtonGroup>
                                {this.props.show_filter_button &&
                                    <Bp.Button onClick={this._handleFilter}>
                                        Filter
                                    </Bp.Button>
                                }
                                <Bp.Button onClick={this._handleUnFilter}>
                                    Clear
                                </Bp.Button>
                           </Bp.ButtonGroup>
                    </form>
                </div>
            </div>
        )
    }
}

MainTableCardHeader.propTypes = {
    toggleShrink: PropTypes.func,
    table_is_filtered: PropTypes.bool,
    setMainStateValue: PropTypes.func,
    handleSearchFieldChange: PropTypes.func,
    search_text: PropTypes.string,
    handleFilter: PropTypes.func,
    short_collection_name: PropTypes.string,
    current_doc_name: PropTypes.string,
    handleChangeDoc: PropTypes.func,
    doc_names: PropTypes.array,
    show_table_spinner: PropTypes.bool,
    show_filter_button: PropTypes.bool,
    broadcast_event_to_server: PropTypes.func

};

const MAX_INITIAL_CELL_WIDTH = 400;
const EXTRA_TABLE_AREA_SPACE = 500;

class MainTableCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mounted: false,
            selected_row: null,
        };
        doBinding(this);
    }

    componentDidMount() {
        this.setState({mounted: true});
    }

    render () {
        return (
            <Bp.Card id="main-panel" className="mt-3 ml-3">
                {this.props.card_header}
                <div  id="table-wrapper">
                    {this.props.card_body}
                </div>
            </Bp.Card>
        )
    }
}

MainTableCard.propTypes = {
    card_body: PropTypes.object,
    card_header: PropTypes.object,
    updateTableSpec: PropTypes.func,
    table_spec: PropTypes.object,
    broadcast_event_to_server: PropTypes.func
};

function compute_added_column_width(header_text) {
    const max_field_width = MAX_INITIAL_CELL_WIDTH;
    let header_cell = $($("#table-wrapper th")[0]);
    let header_font = header_cell.css("font");
    let canvas_element = document.getElementById("measure-canvas");
    let ctx = canvas_element.getContext("2d");
    let added_header_width = parseInt(header_cell.css("padding-right")) + parseInt(header_cell.css("padding-left")) + 2;
    ctx.font = header_font;
    return ctx.measureText(header_text).width + added_header_width;
}

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
