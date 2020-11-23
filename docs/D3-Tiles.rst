D3 Tiles
========

Tactic includes support for building tiles that display interactive `D3
visualizations <https://www.d3js.org>`__. Really, the machinery is more
general than the ability to draw D3 visualizations; it provides a way to
write general javascript code to render the content of a tile.

Every Matplotlib tile must have the minimum elements shown here:

.. code:: python

        @user_tile
        class MyTile(D3Tile):
        
         def __init__(self, main_id, tile_id, tile_name=None):
            ....
            self.jscript = """function (selector, w, h, arg_dict) {
            }"""
            

        def render_content(self):
            ...
            return arg_dict

Unlike other tiles, D3 tiles must subclass ``D3tile``. Every D3Tile must
initialize an instance variable, ``self.jscript``. This must contain the
text of a javascript function of the form
``function (selector, w, h, arg_dict) {}``. ``selector`` is a string
that gives access to the html element where the content of the tile
should be placed. ``w`` and ``h`` are the width and height of the area
to be drawn into. ``arg_dict`` is a dictionary of arguments passed by
``render_content``

``render_content`` can do other work, but it must return a dictionary
that will be passed to the javascript function in the variable
``arg_dict``. If ``arg_dict`` contains a key ``styles``, then the
associated value will be added to the html of the tile within
``<style>`` tags.

Most of the time, you will `create and edit D3 tiles in the Tile
Creator <Tile-Creator.html#creating-d3-tiles>`__. That hides some of the
ugliness.

