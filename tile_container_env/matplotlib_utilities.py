from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
from matplotlib.colors import LinearSegmentedColormap, ListedColormap
from matplotlib.colors import Normalize as mpl_Normalize
import warnings
import matplotlib
matplotlib.use("Agg")
with (warnings.catch_warnings()):
    warnings.simplefilter("ignore")
    # get_cmap = matplotlib.cm.ColormapRegistry.get_cmap
    register_cmap = matplotlib.colormaps.register
    from matplotlib.cm import datad, ScalarMappable

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


class ColorMapper(object):
    def __init__(self, bottom_val, top_val, color_palette_name):
        cnorm = mpl_Normalize(vmin=bottom_val, vmax=top_val)
        comap = matplotlib.colormaps[color_palette_name]
        self.scalar_map = ScalarMappable(norm=cnorm, cmap=comap)

    @staticmethod
    def rgb_to_hex(rgb):
        res = tuple([int(c * 255) for c in rgb])
        return '#%02x%02x%02x' % res

    def color_from_val(self, val):
        return self.rgb_to_hex(self.scalar_map.to_rgba(val)[:3])

