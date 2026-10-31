import "../tactic_css/pool.scss";

import React from "react";

import {Fragment, useState, useEffect, useRef, memo, useContext} from "react";

import {Breadcrumb, Breadcrumbs, Switch, Icon, Button, ControlGroup} from "@blueprintjs/core";

import {useStateAndRef} from "./utilities_react";

import {CombinedMetadata} from "./combined_metadata";
import {getBasename, PoolContext} from "./pool_tree";
import {PoolTreeWithContextMenu, PoolMenubar} from "./pool_context_menu";
import {HorizontalPanes} from "./resizing_allotment";
import {postPromise} from "./communication_react";
import {ICON_BAR_WIDTH} from "./sizing_tools";

import {SettingsContext} from "./settings";

export {PoolBrowser, PoolBreadcrumbs}

function PoolBrowser(props) {
    const [, set_selected_resource, selected_resource_ref] = useStateAndRef({
        name: "",
        tags: "",
        notes: "",
        updated: "",
        created: "",
        size: "",
        res_type: null,
    });
    const [, setCurrentRootPath, currentRootPathRef] = useStateAndRef("/mydisk");
    const [value, setValue, valueRef] = useStateAndRef(null);
    const [, setSelectedNode, selectedNodeRef] = useStateAndRef(null);
    const [selectedNodes, setSelectedNodes] = useState([]);
    const [, setContextMenuItems] = useState([]);
    const [have_activated, set_have_activated] = useState(false);
    const [showHidden, setShowHidden] = useState(false);

    const settingsContext = useContext(SettingsContext);

    const [treeRefreshFunc, setTreeRefreshFunc] = useState(null);
    // Important note: The first mounting of the pool tree must happen after the pool pane
    // is first activated. Otherwise, I do GetPoolTree before everything is ready and I don't
    // get the callback for the post.

    useEffect(() => {
        setCurrentRootPath(settingsContext.settings.workingDirectory);
    }, [settingsContext.settings.workingDirectory])

    useEffect(() => {
        if (props.am_selected && !have_activated) {
            set_have_activated(true)
        }
    }, [props.am_selected]);

    useEffect(() => {
        if (selectedNodeRef.current) {
            set_selected_resource({
                name: getBasename(value),
                tags: "",
                notes: "",
                updated: selectedNodeRef.current.updated,
                created: selectedNodeRef.current.created,
                size: String(selectedNodeRef.current.size),
                res_type: selectedNodeRef.current.isDirectory ? "poolDir" : "poolFile"
            })

        } else {
            set_selected_resource({name: "", tags: "", notes: "", updated: "", created: "", res_type: null})
        }
    }, [value]);

    function handleNodeClick(node, nodes, selection = [node]) {
        setValue(node.fullpath);
        setSelectedNode(node);
        setSelectedNodes(selection);
        return true
    }

    function handleSelectionChange(selection) {
        setSelectedNodes(selection);
        if (selection.length === 0) {
            setValue(null);
            setSelectedNode(null)
        } else if (!selection.some(node => node.fullpath === valueRef.current)) {
            setValue(selection[0].fullpath);
            setSelectedNode(selection[0])
        }
    }

    function setRoot(node = null) {
        if (!node) {
            node = selectedNodeRef.current;
        }
        setCurrentRootPath(node.fullpath)
    }

    function setRootToBase() {
        setCurrentRootPath("/mydisk")
    }

    function registerTreeRefreshFunc(func) {
        setTreeRefreshFunc(() => func)
    }


    function setWorkingDirectory() {
        postPromise("host", "update_settings", {"workingDirectory": currentRootPathRef.current}).then(() => {
        })
    }


    let fixed_data = {
        created: selected_resource_ref.current.created,
        updated: selected_resource_ref.current.updated,
        size: selected_resource_ref.current.size,
        path: valueRef.current
    };
    let right_pane = (
        <CombinedMetadata res_type={selected_resource_ref.current.res_type}
                          res_name={selected_resource_ref.current.name}
                          useFixedData={true}
                          fixedData={fixed_data}
                          elevation={2}
                          readOnly={true}
        />
    );

    let left_pane = (
        <Fragment>
            <div className="d-flex flex-column resource-viewer-left-pane-holder top-padded"
                 style={{maxHeight: "100%", position: "relative", overflow: "scroll", flex: "1 1 0"}}>
                {(props.am_selected || have_activated) &&
                    <PoolContext.Provider value={{
                        workingPath: null, setWorkingPath: () => {
                        }
                    }}>
                        <div className="d-flex flex-row" style={{justifyContent: "space-between", marginBottom: 10}}>
                            <PoolBreadcrumbs path={currentRootPathRef.current} setRoot={setRoot}/>
                            <ControlGroup vertical={false}>
                                <Button variant="minimal"
                                        text="Set Default"
                                        textClassName="pool-breadcrumbs-button-text bp6-breadcrumb"
                                        className="bp6-control"
                                        onClick={setWorkingDirectory}
                                        size="small"/>

                                <PoolHiddenSwitch showHidden={showHidden} setShowHidden={setShowHidden}/>
                            </ControlGroup>
                        </div>
                        <PoolTreeWithContextMenu value={valueRef.current}
                                                 setRoot={setRoot}
                                                 currentRootPath={currentRootPathRef.current}
                                                 selectedNode={selectedNodeRef.current}
                                                 showHidden={showHidden}
                                                 handleCreateViewer={props.handleCreateViewer}
                                                 getOpenResources={props.getOpenResources}
                                                 allow_import_and_download={true}
                                                 select_type="both"
                                                 registerTreeRefreshFunc={registerTreeRefreshFunc}
                                                 refreshFunc={treeRefreshFunc}
                                                 list_of_selected={selectedNodes}
                                                 user_id={window.user_id}
                                                 tsocket={props.tsocket}
                                                 showSecondaryLabel={true}
                                                 handleNodeClick={handleNodeClick}
                                                 handleSelectionChange={handleSelectionChange}/>
                    </PoolContext.Provider>
                }
            </div>
            {/*</FileDropWrapper>*/}
        </Fragment>
    );
    let outer_style = {
        width: `calc(100% - ${ICON_BAR_WIDTH}px)`,
        height: "100%",
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 0,
        position: "relative"
    };
    return (
        <div style={outer_style}>
            <PoolMenubar selected_resource={selected_resource_ref.current}
                         value={valueRef.current}
                         selectedNode={selectedNodeRef.current}
                         connection_status={null}
                         multi_select={selectedNodes.length > 1}
                         list_of_selected={selectedNodes}
                         handleSelectionChange={handleSelectionChange}
                         sendContextMenuItems={setContextMenuItems}
                         setRootToBase={setRootToBase}
                         setRoot={setRoot}
                         getOpenResources={props.getOpenResources}
                         refreshFunc={treeRefreshFunc}
                         handleCreateViewer={props.handleCreateViewer}
                         {...props.errorDrawerFuncs}
                         controlled={props.controlled}
                         tsocket={props.tsocket}/>
            <div style={{
                flex: "1 1 0",
                display: "flex",
                minHeight: 0,
                minWidth: 0,
                position: "relative"
            }}>
                <HorizontalPanes
                    outer_hp_style={{}}
                    className="pool-hp"
                    show_handle={true}
                    left_pane={left_pane}
                    right_pane={right_pane}
                    right_pane_overflow="auto"
                    initial_width_fraction={.75}
                />
            </div>
        </div>
    )
}

PoolBrowser = memo(PoolBrowser);

function PoolBreadcrumb(props) {
    props = {
        crumbSize: "large",
        ...props
    };

    let iconSize = props.crumbSize == "small" ? 12 : 16;
    let theIcon = <Icon icon={props.icon} size={iconSize}/>;
    let crumClassName = props.crumbSize == "small" ? "small-pool-breadcrumb" : "pool-breadcrumb";
    return (
        <Breadcrumb className={crumClassName} key={props.path} icon={theIcon} onClick={props.onClick}>
            {props.name}
        </Breadcrumb>
    )
}

function PoolHiddenSwitch(props) {

    function handleShowHiddenChange(event) {
        props.setShowHidden(event.target.checked);
    }

    return (
        <Switch label="show hidden"
                size="medium"
                className="pool-hidden-switch"
                checked={props.showHidden}
                onChange={handleShowHiddenChange}
        />
    )
}

const s3_prefix = "s3://tactic-user-storage/users";

function getPoolRoot(path) {
    if (!path) return null;

    const s3RootMatch = path.match(/^(s3:\/\/[^/]+\/users\/[^/]+)/);
    if (s3RootMatch) return s3RootMatch[1];

    const firstPart = path.split("/").find(part => part !== "");
    return firstPart ? `/${firstPart}` : null
}

function normalizePoolPath(rawPath, currentPath) {
    let path = rawPath.trim();
    const poolRoot = getPoolRoot(currentPath);

    if (!path) {
        return {error: "Enter a pool folder path."}
    }
    if (!poolRoot) {
        return {error: "The pool root is not available yet."}
    }

    if (!path.startsWith("/") && !path.startsWith("s3://")) {
        const rootName = poolRoot.slice(poolRoot.lastIndexOf("/") + 1);
        path = path === rootName || path.startsWith(rootName + "/")
            ? poolRoot.slice(0, poolRoot.lastIndexOf("/") + 1) + path
            : `${poolRoot}/${path}`
    }

    if (path.startsWith("s3://")) {
        path = "s3://" + path.slice("s3://".length).split("/").filter(Boolean).join("/")
    } else {
        path = "/" + path.split("/").filter(Boolean).join("/")
    }

    const pathParts = path.startsWith("s3://")
        ? path.slice("s3://".length).split("/")
        : path.split("/");
    if (pathParts.some(part => part === "." || part === "..")) {
        return {error: "Pool paths cannot contain . or .. segments."}
    }
    if (path !== poolRoot && !path.startsWith(poolRoot + "/")) {
        return {error: `The path must stay inside ${poolRoot}.`}
    }

    return {path}
}

function PoolBreadcrumbs(props) {
    props = {
        crumbSize: "large",
        ...props
    }

    const [isEditing, setIsEditing] = useState(false);
    const [draftPath, setDraftPath] = useState(props.path || "");
    const [pathError, setPathError] = useState("");
    const pathInputRef = useRef(null);

    useEffect(() => {
        if (!isEditing) {
            setDraftPath(props.path || "")
        }
    }, [props.path, isEditing]);

    useEffect(() => {
        if (isEditing && pathInputRef.current) {
            pathInputRef.current.focus();
            pathInputRef.current.select()
        }
    }, [isEditing]);

    function clickFunc(path) {
        return () => {
            props.setRoot({fullpath: path})
        }
    }

    function pathToCrumbs(path) {
        if (path === undefined || path === null) {
            return [];
        }
        let prefix = "";
        if (path.startsWith(s3_prefix)) {
            path = path.slice(s3_prefix.length);
            prefix = s3_prefix
        }

        let crumbs = [];
        let parts = path.split("/");
        let new_path = prefix;
        for (const item of parts) {
            if (item === "") {
                continue
            }
            new_path += "/" + item;
            crumbs.push({
                name: item, icon: "folder-close", path: new_path,
                onClick: clickFunc(new_path)
            })
        }
        return crumbs
    }

    function renderBreadcrumb(lprops) {
        return (
            <PoolBreadcrumb {...lprops}
                            crumbSize={props.crumbSize}/>
        )
    }

    function beginEditing() {
        setDraftPath(props.path || "");
        setPathError("");
        setIsEditing(true)
    }

    function cancelEditing() {
        setDraftPath(props.path || "");
        setPathError("");
        setIsEditing(false)
    }

    function submitPath(event) {
        event.preventDefault();
        const result = normalizePoolPath(draftPath, props.path);
        if (result.error) {
            setPathError(result.error);
            return
        }

        props.setRoot({fullpath: result.path});
        setPathError("");
        setIsEditing(false)
    }

    function handlePathKeyDown(event) {
        if (event.key === "Escape") {
            event.preventDefault();
            cancelEditing()
        }
    }

    const crumbs = pathToCrumbs(props.path);
    let theClass = "pool-breadcrumbs"
    if (props.crumbSize == "small") {
        theClass = "pool-breadcrumbs-small"
    }
    return (
        <div className="pool-breadcrumbs-row">
            {isEditing ?
                <div className="pool-breadcrumbs-editor">
                    <form className="pool-breadcrumbs-path-form" onSubmit={submitPath}>
                        <ControlGroup style={{width: "100%"}} fill={true} vertical={false}>
                            <input ref={pathInputRef}
                                   className={`bp6-input bp6-fill ${pathError ? "bp6-intent-danger" : ""}`}
                                   value={draftPath}
                                   onChange={event => {
                                       setDraftPath(event.target.value);
                                       setPathError("")
                                   }}
                                   onKeyDown={handlePathKeyDown}
                                   aria-label="Pool folder path"
                                   aria-invalid={pathError !== ""}
                                   title={pathError || "Enter a pool folder path"}
                                   spellCheck={false}/>
                            <Button type="submit"
                                    variant="minimal"
                                    icon="arrow-right"
                                    aria-label="Go to pool folder"
                                    title="Go to folder"
                                    size="small"/>
                            <Button type="button"
                                    variant="minimal"
                                    icon="cross"
                                    onClick={cancelEditing}
                                    aria-label="Cancel path editing"
                                    title="Cancel"
                                    size="small"/>
                        </ControlGroup>
                    </form>
                    {pathError &&
                        <span className="pool-breadcrumbs-path-error" role="alert">{pathError}</span>}
                </div>
                :
                <ControlGroup className="pool-breadcrumbs-navigation">
                    <Breadcrumbs className={theClass}
                                 breadcrumbRenderer={renderBreadcrumb} items={crumbs}/>
                    <Button variant="minimal"
                            icon="edit"
                            onClick={beginEditing}
                            aria-label="Edit pool folder path"
                            title="Edit path"
                            size="small"/>
                </ControlGroup>}

        </div>
    )
}
