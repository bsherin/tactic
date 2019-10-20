
import { GlyphButton } from "./blueprint_react_widgets.js";
import { ReactCodemirror } from "./react-codemirror.js";

export { MainTableCard, MainTableCardHeader, FreeformBody };

let Bp = blueprint;

class FreeformBody extends React.Component {
    constructor(props) {
        super(props);
        this.cmobject = null;
        this.overlay = null;
        doBinding(this);
    }

    _setCMObject(cmobject) {
        this.cmobject = cmobject;
    }

    _clearSearch() {
        if (this.cmobject && this.overlay) {
            this.cmobject.removeOverlay(this.overlay);
            this.overlay = null;
        }
    }

    _doSearch() {
        if (this.props.alt_search_text && this.props.alt_search_text != "" && this.cmobject) {
            this.overlay = this.mySearchOverlay(this.props.alt_search_text, true);
            this.cmobject.addOverlay(this.overlay);
        } else if (this.props.search_text && this.props.search_text != "" && this.cmobject) {
            this.overlay = this.mySearchOverlay(this.props.search_text, true);
            this.cmobject.addOverlay(this.overlay);
        }
    }

    mySearchOverlay(query, caseInsensitive) {
        if (typeof query == "string") {
            // noinspection RegExpRedundantEscape
            query = new RegExp(query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), caseInsensitive ? "gi" : "g");
        } else if (!query.global) query = new RegExp(query.source, query.ignoreCase ? "gi" : "g");

        return { token: function (stream) {
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
            } };
    }

    _handleChange() {}

    render() {
        this._clearSearch();
        this._doSearch();
        return React.createElement(
            "div",
            { ref: this.props.my_ref },
            React.createElement(ReactCodemirror, { handleChange: this._handleChange,
                code_content: this.props.data_text,
                sync_to_prop: true,
                mode: "Plain Text",
                code_container_height: this.props.code_container_height,
                setCMObject: this._setCMObject,
                readOnly: true })
        );
    }

}

FreeformBody.propTypes = {
    my_ref: PropTypes.object,
    data_text: PropTypes.string,
    code_container_height: PropTypes.number,
    search_text: PropTypes.string,
    alt_search_text: PropTypes.string
};

function SmallSpinner() {
    return React.createElement(
        "div",
        { className: "d-flex" },
        React.createElement("span", { className: " loader-small" })
    );
}

class MainTableCardHeader extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.heading_left_ref = React.createRef();
        this.heading_right_ref = React.createRef();
        this.state = { hide_right_element: false };
    }

    componentDidUpdate() {
        let le_rect = this.heading_left_ref.current.getBoundingClientRect();
        let re_rect = this.heading_right_ref.current.getBoundingClientRect();
        let hide_right = re_rect.x < le_rect.x + le_rect.width + 10;
        if (hide_right != this.state.hide_right_element) {
            this.setState({ hide_right_element: hide_right });
        }
    }

    _handleSearchFieldChange(event) {
        this.props.handleSearchFieldChange(event.target.value);
    }

    _handleFilter() {
        // this.props.handleFilter(this.state.search_field_value);
        let self = this;
        const data_dict = { "text_to_find": this.props.search_text };
        this.props.broadcast_event_to_server("UnfilterTable", data_dict, function () {
            if (self.props.search_text !== "") {
                self.props.broadcast_event_to_server("FilterTable", data_dict);
                self.props.setMainStateValue("table_is_filtered", true);
            }
        });
    }

    _handleUnFilter() {
        this.props.handleSearchFieldChange(null);
        if (this.props.table_is_filtered) {
            this.props.broadcast_event_to_server("UnfilterTable", {});
            this.props.setMainStateValue("table_is_filtered", false);
        }
    }

    _handleSubmit(e) {
        e.preventDefault();
    }

    _onChangeDoc(event) {
        this.props.handleChangeDoc(event.target.value);
    }

    render() {
        let heading_right_opacity = this.state.hide_right_element ? 0 : 100;
        let select_style = { height: 30, maxWidth: 200 };
        return React.createElement(
            "div",
            { className: "d-flex pl-2 pr-2 justify-content-between align-baseline main-heading", style: { height: 50 } },
            React.createElement(
                "div",
                { id: "heading-left", ref: this.heading_left_ref, className: "d-flex flex-column justify-content-around" },
                React.createElement(
                    "div",
                    { className: "d-flex flex-row" },
                    React.createElement(GlyphButton, { handleClick: this.props.toggleShrink, icon: "minimize" }),
                    React.createElement(
                        "div",
                        { className: "d-flex flex-column justify-content-around" },
                        React.createElement(
                            "form",
                            { className: "d-flex flex-row" },
                            React.createElement(
                                Bp.FormGroup,
                                { label: this.props.short_collection_name,
                                    inline: true,
                                    style: { marginBottom: 0, marginLeft: 5, marginRight: 10 } },
                                React.createElement(Bp.HTMLSelect, { options: this.props.doc_names,
                                    onChange: this._onChangeDoc,
                                    value: this.props.current_doc_name,
                                    style: select_style
                                })
                            ),
                            this.props.show_table_spinner && React.createElement(Bp.Spinner, { size: 15 })
                        )
                    )
                )
            ),
            React.createElement(
                "div",
                { id: "heading-right", ref: this.heading_right_ref, style: { opacity: heading_right_opacity }, className: "d-flex flex-column justify-content-around" },
                React.createElement(
                    "form",
                    { onSubmit: this._handleSubmit, className: "d-flex flex-row" },
                    React.createElement(Bp.InputGroup, { type: "search",
                        leftIcon: "search",
                        placeholder: "Search",
                        value: !this.props.search_text ? "" : this.props.search_text,
                        onChange: this._handleSearchFieldChange,
                        autoCapitalize: "none",
                        autoCorrect: "off",
                        className: "mr-2" }),
                    React.createElement(
                        Bp.ButtonGroup,
                        null,
                        this.props.show_filter_button && React.createElement(
                            Bp.Button,
                            { onClick: this._handleFilter },
                            "Filter"
                        ),
                        React.createElement(
                            Bp.Button,
                            { onClick: this._handleUnFilter },
                            "Clear"
                        )
                    )
                )
            )
        );
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
            selected_row: null
        };
        doBinding(this);
    }

    componentDidMount() {
        this.setState({ mounted: true });
    }

    render() {
        return React.createElement(
            Bp.Card,
            { id: "main-panel", elevation: 2, className: "mt-3 ml-3" },
            this.props.card_header,
            React.createElement(
                "div",
                { id: "table-wrapper" },
                this.props.card_body
            )
        );
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
        columns_remaining.push(c);
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
            column_widths[c] = the_width;
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
    return column_widths;
}