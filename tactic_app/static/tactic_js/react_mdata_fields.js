
export { TagsField, NotesField, CombinedMetadata };

import { ViewerContext } from "./resource_viewer_context.js";

var Rbs = window.ReactBootstrap;

class TagsField extends React.Component {

    constructor(props) {
        super(props);
        this.tags_field_ref = React.createRef();
        this.tag_containing_div = React.createRef();
        this.last_tags_list = [];
        this.handleMyChange = this.handleMyChange.bind(this);
        this.setting_tags = false;
        this.state = { has_focus: false };
        this.all_tags = [];
    }

    get_tags_field() {
        return $(this.tags_field_ref.current);
    }

    handleMyChange(field, editor, tags) {
        if (!this.setting_tags) {
            this.props.handleChange(field, editor, tags);
        }
    }

    create_tag_editor(initial_tag_list) {
        let self = this;
        let data_dict = { "res_type": this.props.res_type, "is_repository": false };
        postAjaxPromise("get_tag_list", data_dict).then(function (data) {
            self.all_tags = data.tag_list;
            self.get_tags_field().tagEditor({
                initialTags: initial_tag_list,
                forceLowercase: true,
                autocomplete: {
                    delay: 0, // show suggestions immediately
                    position: { collision: 'flip' }, // automatic menu position up/down
                    source: self.all_tags
                },
                onChange: self.handleMyChange,
                placeholder: "Tags..." });
        }).catch(doFlash);
    }

    componentDidMount() {
        this.last_tags_list = this.props.tags;
        this.create_tag_editor(this.props.tags);
    }

    componentDidUpdate() {
        if (this.props.tags != this.last_tags_list) {
            this.last_tags_list = this.props.tags;
            this.set_tag_list(this.props.tags);
        }
    }

    // The stuff with has_focus is necessary to get the tag editor to behave differently
    // when the tags are changed by direct editing or because the user has clicked on
    // a row in the table. Otherwise the tag editor does ugly things, positioning the curoor
    // in a weird place or inserting randoom spaces.

    get has_focus() {
        return this.tag_containing_div.current.contains(document.activeElement);
    }

    get_tags() {
        return this.get_tags_field().tagEditor('getTags')[0].tags;
    }

    add_tags(tags) {
        let hf = this.has_focus;
        this.setting_tags = true;
        for (let tag of tags) {
            this.get_tags_field().tagEditor('addTag', tag, !hf);
        }
        this.setting_tags = false;
    }

    remove_all_tags() {
        let hf = this.has_focus;
        let tags = this.get_tags();
        this.setting_tags = true;
        for (let tag of tags) {
            this.get_tags_field().tagEditor('removeTag', tag, !hf);
        }
        this.setting_tags = false;
    }

    set_tag_list(taglist) {
        if (this.get_tags() != undefined) {
            this.remove_all_tags();
            this.add_tags(taglist);
        }
    }

    render() {
        let dstyle = { "pointerEvents": this.context.readOnly ? "none" : "all" };
        return React.createElement(
            "div",
            { ref: this.tag_containing_div, style: dstyle },
            React.createElement(Rbs.Form.Control, { as: "textarea",
                ref: this.tags_field_ref,
                className: "metadata-field", rows: "1" })
        );
    }
}
TagsField.contextType = ViewerContext;

TagsField.propTypes = {
    tags: PropTypes.array,
    handleChange: PropTypes.func,
    res_type: PropTypes.string
};

class NotesField extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            "md_height": 500,
            "show_markdown": this.hasOnlyWhitespace ? false : this.props.show_markdown_initial
        };
        this.hideMarkdown = this.hideMarkdown.bind(this);
        this.showMarkdown = this.showMarkdown.bind(this);
        this.handleMyBlur = this.handleMyBlur.bind(this);
        this.notes_ref = React.createRef();
        this.md_ref = React.createRef();
        this.converter = new showdown.Converter();
        this.awaiting_focus = false;
    }

    getNotesField() {
        return $(this.notes_ref.current);
    }

    get hasOnlyWhitespace() {
        return !this.props.notes.trim().length;
    }

    getMarkdownField() {
        return $(this.md_ref.current);
    }

    componentDidUpdate() {
        if (this.awaiting_focus) {
            this.focusNotes();
            this.awaiting_focus = false;
        } else if (!this.state.show_markdown && this.notes_ref.current != document.activeElement) {
            // If we are here it means the change was initiated externally
            this.showMarkdown();
        }
    }

    focusNotes() {
        this.getNotesField().focus();
    }

    hideMarkdown() {
        this.awaiting_focus = true; // We can't set focus until the input is visible
        this.setState({ "show_markdown": false });
    }

    handleMyBlur() {
        this.showMarkdown();
        if (this.props.handleBlur != null) {
            this.props.handleBlur();
        }
    }

    showMarkdown() {
        if (!this.hasOnlyWhitespace) {
            this.setState({ "show_markdown": true });
        }
    }

    render() {
        let really_show_markdown = this.hasOnlyWhitespace ? false : this.state.show_markdown;
        let notes_style = {
            "display": really_show_markdown ? "none" : "block"
        };
        let md_style = {
            "display": really_show_markdown ? "block" : "none",
            "maxHeight": this.state.md_height
        };
        var converted_markdown;
        if (really_show_markdown) {
            converted_markdown = this.converter.makeHtml(this.props.notes);
        }

        let converted_dict = { __html: converted_markdown };
        return React.createElement(
            Rbs.Form.Group,
            null,
            React.createElement(Rbs.Form.Control, { as: "textarea",
                className: "metadata-field notes-field",
                ref: this.notes_ref,
                rows: "10",
                placeholder: "notes",
                style: notes_style,
                onBlur: this.handleMyBlur,
                onChange: this.props.handleChange,
                readOnly: this.context.readOnly,
                value: this.props.notes
            }),
            React.createElement("div", { ref: this.md_ref,
                style: md_style,
                onClick: this.hideMarkdown,
                className: "notes-field-markdown-output",
                dangerouslySetInnerHTML: converted_dict })
        );
    }
}

NotesField.contextType = ViewerContext;

NotesField.propTypes = {
    notes: PropTypes.string,
    handleChange: PropTypes.func,
    show_markdown_initial: PropTypes.bool,
    handleBlur: PropTypes.func
};

NotesField.defaultProops = {
    handleBlur: null
};

class CombinedMetadata extends React.Component {

    constructor(props) {
        super(props);
        this.handleTagsChange = this.handleTagsChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleNotesChange = this.handleNotesChange.bind(this);
    }

    handleNotesChange(event) {
        this.props.handleChange({ "notes": event.target.value });
    }

    handleTagsChange(field, editor, tags) {
        this.props.handleChange({ "tags": tags });
    }

    handleCategoryChange(event) {
        this.props.handleChange({ "category": event.target.value });
    }

    render() {
        return React.createElement(
            "div",
            { className: "combined-metadata", style: this.props.outer_style },
            React.createElement(
                Rbs.Form.Label,
                null,
                "Created: " + this.props.created
            ),
            React.createElement(
                Rbs.Form.Group,
                null,
                React.createElement(
                    Rbs.Form.Label,
                    null,
                    "Tags"
                ),
                React.createElement(TagsField, { tags: this.props.tags,
                    handleChange: this.handleTagsChange,
                    res_type: this.props.res_type })
            ),
            this.props.category != null && React.createElement(
                Rbs.Form.Group,
                null,
                React.createElement(
                    Rbs.Form.Label,
                    null,
                    "Category"
                ),
                React.createElement(Rbs.Form.Control, { as: "input",
                    onChange: this.handleCategoryChange,
                    value: this.props.category })
            ),
            React.createElement(
                Rbs.Form.Group,
                null,
                React.createElement(
                    Rbs.Form.Label,
                    null,
                    "Notes"
                ),
                React.createElement(NotesField, { notes: this.props.notes,
                    handleChange: this.handleNotesChange,
                    show_markdown_initial: true,
                    handleBlur: this.props.handleNotesBlur
                })
            )
        );
    }
}

CombinedMetadata.propTypes = {
    outer_style: PropTypes.object,
    res_type: PropTypes.string,
    created: PropTypes.string,
    tags: PropTypes.array,
    notes: PropTypes.string,
    category: PropTypes.string,
    handleChange: PropTypes.func,
    handleNotesBlur: PropTypes.func
};

CombinedMetadata.defaultProps = {
    outer_style: { "marginLeft": 20 },
    handleNotesBlur: null,
    category: null
};