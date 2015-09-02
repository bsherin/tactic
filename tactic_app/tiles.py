__author__ = 'bls910'

import Queue
import threading
import nltk
# I want nltk to only search here so that I can see
# what behavior on remote will be like.
nltk.data.path = ['./nltk_data/']
from nltk.corpus import wordnet as wn
from flask_login import current_user

from tactic_app import socketio
from shared_dicts import mainwindow_instances
from vector_space import Vocabulary
from shared_dicts import tile_classes, tokenizer_dict
from users import load_user
from views.main_views import distribute_event


# Decorator function used to register runnable analyses in analysis_dict
def tile_class(tclass):
    tile_classes[tclass.__name__] = tclass
    return tclass

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
    def _init__(self, main_id, tile_id):
        TileBase.__init__(self, main_id, tile_id)
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
    input_start_template = '<div class="form-group">' \
                     '<label>{0}</label>'
    basic_input_template = '<input type="{1}" class="form-control" id="{0}" value="{2}"></input>' \
                     '</div>'
    textarea_template = '<textarea type="{1}" class="form-control" id="{0}" value="{2}"></textarea>' \
                 '</div>'
    select_base_template = '<select class="form-control" id="{0}">'
    select_option_template = '<option value="{0}">{0}</option>'
    select_option_selected_template = '<option value="{0}" selected>{0}</option>'

    def __init__(self, main_id, tile_id):
        self._stopevent = threading.Event()
        self._sleepperiod = .2
        threading.Thread.__init__(self)
        global current_tile_id
        self.update_events = ["RefreshTile", "UpdateOptions", "ShowFront", "StartSpinner", "StopSpinner", "RefreshTileFromSave"]
        self.tile_id = tile_id
        self.main_id = main_id
        self._my_q = Queue.Queue(0)
        self.current_html = None
        self.tile_type = self.__class__.__name__
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
        # socketio.emit("start-spinner", {"tile_id": str(self.tile_id)}, namespace='/main', room=self.main_id)
        self.emit_tile_message("startSpinner")

    def stop_spinner(self):
        # socketio.emit("stop-spinner", {"tile_id": str(self.tile_id)}, namespace='/main', room=self.main_id)
        self.emit_tile_message("stopSpinner")
    def render_content(self):
        print "not implemented"

    def compile_save_dict(self):
        result = {}
        for (attr, val) in self.__dict__.items():
            if not ((attr.startswith("_")) or (attr == "additionalInfo") or (str(type(val)) == "<type 'instance'>")):
                result[attr] = val
        result["tile_type"] = type(self).__name__
        result.update(self.cache_dicts())
        return result

    def cache_dicts(self):
        return {}

    @property
    def current_user(self):
        user_id = mainwindow_instances[self.main_id].user_id
        current_user = load_user(user_id)
        return current_user

    def get_user_list(self, the_list):
        return self.current_user.get_list(the_list)

    def create_form_html(self):
        form_html = ""
        for option in self.options:
            if option["type"] == "column_select":
                the_template = self.input_start_template + self.select_base_template
                form_html += the_template.format(option["name"])
                for choice in mainwindow_instances[self.main_id].ordered_sig_dict.keys():
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
            elif option["type"] == "list_select":
                the_template = self.input_start_template + self.select_base_template
                form_html += the_template.format(option["name"])
                for choice in current_user.list_names:
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
                print "Unknown ooption type specified"
        return form_html

@tile_class
class SimpleSelectionTile(TileBase):
    def __init__(self, main_id, tile_id):
        TileBase.__init__(self, main_id, tile_id)
        self.update_events.append("text_select")
        self.extra_text = "placeholder text"
        self.selected_text = "no selection"
        self.tile_type = self.__class__.__name__

    def handle_event(self, event_name, data=None):
        if event_name == "text_select":
            self.selected_text = data["selected_text"]
            self.push_direct_update()
        TileBase.handle_event(self, event_name, data)

    def render_content(self):
        return "{} {}".format(self.extra_text, self.selected_text)

    def update_options(self, form_data):
        self.extra_text = form_data["extra_text"]
        self.spin_and_refresh()

    @property
    def options(self):
        return  [
            {"name": "extra_text", "type": "text", "placeholder": "no selection"}
        ]

@tile_class
class SimpleCoder(TileBase):
    def __init__(self, main_id, tile_id):
        TileBase.__init__(self, main_id, tile_id)
        self.update_events.append("TileButtonClick")
        self.current_text = []
        self.destination_column = ""
        self.tile_type = self.__class__.__name__

    def handle_event(self, event_name, data=None):
        if event_name == "TileButtonClick":
            distribute_event("SetFocusRowCellContent", self.main_id, {"signature": self.destination_column, "new_content": data["button_value"]})
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
    def __init__(self, main_id, tile_id):
        TileBase.__init__(self, main_id, tile_id)
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
class VocabularyDisplayTile(TileBase):
    def __init__(self, main_id, tile_id):
        TileBase.__init__(self, main_id, tile_id)
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

    def load_raw_column(self, column_signature):
        return mainwindow_instances[self.main_id].get_column_data(column_signature)

    def update_options(self, form_data):
        self.text_source = form_data["column_source"];
        self.code_source = None
        self.tokenizer_func = form_data["tokenizer"];
        self.stop_list = self.get_user_list(form_data["stop_list"])
        self.post_event("ShowFront");
        self.spin_and_refresh()

@tile_class
class NaiveBayesTile(TileBase):
    def __init__(self, main_id, tile_id):
        TileBase.__init__(self, main_id, tile_id)
        self.text_source = ""
        self.code_source = ""
        self.code_dest = ""
        self.stop_list = ""
        self.tokenizer_func = ""
        self._vocab = None
        self._classifer = None
        self.update_events += ["CellChange"]
        self.tile_type = self.__class__.__name__

    @property
    def options(self):
        return  [
        {"name": "text_source", "type": "column_select", "placeholder": self.text_source},
        {"name": "code_source", "type": "column_select", "placeholder": self.code_source},
        {"name": "code_destination", "type": "column_select", "placeholder": self.code_dest},
        {"name": "tokenizer", "type": "tokenizer_select", "placeholder": self.tokenizer_func},
        {"name": "stop_list", "type": "list_select", "placeholder": self.stop_list}
        ]

    def tokenize_rows(self, the_rows, the_tokenizer):
        tokenized_rows = []
        for raw_row in the_rows:
            if raw_row != None:
                tokenized_rows.append(tokenizer_dict[the_tokenizer](raw_row))
        return tokenized_rows


    def render_content(self):
        if self.text_source is "":
            return "No text source selected."
        raw_text_rows = self.load_raw_column(self.text_source)
        tokenized_rows = self.tokenize_rows(raw_text_rows, self.tokenizer_func)
        code_rows = self.load_raw_column(self.code_source)
        self._vocab = Vocabulary(tokenized_rows, self.stop_list)

        reduced_vocab = self._vocab._sorted_list_vocab[:50]
        labeled_featuresets = []
        r = 0
        for instance in tokenized_rows:
            new_fs = {}
            if not (code_rows[r] == ""):
                for w in reduced_vocab:
                    new_fs[w] = w in instance
                labeled_featuresets.append((new_fs, code_rows[r]))
            r += 1
        self._classifier = nltk.NaiveBayesClassifier.train(labeled_featuresets)
        accuracy = nltk.classify.accuracy(self._classifier, labeled_featuresets)
        r = 0
        autocodes = []
        for lfset in labeled_featuresets:
            autocode = self._classifier.classify(lfset[0])
            autocodes.append(autocode)
            distribute_event("SetCellContent", self.main_id, {"row_index":r, "signature": self.code_dest, "new_content": str(autocode)})
            r += 1
        cm = nltk.ConfusionMatrix(code_rows, autocodes)

        html_output = "accuracy is " + str(round(accuracy, 2))
        html_output += '<pre>'+ cm.pretty_format() + '</pre>'

        return html_output

    def load_raw_column(self, column_signature):
        return mainwindow_instances[self.main_id].get_column_data(column_signature)

    def update_options(self, form_data):
        self.text_source = form_data["text_source"];
        self.code_source = form_data["code_source"];
        self.tokenizer_func = form_data["tokenizer"];
        self.stop_list = self.get_user_list(form_data["stop_list"])
        self.code_dest = form_data["code_destination"]
        self.post_event("ShowFront");
        self.spin_and_refresh()
