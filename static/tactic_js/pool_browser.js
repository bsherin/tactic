"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PoolBrowser = PoolBrowser;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
require("../tactic_css/pool.scss");
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _utilities_react = require("./utilities_react");
var _library_menubars = require("./library_menubars");
var _combined_metadata = require("./combined_metadata");
var _pool_tree = require("./pool_tree");
var _resizing_allotment = require("./resizing_allotment");
var _communication_react = require("./communication_react");
var _error_drawer = require("./error_drawer");
var _sizing_tools = require("./sizing_tools");
var _toaster = require("./toaster");
var _modal_react = require("./modal_react");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function PoolBrowser(props) {
  const [, set_selected_resource, selected_resource_ref] = (0, _utilities_react.useStateAndRef)({
    name: "",
    tags: "",
    notes: "",
    updated: "",
    created: "",
    size: "",
    res_type: null
  });
  const [, setCurrentRootPath, currentRootPathRef] = (0, _utilities_react.useStateAndRef)("/mydisk");
  const [value, setValue, valueRef] = (0, _utilities_react.useStateAndRef)(null);
  const [, setSelectedNode, selectedNodeRef] = (0, _utilities_react.useStateAndRef)(null);
  const [,, multi_select_ref] = (0, _utilities_react.useStateAndRef)(false);
  const [,, list_of_selected_ref] = (0, _utilities_react.useStateAndRef)([]);
  const [, setContextMenuItems] = (0, _react.useState)([]);
  const [have_activated, set_have_activated] = (0, _react.useState)(false);
  const [showHidden, setShowHidden] = (0, _react.useState)(false);
  const dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
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
        size: String(selectedNodeRef.current.size),
        res_type: selectedNodeRef.current.isDirectory ? "poolDir" : "poolFile"
      });
    } else {
      set_selected_resource({
        name: "",
        tags: "",
        notes: "",
        updated: "",
        created: "",
        res_type: null
      });
    }
  }, [value]);
  async function sendNewCell(path, main_id, read_as_dataframe) {
    const ext = (0, _utilities_react.getFileExtension)(path);
    let code;
    if (read_as_dataframe) {
      if (ext === "csv") {
        code = `import pandas as pd\ndf = pd.read_csv("${path}")`;
      } else if (ext === "parquet") {
        code = `import pandas as pd\ndf = pd.read_parquet("${path}")`;
      } else {
        code = `import pandas as pd\ndf = pd.read_pickle("${path}")`;
      }
    } else {
      if (ext == "pkl") {
        code = `import pickle\nwith open("${path}", "rb") as f:\n    data = pickle.load(f)`;
      } else {
        code = `with open("${path}") as f:\n    txt = f.read()`;
      }
    }
    await (0, _communication_react.postPromise)("host", "print_code_area_to_console", {
      "console_text": code,
      "user_id": window.user_id,
      "local_id": main_id
    }, window.global_id);
  }
  async function openInNotebook(node = null) {
    if (!valueRef.current && !node) return;
    try {
      const path = node && "isDirectory" in node ? node.fullpath : valueRef.current;
      if (node.isDirectory) return;
      let openResources = props.getOpenResources();
      let open_projects = [];
      let open_projects_dict = {};
      let requireNewNotebook;
      if (openResources.length === 0) {
        requireNewNotebook = true;
      } else {
        requireNewNotebook = false;
        for (let entry of openResources) {
          if (entry.res_type === "project" || entry.res_type === "collection") {
            open_projects.push(entry.resource_name);
            open_projects_dict[entry.resource_name] = entry;
          }
        }
      }
      let [selectedResource, checkResults] = await dialogFuncs.showModalPromise("SelectDialog", {
        title: "Open resources in notebook",
        checkboxes: [{
          "checkname": "create_new_notebook",
          "checktext": "Create new notebook",
          "checked": requireNewNotebook,
          "disabled": requireNewNotebook
        }, {
          "checkname": "read_as_dataframe",
          "checktext": "Read as dataframe",
          "checked": false
        }],
        select_label: "Project",
        cancel_text: "Cancel",
        submit_text: "Open",
        option_list: open_projects,
        handleClose: dialogFuncs.hideModal
      });
      let data;
      if (checkResults["create_new_notebook"]) {
        props.handleCreateViewer("new-notebook", null, async main_id => await sendNewCell(path, main_id, checkResults["read_as_dataframe"]));
      } else {
        props.setSelectedTabId(open_projects_dict[selectedResource].id);
        await sendNewCell(path, open_projects_dict[selectedResource].local_id, checkResults["read_as_dataframe"]);
      }
    } catch (e) {
      errorDrawerFuncs.addFromError(`Error opening in notebook`, e);
    }
  }
  async function viewTextFile(node = null) {
    if (!valueRef.current && !node) return;
    let data;
    try {
      const path = node && "isDirectory" in node ? node.fullpath : valueRef.current;
      if (node.isDirectory) return;
      props.handleCreateViewer("text", null, null, null, path);
    } catch (e) {
      errorDrawerFuncs.addFromError(`Error viewing text file`, e);
    }
  }
  function _copy_func(node = null) {
    if (!valueRef.current && !node) return;
    const path = node && "isDirectory" in node ? node.fullpath : valueRef.current;
    (0, _utilities_react.copyToClipboard)(path);
  }
  async function _rename_func(node = null) {
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
      await (0, _communication_react.postPromise)("host", "rename_pool_resource_task", the_data);
    } catch (e) {
      if (e != "canceled") {
        errorDrawerFuncs.addFromError(`Error renaming`, e);
      }
    }
  }
  async function _add_directory(node = null) {
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
      await (0, _communication_react.postPromise)("host", "create_pool_directory_task", the_data);
    } catch (e) {
      if (e != "canceled") {
        errorDrawerFuncs.addFromError(`Error adding directory`, e);
      }
    }
  }
  async function _duplicate_file(node = null) {
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
      await (0, _communication_react.postPromise)("host", "duplicate_pool_file_task", the_data);
    } catch (e) {
      if (e != "canceled") {
        errorDrawerFuncs.addFromError(`Error duplicating file`, e);
      }
    }
  }
  async function _compress_file(node = null) {
    if (!valueRef.current && !node) return;
    try {
      const sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
      await (0, _communication_react.postPromise)("host", "compress_pool_resource", {
        full_path: sNode.fullpath,
        force_forward: true,
        user_id: window.user_id
      });
    } catch (e) {
      errorDrawerFuncs.addFromError(`Error compressing file or folder`, e);
    }
  }
  async function _decompress_archive(node = null) {
    if (!valueRef.current && !node) return;
    try {
      const sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
      await (0, _communication_react.postPromise)("host", "decompress_archive", {
        full_path: sNode.fullpath,
        force_forward: true,
        user_id: window.user_id
      });
    } catch (e) {
      errorDrawerFuncs.addFromError(`Error decompressing archive`, e);
    }
  }
  async function _downloadFile(node = null) {
    if (!valueRef.current && !node) return;
    try {
      const sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
      if (sNode.isDirectory) {
        (0, _toaster.doFlash)("You can't download a directory");
        return;
      }
      const src = sNode.fullpath;
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
      let [data,, xhr] = await (0, _communication_react.getBlobPromise)("download_pool_file", the_data);
      if (xhr.status === 200) {
        // Create a download link and trigger the download
        let blob = new Blob([data], {
          type: 'application/octet-stream'
        });
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
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
      await (0, _communication_react.postPromise)("host", "move_pool_resource_task", the_data);
    } catch (e) {
      errorDrawerFuncs.addFromError("Error moving resource", e);
    }
  }
  async function _move_resource(node = null) {
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
  async function _delete_func(node = null) {
    if (!valueRef.current && !node) return;
    try {
      const path = node && "isDirectory" in node ? node.fullpath : valueRef.current;
      const sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
      const basename = (0, _pool_tree.getBasename)(path);
      let confirm_text;
      if (sNode.isDirectory && sNode.childNodes.length > 0) {
        confirm_text = `Are you sure that you want to delete the non-empty directory ${basename}?`;
      } else {
        confirm_text = `Are you sure that you want to delete ${basename}?`;
      }
      await dialogFuncs.showModalPromise("ConfirmDialog", {
        title: "Delete resource",
        text_body: confirm_text,
        cancel_text: "do nothing",
        submit_text: "delete",
        handleClose: dialogFuncs.hideModal
      });
      await (0, _communication_react.postPromise)("host", "delete_pool_resource_task", {
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
    let new_url;
    if (current_value.startWith("s3://")) {
      new_url = "nothing";
    } else {
      new_url = `import_pool/${window.global_id}`;
    }
    myDropZone.options.url = new_url;
    setCurrentUrl(new_url);
    myDropZone.processQueue();
  }
  function _showPoolImport(node = null) {
    let initial_directory;
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
  function handleNodeClick(node) {
    setValue(node.fullpath);
    setSelectedNode(node);
    return true;
  }
  function setRoot(node = null) {
    if (!node) {
      node = selectedNodeRef.current;
    }
    setCurrentRootPath(node.fullpath);
  }
  function setRootToBase() {
    setCurrentRootPath("/mydisk");
  }
  function renderContextMenu(props) {
    return /*#__PURE__*/_react.default.createElement(_core.Menu, null, props.node.isDirectory && /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
      icon: "folder-shared-open",
      onClick: async () => {
        await setRoot(props.node);
      },
      text: "Go To Folder"
    }), /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
      icon: "home",
      onClick: async () => {
        await setRootToBase(props.node);
      },
      text: "Go Home"
    }), /*#__PURE__*/_react.default.createElement(_core.MenuDivider, null), /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
      icon: "clipboard",
      onClick: async () => {
        await _copy_func(props.node);
      },
      text: "Copy Path"
    }), !props.node.isDirectory && /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
      icon: "eye-open",
      onClick: async () => {
        await viewTextFile(props.node);
      },
      text: "View as Text"
    }), /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
      icon: "code",
      onClick: async () => {
        await openInNotebook(props.node);
      },
      text: "Open in Notebook"
    })), /*#__PURE__*/_react.default.createElement(_core.MenuDivider, null), /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
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
      icon: "archive",
      onClick: async () => {
        await _compress_file(props.node);
      },
      text: "Compress Resource"
    }), /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
      icon: "unarchive",
      onClick: async () => {
        await _decompress_archive(props.node);
      },
      text: "Decompress archive"
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
  let fixed_data = {
    created: selected_resource_ref.current.created,
    updated: selected_resource_ref.current.updated,
    size: selected_resource_ref.current.size,
    path: valueRef.current
  };
  let right_pane = /*#__PURE__*/_react.default.createElement(_combined_metadata.CombinedMetadata, {
    res_type: selected_resource_ref.current.res_type,
    res_name: selected_resource_ref.current.name,
    useFixedData: true,
    fixedData: fixed_data,
    elevation: 2,
    readOnly: true
  });
  let left_pane = /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: "d-flex flex-column resource-viewer-left-pane-holder top-padded",
    style: {
      maxHeight: "100%",
      position: "relative",
      overflow: "scroll"
    }
  }, (props.am_selected || have_activated) && /*#__PURE__*/_react.default.createElement(_pool_tree.PoolContext.Provider, {
    value: {
      workingPath: null,
      setWorkingPath: () => {}
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "d-flex flex-row",
    style: {
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/_react.default.createElement(PoolBreadcrumbs, {
    path: currentRootPathRef.current,
    setRoot: setRoot
  }), /*#__PURE__*/_react.default.createElement(PoolHiddenSwitch, {
    showHidden: showHidden,
    setShowHidden: setShowHidden
  })), /*#__PURE__*/_react.default.createElement(_pool_tree.PoolTree, {
    value: valueRef.current,
    currentRootPath: currentRootPathRef.current,
    showHidden: showHidden,
    setRoot: setRoot,
    renderContextMenu: renderContextMenu,
    select_type: "both",
    registerTreeRefreshFunc: registerTreeRefreshFunc,
    user_id: window.user_id,
    tsocket: props.tsocket,
    handleDrop: handleDrop,
    showSecondaryLabel: true,
    handleNodeClick: handleNodeClick
  }))));
  let outer_style = {
    width: `calc(100% - ${_sizing_tools.ICON_BAR_WIDTH}px)`,
    height: "100%",
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 0,
    position: "relative"
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    style: outer_style
  }, /*#__PURE__*/_react.default.createElement(PoolMenubar, (0, _extends2.default)({
    selected_resource: selected_resource_ref.current,
    connection_status: null,
    copy_func: _copy_func,
    rename_func: _rename_func,
    delete_func: _delete_func,
    view_func: viewTextFile,
    open_in_notebook_func: openInNotebook,
    add_directory: _add_directory,
    duplicate_file: _duplicate_file,
    compress_file: _compress_file,
    decompress_archive: _decompress_archive,
    move_resource: _move_resource,
    download_file: _downloadFile,
    refreshFunc: treeRefreshFunc.current,
    showPoolImport: _showPoolImport,
    multi_select: multi_select_ref.current,
    list_of_selected: list_of_selected_ref.current,
    sendContextMenuItems: setContextMenuItems,
    setRootToBase: setRootToBase,
    setRoot: setRoot
  }, props.errorDrawerFuncs, {
    controlled: props.controlled,
    tsocket: props.tsocket
  })), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      flex: "1 1 0",
      display: "flex",
      minHeight: 0,
      position: "relative"
    }
  }, /*#__PURE__*/_react.default.createElement(_resizing_allotment.HorizontalPanes, {
    outer_hp_style: {},
    show_handle: true,
    left_pane: left_pane,
    right_pane: right_pane,
    right_pane_overflow: "auto",
    initial_width_fraction: .75
  })));
}
exports.PoolBrowser = PoolBrowser = /*#__PURE__*/(0, _react.memo)(PoolBrowser);
function PoolBreadcrumb(props) {
  return /*#__PURE__*/_react.default.createElement(_core.Breadcrumb, {
    className: "pool-breadcrumb",
    key: props.path,
    icon: props.icon,
    onClick: props.onClick
  }, props.name);
}
function PoolHiddenSwitch(props) {
  function handleShowHiddenChange(event) {
    props.setShowHidden(event.target.checked);
  }
  return /*#__PURE__*/_react.default.createElement(_core.Switch, {
    label: "show hidden",
    size: "medium",
    checked: props.showHidden,
    onChange: handleShowHiddenChange
  });
}
const s3_prefix = "s3://tactic-user-storage/users";
function PoolBreadcrumbs(props) {
  function clickFunc(path) {
    return () => {
      props.setRoot({
        fullpath: path
      });
    };
  }
  function pathToCrumbs(path) {
    let prefix = "";
    if (path.startsWith(s3_prefix)) {
      path = path.slice(s3_prefix.length);
      prefix = s3_prefix;
    }
    let crumbs = [];
    let parts = path.split("/");
    let new_path = prefix;
    for (const item of parts) {
      if (item === "") {
        continue;
      }
      new_path += "/" + item;
      crumbs.push({
        name: item,
        icon: "folder-close",
        path: new_path,
        onClick: clickFunc(new_path)
      });
    }
    return crumbs;
  }
  function renderBreadcrumb(props) {
    return /*#__PURE__*/_react.default.createElement(PoolBreadcrumb, props);
  }
  const crumbs = pathToCrumbs(props.path);
  return /*#__PURE__*/_react.default.createElement(_core.Breadcrumbs, {
    className: "pool-breadcrumbs",
    breadcrumbRenderer: renderBreadcrumb,
    items: crumbs
  });
}
function PoolMenubar(props) {
  const [, setSelectedType, selectedTypeRef] = (0, _utilities_react.useStateAndRef)(props.selected_resource.res_type);
  (0, _react.useEffect)(() => {
    setSelectedType(props.selected_resource.res_type);
  }, [props.selected_resource]);
  function context_menu_items() {
    return [];
  }
  function menu_specs() {
    return {
      Navigate: [{
        name_text: "Go Home",
        icon_name: "home",
        click_handler: props.setRootToBase
      }, {
        name_text: "Go to Folder",
        icon_name: "folder-shared-open",
        click_handler: () => {
          props.setRoot();
        },
        res_type: "poolDir"
      }],
      Inspect: [{
        name_text: "Copy Path",
        icon_name: "clipboard",
        click_handler: props.copy_func
      }, {
        name_text: "View As Text File",
        icon_name: "eye-open",
        click_handler: props.view_func
      }, {
        name_text: "Open in Notebook",
        icon_name: "code",
        click_handler: props.open_in_notebook_func
      }],
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
      Archive: [{
        name_text: "Compress Resource",
        icon_name: "archive",
        click_handler: props.compress_file
      }, {
        name_text: "Decompress Archive",
        icon_name: "unarchive",
        click_handler: props.decompress_archive
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
    selectedTypeRef: selectedTypeRef,
    selected_resource: props.selected_resource,
    resource_icon: _combined_metadata.icon_dict["pool"],
    menu_specs: menu_specs(),
    multi_select: props.multi_select,
    controlled: props.controlled,
    am_selected: props.am_selected,
    tsocket: props.tsocket,
    showRefresh: true,
    refreshTab: props.refreshFunc,
    closeTab: null,
    resource_name: ""
  });
}
PoolMenubar = /*#__PURE__*/(0, _react.memo)(PoolMenubar);