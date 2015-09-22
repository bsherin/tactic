__author__ = 'bls910'

import Queue
import threading
import nltk
# I want nltk to only search here so that I can see
# what behavior on remote will be like.
nltk.data.path = ['./nltk_data/']
from nltk.corpus import wordnet as wn
from flask_login import current_user
from flask import url_for
from matplotlib_utilities import GraphList, convert_figure_to_img, ColorMapper

from tactic_app import socketio, app
from shared_dicts import mainwindow_instances, distribute_event
from vector_space import Vocabulary
from shared_dicts import tile_classes, user_tiles, tokenizer_dict
from users import load_user

# from views.main_views import figure_source

# Decorator function used to register runnable analyses in analysis_dict
def tile_class(tclass):
    tile_classes[tclass.__name__] = tclass
    return tclass

def user_tile(tclass):
    uname = current_user.username
    if not (uname in user_tiles):
        user_tiles[uname] = {}
    user_tiles[uname][tclass.__name__] = tclass
    return tclass

def create_user_tiles(tile_code):
    exec(tile_code)
    return

class TileTemplate(threading.Thread):
    options=[{
        "name": "option1",
        "type": "option1type",
        "placeholder": "Placehold value"
    },
        {
        "name": "option2",
        "type": "option2type",
        "placeholder": "Placeholder value"
    }]
    def _init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.update_events.append("EventName")
        # Any other initializations
        return

    def handle_event(self, event_name, data=None):
        TileBase.handle_event(self, event_name, data)
        return

    def render_content(self):
        """This should return html for the tile body.
        Will be called on RefreshTile event"""
        return

    def update_options(self, form_data):
                """ Called on the update_options event.
        This is generated when the user clicks submit in the options view of the tile.
        form_data will be a dict with keys that are the option names.
        """

class TileBase(threading.Thread):
    exports = {}
    save_attrs = ["update_events", "current_html", "tile_id", "tile_type", "images", "tile_name"]
    input_start_template = '<div class="form-group form-group-sm"">' \
                     '<label>{0}</label>'
    basic_input_template = '<input type="{1}" class="form-control input-sm" id="{0}" value="{2}"></input>' \
                     '</div>'
    textarea_template = '<textarea type="{1}" class="form-control input-sm" id="{0}" value="{2}">{2}</textarea>' \
                 '</div>'
    select_base_template = '<select class="form-control input-sm" id="{0}">'
    select_option_template = '<option value="{0}">{0}</option>'
    select_option_selected_template = '<option value="{0}" selected>{0}</option>'

    def __init__(self, main_id, tile_id, tile_name=None):
        self._stopevent = threading.Event()
        self._sleepperiod = .05
        threading.Thread.__init__(self)
        self._my_q = Queue.Queue(0)

        # These define the state of a tile and should be saved
        self.update_events = ["RefreshTile", "UpdateOptions", "ShowFront", "StartSpinner", "StopSpinner", "RefreshTileFromSave", "RebuildTileForms"]
        self.images = {}

        self.tile_type = self.__class__.__name__
        if tile_name is None:
            self.tile_name = self.tile_type
        else:
            self.tile_name = tile_name

        self.current_html = None

        # These will differ each time the tile is instantiated.
        self.tile_id = tile_id
        self.main_id = main_id
        self.figure_url = ''
        return

    def run(self):
        while not self._stopevent.isSet( ):
            if (not self._my_q.empty()):
                q_item = self._my_q.get()
                if type(q_item) == dict:
                    self.handle_event(q_item["event_name"], q_item["data"])
                else:
                    self.handle_event(q_item)
            self._stopevent.wait(self._sleepperiod)



    def join(self, timeout=None):
        """ Stop the thread and wait for it to end. """
        self._stopevent.set( )
        threading.Thread.join(self, timeout)

    def post_event(self, event_name, data=None):
        self._my_q.put({"event_name": event_name, "data": data})

    def spin_and_refresh(self):
        self.post_event("StartSpinner")
        self.post_event("RefreshTile")
        self.post_event("StopSpinner")

    @property
    def options(self):
        return []

    def load_data_dict(self, column_signature):
        return mainwindow_instances[self.main_id].get_column_data(column_signature)

    def dict_to_list(self, the_dict):
        result = []
        for it in the_dict.values():
            result += it
        return result

    def load_raw_column(self, column_signature):
        return self.dict_to_list(self.load_data_dict(column_signature))

    def handle_event(self, event_name, data=None):
        if event_name == "RefreshTile":
            self.push_direct_update()
        elif event_name == "RefreshTileFromSave":
            self.push_direct_update(self.current_html)
        elif event_name == "UpdateOptions":
            self.update_options(data)
        elif event_name =="ShowFront":
            self.show_front()
        elif event_name=="StartSpinner":
            self.start_spinner()
        elif event_name=="StopSpinner":
            self.stop_spinner()
        elif event_name=="RebuildTileForms":
            form_html = self.create_form_html()
            self.emit_tile_message("displayFormContent", {"html": form_html})
        return

    def emit_tile_message(self, message, data={}):
        data["message"] = message
        data["tile_id"] = self.tile_id
        socketio.emit("tile-message", data, namespace='/main', room=self.main_id)

    def update_options(self, form_data):

        return

    def show_front(self):
        self.emit_tile_message("showFront")

    def push_direct_update(self, new_html=None):
        if new_html == None:
            new_html = self.render_content()
        self.current_html = new_html
        self.emit_tile_message("displayTileContent", {"html": new_html})

    def start_spinner(self):
        self.emit_tile_message("startSpinner")

    def stop_spinner(self):
        self.emit_tile_message("stopSpinner")

    def render_content(self):
        print "not implemented"

    def compile_save_dict(self):
        result = {}
        result["my_class_for_recreate"] = "TileBase"
        for attr in self.save_attrs:
            attr_val = getattr(self, attr)
            if hasattr(attr_val, "compile_save_dict"):
                result[attr] = attr_val.compile_save_dict()
            elif ((type(attr_val) == dict) and (len(attr_val) > 0) and hasattr(attr_val.values()[0], "compile_save_dict")):
                res = {}
                for (key, val) in attr_val.items():
                    res[key] = val.compile_save_dict()
                result[attr] = res
            else:
                result[attr] = attr_val
        return result

    @staticmethod
    def recreate_from_save(save_dict):
        tile_type  = save_dict["tile_type"]
        if tile_type in tile_classes:
            tile_cls = tile_classes[tile_type]
        elif tile_type in user_tiles[current_user.username]:
            tile_cls = user_tiles[current_user.username][tile_type]
        else:
            print "missing tile type"
            return {}
        new_instance = tile_cls(-1, save_dict["tile_id"], save_dict["tile_name"])
        for (attr, attr_val) in save_dict.items():
            if type(attr_val) == dict and hasattr(attr_val, "recreate_from_save"):
                cls  = getattr(sys.modules[__name__], attr_val["my_class_for_recreate"])
                setattr(new_instance, attr, cls.recreate_from_save(attr_val))
            elif ((type(attr_val) == dict) and (len(attr_val) > 0) and hasattr(attr_val.values()[0], "recreate_from_save")):
                cls  = getattr(sys.modules[__name__], attr_val.values()[0]["my_class_for_recreate"])
                res = {}
                for (key, val) in attr_val.items():
                    res[key] = cls.recreate_from_save(val)
                setattr(new_instance, attr, res)
            else:
                setattr(new_instance, attr, attr_val)
        return new_instance

    @property
    def current_user(self):
        user_id = mainwindow_instances[self.main_id].user_id
        current_user = load_user(user_id)
        return current_user

    def get_user_list(self, the_list):
        return self.current_user.get_list(the_list)

    def create_figure_html(self, figname):
        fig_url = self.figure_url + figname
        image_string = "<img class='output-plot' src='{}' onclick=showZoomedImage(this) lt='Image Placeholder'>"
        the_html = image_string.format(fig_url)
        return the_html

    def get_current_pipe_list(self):
        pipe_list = []
        for tile_entry in mainwindow_instances[self.main_id]._pipe_dict.values():
            pipe_list += tile_entry.keys()
        return pipe_list

    def get_pipe_value(self, pipe_key):
        mw = mainwindow_instances[self.main_id]
        for (tile_id, tile_entry) in mainwindow_instances[self.main_id]._pipe_dict.items():
            if pipe_key in tile_entry:
                return getattr(mw.tile_instances[tile_id], tile_entry[pipe_key])
        return None

    def create_form_html(self):
        form_html = ""
        for option in self.options:
            if option["type"] == "column_select":
                the_template = self.input_start_template + self.select_base_template
                form_html += the_template.format(option["name"])
                current_doc_name = mainwindow_instances[self.main_id]._visible_doc_name
                current_doc = mainwindow_instances[self.main_id].doc_dict[current_doc_name]
                for choice in current_doc.ordered_sig_dict.keys():
                    if choice == option["placeholder"]:
                        form_html += self.select_option_selected_template.format(choice)
                    else:
                        form_html += self.select_option_template.format(choice)
                form_html += '</select></div>'
            elif option["type"] == "tokenizer_select":
                the_template = self.input_start_template + self.select_base_template
                form_html += the_template.format(option["name"])
                for choice in tokenizer_dict.keys():
                    if choice == option["placeholder"]:
                        form_html += self.select_option_selected_template.format(choice)
                    else:
                        form_html += self.select_option_template.format(choice)
                form_html += '</select></div>'
            elif option["type"] == "pipe_select":
                the_template = self.input_start_template + self.select_base_template
                form_html += the_template.format(option["name"])
                for choice in self.get_current_pipe_list():
                    if choice == option["placeholder"]:
                        form_html += self.select_option_selected_template.format(choice)
                    else:
                        form_html += self.select_option_template.format(choice)
                form_html += '</select></div>'
            elif option["type"] == "list_select":
                the_template = self.input_start_template + self.select_base_template
                form_html += the_template.format(option["name"])
                for choice in self.current_user.list_names:
                    if choice == option["placeholder"]:
                        form_html += self.select_option_selected_template.format(choice)
                    else:
                        form_html += self.select_option_template.format(choice)
                form_html += '</select></div>'
            elif option["type"] == "text":
                the_template = self.input_start_template + self.basic_input_template
                form_html += the_template.format(option["name"], option["type"], option["placeholder"])
            elif option["type"] == "textarea":
                the_template = self.input_start_template + self.textarea_template
                form_html += the_template.format(option["name"], option["type"], option["placeholder"])
            else:
                print "Unknown option type specified"
        return form_html

# @tile_class
# class SimpleSelectionTile(TileBase):
#     def __init__(self, main_id, tile_id, tile_name=None):
#         TileBase.__init__(self, main_id, tile_id, tile_name)
#         self.update_events.append("text_select")
#         self.extra_text = "placeholder text"
#         self.selected_text = "no selection"
#         self.tile_type = self.__class__.__name__
#
#     def handle_event(self, event_name, data=None):
#         if event_name == "text_select":
#             self.selected_text = data["selected_text"]
#             self.push_direct_update()
#         TileBase.handle_event(self, event_name, data)
#
#     def render_content(self):
#         return "{} {}".format(self.extra_text, self.selected_text)
#
#     def update_options(self, form_data):
#         self.extra_text = form_data["extra_text"]
#         self.spin_and_refresh()
#
#     @property
#     def options(self):
#         return  [
#             {"name": "extra_text", "type": "text", "placeholder": "no selection"}
#         ]

@tile_class
class SimpleCoder(TileBase):
    save_attrs = TileBase.save_attrs + ["current_text", "destination_column"]
    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.update_events.append("TileButtonClick")
        self.current_text = []
        self.destination_column = ""
        self.tile_type = self.__class__.__name__

    def handle_event(self, event_name, data=None):
        if event_name == "TileButtonClick":
            active_row_index = data["active_row_index"]
            doc_name = data["doc_name"]
            distribute_event("SetCellContent", self.main_id,
                             {"row_index": active_row_index, "doc_name": doc_name, "signature": self.destination_column, "new_content": data["button_value"], "cellchange": True})
        else:
            TileBase.handle_event(self, event_name, data)

    @property
    def options(self):
        txtstr = ""
        for txt in self.current_text:
            txtstr += "\n" + txt
        return [{
        "name": "the_text",
        "type": "textarea",
        "placeholder": txtstr
        },
        {
        "name": "destination_column",
        "type": "column_select",
        "placeholder": self.destination_column
        }]

    def render_content(self):
        the_html = ""
        for r in self.current_text:
            the_html += "<button value='{0}'>{0}</button>".format(r)
        return the_html

    def update_options(self, form_data):
        self.current_text = form_data["the_text"]
        self.destination_column = form_data["destination_column"]
        self.spin_and_refresh()

@tile_class
class WordnetSelectionTile(TileBase):
    save_attrs = TileBase.save_attrs + ["to_show"]
    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.update_events.append("text_select")
        self.selected_text = "no selection"
        self.to_show = 5
        self.tile_type = self.__class__.__name__

    @property
    def options(self):
        return  [
            {"name": "number_to_show", "type": "text","placeholder": self.to_show}
        ]

    def handle_event(self, event_name, data=None):
        if event_name == "text_select":
            self.selected_text = data["selected_text"]
            self.push_direct_update()
        TileBase.handle_event(self, event_name, data)

    def render_content(self):
        res = wn.synsets(self.selected_text)[:self.to_show]
        return "<div>Synsets are:</div><div>{}</div>".format(res)

    def update_options(self, form_data):
        self.to_show = int(form_data["number_to_show"])
        self.post_event("ShowFront")
        self.spin_and_refresh()
        return

@tile_class
class VocabularyTable(TileBase):
    exports = ["vocabulary"]
    save_attrs = TileBase.save_attrs + ["column_source", "tokenizer_func", "stop_list"]
    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.column_source = None
        self.update_events += ["CellChange", "TileWordClick"]
        self.tokenizer_func = None
        self._vocab = None
        self.stop_list = None
        self.tile_type = self.__class__.__name__

    @property
    def options(self):
        return  [
        {"name": "column_source", "type": "column_select", "placeholder": self.column_source},
        {"name": "tokenizer", "type": "tokenizer_select", "placeholder": self.tokenizer_func},
        {"name": "stop_list", "type": "list_select", "placeholder": self.stop_list}
        ]

    @property
    def vocabulary(self):
        return self._vocab

    def tokenize_rows(self, the_rows, the_tokenizer):
        tokenized_rows = []
        for raw_row in the_rows:
            if raw_row != None:
                tokenized_rows.append(tokenizer_dict[the_tokenizer](raw_row))
        return tokenized_rows

    def build_html_table_from_data_list(self, data_list):
        the_html = "<table><thead><tr>"
        for c in data_list[0]:
            the_html += "<th>{0}</th>".format(c)
        the_html += "</tr><tbody>"
        for r in data_list[1:]:
            the_html += "<tr>"
            for c in r:
                the_html += "<td class='word-clickable'>{0}</td>".format(c)
            the_html += "</tr>"
        the_html += "</tbody></table>"
        return the_html

    def handle_event(self, event_name, data=None):
        if event_name == "CellChange":
            sig_string = mainwindow_instances[self.main_id].get_sig_string_from_sig(data["signature"])
            if not (sig_string == self.column_source):
                return
            # data will have the keys row_index, column_idex, signature, old_content, new_content
            if self._vocab is None:
                if self.column_source == None:
                    self.push_direct_update("No column source selected.")
                    return
                raw_rows = self.load_raw_column(self.column_source)
                raw_rows[data["row_index"]] = data["new_content"]
                tokenized_rows = self.tokenize_rows(raw_rows, self.tokenizer_func)
                self._vocab = Vocabulary(tokenized_rows, self.stop_list)
                self.vdata_table = self._vocab.vocab_data_table()
                the_html = self.build_html_table_from_data_list(self.vdata_table)
                return self.push_direct_update(the_html)
            else:
                old_tokenized = tokenizer_dict[self.tokenizer_func](data["old_content"])
                new_tokenized = tokenizer_dict[self.tokenizer_func](data["new_content"])
                self._vocab.update_vocabulary(old_tokenized, new_tokenized)
                self.vdata_table = self._vocab.vocab_data_table()
                the_html = self.build_html_table_from_data_list(self.vdata_table)
                self.push_direct_update(the_html)
                return
        elif event_name == "TileWordClick":
            distribute_event("DehighlightTable", self.main_id, {})
            distribute_event("SearchTable", self.main_id, {"text_to_find": data["clicked_text"]})
            print data["clicked_text"]
        else:
            TileBase.handle_event(self, event_name, data)

    def render_content(self):
        if self.column_source == None:
            return "No column source selected."
        raw_rows = self.load_raw_column(self.column_source)
        tokenized_rows = self.tokenize_rows(raw_rows, self.tokenizer_func)
        self._vocab = Vocabulary(tokenized_rows, self.stop_list)
        self.vdata_table = self._vocab.vocab_data_table()
        the_html = self.build_html_table_from_data_list(self.vdata_table)
        return the_html

    def update_options(self, form_data):
        self.column_source = form_data["column_source"];
        self.tokenizer_func = form_data["tokenizer"];
        self.stop_list = self.get_user_list(form_data["stop_list"])
        self.post_event("ShowFront");
        self.spin_and_refresh()

@tile_class
class VocabularyImportAndPlot(TileBase):
    save_attrs = TileBase.save_attrs + ["vocab_source"]

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.vocab_source = None

    @property
    def options(self):
        return  [
            {"name": "vocab_source", "type": "pipe_select", "placeholder": self.vocab_source}
        ]

    def render_content (self):
        if self.vocab_source == None:
            return "No vocab source selected."
        N = 20
        self._vocab = self.get_pipe_value(self.vocab_source)
        self.vdata_table = self._vocab.vocab_data_table()
        word_list = []
        amount_list = []
        for entry in self.vdata_table[1:N + 1]:
            word_list.append(entry[0])
            amount_list.append(entry[2])
        fig = GraphList(amount_list, word_list)
        self.images["vocab_plot"] = convert_figure_to_img(fig)
        return self.create_figure_html("vocab_plot")

    def update_options(self, form_data):
        self.vocab_source = form_data["vocab_source"]
        self.post_event("ShowFront");
        self.spin_and_refresh();

@tile_class
class VocabularyPlot(VocabularyTable):
    save_attrs = TileBase.save_attrs + ["column_source", "tokenizer_func", "stop_list"]
    def __init__(self, main_id, tile_id, tile_name=None):
        VocabularyTable.__init__(self, main_id, tile_id, tile_name)

    def render_content (self):
        if self.column_source == None:
            return "No column source selected."
        N = 20
        raw_rows = self.load_raw_column(self.column_source)
        tokenized_rows = self.tokenize_rows(raw_rows, self.tokenizer_func)
        self._vocab = Vocabulary(tokenized_rows, self.stop_list)
        self.vdata_table = self._vocab.vocab_data_table()
        word_list = []
        amount_list = []
        for entry in self.vdata_table[1:N + 1]:
            word_list.append(entry[0])
            amount_list.append(entry[2])
        fig = GraphList(amount_list, word_list)
        self.images["vocab_plot"] = convert_figure_to_img(fig)
        return self.create_figure_html("vocab_plot")

@tile_class
class NaiveBayes(TileBase):
    save_attrs = TileBase.save_attrs + ["text_source", "code_source", "code_dest", "tokenizer_func", "stop_list"]
    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.text_source = ""
        self.code_source = ""
        self.code_dest = ""
        self.stop_list = ""
        self.tokenizer_func = ""
        self._vocab = None
        self._classifer = None
        self.update_events += ["CellChange", "TileButtonClick"]
        self.tile_type = self.__class__.__name__
        self.tokenized_rows_dict = {}
        self.autocodes_dict = {}

    @property
    def options(self):
        return  [
        {"name": "text_source", "type": "column_select", "placeholder": self.text_source},
        {"name": "code_source", "type": "column_select", "placeholder": self.code_source},
        {"name": "code_destination", "type": "column_select", "placeholder": self.code_dest},
        {"name": "tokenizer", "type": "tokenizer_select", "placeholder": self.tokenizer_func},
        {"name": "stop_list", "type": "list_select", "placeholder": self.stop_list}
        ]

    def handle_event(self, event_name, data=None):
        if event_name == "TileButtonClick":
            active_row_index = data["active_row_index"]
            doc_name = data["doc_name"]
            self.color_cell(doc_name, active_row_index)
        else:
            TileBase.handle_event(self, event_name, data)

    def color_cell(self, doc_name, row_index):
        print "entering color_cell"
        autocode = self.autocodes_dict[doc_name][row_index]
        txt = self.tokenized_rows_dict[doc_name][row_index]
        reduced_vocab = self._vocab._sorted_list_vocab[:50]
        res = {}
        for w in set(txt):
            if w in reduced_vocab:
                res[w] = self._classifier._feature_probdist[autocode, w].logprob(True)
        cmap = ColorMapper(max(res.values()), min(res.values()))
        cell_color_dict = {}
        for w in res:
            cell_color_dict[w] = cmap.color_from_val(res[w])

        print "about to distribute event ColorTextInCell"
        distribute_event("ColorTextInCell", self.main_id, {"doc_name": doc_name, "row_index": row_index, "signature": self.text_source, "token_text": txt, "color_dict": cell_color_dict})

    def tokenize_rows(self, the_rows, the_tokenizer):
        tokenized_rows = []
        for raw_row in the_rows:
            if raw_row != None:
                tokenized_rows.append(tokenizer_dict[the_tokenizer](raw_row))
        return tokenized_rows

    def tokenize_docs(self, text_dict, tokenizer):
        result = {}
        for (name, doc) in text_dict.items():
            result[name] = self.tokenize_rows(doc, tokenizer)
        return result

    def render_content(self):
        if self.text_source is "":
            return "No text source selected."
        raw_text_dict = self.load_data_dict(self.text_source)
        self.tokenized_rows_dict = self.tokenize_docs(raw_text_dict, self.tokenizer_func)
        combined_text_rows = self.dict_to_list(self.tokenized_rows_dict)
        code_rows_dict = self.load_data_dict(self.code_source)
        combined_code_rows = self.dict_to_list(code_rows_dict)
        self._vocab = Vocabulary(combined_text_rows, self.stop_list)

        reduced_vocab = self._vocab._sorted_list_vocab[:50]
        labeled_featuresets_dict = {}
        for (dname, doc) in self.tokenized_rows_dict.items():
            r = 0
            labeled_featuresets_dict[dname] = []
            for instance in doc:
                new_fs = {}
                if not (code_rows_dict[dname][r] == ""):
                    for w in reduced_vocab:
                        new_fs[w] = w in instance
                    labeled_featuresets_dict[dname].append((new_fs, code_rows_dict[dname][r]))
                r += 1
        combined_featuresets = self.dict_to_list(labeled_featuresets_dict)
        self._classifier = nltk.NaiveBayesClassifier.train(combined_featuresets)
        accuracy = nltk.classify.accuracy(self._classifier, combined_featuresets)

        self.autocodes_dict = {}
        for (dname, doc) in labeled_featuresets_dict.items():
            r = 0
            self.autocodes_dict[dname] = []
            for lfset in doc:
                autocode = self._classifier.classify(lfset[0])
                self.autocodes_dict[dname].append(autocode)
                distribute_event("SetCellContent", self.main_id,
                                 {"doc_name": dname, "row_index":r, "signature": self.code_dest, "new_content": str(autocode), "cellchange": False})
                r += 1
        cm = nltk.ConfusionMatrix(self.dict_to_list(code_rows_dict),
                                  self.dict_to_list(self.autocodes_dict))

        html_output = "accuracy is " + str(round(accuracy, 2))
        html_output += '<pre>'+ cm.pretty_format() + '</pre>'
        html_output += "<button value='Color'>Color Text</button>"
        return html_output

    def update_options(self, form_data):
        self.text_source = form_data["text_source"];
        self.code_source = form_data["code_source"];
        self.tokenizer_func = form_data["tokenizer"];
        self.stop_list = self.get_user_list(form_data["stop_list"])
        self.code_dest = form_data["code_destination"]
        self.post_event("ShowFront");
        self.spin_and_refresh()


