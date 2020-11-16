from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
from matplotlib.colors import LinearSegmentedColormap, ListedColormap
from matplotlib.colors import Normalize as mpl_Normalize
from matplotlib.cm import get_cmap, ScalarMappable, register_cmap, datad
import uuid
import io
import os

color_palette_names = [m for m in datad if not m.endswith("_r")]

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
    color_palette_names.append(spec[0])

tableau20 = [(31, 119, 180), (174, 199, 232), (255, 127, 14), (255, 187, 120),
             (44, 160, 44), (152, 223, 138), (214, 39, 40), (255, 152, 150),
             (148, 103, 189), (197, 176, 213), (140, 86, 75), (196, 156, 148),
             (227, 119, 194), (247, 182, 210), (127, 127, 127), (199, 199, 199),
             (188, 189, 34), (219, 219, 141), (23, 190, 207), (158, 218, 229)]

# Tableau Color Blind 10
tableau20blind = [(0, 107, 164), (255, 128, 14), (171, 171, 171), (89, 89, 89),
                  (95, 158, 209), (200, 82, 0), (137, 137, 137), (163, 200, 236),
                  (255, 188, 121), (207, 207, 207)]

standard = ['#005824', '#1A693B', '#347B53', '#4F8D6B', '#699F83', '#83B09B', '#9EC2B3', '#B8D4CB', '#D2E6E3',
            '#EDF8FB', '#FFFFFF', '#F1EEF6', '#E6D3E1', '#DBB9CD', '#D19EB9', '#C684A4', '#BB6990', '#B14F7C',
            '#A63467', '#9B1A53', '#91003F']

# Rescale to values between 0 and 1
for i in range(len(tableau20)):
    r, g, b = tableau20[i]
    tableau20[i] = (r / 255., g / 255., b / 255.)

for i in range(len(tableau20blind)):
    r, g, b = tableau20blind[i]
    tableau20blind[i] = (r / 255., g / 255., b / 255.)

register_cmap(cmap=ListedColormap(tableau20, name="tableau20"))
color_palette_names.append("tableau20")
register_cmap(cmap=ListedColormap(tableau20blind, name="tableau20blind"))
color_palette_names.append("tableau20blind")

register_cmap(cmap=ListedColormap(standard, name="standard"))
color_palette_names = sorted(color_palette_names)
color_palette_names.sort()
color_palette_names = ["standard"] + color_palette_names

PPI = int(os.environ["PPI"])


class MplFigure(Figure):
    # kwargs for mplfigure are same as matplotlib Figure
    def __init__(self, **kwargs):
        # self.ppi = self._tworker.ppi
        self.use_svg = self._tworker.use_svg
        self.user_set_facecolor = False
        if "figsize" not in kwargs:
            kwargs["figsize"] = (self.width / PPI, self.height / PPI)
        Figure.__init__(self, **kwargs)
        self.canvas = FigureCanvas(self)  # it was necessary to add this in Python 3
        self.kwargs = kwargs

    def draw_plot(self):
        print("draw_plot not implemented")
        return

    def init_mpl_figure(self, **kwargs):
        MplFigure.__init__(self, **kwargs)

    def convert_figure_to_img(self):
        FigureCanvas(self)  # This does seem to be necessary or savefig won't work.
        img_file = io.BytesIO()
        self.savefig(img_file)
        img_file.seek(0)
        img = img_file.getvalue()
        return img

    def create_figure_html(self, use_svg=True):
        self._tworker.use_svg = use_svg
        FigureCanvas(self)  # This does seem to be necessary or savefig won't work.
        if use_svg:
            img_file = io.StringIO()
            self.savefig(img_file, format="svg", facecolor=self.get_facecolor())
            img_file.seek(0)
            the_html = img_file.read()
        else:
            img_file = io.BytesIO()
            self.savefig(img_file, facecolor=self.get_facecolor())
            img_file.seek(0)
            figname = str(uuid.uuid4())
            self.img_dict[figname] = img_file.getvalue()
            fig_url = self.base_figure_url + figname
            image_string = "<img class='output-plot' src='{}' lt='Image Placeholder'>"
            the_html = image_string.format(fig_url)
        return the_html

    def create_pyplot_html(self, use_svg=True):
        import matplotlib.pyplot as plt
        self._tworker.use_svg = use_svg
        if use_svg:
            img_file = io.StringIO()
            plt.gcf().savefig(img_file, format="svg", facecolor=self.get_facecolor())
            img_file.seek(0)
            the_html = img_file.read()
        else:
            img_file = io.BytesIO()
            plt.gcf().savefig(img_file, facecolor=self.get_facecolor())
            img_file.seek(0)
            figname = str(uuid.uuid4())
            self.img_dict[figname] = img_file.getvalue()
            fig_url = self.base_figure_url + figname
            image_string = "<img class='output-plot' src='{}' lt='Image Placeholder'>"
            the_html = image_string.format(fig_url)
        return the_html


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

        points = [(x, y) for x in range(len(text_to_comp))
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


class ColorMapper(object):
    def __init__(self, bottom_val, top_val, color_palette_name):
        cnorm = mpl_Normalize(vmin=bottom_val, vmax=top_val)
        comap = get_cmap(color_palette_name)
        self.scalar_map = ScalarMappable(norm=cnorm, cmap=comap)

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
