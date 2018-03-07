Keyboard Shortcuts
==================

Keyboard shortcuts for the module viewer. These are mosly just copied
from here: https://codemirror.net/doc/manual.html#commands

.. raw:: html

   <dl>

.. raw:: html

   <dt class="command" id="command_autocomplete">

autocompleteCtrl-Space (PC), Ctrl-Space (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Bring up the autocomplete widget.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_search">

searchCtrl-S (PC), Cmd-S (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Search the whole content of the editor.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_selectAll">

selectAllCtrl-A (PC), Cmd-A (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Select the whole content of the editor.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_killLine">

killLineCtrl-K (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Emacs-style line killing. Deletes the part of the line after the cursor.
If that consists only of whitespace, the newline at the end of the line
is also deleted.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_deleteLine">

deleteLineCtrl-D (PC), Cmd-D (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Deletes the whole line under the cursor, including newline at the end.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_delWrappedLineLeft">

delWrappedLineLeftCmd-Backspace (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Delete the part of the line from the left side of the visual line the
cursor is on to the cursor.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_delWrappedLineRight">

delWrappedLineRightCmd-Delete (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Delete the part of the line from the cursor to the right side of the
visual line the cursor is on.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_undo">

undoCtrl-Z (PC), Cmd-Z (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Undo the last change.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_redo">

redoCtrl-Y (PC), Shift-Cmd-Z (Mac), Cmd-Y (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Redo the last undone change.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_undoSelection">

undoSelectionCtrl-U (PC), Cmd-U (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Undo the last change to the selection, or if there are no selection-only
changes at the top of the history, undo the last change.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_redoSelection">

redoSelectionAlt-U (PC), Shift-Cmd-U (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Redo the last change to the selection, or the last text change if no
selection changes remain.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_goDocStart">

goDocStartCtrl-Home (PC), Cmd-Up (Mac), Cmd-Home (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Move the cursor to the start of the document.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_goDocEnd">

goDocEndCtrl-End (PC), Cmd-End (Mac), Cmd-Down (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Move the cursor to the end of the document.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_goLineStart">

goLineStartAlt-Left (PC), Ctrl-A (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Move the cursor to the start of the line.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_goLineStartSmart">

goLineStartSmartHome

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Move to the start of the text on the line, or if we are already there,
to the actual start of the line (including whitespace).

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_goLineEnd">

goLineEndAlt-Right (PC), Ctrl-E (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Move the cursor to the end of the line.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_goLineRight">

goLineRightCmd-Right (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Move the cursor to the right side of the visual line it is on.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_goLineLeft">

goLineLeftCmd-Left (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Move the cursor to the left side of the visual line it is on. If this
line is wrapped, that may not be the start of the line.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_goLineUp">

goLineUpUp, Ctrl-P (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Move the cursor up one line.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_goLineDown">

goLineDownDown, Ctrl-N (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Move down one line.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_goPageUp">

goPageUpPageUp, Shift-Ctrl-V (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Move the cursor up one screen, and scroll up by the same distance.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_goPageDown">

goPageDownPageDown, Ctrl-V (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Move the cursor down one screen, and scroll down by the same distance.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_goCharLeft">

goCharLeftLeft, Ctrl-B (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Move the cursor one character left, going to the previous line when
hitting the start of line.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_goCharRight">

goCharRightRight, Ctrl-F (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Move the cursor one character right, going to the next line when hitting
the end of line.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_goColumnLeft">

goColumnLeft

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Move the cursor one character left, but don’t cross line boundaries.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_goColumnRight">

goColumnRight

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Move the cursor one character right, don’t cross line boundaries.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_goWordLeft">

goWordLeftAlt-B (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Move the cursor to the start of the previous word.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_goWordRight">

goWordRightAlt-F (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Move the cursor to the end of the next word.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_goGroupLeft">

goGroupLeftCtrl-Left (PC), Alt-Left (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Move to the left of the group before the cursor. A group is a stretch of
word characters, a stretch of punctuation characters, a newline, or a
stretch of more than one whitespace character.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_goGroupRight">

goGroupRightCtrl-Right (PC), Alt-Right (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Move to the right of the group after the cursor (see above).

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_delCharBefore">

delCharBeforeShift-Backspace, Ctrl-H (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Delete the character before the cursor.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_delCharAfter">

delCharAfterDelete, Ctrl-D (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Delete the character after the cursor.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_delWordBefore">

delWordBeforeAlt-Backspace (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Delete up to the start of the word before the cursor.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_delWordAfter">

delWordAfterAlt-D (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Delete up to the end of the word after the cursor.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_delGroupBefore">

delGroupBeforeCtrl-Backspace (PC), Alt-Backspace (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Delete to the left of the group before the cursor.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_delGroupAfter">

delGroupAfterCtrl-Delete (PC), Ctrl-Alt-Backspace (Mac), Alt-Delete
(Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Delete to the start of the group after the cursor.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_indentAuto">

indentAutoShift-Tab

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Auto-indent the current line or selection.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_indentMore">

indentMoreCtrl-] (PC), Cmd-] (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Indent the current line or selection by one indent unit.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_indentLess">

indentLessCtrl-[ (PC), Cmd-[ (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Dedent the current line or selection by one indent unit.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_insertTab">

insertTab

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Insert a tab character at the cursor.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_insertSoftTab">

insertSoftTab

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Insert the amount of spaces that match the width a tab at the cursor
position would have.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_defaultTab">

defaultTabTab

.. raw:: html

   </dt>

.. raw:: html

   <dd>

If something is selected, indent it by one indent unit. If nothing is
selected, insert a tab character.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_transposeChars">

transposeCharsCtrl-T (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Swap the characters before and after the cursor.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_newlineAndIndent">

newlineAndIndentEnter

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Insert a newline and auto-indent the new line.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_toggleOverwrite">

toggleOverwriteInsert

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Flip the overwrite flag.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_save">

saveCtrl-S (PC), Cmd-S (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Not defined by the core library, only referred to in key maps. Intended
to provide an easy way for user code to define a save command.

.. raw:: html

   </dd>

.. raw:: html

   <dt class="command" id="command_find">

findCtrl-F (PC), Cmd-F (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dt class="command" id="command_findNext">

findNextCtrl-G (PC), Cmd-G (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dt class="command" id="command_findPrev">

findPrevShift-Ctrl-G (PC), Shift-Cmd-G (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dt class="command" id="command_replace">

replaceShift-Ctrl-F (PC), Cmd-Alt-F (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dt class="command" id="command_replaceAll">

replaceAllShift-Ctrl-R (PC), Shift-Cmd-Alt-F (Mac)

.. raw:: html

   </dt>

.. raw:: html

   <dd>

Not defined by the core library, but defined in the search addon (or
custom client addons).

.. raw:: html

   </dd>

.. raw:: html

   </dl>
