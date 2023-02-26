
from communication_utils import debinarize_python_object
# noinspection PyPackageRequirements
import pandas as _pd
import nltk
from document_object import TacticDocument, TacticRow, DetachedTacticRow
nltk.data.path.append("/root/resources/nltk_data")

import collections
import six


def iterable(arg):
    return (
        isinstance(arg, collections.abc.Iterable)
        and not isinstance(arg, six.string_types)
    )


class OtherAPIMIxin:

    # <editor-fold desc="Other">
    def gst(self):
        return self.get_selected_text()

    def get_selected_text(self):
        self._save_stdout()
        result = self._get_main_property("selected_text")
        self._restore_stdout()
        return result

    def display_message(self, message, force_open=True, is_error=False, summary=None):
        self.log_it(message, force_open, is_error, summary)
        return

    def dm(self, message, force_open=True, is_error=False, summary=None):
        self.log_it(message, force_open, is_error, summary)
        return

    def log_it(self, message, force_open=True, is_error=False, summary=None):
        self._save_stdout()
        self._tworker.post_task(self._main_id, "print_to_console_event", {"print_string": message,
                                                                          "force_open": force_open,
                                                                          "is_error": is_error,
                                                                          "summary": summary})
        self._restore_stdout()
        return

    def get_container_log(self):
        self._save_stdout()
        result = self._tworker.post_and_wait(self._main_id, "get_container_log", {"container_id": self._tworker.my_id})
        self._restore_stdout()
        return result["log_text"]

    def get_user_settings(self):
        self._save_stdout()
        result = self._tworker.post_and_wait("host", "get_user_settings", {"user_id": self.user_id})
        self._restore_stdout()
        return result["settings"]

    # noinspection PyPackageRequirements
    def create_bokeh_html(self, the_plot):
        from bokeh.embed import file_html
        from bokeh.resources import Resources
        return file_html(the_plot, Resources("inline"))

    def get_pipe_value(self, key_or_tile_name, export_name=None):
        self._save_stdout()
        tile_id = None
        if export_name is None:  # then assume the first argument is a pipe_key
            pipe_key = key_or_tile_name
            for(tile_id, tile_entry) in self._pipe_dict.items():
                if pipe_key in tile_entry:
                    tile_id = tile_entry[pipe_key]["tile_id"]
                    export_name = tile_entry[pipe_key]["export_name"]
                    break
            if export_name is None:
                self._restore_stdout()
                return None
        else:  # otherwise assume first argument is the tile name
            # noinspection PyProtectedMember
            tile_id = self.tiles[key_or_tile_name]._tile_id
        if tile_id == self._tworker.my_id:  # then this is a global from the pseudo_tile
            val = self._eval_name(export_name)
        else:
            result = self._tworker.post_and_wait(tile_id,
                                                 "_transfer_pipe_value",
                                                 {"export_name": export_name,
                                                  "requester_address": self.my_address},
                                                 timeout=60,
                                                 tries=self.RETRIES)
            encoded_val = result["encoded_val"]
            val = debinarize_python_object(encoded_val)
        self._restore_stdout()
        return val
    # </editor-fold>

    # <editor-fold desc="Odd utility methods">

    html_table_classes = [_pd.DataFrame, nltk.FreqDist, dict, _pd.Series, list, TacticDocument]

    def dict_to_list(self, the_dict):
        result = []
        for it in the_dict.values():
            result += it
        return result

    def convert_df_to_datalist(self, df, max_rows=None, include_row_labels=False):
        if max_rows is not None:
            new_df = df.head(max_rows)
        else:
            new_df = df
        if not include_row_labels:
            columns = list(new_df.columns)
            mat = new_df.to_numpy()
            res = [columns] + mat.tolist()
        else:
            res = [["label"] + list(new_df.columns)]
            for label, s in new_df.iterrows():
                res.append([label] + s.tolist())
        return res

    def html_table(self, data, title=None, click_type="word-clickable", sortable=True,
                   sidebyside=False, has_header=True, max_rows=None, header_style=None, body_style=None,
                   column_order=None, include_row_labels=True, outer_border=False):
        self._save_stdout()
        show_header = has_header
        if isinstance(data, list) and (isinstance(data[0], TacticRow) or isinstance(data[0], DetachedTacticRow)):
            data = self.create_document(data)

        if isinstance(data, _pd.DataFrame):
            if column_order is not None:
                df = data.reindex(columns=column_order)
            else:
                df = data
            dlist = self.convert_df_to_datalist(df, max_rows, include_row_labels=include_row_labels)
            show_header = True
        elif isinstance(data, list) and isinstance(data[0], dict):
            df = _pd.DataFrame(data)
            if column_order is not None:
                df = df.reindex(columns=column_order)
            dlist = self.convert_df_to_datalist(df, max_rows, include_row_labels=include_row_labels)
            show_header = True
        elif isinstance(data, TacticDocument):
            return data.to_html(title, click_type, sortable, sidebyside, has_header, max_rows, header_style, body_style,
                                column_order, include_row_labels)
        elif isinstance(data, nltk.FreqDist):
            if max_rows is None:
                nrows = 100
            else:
                nrows = max_rows
            dlist = [["word", "freq"]] + data.most_common(nrows)
            show_header = True
        elif isinstance(data, dict):
            dlist = [["key", "value"]]
            for key, the_val in data.items():
                dlist.append([key, the_val])
            dlist = dlist[:max_rows]
            show_header = True
        elif isinstance(data, list):
            dlist = data[:max_rows]
        elif isinstance(data, _pd.Series):
            ddict = dict(data)
            dlist = [["key", "value"]]
            for key, the_val in ddict.items():
                dlist.append([key, the_val])
            show_header = True
        else:
            dlist = data
        self._restore_stdout()
        return self.build_html_table_from_data_list(dlist, title, click_type, sortable, sidebyside,
                                                    show_header, header_style, body_style, outer_border)

    def bht(self, data_list, title=None, click_type="word-clickable",
            sortable=True, sidebyside=False, has_header=True, header_style=None, body_style=None, outer_border=False):
        return self.build_html_table_from_data_list(data_list, title, click_type,
                                                    sortable, sidebyside, has_header,
                                                    header_style, body_style)

    def build_html_table_from_data_list(self, data_list, title=None, click_type="word-clickable",
                                        sortable=True, sidebyside=False, has_header=True,
                                        header_style=None, body_style=None, outer_border=False):
        self._save_stdout()
        # base_class_string = "tile-table table table-striped table-bordered table-sm"
        base_class_string = "bp4-html-table bp4-html-table-bordered bp4-html-table-condensed bp4-html-table-striped bp4-small html-table"
        if outer_border:
            base_class_string += " html-table-bordered"
        if header_style is None:
            hstyle = "{}"
        else:
            hstyle = header_style
        if body_style is None:
            bstyle = "font-size:13px"
        else:
            bstyle = body_style
        if sortable:
            if not sidebyside:
                the_html = u"<table class='{} fw-table sortable'>".format(base_class_string)
            else:
                the_html = u"<table class='{} sidebyside-table sortable'>".format(base_class_string)
        else:
            if not sidebyside:
                the_html = u"<table class='{} fw-table'>".format(base_class_string)
            else:
                the_html = u"<table class='{} sidebyside-table'>".format(base_class_string)

        if title is not None:
            the_html += u"<caption>{0}</caption>".format(title)
        if has_header:
            the_html += u"<thead><tr>"
            if iterable(data_list[0]):
                for c in data_list[0]:
                    the_html += u"<th style='{1}'>{0}</th>".format(c, hstyle)
            else:
                the_html += u"<th style='{1}'>{0}</th>".format(data_list[0], hstyle)
            the_html += u"</tr></thead>"
            start_from = 1
        else:
            start_from = 0
        the_html += u"<tbody>"

        for rnum, r in enumerate(data_list[start_from:]):
            if click_type == u"row-clickable":
                the_html += u"<tr class='row-clickable'>"
                if iterable(r):
                    for c in r:
                        the_html += u"<td style='{1}'>{0}</td>".format(c, bstyle)
                else:
                    the_html += u"<td style='{1}'>{0}</td>".format(r, bstyle)
                the_html += u"</tr>"
            elif click_type == u"word-clickable":
                the_html += u"<tr>"
                if iterable(r):
                    for c in r:
                        the_html += u"<td class='word-clickable' style='{1}'>{0}</td>".format(c, bstyle)
                else:
                    the_html += u"<td class='word-clickable' style='{1}'>{0}</td>".format(r, bstyle)
                the_html += u"</tr>"
            else:
                the_html += u"<tr>"
                if iterable(r):
                    for cnum, c in enumerate(r):
                        the_html += "<td class='element-clickable' data-row='{1}' style='{3}' " \
                                    "data-col='{2}' data-val='{0}'>{0}</td>".format(c, str(rnum), str(cnum), bstyle)
                else:
                    the_html += "<td class='element-clickable' data-row='{1}' style='{3}' " \
                                "data-col='{2}' data-val='{0}'>{0}</td>".format(r, str(rnum), str(0), bstyle)
                the_html += "</tr>"
        the_html += "</tbody></table>"
        self._restore_stdout()
        return the_html

    def _build_html_table_for_exports(self, data_list, has_header=False, title=None):
        the_html = u"<table class='tile-table table sortable table-striped table-bordered table-sm'>"
        if title is not None:
            the_html += u"<caption>{0}</caption>".format(title)
        if has_header:
            the_html += u"<thead><tr>"
            for c in data_list[0]:
                the_html += u"<th>{0}</th>".format(c)
            the_html += u"</tr><tbody>"
            start = 1
        else:
            start = 0
        for r in data_list[start:]:
            the_html += "<tr>".format()
            for c in r:
                the_html += "<td>{0}</td>".format(str(c))
            the_html += "</tr>"

        the_html += "</tbody></table>"
        return the_html
    # </editor-fold>
