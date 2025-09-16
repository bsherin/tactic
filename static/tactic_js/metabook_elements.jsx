import React, {useMemo, useRef, useCallback, Fragment, memo} from "react";
import {ContextMenu, Menu, EditableText, Icon} from "@blueprintjs/core";

import markdownIt from 'markdown-it'
import 'markdown-it-latex/dist/index.css'
import markdownItLatex from 'markdown-it-latex'

const mdi = markdownIt({
    html: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre><code class="hljs">' +
                    hljs.highlight(str, {language: lang, ignoreIllegals: true}).value +
                    '</code></pre>';
            } catch (__) {
            }
        }
        return '<pre><code class="hljs">' + mdi.utils.escapeHtml(str) + '</code></pre>';
    }
});
mdi.use(markdownItLatex);

import {GlyphButton} from "./blueprint_react_widgets";
import {ReactCodemirror6} from "./react-codemirror6";

export {MetabookSuperItem};

const sHandleStyle = {marginLeft: 0, marginRight: 6};

const trash_icon = <Icon icon="trash" size={14}/>;

const empty_style = {};

function Shandle(props) {
    return (
        <span {...props.dragHandleProps}>
                <Icon icon="drag-handle-vertical"
                      {...props.dragHandleProps}
                      style={sHandleStyle}
                      size={20}
                      className="console-sorter"/>
            </span>
    )
}

function MetabookSuperItem(props) {

    const toggleShrink = useCallback(() => {
        props.setNodeValue(props._id, "am_shrunk", !props.am_shrunk);
    }, [props.am_shrunk]);

    const deleteMe = useCallback(() => {
        props.dispatch({
            type: "delete_node",
            _id: props._id
        });
    }, []);

    function selectMe() {
        props.dispatch({"type": "select_node", _id: props._id});
    }

    function clickOnMe(e) {
        selectMe();
        e.stopPropagation()
    }

    const passDowns = {
        selectMe, deleteMe, clickOnMe, toggleShrink
    };

    switch (props.type) {
        case "text":
            return <MetabookTextItem {...props} {...passDowns}/>;
        case "divider":
            return <DividerItem {...props} {...passDowns}/>;
        default:
            return null
    }
}

MetabookSuperItem = memo(MetabookSuperItem);


function MetabookTextItem(props) {
    props = {
        summary_text: null,
        links: [],
        ...props
    };
    const elRef = useRef(null);
    const am_selected_previous = useRef(false);
    const setFocusFunc = useRef(null);


    function hasOnlyWhitespace() {
        return !props.node_text.trim().length
    }

    function showMarkdown() {
        props.setNodeValue(props._id, "show_markdown", true);
    }

    const toggleMarkdown = useCallback(() => {
        if (props["show_markdown"]) {
            hideMarkdown()
        } else {
            showMarkdown()
        }
    }, [props["show_markdown"]]);

    const hideMarkdown = useCallback(() => {
        props.setNodeValue(props._id, "show_markdown", false);
    }, []);

    const handleChange = useCallback((new_text) => {
        props.setNodeValue(props._id, "node_text", new_text)
    }, []);

    function handleSummaryTextChange(value) {
        props.setNodeValue(props._id, "summary_text", value)
    }

    function getFirstLine() {
        let re = /^(.*)$/m;
        if (props.node_text == "") {
            return "empty text cell"
        } else {
            return re.exec(props.node_text)[0]
        }

    }

    const contextMenu = useMemo(() => {
        return (
            <Menu>

            </Menu>
        );
    }, []);


    let really_show_markdown = hasOnlyWhitespace() ? false : props["show_markdown"];
    let converted_markdown;
    if (really_show_markdown) {
        converted_markdown = mdi.render(props.node_text)
    }

    let converted_dict = {__html: converted_markdown};
    let panel_class = props.am_shrunk ? "log-panel log-panel-invisible text-log-item" : "log-panel log-panel-visible text-log-item";

    // noinspection JSUnusedAssignment,JSValidateTypes
    return (
        <ContextMenu content={contextMenu}>
            <div className={panel_class + " d-flex flex-row"}
                 onClick={props.clickOnMe}
                 ref={elRef}
                 id={props.unique_id}
                 style={{marginBottom: 10}}>
                <div className="button-div shrink-expand-div d-flex flex-row">
                    <Shandle dragHandleProps={props.dragHandleProps}/>
                    {!props.am_shrunk &&
                        <GlyphButton icon="chevron-down"
                                     handleClick={props.toggleShrink}/>
                    }
                    {props.am_shrunk &&
                        <GlyphButton icon="chevron-right"
                                     style={{marginTop: 5}}
                                     handleClick={props.toggleShrink}/>
                    }
                </div>
                {props.am_shrunk &&
                    <div className="d-flex flex-row text-box body-shrunk-style">
                        <EditableText
                            value={props.summary_text ? props.summary_text : _getFirstLine()}
                            onChange={handleSummaryTextChange}
                            className="log-panel-summary"/>
                        <div className="button-div float-buttons d-flex flex-row">
                            <GlyphButton handleClick={props.deleteMe}
                                         tooltip="Delete this item"
                                         style={empty_style}
                                         icon={trash_icon}/>
                        </div>
                    </div>
                }
                {!props.am_shrunk &&
                    <div className="d-flex flex-column"
                         style={{flex: "1 1 0", minWidth: 0, overflow: "hidden"}}>
                        <div className="log-panel-body console-code d-flex flex-row"
                             style={{minWidth: 0, overflow: "hidden"}}>
                            <div className="button-div d-flex pr-1">
                                <GlyphButton handleClick={toggleMarkdown}
                                             intent="success"
                                             tooltip="Convert to/from markdown"
                                             icon="paragraph"/>
                            </div>
                            <div className="d-flex flex-column" style={{
                                flex: "1 1 0", minWidth: 0,
                                position: "relative", overflow: "hidden"
                            }}>
                                {!really_show_markdown &&
                                    <Fragment>
                                        <ReactCodemirror6 handleChange={handleChange}
                                                          readOnly={false}
                                                          handleFocus={null}
                                                          registerSetFocusFunc={null}
                                                          show_line_numbers={false}
                                                          soft_wrap={true}
                                                          mode="markdown"
                                                          code_content={props.node_text}
                                                          extraKeys={[]}
                                                          search_term={null}
                                                          flex_size={true}
                                                          tsocket={props.tsocket}
                                                          container_id={props.main_id}
                                                          saveMe={null}/>
                                    </Fragment>
                                }
                                {really_show_markdown && !hasOnlyWhitespace() &&
                                    <div className="text-panel-output markdown-heading-sizes"
                                         onDoubleClick={hideMarkdown}
                                         style={{padding: 9}}
                                         dangerouslySetInnerHTML={converted_dict}/>
                                }
                            </div>
                            <div style={{width: 37}}/>

                            <div className="button-div float-buttons d-flex flex-row">
                                <GlyphButton handleClick={props.deleteMe}
                                             tooltip="Delete this item"
                                             style={empty_style}
                                             icon={trash_icon}/>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </ContextMenu>
    )
}

MetabookTextItem = memo(MetabookTextItem);

function DividerItem(props) {

    const handleHeaderTextChange = useCallback((value) => {
        props.setNodeValue(props.unique_id, "header_text", value)
    }, []);

    const contextMenu = useMemo(() => {
        // return a single element, or nothing to use default browser behavior
        return (
            <Menu>
            </Menu>
        );
    }, []);


    let panel_class = props["am_shrunk"] ? "log-panel in-section divider-log-panel log-panel-invisible fixed-log-panel" :
        "log-panel divider-log-panel log-panel-visible fixed-log-panel";
    if (props.am_selected) {
        panel_class += " selected"
    }
    if (props["is_error"]) {
        panel_class += " error-log-panel"
    }
    return (
        <ContextMenu content={contextMenu}>
            <div className={panel_class + " d-flex flex-row"} onClick={clickOnMe}
                 id={props._id} style={{marginBottom: 10}}>
                <div className="button-div shrink-expand-div d-flex flex-row">
                    <Shandle dragHandleProps={props.dragHandleProps}/>
                    {!props["am_shrunk"] &&
                        <GlyphButton icon="chevron-down"
                                     handleClick={props.toggleShrink}/>
                    }
                    {props["am_shrunk"] &&
                        <GlyphButton icon="chevron-right"
                                     style={{marginTop: 5}}
                                     handleClick={props.toggleShrink}/>
                    }
                </div>
                <EditableText value={props.header_text}
                              onChange={handleHeaderTextChange}
                              style={{flex: "1 1 0", "overflow": "auto"}}
                              className="console-divider-text"/>
                <div className="button-div d-flex flex-row">
                    <GlyphButton handleClick={props.deleteMe}
                                 intent="danger"
                                 tooltip="Delete this item"
                                 style={{marginLeft: 10, marginRight: 66, minHeight: 0}}
                                 icon="trash"/>
                </div>
            </div>
        </ContextMenu>
    )
}

DividerItem = memo(DividerItem);
