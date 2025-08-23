import uuid
import copy
import sys
import nltk
import pandas as _pd

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


# noinspection PyProtectedMember
class Widget(object):
    extra_fields = ["style"]
    defaults = {}

    def __init__(self, wdata, runner_type="tile", runner_id=None):
        self.uid = "a" + str(uuid.uuid4())
        self.runner_type = runner_type
        self.runner_id = runner_id
        self.widget_data = {}
        self.base_render = {"is_widget": True, "widgetKind": self.widget_kind, "uid": self.uid}
        self.initialize(wdata)
        return

    def __repr__(self):
        return f"Widget(name={self.widget_kind})"

    def initialize(self, wdata):
        self._value = wdata.get("value", None)
        for attr in self.extra_fields:
            if attr in wdata:
                setattr(self, attr, wdata[attr])
            elif attr in self.defaults:
                setattr(self, attr, self.defaults[attr])
            else:
                setattr(self, attr, None)
        on_change_func = wdata.get("on_change", None)
        if on_change_func is not None:
            self.on_change = on_change_func.__name__
            self.is_method = is_class_method(on_change_func)
        else:
            self.on_change = None
            self.is_method = False
        return

    def set(self, widget_data):
        for attr in self.extra_fields:
            if attr in widget_data:
                setattr(self, attr, widget_data[attr])
        if "value" in widget_data:
            self._value = widget_data["value"]
        rdict = self.base_render.copy()
        rdict["widgetData"] = self.widget_data_dict()
        if self.runner_type == "console":
            rdict["console_id"] = self.runner_id
            Tile.emit_console_message("consoleWidgetUpdate", rdict)
        else:
            rdict["tile_id"] = self.runner_id
            Tile._tworker.emit_tile_message("tileWidgetUpdate", rdict)
        if "value" in widget_data:
            if self.on_change is not None:
                if self.is_method:
                    getattr(Tile, self.on_change)(self._value)
                else:
                    if in_pseudo_tile:
                        getattr(sys.modules["pseudo_tile_base"], self.on_change)(self._value)
                    else:
                        getattr(sys.modules["tile_env"], self.on_change)(self._value)

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

class SliderWidget(Widget):
    widget_kind = "slider"
    extra_fields = ["min", "max", "stepSize", "labelStepSize", "style"]
    defaults = {"min": 0, "max": 10, "stepSize": 1, "labelStepSize": 1, "style": None}

class TextWidget(Widget):
    widget_kind = "text"
    extra_fields = ["ellipsize", "style"]
    defaults = {"ellipsize": True, "style": None}

class JavascriptWidget(Widget):
    widget_kind = "javascript"
    extra_fields = ["style"]
    defaults = {"style": None}

class RawHtmlWidget(Widget):
    widget_kind = "rawHtml"
    extra_fields = ["style"]
    defaults = {"style": None}


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
    "raw_html": RawHtmlWidget,
    "javascript": JavascriptWidget,

}