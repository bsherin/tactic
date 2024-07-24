import React from "react";
import {Fragment, useEffect, useRef, memo, useMemo, useContext} from "react";
import PropTypes from 'prop-types';

import {PopoverPosition} from "@blueprintjs/core";
import { useHotkeys } from "@blueprintjs/core";

import {ReactCodemirrorMergeView} from "./react-codemirror-mergeview";
import {BpSelect} from "./blueprint_mdata_fields";
import {TacticMenubar} from "./menu_utilities";
import {ThemeContext} from "./theme"
import {StatusContext} from "./toaster";
import {ICON_BAR_WIDTH, useSize} from "./sizing_tools";

export {MergeViewerApp}

const BOTTOM_MARGIN = 85;

function MergeViewerApp(props) {

    const top_ref = useRef(null);
    const above_main_ref = useRef(null);

    const theme = useContext(ThemeContext);
    const statusFuncs = useContext(StatusContext);

    const [usable_width, usable_height, topX, topY] = useSize(top_ref, 0, "MergeViewerApp");

    const button_groups = [
        [{"name_text": "Save", "icon_name": "saved", "click_handler": props.saveHandler}]
    ];

    useEffect(() => {
        props.handleSelectChange(props.select_val);
        statusFuncs.stopSpinner();
    }, []);

    const hotkeys = useMemo(
        () => [
            {
                combo: "Ctrl+S",
                global: false,
                group: "Merge Viewer",
                label: "Save Current",
                onKeyDown: props.saveHandler
            },
        ],
        [props.saveHandler],
    );
    const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys);

    function menu_specs() {
        let ms;
        ms = {
            Save: [
                {
                    name_text: "Save",
                    icon_name: "saved",
                    click_handler: props.saveHandler,
                    key_bindings: ['Ctrl+S']
                },
            ]
        };
        return ms
    }

    let toolbar_holder_style = {"paddingTop": 20, paddingLeft: 50};
    let max_merge_height = usable_height - BOTTOM_MARGIN;

    let left_div_style = {
        "width": "100%",
        "height": usable_height,
        paddingLeft: 25,
        paddingRight: 25

    };

    let outer_class = "merge-viewer-outer";
    if (theme.dark_theme) {
        outer_class = outer_class + " bp5-dark";
    } else {
        outer_class = outer_class + " light-theme"
    }
    let current_style = {"bottom": 0};
    return (
        <Fragment>
            <TacticMenubar menu_specs={menu_specs()}
                           connection_status={props.connection_status}
                           showIconBar={true}
                           showErrorDrawerButton={true}
                           showMetadataDrawerButton={false}
                           showAssistantDrawerButton={true}
                           showRefresh={false}
                           showClose={false}
                           refreshTab={null}
                           closeTab={null}
                           resource_name={props.resource_name}
                           controlled={false}
            />
            <div style={{width: usable_width}} className={outer_class} tabIndex="0" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
                <div id="left-div" ref={top_ref} style={left_div_style}>
                    <div id="above-main" ref={above_main_ref} className="d-flex flex-row justify-content-between mb-2">
                        <span className="align-self-end">Current</span>
                        <BpSelect options={props.option_list}
                                  onChange={props.handleSelectChange}
                                  buttonIcon="application"
                                  popoverPosition={PopoverPosition.BOTTOM_RIGHT}
                                  value={props.select_val}/>
                    </div>
                    <ReactCodemirrorMergeView handleEditChange={props.handleEditChange}
                                              editor_content={props.edit_content}
                                              right_content={props.right_content}
                                              saveMe={props.saveHandler}
                                              max_height={max_merge_height}

                    />
                </div>
            </div>
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
    saveHandler: PropTypes.func,
};

MergeViewerApp = memo(MergeViewerApp);