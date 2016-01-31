from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
from matplotlib.colors import LinearSegmentedColormap
from matplotlib.colors import Normalize as mpl_Normalize
from matplotlib.cm import get_cmap, ScalarMappable, register_cmap, datad
import numpy
# import pylab
import StringIO

color_map_specs = [["Yellows", {'red': [(0.0, 0.0, 1.0), (1.0,  1.0, 1.0)],
                                'green': [(0.0, 0.0, 1.0), (1.0, 1.0, 1.0)],
                                'blue': [(0.0, 0.0, 1.0), (1.0, 0.0, 0.0)]}],
                   ["NeonPurples", {'red': [(0.0, 0.0, 1.0), (1.0, 1.0, 1.0)],
                                    'green': [(0.0, 0.0, 1.0), (1.0, 0.0, 1.0)],
                                    'blue': [(0.0, 0.0, 1.0), (1.0, 1.0, 0.0)]}],
                   ["LightBlues", {'red': [(0.0, 1.0, 1.0), (1.0,  0.0, 1.0)],
                                   'green': [(0.0, 1.0, 1.0), (1.0, 1.0, 1.0)],
                                   'blue': [(0.0, 1.0, 1.0), (1.0, 1.0, 0.0)]}],
                   ["NeonBlues", {'red': [(0.0, 1.0, 1.0), (1.0,  0.25, 1.0)],
                                  'green': [(0.0, 1.0, 1.0), (1.0, .25, 1.0)],
                                  'blue': [(0.0, 1.0, 1.0), (1.0, 1.0, 0.0)]}],
                   ["NeonGreens", {'red': [(0.0, 0.0, 1.0), (1.0,  .25, 1.0)],
                                   'green': [(0.0, 0.0, 1.0), (1.0, 1.0, 1.0)],
                                   'blue': [(0.0, 0.0, 1.0), (1.0, .25, 0.0)]}],
                   ["Browns", {'red': [(0.0, 0.0, 1.0), (1.0,  .7, 1.0)],
                               'green': [(0.0, 0.0, 1.0), (1.0, .45, 1.0)],
                               'blue': [(0.0, 0.0, 1.0), (1.0, .25, 0.0)]}]]

for spec in color_map_specs:
    register_cmap(cmap=LinearSegmentedColormap(spec[0], spec[1]))

color_palette_names = sorted(m for m in datad if not m.endswith("_r"))


class MplFigure(Figure):
    # kwargs for mplfigure are dpi and title
    def __init__(self, data, width, height,  **kwargs):
        if "dpi" in kwargs:
            dpi = kwargs["dpi"]
        else:
            dpi = 80
        if ("title" in kwargs):
            title = kwargs["title"]
        else:
            title = None
        Figure.__init__(self, figsize=(width / dpi, height / 80), dpi=dpi)
        self.width = width
        self.height = height
        self.title = title
        self.dpi = dpi
        self.data = data
        self.kwargs = kwargs
        self.draw_plot()
        self.img = self.convert_figure_to_img()

    def draw_plot(self):
        print "draw_plot not implemented"
        return

    def convert_figure_to_img(self):
        canvas=FigureCanvas(self) # This does seem to be necessary or savefig won't work.
        img_file = StringIO.StringIO()
        self.savefig(img_file)
        img_file.seek(0)
        img = img_file.getvalue()
        return img

class GraphList(MplFigure):
    def draw_plot(self):
        value_list = self.data
        ax = self.add_subplot(111)
        # self.subplots_adjust(left=.05, bottom=.15, right=.98, top=.95)
        ax.grid(True)
        x = range(1, len(value_list) + 1)
        ax.plot(x, value_list, 'bo')
        if "xlabels" in self.kwargs:
            ax.set_xticks(x)
            ax.set_xticklabels(self.kwargs["xlabels"], rotation='vertical')
        if self.title is not None:
            ax.set_title(self.title, fontsize=10)
        self.tight_layout()
        return

class DispersionPlot(MplFigure):
    def draw_plot(self):
        text = self.data[0]
        words = self.data[1]
        ax = self.add_subplot(111)

        text = list(text)
        text = list(map(str, text))  # deals with there being unicode
        words = list(map(str, words))
        words.reverse()
        words_to_comp = list(map(str.lower, words))
        text_to_comp = list(map(str.lower, text))

        points = [(x,y) for x in range(len(text_to_comp))
                for y in range(len(words_to_comp))
                if text_to_comp[x] == words_to_comp[y]]

        if len(points) > 0:
            x, y = list(zip(*points))
            ax.plot(x, y, "b|", scalex=.1)
            ax.set_yticks(range(len(words)))
            ax.set_yticklabels(words)
            ax.set_ylim(-1, len(words))
        self.tight_layout()
        return

class ColorMapper():
    def __init__ (self, bottom_val, top_val, color_palette_name):
        cNorm = mpl_Normalize(vmin=bottom_val, vmax=top_val)
        comap = get_cmap(color_palette_name)
        self.scalar_map = ScalarMappable(norm = cNorm, cmap = comap)

    @staticmethod
    def rgb_to_hex(rgb):
        res = tuple([int(c * 255) for c in rgb])
        return '#%02x%02x%02x' % res

    def color_from_val(self, val):
        return self.rgb_to_hex(self.scalar_map.to_rgba(val)[:3])

class ImageShow(MplFigure):
    def draw_plot(self):
        ax = self.add_subplot(111)
        ax.imshow(self.data)
        ax.axis("off")
        self.tight_layout()
        return

class ArrayHeatmap(MplFigure):
    def draw_plot(self):
        self.dialogs = []
        the_array = self.data
        palette_name = self.kwargs["palette_name"]
        (nrows, ncols) = the_array.shape
        ax = self.add_subplot(111)
        if "title" in self.kwargs:
            ax.set_title(self.kwargs["title"], fontsize=10)
        if "value_range" is self.kwargs:
            cax = ax.imshow(the_array, cmap=get_cmap(palette_name), aspect="auto", interpolation='nearest',
                            vmin=self.kwargs["value_range"][0], vmax=self.kwargs["value_range"][1])
        else:
            cax = ax.imshow(the_array, cmap=get_cmap(palette_name), aspect="auto", interpolation='nearest')

        ind = numpy.arange(ncols)

        if "xticks" in self.kwargs:
            ax.set_xticks(self.kwargs["xticks"])
        else:
            ax.set_xticks(ind, minor=False)
            ax.set_xticks(ind + .5, minor=True)
        if "xlabels" in self.kwargs:
            ax.get_xaxis().set_ticklabels(self.kwargs["xlabels"], size="x-small", rotation="vertical")
        else:
            ax.get_xaxis().set_ticklabels(ind + 1, size="x-small")

        ind = numpy.arange(nrows)

        if "yticks" in self.kwargs:
            ax.set_yticks(self.kwargs["yticks"])
        else:
            ax.set_yticks(ind, minor=False)
            ax.set_yticks(ind + .5, minor=True)
        if "ylabels" in self.kwargs:
            ax.get_yaxis().set_ticklabels(self.kwargs["ylabels"], size="x-small", rotation="horizontal")
        else:
            ax.get_yaxis().set_ticklabels(ind + 1, size="x-small")

        ax.grid(True, which='minor', linestyle='-')

        cbar = self.colorbar(cax)
        # self.subplots_adjust(left=.12, bottom=.25, right=.99, top=.95)
        self.set_facecolor("white")
        self.tight_layout()
        return

