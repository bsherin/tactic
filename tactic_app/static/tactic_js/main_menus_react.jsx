

import React from "react";
import PropTypes from 'prop-types';

import { MenuItem, Menu, Popover, PopoverPosition, Button } from "@blueprintjs/core";

import {showModalReact} from "./modal_react.js";
import {postWithCallback} from "./communication_react.js"
import {doFlash} from "./toaster.js"
import {doBinding} from "./utilities_react.js";

export {ProjectMenu, ColumnMenu, ViewMenu, MenuComponent}

class MenuComponent extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this)
    }

     _filter_on_match_list(opt_name) {
        return !this.props.hidden_items.includes(opt_name)
    }

    render () {
        let pruned_list = Object.keys(this.props.option_dict).filter(this._filter_on_match_list);
        let choices = pruned_list.map((opt_name, index) => {
                let icon = this.props.icon_dict.hasOwnProperty(opt_name) ? this.props.icon_dict[opt_name] : null;
                return (
                    <MenuItem disabled={this.props.disable_all || this.props.disabled_items.includes(opt_name)}
                                 onClick={this.props.option_dict[opt_name]}
                                 icon={icon}
                                 key={opt_name}
                                 text={opt_name}
                    >
                    </MenuItem>
                )
            }
        );
        let the_menu = (
            <Menu>
                {choices}
            </Menu>
        );
        if (this.props.alt_button) {
            let AltButton = this.props.alt_button;
            return (<Popover minimal={true} content={the_menu} position={PopoverPosition.BOTTOM_LEFT}>
                <AltButton/>
            </Popover>)
        } else {
            return (
                <Popover minimal={true} content={the_menu} position={PopoverPosition.BOTTOM_LEFT}>
                    <Button text={this.props.menu_name} small={true} minimal={true}/>
                </Popover>
            )
        }
    }
}

MenuComponent.propTypes = {
    menu_name: PropTypes.string,
    option_dict: PropTypes.object,
    icon_dict: PropTypes.object,
    disabled_items: PropTypes.array,
    disable_all: PropTypes.bool,
    hidden_items: PropTypes.array,
    alt_button: PropTypes.func
};

MenuComponent.defaultProps = {
    disabled_items: [],
    disable_all: false,
    hidden_items: [],
    icon_dict: {},
    alt_button: null
};

class ProjectMenu extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this)
    }

    _saveProjectAs() {
        this.props.startSpinner();
        let self = this;
        postWithCallback("host", "get_project_names", {"user_id": window.user_id}, function (data) {
            let checkboxes;
            showModalReact("Save Project As", "New Project Name", CreateNewProject,
                      "NewProject", data["project_names"], null, doCancel)
        });

        function doCancel() {
            self.props.stopSpinner()
        }
        function CreateNewProject (new_name) {
            //let console_node = cleanse_bokeh(document.getElementById("console"));
            const result_dict = {
                "project_name": new_name,
                "main_id": window.main_id,
                "doc_type": "table",
                "purgetiles": true
            };

            result_dict.interface_state = self.props.interface_state;
            if (window.is_notebook) {
                postWithCallback(window.main_id, "save_new_notebook_project", result_dict, save_as_success);
            }
            else {
                result_dict["purgetiles"] = true;
                postWithCallback(window.main_id, "save_new_project", result_dict, save_as_success);
            }


            function save_as_success(data_object) {
                if (data_object["success"]) {
                    window.is_project = true;
                    window._project_name = new_name;
                    window.is_jupyter = false;
                    document.title = new_name;
                    self.props.clearStatusMessage();
                    data_object.alert_type = "alert-success";
                    data_object.timeout = 2000;
                    postWithCallback("host", "refresh_project_selector_list", {'user_id': window.user_id});
                    self.props.updateLastSave();
                    self.props.stopSpinner();
                    doFlash(data_object)
                }
                else {
                    self.props.clearStatusMessage();
                    data_object["message"] = data_object["message"];
                    data_object["alert-type"] = "alert-warning";
                    self.props.stopSpinner();
                    doFlash(data_object)
                }
            }
        }
    }

    _saveProject () {
        // let console_node = cleanse_bokeh(document.getElementById("console"));
        let self = this;
        const result_dict = {
            main_id: window.main_id,
            project_name: window._project_name
        };

        result_dict.interface_state = this.props.interface_state;

        //tableObject.startTableSpinner();
        this.props.startSpinner();
        postWithCallback(window.main_id, "update_project", result_dict, updateSuccess);
        function updateSuccess(data) {
            self.props.startSpinner();
            if (data.success) {
                data["alert_type"] = "alert-success";
                data.timeout = 2000;
                self.props.updateLastSave();
            }
            else {
                data["alert_type"] = "alert-warning";
            }
            self.props.clearStatusMessage();
            self.props.stopSpinner();
            doFlash(data)
        }
    }

    _exportAsJupyter() {
        this.props.startSpinner();
        let self = this;
        postWithCallback("host", "get_project_names", {"user_id": user_id}, function (data) {
            let checkboxes;
            // noinspection JSUnusedAssignment
            showModalReact("Export Notebook in Jupyter Format", "New Project Name", ExportJupyter,
                      "NewJupyter", data["project_names"], checkboxes)
        });
        function ExportJupyter(new_name) {
            var cell_list = [];
            for (let entry of self.props.console_items) {
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
                "main_id": window.main_id,
                "cell_list": cell_list
            };
            postWithCallback(window.main_id, "export_to_jupyter_notebook", result_dict, save_as_success);

            function save_as_success(data_object) {
               self.props.clearStatusMessage();
                if (data_object.success) {
                    data_object.alert_type = "alert-success";
                    data_object.timeout = 2000;
                }
                else {
                    data_object["alert-type"] = "alert-warning";
                }
                self.props.stopSpinner();
                doFlash(data_object)
            }
        }
    }

    _exportDataTable() {
        showModalReact("Export Data", "New Collection Name", function (new_name) {
            const result_dict = {
                "export_name": new_name,
                "main_id": window.main_id,
                "user_id": window.user_id
            };
            $.ajax({
                url: $SCRIPT_ROOT + "/export_data",
                contentType : 'application/json',
                type : 'POST',
                async: true,
                data: JSON.stringify(result_dict),
                dataType: 'json'
            });
        })
    }

    _consoleToNotebook() {
        const result_dict = {
            "main_id": window.main_id,
            "console_items": this.props.console_items,
            "user_id": window.user_id,
        };
        postWithCallback(window.main_id, "console_to_notebook", result_dict)
    }

    get option_dict () {
        return {
            "Save As...": this._saveProjectAs,
            "Save": this._saveProject,
            "Export as Jupyter Notebook": this._exportAsJupyter,
            "Open Console as Notebook": this._consoleToNotebook,
            "Export Table as Collection": this._exportDataTable,
            "Change collection": this.props.changeCollection
        }
    }

    get icon_dict() {
        return {
            "Save As...": "floppy-disk",
            "Save": "saved",
            "Export as Jupyter Notebook": "export",
            "Open Console as Notebook": "console",
            "Export Table as Collection": "export",
            "Change collection": "exchange"
        }
    }

    render () {
        return (
            <MenuComponent menu_name="Project"
                           option_dict={this.option_dict}
                           icon_dict={this.icon_dict}
                           disabled_items={this.props.disabled_items}
                           disable_all={false}
                           hidden_items={this.props.hidden_items}
            />
        )
    }
}

ProjectMenu.propTypes = {
    console_items: PropTypes.array,
    interface_state: PropTypes.object,
    updateLastSave: PropTypes.func,
    changeCollection: PropTypes.func,
    disabled_items: PropTypes.array,
    hidden_items: PropTypes.array
};

class ColumnMenu extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this)
    }

    _shift_column_left() {
        let cnum = this.props.filtered_column_names.indexOf(this.props.selected_column);
        if (cnum == 0) return;
        let target_col = this.props.filtered_column_names[cnum - 1];
        this.props.moveColumn(this.props.selected_column, target_col);
    }

    _shift_column_right() {
        let cnum = this.props.table_spec.column_names.indexOf(this.props.selected_column);
        if (cnum == (this.props.table_spec.column_names.length - 1)) return;
        let target_col = this.props.table_spec.column_names[cnum + 2];
        this.props.moveColumn(this.props.selected_column, target_col);
    }


    get option_dict () {
        return {
            "Shift Left": this._shift_column_left,
            "Shift Right": this._shift_column_right,
            "Hide": this.props.hideColumn,
            "Hide in All Docs": this.props.hideInAll,
            "Unhide All": this.props.unhideAllColumns,
            "Add Column": () => this.props.addColumn(false),
            "Add Column In All Docs": () => this.props.addColumn(true)
        }
    }

    get icon_dict () {
        return {
            "Shift Left": "direction-left",
            "Shift Right": "direction-right",
            "Hide": "eye-off",
            "Hide in All Docs": "eye-off",
            "Unhide All": "eye-on",
            "Add Column": "add-column-right",
            "Add Column In All Docs": "add-column-right"
        }
    }


    render () {
        return (
            <MenuComponent menu_name="Column"
                           option_dict={this.option_dict}
                           icon_dict={this.icon_dict}
                           disabled_items={this.props.disabled_items}
                           hidden_items={[]}
            />
        )
    }
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
    disabled_items: PropTypes.array,
};

class ViewMenu extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this)
    }

    _shift_column_left() {
        let cnum = this.props.table_spec.column_names.indexOf(this.props.selected_column);
        if (cnum == 0) return;
        let target_col = this.props.table_spec.column_names[cnum - 1];
        this._moveColumn(this.props.selected_column, target_col);
    }

    _shift_column_right() {
        let cnum = this.props.table_spec.column_names.indexOf(this.props.selected_column);
        if (cnum == (this.props.table_spec.column_names.length - 1)) return;
        let target_col = this.props.table_spec.column_names[cnum + 2];
        this._moveColumn(this.props.selected_column, target_col);
    }


    get option_dict () {
        let opt_name = this.props.table_is_shrunk ? "Maximize Table" : "Minimize Table";
        let result = {};
        result[opt_name] = this.props.toggleTableShrink;
        result["Show Error Drawer"] = this.props.openErrorDrawer;
        return result
    }

    get icon_dict () {
        let opt_name = this.props.table_is_shrunk ? "Maximize Table" : "Minimize Table";
        let result = {};
        result[opt_name] = this.props.table_is_shrunk ? "maximize" : "minimize";
        result["Show Error Drawer"] = "panel-stats";
        return result
    }

    render () {
        return (
            <MenuComponent menu_name="View"
                           option_dict={this.option_dict}
                           icon_dict={this.icon_dict}
                           disabled_items={[]}
                           disable_all={this.props.disable_all}
                           hidden_items={[]}
            />
        )
    }
}
ViewMenu.propTypes = {
    table_is_shrunk: PropTypes.bool,
    toggleTableShrink: PropTypes.func,
    openErrorDrawer: PropTypes.func
};
