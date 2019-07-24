

import {ResourceviewerToolbar} from "./react_toolbar.js";
import {CombinedMetadata} from "./react_mdata_fields.js";

export {ResourceViewerApp, ResourceViewerSocket, copyToLibrary, sendToRepository}


const MARGIN_SIZE = 17;

class ResourceViewerSocket extends TacticSocket {
    initialize_socket_stuff() {
        this.socket.emit('join', {"room": user_id});
        this.socket.emit('join-main', {"room": resource_viewer_id});
        this.socket.on('handle-callback', handleCallback);
        this.socket.on('stop-spinner', stopSpinner);
        this.socket.on('start-spinner', startSpinner);
        this.socket.on('close-user-windows', (data) => {
            if (!(data["originator"] == resource_viewer_id)) {
                window.close()
            }
        });
        this.socket.on("doFlash", function(data) {
            doFlash(data)
        });
    }
}

function copyToLibrary(res_type, resource_name) {
    $.getJSON($SCRIPT_ROOT + `get_resource_names/${res_type}`, function(data) {
        showModal(`Import ${res_type}`, `New ${res_type} Name`, ImportResource, resource_name, data["resource_names"])
        }
    );
    function ImportResource(new_name) {
        const result_dict = {
            "res_type": res_type,
            "res_name": resource_name,
            "new_res_name": new_name
        };
        postAjax("copy_from_repository", result_dict, doFlashAlways);
    }
}

function sendToRepository(res_type, resource_nam) {
    $.getJSON($SCRIPT_ROOT + `get_repository_resource_names/${res_type}`, function(data) {
        showModal(`Share list ${res_type}`, `New list Name`, ShareResource, resource_name, data["resource_names"])
        }
    );
    function ShareResource(new_name) {
        const result_dict = {
            "res_type": res_type,
            "res_name": resource_name,
            "new_res_name": new_name
        };
        postAjax("send_to_repository", result_dict, doFlashAlways)
    }
}

class ResourceViewerApp extends React.Component {

    constructor(props) {
        super(props);
        this.left_div_ref = React.createRef();
        this.right_div_ref = React.createRef();
        this.savedContent = props.the_content;
        this.savedTags = props.tags;
        this.savedNotes = props.notes;

        this.state = {
            "current_width_fraction": .5,
            "inner_height": window.innerHeight,
            "usable_width": this.get_usable_width(),
            "mounted": false
        };
        let self = this;
        this.mousetrap = new Mousetrap();
        this.mousetrap.bind(['command+s', 'ctrl+s'], function (e) {
            self.props.saveMe();
            e.preventDefault()
        });

        this.resize_to_window = this.resize_to_window.bind(this)
    }

    get_usable_width() {
        return window.innerWidth - 2 * MARGIN_SIZE - 30;
    }

    update_width(new_width_fraction) {
        this.setState({"current_width_fraction": new_width_fraction})
    }

    get_new_height (element_ref, bottom_margin) {
        if (this.state.mounted) {  // This will be true after the initial render
            return window.innerHeight - $(element_ref.current).offset().top - bottom_margin
        }
        else {
            return window.innerHeight - 45 - bottom_margin
        }
    }

    resize_to_window() {
        this.setState({
            "inner_height": window.innerHeight,
            "usable_width": this.get_usable_width()
        });
    }

    turn_on_horizontal_resize () {
        let self = this;
        $(this.left_div_ref.current).resizable({
            handles: "e",
            resize: function (event, ui) {
                const usable_width = window.innerWidth - 2 * MARGIN_SIZE - 30;
                let new_width_fraction = 1.0 * ui.size.width / usable_width;
                ui.position.left = ui.originalPosition.left;
                self.update_width(new_width_fraction)
            }
        });
    }

    componentDidMount() {
        this.turn_on_horizontal_resize();
        window.addEventListener("resize", this.resize_to_window);
        this.setState({"mounted": true});
        this.resize_to_window();
        stopSpinner();
    }

    render() {
        let left_div_style = {
            "width": this.state.usable_width * this.state.current_width_fraction,
            "height": this.get_new_height(this.left_div_ref, 40)
        };
        let right_div_style = {
            "width": (1 - this.state.current_width_fraction) * this.state.usable_width,
            "height": this.get_new_height(this.right_div_ref, 40)
        };
        return(
            <React.Fragment>
                <ResourceviewerToolbar button_groups={this.props.button_groups}
                                       resource_name={this.props.resource_name}
                                       res_type={this.props.res_type}/>
                <div id="left-div" ref={this.left_div_ref} className="res-viewer-resizer" style={left_div_style}>
                    {this.props.children}
                </div>
                <div id="right-div" ref={this.right_div_ref} className="resource-viewer-right"  style={right_div_style}>
                    <div id="metadata-holder">
                        <CombinedMetadata tags={this.props.tags}
                                          created={this.props.created}
                                          notes={this.props.notes}
                                          meta_outer={this.props.meta_outer}
                                          handleTagsChange={this.props.handleTagsChange}
                                          handleNotesChange={this.props.handleNotesChange}
                                          res_type={this.props.res_type}/>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

ResourceViewerApp.propTypes = {
    resource_name: PropTypes.string,
    res_type: PropTypes.string,
    button_groups: PropTypes.array,
    created: PropTypes.string,
    tags: PropTypes.array,
    notes: PropTypes.string,
    handleTagsChange: PropTypes.func,
    handleNotesChange: PropTypes.func,
    meta_outer: PropTypes.string,
    saveMe: PropTypes.func,
    children: PropTypes.element
};