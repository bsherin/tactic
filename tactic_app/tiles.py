__author__ = 'bls910'

import Queue
import threading
import nltk
import sys
# I want nltk to only search here so that I can see
# what behavior on remote will be like.
nltk.data.path = ['./nltk_data/']
from nltk.corpus import wordnet as wn
from flask_login import current_user
from flask import url_for
from matplotlib_utilities import GraphList, convert_figure_to_img, ColorMapper

from tactic_app import socketio, app
from tile_base import TileBase
from shared_dicts import mainwindow_instances, distribute_event
from vector_space import Vocabulary
from shared_dicts import tile_classes, user_tiles, tokenizer_dict, weight_functions
from users import load_user
from tactic_app.clusterer_classes import CentroidClusterer
import numpy

# Decorator function used to register runnable analyses in analysis_dict
def tile_class(tclass):
    tile_classes[tclass.__name__] = tclass
    return tclass

def weight_function(wfunc):
    weight_functions[wfunc.__name__] = wfunc
    return wfunc

def user_tile(tclass):
    uname = current_user.username
    if not (uname in user_tiles):
        user_tiles[uname] = {}
    user_tiles[uname][tclass.__name__] = tclass
    return tclass

def create_user_tiles(tile_code):
    try:
        exec(tile_code)
    except:
        return str(sys.exc_info()[0]) + " "  + str(sys.exc_info()[1])
    return "success"

@tile_class
class SimpleCoder(TileBase):
    save_attrs = TileBase.save_attrs + ["current_text", "destination_column"]
    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.current_text = []
        self.destination_column = ""

    def handle_button_click(self, value, doc_name, active_row_index):
        self.set_cell(doc_name, active_row_index, self.destination_column, value)
        return

    @property
    def options(self):
        txtstr = ""
        for txt in self.current_text:
            txtstr += "\n" + txt
        return [{
        "name": "current_text",
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

# @tile_class
# class VideoPlayer(TileBase):
#
#     def render_content(self):
#         # vid_id = "v-bbfdac4a-5a46-4a4b-a87a-4d912fbd692e"
#         # the_html = "<video id='rando' data-uuid='[{0}]'></video>".format(vid_id)
#         # self.emit_tile_message("cameraTagSetup")
#         # <video id='rando' data-uuid='["v-bbfdac4a-5a46-4a4b-a87a-4d912fbd692e"]'></video>
#         the_html = "<video id='rando' data-uuid='[" + '"v-bbfdac4a-5a46-4a4b-a87a-4d912fbd692e"' + "]'></video>"
#
#         return the_html

@tile_class
class WordnetSelectionTile(TileBase):
    save_attrs = TileBase.save_attrs + ["to_show"]
    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.display_message("Starting Wordnet")
        self.selected_text = "no selection"
        self.number_to_show = 5

    @property
    def options(self):
        return  [
            {"name": "number_to_show", "type": "int", "placeholder": self.number_to_show}
        ]

    def render_content(self):
        res = wn.synsets(self.selected_text)[:self.number_to_show]
        self.display_message("")
        return "<div>Synsets are:</div><div>{}</div>".format(res)

    def handle_text_select(self, selected_text, doc_name, active_row_index):
        self.selected_text = selected_text
        self.refresh_tile_now()

@tile_class
class VocabularyTable(TileBase):
    exports = ["vocabulary"]
    save_attrs = TileBase.save_attrs + ["column_source", "tokenizer_func", "stop_list"]
    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.column_source = None
        self.tokenizer = None
        self._vocab = None
        self.stop_list = None

    @property
    def options(self):
        return  [
        {"name": "column_source", "type": "column_select", "placeholder": self.column_source},
        {"name": "tokenizer", "type": "tokenizer_select", "placeholder": self.tokenizer},
        {"name": "stop_list", "type": "list_select", "placeholder": self.stop_list}
        ]

    @property
    def vocabulary(self):
        return self._vocab

    def tokenize_rows(self, the_rows, the_tokenizer):
        tokenized_rows = []
        for raw_row in the_rows:
            if raw_row != None:
                tokenized_rows.append(self.get_tokenizer(self.tokenizer)(raw_row))
        return tokenized_rows

    def handle_cell_change(self, cheader, row_index, old_content, new_content, doc_name):
        if not (cheader == self.column_source):
            return
        if self._vocab is None:
            if self.column_source == None:
                self.refresh_tile_now("No column source selected.")
                return
            slist = self.get_user_list(self.stop_list)
            raw_rows = self.get_column_data(self.column_source)
            raw_rows[row_index] = new_content
            tokenized_rows = self.tokenize_rows(raw_rows, self.tokenizer)
            self._vocab = Vocabulary(tokenized_rows, slist)
            self.vdata_table = self._vocab.vocab_data_table()
            the_html = self.build_html_table_from_data_list(self.vdata_table)
            return self.refresh_tile_now(the_html)
        else:
            old_tokenized = self.get_tokenizer(self.tokenizer)(old_content)
            new_tokenized = self.get_tokenizer(self.tokenizer)(new_contet)
            self._vocab.update_vocabulary(old_tokenized, new_tokenized)
            self.vdata_table = self._vocab.vocab_data_table()
            the_html = self.build_html_table_from_data_list(self.vdata_table)
            self.refresh_tile_now(the_html)
            return


    def render_content(self):
        if self.column_source == None:
            return "No column source selected."
        slist = self.get_user_list(self.stop_list)
        raw_rows = self.get_column_data(self.column_source)
        tokenized_rows = self.tokenize_rows(raw_rows, self.tokenizer)
        self._vocab = Vocabulary(tokenized_rows, slist)
        self.vdata_table = self._vocab.vocab_data_table()
        the_html = self.build_html_table_from_data_list(self.vdata_table)
        return the_html

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

@tile_class
class VocabularyPlot(VocabularyTable):
    save_attrs = TileBase.save_attrs + ["column_source", "tokenizer_func", "stop_list"]
    def __init__(self, main_id, tile_id, tile_name=None):
        VocabularyTable.__init__(self, main_id, tile_id, tile_name)

    def render_content (self):
        if self.column_source == None:
            return "No column source selected."
        N = 20
        raw_rows = self.get_column_data(self.column_source)
        tokenized_rows = self.tokenize_rows(raw_rows, self.tokenizer)
        self._vocab = Vocabulary(tokenized_rows, self.get_user_list(self.stop_list))
        self.vdata_table = self._vocab.vocab_data_table()
        word_list = []
        amount_list = []
        for entry in self.vdata_table[1:N + 1]:
            word_list.append(entry[0])
            amount_list.append(entry[2])
        fig = GraphList(amount_list, word_list)
        self.images["vocab_plot"] = convert_figure_to_img(fig)
        return self.create_figure_html("vocab_plot")

class AbstractClassifier(TileBase):
    save_attrs = TileBase.save_attrs + ["text_source", "code_source", "code_dest", "tokenizer_func", "stop_list"]
    classifier_class = None
    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.text_source = ""
        self.code_source = ""
        self.code_destination = ""
        self.stop_list = ""
        self.tokenizer = ""
        self._vocab = None
        self._classifer = None
        self.tile_type = self.__class__.__name__
        self.tokenized_rows_dict = {}
        self.autocodes_dict = {}

    @property
    def options(self):
        return  [
        {"name": "text_source", "type": "column_select", "placeholder": self.text_source},
        {"name": "code_source", "type": "column_select", "placeholder": self.code_source},
        {"name": "code_destination", "type": "column_select", "placeholder": self.code_destination},
        {"name": "tokenizer", "type": "tokenizer_select", "placeholder": self.tokenizer},
        {"name": "stop_list", "type": "list_select", "placeholder": self.stop_list}
        ]

    def tokenize_rows(self, the_rows, the_tokenizer):
        tokenized_rows = []
        for raw_row in the_rows:
            if raw_row != None:
                tokenized_rows.append(self.get_tokenizer(the_tokenizer)(raw_row))
        return tokenized_rows

    def tokenize_docs(self, text_dict, tokenizer):
        result = {}
        for (name, doc) in text_dict.items():
            result[name] = self.tokenize_rows(doc, tokenizer)
        return result

    def render_content(self):
        if self.text_source is "":
            return "No text source selected."
        raw_text_dict = self.get_column_data_dict(self.text_source)
        self.tokenized_rows_dict = self.tokenize_docs(raw_text_dict, self.tokenizer)
        combined_text_rows = self.dict_to_list(self.tokenized_rows_dict)
        code_rows_dict = self.get_column_data_dict(self.code_source)
        combined_code_rows = self.dict_to_list(code_rows_dict)
        self._vocab = Vocabulary(combined_text_rows, self.get_user_list(self.stop_list))

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
        self._classifier = self.classifier_class.train(combined_featuresets)
        accuracy = nltk.classify.accuracy(self._classifier, combined_featuresets)

        self.autocodes_dict = {}
        for (dname, doc) in labeled_featuresets_dict.items():
            r = 0
            self.autocodes_dict[dname] = []
            for lfset in doc:
                autocode = self._classifier.classify(lfset[0])
                self.autocodes_dict[dname].append(autocode)
                self.set_cell(dname, r, self.code_destination, str(autocode), cellchange=False)
                # distribute_event("SetCellContent", self.main_id,
                #                  {"doc_name": dname, "row_index":r, "column_header": self.code_dest, "new_content": str(autocode), "cellchange": False})
                r += 1
        cm = nltk.ConfusionMatrix(self.dict_to_list(code_rows_dict),
                                  self.dict_to_list(self.autocodes_dict))

        html_output = "accuracy is " + str(round(accuracy, 2))
        html_output += '<pre>'+ cm.pretty_format() + '</pre>'
        # html_output += "<button value='Color'>Color Text</button>"
        return html_output

@tile_class
class NaiveBayes(AbstractClassifier):
    classifier_class = nltk.NaiveBayesClassifier

    def render_content(self):
        if self.text_source is "":
            return "No text source selected."
        html_output = AbstractClassifier.render_content(self)
        html_output += "<button value='Color'>Color Text</button>"
        return html_output


    def handle_button_click(self, value, doc_name, active_row_index):
        self.color_cell(doc_name, active_row_index)

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
        distribute_event("ColorTextInCell", self.main_id, {"doc_name": doc_name, "row_index": row_index, "column_header": self.text_source, "token_text": txt, "color_dict": cell_color_dict})

@tile_class
class DecisionTree(AbstractClassifier):
    classifier_class = nltk.DecisionTreeClassifier

@tile_class
class OrthogonalizingClusterer(TileBase):
    save_attrs = TileBase.save_attrs + ["text_source", "number_of_clusters", "code_dest", "tokenizer_func", "stop_list"]
    classifier_class = None
    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.text_source = ""
        self.code_destination = ""
        self.stop_list = ""
        self.tokenizer = ""
        self._vocab = None
        self._classifer = None
        self.tile_type = self.__class__.__name__
        self.tokenized_rows_dict = {}
        self.names_source = ""
        self.number_of_clusters = 5
        self.autocodes_dict = {}
        self.centroids = []
        self.vocab_size = 50
        self.weight_function = ""

    @property
    def options(self):
        return  [
        {"name": "text_source", "type": "column_select", "placeholder": self.text_source},
        {"name": "number_of_clusters", "type": "int", "placeholder": str(self.number_of_clusters)},
        {"name": "names_source", "type": "column_select", "placeholder": self.names_source},
        {"name": "code_destination", "type": "column_select", "placeholder": self.code_destination},
        {"name": "tokenizer", "type": "tokenizer_select", "placeholder": self.tokenizer},
        {"name": "weight_function", "type": "weight_function_select", "placeholder": self.weight_function},
        {"name": "stop_list", "type": "list_select", "placeholder": self.stop_list},
        {"name": "vocab_size", "type": "int", "placeholder": str(self.vocab_size)},
        ]

    @staticmethod
    def norm_vec(vec):
        mag = numpy.dot(vec, vec)
        if mag == 0:
            return vec
        else:
            return(vec / numpy.sqrt(mag))

    @staticmethod
    def orthogonalize(doc_vectors):
        total_v = numpy.zeros(len(doc_vectors[0]))
        for v in doc_vectors:
                total_v = total_v + v
        total_v = OrthogonalizingClusterer.norm_vec(total_v)
        new_doc_vectors = []
        for v in doc_vectors:
            new_doc_vectors.append(OrthogonalizingClusterer.norm_vec(v - numpy.dot(v, total_v) * total_v))
        return new_doc_vectors

    def top_words_from_centroid(self, vocab_list, n, to_print=10):
        result = [["word", "weight"]]
        sc = list(numpy.argsort(self.centroids[n]))
        sc.reverse()
        for i in range(to_print):
            result.append([vocab_list[sc[i]], round(self.centroids[n][sc[i]], 4)])
        return result

    def tokenize_rows(self, the_rows, the_tokenizer):
        tokenized_rows = []
        for raw_row in the_rows:
            if raw_row != None:
                tokenized_rows.append(self.get_tokenizer(the_tokenizer)(raw_row))
        return tokenized_rows

    def tokenize_docs(self, text_dict, tokenizer):
        result = {}
        for (name, doc) in text_dict.items():
            result[name] = self.tokenize_rows(doc, tokenizer)
        return result

    def get_group_number(self, name, groups):
        r = 0
        for g in groups:
            if name in g:
                return r + 1
            r += 1
        return 0

    def render_content(self):
        if self.text_source is "":
            return "No text source selected."
        raw_text_dict = self.get_column_data_dict(self.text_source)
        self.tokenized_rows_dict = self.tokenize_docs(raw_text_dict, self.tokenizer)
        combined_text_rows = self.dict_to_list(self.tokenized_rows_dict)
        self._vocab = Vocabulary(combined_text_rows, self.get_user_list(self.stop_list))

        reduced_vocab = self._vocab._sorted_list_vocab[:self.vocab_size]

        doc_vectors = []
        for r in combined_text_rows:
            r_vector = self.norm_vec([self.get_weight_function(self.weight_function)(r.count(word), self._vocab._df_dict[word], self._vocab._cf_dict[word]) for word in reduced_vocab])
            doc_vectors.append(r_vector)

        new_vectors = self.orthogonalize(doc_vectors)
        name_dict = self.get_column_data_dict(self.names_source)
        combined_names = self.dict_to_list(name_dict)

        self.clusterer = CentroidClusterer(vector_names = combined_names, normalise = False)
        self.clusterer.cluster(new_vectors, trace = True)
        self.clusterer.update_clusters(self.number_of_clusters)
        self.centroids = self.clusterer._centroids
        groups = self.clusterer._name_dendogram.groups(self.number_of_clusters)

        the_html = ""

        for i in range(self.number_of_clusters):
            the_html += str(i + 1) + "<br>"
            the_html += self.build_html_table_from_data_list(self.top_words_from_centroid(reduced_vocab, i, 10))

        for (dname, names) in name_dict.items():
            r = 0
            self.autocodes_dict[dname] = []
            for name in names:
                autocode = self.get_group_number(name, groups)
                self.autocodes_dict[dname].append(autocode)
                self.set_cell(dname, r, self.code_destination, str(autocode), cellchange=False)
                r += 1

        return the_html

# Here are some assorted weighting functions

@weight_function
def pure_tf(tf, df, cf):
    return tf

@weight_function
def tf(tf, df, cf):
    if tf == 0:
        result = 0
    else:
        result = (1 + numpy.log(tf))
    return result

@weight_function
def tfidf(tf, df, cf):
    if tf == 0 or df == 0:
        result = 0
    else:
        result = (1 + numpy.log(tf)) / df
    return result
