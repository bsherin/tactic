import uuid
import copy
import sys
import nltk
import pandas as _pd

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

class Widget(object):

    def __init__(self, wdata, tile):
        self.uid = str(uuid.uuid4())
        self.widget_data = None
        self.base_render = {"is_widget": True, "widget_kind": self.widget_kind, "uid": self.uid}
        self.tile = tile
        self.initialize(wdata)
        return

    def __repr__(self):
        return f"Widget(name={self.name})"

    def initialize(self, data):
        return

    def set(self, data):
        return

    def get(self, data):
        return


MAX_TABLE_SIZE = 1000
INITIAL_TABLE_ROWS = 25

class TableWidget(Widget):
    widget_kind = "table"
    def initialize(self, wdata):
        self.widget_data = self.convert_data_to_dlist(wdata, max_rows=MAX_TABLE_SIZE)

    def get(self, data):
        return self.widget_data[:data["nrows"]]

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

    def render(self, nrows=INITIAL_TABLE_ROWS):
        """
        Render the table widget data.
        """
        rdict = self.base_render.copy()
        rdict["widget_data"] = self.widget_data[:nrows]
        return rdict

    def show(self, nrows=INITIAL_TABLE_ROWS):
        new_data = copy.copy(sys.stdout.data)
        new_data.update(self.render(nrows))
        new_data["force_open"] = True
        new_data["console_message"] = "consoleCodeWidget"
        new_data["counter"] = sys.stdout.counter
        self.tile.emit_console_message("consoleCodeWidget", new_data)
        return


kind_dict = {
    "table": TableWidget
}