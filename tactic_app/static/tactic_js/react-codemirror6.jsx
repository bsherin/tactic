import React, {Fragment, useEffect, useRef, memo, useLayoutEffect, useContext} from "react";
import {Button, ButtonGroup} from "@blueprintjs/core";
import {useSize} from "./sizing_tools";
import {propsAreEqual} from "./utilities_react";
import {SettingsContext} from "./settings";
import {SelectedPaneContext} from "./utilities_react";
import {ErrorDrawerContext} from "./error_drawer";
import {SearchForm} from "./library_widgets";

import {indentWithTab} from "@codemirror/commands"
import {Compartment} from "@codemirror/state"
import {python} from "@codemirror/lang-python"
import {javascript} from "@codemirror/lang-javascript"
import {markdown} from "@codemirror/lang-markdown"
import {indentUnit} from "@codemirror/language";
import {HighlightStyle, foldAll, unfoldAll} from "@codemirror/language"
import {EditorView, Decoration} from "@codemirror/view";
import {StateField, StateEffect, RangeSetBuilder} from "@codemirror/state";

import {
    gutter, GutterMarker, highlightActiveLineGutter, highlightSpecialChars, drawSelection,
    dropCursor, rectangularSelection, crosshairCursor, keymap
} from '@codemirror/view';

export {EditorView} from '@codemirror/view';
import {EditorState} from '@codemirror/state';
import {foldGutter, indentOnInput, syntaxHighlighting, bracketMatching, foldKeymap} from '@codemirror/language';
import {history, defaultKeymap, historyKeymap} from '@codemirror/commands';
import {highlightSelectionMatches} from '@codemirror/search';
import {closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap} from '@codemirror/autocomplete';
import {lintKeymap} from '@codemirror/lint';

import {themeList, importTheme} from "./theme_support";

export {ReactCodemirror6};

const SEARCH_HEIGHT = 55;
const REGEXTYPE = Object.getPrototypeOf(new RegExp("that"));
const TITLE_STYLE = {display: "flex", paddingLeft: 5, paddingBottom: 2, alignItems: "self-end"};

function textMode() {
    return []
}

const mode_dict = {python, javascript, markdown, text: textMode};

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

function createHighlightDeco(view, searchTerm, current_search_number, literal = false) {
    const builder = new RangeSetBuilder();
    let regex;
    if (literal) {
        // Escape special characters for literal search
        const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        regex = new RegExp(escapedSearchTerm, "gi");
    } else {
        regex = new RegExp(searchTerm, "gi");
    }
    let counter = 0;
    for (let {from, to} of view.visibleRanges) {
        const text = view.state.doc.sliceString(from, to);
        let match;
        while ((match = regex.exec(text)) !== null) {
            const start = from + match.index;
            const end = start + match[0].length;
            if (current_search_number != null && counter === current_search_number) {
                builder.add(start, end, Decoration.mark({class: "cm-searchMatch cm-searchMatch-selected"}));
            }
            else {
                builder.add(start, end, Decoration.mark({class: "cm-searchMatch"}));
            }
            counter += 1;
        }
    }
    return builder.finish()
}

const setHighlights = StateEffect.define();
const highlightField = StateField.define({
    create() {
        return Decoration.none;
    },
    update(highlights, tr) {
        highlights = highlights.map(tr.changes);
        for (let e of tr.effects) {
            if (e.is(setHighlights)) {
                highlights = e.value;
            }
        }
        return highlights;
    },
    provide: f => EditorView.decorations.from(f)
});

function customLineNumbers(startLine = 1) {
    return gutter({
        class: "cm-lineNumbers",
        renderEmptyElements: false,
        lineMarker: (view, line) => {
            const lineNumber = startLine + view.state.doc.lineAt(line.from).number - 1;
            return new class extends GutterMarker {
                toDOM() {
                    return document.createTextNode(lineNumber);
                }
            };
        }
    });
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
        extraKeys: [],
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
    const themeCompartment = useRef(null);
    const theme = useRef(null);
    const highlightStyle = useRef(null);

    const settingsContext = useContext(SettingsContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);

    const [usable_width, usable_height, topX, topY] = useSize(localRef, props.iCounter, "CodeMirror");

    useEffect(() => {
        prevSoftWrap.current = props.soft_wrap;
        if (props.registerSetFocusFunc) {
            props.registerSetFocusFunc(setFocus);
        }
        themeCompartment.current = new Compartment();
        const state = EditorState.create({
            doc: props.code_content,
            extensions: [
                // lineNumbers(),
                mode_dict[props.mode](),
                customLineNumbers(props.first_line_number),
                themeCompartment.current.of([]),
                history(),
                highlightActiveLineGutter(),
                highlightSpecialChars(),
                history(),
                foldGutter(),
                drawSelection(),
                dropCursor(),
                EditorState.allowMultipleSelections.of(true),
                indentOnInput(),
                bracketMatching(),
                closeBrackets(),
                autocompletion(),
                rectangularSelection(),
                crosshairCursor(),
                highlightSelectionMatches(),
                indentUnit.of("    "),
                highlightField.init(),
                keymap.of([
                    ...props.extraKeys,
                    ...closeBracketsKeymap,
                    ...defaultKeymap,
                    ...historyKeymap,
                    ...foldKeymap,
                    ...completionKeymap,
                    ...lintKeymap,
                    indentWithTab
                ]),
                // keymap.of([standardKeymap, indentWithTab]),
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        handleChange(update.state.doc.toString());
                    }
                    if (update.focusChanged) {
                        if (update.view.hasFocus) {
                            handleFocus();
                        } else {
                            handleBlur();
                        }
                    }
                }),
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

    const switchTheme = (themeName) => {
        if (!(themeList.includes(themeName))) {
            themeName = "one_dark";
        }
        importTheme(themeName, settingsContext.settingsRef.current.theme)
            .then(theTheme => {
                theme.current = EditorView.theme(theTheme[0]);
                highlightStyle.current = HighlightStyle.define(theTheme[1]);
                if (editorView.current) {
                    editorView.current.dispatch({
                        effects: themeCompartment.current.reconfigure([theme.current,
                            syntaxHighlighting(highlightStyle.current)])
                    });
                }
            })
            .catch(error => {
                console.log("Error importing theme", error);
            })
    };

    useEffect(() => {
        if (!editorView.current) return;
        switchTheme(_current_codemirror_theme());

    }, [settingsContext.settings.theme, settingsContext.settings.preferred_dark_theme, settingsContext.settings.preferred_light_theme]);

    function _current_codemirror_theme() {
        return isDark() ? settingsContext.settingsRef.current.preferred_dark_theme :
            settingsContext.settingsRef.current.preferred_light_theme;
    }

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

    const selectedPane = useContext(SelectedPaneContext);

    function isDark() {
        return settingsContext.settingsRef.current.theme === "dark";
    }

    function setFocus() {
        if (editorView.current) {
            editorView.current.focus();
            editorView.current.dispatch({
                selection: {anchor: 0, head: 0}
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

    function _searchMatcher(term, global = false) {
        let matcher;
        if (props.regex_search) {
            try {
                matcher = global ? new RegExp(term, "g") : new RegExp(term)
            } catch (e) {
                matcher = term
            }
        } else {
            matcher = term
        }
        return matcher
    }

    function _lineNumberFromSearchNumber(current_search_number) {
        let lines = props.code_content.split("\n");
        let lnum = 1;
        let mnum = 0;
        let matcher = _searchMatcher(props.search_term);
        for (let line of lines) {
            let new_matches = (line.match(matcher) || []).length;
            if (new_matches + mnum - 1 >= current_search_number) {
                return {line: lnum, match: current_search_number - mnum};
            }
            mnum += new_matches;
            lnum += 1
        }
        return null
    }


    function _doHighlight() {
        if (!editorView.current) return;
        let prev_matches = matches.current;
        var searchTerm = props.search_term;
        if (!searchTerm) {
            searchTerm = ""
        }
        var reg = _searchMatcher(searchTerm, true);
        matches.current = countOccurrences(reg, props.code_content);
        if (props.setSearchMatches && matches.current != prev_matches) {
            props.setSearchMatches(matches.current)
        }
        if (searchTerm === "") {
            editorView.current.dispatch({
                effects: setHighlights.of(Decoration.none)
            });
        } else {
            const current_search_number = props.current_search_number ? props.current_search_number : 0;
            let line_info = _lineNumberFromSearchNumber(current_search_number);
            if (line_info) {
                scrollToLine(line_info.line);
            }
            const deco = createHighlightDeco(editorView.current, searchTerm,
                props.current_search_number, !props.regex_search);
            editorView.current.dispatch({
                effects: setHighlights.of(deco)
            });
        }
    }

    function scrollToLine(lineNumber) {
        const line = editorView.current.state.doc.line(lineNumber);
        editorView.current.dispatch({
            effects: EditorView.scrollIntoView(line.from, {
                y: "center"  // Center the line in the view
            })
        });
    }

    function _foldAll() {
        foldAll(editorView.current);
    }

    function _unfoldAll() {
        unfoldAll(editorView.current);
    }

    function clearSelections() {
        if (props.alt_clear_selections) {
            props.alt_clear_selections();
        } else {
            const {to} = editorView.current.state.selection.main;
            editorView.current.dispatch({
                selection: {anchor: to, head: to}
            });
        }
        if (props.update_search_state) {
            props.update_search_state({search_string: ""});
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
                    width: "100%",
                    marginTop: 5,
                    height: SEARCH_HEIGHT,
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
