"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PoolAddressSelector = PoolAddressSelector;
exports.PoolTree = PoolTree;
exports.getBasename = getBasename;
exports.getFileParentPath = getFileParentPath;
exports.splitFilePath = splitFilePath;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _lodash = _interopRequireDefault(require("lodash"));
var _toaster = require("./toaster");
var _utilities_react = require("./utilities_react");
var _communication_react = require("./communication_react");
var _theme = require("./theme");
var _library_widgets = require("./library_widgets");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function treeNodesReducer(nodes, action) {
  switch (action.type) {
    case "REPLACE_ALL":
      return _lodash.default.cloneDeep(action.new_nodes);
    case "DESELECT_ALL":
      const newState1 = _lodash.default.cloneDeep(nodes);
      forEachNode(newState1, node => node.isSelected = false);
      return newState1;
    case "DISABLE_FOLDERS":
      const newState6 = _lodash.default.cloneDeep(nodes);
      forEachNode(newState6, node => {
        node.disabled = node.isDirectory;
      });
      return newState6;
    case "DISABLE_FILES":
      const newState7 = _lodash.default.cloneDeep(nodes);
      forEachNode(newState7, node => {
        node.disabled = !node.isDirectory;
      });
      return newState7;
    case "SET_IS_EXPANDED":
      const newState2 = _lodash.default.cloneDeep(nodes);
      forEachNode(newState2, node => {
        if (node.id == action.node_id) {
          node.isExpanded = action.isExpanded;
        }
      });
      return newState2;
    case "MULTI_SET_IS_EXPANDED":
      const newState3 = _lodash.default.cloneDeep(nodes);
      forEachNode(newState3, node => {
        if (action.node_list.includes(node.id)) {
          node.isExpanded = action.isExpanded;
        }
      });
      return newState3;
    case "SET_IS_SELECTED":
      const newState4 = _lodash.default.cloneDeep(nodes);
      forEachNode(newState4, node => {
        node.isSelected = node.id == action.id;
      });
      return newState4;
    case "SET_IS_SELECTED_FROM_FULLPATH":
      const newState5 = _lodash.default.cloneDeep(nodes);
      forEachNode(newState5, node => {
        node.isSelected = node.fullpath == action.fullpath;
      });
      return newState5;
    case "CHANGE_NODE_NAME":
      const newState8 = _lodash.default.cloneDeep(nodes);
      forEachNode(newState8, node => {
        if (node.fullpath == action.old_path) {
          updateNode(node, action.new_path);
        }
      });
      const pNode = nodeFromPath(getFileParentPath(action.new_path), newState8[0]);
      return newState8;
    case "MODIFY_FILE":
      const newStateMF = _lodash.default.cloneDeep(nodes);
      forEachNode(newStateMF, node => {
        if (node.fullpath == action.fileDict.fullpath) {
          action.fileDict.isSelected = node.isSelected;
          updateNode(node, action.fileDict);
        }
      });
      return newStateMF;
    case "MODIFY_DIRECTORY":
      const newStateMD = _lodash.default.cloneDeep(nodes);
      forEachNode(newStateMD, node => {
        if (node.fullpath == action.folderDict.fullpath) {
          action.folderDict.isSelected = node.isSelected;
          action.folderDict.isExpanded = node.isExpanded;
          action.folderDict.childNodes = node.childNodes;
          updateNode(node, action.folderDict);
        }
      });
      return newStateMD;
    case "REMOVE_NODE":
      const newState9 = _lodash.default.cloneDeep(nodes);
      forEachNode(newState9, node => {
        if (node.isDirectory) {
          var new_children = [];
          for (const cnode of node.childNodes) {
            if (cnode.fullpath != action.fullpath) {
              new_children.push(cnode);
            }
          }
          node.childNodes = new_children;
        }
      });
      return newState9;
    case "ADD_FILE":
      const newState10 = _lodash.default.cloneDeep(nodes);
      const [path, fname] = splitFilePath(action.fileDict.fullpath);
      forEachNode(newState10, node => {
        if (node.isDirectory) {
          if (node.fullpath == path) {
            node.childNodes.push(action.fileDict);
          }
        }
      });
      return newState10;
    case "ADD_DIRECTORY":
      const newState11 = _lodash.default.cloneDeep(nodes);
      const [dpath, dfname] = splitFilePath(action.folderDict.fullpath);
      forEachNode(newState11, node => {
        if (node.isDirectory) {
          if (node.fullpath == dpath) {
            node.childNodes.push(action.folderDict);
          }
        }
      });
      return newState11;
    case "MOVE_FILE":
      const newState12 = _lodash.default.cloneDeep(nodes);
      let src_node;
      let found_file = false;
      forEachNode(newState12, node => {
        if (node.isDirectory) {
          var new_children = [];
          for (const cnode of node.childNodes) {
            if (cnode.fullpath != action.src) {
              new_children.push(cnode);
            } else {
              found_file = true;
              action.fileDict.isSelected = cnode.isSelected;
            }
          }
          node.childNodes = new_children;
        }
      });
      if (found_file) {
        forEachNode(newState12, node => {
          if (node.isDirectory && node.fullpath == action.dst) {
            node.childNodes.push(action.fileDict);
          }
        });
      }
      return newState12;
    case "MOVE_DIRECTORY":
      const newStateMDir = _lodash.default.cloneDeep(nodes);
      let src_dir;
      let found_dir = false;
      forEachNode(newStateMDir, node => {
        if (node.isDirectory && node.fullpath != action.src) {
          var new_children = [];
          for (const cnode of node.childNodes) {
            if (cnode.fullpath != action.src) {
              new_children.push(cnode);
            } else {
              found_dir = true;
              action.folderDict.isSelected = cnode.isSelected;
              action.folderDict.childNodes = cnode.childNodes;
              action.folderDict.isExpanded = cnode.isExpanded;
              const newpath = `${action.dst}/${action.folderDict.basename}`;
              for (let ccnode of action.folderDict.childNodes) {
                ccnode.fullpath = `${newpath}/${ccnode.basename}`;
              }
            }
          }
          node.childNodes = new_children;
        }
      });
      if (found_dir) {
        forEachNode(newStateMDir, node => {
          if (node.isDirectory && node.fullpath == action.dst) {
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
    node[key] = newDict[key];
  }
  return;
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
  };
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
  };
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
      return node;
    }
  }
  for (const node of root.childNodes) {
    if (node.isDirectory) {
      let result = nodeFromPath(fullpath, node);
      if (result) {
        return result;
      }
    }
  }
  return null;
}
function sortNodes(nlist) {
  let newList = _lodash.default.cloneDeep(nlist);
  newList.sort((a, b) => {
    return a.basename.localeCompare(b.basename);
  });
  return newList;
}
function PoolTree(props) {
  const [nodes, dispatch, nodes_ref] = (0, _utilities_react.useReducerAndRef)(treeNodesReducer, []);
  const [showContextMenu, setShowContextMenu] = (0, _react.useState)(false);
  const [contextMenuTarget, setContentMenuTarget] = (0, _react.useState)({
    left: 0,
    top: 0
  });
  const [contextMenuNode, setContextMenuNode] = (0, _react.useState)("");
  const [folderOver, setFolderOver] = (0, _react.useState)("null");
  const [searchString, setSearchString, searchStringRef] = (0, _utilities_react.useStateAndRef)("");
  const [sortBy, setSortBy] = (0, _react.useState)("updated");
  const [sortDirection, setSortDirection] = (0, _react.useState)("descending");
  const theme = (0, _react.useContext)(_theme.ThemeContext);
  const pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _react.useEffect)(() => {
    initSocket();
    if (props.registerTreeRefreshFunc) {
      props.registerTreeRefreshFunc(getTree);
    }
    getTree().then(() => {});
  }, []);
  async function getTree() {
    try {
      let data = await (0, _communication_react.postPromise)("host", "GetPoolTree", {
        user_id: props.user_id
      });
      if (!data.dtree) {
        (0, _toaster.doFlash)("No pool storage available for this account.");
        return;
      }
      data.dtree[0].isExpanded = true;
      dispatch({
        type: "REPLACE_ALL",
        new_nodes: data.dtree
      });
      if (props.value) {
        pushCallback(() => {
          dispatch({
            type: "SET_IS_SELECTED_FROM_FULLPATH",
            fullpath: props.value
          });
        });
        pushCallback(() => {
          exposeNode(props.value);
        });
      } else {
        pushCallback(exposeBaseNode);
      }
    } catch (e) {
      errorDrawerFuncs.addFromError("Error getting pool tree", e);
    }
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
    exposeNode(fullpath);
  }
  function initSocket() {
    if (props.tsocket) {
      props.tsocket.attachListener("pool-directory-event", data => {
        const event_type = data["event_type"];
        const path = data["path"];
        let folderDict = data.folder_dict;
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
      });
      props.tsocket.attachListener("pool-file-event", data => {
        const event_type = data["event_type"];
        const path = data["path"];
        let fileDict = data.file_dict;
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
      });
    }
  }
  function exposeBaseNode() {
    if (nodes_ref.current.length == 0) return;
    dispatch({
      type: "SET_IS_EXPANDED",
      node_id: nodes_ref.current[0].id,
      isExpanded: true
    });
  }
  function exposeNode(fullpath) {
    let the_path = findNodePath(fullpath);
    if (the_path) {
      dispatch({
        type: "MULTI_SET_IS_EXPANDED",
        node_list: the_path,
        isExpanded: true
      });
    } else {
      exposeBaseNode();
    }
  }
  function findNodePath(fullpath) {
    var current_path = [];
    return searchDown(nodes_ref.current, fullpath, current_path);
  }
  function searchDown(childNodes, fullpath, current_path) {
    for (let node of childNodes) {
      if (node.fullpath == fullpath) {
        return current_path + [node.id];
      } else {
        if ("childNodes" in node) {
          var the_path = searchDown(node.childNodes, fullpath, current_path + [node.id]);
          if (the_path) {
            return the_path;
          }
        }
      }
    }
    return null;
  }
  function handleNodeCollapse(node) {
    dispatch({
      type: "SET_IS_EXPANDED",
      node_id: node.id,
      isExpanded: false
    });
  }
  function handleNodeExpand(node) {
    dispatch({
      type: "SET_IS_EXPANDED",
      node_id: node.id,
      isExpanded: true
    });
  }
  function handleNodeClick(node) {
    if (props.select_type == "file" && node.isDirectory) return;
    if (props.select_type == "folder" && !node.isDirectory) return;
    if (props.handleNodeClick) {
      props.handleNodeClick(node, nodes_ref.current);
      dispatch({
        type: "SET_IS_SELECTED",
        id: node.id
      });
    }
  }
  function displayContextMenu(node, nodepath, e) {
    e.preventDefault();
    setShowContextMenu(true);
    setContextMenuNode(node);
    setContentMenuTarget({
      left: e.clientX,
      top: e.clientY
    });
  }
  function _update_search_state(new_state) {
    setSearchString(new_state.search_string);
  }
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_core.ContextMenuPopover, {
    onClose: () => {
      setShowContextMenu(false);
    } // Without this doesn't close
    ,
    content: props.renderContextMenu != null ? props.renderContextMenu({
      node: contextMenuNode
    }) : null,
    isOpen: showContextMenu,
    isDarkTheme: theme.dark_theme,
    targetOffset: contextMenuTarget
  }), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      paddingLeft: 10,
      paddingTop: 10,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/_react.default.createElement(_library_widgets.SearchForm, {
    allow_search_inside: false,
    allow_search_metadata: false,
    update_search_state: _update_search_state,
    search_string: searchStringRef.current
  }), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: "flex",
      marginLeft: 15
    }
  }, /*#__PURE__*/_react.default.createElement(_core.HTMLSelect, {
    options: ["name", "size", "updated"],
    className: "tree-sort-select",
    onChange: event => {
      setSortBy(event.target.value);
    },
    minimal: true,
    value: sortBy
  }), /*#__PURE__*/_react.default.createElement(_core.HTMLSelect, {
    options: ["ascending", "descending"],
    className: "tree-sort-select",
    onChange: event => {
      setSortDirection(event.target.value);
    },
    minimal: true,
    value: sortDirection
  }))), /*#__PURE__*/_react.default.createElement(CustomTree, {
    contents: nodes_ref.current,
    searchString: searchStringRef.current,
    sortField: sortBy,
    sortDirection: sortDirection,
    showSecondaryLabel: props.showSecondaryLabel,
    className: "pool-select-tree",
    handleDrop: props.handleDrop,
    onNodeContextMenu: props.renderContextMenu ? displayContextMenu : null,
    onNodeClick: handleNodeClick,
    onNodeCollapse: handleNodeCollapse,
    onNodeExpand: handleNodeExpand
  }));
}
exports.PoolTree = PoolTree = /*#__PURE__*/(0, _react.memo)(PoolTree);
function getBasename(str) {
  return str.substring(str.lastIndexOf('/') + 1);
}
function getFileParentPath(path) {
  let plist = path.split("/");
  plist.pop();
  return plist.join("/");
}
function splitFilePath(path) {
  let plist = path.split("/");
  let fname = plist.pop();
  return [plist.join("/"), fname];
}
function PoolAddressSelector(props) {
  const [isOpen, setIsOpen] = (0, _react.useState)(false);
  const pop_ref = (0, _react.useRef)(null);
  const [refAcquired, setRefAcquired] = (0, _react.useState)(false);
  const [maxPopoverHeight, setMaxPopoverHeight, maxPopoverHeightRef] = (0, _utilities_react.useStateAndRef)(.4 * window.innerHeight);
  (0, _react.useEffect)(() => {
    window.addEventListener("resize", resizePopover);
    setRefAcquired(false);
    return () => {
      window.removeEventListener("resize", resizePopover);
    };
  }, []);
  (0, _react.useEffect)(() => {
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
    return true;
  }
  function onInteract(next_state, e) {
    if (e && e.currentTarget == document) {
      setIsOpen(false);
    }
  }
  let button_text;
  if (!props.value || props.value == "") {
    button_text = "not set";
  } else {
    button_text = getBasename(props.value);
  }
  let tree_element = /*#__PURE__*/_react.default.createElement("div", {
    style: {
      maxHeight: maxPopoverHeightRef.current,
      overflowY: "scroll"
    }
  }, /*#__PURE__*/_react.default.createElement(PoolTree, {
    value: props.value,
    sortField: "name",
    sortDirection: "ascending",
    tsocket: props.tsocket,
    select_type: props.select_type,
    user_id: window.user_id,
    renderContextMenu: null,
    showSecondaryLabel: false,
    handleDrop: null,
    handleNodeClick: handleNodeClick
  }));
  return /*#__PURE__*/_react.default.createElement(_core.Popover, {
    popoverRef: pop_ref,
    isOpen: isOpen,
    onInteraction: onInteract,
    onOpened: () => {
      setRefAcquired(true);
    },
    onClosed: () => {
      setRefAcquired(false);
    },
    position: "bottom-left",
    minimal: true,
    modifiers: {
      flip: {
        enabled: false
      },
      preventOverflow: {
        enabled: false
      }
    },
    content: tree_element
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    text: button_text,
    onClick: () => {
      setIsOpen(!isOpen);
    }
  }));
}
exports.PoolAddressSelector = PoolAddressSelector = /*#__PURE__*/(0, _react.memo)(PoolAddressSelector);

// CustomTree is necessary to support drag-and-drop
// This is largely copied from the blueprintjs source code
function CustomTree(props) {
  function sortFilterNodes(nlist) {
    let newList = _lodash.default.cloneDeep(nlist);
    if (props.sortField == "name") {
      newList.sort((a, b) => {
        return a.basename.localeCompare(b.basename);
      });
    } else if (props.sortField == "size") {
      newList.sort((a, b) => {
        return a.size_for_sort - b.size_for_sort;
      });
    } else {
      newList.sort((a, b) => {
        return a.updated_for_sort - b.updated_for_sort;
      });
    }
    if (props.sortDirection == "descending") {
      newList = newList.reverse();
    }
    if (props.searchString != "") {
      newList = newList.filter(a => a.isDirectory || a.basename.includes(props.searchString));
    }
    return newList;
  }
  function renderNodes(treeNodes, currentPath, className) {
    if (treeNodes == null) {
      return null;
    }
    let sortedNodes = sortFilterNodes(treeNodes);
    const nodeItems = sortedNodes.map((node, i) => {
      const elementPath = currentPath.concat(i);
      const tnode = /*#__PURE__*/_react.default.createElement(_core.TreeNode, (0, _extends2.default)({}, node, {
        key: node.id,
        contentRef: props.handleContentRef,
        depth: elementPath.length - 1,
        onClick: props.onNodeClick,
        onContextMenu: props.onNodeContextMenu,
        onCollapse: props.onNodeCollapse,
        onDoubleClick: props.onNodeDoubleClick,
        onExpand: props.onNodeExpand,
        onMouseEnter: props.onNodeMouseEnter,
        onMouseLeave: props.onNodeMouseLeave,
        path: elementPath,
        secondaryLabel: props.showSecondaryLabel ? `${node.updated}   ${String(node.size)}` : null
      }), renderNodes(node.childNodes, elementPath));
      if (node.isDirectory && props.handleDrop) {
        return /*#__PURE__*/_react.default.createElement(FileDropWrapper, {
          handleDrop: props.handleDrop,
          suppress: false,
          key: node.fullpath,
          fullpath: node.fullpath
        }, tnode);
      } else if (!node.isDirectory && props.handleDrop) {
        return /*#__PURE__*/_react.default.createElement("div", {
          key: node.fullpath,
          draggable: true,
          onDragStart: e => {
            e.dataTransfer.setData("fullpath", node.fullpath);
          },
          onDragEnd: e => {}
        }, tnode);
      } else {
        return tnode;
      }
    });
    return /*#__PURE__*/_react.default.createElement("ul", {
      className: `bp5-tree-node-list ${props.className}`
    }, nodeItems);
  }
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "bp5-tree",
    style: {
      width: "100%"
    }
  }, renderNodes(props.contents, [], _core.Classes.TREE_ROOT));
}
CustomTree = /*#__PURE__*/(0, _react.memo)(CustomTree);
function FileDropWrapper(props) {
  const [isDragging, setIsDragging] = (0, _react.useState)(false);
  const handleDragOver = e => {
    if (props.suppress.current) return;
    e.preventDefault();
    e.stopPropagation(); // So that containing folders don't also get event;
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleDrop = e => {
    if (props.suppress.current) return;
    e.preventDefault();
    e.stopPropagation(); // So that containing folders don't also get event;
    setIsDragging(false);
    if (props.handleDrop) {
      props.handleDrop(e, props.fullpath);
    }
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: `drop-zone ${isDragging ? 'drag-over' : ''}`,
    onDragOver: props.suppress.current ? null : handleDragOver,
    onDragLeave: props.suppress.current ? null : handleDragLeave,
    onDrop: props.suppress.current ? null : handleDrop
  }, props.children);
}