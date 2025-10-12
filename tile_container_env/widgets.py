import uuid
import io
import os
import copy
import sys
import nltk
import pandas as _pd

PPI = 100

Tile = None
in_pseudo_tile = False

from other_api_mixin import nltk_available
from document_object import TacticDocument

if nltk_available:
    html_table_classes = [_pd.DataFrame, nltk.FreqDist, dict, _pd.Series, list, TacticDocument]
else:
    html_table_classes = [_pd.DataFrame, dict, _pd.Series, list, TacticDocument]

def is_html_table_class(obj):
    return any(isinstance(obj, cls) for cls in html_table_classes)

def is_widget_render(x):
    return type(x) == dict and "is_widget" in x and x["is_widget"] is True

def to_camel_case(s: str) -> str:
    if s == "float":
        return "cssFloat"
    parts = s.split("-")
    return parts[0] + "".join(word.capitalize() for word in parts[1:])

def to_react_style(style):
    if type(style) == dict:
        return {to_camel_case(k): v for k, v in style.items()}
    return style


# noinspection PyProtectedMember
class Widget(object):
    extra_fields = ["style"]
    function_fields = ["on_change", "on_click"]
    defaults = {}

    def __init__(self, wdata, runner_type="tile", runner_id=None):
        self.widgetId = "a" + str(uuid.uuid4())
        self.runner_type = runner_type
        self.runner_id = runner_id
        self.widget_data = {}
        self.base_render = {"is_widget": True, "widgetKind": self.widget_kind, "widgetId": self.widgetId}
        self.initialize(wdata)
        return

    def __repr__(self):
        return f"Widget(name={self.widget_kind})"

    def initialize(self, wdata):
        self._value = wdata.get("value", None)
        for attr in self.extra_fields:
            if attr in wdata:
                if attr == "style":
                    setattr(self, attr, to_react_style(wdata[attr]))
                else:
                    setattr(self, attr, wdata[attr])
            elif attr in self.defaults:
                setattr(self, attr, self.defaults[attr])
            else:
                setattr(self, attr, None)

        for ffield in self.function_fields:
            func = wdata.get(ffield, None)
            if func is not None:
                setattr(self, ffield, func.__name__)
                setattr(self, f"{ffield}_is_method", is_class_method(func))
            else:
                setattr(self, ffield, None)
                setattr(self, f"{ffield}_is_method", False)

        return

    def set(self, widget_data):
        for attr in self.extra_fields:
            if attr in widget_data:
                if attr == "style":
                    setattr(self, attr, to_react_style(widget_data[attr]))
                else:
                    setattr(self, attr, widget_data[attr])
        if "value" in widget_data:
            self._value = widget_data["value"]
        rdict = self.base_render.copy()
        rdict["widgetData"] = self.widget_data_dict()
        if self.runner_type == "console":
            rdict["console_id"] = self.runner_id
            Tile.emit_console_message("consoleWidgetUpdate", rdict)
        elif self.runner_type == "export_viewer":
            Tile.emit_export_viewer_message("exportViewerWidgetUpdate", rdict)
        else:
            rdict["tile_id"] = self.runner_id
            Tile._tworker.emit_tile_message("tileWidgetUpdate", rdict)
        if "value" in widget_data:
            if self.on_change is not None:
                if self.on_change_is_method:
                    getattr(Tile, self.on_change)(self._value)
                else:
                    if in_pseudo_tile:
                        getattr(sys.modules["pseudo_tile_base"], self.on_change)(self._value)
                    else:
                        getattr(sys.modules["tile_env"], self.on_change)(self._value)

    def action(self, value=None):
        if self.on_click is not None:
            if self.on_click_is_method:
                getattr(Tile, self.on_click)(value)
            else:
                if in_pseudo_tile:
                    getattr(sys.modules["pseudo_tile_base"], self.on_click)(value)
                else:
                    getattr(sys.modules["tile_env"], self.on_click)(value)

    def get(self, data):
        self.widget_data_dict()
        return

    def widget_data_dict(self):
        res = {"value": self.value}
        for attr in self.extra_fields:
            res[attr] = getattr(self, attr, None)
        return res

    def render(self):
        rdict = self.base_render.copy()
        rdict["widgetData"] = self.widget_data_dict()
        return rdict

    @property
    def value(self):
        return self._value

    @value.setter
    def value(self, new_value):
        self.set({"value": new_value})
        return

    def show(self):
        new_data = copy.copy(sys.stdout.data)
        new_data.update(self.render())
        self.runner_id = new_data["console_id"]
        new_data["force_open"] = True
        new_data["console_message"] = "consoleCodeWidget"
        new_data["counter"] = sys.stdout.counter
        sys.stdout.counter += 1
        Tile.emit_console_message("consoleCodeWidget", new_data)
        return

def is_class_method(func):
    qn = getattr(func, '__qualname__', '')
    return '.' in qn

class ButtonWidget(Widget):
    widget_kind = "button"
    extra_fields = ["text", "fill", "icon", "variant", "style"]
    defaults = {"text": "Button", "fill": False, "icon": None, "variant": "solid", "style": None}


class InputWidget(Widget):
    widget_kind = "input"
    extra_fields = ["fill", "label", "inline", "style"]
    defaults = {"fill": False, "label": "", "inline": False, "style": None}

    def initialize(self, wdata):
        super().initialize(wdata)
        if "on_change" not in wdata:
            self.on_change = None

class SliderWidget(Widget):
    widget_kind = "slider"
    extra_fields = ["min", "max", "stepSize", "labelStepSize", "style"]
    defaults = {"min": 0, "max": 10, "stepSize": 1, "labelStepSize": 1, "style": None}

    def initialize(self, wdata):
        super().initialize(wdata)
        if "on_change" not in wdata:
            self.on_change = None

class SwitchWidget(Widget):
    widget_kind = "switch"
    extra_fields = ["label", "style"]
    defaults = {"label": "switch", "style": None}

    def initialize(self, wdata):
        super().initialize(wdata)
        if self._value is None:
            self._value = False
        if "on_change" not in wdata:
            self.on_change = None

class SelectWidget(Widget):
    widget_kind = "select"
    extra_fields = ["label", "style", "options"]
    defaults = {"label": "select", "style": None, "options": []}

    def initialize(self, wdata):
        super().initialize(wdata)
        if "on_change" not in wdata:
            self.on_change = None

class TextWidget(Widget):
    widget_kind = "text"
    extra_fields = ["ellipsize", "style"]
    defaults = {"ellipsize": True, "style": None}

class JavascriptWidget(Widget):
    widget_kind = "javascript"
    extra_fields = ["style", "code"]
    defaults = {"style": None}

class RawHtmlWidget(Widget):
    widget_kind = "rawHtml"
    extra_fields = ["style"]
    defaults = {"style": None}

class IframeWidget(Widget):
    widget_kind = "iframe"
    extra_fields = ["style"]
    defaults = {"style": None}

class Box(Widget):
    widget_kind = "box"
    extra_fields = ["style", "widgets"]
    defaults = {"style": None}

class MatplotlibWidget(Widget):
    widget_kind = "matplotlib"
    extra_fields = ["style", "use_svg"]
    defaults = {"style": None, "use_svg": True}

    _FigureCanvasAgg = None

    def _get_canvas_class(self):
        if self._FigureCanvasAgg is None:
            from matplotlib.backends.backend_agg import FigureCanvasAgg
            self._FigureCanvasAgg = FigureCanvasAgg
        return self._FigureCanvasAgg

    def initialize(self, wdata):
        from matplotlib_utilities import Figure
        from matplotlib.backends.backend_agg import FigureCanvasAgg
        super().initialize(wdata)

        self.fig = Figure(**wdata)
        if "figsize" not in wdata:
            self.size_to_tile()
        self.canvas = self._get_canvas_class()(self.fig)  # it was necessary to add this in Python 3

    def set_html(self):
        self._get_canvas_class()(self.fig)  # This does seem to be necessary or savefig won't work.
        if self.use_svg:
            img_file = io.StringIO()
            self.fig.savefig(img_file, format="svg", facecolor=self.fig.get_facecolor())
            img_file.seek(0)
            the_html = img_file.read()
        else:
            img_file = io.BytesIO()
            self.fig.savefig(img_file, facecolor=self.fig.get_facecolor())
            img_file.seek(0)
            figname = str(uuid.uuid4())
            Tile.img_dict[figname] = img_file.getvalue()
            fig_url = self.base_figure_url + figname
            image_string = "<img class='output-plot' src='{}' lt='Image Placeholder'>"
            the_html = image_string.format(fig_url)
        self.value = the_html
        return

    def size_to_tile(self):
        self.fig.set_size_inches(Tile.width / PPI, Tile.height / PPI)
        return

    def widget_data_dict(self):
        return {
            "value": self._value,
            "use_svg": self.use_svg,
            "style": self.style,
        }

MAX_TABLE_SIZE = 1000
INITIAL_TABLE_ROWS = 25

class TableWidget(Widget):
    widget_kind = "table"
    extra_fields = ["style", "className", "maxColumnWidth", "maxRows", "expandRows"]
    defaults = {
        "maxColumnWidth": None,
        "maxRows": INITIAL_TABLE_ROWS,
        "expandRows": False,
        "className": "",
        "style": {},
    }
    def initialize(self, wdata):
        super().initialize(wdata)
        if self._value is None:
            self._value = []
        else:
            self._value = self.convert_data_to_dlist(self._value, max_rows=MAX_TABLE_SIZE)

    def widget_data_dict(self):
        return {
            "value": self._value[:self.maxRows],
            "expandRows": self.expandRows,
            "maxRows": self.maxRows,
            "maxColumnWidgth": self.maxColumnWidth,
            "className": self.className,
            "style": self.style,
            "availableRows": min(len(self._value), MAX_TABLE_SIZE),
        }

    @staticmethod
    def convert_df_to_dictlist(df, max_rows=None):
        if max_rows is not None:
            new_df = df.head(max_rows)
        else:
            new_df = df
        new_df = new_df.astype(str)
        return new_df.to_dict(orient='records')

    def convert_data_to_dlist(self, data, max_rows=100):
        if isinstance(data, _pd.DataFrame):
            dlist = self.convert_df_to_dictlist(data, max_rows)
        elif isinstance(data, list) and isinstance(data[0], dict):
            df = _pd.DataFrame(data)
            dlist = self.convert_df_to_dictlist(df, max_rows)
        elif isinstance(data, TacticDocument):
            df = data.df
            # delete column "__filenamee__" if it exists
            df = df.drop(columns=["__filename__"], errors='ignore')
            dlist = self.convert_df_to_dictlist(df, max_rows)
        elif isinstance(data, nltk.FreqDist):
            dlist = [["word", "freq"]] + data.most_common(max_rows)
        elif isinstance(data, dict):
            dlist = []
            for key, the_val in data.items():
                dlist.append({"key": key, "value": str(the_val)})
            dlist = dlist[:max_rows]
        elif isinstance(data, list):
            dlist = [{"value": str(val)} for val in data[:max_rows]]
        elif isinstance(data, _pd.Series):
            ddict = dict(data)
            dlist = []
            for n, key, the_val in enumerate(ddict.items()):
                if k > max_rows:
                    break
                dlist.append({"key": key, "value": str(the_val)})
        else:
            dlist = data
        return dlist


kind_dict = {
    "table": TableWidget,
    "slider": SliderWidget,
    "text": TextWidget,
    "html": RawHtmlWidget,
    "iframe": IframeWidget,
    "javascript": JavascriptWidget,
    "button": ButtonWidget,
    "switch": SwitchWidget,
    "select": SelectWidget,
    "input": InputWidget,
    "matplotlib": MatplotlibWidget,
    "box": Box,

}