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

You can manually load additional tiles using the :guilabel:`load` button in your tile library,
or from the `Tile Creator <Tile-Creator.html>`__ or `Module
Viewer <Module-Viewer.html>`__. Any loaded tile is immediately available universally,
across all of your open projects, or in any new project windows you open.

.. note::
    If you load a tile, and an existing tile has the same name, then the old
    tile will be overwritten.

    Also note: The name of a tile comes from the
    name of the tile *class*, not the name of the module. If you create your tiles
    using the Tile Creator, then the name of the module and the class will always be the
    same. However, if you use the module viewer, the name of the tile class need not be the
    same as the containing module. In fact, it is even possible to have multiple tile classes
    within a single module.

If you go to your tile library, and click :guilabel:`unload`, this will unload
all of the tiles that were previously loaded and then it will reload all of the tiles
with the **default** tag..

This set of currently loaded tiles has an impact on what happens if you **save a project.** By
default, when you save a project, the project makes a note of all of the
tiles that are loaded in the user environment. Then, if the project is
loaded some time later, it will make sure that all of these tiles are
available in the user environment. If they are not, it will load them.
Note that it finds the tiles by name in your library, it does not use a
saved version of the tile code.

However, you can change some of this default behavior on a per-project basis.
When you first save a project, you will get a dialog that looks like
this:

|image0|

If you click the check box “Include only currently used tiles,” then
only the tiles actually used in the current project will be included in
the list of tiles to be loaded whenever the project is loaed.

Suppose you **edit a previously loaded tile** in the module viewer, then
click “save and load.” In that case, any new versions of this tile will
have the new version of the code. Existing tiles in open projects will not be modified.
However if you click the refresh icon at the top right of a tile (just
to the left of the trash can), then the tile will refresh itself using
whatever current version of the code is. When it does this, it will
assume that the options and their values stay the same. If an edit to
the tile’s code changed the options, then the refresh button will cause
the tile to display the options for you to edit before running the tile.

.. |image0| image:: imgs/883c05a2.png

