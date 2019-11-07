var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * Created by bls910
 */
import { ResourceViewerSocket, ResourceViewerApp, copyToLibrary, sendToRepository } from "./resource_viewer_react_app.js";
import { ViewerContext } from "./resource_viewer_context.js";
import { postAjax, postAjaxPromise } from "./communication_react.js";
import { doFlash } from "./toaster.js";

import { render_navbar } from "./blueprint_navbar.js";
import { SIDE_MARGIN, BOTTOM_MARGIN, getUsableDimensions } from "./sizing_tools.js";
import { withErrorDrawer } from "./error_drawer.js";
import { withStatus } from "./toaster.js";

var Bp = blueprint;

function list_viewer_main() {
    render_navbar();
    let get_url = window.is_repository ? "repository_get_list" : "get_list";
    let get_mdata_url = window.is_repository ? "grab_repository_metadata" : "grab_metadata";

    var tsocket = new ResourceViewerSocket("main", 5000);
    postAjaxPromise(`${get_url}/${window.resource_name}`, {}).then(function (data) {
        var the_content = data.the_content;
        let result_dict = { "res_type": "list", "res_name": window.resource_name, "is_repository": false };
        let ListViewerAppPlus = withErrorDrawer(withStatus(ListViewerApp, tsocket), tsocket);
        let domContainer = document.querySelector('#root');
        postAjaxPromise(get_mdata_url, result_dict).then(function (data) {
            let split_tags = data.tags == "" ? [] : data.tags.split(" ");
            ReactDOM.render(React.createElement(ListViewerAppPlus, { resource_name: window.resource_name,
                the_content: the_content,
                created: data.datestring,
                tags: split_tags,
                notes: data.notes,
                readOnly: window.read_only,
                is_repository: window.is_repository,
                meta_outer: "#right-div" }), domContainer);
        }).catch(function () {
            ReactDOM.render(React.createElement(ListViewerAppPlus, { resource_name: window.resource_name,
                the_content: the_content,
                created: "",
                tags: [],
                notes: "",
                readOnly: window.read_only,
                is_repository: window.is_repository,
                meta_outer: "#right-div" }), domContainer);
        });
    }).catch(doFlash);
}

class ListEditor extends React.Component {

    render() {
        let tastyle = { resize: "horizontal", height: this.props.height };
        return React.createElement(
            "div",
            { id: "listarea-container", ref: this.props.outer_ref },
            React.createElement(Bp.TextArea, {
                cols: "50",
                style: tastyle,
                disabled: this.context.readOnly,
                onChange: this.props.handleChange,
                value: this.props.the_content
            })
        );
    }
}
ListEditor.contextType = ViewerContext;

ListEditor.propTypes = {
    the_content: PropTypes.string,
    handleChange: PropTypes.func,
    readOnly: PropTypes.bool,
    outer_ref: PropTypes.object,
    height: PropTypes.number
};

class ListViewerApp extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.top_ref = React.createRef();
        this.le_ref = React.createRef();
        this.savedContent = props.the_content;
        this.savedTags = props.tags;
        this.savedNotes = props.notes;
        let self = this;

        window.addEventListener("beforeunload", function (e) {
            if (self.dirty()) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
        let aheight = getUsableDimensions().usable_height;
        let awidth = getUsableDimensions().usable_width;
        this.state = {
            list_content: props.the_content,
            notes: props.notes,
            tags: props.tags,
            usable_width: awidth,
            usable_height: aheight
        };
    }

    componentDidMount() {
        this.props.stopSpinner();
    }

    get button_groups() {
        let bgs;
        if (this.props.is_repository) {
            bgs = [[{ "name_text": "Copy", "icon_name": "share",
                "click_handler": () => {
                    copyToLibrary("list", this.props.resource_name);
                }, tooltip: "Copy to library" }]];
        } else {
            bgs = [[{ "name_text": "Save", "icon_name": "saved", "click_handler": this._saveMe, tooltip: "Save" }, { "name_text": "SaveAs", "icon_name": "floppy-disk", "click_handler": this._saveMeAs, tooltip: "Save As" }, { "name_text": "Share", "icon_name": "share",
                "click_handler": () => {
                    sendToRepository("list", this.props.resource_name);
                },
                tooltip: "Share to repository" }]];
        }
        for (let bg of bgs) {
            for (let but of bg) {
                but.click_handler = but.click_handler.bind(this);
            }
        }
        return bgs;
    }

    _handleStateChange(state_stuff) {
        this.setState(state_stuff);
    }

    _handleListChange(event) {
        this.setState({ "list_content": event.target.value });
    }

    _handleResize(entries) {
        for (let entry of entries) {
            if (entry.target.id == "root") {
                this.setState({ usable_width: entry.contentRect.width,
                    usable_height: entry.contentRect.height - BOTTOM_MARGIN - entry.target.getBoundingClientRect().top
                });
                return;
            }
        }
    }

    get_new_le_height() {
        if (this.le_ref && this.le_ref.current) {
            // This will be true after the initial render
            return this.state.usable_height - this.le_ref.current.offsetTop;
        } else {
            return this.state.usable_height - 100;
        }
    }

    render() {

        let the_context = { "readOnly": this.props.readOnly };
        let outer_style = { width: this.state.usable_width,
            height: this.state.usable_height,
            paddingLeft: SIDE_MARGIN
        };

        return React.createElement(
            ViewerContext.Provider,
            { value: the_context },
            React.createElement(
                Bp.ResizeSensor,
                { onResize: this._handleResize, observeParents: true },
                React.createElement(
                    "div",
                    { className: "resource-viewer-holder", ref: this.top_ref, style: outer_style },
                    React.createElement(
                        ResourceViewerApp,
                        _extends({}, this.props.statusFuncs, {
                            resource_name: this.props.resource_name,
                            created: this.props.created,
                            meta_outer: this.props.meta_outer,
                            readOnly: window.read_only,
                            res_type: "list",
                            button_groups: this.button_groups,
                            handleStateChange: this._handleStateChange,
                            notes: this.state.notes,
                            tags: this.state.tags,
                            saveMe: this._saveMe }),
                        React.createElement(ListEditor, { the_content: this.state.list_content,
                            outer_ref: this.le_ref,
                            height: this.get_new_le_height(),
                            handleChange: this._handleListChange
                        })
                    )
                )
            )
        );
    }

    _saveMe() {
        const new_list_as_string = this.state.list_content;
        const tagstring = this.state.tags.join(" ");
        const notes = this.state.notes;
        const tags = this.state.tags; // In case it's modified wile saving
        const result_dict = {
            "list_name": this.props.resource_name,
            "new_list_as_string": new_list_as_string,
            "tags": tagstring,
            "notes": notes
        };
        let self = this;
        postAjax("update_list", result_dict, update_success);
        function update_success(data) {
            if (data.success) {
                self.savedContent = new_list_as_string;
                self.savedTags = tags;
                self.savedNotes = notes;
                data.timeout = 2000;
            }
            doFlash(data);
            return false;
        }
    }

    _saveMeAs(e) {
        doFlash({ "message": "not implemented yet", "timeout": 10 });
        return false;
    }

    dirty() {
        let current_content = this.state.list_content;
        const tags = this.state.tags;
        const notes = this.state.notes;
        return !(current_content == this.savedContent && tags == this.savedTags && notes == this.savedNotes);
    }
}

ListViewerApp.propTypes = {
    resource_name: PropTypes.string,
    the_content: PropTypes.string,
    created: PropTypes.string,
    tags: PropTypes.array,
    notes: PropTypes.string,
    readOnly: PropTypes.bool,
    is_repository: PropTypes.bool,
    meta_outer: PropTypes.string
};

list_viewer_main();