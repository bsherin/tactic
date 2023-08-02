
import React from "react";
import {Fragment, useState, useEffect, useRef, memo} from "react";
import PropTypes from 'prop-types';

import {PopoverPosition} from "@blueprintjs/core";

import {ReactCodemirrorMergeView} from "./react-codemirror-mergeview";
import {BpSelect} from "./blueprint_mdata_fields";
import {TacticMenubar} from "./menu_utilities";
import {TacticOmnibar} from "./TacticOmnibar";
import {KeyTrap} from "./key_trap";

export {MergeViewerApp}

function MergeViewerApp(props) {

    const left_div_ref = useRef(null);
    const above_main_ref = useRef(null);
    const omniGetters = useRef({});

    const [inner_height, set_inner_height] = useState(window.innerHeight);

    // These only matter if not controlled
    const [showOmnibar, setShowOmnibar] = useState(false);
    const key_bindings = [
          [["ctrl+space"], _showOmnibar],
      ];

    const button_groups = [
        [{"name_text": "Save", "icon_name": "saved", "click_handler": props.saveHandler}]
    ];

    useEffect(()=>{
        window.addEventListener("resize", resize_to_window);
        props.handleSelectChange(props.select_val);
        resize_to_window();
        props.stopSpinner();
    }, []);

    function menu_specs() {
        let ms;
        ms = {
            Save: [
                {name_text: "Save",
                icon_name: "saved",
                click_handler: props.saveHandler,
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

    function _showOmnibar() {
        setShowOmnibar(true)
    }

    function _closeOmnibar() {
        setShowOmnibar(false)
    }

    function _omniFunction() {
        let omni_items = [];
        for (let ogetter in omniGetters.current) {
            omni_items = omni_items.concat(mniGetters.current[ogetter]())
        }
        return omni_items
    }

    function _registerOmniGetter(name, the_function) {
        omniGetters.current[name] = the_function
    }

    function resize_to_window() {
        set_inner_height(window.innerHeight);
    }

    function get_new_heights (bottom_margin) {
        let new_ld_height;
        let max_merge_height;
        if (left_div_ref && left_div_ref.current) {  // This will be true after the initial render
            new_ld_height = inner_height - left_div_ref.current.offsetTop ;
            max_merge_height = new_ld_height - bottom_margin;
        }
        else {
            new_ld_height = inner_height - 45 - bottom_margin;
            max_merge_height = new_ld_height- 50;
        }
        return [new_ld_height, max_merge_height]
    }

        let toolbar_holder_style = {"paddingTop": 20, paddingLeft: 50};
        let new_ld_height;
        let max_merge_height;
        [new_ld_height, max_merge_height] = get_new_heights(65);
        let left_div_style = {
            "width": "100%",
            "height": new_ld_height,
            paddingLeft: 25,
            paddingRight: 25

        };

        let outer_class = "merge-viewer-outer";
        if (props.dark_theme) {
            outer_class = outer_class + " bp5-dark";
        }
        else {
            outer_class = outer_class + " light-theme"
        }
        let current_style = {"bottom": 0};
        return (
            <Fragment>
                <TacticMenubar menu_specs={menu_specs()}
                               connection_status={props.connection_status}
                               showRefresh={false}
                               showClose={false}
                               dark_theme={props.dark_theme}
                               refreshTab={null}
                               closeTab={null}
                               resource_name={props.resource_name}
                               toggleErrorDrawer={props.toggleErrorDrawer}
                               controlled={false}
                               am_selected={false}
                               registerOmniGetter={_registerOmniGetter}
                    />
                <div className={outer_class}>
                    <div id="left-div" ref={left_div_ref} style={left_div_style}>
                        <div id="above-main" ref={above_main_ref} className="d-flex flex-row justify-content-between mb-2">
                            <span className="align-self-end">Current</span>
                            <BpSelect options={props.option_list}
                                      onChange={props.handleSelectChange}
                                      buttonIcon="application"
                                      popoverPosition={PopoverPosition.BOTTOM_RIGHT}
                                      value={props.select_val}/>
                        </div>
                        <ReactCodemirrorMergeView handleEditChange={props.handleEditChange}
                                                  dark_theme={props.dark_theme}
                                                  editor_content={props.edit_content}
                                                  right_content={props.right_content}
                                                  saveMe={props.saveHandler}
                                                  max_height={max_merge_height}

                        />
                    </div>
                </div>
                  <Fragment>
                      <TacticOmnibar omniGetters={[_omniFunction]}
                                     page_id={props.page_id}
                                     showOmnibar={showOmnibar}
                                     closeOmnibar={_closeOmnibar}
                                     is_authenticated={window.is_authenticated}
                                     dark_theme={props.dark_theme}
                                     setTheme={props.setTheme}
                      />
                      <KeyTrap global={true} bindings={key_bindings}/>
                  </Fragment>
            </Fragment>
        )
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

MergeViewerApp = memo(MergeViewerApp);