import {TacticSocket} from "./tactic_socket";

if (!window.in_context) {
    import("../tactic_css/tactic.scss");
    import("../tactic_css/resource_viewer.scss");
    import ("../tactic_css/tile_creator.scss");
    import("../tactic_css/tactic_table.css");
    import ("../tactic_css/themeable.scss");
}

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
import {postPromise, handleCallback} from "./communication_react"
import {withStatus, doFlash, StatusContext} from "./toaster"
import {withAssistant} from "./assistant";
import {ICON_BAR_WIDTH} from "./sizing_tools";
import {withErrorDrawer} from "./error_drawer";
import {renderSpinnerMessage, convertExtraKeys, useStateAndRef} from "./utilities_react"
import {TacticNavbar} from "./blueprint_navbar";
import {ErrorBoundary} from "./error_boundary";
import {useCallbackStack, useConnection} from "./utilities_react";
import {SettingsContext, withSettings} from "./settings";
import {DialogContext, withDialogs} from "./modal_react";
import {ErrorDrawerContext} from "./error_drawer";
import {SelectedPaneContext, guid} from "./utilities_react";

import {usePropertyList, makeUndoableDispatch, getListItemFromidentifier} from "./property_list"
import {useSearch} from "./search_reducer"
import {MakerPaneContext} from "./tile_maker_support";
import {
    CmElement, PaneElement, MakerNavigator, OptionModuleForm, ExportModuleForm, MetadataModule, DividerElement,
    option_icons, INITIAL_CODE_PANE_HEIGHT, INITIAL_FORM_PANE_HEIGHT, pane_type_icons,
} from "./tile_maker_elements";
import {useMetadata} from "./metadata_reducer";
import {TileMakerSearchForm} from "./tile_maker_search_form";

export {CreatorApp}

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
    const search_ref = useRef(null);
    const last_save = useRef({});
    const rline_number = useRef(props.initial_line_number);
    const pane_scroll_ref = useRef(null);

    const [, setVisibleTabList, visibleTabListRef] = useStateAndRef([]);
    const [, setMethodsToOpen, methodsToOpenRef] = useStateAndRef(props.interface_state != null && "visibleMethodList" in props.interface_state ?
        props.interface_state.visibleMethodList : ["render_content"]);

    const [, setRenderContentInfo, renderContentInfoRef] = useStateAndRef(props.render_content_info);
    const [, setGlobalsInfo, globalsInfoRef] = useStateAndRef(props.globals_info);

    const [, optionDispatchBase, option_list_ref] = usePropertyList(props.option_list, INITIAL_FORM_PANE_HEIGHT, {special_list: []});
    const [, exportDispatchBase, export_list_ref] = usePropertyList(props.export_list, INITIAL_FORM_PANE_HEIGHT, {tags: ""});
    const [, saveDispatchBase, save_list_ref] = usePropertyList(props.additional_save_attrs ? props.additional_save_attrs : [], INITIAL_FORM_PANE_HEIGHT);
    const [, umDispatchBase, umListRef] = usePropertyList(props.user_methods_list, INITIAL_CODE_PANE_HEIGHT);
    const [, hmDispatchBase, hmListRef] = usePropertyList(props.used_handler_methods_list, INITIAL_CODE_PANE_HEIGHT);
    const [, jsDispatchBase, jsListRef] = usePropertyList(props.javascript_functions_list, INITIAL_CODE_PANE_HEIGHT);

    const [, metadataDispatch, metadataRef] = useMetadata(props.mdata);

    const undoStackRef = useRef([]);
    const otherCmObjects = useRef([]);

    const optionDispatch = makeUndoableDispatch(optionDispatchBase, option_list_ref, "Options", undoStackRef);
    const exportDispatch = makeUndoableDispatch(exportDispatchBase, export_list_ref, "Exports", undoStackRef);
    const saveDispatch = makeUndoableDispatch(saveDispatchBase, save_list_ref, "Saves", undoStackRef);
    const umDispatch = makeUndoableDispatch(umDispatchBase, umListRef, "UserMethods", undoStackRef);
    const hmDispatch = makeUndoableDispatch(hmDispatchBase, hmListRef, "HandlerMethods", undoStackRef);
    const jsDispatch = makeUndoableDispatch(jsDispatchBase, jsListRef, "JavaScriptFunctions", undoStackRef);

    const [searchState, searchDispatch, searchStateRef] = useSearch([globalsInfoRef, renderContentInfoRef], [umListRef, hmListRef, jsListRef]);

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
        updateGlobals({pane_height: INITIAL_CODE_PANE_HEIGHT});
        updateRenderContent({pane_height: INITIAL_CODE_PANE_HEIGHT});
        if (props.controlled) {
            props.registerDirtyMethod(_dirty);
            props.registerLineSetter(_selectLineNumber);
        } else {
            window.addEventListener("beforeunload", function (e) {
                if (_dirty()) {
                    e.preventDefault();
                }
                props.tsocket.disconnect()
            });
            document.title = String(resource_name);
        }

        _goToLineNumber();


        errorDrawerFuncs.setGoToLineNumber(_selectLineNumber);

        statusFuncs.stopSpinner();
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    _update_saved_state();
                })
            })
        });
        return (() => {
            for (let listRef of [jsListRef, umListRef, hmListRef]) {
                destroyCmObjects(listRef);
            }
            for (let cm of otherCmObjects.current) {
                if (cm) {
                    cm.destroy();
                }
            }
            otherCmObjects.current = [];
            clearUndoStack(undoStackRef);

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
            postPromise("module_viewer", "end_session", {"local_id": props.local_id})
                .then(()=>{})
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
                if (!(data["originator"] == props.global_id)) {
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
                props.local_id);
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
                {"tile_module_name": _cProp("resource_name")},
                props.local_id);
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
            data = await postPromise("host", "get_tile_names_task", {}, props.local_id);
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
                data = await postPromise("host", "create_duplicate_tile_task", result_dict);
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

    function removeNotSavedThingsFromItem(item) {
        const newItem = {...item};  // shallow copy
        delete newItem.cmObject;
        delete newItem.scrollTop;
        return newItem;
    }

    function removeNotSavedThings(listRef) {
        return listRef.current.map((item) => {
            return removeNotSavedThingsFromItem(item)
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
        delete mdata["additional_mdata"]
        mdata["mdata_uid"] = guid()
        const visibleMethods = visibleTabListRef.current.map((identifier) => {
            return getNameFromIdentifier(identifier)
        });
        mdata["interface_state"] = {
            "visibleMethodList": visibleMethods,
        };
        return {
            "module_name": _cProp("resource_name"),
            "mdata": mdata,
            "exports": removeNotSavedThings(export_list_ref),
            "globals_info": removeNotSavedThingsFromItem(globalsInfoRef.current),
            "render_content_info": removeNotSavedThingsFromItem(renderContentInfoRef.current),
            "additional_save_attrs": removeNotSavedThings(save_list_ref),
            "options": removeNotSavedThings(option_list_ref),
            "user_methods": removeNotSavedThings(umListRef),
            "used_handler_methods": removeNotSavedThings(hmListRef),
            "javascript_functions": removeNotSavedThings(jsListRef),
            "is_mpl": props.is_mpl,
            "is_d3": props.is_d3,
            "last_viewer": "creator",
        };
    }

    function doSavePromise() {
        return new Promise(async (resolve, reject) => {
            let result_dict = _getSaveDict();
            result_dict["local_id"] = props.local_id;
            let data;
            try {
                data = await postPromise("module_viewer", "update_module", result_dict, props.local_id);
                save_success(data);
                resolve(data)
            } catch (e) {
                reject(e)
            }
        })
    }

    function doCheckpointPromise() {
        return postPromise("host", "checkpoint_module_task", {"module_name": _cProp("resource_name")});
    }

    function setLineNumbers(line_number_dict, identifier, dispatch) {
        if (!identifier) return;
        dispatch({type: "update_item", identifier: identifier, new_item: line_number_dict});
    }

    function getIdentifierFromName(name) {
        if (["globals", "render_content"].includes(name)) {
            return name;
        }
        for (let listRef of [umListRef, hmListRef, jsListRef]) {
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
        if (["globals", "render_content"].includes(identifier)) {
            return identifier;
        }
        for (let listRef of [jsListRef, umListRef, hmListRef]) {
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
        if (identifier === "globals") {
            return globalsInfoRef.current;
        }
        if (identifier === "render_content") {
            return renderContentInfoRef.current;
        }
        for (let listRef of [option_list_ref, export_list_ref, save_list_ref, jsListRef, umListRef, hmListRef]) {
            const item = getListItemFromidentifier(identifier, listRef.current);
            if (item) {
                return item;
            }
        }
        return null
    }

    function updateGlobals(itemUpdate) {

        setGlobalsInfo(prevGlobalsInfo => ({
            ...prevGlobalsInfo,
            ...itemUpdate
        }));
    }

    function updateRenderContent(itemUpdate) {
        setRenderContentInfo(prevRenderContentInfo => ({
            ...prevRenderContentInfo,
            ...itemUpdate
        }));
    }

    function setItem(identifier, item) {
        if (["globals", "render_content"].includes(identifier)) {
            if (identifier === "globals") {
                updateGlobals(item);
            } else if (identifier === "render_content") {
                updateRenderContent(item);
            }
            return;
        }
        for (let [listRef, dispatch] of [[jsListRef, jsDispatch], [umListRef, umDispatch], [hmListRef, hmDispatch]]) {
            const existingItem = getListItemFromidentifier(identifier, listRef.current);
            if (existingItem) {
                dispatch({type: "update_item", identifier: identifier, new_item: item});
                return;
            }
        }
    }

    function save_success(data) {
        let identifier;
        updateRenderContent(data.render_content_line_numbers);
        const umLineNumbers = data["user_methods_line_numbers"];
        for (let name of Object.keys(umLineNumbers)) {
            identifier = getIdentifierFromNameInLIst(umListRef, name);
            setLineNumbers(umLineNumbers[name], identifier, umDispatch);
        }
        const hmLineNumbers = data["used_handler_methods_line_numbers"];
        for (let name of Object.keys(hmLineNumbers)) {
            identifier = getIdentifierFromNameInLIst(hmListRef, name);
            setLineNumbers(hmLineNumbers[name], identifier, hmDispatch);
        }
        _update_saved_state();
    }

    function _update_saved_state() {
        last_save.current = _getSaveDict();
    }

    function _highlightLine(item, lnumber) {
        try {
            if (item == null || !item.cmObject) {
                return
            }
            rline_number.current = null;
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
            const local_number = rline_number.current;
            rline_number.current = null;
            errorDrawerFuncs.closeErrorDrawer();
            for (let item of [globalsInfoRef.current, renderContentInfoRef.current]) {
                if (local_number >= item["firstLineNumber"] && local_number <= item["lastLineNumber"]) {
                    showTab(item["identifier"]);
                    _highlightLine(item, local_number);
                    return;
                }
            }
            for (let listRef of [umListRef, hmListRef]) {
                for (let item of listRef.current) {
                    if (local_number >= item["firstLineNumber"] && local_number <= item["lastLineNumber"]) {
                        showTab(item["identifier"]);
                        _highlightLine(item, local_number);
                        break;
                    }
                }
            }
        }
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

    function showTab(newTabIdentifier, callback=null) {
        if (!visibleTabListRef.current.includes(newTabIdentifier)) {
            let new_tab_list = [...visibleTabListRef.current];
            new_tab_list.push(newTabIdentifier);
            setVisibleTabList(new_tab_list);
            scrollToPane(newTabIdentifier);
            pushCallback(callback)
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
    let gi = globalsInfoRef.current;
    codeElemDict["globals"] = () => {
        return (
            <CmElement cmState={gi}
                       allowSignatureChange={false}
                       allowDelete={false}
                       argString={""}
                       cmDispatch={null}
                       updateItem={updateGlobals}
                       showSignatureHeader={false}
                       directSet={setGlobalsInfo}
                       cmObjectRef={null}
                       name={gi["name"]}
                       registerCmObject={registerCmObject}
                       identifier={"globals"}
                       extraKeys={_extraKeys}
                       saveAndCheckpoint={_saveAndCheckpoint}
                       searchState={searchState}
                       searchDispatch={searchDispatch}
                       search_ref={null}
                       pushCallback={pushCallback}
                       tsocket={props.tsocket}
                       extraSelfCompletions={extraSelfCompletionsRef.current}
                       local_id={props.local_id}
                       show_search={false}/>
        )
    };

    let ri = renderContentInfoRef.current;
    codeElemDict["render_content"] = () => {
        return (
            <CmElement cmState={ri}
                       allowSignatureChange={false}
                       allowDelete={false}
                       argString={""}
                       cmDispatch={null}
                       updateItem={updateRenderContent}
                       directSet={setRenderContentInfo}
                       cmObjectRef={null}
                       name={ri["name"]}
                       registerCmObject={registerCmObject}
                       identifier={"render_content"}
                       extraKeys={_extraKeys}
                       saveAndCheckpoint={_saveAndCheckpoint}
                       searchState={searchState}
                       searchDispatch={searchDispatch}
                       search_ref={null}
                       pushCallback={pushCallback}
                       tsocket={props.tsocket}
                       extraSelfCompletions={extraSelfCompletionsRef.current}
                       local_id={props.local_id}
                       show_search={false}/>
        )
    };

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
                           local_id={props.local_id}
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
                           identifier={hm["identifier"]}
                           extraKeys={_extraKeys}
                           saveAndCheckpoint={_saveAndCheckpoint}
                           searchState={searchState}
                           searchDispatch={searchDispatch}
                           search_ref={null}
                           pushCallback={pushCallback}
                           tsocket={props.tsocket}
                           extraSelfCompletions={extraSelfCompletionsRef.current}
                           local_id={props.local_id}
                           show_search={false}/>
            )
        }
    }
    for (let js of jsListRef.current) {
        codeElemDict[js["identifier"]] = () => {
            return (
                <CmElement cmState={js}
                           allowDelete={true}
                           showSignatureHeader={true}
                           allowSignatureChange={true}
                           argString={js["argString"]}
                           cmDispatch={jsDispatch}
                           cmObjectRef={null}
                           registerCmObject={registerCmObject}
                           name={js["name"]}
                           identifier={js["identifier"]}
                           extraKeys={_extraKeys}
                           saveAndCheckpoint={_saveAndCheckpoint}
                           searchState={searchState}
                           searchDispatch={searchDispatch}
                           search_ref={null}
                           pushCallback={pushCallback}
                           tsocket={props.tsocket}
                           extraSelfCompletions={extraSelfCompletionsRef.current}
                           local_id={props.local_id}
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

    const sections = [
        {
            kind: "direct",
            visible: true,
            editable: false,
            dispatch: () => {
            },
            start_expanded: false,
            identifier: "metadata",
            name: "Metadata",
            icon: pane_type_icons["metadata"],
            start_open: true,
        },
        {
            kind: "direct",
            visible: true,
            editable: false,
            dispatch: () => {
            },

            start_expanded: false,
            identifier: "globals",
            name: "globals",
            mode: "python",
            icon: pane_type_icons["globals"],
        },
        {
            kind: "direct",
            visible: true,
            editable: false,
            dispatch: () => {
            },
            identifier: "render_content",
            name: "render_content",
            mode: "python",
            icon: pane_type_icons["render_content"],
        },
        {kind: "divider", name: "Options Divider", visible: true},
        {
            title: "options",
            kind: "section",
            visible: true,
            editable: true,
            icon: pane_type_icons["option"],
            icon_dict: option_icons,
            icon_field: "type",
            start_expanded: false,
            item_base: {
                name: "new_item",
                tags: "",
                default: null,
                pool_select_type: null,
                special_list: []
            },
            sub_items: option_list_ref.current,
            dispatch: optionDispatch
        },
        {
            title: "exports", kind: "section", visible: true, editable: true, icon: pane_type_icons["export"],
            start_expanded: false,
            item_base: {
                name: "new_item",
                tags: "",
            },
            sub_items: export_list_ref.current, dispatch: exportDispatch
        },
        {
            title: "save_attrs", kind: "section",
            visible: !metadataRef.current.couple_save_attrs_and_exports,
            start_expanded: false,
            item_base: {
                name: "new_item",
                tags: "",
            },
            editable: true, icon: pane_type_icons["save"], sub_items: save_list_ref.current, dispatch: saveDispatch
        },
        {kind: "divider", name: "Methods Divider", visible: true},

        {
            title: "user methods", visible: true, editable: true, icon: pane_type_icons["user_method"],
            mode: "python",
            item_base: {
                name: "new_item",
                argString: "",
                codeText: "",
                mode: "python",
                firstLineNumber: 1,
            },
            start_expanded: false, sub_items: umListRef.current, dispatch: umDispatch
        },
        {
            title: "handler methods",
            visible: true,
            editable: true,
            mode: "python",
            item_base: {
                name: "new_item",
                argString: "",
                codeText: "",
                mode: "python",
                firstLineNumber: 1,
            },
            icon: pane_type_icons["handler_method"],
            sub_items: hmListRef.current,
            start_expanded: false,
            createFromList: true,
            choiceDict: props.all_handler_methods,
            dispatch: hmDispatch
        },
        {
            title: "javascript",
            visible: true,
            editable: true,
            icon: pane_type_icons["javascript"],
            start_expanded: false,
            mode: "javascript",
            item_base: {
                name: "new_item",
                argString: "",
                codeText: "",
                mode: "javascript",
                firstLineNumber: 1,
            },
            dispatch: jsDispatch,
            sub_items: jsListRef.current,
        },
    ];

    let left_pane = (
        <Fragment>
            <MakerNavigator handleTabSelect={_handleTabSelect}
                            pushCallback={pushCallback}
                            is_mpl={my_props.is_mpl}
                            is_d3={my_props.is_d3}
                            sections={sections}/>
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
    );

    let gitem = globalsInfoRef.current;
    right_pane_list.push(
        <PaneElement key="globals" el={gitem} dispatch={null}
                     directSet={setGlobalsInfo}
                     pane_height={gitem["pane_height"]}
                     pane_scroll_ref={pane_scroll_ref}
                     icon={pane_type_icons["globals"]}
                     updateItem={updateGlobals}
                     visible={visibleTabListRef.current.includes("globals")}
                     identifier="globals" pushCallback={pushCallback}>
            {codeElemDict["globals"]?.()}
        </PaneElement>
    );

    let item = renderContentInfoRef.current;
    right_pane_list.push(
        <PaneElement key="render_content" el={item} dispatch={null}
                     directSet={setRenderContentInfo}
                     pane_height={item["pane_height"]}
                     pane_scroll_ref={pane_scroll_ref}
                     icon={pane_type_icons["render_content"]}
                     updateItem={updateRenderContent}
                     visible={visibleTabListRef.current.includes("render_content")}
                     identifier={"render_content"} pushCallback={pushCallback}>
            {codeElemDict["render_content"]?.()}
        </PaneElement>
    );

    for (let key of Object.keys(optionElemDict)) {
        if (visibleTabListRef.current.includes(key)) {
            right_pane_list.push(
                <DividerElement text="Options" key="options-divider" icon={pane_type_icons["option"]}/>
            );
            break;
        }
    }

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
        if (visibleTabListRef.current.includes(key)) {
            right_pane_list.push(
                <DividerElement text="Exports" key="exports-divider" icon={pane_type_icons["export"]}/>
            );
            break;
        }
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
        if (visibleTabListRef.current.includes(key)) {
            right_pane_list.push(
                <DividerElement text="Save Attrs" key="save-divider" icon={pane_type_icons["save"]}/>
            );
            break;
        }
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

    for (let item of umListRef.current) {
        if (visibleTabListRef.current.includes(item["identifier"])) {
            right_pane_list.push(
                <DividerElement text="User Methods" key="um-divider" icon={pane_type_icons["user_method"]}/>
            );
            break;
        }
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

    for (let item of hmListRef.current) {
        if (visibleTabListRef.current.includes(item["identifier"])) {
            right_pane_list.push(
                <DividerElement text="Handler Methods" key="hm-divider" icon={pane_type_icons["handler_method"]}/>
            );
            break;
        }
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
    for (let item of jsListRef.current) {
        if (visibleTabListRef.current.includes(item["identifier"])) {
            right_pane_list.push(
                <DividerElement text="Javascript Functions" key="js-divider" icon={pane_type_icons["javascript"]}/>
            );
            break;
        }
    }
    for (let item of jsListRef.current) {
        right_pane_list.push(
            <PaneElement key={item["identifier"]} el={item} dispatch={jsDispatch} pane_height={item["pane_height"]}
                         pane_scroll_ref={pane_scroll_ref}
                         allowDelete={true} visible={visibleTabListRef.current.includes(item["identifier"])}
                         identifier={item["identifier"]} pushCallback={pushCallback}>
                {codeElemDict[item["identifier"]]?.()}
            </PaneElement>
        )
    }

    let right_pane = (
        <div style={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}
             className="creator-right-pane">
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
            <div style={{overflow: "auto", flex: "1 1 0", minWidth: 0, paddingBottom: 250}}
                 className="creator-pane-list">
                {right_pane_list}
            </div>
        </div>
    );

    let outer_style = {
        width: `calc(100% - ${ICON_BAR_WIDTH}px)`,
        height: "100%",
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        position: "relative"
    };
    let outer_class = "resource-viewer-holder pane-holder resource-viewer-left-pane-holder top-padded";
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
                              global_id={props.global_id}
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
            <div style={{
                display: "flex", flexDirection: "column",
                position: "relative",
                height: "100%",
                width: "100%"
            }}>
                {the_element}
            </div>
        )
    }

    renderSpinnerMessage("Starting up ...", '#creator-root');
    let local_id = "a" + guid();
    let tsocket = new TacticSocket("main", 5000, "creator", local_id, async () => {
        tsocket.attachListener('handle-callback', (task_packet) => {
            handleCallback(task_packet, local_id)
        });

        postPromise("host", "initiate_creator_in_context", {tile_module_name: window.module_name,
            local_id}, local_id)
            .then((data) => {
                data.tsocket = tsocket;
                data.local_id = local_id;
                data.read_only = window.read_only;
                data.is_repository = window.is_repository;
                creator_props(data, null, gotProps, null)
            })
    });
}


if (!window.in_context) {
    tile_creator_main();
}
