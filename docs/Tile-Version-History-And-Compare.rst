History and Compare
===================

Version History
---------------

There is now machinery built into Tactic that helps you to look at and
use code from earlier versions of a tile. This is partly automatic and
partly manual. First the manual part: In the Module Viewer and Tile
Creator there is now a button that lets you set a checkpoint. Clicking on of
this buttons saves the tile as usual. But it also will causes Tactic to
permanently save a snapshot of the tile code as it appears at the moment
of the save.

.. figure:: images/bpsave_and_checkpoint.png

Tactic also tries to do some semi-intelligent saving of snapshots
automatically. Every time that a tile is saved, Tactic will save a
snapshot of the tile. However, this set of automatically generated
snapshots is regularly pruned in a particular way: Every time that a
tile is opened in the Module Viewer or the Tile Creator, Tactic looks at
all snapshots that are older than one day ago, and it only keeps the
last version of a tile that was saved on a given day. So you’ll only end
up with at most one snapshot of a tile per day. This pruning doesn’t
affect manually created snapshots.

Anyway, that is what I tried to make it do. If you ever find out whether it
follows this protocol, let me know. I'm sort of curious.

.. figure:: images/bpshow_history_viewer.png

To access the history, you click the **History** button in one of the
tile viewers. When the history viewer appears, this is what it looks like, in all it’s glory.

.. figure:: images/bphistory_viewer.png

The popup list at the top right allows you to browse through old
versions of the tile. Differences are highlighted and you can copy code
from old versions to the current tile. (You have to click Save button for any
changes to be saved. It's the single toolbar button that appears..)

Compare Tiles
-------------

You can also compare two tiles. Clicking on the **Compare** button
brings up a window that is similar to the history viewer.

.. figure:: images/bpshow_compare_viewer.png

The compare viewer looks and operates very similary to the history viewer.
So I won't insult your intelligence by explaining it here. In fact, you probably
could have figured out the history viewer without any documentation. I guess if your
time was all that valuable you wouldn't still be reading this paragraph.
So I don't feel too bad.