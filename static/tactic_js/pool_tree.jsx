import React from "react";
import {useState, useEffect, useRef, memo, Fragment, useContext, createContext} from "react";
import {TreeNode, Popover, Button, ContextMenuPopover, Classes, HTMLSelect} from "@blueprintjs/core";

import _ from "lodash";
import {doFlash, StatusContext} from "./toaster"
import {useCallbackStack, useReducerAndRef, useStateAndRef} from "./utilities_react";
import {postPromise} from "./communication_react";
import {SettingsContext} from "./settings";
import {SearchForm} from "./library_widgets";
import {ErrorDrawerContext} from "./error_drawer";

export {PoolTree, PoolAddressSelector, getBasename, splitFilePath, getFileParentPath, withPool, PoolContext}
import {useSocketListener} from "./tactic_socket";
import {PoolBreadcrumbs} from "./pool_browser";

const PoolContext = createContext({
    workingPath: null,
    setWorkingPath: () => {
    }
});

function withPool(WrappedComponent) {
    function newFunc(props) {
        const [workingPath, setWorkingPath] = useState(null);

        return (
            <PoolContext.Provider value={{workingPath, setWorkingPath}}>
                <WrappedComponent {...props}/>
            </PoolContext.Provider>
        )
    }

    return memo(newFunc)
}

function searchToLimit(parentNode, fullpath) {
    let limit_node = parentNode
    for (let node of parentNode.childNodes) {
        if (node.fullpath == fullpath) {
            return node
        }
        if (!node.isDirectory) {
            continue
        }
        if (isSameOrDescendantPath(fullpath, node.fullpath)) {
            limit_node = searchToLimit(node, fullpath);
            if (limit_node) {
                return limit_node
            }
            else {
                return node
            }
        }
    }
    return parentNode;
}

function addDirectoriesToPath(path, nodes) {
    let node = searchToLimit(nodes[0], path);
    if (node.fullpath == path) {
        return nodes
    }
    let dir_str = path.slice(node.fullpath.length)
    if (dir_str.startsWith("/")) {
        dir_str = dir_str.slice(1);

    }
    let dir_list = dir_str.split("/");
    dir_list.pop(); // pop filename
    let accumulated_path = `${node.fullpath}`;
    let exploreNode = node;
    for (let dirname of dir_list) {
        accumulated_path = `${accumulated_path}/${dirname}`;
        let existingNode = (exploreNode.childNodes || []).find(child => child.fullpath === accumulated_path);
        if (existingNode) {
            exploreNode = existingNode;
            continue
        }
        exploreNode.childNodes.push({
            id: accumulated_path,
            icon: "folder-close",
            fullpath: accumulated_path,
            basename: dirname,
            label: dirname,
            isDirectory: true,
            isExpanded: false,
            isSelected: false,
            explored: false,
            childNodes: []
        });
        exploreNode = exploreNode.childNodes[exploreNode.childNodes.length - 1];
    }
}

function treeNodesReducer(nodes, action) {
    switch (action.type) {
        case "REPLACE_ALL":
            return _.cloneDeep(action.new_nodes);
        case "DESELECT_ALL":
            const newState1 = _.cloneDeep(nodes);
            forEachNode(newState1, node => (node.isSelected = false));
            return newState1;

        case "DISABLE_FOLDERS":
            const newState6 = _.cloneDeep(nodes);
            forEachNode(newState6, node => {
                node.disabled = node.isDirectory
            });
            return newState6;
        case "DISABLE_FILES":
            const newState7 = _.cloneDeep(nodes);
            forEachNode(newState7, node => {
                node.disabled = !node.isDirectory
            });
            return newState7;
        case "SET_IS_EXPANDED":
            const newState2 = _.cloneDeep(nodes);
            forEachNode(newState2, (node) => {
                if (node.id == action.node_id) {
                    node.isExpanded = action.isExpanded
                }
            });
            return newState2;

        case "SET_CHILD_NODES":
            const newStateSCN = _.cloneDeep(nodes);
            forEachNode(newStateSCN, (node) => {
                if (node.id == action.node_id) {
                    node.childNodes = action.childNodes;
                    if ("explored" in action) {
                        node.explored = action.explored
                    }
                    else {
                        node.explored = true
                    }
                }
            });
            return newStateSCN;

        case "MULTI_EXPAND_AND_SET_CHILDREN":
            const newStateMESC = _.cloneDeep(nodes);
            forEachNode(newStateMESC, (node) => {
                if (node.id in action.node_dict) {
                    node.isExpanded = true;
                    if (action.node_dict[node.id]) {
                        node.childNodes = action.node_dict[node.id];
                    }
                    node.explored = true
                }
            });
            return newStateMESC;

        case "SET_EXPLORED":
            const newStateE = _.cloneDeep(nodes);
            forEachNode(newStateE, (node) => {
                if (node.id == action.node_id) {
                    node.explored = action.explored
                }
            });
            return newStateE;
        case "MULTI_SET_IS_EXPANDED":
            const newState3 = _.cloneDeep(nodes);
            forEachNode(newState3, (node) => {
                if (action.node_list.includes(node.id)) {
                    node.isExpanded = action.isExpanded
                }
            });
            return newState3;

        case "SET_IS_SELECTED":
            const newState4 = _.cloneDeep(nodes);
            forEachNode(newState4, (node) => {
                node.isSelected = node.id == action.id
            });
            return newState4;

        case "SET_SELECTED_PATHS":
            const newStateSelectedPaths = _.cloneDeep(nodes);
            forEachNode(newStateSelectedPaths, (node) => {
                node.isSelected = action.fullpaths.includes(node.fullpath)
            });
            return newStateSelectedPaths;

        case "SET_IS_SELECTED_FROM_FULLPATH":
            const newState5 = _.cloneDeep(nodes);
            forEachNode(newState5, (node) => {
                node.isSelected = node.fullpath == action.fullpath
            });
            return newState5;
        case "CHANGE_NODE_NAME":
            const newState8 = _.cloneDeep(nodes);
            forEachNode(newState8, (node) => {
                if (node.fullpath == action.old_path) {
                    updateNode(node, action.new_path)
                }
            });
            return newState8;
        case "MODIFY_FILE":
            const newStateMF = _.cloneDeep(nodes);
            let modified_file = false;
            forEachNode(newStateMF, (node) => {
                if (node.fullpath == action.fileDict.fullpath) {
                    action.fileDict.isSelected = node.isSelected;
                    updateNode(node, action.fileDict);
                    modified_file = true;
                }
            });
            if (!modified_file) {
                addDirectoriesToPath(action.fileDict.fullpath, newStateMF);
                const [path,] = splitFilePath(action.fileDict.fullpath);
                forEachNode(newStateMF, (node) => {
                    if (node.isDirectory) {
                        if (node.fullpath == path) {
                            node.childNodes.push(action.fileDict)
                        }
                    }
                });
            }
            return newStateMF;
        case "MODIFY_DIRECTORY":
            const newStateMD = _.cloneDeep(nodes);
            let modified_dir = false;
            forEachNode(newStateMD, (node) => {
                if (node.fullpath == action.folderDict.fullpath) {
                    action.folderDict.isSelected = node.isSelected;
                    action.folderDict.isExpanded = node.isExpanded;
                    action.folderDict.childNodes = node.childNodes;
                    updateNode(node, action.folderDict);
                    modified_dir = true
                }
            });
            if (!modified_dir) {
                const [path,] = splitFilePath(action.folderDict.fullpath);
                forEachNode(newStateMD, (node) => {
                    if (node.isDirectory) {
                        if (node.fullpath == path) {
                            node.childNodes.push(action.folderDict)
                        }
                    }
                })
            }
            return newStateMD;
        case "REMOVE_NODE":
            const newState9 = _.cloneDeep(nodes);
            forEachNode(newState9, (node) => {
                if (node.isDirectory) {
                    let new_children = [];
                    for (const cnode of node.childNodes) {
                        if (cnode.fullpath != action.fullpath) {
                            new_children.push(cnode)
                        }
                    }
                    node.childNodes = new_children
                }
            });
            return newState9;
        case "ADD_FILE":
            const newState10 = _.cloneDeep(nodes);
            if (newState10.length > 0 && nodeFromPath(action.fileDict.fullpath, newState10[0])) {
                return newState10;
            }
            const [path,] = splitFilePath(action.fileDict.fullpath);
            forEachNode(newState10, (node) => {
                if (node.isDirectory) {
                    if (node.fullpath == path) {
                        node.childNodes.push(action.fileDict)
                    }
                }
            });
            return newState10;
        case "ADD_DIRECTORY":
            const newState11 = _.cloneDeep(nodes);
            if (newState11.length > 0 && nodeFromPath(action.folderDict.fullpath, newState11[0])) {
                return newState11;
            }
            const [fpath,] = splitFilePath(action.folderDict.fullpath);
            forEachNode(newState11, (node) => {
                if (node.isDirectory) {
                    if (node.fullpath == fpath) {
                        node.childNodes.push(action.folderDict)
                    }
                }
            });
            return newState11;
        case "MOVE_FILE":
            const newState12 = _.cloneDeep(nodes);
            let found_file = false;
            forEachNode(newState12, (node) => {
                if (node.isDirectory) {
                    let new_children = [];
                    for (const cnode of node.childNodes) {
                        if (cnode.fullpath != action.src) {
                            new_children.push(cnode)
                        } else {
                            found_file = true;
                            action.fileDict.isSelected = cnode.isSelected;
                        }
                    }
                    node.childNodes = new_children
                }
            });
            if (found_file) {
                forEachNode(newState12, (node) => {
                    if (node.isDirectory && (node.fullpath == action.dst)) {
                        node.childNodes.push(action.fileDict);
                    }
                });
            }
            return newState12;
        case "MOVE_DIRECTORY":
            const newStateMDir = _.cloneDeep(nodes);
            let found_dir = false;
            forEachNode(newStateMDir, (node) => {
                if (node.isDirectory && (node.fullpath != action.src)) {
                    let new_children = [];
                    for (const cnode of node.childNodes) {
                        if (cnode.fullpath != action.src) {
                            new_children.push(cnode)
                        } else {
                            found_dir = true;
                            action.folderDict.isSelected = cnode.isSelected;
                            action.folderDict.childNodes = cnode.childNodes;
                            action.folderDict.isExpanded = cnode.isExpanded;
                            const newpath = `${action.dst}/${action.folderDict.basename}`;
                            updateDescendantPaths(action.folderDict, action.src, newpath)
                        }
                    }
                    node.childNodes = new_children
                }
            });
            if (found_dir) {
                forEachNode(newStateMDir, (node) => {
                    if (node.isDirectory && (node.fullpath == action.dst)) {
                        node.childNodes.push(action.folderDict);
                    }
                });
            }
            return newStateMDir;
        default:
            return nodes;
    }
}

function updateNode(node, newDict) {
    for (let key in newDict) {
        node[key] = newDict[key]
    }
}

function isSameOrDescendantPath(path, parentPath) {
    return path === parentPath || path.startsWith(`${parentPath}/`)
}

function updateDescendantPaths(node, oldRoot, newRoot) {
    if (isSameOrDescendantPath(node.fullpath, oldRoot)) {
        node.fullpath = newRoot + node.fullpath.slice(oldRoot.length);
        node.id = node.fullpath
    }
    for (const child of node.childNodes || []) {
        updateDescendantPaths(child, oldRoot, newRoot)
    }
}

function forEachNode(nodes, callback) {
    if (nodes === undefined) {
        return;
    }
    for (const node of nodes) {
        callback(node);
        forEachNode(node.childNodes, callback);
    }
}

function nodeFromPath(fullpath, root) {
    if (root.fullpath == fullpath) {
        return root
    }
    for (const node of root.childNodes) {
        if (node.fullpath == fullpath) {
            return node
        }
    }
    for (const node of root.childNodes) {
        if (node.isDirectory) {
            let result = nodeFromPath(fullpath, node);
            if (result) {
                return result
            }
        }
    }
    return null
}

function nodeFromID(node_id, childNodes) {
    for (const node of childNodes) {
        if (node.id == node_id) {
            return node
        }
    }
    for (const node of childNodes) {
        if (node.isDirectory) {
            let result = nodeFromPath(node_id, node);
            if (result) {
                return result
            }
        }
    }
    return null
}

function PoolTree(props) {
    const [, dispatch, nodes_ref] = useReducerAndRef(treeNodesReducer, []);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuTarget, setContentMenuTarget] = useState({left: 0, top: 0});
    const [contextMenuNode, setContextMenuNode] = useState("");
    const [, setSearchString, searchStringRef] = useStateAndRef("");
    const [sortBy, setSortBy] = useState("updated");
    const [sortDirection, setSortDirection] = useState("descending");
    const selectionAnchorRef = useRef(null);
    const selectedPathsRef = useRef([]);
    const refreshTimerRef = useRef(null);
    const treeRequestRef = useRef(0);
    const settingsContext = useContext(SettingsContext);

    const pushCallback = useCallbackStack();

    const pool_context = useContext(PoolContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);
    const statusFuncs = useContext(StatusContext);

    useEffect(() => {
        if (props.registerTreeRefreshFunc) {
            props.registerTreeRefreshFunc(getTree)
        }
    }, [props.showHidden, props.currentRootPath, props.value]);

    useEffect(() => {
        return () => {
            if (refreshTimerRef.current) {
                clearTimeout(refreshTimerRef.current)
            }
        }
    }, []);

    useEffect(() => {
        if (props.currentRootPath && nodes_ref.current.length > 0) {
            let node = nodeFromPath(props.currentRootPath, nodes_ref.current[0]);
            if (node) {
                handleNodeExpand(node).then(() => {});
            } else {
                expandToNode(props.currentRootPath).then(() => {})
            }
        }
    },[props.currentRootPath, nodes_ref.current.length])

    useEffect(() => {
        if (props.value && nodes_ref.current.length > 0) {
            expandToNode(props.value).then(() => {});
        }
    }, [props.value, nodes_ref.current.length]);

    useEffect(() => {
        if (!Array.isArray(props.list_of_selected)) return;
        const selectedPaths = props.list_of_selected.map(node => node.fullpath);
        selectedPathsRef.current = selectedPaths;
        dispatch({type: "SET_SELECTED_PATHS", fullpaths: selectedPaths})
    }, [props.list_of_selected]);

    useEffect(() => {
        getTree().then(() => {
            if (!props.value && pool_context.workingPath) {
                exposeNode(pool_context.workingPath, false)
            }
        })
    }, [props.showHidden]);

    async function getTree() {
        const requestId = ++treeRequestRef.current;
        try {
            let data = await postPromise("host", "GetPoolTree",
                {user_id: props.user_id, show_hidden: props.showHidden}
            );
            if (!data["dtree"]) {
                doFlash("Error getting pool Tree");
                return
            }
            const expandedPaths = [];
            forEachNode(nodes_ref.current, node => {
                if (node.isDirectory && node.isExpanded) expandedPaths.push(node.fullpath)
            });

            // Refresh every open directory so the new snapshot is authoritative
            // without collapsing the part of the tree the user is working in.
            const rootPath = data["dtree"][0]?.fullpath;
            const subtreeResults = await Promise.all(expandedPaths
                .filter(path => path !== rootPath)
                .map(async path => {
                    try {
                        const subtree = await postPromise("host", "GetPoolTree", {
                            user_id: props.user_id,
                            show_hidden: props.showHidden,
                            base_path: path
                        });
                        return {path, subtree}
                    } catch (_) {
                        // The directory may have been renamed or deleted by the
                        // operation that triggered this refresh.
                        return {path, subtree: null}
                    }
                }));

            // A slower, older request must never overwrite a newer snapshot.
            if (requestId !== treeRequestRef.current) return;
            const refreshedNodes = _.cloneDeep(data["dtree"]);
            if (expandedPaths.includes(rootPath)) {
                refreshedNodes[0].isExpanded = true
            }
            subtreeResults.sort((a, b) => a.path.split("/").length - b.path.split("/").length);
            for (const {path, subtree} of subtreeResults) {
                if (!subtree || !subtree["dtree"] || refreshedNodes.length === 0) continue;
                const node = nodeFromPath(path, refreshedNodes[0]);
                if (!node) continue;
                node.childNodes = subtree["dtree"][0].childNodes;
                node.explored = true;
                node.isExpanded = true
            }
            forEachNode(refreshedNodes, node => {
                node.isSelected = selectedPathsRef.current.includes(node.fullpath)
            });
            dispatch({
                type: "REPLACE_ALL",
                new_nodes: refreshedNodes,
            });
            const rehydratePath = props.currentRootPath || props.value;
            const rehydratedNode = refreshedNodes.length > 0 && rehydratePath
                ? nodeFromPath(rehydratePath, refreshedNodes[0])
                : null;
            if (rehydratePath && !rehydratedNode) {
                pushCallback(() => {
                    expandToNode(rehydratePath).then(() => {})
                });
            } else if (!rehydratePath) {
                pushCallback(exposeBaseNode)
            }
        } catch (e) {
            errorDrawerFuncs.addFromError("Error getting pool tree", e)
        }
    }

    function scheduleAuthoritativeRefresh() {
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current)
        }
        // S3 can emit hundreds of object events for a single folder operation.
        // Coalesce that burst and finish from one authoritative listing.
        refreshTimerRef.current = setTimeout(() => {
            refreshTimerRef.current = null;
            getTree().then(() => {});
        }, 750)
    }

    function focusNode(fullpath, nodes) {
        if (props.handleNodeClick && nodes.length > 0) {
            let dnode = nodeFromPath(fullpath, nodes[0]);
            if (dnode) {
                props.handleNodeClick(dnode, nodes);
            }
        }
        dispatch({
            type: "SET_IS_SELECTED_FROM_FULLPATH",
            fullpath: fullpath
        });
        selectedPathsRef.current = [fullpath];
        exposeNode(fullpath)
    }

    useSocketListener(props.tsocket, "pool-directory-event", (data) => {
        const event_type = data["event_type"];
        let folderDict = data["folder_dict"];
        folderDict.id = folderDict.fullpath;
        switch (event_type) {
            case "modify":
                dispatch({
                    type: "MODIFY_DIRECTORY",
                    folderDict: folderDict
                });
                break;
            case "create":
                dispatch({
                    type: "ADD_DIRECTORY",
                    folderDict: folderDict
                });
                focusNode(folderDict.fullpath, nodes_ref.current);
                break;
            case "delete":
                dispatch({
                    type: "REMOVE_NODE",
                    fullpath: folderDict.fullpath
                });
                pushCallback(()=>{
                    deleteIfEmpty(getFileParentPath(folderDict.fullpath))
                })
                break;
            case "move":
                dispatch({
                    type: "MOVE_DIRECTORY",
                    src: data.path,
                    dst: getFileParentPath(folderDict.fullpath),
                    folderDict: folderDict
                });
                break;
            default:
                break;
        }
        scheduleAuthoritativeRefresh();
    })

    useSocketListener(props.tsocket, "pool-file-event", (data) => {
        const event_type = data["event_type"];
        let fileDict = data["file_dict"];
        fileDict.id = fileDict.fullpath;
        switch (event_type) {
            case "modify":
                dispatch({
                    type: "MODIFY_FILE",
                    fileDict: fileDict
                });
                break;
            case "create":
                dispatch({
                    type: "ADD_FILE",
                    fileDict: fileDict
                });
                focusNode(fileDict.fullpath, nodes_ref.current);
                break;
            case "delete":
                dispatch({
                    type: "REMOVE_NODE",
                    fullpath: fileDict.fullpath
                });
                pushCallback(()=>{
                    deleteIfEmpty(getFileParentPath(fileDict.fullpath))
                })
                break;
            case "move":
                dispatch({
                    type: "MOVE_FILE",
                    src: data.path,
                    dst: getFileParentPath(fileDict.fullpath),
                    fileDict: fileDict
                });
                break;
            default:
                break;
        }
        scheduleAuthoritativeRefresh();
    })

    function exposeBaseNode() {
        if (nodes_ref.current.length == 0) return;
        dispatch({
            type: "SET_IS_EXPANDED",
            node_id: nodes_ref.current[0].id,
            isExpanded: true
        })
    }

    function deleteIfEmpty(path) {
        postPromise("host", "is_directory_empty", {"path": path}).then((data) => {
            if (data["is_empty"]) {
                dispatch({
                    type: "REMOVE_NODE",
                    fullpath: path
                });
                let parent_path = getFileParentPath(path);
                if (parent_path != "" && parent_path != path) {
                    pushCallback(() => {
                        deleteIfEmpty(parent_path)
                    });
                }
            }
        })
    }

    function exposeNode(fullpath, set_working_path = true) {
        let the_path = findNodePath(fullpath);
        if (the_path) {
            dispatch({
                type: "MULTI_SET_IS_EXPANDED",
                node_list: the_path,
                isExpanded: true
            });
            if (set_working_path) {
                pool_context.setWorkingPath(fullpath);
            }
        } else {
            exposeBaseNode();
        }
    }

    function findNodePath(fullpath) {
        let current_path = [];
        return searchDown(nodes_ref.current, fullpath, current_path);
    }

    function searchDown(childNodes, fullpath, current_path) {
        for (let node of childNodes) {
            if (node.fullpath == fullpath) {
                if (node.isDirectory) {
                    return current_path.concat([node.id])
                } else {
                    return current_path
                }
            } else {
                if ("childNodes" in node && isSameOrDescendantPath(fullpath, node.fullpath)) {
                    let the_path = searchDown(node.childNodes, fullpath, current_path.concat([node.id]));
                    if (the_path) {
                        return the_path
                    }
                }
            }
        }
        return null
    }

    function handleNodeCollapse(node) {
        dispatch({
            type: "SET_IS_EXPANDED",
            node_id: node.id,
            isExpanded: false
        })
    }

    async function expandToNode(fullpath) {
        let result = await addMissingNodes(fullpath);
        if (!result) {
            return
        }

        pushCallback(async () => {
            let the_path = findNodePath(fullpath);
            if (the_path == null) {
                return
            }
            let childrenToAdd = {};
            for (let node_id of the_path) {
                let node = nodeFromID(node_id, [nodes_ref.current[0]]);
                childrenToAdd[node_id] = await handleNodeExpand(node, null, null, true)
            }

            dispatch({
                type: "MULTI_EXPAND_AND_SET_CHILDREN",
                node_dict: childrenToAdd,
            });
            pushCallback(() => {
                dispatch({
                    type: "SET_SELECTED_PATHS",
                    fullpaths: selectedPathsRef.current.length > 0
                        ? selectedPathsRef.current
                        : [fullpath]
                })
            });

        });
    }

    async function addMissingNodes(fullpath) {
        let current_node = nodes_ref.current[0];
        if (!current_node) return false;
        while (true) {
            let found_child = false;
            for (let child of current_node.childNodes) {
                if (isSameOrDescendantPath(fullpath, child.fullpath)) {
                    current_node = child;
                    found_child = true;
                    break;
                }
            }
            if (!found_child) {
                return true
            }
            if (current_node.fullpath == fullpath) {
                return true
            }
            if (!current_node.explored) {
                let data = await postPromise("host", "GetPoolTree",
                {user_id: props.user_id, show_hidden: props.showHidden,
                        target_path: fullpath,
                        base_path: current_node.fullpath}
                );
                if (!data["dtree"]) {
                    return false
                }
                dispatch({
                    type: "SET_CHILD_NODES",
                    node_id: current_node.id,
                    explored: false,
                    childNodes: data["dtree"][0].childNodes
                })
                return true
            }
        }
    }

    async function handleNodeExpand(node, nodePath, e, returnUpdaters=false) {
        if (!node) return null;
        const expandUpdater = {
            type: "SET_IS_EXPANDED",
            node_id: node.id,
            isExpanded: true
        }
        let updaters = [expandUpdater];
        let children_to_add = null;
        if (!node.explored) {
            if (statusFuncs) {
                statusFuncs.setStatus({show_spinner: true, status_message: "Opening folder"});
            }
            let data;
            try {
                data = await postPromise("host", "GetPoolTree",
                    {user_id: props.user_id, show_hidden: props.showHidden, base_path: node.fullpath}
                );
            } catch (e) {
                errorDrawerFuncs.addFromError("Error opening pool folder", e);
                return null
            } finally {
                if (statusFuncs) statusFuncs.clearStatus()
            }
            if (!data["dtree"]) {
                doFlash("Error getting file tree.");
                return
            }
            const childUpdater = {
                type: "SET_CHILD_NODES",
                node_id: node.id,
                childNodes: data["dtree"][0].childNodes
            }
            children_to_add = data["dtree"][0].childNodes;
            updaters.push(childUpdater);
        }
        if (!returnUpdaters) {
            for (let updater of updaters) {
                dispatch(updater)
            }
        }
        pool_context.setWorkingPath(node.fullpath);
        return children_to_add
    }

    function selectedNodesFromPaths(paths) {
        if (nodes_ref.current.length === 0) return [];
        return paths.map(path => nodeFromPath(path, nodes_ref.current[0])).filter(Boolean)
    }

    function visibleNodePaths() {
        const result = [];
        const searchString = searchStringRef.current;

        function containsSearchMatch(node) {
            if (node.basename.includes(searchString)) return true;
            return node.isDirectory && (node.childNodes || []).some(containsSearchMatch)
        }

        function sortedVisibleNodes(nodes) {
            let visible = [...(nodes || [])];
            visible.sort((a, b) => {
                if (sortBy === "name") return a.basename.localeCompare(b.basename);
                if (sortBy === "size") return a["size_for_sort"] - b["size_for_sort"];
                return a["updated_for_sort"] - b["updated_for_sort"]
            });
            if (sortDirection === "descending") visible.reverse();
            if (searchString !== "") visible = visible.filter(containsSearchMatch);
            return visible
        }

        function walk(nodes) {
            for (const node of sortedVisibleNodes(nodes)) {
                result.push(node.fullpath);
                if (node.isDirectory && node.isExpanded) {
                    walk(node.childNodes)
                }
            }
        }
        if (nodes_ref.current.length > 0) {
            const root = nodeFromPath(props.currentRootPath, nodes_ref.current[0]);
            walk(root ? [root] : nodes_ref.current)
        }
        return result
    }

    function handleNodeClick(node, nodePath, event) {
        if (props.select_type == "file" && node.isDirectory) return;
        if (props.select_type == "folder" && !node.isDirectory) return;
        const currentPaths = [];
        forEachNode(nodes_ref.current, candidate => {
            if (candidate.isSelected) currentPaths.push(candidate.fullpath)
        });

        let nextPaths;
        if (event && event.shiftKey && selectionAnchorRef.current) {
            const visiblePaths = visibleNodePaths();
            const anchorIndex = visiblePaths.indexOf(selectionAnchorRef.current);
            const nodeIndex = visiblePaths.indexOf(node.fullpath);
            if (anchorIndex !== -1 && nodeIndex !== -1) {
                const start = Math.min(anchorIndex, nodeIndex);
                const end = Math.max(anchorIndex, nodeIndex);
                nextPaths = visiblePaths.slice(start, end + 1)
            }
        }
        if (!nextPaths && event && (event.ctrlKey || event.metaKey)) {
            nextPaths = currentPaths.includes(node.fullpath)
                ? currentPaths.filter(path => path !== node.fullpath)
                : currentPaths.concat([node.fullpath])
        }
        if (!nextPaths) {
            nextPaths = [node.fullpath]
        }
        selectionAnchorRef.current = node.fullpath;
        selectedPathsRef.current = nextPaths;
        dispatch({type: "SET_SELECTED_PATHS", fullpaths: nextPaths});
        if (props.handleNodeClick) {
            props.handleNodeClick(node, nodes_ref.current, selectedNodesFromPaths(nextPaths));
        }
        if (props.handleSelectionChange) {
            props.handleSelectionChange(selectedNodesFromPaths(nextPaths));
        }
    }

    function displayContextMenu(node, nodepath, e) {
        e.preventDefault();
        setShowContextMenu(true);
        setContextMenuNode(node);
        setContentMenuTarget({left: e.clientX, top: e.clientY});
    }

    function _update_search_state(new_state) {
        setSearchString(new_state.search_string)
    }

    let cname = "pool-search-form";
    if (props.showSecondaryLabel) {
        cname += " pool-search-form-responsive"
    }
    return (
        <Fragment>
            <ContextMenuPopover onClose={() => {
                setShowContextMenu(false)
            }}  // Without this doesn't close
                                content={props.renderContextMenu != null ?
                                    props.renderContextMenu({node: contextMenuNode}) : null}
                                isOpen={showContextMenu}
                                isDarkTheme={settingsContext.isDark()}
                                targetOffset={contextMenuTarget}/>
            <div className={cname} style={{
                paddingLeft: 10, paddingTop: 0,
                display: "flex", flexDirection: "row", justifyContent: "space-between"
            }}>
                <SearchForm allow_search_inside={false}
                            allow_search_metadata={false}
                            update_search_state={_update_search_state}
                            search_string={searchStringRef.current}
                />
                <div className="pool-button-holder">
                    <HTMLSelect options={["name", "size", "updated"]}
                                className="tree-sort-select"
                                onChange={(event) => {
                                    setSortBy(event.target.value)
                                }}
                                variant="minimal"
                                value={sortBy}/>
                    <HTMLSelect options={["ascending", "descending"]}
                                className="tree-sort-select"
                                onChange={(event) => {
                                    setSortDirection(event.target.value)
                                }}
                                variant="minimal"
                                value={sortDirection}/>
                </div>
            </div>
            <CustomTree contents={nodes_ref.current}
                        currentRootPath={props.currentRootPath}
                        setRoot={props.setRoot}
                        searchString={searchStringRef.current}
                        sortField={sortBy}
                        sortDirection={sortDirection}
                        showSecondaryLabel={props.showSecondaryLabel}
                        handleDrop={props.handleDrop}
                        onNodeContextMenu={props.renderContextMenu ? displayContextMenu : null}
                        onNodeClick={handleNodeClick}
                        onNodeCollapse={handleNodeCollapse}
                        onNodeExpand={handleNodeExpand}/>
        </Fragment>
    )
}

PoolTree = memo(PoolTree);

function getBasename(str) {
    return str.substring(str.lastIndexOf('/') + 1);
}


function getFileParentPath(path) {
    let plist = path.split("/");
    plist.pop();
    return plist.join("/")
}

function splitFilePath(path) {
    let plist = path.split("/");
    let fname = plist.pop();
    return [plist.join("/"), fname]
}

function PoolAddressSelector(props) {
    const [isOpen, setIsOpen] = useState(false);
    const pop_ref = useRef(null);
    const [refAcquired, setRefAcquired] = useState(false);
    const [, setMaxPopoverHeight, maxPopoverHeightRef] = useStateAndRef(.4 * window.innerHeight);
    const [, setCurrentRootPath, currentRootPathRef] = useStateAndRef("");

    const clickTimerRef = useRef(null);
    const settingsContext = useContext(SettingsContext);

    useEffect(() => {
        window.addEventListener("resize", resizePopover);
        setRefAcquired(false);
        if (!props.value || props.value.includes(settingsContext.settings.workingDirectory)){
            setCurrentRootPath(settingsContext.settings.workingDirectory);
        }
        return (() => {
            window.removeEventListener("resize", resizePopover)
        })
    }, []);

    useEffect(() => {
        resizePopover();
    }, [refAcquired]);

    useEffect(() => {
        return () => {
            if (clickTimerRef.current != null) {
                clearTimeout(clickTimerRef.current);
            }
        };
    }, []);

    function resizePopover() {
        if (pop_ref.current) {
            let max_height = window.innerHeight - pop_ref.current.offsetTop - 25;
            setMaxPopoverHeight(max_height);
        }
    }

    function handleNodeClick(node) {
        if (clickTimerRef.current != null) {
            clearTimeout(clickTimerRef.current);
            clickTimerRef.current = null;
        }
        clickTimerRef.current = setTimeout(() => {
            clickTimerRef.current = null;
            props.setValue(node.fullpath);
            setIsOpen(false);
            return true
        }, 250);
    }

    function setRoot(node = null) {
        if (clickTimerRef.current != null) {
            clearTimeout(clickTimerRef.current);
            clickTimerRef.current = null;
        }
        setCurrentRootPath(node.fullpath)
    }

    function onInteract(next_state, e) {
        if (e && e.currentTarget == document) {
            setIsOpen(false);
        }
    }

    let button_text;
    if (!props.value || props.value == "") {
        button_text = "not set"
    } else {
        button_text = getBasename(props.value)
    }
    let tree_element = (
        <div style={{paddingTop: 10}}>
            <PoolBreadcrumbs
                crumbSize="small"
                path={currentRootPathRef.current}
                setRoot={setRoot}/>
            <div style={{maxHeight: maxPopoverHeightRef.current, overflowY: "scroll"}}>
                <PoolTree value={props.value}
                          showHidden={false}
                          currentRootPath={currentRootPathRef.current}
                          setRoot={setRoot}
                          sortField="name"
                          sortDirection="ascending"
                          tsocket={props.tsocket}
                          select_type={props.select_type}
                          user_id={window.user_id}
                          renderContextMenu={null}
                          showSecondaryLabel={false}
                          handleDrop={null}
                          handleNodeClick={handleNodeClick}/>
            </div>
        </div>
    );

    return (
        <Popover
            popoverRef={pop_ref}
            isOpen={isOpen}
            onInteraction={onInteract}
            onOpened={() => {
                setRefAcquired(true)
            }
            }
            onClosed={() => {
                setRefAcquired(false)
            }
            }
            position="bottom-left"
            variant="minimal"
            modifiers={{
                flip: {enabled: false},
                preventOverflow: {enabled: false}
            }}
            content={tree_element}>
            <Button text={button_text} onClick={() => {
                setIsOpen(!isOpen)
            }}/>
        </Popover>
    )
}

PoolAddressSelector = memo(PoolAddressSelector);

// CustomTree is necessary to support drag-and-drop
// This is largely copied from the blueprintjs source code
function CustomTree(props) {

    function sortFilterNodes(nlist) {
        let newList = _.cloneDeep(nlist);
        if (props.sortField == "name") {
            newList.sort((a, b) => {
                return a.basename.localeCompare(b.basename)
            });

        } else if (props.sortField == "size") {
            newList.sort((a, b) => {
                return a["size_for_sort"] - b["size_for_sort"]
            })
        } else {
            newList.sort((a, b) => {
                return a["updated_for_sort"] - b["updated_for_sort"]
            })
        }

        if (props.sortDirection == "descending") {
            newList = newList.reverse()
        }
        if (props.searchString != "") {
            newList = markNodesDisabled(newList);
            newList = newList.filter(a => !a.isDisabled)
        }
        return newList
    }

    function checkIfDisabled(node) {
        if (!node.isDirectory) {
            node.isDisabled = !node.basename.includes(props.searchString);
            return node.isDisabled
        } else {
            let newChildren = [];
            let disabled = true;
            for (let child of node.childNodes) {
                let newChild = _.cloneDeep(child);
                newChild.isDisabled = checkIfDisabled(child);
                if (!newChild.isDisabled) {
                    disabled = false
                }
                newChildren.push(newChild)
            }
            node.childNodes = newChildren;
            node.isDisabled = disabled && !node.basename.includes(props.searchString);
            return node.isDisabled
        }
    }

    function markNodesDisabled(nlist) {
        let newList = _.cloneDeep(nlist);
        for (let node of newList) {
            checkIfDisabled(node)
        }
        return newList
    }

    function nodeDoubleClickFunc(node) {
        if (!node.isDirectory) return null;
        return () => {
            props.setRoot({fullpath: node.fullpath})
        }
    }

    function renderNodes(treeNodes, currentPath) {
        if (treeNodes == null) {
            return null;
        }

        let sortedNodes = sortFilterNodes(treeNodes);
        const nodeItems = sortedNodes.map((node, i) => {
            const elementPath = currentPath.concat(i);
            const tnode = (
                <TreeNode
                    {...node}
                    key={node.id}
                    contentRef={props.handleContentRef}
                    depth={elementPath.length - 1}
                    onClick={props.onNodeClick}
                    onContextMenu={props.onNodeContextMenu}
                    onCollapse={props.onNodeCollapse}
                    onDoubleClick={nodeDoubleClickFunc(node)}
                    onExpand={props.onNodeExpand}
                    onMouseEnter={props.onNodeMouseEnter}
                    onMouseLeave={props.onNodeMouseLeave}
                    path={elementPath}
                    secondaryLabel={props.showSecondaryLabel ? `${node.updated}   ${String(node.size)}` : null}
                >
                    {renderNodes(node.childNodes, elementPath)}
                </TreeNode>
            );
            if (node.isDirectory && props.handleDrop) {
                return (
                    <FileDropWrapper handleDrop={props.handleDrop}
                                     suppress={false}
                                     key={node.fullpath}
                                     fullpath={node.fullpath}>
                        {tnode}
                    </FileDropWrapper>
                )
            } else if (!node.isDirectory && props.handleDrop) {
                return (
                    <div key={node.fullpath}
                         draggable={true}
                         onDragStart={(e) => {
                             e.dataTransfer.setData("fullpath", node.fullpath)
                         }}
                         onDragEnd={() => {
                         }}>
                        {tnode}
                    </div>
                )
            } else {
                return tnode
            }
        });
        let cname = "pool-select-tree";
        if (props.showSecondaryLabel) {
            cname += " pool-select-tree-responsive"
        }
        return <ul className={`bp6-tree-node-list ${cname}`}>{nodeItems}</ul>;
    }

    function getNodeFromPath(fullpath, nodes) {
        if (nodes == null || nodes.length == 0) return null;
        for (let node of nodes) {
            if (node.fullpath == fullpath) {
                return node
            }
            if (node.isDirectory) {
                let result = getNodeFromPath(fullpath, node.childNodes);
                if (result) {
                    return result
                }
            }
        }
        return null
    }

    let rootNode = getNodeFromPath(props.currentRootPath, props.contents);
    let nodes_to_render = !rootNode ? null : [rootNode];

    return (
        <div className="bp6-tree" style={{width: "100%"}}>
            {renderNodes(nodes_to_render, [], Classes.TREE_ROOT)}
        </div>
    );
}

CustomTree = memo(CustomTree);

function FileDropWrapper(props) {
    const [isDragging, setIsDragging] = useState(false);
    const dragDepthRef = useRef(0);

    const isSuppressed = () => Boolean(props.suppress && props.suppress.current);

    const handleDragOver = (e) => {
        if (isSuppressed()) return;
        e.preventDefault();
        e.stopPropagation();  // So that containing folders don't also get event;
        setIsDragging(true);
    };

    const handleDragEnter = (e) => {
        if (isSuppressed()) return;
        e.preventDefault();
        e.stopPropagation();
        dragDepthRef.current += 1;
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.stopPropagation();
        dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
        if (dragDepthRef.current === 0) setIsDragging(false);
    };

    const handleDrop = (e) => {
        if (isSuppressed()) return;
        e.preventDefault();
        e.stopPropagation();  // So that containing folders don't also get event;
        dragDepthRef.current = 0;
        setIsDragging(false);
        if (props.handleDrop) {
            props.handleDrop(e, props.fullpath)
        }
    };

    return (
        <div
            className={`drop-zone ${isDragging ? 'drag-over' : ''}`}
            onDragEnter={isSuppressed() ? null : handleDragEnter}
            onDragOver={isSuppressed() ? null : handleDragOver}
            onDragLeave={isSuppressed() ? null : handleDragLeave}
            onDrop={isSuppressed() ? null : handleDrop}
        >
            {props.children}
        </div>
    );
}
