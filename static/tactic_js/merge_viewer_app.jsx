import React from "react";
import { useEffect, useRef, memo, useMemo, useContext} from "react";
import PropTypes from 'prop-types';

import {PopoverPosition} from "@blueprintjs/core";
import { useHotkeys } from "@blueprintjs/core";

import {ReactCodemirrorMergeView6} from "./react-codemirror-mergeview6";
import {BpSelect} from "./selector_advanced";
import {TacticMenubar} from "./menu_utilities";
import {SettingsContext} from "./settings"
import {StatusContext} from "./toaster";
import {ICON_BAR_WIDTH} from "./sizing_tools";

export {MergeViewerApp}

function MergeViewerApp(props) {
    props = {
        initialized: true,
        ...props
    };

    const top_ref = useRef(null);
    const above_main_ref = useRef(null);

    const settingsContext = useContext(SettingsContext);
    const statusFuncs = useContext(StatusContext);

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

    let left_div_style = {
        display: "flex",
        minHeight: 0, minWidth: 0,
        width: "100%",
        height: "100%",
        flexDirection: "column",
        paddingLeft: 25,
        paddingRight: 25

    };

    let outer_class = "merge-viewer-outer";
    if (settingsContext.isDark()) {
        outer_class = outer_class + " bp6-dark";
    } else {
        outer_class = outer_class + " light-theme"
    }

    let outer_style = {
        width: `calc(100% - ${ICON_BAR_WIDTH}px)`,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 0,
        position: "relative"
    };

    return (
        <div style={outer_style}>
            <TacticMenubar menu_specs={menu_specs()}
                           connection_status={props.connection_status}
                           showIconBar={true}
                           showErrorDrawerButton={true}
                           showMetadataDrawerButton={false}
                           showAssistantDrawerButton={true}
                           showSettingsDrawerButton={true}
                           showRefresh={false}
                           showClose={false}
                           refreshTab={null}
                           closeTab={null}
                           resource_name={props.resource_name}
                           controlled={false}
            />
            <div className={outer_class}
                 style={{
                     display: "flex",
                     flex: "1 1 0",
                     minHeight: 0,
                     minWidth: 0,
                     width: "100%",
                     position: "relative"
                 }}
                 tabIndex="0" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
                {props.initialized &&
                    <div id="left-div" ref={top_ref} style={left_div_style}>
                        <div id="above-main" ref={above_main_ref} className="d-flex flex-row justify-content-between"
                             style={{marginTop: 5, marginBottom: 2}}>
                            <span className="align-self-end">Current</span>
                            <BpSelect options={props.option_list}
                                      onChange={props.handleSelectChange}
                                      buttonIcon="application"
                                      popoverPosition={PopoverPosition.BOTTOM_RIGHT}
                                      value={props.select_val}/>
                        </div>
                            <ReactCodemirrorMergeView6 handleEditChange={props.handleEditChange}
                                                       editor_content={props.edit_content}
                                                       right_content={props.right_content}
                                                       saveMe={props.saveHandler}

                            />
                    </div>
                }
            </div>
        </div>
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