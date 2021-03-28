Handler Methods
===============

Various events lead to the calling of handler methods in a tile.
For example, if a user changes the size of a tile, a ``TileSizeChange`` event is generated, which
in turn leads to the calling of the handler ``handle_size_change()``. The ``TileBase`` class
has default handlers for all of these events, but some of them don't do anything.

Your tile can choose to include its methods to handle these events.
For example, you might do something like this.

.. code-block:: python

    def handle_size_change(self):
        new_html = self.draw_plot()
        self.display_status(new_html)
        return

In the case of the ``handle_size_handler``, no additional arguments are passed. But as noted below,
some handlers are passed arguments.

.. category_start

Clicks on Tile Front
--------------------

    Many of the handler calls are generated when the user interacts with the front of a tile.
    This can happen if, for example, you have displayed a button on the front of the tile.

    In addition to passing information specific to the event, many of these handlers
    are also passed the name of the currently visible document as well as the currently selected
    row in that document.

    .. py:method:: handle_button_click(self, value, doc_name, active_row_index)

        A call to this handler is generated when the the user clicks a button within the body
        of a tile. ``value`` is the button value. The default handler has no effect.

        For example, your ``render_content`` method could add a button to the html it displays
        like this:

        .. code-block:: python

            the_html += "<button value='{0}'>{1}</button>".format (val, txt)

    .. py:method:: handle_select_change(self, value, doc_name, active_row_index, select_name)

        This handler is called when the user changes the value of a select element
        in the body of the tile. ``value`` is the value selected. `select_name` is the value
        of the ``name`` property assigned in the html for your select component. The default
        handle does nothing

    .. py:method:: handle_form_submit(self, form_data, doc_name, active_row_index)

        Called when the user clicks submit in a form within the body of a tile.
        ``form_data`` is a dictionary in which the keys are the names of
        elements in the form, and the values are their current values. Note
        that one of these entries will correspond to the submit button
        itself. The default handler does nothing.

    .. py:method:: handle_textarea_change(self, value)

        Called when the user the user changes the contents of a textarea DOM
        element on the front of the tile. ``value`` is the new content of
        the textarea. The default handler does nothing.

.. category_end