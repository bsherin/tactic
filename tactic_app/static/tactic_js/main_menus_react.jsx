
export {ProjectMenu, ColumnMenu, MenuComponent}

var Rbs = window.ReactBootstrap;

class MenuComponent extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this)
    }

    render () {
        let choices = Object.keys(this.props.option_dict).map((opt_name, index) => (
            <Rbs.Dropdown.Item disabled={!this.props.option_dict[opt_name]}
                               onClick={this.props.option_dict[opt_name]}
                               key={opt_name}
            >
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
    disabled_items: PropTypes.array
};

class ProjectMenu extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this)
    }

    get option_dict () {
        return {
            "saveAs": this.props.saveProjectAs,
            "save": this.props.saveProject,
            "export as jupyter notebook": this._exportAsJupyter,
            "open console as notebook": this._consoleToNotebook,
            "export table as collection": this._exportDataTable,
            "change collection": this._changeCollection
        }
    }
    render () {
        return (
            <MenuComponent menu_name="Project"
                           option_dict={this.option_dict}
                           disabled_items={[]}
            />
        )
    }
}

ProjectMenu.propTypes = {
    saveProjectAs: PropTypes.func,
    saveProject: PropTypes.func
};

class ColumnMenu extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this)
    }

    get option_dict () {
        return {
            "shift-left": this.props.shiftColumnLeft,
            "shift-right": this.props.shiftColumnRight,
            "hide": this.props.hideColumn,
            "hide in all docs": this.props.hideInAll,
            "unhide": this.props.unhideAllColumns,
            "add-column": this.props.addColumn,
            "add-column-in-all-doc": this.props.addColumnInAll
        }
    }

    render () {
        return (
            <MenuComponent menu_name="Column"
                           option_dict={this.option_dict}
            />
        )
    }
}
ColumnMenu.propTypes = {
    shiftColumnLeft: PropTypes.func,
    shiftColumnRight: PropTypes.func,
    hideColumn: PropTypes.func,
    hideInAll: PropTypes.func,
    unhideAllColumns: PropTypes.func,
    addColumn: PropTypes.func,
    addColumnInAll: PropTypes.func
};
