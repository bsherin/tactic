
export {NotesField, CombinedMetadata}

import {ViewerContext} from "./resource_viewer_context.js";
import {postAjaxPromise} from "./communication_react.js"

var Bp = blueprint;
var Bps = bpselect;

let icon_dict = {
    collection: "database",
    project: "projects",
    tile: "application",
    list: "list",
    code: "code"
};

class SuggestionItem extends React.Component{
    constructor(props) {
        super(props);
        doBinding(this)
    }

    _handleClick() {
        this.props.handleClick(this.props.item)
    }

    render() {
        return (
            <Bp.MenuItem
                text={this.props.item}
                key={this.props.item}
                active={this.props.modifiers.active}
                onClick={this._handleClick}
                shouldDismissPopover={true}
            />
        );
    }
}
SuggestionItem.propTypes = {
    item: PropTypes.string,
    modifiers: PropTypes.string,
    handleClick: PropTypes.func
};


function renderSuggestion (item, { modifiers, handleClick}) {
    return <SuggestionItem item={item} modifiers={modifiers} handleClick={handleClick}/>
}

const renderCreateNewTag = (query, active, handleClick) => {
    let hclick = handleClick;
    return(
        <Bp.MenuItem
            icon="add"
            key="create_item"
            text={`Create "${query}"`}
            active={active}
            onClick={handleClick}
            shouldDismissPopover={false}
        />
    );
};

class NativeTags extends React.Component {
    constructor (props) {
        super(props);
        doBinding(this);

        this.state = {
            query: "",
          suggestions: [
          ]
        }
     }

     componentDidMount() {
        let self = this;
        let data_dict = {"res_type": this.props.res_type, "is_repository": false};
        postAjaxPromise("get_tag_list", data_dict)
            .then(function(data) {
                let all_tags = data.tag_list;
                self.setState({"suggestions": all_tags})
            })
     }

     renderTag(item) {
        return item
     }

    _handleDelete (tag, i) {
        let new_tlist = [...this.props.tags];
        new_tlist.splice(i, 1);
        this.props.handleChange(new_tlist)
      }

     _handleAddition (tag) {
        let new_tlist = [...this.props.tags];
        new_tlist.push(tag);
        this.props.handleChange(new_tlist)
    }

    _filterSuggestion(query, item) {
        if (query.length == 0) {
            return false
        }
        let re = new RegExp("^" + query);

        return re.test(item)
    }

    _createItemFromQuery(name) {
        return name
    }

      render () {
        if (this.context.readOnly) {
            return (
                <Bp.TagInput values={this.props.tags} disabled={true}/>
            )
        }
        return (
            <Bps.MultiSelect
                allowCreate={true}
                openOnKeyDown={true}
                createNewItemFromQuery={this._createItemFromQuery}
                createNewItemRenderer={renderCreateNewTag}
                resetOnSelect={true}
                itemRenderer={renderSuggestion}
                selectedItems={this.props.tags}
                allowNew={true}
                items={this.state.suggestions}
                itemPredicate={this._filterSuggestion}
                tagRenderer={this.renderTag}
                tagInputProps={{onRemove: this._handleDelete}}
                onItemSelect={this._handleAddition} />
        )
    }
}

NativeTags.proptypes = {
    tags: PropTypes.array,
    handleChange: PropTypes.func,
    res_type: PropTypes.string
};

NativeTags.contextType = ViewerContext;

class NotesField extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            "md_height": 500,
            "show_markdown": this.hasOnlyWhitespace ? false : this.props.show_markdown_initial
        };
        doBinding(this);
        // this.notes_ref = React.createRef();
        this.md_ref = React.createRef();
        this.converter = new showdown.Converter();
        this.awaiting_focus = false
    }

    getNotesField() {
        return $(this.notes_ref)
    }

    get hasOnlyWhitespace() {
        return !this.props.notes.trim().length
    }

    getMarkdownField() {
        return $(this.md_ref.current)
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if (this.awaiting_focus) {
            this.focusNotes();
            this.awaiting_focus = false
        }
        else if (!this.state.show_markdown && (this.notes_ref != document.activeElement)) {
            // If we are here it means the change was initiated externally
            this._showMarkdown()
        }
    }

    focusNotes() {
        this.getNotesField().focus()
    }

    _hideMarkdown() {
        if (this.context.readOnly) return;
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

    _notesRefHandler(the_ref) {
        this.notes_ref = the_ref;
    }

    render() {
        let really_show_markdown =  this.hasOnlyWhitespace ? false : this.state.show_markdown;
        let notes_style = {
            "display": really_show_markdown ? "none" : "block",
            fontSize: 13
            // fontSize: 14
        };
        let md_style = {
            "display": really_show_markdown ? "block": "none",
            "maxHeight": this.state.md_height,
            "fontSize": 13
        };
        var converted_markdown;
        if (really_show_markdown) {
            converted_markdown = this.converter.makeHtml(this.props.notes);
        }

        let converted_dict = {__html: converted_markdown};
        return (
        <React.Fragment>
            <Bp.TextArea
                      rows="10"
                      cols="50"
                      inputRef={this._notesRefHandler}
                      growVertically={false}
                      onBlur={this._handleMyBlur}
                      onChange={this.props.handleChange}
                      value={this.props.notes}
                      disabled={this.context.readOnly}
                      style={notes_style}
            />
            <div ref={this.md_ref}
                 style={md_style}
                 onClick={this._hideMarkdown}
                 className="notes-field-markdown-output"
                 dangerouslySetInnerHTML={converted_dict}/>
        </React.Fragment>
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

NotesField.defaultProps = {
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

    _handleTagsChange(tags) {
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
                     <Bp.FormGroup label={field + ": "} key={field} inline={true}>
                            <Bp.InputGroup disabled={true} style={{color:"#394B59"}} value={md} fill={true}/>
                        </Bp.FormGroup>
                )
            }
        }
        return (
            <Bp.Card elevation={this.props.elevation} className="combined-metadata" style={this.props.outer_style}>
                {this.props.name != null &&
                    <h6 style={{color: "#106ba3"}}><Bp.Icon icon={icon_dict[this.props.res_type]} style={{marginRight: 4}}/>{this.props.name}</h6>
                }

                    <Bp.FormGroup label="Tags">
                        <NativeTags tags={this.props.tags}
                                     handleChange={this._handleTagsChange}
                                    res_type={this.props.res_type}/>
                        {/*<Bp.TagInput values={this.props.tags}*/}
                        {/*             onChange={this._handleTagsChange}/>*/}
                    </Bp.FormGroup>
                    {this.props.category != null &&
                        <Bp.FormGroup label="Category">
                            <Bp.InputGroup  onChange={this._handleCategoryChange}
                                            value={this.props.category} />
                        </Bp.FormGroup>
                    }
                    <Bp.FormGroup label="Notes">
                        <NotesField notes={this.props.notes}
                                    handleChange={this._handleNotesChange}
                                    show_markdown_initial={true}
                                    handleBlur={this.props.handleNotesBlur}
                        />
                    </Bp.FormGroup>
                    <Bp.FormGroup label="Created " inline={true}>
                        <Bp.InputGroup disabled={true} style={{color:"#394B59"}} value={this.props.created}/>
                    </Bp.FormGroup>
                    {this.props.updated != null &&
                        <Bp.FormGroup label="Updated: " inline={true}>
                            <Bp.InputGroup disabled={true} style={{color:"#394B59"}} value={this.props.updated}/>
                        </Bp.FormGroup>
                    }
                    {this.props.additional_metadata != null &&
                        additional_items
                    }
            </Bp.Card>
        )
    }
}

CombinedMetadata.propTypes = {
    outer_style: PropTypes.object,
    elevation: PropTypes.number,
    res_type: PropTypes.string,
    name: PropTypes.string,
    created: PropTypes.string,
    updated: PropTypes.string,
    tags: PropTypes.array,
    notes: PropTypes.string,
    category: PropTypes.string,
    handleChange: PropTypes.func,
    handleNotesBlur: PropTypes.func,
    additional_metadata: PropTypes.object,
};

CombinedMetadata.defaultProps = {
    outer_style: {marginLeft: 20, overflow: "auto",
            padding: 15, backgroundColor: "#f5f8fa"},
    elevation: 0,
    handleNotesBlur: null,
    category: null,
    name: null,
    updated: null,
    additional_metadata: null
};
