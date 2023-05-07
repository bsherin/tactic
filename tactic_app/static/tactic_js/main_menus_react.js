"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "MenuComponent", {
  enumerable: true,
  get: function get() {
    return _menu_utilities.MenuComponent;
  }
});
exports.ViewMenu = exports.RowMenu = exports.ColumnMenu = exports.DocumentMenu = exports.ProjectMenu = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _markdownIt = _interopRequireDefault(require("markdown-it"));

require("markdown-it-latex/dist/index.css");

var _markdownItLatex = _interopRequireDefault(require("markdown-it-latex"));

var _modal_react = require("./modal_react.js");

var _communication_react = require("./communication_react.js");

var _toaster = require("./toaster.js");

var _utilities_react = require("./utilities_react.js");

var _menu_utilities = require("./menu_utilities.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var mdi = (0, _markdownIt["default"])({
  html: true
});
mdi.use(_markdownItLatex["default"]);

var ProjectMenu = /*#__PURE__*/function (_React$Component) {
  _inherits(ProjectMenu, _React$Component);

  var _super = _createSuper(ProjectMenu);

  function ProjectMenu(props) {
    var _this;

    _classCallCheck(this, ProjectMenu);

    _this = _super.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ProjectMenu, [{
    key: "_saveProjectAs",
    value: function _saveProjectAs() {
      this.props.startSpinner();
      var self = this;
      (0, _communication_react.postWithCallback)("host", "get_project_names", {
        "user_id": window.user_id
      }, function (data) {
        var checkboxes;
        (0, _modal_react.showModalReact)("Save Project As", "New Project Name", CreateNewProject, "NewProject", data["project_names"], null, doCancel);
      }, null, self.props.main_id);

      function doCancel() {
        self.props.stopSpinner();
      }

      function CreateNewProject(new_name) {
        //let console_node = cleanse_bokeh(document.getElementById("console"));
        var result_dict = {
          "project_name": new_name,
          "main_id": self.props.main_id,
          "doc_type": "table",
          "purgetiles": true
        };
        result_dict.interface_state = self.props.interface_state;

        if (self.props.is_notebook) {
          (0, _communication_react.postWithCallback)(self.props.main_id, "save_new_notebook_project", result_dict, save_as_success, self.props.postAjaxFailur, self.props.main_id);
        } else {
          result_dict["purgetiles"] = true;
          (0, _communication_react.postWithCallback)(self.props.main_id, "save_new_project", result_dict, save_as_success, self.props.postAjaxFailure, self.props.main_id);
        }

        function save_as_success(data_object) {
          if (data_object["success"]) {
            self.props.setProjectName(new_name, function () {
              if (!window.in_context) {
                document.title = new_name;
              }

              self.props.clearStatusMessage();
              data_object.alert_type = "alert-success";
              data_object.timeout = 2000;
              (0, _communication_react.postWithCallback)("host", "refresh_project_selector_list", {
                'user_id': window.user_id
              }, null, null, self.props.main_id);
              self.props.updateLastSave();
              self.props.stopSpinner();

              self._saveProject();
            });
          } else {
            self.props.clearStatusMessage();
            data_object["message"] = data_object["message"];
            data_object["alert-type"] = "alert-warning";
            self.props.stopSpinner();
            (0, _toaster.doFlash)(data_object);
          }
        }
      }
    }
  }, {
    key: "_saveProject",
    value: function _saveProject() {
      // let console_node = cleanse_bokeh(document.getElementById("console"));
      var self = this;
      var result_dict = {
        main_id: this.props.main_id,
        project_name: this.props.project_name
      };
      result_dict.interface_state = this.props.interface_state; //tableObject.startTableSpinner();

      this.props.startSpinner();
      (0, _communication_react.postWithCallback)(this.props.main_id, "update_project", result_dict, updateSuccess, self.props.postAjaxFailure, self.props.main_id);

      function updateSuccess(data) {
        self.props.startSpinner();

        if (data.success) {
          data["alert_type"] = "alert-success";
          data.timeout = 2000;
          self.props.updateLastSave();
        } else {
          data["alert_type"] = "alert-warning";
        }

        self.props.clearStatusMessage();
        self.props.stopSpinner();
        (0, _toaster.doFlash)(data);
      }
    }
  }, {
    key: "_exportAsPresentation",
    value: function _exportAsPresentation() {
      var self = this;
      (0, _communication_react.postWithCallback)("host", "get_collection_names", {
        "user_id": user_id
      }, function (data) {
        // noinspection JSUnusedAssignment
        (0, _modal_react.showPresentationDialog)(ExportPresentation, data["collection_names"]);
      }, null, self.props.main_id);

      function ExportPresentation(use_dark_theme, save_as_collection, collection_name) {
        var cell_list = [];

        var _iterator = _createForOfIteratorHelper(self.props.console_items),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var entry = _step.value;
            var new_entry = {};
            new_entry.type = entry.type;

            switch (entry.type) {
              case "text":
                new_entry.console_text = mdi.render(entry.console_text);
                new_entry.raw_text = entry.console_text;
                new_entry.summary_text = entry.summary_text;
                break;

              case "code":
                new_entry.console_text = entry.console_text;
                new_entry.output_text = entry.output_text;
                new_entry.summary_text = entry.summary_text;
                break;

              case "divider":
                new_entry.header_text = entry.header_text;
                new_entry.summary_text = "";
                break;

              default:
                new_entry.console_text = entry.console_text;
                new_entry.summary_text = entry.summary_text;
                break;
            }

            cell_list.push(new_entry);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        var result_dict = {
          "project_name": self.props.project_name,
          "collection_name": collection_name,
          "save_as_collection": save_as_collection,
          "use_dark_theme": use_dark_theme,
          "presentation": true,
          "main_id": self.props.main_id,
          "cell_list": cell_list
        };
        (0, _communication_react.postWithCallback)(self.props.main_id, "export_as_presentation", result_dict, save_as_success, self.props.postAjaxFailure, self.props.main_id);

        function save_as_success(data_object) {
          self.props.clearStatusMessage();

          if (data_object.success) {
            if (save_as_collection) {
              data_object.alert_type = "alert-success";
              data_object.timeout = 2000;
              (0, _toaster.doFlash)(data_object);
            } else {
              window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data_object["temp_id"]));
            }
          } else {
            data_object["alert-type"] = "alert-warning";
          }
        }
      }
    }
  }, {
    key: "_exportAsReport",
    value: function _exportAsReport() {
      var self = this;
      (0, _communication_react.postWithCallback)("host", "get_collection_names", {
        "user_id": user_id
      }, function (data) {
        // noinspection JSUnusedAssignment
        (0, _modal_react.showReportDialog)(ExportRport, data["collection_names"]);
      }, null, self.props.main_id);

      function ExportRport(collapsible, include_summaries, use_dark_theme, save_as_collection, collection_name) {
        var cell_list = [];

        var _iterator2 = _createForOfIteratorHelper(self.props.console_items),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var entry = _step2.value;
            var new_entry = {};
            new_entry.type = entry.type;

            switch (entry.type) {
              case "text":
                new_entry.console_text = mdi.render(entry.console_text);
                new_entry.raw_text = entry.console_text;
                new_entry.summary_text = entry.summary_text;
                break;

              case "code":
                new_entry.console_text = entry.console_text;
                new_entry.output_text = entry.output_text;
                new_entry.summary_text = entry.summary_text;
                break;

              case "divider":
                new_entry.header_text = entry.header_text;
                break;

              default:
                new_entry.console_text = entry.console_text;
                new_entry.summary_text = entry.summary_text;
                break;
            }

            cell_list.push(new_entry);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        var result_dict = {
          "project_name": self.props.project_name,
          "collection_name": collection_name,
          "save_as_collection": save_as_collection,
          "use_dark_theme": use_dark_theme,
          "collapsible": collapsible,
          "include_summaries": include_summaries,
          "main_id": self.props.main_id,
          "cell_list": cell_list
        };
        (0, _communication_react.postWithCallback)(self.props.main_id, "export_as_report", result_dict, save_as_success, self.props.postAjaxFailure, self.props.main_id);

        function save_as_success(data_object) {
          self.props.clearStatusMessage();

          if (data_object.success) {
            if (save_as_collection) {
              data_object.alert_type = "alert-success";
              data_object.timeout = 2000;
              (0, _toaster.doFlash)(data_object);
            } else {
              window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data_object["temp_id"]));
            }
          } else {
            data_object["alert-type"] = "alert-warning";
          }
        }
      }
    }
  }, {
    key: "_exportAsJupyter",
    value: function _exportAsJupyter() {
      this.props.startSpinner();
      var self = this;
      (0, _communication_react.postWithCallback)("host", "get_project_names", {
        "user_id": user_id
      }, function (data) {
        var checkboxes; // noinspection JSUnusedAssignment

        (0, _modal_react.showModalReact)("Export Notebook in Jupyter Format", "New Project Name", ExportJupyter, "NewJupyter", data["project_names"], checkboxes);
      }, null, self.props.main_id);

      function ExportJupyter(new_name) {
        var cell_list = [];

        var _iterator3 = _createForOfIteratorHelper(self.props.console_items),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var entry = _step3.value;
            var new_cell = {};
            new_cell.source = entry.console_text;
            new_cell.cell_type = entry.type == "code" ? "code" : "markdown";

            if (entry.type == "code") {
              new_cell.outputs = [];
            }

            cell_list.push(new_cell);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        var result_dict = {
          "project_name": new_name,
          "main_id": self.props.main_id,
          "cell_list": cell_list
        };
        (0, _communication_react.postWithCallback)(self.props.main_id, "export_to_jupyter_notebook", result_dict, save_as_success, self.props.postAjaxFailure, self.props.main_id);

        function save_as_success(data_object) {
          self.props.clearStatusMessage();

          if (data_object.success) {
            data_object.alert_type = "alert-success";
            data_object.timeout = 2000;
          } else {
            data_object["alert-type"] = "alert-warning";
          }

          self.props.stopSpinner();
          (0, _toaster.doFlash)(data_object);
        }
      }
    }
  }, {
    key: "_exportDataTable",
    value: function _exportDataTable() {
      var self = this;
      (0, _modal_react.showModalReact)("Export Data", "New Collection Name", function (new_name) {
        var result_dict = {
          "export_name": new_name,
          "main_id": self.props.main_id,
          "user_id": window.user_id
        };
        $.ajax({
          url: $SCRIPT_ROOT + "/export_data",
          contentType: 'application/json',
          type: 'POST',
          async: true,
          data: JSON.stringify(result_dict),
          dataType: 'json'
        });
      });
    }
  }, {
    key: "_consoleToNotebook",
    value: function _consoleToNotebook() {
      var result_dict = {
        "main_id": this.props.main_id,
        "console_items": this.props.console_items,
        "user_id": window.user_id
      };
      (0, _communication_react.postWithCallback)(this.props.main_id, "console_to_notebook", result_dict, null, null, this.props.main_id);
    }
  }, {
    key: "option_dict",
    get: function get() {
      return {
        "Save As...": this._saveProjectAs,
        "Save": this._saveProject,
        "divider1": "divider",
        "Export as Jupyter Notebook": this._exportAsJupyter,
        "Export Table as Collection": this._exportDataTable,
        "Open Console as Notebook": this._consoleToNotebook,
        "divider2": "divider",
        "Change collection": this.props.changeCollection
      };
    }
  }, {
    key: "icon_dict",
    get: function get() {
      return {
        "Save As...": "floppy-disk",
        "Save": "saved",
        "Export as Jupyter Notebook": "export",
        "Open Console as Notebook": "console",
        "Export Table as Collection": "export",
        "Change collection": "exchange"
      };
    }
  }, {
    key: "menu_items",
    get: function get() {
      var items = [{
        name_text: "Save As...",
        icon_name: "floppy-disk",
        click_handler: this._saveProjectAs
      }, {
        name_text: "Save",
        icon_name: "saved",
        click_handler: this._saveProject
      }, {
        name_text: "divider1",
        icon_name: null,
        click_handler: "divider"
      }, {
        name_text: "Export as Jupyter Notebook",
        icon_name: "export",
        click_handler: this._exportAsJupyter
      }, {
        name_text: "Create Report From Notebook",
        icon_name: "document",
        click_handler: this._exportAsReport
      }, {
        name_text: "Create Presentation from Notebook",
        icon_name: "presentation",
        click_handler: this._exportAsPresentation
      }, {
        name_text: "Export Table as Collection",
        icon_name: "export",
        click_handler: this._exportDataTable
      }, {
        name_text: "Open Console as Notebook",
        icon_name: "console",
        click_handler: this._consoleToNotebook
      }, {
        name_text: "divider2",
        icon_name: null,
        click_handler: "divider"
      }, {
        name_text: "Change collection",
        icon_name: "exchange",
        click_handler: this.props.changeCollection
      }];
      var reduced_items = [];

      for (var _i = 0, _items = items; _i < _items.length; _i++) {
        var item = _items[_i];

        if (!this.props.hidden_items.includes(item.name_text)) {
          reduced_items.push(item);
        }
      }

      return reduced_items;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_menu_utilities.ToolMenu, {
        menu_name: "Project",
        menu_items: this.menu_items,
        binding_dict: {},
        disabled_items: this.props.disabled_items,
        disable_all: false
      });
    }
  }]);

  return ProjectMenu;
}(_react["default"].Component);

exports.ProjectMenu = ProjectMenu;
ProjectMenu.propTypes = {
  console_items: _propTypes["default"].array,
  postAjaxFailure: _propTypes["default"].func,
  interface_state: _propTypes["default"].object,
  updateLastSave: _propTypes["default"].func,
  changeCollection: _propTypes["default"].func,
  disabled_items: _propTypes["default"].array,
  hidden_items: _propTypes["default"].array
};

var DocumentMenu = /*#__PURE__*/function (_React$Component2) {
  _inherits(DocumentMenu, _React$Component2);

  var _super2 = _createSuper(DocumentMenu);

  function DocumentMenu(props) {
    var _this2;

    _classCallCheck(this, DocumentMenu);

    _this2 = _super2.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this2));
    return _this2;
  }

  _createClass(DocumentMenu, [{
    key: "_newDocument",
    value: function _newDocument() {
      this.props.startSpinner();
      var self = this;
      (0, _modal_react.showModalReact)("New Document", "New Document Name", doNew, this.props.currentDoc, this.props.documentNames, null, doCancel);

      function doCancel() {
        self.props.stopSpinner();
      }

      function doNew(new_name) {
        (0, _communication_react.postWithCallback)(self.props.main_id, "new_blank_document", {
          model_document_name: self.props.currentDoc,
          new_document_name: new_name
        }, function (result) {
          self.props.stopSpinner();
        }, null, self.props.main_id);
      }
    }
  }, {
    key: "_duplicateDocument",
    value: function _duplicateDocument() {
      this.props.startSpinner();
      var self = this;
      (0, _modal_react.showModalReact)("Duplicate Document", "New Document Name", doDuplicate, self.props.currentDoc, self.props.documentNames, null, doCancel);

      function doCancel() {
        self.props.stopSpinner();
      }

      function doDuplicate(new_name) {
        (0, _communication_react.postWithCallback)(self.props.main_id, "duplicate_document", {
          original_document_name: self.props.currentDoc,
          new_document_name: new_name
        }, function (result) {
          self.props.stopSpinner();
        }, null, self.props.main_id);
      }
    }
  }, {
    key: "_renameDocument",
    value: function _renameDocument() {
      this.props.startSpinner();
      var self = this;
      (0, _modal_react.showModalReact)("Rename Document", "New Document Name", doRename, self.props.currentDoc, self.props.documentNames, null, doCancel);

      function doCancel() {
        self.props.stopSpinner();
      }

      function doRename(new_name) {
        (0, _communication_react.postWithCallback)(self.props.main_id, "rename_document", {
          old_document_name: self.props.currentDoc,
          new_document_name: new_name
        }, function (result) {
          self.props.stopSpinner();
        }, null, self.props.main_id);
      }
    }
  }, {
    key: "option_dict",
    get: function get() {
      return {
        "New": this._newDocument,
        "Duplicate": this._duplicateDocument,
        "Rename": this._renameDocument
      };
    }
  }, {
    key: "icon_dict",
    get: function get() {
      return {
        "New": "document",
        "Duplicate": "duplicate",
        "Rename": "edit"
      };
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_menu_utilities.MenuComponent, {
        menu_name: "Document",
        option_dict: this.option_dict,
        icon_dict: this.icon_dict,
        binding_dict: {},
        disabled_items: this.props.disabled_items,
        hidden_items: []
      });
    }
  }]);

  return DocumentMenu;
}(_react["default"].Component);

exports.DocumentMenu = DocumentMenu;
DocumentMenu.propTypes = {
  documentNames: _propTypes["default"].array,
  currentDoc: _propTypes["default"].string
};

var ColumnMenu = /*#__PURE__*/function (_React$Component3) {
  _inherits(ColumnMenu, _React$Component3);

  var _super3 = _createSuper(ColumnMenu);

  function ColumnMenu(props) {
    var _this3;

    _classCallCheck(this, ColumnMenu);

    _this3 = _super3.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this3));
    return _this3;
  }

  _createClass(ColumnMenu, [{
    key: "_shift_column_left",
    value: function _shift_column_left() {
      var cnum = this.props.filtered_column_names.indexOf(this.props.selected_column);
      if (cnum == 0) return;
      var target_col = this.props.filtered_column_names[cnum - 1];
      this.props.moveColumn(this.props.selected_column, target_col);
    }
  }, {
    key: "_shift_column_to_start",
    value: function _shift_column_to_start() {
      var cnum = this.props.filtered_column_names.indexOf(this.props.selected_column);
      if (cnum == 0) return;
      var target_col = this.props.filtered_column_names[0];
      this.props.moveColumn(this.props.selected_column, target_col);
    }
  }, {
    key: "_shift_column_right",
    value: function _shift_column_right() {
      var cnum = this.props.table_spec.column_names.indexOf(this.props.selected_column);
      if (cnum == this.props.table_spec.column_names.length - 1) return;
      var target_col = this.props.table_spec.column_names[cnum + 2];
      this.props.moveColumn(this.props.selected_column, target_col);
    }
  }, {
    key: "_shift_column_to_end",
    value: function _shift_column_to_end() {
      var cnum = this.props.table_spec.column_names.indexOf(this.props.selected_column);
      if (cnum == this.props.table_spec.column_names.length - 1) return;
      this.props.moveColumn(this.props.selected_column, null);
    }
  }, {
    key: "option_dict",
    get: function get() {
      var _this4 = this;

      return {
        "Shift Left": this._shift_column_left,
        "Shift Right": this._shift_column_right,
        "Shift to Start": this._shift_column_to_start,
        "Shift to End": this._shift_column_to_end,
        "divider1": "divider",
        "Hide": this.props.hideColumn,
        "Hide in All Docs": this.props.hideInAll,
        "Unhide All": this.props.unhideAllColumns,
        "divider2": "divider",
        "Add Column": function AddColumn() {
          return _this4.props.addColumn(false);
        },
        "Add Column In All Docs": function AddColumnInAllDocs() {
          return _this4.props.addColumn(true);
        },
        "Delete Column": function DeleteColumn() {
          return _this4.props.deleteColumn(false);
        },
        "Delete Column In All Docs": function DeleteColumnInAllDocs() {
          return _this4.props.deleteColumn(true);
        }
      };
    }
  }, {
    key: "icon_dict",
    get: function get() {
      return {
        "Shift Left": "direction-left",
        "Shift Right": "direction-right",
        "Shift to Start": "double-chevron-left",
        "Shift to End": "double-chevron-right",
        "Hide": "eye-off",
        "Hide in All Docs": "eye-off",
        "Unhide All": "eye-on",
        "Add Column": "add-column-right",
        "Add Column In All Docs": "add-column-right",
        "Delete Column": "remove-column",
        "Delete Column In All Docs": "remove-column"
      };
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_menu_utilities.MenuComponent, {
        menu_name: "Column",
        option_dict: this.option_dict,
        icon_dict: this.icon_dict,
        binding_dict: {},
        disabled_items: this.props.disabled_items,
        hidden_items: []
      });
    }
  }]);

  return ColumnMenu;
}(_react["default"].Component);

exports.ColumnMenu = ColumnMenu;
ColumnMenu.propTypes = {
  moveColumn: _propTypes["default"].func,
  table_spec: _propTypes["default"].object,
  filtered_column_names: _propTypes["default"].array,
  selected_column: _propTypes["default"].string,
  hideColumn: _propTypes["default"].func,
  hideInAll: _propTypes["default"].func,
  unhideAllColumns: _propTypes["default"].func,
  addColumn: _propTypes["default"].func,
  deleteColumn: _propTypes["default"].func,
  disabled_items: _propTypes["default"].array
};

var RowMenu = /*#__PURE__*/function (_React$Component4) {
  _inherits(RowMenu, _React$Component4);

  var _super4 = _createSuper(RowMenu);

  function RowMenu(props) {
    var _this5;

    _classCallCheck(this, RowMenu);

    _this5 = _super4.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this5));
    return _this5;
  }

  _createClass(RowMenu, [{
    key: "option_dict",
    get: function get() {
      return {
        "Insert Row Before": this.props.insertRowBefore,
        "Insert Row After": this.props.insertRowAfter,
        "Duplicate Row": this.props.duplicateRow,
        "Delete Row": this.props.deleteRow
      };
    }
  }, {
    key: "icon_dict",
    get: function get() {
      return {
        "Insert Row Before": "add-row-top",
        "Insert Row After": "add-row-bottom",
        "Duplicate Row": "add-row-bottom",
        "Delete Row": "remove-row-bottom"
      };
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_menu_utilities.MenuComponent, {
        menu_name: "Row",
        option_dict: this.option_dict,
        icon_dict: this.icon_dict,
        binding_dict: {},
        disabled_items: this.props.disabled_items,
        hidden_items: []
      });
    }
  }]);

  return RowMenu;
}(_react["default"].Component);

exports.RowMenu = RowMenu;
RowMenu.propTypes = {
  selected_row: _propTypes["default"].number,
  deleteRow: _propTypes["default"].func,
  insertRowBefore: _propTypes["default"].func,
  insertRowAfter: _propTypes["default"].func,
  duplicateRow: _propTypes["default"].func,
  disabled_items: _propTypes["default"].array
};

var ViewMenu = /*#__PURE__*/function (_React$Component5) {
  _inherits(ViewMenu, _React$Component5);

  var _super5 = _createSuper(ViewMenu);

  function ViewMenu(props) {
    var _this6;

    _classCallCheck(this, ViewMenu);

    _this6 = _super5.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this6));
    return _this6;
  }

  _createClass(ViewMenu, [{
    key: "_shift_column_left",
    value: function _shift_column_left() {
      var cnum = this.props.table_spec.column_names.indexOf(this.props.selected_column);
      if (cnum == 0) return;
      var target_col = this.props.table_spec.column_names[cnum - 1];

      this._moveColumn(this.props.selected_column, target_col);
    }
  }, {
    key: "_shift_column_right",
    value: function _shift_column_right() {
      var cnum = this.props.table_spec.column_names.indexOf(this.props.selected_column);
      if (cnum == this.props.table_spec.column_names.length - 1) return;
      var target_col = this.props.table_spec.column_names[cnum + 2];

      this._moveColumn(this.props.selected_column, target_col);
    }
  }, {
    key: "_toggleExports",
    value: function _toggleExports() {
      this.props.setMainStateValue("show_exports_pane", !this.props.show_exports_pane);
    }
  }, {
    key: "_toggleConsole",
    value: function _toggleConsole() {
      this.props.setMainStateValue("show_console_pane", !this.props.show_console_pane);
    }
  }, {
    key: "option_dict",
    get: function get() {
      var table_opt_name = this.props.table_is_shrunk ? "Maximize Table" : "Minimize Table";
      var result = {};
      result[table_opt_name] = this.props.toggleTableShrink;
      result["divider1"] = "divider";
      var console_opt_name = this.props.show_console_pane ? "Hide Log" : "Show Log";
      result[console_opt_name] = this._toggleConsole;
      var exports_opt_name = this.props.show_exports_pane ? "Hide Exports" : "Show Exports";
      result[exports_opt_name] = this._toggleExports;
      result["divider2"] = "divider";
      result["Show Error Drawer"] = this.props.openErrorDrawer;
      return result;
    }
  }, {
    key: "icon_dict",
    get: function get() {
      var opt_name = this.props.table_is_shrunk ? "Maximize Table" : "Minimize Table";
      var result = {};
      result[opt_name] = this.props.table_is_shrunk ? "maximize" : "minimize";
      var console_opt_name = this.props.show_console_pane ? "Hide Log" : "Show Log";
      var exports_opt_name = this.props.show_exports_pane ? "Hide Exports" : "Show Exports";
      result[console_opt_name] = "code";
      result[exports_opt_name] = "variable";
      result["Show Error Drawer"] = "panel-stats";
      return result;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_menu_utilities.MenuComponent, {
        menu_name: "View",
        option_dict: this.option_dict,
        icon_dict: this.icon_dict,
        disabled_items: [],
        binding_dict: {},
        disable_all: this.props.disable_all,
        hidden_items: []
      });
    }
  }]);

  return ViewMenu;
}(_react["default"].Component);

exports.ViewMenu = ViewMenu;
ViewMenu.propTypes = {
  table_is_shrunk: _propTypes["default"].bool,
  toggleTableShrink: _propTypes["default"].func,
  openErrorDrawer: _propTypes["default"].func,
  show_exports_pane: _propTypes["default"].bool,
  show_console_pane: _propTypes["default"].bool,
  setMainStateValue: _propTypes["default"].func
};