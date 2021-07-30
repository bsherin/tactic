The Tile API
=============

Here I explain the Tile API. By that, I mean the special commands and constructs that
are available within the context of a tile. Where they make sense, they can also
be used in `Logs and Notebooks <Log-And-Notebook.html>`__.

To save typing, many of the commmands in this API have shorter equivalents.

Note that there is an alternate, `object-oriented API <Object-Oriented-API.html>`__ which
has functionality that overlaps with this API. Where the object-oriented API applies, it generally
allows for code that is easier to read and write.

.. note::

    All of the commands here are methods of the tile base class, ``TileBase``.
    And you will always be calling them, essentially, from within another
    method of `TileBase <Tile-Structure.html>`__. That means that when you invoke these functions you will
    almost always be writing ``self.function()``.  In the case of properties, you'll
    write ``self.property``.

.. py:class:: TileBase()

.. category_start

Refreshing
----------

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

    The following methods provide access to the data. Note that much of the same functionality is provided by the
    `object-oriented api <Object-Oriented-API.html# Accessing and manipulating the collection>`__.
    The object-oriented interface is a bit more intuitive.
    However, the commands listed here will often produce tiles that run more quickly.

    .. py:method:: get_document_names()

        Returns a list of all document names in the current collection.

        Synonym: ``gdn``

    .. py:method:: get_current_document_name()

        Returns the name of the current document.

        Synonym: ``gcdn``

    .. py:method:: get_document_data(document_name)

        For table-based documents,returns all of the data in the document
        represented as a dictionary. The keys of the dictionary are the values
        of the \__id_\_ field for each row, represented as strings.

        For freeform documents, the document is returned as a string.

        Synonym: ``gdd``

    .. py:method:: get_document_data_as_list(document_name)

        Returns all of the data in the document represented as a list.

        For table documents, each item corresponds to a row. For freeform
        documents, each item corresponds to a line.

        Synonym: ``gddl``

    .. py:method:: get_column_names (document_name)

        Returns a list containing the column names of the specified document. (Table documents only.)

        Synonym: ``gcn``

    .. py:method:: get_number_rows(document_name)

        Returns the number of rows in the specified document for table
        documents. For freeform documents, returns the number of lines.

        Synonym: ``gnr``

    .. py:method:: get_row(document_name, row_id)

        For table documents, the specified row is returned. For freeform
        documents, the specified line is returned. **self.get_line** is a
        synonym.

        Synonym: ``gr``

    .. py:method:: get_cell(document_name, row_id, column_name)

        Returns the text in the specified cell.
        **row_id** should be the same as the value in \_\_id\_\_.
        Right now we are also assuming that is the same as the row number in the table. (Table documents only.)

        Synonym: ``gc``

    .. py:method:: get_column_data(column_name, document_name)

        Get all contents of a column as a list. If document_name is not provided or is
        None then the content of the column from all documents is returned as one long list. (Table documents only.)

        Synonym: ``gcd``

    .. py:method:: get_column_data_dict(column_name)

        Returns a dictionary. The keys of the dictionary are the document names.
        Each value is a list corresponding to the values in column_name for the
        document. (Table documents only.)

        Synonym: ``gcdd``

    .. py:method:: get_document_metadata(document_name)

        Returns a the document-level metadata for the given document. Returns a dict.

        Synonym: ``gdm``

.. category_end

.. category_start

Data Setting
------------

    The following methods make it possible to set the data. Note that much of the same functionality is provided by the
    `object-oriented API <Object-Oriented-API.html# Accessing and manipulating the collection>`__.
    The object-oriented interface is a bit more intuitive. However, the commands listed here will often produce tiles that run more quickly.

    .. py:function:: set_cell(document_name, row_id, column_name, text, cellchange=True)

        Sets the text in the specified cell. By default generates a CellChange
        event. (Table documents only.) **row_id** should be the same as the value in \__id__.

        Synonym: ``sc``

    .. py:function:: add_document(document_name, column_names, list_of_dicts)

        Adds a new table document to the collection. **list_of_dicts** is a list of dictionaries
        corresponding to the rows in the new document. Note that if the name of an existing
        document is given that document is overwritten.

    .. py:function:: remove_document(document_name)

        Removes a document from the collection.

    .. py:function:: add_freeform_document(document_name, doc_text)

        Adds a new freeform document to the collection. Note that if the name of an existing
        document is given that document is overwritten.

    .. py:function:: insert_row(document_name, index, row_as_dict)

        Insert a new row in a document at the specified index.

    .. py:function:: delete_row(document_name, index)

        Delete a row from a document.

    .. py:function:: rename_document(old name, newname)

        Rename a document in the collection.

    .. py:method:: set_document(document_name, new_data, cellchange=False)

        This is a general utility for setting document data. For table documents, **new_data**
        should be a dictionary where the keys are row ids and the values are row dictionaries.
        These row dictionaries should have keys that correspond to columns in the data table.
        If only some data is specified in **new_data_dict** then only those values will be changed.
        For freeform documents, **new_data** should be a string.

        Synonym: ``sd``

    .. py:method:: set_column_data(document_name, column_name, column_data, cellchange=False)

        Sets the column in a document using column_data. column_data can be
        either a dict or a list. If it’s a dict, then the keys are interpreted
        as the row_id. If it’s a list, then the ordinal position in the list is
        interpreted as the row_id. (Table documents only.)

        Synonym: ``scd``

    .. py:method:: set_document_metadata(document_name, metadata_dict)

        Sets the document_level metadata for the given document. **metadata_dict** should be a dictionary.
        Note that certain keys are reserved and cannot appear as keys in the metadata dict: "_id", "file_id", "name",
        "my_class_for_recreate", "table_spec", "data_text", "length", "data_rows","header_list", "number_of_rows".

        Synonym: ``sdm``

    .. py:method:: set_cell_background(document_name, row_id, column_name, color)

        Sets the the background color of the specified cell to the given color.
        The color is used in an expression of the form: $(el).css("background-color", color).
        So color has to be something that can appear in that expression.
        ColorMapper.color_from_val() generates the right sort of thing.
        **row_id** should be the same as the value in \_\_id\_\_.
        Right now we are also assuming that is the same as the row number in the table. (Table documents only.)

        Synonym: ``scb``

    .. py:method:: color_cell_text(document_name, row_id, column_name, tokenized_text, color_dict)

        Highlights the words in the target cell. Color dict has a dictionary
        that maps words to colors. (Table documents only.)

        Synonym: ``cct``

.. category_end

.. category_start

Filter-And-Iterate
-----------------------

    .. py:method:: get_matching_documents(filter_function)

        **filter\_function** should take a dict, corresponding to a document's metadata, as an argument,
        and should output a boolean.  Returns a list of the matching documents.

    .. py:method:: get_matching_rows(filter_function, document_name)

        For table docs, **filter\_function** should take a dict (corresponding to a row) as an argument,
        and should output a boolean. If document_name is missing or None then this will
        look across all documents in the collection. Returns a list of the matching rows.
        For freeform docs, **filter\_function** should take a string (corresponding to a line)
        as an argument, and should return a boolean. It returns a list of the matching lines.

        Synonym: ``gmr``

    .. py:method:: display_matching_rows(filter_function, document_name)

        Will cause the table to only display rows matching the filter_function.
        If document_name is missing or None then this will apply to all
        documents in the collection. (Table documents only.)

        Synonym: ``dmr``

    .. py:method:: clear_table_highlighting()

        Clears a main table highlighting.

        Synonym: ``cth``

    .. py:method:: highlight_matching_text(text)

        Highlights matching text in the main table.

        Synonym: ``hmt``

    .. py:method:: display_all_rows()

        Will cause the table to display all rows. (Table documents only.)

        Synonym: ``dar``

    .. py:method:: apply_to_rows(func, document_name=None, cellchange=False)

        Applies the specified func to each row. func should expect a dict corresponding to the row as an input and it should return a dict corresponding to the modified row as output. If document_name is missing or None then this will apply to all documents in the collection.

        (Table documents only.)

        Synonym: ``atr``

.. category_end

.. category_start

Object API
----------

    The commands ``Library``, ``Collection``, ``Tiles``, and ``Pipes`` return objects that provide direct access
    to elements of the object-oriented API. Note that you do not type ``self`` before these commands. This is documented
    in the `object-oriented interface <Object-Oriented-API.html#accessing-and-manipulating-the-collection>`__

    In addition, there are a few tile methods (which are preceded by ``self.``) that pertain to the object API.

    .. py:attribute:: collection

        ``self.collection`` returns a TacticCollection object corresponding to the collection in the current project.
        It is equivalent to typing ``Collection``.

    .. py:method:: create_collection_object(doc_type, doc_list=None)

        Creates a new :py:class:`DetachedTacticCollection` object. *doc_list*, if provided
        must be a list of :py:class:`DetachedTacticDocument` objects.

    .. py:method:: create_document(doc_data=None, docname="document1", metadata=None)

        Creates a new :py:class:`DetachedTacticDocument` object.

        *doc_data* can be either pandas DataFrame, a list of :py:class:`TacticRow` objects, or a list of dicts.

    .. py:method:: create_freeform_document(docname="document1", lines=None, metadata=None)

        Creates a new :py:class:`DetachedFreeformTacticCollection` object.


    .. py:method:: create_row(row_dict=None)

        Creates a new :py:class:`DetachedTacticRow` object. *row_dict* and be a dict or a pandas Series.

    .. py:method:: create_line(txt=None)

        Creates a new :py:class:`DetachedTacticLIne` object.

    .. py:attribute:: tiles

        ``self.tiles`` returns a RemoteTiles object corresponding to the tiles in the current project. This is
        equivalent to typing `Tiles.`

.. category_end

.. category_start


Other TileBase
--------------

    .. py:method:: create_collection(name, doc_dict, doc_type="table", doc_metadata=None, header_list_dict=None, collection_metadata=None)

        Creates a new collection in the user’s resource library. **name** is the
        name for the new collection. **doc_type** specifies whether the type of
        the document is table or freeform. **doc_dict** is a dictionary in which
        the keys are names for the individual documents that will comprise the
        new collection. For freeform documents, the values of this dictionary
        are strings. For tables, the values are a list of rows, with each row
        being a dict.

        **doc_metadata** is a dictionary that holds any document-level metadata
        you’d like to add. The keys are document names and the values are
        dictionaries of keys and values.

        **header_list_dict** is a dictionary of lists. The keys are document names and each value is a list
        of column names. This allows you to specify the order in which columns will appear in a table.

        **collection_metadata** is a dictionary of metadata to be associated with the collection as a whole.

        Synonym: ``cc``

    .. py:method:: go_to_document(document_name)

        Shows the named document in the table.

        Synonym: ``gtd``

    .. py:method:: go_to_row_in_document(document_name, row_id)

        For table documents, this shows the named document and selects the named
        row. For freeform documents, the corresponding line is scrolled into
        view.

        Synonym: ``gtrid``

    .. py:method:: get_selected_text()

        Returns the text currently highlighted by the user

        Synonym: ``gst``

    .. py:method:: log_it(html_string, force_open=True, is_error=False, summary=None)

        Adds the given html to the log (formerly called the console).

        If ``force_open`` is True then the Log will be opened if it was closed.
        If ``is_error`` is True then the new panel that is created in the Log
        will be an error panel. This means it will have a red header. It also
        means that, if the user resets the log, then the panel will be deleted.

        The optional ``summary`` parameter is a line of text to be displayed when the log item is shrunk.

        Synonyms: ``dm``, ``display_message``

    .. py:method:: get_container_log()

        Returns, as a string, the current contents of the container log file.
        This is the log file of the container that holds the tile. All error
        messages go to this file. Also and print statements.

    .. py:method:: send_tile_message(tile_name, event_name, data=None)

        Sends a message to a tile with the given name. The event_name and data
        are passed to the named tile, which it can capture by defining a
        handle_tile_message method. (See `Events and
        handlers <Tile-Structure.html#events-and-default-handlers>`__)

        Synonym: ``stm``

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
        advance, the name of one of your resources.

        Finally, there are alternatives to all of these command in the object-oriented interface. For example
        `Library.lists[list_name]` returns the corresponding list from the users library.

        Synonyms: ``gulist``, ``gufunc``, ``guclass``, ``gucol`` for get_user_list, get_user_function,
        get_user_class, and get_user_collection respectively.

    .. py:method:: html_table(data, title=None, click_type="word-clickable", sortable=True, sidebyside=False, has_header=True, max_rows=None, header_style=None, body_style=None, column_order=None, include_row_labels=True)

        Returns html for a table. ``data`` can be given in a number of forms. It can be a a pandas DataFrame, a list of
        dicts, an nltk FreqDist, a list of lists, a dict, or a pandas Series.

        If the data is a dict or a Series, the table produced has two columns, one corresponding to the keys, the other
        to the values.

        *title* is an optional title.

        *click_type* can be can be ``"word-clickable"``,
        ``"element-clickable"``, or ``"row-clickable"``. If it’s word-clickable
        or element-clickable, then every cell in the table is assigned the
        corresponding class, and hence will lead to generating a TileWordClick
        or TileElementClick event when clicked. If the click_type is
        row-clickable, then the row is assigned a row-clickable class (and will
        lead to the generation of TileRowClick events.) These various events can
        then be handled by the appropriate handlers in a tile:
        ``handled_tile_word_click``, ``handle_tile_element_click``, or
        ``handle_tile_row_click``.

        If *sortable* is True, then the header can be clicked to sort by a column.

        If *sidebyside* is False, then the table will expand to take up the entire width available.

        *has_header* only matters if data is in the form of a list of lists. If it is True, and the data is in the
        form of a list of lists, then the first list is treates as headers.

        *max_rows* specifies the max number of rows to be included in the table. It only matters if the data is
        a dataframe, a list of dicts or a FreqDist.


        ``header_style`` and ``body_style`` are optional styles that will be applied to header cells and body cells
        respectively.

        If *column_order* is not None, then it specifies an order for the columns. It only matters if *data* is
        a DataFrame or a list of dicts.

        *include_row_labels* only matters if *data* is a DataFrame or a list of dicts. If *data* is a DataFrame, then
        the row labels will be included as the first column in the table. If it is a list of dicts, then the rows will
        be numbered.


    .. py:method:: build_html_table_from_data_list(data_list, title=None, click_type="word-clickable", sortable=True, sidebyside=False, has_header=True header_style=None, body_style=None)

        Returns html for table. *data_list* must be in the form of a list of lists. The
        first row is treated as the heading row. A title can optionally be
        given. If *has_header* is True, then the first list is treated as headers.

        ``click_type`` can be ``"word-clickable"``,
        ``"element-clickable"``, or ``"row-clickable"``. If it’s word-clickable
        or element-clickable, then every cell in the table is assigned the
        corresponding class, and hence will lead to generating a TileWordClick
        or TileElementClick event when clicked. If the click_type is
        row-clickable, then the row is assigned a row-clickable class (and will
        lead to the generation of TileRowClick events.) These various events can
        then be handled by the appropriate handlers in a tile:
        ``handled_tile_word_click``, ``handle_tile_element_click``, or
        ``handle_tile_row_click``.

        If *sortable* is True, then the header can be clicked to sort by a column.

        If *sidebyside* is False, then the table will expand to take up the entire width available.

        ``header_style`` and ``body_style`` are optional styles that will be applied to header cells and body cells
        respectively.

        Synonym: ``bht``

    .. py:method:: get_user_settings()

        Returns a dictionary with the current value of user's account-level settings. There's not
        much there at this point. The same functionality is available from the
        `object-oriented API <Object-Oriented-API.html#the-settings-object>`__.

.. category_end

.. category_start


Plots
-----

.. py:class:: MplFigure()

    .. note::

        The Matplotlib-realted commands are only available in `Matplotlib
        Tiles <Matplotlib-Tiles.html>`__ (i.e., those that subclass ``MplFigure``).

    .. py:method:: init_mpl_figure(figsize=(self.width/PPI, self.height/PPI), dpi=80, facecolor=None, edgecolor=None, linewidth=0.0, frameon=None, subplotpars=None, tight_layout=None)

        This reinitializes the figure contained in a MatplotlibTile. It’s
        equivalent to calling ``MplFigure.__init__(self, kwargs).`` The kwargs
        are the same as for `Matplotlib’s Figure
        class <https://matplotlib.org/api/_as_gen/matplotlib.figure.Figure.html>`__.
        But the default values are different for ``figsize`` and ``dpi``.

    .. py:method:: create_figure_html(use_svg=True)

        Given a MplFigure instance this generates html that can be included in a
        tile to display the figure. If ``use_svg`` is True, then this produces an svg element that is embedded directly
        in the page. If it's false, then the html produced contains a link that references a png file hosted on the server.

    .. py:method:: create_pyplot_html(use_svg=True)

        When using matplotlib.pyplot to work in interactive mode, use this alternative
        command to generate html to display the figure. If ``use_svg`` is True, then this produces an svg
        element that is embedded directly
        in the page. If it's false, then the html produced contains a link that references a png file hosted on the server.

        The following code will work in the log or a notebook:

        .. code-block:: python

            import matplotlib.pyplot as plt
            plt.plot([7, 4, 3])
            self.create_pyplot_html()

    .. py:method:: create_bokeh_html(plot)

        Given a bokeh plot, this returns html to display the plot. The entirety of what this method is below,
        in case you want to do something slightly different. However, doing something other than Resources("inline")
        can cause problems, especially when loading a saved project.

        .. code-block:: python

            def create_bokeh_html(self, the_plot):
                from bokeh.embed import file_html
                from bokeh.resources import Resources
                return file_html(the_plot, Resources("inline"))

       And here's some complete code that produces a bokeh plot:

        .. code-block:: python

            from bokeh.plotting import figure
            from bokeh.resources import CDN
            from bokeh.embed import file_html
            from bokeh.resources import JSResources, CSSResources, Resources
            p = figure(plot_width=400, plot_height=400, tools="pan,wheel_zoom,box_zoom,hover,reset",
                       title=None, toolbar_location="below",
                       toolbar_sticky=False)
            p.circle([1, 2, 3, 4, 5], [2, 5, 8, 2, 7], size=10)
            html = file_html(p, Resources("inline"), "my plot")
            html


.. category_end

.. category_start

Global
------

.. note::
    The following commands are not called with ``self``.

.. py:class:: ColorMapper(bottom_val, top_val, color_palette_name)
.. py:method:: ColorMapper.color_from_val(val)

    ColorMapper is a class for creating mappings between values and colors.
    ColorMapper() creates the class instance. bottom_val and top_val specify
    the value range. color_palette_name is the name of the matplotlib
    color_palette. These can be selected by the user using the
    palette_select option type.

.. py:method:: global_import(module_name)

    This command imports a module into the global namespace. So, for example, ``global_import("nltk")``
    within ``render_content`` would make ``nltk`` available within all method calls in your tile.

    :param str module_name: The name of the module to import as a string.

.. category_end

Scientific libraries
--------------------

It is assumed that tiles will make heavy use of scientific libraries.
The libraries listed below are currently available for import from tiles.

.. note::
    There is one subtlety to be aware of when importing libraries.
    The code that you write for a tile is always executed within a method.
    If you all of the code you for your tile is in the `render_content`, then
    you can just import your the library there, and everything is fine.
    However, if your tile includes other methods, then each method would have to separately
    import the library.

    The `global_import` function, described above, can simplify things. If you write `global_import("nltk")`, for example, then
    nltk will be available to all methods.

-  `beautifulsoup4 <https://www.crummy.com/software/BeautifulSoup/>`__ (from bs4 import BeautifulSoup)
-  `bokeh <https://docs.bokeh.org/en/latest/index.html>`__
-  `fuzzywuzzy <https://github.com/seatgeek/fuzzywuzzy>`__
-  `gensim <https://radimrehurek.com/gensim/>`__
-  `markdown <https://github.com/Python-Markdown/markdown>`__
-  `networkx <https://networkx.github.io>`__
-  `nltk <http://www.nltk.org>`__
-  `numpy <http://www.numpy.org>`__
-  `matplotlib <https://matplotlib.org>`__
-  `regex <https://pypi.org/project/regex/>`__
-  `requests <https://requests.kennethreitz.org/en/master/>`__
-  `pandas <http://pandas.pydata.org>`__
-  `scipy <httsp://scipy.org>`__
-  `sklearn <http://scikit-learn.org/stable/index.html>`__
-  `tweepy <https://www.tweepy.org/>`__
-  `wordcloud <https://github.com/amueller/word_cloud>`__
-  `yellowbrick <https://www.scikit-yb.org/en/latest/>`__
