__author__ = 'bls910'
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
import StringIO


class GraphList(Figure):
    def __init__ (self, value_list, xlabels=None, title=None):
        Figure.__init__(self, figsize=(12, 5))
        ax = self.add_subplot(111)
        self.subplots_adjust(left=.05, bottom=.15, right=.98, top=.95)
        ax.grid(True)
        x = range(1, len(value_list) + 1)
        ax.plot(x, value_list, 'bo')
        if xlabels is not None:
            ax.set_xticks(x)
            ax.set_xticklabels(xlabels, rotation='vertical')
        if title is not None:
            ax.set_title(title, fontsize=10)


def convert_figure_to_img(fig):
    canvas=FigureCanvas(fig) # This does seem to be necessary or savefig won't work.
    img = StringIO.StringIO()
    fig.savefig(img)
    img.seek(0)
    return img


class ColorMapper():
    def __init__ (self, top_val, bottom_val):
        self.top_val = top_val
        self.bottom_val = bottom_val
        self.val_range = top_val - bottom_val
        self.mid_point = self.bottom_val + self.val_range / 2.0

    def rgb_to_hex(self, rgb):
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