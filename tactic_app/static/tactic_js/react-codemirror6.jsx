import React, {Fragment, useEffect, useRef, memo, useLayoutEffect, useContext} from "react";
import {Button, ButtonGroup} from "@blueprintjs/core";
import {useSize} from "./sizing_tools";
import {propsAreEqual, useStateAndRef} from "./utilities_react";
import {SettingsContext} from "./settings";
import {SelectedPaneContext} from "./utilities_react";
import {ErrorDrawerContext} from "./error_drawer";
import {SearchForm} from "./library_widgets";
import {indentWithTab} from "@codemirror/commands"
import {python} from "@codemirror/lang-python"
import {javascript} from "@codemirror/lang-javascript"
import {markdown} from "@codemirror/lang-markdown"
import {indentUnit} from "@codemirror/language";
import {HighlightStyle, foldAll, unfoldAll} from "@codemirror/language"
import {EditorView, Decoration} from "@codemirror/view";
import {StateField, StateEffect, RangeSetBuilder, EditorSelection, Compartment} from "@codemirror/state";
import {selfCompletionSource, generalCompletionSource, aiCompletionSource, topLevelExtraCompletions, dotAccessCompletions} from "./autocomplete";
import {useDebounce} from "./utilities_react";

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

import { startCompletion } from "@codemirror/autocomplete";

// Custom keymap to trigger autocomplete on Ctrl-/
const triggerAutocompleteKeymap = [
  {
    key: "Alt-/",
    run: (view) => {
      startCompletion(view);
      return true; // ✅ Signal that we handled the key
    },
    preventDefault: true // ✅ Block browser/OS from inserting +
  }
];

import {themeList, importTheme} from "./theme_support";
import {postPromise} from "./communication_react";

export {ReactCodemirror6};

const SEARCH_HEIGHT = 55;
const REGEXTYPE = Object.getPrototypeOf(new RegExp("that"));
const TITLE_STYLE = {display: "flex", paddingLeft: 5, paddingBottom: 2, alignItems: "self-end"};

function emptyExtension() {
    return []
}

const mode_dict = {python, javascript, markdown, text: emptyExtension};

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

function createHighlightDeco(view, regex, current_search_number) {
    let counter = 0;
    const builder = new RangeSetBuilder();
    let text = view.state.doc.toString();
    let match;
    while ((match = regex.exec(text)) !== null) {
        const start = match.index;
        const end = start + match[0].length;
        if (current_search_number != null && counter === current_search_number) {
            builder.add(start, end, Decoration.mark({class: "cm-searchMatch cm-searchMatch-selected"}));
        } else {
            builder.add(start, end, Decoration.mark({class: "cm-searchMatch"}));
        }
        counter += 1;
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
        code_container_height: null,
        code_container_width: null,
        search_term: null,
        update_search_state: null,
        alt_clear_selections: null,
        regex_search: false,
        handleChange: null,
        handleBlur: null,
        handleFocus: null,
        mode: "python",
        readOnly: false,
        extraKeys: [],
        setCMObject: null,
        code_container_ref: null,
        setSearchMatches: null,
        current_search_number: null,
        highlight_active_line: false,
        extraSelfCompletions: [],
        controlled: false,
        container_id: null,
        ...props
    };

    const localRef = useRef(null);
    const editorView = useRef(null);
    const overlay = useRef(null);
    const matches = useRef(null);
    const search_focus_info = useRef(null);
    const first_render = useRef(true);
    const registeredHandlers = useRef([]);
    const themeCompartment = useRef(null);
    const completionCompartment = useRef(null);
    const lineNumberCompartment = useRef(null);
    const readOnlyCompartment = useRef(new Compartment());
    const readOnlyRef = useRef(props.readOnly);
    const theme = useRef(null);
    const highlightStyle = useRef(null);
    const autocompletionArgRef = useRef({});

    const [aiText, setAIText, aiTextRef] = useStateAndRef(null);
    const [aiTextLable, setAITextLabel, aiTextLabelRef] = useStateAndRef(null);
    const [ai_waiting, doAIUpdate] = useDebounce(getAIUpdate, 2000);

    const settingsContext = useContext(SettingsContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);

    const [usable_width, usable_height, topX, topY] = useSize(localRef, props.iCounter, "CodeMirror");

    const getExtensions = () => {
        let extensions = [
                mode_dict[props.mode](),
                //lineNumberCompartment.current.of(customLineNumbers(props.first_line_number)),
                themeCompartment.current.of([]),
                history(),
                //activeLineExtension(),
                highlightSpecialChars(),
                history(),
                //foldGutter(),
                drawSelection(),
                dropCursor(),
                EditorState.allowMultipleSelections.of(true),
                indentOnInput(),
                bracketMatching(),
                closeBrackets(),
                completionCompartment.current.of(autocompletion(autocompletionArgRef.current)),
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
                    indentWithTab,
                    ...triggerAutocompleteKeymap
                ]),
                readOnlyCompartment.current.of(EditorState.readOnly.of(props.readOnly)),
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        handleChange(update.state.doc.toString());
                        if (window.has_openapi_key && (settingsContext.settingsRef.current.use_ai_code_suggestions == "yes") && props.container_id) {
                            doAIUpdate(update.state.doc.toString())
                        }
                        else {
                            setAIText(null);
                            setAITextLabel(null);
                        }
                    }
                    if (update.focusChanged) {
                        if (update.view.hasFocus) {
                            handleFocus();
                        } else {
                            handleBlur();
                        }
                    }
                }),
            ];
        if (props.show_line_numbers) {
            extensions = extensions.concat([
                    lineNumberCompartment.current.of(customLineNumbers(props.first_line_number)),
                    foldGutter()
                ]
            );
        }
        if (props.highlight_active_line) {
            extensions.push(highlightActiveLineGutter());
        }
        return extensions
    };

    useEffect(() => {
        if (props.registerSetFocusFunc) {
            props.registerSetFocusFunc(setFocus);
        }
        themeCompartment.current = new Compartment();
        completionCompartment.current = new Compartment();
        lineNumberCompartment.current = new Compartment();

        //const activeLineExtension = props.highlight_active_line ? highlightActiveLineGutter : emptyExtension;

        const state = EditorState.create({
            doc: props.code_content,
            extensions: getExtensions()
        });
        editorView.current = new EditorView({
            state,
            parent: localRef.current
        });
        if (props.setCMObject != null) {
            props.setCMObject(editorView.current);
        }
        return () => {
            if (editorView.current) {
                editorView.current.destroy();
                editorView.current = null;
            }
        };

    }, []);

    useEffect(() => {
        if (editorView.current) {
            editorView.current.dispatch({
                effects: readOnlyCompartment.current.reconfigure(EditorState.readOnly.of(props.readOnly))
            });
            readOnlyRef.current = props.readOnly;
        }
    }, [props.readOnly]);

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

    useEffect(()=>{
        autocompletionArgRef.current =
            {
                optionClass: (completion) => {return completion.type === "suggestion" ? "cm-completion-ai" : null},
                override: [
                    aiCompletionSource(aiTextRef.current, aiTextLabelRef.current),
                    selfCompletionSource(props.extraSelfCompletions),
                    topLevelExtraCompletions,
                    dotAccessCompletions,
                    generalCompletionSource(props.mode),
                ],
                closeOnBlur: false
            };
        if (editorView.current) {
            editorView.current.dispatch({
                effects: completionCompartment.current.reconfigure(autocompletion(autocompletionArgRef.current))
            });
        }
    }, [props.extraSelfCompletions, aiText]);

    useEffect(() =>{
        // This controlled stuff never quite worked perfectly inside the CombinedMetadata notes field..
        if (props.controlled) {
            if (editorView.current) {
                const docLength = editorView.current.state.doc.length;
                const anchor = Math.min(editorView.current.state.selection.main.anchor, docLength);
                const head = Math.min(editorView.current.state.selection.main.head, docLength);
                const transaction = editorView.current.state.update({
                    changes: {from: 0, to: docLength, insert: props.code_content},
                    selection: {anchor, head}
                });
                editorView.current.dispatch(transaction);
            }
        }

    }, [props.code_content]);

    useEffect(() => {
        if (!editorView.current) return;
        switchTheme(_current_codemirror_theme());

    }, [settingsContext.settings.theme, settingsContext.settings.preferred_dark_theme, settingsContext.settings.preferred_light_theme]);

    useEffect(()=> {
        if (editorView.current && props.show_line_numbers) {
            editorView.current.dispatch({
                effects: lineNumberCompartment.current.reconfigure(customLineNumbers(props.first_line_number))
            })
        }
    }, [props.first_line_number]);

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
    }, [props.search_term, props.current_search_number, props.regex_search]);

    const selectedPane = useContext(SelectedPaneContext);

    function getAIUpdate(new_code) {
        let code_str = new_code;
        const cursorPos = editorView.current.state.selection.main.head;
        postPromise(props.container_id, "update_ai_complete", {"code_str": code_str, "mode": props.mode, "cursor_position": cursorPos})
            .then((data) => {
                console.log("got aiupdate result");
                if (data.success) {
                    setAIText(data.suggestion);
                    setAITextLabel(data.display_label)
                }
                else {
                    setAIText(null);
                    setAITextLabel(null);
                }
            })
            .catch((e) => {
                setAIText(null);
                setAITextLabel(null);
            })
    }

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
        if (!readOnlyRef.current && props.handleBlur) {
            props.handleBlur(editorView.current.state.doc.toString());
        }
    }

    function handleFocus() {
        if (props.handleFocus) {
            props.handleFocus();
        }
    }

    function _searchMatcher(term, global = false, ignore_case = true) {
        let regex;
        let flags = "";
        if (global) {
            flags += "g"
        }
        if (ignore_case) {
            flags += "i"
        }
        try {
            if (!props.regex_search) {
                // Escape special characters for literal search
                const escapedSearchTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                regex = new RegExp(escapedSearchTerm, flags);
            } else {
                try {
                    regex = new RegExp(term, flags)
                } catch (e) {
                    console.log("Error creating regex, trying escaping");
                    const escapedSearchTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    regex = new RegExp(escapedSearchTerm, flags);
                }
                return regex
            }
        } catch (e) {
            console.log("Error creating regex", e);
            return null
        }
        return regex
    }

    function _lineNumberFromSearchNumber(matcher, current_search_number) {
        try {
            let lines = props.code_content.split("\n");
            let lnum = 1;
            let mnum = 0;
            for (let line of lines) {
                let new_matches = (line.match(matcher) || []).length;
                if (new_matches + mnum - 1 >= current_search_number) {
                    return {line: lnum, match: current_search_number - mnum};
                }
                mnum += new_matches;
                lnum += 1
            }
        } catch (e) {
            console.log("Error in _lineNumberFromSearchNumber", e);
        }
        return null
    }


    function _doHighlight() {
        try {
            if (!editorView.current) return;
            let prev_matches = matches.current;
            var searchTerm = props.search_term;
            if (!searchTerm) {
                searchTerm = ""
            }

            var reg = _searchMatcher(searchTerm, true);
            if (!reg) {
                matches.current = 0
            } else {
                matches.current = countOccurrences(reg, props.code_content);
            }
            if (props.setSearchMatches && matches.current != prev_matches) {
                props.setSearchMatches(matches.current)
            }
            if (!reg || searchTerm === "") {
                editorView.current.dispatch({
                    effects: setHighlights.of(Decoration.none)
                });
            } else {
                const current_search_number = props.current_search_number ? props.current_search_number : 0;
                let line_info = _lineNumberFromSearchNumber(reg, current_search_number);
                if (line_info) {
                    _scrollToAndSelectLine(line_info.line);
                }
                const deco = createHighlightDeco(editorView.current, reg,
                    props.current_search_number);
                editorView.current.dispatch({
                    effects: setHighlights.of(deco)
                });
            }
        } catch (e) {
            console.log("Error in _doHighlight", e);
        }
    }

    function _scrollToAndSelectLine(lineNumber) {
        try {
            const line = editorView.current.state.doc.line(lineNumber);
            editorView.current.dispatch({
                selection: EditorSelection.single(line.from, line.to),
                effects: EditorView.scrollIntoView(line.from, {
                    y: "center"
                })
            });
        } catch (e) {
            console.log("Error in selectLine", e)
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
