import {ViewPlugin, Decoration, WidgetType} from "@codemirror/view";
import {
    StateField,
    StateEffect,
    RangeSetBuilder,
} from "@codemirror/state";


export {GhostTextWidget, acceptGhostText, ghostTextPlugin, ghostTextField, setGhostText, setGhostTextEffect, computeGhostSuffix};

const setGhostTextEffect = StateEffect.define();

function setGhostText(view, text) {
    if (!view) return;

    if (!text) {
        view.dispatch({
            effects: setGhostTextEffect.of({ text: "", pos: null })
        });
    } else {
        const pos = view.state.selection.main.head;
        view.dispatch({
            effects: setGhostTextEffect.of({ text, pos })
        });
    }
}

const ghostTextField = StateField.define({
    create() {
        return {text: "", pos: null};
    },
    update(value, tr) {
        // Apply explicit updates (from setGhostText)
        for (let e of tr.effects) {
            if (e.is(setGhostTextEffect)) {
                return e.value || {text: "", pos: null};
            }
        }

        // If the document changed, map the stored position forward
        if (tr.docChanged && value.pos != null) {
            const mappedPos = tr.changes.mapPos(value.pos, 1);
            return {...value, pos: mappedPos};
        }

        // Otherwise, keep the same ghost text
        return value;
    }
});

class GhostTextWidget extends WidgetType {
    constructor(text) {
        super();
        this.text = text;
    }

    toDOM() {
        const span = document.createElement("span");
        span.textContent = this.text;
        span.className = "cm-ghostText";
        return span;
    }

    ignoreEvent() {
        return true; // don't steal focus/clicks
    }
}

const ghostTextPlugin = ViewPlugin.fromClass(class {
    constructor(view) {
        this.decorations = this.buildDecorations(view);
    }

    update(update) {
        const prev = update.startState.field(ghostTextField, false);
        const cur = update.state.field(ghostTextField, false);

        const ghostChanged = prev !== cur;

        if (update.docChanged || update.selectionSet || ghostChanged) {
            this.decorations = this.buildDecorations(update.view);
        }
    }
    buildDecorations(view) {
        const state = view.state;
        const ghost = state.field(ghostTextField, false) || { text: "", pos: null };
        const { text, pos } = ghost;

        if (!text || pos == null) {
            return Decoration.none;
        }

        const cursorPos = state.selection.main.head;

        // Only show ghost text if the cursor is still at the anchor pos
        if (cursorPos !== pos) {
            return Decoration.none;
        }

        const builder = new RangeSetBuilder();
        builder.add(
            pos,
            pos,
            Decoration.widget({
                widget: new GhostTextWidget(text),
                side: 1
            })
        );
        return builder.finish();
    }

}, {
    decorations: v => v.decorations
});

function acceptGhostText(view) {
    const ghost = view.state.field(ghostTextField, false);
    if (!ghost || !ghost.text) return false;

    const pos = ghost.pos != null ? ghost.pos : view.state.selection.main.head;

    view.dispatch({
        changes: { from: pos, insert: ghost.text },
        effects: setGhostTextEffect.of({ text: "", pos: null })
    });
    return true;
}
function computeGhostSuffix(fullSuggestion, view) {
    if (!view || !fullSuggestion) return fullSuggestion;

    const state = view.state;
    const doc = state.doc;
    const cursorPos = state.selection.main.head;
    const line = doc.lineAt ? doc.lineAt(cursorPos) : doc.line(cursorPos);
    const linePrefix = doc.sliceString(line.from, cursorPos);

    // Remove overlap between end of linePrefix and start of suggestion
    const maxLen = Math.min(linePrefix.length, fullSuggestion.length);
    let overlap = 0;

    for (let len = maxLen; len > 0; len--) {
        const prefixSuffix = linePrefix.slice(linePrefix.length - len);
        const suggestionPrefix = fullSuggestion.slice(0, len);
        if (prefixSuffix === suggestionPrefix) {
            overlap = len;
            break;
        }
    }

    let result = fullSuggestion.slice(overlap);

    // Find the last "word-like" token before the cursor (letters/digits/_)
    let lastWord = "";
    {
        let i = cursorPos;
        while (i > line.from) {
            const ch = doc.sliceString(i - 1, i);
            if (!/[A-Za-z0-9_]/.test(ch)) break;
            i--;
        }
        lastWord = doc.sliceString(i, cursorPos);
    }

    // If lastWord is a Python keyword, we probably want a space
    const keywordSet = new Set([
        "for", "while", "if", "elif", "else",
        "try", "except", "finally",
        "with", "as",
        "in", "is",
        "and", "or", "not",
        "return", "yield",
        "class", "def",
        "from", "import", "lambda"
    ]);

    if (result && overlap === 0 && keywordSet.has(lastWord)) {
        // Ensure there's a space between keyword and suggestion,
        // unless the suggestion already starts with whitespace/newline.
        const firstCh = result[0];
        if (firstCh !== " " && firstCh !== "\n" && firstCh !== "\t") {
            result = " " + result;
        }
    }

    return result;
}