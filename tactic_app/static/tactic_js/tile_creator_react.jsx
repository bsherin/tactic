import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/tile_creator.scss";
//comment
import React from "react";
import {Fragment, useState, useEffect, useRef, memo, useMemo, useContext} from "react";
import {createRoot} from 'react-dom/client';

import {Tab, Tabs, Button, ButtonGroup, Icon} from "@blueprintjs/core";
import {useHotkeys} from "@blueprintjs/core";

import { EditorView } from "@codemirror/view";
import { EditorSelection } from "@codemirror/state";

import {creator_props} from "./tile_creator_support";
import {TacticMenubar} from "./menu_utilities"
import {sendToRepository} from "./resource_viewer_react_app";
import {ReactCodemirror6} from "./react-codemirror6";
import {OptionModule, ExportModule, MetadataModule} from "./creator_modules_react";
import {HorizontalPanes, VerticalPanes} from "./resizing_layouts2";
import {postAjax, postAjaxPromise, postPromise} from "./communication_react"
import {withStatus, doFlash, StatusContext} from "./toaster"
import {withAssistant} from "./assistant";
import {SIDE_MARGIN, SizeContext, useSize, withSizeContext} from "./sizing_tools";
import {withErrorDrawer} from "./error_drawer";
import {renderSpinnerMessage, guid, arrayMove, convertExtraKeys} from "./utilities_react"
import {TacticNavbar} from "./blueprint_navbar";
import {ErrorBoundary} from "./error_boundary";
import {useCallbackStack, useStateAndRef, useConnection} from "./utilities_react";
import {SettingsContext, withSettings} from "./settings";
import {DialogContext, withDialogs} from "./modal_react";
import {ErrorDrawerContext} from "./error_drawer";
import {SelectedPaneContext, useReducerAndRef} from "./utilities_react";

export {CreatorApp}

const BOTTOM_MARGIN = 50;
const MARGIN_SIZE = 17;

function optionListReducer(option_list, action) {
    var new_items;
    switch (action.type) {
        case "initialize":
            new_items = action.new_items.map(t => {
                let new_t = {...t};
                new_t.option_id = guid();
                return new_t
            });
            break;
        case "delete_item":
            new_items = option_list.filter(t => t.option_id !== action.option_id);
            break;
        case "update_item":
            const option_id = action.new_item.option_id;
            new_items = option_list.map(t => {
                if (t.option_id == option_id) {
                    const update_dict = action.new_item;
                    return {...t, ...update_dict};
                } else {
                    return t;
                }
            });
            break;
        case "move_item":
            let old_list = [...option_list];
            new_items = arrayMove(old_list, action.oldIndex, action.newIndex);
            break;
        case "add_at_index":
            new_items = [...option_list];
            let new_t = {...action.new_item};
            new_t.option_id = guid();
            new_items.splice(action.insert_index, 0, new_t);
            break;
        case "clear_highlights":
            new_items = option_list.map(t => {
                return {...t, className: ""}
            });
            break;
        default:
            console.log("Got Unknown action: " + action.type);
            return [...option_list]
    }
    return new_items;
}

function CreatorApp(props) {
    props = {
        controlled: false,
        changeResourceName: null,
        changeResourceTitle: null,
        changeResourceProps: null,
        registerLineSetter: null,
        refreshTab: null,
        closeTab: null,
        updatePanel: null,
        ...props
    };
    const top_ref = useRef(null);
    const rc_span_ref = useRef(null);
    const vp_ref = useRef(null);

    const methods_ref = useRef(null);
    const commands_ref = useRef(null);
    const search_ref = useRef(null);
    const globals_ref = useRef(null);
    const last_save = useRef({});
    const dpObject = useRef(null);
    const rcObject = useRef(null);
    const emObject = useRef(null);
    const globalObject = useRef(null);
    const rline_number = useRef(props.initial_line_number);
    const cm_list = useRef(props.is_mpl || props.is_d3 ? ["tc", "rc", "em", "gp"] : ["rc", "em", "gp"]);
    const search_match_numbers = useRef({
        tc: 0,
        rc: 0,
        em: 0,
        gp: 0
    });

    const [usable_width, usable_height, topX, topY] = useSize(top_ref, 0, "TileCreator");

    const [tabSelectCounter, setTabSelectCounter] = useState(0);

    // This hasActivated machinery is necessary because cleanup of codemirror areas doesn't work
    // properly if the component is unmounted before the codemirror area is activated.
    const [methodsHasActivated, setMethodsHasActivated] = useState(false);
    const [globalsHasActivated, setGlobalsHasActivated] = useState(false);

    const [foregrounded_panes, set_foregrounded_panes] = useState({
        "metadata": true,
        "options": false,
        "exports": false,
        "methods": false,
    });
    const [search_string, set_search_string] = useState("");
    const [current_search_number, set_current_search_number, current_search_number_ref] = useStateAndRef(null);
    const [current_search_cm, set_current_search_cm, current_search_cm_ref] = useStateAndRef(cm_list.current[0]);
    const [regex, set_regex] = useState(false);
    const [search_matches, set_search_matches, search_matches_ref] = useStateAndRef(null);

    const [render_content_code, set_render_content_code, render_content_code_ref] = useStateAndRef(props.render_content_code);
    const [draw_plot_code, set_draw_plot_code, draw_plot_code_ref] = useStateAndRef(props.draw_plot_code);
    const [jscript_code, set_jscript_code, jscript_code_ref] = useStateAndRef(props.jscript_code);
    const [extra_functions, set_extra_functions, extra_functions_ref] = useStateAndRef(props.extra_functions);
    const [globals_code, set_globals_code, globals_code_ref] = useStateAndRef(props.globals_code);
    const [option_list, optionDispatch, option_list_ref] = useReducerAndRef(optionListReducer, []);
    const [export_list, set_export_list, export_list_ref] = useStateAndRef(props.export_list);

    const [render_content_line_number, set_render_content_line_number, render_content_line_number_ref] = useStateAndRef(props.render_content_line_number);
    const [draw_plot_line_number, set_draw_plot_line_number, draw_plot_line_number_ref] = useStateAndRef(props.draw_plot_line_number);
    const [extra_methods_line_number, set_extra_methods_line_number, extra_methods_line_number_ref] = useStateAndRef(props.extra_methods_line_number);

    const [category, set_category, category_ref] = useStateAndRef(props.category);

    const [additional_save_attrs, set_additional_save_attrs, additional_save_attrs_ref] = useStateAndRef(props.additional_save_attrs || []);
    const [couple_save_attrs_and_exports, set_couple_save_attrs_and_exports, couple_save_attrs_and_exports_ref] = useStateAndRef(props.couple_save_attrs_and_exports);

    const [selectedTabId, setSelectedTabId] = useState("metadata");
    const [top_pane_fraction, set_top_pane_fraction] = useState(props.is_mpl || props.is_d3 ? .5 : 1);
    const [left_pane_fraction, set_left_pane_fraction] = useState(.5);
    const [has_key, set_has_key] = useState(false);

    const extraSelfCompletionsRef = useRef([]);

    const settingsContext = useContext(SettingsContext);
    const dialogFuncs = useContext(DialogContext);
    const statusFuncs = useContext(StatusContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);
    const sizeInfo = useContext(SizeContext);

    const selectedPane = useContext(SelectedPaneContext);

    const hotkeys = useMemo(
        () => [
            {
                combo: "Ctrl+S",
                global: false,
                group: "Tile Creator",
                label: "Save Code",
                onKeyDown: _saveMe
            },
            {
                combo: "Ctrl+L",
                global: false,
                group: "Tile Creator",
                label: "Save And Load",
                onKeyDown: _saveAndLoadModule
            },
            {
                combo: "Ctrl+M",
                global: false,
                group: "Tile Creator",
                label: "Save and Checkpoint",
                onKeyDown: _saveAndCheckpoint
            },
        ], [_saveMe, _saveAndLoadModule, _saveAndCheckpoint]
    );
    const {handleKeyDown, handleKeyUp} = useHotkeys(hotkeys);

    const pushCallback = useCallbackStack();

    const [resource_name, set_resource_name] = useState(props.resource_name);

    const connection_status = useConnection(props.tsocket, initSocket);

    useEffect(() => {
        let data_dict = {pane_type: "tile", is_repository: false, show_hidden: true};
        let data;
        optionDispatch({type: "initialize", new_items: props.option_list});
        postPromise(props.module_viewer_id, "has_openai_key", {})
            .then((data) => {
                if (data.has_key) {
                    set_has_key(true)
                } else {
                    set_has_key(false)
                }
            })
            .catch((e) => {
                set_has_key(false)
            });
    }, []);

    useEffect(() => {
        if (props.controlled) {
            props.registerDirtyMethod(_dirty);
            props.registerLineSetter(_selectLineNumber);
        } else {
            window.addEventListener("beforeunload", function (e) {
                if (_dirty()) {
                    e.preventDefault();
                    e.returnValue = ''
                }
            });
            document.title = resource_name;
        }
        _goToLineNumber();
        _update_saved_state();
        errorDrawerFuncs.setGoToLineNumber(_selectLineNumber);

        function sendRemove() {
            navigator.sendBeacon("/delete_container_on_unload",
                JSON.stringify({"container_id": props.module_viewer_id, "notify": false}));
        }

        window.addEventListener("unload", sendRemove);
        statusFuncs.stopSpinner();
        return (() => {
            dpObject.current = null;
            rcObject.current = null;
            emObject.current = null;
            globalObject.current = null;
            delete_my_container();
            window.removeEventListener("unload", sendRemove);
            errorDrawerFuncs.setGoToLineNumber(null);
        })
    }, []);

    useEffect(() => {
        _goToLineNumber();
    });

    useEffect(() => {
        function _getOptionNames() {
            let onames = [];
            for (let entry of option_list_ref.current) {
                onames.push(entry.name)
            }
            return onames
        }

        extraSelfCompletionsRef.current = [];
        for (let oname of _getOptionNames()) {
            let the_text = "" + oname;
            extraSelfCompletionsRef.current.push({label: the_text, type: "variable"});
        }
        }, [option_list_ref.current]);

    function initSocket() {
        props.tsocket.attachListener('focus-me', (data) => {
            window.focus();
            _selectLineNumber(data.line_number)
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
            resource_name: resource_name
        }
    }

    function _cProp(pname) {
        return props.controlled ? props[pname] : cPropGetters()[pname]
    }

    function menu_specs() {
        let ms = {
            Save: [{name_text: "Save", icon_name: "saved", click_handler: _saveMe, key_bindings: ['Ctrl+S']},
                {name_text: "Save As...", icon_name: "floppy-disk", click_handler: _saveModuleAs},
                {
                    name_text: "Save and Checkpoint",
                    icon_name: "map-marker",
                    click_handler: _saveAndCheckpoint,
                    key_bindings: ['Ctrl+M']
                }],
            Load: [{
                name_text: "Save and Load",
                icon_name: "upload",
                click_handler: _saveAndLoadModule,
                key_bindings: ['Ctrl+L']
            },
                {name_text: "Load", icon_name: "upload", click_handler: _loadModule}],
            Compare: [{name_text: "View History", icon_name: "history", click_handler: _showHistoryViewer},
                {name_text: "Compare to Other Modules", icon_name: "comparison", click_handler: _showTileDiffer}],
            Transfer: [
                {
                    name_text: "Share", icon_name: "share",
                    click_handler: async () => {
                        await sendToRepository("tile", _cProp("resource_name"), dialogFuncs, statusFuncs, errorDrawerFuncs)
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
        const ekeys = {
            'Ctrl-s': _saveMe,
            'Ctrl-l': _saveAndLoadModule,
            'Ctrl-m': _saveAndCheckpoint,
            'Ctrl-f': () => {
                search_ref.current.focus()
            },
            'Cmd-f': () => {
                search_ref.current.focus()
            }

        };
        let convertedKeys = convertExtraKeys(ekeys);
        let moreKeys = [
            {key: 'Ctrl-g', run: () => {
                _searchNext();
            }, preventDefault: true},
            {key: 'Cmd-g', run: () => {
                _searchNext();
            }, preventDefault: true},
           {key: 'Ctrl-Shift-g', run: () => {
                _searchPrev();
            }, preventDefault: true},
            {key: 'Cmd-Shift-g', run: () => {
                _searchPrev();
            }, preventDefault: true}
        ];
        return [...convertedKeys, ...moreKeys]
    }

    function _searchNext() {
        if (current_search_number_ref.current >= search_match_numbers.current[current_search_cm] - 1) {
            let next_cm;
            switch (current_search_cm_ref.current) {
                case "rc":
                    next_cm = "em";
                    break;
                case "tc":
                    next_cm = "rc";
                    break;
                case "em":
                    next_cm = "gp";
                    break;
                default:
                    if (props.is_mpl || props.is_d3) {
                        next_cm = "tc"
                    } else {
                        next_cm = "rc"
                    }
                    break
            }
            if (next_cm == "em") {
                _handleTabSelect("methods");
            } else if (next_cm == "gp") {
                _handleTabSelect("globals");
            }
            set_current_search_cm(next_cm);
            set_current_search_number(0);
        } else {
            set_current_search_number(current_search_number_ref.current + 1);
        }
    }

    function _searchPrev() {
        let next_cm;
        let next_search_number;
        if (current_search_number_ref.current <= 0) {
            if (current_search_cm_ref.current == "em") {
                next_cm = "rc";
                next_search_number = search_match_numbers.current["rc"] - 1
            } else if (current_search_cm_ref.current == "tc") {
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
            if (next_search_number < 0) {
                next_search_number = 0
            }
            set_current_search_number(next_search_number);
        } else {
            set_current_search_number(current_search_number_ref.current - 1);
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
        const currentTab = selectedTabId;
        if (!methodsHasActivated) {
            _handleTabSelect("methods");
        }
        if (!globalsHasActivated) {
            _handleTabSelect("globals");
        }
        _handleTabSelect(currentTab);
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

    function _showHistoryViewer() {
        window.open(`${$SCRIPT_ROOT}/show_history_viewer/${_cProp("resource_name")}`)
    }

    function _showTileDiffer() {
        window.open(`${$SCRIPT_ROOT}/show_tile_differ/${_cProp("resource_name")}`)
    }

    function _selectLineNumber(lnumber) {
        rline_number.current = lnumber;
        _goToLineNumber()
    }

    function _logErrorStopSpinner(title, data) {
        statusFuncs.stopSpinner();
        let entry = {title: title, content: data.message, tile_type: resource_name};
        if ("line_number" in data) {
            entry.line_number = data.line_number
        }
        errorDrawerFuncs.addErrorDrawerEntry(entry, true);
        errorDrawerFuncs.openErrorDrawer();
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

    async function _saveAndLoadModule() {
        if (!am_selected()) {
            return false
        }
        statusFuncs.startSpinner();
        let data;
        try {
            await doSavePromise();
            statusFuncs.statusMessage("Loading Module");
            await postPromise(
                "host", "load_tile_module_task",
                {"tile_module_name": _cProp("resource_name"), "user_id": window.user_id},
                props.module_viewer_id);
            statusFuncs.statusMessage("Loaded successfully");
            statusFuncs.stopSpinner()
        } catch (e) {
            _logErrorStopSpinner("Error saving and loading module", e)
        }
    }

    async function _loadModule() {
        if (!am_selected()) {
            return false
        }
        statusFuncs.startSpinner();
        statusFuncs.statusMessage("Loading module...");
        try {
            await postPromise(
                "host", "load_tile_module_task",
                {"tile_module_name": _cProp("resource_name"), "user_id": window.user_id},
                props.module_viewer_id);
            statusFuncs.statusMessage("Loaded successfully");
            statusFuncs.stopSpinner()
        } catch (e) {
            _logErrorStopSpinner("Error saving and loading module", e)
        }
    }

    async function _saveModuleAs() {
        statusFuncs.startSpinner();
        let data;
        try {
            data = await postPromise("host", "get_tile_names", {"user_id": window.user_id}, props.main_id);
            dialogFuncs.showModal("ModalDialog", {
                title: "Save Module As",
                field_title: "New Module Name",
                handleSubmit: CreateNewModule,
                default_value: "NewModule",
                existing_names: data.tile_names,
                checkboxes: [],
                handleCancel: doCancel,
                handleClose: dialogFuncs.hideModal
            })
        } catch (e) {
            _logErrorStopSpinner("Error saving module", e)
        }

        function doCancel() {
            statusFuncs.stopSpinner()
        }

        async function CreateNewModule(new_name) {
            const result_dict = {
                "new_res_name": new_name,
                "res_to_copy": _cProp("resource_name")
            };
            try {
                data = await postAjaxPromise('/create_duplicate_tile', result_dict);
                _setResourceNameState(new_name, () => {
                    _saveMe()
                })
            } catch (e) {
                _logErrorStopSpinner("Error saving module", e)
            }
        }
    }

    function am_selected() {
        return selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef)
    }

    async function _saveMe() {
        if (!am_selected()) {
            return false
        }
        statusFuncs.startSpinner();
        statusFuncs.statusMessage("Saving module...");
        try {
            await doSavePromise();
            statusFuncs.statusMessage("Saved module");
            statusFuncs.stopSpinner()
        } catch (e) {
            _logErrorStopSpinner("Error saving module", e)
        }
        return false
    }

    async function _saveAndCheckpoint() {
        if (!am_selected()) {
            return false
        }
        statusFuncs.startSpinner();
        statusFuncs.statusMessage("Checkpointing");
        let data;
        try {
            await doSavePromise();
            await doCheckpointPromise();
            statusFuncs.statusMessage("Saved and checkpointed");
            statusFuncs.stopSpinner()
        } catch (e) {
            _logErrorStopSpinner("Error in save and checkpoint", e)
        }
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
            "exports": export_list_ref.current,
            "additional_save_attrs": additional_save_attrs_ref.current,
            "couple_save_attrs_and_exports": couple_save_attrs_and_exports_ref.current,
            "options": option_list_ref.current,
            "extra_methods": extra_functions_ref.current,
            "globals_code": globals_code_ref.current,
            "render_content_body": render_content_code_ref.current,
            "is_mpl": props.is_mpl,
            "is_d3": props.is_d3,
            "draw_plot_body": draw_plot_code_ref.current,
            "jscript_body": jscript_code_ref.current,
            "last_saved": "creator"
        };
    }

    function doSavePromise() {
        return new Promise(async (resolve, reject) => {
            let result_dict = _getSaveDict();
            let data;
            try {
                data = await postPromise(props.module_viewer_id, "update_module", result_dict, props.module_viewer_id);
                save_success(data);
                resolve(data)
            } catch (e) {
                reject(e)
            }
        })
    }

    function doCheckpointPromise() {
        return postAjaxPromise("checkpoint_module", {"module_name": _cProp("resource_name")});
    }

    function save_success(data) {
        set_render_content_line_number(data.render_content_line_number);
        set_extra_methods_line_number(data.extra_methods_line_number);
        set_draw_plot_line_number(data.draw_plot_line_number);
        _update_saved_state();
    }

    function _update_saved_state() {
        last_save.current = _getSaveDict();
    }

    function _selectLine(cm, lnumber) {
        try {
            const line = cm.state.doc.line(lnumber + 1);
            cm.dispatch({
                selection: EditorSelection.single(line.from, line.to),
                effects: EditorView.scrollIntoView(line.from, {
                    y: "center"  // Center the line in the view
                })
            });
        }
        catch(e) {
            console.log("Error in selectLine", e)
        }

    }

    function _goToLineNumber() {
        if (rline_number.current) {
            errorDrawerFuncs.closeErrorDrawer();
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
                if (rline_number.current < props.render_content_line_number) {
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
        if (newTabId == "methods" && !methodsHasActivated) {
            setMethodsHasActivated(true)
        }
        if (newTabId == "globals" && !globalsHasActivated) {
            setGlobalsHasActivated(true)
        }
        set_foregrounded_panes(new_fg);
        pushCallback(() => {
            setTabSelectCounter(tabSelectCounter + 1);
        })
    }

    function _appendOptionText(appendToNotes) {
        let res_string = "\n\noptions: \n\n";
        for (let opt of option_list_ref.current) {
            res_string += ` * \`${opt.name}\` (${opt.type}): \n`
        }
        appendToNotes(res_string);
    }

    function _appendExportText(appendToNotes) {
        let res_string = "\n\nexports: \n\n";
        for (let exp of export_list_ref.current) {
            res_string += ` * \`${exp.name}\` : \n`
        }
        appendToNotes(res_string);
    }

    function MetadataNotesButtons(props) {
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
                            _appendOptionText(props.appendToNotes)
                        }}/>
                <Button style={{height: "fit-content", alignSelf: "start", marginTop: 10, fontSize: 12}}
                        text="Add Exports"
                        small={true}
                        minimal={true}
                        intent="primary"
                        icon="export"
                        onClick={e => {
                            e.preventDefault();
                            _appendExportText(props.appendToNotes)
                        }}/>
            </ButtonGroup>
        )
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

    function handleMethodsChange(new_methods) {
        set_extra_functions(new_methods)
    }

    function handleGlobalsChange(new_globals) {
        set_globals_code(new_globals)
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

    function _setGlobalObject(cmobject) {
        globalObject.current = cmobject
    }

    function _setSearchMatches(rc_name, num) {
        search_match_numbers.current[rc_name] = num;
        let current_matches = 0;
        for (let cname in search_match_numbers.current) {
            current_matches += search_match_numbers.current[cname]

        }
        set_search_matches(current_matches)
    }

    let my_props = {...props};
    if (!props.controlled) {
        my_props.resource_name = resource_name;
    }

    let ch_style = {"width": "100%"};
    let tc_item;
    if (my_props.is_mpl || my_props.is_d3) {
        let mode = my_props.is_mpl ? "python" : "javascript";
        let code_content = my_props.is_mpl ? draw_plot_code_ref.current : jscript_code_ref.current;
        let first_line_number = my_props.is_mpl ? draw_plot_line_number_ref.current + 1 : 1;
        let title_label = my_props.is_mpl ? "draw_plot" : "(selector, w, h, arg_dict, resizing) =>";
        tc_item = (
            <ReactCodemirror6 code_content={code_content}
                              title_label={title_label}
                              show_search={true}
                              mode={mode}
                              extraKeys={_extraKeys()}
                              current_search_number={current_search_cm == "tc" ? current_search_number : null}
                              handleChange={handleTopCodeChange}
                              saveMe={_saveAndCheckpoint}
                              setCMObject={_setDpObject}
                              search_term={search_string}
                              updateSearchState={_updateSearchState}
                              alt_clear_selections={_clearAllSelections}
                              first_line_number={first_line_number}
                              readOnly={props.read_only}
                              regex_search={regex}
                              search_ref={search_ref}
                              searchPrev={_searchPrev}
                              searchNext={_searchNext}
                              search_matches={search_matches}
                              setSearchMatches={(num) => _setSearchMatches("tc", num)}
                              tsocket={props.tsocket}
                              extraSelfCompletions={mode == "python" ? extraSelfCompletionsRef.current : []}
                              highlight_active_line={true}/>

        )
    }
    let bc_item = (
        <div key="rccode" id="rccode" style={ch_style} className="d-flex flex-column align-items-baseline code-holder">

            <ReactCodemirror6 code_content={render_content_code_ref.current}
                              title_label="render_content"
                              show_search={!(my_props.is_mpl || my_props.is_d3)}
                              updateSearchState={_updateSearchState}
                              current_search_number={current_search_cm == "rc" ? current_search_number : null}
                              handleChange={handleRenderContentChange}
                              extraKeys={_extraKeys()}
                              saveMe={_saveAndCheckpoint}
                              setCMObject={_setRcObject}
                              search_term={search_string}
                              update_search_state={_updateSearchState}
                              alt_clear_selections={_clearAllSelections}
                              first_line_number={render_content_line_number_ref.current + 1}
                              readOnly={props.read_only}
                              regex_search={regex}
                              search_ref={search_ref}
                              searchPrev={_searchPrev}
                              searchNext={_searchNext}
                              search_matches={search_matches}
                              setSearchMatches={(num) => _setSearchMatches("rc", num)}
                              tsocket={props.tsocket}
                              extraSelfCompletions={extraSelfCompletionsRef.current }
                              highlight_active_line={true}
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

    let mdata_panel = (
        <MetadataModule expandWidth={false}
                        notes_buttons={MetadataNotesButtons}
                        tsocket={props.tsocket}
                        readOnly={props.readOnly}
                        res_name={_cProp("resource_name")}
                        res_type="tile"
                        tabSelectCounter={tabSelectCounter}
        />
    );

    let option_panel = (
        <OptionModule data_list_ref={option_list_ref}
                      foregrounded={foregrounded_panes["options"]}
                      optionDispatch={optionDispatch}
                      tabSelectCounter={tabSelectCounter}
        />
    );
    let export_panel = (
        <ExportModule export_list={export_list_ref.current}
                      save_list={additional_save_attrs_ref.current}
                      couple_save_attrs_and_exports={couple_save_attrs_and_exports_ref.current}
                      foregrounded={foregrounded_panes["exports"]}
                      handleChange={handleExportsStateChange}
                      tabSelectCounter={tabSelectCounter}
        />
    );
    let methods_panel = (
        <div style={{marginLeft: 10}}>
            {methodsHasActivated &&
                <ReactCodemirror6 handleChange={handleMethodsChange}
                                  show_fold_button={true}
                                  current_search_number={current_search_cm == "em" ? current_search_number : null}
                                  extraKeys={_extraKeys()}
                                  readOnly={props.readOnly}
                                  code_content={extra_functions_ref.current}
                                  saveMe={_saveAndCheckpoint}
                                  setCMObject={_setEmObject}
                                  code_container_ref={methods_ref}
                                  search_term={search_string}
                                  update_search_state={_updateSearchState}
                                  alt_clear_selections={_clearAllSelections}
                                  regex_search={regex}
                                  first_line_number={extra_methods_line_number_ref.current}
                                  setSearchMatches={(num) => _setSearchMatches("em", num)}
                                  tsocket={props.tsocket}
                                  highlight_active_line={true}
                                  extraSelfCompletions={extraSelfCompletionsRef.current}
                                  iCounter={tabSelectCounter}
                />
            }
        </div>

    );
    let globals_panel = (
        <div style={{marginLeft: 10}}>
            {globalsHasActivated &&
                <ReactCodemirror6 handleChange={handleGlobalsChange}
                                  show_fold_button={true}
                                  current_search_number={current_search_cm == "gp" ? current_search_number : null}
                                  extraKeys={_extraKeys()}
                                  readOnly={props.readOnly}
                                  code_content={globals_code_ref.current}
                                  saveMe={_saveAndCheckpoint}
                                  setCMObject={_setGlobalObject}
                                  code_container_ref={globals_ref}
                                  search_term={search_string}
                                  update_search_state={_updateSearchState}
                                  alt_clear_selections={_clearAllSelections}
                                  regex_search={regex}
                                  first_line_number={1}
                                  setSearchMatches={(num) => _setSearchMatches("gp", num)}
                                  tsocket={props.tsocket}
                                  highlight_active_line={true}
                                  iCounter={tabSelectCounter}
                />
            }
        </div>

    );
    // let commands_panel = (
    //     <CommandsModule foregrounded={foregrounded_panes["commands"]}
    //                     tabSelectCounter={tabSelectCounter}
    //     />
    // );
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
                    <Tab id="globals" title={<span><Icon size={12} icon="code"/> globals</span>} panel={globals_panel}/>
                </Tabs>
            </div>
        </Fragment>
    );
    let outer_style = {
        width: "100%",
        height: sizeInfo.availableHeight,
        paddingLeft: props.controlled ? 5 : SIDE_MARGIN,
        paddingTop: 15
    };
    let outer_class = "resource-viewer-holder pane-holder";
    if (!window.in_context) {
        if (settingsContext.isDark()) {
            outer_class = outer_class + " bp5-dark";
        } else {
            outer_class = outer_class + " light-theme"
        }
    }

    let uwidth = usable_width - 2 * SIDE_MARGIN;
    return (
        <ErrorBoundary>
            {!window.in_context &&
                <TacticNavbar is_authenticated={window.is_authenticated}
                              selected={null}
                              show_api_links={true}
                              page_id={props.module_viewer_id}
                              user_name={window.username}/>
            }
            <TacticMenubar menu_specs={menu_specs()}
                           connection_status={connection_status}
                           showRefresh={window.in_context}
                           showClose={window.in_context}
                           refreshTab={props.refreshTab}
                           closeTab={props.closeTab}
                           resource_name={_cProp("resource_name")}
                           showIconBar={true}
                           showErrorDrawerButton={true}
                           showMetadataDrawerButton={false}
                           showAssistantDrawerButton={true}
                           showSettingsDrawerButton={true}
                           controlled={props.controlled}
            />
            <ErrorBoundary>
                <div className={outer_class} ref={top_ref} style={outer_style}
                     tabIndex="0" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
                    <SizeContext.Provider value={{
                        availableWidth: uwidth,
                        availableHeight: usable_height,
                        topX: topX,
                        topY: topY
                    }}>
                        <HorizontalPanes left_pane={left_pane}
                                         right_pane={right_pane}
                                         show_handle={true}
                                         initial_width_fraction={.5}
                                         handleSplitUpdate={null}
                                         bottom_margin={BOTTOM_MARGIN}
                                         right_margin={SIDE_MARGIN}
                        />
                    </SizeContext.Provider>
                </div>
            </ErrorBoundary>
        </ErrorBoundary>
    );
}

CreatorApp = memo(CreatorApp);

function tile_creator_main() {
    function gotProps(the_props) {
        let CreatorAppPlus = withSizeContext(withSettings(withDialogs(withErrorDrawer(withStatus(withAssistant(CreatorApp))))));
        let the_element = <CreatorAppPlus {...the_props}
                                          controlled={false}
                                          changeName={null}
        />;
        const domContainer = document.querySelector('#creator-root');
        const root = createRoot(domContainer);
        root.render(
            //<HotkeysProvider>
            the_element
            //</HotkeysProvider>
        )
    }

    renderSpinnerMessage("Starting up ...", '#creator-root');
    postAjaxPromise("view_in_creator_in_context", {"resource_name": window.module_name})
        .then((data) => {
            creator_props(data, null, gotProps, null)
        })
}

if (!window.in_context) {
    tile_creator_main();
}
