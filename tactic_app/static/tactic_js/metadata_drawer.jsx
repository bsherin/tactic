
// noinspection TypeScriptUMDGlobal

import React from "react";


import markdownIt from 'markdown-it'
import 'markdown-it-latex/dist/index.css'
import markdownItLatex from 'markdown-it-latex'

import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('javascript', javascript);

import python from 'highlight.js/lib/languages/python';
hljs.registerLanguage('python', python);

const mdi = markdownIt({
    html: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return '<pre><code class="hljs">' +
                   hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                   '</code></pre>';
          } catch (__) {}
        }
        return '<pre><code class="hljs">' + mdi.utils.escapeHtml(str) + '</code></pre>';
    }
});
mdi.use(markdownItLatex);

import {useState, useEffect, memo, useContext} from "react";
import {Drawer} from "@blueprintjs/core";
import {postAjaxPromise} from "./communication_react";
import {ThemeContext} from "./theme";
import {CombinedMetadata} from "./blueprint_mdata_fields";

export {MetadataDrawer}

function formatLatexEquations(text) {
    const displayRegex = /\$\$(.+?)\$\$/gs;
    text = text.replace(displayRegex, (_, equation) => `\`$${equation}$\``);
    const inlineRegex = /\$(.+?)\$/g;
    text = text.replace(inlineRegex, (_, equation) => `\`$${equation}$\``);

    return text;
}

const drawerStyle = {paddingLeft: 15, paddingRight:15, paddingBottom: 15, paddingTop: 0};

const icon_dict = {
  collection: "database",
  project: "projects",
  tile: "application",
  list: "list",
  code: "code"
};

function MetadataDrawer(props) {

    const [allTags, setAllTags] = useState([]);
    const [tags, setTags] = useState(null);
    const [savedTags, setSavedTags] = useState(null);
    const [created, setCreated] = useState(null);
    const [updated, setUpdated] = useState(null);
    const [notes, setNotes] = useState(null);
    const [savedNotes, setSavedNotes] = useState(null);
    const [additionalMdata, setAdditionalMdata] = useState({});

    const theme = useContext(ThemeContext);

    useEffect(() => {
        if (props.show_drawer) {
            if (!props.readOnly) {
                let data_dict = {
                    pane_type: props.res_type,
                    is_repository: false,
                    show_hidden: true
                };
                postAjaxPromise("get_tag_list", data_dict)
                    .then(data => {
                        setAllTags(data.tag_list)
                    })
            }
            postAjaxPromise("grab_metadata", {
                res_type: props.res_type,
                res_name: props.res_name, is_repository: props.is_repository
            })
                .then(data => {
                    setTags(data.tags);
                    setSavedTags(data.tags);
                    setNotes(data.notes);
                    setSavedNotes(data.notes);
                    setCreated(data.datestring);
                    setUpdated(data.additional_mdata.updated);
                    let amdata = data.additional_mdata;
                    delete amdata.updated;
                    setAdditionalMdata(amdata);
                })
                .catch((e) => {
                    console.log("error getting metadata", e)
                })
        }
    }, [props.show_drawer]);

    useEffect(() => {
        console.log("theme changed")  // This is to force re-rendering because of highlight.js theme change
    }, [theme]);

    async function _handleMetadataChange(state_stuff) {
        for (let field in state_stuff) {
            switch (field) {
                case "tags":
                    setTags(state_stuff[field].join(" "));
                    break;
                case "notes":
                    setNotes(state_stuff[field]);
                    break;
            }
        }
        const result_dict = {
            "res_type": props.res_type,
            "res_name": props.res_name,
            "tags": "tags" in state_stuff ? state_stuff["tags"].join(" ") : tags,
            "notes": "notes" in state_stuff ? state_stuff["notes"] : notes
        };
        try {
            await postAjaxPromise("save_metadata", result_dict)
        }
        catch(e) {
            console.log("error saving metadata ", e)
        }
    }

    let split_tags = !tags || tags == "" ? [] : tags.split(" ");

    return (
        <Drawer
            icon={icon_dict[props.res_type]}
            className={theme.dark_theme ? "bp5-dark" : "light-theme"}
            style={drawerStyle}
            title={props.res_name}
            isOpen={props.show_drawer}
            position={props.position}
            canOutsideClickClose={true}
            onClose={props.onClose}
            enforceFocus={true}
            hasBackdrop={false}
            size={props.size}
            >
            <CombinedMetadata tags={split_tags}
                              useTags={true}
                              expandWidth={true}
                                outer_style={{
                                  marginTop: 0, marginLeft: 0, overflow: "auto", padding: 15,
                                  marginRight: 0, height: "100%"
                              }}
                              all_tags={allTags}
                              created={created}
                              updated={updated}
                              notes={notes}
                              useNotes={notes != null}
                              icon={null}
                              readOnly={props.readOnly}
                              handleChange={_handleMetadataChange}
                              additional_metadata={additionalMdata}
                              pane_type={props.res_type}/>
        </Drawer>
    )
}

MetadataDrawer = memo(MetadataDrawer);
