import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/tile_creator.scss";

import 'codemirror/mode/javascript/javascript'

import React from "react";
import {Fragment, useState, useEffect, useRef, memo} from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import {Tab, Tabs, Button, ButtonGroup, Icon} from "@blueprintjs/core";

import {TacticOmnibar} from "./TacticOmnibar";
import {KeyTrap} from "./key_trap";
import {TacticSocket} from "./tactic_socket";
import {TacticMenubar} from "./menu_utilities"
import {sendToRepository} from "./resource_viewer_react_app";
import {ReactCodemirror} from "./react-codemirror";
import {CombinedMetadata} from "./blueprint_mdata_fields";
import {OptionModule, ExportModule, CommandsModule, correctOptionListTypes} from "./creator_modules_react";
import {HorizontalPanes, VerticalPanes} from "./resizing_layouts";
import {handleCallback, postAjax, postAjaxPromise, postWithCallback} from "./communication_react"
import {withStatus, doFlash} from "./toaster"
import {getUsableDimensions, SIDE_MARGIN} from "./sizing_tools";
import {withErrorDrawer} from "./error_drawer";
import {renderSpinnerMessage} from "./utilities_react"
import {TacticNavbar} from "./blueprint_navbar";
import {SearchForm} from "./library_widgets";
import {showModalReact} from "./modal_react";
import {ErrorBoundary} from "./error_boundary";
import {renderAutoCompleteElement} from "./autocomplete";
import {useCallbackStack, useConstructor, useStateAndRef} from "./utilities_react";

export {creator_props, CreatorApp}

const BOTTOM_MARGIN = 50;
const MARGIN_SIZE = 17;

function tile_creator_main() {
    function gotProps(the_props) {
        let CreatorAppPlus = withErrorDrawer(withStatus(CreatorApp));
        let the_element = <CreatorAppPlus {...the_props}
                                          controlled={false}
                                          initial_theme={window.theme}
                                          changeName={null}
        />;
        const domContainer = document.querySelector('#creator-root');
        ReactDOM.render(the_element, domContainer)
    }

    renderSpinnerMessage("Starting up ...", '#creator-root');
    postAjaxPromise("view_in_creator_in_context", {"resource_name": window.module_name})
        .then((data) => {
            creator_props(data, null, gotProps, null)
        })
}

function creator_props(data, registerDirtyMethod, finalCallback, registerOmniFunction) {

    let mdata = data.mdata;
    let split_tags = mdata.tags == "" ? [] : mdata.tags.split(" ");
    let module_name = data.resource_name;
    let module_viewer_id = data.module_viewer_id;
    window.name = module_viewer_id;

    function readyListener() {
        _everyone_ready_in_context(finalCallback);
    }

    var tsocket = new TacticSocket("main", 5000, "creator", module_viewer_id, function (response) {
        tsocket.socket.on("remove-ready-block", readyListener);
        tsocket.socket.emit('client-ready', {
            "room": data.module_viewer_id, "user_id": window.user_id, "participant": "client",
            "rb_id": data.ready_block_id, "main_id": data.module_viewer_id
        })
    });
    let tile_collection_name = data.tile_collection_name;


    function _everyone_ready_in_context(finalCallback) {
        if (!window.in_context) {
            renderSpinnerMessage("Everyone is ready, initializing...", '#creator-root');
        }
        let the_content = {
            "module_name": module_name,
            "module_viewer_id": module_viewer_id,
            "tile_collection_name": tile_collection_name,
            "user_id": window.user_id,
            "version_string": window.version_string
        };

        window.addEventListener("unload", function sendRemove() {
            navigator.sendBeacon("/delete_container_on_unload",
                JSON.stringify({"container_id": module_viewer_id, "notify": false}));
        });
        tsocket.attachListener('handle-callback', (task_packet) => {
            handleCallback(task_packet, module_viewer_id)
        });
        postWithCallback(module_viewer_id, "initialize_parser",
            the_content, (pdata) => got_parsed_data_in_context(pdata), null, module_viewer_id);

        function got_parsed_data_in_context(data_object) {
            if (!window.in_context) {
                renderSpinnerMessage("Creating the page...", '#creator-root');
            }
            tsocket.socket.off("remove-ready-block", readyListener);
            let parsed_data = data_object.the_content;
            let category = parsed_data.category ? parsed_data.category : "basic";
            let result_dict = {"res_type": "tile", "res_name": module_name, "is_repository": false};
            let odict = parsed_data.option_dict;
            let initial_line_number = !window.in_context && window.line_number ? window.line_number : null;
            let couple_save_attrs_and_exports =
                !("couple_save_attrs_and_exports" in mdata.additional_mdata) || mdata.additional_mdata.couple_save_attrs_and_exports;

            finalCallback(
                {
                    resource_name: module_name,
                    tsocket: tsocket,
                    module_viewer_id: module_viewer_id,
                    main_id: module_viewer_id,
                    is_mpl: parsed_data.is_mpl,
                    is_d3: parsed_data.is_d3,
                    render_content_code: parsed_data.render_content_code,
                    render_content_line_number: parsed_data.render_content_line_number,
                    extra_methods_line_number: parsed_data.extra_methods_line_number,
                    draw_plot_line_number: parsed_data.draw_plot_line_number,
                    initial_line_number: initial_line_number,
                    category: category,
                    extra_functions: parsed_data.extra_functions,
                    draw_plot_code: parsed_data.draw_plot_code,
                    jscript_code: parsed_data.jscript_code,
                    tags: split_tags,
                    notes: mdata.notes,
                    icon: mdata.additional_mdata.icon,
                    initial_theme: window.theme,
                    option_list: correctOptionListTypes(parsed_data.option_dict),
                    export_list: parsed_data.export_list,
                    additional_save_attrs: parsed_data.additional_save_attrs,
                    couple_save_attrs_and_exports: couple_save_attrs_and_exports,
                    created: mdata.datestring,
                    registerDirtyMethod: registerDirtyMethod,
                    registerOmniFunction: registerOmniFunction
                }
            );
        }
    }
}

function TileCreatorToolbar(props) {
    let tstyle = {
        "marginTop": window.in_context ? 0 : 20,
        "paddingRight": 20,
        "width": "100%"
    };
    let toolbar_outer_style = {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 0,
        marginTop: 7,
        whiteSpace: "nowrap"
    };
    return (
        <div style={tstyle} className="d-flex flex-row justify-content-between">
            <SearchForm update_search_state={props.update_search_state}
                        search_string={props.search_string}
                        field_width={200}
                        include_search_jumper={true}
                        searchPrev={props.searchPrev}
                        searchNext={props.searchNext}
                        search_ref={props.search_ref}
                        number_matches={props.search_matches}
            />
        </div>
    )
}

TileCreatorToolbar.proptypes = {
    button_groups: PropTypes.array,
    setResourceNameState: PropTypes.func,
    resource_name: PropTypes.string,
    search_string: PropTypes.string,
    update_search_state: PropTypes.func,
    res_type: PropTypes.string,
    search_ref: PropTypes.object,
    search_matches: PropTypes.number
};

TileCreatorToolbar.defaultProps = {};

function CreatorApp(props) {
    const omniGetters = useRef({});
    const top_ref = useRef(null);
    const rc_span_ref = useRef(null);
    const vp_ref = useRef(null);

    const methods_ref = useRef(null);
    const commands_ref = useRef(null);
    const search_ref = useRef(null);
    const last_save = useRef({});
    const dpObject = useRef(null);
    const rcObject = useRef(null);
    const emObject = useRef(null);
    const rline_number = useRef(props.initial_line_number);
    const cm_list = useRef(props.is_mpl || props.is_d3 ? ["tc", "rc", "em"] : ["rc", "em"]);
    const search_match_numbers = useRef({
        tc: 0,
        rc: 0,
        em: 0
    });
    const key_bindings = useRef([]);
    
    const [tabSelectCounter, setTabSelectCounter] = useState(0);

    const [foregrounded_panes, set_foregrounded_panes] = useState({
        "metadata": true,
        "options": false,
        "exports": false,
        "methods": false,
        "commands": false
    });
    const [search_string, set_search_string] = useState("");
    const [current_search_number, set_current_search_number] = useState(null);
    const [current_search_cm, set_current_search_cm] = useState(cm_list.current[0]);
    const [regex, set_regex] = useState(false);
    const [search_matches, set_search_matches] = useState(0);

    const [render_content_code, set_render_content_code, render_content_code_ref] = useStateAndRef(props.render_content_code);
    const [draw_plot_code, set_draw_plot_code, draw_plot_code_ref] = useStateAndRef(props.draw_plot_code);
    const [jscript_code, set_jscript_code, jscript_code_ref] = useStateAndRef(props.jscript_code);
    const [extra_functions, set_extra_functions, extra_functions_ref] = useStateAndRef(props.extra_functions);
    const [option_list, set_option_list, option_list_ref] = useStateAndRef(props.option_list);
    const [export_list, set_export_list, export_list_ref] = useStateAndRef(props.export_list);

    const [render_content_line_number, set_render_content_line_number, render_content_line_number_ref] = useStateAndRef(props.render_content_line_number);
    const [draw_plot_line_number, set_draw_plot_line_number, draw_plot_line_number_ref] = useStateAndRef(props.draw_plot_line_number);
    const [extra_methods_line_number, set_extra_methods_line_number, extra_methods_line_number_ref] = useStateAndRef(props.extra_methods_line_number);

    const [notes, set_notes, notes_ref] = useStateAndRef(props.notes);
    const [tags, set_tags, tags_ref] = useStateAndRef(props.tags);
    const [icon, set_icon, icon_ref] = useStateAndRef(props.icon);
    const [category, set_category, category_ref] = useStateAndRef(props.category);

    const [additional_save_attrs, set_additional_save_attrs, additional_save_attrs_ref] = useStateAndRef(props.additional_save_attrs || []);
    const [couple_save_attrs_and_exports, set_couple_save_attrs_and_exports, couple_save_attrs_and_exports_ref] = useStateAndRef(props.couple_save_attrs_and_exports);

    const [selectedTabId, setSelectedTabId] = useState("metadata");
    const [top_pane_fraction, set_top_pane_fraction] = useState(props.is_mpl || props.is_d3 ? .5 : 1);
    const [left_pane_fraction, set_left_pane_fraction] = useState(.5);
    const [usable_height, set_usable_height] = useState(() => {
        return getUsableDimensions(true).usable_height_no_bottom
    });
    const [usable_width, set_usable_width] = useState(() => {
        return getUsableDimensions(true).usable_width - 170
    });

    const [showOmnibar, setShowOmnibar] = useState(false);

    const pushCallback = useCallbackStack();

    const [dark_theme, set_dark_theme] = useState(() => {
        return props.initial_theme === "dark"
    });
    const [resource_name, set_resource_name] = useState(props.resource_name);

    useConstructor(() => {
        if (!window.in_context) {
            key_bindings.current = [
                [["ctrl+space"], _showOmnibar],
            ];
        }
    });

    useEffect(() => {
        initSocket();
        if (props.registerOmniFunction) {
            props.registerOmniFunction(_omniFunction);
        }
        if (props.controlled) {
            props.registerDirtyMethod(_dirty);
            props.registerLineSetter(_selectLineNumber);
        } else {
            window.dark_theme = dark_theme;
            window.addEventListener("beforeunload", function (e) {
                if (_dirty()) {
                    e.preventDefault();
                    e.returnValue = ''
                }
            });
            document.title = resource_name;
            window.addEventListener("resize", _update_window_dimensions);
            _update_window_dimensions()
        }
        _goToLineNumber();
        _update_saved_state();
        props.setGoToLineNumber(_selectLineNumber);
        props.stopSpinner();
        return (() => {
            props.tsocket.disconnect();
            delete_my_container()
        })
    }, []);

    useEffect(() => {
        _goToLineNumber();
    });


    function initSocket() {
        props.tsocket.attachListener('focus-me', (data) => {
            window.focus();
            _selectLineNumber(data.line_number)
        });
        props.tsocket.attachListener("doFlash", function (data) {
            doFlash(data)
        });
        if (!window.in_context) {
            props.tsocket.attachListener("doFlashUser", function (data) {
                doFlash(data)
            });
            props.tsocket.attachListener('close-user-windows', (data) => {
                if (!(data["originator"] == props.resource_viewer_id)) {
                    window.close()
                }
            });
        }
    }

    function cPropGetters() {
        return {
            usable_width: usable_width,
            usable_height: usable_height,
            resource_name: resource_name
        }
    }

    function _cProp(pname) {
        return props.controlled ? props[pname] : cPropGetters()[pname]
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

    function menu_specs() {
        let ms = {
            Save: [{name_text: "Save", icon_name: "saved", click_handler: _saveMe, key_bindings: ['ctrl+s']},
                {name_text: "Save As...", icon_name: "floppy-disk", click_handler: _saveModuleAs},
                {
                    name_text: "Save and Checkpoint",
                    icon_name: "map-marker",
                    click_handler: _saveAndCheckpoint,
                    key_bindings: ['ctrl+m']
                }],
            Load: [{
                name_text: "Save and Load",
                icon_name: "upload",
                click_handler: _saveAndLoadModule,
                key_bindings: ['ctrl+l']
            },
                {name_text: "Load", icon_name: "upload", click_handler: _loadModule}],
            Compare: [{name_text: "View History", icon_name: "history", click_handler: _showHistoryViewer},
                {name_text: "Compare to Other Modules", icon_name: "comparison", click_handler: _showTileDiffer}],
            Transfer: [
                {
                    name_text: "Share", icon_name: "share",
                    click_handler: () => {
                        sendToRepository("tile", _cProp("resource_name"))
                    }
                }
            ]
        };

        for (let menu in ms) {
            for (let but of ms[menu]) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return ms
    }

    function _extraKeys() {
        return {
            'Ctrl-S': _saveMe,
            'Ctrl-L': _saveAndLoadModule,
            'Ctrl-M': _saveAndCheckpoint,
            'Ctrl-F': () => {
                search_ref.current.focus()
            },
            'Cmd-F': () => {
                search_ref.current.focus()
            }

        }
    }

    function _searchNext() {
        if (current_search_number >= search_match_numbers.current[current_search_cm] - 1) {
            let next_cm;
            if (current_search_cm == "rc") {
                next_cm = "em";
                _handleTabSelect("methods");
            } else if (current_search_cm == "tc") {
                next_cm = "rc"
            } else {
                if (props.is_mpl || props.is_d3) {
                    next_cm = "tc"
                } else {
                    next_cm = "rc"
                }
            }
            if (next_cm == "em") {
                _handleTabSelect("methods");
            }
            set_current_search_cm(next_cm);
            set_current_search_number(0);
        } else {
            set_current_search_number(current_search_number + 1);
        }
    }

    function _searchPrev() {
        let next_cm;
        let next_search_number;
        if (current_search_number <= 0) {
            if (current_search_cm == "em") {
                next_cm = "rc";
                next_search_number = search_match_numbers.current["rc"] - 1
            } else if (current_search_cm == "tc") {
                next_cm = "em";
                next_search_number = search_match_numbers.current["em"] - 1
            } else {
                if (props.is_mpl || props.is_d3) {
                    next_cm = "tc";
                    next_search_number = search_match_numbers.current["tc"] - 1
                } else {
                    next_cm = "em";
                    next_search_number = search_match_numbers.current["em"] - 1
                }
            }
            if (next_cm == "em") {
                _handleTabSelect("methods");
            }
            set_current_search_cm(next_cm);
            set_current_search_number(next_search_number);
        } else {
            set_current_search_number(current_search_number - 1);
        }
    }

    function _updateSearchState(new_state, callback = null) {
        set_current_search_cm(cm_list.current[0]);
        set_current_search_number(0);
        for (let field in new_state) {
            switch (field) {
                case "regex":
                    set_regex(new_state[field]);
                    break;
                case "search_string":
                    set_search_string(new_state[field]);
                    break;
            }
        }
    }

    function _noSearchResults() {
        if (search_string == "" || search_string == null) {
            return true
        } else {
            for (let cm of cm_list.current) {
                if (search_match_numbers.current[cm]) {
                    return false
                }
            }
            return true
        }
    }

    function _setTheme(dark_theme) {
        set_dark_theme(dark_theme);
        if (!window.in_context) {
            pushCallback(() => {
                window.dark_theme = dark_theme
            })
        }
    }

    function _showHistoryViewer() {
        window.open(`${$SCRIPT_ROOT}/show_history_viewer/${_cProp("resource_name")}`)
    }

    function _showTileDiffer() {
        window.open(`${$SCRIPT_ROOT}/show_tile_differ/${_cProp("resource_name")}`)
    }

    function _doFlashStopSpinner(data) {
        props.clearStatus();
        doFlash(data)
    }

    function _selectLineNumber(lnumber) {
        rline_number.current = lnumber;
        _goToLineNumber()
    }

    function _logErrorStopSpinner(title, data = {}) {
        props.stopSpinner();
        let entry = {title: title, content: data.message};
        if ("line_number" in data) {
            entry.line_number = data.line_number
        }
        props.addErrorDrawerEntry(entry, true);
        props.openErrorDrawer();
    }

    function _dirty() {
        let current_state = _getSaveDict();
        for (let k in current_state) {
            if (current_state[k] != last_save.current[k]) {
                return true
            }
        }
        return false
    }

    function _saveAndLoadModule() {
        props.startSpinner();
        doSavePromise()
            .then(function () {
                props.statusMessage("Loading Module");
                postWithCallback(
                    "host",
                    "load_tile_module_task",
                    {"tile_module_name": _cProp("resource_name"), "user_id": window.user_id},
                    load_success,
                    null,
                    props.module_viewer_id
                )
            })
            .catch((data) => {
                _logErrorStopSpinner("Error loading module", data)
            });

        function load_success(data) {
            if (data.success) {
                data.timeout = 2000;
            }
            _doFlashStopSpinner(data);
            return false
        }
    }

    function _loadModule() {
        props.startSpinner();
        props.statusMessage("Loading Module");
        postWithCallback(
            "host",
            "load_tile_module_task",
            {"tile_module_name": _cProp("resource_name"), "user_id": window.user_id},
            load_success,
            null,
            props.module_viewer_id
        );

        function load_success(data) {
            if (data.success) {
                data.timeout = 2000;
            }
            _doFlashStopSpinner(data);
            return false
        }
    }

    function _saveModuleAs() {
        props.startSpinner();
        postWithCallback("host", "get_tile_names", {"user_id": window.user_id}, function (data) {
            let checkboxes;
            showModalReact("Save Module As", "New ModuleName Name", CreateNewModule,
                "NewModule", data["tile_names"], null, doCancel)
        }, null, props.main_id);

        function doCancel() {
            props.stopSpinner()
        }

        function CreateNewModule(new_name) {
            const result_dict = {
                "new_res_name": new_name,
                "res_to_copy": _cProp("resource_name")
            };
            postAjaxPromise('/create_duplicate_tile', result_dict)
                .then((data) => {
                        _setResourceNameState(new_name, () => {
                            _saveMe()
                        })
                    }
                )
                .catch(doFlash)
        }

    }

    function _saveMe() {
        if (!props.am_selected) {
            return false
        }
        props.startSpinner();
        props.statusMessage("Saving Module");
        doSavePromise()
            .then(_doFlashStopSpinner)
            .catch((data) => {
                _logErrorStopSpinner("Error saving module", data)
            });
        return false
    }


    function _saveAndCheckpoint() {
        props.startSpinner();
        doSavePromise()
            .then(function () {
                props.statusMessage("Checkpointing");
                doCheckpointPromise()
                    .then(_doFlashStopSpinner)
                    .catch((data) => {
                        _logErrorStopSpinner("Error checkpointing module", data)
                    })
            })
            .catch((data) => {
                _logErrorStopSpinner("Error saving module", data)
            });
        return false

    }

    function get_tags_string() {
        let taglist = tags_ref.current;
        let local_tags = "";
        for (let tag of taglist) {
            local_tags = local_tags + tag + " "
        }
        return local_tags.trim();
    }

    function _getSaveDict() {
        return {
            "module_name": _cProp("resource_name"),
            "category": category.length == 0 ? "basic" : category_ref.current,
            "tags": get_tags_string(),
            "notes": notes_ref.current,
            "icon": icon_ref.current,
            "exports": export_list_ref.current,
            "additional_save_attrs": additional_save_attrs_ref.current,
            "couple_save_attrs_and_exports": couple_save_attrs_and_exports_ref.current,
            "options": option_list_ref.current,
            "extra_methods": extra_functions_ref.current,
            "render_content_body": render_content_code_ref.current,
            "is_mpl": props.is_mpl,
            "is_d3": props.is_d3,
            "draw_plot_body": draw_plot_code_ref.current,
            "jscript_body": jscript_code_ref.current,
            "last_saved": "creator"
        };
    }

    function doSavePromise() {
        return new Promise(function (resolve, reject) {
            let result_dict = _getSaveDict();

            postWithCallback(props.module_viewer_id, "update_module", result_dict, function (data) {
                if (data.success) {
                    save_success(data);
                    resolve(data)
                } else {
                    reject(data)
                }
            }, null, props.module_viewer_id)
        })
    }

    function doCheckpointPromise() {
        return new Promise(function (resolve, reject) {
            postAjax("checkpoint_module", {"module_name": _cProp("resource_name")}, function (data) {
                if (data.success) {
                    resolve(data)
                } else {
                    reject(data)
                }
            });
        })
    }

    function save_success(data) {
        set_render_content_line_number(data.render_content_line_number);
        set_extra_methods_line_number(data.extra_methods_line_number);
        set_draw_plot_line_number(data.draw_plot_line_number);
        _update_saved_state();
    }

    function _update_window_dimensions() {
        set_usable_width(window.innerWidth - top_ref.current.offsetLeft);
        set_usable_height(window.innerHeight - top_ref.current.offsetTop)
    }

    function _update_saved_state() {
        last_save.current = _getSaveDict();
    }

    function _selectLine(cm, lnumber) {
        let doc = cm.getDoc();
        if (doc.getLine(lnumber)) {
            doc.setSelection(
                {line: lnumber, ch: 0},
                {line: lnumber, ch: doc.getLine(lnumber).length},
                {scroll: true})
        }

    }

    function _goToLineNumber() {
        if (rline_number.current) {
            props.closeErrorDrawer();
            if (props.is_mpl || props.is_d3) {
                if (rline_number.current < draw_plot_line_number_ref.current) {
                    if (emObject.current) {
                        _handleTabSelect("methods");
                        _selectLine(emObject.current, rline_number.current - extra_methods_line_number_ref.current);
                        rline_number.current = null

                    } else {
                        return
                    }
                } else if (rline_number.current < render_content_line_number_ref.current) {
                    if (dpObject.current) {
                        _selectLine(dpObject.current, rline_number.current - draw_plot_line_number_ref.current - 1);
                        rline_number.current = null
                    } else {
                        return
                    }
                } else if (rcObject.current) {
                    _selectLine(rcObject.current, rline_number.current - render_content_line_number_ref.current - 1);
                    rline_number.current = null
                }
            } else {
                if (rline_number < props.render_content_line_number) {
                    if (emObject.current) {
                        _handleTabSelect("methods");
                        _selectLine(emObject.current, rline_number.current - extra_methods_line_number_ref.current);
                        rline_number.current = null
                    } else {
                        return
                    }
                } else {
                    if (rcObject.current) {
                        _selectLine(rcObject.current, rline_number.current - render_content_line_number_ref.current - 1);
                        rline_number.current = null
                    }
                }
            }
        }
    }


    function delete_my_container() {
        postAjax("/delete_container_on_unload", {"container_id": props.module_viewer_id, "notify": false});
    }

    function _handleTabSelect(newTabId, prevTabid, event) {
        let new_fg = Object.assign({}, foregrounded_panes);
        new_fg[newTabId] = true;
        setSelectedTabId(newTabId);
        set_foregrounded_panes(new_fg);
        pushCallback(() => {
            if (props.controlled) {
                setTabSelectCounter(tabSelectCounter + 1);
            }
            else {
                _update_window_dimensions();
            }

        })
    }

    function _handleNotesAppend(new_text) {
        set_notes(notes_ref.current + new_text);
    }

    function _appendOptionText() {
        let res_string = "\n\noptions: \n\n";
        for (let opt of option_list_ref.current) {
            res_string += ` * \`${opt.name}\` (${opt.type}): \n`
        }
        _handleNotesAppend(res_string);
    }

    function _appendExportText() {
        let res_string = "\n\nexports: \n\n";
        for (let exp of export_list_ref.current) {
            res_string += ` * \`${exp.name}\` : \n`
        }
        _handleNotesAppend(res_string);
    }

    function _metadataNotesButtons() {
        return (
            <ButtonGroup>
                <Button style={{height: "fit-content", alignSelf: "start", marginTop: 10, fontSize: 12}}
                        text="Add Options"
                        small={true}
                        minimal={true}
                        intent="primary"
                        icon="select"
                        onClick={e => {
                            e.preventDefault();
                            _appendOptionText()
                        }}/>
                <Button style={{height: "fit-content", alignSelf: "start", marginTop: 10, fontSize: 12}}
                        text="Add Exports"
                        small={true}
                        minimal={true}
                        intent="primary"
                        icon="export"
                        onClick={e => {
                            e.preventDefault();
                            _appendExportText()
                        }}/>
            </ButtonGroup>
        )
    }

    function _handleMetadataChange(state_stuff) {
        for (let field in state_stuff) {
            switch (field) {
                case "tags":
                    set_tags(state_stuff[field]);
                    break;
                case "notes":
                    set_notes(state_stuff[field]);
                    break;

                case "icon":
                    set_icon(state_stuff[field]);
                    break;

                case "category":
                    set_category(state_stuff[field]);
                    break;
            }
        }
    }

    function handleExportsStateChange(state_stuff) {
        for (let field in state_stuff) {
            switch (field) {
                case "export_list":
                    set_export_list([...state_stuff[field]]);
                    break;
                case "additional_save_attrs":
                    set_additional_save_attrs([...state_stuff[field]]);
                    break;

                case "couple_save_attrs_and_exports":
                    set_couple_save_attrs_and_exports(state_stuff[field]);
                    break;
            }
        }
    }

    function handleOptionsListChange(new_option_list, callback = null) {
        set_option_list([...new_option_list]);
        pushCallback(callback);
    }

    function handleMethodsChange(new_methods) {
        set_extra_functions(new_methods)
    }

    function get_height_minus_top_offset(element_ref, min_offset = 0, default_offset = 100) {
        if (element_ref && element_ref.current) {
            let offset = element_ref.current.offsetTop;
            if (offset < min_offset) {
                offset = min_offset
            }
            return _cProp("usable_height") - offset
        } else {
            return _cProp("usable_height") - default_offset
        }
    }

    function get_new_tc_height() {
        return _cProp("usable_height") * top_pane_fraction - 35
    }

    function get_new_rc_height(outer_rc_height) {
        if (rc_span_ref && rc_span_ref.current) {
            return outer_rc_height - rc_span_ref.current.offsetHeight
        } else {
            return outer_rc_height - 50
        }
    }

    function handleTopPaneResize(top_height, bottom_height, top_fraction) {
        set_top_pane_fraction(top_fraction)
    }

    function handleLeftPaneResize(left_width, right_width, left_fraction) {
        set_left_pane_fraction(left_fraction)
    }

    function handleTopCodeChange(new_code) {
        if (props.is_mpl) {
            set_draw_plot_code(new_code)
        } else {
            set_jscript_code(new_code)
        }

    }

    function handleRenderContentChange(new_code) {
        set_render_content_code(new_code)
    }

    function _setResourceNameState(new_name, callback = null) {
        if (props.controlled) {
            props.changeResourceName(new_name, callback)
        } else {
            set_resource_name(new_name);
            pushCallback(callback)
        }
    }

    function _clearAllSelections() {
        for (let cm of [rcObject.current, dpObject.current, emObject.current]) {
            if (cm) {
                let to = cm.getCursor("to");
                cm.setCursor(to);
            }
        }
    }

    function _setDpObject(cmobject) {
        dpObject.current = cmobject
    }

    function _setRcObject(cmobject) {
        rcObject.current = cmobject
    }

    function _setEmObject(cmobject) {
        emObject.current = cmobject
    }

    function _setSearchMatches(rc_name, num) {
        search_match_numbers.current[rc_name] = num;
        let current_matches = 0;
        for (let cname in search_match_numbers.current) {
            current_matches += search_match_numbers.current[cname]

        }
        set_search_matches(current_matches)
    }

    function _getOptionNames() {
        let onames = [];
        for (let entry of option_list_ref.current) {
            onames.push(entry.name)
        }
        return onames
    }

    let onames_for_autocomplete = [];
    for (let oname of _getOptionNames()) {
        let the_text = "" + oname;
        onames_for_autocomplete.push({text: the_text, icon: "select", render: renderAutoCompleteElement});
    }
    let actual_dark_theme = props.controlled ? props.dark_theme : dark_theme;
    let my_props = {...props};
    if (!props.controlled) {
        my_props.resource_name = resource_name;
        my_props.usable_height = usable_height;
        my_props.usable_width = usable_width;
    }
    let vp_height = get_height_minus_top_offset(vp_ref);
    let uwidth = my_props.usable_width - 2 * SIDE_MARGIN;
    let uheight = my_props.usable_height;

    let code_width = uwidth * left_pane_fraction - 35;
    let ch_style = {"width": "100%"};

    let tc_item;
    if (my_props.is_mpl || my_props.is_d3) {
        let tc_height = get_new_tc_height();
        let mode = my_props.is_mpl ? "python" : "javascript";
        let code_content = my_props.is_mpl ? draw_plot_code_ref.current : jscript_code_ref.current;
        let first_line_number = my_props.is_mpl ? draw_plot_line_number_ref.current + 1 : 1;
        let title_label = my_props.is_mpl ? "draw_plot" : "(selector, w, h, arg_dict, resizing) =>";
        tc_item = (
            <div key="dpcode" style={ch_style} className="d-flex flex-column align-items-baseline code-holder">
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
                    <span className="bp5-ui-text"
                          style={{display: "flex", alignItems: "self-end"}}>{title_label}</span>
                    <SearchForm update_search_state={_updateSearchState}
                                search_string={search_string}
                                regex={regex}
                                allow_regex={true}
                                field_width={200}
                                include_search_jumper={true}
                                searchPrev={_searchPrev}
                                searchNext={_searchNext}
                                search_ref={search_ref}
                                number_matches={search_matches}
                    />
                </div>
                <ReactCodemirror code_content={code_content}
                                 mode={mode}
                                 am_selected={props.am_selected}
                                 extraKeys={_extraKeys()}
                                 current_search_number={current_search_cm == "tc" ? current_search_number : null}
                                 handleChange={handleTopCodeChange}
                                 saveMe={_saveAndCheckpoint}
                                 setCMObject={_setDpObject}
                                 search_term={search_string}
                                 update_search_state={_updateSearchState}
                                 alt_clear_selections={_clearAllSelections}
                                 first_line_number={first_line_number.current}
                                 code_container_height={tc_height}
                                 dark_theme={actual_dark_theme}
                                 readOnly={props.read_only}
                                 regex_search={regex}
                                 setSearchMatches={(num) => _setSearchMatches("tc", num)}
                                 extra_autocomplete_list={mode == "python" ? onames_for_autocomplete : []}
                />
            </div>
        );
    }
    let rc_height;
    if (my_props.is_mpl || my_props.is_d3) {
        let bheight = (1 - top_pane_fraction) * uheight - 35;
        rc_height = get_new_rc_height(bheight)
    } else {
        rc_height = get_new_rc_height(vp_height)
    }

    let bc_item = (
        <div key="rccode" id="rccode" style={ch_style} className="d-flex flex-column align-items-baseline code-holder">
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
                <span className="bp5-ui-text"
                      style={{display: "flex", alignItems: "self-end"}}
                      ref={rc_span_ref}>render_content</span>
                {!my_props.is_mpl && !my_props.is_d3 &&
                    <SearchForm update_search_state={_updateSearchState}
                                search_string={search_string}
                                regex={regex}
                                allow_regex={true}
                                field_width={200}
                                include_search_jumper={true}
                                searchPrev={_searchPrev}
                                searchNext={_searchNext}
                                search_ref={search_ref}
                                number_matches={search_matches}
                    />
                }
            </div>
            <ReactCodemirror code_content={render_content_code_ref.current}
                             current_search_number={current_search_cm == "rc" ? current_search_number : null}
                             am_selected={props.am_selected}
                             handleChange={handleRenderContentChange}
                             extraKeys={_extraKeys()}
                             saveMe={_saveAndCheckpoint}
                             setCMObject={_setRcObject}
                             search_term={search_string}
                             update_search_state={_updateSearchState}
                             alt_clear_selections={_clearAllSelections}
                             first_line_number={render_content_line_number_ref.current + 1}
                             code_container_height={rc_height}
                             dark_theme={actual_dark_theme}
                             readOnly={props.read_only}
                             regex_search={regex}
                             setSearchMatches={(num) => _setSearchMatches("rc", num)}
                             extra_autocomplete_list={onames_for_autocomplete}

            />
        </div>
    );
    let left_pane;
    if (my_props.is_mpl || my_props.is_d3) {
        left_pane = (
            <Fragment>
                <div ref={vp_ref}/>
                <VerticalPanes top_pane={tc_item}
                               bottom_pane={bc_item}
                               show_handle={true}
                               available_height={vp_height}
                               available_width={left_pane_fraction * uwidth - 20}
                               handleSplitUpdate={handleTopPaneResize}
                               id="creator-left"
                />
            </Fragment>
        );
    } else {
        left_pane = (
            <Fragment>

                <div ref={vp_ref}>
                    {bc_item}
                </div>

            </Fragment>
        );
    }
    let default_module_height = get_height_minus_top_offset(null, 128, 128);
    let mdata_style = {marginLeft: 20, overflow: "auto", padding: 15, height: default_module_height};
    let mdata_panel = (<CombinedMetadata tags={tags_ref.current}
                                         readOnly={props.readOnly}
                                         notes={notes_ref.current}
                                         icon={icon_ref.current}
                                         created={my_props.created}
                                         category={category_ref.current}
                                         pane_type="tile"
                                         notes_buttons={_metadataNotesButtons}
                                         handleChange={_handleMetadataChange}
    />);

    let option_panel = (
        <OptionModule data_list={option_list_ref.current}
                      foregrounded={foregrounded_panes["options"]}
                      handleChange={handleOptionsListChange}
                      handleNotesAppend={_handleNotesAppend}
                      available_height={default_module_height}
        />
    );
    let export_panel = (
        <ExportModule export_list={export_list_ref.current}
                      save_list={additional_save_attrs_ref.current}
                      couple_save_attrs_and_exports={couple_save_attrs_and_exports_ref.current}
                      foregrounded={foregrounded_panes["exports"]}
                      handleChange={handleExportsStateChange}
                      handleNotesAppend={_handleNotesAppend}
                      available_height={default_module_height}
        />
    );
    let methods_height = get_height_minus_top_offset(methods_ref, 128, 128);
    let methods_panel = (
        <div style={{marginLeft: 5}}>
            <ReactCodemirror handleChange={handleMethodsChange}
                             show_fold_button={true}
                             am_selected={props.am_selected}
                             current_search_number={current_search_cm == "em" ? current_search_number : null}
                             dark_theme={dark_theme}
                             extraKeys={_extraKeys()}
                             readOnly={props.readOnly}
                             code_content={extra_functions_ref.current}
                             saveMe={_saveAndCheckpoint}
                             setCMObject={_setEmObject}
                             code_container_ref={methods_ref}
                             code_container_height={methods_height}
                             search_term={search_string}
                             update_search_state={_updateSearchState}
                             alt_clear_selections={_clearAllSelections}
                             regex_search={regex}
                             first_line_number={extra_methods_line_number_ref.current}
                             setSearchMatches={(num) => _setSearchMatches("em", num)}
                             extra_autocomplete_list={onames_for_autocomplete}
            />
        </div>

    );
    let commands_height = get_height_minus_top_offset(commands_ref, 128, 128);
    let commands_panel = (
        <CommandsModule foregrounded={foregrounded_panes["commands"]}
                        available_height={commands_height}
                        commands_ref={commands_ref}
        />
    );
    let right_pane = (
        <Fragment>
            <div id="creator-resources" className="d-block">
                <Tabs id="resource_tabs" selectedTabId={selectedTabId}
                      large={false} onChange={_handleTabSelect}>
                    <Tab id="metadata" title={<span><Icon size={12} icon="manually-entered-data"/> metadata</span>}
                         panel={mdata_panel}/>
                    <Tab id="options" title={<span><Icon size={12} icon="select"/> options</span>}
                         panel={option_panel}/>
                    <Tab id="exports" title={<span><Icon size={12} icon="export"/> exports</span>}
                         panel={export_panel}/>
                    <Tab id="methods" title={<span><Icon size={12} icon="code"/> methods</span>} panel={methods_panel}/>
                    <Tab id="commands" title={<span><Icon size={12} icon="manual"/> documentation</span>}
                         panel={commands_panel}/>
                </Tabs>
            </div>
        </Fragment>
    );
    let outer_style = {
        width: "100%",
        height: uheight,
        paddingLeft: props.controlled ? 5 : SIDE_MARGIN,
        paddingTop: 15
    };
    let outer_class = "resource-viewer-holder pane-holder";
    if (!window.in_context) {
        if (dark_theme) {
            outer_class = outer_class + " bp5-dark";
        } else {
            outer_class = outer_class + " light-theme"
        }
    }
    return (
        <ErrorBoundary>
            {!window.in_context &&
                <TacticNavbar is_authenticated={window.is_authenticated}
                              dark_theme={dark_theme}
                              setTheme={_setTheme}
                              selected={null}
                              show_api_links={true}
                              page_id={props.module_viewer_id}
                              user_name={window.username}/>
            }
            <TacticMenubar menu_specs={menu_specs()}
                           showRefresh={window.in_context}
                           showClose={window.in_context}
                           dark_theme={dark_theme}
                           refreshTab={props.refreshTab}
                           closeTab={props.closeTab}
                           resource_name={_cProp("resource_name")}
                           showErrorDrawerButton={true}
                           toggleErrorDrawer={props.toggleErrorDrawer}
                           controlled={props.controlled}
                           registerOmniGetter={_registerOmniGetter}
                           am_selected={props.am_selected}
            />
            <ErrorBoundary>
                <div className={outer_class} ref={top_ref} style={outer_style}>
                    <HorizontalPanes left_pane={left_pane}
                                     right_pane={right_pane}
                                     show_handle={true}
                                     available_height={uheight}
                                     available_width={uwidth}
                                     handleSplitUpdate={handleLeftPaneResize}
                    />
                </div>
                {!window.in_context &&
                    <Fragment>
                        <TacticOmnibar omniGetters={[_omniFunction]}
                                       page_id={props.module_viewer_id}
                                       showOmnibar={showOmnibar}
                                       closeOmnibar={_closeOmnibar}
                                       is_authenticated={window.is_authenticated}
                                       dark_theme={dark_theme}
                                       setTheme={_setTheme}
                        />
                        <KeyTrap global={true} bindings={key_bindings.current}/>
                    </Fragment>
                }
            </ErrorBoundary>
        </ErrorBoundary>
    );
}

CreatorApp = memo(CreatorApp);

CreatorApp.propTypes = {
    controlled: PropTypes.bool,
    am_selected: PropTypes.bool,
    changeResourceName: PropTypes.func,
    changeResourceTitle: PropTypes.func,
    changeResourceProps: PropTypes.func,
    refreshTab: PropTypes.func,
    closeTab: PropTypes.func,
    registerLineSetter: PropTypes.func,
    updatePanel: PropTypes.func,
    is_mpl: PropTypes.bool,
    render_content_code: PropTypes.string,
    render_content_line_number: PropTypes.number,
    extra_methods_line_number: PropTypes.number,
    category: PropTypes.string,
    extra_functions: PropTypes.string,
    draw_plot_code: PropTypes.string,
    jscript_code: PropTypes.string,
    tags: PropTypes.array,
    notes: PropTypes.string,
    icon: PropTypes.string,
    option_list: PropTypes.array,
    export_list: PropTypes.array,
    created: PropTypes.string,
    tsocket: PropTypes.object,
    usable_height: PropTypes.number,
    usable_width: PropTypes.number
};

CreatorApp.defaultProps = {
    am_selected: true,
    controlled: false,
    changeResourceName: null,
    changeResourceTitle: null,
    changeResourceProps: null,
    registerLineSetter: null,
    refreshTab: null,
    closeTab: null,
    updatePanel: null
};


if (!window.in_context) {
    tile_creator_main();
}
