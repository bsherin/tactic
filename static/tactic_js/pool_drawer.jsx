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
    }, [settingsContext.settings.workingDirectory])

    function setRoot(node = null) {
        setCurrentRootPath(node.fullpath)
    }

    function handleNodeClick(node) {
        setValue(node.fullpath);
        setSelectedNode(node);
        return true
    }

    let tree_element = useMemo(() => (
        <div style={{paddingTop: 10}}>
            <PoolBreadcrumbs
                crumbSize="small"
                path={currentRootPathRef.current}
                setRoot={setRoot}/>
            <div style={{overflowY: "scroll"}}>
                <PoolTreeWithContextMenu value={valueRef.current}
                                         showHidden={false}
                                         currentRootPath={currentRootPathRef.current}
                                         setRoot={setRoot}
                                         sortField="name"
                                         sortDirection="ascending"
                                         tsocket={props.tsocket}
                                         select_type={props.select_type}
                                         user_id={window.user_id}
                                         showSecondaryLabel={true}
                                         handleNodeClick={handleNodeClick}/>
            </div>
        </div>
    ));

    return (
        <Drawer
            icon="folder-close"
            className={settingsContext.isDark() ? "bp6-dark" : "light-theme"}
            title={props.title}
            isOpen={props.show_drawer}
            position={props.position}
            canOutsideClickClose={false}
            onClose={props.onClose}
            hasBackdrop={false}
            size={props.size}
            lazy={false}
            unmountOnClose={false}
        >
            <div className={Classes.DRAWER_BODY}>
                <div className={Classes.DIALOG_BODY}>
                    {tree_element}
                </div>
            </div>
        </Drawer>
    )
}

PoolDrawer = memo(PoolDrawer);
