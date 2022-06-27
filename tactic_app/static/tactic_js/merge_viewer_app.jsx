
import React from "react";
import PropTypes from 'prop-types';

import {PopoverPosition} from "@blueprintjs/core";

import {ReactCodemirrorMergeView} from "./react-codemirror-mergeview.js";
import {BpSelect} from "./blueprint_mdata_fields.js";
import {TacticMenubar} from "./menu_utilities";

export {MergeViewerApp}

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

    get menu_specs() {
        let ms;
        ms = {
            Save: [
                {name_text: "Save",
                icon_name: "saved",
                click_handler: this.props.saveHandler,
                key_bindings: ['ctrl+s']},
            ]

        };
        for (const [menu_name, menu] of Object.entries(ms)) {
            for (let but of menu) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return ms
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
        if (this.props.dark_theme) {
            outer_class = outer_class + " bp4-dark";
        }
        else {
            outer_class = outer_class + " light-theme"
        }
        let current_style = {"bottom": 0};
        return (
            <React.Fragment>
                <TacticMenubar menu_specs={this.menu_specs}
                               showRefresh={false}
                               showClose={false}
                               dark_theme={this.props.dark_theme}
                               refreshTab={null}
                               closeTab={null}
                               resource_name={this.props.resource_name}
                               toggleErrorDrawer={this.props.toggleErrorDrawer}
                               controlled={false}
                               am_selected={false}
                    />
                <div className={outer_class}>
                    <div id="left-div" ref={this.left_div_ref} style={left_div_style}>
                        <div id="above-main" ref={this.above_main_ref} className="d-flex flex-row justify-content-between mb-2">
                            <span className="align-self-end">Current</span>
                            <BpSelect options={this.props.option_list}
                                      onChange={this.props.handleSelectChange}
                                      buttonIcon="application"
                                      popoverPosition={PopoverPosition.BOTTOM_RIGHT}
                                      value={this.props.select_val}/>
                        </div>
                        <ReactCodemirrorMergeView handleEditChange={this.props.handleEditChange}
                                                  dark_theme={this.props.dark_theme}
                                                  editor_content={this.props.edit_content}
                                                  right_content={this.props.right_content}
                                                  saveMe={this.props.saveHandler}
                                                  max_height={max_merge_height}
                                                  ref={this.merge_element_ref}

                        />
                    </div>
                </div>
            </React.Fragment>
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
    dark_theme: PropTypes.bool,
    saveHandler: PropTypes.func,
};
