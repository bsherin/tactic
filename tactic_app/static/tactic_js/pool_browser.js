"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PoolBrowser = PoolBrowser;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _utilities_react = require("./utilities_react");
var _library_menubars = require("./library_menubars");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _pool_tree = require("./pool_tree");
var _resizing_layouts = require("./resizing_layouts");
var _communication_react = require("./communication_react");
var _error_drawer = require("./error_drawer");
var _toaster = require("./toaster");
var _theme = require("./theme");
var _modal_react = require("./modal_react");
var _library_home_react = require("./library_home_react");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var pool_browser_id = (0, _utilities_react.guid)();
function PoolBrowser(props) {
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)({
      name: "",
      tags: "",
      notes: "",
      updated: "",
      created: "",
      size: ""
    }),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    selected_resource = _useStateAndRef2[0],
    set_selected_resource = _useStateAndRef2[1],
    selected_resource_ref = _useStateAndRef2[2];
  var _useState = (0, _react.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    value = _useState2[0],
    setValue = _useState2[1];
  var _useState3 = (0, _react.useState)(null),
    _useState4 = _slicedToArray(_useState3, 2),
    selectedNode = _useState4[0],
    setSelectedNode = _useState4[1];
  var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)(false),
    _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
    multi_select = _useStateAndRef4[0],
    set_multi_select = _useStateAndRef4[1],
    multi_select_ref = _useStateAndRef4[2];
  var _useStateAndRef5 = (0, _utilities_react.useStateAndRef)([]),
    _useStateAndRef6 = _slicedToArray(_useStateAndRef5, 3),
    list_of_selected = _useStateAndRef6[0],
    set_list_of_selected = _useStateAndRef6[1],
    list_of_selected_ref = _useStateAndRef6[2];
  var _useState5 = (0, _react.useState)([]),
    _useState6 = _slicedToArray(_useState5, 2),
    contextMenuItems = _useState6[0],
    setContextMenuItems = _useState6[1];
  var _useStateAndRef7 = (0, _utilities_react.useStateAndRef)(.65),
    _useStateAndRef8 = _slicedToArray(_useStateAndRef7, 3),
    left_width_fraction = _useStateAndRef8[0],
    set_left_width_fraction = _useStateAndRef8[1],
    left_width_fraction_ref = _useStateAndRef8[2];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = _slicedToArray(_useState7, 2),
    have_activated = _useState8[0],
    set_have_activated = _useState8[1];
  var theme = (0, _react.useContext)(_theme.ThemeContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var treeRefreshFunc = (0, _react.useRef)(null);
  // Important note: The first mounting of the pool tree must happen after the pool pane
  // is first activated. Otherwise, I do GetPoolTree before everything is ready and I don't
  // get the callback for the post.

  var top_ref = (0, _react.useRef)(null);
  var resizing = (0, _react.useRef)(false);
  (0, _react.useEffect)(function () {
    if (props.am_selected && !have_activated) {
      set_have_activated(true);
    }
  }, [props.am_selected]);
  (0, _react.useEffect)(function () {
    if (value) {
      (0, _communication_react.postWithCallback)("host", "GetFileStats", {
        user_id: window.user_id,
        file_path: value
      }, function (data) {
        if (!data.stats) return;
        set_selected_resource({
          name: (0, _pool_tree.getBasename)(value),
          tags: "",
          notes: "",
          updated: data.stats.updated,
          created: data.stats.created,
          size: String(data.stats.size)
        });
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
  function _rename_func() {
    var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (!value && !node) return;
    var path = "isDirectory" in node ? node.fullpath : value;
    dialogFuncs.showModal("ModalDialog", {
      title: "Rename Pool Resource",
      field_title: "New Name",
      handleSubmit: RenameResource,
      default_value: (0, _pool_tree.getBasename)(path),
      existing_names: [],
      checkboxes: [],
      handleCancel: null,
      handleClose: dialogFuncs.hideModal
    });
    function RenameResource(new_name) {
      var the_data = {
        new_name: new_name,
        old_path: path
      };
      (0, _communication_react.postAjax)("rename_pool_resource", the_data, renameSuccess);
      function renameSuccess(data) {
        if (!data.success) {
          props.addErrorDrawerEntry({
            title: "Error renaming resource",
            content: data.message
          });
          return false;
        } else {
          return true;
        }
      }
    }
  }
  function _add_directory() {
    var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (!value && !node) return;
    var sNode = "isDirectory" in node ? node : selectedNode;
    var initial_address;
    if (sNode.isDirectory) {
      initial_address = sNode.fullpath;
    } else {
      initial_address = (0, _pool_tree.getFileParentPath)(sNode.fullpath);
    }
    dialogFuncs.showModal("SelectAddressDialog", {
      title: "Add a Pool Directory",
      handleSubmit: AddDirectory,
      selectType: "folder",
      initial_address: initial_address,
      initial_name: "New Directory",
      showName: true,
      handleClose: dialogFuncs.hideModal
    });
    function AddDirectory(full_path) {
      var the_data = {
        full_path: full_path
      };
      (0, _communication_react.postAjax)("create_pool_directory", the_data, addSuccess);
      function addSuccess(data) {
        if (!data.success) {
          props.addErrorDrawerEntry({
            title: "Error Adding Directory",
            content: data.message
          });
          return false;
        } else {
          return true;
        }
      }
    }
  }
  function _duplicate_file() {
    var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (!value && !node) return;
    var sNode = "isDirectory" in node ? node : selectedNode;
    if (sNode.isDirectory) {
      (0, _toaster.doFlash)("You can't duplicate a directory");
      return;
    }
    var src = sNode.fullpath;
    var _splitFilePath = (0, _pool_tree.splitFilePath)(sNode.fullpath),
      _splitFilePath2 = _slicedToArray(_splitFilePath, 2),
      initial_address = _splitFilePath2[0],
      initial_name = _splitFilePath2[1];
    dialogFuncs.showModal("SelectAddressDialog", {
      title: "Duplicate a file",
      handleSubmit: DupFile,
      selectType: "folder",
      initial_address: initial_address,
      initial_name: initial_name,
      showName: true,
      handleClose: dialogFuncs.hideModal
    });
    function DupFile(dst) {
      var the_data = {
        dst: dst,
        src: src
      };
      (0, _communication_react.postAjax)("duplicate_pool_file", the_data, addSuccess);
      function addSuccess(data) {
        if (!data.success) {
          props.addErrorDrawerEntry({
            title: "Error Adding Directory",
            content: data.message
          });
          return false;
        } else {
          return true;
        }
      }
    }
  }
  function _downloadFile() {
    var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (!value && !node) return;
    var sNode = "isDirectory" in node ? node : selectedNode;
    if (sNode.isDirectory) {
      (0, _toaster.doFlash)("You can't download a directory");
      return;
    }
    var src = sNode.fullpath;
    console.log("Got source " + String(src));
    dialogFuncs.showModal("ModalDialog", {
      title: "Download File",
      field_title: "New File Name",
      handleSubmit: downloadFile,
      default_value: (0, _pool_tree.getBasename)(src),
      existing_names: [],
      checkboxes: [],
      handleCancel: null,
      handleClose: dialogFuncs.hideModal
    });
    function downloadFile(new_name) {
      var the_data = {
        src: src
      };
      $.ajax({
        url: $SCRIPT_ROOT + '/download_pool_file',
        method: 'GET',
        data: {
          src: src
        },
        xhrFields: {
          responseType: 'blob' // Response type as blob
        },

        success: function success(data, status, xhr) {
          if (xhr.status === 200) {
            // Create a download link and trigger the download
            var blob = new Blob([data], {
              type: 'application/octet-stream'
            });
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = new_name; // Set the desired file name
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          }
        },
        error: function error(xhr, status, _error) {
          props.addErrorDrawerEntry({
            title: "Error Downloading From Pool",
            content: String(_error)
          });
        }
      });
    }
  }
  function _move_resource() {
    var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (!value && !node) return;
    var sNode = "isDirectory" in node ? node : selectedNode;
    var src = sNode.fullpath;
    var initial_address;
    if (sNode.isDirectory) {
      initial_address = sNode.fullpath;
    } else {
      initial_address = (0, _pool_tree.getFileParentPath)(sNode.fullpath);
    }
    dialogFuncs.showModal("SelectAddressDialog", {
      title: "Select a destination for ".concat((0, _pool_tree.getBasename)(src)),
      handleSubmit: MoveResource,
      selectType: "folder",
      initial_address: initial_address,
      initial_name: "",
      showName: false,
      handleClose: dialogFuncs.hideModal
    });
    function MoveResource(dst) {
      if (src == dst) return;
      var the_data = {
        dst: dst,
        src: src
      };
      (0, _communication_react.postAjax)("move_pool_resource", the_data, addSuccess);
      function addSuccess(data) {
        if (!data.success) {
          props.addErrorDrawerEntry({
            title: "Error Moving Resource",
            content: data.message
          });
          return false;
        } else {
          return true;
        }
      }
    }
  }
  function _delete_func() {
    var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (!value && !node) return;
    var path = "isDirectory" in node ? node.fullpath : value;
    var sNode = "isDirectory" in node ? node : selectedNode;
    if (sNode.isDirectory && sNode.childNodes.length > 0) {
      (0, _toaster.doFlash)("You can't delete a non-empty directory");
      return;
    }
    var basename = (0, _pool_tree.getBasename)(path);
    var confirm_text = "Are you sure that you want to delete ".concat(basename, "?");
    dialogFuncs.showModal("ConfirmDialog", {
      title: "Delete resource",
      text_body: confirm_text,
      cancel_text: "do nothing",
      submit_text: "delete",
      handleSubmit: function handleSubmit() {
        (0, _communication_react.postAjaxPromise)("delete_pool_resource", {
          full_path: path,
          is_directory: sNode.isDirectory
        }).then(function () {
          return true;
        })["catch"](function (data) {
          props.addErrorDrawerEntry({
            title: "Error deleting resource",
            content: data.message
          });
        });
      },
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }
  function _add_to_pool(myDropZone, setCurrentUrl, current_value) {
    var new_url = "import_pool/".concat(_library_home_react.library_id);
    myDropZone.options.url = new_url;
    setCurrentUrl(new_url);
    myDropZone.processQueue();
  }
  function _showPoolImport() {
    var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var initial_directory = null;
    var sNode = "isDirectory" in node ? node : selectedNode;
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
  function _handleSplitResize(left_width, right_width, width_fraction) {
    if (!resizing.current) {
      set_left_width_fraction(width_fraction);
    }
  }
  function _handleSplitResizeStart() {
    resizing.current = true;
  }
  function _handleSplitResizeEnd(width_fraction) {
    resizing.current = false;
    set_left_width_fraction(width_fraction);
  }
  function handleNodeClick(node, nodes) {
    setValue(node.fullpath);
    setSelectedNode(node);
    return true;
  }
  function renderContextMenu(props) {
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "edit",
      onClick: function onClick() {
        _rename_func(props.node);
      },
      text: "Rename Resource"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "inheritance",
      onClick: function onClick() {
        _move_resource(props.node);
      },
      text: "Move Resource"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "duplicate",
      onClick: function onClick() {
        _duplicate_file(props.node);
      },
      text: "Duplicate File"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "folder-close",
      onClick: function onClick() {
        _add_directory(props.node);
      },
      text: "Create Directory"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "trash",
      onClick: function onClick() {
        _delete_func(props.node);
      },
      intent: "danger",
      text: "Delete Resource"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "cloud-upload",
      onClick: function onClick() {
        _showPoolImport(props.node);
      },
      text: "Import To Pool"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "download",
      onClick: function onClick() {
        _downloadFile(props.node);
      },
      n: true,
      text: "Download from Pool"
    }));
  }
  function registerTreeRefreshFunc(func) {
    treeRefreshFunc.current = func;
  }
  var outer_style = {
    marginTop: 0,
    marginLeft: 0,
    overflow: "auto",
    marginRight: 0,
    height: "100%"
  };
  var right_pane = /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.CombinedMetadata, {
    useTags: false,
    useNotes: false,
    elevation: 2,
    name: selected_resource_ref.current.name,
    created: selected_resource_ref.current.created,
    updated: selected_resource_ref.current.updated,
    size: selected_resource_ref.current.size,
    icon: null,
    handleChange: null,
    res_type: "pool",
    pane_type: "pool",
    outer_style: outer_style,
    handleNotesBlur: null,
    additional_metadata: {
      size: selected_resource_ref.current.size,
      path: value
    },
    readOnly: true
  });
  var left_pane = /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row",
    style: {
      maxHeight: "100%",
      position: "relative",
      padding: 15
    }
  }, (props.am_selected || have_activated) && /*#__PURE__*/_react["default"].createElement(_pool_tree.PoolTree, {
    value: value,
    renderContextMenu: renderContextMenu,
    select_type: "both",
    registerTreeRefreshFunc: registerTreeRefreshFunc,
    user_id: window.user_id,
    tsocket: props.tsocket,
    handleNodeClick: handleNodeClick
  }));
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(PoolMenubar, _extends({
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
    registerOmniGetter: props.registerOmniGetter,
    multi_select: multi_select_ref.current,
    list_of_selected: list_of_selected_ref.current,
    sendContextMenuItems: setContextMenuItems
  }, props.errorDrawerFuncs, {
    library_id: props.library_id,
    controlled: props.controlled,
    am_selected: props.am_selected,
    tsocket: props.tsocket
  })), /*#__PURE__*/_react["default"].createElement("div", {
    ref: top_ref,
    style: outer_style
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      width: props.usable_width,
      height: props.usable_height
    }
  }, /*#__PURE__*/_react["default"].createElement(_resizing_layouts.HorizontalPanes, {
    available_width: props.usable_width,
    available_height: props.usable_height,
    show_handle: true,
    left_pane: left_pane,
    right_pane: right_pane,
    right_pane_overflow: "auto",
    initial_width_fraction: .75,
    scrollAdjustSelectors: [".bp5-table-quadrant-scroll-container"],
    handleSplitUpdate: _handleSplitResize,
    handleResizeStart: _handleSplitResizeStart,
    handleResizeEnd: _handleSplitResizeEnd
  }))));
}
exports.PoolBrowser = PoolBrowser = /*#__PURE__*/(0, _react.memo)(PoolBrowser);
exports.PoolBrowser = PoolBrowser = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(PoolBrowser));
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
  return /*#__PURE__*/_react["default"].createElement(_library_menubars.LibraryMenubar, {
    sendContextMenuItems: props.sendContextMenuItems,
    connection_status: props.connection_status,
    registerOmniGetter: props.registerOmniGetter,
    context_menu_items: context_menu_items(),
    selected_rows: props.selected_rows,
    selected_type: props.selected_type,
    selected_resource: props.selected_resource,
    resource_icon: _blueprint_mdata_fields.icon_dict["all"],
    menu_specs: menu_specs(),
    multi_select: props.multi_select,
    controlled: props.controlled,
    am_selected: props.am_selected,
    tsocket: props.tsocket,
    showRefresh: true,
    refreshTab: props.refreshFunc,
    closeTab: null,
    resource_name: "",
    showErrorDrawerButton: true,
    toggleErrorDrawer: props.toggleErrorDrawer
  });
}
PoolMenubar = /*#__PURE__*/(0, _react.memo)(PoolMenubar);