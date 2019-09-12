/**
 * Created by bls910
 */

import {MergeViewerSocket, MergeViewerApp} from "./merge_viewer_app.js";


function history_viewer_main ()  {
    let get_url = "get_module_code";

    var tsocket = new MergeViewerSocket("main", 5000);
    postAjaxPromise(`${get_url}/${window.resource_name}`, {})
        .then(function (data) {
            var edit_content = data.the_content;
            postAjaxPromise("get_checkpoint_dates", {"module_name": window.resource_name})
                .then(function (data) {
                    let history_list = data.checkpoints;
                    let domContainer = document.querySelector('#root');
                    ReactDOM.render(<HistoryViewerApp resource_name={window.resource_name}
                                                      history_list={history_list}
                                                      edit_content={edit_content}/>, domContainer);
                })
                .catch(doFlash)

            }
        )
        .catch(doFlash);
}

class HistoryViewerApp extends React.Component {

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
            "history_popup_val": props.history_list[0]["updatestring"],
            "history_list": props.history_list,
        };
        this.handleEditChange = this.handleEditChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.checkpointThenSaveFromLeft = this.checkpointThenSaveFromLeft.bind(this);
        this.savedContent = props.edit_content
    }

    handleSelectChange(new_value) {
        this.state.history_popup_val = new_value;
        let self = this;
        for (let item of this.state.history_list) {
            if (item["updatestring"] == new_value){
                let updatestring_for_sort = item["updatestring_for_sort"];
                postAjaxPromise("get_checkpoint_code", {"module_name": self.props.resource_name, "updatestring_for_sort": updatestring_for_sort})
                    .then((data) => {
                            self.setState({"right_content": data.module_code});
                        })
                    .catch(doFlash);
                return
            }
        }
    }

    handleEditChange(new_code) {
        this.setState({"edit_content": new_code})
    }

    render() {
        let option_list = this.state.history_list.map((item) => item["updatestring"]);
        return (
            <MergeViewerApp resource_name={this.props.resource_name}
                            option_list={option_list}
                            select_val={this.state.history_popup_val}
                            edit_content={this.state.edit_content}
                            right_content={this.state.right_content}
                            handleSelectChange={this.handleSelectChange}
                            handleEditChange={this.handleEditChange}
                            saveHandler={this.checkpointThenSaveFromLeft}
            />
        )
    }

    doCheckpointPromise() {
        let self = this;
        return new Promise (function (resolve, reject) {
            postAjax("checkpoint_module", {"module_name": self.props.resource_name}, function (data) {
                if (data.success) {
                    resolve(data)
                }
                else {
                    reject(data)
                }
            });
        })
    }

    checkpointThenSaveFromLeft() {
        let self = this;
        let current_popup_val = this.state.history_popup_val;
        this.doCheckpointPromise()
            .then(function () {
                postAjaxPromise("get_checkpoint_dates", {"module_name": self.props.resource_name})
                    .then((data) => {
                        self.setState({"history_list": data.checkpoints})
                    })
                    .catch(doFlash);
                self.saveFromLeft()
            })
            .catch(doFlash)
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

HistoryViewerApp.propTypes = {
    resource_name: PropTypes.string,
    history_list: PropTypes.array,
    edit_content: PropTypes.string,
};


history_viewer_main();