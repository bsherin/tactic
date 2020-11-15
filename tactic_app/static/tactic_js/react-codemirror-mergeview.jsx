

import PropTypes from 'prop-types';
import React from "react";
import {ReactCodemirror} from "./react-codemirror";

export {ReactCodemirrorMergeView}

const DARK_THEME = window.dark_theme_name;

class ReactCodemirrorMergeView extends React.Component {

    constructor(props) {
        super(props);
        this.code_container_ref = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.mousetrap = new Mousetrap();
        this.saved_theme = null;
    }

    createMergeArea(codearea) {
        let cmobject = CodeMirror.MergeView(codearea, {
            value: this.props.editor_content,
            lineNumbers: true,
            matchBrackets: true,
            highlightSelectionMatches: true,
            autoCloseBrackets: true,
            indentUnit: 4,
            theme: this.props.dark_theme ? DARK_THEME : "default",
            origRight: this.props.right_content
        });

        cmobject.editor().setOption("extraKeys", {
            Tab: function (cm) {
                let spaces = new Array(5).join(" ");
                cm.replaceSelection(spaces);
            },
            "Ctrl-Space": "autocomplete"
        });

        cmobject.editor().on("change", this.handleChange);
        return cmobject
    }

    mergeViewHeight() {
        function editorHeight(editor) {
            return editor ? editor.getScrollInfo().height : 0;
        }
        return Math.max(editorHeight(this.cmobject.editor()), editorHeight(this.cmobject.rightOriginal()));
    }

    resizeHeights(max_height) {
        var height = Math.min(this.mergeViewHeight(), max_height);
        this.cmobject.editor().setSize(null, height);
        if (this.cmobject.rightOriginal()) {
            this.cmobject.rightOriginal().setSize(null, height);
        }
        this.cmobject.wrap.style.height = height + "px";
    }

    componentDidUpdate() {
        if (this.props.dark_theme != this.saved_theme) {
            if (this.props.dark_theme) {
                this.cmobject.editor().setOption("theme", DARK_THEME);
                this.cmobject.rightOriginal().setOption("theme", DARK_THEME)
            }
            else {
                this.cmobject.editor().setOption("theme", "default");
                this.cmobject.rightOriginal().setOption("theme", "default")
            }
            this.saved_theme = this.props.dark_theme
        }
        if (this.cmobject.editor().getValue() != this.props.editor_content) {
            this.cmobject.editor().setValue(this.props.editor_content)
        }
        this.cmobject.rightOriginal().setValue(this.props.right_content);
        this.resizeHeights(this.props.max_height);
    }

    componentDidMount() {
        this.cmobject = this.createMergeArea(this.code_container_ref.current);
        this.resizeHeights(this.props.max_height);
        this.refreshAreas();
        this.create_keymap();
        this.saved_theme = this.props.dark_theme
    }

    handleChange(cm, changeObject) {
        this.props.handleEditChange(cm.getValue());
        this.resizeHeights(this.props.max_height);
    }

    refreshAreas() {
        this.cmobject.editor().refresh();
        this.cmobject.rightOriginal().refresh()
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
                    self.api_list.push(entry["name"])
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
        })
    }


    searchCM() {
        CodeMirror.commands.find(this.cmobject)
    }

    clearSelections() {
        CodeMirror.commands.clearSearch(this.cmobject.editor());
        CodeMirror.commands.singleSelection(this.cmobject.editor());
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

            this.mousetrap.bind(['command+f'], function (e) {
                self.searchCM();
                e.preventDefault()
            });
        }
        else {
            CodeMirror.keyMap["default"]["Ctrl-S"] = function () {self.props.saveMe()};

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
            <div className="code-container" style={ccstyle} ref={this.code_container_ref}>

            </div>
        )

    }
}

ReactCodemirrorMergeView.propTypes = {
    handleEditChange: PropTypes.func,
    editor_content: PropTypes.string,
    right_content: PropTypes.string,
    dark_theme: PropTypes.bool,
    saveMe: PropTypes.func,
    max_height: PropTypes.number
};

ReactCodemirror.defaultProps = {
    dark_theme: false,
};