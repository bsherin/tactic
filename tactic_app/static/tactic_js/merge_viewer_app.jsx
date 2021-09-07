
import React from "react";
import PropTypes from 'prop-types';

import {ReactCodemirrorMergeView} from "./react-codemirror-mergeview.js";
import {Toolbar} from "./blueprint_toolbar.js";
import {TacticSocket} from "./tactic_socket.js";
import {doFlash} from "./toaster.js";
import {BpSelect} from "./blueprint_mdata_fields.js";
import {TacticContext} from "./tactic_context.js";

export{MergeViewerApp, MergeViewerSocket}

class MergeViewerSocket extends TacticSocket {
    initialize_socket_stuff(reconnect=false) {
        this.socket.emit('join', {"room": window.user_id, user_id: window.user_id});
        this.attachListener("doFlash", function(data) {
            doFlash(data)
        });
    }
}

class MergeViewerApp extends React.Component {

    constructor(props) {
        super(props);
        this.left_div_ref = React.createRef();
        this.above_main_ref = React.createRef();
        this.merge_element_ref = React.createRef();
        let self = this;

        this.state = {
            "inner_height": window.innerHeight,
            "mounted": false,
        };
        this.resize_to_window = this.resize_to_window.bind(this);
    }

    get button_groups() {
        return [[{"name_text": "Save", "icon_name": "saved", "click_handler": this.props.saveHandler}]];

    }

    componentDidMount() {
        window.addEventListener("resize", this.resize_to_window);
        this.setState({"mounted": true});
        // let fake_event = {currentTarget: {value: this.props.select_val}};
        this.props.handleSelectChange(this.props.select_val);
        this.resize_to_window();
        this.props.stopSpinner();
    }

    resize_to_window() {
        this.setState({
            "inner_height": window.innerHeight,
        });
    }

    get_new_heights (bottom_margin) {
        let new_ld_height;
        let max_merge_height;
        if (this.state.mounted) {  // This will be true after the initial render
            new_ld_height = this.state.inner_height - this.left_div_ref.current.offsetTop ;
            max_merge_height = new_ld_height - bottom_margin;
        }
        else {
            new_ld_height = this.state.inner_height - 45 - bottom_margin;
            max_merge_height = new_ld_height- 50;
        }
        return [new_ld_height, max_merge_height]
    }

    render() {
        let toolbar_holder_style = {"paddingTop": 20, paddingLeft: 50};
        let new_ld_height;
        let max_merge_height;
        [new_ld_height, max_merge_height] = this.get_new_heights(65);
        let left_div_style = {
            "width": "100%",
            "height": new_ld_height,
            paddingLeft: 25,
            paddingRight: 25

        };
        let outer_class = "merge-viewer-outer";
        if (this.context.dark_theme) {
            outer_class = outer_class + " bp3-dark";
        }
        else {
            outer_class = outer_class + " light-theme"
        }
        let current_style = {"bottom": 0};
        return (
            <div className={outer_class}>
                <div style={toolbar_holder_style}>
                    <Toolbar button_groups={this.button_groups}/>
                </div>
                <div id="left-div" ref={this.left_div_ref} style={left_div_style}>
                    <div id="above-main" ref={this.above_main_ref} className="d-flex flex-row justify-content-between mb-2">
                        <span className="align-self-end">Current</span>
                        <BpSelect options={this.props.option_list}
                                  onChange={this.props.handleSelectChange}
                                  buttonIcon="application"
                                  value={this.props.select_val}/>
                    </div>
                    <ReactCodemirrorMergeView handleEditChange={this.props.handleEditChange}
                                              editor_content={this.props.edit_content}
                                              right_content={this.props.right_content}
                                              saveMe={this.props.saveHandler}
                                              max_height={max_merge_height}
                                              dark_theme={this.props.dark_theme}
                                              ref={this.merge_element_ref}

                    />
                </div>
            </div>
        )
    }
}

MergeViewerApp.propTypes = {
    resource_name: PropTypes.string,
    option_list: PropTypes.array,
    select_val: PropTypes.string,
    edit_content: PropTypes.string,
    right_content: PropTypes.string,
    handleSelectChange: PropTypes.func,
    handleEditChange: PropTypes.func,
    saveHandler: PropTypes.func,
};

MergeViewerApp.contextType = TacticContext;