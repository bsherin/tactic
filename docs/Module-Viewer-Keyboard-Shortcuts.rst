Keyboard Shortcuts
==================

Keyboard shortcuts for the module viewer. These are mosly just copied
from here: https://codemirror.net/doc/manual.html#commands

:command:`autocomplete` :kbd:`Ctrl-Space` (PC), :kbd:`Ctrl-Space` (Mac)

    Bring up the autocomplete widget.

:command:`search` :kbd:`Ctrl-S` (PC), :kbd:`Cmd-S` (Mac)

    Search the whole content of the editor.

:command:`selectAll` :kbd:`Ctrl-A (PC), Cmd-A (Mac)`

    Select the whole content of the editor.

:command:`killLine` :kbd:`Ctrl-K (Mac)`

    Emacs-style line killing. Deletes the part of the line after the cursor.
    If that consists only of whitespace, the newline at the end of the line
    is also deleted.

:command:`deleteLine` :kbd:`Ctrl-D (PC), Cmd-D (Mac)`

    Deletes the whole line under the cursor, including newline at the end.

:command:`delWrappedLineLeft` :kbd:`Cmd-Backspace (Mac)`

    Delete the part of the line from the left side of the visual line the
    cursor is on to the cursor.

:command:`delWrappedLineRight` :kbd:`Cmd-Delete (Mac)`

    Delete the part of the line from the cursor to the right side of the
    visual line the cursor is on.

:command:`undo` :kbd:`Ctrl-Z (PC), Cmd-Z (Mac)`

    Undo the last change.

:command:`redo` :kbd:`Ctrl-Y (PC), Shift-Cmd-Z (Mac), Cmd-Y (Mac)`

    Redo the last undone change.

:command:`undoSelection` :kbd:`Ctrl-U (PC), Cmd-U (Mac)`

    Undo the last change to the selection, or if there are no selection-only
    changes at the top of the history, undo the last change.

:command:`redoSelection` :kbd:`Alt-U (PC), Shift-Cmd-U (Mac)`

    Redo the last change to the selection, or the last text change if no
    selection changes remain.

:command:`goDocStart` :kbd:`Ctrl-Home (PC), Cmd-Up (Mac), Cmd-Home (Mac)`

    Move the cursor to the start of the document.

:command:`goDocEnd` :kbd:`Ctrl-End (PC), Cmd-End (Mac), Cmd-Down (Mac)`

    Move the cursor to the end of the document.

:command:`goLineStart` :kbd:`Alt-Left (PC), Ctrl-A (Mac)`

    Move the cursor to the start of the line.

:command:`goLineStartSmartHome`

    Move to the start of the text on the line, or if we are already there,
    to the actual start of the line (including whitespace).

:command:`goLineEnd` :kbd:`Alt-Right (PC), Ctrl-E (Mac)`

    Move the cursor to the end of the line.

:command:`goLineRight` :kbd:`Cmd-Right (Mac)`

    Move the cursor to the right side of the visual line it is on.

:command:`goLineLeft` :kbd:`Cmd-Left (Mac)`

    Move the cursor to the left side of the visual line it is on. If this
    line is wrapped, that may not be the start of the line.

:command:`goLineUpUp ` :kbd:`Ctrl-P (Mac)`

    Move the cursor up one line.

:command:`goLineDownDown, ` :kbd:`Ctrl-N (Mac)`

    Move down one line.

:command:`goPageUpPageUp, Shift-` :kbd:`Ctrl-V (Mac)`

    Move the cursor up one screen, and scroll up by the same distance.

:command:`goPageDownPageDown, ` :kbd:`Ctrl-V (Mac)`

    Move the cursor down one screen, and scroll down by the same distance.

:command:`goCharLeftLeft, ` :kbd:`Ctrl-B (Mac)`

    Move the cursor one character left, going to the previous line when
    hitting the start of line.

:command:`goCharRightRight, ` :kbd:`Ctrl-F (Mac)`

    Move the cursor one character right, going to the next line when hitting
    the end of line.

:command:`goColumnLeft`

    Move the cursor one character left, but don’t cross line boundaries.

:command:`goColumnRight`

    Move the cursor one character right, don’t cross line boundaries.

:command:`goWordLeft` :kbd:`Alt-B (Mac)`

    Move the cursor to the start of the previous word.

:command:`goWordRight` :kbd:`Alt-F (Mac)`

    Move the cursor to the end of the next word.

:command:`goGroupLeft` :kbd:`Ctrl-Left (PC), Alt-Left (Mac)`

    Move to the left of the group before the cursor. A group is a stretch of
    word characters, a stretch of punctuation characters, a newline, or a
    stretch of more than one whitespace character.

:command:`goGroupRight` :kbd:`Ctrl-Right (PC), Alt-Right (Mac)`

    Move to the right of the group after the cursor (see above).

:command:`delCharBeforeShift-Backspace, ` :kbd:`Ctrl-H (Mac)`

    Delete the character before the cursor.

:command:`delCharAfterDelete, ` :kbd:`Ctrl-D (Mac)`

    Delete the character after the cursor.

:command:`delWordBefore` :kbd:`Alt-Backspace (Mac)`

    Delete up to the start of the word before the cursor.

:command:`delWordAfter` :kbd:`Alt-D (Mac)`

    Delete up to the end of the word after the cursor.

:command:`delGroupBefore` :kbd:`Ctrl-Backspace (PC), Alt-Backspace (Mac)`

    Delete to the left of the group before the cursor.

:command:`delGroupAfter` :kbd:`Ctrl-Delete (PC), Ctrl-Alt-Backspace (Mac), Alt-Delete(Mac)`

    Delete to the start of the group after the cursor.

:command:`indentAutoShift-Tab`

    Auto-indent the current line or selection.

:command:`indentMore` :kbd:`Ctrl-] (PC), Cmd-] (Mac)`

    Indent the current line or selection by one indent unit.

:command:`indentLess` :kbd:`Ctrl-[ (PC), Cmd-[ (Mac)`

    Dedent the current line or selection by one indent unit.

:command:`insertTab`

    Insert a tab character at the cursor.

:command:`insertSoftTab`

    Insert the amount of spaces that match the width a tab at the cursor
    position would have.

:command:`defaultTabTab`

    If something is selected, indent it by one indent unit. If nothing is
    selected, insert a tab character.

:command:`transposeChars` :kbd:`Ctrl-T (Mac)`

    Swap the characters before and after the cursor.

:command:`newlineAndIndentEnter`

    Insert a newline and auto-indent the new line.

:command:`toggleOverwriteInsert`

    Flip the overwrite flag.

:command:`save` :kbd:`Ctrl-S (PC), Cmd-S (Mac)`

    Not defined by the core library, only referred to in key maps. Intended
    to provide an easy way for user code to define a save command.

:command:`find` :kbd:`Ctrl-F (PC), Cmd-F (Mac)`

:command:`findNext` :kbd:`Ctrl-G (PC), Cmd-G (Mac)`


:command:`findPrev` :kbd:`Shift-Ctrl-G (PC), Shift-Cmd-G (Mac)`


:command:`replace` :kbd:`Shift-Ctrl-F (PC), Cmd-Alt-F (Mac)`

:command:`replaceAll` :kbd:`Shift-Ctrl-R (PC), Shift-Cmd-Alt-F (Mac)`

    Not defined by the core library, but defined in the search addon (or
    custom client addons).
