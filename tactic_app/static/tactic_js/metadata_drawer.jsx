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
                    hljs.highlight(str, {language: lang, ignoreIllegals: true}).value +
                    '</code></pre>';
            } catch (__) {
            }
        }
        return '<pre><code class="hljs">' + mdi.utils.escapeHtml(str) + '</code></pre>';
    }
});
mdi.use(markdownItLatex);

import {useState, useEffect, memo, useContext} from "react";
import {Drawer} from "@blueprintjs/core";
import {postAjaxPromise} from "./communication_react";
import {SettingsContext} from "./settings";
import {CombinedMetadata} from "./blueprint_mdata_fields";

export {MetadataDrawer}

function formatLatexEquations(text) {
    const displayRegex = /\$\$(.+?)\$\$/gs;
    text = text.replace(displayRegex, (_, equation) => `\`$${equation}$\``);
    const inlineRegex = /\$(.+?)\$/g;
    text = text.replace(inlineRegex, (_, equation) => `\`$${equation}$\``);

    return text;
}

const drawerStyle = {paddingLeft: 15, paddingRight: 15, paddingBottom: 15, paddingTop: 0};

const icon_dict = {
    collection: "database",
    project: "projects",
    tile: "application",
    list: "list",
    code: "code"
};

function MetadataDrawer(props) {

    const settingsContext = useContext(SettingsContext);

    useEffect(() => {
        //console.log("theme changed")  // This is to force re-rendering because of highlight.js theme change
    }, [settingsContext.settings.theme]);

    return (
        <Drawer
            icon={icon_dict[props.res_type]}
            className={settingsContext.isDark() ? "bp5-dark" : "light-theme"}
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
            <CombinedMetadata expandWidth={true}
                              outer_style={{
                                  marginTop: 0, marginLeft: 0, overflow: "auto", padding: 15,
                                  marginRight: 0, height: "100%"
                              }}
                              res_name={props.res_name}
                              readOnly={props.readOnly}
                              tsocket={props.tsocket}
                              res_type={props.res_type}/>
        </Drawer>
    )
}

MetadataDrawer = memo(MetadataDrawer);
