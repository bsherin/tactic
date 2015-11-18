__author__ = 'bls910'
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
from matplotlib.colors import LinearSegmentedColormap
from matplotlib.colors import Normalize as mpl_Normalize
from matplotlib.cm import get_cmap, ScalarMappable
import pylab
import StringIO

color_map_specs = [["Yellows", {'red':[(0.0, 0.0, 1.0), (1.0,  1.0, 1.0)],
                                 'green': [(0.0, 0.0, 1.0), (1.0, 1.0, 1.0)],
                                 'blue': [(0.0, 0.0, 1.0), (1.0, 0.0, 0.0)]}],
                   ["NeonPurples", {'red':[(0.0, 0.0, 1.0), (1.0, 1.0, 1.0)],
                                    'green': [(0.0, 0.0, 1.0), (1.0, 0.0, 1.0)],
                                    'blue': [(0.0, 0.0, 1.0), (1.0, 1.0, 0.0)]}],
                   ["LightBlues",{'red':[(0.0, 1.0, 1.0), (1.0,  0.0, 1.0)],
                                    'green': [(0.0, 1.0, 1.0), (1.0, 1.0, 1.0)],
                                    'blue': [(0.0, 1.0, 1.0), (1.0, 1.0, 0.0)]}],
                   ["NeonBlues",{'red':[(0.0, 1.0, 1.0), (1.0,  0.25, 1.0)],
                                    'green': [(0.0, 1.0, 1.0), (1.0, .25, 1.0)],
                                    'blue': [(0.0, 1.0, 1.0), (1.0, 1.0, 0.0)]}],
                   ["NeonGreens", {'red':[(0.0, 0.0, 1.0), (1.0,  .25, 1.0)],
                                   'green': [(0.0, 0.0, 1.0),(1.0, 1.0, 1.0)],
                                   'blue': [(0.0, 0.0, 1.0), (1.0, .25, 0.0)]}],
                   ["Browns", {'red':[(0.0, 0.0, 1.0), (1.0,  .7, 1.0)],
                               'green': [(0.0, 0.0, 1.0), (1.0, .45, 1.0)],
                               'blue': [(0.0, 0.0, 1.0), (1.0, .25, 0.0)]}]]

for spec in color_map_specs:
    pylab.register_cmap(cmap=LinearSegmentedColormap(spec[0], spec[1]))

color_palette_names = sorted(m for m in pylab.cm.datad if not m.endswith("_r"))

class MplFigure(Figure):
    ## kwargs for mplfigure are dpi and title
    def __init__ (self, data, width, height,  **kwargs):
        if ("dpi" in kwargs):
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
        img = StringIO.StringIO()
        self.savefig(img)
        img.seek(0)
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

# class ColorMapper():
#     def __init__ (self, top_val, bottom_val, top_color=(0, 255, 0), bottom_color=(255, 0, 0)):
#         self.top_val = top_val
#         self.bottom_val = bottom_val
#         self.val_width = top_val - bottom_val
#         self.val_range = top_val - bottom_val
#         self.bottom_color = bottom_color
#         self.top_color = top_color
#         self.mid_point = self.bottom_val + self.val_range / 2.0
#
#     @staticmethod
#     def rgb_to_hex(rgb):
#         return '#%02x%02x%02x' % rgb
#
#     def rgb_color_from_val(self, val):
#         if val >= self.top_val:
#             return self.top_color
#         elif val <= self.bottom_val:
#             return self.bottom_color
#         else:
#             color_list = []
#             frac = 1.0 * (val - self.bottom_val) / self.val_width
#             for i in range(0,3):
#                 top = self.top_color[i]
#                 bot = self.bottom_color[i]
#                 color_list.append(int(frac * (top - bot) + bot))
#             return (color_list[0], color_list[1], color_list[2])
#
#     def color_from_val(self, val):
#         return self.rgb_to_hex(self.rgb_color_from_val(val))