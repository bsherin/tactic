"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PoolBrowser = PoolBrowser;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _utilities_react = require("./utilities_react");
var _library_menubars = require("./library_menubars");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _pool_tree = require("./pool_tree");
var _resizing_layouts = require("./resizing_layouts2");
var _communication_react = require("./communication_react");
var _error_drawer = require("./error_drawer");
var _sizing_tools = require("./sizing_tools");
var _toaster = require("./toaster");
var _theme = require("./theme");
var _modal_react = require("./modal_react");
var _library_home_react = require("./library_home_react");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const pool_browser_id = (0, _utilities_react.guid)();
function PoolBrowser(props) {
  const top_ref = (0, _react.useRef)(null);
  const resizing = (0, _react.useRef)(false);
  const [selected_resource, set_selected_resource, selected_resource_ref] = (0, _utilities_react.useStateAndRef)({
    name: "",
    tags: "",
    notes: "",
    updated: "",
    created: "",
    size: ""
  });
  const [value, setValue, valueRef] = (0, _utilities_react.useStateAndRef)(null);
  const [selectedNode, setSelectedNode, selectedNodeRef] = (0, _utilities_react.useStateAndRef)(null);
  const [multi_select, set_multi_select, multi_select_ref] = (0, _utilities_react.useStateAndRef)(false);
  const [list_of_selected, set_list_of_selected, list_of_selected_ref] = (0, _utilities_react.useStateAndRef)([]);
  const [contextMenuItems, setContextMenuItems] = (0, _react.useState)([]);
  const [have_activated, set_have_activated] = (0, _react.useState)(false);
  const theme = (0, _react.useContext)(_theme.ThemeContext);
  const dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  const statudFuncs = (0, _react.useContext)(_toaster.StatusContext);
  const [usable_width, usable_height, topX, topY] = (0, _sizing_tools.useSize)(top_ref, 0, "pool_browser");
  const treeRefreshFunc = (0, _react.useRef)(null);
  // Important note: The first mounting of the pool tree must happen after the pool pane
  // is first activated. Otherwise, I do GetPoolTree before everything is ready and I don't
  // get the callback for the post.

  (0, _react.useEffect)(() => {
    if (props.am_selected && !have_activated) {
      set_have_activated(true);
    }
  }, [props.am_selected]);
  (0, _react.useEffect)(() => {
    if (selectedNodeRef.current) {
      set_selected_resource({
        name: (0, _pool_tree.getBasename)(value),
        tags: "",
        notes: "",
        updated: selectedNodeRef.current.updated,
        created: selectedNodeRef.current.created,
        size: String(selectedNodeRef.current.size)
      });
    } else {
      set_selected_resource({
        name: "",
        tags: "",
        notes: "",
        updated: "",
        created: ""
      });
    }
  }, [value]);
  function handlePoolEvent() {}
  async function _rename_func() {
    let node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (!valueRef.current && !node) return;
    try {
      const path = node && "isDirectory" in node ? node.fullpath : valueRef.current;
      let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
        title: "Rename Pool Resource",
        field_title: "New Name",
        default_value: (0, _pool_tree.getBasename)(path),
        existing_names: [],
        checkboxes: [],
        handleClose: dialogFuncs.hideModal
      });
      const the_data = {
        new_name: new_name,
        old_path: path
      };
      await (0, _communication_react.postAjaxPromise)(`rename_pool_resource`, the_data);
    } catch (e) {
      if (e != "canceled") {
        errorDrawerFuncs.addFromError(`Error renaming`, e);
      }
      return;
    }
  }
  async function _add_directory() {
    let node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (!valueRef.current && !node) return;
    try {
      const sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
      let initial_address;
      if (sNode.isDirectory) {
        initial_address = sNode.fullpath;
      } else {
        initial_address = (0, _pool_tree.getFileParentPath)(sNode.fullpath);
      }
      let full_path = await dialogFuncs.showModalPromise("SelectAddressDialog", {
        title: "Add a Pool Directory",
        selectType: "folder",
        initial_address: initial_address,
        initial_name: "New Directory",
        showName: true,
        handleClose: dialogFuncs.hideModal
      });
      const the_data = {
        full_path: full_path
      };
      await (0, _communication_react.postAjaxPromise)(`create_pool_directory`, the_data);
    } catch (e) {
      if (e != "canceled") {
        errorDrawerFuncs.addFromError(`Error adding directory`, e);
      }
      return;
    }
  }
  async function _duplicate_file() {
    let node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (!valueRef.current && !node) return;
    try {
      const sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
      if (sNode.isDirectory) {
        (0, _toaster.doFlash)("You can't duplicate a directory");
        return;
      }
      const src = sNode.fullpath;
      const [initial_address, initial_name] = (0, _pool_tree.splitFilePath)(sNode.fullpath);
      let dst = await dialogFuncs.showModalPromise("SelectAddressDialog", {
        title: "Duplicate a file",
        selectType: "folder",
        initial_address: initial_address,
        initial_name: initial_name,
        showName: true,
        handleClose: dialogFuncs.hideModal
      });
      const the_data = {
        dst,
        src
      };
      await (0, _communication_react.postAjaxPromise)(`duplicate_pool_file`, the_data);
    } catch (e) {
      if (e != "canceled") {
        errorDrawerFuncs.addFromError(`Error duplicating file`, e);
      }
      return;
    }
  }
  async function _downloadFile() {
    let node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (!valueRef.current && !node) return;
    try {
      const sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
      if (sNode.isDirectory) {
        (0, _toaster.doFlash)("You can't download a directory");
        return;
      }
      const src = sNode.fullpath;
      console.log("Got source " + String(src));
      let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
        title: "Download File",
        field_title: "New File Name",
        default_value: (0, _pool_tree.getBasename)(src),
        existing_names: [],
        checkboxes: [],
        handleClose: dialogFuncs.hideModal
      });
      const the_data = {
        src
      };
      let [data, status, xhr] = await (0, _communication_react.getBlobPromise)("download_pool_file", the_data);
      if (xhr.status === 200) {
        // Create a download link and trigger the download
        var blob = new Blob([data], {
          type: 'application/octet-stream'
        });
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = new_name; // Set the desired file name
        // noinspection XHTMLIncompatabilitiesJS
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (e) {
      if (e != "canceled") {
        errorDrawerFuncs.addFromError(`Error downloading from pool`, e);
      }
    }
  }
  async function MoveResource(src, dst) {
    if (src == dst) return;
    try {
      const the_data = {
        dst: dst,
        src: src
      };
      await (0, _communication_react.postAjaxPromise)(`move_pool_resource`, the_data);
    } catch (e) {
      errorDrawerFuncs.addFromError("Error moving resource", e);
    }
  }
  async function _move_resource() {
    let node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (!valueRef.current && !node) return;
    try {
      const sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
      const src = sNode.fullpath;
      let initial_address;
      if (sNode.isDirectory) {
        initial_address = sNode.fullpath;
      } else {
        initial_address = (0, _pool_tree.getFileParentPath)(sNode.fullpath);
      }
      let dst = await dialogFuncs.showModalPromise("SelectAddressDialog", {
        title: `Select a destination for ${(0, _pool_tree.getBasename)(src)}`,
        selectType: "folder",
        initial_address: initial_address,
        initial_name: "",
        showName: false,
        handleClose: dialogFuncs.hideModal
      });
      await MoveResource(src, dst);
    } catch (e) {
      if (e != "canceled") {
        errorDrawerFuncs.addFromError(`Error moving resource`, e);
      }
    }
  }
  async function _delete_func() {
    let node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (!valueRef.current && !node) return;
    try {
      const path = node && "isDirectory" in node ? node.fullpath : valueRef.current;
      const sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
      if (sNode.isDirectory && sNode.childNodes.length > 0) {
        (0, _toaster.doFlash)("You can't delete a non-empty directory");
        return;
      }
      const basename = (0, _pool_tree.getBasename)(path);
      const confirm_text = `Are you sure that you want to delete ${basename}?`;
      await dialogFuncs.showModalPromise("ConfirmDialog", {
        title: "Delete resource",
        text_body: confirm_text,
        cancel_text: "do nothing",
        submit_text: "delete",
        handleClose: dialogFuncs.hideModal
      });
      await (0, _communication_react.postAjaxPromise)("delete_pool_resource", {
        full_path: path,
        is_directory: sNode.isDirectory
      });
    } catch (e) {
      if (e != "canceled") {
        errorDrawerFuncs.addFromError(`Error deleting`, e);
      }
    }
  }
  function _add_to_pool(myDropZone, setCurrentUrl, current_value) {
    let new_url = `import_pool/${_library_home_react.library_id}`;
    myDropZone.options.url = new_url;
    setCurrentUrl(new_url);
    myDropZone.processQueue();
  }
  function _showPoolImport() {
    let node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var initial_directory;
    const sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
    if (sNode && sNode.isDirectory) {
      initial_directory = sNode.fullpath;
    } else {
      initial_directory = "/mydisk";
    }
    dialogFuncs.showModal("FileImportDialog", {
      res_type: "pool",
      allowed_file_types: null,
      checkboxes: [],
      process_handler: _add_to_pool,
      chunking: true,
      chunkSize: 1024 * 1000 * 25,
      forceChunking: true,
      tsocket: props.tsocket,
      combine: false,
      show_csv_options: false,
      after_upload: null,
      show_address_selector: true,
      initial_address: initial_directory,
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }
  async function handleDrop(e, dst) {
    const files = e.dataTransfer.files;
    if (files.length != 0) {
      dialogFuncs.showModal("FileImportDialog", {
        res_type: "pool",
        allowed_file_types: null,
        checkboxes: [],
        chunking: true,
        chunkSize: 1024 * 1000 * 25,
        forceChunking: true,
        process_handler: _add_to_pool,
        tsocket: props.tsocket,
        combine: false,
        show_csv_options: false,
        after_upload: null,
        show_address_selector: true,
        initial_address: dst,
        handleClose: dialogFuncs.hideModal,
        handleCancel: null,
        initialFiles: files
      });
    } else {
      let src = e.dataTransfer.getData("fullpath");
      if (src) {
        await MoveResource(src, dst);
      }
    }
  }
  function handleNodeClick(node, nodes) {
    setValue(node.fullpath);
    setSelectedNode(node);
    return true;
  }
  function renderContextMenu(props) {
    return /*#__PURE__*/_react.default.createElement(_core.Menu, null, /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
      icon: "edit",
      onClick: async () => {
        await _rename_func(props.node);
      },
      text: "Rename Resource"
    }), /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
      icon: "inheritance",
      onClick: async () => {
        await _move_resource(props.node);
      },
      text: "Move Resource"
    }), /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
      icon: "duplicate",
      onClick: async () => {
        await _duplicate_file(props.node);
      },
      text: "Duplicate File"
    }), /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
      icon: "folder-close",
      onClick: async () => {
        await _add_directory(props.node);
      },
      text: "Create Directory"
    }), /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
      icon: "trash",
      onClick: async () => {
        await _delete_func(props.node);
      },
      intent: "danger",
      text: "Delete Resource"
    }), /*#__PURE__*/_react.default.createElement(_core.MenuDivider, null), /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
      icon: "cloud-upload",
      onClick: async () => {
        await _showPoolImport(props.node);
      },
      text: "Import To Pool"
    }), /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
      icon: "download",
      onClick: async () => {
        await _downloadFile(props.node);
      },
      text: "Download from Pool"
    }));
  }
  function registerTreeRefreshFunc(func) {
    treeRefreshFunc.current = func;
  }
  let outer_style = {
    marginTop: 0,
    marginLeft: 0,
    overflow: "auto",
    marginRight: 0,
    height: "100%"
  };
  let res_type = null;
  if (selectedNodeRef.current) {
    res_type = selectedNodeRef.current.isDirectory ? "poolDir" : "poolFile";
  }
  let right_pane = /*#__PURE__*/_react.default.createElement(_blueprint_mdata_fields.CombinedMetadata, {
    useTags: false,
    all_tags: [],
    useNotes: false,
    elevation: 2,
    name: selected_resource_ref.current.name,
    created: selected_resource_ref.current.created,
    updated: selected_resource_ref.current.updated,
    size: selected_resource_ref.current.size,
    icon: null,
    handleChange: null,
    res_type: res_type,
    pane_type: "pool",
    outer_style: outer_style,
    handleNotesBlur: null,
    additional_metadata: {
      size: selected_resource_ref.current.size,
      path: valueRef.current
    },
    readOnly: true
  });
  let left_pane = /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: "d-flex flex-column",
    style: {
      maxHeight: "100%",
      position: "relative",
      overflow: "scroll",
      padding: 15
    }
  }, (props.am_selected || have_activated) && /*#__PURE__*/_react.default.createElement(_pool_tree.PoolContext.Provider, {
    value: {
      workingPath: null,
      setWorkingPath: () => {}
    }
  }, /*#__PURE__*/_react.default.createElement(_pool_tree.PoolTree, {
    value: valueRef.current,
    renderContextMenu: renderContextMenu,
    select_type: "both",
    registerTreeRefreshFunc: registerTreeRefreshFunc,
    user_id: window.user_id,
    tsocket: props.tsocket,
    handleDrop: handleDrop,
    showSecondaryLabel: true,
    handleNodeClick: handleNodeClick
  }))));
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(PoolMenubar, (0, _extends2.default)({
    selected_resource: selected_resource_ref.current,
    connection_status: null,
    rename_func: _rename_func,
    delete_func: _delete_func,
    add_directory: _add_directory,
    duplicate_file: _duplicate_file,
    move_resource: _move_resource,
    download_file: _downloadFile,
    refreshFunc: treeRefreshFunc.current,
    showPoolImport: _showPoolImport,
    multi_select: multi_select_ref.current,
    list_of_selected: list_of_selected_ref.current,
    sendContextMenuItems: setContextMenuItems
  }, props.errorDrawerFuncs, {
    library_id: props.library_id,
    controlled: props.controlled,
    tsocket: props.tsocket
  })), /*#__PURE__*/_react.default.createElement("div", {
    ref: top_ref,
    style: outer_style,
    className: "pool-browser"
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: usable_width,
      height: usable_height
    }
  }, /*#__PURE__*/_react.default.createElement(_resizing_layouts.HorizontalPanes, {
    outer_hp_style: {
      paddingBottom: "50px"
    },
    show_handle: true,
    left_pane: left_pane,
    right_pane: right_pane,
    right_pane_overflow: "auto",
    initial_width_fraction: .75,
    scrollAdjustSelectors: [".bp5-table-quadrant-scroll-container"],
    handleSplitUpdate: null,
    handleResizeStart: null,
    handleResizeEnd: null
  }))));
}
exports.PoolBrowser = PoolBrowser = /*#__PURE__*/(0, _react.memo)(PoolBrowser);
function PoolMenubar(props) {
  function context_menu_items() {
    return [];
  }
  function menu_specs() {
    return {
      Edit: [{
        name_text: "Rename Resource",
        icon_name: "edit",
        click_handler: props.rename_func
      }, {
        name_text: "Move Resource",
        icon_name: "inheritance",
        click_handler: props.move_resource
      }, {
        name_text: "Duplicate File",
        icon_name: "duplicate",
        click_handler: props.duplicate_file
      }, {
        name_text: "Create Directory",
        icon_name: "folder-close",
        click_handler: props.add_directory
      }, {
        name_text: "Delete Resource",
        icon_name: "trash",
        click_handler: props.delete_func
      }],
      Transfer: [{
        name_text: "Import To Pool",
        icon_name: "cloud-upload",
        click_handler: props.showPoolImport
      }, {
        name_text: "Download File",
        icon_name: "download",
        click_handler: props.download_file
      }]
    };
  }
  return /*#__PURE__*/_react.default.createElement(_library_menubars.LibraryMenubar, {
    sendContextMenuItems: props.sendContextMenuItems,
    connection_status: props.connection_status,
    context_menu_items: context_menu_items(),
    selected_rows: props.selected_rows,
    selected_type: props.selected_type,
    selected_resource: props.selected_resource,
    resource_icon: _blueprint_mdata_fields.icon_dict["pool"],
    menu_specs: menu_specs(),
    multi_select: props.multi_select,
    controlled: props.controlled,
    am_selected: props.am_selected,
    tsocket: props.tsocket,
    showRefresh: true,
    refreshTab: props.refreshFunc,
    closeTab: null,
    resource_name: "",
    showErrorDrawerButton: true
  });
}
PoolMenubar = /*#__PURE__*/(0, _react.memo)(PoolMenubar);
function FileDropWrapper(props) {
  const [isDragging, setIsDragging] = (0, _react.useState)(false);
  const handleDragOver = e => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleDrop = e => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files) {
      if (props.processFiles) {
        props.processFiles(files);
      }
    }
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    id: "pool-drop-zone",
    className: `drop-zone ${isDragging ? 'drag-over' : ''}`,
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop
  }, props.children);
}