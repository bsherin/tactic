
export {TagsField, NotesField, CombinedMetadata}

import {ViewerContext} from "./resource_viewer_context.js";
import {postAjaxPromise} from "./communication_react.js"

var Rbs = window.ReactBootstrap;

import {ReactTags} from "./lib/ReactTags.js";

// var ReactTags = react_tag_autocomplete;

class NativeTags extends React.Component {
    constructor (props) {
        super(props);
        doBinding(this);

        this.state = {
          suggestions: [
          ]
        }
     }

     componentDidMount() {
        let self = this;
        let data_dict = {"res_type": this.props.res_type, "is_repository": false};
        postAjaxPromise("get_tag_list", data_dict)
            .then(function(data) {
                let all_tags = self._fillOutTags(data.tag_list);
                self.setState({"suggestions": all_tags})
            })
     }

     _fillOutTags(tlist) {
        return tlist.map((tag, index)=>{
                    return {id: index, name: tag}
                });
     }

     _extractTags(dlist) {
        return dlist.map((tdict) => tdict.name)
     }

    _handleDelete (i) {
        let new_tlist = [...this.props.tags];
        new_tlist.splice(i, 1);
        this.props.handleChange(new_tlist)
      }

     _handleAddition (tag) {
        let new_tlist = [...this.props.tags];
        new_tlist.push(tag.name);
        this.props.handleChange(new_tlist)
  }

  render () {
        let full_tags = this._fillOutTags(this.props.tags);
    return (
      <ReactTags
        tags={full_tags}
        allowNew={true}
        suggestions={this.state.suggestions}
        handleDelete={this._handleDelete}
        handleAddition={this._handleAddition} />
    )
  }
}

NativeTags.proptypes = {
    tags: PropTypes.array,
    handleChange: PropTypes.func,
    res_type: PropTypes.string
};

class TagsField extends React.Component {

    constructor(props) {
        super(props);
        this.tags_field_ref = React.createRef();
        this.tag_containing_div = React.createRef();
        this.last_tags_list = [];
        this.setting_tags = false;
        this.state = {has_focus: false};
        this.all_tags = [];
        doBinding(this);
    }

    get_tags_field() {
        return $(this.tags_field_ref.current)
    }

    _handleMyChange(field, editor, tags) {
        if (!this.setting_tags) {
            this.props.handleChange(field, editor, tags)
        }
    }

    create_tag_editor(initial_tag_list) {
        let self = this;
        let data_dict = {"res_type": this.props.res_type, "is_repository": false};
        postAjaxPromise("get_tag_list", data_dict)
            .then(function(data) {
                self.all_tags = data.tag_list;
                self.get_tags_field().tagEditor({
                    initialTags: initial_tag_list,
                    forceLowercase: true,
                    autocomplete: {
                        delay: 0, // show suggestions immediately
                        position: { collision: 'flip' }, // automatic menu position up/down
                        source: self.all_tags
                    },
                    onChange: self._handleMyChange,
                    placeholder: "Tags...",});
            })
            .catch(doFlash)
    }

    componentDidMount() {
        this.last_tags_list = this.props.tags;
        this.create_tag_editor(this.props.tags)
    }

    componentDidUpdate() {
        if (this.props.tags != this.last_tags_list) {
            this.last_tags_list = this.props.tags;
            this.set_tag_list(this.props.tags)
        }
    }

    // The stuff with has_focus is necessary to get the tag editor to behave differently
    // when the tags are changed by direct editing or because the user has clicked on
    // a row in the table. Otherwise the tag editor does ugly things, positioning the curoor
    // in a weird place or inserting randoom spaces.

    get has_focus() {
        return this.tag_containing_div.current.contains(document.activeElement)
    }

    get_tags() {
        return this.get_tags_field().tagEditor('getTags')[0].tags
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
        let dstyle = {"pointerEvents": this.context.readOnly ? "none" : "all"};
        return (
            <div ref={this.tag_containing_div} style={dstyle}>
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
            "md_height": 500,
            "show_markdown": this.hasOnlyWhitespace ? false : this.props.show_markdown_initial
        };
        doBinding(this);
        this.notes_ref = React.createRef();
        this.md_ref = React.createRef();
        this.converter = new showdown.Converter();
        this.awaiting_focus = false
    }

    getNotesField() {
        return $(this.notes_ref.current)
    }

    get hasOnlyWhitespace() {
        return !this.props.notes.trim().length
    }

    getMarkdownField() {
        return $(this.md_ref.current)
    }

    componentDidUpdate() {
        if (this.awaiting_focus) {
            this.focusNotes();
            this.awaiting_focus = false
        }
        else if (!this.state.show_markdown && (this.notes_ref.current != document.activeElement)) {
            // If we are here it means the change was initiated externally
            this._showMarkdown()
        }
    }

    focusNotes() {
        this.getNotesField().focus()
    }

    _hideMarkdown() {
        this.awaiting_focus = true;  // We can't set focus until the input is visible
        this.setState({"show_markdown": false});
    }

    _handleMyBlur() {
        this._showMarkdown();
        if (this.props.handleBlur != null) {
            this.props.handleBlur()
        }
    }

    _showMarkdown() {
        if (!this.hasOnlyWhitespace) {
            this.setState({"show_markdown": true})
        }
    }

    render() {
        let really_show_markdown =  this.hasOnlyWhitespace ? false : this.state.show_markdown;
        let notes_style = {
            "display": really_show_markdown ? "none" : "block",
            fontSize: 14
        };
        let md_style = {
            "display": really_show_markdown ? "block": "none",
            "maxHeight": this.state.md_height,
            "fontSize": 14
        };
        var converted_markdown;
        if (really_show_markdown) {
            converted_markdown = this.converter.makeHtml(this.props.notes);
        }

        let converted_dict = {__html: converted_markdown};
        return (
        <Rbs.Form.Group>
            <Rbs.Form.Control as="textarea"
                className="metadata-field notes-field"
                      ref={this.notes_ref}
                      rows="10"
                      placeholder="notes"
                      style={notes_style}
                      onBlur={this._handleMyBlur}
                      onChange={this.props.handleChange}
                      readOnly={this.context.readOnly}
                      value={this.props.notes}
            />
            <div ref={this.md_ref}
                 style={md_style}
                 onClick={this._hideMarkdown}
                 className="notes-field-markdown-output"
                 dangerouslySetInnerHTML={converted_dict}/>
        </Rbs.Form.Group>
        )
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
        doBinding(this)
    }

    _handleNotesChange(event) {
        this.props.handleChange({"notes": event.target.value})
    }

    _handleTagsChange(field, editor, tags) {
        this.props.handleChange({"tags": tags})
    }

    _handleTagsChangeNative(tags) {
        this.props.handleChange({"tags": tags})
    }

    _handleCategoryChange(event) {
        this.props.handleChange({"category": event.target.value})
    }

    render () {
        let addition_field_style = {fontSize: 14};
        let additional_items;
        if (this.props.additional_metadata != null) {
            additional_items = [];
            for (let field in this.props.additional_metadata) {
                let md = this.props.additional_metadata[field];
                if (Array.isArray(md)) {
                    md = md.join(", ")
                }
                else if (field == "collection_name") {
                    let sresult = /\.\w*$/.exec(md);
                    if (sresult != null)  md = sresult[0].slice(1)
                }
                additional_items.push(
                    <div style={addition_field_style} key={field}><span className="text-primary">{field + ": "}</span>
                        {md}
                    </div>
                )
            }
        }
        return (
            <div className="combined-metadata" style={this.props.outer_style}>
                {this.props.name != null &&
                    <h4>{this.props.name}</h4>
                }

                <Rbs.Form>
                    <Rbs.Form.Group>
                        <Rbs.Form.Label><span className="text-primary">Tags</span></Rbs.Form.Label>
                       <NativeTags tags={this.props.tags}
                                    handleChange={this._handleTagsChangeNative}
                                 res_type={this.props.res_type}/>
                    </Rbs.Form.Group>
                    {this.props.category != null &&
                        <Rbs.Form.Group>
                            <Rbs.Form.Label><span className="text-primary">Category</span></Rbs.Form.Label>
                            <Rbs.Form.Control as="input"
                                              onChange={this._handleCategoryChange}
                                              value={this.props.category} />
                        </Rbs.Form.Group>
                    }
                    <Rbs.Form.Group>
                        <Rbs.Form.Label><span className="text-primary">Notes</span></Rbs.Form.Label>
                        <NotesField notes={this.props.notes}
                                    handleChange={this._handleNotesChange}
                                    show_markdown_initial={true}
                                    handleBlur={this.props.handleNotesBlur}
                        />
                    </Rbs.Form.Group>
                    <div style={addition_field_style}><span className="text-primary">Created: </span>
                        {this.props.created}
                    </div>
                    {this.props.updated != null &&
                    <div style={addition_field_style}><span className="text-primary">Updated: </span>
                        {this.props.updated}
                    </div>
                    }
                    {this.props.additional_metadata != null &&
                        additional_items
                    }
                </Rbs.Form>
            </div>
        )
    }
}

CombinedMetadata.propTypes = {
    outer_style: PropTypes.object,
    res_type: PropTypes.string,
    name: PropTypes.string,
    created: PropTypes.string,
    updated: PropTypes.string,
    tags: PropTypes.array,
    notes: PropTypes.string,
    category: PropTypes.string,
    handleChange: PropTypes.func,
    handleNotesBlur: PropTypes.func,
    additional_metadata: PropTypes.object
};

CombinedMetadata.defaultProps = {
    outer_style: {"marginLeft": 20},
    handleNotesBlur: null,
    category: null,
    name: null,
    updated: null,
    additional_metadata: null
};
