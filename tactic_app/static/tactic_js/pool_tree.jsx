import React from "react";
import {useState, useEffect, memo} from "react";
import {Tree, Popover, Button} from "@blueprintjs/core";

import _ from "lodash";
import {doFlash} from "./toaster"
import {useCallbackStack, useReducerAndRef} from "./utilities_react";
import {postWithCallback} from "./communication_react";


export {PoolTree, PoolAddressSelector}


function treeNodesReducer(nodes, action) {
    switch (action.type) {
        case "REPLACE_ALL":
            return action.new_nodes;
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
        default:
            return nodes;
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

function PoolTree(props) {
    const [nodes, dispatch, nodes_ref] = useReducerAndRef(treeNodesReducer, []);
    const pushCallback = useCallbackStack();

    useEffect(()=>{
        postWithCallback("host", "GetPoolTree", {user_id: props.user_id}, function (data) {
            if (!data.dtree) {
                doFlash("No pool storage available for this account.");
                return
            }
            dispatch({
                type: "REPLACE_ALL",
                new_nodes: data.dtree
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
    }, []);

    function exposeBaseNode() {
        if (nodes.length == 0) return;
        dispatch({
            type: "SET_IS_EXPANDED",
            node_id: nodes[0].id,
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
        props.handleNodeClick(node, nodes)
    }

    return (<Tree contents={nodes}
                  className="pool-select-tree"
                  onNodeClick={handleNodeClick}
                  onNodeCollapse={handleNodeCollapse}
                  onNodeExpand={handleNodeExpand}/>)
}

PoolTree = memo(PoolTree);

function getBasename(str) {
    return str.substring(str.lastIndexOf('/')+1);
}

function PoolAddressSelector(props) {
    const [isOpen, setIsOpen] = useState(false);


    function handleNodeClick(node, nodes) {
        if (node.id != nodes[0].id) {
            props.setValue(node.fullpath);
        }
        setIsOpen(false)
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
        <PoolTree value={props.value}
                  select_type={props.select_type}
                  user_id={window.user_id}
                  handleNodeClick={handleNodeClick}/>
    );
    return (
            <Popover
                isOpen={isOpen}
                onInteraction={onInteract}
                position="bottom-left"
                minimal={true}
                content={tree_element}>
                <Button text={button_text} onClick={()=>{setIsOpen(!isOpen)}}/>
            </Popover>
    )
}

PoolAddressSelector = memo(PoolAddressSelector);
