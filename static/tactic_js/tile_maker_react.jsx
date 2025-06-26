import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/tile_creator.scss";

import React from "react";
import {Fragment, useState, useEffect, useRef, memo, useMemo, useContext} from "react";
import {createRoot} from 'react-dom/client';

import {Button, ButtonGroup} from "@blueprintjs/core";
import {useHotkeys} from "@blueprintjs/core";

import {EditorView} from "@codemirror/view";
import {EditorSelection} from "@codemirror/state";

import {creator_props} from "./tile_maker_support";
import {TacticMenubar} from "./menu_utilities"
import {sendToRepository} from "./resource_viewer_react_app";
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
import {SelectedPaneContext} from "./utilities_react";

import {usePropertyList, makeUndoableDispatch} from "./property_list"
import {useSearch} from "./search_reducer"
import {MakerPaneContext} from "./tile_maker_support";
import {CmElement, PaneElement, MakerNavigator, OptionModuleForm, ExportModuleForm, MetadataModule,
    option_icons, standard_method_icons} from "./tile_maker_elements";
import {useMetadata} from "./metadata_reducer";

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

    const [visibleTabList, setVisibleTabList] = useState(["metadata"]);

    const [searchState, searchDispatch, searchStateRef] = useSearch(props.is_mpl, props.is_d3);


    const last_save = useRef({});
    const rline_number = useRef(props.initial_line_number);

    const [usable_width, usable_height, topX, topY] = useSize(top_ref, 0, "TileMaker");

    const [, optionDispatchBase, option_list_ref] = usePropertyList(props.option_list);
    const [, exportDispatchBase, export_list_ref] = usePropertyList(props.export_list);
    const [, saveDispatchBase, save_list_ref] = usePropertyList(props.additional_save_attrs ? props.additional_save_attrs : []);
    const [, standardDispatchBase, standardListRef] = usePropertyList(props.standard_methods_list);
    const [, umDispatchBase, umListRef] = usePropertyList(props.user_methods_list);

    const [metadata, metadataDispatch, metadataRef] = useMetadata(props.mdata);

    const undoStackRef = useRef([]);

    const optionDispatch = makeUndoableDispatch(optionDispatchBase, option_list_ref, "Options", undoStackRef);
    const exportDispatch = makeUndoableDispatch(exportDispatchBase, export_list_ref, "Exports", undoStackRef);
    const saveDispatch = makeUndoableDispatch(saveDispatchBase, save_list_ref, "Saves", undoStackRef);
    const standardDispatch = makeUndoableDispatch(standardDispatchBase, standardListRef, "Standard", undoStackRef);
    const umDispatch = makeUndoableDispatch(umDispatchBase, umListRef, "UserMethods", undoStackRef);

    const [, set_couple_save_attrs_and_exports, couple_save_attrs_and_exports_ref] = useStateAndRef(props.couple_save_attrs_and_exports);

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
            {
                combo: "Ctrl+Z",
                global: false,
                group: "Tile Creator",
                label: "Undo",
                onKeyDown: handleUndo
            },
            {
                combo: "Cmd+Z",
                global: false,
                group: "Tile Creator",
                label: "Undo",
                onKeyDown: handleUndo
            }
        ], [_saveMe, _saveAndLoadModule, _saveAndCheckpoint]
    );
    const {handleKeyDown, handleKeyUp} = useHotkeys(hotkeys);

    const pushCallback = useCallbackStack();

    const [resource_name, set_resource_name] = useState(props.resource_name);

    const connection_status = useConnection(props.tsocket, initSocket);

    useEffect(() => {
        if (props.controlled) {
            props.registerDirtyMethod(_dirty);
            props.registerLineSetter(_selectLineNumber);
        } else {
            window.addEventListener("beforeunload", function (e) {
                if (_dirty()) {
                    e.preventDefault();
                }
            });
            document.title = String(resource_name);
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
                onames.push(entry["name"]);
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
        return {
            Edit: [{name_text: "Undo", icon_name: "undo", click_handler: handleUndo, key_bindings: ['Ctrl+Z', 'Cmd+Z']}],
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
        }
    }

    function handleUndo() {
        const stack = undoStackRef.current;
        if (stack.length > 0) {
            const { dispatch, undoAction } = stack.pop();
            dispatch(undoAction);
        }
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
            },
            {
                key: 'Ctrl-z', run: () => {
                    handleUndo();
                }, preventDefault: true
            },
            {
                key: 'Cmd-z', run: () => {
                    handleUndo();
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
                existing_names: data["tile_names"],
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
            "additional_save_attrs": save_list_ref.current,
            "couple_save_attrs_and_exports": couple_save_attrs_and_exports_ref.current,
            "options": option_list_ref.current,
            "user_methods": umListRef.current,
            "standard_methods": standardListRef.current,
            "is_mpl": props.is_mpl,
            "is_d3": props.is_d3,
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

    function setFirstLineNumber(line_number, identifier, dispatch) {
        dispatch({type: "update_item", identifier: identifier, new_item: {firstLineNumber: line_number}});
    }

    function save_success(data) {
        const stLineNumbers = data["standard_methods_line_numbers"];
        for (let identifier of Object.keys(stLineNumbers)) {
            setFirstLineNumber(stLineNumbers[identifier], identifier, standardDispatch);
        }
        const umLineNumbers = data["user_methods_line_numbers"];
        for (let identifier of Object.keys(umLineNumbers)) {
            setFirstLineNumber(umLineNumbers[identifier], identifier, umDispatch);
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
        let new_tab_list = [...visibleTabList];
        if (!new_tab_list.includes(newTabIdentifier)) {
            new_tab_list.push(newTabIdentifier);
        }
        else {
            new_tab_list = new_tab_list.filter(tab => tab !== newTabIdentifier);
        }
        setVisibleTabList(new_tab_list)
    }

    function _setResourceNameState(new_name, callback = null) {
        if (props.controlled) {
            props.changeResourceName(new_name, callback)
        } else {
            set_resource_name(new_name);
            pushCallback(callback)
        }
    }

    function getListItemFromidentifier(identifier, item_list) {
        for (let item of item_list) {
            if (item.identifier === identifier) {
                return item
            }
        }
        return null
    }

    let my_props = {...props};
    if (!props.controlled) {
        my_props.resource_name = resource_name;
    }

    let codeElemDict = {};
        for (let st of standardListRef.current) {
            codeElemDict[st["identifier"]] = () => {
                return (
                    <CmElement cmState={st}
                               no_height={true}
                               allowSignatureChange={false}
                               argString={st["argString"]}
                               cmDispatch={standardDispatch}
                               cmObjectRef={null}
                               name={st["name"]}
                               identifier={st["identifier"]}
                               extraKeys={_extraKeys}
                               saveAndCheckpoint={_saveAndCheckpoint}
                               searchState={searchState}
                               searchDispatch={searchDispatch}
                               search_ref={search_ref}
                               handleTabSelect={_handleTabSelect}
                               pushCallback={pushCallback}
                               tsocket={props.tsocket}
                               extraSelfCompletions={st["mode"] == "python" ? extraSelfCompletionsRef.current : []}
                               module_viewer_id={props.module_viewer_id}
                               show_search={false}/>
                )
            }
    }

    for (let um of umListRef.current) {
        codeElemDict[um["identifier"]] = () => {
            return (
                <CmElement cmState={um}
                           showSignatureHeader={true}
                           allowSignatureChange={true}
                           argString={um["argString"]}
                           cmDispatch={umDispatch}
                           cmObjectRef={null}
                           name={um["name"]}
                           no_height={true}
                           identifier={um["identifier"]}
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

    let optionElemDict = {};
    for (let opt of option_list_ref.current) {
        optionElemDict[opt["identifier"]] = () => {
            return (
                <OptionModuleForm optionItem={opt}
                                  dispatch={optionDispatch}/>
            )
        }
    }

    let exportElemDict = {};
    for (let exp of export_list_ref.current) {
        exportElemDict[exp["identifier"]] = () => {
            return (
                <ExportModuleForm exportItem={exp}
                                  dispatch={exportDispatch}/>
            )
        }
    }

    let saveElemDict = {};
    if (!couple_save_attrs_and_exports_ref.current) {
        for (let exp of save_list_ref.current) {
            saveElemDict[exp["identifier"]] = () => {
                return (
                    <ExportModuleForm exportItem={exp}
                                      dispatch={saveDispatch}/>
                )
            }
        }
    }


    const sections = [{
        title: "PROPERTIES",
        visible: true,
        icon: "properties",
        editable: false,
        dispatch: ()=>{},
        sub_items: [
            {
                identifier: "metadata",
                name: "Metadata",
                icon: "manually-entered-data",
                start_open: true,
                item_list: []
            },
        ]
    },
        {title: "OPTIONS", visible: true, editable: true, icon: "select", icon_dict: option_icons, icon_field: "type",
            sub_items: option_list_ref.current, dispatch: optionDispatch},
        {title: "EXPORTS", visible: true,editable: true, icon: "select", sub_items: export_list_ref.current, dispatch: exportDispatch},
        {title: "SAVE_ATTRS", visible: !couple_save_attrs_and_exports_ref.current,
            editable: true, icon: "select", sub_items: save_list_ref.current, dispatch: saveDispatch},
        {title: "STANDARD METHODS", visible: true, editable: false, icon: "code", icon_dict: standard_method_icons, icon_field: "name",
            sub_items: standardListRef.current, dispatch: standardDispatch},
        {title: "USER METHODS", visible: true, editable: true, icon: "code", sub_items: umListRef.current, dispatch: umDispatch}
    ]

    let left_pane = (
        <Fragment>
            <div ref={nav_ref} style={{overflow: "auto", height: "100%"}}>
                <MakerNavigator handleTabSelect={_handleTabSelect}
                                is_mpl={my_props.is_mpl}
                                is_d3={my_props.is_d3}
                                sections={sections}
                                umList={umListRef.current}/>
            </div>

        </Fragment>
    );
    let mdata_panel = (
        <MetadataModule res_name={_cProp("resource_name")}
                        res_type="tile"
                        metadataRef={metadataRef}
                        mdata={metadataRef.current}
                        metadataDispatch={metadataDispatch}
                        option_list_ref={option_list_ref}
                        export_list_ref={export_list_ref}
        />
    );

    let right_pane_list = [];

    if (visibleTabList.includes("metadata")) {
        right_pane_list.push(
            <PaneElement identifier="metadata" key="metadata">
                {mdata_panel}
            </PaneElement>
        )
    }
    for (let key of Object.keys(optionElemDict)) {
        if (visibleTabList.includes(key)) {
            right_pane_list.push(
                <PaneElement identifier={key} key={key} allowDelete={true} dispatch={optionDispatch}>
                    {optionElemDict[key]?.()}
                </PaneElement>
            )
        }
    }
    for (let key of Object.keys(exportElemDict)) {
        if (visibleTabList.includes(key)) {
            const item = getListItemFromidentifier(key, export_list_ref.current);
            right_pane_list.push(
            <PaneElement identifier={key} key={key} allowDelete={true} dispatch={exportDispatch}>
                <h5>Export: <b>{item.name}</b></h5>
                {exportElemDict[key]?.()}
            </PaneElement>
            )
        }
    }
    for (let key of Object.keys(saveElemDict)) {
        if (visibleTabList.includes(key)) {
            const item = getListItemFromidentifier(key, save_list_ref.current);
            right_pane_list.push(
                <PaneElement key={key} identifier={key} allowDelete={true} dispatch={saveDispatch}>
                    <h5>Save Attribute: <b>{item.name}</b></h5>
                    {saveElemDict[key]?.()}
                </PaneElement>
            )
        }

    }
    for (let item of standardListRef.current) {
        if (visibleTabList.includes(item["identifier"])) {
            right_pane_list.push(
                <PaneElement key={item["identifier"]} identifier={item["identifier"]}>
                    {codeElemDict[item["identifier"]]?.()}
                </PaneElement>
            )
        }
    }
    for (let item of umListRef.current) {
        if (visibleTabList.includes(item["identifier"])) {
            right_pane_list.push(
                <PaneElement key={item["identifier"]} identifier={item["identifier"]}  allowDelete={true} dispatch={umDispatch}>
                    {codeElemDict[item["identifier"]]?.()}
                </PaneElement>
            )
        }
    }

    let right_pane = (
        <div style={{overflow: "auto", height: "100%"}}>
            {right_pane_list}
        </div>
    )

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
                    visibleTabList: visibleTabList,
                    setVisibleTabList: setVisibleTabList,
                    toggleVisibleTab: _handleTabSelect,
                    pushCallback: pushCallback
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
