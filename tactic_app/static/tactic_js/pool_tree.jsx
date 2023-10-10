import React from "react";
import {useState, useEffect, useRef, memo, Fragment, useContext} from "react";
import {TreeNode, Popover, Button, ContextMenuPopover, Classes} from "@blueprintjs/core";

import _ from "lodash";
import {doFlash} from "./toaster"
import {useCallbackStack, useReducerAndRef, useStateAndRef} from "./utilities_react";
import {postWithCallback} from "./communication_react";
import {ThemeContext} from "./theme";

export {PoolTree, PoolAddressSelector, getBasename, splitFilePath, getFileParentPath}


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
            const pNode = nodeFromPath(getFileParentPath(action.new_path), newState8[0]);
            return newState8;
        case "REMOVE_NODE":
            const newState9 = _.cloneDeep(nodes);
            forEachNode(newState9, (node) => {
                if (node.isDirectory) {
                    var new_children = [];
                    for (const cnode of node.childNodes) {
                        if (cnode.fullpath != action.full_path) {
                            new_children.push(cnode)
                        }
                    }
                    node.childNodes = new_children
                }
            });
            return newState9;
        case "ADD_FILE":
            const newState10 = _.cloneDeep(nodes);
            const [path, fname] = splitFilePath(action.full_path);
            const newNode = filenode(action.full_path);
            forEachNode(newState10, (node) => {
                if (node.isDirectory) {
                    if (node.fullpath == path) {
                        node.childNodes.push(newNode)
                    }
                }
            });
            return newState10;
        case "ADD_DIRECTORY":
            const newState11 = _.cloneDeep(nodes);
            const [dpath, dfname] = splitFilePath(action.full_path);
            const dnewNode = dirnode(action.full_path);
            forEachNode(newState11, (node) => {
                if (node.isDirectory) {
                    if (node.fullpath == dpath) {
                        node.childNodes.push(dnewNode)
                    }
                }
            });
            return newState11;
        case "MOVE_NODE":
            const newState12 = _.cloneDeep(nodes);
            let src_node;
            forEachNode(newState12, (node) => {
                if (node.isDirectory) {
                    var new_children = [];
                    for (const cnode of node.childNodes) {
                        if (cnode.fullpath != action.src) {
                            new_children.push(cnode)
                        }
                        else{
                            src_node = _.cloneDeep(cnode);
                            updateNode(src_node, `${action.dst}/${getBasename(action.src)}`);
                        }
                    }
                    node.childNodes = new_children
                }
            });
            forEachNode(newState12, (node) => {
                if (node.isDirectory && (node.fullpath == action.dst)) {
                    node.childNodes.push(src_node);
                }
            });
            return newState12;
        default:
            return nodes;
    }
}

function updateNode(node, newPath) {
    node.fullpath = newPath;
    const basename = getBasename(newPath);
    node.basename = basename;
    node.label = basename;
    return
}

function filenode(path) {
    const basename = getBasename(path);
    return {
        id: path,
        icon: "document",
        isDirectory: false,
        fullpath: path,
        basename: basename,
        label: basename,
        isSelected: false
    }
}

function dirnode(path) {
    const basename = getBasename(path);
    return {
        id: path,
        icon: "folder-close",
        isDirectory: true,
        isExpanded: false,
        basename: basename,
        label: basename,
        fullpath: path,
        childNodes: [],
        isSelected: false
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

function sortNodes(nlist) {
    let newList = _.cloneDeep(nlist);
    newList.sort((a, b)=>{return a.basename.localeCompare(b.basename)});
    return newList
}

function PoolTree(props) {
    const [nodes, dispatch, nodes_ref] = useReducerAndRef(treeNodesReducer, []);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuTarget, setContentMenuTarget] = useState({left:0, top:0});
    const [contextMenuNode, setContextMenuNode] = useState("");
    const [folderOver, setFolderOver] = useState("null");
    const theme = useContext(ThemeContext);

    const pushCallback = useCallbackStack();

    useEffect(()=>{
        initSocket();
        if (props.registerTreeRefreshFunc) {
            props.registerTreeRefreshFunc(getTree)
        }
        getTree();
    }, []);

    function getTree() {
        postWithCallback("host", "GetPoolTree", {user_id: props.user_id}, function (data) {
            if (!data.dtree) {
                doFlash("No pool storage available for this account.");
                return
            }
            data.dtree[0].isExpanded = true;
            dispatch({
                type: "REPLACE_ALL",
                new_nodes: data.dtree,
            });
            if (props.value) {
                pushCallback(()=> {
                    dispatch({
                        type: "SET_IS_SELECTED_FROM_FULLPATH",
                        fullpath: props.value
                    })
                });
                pushCallback(() => {
                    exposeNode(props.value)
                });
            }
            else {
                pushCallback(exposeBaseNode)
            }
        })
    }

    function focusNode(fullpath, nodes) {
        if (props.handleNodeClick) {
            let dnode = nodeFromPath(fullpath, nodes[0]);
            if (dnode) {
                props.handleNodeClick(dnode, nodes);
            }
        }
        dispatch({
            type: "SET_IS_SELECTED_FROM_FULLPATH",
            fullpath: fullpath
        });
        exposeNode(fullpath)
    }

    function initSocket() {
        if (props.tsocket) {
            props.tsocket.attachListener("pool-name-change", (data) => {
                dispatch({
                    type: "CHANGE_NODE_NAME",
                    old_path: data.old_path,
                    new_path: data.new_path
                });
                focusNode(data.new_path, nodes_ref.current)
            });
            props.tsocket.attachListener("pool-remove-node", (data) => {
                dispatch({
                    type: "REMOVE_NODE",
                    full_path: data.full_path
                });
                dispatch({
                    type: "DESELECT_ALL",
                })
            });
            props.tsocket.attachListener("pool-add-file", (data) => {
                dispatch({
                    type: "ADD_FILE",
                    full_path: data.full_path
                });
                focusNode(data.full_path, nodes_ref.current)
            });
            props.tsocket.attachListener("pool-add-directory", (data) => {
                dispatch({
                    type: "ADD_DIRECTORY",
                    full_path: data.full_path
                });
                focusNode(data.full_path, nodes_ref.current)
            });
            props.tsocket.attachListener("pool-move", (data) => {
                dispatch({
                    type: "MOVE_NODE",
                    src: data.src,
                    dst: data.dst
                });
                focusNode(`${data.dst}/${getBasename(data.src)}`, nodes_ref.current)
            })
        }
    }

    function exposeBaseNode() {
        if (nodes_ref.current.length == 0) return;
        dispatch({
            type: "SET_IS_EXPANDED",
            node_id: nodes_ref.current[0].id,
            isExpanded: true
        })
    }

    function exposeNode(fullpath) {
        let the_path = findNodePath(fullpath);
        if (the_path) {
            dispatch({
                type: "MULTI_SET_IS_EXPANDED",
                node_list: the_path,
                isExpanded: true
            })
        }
        else {
            exposeBaseNode()
        }
    }

    function findNodePath(fullpath) {
        var current_path = [];
        return searchDown(nodes_ref.current, fullpath, current_path);
    }

    function searchDown(childNodes, fullpath, current_path) {
        for (let node of childNodes) {
            if (node.fullpath == fullpath) {
                return current_path + [node.id]
            }
            else {
                if ("childNodes" in node) {
                    var the_path = searchDown(node.childNodes, fullpath, current_path + [node.id]);
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

    function handleNodeExpand(node) {
        dispatch({
            type: "SET_IS_EXPANDED",
            node_id: node.id,
            isExpanded: true
        })
    }

    function handleNodeClick(node) {
        if (props.select_type == "file" && node.isDirectory) return;
        if (props.select_type == "folder" && !node.isDirectory) return;
        if (props.handleNodeClick) {
            props.handleNodeClick(node, nodes_ref.current);
            dispatch({
                type: "SET_IS_SELECTED",
                id: node.id
            })
        }
    }

    function displayContextMenu(node, nodepath, e) {
        e.preventDefault();
        setShowContextMenu(true);
        setContextMenuNode(node);
        setContentMenuTarget({left: e.clientX, top: e.clientY});
    }

    return (
        <Fragment>
                <ContextMenuPopover onClose={()=>{setShowContextMenu(false)}}  // Without this doesn't close
                            content={props.renderContextMenu != null ?
                                props.renderContextMenu({node: contextMenuNode}) : null}
                            isOpen={showContextMenu}
                            isDarkTheme={theme.dark_theme}
                            targetOffset={contextMenuTarget}/>
                <CustomTree contents={nodes_ref.current}
                            sortField={props.sortField}
                            sortDirection={props.sortDirection}
                            showSecondaryLabel={props.showSecondaryLabel}
                            className="pool-select-tree"
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
    return str.substring(str.lastIndexOf('/')+1);
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
    const [maxPopoverHeight, setMaxPopoverHeight, maxPopoverHeightRef] = useStateAndRef(.4 * window.innerHeight);

    useEffect(()=>{
        window.addEventListener("resize", resizePopover);
        setRefAcquired(false);
    }, []);

    useEffect(() => {
        resizePopover();
      }, [refAcquired]);

    function resizePopover() {
        if (pop_ref.current) {
            var max_height = window.innerHeight - pop_ref.current.offsetTop - 25;
            setMaxPopoverHeight(max_height);
        }
    }

    function handleNodeClick(node, nodes) {
        props.setValue(node.fullpath);
        setIsOpen(false);
        return true
    }

    function onInteract(next_state, e) {
        if (e && e.currentTarget == document) {
            setIsOpen(false);
        }
    }

    let button_text;
    if (!props.value || props.value == "") {
        button_text = "not set"
    }
    else {
        button_text = getBasename(props.value)
    }
    let tree_element = (
        <div style={{maxHeight: maxPopoverHeightRef.current, overflowY: "scroll"}}>
            <PoolTree value={props.value}
                      tsocket={props.tsocket}
                      select_type={props.select_type}
                      user_id={window.user_id}
                      renderContextMenu={null}
                      showSecondaryLabel={false}
                      handleDrop={null}
                      handleNodeClick={handleNodeClick}/>
        </div>
    );

    return (
            <Popover
                popoverRef={pop_ref}
                isOpen={isOpen}
                onInteraction={onInteract}
                onOpened={()=>{
                        setRefAcquired(true)
                    }
                }
                onClosed={()=>{
                        setRefAcquired(false)
                    }
                }
                position="bottom-left"
                minimal={true}
                modifiers={{
                    flip: {enabled: false},
                    preventOverflow: { enabled: false }
                }}
                content={tree_element}>
                <Button text={button_text} onClick={()=>{setIsOpen(!isOpen)}}/>
            </Popover>
    )
}

PoolAddressSelector = memo(PoolAddressSelector);

// CustomTree is necessary to support drag-and-drop
// This is largely copied from the blueprintjs source code
function CustomTree(props) {

    function sortNodes(nlist) {
        let newList = _.cloneDeep(nlist);
        if (props.sortField == "name") {
            newList.sort((a, b)=>{return a.basename.localeCompare(b.basename)});

        }
        else if (props.sortField == "size") {
            newList.sort((a, b)=>{return a.size_for_sort - b.size_for_sort})
        }
        else {
            newList.sort((a, b)=>{return a.updated_for_sort - b.updated_for_sort})
        }

        if (props.sortDirection == "descending") {
            newList = newList.reverse()
        }
        return newList
    }

    function renderNodes(treeNodes, currentPath, className) {
        if (treeNodes == null) {
            return null;
        }

        let sortedNodes = sortNodes(treeNodes);
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
                    onDoubleClick={props.onNodeDoubleClick}
                    onExpand={props.onNodeExpand}
                    onMouseEnter={props.onNodeMouseEnter}
                    onMouseLeave={props.onNodeMouseLeave}
                    path={elementPath}
                    secondaryLabel={props.showSecondaryLabel ? `${node.updated}   ${String(node.size)}`: null}
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
            }
            else if (!node.isDirectory && props.handleDrop) {
                return (
                    <div key={node.fullpath}
                         draggable={true}
                         onDragStart={(e)=>{
                             e.dataTransfer.setData("fullpath", node.fullpath)
                         }}
                         onDragEnd={(e)=>{
                         }}>
                        {tnode}
                    </div>
                )
            }
            else {
                return tnode
            }
        });

        return <ul className={`bp5-tree-node-list ${props.className}`}>{nodeItems}</ul>;
    }

    return (
        <div className="bp5-tree" style={{width: "100%"}}>
            {renderNodes(props.contents, [], Classes.TREE_ROOT)}
        </div>
    );
}

CustomTree = memo(CustomTree);

function FileDropWrapper(props) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        if (props.suppress.current) return;
        e.preventDefault();
        e.stopPropagation();  // So that containing folders don't also get event;
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        if (props.suppress.current) return;
        e.preventDefault();
        e.stopPropagation();  // So that containing folders don't also get event;
        setIsDragging(false);
        if (props.handleDrop) {
            props.handleDrop(e, props.fullpath)
        }
    };

    return (
        <div
            className={`drop-zone ${isDragging ? 'drag-over' : ''}`}
            onDragOver={props.suppress.current ? null : handleDragOver}
            onDragLeave={props.suppress.current ? null : handleDragLeave}
            onDrop={props.suppress.current ? null : handleDrop}
        >
            {props.children}
        </div>
    );
}

