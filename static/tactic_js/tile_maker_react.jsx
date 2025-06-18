import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/tile_creator.scss";

import React from "react";
import {Fragment, useState, useEffect, useRef, memo, useMemo, useContext, createContext} from "react";
import {createRoot} from 'react-dom/client';

import {Button, ButtonGroup} from "@blueprintjs/core";
import {useHotkeys} from "@blueprintjs/core";

import {EditorView} from "@codemirror/view";
import {EditorSelection} from "@codemirror/state";

import {creator_props} from "./tile_creator_support";
import {TacticMenubar} from "./menu_utilities"
import {sendToRepository} from "./resource_viewer_react_app";
import {OptionModule, ExportModule, MetadataModule} from "./creator_modules_react";
import {HorizontalPanes} from "./resizing_layouts2";
import {postAjax, postAjaxPromise, postPromise} from "./communication_react"
import {withStatus, doFlash, StatusContext} from "./toaster"
import {withAssistant} from "./assistant";
import {SIDE_MARGIN, SizeContext, useSize, withSizeContext} from "./sizing_tools";
import {withErrorDrawer} from "./error_drawer";
import {renderSpinnerMessage, convertExtraKeys} from "./utilities_react"
import {TacticNavbar} from "./blueprint_navbar";
import {ErrorBoundary} from "./error_boundary";
import {useCallbackStack, useStateAndRef, useConnection} from "./utilities_react";
import {SettingsContext, withSettings} from "./settings";
import {DialogContext, withDialogs} from "./modal_react";
import {ErrorDrawerContext} from "./error_drawer";
import {SelectedPaneContext, useReducerAndRef} from "./utilities_react";

import {useCmData, optionListReducer, useSearch, userMethodsReducer, MakerPaneContext} from "./tile_maker_support";
import {CmElement, MakerNavigator} from "./tile_maker_elements";

export {CreatorApp}

const BOTTOM_MARGIN = 50;


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
    const nav_ref = useRef(null);
    const search_ref = useRef(null);

    const [visibleTab, setVisibleTab] = useState("metadata");

    const [globalsState, globalsDispatch, , globalsCmObjectRef] = useCmData(props.globals_code, 1, false, null, null);
    const [rcState, rcDispatch, , rcCmObjectRef] = useCmData(props.render_content_code,
        props.render_content_line_number, false, "render_content", "", false);
    const [dpState, dpDispatch, , dpCmObjectRef] = useCmData(
        props.is_mpl ? props.draw_plot_code : null,
        props.is_mpl ? props.draw_plot_line_number + 1 : 1,
        false, "draw_plot", "", false);
    const [jsState, jsDispatch, , jsCmObjectRef] = useCmData(props.is_d3 ? props.jscript_code : null, 1, false, null, null, false, "javascript");

    const [, umDispatch, umListRef] = useReducerAndRef(userMethodsReducer, []);

    const [searchState, searchDispatch, searchStateRef] = useSearch(props.is_mpl, props.is_d3);


    const last_save = useRef({});
    const rline_number = useRef(props.initial_line_number);

    const [usable_width, usable_height, topX, topY] = useSize(top_ref, 0, "TileMaker");

    const [, optionDispatch, option_list_ref] = useReducerAndRef(optionListReducer, []);
    const [, set_export_list, export_list_ref] = useStateAndRef(props.export_list);
    const [, set_additional_save_attrs, additional_save_attrs_ref] = useStateAndRef(props.additional_save_attrs || []);
    const [, set_couple_save_attrs_and_exports, couple_save_attrs_and_exports_ref] = useStateAndRef(props.couple_save_attrs_and_exports);

    const extraSelfCompletionsRef = useRef([]);

    const settingsContext = useContext(SettingsContext);
    const dialogFuncs = useContext(DialogContext);
    const statusFuncs = useContext(StatusContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);
    const sizeInfo = useContext(SizeContext);

    const selectedPane = useContext(SelectedPaneContext);

    const [foregrounded_panes, set_foregrounded_panes] = useState({
            "metadata": true,
            "options": false,
            "exports": false,
    });

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
        optionDispatch({type: "initialize", new_items: props.option_list});
        umDispatch({type: "initialize", new_items: props.user_methods_list});
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
            globalsCmObjectRef.current = null;
            rcCmObjectRef.current = null;
            dpCmObjectRef.current = null;
            jsCmObjectRef.current = null;
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
            extraSelfCompletionsRef.current.push({label: the_text, type: "variable", section: "Options"});
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
            {
                key: 'Ctrl-g', run: () => {
                    _searchNext();
                }, preventDefault: true
            },
            {
                key: 'Cmd-g', run: () => {
                    _searchNext();
                }, preventDefault: true
            },
            {
                key: 'Ctrl-Shift-g', run: () => {
                    _searchPrev();
                }, preventDefault: true
            },
            {
                key: 'Cmd-Shift-g', run: () => {
                    _searchPrev();
                }, preventDefault: true
            }
        ];
        return [...convertedKeys, ...moreKeys]
    }

    function _searchNext() {
        searchDispatch({type: "SEARCH_NEXT"});
        pushCallback(() => {
            _handleTabSelect(searchStateRef.current.current_search_cm);
        })
    }

    function _searchPrev() {
        searchDispatch({type: "SEARCH_PREVIOUS"});
        pushCallback(() => {
            _handleTabSelect(searchStateRef.current.current_search_cm);
        })
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

    function _getSaveDict() {
        return {
            "module_name": _cProp("resource_name"),
            "exports": export_list_ref.current,
            "additional_save_attrs": additional_save_attrs_ref.current,
            "couple_save_attrs_and_exports": couple_save_attrs_and_exports_ref.current,
            "options": option_list_ref.current,
            //"extra_methods": umState.codeText,
            "globals_code": globalsState.codeText,
            "render_content_body": rcState.codeText,
            "is_mpl": props.is_mpl,
            "is_d3": props.is_d3,
            "draw_plot_body": dpState.codeText,
            "jscript_body": jsState.codeText,
            "last_saved": "maker"
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
        rcDispatch({type: "SET_FIRST_LINE_NUMBER", payload: data.render_content_line_number});
        umDispatch({type: "SET_FIRST_LINE_NUMBER", payload: data.extra_methods_line_number});
        if (props.is_mpl) {
            dpDispatch({type: "SET_FIRST_LINE_NUMBER", payload: data.draw_plot_line_number + 1});
        }
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
        } catch (e) {
            console.log("Error in selectLine", e)
        }

    }

    function _gotoUserMethodLineNumber(rline_numaber) {

    }

    function _goToLineNumber() {
        if (rline_number.current) {
            errorDrawerFuncs.closeErrorDrawer();
            if (props.is_mpl || props.is_d3) {
                if (rline_number.current < dpState.firstLineNumber) {
                    //if (umCmObjectRef.current) {
                        // _handleTabSelect("methods");
                        // _selectLine(umCmObjectRef.current, rline_number.current - umState.firstLineNumber);
                        _gotoUserMethodLineNumber(rline_number.current);
                        rline_number.current = null

                } else if (rline_number.current < rcState.firstLineNumber) {
                    if (dpCmObjectRef.current) {
                        _selectLine(dpCmObjectRef.current, rline_number.current - dpState.firstLineNumber - 1);
                        rline_number.current = null
                    }
                } else if (rcCmObjectRef.current) {
                    _selectLine(rcCmObjectRef.current, rline_number.current - rcState.firstLineNumber - 1);
                    rline_number.current = null
                }
            } else {
                if (rline_number.current < props.render_content_line_number) {
                    //if (umCmObjectRef.current) {
                    //     _handleTabSelect("methods");
                    //     _selectLine(umCmObjectRef.current, rline_number.current - umState.firstLineNumber);
                        _gotoUserMethodLineNumber(rline_number.current);
                        rline_number.current = null
                    //}
                } else {
                    if (rcCmObjectRef.current) {
                        _selectLine(rcCmObjectRef.current, rline_number.current - rcState.firstLineNumber - 1);
                        rline_number.current = null
                    }
                }
            }
        }
    }


    function delete_my_container() {
        postAjax("/delete_container_on_unload", {"container_id": props.module_viewer_id, "notify": false});
    }

    function _handleTabSelect(newTabIdentifier) {
        if (newTabIdentifier in foregrounded_panes) {
            let new_fg = Object.assign({}, foregrounded_panes);
            new_fg[newTabIdentifier] = true;
            set_foregrounded_panes(new_fg);
        }
        else {
            switch (newTabIdentifier) {
                case "user_methods":
                    umDispatch({type: "SET_HAS_ACTIVATED", payload: true});
                    break;
                case "globals":
                    globalsDispatch({type: "SET_HAS_ACTIVATED", payload: true});
                    break;
                case "render_content":
                    rcDispatch({type: "SET_HAS_ACTIVATED", payload: true});
                    break;
                case "draw_plot":
                    dpDispatch({type: "SET_HAS_ACTIVATED", payload: true});
                    break;
                case "javascript":
                    jsDispatch({type: "SET_HAS_ACTIVATED", payload: true});
                    break;
            }
        }
        // let new_fg = Object.assign({}, foregrounded_panes);
        // new_fg[newTabId] = true;
        // setSelectedTabId(newTabId);
        // if (newTabId == "methods" && !methodsHasActivated) {
        //     setMethodsHasActivated(true)
        // }
        // if (newTabId == "globals" && !globalsHasActivated) {
        //     setGlobalsHasActivated(true)
        // }
        // set_foregrounded_panes(new_fg);
        // pushCallback(() => {
        //     setTabSelectCounter(tabSelectCounter + 1);
        // })
        setVisibleTab(newTabIdentifier)
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
                        size="small"
                        variant="minimal"
                        intent="primary"
                        icon="select"
                        onClick={e => {
                            e.preventDefault();
                            _appendOptionText(props.appendToNotes)
                        }}/>
                <Button style={{height: "fit-content", alignSelf: "start", marginTop: 10, fontSize: 12}}
                        text="Add Exports"
                        size="small"
                        variant="minimal"
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


    function _setResourceNameState(new_name, callback = null) {
        if (props.controlled) {
            props.changeResourceName(new_name, callback)
        } else {
            set_resource_name(new_name);
            pushCallback(callback)
        }
    }

    let my_props = {...props};
    if (!props.controlled) {
        my_props.resource_name = resource_name;
    }

    let ch_style = {"width": "100%"};

    let codeElemDict = {};
    if (my_props.is_mpl) {
        codeElemDict["draw_plot"] = () => {
            return (
                <CmElement cmState={dpState}
                           cmDispatch={dpDispatch}
                           cmObjectRef={dpCmObjectRef}
                           funcName="draw_plot"
                           identifier="draw_plot"
                           argString=""
                            allowNameChange={false}
                            allowArgChange={false}
                           extraKeys={_extraKeys}
                           saveAndCheckpoint={_saveAndCheckpoint}
                           searchState={searchState}
                           searchDispatch={searchDispatch}
                           search_ref={search_ref}
                           handleTabSelect={_handleTabSelect}
                           pushCallback={pushCallback}
                           tsocket={props.tsocket}
                           extraSelfCompletions={extraSelfCompletionsRef.current}
                           module_viewer_id={props.module_viewer_id}
                           show_search={true}
                />
            )
        }
    }
    if (my_props.is_d3) {
         codeElemDict["javascript"] = () => {
             return (
                 <CmElement cmState={jsState}
                            cmDispatch={jsDispatch}
                            cmObjectRef={jsCmObjectRef}
                            funcName="javascript"
                            identifier="javascript"
                            argString=""
                            allowNameChange={false}
                            allowArgChange={false}
                            extraKeys={_extraKeys}
                            saveAndCheckpoint={_saveAndCheckpoint}
                            searchState={searchState}
                            searchDispatch={searchDispatch}
                            search_ref={search_ref}
                            handleTabSelect={_handleTabSelect}
                            pushCallback={pushCallback}
                            tsocket={props.tsocket}
                            extraSelfCompletions={[]}
                            module_viewer_id={props.module_viewer_id}
                            show_search={true}
                 />
             )
         }
    }

    codeElemDict["render_content"] = () => {
        return (
            // <div key="rccode" id="rccode" style={ch_style} className="d-flex flex-column align-items-baseline code-holder">
            <CmElement cmState={rcState}
                       cmDispatch={rcDispatch}
                       cmObjectRef={rcCmObjectRef}
                       funcName="render_content"
                       identifier="render_content"
                       argString=""
                        allowNameChange={false}
                        allowArgChange={false}
                       extraKeys={_extraKeys}
                       saveAndCheckpoint={_saveAndCheckpoint}
                       searchState={searchState}
                       searchDispatch={searchDispatch}
                       search_ref={search_ref}
                       handleTabSelect={_handleTabSelect}
                       pushCallback={pushCallback}
                       tsocket={props.tsocket}
                       extraSelfCompletions={extraSelfCompletionsRef.current}
                       module_viewer_id={props.module_viewer_id}
                       show_search={!(my_props.is_mpl || my_props.is_d3)}
            />
            //</div>
        )
    };

    codeElemDict["globals"] = () => {
             return (
        <CmElement cmState={globalsState}
                   cmDispatch={globalsDispatch}
                   cmObjectRef={globalsCmObjectRef}
                   funcName="globals"
                   identifier="globals"
                   argString=""
                   allowNameChange={false}
                   allowArgChange={false}
                   extraKeys={_extraKeys}
                   saveAndCheckpoint={_saveAndCheckpoint}
                   searchState={searchState}
                   searchDispatch={searchDispatch}
                   search_ref={search_ref}
                   handleTabSelect={_handleTabSelect}
                   pushCallback={pushCallback}
                   tsocket={props.tsocket}
                   extraSelfCompletions={extraSelfCompletionsRef.current}
                   module_viewer_id={props.module_viewer_id}
                   show_search={true}
        />
    )};
    for (let um of umListRef.current) {
        codeElemDict[um.method_id] = () => {
            return (
                <CmElement cmState={um}
                           showSignatureHeader={true}
                           methodName={um.funcName}
                           argString={um.argString}
                           cmDispatch={umDispatch}
                           cmObjectRef={null}
                           funcName={um.funcName}
                           identifier={um.method_id}
                           extraKeys={_extraKeys}
                           saveAndCheckpoint={_saveAndCheckpoint}
                           searchState={searchState}
                           searchDispatch={searchDispatch}
                           search_ref={search_ref}
                           handleTabSelect={_handleTabSelect}
                           pushCallback={pushCallback}
                           tsocket={props.tsocket}
                           extraSelfCompletions={extraSelfCompletionsRef.current}
                           module_viewer_id={props.module_viewer_id}
                           show_search={false}/>
            )
        }
    }

    let left_pane = (
        <Fragment>
            <div ref={nav_ref}>
                <MakerNavigator handleTabSelect={_handleTabSelect}
                                is_mpl={my_props.is_mpl}
                                is_d3={my_props.is_d3}
                                umList={umListRef.current}
                                export_list={export_list_ref.current}
                                option_list={option_list_ref.current}/>
            </div>

        </Fragment>
    );
    let mdata_panel = (
        <MetadataModule expandWidth={false}
                        alt_category={props.category}
                        notes_buttons={MetadataNotesButtons}
                        foregrounded={foregrounded_panes["metadata"]}
                        tsocket={props.tsocket}
                        readOnly={props.readOnly}
                        res_name={_cProp("resource_name")}
                        res_type="tile"
        />
    );

    let option_panel = (
        <OptionModule data_list_ref={option_list_ref}
                      foregrounded={foregrounded_panes["options"]}
                      optionDispatch={optionDispatch}
        />
    );
    let export_panel = (
        <ExportModule export_list={export_list_ref.current}
                      save_list={additional_save_attrs_ref.current}
                      couple_save_attrs_and_exports={couple_save_attrs_and_exports_ref.current}
                      foregrounded={foregrounded_panes["options"]}
                      handleChange={handleExportsStateChange}
        />
    );




    let right_pane;
    if (["metadata", "options", "exports"].includes(visibleTab)) {
        right_pane = (
            <div id="creator-resources" className="d-block">
                {visibleTab === "metadata" && mdata_panel}
                {visibleTab === "options" && option_panel}
                {visibleTab === "exports" && export_panel}
            </div>
        )
    }
    else {
        right_pane = (
            <div id="creator-resources" className="d-block" key={visibleTab}>
                {codeElemDict[visibleTab]?.()}
        </div>)

    };
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
        <ErrorBoundary custom_message="Error at top level">
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
            <ErrorBoundary custom_message="Error outside context provider">

                <MakerPaneContext.Provider value={{
                    visibleTab: visibleTab,
                }}>
                    <div className={outer_class} ref={top_ref} style={outer_style}
                         tabIndex="0" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
                        <SizeContext.Provider value={{
                            availableWidth: uwidth,
                            availableHeight: usable_height,
                            topX: topX,
                            topY: topY
                        }}>
                        <ErrorBoundary custom_message="Error in HorizontalPanes">
                            <HorizontalPanes left_pane={left_pane}
                                             right_pane={right_pane}
                                             show_handle={true}
                                             initial_width_fraction={.2}
                                             handleSplitUpdate={null}
                                             bottom_margin={BOTTOM_MARGIN}
                                             right_margin={SIDE_MARGIN}
                            />
                        </ErrorBoundary>
                        </SizeContext.Provider>
                    </div>
                </MakerPaneContext.Provider>
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
