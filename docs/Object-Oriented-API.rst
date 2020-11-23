Object-Oriented API
===================

The low-level commands are documented in the section of this documentation `Tile-Commands <Tile-Commands.html>`__.
There is an alternative way to access much of the same functions that uses an object-oriented interface.
This object-oriented interface tends to be easier to read and right, and there is less to remember in terms of
special-purpose commands. However, in some cases, the code will run more slowly.

.. category_start

Accessing and manipulating the collection
-----------------------------------------

.. py:class:: TacticCollection()

    ``Collection`` and ``self.collection`` both return a TacticCollection object corresponding to the collection in the current project.

    Iterating over this object iterates over the documents in the collection, giving TacticDocument objects.
    These can also be accessed by name.

    .. code-block:: python

        doc = Collection["doc_name"]  # Get the document named doc_name
        for doc in Collection:  # iterate of over documents in the collection
            print(doc.name)

        len(Collection)  # returns the number of documents in the collection
        Collection[docname] = detached_doc  # adds or replaces a document to the collection
        del Collection[docname]  # deletes the document from the collection

    .. py:attribute:: document_names

        A list of the names of the documents in the collection.

    .. py:attribute:: current_document

        A :py:class:`TacticDocument` object corresponding to the currently visible document.

    .. py:method:: column(column_name)

        Returns, as a list, the data in the specified column from all of the documents in the collection.

    .. py:method:: tokenize(column_name=None, tokenizer_func=None)

        In table documents, applies `tokenizer_func` to each entry in the column `column_name`, in every document,
        and returns the result as a list.

        In freeform documents, applies `tokenizer_func` to each line in every document
        and returns the result as a list.

        If `tokenizer_func` is None then uses ``nltk.word_tokenize``.

    .. py:method:: detach()

        Returns a :py:class:`DetachedTacticCollection` with the data corresponding to this collection.

    .. py:method:: rewind()

        Reset the iterator to the first document.

.. py:class:: TacticDocument()

    Objects in this class correspond to one of the documents in the collection in the current project.
    It is only for table documents. Freeform documents have their own class, :py:class:`FreeformTacticDocument`
    described below.

    Keep in mind that modifying rows in a TacticDocument object modify the collection within the
    current project.

    Iterating over a document iterates over the rows.

    .. code-block:: python

        doc = self.collection.current_document
        doc[3]  # Gets the third row in the document as a TacticRow
        doc[3] = new_row  # new_row can be either a dict or a TacticRow
        doc[3:5]  # Gets the third and fourth rows
        del doc[3]  # Deletes the third row
        len(doc)  # Returns the number of rows

    It is possible to change a row in the document by assigning it to a new value.
    In the following, ``new_row`` can be a :py:class:`TacticRow`, a :py:class:`DetachedTacticRow`, or a ``dict``.

    .. code-block:: python

        doc[3] = new_row

    .. py:attribute:: name

        The name of the document.

    .. py:attribute:: metadata

        A dictionary with the metadata for the document.

        Writing ``self.metadata = a_dictionary`` sets the metadata to the provided dictionary.

    .. py:attribute:: column_names

        A list of the column_names for the document.

    .. py:attribute:: df

        Returns the document as a pandas DataFrame.


    .. py:method:: insert(index, detached_row_or_row_dict)

        Inserts a new row at the specified index. The new row can either be a
        :py:class:`DetachedTacticRow` or a dict.

    .. py:method:: column(column_name)

        Returns, as a list, the data in the specified column.

    .. py:attribute:: dict_list

        The contents of the document as a list of dictionaries.

    .. py:method:: get_matching_rows(filter_function)

        Returns a list of rows meeting the requirement in `filter_function`.
        `filter_function` should expect a TacticRow as an argument, and it should return
        True or False.  See :py:meth:`get_matching_rows`.

    .. py:method:: tokenize(column_name, tokenizer_func=None)

        Applies tokenizer_func to each entry in the column `column_name` and returns the result as a list. If
        `tokenizer_func` is None then uses ``nltk.word_tokenize``.

    .. py:method:: set_column_data(column_name, column_data, cellchange=False)

        Sets the column in the document using `column_data`. `column_data` can be
        either a dict or a list. If it’s a dict, then the keys are interpreted
        as the row_id. If it’s a list, then the ordinal position in the list is
        interpreted as the row_id.  See :py:meth:`set_column_data`.


    .. py:method:: to_html(title=None, click_type="word-clickable", sortable=True, sidebyside=False, has_header=True,
                           max_rows=None, header_style=None, body_style=None,
                           column_order=None, include_row_labels=False)

        Returns an html table for the document. See :py:meth:`html_table`

    .. py:method:: detach()

        Returns a :py:class:`DetachedTacticDocument` object with the data in this document.

    .. py:method:: rewind()

        Reset the iterator to the first row.

.. py:class:: TacticRow()

    Objects in this class correspond to a row in one of the the documents in the current project.
    Keep in mind that changes to a row will be reflected in the project's table.

    The fields in a row can be accessed either as attributes or items.

        .. code-block:: python

            doc = self.collection.current_document
            a_row = doc[3]  # Get a TacticRow corresponding to the third row
            a_row["some_column"]  # Returns the value in the field some_column
            a_row.some_column  #  Also returns the value in the field some_column
            a_row["some_column"] = "This is some text"  #  Sets the field
            a_row.some_column = "This is some text"  # Also sets the field

    .. py:attribute:: row_dict

        A dictionary with the data corresponding to the row.

    .. py:attribute:: series

        Returns the row as a pandas Series.

    .. py:method:: detach()

        Returns a :py:class:`DetachedTacticRow` object with the data in this document.


.. py:class:: FreeformTacticDocument()

    This is the document object class for freeform collections.

    Iterating over a FreeformTacticDocument document object iterates over the lines.

    .. code-block:: python

        doc = self.collection.current_document
        doc[3]    # Returns the third line
        doc[3:5]  # Gets the third and fourth lines
        len(doc)  # Returns the number of lines


    .. py:attribute:: text

        The text of the entire current document as a string.

    .. py:attribute:: line_list

        A list of :py:class:`TacticLine` objects corresponding to the lines in the document.

    .. py:attribute:: metadata

        A dictionary with the metadata for the document.

        Writing ``self.metadata = a_dictionary`` sets the metadata to the provided dictionary.

    .. py:method:: tokenize(tokenizer_func=None)

        Applies tokenizer_func to each line and returns the result as a list. If
        `tokenizer_func` is None then uses ``nltk.word_tokenize``.

    .. py:method:: rewind()

        Resets the iterator to the first line.

.. py:class:: TacticLine()

    Objects in this class correspond to a line in one of the the documents in a freeform project.
    Keep in mind that changes to a row will be reflected in the project's table.

    .. code-block:: python

        doc = self.collection.current_document
        my_line = doc[3]
        my_line[5]  # Gives the fifth character in the line.

    .. py:attribute:: text

        The text of the line as a string.

.. category_end

.. category_start

Creating and manipulating detached data
---------------------------------------

    The above classes all provide access to classes that are directly linked to the collection in the
    current project. This means, for example, that if you change a row, you will see that change
    reflected in the table.

    However, in some cases you will want to work with data that is not connected to the current collection.
    For this purpose, there are "detached" versions of each of the classes described above.

.. py:class:: DetachedTacticCollection()

    A DetachedTacticCollection can be created either via the ``.detach()`` method of project collection or
    using the :py:meth:`create_collection_object` method of TileBase.

    .. code-block:: python

        dcollection = self.create_collection_object("table")
        dcollection["new_document"] = a_detached_document  # Adds a new document to the collection
        dcollection["new_document"]  # Returns the document
        len(dcollection)  # Returns the number of documents
        for doc in dcollection:  # Iterate over documents
            print(doc.name)

        dcollection += other_dcollection  # Updates dcollection with the documents in other_dcollection
        new_collection = dcollection + other_collection  # Combines dcollection and other_collection in a new collection

    .. py:attribute:: document_names

        A list of the names of the documents in the collection.

    .. py:method:: append(detached_tactic_document)

        Adds the specified :py:class:`DetachedTacticDocument` object to the collection.

    .. py:method:: column(column_name)

        Returns, as a list, the data in the specified column from all of the documents in the collection.

    .. py:method:: update(other_collection)

        This works like a dictionary update. ``other_collection`` can be a :py:class:`DetachedTacticCollection`
        or a :py:class:`TacticCollection`.

    .. py:method:: rewind()

        Reset the iterator to the first document.

    .. py:method:: add_to_library(collection_name)

        Creates a new collection in the user's library, with the name `collection_name`,
        with all of the data in the collection.

.. py:class:: DetachedTacticDocument(TacticDocument)

    A DetachedTacticDocument can be created either via the ``.detach()`` method of a TacticDocument or
    using the :py:meth:`create_document` method of TileBase.

    Note that this class inherits from :py:class:`TacticDocument`.

    .. code-block:: python

        new_doc = self.collection.current_document.detach()
        new_doc += other_detached_doc  # Appends the row of other-detached_doc
        doc[3] = new_row  # new_row can be either a dict or a DetachedTacticRow
        new_doc

    .. py:attribute:: name

        The name of the document. The name can be set with ``doc.name = new_name``.

    .. py:method:: add_column(column_name)

        Adds a new column with the given name. The value of the corresponding field in all rows
        will be initialized to None.

    .. py:method:: append(detached_row)

        Appends the :py:class:`DetachedTacticRow` object to the collection.

    .. py:method:: insert(position, element)

        Inserts the element in the specified position. Element can be either a :py:class:`DetachedTacticRow`
        or a ``dict``.

.. py:class:: DetachedTacticRow()

    A DetachedTacticDocument can be created either via the ``.detach()`` method of a TacticRow or
    using the :py:meth:`create_row` method of TileBase.

    .. py:attribute:: row_dict

        A dictionary with the data corresponding to the row.

    .. py:attribute:: series

        Returns the row as a pandas Series.

    The fields in a row can be accessed and set just as in a TacticRow:

        .. code-block:: python

            doc = self.collection.current_document
            a_row = doc[3].detach()  # Get a DetachedTacticRow corresponding to the third row
            a_row["some_column"]  # Returns the value in the field some_column
            a_row.some_column  #  Also returns the value in the field some_column
            a_row["some_column"] = "This is some text"  #  Sets the field
            a_row.some_column = "This is some text"  # Also sets the field

    Fields can also be deleted:

        .. code-block:: python

            del arow["some_column"]
            del arow.some_column

.. py:class:: DetachedFreeformTacticDocument(FreeformTacticDocument)

    A DetachedFreeformTacticDocument can be created either via the ``.detach()`` method of a TacticDocument or
    using the :py:meth:`create_freeform_document` method of TileBase.

    Note that this class inherits from :py:class:`FreeformTacticDocument`.

    .. code-block:: python

        new_doc = self.collection.current_document.detach()
        new_doc += other_detached_freeform_doc  # Appends the row of other-detached_doc
        doc[3] = new_line  # new_line can be either a str or a DetachedTacticLine

    .. py:attribute:: name

        The name of the document. The name can be set with ``doc.name = new_name``.

    .. py:method:: append(detached_line)

        Appends the DetachedTacticLine object to the collection.

.. py:class:: DetachedTacticLine()

    A DetachedTacticDocument can be created either via the ``.detach()`` method of a TacticLine or
    using the :py:meth:`create_line` method of TileBase.

    .. code-block:: python

        dline = self.collection.current_document[3]
        dline[5]  # Returns the fifth character


    .. py:attribute:: text

        The text of the line as a string. Also, ``dline.text = new_text`` sets the text of the line.

.. category_end

.. category_start

Communicating with other tiles
------------------------------

    These classes provide a means of communicating with tiles other than the one within which code is executing.


.. py:class:: RemoteTiles()

    ``Tiles`` and ``self.tiles`` both return a :py:class:`RemoteTiles` object corresponding to the
    collection in the current project.

    Iterating over this object iterates over the tiles in the project, giving RemoteTile objects.
    These can also be accessed by name.

    .. code-block:: python

        len(Tiles)  # returns the number of other tiles
        Tile["tile_name"]  # returns a RemoteTile object corresponding to the tile
        for tile in Tiles:  # iterate of over tiles in the project
            print(tile.name)

    .. py:attribute:: names

        A list of the names of other tiles in the project.

    .. py:method:: rewind()

        Reset the iterator.

.. py:class:: RemoteTile()

    Object corresponding to another tile in a project.

    You can ask a tile for a pipe value as in the code below.

    .. code-block:: python

        other_tile = Tiles["other_tile_name"]
        pipe_value = other_tile["pipe_name"]

    .. py:attribute:: name

        The name of the tile.

    .. py:attribute:: pipe_names

        A list of the names of the pipes (exports) of the tile.

    .. py:attribute:: pipe_tags

        A dict where the keys are the names of the pipes, and the values are the tags associated with those pipes.

    .. py:attribute:: tile_id

        The id of this tile.

    .. py:method:: send_message(event_name, data=None)

        Send a message from the tile in which the code is executing to this RemoteTile object.
        Refer to py:meth:`send_tile_message`.


.. category_end

.. category_start

The Pipes Object
------------------------------

    This class provides easy access to pipe values.


.. py:class:: RemotePipes()

    ``Pipes`` returns a :py:class:`RemotePipes` object

    .. code-block:: python

        Pipes.names  # Returns the keys for all of the pipes
        Pipes["pipe_key"]  # Returns the value of the pipe

    .. py:attribute:: names

        Returns the keys for all of the pipes.

.. category_end

.. category_start

The Library Object
------------------------------

    These classes provide access to the resources in a user's library.

.. py:class:: Library()

    ``Library`` returns a :py:class:`TacticLibrary` object corresponding to the user's library.

    .. code-block:: python

        Library.lists  # Returns a TacticListSet object corresponding to a user's list resources
        Library.lists.names()  # Returns a list of the names of all list resources.
        Library.collections  # Returns a TacticCollectionSet
        Library.functions  # Returns a TacticFunctionSet


.. py:class:: TacticListSet()

    Object corresponding to a user's list resources.

    .. code-block:: python

        my_lists = Library.lists
        my_lists.names()  # Returns the names of all list resources
        my_lists["list_name"]  # Returns ListResource object corresponding to the list

    .. py:method:: names(tag_filter=None, search_filter=None)

        Returns the names of the user's list resources. If tag_filter or search_filter are specified, then
        the results are filtered accordingly. (This behaves just as it does when typing into the corresponding
        fields in the library interface.)

.. py:class:: ListResource(list)

    Corresponds to an item in the list library. It behaves just like a list except that it has a ``metadata`` attribute.

    .. code-block:: python

        my_list = Library.lists["list_name"]
        my_list.metadata

    .. py:attribute:: metadata

        Returns the ListResource's metadata

.. py:class:: TacticCollectionSet()

    Object corresponding to a user's collection resources.

    .. code-block:: python

        my_collections = Library.collections
        my_collections.names()  # Returns the names of all list resources
        my_collection["collection _name"]  # Returns DetachedTacticCollection object corresponding to the collection

    .. py:method:: names(tag_filter=None, search_filter=None)

        Returns the names of the user's collection resources. If tag_filter or search_filter are specified, then
        the results are filtered accordingly. (This behaves just as it does when typing into the corresponding
        fields in the library interface.)

.. py:class:: TacticFunctionSet()

    Object corresponding to a user's function resources.

    .. code-block:: python

        my_functions = Library.functions
        my_functions.names()  # Returns the names of all function resources
        afunc = my_functions["function_name"]  # Returns FunctionResource object corresponding to the function
        afunc(arguments)  # executes the function on the arguments

    .. py:method:: names(tag_filter=None, search_filter=None)

        Returns the names of the user's function resources. If tag_filter or search_filter are specified, then
        the results are filtered accordingly. (This behaves just as it does when typing into the corresponding
        fields in the library interface.)

.. py:class:: FunctionResource()

    Corresponds to a function library resource. It should be have like a function, except it has a couple of attributes,
    as noted below.

    .. code-block:: python

        afunc = my_functions["function_name"]  # Returns FunctionResource object corresponding to the function
        afunc(arguments)  # executes the function on the arguments

    .. py:attribute:: metadata

        Returns the FunctionResource's metadata

    .. py:attribute:: code_resource

        Returns the the name of the code resource containing the function.

.. category_end

.. category_start

The Settings Object
-------------------

    This class provides easy access to user's account-level settings.


.. py:class:: Settings()

    ``Pipes`` returns a :py:class:`TacticSettings` object

    .. code-block:: python

        Settings.names  # Returns the keys for all of the settings
        Settings["theme"]  # Returns the value of the setting "theme"

    .. py:attribute:: names

        Returns the keys for all of the settings.

.. category_end