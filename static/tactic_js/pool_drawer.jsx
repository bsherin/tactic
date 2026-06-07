import React, {createContext, useCallback, useMemo} from "react";
import {Fragment, useState, useEffect, memo, useContext} from "react";

import {Drawer, Classes} from "@blueprintjs/core";

import {useStateAndRef} from "./utilities_react";
import {SettingsContext} from "./settings";
import {PoolBreadcrumbs} from "./pool_browser";
import {PoolTreeWithContextMenu} from "./pool_context_menu";

const PoolDrawerContext = createContext(null);
export {withPoolDrawer, PoolDrawerContext}


function withPoolDrawer(WrappedComponent, lposition = "right", pool_drawer_size = "30%") {
    function WithPoolComponent(props) {
        const [show_drawer, set_show_drawer] = useState(false);

        const closeDrawer = useCallback(() => {
            set_show_drawer(false);
        }, []);

        function toggleDrawer() {
            set_show_drawer(!show_drawer)
        }

        function showDrawer() {
            set_show_drawer(true)
        }

        return (
            <Fragment>
                <PoolDrawerContext.Provider value={{
                    showDrawer,
                    toggleDrawer,
                    closeDrawer
                }}>
                    <WrappedComponent {...props}/>
                </PoolDrawerContext.Provider>
                <PoolDrawer show_drawer={show_drawer}
                            position={lposition}
                            tsocket={props.tsocket}
                            title="Pool"
                            onClose={closeDrawer}
                            size={pool_drawer_size}/>
            </Fragment>
        )
    }

    return memo(WithPoolComponent)
}


function PoolDrawer(props) {
    props = {
        show_drawer: false,
        position: "right",
        title: null,
        size: "30%",
        ...props
    };

    const [, setValue, valueRef] = useStateAndRef(null);
    const [, setSelectedNode,] = useStateAndRef(null);
    const [, setCurrentRootPath, currentRootPathRef] = useStateAndRef("");

    const settingsContext = useContext(SettingsContext);

    useEffect(() => {
        setCurrentRootPath(settingsContext.settings.workingDirectory);
    }, [settingsContext.settings.workingDirectory]);

    function setRoot(node = null) {
        setCurrentRootPath(node.fullpath);
    }

    function handleNodeClick(node) {
        setValue(node.fullpath);
        setSelectedNode(node);
        return true;
    }

    const isRight = props.position === "right";

    const drawerStyle = {
        position: "fixed",
        top: 0,
        bottom: 0,
        width: props.size,
        [isRight ? "right" : "left"]: 0,
        zIndex: 5,
        display: "flex",
        flexDirection: "column",
        boxShadow: props.show_drawer
            ? "0 0 0 1px rgba(17,20,24,.1), 0 2px 8px rgba(17,20,24,.2)"
            : "none",
        transform: props.show_drawer
            ? "translateX(0)"
            : `translateX(${isRight ? "100%" : "-100%"})`,
        transition: "transform 200ms ease",
        minHeight: 0,
        minWidth: 0,
    };

    return (
        <div
            className={`bp6-drawer pool-drawer-persistent ${settingsContext.isDark() ? "bp6-dark" : "light-theme"}`}
            style={drawerStyle}
            aria-hidden={!props.show_drawer}
        >
            <div className="bp6-drawer-header">
                <span className="bp6-icon bp6-icon-folder-close" />
                <h4 className="bp6-heading">{props.title}</h4>
                <button
                    type="button"
                    className="bp6-button bp6-minimal bp6-icon-cross"
                    onClick={props.onClose}
                />
            </div>

            <div className={Classes.DRAWER_BODY} style={{minHeight: 0}}>
                <div className={Classes.DIALOG_BODY} style={{height: "100%", minHeight: 0}}>
                    <div style={{paddingTop: 10, height: "100%", display: "flex", flexDirection: "column", minHeight: 0}}>
                        <PoolBreadcrumbs
                            crumbSize="small"
                            path={currentRootPathRef.current}
                            setRoot={setRoot}
                        />
                        <div style={{overflowY: "auto", flex: "1 1 0", minHeight: 0}}>
                            <PoolTreeWithContextMenu
                                value={valueRef.current}
                                showHidden={false}
                                currentRootPath={currentRootPathRef.current}
                                setRoot={setRoot}
                                sortField="name"
                                sortDirection="ascending"
                                tsocket={props.tsocket}
                                select_type={props.select_type}
                                user_id={window.user_id}
                                showSecondaryLabel={true}
                                handleNodeClick={handleNodeClick}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

PoolDrawer = memo(PoolDrawer);
