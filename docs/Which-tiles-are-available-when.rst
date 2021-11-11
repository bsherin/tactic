Tile Availability and Loading
=============================

If you open up a project window, the tile menus will be populated by
a subset of the tiles from your library. The basic idea is that the tiles that appear in those menus
are the ones that are currenlty *loaded*. In fact, this is all that it means for a tile to be loaded; i.e.,
if a tile is loaded, then it appears in the tile menus at the top of a project.

.. note::

    Actually, when Tactic loads a tile, it first makes sure that it can successfully load it in a container. If it can't
    then the tile won't be loaded.

When you first log in, Tactic automatically loads all of the tiles with the tag **default**.
So you can control your default set by adding or removing this tag from your tile modules.

You can manage the loaded tiles from the tile pane of your library. Loaded tiles have an up arrow. You can use the
:guilabel:`load` menu to manually load and unload individual tiles. You can also reset the set of loaded tiles
to just the tiles with the default tag. Any loaded tile is immediately available universally,
across all of your open projects, or in any new project windows you open.

It's also possible to load a tile from the `Tile Creator <Tile-Creator.html>`__ or `Module
Viewer <Module-Viewer.html>`__.

.. note::
    If you load a tile, and an existing tile has the same name, then the old
    tile will be overwritten.

    Also note: The name of a tile comes from the
    name of the tile *class*, not the name of the module. If you create your tiles
    using the Tile Creator, then the name of the module and the class will always be the
    same. However, if you use the module viewer, the name of the tile class need not be the
    same as the containing module. In fact, it is even possible to have multiple tile classes
    within a single module.

Suppose you **edit a previously loaded tile** in the module viewer, then
click “save and load.” In that case, any new versions of this tile will
have the new version of the code. Existing tiles in open projects will not be modified internally.
However, the tile will turn a very ugly color to signal that the tile isn't up to date.

At that point, if you click the :guilabel:`reload` icon at the top right of a tile (just
to the left of the trash can), then the tile will refresh itself using
whatever current version of the code is. When it does this, it will
assume that the options and their values stay the same. If an edit to
the tile’s code changed the options, then the reload button will cause
the tile to display the options for you to edit before running the tile.
