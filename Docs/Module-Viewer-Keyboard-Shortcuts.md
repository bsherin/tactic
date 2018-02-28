Keyboard shortcuts for the module viewer. These are mosly just copied from here: https://codemirror.net/doc/manual.html#commands
<dl>
      <dt class="command" id="command_autocomplete"><code><strong>autocomplete</strong></code><span class="keybinding">Ctrl-Space (PC), Ctrl-Space (Mac)</span></dt>
      <dd>Bring up the autocomplete widget.</dd>
      <dt class="command" id="command_search"><code><strong>search</strong></code><span class="keybinding">Ctrl-S (PC), Cmd-S (Mac)</span></dt>
      <dd>Search the whole content of the editor.</dd>
      <dt class="command" id="command_selectAll"><code><strong>selectAll</strong></code><span class="keybinding">Ctrl-A (PC), Cmd-A (Mac)</span></dt>
      <dd>Select the whole content of the editor.</dd>
      <dt class="command" id="command_killLine"><code><strong>killLine</strong></code><span class="keybinding">Ctrl-K (Mac)</span></dt>
      <dd>Emacs-style line killing. Deletes the part of the line after
      the cursor. If that consists only of whitespace, the newline at
      the end of the line is also deleted.</dd>
      <dt class="command" id="command_deleteLine"><code><strong>deleteLine</strong></code><span class="keybinding">Ctrl-D (PC), Cmd-D (Mac)</span></dt>
      <dd>Deletes the whole line under the cursor, including newline at the end.</dd>
      <dt class="command" id="command_delWrappedLineLeft"><code><strong>delWrappedLineLeft</strong></code><span class="keybinding">Cmd-Backspace (Mac)</span></dt>
      <dd>Delete the part of the line from the left side of the visual line the cursor is on to the cursor.</dd>
      <dt class="command" id="command_delWrappedLineRight"><code><strong>delWrappedLineRight</strong></code><span class="keybinding">Cmd-Delete (Mac)</span></dt>
      <dd>Delete the part of the line from the cursor to the right side of the visual line the cursor is on.</dd>
      <dt class="command" id="command_undo"><code><strong>undo</strong></code><span class="keybinding">Ctrl-Z (PC), Cmd-Z (Mac)</span></dt>
      <dd>Undo the last change.</dd>
      <dt class="command" id="command_redo"><code><strong>redo</strong></code><span class="keybinding">Ctrl-Y (PC), Shift-Cmd-Z (Mac), Cmd-Y (Mac)</span></dt>
      <dd>Redo the last undone change.</dd>
      <dt class="command" id="command_undoSelection"><code><strong>undoSelection</strong></code><span class="keybinding">Ctrl-U (PC), Cmd-U (Mac)</span></dt>
      <dd>Undo the last change to the selection, or if there are no
      selection-only changes at the top of the history, undo the last
      change.</dd>
      <dt class="command" id="command_redoSelection"><code><strong>redoSelection</strong></code><span class="keybinding">Alt-U (PC), Shift-Cmd-U (Mac)</span></dt>
      <dd>Redo the last change to the selection, or the last text change if
      no selection changes remain.</dd>
      <dt class="command" id="command_goDocStart"><code><strong>goDocStart</strong></code><span class="keybinding">Ctrl-Home (PC), Cmd-Up (Mac), Cmd-Home (Mac)</span></dt>
      <dd>Move the cursor to the start of the document.</dd>
      <dt class="command" id="command_goDocEnd"><code><strong>goDocEnd</strong></code><span class="keybinding">Ctrl-End (PC), Cmd-End (Mac), Cmd-Down (Mac)</span></dt>
      <dd>Move the cursor to the end of the document.</dd>
      <dt class="command" id="command_goLineStart"><code><strong>goLineStart</strong></code><span class="keybinding">Alt-Left (PC), Ctrl-A (Mac)</span></dt>
      <dd>Move the cursor to the start of the line.</dd>
      <dt class="command" id="command_goLineStartSmart"><code><strong>goLineStartSmart</strong></code><span class="keybinding">Home</span></dt>
      <dd>Move to the start of the text on the line, or if we are
      already there, to the actual start of the line (including
      whitespace).</dd>
      <dt class="command" id="command_goLineEnd"><code><strong>goLineEnd</strong></code><span class="keybinding">Alt-Right (PC), Ctrl-E (Mac)</span></dt>
      <dd>Move the cursor to the end of the line.</dd>
      <dt class="command" id="command_goLineRight"><code><strong>goLineRight</strong></code><span class="keybinding">Cmd-Right (Mac)</span></dt>
      <dd>Move the cursor to the right side of the visual line it is on.</dd>
      <dt class="command" id="command_goLineLeft"><code><strong>goLineLeft</strong></code><span class="keybinding">Cmd-Left (Mac)</span></dt>
      <dd>Move the cursor to the left side of the visual line it is on. If
      this line is wrapped, that may not be the start of the line.</dd>
      <dt class="command" id="command_goLineUp"><code><strong>goLineUp</strong></code><span class="keybinding">Up, Ctrl-P (Mac)</span></dt>
      <dd>Move the cursor up one line.</dd>
      <dt class="command" id="command_goLineDown"><code><strong>goLineDown</strong></code><span class="keybinding">Down, Ctrl-N (Mac)</span></dt>
      <dd>Move down one line.</dd>
      <dt class="command" id="command_goPageUp"><code><strong>goPageUp</strong></code><span class="keybinding">PageUp, Shift-Ctrl-V (Mac)</span></dt>
      <dd>Move the cursor up one screen, and scroll up by the same distance.</dd>
      <dt class="command" id="command_goPageDown"><code><strong>goPageDown</strong></code><span class="keybinding">PageDown, Ctrl-V (Mac)</span></dt>
      <dd>Move the cursor down one screen, and scroll down by the same distance.</dd>
      <dt class="command" id="command_goCharLeft"><code><strong>goCharLeft</strong></code><span class="keybinding">Left, Ctrl-B (Mac)</span></dt>
      <dd>Move the cursor one character left, going to the previous line
      when hitting the start of line.</dd>
      <dt class="command" id="command_goCharRight"><code><strong>goCharRight</strong></code><span class="keybinding">Right, Ctrl-F (Mac)</span></dt>
      <dd>Move the cursor one character right, going to the next line
      when hitting the end of line.</dd>
      <dt class="command" id="command_goColumnLeft"><code><strong>goColumnLeft</strong></code></dt>
      <dd>Move the cursor one character left, but don't cross line boundaries.</dd>
      <dt class="command" id="command_goColumnRight"><code><strong>goColumnRight</strong></code></dt>
      <dd>Move the cursor one character right, don't cross line boundaries.</dd>
      <dt class="command" id="command_goWordLeft"><code><strong>goWordLeft</strong></code><span class="keybinding">Alt-B (Mac)</span></dt>
      <dd>Move the cursor to the start of the previous word.</dd>
      <dt class="command" id="command_goWordRight"><code><strong>goWordRight</strong></code><span class="keybinding">Alt-F (Mac)</span></dt>
      <dd>Move the cursor to the end of the next word.</dd>
      <dt class="command" id="command_goGroupLeft"><code><strong>goGroupLeft</strong></code><span class="keybinding">Ctrl-Left (PC), Alt-Left (Mac)</span></dt>
      <dd>Move to the left of the group before the cursor. A group is
      a stretch of word characters, a stretch of punctuation
      characters, a newline, or a stretch of <em>more than one</em>
      whitespace character.</dd>
      <dt class="command" id="command_goGroupRight"><code><strong>goGroupRight</strong></code><span class="keybinding">Ctrl-Right (PC), Alt-Right (Mac)</span></dt>
      <dd>Move to the right of the group after the cursor
      (see <a href="#command_goGroupLeft">above</a>).</dd>
      <dt class="command" id="command_delCharBefore"><code><strong>delCharBefore</strong></code><span class="keybinding">Shift-Backspace, Ctrl-H (Mac)</span></dt>
      <dd>Delete the character before the cursor.</dd>
      <dt class="command" id="command_delCharAfter"><code><strong>delCharAfter</strong></code><span class="keybinding">Delete, Ctrl-D (Mac)</span></dt>
      <dd>Delete the character after the cursor.</dd>
      <dt class="command" id="command_delWordBefore"><code><strong>delWordBefore</strong></code><span class="keybinding">Alt-Backspace (Mac)</span></dt>
      <dd>Delete up to the start of the word before the cursor.</dd>
      <dt class="command" id="command_delWordAfter"><code><strong>delWordAfter</strong></code><span class="keybinding">Alt-D (Mac)</span></dt>
      <dd>Delete up to the end of the word after the cursor.</dd>
      <dt class="command" id="command_delGroupBefore"><code><strong>delGroupBefore</strong></code><span class="keybinding">Ctrl-Backspace (PC), Alt-Backspace (Mac)</span></dt>
      <dd>Delete to the left of the <a href="#command_goGroupLeft">group</a> before the cursor.</dd>
      <dt class="command" id="command_delGroupAfter"><code><strong>delGroupAfter</strong></code><span class="keybinding">Ctrl-Delete (PC), Ctrl-Alt-Backspace (Mac), Alt-Delete (Mac)</span></dt>
      <dd>Delete to the start of the <a href="#command_goGroupLeft">group</a> after the cursor.</dd>
      <dt class="command" id="command_indentAuto"><code><strong>indentAuto</strong></code><span class="keybinding">Shift-Tab</span></dt>
      <dd>Auto-indent the current line or selection.</dd>
      <dt class="command" id="command_indentMore"><code><strong>indentMore</strong></code><span class="keybinding">Ctrl-] (PC), Cmd-] (Mac)</span></dt>
      <dd>Indent the current line or selection by one <a href="#option_indentUnit">indent unit</a>.</dd>
      <dt class="command" id="command_indentLess"><code><strong>indentLess</strong></code><span class="keybinding">Ctrl-[ (PC), Cmd-[ (Mac)</span></dt>
      <dd>Dedent the current line or selection by one <a href="#option_indentUnit">indent unit</a>.</dd>
      <dt class="command" id="command_insertTab"><code><strong>insertTab</strong></code></dt>
      <dd>Insert a tab character at the cursor.</dd>
      <dt class="command" id="command_insertSoftTab"><code><strong>insertSoftTab</strong></code></dt>
      <dd>Insert the amount of spaces that match the width a tab at
      the cursor position would have.</dd>
      <dt class="command" id="command_defaultTab"><code><strong>defaultTab</strong></code><span class="keybinding">Tab</span></dt>
      <dd>If something is selected, indent it by
      one <a href="#option_indentUnit">indent unit</a>. If nothing is
      selected, insert a tab character.</dd>
      <dt class="command" id="command_transposeChars"><code><strong>transposeChars</strong></code><span class="keybinding">Ctrl-T (Mac)</span></dt>
      <dd>Swap the characters before and after the cursor.</dd>
      <dt class="command" id="command_newlineAndIndent"><code><strong>newlineAndIndent</strong></code><span class="keybinding">Enter</span></dt>
      <dd>Insert a newline and auto-indent the new line.</dd>
      <dt class="command" id="command_toggleOverwrite"><code><strong>toggleOverwrite</strong></code><span class="keybinding">Insert</span></dt>
      <dd>Flip the <a href="#toggleOverwrite">overwrite</a> flag.</dd>
      <dt class="command" id="command_save"><code><strong>save</strong></code><span class="keybinding">Ctrl-S (PC), Cmd-S (Mac)</span></dt>
      <dd>Not defined by the core library, only referred to in
      key maps. Intended to provide an easy way for user code to define
      a save command.</dd>
      <dt class="command" id="command_find"><code><strong>find</strong></code><span class="keybinding">Ctrl-F (PC), Cmd-F (Mac)</span></dt>
      <dt class="command" id="command_findNext"><code><strong>findNext</strong></code><span class="keybinding">Ctrl-G (PC), Cmd-G (Mac)</span></dt>
      <dt class="command" id="command_findPrev"><code><strong>findPrev</strong></code><span class="keybinding">Shift-Ctrl-G (PC), Shift-Cmd-G (Mac)</span></dt>
      <dt class="command" id="command_replace"><code><strong>replace</strong></code><span class="keybinding">Shift-Ctrl-F (PC), Cmd-Alt-F (Mac)</span></dt>
      <dt class="command" id="command_replaceAll"><code><strong>replaceAll</strong></code><span class="keybinding">Shift-Ctrl-R (PC), Shift-Cmd-Alt-F (Mac)</span></dt>
      <dd>Not defined by the core library, but defined in
      the <a href="#addon_search">search addon</a> (or custom client
      addons).</dd>
    </dl>
