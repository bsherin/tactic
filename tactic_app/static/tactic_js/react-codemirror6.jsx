import React, { Fragment, useEffect, useRef, memo, useLayoutEffect, useContext } from "react";
import { Button, ButtonGroup } from "@blueprintjs/core";
import { Helmet } from 'react-helmet';
import { useSize } from "./sizing_tools";
import { propsAreEqual } from "./utilities_react";
import { SettingsContext } from "./settings";
import { SelectedPaneContext } from "./utilities_react";
import { ErrorDrawerContext } from "./error_drawer";
import { SearchForm } from "./library_widgets";

import {basicSetup, EditorView} from "codemirror"
import {Compartment, EditorState} from "@codemirror/state"
import {python} from "@codemirror/lang-python"
import {syntaxHighlighting, foldKeymap} from "@codemirror/language"
import {StateEffect} from "@codemirror/state";
// import { matchBrackets, closeBrackets } from "@codemirror/matchbrackets";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { oneDark, oneDarkTheme, oneDarkHighlightStyle } from "@codemirror/theme-one-dark";
//import { dracula } from "mirrorthemes";



export { ReactCodemirror6 };

const REGEXTYPE = Object.getPrototypeOf(new RegExp("that"));
const TITLE_STYLE = { display: "flex", paddingLeft: 5, paddingBottom: 2, alignItems: "self-end" };

function isRegex(ob) {
    return Object.getPrototypeOf(ob) === REGEXTYPE;
}

function countOccurrences(query, the_text) {
    if (isRegex(query)) {
        const split_text = the_text.split(/\r?\n/);
        let total = 0;
        for (let str of split_text) {
            total += (str.match(query) || []).length;
        }
        return total;
    } else {
        return the_text.split(query).length - 1;
    }
}

function ReactCodemirror6(props) {
    props = {
        iCounter: 0,
        no_width: false,
        no_height: false,
        show_search: false,
        first_line_number: 1,
        show_line_numbers: true,
        show_fold_button: false,
        soft_wrap: false,
        code_container_height: null,
        code_container_width: null,
        search_term: null,
        update_search_state: null,
        alt_clear_selections: null,
        regex_search: false,
        handleChange: null,
        handleBlur: null,
        handleFocus: null,
        sync_to_prop: false,
        force_sync_to_prop: false,
        clear_force_sync: null,
        mode: "python",
        readOnly: false,
        extraKeys: {},
        setCMObject: null,
        code_container_ref: null,
        setSearchMatches: null,
        current_search_number: null,
        extra_autocomplete_list: [],
        ...props
    };

    const localRef = useRef(null);
    const editorView = useRef(null);
    const overlay = useRef(null);
    const matches = useRef(null);
    const search_focus_info = useRef(null);
    const first_render = useRef(true);
    const prevSoftWrap = useRef(null);
    const registeredHandlers = useRef([]);
    const editorThemeRef = useRef(null);
    const themeCompartment = useRef(null);

    const settingsContext = useContext(SettingsContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);


    const [usable_width, usable_height, topX, topY] = useSize(localRef, props.iCounter, "CodeMirror");

    useEffect(() => {
        prevSoftWrap.current = props.soft_wrap;
        if (props.registerSetFocusFunc) {
            props.registerSetFocusFunc(setFocus);
        }
        editorThemeRef.current = settingsContext.settingsRef.current.theme;
        themeCompartment.current = new Compartment();
        const state = EditorState.create({
            doc: props.code_content,
            extensions: [
                basicSetup,
                python(),
                oneDarkTheme,
                syntaxHighlighting(oneDarkHighlightStyle)
               //themeCompartment.current.of(oneDark)
            ]
        });
        editorView.current = new EditorView({
            state,
            parent: localRef.current
        });
        if (props.setCMObject != null) {
            props.setCMObject(editorView.current);
        }
    }, []);

    useEffect(() => {
        // if (!editorView.current) return;
        //
        // const newTheme = isDark() ? dracula : EditorView.theme({});
        //
        // editorView.current.dispatch({
        //     effects: editorThemeRef.current.reconfigure.of(newTheme)
        // });
    }, [settingsContext.settings.theme, settingsContext.settings.preferred_dark_theme, settingsContext.settings.preferred_light_theme]);

    useLayoutEffect(() => {
        return () => {
            if (editorView.current) {
                editorView.current.destroy();
                editorView.current = null;
            }
        };
    }, []);

    useEffect(() => {
        _doHighlight();
    }, [props.search_term, props.current_search_number]);

    // useEffect(() => {
    //     if (!editorView.current) return;
    //
    //     const extensions = props.soft_wrap ? [EditorView.lineWrapping] : [];
    //
    //     editorView.current.dispatch({
    //         effects: StateEffect.reconfigure.of(extensions)
    //     });
    //
    //     prevSoftWrap.current = props.soft_wrap;
    // }, [props.soft_wrap]);

    const selectedPane = useContext(SelectedPaneContext);

    function isDark() {
        return settingsContext.settingsRef.current.theme === "dark";
    }

    function setFocus() {
        if (editorView.current) {
            editorView.current.focus();
            editorView.current.dispatch({
                selection: { anchor: 0, head: 0 }
            });
        }
    }

    function handleChange(value) {
        if (props.handleChange) {
            props.handleChange(value);
        }
    }

    function handleBlur() {
        if (props.handleBlur) {
            props.handleBlur(editorView.current.state.doc.toString());
        }
    }

    function handleFocus() {
        if (props.handleFocus) {
            props.handleFocus();
        }
    }

    function _doHighlight() {
        if (!editorView.current) return;

        if (props.search_term == null || props.search_term === "") {
            // Remove any previous highlights
        } else {
            // Add highlights based on props.search_term
        }
    }

    function searchCM() {
        // Code for opening search in CodeMirror 6
    }

    function _foldAll() {
        editorView.current.dispatch({
            effects: StateEffect.reconfigure.of(foldKeymap.foldAll)
        });
    }

    function _unfoldAll() {
        editorView.current.dispatch({
            effects: StateEffect.reconfigure.of(foldKeymap.unfoldAll)
        });
    }

    function clearSelections() {
        if (props.alt_clear_selections) {
            props.alt_clear_selections();
        } else {
            const { to } = editorView.current.state.selection.main;
            editorView.current.dispatch({
                selection: { anchor: to, head: to }
            });
        }
        if (props.update_search_state) {
            props.update_search_state({ search_string: "" });
        }
    }

    function set_keymap() {
        if (selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef)) {
            // Add escape key handling if needed
        } else {
            // Remove escape key handling if needed
        }
    }

    let ccstyle = {
        lineHeight: "21px",
    };
    if (!props.no_height) {
        ccstyle.height = usable_height;
    }

    if (!props.no_width) {
        ccstyle.width = usable_width;
    }

    let bgstyle = null;
    if (props.show_fold_button) {
        if (usable_width > 175) {
            bgstyle = {
                position: "fixed",
                left: topX + usable_width - 135 - 15,
                top: topY + usable_height - 35,
                zIndex: 1
            };
            if (first_render.current) {
                bgstyle.top -= 10;
                first_render.current = false;
            }
        }
    }
    const tTheme = settingsContext.settingsRef.current.theme;
    if (props.show_search) {
        let title_label = props.title_label ? props.title_label : "";
        return (
            <Fragment>
                <div style={{
                    display: "flex", flexDirection: "row", justifyContent: "space-between",
                    marginRight: 10,
                    width: "100%"
                }}>
                    <span className="bp5-ui-text"
                          style={{
                              display: "flex",
                              paddingLeft: 5,
                              paddingBottom: 2,
                              alignItems: "self-end"
                          }}>{title_label}</span>
                    <SearchForm update_search_state={props.updateSearchState}
                                search_string={props.search_term}
                                regex={props.regex_search}
                                allow_regex={true}
                                field_width={200}
                                include_search_jumper={true}
                                searchPrev={props.searchPrev}
                                searchNext={props.searchNext}
                                search_ref={props.search_ref}
                                number_matches={props.search_matches}
                    />
                </div>
                {props.show_fold_button && bgstyle &&
                    <ButtonGroup minimal={false} style={bgstyle}>
                        <Button small={true} icon="collapse-all" text="fold" onClick={_foldAll}/>
                        <Button small={true} icon="expand-all" text="unfold" onClick={_unfoldAll}/>
                    </ButtonGroup>
                }
                <div className="code-container" style={ccstyle} ref={localRef}></div>
            </Fragment>
        );
    }

    return (
        <Fragment>
            {props.show_fold_button && bgstyle &&
                <ButtonGroup minimal={false} style={bgstyle}>
                    <Button small={true} icon="collapse-all" text="fold" onClick={_foldAll}/>
                    <Button small={true} icon="expand-all" text="unfold" onClick={_unfoldAll}/>
                </ButtonGroup>
            }
            {props.title_label &&
                <span className="bp5-ui-text"
                      style={TITLE_STYLE}>{props.title_label}</span>
            }
            <div className="code-container" style={ccstyle} ref={localRef}></div>
        </Fragment>
    );
}

ReactCodemirror6 = memo(ReactCodemirror6, (prevProps, newProps) => {
    propsAreEqual(prevProps, newProps, ["extraKeys"]);
});
