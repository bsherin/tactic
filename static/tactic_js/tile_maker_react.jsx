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

import {Button, ButtonGroup, Checkbox, useHotkeys} from "@blueprintjs/core";

import {EditorView} from "@codemirror/view";
import {EditorSelection} from "@codemirror/state";

import {creator_props} from "./tile_maker_support";
import {TacticMenubar} from "./menu_utilities"
import {sendToRepository} from "./resource_viewer_react_app";
import {HorizontalPanes, RightDrawerPanes} from "./resizing_allotment";
import {postPromise, postPromiseMain, handleCallback, postWithCallback} from "./communication_react"
import {withStatus, doFlash, StatusContext} from "./toaster"
import {withAssistant} from "./assistant";
import {ICON_BAR_WIDTH} from "./sizing_tools";
import {withErrorDrawer} from "./error_drawer";
import {renderSpinnerMessage, convertExtraKeys, useStateAndRef} from "./utilities_react"
import {TacticNavbar} from "./blueprint_navbar";
import {ErrorBoundary} from "./error_boundary";
import {useCallbackStack, withRegisterActivity} from "./utilities_react";
import {SelectedPaneContext, guid} from "./utilities_react";
import {SettingsContext, withSettings} from "./settings";
import {DialogContext, withDialogs} from "./modal_react";
import {ErrorDrawerContext} from "./error_drawer";
import {useConnection} from "./tactic_socket";

import {usePropertyList, getListItemFromidentifier} from "./property_list"
import {useStateAndRefWithUndo, withUndo, UndoContext} from "./undo";
import {useSearch} from "./search_reducer"
import {MakerPaneContext} from "./tile_maker_support";
import {
    CmElement, PaneElement, MakerNavigator, OptionModuleForm, WidgetModuleForm, ExportModuleForm, MetadataModule, DividerElement,
    option_icons, INITIAL_CODE_PANE_HEIGHT, INITIAL_FORM_PANE_HEIGHT, pane_type_icons
} from "./tile_maker_elements";
import {widgetIcons} from "./widget_info"
import {useMetadata} from "./metadata_reducer";
import {
    TileMakerLocalSettings,
    TileMakerSearchForm,
    TileMakerSearchResultsPane
} from "./tile_maker_search_form";

export {CreatorApp}

function isUserMethodDivider(item) {
    return item && item.kind === "divider";
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
        selectTab: null,
        ...props
    };
    const top_ref = useRef(null);
    const search_ref = useRef(null);
    const last_save = useRef({});
    const rline_number = useRef(props.initial_line_number);
    const pane_scroll_ref = useRef(null);
    const paneListRef = useRef(null);
    const debugSocketListenersRef = useRef([]);

    const  {handleUndo, handleRedo, undoStackRef, redoStackRef} = useContext(UndoContext);


    const [, setVisibleTabList, visibleTabListRef] = useStateAndRef([]);
    const [, setExpandedSubList, expandedSubListRef] = useStateAndRef([]);
    const [, setExpandedSectionList, expandedSectionListRef] = useStateAndRef([]);
    const [, setMethodsToOpen, methodsToOpenRef] = useStateAndRef(props.interface_state != null && "visibleMethodList" in props.interface_state ?
        props.interface_state.visibleMethodList : ["render_content"]);


    const [, optionDispatch, option_list_ref] = usePropertyList(props.option_list, INITIAL_FORM_PANE_HEIGHT, {special_list: []});
    const [, widgetDispatch, widget_list_ref] = usePropertyList(props.widget_list, INITIAL_FORM_PANE_HEIGHT, {});
    const [, exportDispatch, export_list_ref] = usePropertyList(props.export_list,  INITIAL_FORM_PANE_HEIGHT, {tags: ""});
    const [, saveDispatch, save_list_ref] = usePropertyList(props.additional_save_attrs ? props.additional_save_attrs : [], INITIAL_FORM_PANE_HEIGHT);
    const [, umDispatch, umListRef] = usePropertyList(props.user_methods_list, INITIAL_CODE_PANE_HEIGHT);
    const [, hmDispatch, hmListRef] = usePropertyList(props.used_handler_methods_list, INITIAL_CODE_PANE_HEIGHT);
    const [, jsDispatch, jsListRef] = usePropertyList(props.javascript_functions_list, INITIAL_CODE_PANE_HEIGHT);

    const [showSearchResultsPane, setShowSearchResultsPane] = useState(false);

    function _selectSearchResult(result, isCurrent=false) {
        if (isCurrent) {
            _handleTabSelect(result.identifier);
            return;
        }
        searchDispatch({
            type: "GOTO_SEARCH_MATCH",
            payload: {
                identifier: result.identifier,
                matchNumber: result.matchNumber ?? 0
            }
        });

        pushCallback(() => {
            showTab(result.identifier);
        });
    }
    
    const otherCmObjects = useRef(new Set());

    const [, setRenderContentInfo, renderContentInfoRef] = useStateAndRefWithUndo({
        pane_height: INITIAL_CODE_PANE_HEIGHT,
        ...props.render_content_info
    });

    const [, setGlobalsInfo, globalsInfoRef] = useStateAndRefWithUndo({
        pane_height: INITIAL_CODE_PANE_HEIGHT,
        ...props.globals_info
    });

    const [, metadataDispatch, metadataRef] = useMetadata(props.mdata, true);

    const [searchState, searchDispatch, searchStateRef] = useSearch(
        [globalsInfoRef, renderContentInfoRef],
        [umListRef, hmListRef, jsListRef],
        [
            {kind: "options", ref: option_list_ref},
            {kind: "widgets", ref: widget_list_ref},
            {kind: "exports", ref: export_list_ref},
            {kind: "save_attrs", ref: save_list_ref},
        ]
    );

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
            },
            {
                combo: "Ctrl+X",
                global: false,
                group: "Tile Creator",
                label: "Redo",
                onKeyDown: handleRedo
            },
            {
                combo: "Cmd+X",
                global: false,
                group: "Tile Creator",
                label: "Redo",
                onKeyDown: handleRedo
            },
            {
                combo: "Ctrl+F",
                global: false,
                group: "Tile Creator",
                label: "Search",
                onKeyDown: () => {
                    search_ref.current.focus();
                    return false
                }
            },
            {
                combo: "Cmd+F",
                global: false,
                group: "Tile Creator",
                label: "Search",
                onKeyDown: () => {
                    search_ref.current.focus();
                    return true
                }
            },
            {
                combo: "F5",
                global: false,
                group: "Debugger",
                label: "Start or Continue",
                preventDefault: true,
                onKeyDown: () => {
                    startOrContinueDebugger();
                    return true;
                }
            },
            {
                combo: "F10",
                global: false,
                group: "Debugger",
                label: "Step Over",
                preventDefault: true,
                onKeyDown: () => {
                    sendDebugCommand("next");
                    return true;
                }
            },
            {
                combo: "F11",
                global: false,
                group: "Debugger",
                label: "Step Into",
                preventDefault: true,
                onKeyDown: () => {
                    sendDebugCommand("step");
                    return true;
                }
            },
            {
                combo: "Shift+F11",
                global: false,
                group: "Debugger",
                label: "Step Out",
                preventDefault: true,
                onKeyDown: () => {
                    sendDebugCommand("return");
                    return true;
                }
            },
            {
                combo: "Shift+F5",
                global: false,
                group: "Debugger",
                label: "Stop Debugging",
                preventDefault: true,
                onKeyDown: () => {
                    stopDebugger();
                    return true;
                }
            }
        ], [_saveMe, _saveAndLoadModule, _saveAndCheckpoint]
    );
    const {handleKeyDown, handleKeyUp} = useHotkeys(hotkeys);

    const pushCallback = useCallbackStack();

    const [resource_name, set_resource_name] = useState(props.resource_name);

    const [debugTargets, setDebugTargets, debugTargetsRef] = useStateAndRef([]);
    const [debugTargetId, setDebugTargetId, debugTargetIdRef] = useStateAndRef(null);
    const [debugSession, setDebugSession, debugSessionRef] = useStateAndRef(null);
    const [debugStatus, setDebugStatus, debugStatusRef] = useStateAndRef("idle");
    const [debugPaused, setDebugPaused, debugPausedRef] = useStateAndRef(null);
    const [debugFrameIndex, setDebugFrameIndex] = useState(0);
    const [debugDrawerOpen, setDebugDrawerOpen] = useState(false);
    const [debugInterfaceVisible, setDebugInterfaceVisible] = useState(debuggerInterfaceInitialVisible);
    const [debugBreakpoints, setDebugBreakpoints, debugBreakpointsRef] = useStateAndRef([]);
    const [debugPauseOnExceptions, setDebugPauseOnExceptions, debugPauseOnExceptionsRef] = useStateAndRef(false);
    const [debugMessage, setDebugMessage] = useState("");
    const debugDrawerInitialFractionRef = useRef(debuggerDrawerInitialFraction());
    const sourceInfoRef = useRef(props.source_info);

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
                postWithCallback("host", "end_client_session_task", {global_id: window.global_id, force_forward: true})
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
            const activeDebugSession = debugSessionRef.current;
            if (activeDebugSession) {
                postWithCallback(activeDebugSession.debugQueue, "debug_command", {
                    session_id: activeDebugSession.sessionId,
                    command: "abort",
                }, null, null, props.local_id);
            }
            for (const [event, listener] of debugSocketListenersRef.current) {
                props.tsocket.detachListener(event, listener);
            }
            debugSocketListenersRef.current = [];
            for (let listRef of [jsListRef, umListRef, hmListRef]) {
                destroyCmObjects(listRef);
            }
            for (const cm of otherCmObjects.current) {
                if (cm) {
                    cm.destroy();
                }
            }

            otherCmObjects.current.clear();
            clearUndoStack(undoStackRef);

            errorDrawerFuncs.setGoToLineNumber(null);
            visibleTabListRef.current = null;
            expandedSubListRef.current = null;
            methodsToOpenRef.current = null;
            if (props.controlled) {
                props.registerDirtyMethod(null);
            }
            metadataRef.current = null;
            undoStackRef.current = [];
            searchStateRef.current = [];
            extraSelfCompletionsRef.current = [];
            if (props.controlled) {
                postWithCallback("module_viewer", "end_module_viewer_session_task", {"local_id": props.local_id})
            }
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
        if (searchStateRef.current.search_string === "") {
            setShowSearchResultsPane(false);
        }
        else {
            setShowSearchResultsPane(true);
        }
    }, [searchStateRef.current.search_string]);


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
            if (isUserMethodDivider(um) && !um.preserve_as_method) {
                continue;
            }
            // noinspection JSUnresolvedReference
            extraSelfCompletionsRef.current.push({
                label: um["name"],
                info: `${um["name"]}(${um["argString"]})`,
                type: "function",
                section: "Local"
            });
        }

    }, [option_list_ref.current, umListRef.current]);

    function initSocket(theSocket) {
        theSocket.attachListener('focus-me', (data) => {
            window.focus();
            _selectLineNumber(data.line_number)
        });

        const pausedListener = (data) => {
            const session = debugSessionRef.current;
            if (!session || data.session_id !== session.sessionId) return;
            setDebugPaused(data);
            setDebugFrameIndex(0);
            setDebugDrawerOpen(true);
            setDebugStatus("paused");
            setDebugMessage(data.exception
                ? `Paused on ${data.exception.type} in ${data.function} at line ${data.line}`
                : `Paused in ${data.function} at line ${data.line}`);
            if (props.selectTab) props.selectTab();
            _revealDebugLine(data.line);
        };

        const completedListener = (data) => {
            const session = debugSessionRef.current;
            if (!session || data.session_id !== session.sessionId) return;
            setDebugPaused(null);
            setDebugFrameIndex(0);
            setDebugSession(null);
            setDebugStatus("idle");
            const label = data.status === "aborted"
                ? "Debug session stopped"
                : data.status === "exception"
                    ? "Debug session ended after the exception"
                    : "Debug session completed";
            setDebugMessage(`${label} (${data.pause_count} pause${data.pause_count === 1 ? "" : "s"})`);
        };

        const timeoutListener = (data) => {
            const session = debugSessionRef.current;
            if (!session || data.session_id !== session.sessionId) return;
            setDebugPaused(null);
            setDebugFrameIndex(0);
            setDebugStatus("running");
            setDebugMessage("The pause timed out; the tile event is continuing.");
        };

        for (const [event, listener] of [
            ['debug-paused', pausedListener],
            ['debug-completed', completedListener],
            ['debug-timeout', timeoutListener],
        ]) {
            theSocket.attachListener(event, listener);
            debugSocketListenersRef.current.push([event, listener]);
        }

        if (!window.in_context) {
            theSocket.attachListener("doFlashUser", function (data) {
                doFlash(data)
            });
            theSocket.attachListener('close-user-windows', (data) => {
                if (!(data["originator"] == window.global_id)) {
                    window.close()
                }
            });
            theSocket.attachListener("endSession", function () {
                dialogFuncs.showModal("EndSessionDialog", {})
            })
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

    function registerCmObject(cmObject, previousCmObject = null) {
        if (previousCmObject) {
            otherCmObjects.current.delete(previousCmObject);
        }

        if (cmObject) {
            otherCmObjects.current.add(cmObject);
        }
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
            }, {
                name_text: "Redo",
                icon_name: "redo",
                click_handler: handleRedo,
                key_bindings: ['Ctrl+X', 'Cmd+X']
            }
            ],
            View: [
                {name_text: "Close All", icon_name: "eye-off", click_handler: hideAllTabs},
                {name_text: "Collapse All", icon_name: "collapse-all", click_handler: _collapseAll}
            ],
            Debug: [
                {
                    name_text: debugInterfaceVisible ? "Hide Debug Toolbar" : "Show Debug Toolbar",
                    icon_name: debugInterfaceVisible ? "eye-off" : "eye-open",
                    click_handler: toggleDebugInterface
                },
                {
                    name_text: debugDrawerOpen ? "Hide Debug Inspector" : "Show Debug Inspector",
                    icon_name: "properties",
                    click_handler: () => setDebugDrawerOpen(open => !open)
                },
                {
                    name_text: debugPauseOnExceptions ? "Disable Exception Pausing" : "Enable Exception Pausing",
                    icon_name: "issue",
                    click_handler: () => setDebugPauseOnExceptions(enabled => !enabled)
                },
                {name_text: "divider-debug-controls"},
                {
                    name_text: "Start / Continue",
                    icon_name: "play",
                    click_handler: startOrContinueDebugger,
                    key_bindings: ["F5"]
                },
                {
                    name_text: "Sync & Start",
                    icon_name: "refresh",
                    click_handler: syncAndStartDebugger
                },
                {
                    name_text: "Step Over",
                    icon_name: "chevron-right",
                    click_handler: () => sendDebugCommand("next"),
                    key_bindings: ["F10"]
                },
                {
                    name_text: "Step Into",
                    icon_name: "step-forward",
                    click_handler: () => sendDebugCommand("step"),
                    key_bindings: ["F11"]
                },
                {
                    name_text: "Step Out",
                    icon_name: "chevron-up",
                    click_handler: () => sendDebugCommand("return"),
                    key_bindings: ["Shift+F11"]
                },
                {
                    name_text: "Stop Debugging",
                    icon_name: "stop",
                    click_handler: stopDebugger,
                    key_bindings: ["Shift+F5"]
                }
            ],
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

    function menu_disabled_items() {
        const disabled = [];
        if (debugSession != null || debugStatus === "starting") {
            disabled.push("Sync & Start");
            disabled.push(debugPauseOnExceptions ? "Disable Exception Pausing" : "Enable Exception Pausing");
        }
        if (debugStatus !== "paused") {
            disabled.push("Step Over", "Step Into", "Step Out");
        }
        if (debugSession == null) {
            disabled.push("Stop Debugging");
        }
        if ((debugSession != null && debugStatus !== "paused") || debugStatus === "starting") {
            disabled.push("Start / Continue");
        }
        return disabled;
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
                search_ref.current.focus();
                return true
            },
            'Cmd-f': () => {
                search_ref.current.focus();
                return true
            },
        };
        let convertedKeys = convertExtraKeys(ekeys);
        let moreKeys = [
            {
                key: 'Ctrl-g', run: () => {
                    _searchNext();
                }, preventDefault: true
            },
            {
                key: 'Ctrl-Space', run: ()=>{
                    selectedPane.showOmnibar();
                    return true
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
            },
            {
                key: 'Ctrl-y', run: () => {
                    handleRedo();
                }, preventDefault: true
            },
            {
                key: 'Cmd-y', run: () => {
                    handleRedo();
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
            let currentValue = current_state[k];
            let savedValue = last_save.current[k];
            if (k === "mdata") {
                currentValue = {...currentValue};
                savedValue = {...savedValue};
                // This nonce is deliberately regenerated for every save.  It
                // identifies a metadata revision, not an unsaved user edit.
                delete currentValue.mdata_uid;
                delete savedValue.mdata_uid;
            }
            if (!_.isEqual(currentValue, savedValue)) {
                return true
            }
        }
        return false
    }

    function _debuggerSourceState(saveState) {
        const stripEditorFields = (item) => {
            const cleanItem = {...item};
            for (const field of [
                "pane_height", "identifier", "mode", "show_dot", "helperText",
                "firstLineNumber", "lastLineNumber", "cmObject", "scrollTop"
            ]) {
                delete cleanItem[field];
            }
            return cleanItem;
        };
        return {
            module_name: saveState.module_name,
            couple_save_attrs_and_exports: saveState.mdata?.couple_save_attrs_and_exports,
            exports: (saveState.exports || []).map(stripEditorFields),
            globals_info: stripEditorFields(saveState.globals_info || {}),
            render_content_info: stripEditorFields(saveState.render_content_info || {}),
            additional_save_attrs: (saveState.additional_save_attrs || []).map(stripEditorFields),
            options: (saveState.options || []).map(stripEditorFields),
            widgets: (saveState.widgets || []).map(stripEditorFields),
            user_methods: (saveState.user_methods || []).map(stripEditorFields),
            used_handler_methods: (saveState.used_handler_methods || []).map(stripEditorFields),
            javascript_functions: (saveState.javascript_functions || []).map(stripEditorFields),
        };
    }

    function _debuggerSourceDirty() {
        return !_.isEqual(
            _debuggerSourceState(_getSaveDict()),
            _debuggerSourceState(last_save.current || {})
        );
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
        // These are regenerated from the assembled module on every save.
        // Treating them as editable state makes a successful save look dirty.
        delete newItem.firstLineNumber;
        delete newItem.lastLineNumber;
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
        if (redoStackRef.current) {
            for (let entry of redoStackRef.current) {
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
        let widgetsToSave = removeNotSavedThings(widget_list_ref)
        for (let w of widgetsToSave) {
            delete w["pane_height"];
            delete w["identifier"];
            delete w["show_dot"];
            delete w["helperText"]
        }
        return {
            "module_name": _cProp("resource_name"),
            "mdata": mdata,
            "exports": removeNotSavedThings(export_list_ref),
            "globals_info": removeNotSavedThingsFromItem(globalsInfoRef.current),
            "render_content_info": removeNotSavedThingsFromItem(renderContentInfoRef.current),
            "additional_save_attrs": removeNotSavedThings(save_list_ref),
            "options": removeNotSavedThings(option_list_ref),
            "widgets": widgetsToSave,
            "user_methods": removeNotSavedThings(umListRef),
            "used_handler_methods": removeNotSavedThings(hmListRef),
            "javascript_functions": removeNotSavedThings(jsListRef),
            "is_mpl": props.is_mpl,
            "is_d3": props.is_d3,
            "last_viewer": "creator",
        };
    }

    function getAIContext(activeEditor) {
        if (settingsContext.settingsRef.current["ai_code_suggestion_context"] !== "full tile") {
            return null;
        }
        return {
            kind: "tile",
            tile: _getSaveDict(),
            active_editor: activeEditor,
        };
    }

    function doSavePromise() {
        return new Promise(async (resolve, reject) => {
            const saved_dict = _getSaveDict();
            let result_dict = {...saved_dict};
            result_dict["local_id"] = props.local_id;
            let data;
            try {
                data = await postPromise("module_viewer", "update_module", result_dict, props.local_id);
                save_success(data, saved_dict);
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

        setGlobalsInfo({
            ...globalsInfoRef.current,
            ...itemUpdate
        });
    }

    function updateRenderContent(itemUpdate) {
        setRenderContentInfo({
            ...renderContentInfoRef.current,
            ...itemUpdate
        });
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

    function save_success(data, savedDict) {
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
        if (data.source_info) {
            sourceInfoRef.current = data.source_info;
        }
        // Line-number state updates are scheduled by React, so reconstructing
        // the save dictionary here can see a mixture of old and new values.
        // The payload that just succeeded is the authoritative clean state.
        last_save.current = _.cloneDeep(savedDict);
    }

    function debuggerErrorMessage(error) {
        if (error && error.breakpoint_errors && error.breakpoint_errors.length) {
            return error.breakpoint_errors.map(item => `Line ${item.line}: ${item.message}`).join("; ");
        }
        if (error && error.message) return error.message;
        if (typeof error === "string") return error;
        return "The debugger request failed.";
    }

    async function refreshDebugTargets() {
        if (!window.in_context) {
            throw {message: "Open this Tile Maker inside a running project to select a tile instance."};
        }
        const result = await postPromise(
            "main_service",
            "get_tile_debug_targets",
            {
                global_id: window.global_id,
                tile_type: props.tile_type,
                module_name: _cProp("resource_name"),
            },
            props.local_id
        );
        const targets = result.targets || [];
        setDebugTargets(targets);
        let selected = debugTargetIdRef.current;
        if (!targets.some(target => target.tile_id === selected)) {
            selected = targets.length ? targets[0].tile_id : null;
            setDebugTargetId(selected);
        }
        return {targets, selected};
    }

    function sortBreakpoints(breakpoints) {
        return [...breakpoints].sort((a, b) =>
            a.identifier.localeCompare(b.identifier) || a.line - b.line
        );
    }

    function toggleBreakpoint(identifier, lineNumber) {
        if (debugSessionRef.current) {
            setDebugMessage("Stop the current debug session before changing breakpoints.");
            return;
        }
        setDebugBreakpoints(previous => {
            const exists = previous.some(breakpoint =>
                breakpoint.identifier === identifier && breakpoint.line === lineNumber
            );
            if (exists) {
                return previous.filter(breakpoint => !(
                    breakpoint.identifier === identifier && breakpoint.line === lineNumber
                ));
            }
            return sortBreakpoints([...previous, {identifier: identifier, line: lineNumber}]);
        });
        setDebugMessage("");
    }

    function replaceEditorBreakpoints(identifier, lineNumbers) {
        if (debugSessionRef.current) return;
        const uniqueLines = [...new Set(lineNumbers)].sort((a, b) => a - b);
        setDebugBreakpoints(previous => {
            const otherEditors = previous.filter(breakpoint => breakpoint.identifier !== identifier);
            const replacements = uniqueLines.map(line => ({identifier: identifier, line: line}));
            const next = sortBreakpoints([...otherEditors, ...replacements]);
            return _.isEqual(previous, next) ? previous : next;
        });
    }

    function breakpointFirstLine(breakpoint, savedLineNumbers = null) {
        if (savedLineNumbers) {
            if (breakpoint.identifier === "globals") return 1;
            if (breakpoint.identifier === "render_content") {
                return savedLineNumbers.render_content_line_numbers.firstLineNumber;
            }
            const item = getItemFromIdentifier(breakpoint.identifier);
            const methodName = item?.name;
            if (methodName in savedLineNumbers.user_methods_line_numbers) {
                return savedLineNumbers.user_methods_line_numbers[methodName].firstLineNumber;
            }
            if (methodName in savedLineNumbers.used_handler_methods_line_numbers) {
                return savedLineNumbers.used_handler_methods_line_numbers[methodName].firstLineNumber;
            }
        }
        return getItemFromIdentifier(breakpoint.identifier)?.firstLineNumber;
    }

    function absoluteDebugBreakpoints(savedLineNumbers = null) {
        return debugBreakpointsRef.current.map(breakpoint => {
            const firstLineNumber = breakpointFirstLine(breakpoint, savedLineNumbers);
            if (firstLineNumber == null) {
                throw {message: "A breakpoint belongs to a source editor that is no longer available."};
            }
            return firstLineNumber + breakpoint.line - 1;
        });
    }

    async function selectedDebugTarget(alwaysRefresh = false) {
        let targets = debugTargetsRef.current;
        let selected = debugTargetIdRef.current;
        if (alwaysRefresh || !targets.length || !selected) {
            const refreshed = await refreshDebugTargets();
            targets = refreshed.targets;
            selected = refreshed.selected;
        }
        if (!selected) {
            throw {message: `No running ${props.tile_type || "tile"} instance was found.`};
        }
        const target = targets.find(candidate => candidate.tile_id === selected);
        if (!target) {
            throw {message: "The selected running tile is no longer available."};
        }
        return target;
    }

    async function armDebugTarget(target, savedLineNumbers = null) {
        if (!sourceInfoRef.current || !sourceInfoRef.current.source_hash) {
            throw {message: "Save this tile once before starting the debugger."};
        }
        const breakpoints = absoluteDebugBreakpoints(savedLineNumbers);
        const result = await postPromise(target.tile_id, "arm_debugger", {
            breakpoints: breakpoints,
            pause_on_start: breakpoints.length === 0 && !debugPauseOnExceptionsRef.current,
            pause_on_exceptions: debugPauseOnExceptionsRef.current,
            source_hash: sourceInfoRef.current.source_hash,
            debug_room: props.local_id,
        }, props.local_id);
        setDebugSession({
            sessionId: result.session_id,
            debugQueue: result.debug_queue,
            targetId: target.tile_id,
        });
        setDebugPaused(null);
        setDebugFrameIndex(0);
        setDebugStatus("armed");
        setDebugMessage(breakpoints.length
            ? "Debugger armed. Trigger a tile event to reach a breakpoint."
            : debugPauseOnExceptionsRef.current
                ? "Debugger armed. It will pause when tile code raises an exception."
                : "Debugger armed. The next tile event will pause on its first user-code line.");
    }

    async function startDebugger() {
        if (debugSessionRef.current) return;
        if (_debuggerSourceDirty()) {
            setDebugMessage("Save the tile before starting the debugger so its line numbers are current.");
            return;
        }
        setDebugStatus("starting");
        setDebugMessage("Finding running tile instances...");
        try {
            const target = await selectedDebugTarget();
            await armDebugTarget(target);
        } catch (error) {
            setDebugStatus("idle");
            setDebugMessage(debuggerErrorMessage(error));
        }
    }

    async function syncAndStartDebugger() {
        if (debugSessionRef.current) return;
        setDebugStatus("starting");
        try {
            setDebugMessage("Finding the running tile instance...");
            const target = await selectedDebugTarget(true);
            if (!target.main_sid) {
                throw {message: "The selected tile is missing its owning main session."};
            }

            let savedLineNumbers = null;
            if (_debuggerSourceDirty()) {
                setDebugMessage("Saving tile source...");
                savedLineNumbers = await doSavePromise();
            }

            setDebugMessage("Loading the saved module...");
            await postPromise("host", "load_tile_module_task", {
                tile_module_name: _cProp("resource_name"),
                user_id: window.user_id,
            }, props.local_id);

            setDebugMessage(`Reloading ${target.tile_name}...`);
            await postPromiseMain(target.main_sid, "reload_tile", {
                tile_id: target.tile_id,
                tile_name: target.tile_name,
            }, props.local_id);

            setDebugMessage("Arming debugger...");
            await armDebugTarget(target, savedLineNumbers);
        } catch (error) {
            setDebugStatus("idle");
            setDebugMessage(debuggerErrorMessage(error));
        }
    }

    async function sendDebugCommand(command) {
        const session = debugSessionRef.current;
        const pausedSnapshot = debugPausedRef.current;
        if (!session || !pausedSnapshot) return;
        try {
            setDebugStatus(command === "abort" ? "stopping" : "running");
            setDebugPaused(null);
            setDebugFrameIndex(0);
            setDebugMessage(command === "abort" ? "Stopping debugger..." : "Running...");
            await postPromise(session.debugQueue, "debug_command", {
                session_id: session.sessionId,
                command: command,
            }, props.local_id);
        } catch (error) {
            setDebugStatus("paused");
            setDebugPaused(pausedSnapshot);
            setDebugMessage(debuggerErrorMessage(error));
        }
    }

    function startOrContinueDebugger() {
        if (debugPausedRef.current) {
            return sendDebugCommand("continue");
        }
        if (!debugSessionRef.current && debugStatusRef.current !== "starting") {
            return startDebugger();
        }
    }

    async function stopDebugger() {
        const session = debugSessionRef.current;
        if (!session) return;
        try {
            setDebugStatus("stopping");
            setDebugMessage("Stopping debugger...");
            const result = await postPromise(session.debugQueue, "debug_command", {
                session_id: session.sessionId,
                command: "abort",
            }, props.local_id);
            if (result.state === "disarmed") {
                setDebugSession(null);
                setDebugPaused(null);
                setDebugFrameIndex(0);
                setDebugStatus("idle");
                setDebugMessage("Debugger disarmed.");
            }
        } catch (error) {
            setDebugMessage(debuggerErrorMessage(error));
        }
    }

    function _update_saved_state() {
        last_save.current = _getSaveDict();
    }

    function selectDebugFrame(index) {
        const frame = debugPausedRef.current?.stack?.[index];
        if (!frame) return;
        setDebugFrameIndex(index);
        if (props.selectTab) props.selectTab();
        _revealDebugLine(frame.line);
    }

    function debuggerDrawerInitialFraction() {
        try {
            const stored = Number(window.localStorage.getItem("tactic.tile-debugger.drawer-fraction"));
            if (Number.isFinite(stored) && stored >= 0.2 && stored <= 0.6) return stored;
        } catch (_error) {
            // Storage can be unavailable in privacy-restricted browser contexts.
        }
        return 0.32;
    }

    function debuggerInterfaceInitialVisible() {
        try {
            return window.localStorage.getItem("tactic.tile-debugger.toolbar-visible") !== "false";
        } catch (_error) {
            return true;
        }
    }

    function toggleDebugInterface() {
        setDebugInterfaceVisible(visible => {
            const nextVisible = !visible;
            try {
                window.localStorage.setItem(
                    "tactic.tile-debugger.toolbar-visible",
                    String(nextVisible)
                );
            } catch (_error) {
                // The toolbar can still be toggled without persistent storage.
            }
            return nextVisible;
        });
    }

    function rememberDebuggerDrawerFraction(fraction) {
        try {
            window.localStorage.setItem("tactic.tile-debugger.drawer-fraction", String(fraction));
        } catch (_error) {
            // Resizing should still work when persistent storage is unavailable.
        }
    }

    function _highlightLine(item, lnumber) {
        try {
            if (item == null || !item.cmObject) {
                return false
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
            cm.focus();
            return true
        } catch (e) {
            console.log("Error in selectLine", e)
            return false
        }

    }

    function _highlightLineWhenReady(identifier, lnumber, attemptsRemaining = 30) {
        const currentItem = getItemFromIdentifier(identifier);
        if (_highlightLine(currentItem, lnumber) || attemptsRemaining <= 0) {
            return;
        }
        requestAnimationFrame(() => {
            _highlightLineWhenReady(identifier, lnumber, attemptsRemaining - 1)
        });
    }

    function _scrollDebugLine(item, lnumber) {
        try {
            if (item == null || !item.cmObject) return false;
            const cm = item.cmObject;
            const line = cm.state.doc.line(lnumber + 1 - item.firstLineNumber);
            cm.dispatch({
                effects: EditorView.scrollIntoView(line.from, {y: "center"})
            });
            return true;
        } catch (e) {
            console.log("Error revealing debugger line", e);
            return false;
        }
    }

    function _scrollDebugLineWhenReady(identifier, lnumber, attemptsRemaining = 30) {
        const currentItem = getItemFromIdentifier(identifier);
        if (_scrollDebugLine(currentItem, lnumber) || attemptsRemaining <= 0) return;
        requestAnimationFrame(() => {
            _scrollDebugLineWhenReady(identifier, lnumber, attemptsRemaining - 1)
        });
    }

    function _revealDebugLine(lnumber) {
        const allItems = [
            globalsInfoRef.current,
            renderContentInfoRef.current,
            ...umListRef.current,
            ...hmListRef.current,
        ];
        const item = allItems.find(candidate =>
            lnumber >= candidate.firstLineNumber && lnumber <= candidate.lastLineNumber
        );
        if (!item) return;
        showTab(item.identifier);
        _scrollDebugLineWhenReady(item.identifier, lnumber);
    }

    function _showAndHighlightLine(item, lnumber) {
        showTab(item.identifier);
        _highlightLineWhenReady(item.identifier, lnumber);
    }

    function _goToLineNumber() {
        if (rline_number.current) {
            const local_number = rline_number.current;
            rline_number.current = null;
            errorDrawerFuncs.closeErrorDrawer();
            for (let item of [globalsInfoRef.current, renderContentInfoRef.current]) {
                if (local_number >= item["firstLineNumber"] && local_number <= item["lastLineNumber"]) {
                    _showAndHighlightLine(item, local_number);
                    return;
                }
            }
            for (let listRef of [umListRef, hmListRef]) {
                for (let item of listRef.current) {
                    if (local_number >= item["firstLineNumber"] && local_number <= item["lastLineNumber"]) {
                        _showAndHighlightLine(item, local_number);
                        return;
                    }
                }
            }
        }
    }

    function scrollToPane(itemIdentifier) {
        pane_scroll_ref.current = itemIdentifier;
    }

    function hideAllTabs() {
        setVisibleTabList([]);
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

    function _handleSubSectionSelect(newTabIdentifier, forceVisible=false) {
        let new_tab_list = [...expandedSubListRef.current];
        if (!new_tab_list.includes(newTabIdentifier)) {
            new_tab_list.push(newTabIdentifier);
        } else if (!forceVisible) {
            new_tab_list = new_tab_list.filter(tab => tab !== newTabIdentifier);
        }
        setExpandedSubList(new_tab_list)
    }

    function _collapseAllSubSections() {
        setExpandedSubList([]);
    }

    function _collapseAll() {
        setExpandedSubList([]);
        setExpandedSectionList([]);
    }

    function _handleSectionSelect(newSectionIdentifier, forceVisible=false) {
        let new_section_list = [...expandedSectionListRef.current];
        if (!new_section_list.includes(newSectionIdentifier)) {
            new_section_list.push(newSectionIdentifier);
        } else if (!forceVisible) {
            new_section_list = new_section_list.filter(tab => tab !== newSectionIdentifier);
        }
        setExpandedSectionList(new_section_list)
    }

    function _setSectionOpen(sectionIdentifier, isOpen) {
        let new_section_list = [...expandedSectionListRef.current];
        if (isOpen) {
            if (!new_section_list.includes(sectionIdentifier)) {
                new_section_list.push(sectionIdentifier);
            }
        }
        else {
            new_section_list = new_section_list.filter(tab => tab !== sectionIdentifier);
        }
        setExpandedSectionList(new_section_list)
    }

    function _collapseAllSections() {
        setExpandedSectionList([]);
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
                       getAIContext={getAIContext}
                       aiContextGroup="globals"
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
                       getAIContext={getAIContext}
                       aiContextGroup="render_content"
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
        if (isUserMethodDivider(um) && !um.preserve_as_method) {
            continue;
        }
        codeElemDict[um["identifier"]] = () => {
            return (
                <CmElement cmState={um}
                           getAIContext={getAIContext}
                           aiContextGroup="user_methods"
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
                           getAIContext={getAIContext}
                           aiContextGroup="used_handler_methods"
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
                           getAIContext={getAIContext}
                           aiContextGroup="javascript_functions"
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

    let widgetElemDict = {};
    for (let w of widget_list_ref.current) {
        widgetElemDict[w["identifier"]] = () => {
            return (
                <WidgetModuleForm widgetItem={w}
                                  dispatch={widgetDispatch}/>
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
            identifier: "metadata",
            className: "direct-nav-section-button",
            name: "Metadata",
            icon: pane_type_icons["metadata"],
        },
        {kind: "divider", name: "Required Divider", visible: true},
        {
            kind: "direct",
            visible: true,
            editable: false,
            dispatch: () => {
            },
            className: "direct-nav-section-button-mono",
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
            className: "direct-nav-section-button-mono",
            name: "render_content",
            mode: "python",
            icon: pane_type_icons["render_content"],
        },
        {kind: "divider", name: "Options Divider", visible: true},
        {
            title: "options",
            identifier: "options",
            kind: "section",
            visible: true,
            editable: true,
            icon: pane_type_icons["option"],
            icon_dict: option_icons,
            icon_field: "type",
            showDefault: false,
            showSelf: true,
            showAsCode: true,
            mode: "python",
            item_base: {
                name: "new_item",
                tags: "",
                default: null,
                pool_select_type: null,
                special_list: [],
                value: "text"
            },
            sub_items: option_list_ref.current,
            dispatch: optionDispatch
        },
        {
            title: "widgets",
            identifier: "widgets",
            kind: "section",
            visible: true,
            editable: true,
            icon: pane_type_icons["widget"],
            icon_dict: widgetIcons,
            icon_field: "kind",
            showDefault: false,
            showSelf: true,
            showAsCode: true,
            mode: "python",
            item_base: {
                name: "new_text_widget",
                kind: "text",
                value: "",
                ellipsize: false,
                to_render: true,
                style: "{}",
            },
            sub_items: widget_list_ref.current,
            dispatch: widgetDispatch
        },
        {
            title: "exports",
            identifier: "exports",
            kind: "section", visible: true, editable: true, icon: pane_type_icons["export"],
            showAsCode: true,
            showSelf: true,
            mode: "python",
            item_base: {
                name: "new_item",
                tags: "",
            },
            sub_items: export_list_ref.current, dispatch: exportDispatch
        },
        {
            title: "save_attrs",
            identifier: "save_attrs",
            kind: "section",
            visible: !metadataRef.current.couple_save_attrs_and_exports,
             item_base: {
                name: "new_item",
                tags: "",
            },
            editable: true, icon: pane_type_icons["save"], sub_items: save_list_ref.current, dispatch: saveDispatch
        },
        {kind: "divider", name: "Methods Divider", visible: true},

        {
            title: "user methods",
            identifier: "user_methods",
            visible: true, editable: true, icon: pane_type_icons["user_method"],
            mode: "python",
            showAsCode: true,
            showSignature: true,
            item_base: {
                kind: "method",
                name: "new_item",
                argString: "",
                codeText: "",
                mode: "python",
                firstLineNumber: 1,
            },
            allowDividers: true,
            sub_items: umListRef.current, dispatch: umDispatch
        },
        {
            title: "handler methods",
            identifier: "handler_methods",
            visible: true,
            editable: true,
            mode: "python",
            showAsCode: true,
            item_base: {
                name: "new_item",
                argString: "",
                codeText: "",
                mode: "python",
                firstLineNumber: 1,
            },
            icon: pane_type_icons["handler_method"],
            showSignature: true,
            sub_items: hmListRef.current,
            createFromList: true,
            choiceDict: props.all_handler_methods,
            dispatch: hmDispatch
        },
        {
            title: "javascript",
            identifier: "javascript",
            visible: true,
            editable: true,
            icon: pane_type_icons["javascript"],
            mode: "javascript",
            showAsCode: true,
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
                            registerCmObject={registerCmObject}
                            expandedSectionList={expandedSectionListRef.current}
                            setSectionOpen={_setSectionOpen}
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
                     paneListRef={paneListRef}
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
                      paneListRef={paneListRef}
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
                      paneListRef={paneListRef}
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
                          paneListRef={paneListRef}
                         className="form-pane" visible={visibleTabListRef.current.includes(key)}
                         allowDelete={true} dispatch={optionDispatch} pushCallback={pushCallback}>
                {optionElemDict[key]?.()}
            </PaneElement>
        )
    }
    for (let key of Object.keys(widgetElemDict)) {
        if (visibleTabListRef.current.includes(key)) {
            right_pane_list.push(
                <DividerElement text="Widgets" key="widgets-divider" icon={pane_type_icons["widget"]}/>
            );
            break;
        }
    }

    for (let key of Object.keys(widgetElemDict)) {
        const item = getListItemFromidentifier(key, widget_list_ref.current);
        right_pane_list.push(
            <PaneElement identifier={key} key={key} pane_height={item.pane_height}
                         pane_scroll_ref={pane_scroll_ref}
                          paneListRef={paneListRef}
                         className="form-pane" visible={visibleTabListRef.current.includes(key)}
                         allowDelete={true} dispatch={widgetDispatch} pushCallback={pushCallback}>
                {widgetElemDict[key]?.()}
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
                          paneListRef={paneListRef}
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
                          paneListRef={paneListRef}
                         className="form-pane" visible={visibleTabListRef.current.includes(key)}
                         allowDelete={true} dispatch={saveDispatch} pushCallback={pushCallback}>
                {saveElemDict[key]?.()}
            </PaneElement>
        )
    }

    for (let item of umListRef.current) {
        if (isUserMethodDivider(item) && !item.preserve_as_method) {
            continue;
        }
        if (visibleTabListRef.current.includes(item["identifier"])) {
            right_pane_list.push(
                <DividerElement text="User Methods" key="um-divider" icon={pane_type_icons["user_method"]}/>
            );
            break;
        }
    }

    for (let item of umListRef.current) {
        if (isUserMethodDivider(item) && !item.preserve_as_method) {
            continue;
        }
        right_pane_list.push(
            <PaneElement key={item["identifier"]} el={item} pane_height={item["pane_height"]}
                         pane_scroll_ref={pane_scroll_ref}
                          paneListRef={paneListRef}
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
                          paneListRef={paneListRef}
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
                          paneListRef={paneListRef}
                         allowDelete={true} visible={visibleTabListRef.current.includes(item["identifier"])}
                         identifier={item["identifier"]} pushCallback={pushCallback}>
                {codeElemDict[item["identifier"]]?.()}
            </PaneElement>
        )
    }

    let editor_pane = (
    <div
        ref={paneListRef}
        style={{
            overflow: "auto",
            flex: "1 1 0",
            minHeight: 0,
            minWidth: 0,
            paddingBottom: 250,
        }}
        className="creator-pane-list"
    >
        {right_pane_list}
    </div>
);

let search_results_pane = showSearchResultsPane ? (
    <TileMakerSearchResultsPane
        searchStateRef={searchStateRef}
        onSelectResult={_selectSearchResult}
        onClose={() => setShowSearchResultsPane(false)}
    />
) : null;

let right_pane = (
    <div
        style={{
            width: "100%",
            height: "100%",
            display: "flex",
            minHeight: 0,
            minWidth: 0,
            flexDirection: "column",
        }}
        className="creator-right-pane"
    >
        <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between",
            padding: "4px 8px"}}>
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
            showSearchResultsPane={() => setShowSearchResultsPane(true)}
            showSearchResult={(identifier) => {
                showTab(identifier);
            }}
        />
            <TileMakerLocalSettings/>
        </div>

        <div
            className="creator-search-and-editor-row"
            style={{
                display: "flex",
                flexDirection: "row",
                flex: "1 1 0",
                minHeight: 0,
                minWidth: 0,
                width: "100%",
            }}
        >
            {editor_pane}
            {search_results_pane}
        </div>
    </div>
);

    const debugStack = debugPaused?.stack?.length
        ? debugPaused.stack
        : debugPaused
            ? [{
                function: debugPaused.function,
                line: debugPaused.line,
                locals: debugPaused.locals || [],
            }]
            : [];
    const selectedDebugFrame = debugStack[debugFrameIndex] || debugStack[0] || null;
    const selectedDebugLocals = selectedDebugFrame?.locals || [];
    const debugExceptionMessage = (() => {
        if (!debugPaused?.exception) return "";
        const message = debugPaused.exception.message || "";
        const wrapper = `${debugPaused.exception.type}(`;
        return message.startsWith(wrapper) && message.endsWith(")")
            ? message.slice(wrapper.length, -1)
            : message;
    })();

    const debugger_panel = (
        <div className={`tile-debugger-panel tile-debugger-${debugStatus}`}
             style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginRight: 25}}>
            <div className="tile-debugger-toolbar">
                <span className="tile-debugger-title">Debugger</span>
                <select className="tile-debugger-target"
                        aria-label="Running tile instance"
                        value={debugTargetId || ""}
                        disabled={debugSession != null}
                        onChange={event => setDebugTargetId(event.target.value || null)}>
                    {!debugTargets.length && <option value="">Running tile...</option>}
                    {debugTargets.map(target => (
                        <option key={target.tile_id} value={target.tile_id}>
                            {target.tile_name} ({target.tile_id.slice(-8)})
                        </option>
                    ))}
                </select>
                <Button variant="minimal" size="small" icon="refresh"
                        title="Refresh running tile instances"
                        disabled={debugSession != null}
                        onClick={() => refreshDebugTargets().catch(error =>
                            setDebugMessage(debuggerErrorMessage(error)))}/>
                <Button variant="minimal" size="small" icon="play"
                        disabled={debugSession != null || debugStatus === "starting"}
                        onClick={startDebugger}>Start Debug</Button>
                <Button variant="minimal" size="small" icon="changes"
                        title="Save source changes, load the module, reload this tile, and arm the debugger"
                        loading={debugStatus === "starting"}
                        disabled={debugSession != null || debugStatus === "starting"}
                        onClick={syncAndStartDebugger}>Sync &amp; Start</Button>
                <ButtonGroup variant="minimal" className="tile-debugger-step-buttons">
                    <Button size="small" icon="play" title="Continue"
                            disabled={debugStatus !== "paused"}
                            onClick={() => sendDebugCommand("continue")}/>
                    <Button size="small" icon="chevron-down" title="Step into"
                            disabled={debugStatus !== "paused"}
                            onClick={() => sendDebugCommand("step")}/>
                    <Button size="small" icon="chevron-right" title="Step over"
                            disabled={debugStatus !== "paused"}
                            onClick={() => sendDebugCommand("next")}/>
                    <Button size="small" icon="chevron-up" title="Step out"
                            disabled={debugStatus !== "paused"}
                            onClick={() => sendDebugCommand("return")}/>
                </ButtonGroup>
                <Button variant="minimal" size="small" icon="stop" intent="danger" title="Stop debugging"
                        disabled={debugSession == null}
                        onClick={stopDebugger}/>
                <span className="tile-debugger-breakpoint-count">
                    {debugBreakpoints.length} breakpoint{debugBreakpoints.length === 1 ? "" : "s"}
                </span>
                <Checkbox className="tile-debugger-exception-toggle"
                          label="Exceptions"
                          title="Pause where tile code raises an exception"
                          checked={debugPauseOnExceptions}
                          disabled={debugSession != null}
                          onChange={event => setDebugPauseOnExceptions(event.target.checked)}/>
                <span className="tile-debugger-message">{debugMessage}</span>
            </div>
            <Button variant="minimal" size="small" icon="properties"
                    active={debugDrawerOpen}
                    title={debugDrawerOpen ? "Hide debugger drawer" : "Show debugger drawer"}
                    onClick={() => setDebugDrawerOpen(open => !open)}>
                Inspector
            </Button>
        </div>
    );

    const debugger_drawer = (
        <aside className={`tile-debugger-drawer tile-debugger-${debugStatus}`}>
            <div className="tile-debugger-drawer-header">
                <div>
                    <span className="tile-debugger-title">Debugger</span>
                    <span className="tile-debugger-drawer-status">{debugStatus}</span>
                </div>
                <Button variant="minimal" size="small" icon="cross"
                        title="Close debugger drawer"
                        onClick={() => setDebugDrawerOpen(false)}/>
            </div>
            {debugPaused ? (
                <div className="tile-debugger-inspector">
                    {debugPaused.exception && (
                        <div className="tile-debugger-exception">
                            <strong>{debugPaused.exception.type}</strong>
                            <code>{debugExceptionMessage}</code>
                        </div>
                    )}
                    <div className="tile-debugger-location">
                        {selectedDebugFrame?.function} · line {selectedDebugFrame?.line}
                    </div>
                    <div className="tile-debugger-inspector-body">
                        <div className="tile-debugger-stack" aria-label="Call stack">
                            <div className="tile-debugger-section-title">Call stack</div>
                            {debugStack.map((frame, index) => (
                                <button type="button"
                                        key={`${frame.function}-${frame.line}-${index}`}
                                        className={index === debugFrameIndex ? "active" : ""}
                                        onClick={() => selectDebugFrame(index)}>
                                    <span>{frame.function}</span>
                                    <code>line {frame.line}</code>
                                </button>
                            ))}
                        </div>
                        <div className="tile-debugger-variables">
                            <div className="tile-debugger-section-title">Local variables</div>
                            <div className="tile-debugger-locals">
                                {selectedDebugLocals.length === 0 &&
                                    <span className="tile-debugger-empty">No local variables</span>}
                                {selectedDebugLocals.map(variable => (
                                    <div className="tile-debugger-local" key={variable.name}>
                                        <span className="tile-debugger-local-name">{variable.name}</span>
                                        <span className="tile-debugger-local-type">{variable.type}</span>
                                        <code className="tile-debugger-local-value">{variable.value}</code>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="tile-debugger-drawer-empty">
                    <span>{debugMessage || "Start debugging to inspect the call stack and local variables."}</span>
                </div>
            )}
        </aside>
    );

    let outer_style = {
        width: `calc(100% - ${ICON_BAR_WIDTH}px)`,
        height: "100%",
        flexGrow: 1,
        display: 'flex',
        minHeight: 0,
        minWidth: 0,
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
                              user_name={window.username}/>
            }
            <TacticMenubar menu_specs={menu_specs()}
                           disabled_items={menu_disabled_items()}
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
                           showPoolDrawerButton={true}
                           controlled={props.controlled}
            />
            <ErrorBoundary custom_message="Error outside context provider">

                <MakerPaneContext.Provider value={{
                    visibleTabList: visibleTabListRef.current,
                    setVisibleTabList: setVisibleTabList,
                    expandedSubList: expandedSubListRef.current,
                    setExpandedSubList: setExpandedSubList,
                    toggleVisibleTab: _handleTabSelect,
                    toggleExpandedSub: _handleSubSectionSelect,
                    pushCallback: pushCallback,
                    debugBreakpoints: debugBreakpoints,
                    debugLine: debugPaused ? debugPaused.line : null,
                    toggleBreakpoint: toggleBreakpoint,
                    replaceEditorBreakpoints: replaceEditorBreakpoints,
                }}>
                    <div className={outer_class} ref={top_ref} style={outer_style}
                         tabIndex="0" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
                        {debugInterfaceVisible && debugger_panel}
                        <RightDrawerPanes
                            open={debugDrawerOpen}
                            initial_drawer_fraction={debugDrawerInitialFractionRef.current}
                            onDrawerResizeEnd={rememberDebuggerDrawerFraction}
                            main_pane={(
                                <ErrorBoundary custom_message="Error in HorizontalPanes">
                                    <HorizontalPanes left_pane={left_pane}
                                                     right_pane={right_pane}
                                                     show_handle={true}
                                                     initial_width_fraction={.2}
                                                     handleSplitUpdate={null}
                                    />
                                </ErrorBoundary>
                            )}
                            drawer={debugger_drawer}
                        />
                    </div>
                </MakerPaneContext.Provider>
            </ErrorBoundary>
        </ErrorBoundary>
    );
}

CreatorApp = memo(CreatorApp);

function tile_creator_main() {
    function gotProps(the_props) {
        let CreatorAppPlus = withUndo(withRegisterActivity(withSettings(withDialogs(withErrorDrawer(withStatus(withAssistant(CreatorApp)))))));
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
                minHeight: 0,
                minWidgh: 0,
                height: "100%",
                width: "100%"
            }}>
                {the_element}
            </div>
        )
    }

    renderSpinnerMessage("Starting up ...", '#creator-root');
    let local_id = "a" + guid();
    if (!window.in_context) {
        window.global_id = local_id;
    }
    let tsocket = new TacticSocket("main", 5000, "creator", local_id, async () => {
        tsocket.attachListener('handle-callback', (task_packet) => {
            handleCallback(task_packet, local_id)
        });

        postPromise("host", "initiate_creator_in_context", {tile_module_name: window.module_name,
            global_id: window.global_id, local_id}, local_id)
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
