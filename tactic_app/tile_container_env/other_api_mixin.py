
from communication_utils import debinarize_python_object

class OtherAPIMIxin:

    # <editor-fold desc="Other">
    def gst(self):
        return self.get_selected_text()

    def get_selected_text(self):
        self._save_stdout()
        result = self._get_main_property("selected_text")
        self._restore_stdout()
        return result

    def display_message(self, message_string, force_open=True, is_error=False, summary=None):
        self.log_it(message_string, force_open, is_error, summary)
        return

    def dm(self, message_string, force_open=True, is_error=False, summary=None):
        self.log_it(message_string, force_open, is_error, summary)
        return

    def log_it(self, message_string, force_open=True, is_error=False, summary=None):
        self._save_stdout()
        self._tworker.post_task(self._main_id, "print_to_console_event", {"print_string": message_string,
                                                                          "force_open": force_open,
                                                                          "is_error": is_error,
                                                                          "summary": summary})
        self._restore_stdout()
        return

    def get_container_log(self):
        self._save_stdout()
        result = self._tworker.post_and_wait("host", "get_container_log", {"container_id": self._tworker.my_id})
        self._restore_stdout()
        return result["log_text"]

    def create_bokeh_html(self, the_plot):
        from bokeh.embed import file_html
        from bokeh.resources import Resources
        return file_html(the_plot, Resources("inline"))

    def get_pipe_value(self, key_or_tile_name, export_name=None):
        self._save_stdout()
        print("in get_pipe_value")
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
            tile_id = self.tiles[key_or_tile_name]._tile_id

        result = self._tworker.post_and_wait_for_pipe(tile_id,
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

    def dict_to_list(self, the_dict):
        result = []
        for it in the_dict.values():
            result += it
        return result

    def bht(self, data_list, title=None, click_type="word-clickable",
            sortable=True, sidebyside=False, has_header=True):
        return self.build_html_table_from_data_list(data_list, title, click_type,
                                                    sortable, sidebyside, has_header)

    def build_html_table_from_data_list(self, data_list, title=None, click_type="word-clickable",
                                        sortable=True, sidebyside=False, has_header=True):
        self._save_stdout()
        if sortable:
            if not sidebyside:
                the_html = u"<table class='tile-table table table-striped table-bordered table-sm sortable'>"
            else:
                the_html = u"<table class='tile-table sidebyside-table table-striped table-bordered table-sm sortable'>"
        else:
            if not sidebyside:
                the_html = u"<table class='tile-table table table-striped table-bordered table-sm'>"
            else:
                the_html = u"<table class='tile-table sidebyside-table table-striped table-bordered table-sm'>"

        if title is not None:
            the_html += u"<caption>{0}</caption>".format(title)
        if has_header:
            the_html += u"<thead><tr>"
            for c in data_list[0]:
                the_html += u"<th>{0}</th>".format(c)
            the_html += u"</tr></thead>"
            start_from = 1
        else:
            start_from = 0
        the_html += u"<tbody>"

        for rnum, r in enumerate(data_list[start_from:]):
            if click_type == u"row-clickable":
                the_html += u"<tr class='row-clickable'>"
                for c in r:
                    the_html += u"<td>{0}</td>".format(c)
                the_html += u"</tr>"
            elif click_type == u"word-clickable":
                the_html += u"<tr>"
                for c in r:
                    the_html += u"<td class='word-clickable'>{0}</td>".format(c)
                the_html += u"</tr>"
            else:
                the_html += u"<tr>"
                for cnum, c in enumerate(r):
                    the_html += "<td class='element-clickable' data-row='{1}' " \
                                "data-col='{2}' data-val='{0}'>{0}</td>".format(c, str(rnum), str(cnum))
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