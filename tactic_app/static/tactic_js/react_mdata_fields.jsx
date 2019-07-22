
export {TagsField, NotesField, CombinedMetadata}

class TagsField extends React.Component {
    constructor(props) {
        super(props);
        this.tags_field_ref = React.createRef()
    }

    get_tags_field() {
        return $(this.tags_field_ref.current)
    }

    create_tag_editor(initial_tag_list) {
        let self = this;
        let data_dict = {"res_type": this.props.res_type, "is_repository": false};
        postAjaxPromise("get_tag_list", data_dict)
            .then(function(data) {
                let all_tags = data.tag_list;
                self.get_tags_field().tagEditor({
                    initialTags: initial_tag_list,
                    forceLowercase: true,
                    autocomplete: {
                        delay: 0, // show suggestions immediately
                        position: { collision: 'flip' }, // automatic menu position up/down
                        source: all_tags
                    },
                    onChange: self.props.handleChange,
                    placeholder: "Tags...",});
            })
            .catch(doFlash)
    }

    componentDidMount() {
        this.create_tag_editor(this.props.tags)
    }

    render() {
        return (
            <div>
                <textarea ref={this.tags_field_ref}
                          className="form-control metadata-field" rows="1" ></textarea>
            </div>
        )
    }
}


class NotesField extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            "show_markdown": false,
            //"notes_display": "block",
            // "md_display": "none",
            "md_height": 500,
            "converted_markdown": "",
        };
        this.convertMarkdown = this.convertMarkdown.bind(this);
        this.hideMarkdown = this.hideMarkdown.bind(this);
        this.notes_ref = React.createRef();
        this.md_ref = React.createRef()
    }

    getNotesField() {
        return $(this.notes_ref.current)
    }

    getMarkdownField() {
        return $(this.md_ref.current)
    }

    updateMarkdownHeight() {
        let me = this.getMarkdownField();
        let outer = $(this.props.outer_selector);
        let new_max_height = outer.height() - (me.offset().top - outer.offset().top);
        this.setState({'md_height': new_max_height})
    }

    toggleMarkdown() {
        if (this.state.notes_display == "block") {
            this.convertMarkdown()
        }
        else {
           this.hideMarkdown()
        }
    }

    focusNotes() {
        this.getNotesField().focus()
    }

    convertMarkdown() {
        let the_text = this.props.notes;
        if (the_text == "") {
            this.setState({"converted_markdown": ""});
            this.hideMarkdown()
        }
        else {
            let ddict = {"the_text": the_text};
            let self = this;
            postAjaxPromise("convert_markdown", ddict)
                .then(function(data) {
                    self.setState({
                        "converted_markdown": data["converted_markdown"],
                         "show_markdown": true});
                    self.updateMarkdownHeight(self.props.outer_selector);
                    })
                .catch(doFlash)
        }
    }

    hideMarkdown() {
        // this.setState({"notes_display": "block", "md_display": "none"});
        this.setState({"show_markdown": false});
        this.focusNotes()
    }

    showMarkdown() {
        // this.setState({"notes_display": "none", "md_display": "block"})
        this.setState({"show_markdown": true})
    }

    componentDidMount() {
        this.convertMarkdown()
    }

    render() {
        let notes_style = {
            "display": this.state.show_markdown ? "none" : "block"
        };
        let md_style = {
            "display": this.state.show_markdown ? "block": "none",
            "maxHeight": this.state.md_height
        };

        let converted = {__html: this.state.converted_markdown};
        return (
        <div className="form-group">
            <textarea className="form-control metadata-field notes-field"
                      ref={this.notes_ref}
                      rows="10"
                      placeholder="notes"
                      style={notes_style}
                      onBlur={this.convertMarkdown}
                      onChange={this.props.handleChange}
                      value={this.props.notes}/>
            <div ref={this.md_ref}
                 style={md_style}
                 onClick={this.hideMarkdown}
                 className="notes-field-markdown-output"
                 dangerouslySetInnerHTML={converted}/>
        </div>
        )
    }
}

class CombinedMetadata extends React.Component {

    constructor(props) {
        super(props);

    }

    render () {
        return (
            <div>
            <div>{this.props.created}</div>
            <div className="form-group">
                <TagsField tags={this.props.tags}
                           handleChange={this.props.handleTagsChange}
                           res_type={this.props.res_type}/>
            </div>
                <NotesField notes={this.props.notes}
                            handleChange={this.props.handleNotesChange}
                            convert={true}
                            outer_selector={this.props.meta_outer}/>
        </div>
        )
    }

}
