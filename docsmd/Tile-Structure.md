# Tile Structure

Every user tile is a subclass of `TileBase`. 
Each tile is also associated with a queue to which events are added by the system. 
A separate process periodically checks this queue and sends relevant events to the tile.

The simplest user tile subclasses `TileBase` and includes a method named `render_content`. 
This method will be called by the system whenever the tile receives a RefreshTile event from the system.

``` python
    @user_tile
    class MyTile(Tilebase):
        def render_content(self):
            # user code here
            return new_html
```

The method `render_conent` should return html that will be displayed in the body of the tile. The decorator `@user_tile` informs the system that the following class is a tile that should be displayed in the menu of user tiles available for the user.

A more elaborate tile might look like this:

```python
    @user_tile
    class MyTile(TileBase):

        @property
        def options(self):
            return  [
            {"name": "number_to_show", "type": "int"},
            {"name": "text_source", "type": "column_select"},
            {"name": "my_list", "type": "custom_list", "special_list": mylist}
        ]

        def render_content(self):
            # user code here
            return new_html
```

## Options
The new ingredient here is options. Each tile can include a property named 'options' that defines what fields will be displayed on the back of the tile. This property should be a list of dicts. Each dict should have two keys: `name` and `type`. `name` has the name of the field and `type` is the type. Obviously. At present the option types are:

* *text*. A single line text field.
* *int*. An integer.
* *textarea*. A multi-line text field.
* *codearea*. This is functionally the same as a textarea option. But it displays as syntax-highlighted python code.
* *column_select*. Displays a popup list with the names of the columns in the table.
* *document_select*. Displays a popup list with the names of the documents in the collection.
* *list_select*. Displays a popup list of the users lists.
* *collection_select*. Displays a popup list of the users data collection.
* *palette_select*. Displays a popup list of available matplotlib color palettes. These can be used in tandem with with ColorMapper.
* *pipe_select*. Displays a popup list of available variables exported by other tiles.
* *custom_list*. Displays a popup list of special list. Requires an extra attribute in option dict named "special_list."
* *function_select*. Displays a popup list of available user functions. It has an options extract attribute "tag". If tag is given then the list of functions is restricted to those with this tag. 
* *class_select*. Displays a popup list of available user classes. It has an options extract attribute "tag". If tag is given then the list of classes is restricted to those with this tag. 
* *boolean*. Displays a checkbox.
* *tile_select*. Displays a list of the names of all of the tiles in the current project.

By default, when the user clicks “submit” on the back of the tile, the values in each of the fields will be stored as properties in the tile instance. For example, if a user has an option field named “participant,” then the value entered there by the user will be stored in 'self.participant' in the tile (when the user clicks submit). More on this below.

## Category exports inits save_attrs

A still more elaborate tile might look like this:

```python
    @user_tile
    class MyTile(TileBase):
        category = "utility"
        exports = [{"name": "result", "tags": ""}]

        def __init__(self, main_id, tile_id, tile_name=None):
            TileBase.__init__(self, main_id, tile_id, tile_name)
            self.number_to_show = 5
            self.result = None
            self.save_attrs += ["result"]
            return
    
        @property
        def options(self):
            return  [
            {"name": "number_to_show", "type": "int"},
            {"name": "text_source", "type": "column_select"},
            {"name": "my_list", "type": "custom_list", "special_list": mylist}
        ]

        def render_content(self):
            # user code here
            self.result = "Result computed from somewhere"
            return new_html
```

There are several new things here.

* *category*. Specifying the category, as shown above, determines the menu that the tile will appear in. This can be anything you want. If you don't specify anything, it will appear in a menu titled "Basic." 
* *exports*. This is a list of dictionaries specifying information about tile parameters 
that you want to be available as pipes to other tiles.
* *inits*. You can determine the initial value for an option by initializing the relevant variable in the `__init__` method. In the above example, this was done for the parameter named 'number_to_show'.
* *save_attrs*. This specifies the names of the parameters of the tile that will be saved when the project is saved. 
Tactic automatically adds a number of parameters to this list, including some that are crucial to the functioning of 
any tile, as well as all of the options for the tile. So you should generally add to this list, rather than replace it wholesale.
It is usually good practice to all all parameters that are exported to the list of save_attrs. The tile_creator does this.

## Events and default handlers
I suspect that a large fraction of user tiles will look like the second example above. But there are more elaborate possibilities. The full list of events handled by tiles follows. When each of these events is received, a method within the tile is called. Each of these events is handled, in some manner, by TileBase (although sometimes it does nothing). But they can also be handled by a user tile to introduce custom behavior.

* *RefreshTile*. When a tile receives this event, it calls `render_content()`. This does nothing by default.
* *UpdateOptions*. This event is generated when the user clicks submit on the back of the tile. When a tile receives this event, it calls `update_options(form_data)`, with form_data being a dictionary containing the data in the fields. The version of update_options in TileBase takes these values and assigns them to attributes of the tile. In the case of list_select, tokenizer_select, pip_select, and weight_function_select, the name of the relevant resource attribute will contain the name of the resource as a string. One of the functions must be used to access the string associated with the resource. In the case of the int option, update_options converts this to an int. The default version of update_options also shows the front the tile, then does a spin_and_refresh.
* *TileButtonClick*. This event is generated when the user clicks a button within the body of a tile (i.e., 
one that was placed there by a call to render_content). When this event is generated, TileBase 
calls `handle_button_click(value, doc_name, active_row_index)`, where value is the button value. 
By default, this does nothing.
* *TileSelectChange*. This event is generated when the user changes the value of a select element in the body of
the the child. TileBase calls `handle_select_change(value, doc_name, active_row_index)`, where value is the 
value selected. 
* *TileFormSubmit*. This event is generated when the user clicks a submit in a form within the body of a tile (i.e., 
one that was placed there by a call to render_content). When this event is generated, TileBase 
calls `handle_form_submit(form_data, doc_name, active_row_index)`, where `form_data` is a dictionary in which
the keys are the names of elements in the form, and the values is their current values. Note that one of these entries
will correspond to the submit button itself.
By default, handle_form_submit does nothing.
* *LogTile*. This event is generated when the user clicks the log button near the top right corner of the tile. When this is generated, TileBase calls `handle_log_tile()`. By default this uses `self.log_it()` to write the current html on the tile's face to the log.
* *TileTextAreaChange*. This event is generated when the user changes the contents of a textarea DOM element on the front of the tile. When this event is generated, TileBase call 'handle_textarea_change(value)' where value is the current contents of the text area. By default, this does nothing.
* *CellChange*. This event is generated when the user changes the content of a cell in the table. When it receives this event, it calls `handle_cell_change(column_header, row_index, old_content, new_content, doc_name)`. column\_header is the name of the column; row\_index is the row number; old\_content is the text that was previously in the cell; new\_content is the new text in the cell.
* *TextSelect*. This event is generated when the user highlights text in a cell. 
TileBase calls `handle_text_select(selected_text)`. By default this does nothing.
* *DocChange*. This event is generated when the changes the document that is visible in the table. 
TileBase calls `handle_doc_change(doc_name)`. By default this does nothing.
* *PipeUpdate*. This event is generated when a pipe property (a tile’s exported property value) is updated. It calls `handle_pipe_update(pipe_name)`. (I think this might not be implemented yet.)
* *TileWordClick*. This event is generated when the user clicks on a word anywhere on the front of a tile. (I think the text has to be on an element of class .word-clickable.) This calls `handle_tile_word_click(clicked_word, doc_name, active_row_index)`. By default this searches the visible table for any appearances of click\_word and highlights them.
* *TileRowClick*. Generated when user clicks a table cell on a tile that is of class .row-clickable. This calls `handle_tile_row_click(clicked_row, doc_name, active_row_index)`. clicked_row has a list of text of the cells in the row.
* *TileElementClick*. Generated when user on any element on the front of a tile that has a class .element-clickable. This calls `handle_tile_element_click(dataset, doc_name, active_row_index)`. The value of dataset is determined in a very flexible manner; namely, it grabs any data- attributes associated with the clicked element. For example, if the element has attributes `data-somevar="hello"` and `data-anothervar="world"` then dataset will be the dictionary `{"somevar": "hello", "anothervar": "world"}`
* *TileCellClick*. Generated when user clicks a table cell on a tile that is of class .cell-clickable. This calls `handle_tile_cell_click(clicked_text, doc_name, active_row_index)`. clicked_text is the text content of the cell.
* *TileSizeChange*. This event is generated when the user changes the size of the tile. By default, when this event is generated, self.width and self.height are changed to the new values. Then `handle_size_change()` is called.
* *TileMessage*. This event is generated when a tile sends a message with the send_tile_message command. 
When this event is generated, then there is a call to the tile method `handle_tile_message(event_name, data)`.
(See [Tile Commands: Other](Tile-Commands#other))

In addition, there are some events that I think it is unlikely that the user will want to mess with
    
* *ShowFront*. By default this shows the tile’s front by calling `this.show_front()`.
* *StartSpinner, StopSpinner*. By default, these start and stop the tile spinners (the animations showing that the tile is busy working on something). To do this, TileBase calls `self.start_spinner()` and `self.stop_spinner()`
* *RefreshTileFromSave*. By default, this tells the tile to use the html in `self.current_html` for the front side of the tile.
* *RebuildTileForms*. This tells the tile to rebuild the html for the back side of the tile.

## Working directly with events

You can, if you choose, post events directly to a tile's events queue:

```python
  self.post_event(event_name, data=None)
```