import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/tile_creator.scss";

import React from "react";
import {Fragment, useState, useEffect, useRef, memo, useMemo, useContext} from "react";
import {createRoot} from 'react-dom/client';

import _ from 'lodash';

import {useHotkeys} from "@blueprintjs/core";

import {EditorView} from "@codemirror/view";
import {EditorSelection} from "@codemirror/state";

import {creator_props} from "./tile_maker_support";
import {TacticMenubar} from "./menu_utilities"
import {sendToRepository} from "./resource_viewer_react_app";
import {HorizontalPanes} from "./resizing_allotment";
import {postAjax, postAjaxPromise, postPromise} from "./communication_react"
import {withStatus, doFlash, StatusContext} from "./toaster"
import {withAssistant} from "./assistant";
import {ICON_BAR_WIDTH, SIDE_MARGIN} from "./sizing_tools";
import {withErrorDrawer} from "./error_drawer";
import {renderSpinnerMessage, convertExtraKeys, useStateAndRef} from "./utilities_react"
import {TacticNavbar} from "./blueprint_navbar";
import {ErrorBoundary} from "./error_boundary";
import {useCallbackStack, useConnection} from "./utilities_react";
import {SettingsContext, withSettings} from "./settings";
import {DialogContext, withDialogs} from "./modal_react";
import {ErrorDrawerContext} from "./error_drawer";
import {SelectedPaneContext} from "./utilities_react";

import {usePropertyList, makeUndoableDispatch, getListItemFromidentifier} from "./property_list"
import {useSearch} from "./search_reducer"
import {MakerPaneContext} from "./tile_maker_support";
import {
    CmElement, PaneElement, MakerNavigator, OptionModuleForm, ExportModuleForm, MetadataModule,
    option_icons, standard_method_icons, INITIAL_CODE_PANE_HEIGHT, INITIAL_FORM_PANE_HEIGHT
} from "./tile_maker_elements";
import {useMetadata} from "./metadata_reducer";
import {TileMakerSearchForm} from "./tile_maker_search_form";

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
    const last_save = useRef({});
    const rline_number = useRef(props.initial_line_number);
    const pane_scroll_ref = useRef(null);

    const [, setVisibleTabList, visibleTabListRef] = useStateAndRef([]);
    const [, setMethodsToOpen, methodsToOpenRef] = useStateAndRef(props.interface_state != null && "visibleMethodList" in props.interface_state ?
        props.interface_state.visibleMethodList : ["render_content"]);

    const [, optionDispatchBase, option_list_ref] = usePropertyList(props.option_list, INITIAL_FORM_PANE_HEIGHT, {special_list: []});
    const [, exportDispatchBase, export_list_ref] = usePropertyList(props.export_list, INITIAL_FORM_PANE_HEIGHT, {tags: ""});
    const [, saveDispatchBase, save_list_ref] = usePropertyList(props.additional_save_attrs ? props.additional_save_attrs : [], INITIAL_FORM_PANE_HEIGHT);
    const [, standardDispatchBase, standardListRef] = usePropertyList(props.standard_methods_list, INITIAL_CODE_PANE_HEIGHT);
    const [, umDispatchBase, umListRef] = usePropertyList(props.user_methods_list, INITIAL_CODE_PANE_HEIGHT);
    const [, hmDispatchBase, hmListRef] = usePropertyList(props.used_handler_methods_list, INITIAL_CODE_PANE_HEIGHT);

    const [, metadataDispatch, metadataRef] = useMetadata(props.mdata);

    const undoStackRef = useRef([]);
    const otherCmObjects = useRef([]);

    const optionDispatch = makeUndoableDispatch(optionDispatchBase, option_list_ref, "Options", undoStackRef);
    const exportDispatch = makeUndoableDispatch(exportDispatchBase, export_list_ref, "Exports", undoStackRef);
    const saveDispatch = makeUndoableDispatch(saveDispatchBase, save_list_ref, "Saves", undoStackRef);
    const standardDispatch = makeUndoableDispatch(standardDispatchBase, standardListRef, "Standard", undoStackRef);
    const umDispatch = makeUndoableDispatch(umDispatchBase, umListRef, "UserMethods", undoStackRef);
    const hmDispatch = makeUndoableDispatch(hmDispatchBase, hmListRef, "HandlerMethods", undoStackRef);

    const [searchState, searchDispatch, searchStateRef] = useSearch([], [standardListRef, umListRef, hmListRef]);

    const extraSelfCompletionsRef = useRef([]);

    const settingsContext = useContext(SettingsContext);
    const dialogFuncs = useContext(DialogContext);
    const statusFuncs = useContext(StatusContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);

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


        errorDrawerFuncs.setGoToLineNumber(_selectLineNumber);

        function sendRemove() {
            navigator.sendBeacon("/delete_container_on_unload",
                JSON.stringify({"container_id": props.module_viewer_id, "notify": false}));
        }

        window.addEventListener("unload", sendRemove);
        statusFuncs.stopSpinner();
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    _update_saved_state();
                })
            })
        });
        return (() => {
            for (let listRef of [standardListRef, umListRef, hmListRef]) {
                destroyCmObjects(listRef);
            }
            for (let cm of otherCmObjects.current) {
                if (cm) {
                    cm.destroy();
                }
            }
            otherCmObjects.current = [];
            clearUndoStack(undoStackRef);

            delete_my_container();
            window.removeEventListener("unload", sendRemove);
            errorDrawerFuncs.setGoToLineNumber(null);
            visibleTabListRef.current = null;
            methodsToOpenRef.current = null;
            if (props.controlled) {
                props.registerDirtyMethod(null);
            }
            metadataRef.current = null;
            undoStackRef.current = [];
            searchStateRef.current = [];
            extraSelfCompletionsRef.current = [];
        })
    }, []);

    useEffect(() => {
        _goToLineNumber();
        if (methodsToOpenRef.current) {
            let newMethodsToOpen = methodsToOpenRef.current;
            let identifier;
            let identifiersToAdd = [];
            for (let name of methodsToOpenRef.current) {
                identifier = getIdentifierFromName(name);
                if (identifier != null) {
                    identifiersToAdd.push(identifier);
                    newMethodsToOpen = newMethodsToOpen.filter((item) => item !== name);
                }
            }
            showTabs(identifiersToAdd); // Must be done in a batch, or they don't all show
            if (newMethodsToOpen.length <= 0) {
                setMethodsToOpen(null);
            } else if (newMethodsToOpen.length < methodsToOpenRef.current.length) {
                setMethodsToOpen(newMethodsToOpen);
            }
        }
    });

    useEffect(() => {
        function _getOptionNames() {
            let onames = [];
            for (let entry of option_list_ref.current) {
                // noinspection JSUnresolvedReference
                onames.push(entry["name"]);
            }
            return onames
        }

        extraSelfCompletionsRef.current = [];
        for (let oname of _getOptionNames()) {
            let the_text = "" + oname;
            extraSelfCompletionsRef.current.push({label: the_text, type: "variable", section: "Options"});
        }
        for (let um of umListRef.current) {
            // noinspection JSUnresolvedReference
            extraSelfCompletionsRef.current.push({
                label: um["name"],
                info: `${um["name"]}(${um["argString"]})`,
                type: "function",
                section: "Local"
            });
        }

    }, [option_list_ref.current, umListRef.current]);

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

    function registerCmObject(cmObject) {
        otherCmObjects.current.push(cmObject);
    }

    function menu_specs() {
        return {
            Save: [{name_text: "Save", icon_name: "saved", click_handler: _saveMe, key_bindings: ['Ctrl+S']},
                {name_text: "Save As...", icon_name: "floppy-disk", click_handler: _saveModuleAs},
                {
                    name_text: "Save and Checkpoint",
                    icon_name: "map-marker",
                    click_handler: _saveAndCheckpoint,
                    key_bindings: ['Ctrl+M']
                }],
            Edit: [{
                name_text: "Undo",
                icon_name: "undo",
                click_handler: handleUndo,
                key_bindings: ['Ctrl+Z', 'Cmd+Z']
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
            const {dispatch, undoAction} = stack.pop();
            dispatch(undoAction);
        }
    }

    function _searchNext() {
        searchDispatch({type: "SEARCH_NEXT"});
        pushCallback(() => {
            showTab(searchStateRef.current.current_search_cm);
        })
    }

    function _searchPrev() {
        searchDispatch({type: "SEARCH_PREVIOUS"});
        pushCallback(() => {
            showTab(searchStateRef.current.current_search_cm);
        })
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
            if (!_.isEqual(current_state[k], last_save.current[k])) {
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

    function removeNotSavedThings(listRef) {
        return listRef.current.map((item) => {
            const newItem = {...item};  // shallow copy
            delete newItem.cmObject;
            delete newItem.scrollTop;
            return newItem;
        });
    }

    function clearUndoStack(undoStackRef) {
        if (undoStackRef.current) {
            for (let entry of undoStackRef.current) {
                if (entry) {
                    if (entry.cmObject) {
                        entry.cmObject.destroy();
                        entry.cmObject = null;
                    }
                }
            }
        }
    }

    function destroyCmObjects(listRef) {
        for (let item of listRef.current) {
            if (item.cmObject) {
                item.cmObject.destroy();
                item.cmObject = null;
            }
        }
        listRef.current = [];
    }

    function _getSaveDict() {
        let mdata = {...metadataRef.current};
        delete mdata.allTags;
        const visibleMethods = visibleTabListRef.current.map((identifier) => {
            return getNameFromIdentifier(identifier)
        });
        mdata["interface_state"] = {
            "visibleMethodList": visibleMethods,
        }
        return {
            "module_name": _cProp("resource_name"),
            "mdata": mdata,
            "exports": removeNotSavedThings(export_list_ref),
            "additional_save_attrs": removeNotSavedThings(save_list_ref),
            "options": removeNotSavedThings(option_list_ref),
            "user_methods": removeNotSavedThings(umListRef),
            "used_handler_methods": removeNotSavedThings(hmListRef),
            "standard_methods": removeNotSavedThings(standardListRef),
            "is_mpl": props.is_mpl,
            "is_d3": props.is_d3,
            "last_viewer": "creator",
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

    function setLineNumbers(line_number_dict, identifier, dispatch) {
        if (!identifier) return;
        dispatch({type: "update_item", identifier: identifier, new_item: line_number_dict});
    }

    function getIdentifierFromName(name) {
        for (let listRef of [standardListRef, umListRef, hmListRef]) {
            const identifier = getIdentifierFromNameInLIst(listRef, name);
            if (identifier) {
                return identifier;
            }
        }
        return null;
    }

    function getIdentifierFromNameInLIst(listRef, name) {
        for (let item of listRef.current) {
            if (item.name === name) {
                return item.identifier;
            }
        }
        return null
    }

    function getNameFromIdentifier(identifier) {
        for (let listRef of [standardListRef, umListRef, hmListRef]) {
            const name = getNameFromIdentifierInList(listRef, identifier);
            if (name) {
                return name;
            }
        }
        return null
    }

    function getNameFromIdentifierInList(listRef, identifier) {
        for (let item of listRef.current) {
            if (item.identifier === identifier) {
                return item.name;
            }
        }
        return null
    }

    function getItemFromIdentifier(identifier) {
        for (let listRef of [option_list_ref, export_list_ref, save_list_ref, standardListRef, umListRef, hmListRef]) {
            const item = getListItemFromidentifier(identifier, listRef.current);
            if (item) {
                return item;
            }
        }
        return null
    }

    function setItem(identifier, item) {
        for (let [listRef, dispatch] of [[standardListRef, standardDispatch], [umListRef, umDispatch], [hmListRef, hmDispatch]]) {
            const existingItem = getListItemFromidentifier(identifier, listRef.current);
            if (existingItem) {
                dispatch({type: "update_item", identifier: identifier, new_item: item});
                return;
            }
        }
    }

    function save_success(data) {
        const stLineNumbers = data["standard_methods_line_numbers"];
        let identifier;
        for (let name of Object.keys(stLineNumbers)) {
            identifier = getIdentifierFromNameInLIst(standardListRef, name);
            setLineNumbers(stLineNumbers[name], identifier, standardDispatch);
        }
        const umLineNumbers = data["user_methods_line_numbers"];
        for (let name of Object.keys(umLineNumbers)) {
            identifier = getIdentifierFromNameInLIst(umListRef, name);
            setLineNumbers(umLineNumbers[name], identifier, umDispatch);
        }
        const hmLineNumbers = data["used_handler_methods_line_numbers"];
        for (let identifier of Object.keys(hmLineNumbers)) {
            identifier = getIdentifierFromNameInLIst(hmListRef, name);
            setLineNumbers(hmLineNumbers[name], identifier, hmDispatch);
        }
        _update_saved_state();
    }

    function _update_saved_state() {
        last_save.current = _getSaveDict();
    }

    function _highlightLine(listRef, identifier, lnumber) {
        try {
            const item = getListItemFromidentifier(identifier, listRef.current);
            if (item == null || !item.cmObject) {
                return
            }
            rline_number.current = null
            const cm = item.cmObject;
            const line = cm.state.doc.line(lnumber + 1 - item.firstLineNumber);
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

    function _goToLineNumber() {
        if (rline_number.current) {
            const local_number = rline_number.current
            rline_number.current = null
            errorDrawerFuncs.closeErrorDrawer();
            for (let listRef of [standardListRef, umListRef, hmListRef]) {
                for (let item of listRef.current) {
                    if (local_number >= item["firstLineNumber"] && local_number <= item["lastLineNumber"]) {
                        showTab(item["identifier"]);
                        pushCallback(() => {
                            _highlightLine(listRef, item["identifier"], local_number);
                        })
                        break;
                    }

                }
            }
        }
    }

    function delete_my_container() {
        postAjax("/delete_container_on_unload", {"container_id": props.module_viewer_id, "notify": false});
    }

    function scrollToPane(itemIdentifier) {
        pane_scroll_ref.current = itemIdentifier;
    }

    function _handleTabSelect(newTabIdentifier) {
        let new_tab_list = [...visibleTabListRef.current];
        if (!new_tab_list.includes(newTabIdentifier)) {
            new_tab_list.push(newTabIdentifier);
            scrollToPane(newTabIdentifier);
        } else {
            let existingItem = getItemFromIdentifier(newTabIdentifier);
            if (existingItem && existingItem.cmObject) {
                const cm = existingItem.cmObject;
                const scrollTop = cm.scrollDOM.scrollTop;

                setItem(newTabIdentifier, {scrollTop: scrollTop});
            }
            new_tab_list = new_tab_list.filter(tab => tab !== newTabIdentifier);
        }
        setVisibleTabList(new_tab_list)
    }

    function showTab(newTabIdentifier) {
        if (!visibleTabListRef.current.includes(newTabIdentifier)) {
            let new_tab_list = [...visibleTabListRef.current];
            new_tab_list.push(newTabIdentifier);
            setVisibleTabList(new_tab_list);
            scrollToPane(newTabIdentifier);
        }
    }

    function showTabs(id_list) {
        let tabsToAdd = id_list.filter((id) => !visibleTabListRef.current.includes(id));
        if (tabsToAdd.length > 0) {
            let new_tab_list = [...visibleTabListRef.current, ...tabsToAdd];
            setVisibleTabList(new_tab_list);
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

    let codeElemDict = {};
    for (let st of standardListRef.current) {
        codeElemDict[st["identifier"]] = () => {
            return (
                <CmElement cmState={st}
                           no_height={false}
                           allowSignatureChange={false}
                           allowDelete={false}
                           argString={st["argString"]}
                           cmDispatch={standardDispatch}
                           cmObjectRef={null}
                           name={st["name"]}
                           registerCmObject={registerCmObject}
                           identifier={st["identifier"]}
                           extraKeys={_extraKeys}
                           saveAndCheckpoint={_saveAndCheckpoint}
                           searchState={searchState}
                           searchDispatch={searchDispatch}
                           search_ref={null}
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
                           allowDelete={true}
                           showSignatureHeader={true}
                           allowSignatureChange={true}
                           argString={um["argString"]}
                           cmDispatch={umDispatch}
                           cmObjectRef={null}
                           name={um["name"]}
                           no_height={false}
                           registerCmObject={registerCmObject}
                           identifier={um["identifier"]}
                           extraKeys={_extraKeys}
                           saveAndCheckpoint={_saveAndCheckpoint}
                           searchState={searchState}
                           searchDispatch={searchDispatch}
                           search_ref={null}
                           pushCallback={pushCallback}
                           tsocket={props.tsocket}
                           extraSelfCompletions={extraSelfCompletionsRef.current}
                           module_viewer_id={props.module_viewer_id}
                           show_search={false}/>
            )
        }
    }
    for (let hm of hmListRef.current) {
        codeElemDict[hm["identifier"]] = () => {
            return (
                <CmElement cmState={hm}
                           allowDelete={true}
                           showSignatureHeader={true}
                           allowSignatureChange={false}
                           argString={hm["argString"]}
                           cmDispatch={hmDispatch}
                           cmObjectRef={null}
                           registerCmObject={registerCmObject}
                           name={hm["name"]}
                           no_height={false}
                           identifier={hm["identifier"]}
                           extraKeys={_extraKeys}
                           saveAndCheckpoint={_saveAndCheckpoint}
                           searchState={searchState}
                           searchDispatch={searchDispatch}
                           search_ref={null}
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
    if (!metadataRef.current.couple_save_attrs_and_exports) {
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
        dispatch: () => {
        },
        start_expanded: false,
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
        {
            title: "OPTIONS",
            visible: true,
            editable: true,
            icon: "select",
            icon_dict: option_icons,
            icon_field: "type",
            start_expanded: false,
            sub_items: option_list_ref.current,
            dispatch: optionDispatch
        },
        {
            title: "EXPORTS", visible: true, editable: true, icon: "select",
            start_expanded: false,
            sub_items: export_list_ref.current, dispatch: exportDispatch
        },
        {
            title: "SAVE_ATTRS", visible: !metadataRef.current.couple_save_attrs_and_exports,
            start_expanded: false,
            editable: true, icon: "select", sub_items: save_list_ref.current, dispatch: saveDispatch
        },
        {
            title: "STANDARD METHODS",
            visible: true,
            editable: false,
            icon: "code",
            icon_dict: standard_method_icons,
            icon_field: "name",
            start_expanded: true,
            sub_items: standardListRef.current,
            dispatch: standardDispatch
        },
        {
            title: "USER METHODS", visible: true, editable: true, icon: "code",
            start_expanded: false, sub_items: umListRef.current, dispatch: umDispatch
        },
        {
            title: "HANDLER METHODS", visible: true, editable: true, icon: "code", sub_items: hmListRef.current,
            start_expanded: false,
            createFromList: true, choiceDict: props.all_handler_methods, dispatch: hmDispatch
        },
    ]

    let left_pane = (
        <Fragment>
            <div ref={nav_ref}
                 style={{overflow: "auto",
                     paddingTop: 35,
                     paddingLeft: 15,
                     height: "100%"}}>
                <MakerNavigator handleTabSelect={_handleTabSelect}
                                pushCallback={pushCallback}
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
                        registerCmObject={registerCmObject}
                        metadataRef={metadataRef}
                        mdata={metadataRef.current}
                        metadataDispatch={metadataDispatch}
                        option_list_ref={option_list_ref}
                        export_list_ref={export_list_ref}
        />
    );

    let right_pane_list = [];
    right_pane_list.push(
        <PaneElement identifier="metadata" key="metadata" dispatch={metadataDispatch} pushCallback={pushCallback}
                     visible={visibleTabListRef.current.includes("metadata")}
                     pane_scroll_ref={pane_scroll_ref}
                     pane_height={metadataRef.current.pane_height}>
            {mdata_panel}
        </PaneElement>
    )
    for (let key of Object.keys(optionElemDict)) {
        const item = getListItemFromidentifier(key, option_list_ref.current);
        right_pane_list.push(
            <PaneElement identifier={key} key={key} pane_height={item.pane_height}
                         pane_scroll_ref={pane_scroll_ref}
                         className="form-pane" visible={visibleTabListRef.current.includes(key)}
                         allowDelete={true} dispatch={optionDispatch} pushCallback={pushCallback}>
                {optionElemDict[key]?.()}
            </PaneElement>
        )
    }
    for (let key of Object.keys(exportElemDict)) {
        const item = getListItemFromidentifier(key, export_list_ref.current);
        right_pane_list.push(
            <PaneElement identifier={key} key={key} el={item} pane_height={item.pane_height}
                         pane_scroll_ref={pane_scroll_ref}
                         className="form-pane" visible={visibleTabListRef.current.includes(key)}
                         allowDelete={true} dispatch={exportDispatch} pushCallback={pushCallback}>
                {exportElemDict[key]?.()}
            </PaneElement>
        )
    }
    for (let key of Object.keys(saveElemDict)) {
        const item = getListItemFromidentifier(key, save_list_ref.current);
        right_pane_list.push(
            <PaneElement key={key} identifier={key} el={item} pane_height={item.pane_height}
                         pane_scroll_ref={pane_scroll_ref}
                         className="form-pane" visible={visibleTabListRef.current.includes(key)}
                         allowDelete={true} dispatch={saveDispatch} pushCallback={pushCallback}>
                {saveElemDict[key]?.()}
            </PaneElement>
        )
    }
    for (let item of standardListRef.current) {
        right_pane_list.push(
            <PaneElement key={item["identifier"]} el={item} dispatch={standardDispatch}
                         pane_height={item["pane_height"]}
                         pane_scroll_ref={pane_scroll_ref}
                         icon={standard_method_icons[item["name"]]}
                         visible={visibleTabListRef.current.includes(item["identifier"])}
                         identifier={item["identifier"]} pushCallback={pushCallback}>
                {codeElemDict[item["identifier"]]?.()}
            </PaneElement>
        )
    }
    for (let item of hmListRef.current) {
        right_pane_list.push(
            <PaneElement key={item["identifier"]} el={item} dispatch={hmDispatch} pane_height={item["pane_height"]}
                         pane_scroll_ref={pane_scroll_ref}
                         allowDelete={true} visible={visibleTabListRef.current.includes(item["identifier"])}
                         identifier={item["identifier"]} pushCallback={pushCallback}>
                {codeElemDict[item["identifier"]]?.()}
            </PaneElement>
        )
    }
    for (let item of umListRef.current) {
        right_pane_list.push(
            <PaneElement key={item["identifier"]} el={item} pane_height={item["pane_height"]}
                         pane_scroll_ref={pane_scroll_ref}
                         visible={visibleTabListRef.current.includes(item["identifier"])}
                         identifier={item["identifier"]} allowDelete={true} dispatch={umDispatch}
                         pushCallback={pushCallback}>
                {codeElemDict[item["identifier"]]?.()}
            </PaneElement>
        )
    }

    let right_pane = (
        <div style={{width: "100%", height: "100%"}}>
            <div style={{display: "flex", flexDirection: "column", paddingBottom: 5, width: "100%", height: "100%", paddingLeft: 20, paddingTop: 25}}>
                <TileMakerSearchForm
                    regex={false}
                    allow_regex={true}
                    field_width={200}
                    include_search_jumper={true}
                    searchDispatch={searchDispatch}
                    searchStateRef={searchStateRef}
                    searchNext={_searchNext}
                    searchPrev={_searchPrev}
                    searchState={searchStateRef.current}
                    search_ref={search_ref}
                />
                <div style={{overflow: "auto", flex: "1 1 0", minWidth: 0, paddingBottom: 200}}>
                    {right_pane_list}
                </div>
            </div>
        </div>
    )

    let outer_style = {
        width: `calc(100% - ${ICON_BAR_WIDTH}px)`,
        height: "100%",
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 0,
        position: "relative"
    };
    let outer_class = "resource-viewer-holder pane-holder";
    if (!window.in_context) {
        if (settingsContext.isDark()) {
            outer_class = outer_class + " bp6-dark";
        } else {
            outer_class = outer_class + " light-theme"
        }
    }

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
                    visibleTabList: visibleTabListRef.current,
                    setVisibleTabList: setVisibleTabList,
                    toggleVisibleTab: _handleTabSelect,
                    pushCallback: pushCallback
                }}>
                    <div className={outer_class} ref={top_ref} style={outer_style}
                         tabIndex="0" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
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
                    </div>
                </MakerPaneContext.Provider>
            </ErrorBoundary>
        </ErrorBoundary>
    );
}

CreatorApp = memo(CreatorApp);

function tile_creator_main() {
    function gotProps(the_props) {
        let CreatorAppPlus = withSettings(withDialogs(withErrorDrawer(withStatus(withAssistant(CreatorApp)))));
        let the_element = <CreatorAppPlus {...the_props}
                                          controlled={false}
                                          changeName={null}
        />;
        const domContainer = document.querySelector('#creator-root');
        const root = createRoot(domContainer);
        root.render(
            <div style={{display: "flex", flexDirection: "column",
                position: "relative",
                height: "100%",
                width: "100%"}}>
                {the_element}
            </div>
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
