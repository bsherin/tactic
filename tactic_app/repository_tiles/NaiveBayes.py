@user_tile
class NaiveBayes(TileBase):
    category = "classifiers"
    classifier_class = nltk.NaiveBayesClassifier

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self._vocab = None
        self._classifer = None
        self.tile_type = self.__class__.__name__
        self.tokenized_rows_dict = {}
        self.autocodes_dict = {}
        self.vocab_size = 50
        self.palette_name = "RdYlGn"
        self.base_html = None
        self.save_attrs += ["all_data", "_classifier"]

    @property
    def options(self):
        return  [
        {"name": "text_source", "type": "column_select"},
        {"name": "code_source", "type": "column_select"},
        {"name": "code_destination", "type": "column_select"},
        {"name": "tokenizer_name", "type": "tokenizer_select"},
        {"name": "stop_list", "type": "list_select"},
        {"name": "vocab_size", "type": "int"},
        {"name": "palette_name", "type": "palette_select"}
        ]

    def create_word_fdist(self, all_data, slist):
        fdist = nltk.FreqDist()
        slist_set = set(slist)
        for doc_name in self.doc_names:
            for the_id, the_row in all_data[doc_name].items():
                if the_row["tokenized_text"] is not None:
                    for w in the_row["tokenized_text"]:
                        if not (w in slist_set):
                            fdist[w] += 1
        return fdist

    def get_most_common(self, fdist, num):
        result = []
        for entry in fdist.most_common(num):
            result.append(entry[0])
        return result
    
    def render_content(self):
        self.all_data = {}
        self.doc_names = self.get_document_names()
        self.dm("tokenizing")
        tokenizer = self.get_tokenizer(self.tokenizer_name)
        for doc_name in self.doc_names:
            self.all_data[doc_name] = self.get_document_data(doc_name)
            for the_id, the_row in self.all_data[doc_name].items():
                the_text = self.all_data[doc_name][the_id][self.text_source]
                the_code = self.all_data[doc_name][the_id][self.code_source]
                if the_text == None or the_text == "" or the_code == "" or the_code == None:
                    self.all_data[doc_name][the_id]["tokenized_text"] = None
                else:
                    ttext = tokenizer(the_text)
                    self.all_data[doc_name][the_id]["tokenized_text"] = ttext
                    
        self.dm("done tokenizing")
        self.fdist = self.create_word_fdist(self.all_data, self.get_user_list(self.stop_list))

        reduced_vocab = self.get_most_common(self.fdist, self.vocab_size)
        labeled_featuresets_dict = {}
        
        self.dm("creating featuresets")
        training_featuresets = []
        for (dname, doc)in self.all_data.items():
            for the_id, the_row in doc.items():
                if not (the_row["tokenized_text"] == None):
                    new_fs = {}
                    for w in reduced_vocab:
                        new_fs[w] = w in the_row["tokenized_text"]
                    lfs = (new_fs, the_row[self.code_source])
                    training_featuresets.append(lfs)
                else:
                    lfs = None
                doc[the_id]["labeled_featureset"] = lfs
        
        self.dm("training classifier")
        self._classifier = self.classifier_class.train(training_featuresets)
        accuracy = nltk.classify.accuracy(self._classifier, training_featuresets)

        self.dm("coding docs")
        auto_list = []
        gold_list = []
        test_list = []
        for (dname, doc) in self.all_data.items():
            self.dm("coding doc " + dname)
            doc_auto_list = []
            for the_id, the_row in doc.items():
                if the_row["tokenized_text"] == None:
                    the_code = None
                else:
                    the_code = self._classifier.classify(the_row["labeled_featureset"][0])
                    test_list.append(the_code)
                    gold_list.append(the_row[self.code_source])
                doc_auto_list.append(the_code)
                the_row[self.code_destination] = the_code
            self.dm("setting column data")
            self.set_column_data(dname, self.code_destination, doc_auto_list, cellchange=False)
            auto_list = auto_list + doc_auto_list
            
        self.dm("creating confusion matrix")
        
        cm = nltk.ConfusionMatrix(gold_list, test_list)

        html_output = "accuracy is " + str(round(accuracy, 2))
        ctable = [[" "] + cm._values]
        for i, r in enumerate(cm._confusion):
            ctable.append([cm._values[i]] + r)
        html_output += self.build_html_table_from_data_list(ctable, click_type="element-clickable")
        html_output += "<button value='Color'>Color Text</button>"
        self.base_html = html_output
        self.codes = cm._values
        return html_output

    def handle_button_click(self, value, doc_name, active_row_index):
        self.color_cell(doc_name, active_row_index)
        
    def handle_tile_row_click(self, clicked_row, doc_name, active_row_index):
        doc_name = clicked_row[0]
        row_id = clicked_row[1]
        self.go_to_row_in_document(doc_name, row_id)
        return
        
    def handle_tile_element_click(self, dataset, doc_name, active_row_index):
        gold_code = self.codes[int(dataset["row"])]
        test_code = self.codes[int(dataset["col"]) - 1]
        
        match_list = [["doc_name", "__id__", "text", "gold", "autocode"]]
        for (dname, doc) in self.all_data.items():
            for the_id, the_row in doc.items():
                if (the_row[self.code_source] == gold_code) and (the_row[self.code_destination] == test_code):
                    row_result = [dname,
                                  the_row["__id__"],
                                  the_row[self.text_source],
                                  gold_code,
                                  test_code]
                    match_list.append(row_result)
        new_html = self.base_html + self.build_html_table_from_data_list(match_list, title=None, 
                                                                         click_type="row-clickable")
        self.refresh_tile_now(new_html)
        return

    def color_cell(self, doc_name, row_index):
        print "entering color_cell"
        autocode = self.all_data[doc_name][row_index][self.code_destination]
        txt = self.all_data[doc_name][row_index]["tokenized_text"]
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