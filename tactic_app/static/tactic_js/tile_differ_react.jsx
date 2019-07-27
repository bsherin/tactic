
import {MergeViewerSocket, MergeViewerApp} from "./merge_viewer_app.js";


function tile_differ_main ()  {
    let get_url = "get_module_code";

    var tsocket = new MergeViewerSocket("main", 5000);
    postAjaxPromise(`${get_url}/${resource_name}`, {})
        .then(function (data) {
            var edit_content = data.the_content;
            postAjaxPromise("get_tile_names")
                .then(function (data) {
                    let tile_list = data.tile_names;
                    let domContainer = document.querySelector('#root');
                    ReactDOM.render(<TileDifferApp resource_name={resource_name}
                                                   tile_list={tile_list}
                                                   edit_content={edit_content}
                                                   second_resource_name={second_resource_name}

                    />, domContainer);
                })
                .catch(doFlash)

            }
        )
        .catch(doFlash);
}

class TileDifferApp extends React.Component {

    constructor(props) {
        super(props);
        let self = this;
        window.onbeforeunload = function(e) {
            if (self.dirty()) {
                return "Any unsaved changes will be lost."
            }
        };

        this.state = {
            "edit_content": props.edit_content,
            "right_content": "",
            "tile_popup_val": props.second_resource_name == "none" ? props.tile_list[0] : props.second_resource_name,
            "tile_list": props.tile_list,
        };
        this.handleEditChange = this.handleEditChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.saveFromLeft = this.saveFromLeft.bind(this);
        this.savedContent = props.edit_content
    }

    handleSelectChange(new_value) {
        this.state.tile_popup_val = new_value;
        let self = this;
        postAjaxPromise("get_module_code/" + new_value, {})
            .then((data) => {
                    self.setState({"right_content": data.the_content});
                })
            .catch(doFlash);
    }

    handleEditChange(new_code) {
        this.setState({"edit_content": new_code})
    }

    render() {
        return (
            <MergeViewerApp resource_name={this.props.resource_name}
                            option_list={this.state.tile_list}
                            select_val={this.state.tile_popup_val}
                            edit_content={this.state.edit_content}
                            right_content={this.state.right_content}
                            handleSelectChange={this.handleSelectChange}
                            handleEditChange={this.handleEditChange}
                            saveHandler={this.saveFromLeft}
            />
        )
    }

    saveFromLeft() {
        let data_dict = {
            "module_name": this.props.resource_name,
            "module_code": this.state.edit_content
        };
        postAjaxPromise("update_from_left", data_dict)
            .then(doFlash)
            .catch(doFlash)
    }

    dirty() {
        return this.state.edit_content != this.savedContent
    }
}

TileDifferApp.propTypes = {
    resource_name: PropTypes.string,
    tile_list: PropTypes.array,
    edit_content: PropTypes.string,
    second_resource_name: PropTypes.string
};


tile_differ_main();