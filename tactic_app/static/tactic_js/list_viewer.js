"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by bls910 on 1/24/17.
 */

var list_viewer = void 0;

function start_post_load() {
    if (is_repository) {
        list_viewer = new RepositoryListViewer(resource_name, "list", "repository_get_list");
    } else {
        list_viewer = new ListViewer(resource_name, "list", "get_list");
    }
    stopSpinner();
}

var ListViewer = function (_ResourceViewer) {
    _inherits(ListViewer, _ResourceViewer);

    function ListViewer() {
        _classCallCheck(this, ListViewer);

        return _possibleConstructorReturn(this, (ListViewer.__proto__ || Object.getPrototypeOf(ListViewer)).apply(this, arguments));
    }

    _createClass(ListViewer, [{
        key: "construct_html_from_the_content",
        value: function construct_html_from_the_content(the_content) {
            return "<textarea id=\"listarea\" style=\"height: 100%; display:inline-block; resize:both\">" + the_content + "</textarea>";
        }
    }, {
        key: "get_current_content",
        value: function get_current_content() {
            return $("#listarea").val();
        }
    }, {
        key: "saveMe",
        value: function saveMe() {
            var new_list_as_string = $("#listarea").val();
            var tags = this.get_tags_string();
            var notes = $("#notes").val();
            var result_dict = {
                "list_name": this.resource_name,
                "new_list_as_string": new_list_as_string,
                "tags": tags,
                "notes": notes
            };
            postAjax("update_list", result_dict, update_success);
            function update_success(data) {
                if (data.success) {
                    this.savedContent = new_list_as_string;
                    this.savedTags = tags;
                    this.savedNotes = notes;
                    data.timeout = 2000;
                }
                doFlash(data);
                return false;
            }
        }
    }, {
        key: "saveMeAs",
        value: function saveMeAs(e) {
            doFlash({ "message": "not implemented yet", "timeout": 10 });
            return false;
        }
    }, {
        key: "button_bindings",
        get: function get() {
            return { "save_button": this.saveMe, "save_as_button": this.saveMeAs, "share_button": this.sendToRepository };
        }
    }]);

    return ListViewer;
}(ResourceViewer);

var RepositoryListViewer = function (_ListViewer) {
    _inherits(RepositoryListViewer, _ListViewer);

    function RepositoryListViewer() {
        _classCallCheck(this, RepositoryListViewer);

        return _possibleConstructorReturn(this, (RepositoryListViewer.__proto__ || Object.getPrototypeOf(RepositoryListViewer)).apply(this, arguments));
    }

    _createClass(RepositoryListViewer, [{
        key: "construct_html_from_the_content",
        value: function construct_html_from_the_content(the_content) {
            return "<textarea id=\"listarea\" style=\"height: 100%; display:inline-block\" readonly>" + the_content + "</textarea>";
        }
    }, {
        key: "get_current_content",
        value: function get_current_content() {
            return $("#listarea").val();
        }
    }, {
        key: "button_bindings",
        get: function get() {
            return { "copy_button": this.copyToLibrary };
        }
    }]);

    return RepositoryListViewer;
}(ListViewer);