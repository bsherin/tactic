"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BpSelectorTable = BpSelectorTable;
exports.ColumnSelector = ColumnSelector;
exports.ResourceFilter = ResourceFilter;
exports.SearchForm = SearchForm;
exports.base_columns = exports.all_columns = void 0;
exports.compute_initial_column_widths = compute_initial_column_widths;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _table = require("@blueprintjs/table");
var _utilities_react = require("./utilities_react");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const DEFAULT_ROW_HEIGHT = 35;
const MAX_INITIAL_CELL_WIDTH = 300;
const ICON_WIDTH = 35;
function SearchForm(props) {
  props = {
    allow_search_inside: false,
    allow_search_metadata: false,
    allow_show_hidden: false,
    allow_regex: false,
    regex: false,
    search_inside: false,
    search_metadata: false,
    show_hidden: false,
    field_width: 265,
    include_search_jumper: false,
    current_search_number: null,
    searchNext: null,
    searchPrev: null,
    search_ref: null,
    number_matches: null,
    update_delay: 500,
    update_search_state: null,
    search_string: "",
    ...props
  };
  const [temp_text, set_temp_text] = (0, _react.useState)(null);
  const [waiting, doUpdate] = (0, _utilities_react.useDebounce)(newval => {
    props.update_search_state({
      "search_string": newval
    });
  });
  function _handleSearchFieldChange(event) {
    doUpdate(event.target.value);
    set_temp_text(event.target.value);
  }
  function _handleSearchMetadataChange(event) {
    update_search_state({
      "search_metadata": event.target.checked
    });
  }
  function _handleSearchInsideChange(event) {
    props.update_search_state({
      "search_inside": event.target.checked
    });
  }
  function _handleShowHiddenChange(event) {
    props.update_search_state({
      "show_hidden": event.target.checked
    });
  }
  function _handleRegexChange(event) {
    props.update_search_state({
      "regex": event.target.checked
    });
  }
  let match_text;
  if (props.number_matches != null && props.search_string && props.search_string != "") {
    switch (props.number_matches) {
      case 0:
        match_text = "no matches";
        break;
      case 1:
        match_text = "1 match";
        break;
      default:
        match_text = `${props.number_matches} matches`;
        break;
    }
  } else {
    match_text = null;
  }
  let current_text = waiting.current ? temp_text : props.search_string;
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    helperText: match_text,
    style: {
      marginBottom: 0
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "d-flex flex-row",
    style: {
      marginTop: 5,
      marginBottom: 5
    }
  }, /*#__PURE__*/_react.default.createElement(_core.InputGroup, {
    type: "search",
    className: "search-input",
    placeholder: "Search",
    leftIcon: "search",
    value: current_text,
    onChange: _handleSearchFieldChange,
    style: {
      "width": props.field_width
    },
    autoCapitalize: "none",
    autoCorrect: "off",
    size: "small",
    inputRef: props.search_ref
  }), props.allow_regex && /*#__PURE__*/_react.default.createElement(_core.Switch, {
    label: "regexp",
    className: "ml-3 mb-0 mt-1",
    size: "medium",
    checked: props.regex,
    onChange: _handleRegexChange
  }), props.allow_search_metadata && /*#__PURE__*/_react.default.createElement(_core.Switch, {
    label: "metadata",
    className: "ml-3 mb-0 mt-1",
    size: "medium",
    checked: props.search_metadata,
    onChange: _handleSearchMetadataChange
  }), props.allow_search_inside && /*#__PURE__*/_react.default.createElement(_core.Switch, {
    label: "inside",
    className: "ml-3 mb-0 mt-1",
    size: "medium",
    checked: props.search_inside,
    onChange: _handleSearchInsideChange
  }), props.allow_show_hidden && /*#__PURE__*/_react.default.createElement(_core.Switch, {
    label: "show hidden",
    className: "ml-3 mb-0 mt-1",
    size: "medium",
    checked: props.show_hidden,
    onChange: _handleShowHiddenChange
  }), props.include_search_jumper && /*#__PURE__*/_react.default.createElement(_core.ButtonGroup, {
    style: {
      marginLeft: 5,
      padding: 2
    }
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    onClick: props.searchNext,
    icon: "caret-down",
    text: undefined,
    size: "small"
  }), /*#__PURE__*/_react.default.createElement(_core.Button, {
    onClick: props.searchPrev,
    icon: "caret-up",
    text: undefined,
    size: "small"
  })))));
}
exports.SearchForm = SearchForm = /*#__PURE__*/(0, _react.memo)(SearchForm);
const all_columns = exports.all_columns = ["icon:th", "name", "icon:upload", "created", "updated", "size"];
const base_columns = exports.base_columns = ["icon:th", "name", "icon:upload"];
function ColumnSelector({
  icon_dict,
  selectedColumns,
  onColumnChange
}) {
  const toggleColumn = k => {
    const next = new Set(selectedColumns);
    if (next.has(k)) next.delete(k);else next.add(k);
    onColumnChange([...next]);
  };
  return /*#__PURE__*/_react.default.createElement(_core.Popover, {
    placement: "bottom-start",
    content: /*#__PURE__*/_react.default.createElement(_core.Menu, null, all_columns.map(k => /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
      key: k,
      shouldDismissPopover: false
      // icon={icon_dict[k]}
      ,
      text: /*#__PURE__*/_react.default.createElement(_core.Checkbox, {
        checked: selectedColumns.includes(k),
        label: k,
        className: "menu-control",
        disabled: base_columns.includes(k),
        alignIndicator: _core.Alignment.END,
        onChange: () => toggleColumn(k)
      })
    })))
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    icon: "list-columns"
  }));
}
function ResourceFilter({
  kinds,
  icon_dict,
  selectedKinds,
  onKindChange,
  update_search_state,
  search_inside = false,
  search_metadata = false,
  show_hidden = false,
  showSummary = false
}) {
  const allSelected = selectedKinds.size === kinds.length;
  const noneSelected = selectedKinds.size === 0;
  const toggleKind = k => {
    const next = new Set(selectedKinds);
    if (next.has(k)) next.delete(k);else next.add(k);
    onKindChange([...next]);
  };

  ///const selectAll = () => onKindChange(kinds);
  const selectNone = () => onKindChange([]);
  const summary = (0, _react.useMemo)(() => {
    if (!showSummary) return "";
    if (allSelected) return "All kinds";
    if (noneSelected) return "None";
    return Array.from(selectedKinds).join(", ");
  }, [allSelected, noneSelected, selectedKinds]);
  function _handleSearchMetadataChange(event) {
    update_search_state({
      "search_metadata": event.target.checked
    });
  }
  function _handleSearchInsideChange(event) {
    update_search_state({
      "search_inside": event.target.checked
    });
  }
  function _handleShowHiddenChange(event) {
    update_search_state({
      "show_hidden": event.target.checked
    });
  }
  return /*#__PURE__*/_react.default.createElement(_core.Popover, {
    placement: "bottom-start",
    content: /*#__PURE__*/_react.default.createElement(_core.Menu, null, /*#__PURE__*/_react.default.createElement("div", {
      onClick: selectNone,
      style: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
      text: "Clear",
      key: "clear",
      shouldDismissPopover: false,
      disabled: noneSelected
    }), /*#__PURE__*/_react.default.createElement(_core.Icon, {
      icon: "circle",
      className: "bp6-menu-item"
    })), /*#__PURE__*/_react.default.createElement(_core.MenuDivider, null), kinds.map(k => /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
      key: k,
      shouldDismissPopover: false,
      icon: icon_dict[k],
      text: /*#__PURE__*/_react.default.createElement(_core.Checkbox, {
        checked: selectedKinds.includes(k),
        label: k,
        className: "menu-control",
        alignIndicator: _core.Alignment.END,
        onChange: () => toggleKind(k)
      })
    })), /*#__PURE__*/_react.default.createElement(_core.MenuDivider, null), /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
      key: "metadata",
      shouldDismissPopover: false,
      text: /*#__PURE__*/_react.default.createElement(_core.Switch, {
        checked: search_metadata,
        label: "Metadata",
        className: "menu-control",
        onChange: _handleSearchMetadataChange
      })
    }), /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
      key: "inside",
      shouldDismissPopover: false,
      text: /*#__PURE__*/_react.default.createElement(_core.Switch, {
        checked: search_inside,
        label: "inside",
        className: "menu-control",
        onChange: _handleSearchInsideChange
      })
    }), /*#__PURE__*/_react.default.createElement(_core.MenuDivider, null), /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
      key: "hidden",
      shouldDismissPopover: false,
      text: /*#__PURE__*/_react.default.createElement(_core.Switch, {
        checked: show_hidden,
        label: "show hidden",
        className: "menu-control",
        alignIndicator: _core.Alignment.END,
        onChange: _handleShowHiddenChange
      })
    }))
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    icon: "filter",
    text: `${summary}`
  }));
}
function BpSelectorTable(props) {
  props = {
    columns: ["name", "created", "updated"],
    identifier_field: "_id",
    enableColumnResigin: false,
    onColumnWidthChanged: null,
    maxColumnWidth: null,
    active_row: 0,
    show_animations: false,
    handleSpaceBarPress: null,
    keyHandler: null,
    draggable: true,
    rowChanged: 0,
    columnWidths: null,
    ...props
  };
  const [columnWidths, setColumnWidths] = (0, _react.useState)(null);
  const saved_data_dict = (0, _react.useRef)(null);
  const data_update_required = (0, _react.useRef)(null);
  const table_ref = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
    // computeColumnWidths();
    saved_data_dict.current = props.data_dict;
  }, []);

  // useEffect(() => {
  //     if ((columnWidthsRef.current == null) || !_.isEqual(props.data_dict, saved_data_dict.current)) {
  //         computeColumnWidths();
  //         saved_data_dict.current = props.data_dict;
  //     }
  // });

  function computeColumnWidths() {
    if (Object.keys(props.data_dict).length == 0) return;
    let column_names = props.columns;
    let bcwidths = compute_initial_column_widths(column_names, Object.values(props.data_dict));
    let cwidths = [];
    if (props.maxColumnWidth) {
      for (let c of bcwidths) {
        if (c > props.maxColumnWidth) {
          cwidths.push(props.maxColumnWidth);
        } else {
          cwidths.push(c);
        }
      }
    } else {
      cwidths = bcwidths;
    }
    setColumnWidths(cwidths);
  }
  async function _onCompleteRender() {
    if (!props.columnWidths) {
      computeColumnWidths();
    }
    if (data_update_required.current != null) {
      await props.initiateDataGrab(data_update_required.current);
      data_update_required.current = null;
    }
    const lastColumnRegion = _table.Regions.column(props.columns.length - 1);
    const firstColumnRegion = _table.Regions.column(0);
    table_ref.current.scrollToRegion(lastColumnRegion);
    table_ref.current.scrollToRegion(firstColumnRegion);
  }
  function haveRowData(rowIndex) {
    return props.data_dict.hasOwnProperty(rowIndex);
  }
  function _cellRendererCreator(column_name) {
    return rowIndex => {
      if (!haveRowData(rowIndex)) {
        if (data_update_required.current == null) {
          data_update_required.current = rowIndex;
        }
        return /*#__PURE__*/_react.default.createElement(_table.Cell, {
          key: column_name,
          loading: true
        });
      }
      let the_body;
      let the_class = "";
      if (Object.keys(props.data_dict[rowIndex]).includes(column_name)) {
        if ("hidden" in props.data_dict[rowIndex] && props.data_dict[rowIndex]["hidden"]) {
          the_class = "hidden_cell";
        }
        let the_text = String(props.data_dict[rowIndex][column_name]);
        if (the_text.startsWith("icon:")) {
          if ("res_type" in props.data_dict[rowIndex] && props.data_dict[rowIndex]["res_type"] == "tile") {
            the_class = "tile-icon-cell";
          } else {
            the_class = "icon-cell";
          }
          the_text = the_text.replace(/(^icon:)/gi, "");
          the_body = /*#__PURE__*/_react.default.createElement(_core.Icon, {
            className: the_class,
            icon: the_text,
            size: 14
          });
        } else {
          the_body = /*#__PURE__*/_react.default.createElement(_table.TruncatedFormat, {
            className: the_class
          }, the_text);
        }
      } else {
        the_body = "";
      }
      return /*#__PURE__*/_react.default.createElement(_table.Cell, {
        key: column_name,
        className: "library-table-cell",
        interactive: true,
        truncated: true,
        tabIndex: -1,
        onKeyDown: props.keyHandler,
        wrapText: true
      }, /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
        onDoubleClick: () => props.handleRowDoubleClick(props.data_dict[rowIndex])
      }, the_body)));
    };
  }
  function _renderMenu(sortColumn) {
    let sortAsc = () => {
      props.sortColumn(sortColumn, "ascending");
    };
    let sortDesc = () => {
      props.sortColumn(sortColumn, "descending");
    };
    return /*#__PURE__*/_react.default.createElement(_core.Menu, null, /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
      icon: "sort-asc",
      onClick: sortAsc,
      text: "Sort Asc"
    }), /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
      icon: "sort-desc",
      onClick: sortDesc,
      text: "Sort Desc"
    }));
  }
  function _columnHeaderNameRenderer(the_text) {
    let the_body;
    the_text = String(the_text);
    if (the_text.startsWith("icon:")) {
      the_text = the_text.replace(/(^icon:)/gi, "");
      the_body = /*#__PURE__*/_react.default.createElement(_core.Icon, {
        icon: the_text,
        size: 14
      });
    } else {
      the_body = /*#__PURE__*/_react.default.createElement("div", {
        className: "bp6-table-truncated-text"
      }, the_text);
    }
    return the_body;
  }
  let column_names = props.columns;
  let columns = column_names.map(column_name => {
    const cellRenderer = _cellRendererCreator(column_name);
    const columnHeaderCellRenderer = () => /*#__PURE__*/_react.default.createElement(_table.ColumnHeaderCell, {
      name: column_name,
      className: "library-header-cell",
      nameRenderer: _columnHeaderNameRenderer,
      menuRenderer: () => {
        return _renderMenu(column_name);
      }
    });
    return /*#__PURE__*/_react.default.createElement(_table.Column, {
      cellRenderer: cellRenderer,
      enableColumnReordering: false,
      columnHeaderCellRenderer: columnHeaderCellRenderer,
      key: column_name,
      name: column_name
    });
  });
  let dependencies;
  if (props.open_resources_ref && props.open_resources_ref.current) {
    dependencies = [props.data_dict, props.open_resources_ref.current];
  } else {
    dependencies = [props.data_dict];
  }
  return /*#__PURE__*/_react.default.createElement(_table.Table, {
    numRows: props.num_rows,
    ref: table_ref,
    cellRendererDependencies: dependencies,
    bodyContextMenuRenderer: props.renderBodyContextMenu,
    enableColumnReordering: false,
    enableColumnResizing: props.enableColumnResizing,
    maxColumnWidth: props.maxColumnWidth,
    enableMultipleSelection: true,
    defaultRowHeight: DEFAULT_ROW_HEIGHT,
    selectedRegions: props.selectedRegions,
    enableRowHeader: false,
    onColumnWidthChanged: props.onColumnWidthChanged,
    columnWidths: props.columnWidths ? props.columnWidths : columnWidths,
    onCompleteRender: _onCompleteRender,
    selectionModes: _table.SelectionModes.ALL,
    onSelection: regions => props.onSelection(regions)
  }, columns);
}
exports.BpSelectorTable = BpSelectorTable = /*#__PURE__*/(0, _react.memo)(BpSelectorTable);
function compute_initial_column_widths(header_list, data_list) {
  const max_field_width = MAX_INITIAL_CELL_WIDTH;

  // Get sample header and body cells

  // set up a canvas so that we can use it to compute the width of text
  // let body_font = $($(".bp6-table-truncated-text")[0]).css("font");
  const element = document.querySelector(".bp6-table-truncated-text");
  const body_font = window.getComputedStyle(element).getPropertyValue("font");
  //let header_font = $($(".bp6-table-column-name-text")[0]).css("font");
  const header_element = document.querySelector(".bp6-table-column-name-text");
  const header_font = window.getComputedStyle(header_element).getPropertyValue("font");
  let canvas_element = document.getElementById("measure-canvas");
  let ctx = canvas_element.getContext("2d");
  let added_body_width = 20;
  let added_header_width = 30;
  let column_widths = {};
  let columns_remaining = [];
  ctx.font = header_font;
  for (let c of header_list) {
    let cstr = String(c);
    if (cstr.startsWith("icon:")) {
      column_widths[cstr] = ICON_WIDTH;
    } else {
      column_widths[cstr] = ctx.measureText(cstr).width + added_header_width;
    }
    columns_remaining.push(cstr);
  }
  let the_row;
  let the_width;
  let the_text;

  // Find the width of each body cell
  // Keep track of the largest value for each column
  // Once a column has the max value can ignore that column in the future.
  ctx.font = body_font;
  for (const item of data_list) {
    if (columns_remaining.length == 0) {
      break;
    }
    the_row = item;
    let cols_to_remove = [];
    for (let c of columns_remaining) {
      the_text = String(the_row[c]);
      if (the_text.startsWith("icon:")) {
        the_width = ICON_WIDTH;
      } else {
        the_width = ctx.measureText(the_text).width + added_body_width;
      }
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
  let result = [];
  for (let c of header_list) {
    result.push(column_widths[c]);
  }
  return result;
}