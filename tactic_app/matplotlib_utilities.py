__author__ = 'bls910'
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
import StringIO

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
    def __init__ (self, top_val, bottom_val):
        self.top_val = top_val
        self.bottom_val = bottom_val
        self.val_range = top_val - bottom_val
        self.mid_point = self.bottom_val + self.val_range / 2.0

    @staticmethod
    def rgb_to_hex(rgb):
        return '#%02x%02x%02x' % rgb

    def rgb_color_from_val(self, val):
        if val >= self.top_val:
            return (0, 255, 0)
        elif val <= self.bottom_val:
            return (255, 0, 0)
        else:
            if val >= self.mid_point:
                fract = 2 * (val - self.mid_point) / self.val_range
                green_part = 255
                red_part = int(255 * (1 - fract))
                blue_part = red_part
            else:
                fract = 2 * (self.mid_point - val) / self.val_range
                red_part = 255
                green_part = int(255 * (1 - fract))
                blue_part = green_part
            return (red_part, green_part, blue_part)

    def color_from_val(self, val):
        return self.rgb_to_hex(self.rgb_color_from_val(val))