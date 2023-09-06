// noinspection JSCheckFunctionSignatures

import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/library_home.scss";

import React from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import {Fragment, useState, useEffect, useRef, memo, useContext} from "react";

import {TacticOmnibar} from "./TacticOmnibar";
import {TacticSocket} from "./tactic_socket";
import {doFlash} from "./toaster.js";
import {LibraryPane} from "./library_pane";
import {getUsableDimensions} from "./sizing_tools";
import {withStatus} from "./toaster";
import {withErrorDrawer} from "./error_drawer";
import {KeyTrap} from "./key_trap";
import { guid, useCallbackStack, useConstructor, useConnection } from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";
import {AllMenubar} from "./library_menubars"
import {ThemeContext, withTheme} from "./theme";
import {withDialogs} from "./modal_react";
import {StatusContext} from "./toaster"

const TAB_BAR_WIDTH = 50;

export {LibraryHomeApp, library_id}
const library_id = guid();

const tab_panes = ["all-pane", "collections-pane", "projects-pane", "tiles-pane", "lists-pane", "code-pane"];
const controllable_props = ["usable_width", "usable_height"];

function LibraryHomeApp(props) {

    const omniGetters = useRef({});
    const [showOmnibar, setShowOmnibar] = useState(false);
    const [usable_height, set_usable_height] = useState(null);
    const [usable_width, set_usable_width] = useState(null);

    const theme = useContext(ThemeContext);
    const statusFuncs = useContext(StatusContext);

    const connection_status = useConnection(props.tsocket, initSocket);

    const pushCallback = useCallbackStack("library_home");

    const top_ref = useRef(null);

    const key_bindings = [
        [["ctrl+space"], _showOmnibar],
    ];

    useConstructor(() => {
        if (props.registerOmniFunction) {
            props.registerOmniFunction(_omniFunction);
        }
        if (!window.in_context) {
            const aheight = getUsableDimensions(true).usable_height_no_bottom;
            const awidth = getUsableDimensions(true).usable_width - 170;
            set_usable_height(aheight);
            set_usable_width(awidth);
        }
    });

    useEffect(() => {
        statusFuncs.stopSpinner(null);
        if (!props.controlled) {
            window.addEventListener("resize", _handleResize);
            _handleResize();
        }
    }, []);

    function initSocket() {

        // props.tsocket.attachListener('handle-callback', (task_packet) => {
        //     handleCallback(task_packet, library_id)
        // });
        props.tsocket.attachListener("window-open", data => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));
        props.tsocket.attachListener("doFlash", function (data) {
            doFlash(data)
        });
        if (!window.in_context) {

            props.tsocket.attachListener("doFlashUser", function (data) {
                doFlash(data)
            });
            props.tsocket.attachListener('close-user-windows', (data) => {
                if (!(data["originator"] == library_id)) {
                    window.close()
                }
            });
        }
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
            omni_items = omni_items.concat(omniGetters.current[ogetter]())
        }
        return omni_items
    }

    function _registerOmniGetter(name, the_function) {
        omniGetters.current[name] = the_function
    }

    function _handleResize() {
        set_usable_width(window.innerWidth - top_ref.current.offsetLeft);
        set_usable_height(window.innerHeight - top_ref.current.offsetTop)
    }

    let lib_props = {...props};
    if (!props.controlled) {
        lib_props.usable_width = usable_width - TAB_BAR_WIDTH;
        lib_props.usable_height = usable_height;
    }
    let all_pane = (
        <LibraryPane {...lib_props}
                     connection_status={connection_status}
                     columns={{
                         "icon:th": {"sort_field": "type", "first_sort": "ascending"},
                         "name": {"sort_field": "name", "first_sort": "ascending"},
                         "icon:upload": {"sort_field": null, "first_sort": "ascending"},
                         "created": {"sort_field": "created_for_sort", "first_sort": "descending"},
                         "updated": {"sort_field": "updated_for_sort", "first_sort": "ascending"},
                         "tags": {"sort_field": "tags", "first_sort": "ascending"},
                         "size": {"sort_field": "size_for_sort", "first_sort": "descending"}
                     }}
                     pane_type="all"
                     handleCreateViewer={props.handleCreateViewer}
                     open_resources={props.open_resources ? props.open_resources["all"] : null}
                     allow_search_inside={true}
                     allow_search_metadata={true}
                     MenubarClass={AllMenubar}
                     registerOmniGetter={_registerOmniGetter}
                     {...props.errorDrawerFuncs}
                     errorDrawerFuncs={props.errorDrawerFuncs}
                     library_id={library_id}
        />
    );

    let outer_style = {
        width: "100%",
        paddingLeft: 0
    };
    let outer_class = "";
    if (!props.controlled) {
        outer_class = "library-pane-holder  ";
        if (theme.dark_theme) {
            outer_class = `${outer_class} bp5-dark`;
        } else {
            outer_class = `${outer_class} light-theme`;
        }
    }

    return (
        <Fragment>
            { !props.controlled &&
                <TacticNavbar is_authenticated={window.is_authenticated}
                              registerOmniFunction={(register_func) => _registerOmniFunction("navbar", register_func)}
                              selected={null}
                              show_api_links={false}
                              extra_text={window.database_type == "Local" ? "" : window.database_type}
                              page_id={library_id}
                              user_name={window.username}/>
            }
            <div className={outer_class} ref={top_ref} style={outer_style}>
                { all_pane }
            </div>

            { !window.in_context &&
                <Fragment>
                    <TacticOmnibar omniGetters={[_omniFunction]}
                                   page_id={library_id}
                                   showOmnibar={showOmnibar}
                                   closeOmnibar={_closeOmnibar}
                    />
                    <KeyTrap global={true} bindings={key_bindings}/>
                </Fragment>
            }
        </Fragment>
    )
}

LibraryHomeApp = memo(LibraryHomeApp);

LibraryHomeApp.propTypes = {
    open_resources: PropTypes.object
};

LibraryHomeApp.defaultProps = {
    open_resources: null
};

function _library_home_main() {
    const tsocket = new TacticSocket("main", 5000, "library", library_id);
    const LibraryHomeAppPlus = withTheme(withDialogs(withErrorDrawer(withStatus(LibraryHomeApp))));
    const domContainer = document.querySelector('#library-home-root');
    ReactDOM.render(<LibraryHomeAppPlus tsocket={tsocket}
                                        registerOmniFunction={null}
                                        controlled={false}
                                        initial_theme={window.theme}/>, domContainer)
}

if (!window.in_context) {
    _library_home_main();
}

