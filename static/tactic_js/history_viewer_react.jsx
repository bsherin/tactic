/**
 * Tile history viewer. Historical source is parsed into the same logical
 * sections used by Tilemaker, with raw source retained as a fallback.
 */

import "../tactic_css/tactic.scss";
import "../tactic_css/themeable.scss";

import React, {Fragment, memo, useContext, useEffect, useMemo, useRef, useState} from "react";
import {createRoot} from "react-dom/client";
import {Button, ButtonGroup, Callout, Collapse, Icon, Tag} from "@blueprintjs/core";

import {ReactCodemirrorMergeView6} from "./react-codemirror-mergeview6";
import {BpSelect} from "./selector_advanced";
import {ErrorDrawerContext, withErrorDrawer} from "./error_drawer";
import {doFlash, StatusContext, withStatus} from "./toaster";
import {handleCallback, postPromise, postWithCallback} from "./communication_react";
import {guid, withRegisterActivity} from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";
import {TacticMenubar} from "./menu_utilities";
import {TacticSocket, useConnection} from "./tactic_socket";
import {SettingsContext, withSettings} from "./settings";
import {DialogContext, withDialogs} from "./modal_react";
import {ICON_BAR_WIDTH} from "./sizing_tools";


window.global_id = "a" + guid();

const STATUS_PRESENTATION = {
    changed: {intent: "warning", label: "changed"},
    added: {intent: "success", label: "added"},
    removed: {intent: "danger", label: "removed"},
    unchanged: {intent: "none", label: "unchanged"},
};


async function history_viewer_main() {
    function gotProps(the_props) {
        const HistoryViewerAppPlus = withRegisterActivity(
            withSettings(withDialogs(withErrorDrawer(withStatus(HistoryViewerApp))))
        );
        const domContainer = document.querySelector("#root");
        const root = createRoot(domContainer);
        root.render(
            <div style={{
                display: "flex",
                flexDirection: "column",
                position: "relative",
                minHeight: 0,
                minWidth: 0,
                height: "100%",
                width: "100%",
            }}>
                <HistoryViewerAppPlus {...the_props} controlled={false}/>
            </div>
        );
    }

    try {
        history_viewer_props({}, null, gotProps);
    } catch (error) {
        const fallback = `History viewer failed to load${error.message ? `: ${error.message}` : ""}`;
        createRoot(document.querySelector("#root")).render(<pre>{fallback}</pre>);
    }
}


function history_viewer_props(data, registerDirtyMethod, finalCallback) {
    const tsocket = new TacticSocket("main", 5000, "history_viewer", window.global_id, () => {
        tsocket.attachListener("handle-callback", task_packet => {
            handleCallback(task_packet, window.global_id);
        });
        finalCallback({
            local_id: window.global_id,
            tsocket,
            history_list: [],
            resource_name: window.resource_name,
            registerDirtyMethod,
        });
    });
}


function statusTag(status) {
    const presentation = STATUS_PRESENTATION[status] || STATUS_PRESENTATION.unchanged;
    return <Tag minimal={true} intent={presentation.intent}>{presentation.label}</Tag>;
}


function HistoryNavigator({sections, selectedItemKey, onSelect}) {
    const [openSections, setOpenSections] = useState(() => {
        const initialState = {};
        for (const section of sections) initialState[section.id] = true;
        return initialState;
    });
    const [showChangesOnly, setShowChangesOnly] = useState(false);

    function toggleSection(sectionId) {
        setOpenSections(previous => ({
            ...previous,
            [sectionId]: !previous[sectionId],
        }));
    }

    function setAllSections(isOpen) {
        const nextState = {};
        for (const section of sections) nextState[section.id] = isOpen;
        setOpenSections(nextState);
    }

    function toggleChangesOnly() {
        const nextValue = !showChangesOnly;
        setShowChangesOnly(nextValue);
        if (nextValue) {
            const selectedItem = sections
                .flatMap(section => section.items)
                .find(item => item.key === selectedItemKey);
            if (selectedItem && selectedItem.status === "unchanged") {
                const firstChangedItem = sections
                    .flatMap(section => section.items)
                    .find(item => item.status !== "unchanged");
                if (firstChangedItem) onSelect(firstChangedItem.key);
            }
        }
    }

    const visibleSections = showChangesOnly
        ? sections
            .map(section => ({
                ...section,
                items: section.items.filter(item => item.status !== "unchanged"),
            }))
            .filter(section => section.items.length > 0)
        : sections;

    return (
        <div className="maker-navigator" style={{height: "100%", overflow: "auto", padding: "8px 6px 16px"}}>
            <ButtonGroup fill={false} variant="minimal" style={{marginBottom: 8, display: "flex", justifyContent: "flex-end"}}>
                <Button icon="collapse-all"
                        size="small"
                        title="Collapse all sections"
                        aria-label="Collapse all sections"
                        onClick={() => setAllSections(false)}/>
                <Button icon="expand-all"
                        size="small"
                        title="Expand all sections"
                        aria-label="Expand all sections"
                        onClick={() => setAllSections(true)}/>
                <Button icon="delta"
                        size="small"
                        active={showChangesOnly}
                        intent={showChangesOnly ? "primary" : "none"}
                        aria-pressed={showChangesOnly}
                        title="Show only changed, added, or removed items"
                        onClick={toggleChangesOnly}/>
            </ButtonGroup>
            {visibleSections.map(section => {
                const isOpen = openSections[section.id] !== false;
                return (
                    <div key={section.id} className="nav-section" style={{marginBottom: 5}}>
                        <Button variant="minimal"
                                className="nav-section-button"
                                icon={section.icon}
                                fill={true}
                                alignText="left"
                                aria-expanded={isOpen}
                                onClick={() => toggleSection(section.id)}>
                            <span style={{
                                alignItems: "center",
                                display: "flex",
                                fontWeight: 600,
                                gap: 7,
                                minWidth: 0,
                                width: "100%",
                            }}>
                                <span style={{flexGrow: 1}}>{section.title}</span>
                                <span style={{opacity: 0.65, fontSize: 11}}>{section.items.length}</span>
                                <Icon icon={isOpen ? "chevron-down" : "chevron-right"} size={12}/>
                            </span>
                        </Button>
                        <Collapse isOpen={isOpen}>
                            {section.items.map(item => (
                                <Button key={item.key}
                                        variant="minimal"
                                        intent={selectedItemKey === item.key ? "primary" : "none"}
                                        fill={true}
                                        alignText="left"
                                        onClick={() => onSelect(item.key)}
                                        style={{minHeight: 30, paddingLeft: 20}}>
                                    <span style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                        minWidth: 0,
                                        width: "100%",
                                    }}>
                                        <span style={{overflow: "hidden", textOverflow: "ellipsis", flexGrow: 1}}>
                                            {item.name}
                                        </span>
                                        {statusTag(item.status)}
                                    </span>
                                </Button>
                            ))}
                            {section.items.length === 0 &&
                                <div style={{opacity: 0.5, fontSize: 12, padding: "2px 20px"}}>None</div>}
                        </Collapse>
                    </div>
                );
            })}
            {showChangesOnly && visibleSections.length === 0 &&
                <div style={{opacity: 0.65, fontSize: 12, padding: "8px 10px"}}>
                    No changed items
                </div>}
        </div>
    );
}


function HistoryViewerApp(props) {
    const [historyList, setHistoryList] = useState(props.history_list);
    const [selectedDate, setSelectedDate] = useState("");
    const [comparison, setComparison] = useState(null);
    const [selectedItemKey, setSelectedItemKey] = useState(null);
    const [currentSource, setCurrentSource] = useState("");
    const [historicalSource, setHistoricalSource] = useState("");
    const [showRaw, setShowRaw] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const [loadMessage, setLoadMessage] = useState("");
    const requestCounter = useRef(0);

    const connectionStatus = useConnection(props.tsocket, initSocket);
    const statusFuncs = useContext(StatusContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);
    const dialogFuncs = useContext(DialogContext);
    const settingsContext = useContext(SettingsContext);

    useEffect(() => {
        function beforeUnloadFunc() {
            postWithCallback("host", "end_client_session_task", {
                global_id: window.global_id,
                force_forward: true,
            });
        }
        window.addEventListener("beforeunload", beforeUnloadFunc);
        initialize().then();
        return () => window.removeEventListener("beforeunload", beforeUnloadFunc);
    }, []);

    function initSocket(theSocket) {
        theSocket.attachListener("window-open", data => {
            window.open(`${$SCRIPT_ROOT}/load_temp_page/${data.the_id}`);
        });
        theSocket.attachListener("close-user-windows", data => {
            if (data.originator !== window.global_id) window.close();
        });
        theSocket.attachListener("doflashUser", doFlash);
        theSocket.attachListener("endSession", () => dialogFuncs.showModal("EndSessionDialog", {}));
    }

    function reportError(title, error) {
        errorDrawerFuncs.addErrorDrawerEntry({
            title,
            content: error && error.message ? error.message : "",
        });
    }

    async function initialize() {
        statusFuncs.startSpinner();
        try {
            const [currentData, historyData] = await Promise.all([
                postPromise("host", "get_tile_content_task", {tile_module_name: props.resource_name}),
                postPromise("host", "get_checkpoint_dates_task", {module_name: props.resource_name}),
            ]);
            const checkpoints = historyData.checkpoints || [];
            setHistoryList(checkpoints);
            setCurrentSource(currentData.tile_content);
            if (checkpoints.length === 0) {
                setLoadMessage("No saved history is available for this tile.");
                setInitialized(true);
                return;
            }
            setSelectedDate(checkpoints[0].updatestring);
            await loadCheckpoint(checkpoints[0], currentData.tile_content);
        } catch (error) {
            setLoadMessage(error && error.message ? error.message : "No saved history is available for this tile.");
            reportError("Error loading tile history", error);
        } finally {
            setInitialized(true);
            statusFuncs.stopSpinner();
        }
    }

    async function loadCheckpoint(checkpoint, suppliedCurrentSource = null) {
        if (!checkpoint) return;
        const requestId = ++requestCounter.current;
        statusFuncs.startSpinner();
        try {
            const currentCodePromise = suppliedCurrentSource == null
                ? postPromise("host", "get_tile_content_task", {tile_module_name: props.resource_name})
                : Promise.resolve({tile_content: suppliedCurrentSource});
            const [currentData, checkpointData] = await Promise.all([
                currentCodePromise,
                postPromise("host", "get_checkpoint_code_task", {
                    module_name: props.resource_name,
                    updatestring_for_sort: checkpoint.updatestring_for_sort,
                }),
            ]);
            if (requestId !== requestCounter.current) return;

            const currentCode = currentData.tile_content;
            const oldCode = checkpointData.module_code;
            setCurrentSource(currentCode);
            setHistoricalSource(oldCode);
            setLoadMessage("");

            try {
                const parsed = await postPromise("module_viewer", "parse_tile_history_versions", {
                    current_code: currentCode,
                    historical_code: oldCode,
                });
                if (requestId !== requestCounter.current) return;
                setComparison(parsed.comparison);
                setShowRaw(false);
                const allItems = parsed.comparison.sections.flatMap(section => section.items);
                const firstItem = allItems.find(item => item.status !== "unchanged") || allItems[0];
                setSelectedItemKey(firstItem ? firstItem.key : null);
            } catch (parseError) {
                if (requestId !== requestCounter.current) return;
                setComparison(null);
                setShowRaw(true);
                setLoadMessage("This version could not be parsed as a Tilemaker tile. Showing its raw source instead.");
                reportError("Could not build structured tile history", parseError);
            }
        } catch (error) {
            if (requestId === requestCounter.current) {
                setLoadMessage("The selected checkpoint could not be loaded.");
                reportError("Error getting checkpoint", error);
            }
        } finally {
            if (requestId === requestCounter.current) statusFuncs.stopSpinner();
        }
    }

    async function handleSelectChange(value) {
        if (!value) return;
        const checkpoint = historyList.find(item => item.updatestring === value);
        if (!checkpoint) return;
        setSelectedDate(value);
        await loadCheckpoint(checkpoint);
    }

    async function restoreSelectedCheckpoint() {
        if (!historicalSource || historicalSource === currentSource) return;
        const shouldRestore = window.confirm(
            `Restore ${props.resource_name} from ${selectedDate}? The current version will be checkpointed first.`
        );
        if (!shouldRestore) return;
        statusFuncs.startSpinner();
        try {
            await postPromise("host", "checkpoint_module_task", {module_name: props.resource_name});
            await postPromise("host", "update_from_left_task", {
                module_name: props.resource_name,
                module_code: historicalSource,
            });
            const historyData = await postPromise("host", "get_checkpoint_dates_task", {
                module_name: props.resource_name,
            });
            setHistoryList(historyData.checkpoints || []);
            const checkpoint = (historyData.checkpoints || []).find(
                item => item.updatestring === selectedDate
            );
            if (checkpoint) await loadCheckpoint(checkpoint);
            statusFuncs.statusMessage("Checkpoint restored");
        } catch (error) {
            reportError("Error restoring checkpoint", error);
        } finally {
            statusFuncs.stopSpinner();
        }
    }

    const selectedItem = useMemo(() => {
        if (!comparison || !selectedItemKey) return null;
        for (const section of comparison.sections) {
            const found = section.items.find(item => item.key === selectedItemKey);
            if (found) return found;
        }
        return null;
    }, [comparison, selectedItemKey]);

    const optionList = historyList.map(item => item.updatestring);
    const menuSpecs = {
        History: [
            {
                name_text: "Restore selected checkpoint",
                icon_name: "history",
                click_handler: restoreSelectedCheckpoint,
            },
            {
                name_text: showRaw ? "Show structured comparison" : "Show raw source",
                icon_name: showRaw ? "diagram-tree" : "code",
                click_handler: () => setShowRaw(!showRaw),
            },
        ],
    };
    const disabledMenuItems = [];
    const canRestore = Boolean(historicalSource) && historicalSource !== currentSource;
    if (!canRestore) disabledMenuItems.push("Restore selected checkpoint");
    if (!comparison) {
        disabledMenuItems.push(showRaw ? "Show structured comparison" : "Show raw source");
    }

    const outerClass = `merge-viewer-outer history-viewer-outer ${
        settingsContext.isDark() ? "bp6-dark" : "light-theme"
    }`;
    const editorItem = showRaw ? {
        key: "raw-source",
        name: "Raw tile source",
        status: currentSource === historicalSource ? "unchanged" : "changed",
        mode: "python",
        current_text: currentSource,
        historical_text: historicalSource,
    } : selectedItem;

    return (
        <Fragment>
            {!props.controlled &&
                <TacticNavbar is_authenticated={window.is_authenticated}
                              selected={null}
                              show_api_links={true}
                              user_name={window.username}/>
            }
            <div className={outerClass} style={{
                width: `calc(100% - ${ICON_BAR_WIDTH}px)`,
                flexGrow: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                position: "relative",
            }}>
                <TacticMenubar menu_specs={menuSpecs}
                               disabled_items={disabledMenuItems}
                               connection_status={connectionStatus}
                               showIconBar={true}
                               showErrorDrawerButton={true}
                               showMetadataDrawerButton={false}
                               showAssistantDrawerButton={true}
                               showSettingsDrawerButton={true}
                               showPoolDrawerButton={true}
                               showRefresh={false}
                               showClose={false}
                               resource_name={props.resource_name}
                               controlled={false}/>

                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 10,
                    padding: "7px 14px",
                    borderBottom: "1px solid rgba(128, 128, 128, .3)",
                }}>
                    <BpSelect options={optionList}
                              onChange={handleSelectChange}
                              buttonIcon="history"
                              value={selectedDate}/>
                    <ButtonGroup>
                        <Button icon={showRaw ? "diagram-tree" : "code"}
                                disabled={!comparison}
                                onClick={() => setShowRaw(!showRaw)}>
                            {showRaw ? "Structured" : "Raw source"}
                        </Button>
                        <Button icon="history"
                                intent="warning"
                                disabled={!canRestore}
                                onClick={restoreSelectedCheckpoint}>
                            Restore
                        </Button>
                    </ButtonGroup>
                </div>

                {loadMessage &&
                    <Callout intent={comparison ? "warning" : "primary"} style={{margin: 10}}>
                        {loadMessage}
                    </Callout>}

                {initialized && editorItem &&
                    <div style={{display: "flex", flex: "1 1 0", minHeight: 0, minWidth: 0}}>
                        {!showRaw && comparison &&
                            <div style={{
                                width: 300,
                                flex: "0 0 300px",
                                borderRight: "1px solid rgba(128, 128, 128, .3)",
                                minHeight: 0,
                            }}>
                                <HistoryNavigator sections={comparison.sections}
                                                  selectedItemKey={selectedItemKey}
                                                  onSelect={setSelectedItemKey}/>
                            </div>}
                        <div style={{
                            display: "flex",
                            flex: "1 1 0",
                            flexDirection: "column",
                            minHeight: 0,
                            minWidth: 0,
                            padding: "0 14px 14px",
                        }}>
                            <div style={{display: "flex", justifyContent: "center", gap: 8, padding: "8px 0 5px"}}>
                                <strong>{editorItem.name}</strong>
                                {statusTag(editorItem.status)}
                                <span style={{marginLeft: "auto", opacity: 0.7, paddingRight: 7}}>Current</span>
                                <span style={{marginLeft: "calc(50% - 100px)", opacity: 0.7, paddingRight: 7}}>{selectedDate}</span>
                            </div>
                            <ReactCodemirrorMergeView6 key={`${editorItem.key}:${editorItem.mode}`}
                                                       editor_content={editorItem.current_text}
                                                       right_content={editorItem.historical_text}
                                                       mode={editorItem.mode}
                                                       readOnly={true}/>
                        </div>
                    </div>}
            </div>
        </Fragment>
    );
}


HistoryViewerApp = memo(HistoryViewerApp);

if (!window.in_context) {
    history_viewer_main().then();
}
