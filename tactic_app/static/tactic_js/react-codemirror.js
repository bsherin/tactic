
export { ReactCodemirror };

class ReactCodemirror extends React.Component {

    constructor(props) {
        super(props);
        this.code_container_ref = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.mousetrap = new Mousetrap();
        this.create_api();
    }

    createCMArea(codearea, first_line_number = 1) {
        let cmobject = CodeMirror(codearea, {
            lineNumbers: true,
            matchBrackets: true,
            highlightSelectionMatches: true,
            autoCloseBrackets: true,
            indentUnit: 4,
            mode: this.props.mode,
            readOnly: this.props.readOnly
        });
        if (first_line_number != 1) {
            cmobject.setOption("firstLineNumber", first_line_number);
        }

        cmobject.setOption("extraKeys", {
            Tab: function (cm) {
                let spaces = new Array(5).join(" ");
                cm.replaceSelection(spaces);
            },
            "Ctrl-Space": "autocomplete"
        });
        cmobject.setSize(null, "100%");
        cmobject.on("change", this.handleChange);
        return cmobject;
    }

    handleChange(cm, changeObject) {
        this.props.handleChange(cm.getDoc().getValue());
    }

    componentDidMount() {
        this.cmobject = this.createCMArea(this.code_container_ref.current, this.props.first_line_number);
        this.cmobject.setValue(this.props.code_content);
        this.create_keymap();
    }

    componentDidUpdate() {
        if (this.props.first_line_number != 1) {
            this.cmobject.setOption("firstLineNumber", this.props.first_line_number);
        }
        this.cmobject.refresh();
    }

    searchCM() {
        CodeMirror.commands.find(this.cmobject);
    }

    clearSelections() {
        CodeMirror.commands.clearSearch(this.cmobject);
        CodeMirror.commands.singleSelection(this.cmobject);
    }

    create_api() {
        let self = this;
        postAjax("get_api_dict", {}, function (data) {
            self.api_dict_by_category = data.api_dict_by_category;
            self.api_dict_by_name = data.api_dict_by_name;
            self.ordered_api_categories = data.ordered_api_categories;

            self.api_list = [];
            for (let cat of self.ordered_api_categories) {
                for (let entry of self.api_dict_by_category[cat]) {
                    self.api_list.push(entry["name"]);
                }
            }
            //noinspection JSUnresolvedVariable
            CodeMirror.commands.autocomplete = function (cm) {
                //noinspection JSUnresolvedFunction
                cm.showHint({
                    hint: CodeMirror.hint.anyword, api_list: self.api_list,
                    extra_autocomplete_list: self.extra_autocomplete_list
                });
            };
        });
    }

    create_keymap() {
        let self = this;
        CodeMirror.keyMap["default"]["Esc"] = function () {
            self.clearSelections();
        };
        let is_mac = CodeMirror.keyMap["default"].hasOwnProperty("Cmd-S");

        this.mousetrap.bind(['escape'], function (e) {
            self.clearSelections();
            e.preventDefault();
        });

        if (is_mac) {
            CodeMirror.keyMap["default"]["Cmd-S"] = function () {
                self.props.saveMe();
            };

            this.mousetrap.bind(['command+l'], function (e) {
                // self.loadModule();
                e.preventDefault();
            });
            this.mousetrap.bind(['command+f'], function (e) {
                self.searchCM();
                e.preventDefault();
            });
        } else {
            CodeMirror.keyMap["default"]["Ctrl-S"] = function () {
                self.props.saveMe();
            };

            this.mousetrap.bind(['ctrl+l'], function (e) {
                // self.loadModule();
                e.preventDefault();
            });
            this.mousetrap.bind(['ctrl+f'], function (e) {
                self.searchCM();
                e.preventDefault();
            });
        }
    }

    render() {
        let ccstyle = {
            "height": this.props.code_container_height,
            "width": "100%"
        };
        return React.createElement("div", { id: "code-container", style: ccstyle, ref: this.code_container_ref });
    }
}

ReactCodemirror.propTypes = {
    handleChange: PropTypes.func,
    code_content: PropTypes.string,
    mode: PropTypes.string,
    saveMe: PropTypes.func,
    readOnly: PropTypes.bool,
    first_line_number: PropTypes.number,
    code_container_height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

ReactCodemirror.defaultProps = {
    first_line_number: 1,
    code_container_height: "100%",
    mode: "python",
    readOnly: false

};