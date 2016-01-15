@user_tile
class NaiveBayesSklearn(TileBase):
    category = "classifiers"

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self._vocab = None
        self._classifer = None
        self.tile_type = self.__class__.__name__
        self.tokenized_rows_dict = {}
        self.autocodes_dict = {}
        self.vocab_size = 50
        self.palette_name = "RdYlGn"

    @property
    def options(self):
        return  [
        {"name": "text_source", "type": "column_select"},
        {"name": "code_source", "type": "column_select"},
        {"name": "code_destination", "type": "column_select"},
        {"name": "tokenizer", "type": "tokenizer_select"},
        {"name": "stop_list", "type": "list_select"},
        {"name": "vocab_size", "type": "int"}
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
        from nltk.classify import SklearnClassifier
        from sklearn.naive_bayes import BernoulliNB
        if self.text_source is "":
            return "No text source selected."
        if self.text_source is "":
            return "No text source selected."
        raw_text_dict = self.get_column_data_dict(self.text_source)
        self.tokenized_rows_dict = self.tokenize_docs(raw_text_dict, self.tokenizer)
        combined_text_rows = self.dict_to_list(self.tokenized_rows_dict)
        code_rows_dict = self.get_column_data_dict(self.code_source)
        combined_code_rows = self.dict_to_list(code_rows_dict)

        self.dm("creating fdist")
        self.fdist = self.create_word_fdist(combined_text_rows, self.get_user_list(self.stop_list))

        reduced_vocab = self.get_most_common(self.fdist, self.vocab_size)
        labeled_featuresets_dict = {}
        
        self.dm("creating featuresets")
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
        
        self.dm("training classifier")
        self._classifier = SklearnClassifier(BernoulliNB()).train(combined_featuresets)
        
        self.dm("computing accuracy")
        accuracy = nltk.classify.accuracy(self._classifier, combined_featuresets)

        self.dm("coding docs")
        self.autocodes_dict = {}
        for (dname, doc) in labeled_featuresets_dict.items():
            self.dm("coding doc " + dname)
            r = 0
            self.autocodes_dict[dname] = []
            for lfset in doc:
                autocode = self._classifier.classify(lfset[0])
                self.autocodes_dict[dname].append(autocode)
                r += 1
            self.set_column_data(dname,  self.code_destination, self.autocodes_dict[dname], cellchange=False)
        self.dm("creating confusion matrix")
        cm = nltk.ConfusionMatrix(self.dict_to_list(code_rows_dict),
                                  self.dict_to_list(self.autocodes_dict))

        self.dm("displaying result")
        html_output = "accuracy is " + str(round(accuracy, 2))
        html_output += '<pre>'+ cm.pretty_format() + '</pre>'
        html_output += "<button value='Color'>Color Text</button>"
        return html_output
