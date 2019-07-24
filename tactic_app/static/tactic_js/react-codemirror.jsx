
export {ReactCodemirror}

class ReactCodemirror extends React.Component {

    constructor(props) {
        super(props);
        this.code_container_ref = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.mousetrap = new Mousetrap();
    }

    createCMArea(codearea, include_in_global_search = false, first_line_number = 1) {
        let cmobject = CodeMirror(codearea, {
            lineNumbers: true,
            matchBrackets: true,
            highlightSelectionMatches: true,
            autoCloseBrackets: true,
            indentUnit: 4,
            mode: "python",
            readOnly: this.props.readOnly
        });
        if (first_line_number != 1) {
            cmobject.setOption("firstLineNumber", first_line_number)
        }

        cmobject.setOption("extraKeys", {
            Tab: function (cm) {
                let spaces = new Array(5).join(" ");
                cm.replaceSelection(spaces);
            },
            "Ctrl-Space": "autocomplete"
        });
        $(".CodeMirror").css("height", "100%");
        cmobject.on("change", this.handleChange);
        return cmobject
    }
    
    handleChange(cm, changeObject) {
        this.props.handleChange(cm.getDoc().getValue())
    }

    componentDidMount() {
        this.cmobject = this.createCMArea(this.code_container_ref.current);
        this.cmobject.setValue(this.props.code_content);
        this.cmobject.refresh();
        this.create_keymap()
    }

    searchCM() {
        CodeMirror.commands.find(this.cmobject)
    }

    clearSelections() {
        CodeMirror.commands.clearSearch(this.cmobject);
        CodeMirror.commands.singleSelection(this.cmobject);
    }

    create_keymap() {
        let self = this;
        CodeMirror.keyMap["default"]["Esc"] = function () {self.clearSelections()};
        let is_mac = CodeMirror.keyMap["default"].hasOwnProperty("Cmd-S");

        this.mousetrap.bind(['escape'], function (e) {
            self.clearSelections();
            e.preventDefault()
        });

        if (is_mac) {
            CodeMirror.keyMap["default"]["Cmd-S"] = function () {self.props.saveMe()};

            this.mousetrap.bind(['command+l'], function (e) {
                // self.loadModule();
                e.preventDefault()
            });
            this.mousetrap.bind(['command+f'], function (e) {
                self.searchCM();
                e.preventDefault()
            });
        }
        else {
            CodeMirror.keyMap["default"]["Ctrl-S"] = function () {self.props.saveMe()};

            this.mousetrap.bind(['ctrl+l'], function (e) {
                // self.loadModule();
                e.preventDefault()
            });
            this.mousetrap.bind(['ctrl+f'], function (e) {
                self.searchCM();
                e.preventDefault()
            });
        }
    }

    render() {
        let ccstyle = {
            "height": "100%"
        };
        return (
            <div id="code-container" style={ccstyle} ref={this.code_container_ref}>

            </div>
        )

    }
}


ReactCodemirror.propTypes = {
    handleChange: PropTypes.func,
    code_content: PropTypes.string,
    saveMe: PropTypes.func,
    readOnly: PropTypes.bool
};
