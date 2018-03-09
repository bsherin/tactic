Tile Commands
=============

This is the second part of the Tile API. These are the commands that are
available to programmers of new tiles. Where they make sense, they can also
be used in `Logs and Notebooks <Log-And-Notebook.html>`__.

.. note::

    All of these commands are methods of the tile base class, ``TileBase``.
    And you will always be calling them, essentially, from within another
    method of `TileBase <Tile-Structure.html>`__. That means that when you invoke these functions you will
    almost always be writing ``self.function()``.

.. py:class:: TileBase()
    :hidden:

.. category_start

Refreshing a Tile
-----------------

    .. py:method:: start_spinner()

        Start the spinning animation on the tile

    .. py:method:: start_spinner()

        Start the spinning animation on the tile

    .. py:method:: stop_spinner()

        Stop the spinning animation on the tile.

    .. py:method:: refresh_tile_now(new_html=None)

        Updates the front of the tile using the passed html. If new_html is None
        then ``render_content`` is called to generate the html to be displayed.

        :param str new_html: The html to display on the front of the tile.

    .. py:method:: spin_and_refresh()

        Starts the spinner, refreshes the tile, then stops the spinner.

.. category_end

.. category_start

Data Access
-----------

    .. py:method:: get_document_names()

        Returns a list of all document names in the current collection.

    .. py:method:: get_current_document_name()

        Returns the name of the current document.

    .. py:method:: get_document_data(document_name)

        For table-based documents,returns all of the data in the document
        represented as a dictionary. The keys of the dictionary are the values
        of the \__id_\_ field for each row, represented as strings.

        For freeform documents, the document is returned as a string.

    .. py:method:: get_document_data_as_list(document_name)

        Returns all of the data in the document represented as a list.

        For table documents, each item corresponds to a row. For freeform
        documents, each item corresponds to a line.

    .. py:method:: get_column_names (document_name)

        Returns a list containing the column names of the specified document. (Table documents only.)

    .. py:method:: get_number_rows(document_name)

        Returns the number of rows in the specified document for table
        documents. For freeform documents, returns the number of lines.

    .. py:method:: get_row(document_name, row_id)

        For table documents, the specified row is returned. For freeform
        documents, the specified line is returned. **self.get_line** is a
        synonym.

    .. py:method:: get_cell(document_name, row_id, column_name)

        Returns the text in the specified cell.
        **row_id** should be the same as the value in \_\_id\_\_.
        Right now we are also assuming that is the same as the row number in the table. (Table documents only.)

    .. py:method:: get_column_data(column_name, document_name)

        Get all contents of a column as a list. If document_name is not provided or is
        None then the content of the column from all documents is returned as one long list. (Table documents only.)

    .. py:method:: get_column_data_dict(column_name)

        Returns a dictionary. The keys of the dictionary are the document names.
        Each value is a list corresponding to the values in column_name for the
        document. (Table documents only.)

    .. py:method:: get_document_metadata(document_name)

        Returns a the document-level metadata for the given document. Returns a dict.

.. category_end

.. category_start

Data Setting
------------

    .. py:function:: set_cell(document_name, row_id, column_name, text, cellchange=True)

        Sets the text in the specified cell. By default generates a CellChange
        event. (Table documents only.) **row_id** should be the same as the value in \__id__.

    .. py:method:: set_document(document_name, new_data, cellchange=False)

        This is a general utility for setting document data. For table documents, **new_data**
        should be a dictionary where the keys are row ids and the values are row dictionaries.
        These row dictionaries should have keys that correspond to columns in the data table.
        If only some data is specified in **new_data_dict** then only those values will be changed.
        For freeform documents, **new_data** should be a string.

    .. py:method:: set_column_data(document_name, column_name, column_data, cellchange=False)

        Sets the column in a document using column_data. column_data can be
        either a dict or a list. If it’s a dict, then the keys are interpreted
        as the row_id. If it’s a list, then the ordinal position in the list is
        interpreted as the row_id. (Table documents only.)

    .. py:method:: set_document_metadata(document_name, metadata_dict)

        Sets the document_level metadata for the given document. **metadata_dict** should be a dictionary.
        Note that certain keys are reserved and cannot appear as keys in the metadata dict: "_id", "file_id", "name",
        "my_class_for_recreate", "table_spec", "data_text", "length", "data_rows","header_list", "number_of_rows".

    .. py:method:: set_cell_background(document_name, row_id, column_name, color)

        Sets the the background color of the specified cell to the given color.
        The color is used in an expression of the form: $(el).css("background-color", color).
        So color has to be something that can appear in that expression.
        ColorMapper.color_from_val() generates the right sort of thing.
        **row_id** should be the same as the value in \_\_id\_\_.
        Right now we are also assuming that is the same as the row number in the table. (Table documents only.)

    .. py:method:: color_cell_text(document_name, row_id, column_name, tokenized_text, color_dict)

        Highlights the words in the target cell. Color dict has a dictionary
        that maps words to colors. (Table documents only.)

.. category_end

.. category_start

Filtering-And-Iteration
-----------------------

    .. py:method:: get_matching_rows(filter_function, document_name)

        For table docs, **filter\_function** should take a dict (corresponding to a row) as an argument,
        and should output a boolean. If document_name is missing or None then this will
        look across all documents in the collection. Returns a list of the matching rows.
        For freeform docs, **filter\_function** should take a string (corresponding to a line)
        as an argument, and should return a boolean. It returns a list of the matching lines.

    .. py:method:: display_matching_rows(filter_function, document_name)

        Will cause the table to only display rows matching the filter_function.
        If document_name is missing or None then this will apply to all
        documents in the collection. (Table documents only.)

    .. py:method:: clear_table_highlighting()

        Clears a main table highlighting.

    .. py:method:: highlight_matching_text(text)

        Highlights matching text in the main table.

    .. py:method:: display_all_rows()

        Will cause the table to display all rows. (Table documents only.)

    .. py:method:: apply_to_rows(func, document_name=None, cellchange=False)

        Applies the specified func to each row. func should expect a dict corresponding to the row as an input and it should return a dict corresponding to the modified row as output. If document_name is missing or None then this will apply to all documents in the collection.

        (Table documents only.)

.. category_end

.. category_start

Plots
-----

These commands are only available in `Matplotlib
Tiles <Matplotlib-Tiles.html>`__ (i.e., those that subclass ``MplFigure``).

    .. py:method:: init_mpl_figure(figsize=(self.width/80, self.height/80), dpi=80, facecolor=None, edgecolor=None, linewidth=0.0, frameon=None, subplotpars=None, tight_layout=None)

        This reinitializes the figure contained in a MatplotlibTile. It’s
        equivalent to calling ``MplFigure.__init__(self, kwargs).`` The kwargs
        are the same as for `Matplotlib’s Figure
        class <https://matplotlib.org/api/_as_gen/matplotlib.figure.Figure.html>`__.
        But the default values are different for ``figsize`` and ``dpi``.

    .. py:method:: create_figure_html()

        Given a MplFigure instance this generates html that can be included in a
        tile to display the figure.

.. category_end

.. category_start

Other
-----

    .. py:method:: go_to_document(document_name)

        Shows the named document in the table.

    .. py:method:: go_to_row_in_document(document_name, row_id)

        For table documents, this shows the named document and selects the named
        row. For freeform documents, the corresponding line is scrolled into
        view.

    .. py:method:: get_selected_text()

        Returns the text currently highlighted by the user

    .. py:method:: log_it(html_string, force_open=True, is_error=False)

        Adds the given html to the log (formerly called the console). These
        commands all do the same thing. ``display_message`` and ``dm`` are the
        old names. ``log_it`` is the new name of the command that was added when
        the name of the console was change to log.

        if ``force_open`` is True then the Log will be opened if it was closed.
        If ``is_error`` is True then the new panel that is created in the Log
        will be an error panel. This means it will have a red header. It also
        means that, if the user resets the log, then the panel will be deleted.

        Synonyms of ``self.log_it`` are ``self.dm`` and ``self.display_message``.

    .. py:method:: get_container_log()

        Returns, as a string, the current contents of the container log file.
        This is the log file of the container that holds the tile. All error
        messages go to this file. Also and print statements.

    .. py:method:: send_tile_message(tile_name, event_name, data=None)

        Sends a message to a tile with the given name. The event_name and data
        are passed to the named tile, which it can capture by defining a
        handle_tile_message method. (See `Events and
        handlers <Tile-Structure.html#events-and-default-handlers>`__)

    .. py:method:: get_function_names(tag=None); self.get_class_names(tag=None)

        Returns a list of the available user function names or class names. This
        list can be restricted to those with the specified tag. These names can
        then be used to access the associated function or class with
        ``get_user_function()`` or ``get_user_class()``.

    .. py:method:: get_user_list(list_name)
               get_pipe_value(pipe_name)
               get_user_function(function_name)
               get_user_class(class_name)
               get_user_collection(collection_name)

        When a tile includes a list, pipe, function, class, collection as one of
        the options that appears on the back of a tile, then update_options
        places the name of the relevant resource in the attribute made available
        to the tile. These commands return the object associated with the name.

        You can also use these commands on their own if you happen to know, in
        advance, the name of one of yoru resources.

    .. py:method:: build_html_table_from_data_list(data_list, title=None, click_type="word-clickable", sortable=True)

        Returns html for a table given data in the form of a list of lists. The
        first row is treated as the heading row. A title can optionally be
        given. ``click_type`` can be ``"word-clickable"``,
        ``"element-clickable"``, or ``"row-clickable"``. If it’s word-clickable
        or element-clickable, then every cell in the table is assigned the
        corresponding class, and hence will lead to generating a TileWordClick
        or TileElementClick event when clicked. If the click_type is
        row-clickable, then the row is assigned a row-clickable class (and will
        lead to the generation of TileRowClick events.) These various events can
        then be handled by the appropriate handlers in a tile:
        ``handled_tile_word_click``, ``handle_tile_element_click``, or
        ``handle_tile_row_click``.

    .. py:method:: create_collection(name, doc_dict, doc_type="table", metadata_dict=None)

        Creates a new collection in the user’s resource library. **name** is the
        name for the new collection. **doc_type** specifies whether the type of
        the document is table or freeform. **doc_dict** is a dictionary in which
        the keys are names for the individual documents that will comprise the
        new collection. For freeform documents, the values of this dictionary
        are strings. For tables, the values are a list of rows, with each row
        being a dict.

        **metadata_dict** is a dictionary that holds any document-level metadata
        you’d like to add. The keys are document names and the values are
        dictionaries of keys and values.

    .. py:class:: ColorMapper(bottom_val, top_val, color_palette_name)
    .. py:method:: ColorMapper.color_from_val(val)

        ColorMapper is a class for creating mappings between values and colors.
        ColorMapper() creates the class instance. bottom_val and top_val specify
        the value range. color_palette_name is the name of the matplotlib
        color_palette. These can be selected by the user using the
        palette_select option type.

.. category_end

Available-libraries
-------------------

All of these libraries are available for import from within tiles.
Refer to the documentation for specifics.

-  `nltk <http://www.nltk.org>`__
-  `numpy <http://www.numpy.org>`__
-  `scipy <httsp://scipy.org>`__
-  `matplotlib <https://matplotlib.org>`__
-  `pandas <http://pandas.pydata.org>`__
-  `sklearn <http://scikit-learn.org/stable/index.html>`__
-  `gensim <https://radimrehurek.com/gensim/>`__
-  `beautifulsoup4 <https://www.crummy.com/software/BeautifulSoup/>`__
   (from bs4 import BeautifulSoup)
-  `networkx <https://networkx.github.io>`__
-  `markdown <https://github.com/Python-Markdown/markdown>`__
-  `wordcloud <https://github.com/amueller/word_cloud>`__
