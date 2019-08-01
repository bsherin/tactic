
export {TagsField, NotesField, CombinedMetadata}

import {ViewerContext} from "./resource_viewer_context.js";

var Rbs = window.ReactBootstrap;

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
        let dstyle = {"pointerEvents": this.context.readOnly ? "none" : "all"};
        return (
            <div style={dstyle}>
                <Rbs.Form.Control as="textarea"
                                  ref={this.tags_field_ref}
                                  className="metadata-field" rows="1" >
                </Rbs.Form.Control>
            </div>
        )
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
            "show_markdown": false,
            "md_height": 500,
            "converted_markdown": "",
            "notes_at_last_convert": ""
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
        if (this.state.show_markdown) {
            this.hideMarkdown()
        }
        else {
           this.convertMarkdown()
        }
    }

    focusNotes() {
        this.getNotesField().focus()
    }

    convertMarkdown() {
        let the_text = this.props.notes;
        if (the_text == "") {
            this.setState({"converted_markdown": "", "show_markdown": false});
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

    componentDidMount () {
        this.convertMarkdown()
    }

    hideMarkdown() {
        this.setState({"show_markdown": false});
        this.focusNotes()
    }

    showMarkdown() {
        this.setState({"show_markdown": true})
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
        <Rbs.Form.Group>
            <Rbs.Form.Control as="textarea"
                className="metadata-field notes-field"
                      ref={this.notes_ref}
                      rows="10"
                      placeholder="notes"
                      style={notes_style}
                      onBlur={this.convertMarkdown}
                      onChange={this.props.handleChange}
                      readOnly={this.context.readOnly}
                      value={this.props.notes}
            />
            <div ref={this.md_ref}
                 style={md_style}
                 onClick={this.hideMarkdown}
                 className="notes-field-markdown-output"
                 dangerouslySetInnerHTML={converted}/>
        </Rbs.Form.Group>
        )
    }
}

NotesField.contextType = ViewerContext;

NotesField.propTypes = {
    notes: PropTypes.string,
    handleChange: PropTypes.func,
    outer_selector: PropTypes.string
};


class CombinedMetadata extends React.Component {

    render () {
        return (
            <div className="combined-metadata" style={this.props.outer_style} id={this.props.outer_id}>
                <Rbs.Form.Label>{"Created: " + this.props.created}</Rbs.Form.Label>
                <Rbs.Form.Group>
                    <Rbs.Form.Label>Tags</Rbs.Form.Label>
                    <TagsField tags={this.props.tags}
                               handleChange={this.props.handleTagsChange}
                               res_type={this.props.res_type}/>
                </Rbs.Form.Group>
                {this.props.category != null &&
                    <Rbs.Form.Group>
                        <Rbs.Form.Label>Category</Rbs.Form.Label>
                        <Rbs.Form.Control as="input"
                                          onChange={this.props.handleCategoryChange}
                                          value={this.props.category} />
                    </Rbs.Form.Group>
                }
                <Rbs.Form.Group>
                    <Rbs.Form.Label>Notes</Rbs.Form.Label>
                    <NotesField notes={this.props.notes}
                                handleChange={this.props.handleNotesChange}
                                outer_selector={"#" + this.props.outer_id}/>
                </Rbs.Form.Group>
            </div>
        )
    }

}

CombinedMetadata.propTypes = {
    outer_style: PropTypes.object,
    outer_id: PropTypes.string,
    res_type: PropTypes.string,
    created: PropTypes.string,
    tags: PropTypes.array,
    notes: PropTypes.string,
    category: PropTypes.string,
    handleTagsChange: PropTypes.func,
    handleNotesChange: PropTypes.func,
    handleCategoryChange: PropTypes.func
};

CombinedMetadata.defaultProps = {
    outer_style: {"marginLeft": 20},
    outer_id: "metadata-holder",
    category: null
};
