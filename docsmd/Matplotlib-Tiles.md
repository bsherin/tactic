# Matplotlib Tiles

Tactic includes support for building tiles that display matplotlib images. Every Matplotlib tile must have the minimum elements shown here:

``` python
    @user_tile
    class MyTile(TileBase, MplFigure):

        def draw_plot(self):
            self.init_mpl_figure()
            # user code here

        def render_content(self):
            self.draw_plot()
            return self.create_figure_html()
```

Notice that, unlike other tiles, matplotlib tiles must subclass both `TileBase` and `MplFigure`. 
`MplFigure` is a subclass of matplotlib's `Figure` class. 
In addition, every Matplotlib tile should have a method `draw_plot` that draws directly into the tile instance as it would a matplotlib figure. 
`render_content` can do other work, but it must call 'draw_plot', and then 'create_figure_html' to generate the html for the tile. 
Note that 'draw_plot' will also be called each time the user resizes the tile. 

The [Tile Creator](Tile-Creator#creating-matplotlib-tiles) knows how to deal with MatplotlibTiles.

In most cases, you'll want the first line of `draw_plot` to be [`self.init_mpl_figure()`](Tile-Commands#plots). This initializes the Figure class
and must be called at least once before drawing into the Figure. If you draw into the Figure without initializing again
then you'll be adding to an existing figure. So, since `draw_plot` is supposed to redraw the figure for new conditions
(i.e., a new tile size) you'll normally want to reinitialize at the top of `draw_plot`.

Here is example code for a tile that graphs a simple list of numbers:

```python
@user_tile
class ListPlotter(TileBase, MplFigure):
    category = "plot"
    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.value_list = None
        self.N = 20

    @property
    def options(self):
        return  [
            {"name": "value_list_source", "type": "pipe_select"},
            {"name": "N", "type": "int"}
        ]

    def draw_plot(self):
        MplFigure.__init__(self)
        ax = self.add_subplot(111)
        ax.grid(True)
        x = range(1, len(self.value_list) + 1)
        ax.plot(x, self.value_list, 'bo')
        ax.set_xticks(x)
        self.tight_layout()
        return
    
    def render_content (self):
        self.value_list = self.get_pipe_value(self.value_list_source)[1:self.N]
        self.draw_plot()
        return self.create_figure_html()
```