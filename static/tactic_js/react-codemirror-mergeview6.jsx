

import { useEffect, useRef, memo, useMemo, useContext, Fragment } from "react";
import React from "react";
import { useHotkeys } from "@blueprintjs/core";

import {
    highlightActiveLineGutter, highlightSpecialChars, drawSelection,
    dropCursor, rectangularSelection, crosshairCursor, keymap
} from '@codemirror/view';
import {HighlightStyle} from "@codemirror/language"
import {MergeView} from "@codemirror/merge";

import {EditorView, Decoration, lineNumbers} from "@codemirror/view";
import {EditorState, Compartment} from "@codemirror/state";
import {python} from "@codemirror/lang-python";
import {foldGutter, indentOnInput, syntaxHighlighting, bracketMatching, foldKeymap} from '@codemirror/language';
import {history, defaultKeymap, historyKeymap} from '@codemirror/commands';
import {highlightSelectionMatches} from '@codemirror/search';
import {closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap} from '@codemirror/autocomplete';
import {lintKeymap} from '@codemirror/lint';
import {indentWithTab} from "@codemirror/commands";
import {indentUnit} from "@codemirror/language";

import {StateField, StateEffect} from "@codemirror/state";

import {SettingsContext} from "./settings"
import {importTheme, themeList} from "./theme_support";

export {ReactCodemirrorMergeView6}


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


function ReactCodemirrorMergeView6(props) {

    const code_container_ref = useRef(null);
    const cmobject = useRef(null);
    const themeCompartmenta = useRef(null);
    const themeCompartmentb = useRef(null);
    const theme = useRef(null);
    const highlightStyle = useRef(null);

    const settingsContext = useContext(SettingsContext);

    const hotkeys = useMemo(
        () => [
            {
                combo: "Ctrl+S",
                global: false,
                group: "Merge Viewer",
                label: "Save Code",
                onKeyDown: props.saveMe
            },
        ],
        [props.saveMe],
    );
    const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys);

    useEffect(()=> {
        themeCompartmenta.current = new Compartment();
        themeCompartmentb.current = new Compartment();
        cmobject.current = createMergeArea(code_container_ref.current);
    }, []);

    function changeRightDocument(newDoc) {
        if (!cmobject.current) {
            return
        }
        const transaction = cmobject.current.b.state.update({
            changes: {from: 0, to: cmobject.current.b.state.doc.length, insert: newDoc}
        });
        cmobject.current.b.dispatch(transaction);
    }
    useEffect(()=>{
        if (!cmobject.current) {
            return
        }
        changeRightDocument(props.right_content);

    }, [props.right_content]);


    function isDark() {
        return settingsContext.settingsRef.current.theme == "dark";
    }

    function _current_codemirror_theme() {
        return isDark() ? settingsContext.settingsRef.current.preferred_dark_theme :
            settingsContext.settingsRef.current.preferred_light_theme;
    }


    function createMergeArea(codearea) {
        return new MergeView({
          a: {
            doc: props.editor_content,
            extensions: [
                python(),
                themeCompartmenta.current.of([]),
                history(),
                lineNumbers(),
                highlightActiveLineGutter(),
                highlightSpecialChars(),
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
                    ...closeBracketsKeymap,
                    ...defaultKeymap,
                    ...historyKeymap,
                    ...foldKeymap,
                    ...completionKeymap,
                    indentWithTab
                ]),
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        handleChange(update.state.doc.toString());
                    }
                }),]
          },
          b: {
            doc: props.right_content,
            extensions: [
              python(),
                themeCompartmentb.current.of([]),
                history(),
                lineNumbers(),
                highlightActiveLineGutter(),
                highlightSpecialChars(),
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
                    // ...props.extraKeys,
                    ...closeBracketsKeymap,
                    ...defaultKeymap,
                    ...historyKeymap,
                    ...foldKeymap,
                    ...completionKeymap,
                    ...lintKeymap,
                    indentWithTab
                ])
                ]
            },
          parent: codearea,
            revertControls: "b-to-a"
        });
    }

    const switchTheme = (themeName) => {
        if (!(themeList.includes(themeName))) {
            themeName = "one_dark";
        }
        importTheme(themeName, settingsContext.settingsRef.current.theme)
            .then(theTheme => {
                theme.current = EditorView.theme(theTheme[0]);
                highlightStyle.current = HighlightStyle.define(theTheme[1]);
                if (cmobject.current.a) {
                    cmobject.current.a.dispatch({
                        effects: themeCompartmenta.current.reconfigure([theme.current,
                            syntaxHighlighting(highlightStyle.current)])
                    });
                }
                if (cmobject.current.b) {
                    cmobject.current.b.dispatch({
                        effects: themeCompartmentb.current.reconfigure([theme.current,
                            syntaxHighlighting(highlightStyle.current)])
                    });
                }
            })
            .catch(error => {
                console.log("Error importing theme", error);
            })
    };

    useEffect(() => {
        if (!cmobject.current) return;
        switchTheme(_current_codemirror_theme());

    }, [settingsContext.settings.theme, settingsContext.settings.preferred_dark_theme, settingsContext.settings.preferred_light_theme]);


    function handleChange(value) {
        props.handleEditChange(value);
    }

    let ccstyle = {
        flex: "1 1 0",
        minWidth: 0,
        minHeight: 0,
        overflow: "auto"
    };

    return (
        <Fragment>
            <div className="code-container" style={ccstyle} ref={code_container_ref}
                 tabIndex="0" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>

            </div>
        </Fragment>
    )
}

ReactCodemirrorMergeView6 = memo(ReactCodemirrorMergeView6);