import "../tactic_css/pool.scss";

import React from "react";

import {Fragment, useState, useEffect, useRef, memo, useContext} from "react";

import {Breadcrumb, Breadcrumbs, Switch, Icon, Button} from "@blueprintjs/core";

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
    const [, , multi_select_ref] = useStateAndRef(false);
    const [, , list_of_selected_ref] = useStateAndRef([]);
    const [, setContextMenuItems] = useState([]);
    const [have_activated, set_have_activated] = useState(false);
    const [showHidden, setShowHidden] = useState(false);

    const settingsContext = useContext(SettingsContext);

    const treeRefreshFunc = useRef(null);
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

    function handleNodeClick(node) {
        setValue(node.fullpath);
        setSelectedNode(node);
        return true
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
        treeRefreshFunc.current = func
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
                 style={{maxHeight: "100%", position: "relative", overflow: "scroll"}}>
                {(props.am_selected || have_activated) &&
                    <PoolContext.Provider value={{
                        workingPath: null, setWorkingPath: () => {
                        }
                    }}>
                        <div className="d-flex flex-row" style={{justifyContent: "space-between", marginBottom: 10}}>
                            <PoolBreadcrumbs path={currentRootPathRef.current} setRoot={setRoot}/>
                            <PoolHiddenSwitch showHidden={showHidden} setShowHidden={setShowHidden}/>
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
                                                 user_id={window.user_id}
                                                 tsocket={props.tsocket}
                                                 showSecondaryLabel={true}
                                                 handleNodeClick={handleNodeClick}/>
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
                         multi_select={multi_select_ref.current}
                         list_of_selected={list_of_selected_ref.current}
                         sendContextMenuItems={setContextMenuItems}
                         setRootToBase={setRootToBase}
                         setRoot={setRoot}
                         getOpenResources={props.getOpenResources}
                         refreshFunc={treeRefreshFunc.current}
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
                checked={props.showHidden}
                onChange={handleShowHiddenChange}
        />
    )
}

const s3_prefix = "s3://tactic-user-storage/users";

function PoolBreadcrumbs(props) {
    props = {
        crumbSize: "large",
        ...props
    }

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

    function setWorkingDirectory() {
        postPromise("host", "update_settings", {"workingDirectory": props.path}).then(() => {
        })
    }

    const crumbs = pathToCrumbs(props.path);
    let theClass = "pool-breadcrumbs"
    if (props.crumbSize == "small") {
        theClass = "pool-breadcrumbs-small"
    }
    return (
        <div style={{display: "flex", flexDirection: "row", justifyContent: "flex-start"}}>
            <Breadcrumbs className={theClass}
                         breadcrumbRenderer={renderBreadcrumb} items={crumbs}/>
            <Button variant="minimal"
                    text="Set Default"
                    textClassName="pool-breadcrumbs-button-text bp6-breadcrumb"
                    onClick={setWorkingDirectory}
                    size="small"/>
        </div>
    )
}

