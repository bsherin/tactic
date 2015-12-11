from tile_env import *

class AbstractClassifier(TileBase):
    category = "classifiers"
    save_attrs = TileBase.save_attrs + ["text_source", "code_source", "code_dest", "tokenizer", "stop_list"]
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
        self.vocab_size = 50

    @property
    def options(self):
        return  [
        {"name": "text_source", "type": "column_select", "placeholder": self.text_source},
        {"name": "code_source", "type": "column_select", "placeholder": self.code_source},
        {"name": "code_destination", "type": "column_select", "placeholder": self.code_destination},
        {"name": "tokenizer", "type": "tokenizer_select", "placeholder": self.tokenizer},
        {"name": "stop_list", "type": "list_select", "placeholder": self.stop_list},
        {"name": "vocab_size", "type": "int", "placeholder": 50}
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

    def create_word_fdist(self, tokenized_rows, slist):
        fdist = nltk.FreqDist()
        slist_set = set(slist)
        for row in tokenized_rows:
            for w in row:
                if not (w in slist_set):
                    fdist[w] += 1
        return fdist

    def get_most_common(self, fdist, num):
        result = []
        for entry in fdist.most_common(num):
            result.append(entry[0])
        return result

    def render_content(self):
        if self.text_source is "":
            return "No text source selected."
        raw_text_dict = self.get_column_data_dict(self.text_source)
        self.tokenized_rows_dict = self.tokenize_docs(raw_text_dict, self.tokenizer)
        combined_text_rows = self.dict_to_list(self.tokenized_rows_dict)
        code_rows_dict = self.get_column_data_dict(self.code_source)
        combined_code_rows = self.dict_to_list(code_rows_dict)

        self.fdist = self.create_word_fdist(combined_text_rows, self.get_user_list(self.stop_list))

        reduced_vocab = self.get_most_common(self.fdist, self.vocab_size)
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

    def __init__(self, main_id, tile_id, tile_name=None):
        AbstractClassifier.__init__(self,main_id, tile_id, tile_name)
        self.palette_name = "RdYlGn"

    @property
    def options(self):
        return  [
        {"name": "text_source", "type": "column_select", "placeholder": self.text_source},
        {"name": "code_source", "type": "column_select", "placeholder": self.code_source},
        {"name": "code_destination", "type": "column_select", "placeholder": self.code_destination},
        {"name": "tokenizer", "type": "tokenizer_select", "placeholder": self.tokenizer},
        {"name": "stop_list", "type": "list_select", "placeholder": self.stop_list},
        {"name": "vocab_size", "type": "int", "placeholder": 50},
        {"name": "palette_name", "type": "palette_select", "placeholder": self.palette_name}
        ]

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
        reduced_vocab = self.get_most_common(self.fdist, self.vocab_size)
        res = {}
        for w in set(txt):
            if w in reduced_vocab:
                res[w] = self._classifier._feature_probdist[autocode, w].logprob(True)
        cmap = ColorMapper(min(res.values()), max(res.values()), self.palette_name)
        cell_color_dict = {}
        for w in res:
            cell_color_dict[w] = cmap.color_from_val(res[w])

        self.color_cell_text(doc_name, row_index, self.text_source, txt, cell_color_dict)

@tile_class
class DecisionTree(AbstractClassifier):
    classifier_class = nltk.DecisionTreeClassifier