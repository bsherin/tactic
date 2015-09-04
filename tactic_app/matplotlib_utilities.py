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