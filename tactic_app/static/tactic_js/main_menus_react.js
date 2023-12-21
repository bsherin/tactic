"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ColumnMenu = ColumnMenu;
exports.DocumentMenu = DocumentMenu;
Object.defineProperty(exports, "MenuComponent", {
  enumerable: true,
  get: function () {
    return _menu_utilities.MenuComponent;
  }
});
exports.ProjectMenu = ProjectMenu;
exports.RowMenu = RowMenu;
exports.ViewMenu = ViewMenu;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _markdownIt = _interopRequireDefault(require("markdown-it"));
require("markdown-it-latex/dist/index.css");
var _markdownItLatex = _interopRequireDefault(require("markdown-it-latex"));
var _communication_react = require("./communication_react");
var _menu_utilities = require("./menu_utilities");
var _modal_react = require("./modal_react");
var _toaster = require("./toaster");
var _error_drawer = require("./error_drawer");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const mdi = (0, _markdownIt.default)({
  html: true
});
mdi.use(_markdownItLatex.default);
function ProjectMenu(props) {
  const dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  var save_state;
  if (props.is_notebook) save_state = {
    console_items: props.console_items,
    show_exports_pane: props.mState.show_exports_pane,
    console_width_fraction: props.mState.console_width_fraction
  };else {
    save_state = {
      console_items: props.console_items,
      tile_list: props.tile_list,
      table_is_shrunk: props.mState.table_is_shrunk,
      horizontal_fraction: props.mState.horizontal_fraction,
      console_is_shrunk: props.mState.console_is_shrunk,
      height_fraction: props.mState.height_fraction,
      show_console_pane: props.mState.show_console_pane,
      console_is_zoomed: props.mState.console_is_zoomed,
      show_exports_pane: props.mState.show_exports_pane,
      console_width_fraction: props.mState.console_width_fraction
    };
  }
  function _saveProjectAs() {
    statusFuncs.startSpinner();
    (0, _communication_react.postWithCallback)("host", "get_project_names", {
      "user_id": window.user_id
    }, function (data) {
      let checkboxes = [{
        checkname: "lite_save",
        checktext: "create lite save"
      }];
      dialogFuncs.showModal("ModalDialog", {
        title: "Save Project As",
        field_title: "New Project Name",
        handleSubmit: CreateNewProject,
        default_value: "NewProject",
        existing_names: data.project_names,
        checkboxes: checkboxes,
        handleCancel: doCancel,
        handleClose: dialogFuncs.hideModal
      });
    }, null, props.main_id);
    function doCancel() {
      statusFuncs.stopSpinner();
    }
    function CreateNewProject(new_name, checkbox_states) {
      //let console_node = cleanse_bokeh(document.getElementById("console"));
      const result_dict = {
        "project_name": new_name,
        "main_id": props.main_id,
        "doc_type": "table",
        "purgetiles": true,
        "lite_save": checkbox_states["lite_save"]
      };
      result_dict.interface_state = save_state;
      if (props.is_notebook) {
        (0, _communication_react.postWithCallback)(props.main_id, "save_new_notebook_project", result_dict, save_as_success, errorDrawerFuncs.postAjaxFailure, props.main_id);
      } else {
        result_dict["purgetiles"] = true;
        (0, _communication_react.postWithCallback)(props.main_id, "save_new_project", result_dict, save_as_success, errorDrawerFuncs.postAjaxFailure, props.main_id);
      }
      function save_as_success(data_object) {
        if (data_object["success"]) {
          props.setProjectName(new_name, () => {
            if (!window.in_context) {
              document.title = new_name;
            }
            statusFuncs.clearStatusMessage();
            props.updateLastSave();
            statusFuncs.stopSpinner();
            statusFuncs.statusMessage(`Saved project ${new_name}`);
          });
        } else {
          statusFuncs.clearStatusMessage();
          statusFuncs.stopSpinner();
          errorDrawerFuncs.addErrorDrawerEntry({
            title: `Error saving project`,
            content: "message" in data_object ? data_object.message : ""
          });
        }
      }
    }
  }
  function _saveProject(lite_save) {
    // let console_node = cleanse_bokeh(document.getElementById("console"));
    const result_dict = {
      main_id: props.main_id,
      project_name: props.project_name,
      lite_save: lite_save
    };
    result_dict.interface_state = save_state;
    statusFuncs.startSpinner();
    (0, _communication_react.postWithCallback)(props.main_id, "update_project", result_dict, updateSuccess, errorDrawerFuncs.postAjaxFailure, props.main_id);
    function updateSuccess(data) {
      if (data.success) {
        props.updateLastSave();
        statusFuncs.statusMessage(`Saved project ${props.project_name}`);
      } else {
        errorDrawerFuncs.addErrorDrawerEntry({
          title: `Error saving project`,
          content: "message" in data ? data.message : ""
        });
        statusFuncs.clearStatusMessage();
      }
      statusFuncs.stopSpinner();
    }
  }
  function _exportAsPresentation() {
    (0, _communication_react.postWithCallback)("host", "get_collection_names", {
      "user_id": user_id
    }, function (data) {
      dialogFuncs.showModal("PresentationDialog", {
        handleSubmit: ExportPresentation,
        default_value: "NewPresentation",
        existing_names: data.collection_names,
        handleCancel: null,
        handleClose: dialogFuncs.hideModal
      });
    }, null, props.main_id);
    function ExportPresentation(use_dark_theme, save_as_collection, collection_name) {
      var cell_list = [];
      for (let entry of props.console_items) {
        let new_entry = {};
        new_entry.type = entry.type;
        switch (entry.type) {
          case "text":
            new_entry.console_text = mdi.render(entry.console_text);
            new_entry.raw_text = entry.console_text;
            new_entry.summary_text = entry.summary_text;
            break;
          case "code":
            new_entry.console_text = entry.console_text;
            new_entry.output_text = entry.output_text;
            new_entry.summary_text = entry.summary_text;
            break;
          case "divider":
            new_entry.header_text = entry.header_text;
            new_entry.summary_text = "";
            break;
          case "figure":
            new_entry.image_data_str = entry.image_data_str;
            new_entry.summary_text = entry.summary_text;
            break;
          default:
            new_entry.console_text = entry.console_text;
            new_entry.summary_text = entry.summary_text;
            break;
        }
        cell_list.push(new_entry);
      }
      var result_dict = {
        "project_name": props.project_name,
        "collection_name": collection_name,
        "save_as_collection": save_as_collection,
        "use_dark_theme": use_dark_theme,
        "presentation": true,
        "main_id": props.main_id,
        "cell_list": cell_list
      };
      (0, _communication_react.postWithCallback)(props.main_id, "export_as_presentation", result_dict, save_as_success, errorDrawerFuncs.postAjaxFailure, props.main_id);
      function save_as_success(data_object) {
        statusFuncs.clearStatusMessage();
        if (data_object.success) {
          if (save_as_collection) {
            statusFuncs.statusMessage("Exported presentation");
          } else {
            window.open(`${$SCRIPT_ROOT}/load_temp_page/${data_object["temp_id"]}`);
          }
        } else {
          errorDrawerFuncs.addErrorDrawerEntry({
            title: `Error exporting presentation`,
            content: "message" in data_object ? data_object.message : ""
          });
        }
      }
    }
  }
  function _exportAsReport() {
    (0, _communication_react.postWithCallback)("host", "get_collection_names", {
      "user_id": user_id
    }, function (data) {
      dialogFuncs.showModal("ReportDialog", {
        handleSubmit: ExportRport,
        default_value: "NewReport",
        existing_names: data.collection_names,
        handleCancel: null,
        handleClose: dialogFuncs.hideModal
      });
    }, null, props.main_id);
    function ExportRport(collapsible, include_summaries, use_dark_theme, save_as_collection, collection_name) {
      var cell_list = [];
      for (let entry of props.console_items) {
        let new_entry = {};
        new_entry.type = entry.type;
        switch (entry.type) {
          case "text":
            new_entry.console_text = mdi.render(entry.console_text);
            new_entry.raw_text = entry.console_text;
            new_entry.summary_text = entry.summary_text;
            break;
          case "code":
            new_entry.console_text = entry.console_text;
            new_entry.output_text = entry.output_text;
            new_entry.summary_text = entry.summary_text;
            break;
          case "divider":
            new_entry.header_text = entry.header_text;
            break;
          case "figure":
            new_entry.image_data_str = entry.image_data_str;
            new_entry.summary_text = entry.summary_text;
            break;
          default:
            new_entry.console_text = entry.console_text;
            new_entry.summary_text = entry.summary_text;
            break;
        }
        cell_list.push(new_entry);
      }
      var result_dict = {
        "project_name": props.project_name,
        "collection_name": collection_name,
        "save_as_collection": save_as_collection,
        "use_dark_theme": use_dark_theme,
        "collapsible": collapsible,
        "include_summaries": include_summaries,
        "main_id": props.main_id,
        "cell_list": cell_list
      };
      (0, _communication_react.postWithCallback)(props.main_id, "export_as_report", result_dict, save_as_success, errorDrawerFuncs.postAjaxFailure, props.main_id);
      function save_as_success(data_object) {
        statusFuncs.clearStatusMessage();
        if (data_object.success) {
          if (save_as_collection) {
            data_object.alert_type = "alert-success";
            data_object.timeout = 2000;
            statusFuncs.statusMessage("Exported report");
          } else {
            window.open(`${$SCRIPT_ROOT}/load_temp_page/${data_object["temp_id"]}`);
          }
        } else {
          errorDrawerFuncs.addErrorDrawerEntry({
            title: `Error exporting report`,
            content: "message" in data_object ? data_object.message : ""
          });
        }
      }
    }
  }
  function _exportAsJupyter() {
    statusFuncs.startSpinner();
    (0, _communication_react.postWithCallback)("host", "get_project_names", {
      "user_id": user_id
    }, function (data) {
      let checkboxes;
      // noinspection JSUnusedAssignment
      dialogFuncs.showModal("ModalDialog", {
        title: "Export Notebook in Jupyter Format",
        field_title: "New Project Name",
        handleSubmit: ExportJupyter,
        default_value: "NewJupyter",
        existing_names: data.project_names,
        checkboxes: [],
        handleCancel: null,
        handleClose: dialogFuncs.hideModal
      });
    }, null, props.main_id);
    function ExportJupyter(new_name) {
      var cell_list = [];
      for (let entry of props.console_items) {
        let new_cell = {};
        new_cell.source = entry.console_text;
        new_cell.cell_type = entry.type == "code" ? "code" : "markdown";
        if (entry.type == "code") {
          new_cell.outputs = [];
        }
        cell_list.push(new_cell);
      }
      const result_dict = {
        "project_name": new_name,
        "main_id": props.main_id,
        "cell_list": cell_list
      };
      (0, _communication_react.postWithCallback)(props.main_id, "export_to_jupyter_notebook", result_dict, save_as_success, errorDrawerFuncs.postAjaxFailure, props.main_id);
      function save_as_success(data_object) {
        statusFuncs.clearStatusMessage();
        if (data_object.success) {
          statusFuncs.statusMessage("Exported jupyter notebook");
        } else {
          errorDrawerFuncs.addErrorDrawerEntry({
            title: `Error exporting jupyter notebook`,
            content: "message" in data_object ? data_object.message : ""
          });
        }
        statusFuncs.stopSpinner();
      }
    }
  }
  function _exportDataTable() {
    (0, _communication_react.postWithCallback)("host", "get_collection_names", {
      "user_id": user_id
    }, function (data) {
      dialogFuncs.showModal("ModalDialog", {
        title: "Export Data",
        field_title: "New Collection NameName",
        handleSubmit: new_name => {
          const result_dict = {
            "export_name": new_name,
            "main_id": props.main_id,
            "user_id": window.user_id
          };
          $.ajax({
            url: $SCRIPT_ROOT + "/export_data",
            contentType: 'application/json',
            type: 'POST',
            async: true,
            data: JSON.stringify(result_dict),
            dataType: 'json'
          });
        },
        default_value: "new collection",
        existing_names: data.collection_names,
        checkboxes: [],
        handleCancel: null,
        handleClose: dialogFuncs.hideModal
      });
    });
  }
  function _consoleToNotebook() {
    const result_dict = {
      "main_id": props.main_id,
      "console_items": props.console_items,
      "user_id": window.user_id
    };
    (0, _communication_react.postWithCallback)(props.main_id, "console_to_notebook", result_dict, null, null, props.main_id);
  }
  function menu_items() {
    let cc_name;
    let cc_icon;
    if (props.mState.doc_type == "none") {
      cc_name = "Add Collection";
      cc_icon = "add";
    } else {
      cc_name = "Change Collection";
      cc_icon = "exchange";
    }
    let items = [{
      name_text: "Save As...",
      icon_name: "floppy-disk",
      click_handler: _saveProjectAs
    }, {
      name_text: "Save",
      icon_name: "saved",
      click_handler: () => {
        _saveProject(false);
      }
    }, {
      name_text: "Save Lite",
      icon_name: "saved",
      click_handler: () => {
        _saveProject(true);
      }
    }, {
      name_text: "divider1",
      icon_name: null,
      click_handler: "divider"
    }, {
      name_text: "Export as Jupyter Notebook",
      icon_name: "export",
      click_handler: _exportAsJupyter
    }, {
      name_text: "Create Report From Notebook",
      icon_name: "document",
      click_handler: _exportAsReport
    }, {
      name_text: "Create Presentation from Notebook",
      icon_name: "presentation",
      click_handler: _exportAsPresentation
    }, {
      name_text: "Export Table as Collection",
      icon_name: "export",
      click_handler: _exportDataTable
    }, {
      name_text: "Open Console as Notebook",
      icon_name: "console",
      click_handler: _consoleToNotebook
    }, {
      name_text: "divider2",
      icon_name: null,
      click_handler: "divider"
    }, {
      name_text: cc_name,
      icon_name: cc_icon,
      click_handler: props.changeCollection
    }, {
      name_text: "Remove Collection",
      icon_name: "cross-circle",
      click_handler: props.removeCollection
    }];
    let reduced_items = [];
    for (let item of items) {
      if (!props.hidden_items.includes(item.name_text)) {
        reduced_items.push(item);
      }
    }
    return reduced_items;
  }
  return /*#__PURE__*/_react.default.createElement(_menu_utilities.ToolMenu, {
    menu_name: "Project",
    menu_items: menu_items(),
    binding_dict: {},
    disabled_items: props.disabled_items,
    disable_all: false
  });
}
ProjectMenu.propTypes = {
  is_notebook: _propTypes.default.bool,
  console_items: _propTypes.default.array,
  tile_list: _propTypes.default.array,
  project_kind: _propTypes.default.string,
  postAjaxFailure: _propTypes.default.func,
  interface_state: _propTypes.default.object,
  updateLastSave: _propTypes.default.func,
  changeCollection: _propTypes.default.func,
  disabled_items: _propTypes.default.array,
  hidden_items: _propTypes.default.array
};
exports.ProjectMenu = ProjectMenu = /*#__PURE__*/(0, _react.memo)(ProjectMenu);
function DocumentMenu(props) {
  const dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  function _newDocument() {
    statusFuncs.startSpinner();
    dialogFuncs.showModal("ModalDialog", {
      title: "New Document",
      field_title: "New Document Name",
      handleSubmit: doNew,
      default_value: props.currentDoc,
      existing_names: props.documentNames,
      checkboxes: [],
      handleCancel: doCancel,
      handleClose: dialogFuncs.hideModal
    });
    function doCancel() {
      statusFuncs.stopSpinner();
    }
    function doNew(new_name) {
      (0, _communication_react.postWithCallback)(props.main_id, "new_blank_document", {
        model_document_name: props.currentDoc,
        new_document_name: new_name
      }, result => {
        statusFuncs.stopSpinner();
      }, null, props.main_id);
    }
  }
  function _duplicateDocument() {
    statusFuncs.startSpinner();
    dialogFuncs.showModal("ModalDialog", {
      title: "Duplicate Document",
      field_title: "New Document Name",
      handleSubmit: doDuplicate,
      default_value: props.currentDoc,
      existing_names: props.documentNames,
      checkboxes: [],
      handleCancel: doCancel,
      handleClose: dialogFuncs.hideModal
    });
    function doCancel() {
      statusFuncs.stopSpinner();
    }
    function doDuplicate(new_name) {
      (0, _communication_react.postWithCallback)(props.main_id, "duplicate_document", {
        original_document_name: props.currentDoc,
        new_document_name: new_name
      }, result => {
        statusFuncs.stopSpinner();
      }, null, props.main_id);
    }
  }
  function _renameDocument() {
    statusFuncs.startSpinner();
    dialogFuncs.showModal("ModalDialog", {
      title: "Rename Document",
      field_title: "New Document Name",
      handleSubmit: doRename,
      default_value: props.currentDoc,
      existing_names: props.documentNames,
      checkboxes: [],
      handleCancel: doCancel,
      handleClose: dialogFuncs.hideModal
    });
    function doCancel() {
      statusFuncs.stopSpinner();
    }
    function doRename(new_name) {
      (0, _communication_react.postWithCallback)(props.main_id, "rename_document", {
        old_document_name: props.currentDoc,
        new_document_name: new_name
      }, result => {
        statusFuncs.stopSpinner();
      }, null, props.main_id);
    }
  }
  const option_dict = {
    "New": _newDocument,
    "Duplicate": _duplicateDocument,
    "Rename": _renameDocument
  };
  const icon_dict = {
    "New": "document",
    "Duplicate": "duplicate",
    "Rename": "edit"
  };
  return /*#__PURE__*/_react.default.createElement(_menu_utilities.MenuComponent, {
    menu_name: "Document",
    option_dict: option_dict,
    icon_dict: icon_dict,
    binding_dict: {},
    disabled_items: props.disabled_items,
    hidden_items: []
  });
}
DocumentMenu.propTypes = {
  documentNames: _propTypes.default.array,
  currentDoc: _propTypes.default.string
};
exports.DocumentMenu = DocumentMenu = /*#__PURE__*/(0, _react.memo)(DocumentMenu);
function ColumnMenu(props) {
  function _shift_column_left() {
    let cnum = props.filtered_column_names.indexOf(props.selected_column);
    if (cnum == 0) return;
    let target_col = props.filtered_column_names[cnum - 1];
    props.moveColumn(props.selected_column, target_col);
  }
  function _shift_column_to_start() {
    let cnum = props.filtered_column_names.indexOf(props.selected_column);
    if (cnum == 0) return;
    let target_col = props.filtered_column_names[0];
    props.moveColumn(props.selected_column, target_col);
  }
  function _shift_column_right() {
    let cnum = props.table_spec.column_names.indexOf(props.selected_column);
    if (cnum == props.table_spec.column_names.length - 1) return;
    let target_col = props.table_spec.column_names[cnum + 2];
    props.moveColumn(props.selected_column, target_col);
  }
  function _shift_column_to_end() {
    let cnum = props.table_spec.column_names.indexOf(props.selected_column);
    if (cnum == props.table_spec.column_names.length - 1) return;
    props.moveColumn(props.selected_column, null);
  }
  const option_dict = {
    "Shift Left": _shift_column_left,
    "Shift Right": _shift_column_right,
    "Shift to Start": _shift_column_to_start,
    "Shift to End": _shift_column_to_end,
    "divider1": "divider",
    "Hide": props.hideColumn,
    "Hide in All Docs": props.hideInAll,
    "Unhide All": props.unhideAllColumns,
    "divider2": "divider",
    "Add Column": () => props.addColumn(false),
    "Add Column In All Docs": () => props.addColumn(true),
    "Delete Column": () => props.deleteColumn(false),
    "Delete Column In All Docs": () => props.deleteColumn(true)
  };
  const icon_dict = {
    "Shift Left": "direction-left",
    "Shift Right": "direction-right",
    "Shift to Start": "double-chevron-left",
    "Shift to End": "double-chevron-right",
    "Hide": "eye-off",
    "Hide in All Docs": "eye-off",
    "Unhide All": "eye-on",
    "Add Column": "add-column-right",
    "Add Column In All Docs": "add-column-right",
    "Delete Column": "remove-column",
    "Delete Column In All Docs": "remove-column"
  };
  return /*#__PURE__*/_react.default.createElement(_menu_utilities.MenuComponent, {
    menu_name: "Column",
    option_dict: option_dict,
    icon_dict: icon_dict,
    binding_dict: {},
    disabled_items: props.disabled_items,
    hidden_items: []
  });
}
ColumnMenu.propTypes = {
  moveColumn: _propTypes.default.func,
  table_spec: _propTypes.default.object,
  filtered_column_names: _propTypes.default.array,
  selected_column: _propTypes.default.string,
  hideColumn: _propTypes.default.func,
  hideInAll: _propTypes.default.func,
  unhideAllColumns: _propTypes.default.func,
  addColumn: _propTypes.default.func,
  deleteColumn: _propTypes.default.func,
  disabled_items: _propTypes.default.array
};
exports.ColumnMenu = ColumnMenu = /*#__PURE__*/(0, _react.memo)(ColumnMenu);
function RowMenu(props) {
  const option_dict = {
    "Insert Row Before": props.insertRowBefore,
    "Insert Row After": props.insertRowAfter,
    "Duplicate Row": props.duplicateRow,
    "Delete Row": props.deleteRow
  };
  const icon_dict = {
    "Insert Row Before": "add-row-top",
    "Insert Row After": "add-row-bottom",
    "Duplicate Row": "add-row-bottom",
    "Delete Row": "remove-row-bottom"
  };
  return /*#__PURE__*/_react.default.createElement(_menu_utilities.MenuComponent, {
    menu_name: "Row",
    option_dict: option_dict,
    icon_dict: icon_dict,
    binding_dict: {},
    disabled_items: props.disabled_items,
    hidden_items: []
  });
}
RowMenu.propTypes = {
  selected_row: _propTypes.default.number,
  deleteRow: _propTypes.default.func,
  insertRowBefore: _propTypes.default.func,
  insertRowAfter: _propTypes.default.func,
  duplicateRow: _propTypes.default.func,
  disabled_items: _propTypes.default.array
};
exports.RowMenu = RowMenu = /*#__PURE__*/(0, _react.memo)(RowMenu);
function ViewMenu(props) {
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  function _shift_column_left() {
    let cnum = props.table_spec.column_names.indexOf(props.selected_column);
    if (cnum == 0) return;
    let target_col = props.table_spec.column_names[cnum - 1];
    _moveColumn(props.selected_column, target_col);
  }
  function _shift_column_right() {
    let cnum = props.table_spec.column_names.indexOf(props.selected_column);
    if (cnum == props.table_spec.column_names.length - 1) return;
    let target_col = props.table_spec.column_names[cnum + 2];
    _moveColumn(props.selected_column, target_col);
  }
  function _toggleExports() {
    props.setMainStateValue("show_exports_pane", !props.show_exports_pane);
  }
  function _toggleConsole() {
    props.setMainStateValue("show_console_pane", !props.show_console_pane);
  }
  function option_dict() {
    let result = {};
    if (props.toggleTableShrink) {
      let table_opt_name = props.table_is_shrunk ? "Maximize Table" : "Minimize Table";
      result[table_opt_name] = props.toggleTableShrink;
      result["divider1"] = "divider";
    }
    let console_opt_name = props.show_console_pane ? "Hide Log" : "Show Log";
    result[console_opt_name] = _toggleConsole;
    let exports_opt_name = props.show_exports_pane ? "Hide Exports" : "Show Exports";
    result[exports_opt_name] = _toggleExports;
    result["divider2"] = "divider";
    result["Show Error Drawer"] = errorDrawerFuncs.openErrorDrawer;
    return result;
  }
  function icon_dict() {
    let result = {};
    if (props.toggleTableShrink) {
      let opt_name = props.table_is_shrunk ? "Maximize Table" : "Minimize Table";
      result[opt_name] = props.table_is_shrunk ? "maximize" : "minimize";
    }
    let console_opt_name = props.show_console_pane ? "Hide Log" : "Show Log";
    let exports_opt_name = props.show_exports_pane ? "Hide Exports" : "Show Exports";
    result[console_opt_name] = "code";
    result[exports_opt_name] = "variable";
    result["Show Error Drawer"] = "panel-stats";
    return result;
  }
  return /*#__PURE__*/_react.default.createElement(_menu_utilities.MenuComponent, {
    menu_name: "View",
    option_dict: option_dict(),
    icon_dict: icon_dict(),
    disabled_items: [],
    binding_dict: {},
    disable_all: props.disable_all,
    hidden_items: []
  });
}
ViewMenu.propTypes = {
  table_is_shrunk: _propTypes.default.bool,
  toggleTableShrink: _propTypes.default.func,
  openErrorDrawer: _propTypes.default.func,
  show_exports_pane: _propTypes.default.bool,
  show_console_pane: _propTypes.default.bool,
  setMainStateValue: _propTypes.default.func
};
exports.ViewMenu = ViewMenu = /*#__PURE__*/(0, _react.memo)(ViewMenu);