import {showModalReact} from "./modal_react.js";

export {ProjectMenu, ColumnMenu, MenuComponent}

var Rbs = window.ReactBootstrap;

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
        let choices = pruned_list.map((opt_name, index) => (
            <Rbs.Dropdown.Item disabled={this.props.disable_all || this.props.disabled_items.includes(opt_name)}
                               onClick={this.props.option_dict[opt_name]}
                               key={opt_name}>
                {opt_name}
            </Rbs.Dropdown.Item>
        ));
        return (
            <Rbs.Dropdown>
                <Rbs.Dropdown.Toggle id={this.props.menu_name}
                                     variant="secondary"
                                     size="sm"
                >
                    {this.props.menu_name}
                </Rbs.Dropdown.Toggle>
                <Rbs.Dropdown.Menu>
                    {choices}
                </Rbs.Dropdown.Menu>
            </Rbs.Dropdown>
        )
    }
}

MenuComponent.propTypes = {
    menu_name: PropTypes.string,
    option_dict: PropTypes.object,
    disabled_items: PropTypes.array,
    disable_all: PropTypes.bool,
    hidden_items: PropTypes.array,
};

MenuComponent.defaultProps = {
    disabled_items: [],
    disable_all: false,
    hidden_items: []
};

class ProjectMenu extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this)
    }

    _saveProjectAs() {
        startSpinner();
        let self = this;
        postWithCallback("host", "get_project_names", {"user_id": window.user_id}, function (data) {
            let checkboxes;
            showModalReact("Save Project As", "New Project Name", CreateNewProject,
                      "NewProject", data["project_names"])
        });

        function CreateNewProject (new_name) {
            //let console_node = cleanse_bokeh(document.getElementById("console"));
            const result_dict = {
                "project_name": new_name,
                "main_id": window.main_id,
                "doc_type": "table",
                "purgetiles": true
            };

            result_dict.interface_state = self.props.interface_state;
            result_dict["purgetiles"] = true;
            postWithCallback(window.main_id, "save_new_project", result_dict, save_as_success);

            function save_as_success(data_object) {
                if (data_object["success"]) {
                    let is_jupyter = false;
                    window.is_project = true;
                    window._project_name = new_name;
                    document.title = new_name;
                    clearStatusMessage();
                    data_object.alert_type = "alert-success";
                    data_object.timeout = 2000;
                    postWithCallback("host", "refresh_project_selector_list", {'user_id': window.user_id});
                    doFlashStopSpinner(data_object);
                }
                else {
                    clearStatusMessage();
                    data_object["message"] = data_object["message"];
                    data_object["alert-type"] = "alert-warning";
                    doFlashStopSpinner(data_object)
                }
            }
        }
    }

    _saveProject () {
        // let console_node = cleanse_bokeh(document.getElementById("console"));
        let self = this;
        const result_dict = {
            "main_id": window.main_id,
        };

        result_dict.interface_state = this.props.interface_state;

        //tableObject.startTableSpinner();
        startSpinner();
        postWithCallback(window.main_id, "update_project", result_dict, updateSuccess);
        function updateSuccess(data) {
            startSpinner();
            if (data.success) {
                data.alert_type = "alert-success";
                data.timeout = 2000;

            }
            else {
                data.alert_type = "alert-warning";
            }
            clearStatusMessage();
            doFlashStopSpinner(data)
        }
    }

    _exportAsJupyter() {
        startSpinner();
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
                clearStatusMessage();
                if (data_object.success) {
                    data_object.alert_type = "alert-success";
                    data_object.timeout = 2000;
                }
                else {
                    data_object["alert-type"] = "alert-warning";
                }
                doFlashStopSpinner(data_object)
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
            "change collection": this.props.changeCollection
        }
    }

    render () {
        return (
            <MenuComponent menu_name="Project"
                           option_dict={this.option_dict}
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
        return {
            "Shift Left": this._shift_column_left,
            "Shift Right": this._shift_column_right,
            "Hide": this.props.hideColumn,
            "Hide in All Docs": this.props.hideInAll,
            "Unhide All": this.props.unhideAllColumns,
            "Add Column": this.props.addColumn,
            "Add Column In All Docs": this.props.addColumnInAll
        }
    }

    render () {
        return (
            <MenuComponent menu_name="Column"
                           option_dict={this.option_dict}
                           disabled_items={[]}
                           disable_all={this.props.disable_all}
                           hidden_items={[]}
            />
        )
    }
}
ColumnMenu.propTypes = {
    moveColumn: PropTypes.func,
    table_spec: PropTypes.object,
    selected_column: PropTypes.string,
    hideColumn: PropTypes.func,
    hideInAll: PropTypes.func,
    unhideAllColumns: PropTypes.func,
    addColumn: PropTypes.func,
    addColumnInAll: PropTypes.func,
    disable_all: PropTypes.bool,
};
