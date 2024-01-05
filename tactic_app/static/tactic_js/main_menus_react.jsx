import React from "react";
import {memo, useContext} from "react";
import PropTypes from 'prop-types';
import markdownIt from 'markdown-it'
import 'markdown-it-latex/dist/index.css'
import markdownItLatex from 'markdown-it-latex'

const mdi = markdownIt({html: true});
mdi.use(markdownItLatex);

import {postPromise, postAjaxPromise} from "./communication_react"
import {MenuComponent, ToolMenu} from "./menu_utilities";

import {DialogContext} from "./modal_react";
import {StatusContext} from "./toaster"
import {ErrorDrawerContext} from "./error_drawer";

export {ProjectMenu, DocumentMenu, ColumnMenu, RowMenu, ViewMenu, MenuComponent}

function ProjectMenu(props) {

    const dialogFuncs = useContext(DialogContext);
    const statusFuncs = useContext(StatusContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);

    var save_state;
    if (props.is_notebook)
        save_state = {
            console_items: props.console_items,
            show_exports_pane: props.mState.show_exports_pane,
            console_width_fraction: props.mState.console_width_fraction
        };
    else {
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

    async function _saveProjectAs() {
        statusFuncs.startSpinner();
        let data = await postPromise("host", "get_project_names", {"user_id": window.user_id}, props.main_id);
        let checkboxes = [{checkname: "lite_save", checktext: "create lite save"}];

        try {
            let [new_name, checkbox_states] = await dialogFuncs.showModalPromise("ModalDialog", {
                title: "Save Project As",
                field_title: "New Project Name",
                default_value: "NewProject",
                existing_names: data.project_names,
                checkboxes: checkboxes,
                handleClose: dialogFuncs.hideModal,
            });
            const result_dict = {
                "project_name": new_name,
                "main_id": props.main_id,
                "doc_type": "table",
                "purgetiles": true,
                "lite_save": checkbox_states["lite_save"]
            };

            result_dict.interface_state = save_state;
            let data_object;
            if (props.is_notebook) {
                await postPromise(props.main_id, "save_new_notebook_project", result_dict, props.main_id);
            } else {
                result_dict["purgetiles"] = true;
                await postPromise(props.main_id, "save_new_project", result_dict, props.main_id);
            }
            props.setProjectName(new_name, () => {
                if (!window.in_context) {
                    document.title = new_name;
                }
                statusFuncs.clearStatusMessage();
                props.updateLastSave();
                statusFuncs.stopSpinner();
                statusFuncs.statusMessage(`Saved project ${new_name}`)
            });
        } catch (e) {
            if (e != "canceled") {
                let title = "title" in e ? e.title : "Error saving project";
                errorDrawerFuncs.addFromError(title, e)
            }
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();
        }
    }

    async function _saveProject(lite_save) {
        try {
            const result_dict = {
                main_id: props.main_id,
                project_name: props.project_name,
                lite_save: lite_save
            };

            result_dict.interface_state = save_state;

            statusFuncs.startSpinner();
            await postPromise(props.main_id, "update_project", result_dict, props.main_id);
            props.updateLastSave();
            statusFuncs.statusMessage(`Saved project ${props.project_name}`);
            statusFuncs.stopSpinner();
        } catch (e) {
            let title = "title" in e ? e.title : "Error saving project";
            errorDrawerFuncs.addFromError(title, e);
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();
        }
    }

    async function _exportAsPresentation() {
        try {
            let data = await postPromise("host", "get_collection_names", {"user_id": user_id}, props.main_id);
            let [use_dark_theme, save_as_collection, collection_name] = await dialogFuncs.showModalPromise(
                "PresentationDialog", {
                default_value: "NewPresentation",
                existing_names: data.collection_names,
                handleClose: dialogFuncs.hideModal
            });
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
                cell_list.push(new_entry)
            }
            var result_dict = {
                "project_name": props.project_name,
                "collection_name": collection_name,
                "save_as_collection": save_as_collection,
                "use_dark_theme": use_dark_theme,
                "presentation": true,
                "main_id": props.main_id,
                "cell_list": cell_list,
            };
            let data_object = await postPromise(props.main_id, "export_as_presentation",
                result_dict, props.main_id);
            statusFuncs.clearStatusMessage();
            if (save_as_collection) {
                statusFuncs.statusMessage("Exported presentation")
            } else {
                window.open(`${$SCRIPT_ROOT}/load_temp_page/${data_object["temp_id"]}`)
            }
        } catch (e) {
            if (e != "canceled") {
                let title = "title" in e ? e.title : "Error exporting presentation";
                errorDrawerFuncs.addFromError(title, e)
            }

        }
    }

    async function _exportAsReport() {
        try {
            let data = await postPromise("host", "get_collection_names", {"user_id": user_id}, props.main_id);
            let [collapsible, include_summaries, use_dark_theme, save_as_collection, collection_name] =
                await dialogFuncs.showModalPromise("ReportDialog", {
                    default_value: "NewReport",
                    existing_names: data.collection_names,
                    handleClose: dialogFuncs.hideModal
                });
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
                cell_list.push(new_entry)
            }

            var result_dict = {
                "project_name": props.project_name,
                "collection_name": collection_name,
                "save_as_collection": save_as_collection,
                "use_dark_theme": use_dark_theme,
                "collapsible": collapsible,
                "include_summaries": include_summaries,
                "main_id": props.main_id,
                "cell_list": cell_list,
            };
            let data_object = await postPromise(props.main_id, "export_as_report", result_dict, props.main_id);

            statusFuncs.clearStatusMessage();
            if (save_as_collection) {
                data_object.alert_type = "alert-success";
                data_object.timeout = 2000;
                statusFuncs.statusMessage("Exported report")
            } else {
                window.open(`${$SCRIPT_ROOT}/load_temp_page/${data_object["temp_id"]}`)
            }
        }
        catch (e) {
            if (e != "canceled") {
                let title = "title" in e ? e.title : "Error exporting report";
                errorDrawerFuncs.addFromError(title, e)
            }
            statusFuncs.clearStatusMessage();
        }
    }

    async function _exportAsJupyter() {
        statusFuncs.startSpinner();
        try {
            let data = await postPromise("host", "get_project_names", {"user_id": user_id}, props.main_id);
            let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                title: "Export Notebook in Jupyter Format",
                field_title: "New Project Name",
                default_value: "NewJupyter",
                existing_names: data.project_names,
                checkboxes: [],
                handleClose: dialogFuncs.hideModal,
            });
            var cell_list = [];
            for (let entry of props.console_items) {
                let new_cell = {};
                new_cell.source = entry.console_text;
                new_cell.cell_type = entry.type == "code" ? "code" : "markdown";
                if (entry.type == "code") {
                    new_cell.outputs = [];
                }
                cell_list.push(new_cell)
            }
            const result_dict = {
                "project_name": new_name,
                "main_id": props.main_id,
                "cell_list": cell_list
            };
            let data_object = await postPromise(props.main_id, "export_to_jupyter_notebook",
                result_dict, props.main_id);
            statusFuncs.statusMessage("Exported jupyter notebook");
            statusFuncs.stopSpinner();
        }
        catch (e) {
            if (e != "canceled") {
                let title = "title" in e ? e.title : "Error exporting as Jupyter notebook";
                errorDrawerFuncs.addFromError(title, e)
            }
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();
        }
    }

    async function _exportDataTable() {
        try {
            let data = await postPromise("host", "get_collection_names", {"user_id": user_id});
            let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                    title: "Export Data",
                    field_title: "New Collection NameName",
                    default_value: "new collection",
                    existing_names: data.collection_names,
                    checkboxes: [],
                    handleClose: dialogFuncs.hideModal,
                });
            const result_dict = {
                "export_name": new_name,
                "main_id": props.main_id,
                "user_id": window.user_id
            };
            await postAjaxPromise("export_data", result_dict);
            statusFuncs.statusMessage("Exported table as collection")
        }
        catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError("Error exporting table", e)
            }
        }
    }

    async function _consoleToNotebook() {
        try {
            const result_dict = {
                "main_id": props.main_id,
                "console_items": props.console_items,
                "user_id": window.user_id,
            };
            await postPromise(props.main_id, "console_to_notebook", result_dict, props.main_id)
        }
        catch (e) {
            errorDrawerFuncs.addFromError("Error converting to notebook", e);
        }
    }

    function menu_items() {
        let cc_name;
        let cc_icon;
        if (props.mState.doc_type == "none") {
            cc_name = "Add Collection";
            cc_icon = "add"
        } else {
            cc_name = "Change Collection";
            cc_icon = "exchange"
        }
        let items = [
            {name_text: "Save As...", icon_name: "floppy-disk", click_handler: _saveProjectAs},
            {
                name_text: "Save", icon_name: "saved", click_handler: async () => {
                    await _saveProject(false)
                }
            },
            {
                name_text: "Save Lite", icon_name: "saved", click_handler: async () => {
                    await _saveProject(true)
                }
            },
            {name_text: "divider1", icon_name: null, click_handler: "divider"},
            {name_text: "Export as Jupyter Notebook", icon_name: "export", click_handler: _exportAsJupyter,},
            {name_text: "Create Report From Notebook", icon_name: "document", click_handler: _exportAsReport,},
            {
                name_text: "Create Presentation from Notebook",
                icon_name: "presentation",
                click_handler: _exportAsPresentation,
            },
            {name_text: "Export Table as Collection", icon_name: "export", click_handler: _exportDataTable},
            {name_text: "Open Console as Notebook", icon_name: "console", click_handler: _consoleToNotebook},
            {name_text: "divider2", icon_name: null, click_handler: "divider"},
            {name_text: cc_name, icon_name: cc_icon, click_handler: props.changeCollection},
            {name_text: "Remove Collection", icon_name: "cross-circle", click_handler: props.removeCollection},
        ];
        let reduced_items = [];
        for (let item of items) {
            if (!props.hidden_items.includes(item.name_text)) {
                reduced_items.push(item)
            }
        }
        return reduced_items
    }

    return (
        <ToolMenu menu_name="Project"
                  menu_items={menu_items()}
                  binding_dict={{}}
                  disabled_items={props.disabled_items}
                  disable_all={false}
        />
    )
}

ProjectMenu.propTypes = {
    is_notebook: PropTypes.bool,
    console_items: PropTypes.array,
    tile_list: PropTypes.array,
    project_kind: PropTypes.string,
    postAjaxFailure: PropTypes.func,
    interface_state: PropTypes.object,
    updateLastSave: PropTypes.func,
    changeCollection: PropTypes.func,
    disabled_items: PropTypes.array,
    hidden_items: PropTypes.array
};

ProjectMenu = memo(ProjectMenu);

function DocumentMenu(props) {

    const dialogFuncs = useContext(DialogContext);
    const statusFuncs = useContext(StatusContext);

    async function _newDocument() {
        try {
            statusFuncs.startSpinner();
            let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                title: "New Document",
                field_title: "New Document Name",
                default_value: props.currentDoc,
                existing_names: props.documentNames,
                checkboxes: [],
                handleClose: dialogFuncs.hideModal,
            });
            await postPromise(props.main_id, "new_blank_document", {
                    model_document_name: props.currentDoc,
                    new_document_name: new_name
                }, props.main_id);
            statusFuncs.stopSpinner()
        }
        catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError(`Error adding new document`, e)
            }
            statusFuncs.stopSpinner();
        }
    }

    async function _duplicateDocument() {
        try {
            statusFuncs.startSpinner();
            let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                title: "Duplicate Document",
                field_title: "New Document Name",
                default_value: props.currentDoc,
                existing_names: props.documentNames,
                checkboxes: [],
                handleClose: dialogFuncs.hideModal,
            });
            await postPromise(props.main_id, "duplicate_document", {
                    original_document_name: props.currentDoc,
                    new_document_name: new_name
                }, props.main_id);
            statusFuncs.stopSpinner()
        }
        catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError(`Error duplicating document`, e)
            }
            statusFuncs.stopSpinner()
        }
    }

    async function _renameDocument() {
        try {
            statusFuncs.startSpinner();
            let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                title: "Rename Document",
                field_title: "New Document Name",
                default_value: props.currentDoc,
                existing_names: props.documentNames,
                checkboxes: [],
                handleClose: dialogFuncs.hideModal,
            });
            await postPromise(props.main_id, "rename_document", {
                    old_document_name: props.currentDoc,
                    new_document_name: new_name
                }, props.main_id);
            statusFuncs.stopSpinner()
        }
        catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError(`Error renaming document`, e)
            }
            statusFuncs.stopSpinner()
        }
    }

    const option_dict = {
        "New": _newDocument,
        "Duplicate": _duplicateDocument,
        "Rename": _renameDocument,
    };

    const icon_dict = {
        "New": "document",
        "Duplicate": "duplicate",
        "Rename": "edit"
    };

    return (
        <MenuComponent menu_name="Document"
                       option_dict={option_dict}
                       icon_dict={icon_dict}
                       binding_dict={{}}
                       disabled_items={props.disabled_items}
                       hidden_items={[]}
        />
    )
}

DocumentMenu.propTypes = {
    documentNames: PropTypes.array,
    currentDoc: PropTypes.string,
};

DocumentMenu = memo(DocumentMenu);

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
        if (cnum == (props.table_spec.column_names.length - 1)) return;
        let target_col = props.table_spec.column_names[cnum + 2];
        props.moveColumn(props.selected_column, target_col);
    }

    function _shift_column_to_end() {
        let cnum = props.table_spec.column_names.indexOf(props.selected_column);
        if (cnum == (props.table_spec.column_names.length - 1)) return;
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
    return (
        <MenuComponent menu_name="Column"
                       option_dict={option_dict}
                       icon_dict={icon_dict}
                       binding_dict={{}}
                       disabled_items={props.disabled_items}
                       hidden_items={[]}
        />
    )
}

ColumnMenu.propTypes = {
    moveColumn: PropTypes.func,
    table_spec: PropTypes.object,
    filtered_column_names: PropTypes.array,
    selected_column: PropTypes.string,
    hideColumn: PropTypes.func,
    hideInAll: PropTypes.func,
    unhideAllColumns: PropTypes.func,
    addColumn: PropTypes.func,
    deleteColumn: PropTypes.func,
    disabled_items: PropTypes.array,
};

ColumnMenu = memo(ColumnMenu);

function RowMenu(props) {
    const option_dict = {
        "Insert Row Before": props.insertRowBefore,
        "Insert Row After": props.insertRowAfter,
        "Duplicate Row": props.duplicateRow,
        "Delete Row": props.deleteRow,
    };

    const icon_dict = {
        "Insert Row Before": "add-row-top",
        "Insert Row After": "add-row-bottom",
        "Duplicate Row": "add-row-bottom",
        "Delete Row": "remove-row-bottom"
    };

    return (
        <MenuComponent menu_name="Row"
                       option_dict={option_dict}
                       icon_dict={icon_dict}
                       binding_dict={{}}
                       disabled_items={props.disabled_items}
                       hidden_items={[]}
        />
    )
}

RowMenu.propTypes = {
    selected_row: PropTypes.number,
    deleteRow: PropTypes.func,
    insertRowBefore: PropTypes.func,
    insertRowAfter: PropTypes.func,
    duplicateRow: PropTypes.func,
    disabled_items: PropTypes.array,
};

RowMenu = memo(RowMenu);

function ViewMenu(props) {
    const errorDrawerFuncs = useContext(ErrorDrawerContext);

    function _shift_column_left() {
        let cnum = props.table_spec.column_names.indexOf(props.selected_column);
        if (cnum == 0) return;
        let target_col = props.table_spec.column_names[cnum - 1];
        _moveColumn(props.selected_column, target_col);
    }

    function _shift_column_right() {
        let cnum = props.table_spec.column_names.indexOf(props.selected_column);
        if (cnum == (props.table_spec.column_names.length - 1)) return;
        let target_col = props.table_spec.column_names[cnum + 2];
        _moveColumn(props.selected_column, target_col);
    }

    function _toggleExports() {
        props.setMainStateValue("show_exports_pane", !props.show_exports_pane)
    }

    function _toggleConsole() {
        props.setMainStateValue("show_console_pane", !props.show_console_pane)
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
        return result
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
        return result
    }

    return (
        <MenuComponent menu_name="View"
                       option_dict={option_dict()}
                       icon_dict={icon_dict()}
                       disabled_items={[]}
                       binding_dict={{}}
                       disable_all={props.disable_all}
                       hidden_items={[]}
        />
    )
}

ViewMenu.propTypes = {
    table_is_shrunk: PropTypes.bool,
    toggleTableShrink: PropTypes.func,
    openErrorDrawer: PropTypes.func,
    show_exports_pane: PropTypes.bool,
    show_console_pane: PropTypes.bool,
    setMainStateValue: PropTypes.func,
};

ViewMenu = memo(ViewMenu);