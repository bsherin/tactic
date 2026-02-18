import React, {Fragment, useEffect, useRef, memo, useContext, useCallback} from "react";
import {Button, ButtonGroup} from "@blueprintjs/core";
import {propsAreEqual, useStateAndRef} from "./utilities_react";
import {SettingsContext} from "./settings";
import {SearchForm} from "./library_widgets";
import {indentWithTab, indentLess} from "@codemirror/commands"
import {python} from "@codemirror/lang-python"
import {javascript} from "@codemirror/lang-javascript"
import {markdown} from "@codemirror/lang-markdown"
import {indentUnit} from "@codemirror/language";
import {HighlightStyle, foldAll, unfoldAll} from "@codemirror/language"
import {EditorView, Decoration, ViewPlugin} from "@codemirror/view";
import {useSocketListener} from "./tactic_socket";
import {
    StateField,
    StateEffect,
    RangeSetBuilder,
    EditorSelection,
    Compartment,
    EditorState,
} from "@codemirror/state";
import {
    selfCompletionSource, generalCompletionSource,
    topLevelExtraCompletions, dotAccessCompletions
} from "./autocomplete";

import {
    ghostTextField, ghostTextPlugin,
    acceptGhostText, setGhostText, computeGhostSuffix
} from "./ghost_text";
import {useDebounce, guid} from "./utilities_react";

import {
    gutter, GutterMarker, highlightActiveLineGutter, highlightSpecialChars, drawSelection,
    dropCursor, rectangularSelection, crosshairCursor, keymap
} from '@codemirror/view';

export {EditorView} from '@codemirror/view';
import {foldGutter, indentOnInput, syntaxHighlighting, bracketMatching, foldKeymap} from '@codemirror/language';
import {history, defaultKeymap, historyKeymap, insertNewlineAndIndent} from '@codemirror/commands';
import {highlightSelectionMatches} from '@codemirror/search';
import {
    closeBrackets,
    autocompletion,
    closeBracketsKeymap,
    completionKeymap,
    acceptCompletion,
    completionStatus,
    closeCompletion
} from '@codemirror/autocomplete';

import {startCompletion} from "@codemirror/autocomplete";
import {themeList, importTheme} from "./theme_support";
import {postPromise} from "./communication_react";

export {ReactCodemirror6};

const SEARCH_HEIGHT = 55;
const REGEXTYPE = Object.getPrototypeOf(new RegExp("that"));

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
                // noinspection JSUnusedGlobalSymbols
                toDOM() {
                    return document.createTextNode(lineNumber);
                }
            };
        }
    });
}

const enterInsertsNewlineOnly = {
    key: "Enter",
    run: (view) => {
        if (completionStatus(view.state) === "active") {
            // If menu is active, explicitly do not accept completion
            return insertNewlineAndIndent(view);
        }
        return insertNewlineAndIndent(view);
    },
    preventDefault: true
};

const triggerAutocompleteKeymap = [
    {
        key: "Alt-/",
        run: (view) => {
            startCompletion(view);
            return true; // Signal that we handled the key
        },
        preventDefault: true // Block browser/OS from inserting
    }
];

const tabAcceptKeymap = [
    {
        key: "Tab",
        run: (view) => {
            if (acceptGhostText(view)) {
                return true;
            }
            const status = completionStatus(view.state);
            if (status === "active") {
                return acceptCompletion(view);
            }
            return indentWithTab.run(view);
        },
        preventDefault: true
    },
    {
        key: "Shift-Tab",
        run: indentLess,
        preventDefault: true
    },
];

function restrictEditsToRange(editableRanges = []) {
    return EditorState.transactionFilter.of(tr => {
        if (tr.annotation(ExternalUpdate)) {
            // Allow external (controlled) updates unconditionally
            return tr;
        }
        let blocked = false;

        tr.changes.iterChanges((fromA, toA) => {
            const overlap = editableRanges.some(region => {
                return fromA >= region.from && toA <= region.to;
            });
            if (!overlap) blocked = true;
        });

        return blocked ? [] : tr;
    });
}

function highlightEditableRanges(ranges) {
    // noinspection JSUnusedGlobalSymbols,JSUnresolvedReference
    return ViewPlugin.fromClass(class {
        constructor(view) {
            this.decorations = this.buildDecorations(view);
        }

        update(update) {
            if (update.docChanged || update.viewportChanged) {
                this.decorations = this.buildDecorations(update.view);
            }
        }

        buildDecorations() {
            const builder = new RangeSetBuilder();
            for (let {from, to} of ranges) {
                builder.add(from, to, Decoration.mark({class: "cm-editable"}));
            }
            return builder.finish();
        }

        destroy() {
        }

    }, {
        decorations: v => v.decorations
    });
}

import {Annotation} from "@codemirror/state";

const ExternalUpdate = Annotation.define();

const customCompletionKeymap = completionKeymap.filter(binding => binding.key !== "Enter");
const strippedDefaultKeymap = defaultKeymap.filter(k => k.key !== "Enter");

function ReactCodemirror6(props) {
    props = {
        no_width: false,
        no_height: false,
        flex_size: false,
        show_search: false,
        search_term: null,
        setSearchMatches: null,
        current_search_number: null,
        update_search_state: null,
        first_line_number: 1,
        show_line_numbers: true,
        show_fold_button: false,
        handleChange: null,
        handleBlur: null,
        handleFocus: null,
        mode: "python",
        readOnly: false,
        extraKeys: [],
        setCMObject: null,
        highlight_active_line: false,
        extraSelfCompletions: [],
        controlled: false,
        local_id: null,
        className: "",
        restrict_edits_to_range: false,
        getEditableRanges: null,
        parentService: null,
        ...props
    };

    const localRef = useRef(null);
    const containerNodeRef = useRef(null);
    const editorView = useRef(null);
    const matches = useRef(null);
    const themeCompartment = useRef(null);
    const completionCompartment = useRef(null);
    const lineNumberCompartment = useRef(null);
    const readOnlyCompartment = useRef(new Compartment());
    const restrictCompartment = useRef(new Compartment());
    const readOnlyRef = useRef(props.readOnly);
    const theme = useRef(null);
    const highlightStyle = useRef(null);
    const autocompletionArgRef = useRef({});
    const cmUniqueId = useRef(null)

    const lastUserDocRef = useRef(props.code_content);

    const changeCounterRef = useRef(0);
    const activeStreamChangeCounterRef = useRef(null);

    const activeStreamCursorPosRef = useRef(null);
    const cursorCounterRef = useRef(0);
    const activeStreamCursorCounterRef = useRef(null);

    // Pause flag (Escape/blur). When true, don't request or render suggestions.
    const aiPausedRef = useRef(false);

    const [, setAIText, aiTextRef] = useStateAndRef(null);
    const [, doAIUpdate] = useDebounce(getAIUpdate, 2000);

    const settingsContext = useContext(SettingsContext);

    useEffect(() => {
        cmUniqueId.current = guid();
        if (props.registerSetFocusFunc) {
            props.registerSetFocusFunc(setFocus);
        }
        themeCompartment.current = new Compartment();
        completionCompartment.current = new Compartment();
        lineNumberCompartment.current = new Compartment();

        const updateListener = EditorView.updateListener.of((update) => {
            // If the cursor/selection moves, any in-flight suggestion is now stale.
            if (update.selectionSet && !update.docChanged) {
                const hasSelection = update.state.selection.ranges.some(r => !r.empty);

                // Cursor move unpauses after Escape (but selection still suppresses)
                if (!hasSelection) {
                    aiPausedRef.current = false;
                }

                // Cancel any active stream so we don't show ghost text for an old location.
                activeStreamChangeCounterRef.current = null;
                activeStreamCursorPosRef.current = null;
                activeStreamCursorCounterRef.current = null;

                setAIText(null);
                if (editorView.current) {
                    try {
                        setGhostText(editorView.current, "");
                    } catch (e) {
                    }
                }
            }
            if (update.docChanged) {
                // Detect whether this change came from an external update
                const isExternal = update.transactions.some(tr => tr.annotation(ExternalUpdate));

                const newDoc = update.state.doc.toString();
                closeCompletion(update.view);

                // Keep range restrictions up to date for *all* changes
                if (props.restrict_edits_to_range) {
                    const ranges = props.getEditableRanges(newDoc);
                    update.view.dispatch({
                        effects: restrictCompartment.current.reconfigure([
                            restrictEditsToRange(ranges),
                            highlightEditableRanges(ranges)
                        ])
                    });
                }
                lastUserDocRef.current = newDoc;
                handleChange(newDoc, isExternal);
                changeCounterRef.current = changeCounterRef.current + 1;

                aiPausedRef.current = false;

                const hasSelection = update.state.selection.ranges.some(r => !r.empty);

                if (
                    window.has_openapi_key &&
                    props.parentService &&
                    (settingsContext.settingsRef.current["use_ai_code_suggestions"] == "yes") &&
                    props.local_id &&
                    !aiPausedRef.current &&
                    !hasSelection
                ) {
                    setAIText(null);
                    if (editorView.current) setGhostText(editorView.current, "");
                    doAIUpdate(newDoc);
                } else {
                    setAIText(null);
                    if (editorView.current) {
                        try {
                            setGhostText(editorView.current, "");
                        } catch (e) {
                        }
                    }
                }

                //  Only treat as "user change" if it wasn't an ExternalUpdate
                if (!isExternal) {

                }
            }

            if (update.focusChanged) {
                if (update.view.hasFocus) {
                    handleFocus();
                } else {
                    handleBlur();
                }
            }
        });

        const escapeGhostKeymap = [
            {
                key: "Escape",
                run: (view) => {
                    aiPausedRef.current = true;

                    // Cancel any in-flight stream
                    activeStreamChangeCounterRef.current = null;
                    activeStreamCursorPosRef.current = null;
                    activeStreamCursorCounterRef.current = null;

                    setAIText(null);
                    try {
                        closeCompletion(view);
                    } catch (e) {
                    }
                    try {
                        setGhostText(view, "");
                    } catch (e) {
                    }

                    return true;
                },
                preventDefault: true
            }
        ];
        let extensions = [
            updateListener,
            completionCompartment.current.of(autocompletion({...autocompletionArgRef.current})),
            keymap.of([
                ...escapeGhostKeymap,
                ...customCompletionKeymap,
                ...props.extraKeys,
                ...closeBracketsKeymap,
                ...historyKeymap,
                ...foldKeymap,
                ...triggerAutocompleteKeymap,
                ...strippedDefaultKeymap,
                ...tabAcceptKeymap,
                enterInsertsNewlineOnly
            ]),
            mode_dict[props.mode](),
            themeCompartment.current.of([]),
            history(),
            highlightSpecialChars(),
            history(),
            drawSelection(),
            dropCursor(),
            EditorState.allowMultipleSelections.of(true),
            indentOnInput(),
            bracketMatching(),
            closeBrackets(),
            rectangularSelection(),
            crosshairCursor(),
            highlightSelectionMatches(),
            indentUnit.of("    "),
            highlightField.init(),
            readOnlyCompartment.current.of([
                EditorState.readOnly.of(props.readOnly),
                EditorView.editable.of(!props.readOnly)
            ]),
            ghostTextField,
            ghostTextPlugin,
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
        if (props.restrict_edits_to_range) {
            let ranges = props.getEditableRanges(props.code_content);
            extensions.push(restrictCompartment.current.of([
                restrictEditsToRange(ranges),
                highlightEditableRanges(ranges)
            ]));
        }

        const state = EditorState.create({
            doc: props.code_content,
            extensions: extensions
        });
        editorView.current = new EditorView({
            state,
            parent: localRef.current
        });
        if (props.setCMObject != null) {
            props.setCMObject(editorView.current);
        }
    }, []);

    const handleAutocompleteDelta = useCallback((data) => {
        console.log("Received autocomplete delta", data.text);
        if (!editorView.current.hasFocus) return;
        if (data.cmUniqueId !== cmUniqueId.current) {
            return
        }
        if (data.room !== props.local_id) return;
        if (data.change_counter !== activeStreamChangeCounterRef.current) {
            console.log("change_counter not equal to activeStreamChangeCounterRef, ignoring");
            return;
        }
        if (aiPausedRef.current) return;

        const view = editorView.current;
        const hasSelection = view.state.selection.ranges.some(r => !r.empty);
        if (hasSelection) return;

        if (activeStreamCursorPosRef.current != null) {
            const curPos = view.state.selection.main.head;
            if (curPos !== activeStreamCursorPosRef.current) {
                console.log("cursor position not equal to activeStreamCursorPosRef, ignoring");
                return
            }
          }
        if (activeStreamCursorCounterRef.current != null && data.cursor_counter != null) {
            if (data.cursor_counter !== activeStreamCursorCounterRef.current) {
                console.log("cursor counter not equal to activeStreamCursorCounterRef, ignoring");
                return
            }
          }

        console.log("Current AI text is", aiTextRef.current);
        const nextText = (aiTextRef.current ?? "") + data.text;
        aiTextRef.current = nextText;   // <-- add this line
        setAIText(nextText);
        if (editorView.current) {
            closeCompletion(editorView.current);
            const trimmed = computeGhostSuffix(nextText, editorView.current);
            setGhostText(editorView.current, trimmed);
        }
    })

    useSocketListener(props.tsocket, "AutocompleteDelta", handleAutocompleteDelta);

    useEffect(() => {
        return () => {
            const view = editorView.current;

            for (let comp of [themeCompartment, completionCompartment, lineNumberCompartment, readOnlyCompartment, restrictCompartment]) {
                if (comp.current) {
                    view?.dispatch({
                        effects: comp.current.reconfigure([])
                    });
                }
            }

            // Unregister external refs
            if (props.setCMObject) props.setCMObject(null);
            if (props.registerSetFocusFunc) props.registerSetFocusFunc(null);

            // Destroy editor
            try {
                if (view && typeof view.destroy === "function") {
                    view.destroy();
                }
            } catch (e) {
                console.warn("Error during editorView destroy:", e);
            }

            // Null local refs
            editorView.current = null;
            if (containerNodeRef.current) {
                containerNodeRef.current.innerHTML = "";
                containerNodeRef.current = null;
            }

            themeCompartment.current = null;
            completionCompartment.current = null;
            lineNumberCompartment.current = null;
            readOnlyCompartment.current = null;
            restrictCompartment.current = null;
            highlightStyle.current = null;
            autocompletionArgRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (editorView.current) {
            editorView.current.dispatch({
                effects: readOnlyCompartment.current.reconfigure([
                    EditorState.readOnly.of(props.readOnly),
                    EditorView.editable.of(!props.readOnly)
                ])
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

    useEffect(() => {
        let sources;
        if (props.mode === "python") {
            sources = [
                selfCompletionSource(props.extraSelfCompletions),
                topLevelExtraCompletions,
                dotAccessCompletions,
                generalCompletionSource(),]
        } else {
            sources = [
                generalCompletionSource(),]
        }
        autocompletionArgRef.current =
            {
                optionClass: (completion) => {
                    return completion.type === "suggestion" ? "cm-completion-ai" : null
                },
                override: sources,
                closeOnBlur: true,
                defaultKeymap: false,
                activateOnTyping: false
            };
        if (editorView.current) {
            editorView.current.dispatch({
                effects: completionCompartment.current.reconfigure(autocompletion({...autocompletionArgRef.current}))
            });
        }
    }, [props.extraSelfCompletions, settingsContext.settingsRef.current["use_ai_code_suggestions"]]);

    useEffect(() => {
        // This controlled stuff never quite worked perfectly inside the CombinedMetadata notes field
        if (props.controlled) {
            if (editorView.current) {
                const newText = props.code_content;
                const editorText = editorView.current.state.doc.toString();
                if (editorText !== newText && newText !== lastUserDocRef.current) {
                    let anchor = editorView.current.state.selection.main.anchor;
                    let head = editorView.current.state.selection.main.head;
                    const newLength = newText.length;
                    anchor = Math.min(anchor, newLength);
                    head = Math.min(head, newLength);
                    const transaction = editorView.current.state.update({
                        changes: {from: 0, to: editorText.length, insert: newText},
                        selection: {anchor, head},
                        annotations: ExternalUpdate.of(true)
                    });
                    editorView.current.dispatch(transaction);
                }
            }
        }

    }, [props.code_content]);

    useEffect(() => {
        if (!editorView.current) return;
        switchTheme(_current_codemirror_theme());

    }, [settingsContext.settings.theme, settingsContext.settings.preferred_dark_theme, settingsContext.settings.preferred_light_theme]);

    useEffect(() => {
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

    useEffect(() => {
        try {
            if (!editorView.current) return;
            const prev_matches = matches.current;
            let searchTerm = props.search_term;
            if (!searchTerm) {
                searchTerm = ""
            }

            const reg = _searchMatcher(searchTerm, true);
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
    }, [props.search_term, props.current_search_number, props.regex_search]);

    function getAIUpdate(new_code) {
        const change_counter = changeCounterRef.current;

        const cursorPos = editorView.current.state.selection.main.head;
        const hasSelection = editorView.current.state.selection.ranges.some(r => !r.empty);
        if (hasSelection) return; // never request while selecting

        cursorCounterRef.current += 1;
        const cursor_counter = cursorCounterRef.current;

        activeStreamChangeCounterRef.current = change_counter;
        activeStreamCursorPosRef.current = cursorPos;
        activeStreamCursorCounterRef.current = cursor_counter;

        let code_str = new_code;

        // the AI and ghost text should already be cleared. but just in case.
        setAIText(null);
        if (editorView.current) {
            setGhostText(editorView.current, "");
        }
        postPromise(props.parentService, "update_ai_complete",
            {
                "code_str": code_str,
                "change_counter": change_counter,
                "mode": props.mode,
                "cursor_position": cursorPos,
                "cursor_counter": cursor_counter,
                "local_id": props.local_id,
                "cmUniqueId": cmUniqueId.current
            })
            .then(() => {

            })
            .catch((error) => {
                console.log("Error getting ai autcomplete", error);
                setAIText(null);
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

    function handleChange(value, isExternal) {
        if (props.handleChange) {
            props.handleChange(value, isExternal);
        }
    }

    function handleBlur() {
        aiPausedRef.current = true;
        activeStreamChangeCounterRef.current = null;
        activeStreamCursorPosRef.current = null;
        activeStreamCursorCounterRef.current = null;
        setAIText(null);
        if (editorView.current) {
            setGhostText(editorView.current, "");
        }
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

    function _foldAll() {
        foldAll(editorView.current);
    }

    function _unfoldAll() {
        unfoldAll(editorView.current);
    }

    let ccstyle = {
        lineHeight: "21px",
    };
    if (props.flex_size) {
        ccstyle.flexGrow = 1;
        ccstyle.overflow = "auto";

    } else {
        if (!props.no_height) {
            ccstyle.height = "100%";
        }
        if (!props.no_width) {
            ccstyle.width = "100%";
        }
    }

    let bgstyle = {
        position: "absolute",
        right: 35,
        bottom: 10,
        zIndex: 1
    };

    if (props.show_search) {
        return (
            <Fragment>
                <div style={{
                    display: "flex", flexDirection: "row",
                    justifyContent: "flex-end",
                    width: "100%",
                    marginTop: 5,
                    height: SEARCH_HEIGHT,
                }}>
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
                {props.show_fold_button &&
                    <ButtonGroup variant="minimal" style={bgstyle}>
                        <Button size="small" icon="collapse-all" text="fold" onClick={_foldAll}/>
                        <Button size="small" icon="expand-all" text="unfold" onClick={_unfoldAll}/>
                    </ButtonGroup>
                }
                <div className={`code-container ${props.className}`} style={ccstyle} ref={localRef}></div>
            </Fragment>
        );
    }

    return (
        <Fragment>
            {props.show_fold_button &&
                <ButtonGroup variant="minimal" style={bgstyle}>
                    <Button size="small" icon="collapse-all" text="fold" onClick={_foldAll}/>
                    <Button size="small" icon="expand-all" text="unfold" onClick={_unfoldAll}/>
                </ButtonGroup>
            }
            <div className={`code-container ${props.className}`} style={ccstyle} ref={localRef}></div>
        </Fragment>
    );
}

ReactCodemirror6 = memo(ReactCodemirror6, (prevProps, newProps) => {
    propsAreEqual(prevProps, newProps, ["extraKeys"]);
});
