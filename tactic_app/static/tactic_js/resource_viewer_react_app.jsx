

import {ResourceviewerToolbar} from "./react_toolbar.js";
import {CombinedMetadata} from "./react_mdata_fields.js";
import {showModalReact} from "./modal_react.js";
import {TacticSocket} from "./tactic_socket.js"
import {HorizontalPanes} from "./resizing_layouts.js";

export {ResourceViewerApp, ResourceViewerSocket, copyToLibrary, sendToRepository}


const MARGIN_SIZE = 17;


class ResourceViewerSocket extends TacticSocket {
    initialize_socket_stuff() {
        this.socket.emit('join', {"room": window.user_id});
        this.socket.emit('join-main', {"room": window.resource_viewer_id});
        this.socket.on('handle-callback', handleCallback);
        this.socket.on('stop-spinner', stopSpinner);
        this.socket.on('start-spinner', startSpinner);
        this.socket.on('close-user-windows', (data) => {
            if (!(data["originator"] == window.resource_viewer_id)) {
                window.close()
            }
        });
        this.socket.on("doFlash", function(data) {
            doFlash(data)
        });
    }
}

function copyToLibrary(res_type, resource_name) {
    $.getJSON($SCRIPT_ROOT + `get_getresource_names/${res_type}`, function(data) {
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

function sendToRepository(res_type, resource_name) {
    $.getJSON($SCRIPT_ROOT + `get_repository_resource_names/${res_type}`, function(data) {
        showModalReact(`Share ${res_type}`, `New ${res_type} Name`, ShareResource, resource_name, data["resource_names"])
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
        this.savedContent = props.the_content;
        this.savedTags = props.tags;
        this.savedNotes = props.notes;
        this.hp_ref = React.createRef();

        let self = this;
        this.mousetrap = new Mousetrap();
        this.mousetrap.bind(['command+s', 'ctrl+s'], function (e) {
            self.props.saveMe();
            e.preventDefault()
        });
        this.update_window_dimensions = this.update_window_dimensions.bind(this);
        this.state = {"mounted": false,
                    "usable_width": window.innerWidth - 2 * MARGIN_SIZE - 30,
                    "usable_height": window.innerHeight - 50}
    }

    componentDidMount() {
        window.addEventListener("resize", this.update_window_dimensions);
        this.setState({"mounted": true});
        this.update_window_dimensions();
        stopSpinner()
    }

    update_window_dimensions() {
        this.setState({
            "usable_width": window.innerWidth - 2 * MARGIN_SIZE - 30,
            "usable_height": window.innerHeight - 50
        });
    }

    get_new_hp_height (element_ref) {
        if (this.state.mounted) {  // This will be true after the initial render
            return this.state.usable_height - $(element_ref.current).offset().top
        }
        else {
            return this.state.usable_height - 45
        }
    }

    render() {
        let left_pane = (
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        );
        let available_height = this.get_new_hp_height(this.hp_ref);
        let right_pane = (
                <CombinedMetadata tags={this.props.tags}
                                  created={this.props.created}
                                  notes={this.props.notes}
                                  handleChange={this.props.handleStateChange}
                                  res_type={this.props.res_type} />
        );

        return(
            <React.Fragment>
                <ResourceviewerToolbar button_groups={this.props.button_groups}
                                           resource_name={this.props.resource_name}
                                           res_type={this.props.res_type}/>
               <div ref={this.hp_ref}/>
                <HorizontalPanes left_pane={left_pane}
                                 right_pane={right_pane}
                                 available_height={available_height}
                                 available_width={this.state.usable_width}
                />
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
    handleStateChange: PropTypes.func,
    meta_outer: PropTypes.string,
    saveMe: PropTypes.func,
    children: PropTypes.element
};