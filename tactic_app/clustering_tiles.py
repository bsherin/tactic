from tile_env import *

@tile_class
class CentroidCluster(TileBase):
    category = "clustering"
    save_attrs = TileBase.save_attrs + ["text_source", "number_of_clusters", "code_destination",
                                        "tokenizer", "stop_list", "names_source",
                                        "weight_function", "vocab_size", "orthogonalize", "palette_name"]
    exports = ["cluster_data"]
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
        self.orthogonalize = True
        self.palette_name = "Paired"
        self.clusterer = None
        self.cluster_data = None

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
        {"name": "orthogonalize", "type": "boolean", "placeholder": self.orthogonalize},
        {"name": "palette_name", "type": "palette_select", "placeholder": self.palette_name},
        ]

    def norm_vec(self, vec):
        mag = numpy.dot(vec, vec)
        if mag == 0:
            return vec
        else:
            return(vec / numpy.sqrt(mag))

    def orthogonalize_vectors(self, doc_vectors):
        total_v = numpy.zeros(len(doc_vectors[0]))
        for v in doc_vectors:
                total_v = total_v + v
        total_v = self.norm_vec(total_v)
        new_doc_vectors = []
        for v in doc_vectors:
            new_doc_vectors.append(self.norm_vec(v - numpy.dot(v, total_v) * total_v))
        return new_doc_vectors

    def top_words_from_centroid(self, vocab_list, n, to_print=10):
        result = [["word", "weight"]]
        sc = list(numpy.argsort(self.centroids[n]))
        sc.reverse()
        for i in range(to_print):
            result.append([vocab_list[sc[i]], round(self.centroids[n][sc[i]], 4)])
        return result

    def get_most_common(self, fdist, num):
        result = []
        for entry in fdist.most_common(num):
            result.append(entry[0])
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

    def create_word_cfdist(self, tokenized_rows, slist):
        fdist = nltk.FreqDist()
        slist_set = set(slist)
        for row in tokenized_rows:
            for w in row:
                if not (w in slist_set):
                    fdist[w] += 1
        return fdist

    def create_word_dfdist(self, tokenized_rows, slist):
        fdist = nltk.FreqDist()
        slist_set = set(slist)
        for row in tokenized_rows:
            lsrow = list(set(row))
            for w in lsrow:
                if not (w in slist_set):
                    fdist[w] += 1
        return fdist

    def render_content(self):
        if self.text_source is "":
            return "No text source selected."
        raw_text_dict = self.get_column_data_dict(self.text_source)
        self.tokenized_rows_dict = self.tokenize_docs(raw_text_dict, self.tokenizer)
        combined_text_rows = self.dict_to_list(self.tokenized_rows_dict)
        self.display_message("building vocabulary")
        self.cfdist = self.create_word_cfdist(combined_text_rows, self.get_user_list(self.stop_list))
        self.dfdist = self.create_word_dfdist(combined_text_rows, self.get_user_list(self.stop_list))

        reduced_vocab = self.get_most_common(self.cfdist, self.vocab_size)

        self.display_message("building doc vectors")
        row_vectors_dict = {}
        for (doc_name, row_list) in self.tokenized_rows_dict.items():
            row_vectors_dict[doc_name] = []
            for r in row_list:
                r_vector = self.norm_vec([self.get_weight_function(self.weight_function)(r.count(word), self.dfdist[word], self.cfdist[word]) for word in reduced_vocab])
                row_vectors_dict[doc_name].append(r_vector)

        combined_row_vectors = self.dict_to_list(row_vectors_dict)
        if self.orthogonalize:
            self.display_message("orthogonalizing")
            new_vectors = self.orthogonalize_vectors(combined_row_vectors)
        else:
            new_vectors = combined_row_vectors
        name_dict = self.get_column_data_dict(self.names_source)
        combined_names = self.dict_to_list(name_dict)

        self.clusterer = OptCentroidClusterer(normalise = False)
        self.clusterer.cluster(new_vectors, trace = True)
        self.clusterer.update_clusters(self.number_of_clusters)
        self.centroids = self.clusterer._centroids
        # groups = self.clusterer._name_dendogram.groups(self.number_of_clusters)

        the_html = ""

        for i in range(self.number_of_clusters):
            ctitle = "Cluster " + str(i + 1)
            the_html += self.build_html_table_from_data_list(self.top_words_from_centroid(reduced_vocab, i, 10), title=ctitle)

        cmapper = ColorMapper(1, self.number_of_clusters, self.palette_name)

        for (dname, vec_list) in row_vectors_dict.items():
            r = 0
            self.autocodes_dict[dname] = []
            for vec in vec_list:
                autocode = self.clusterer.classify(vec)
                self.autocodes_dict[dname].append(autocode)
                self.set_cell(dname, r, self.code_destination, str(autocode + 1), cellchange=False)
                self.set_cell_background(dname, r, self.code_destination, cmapper.color_from_val(autocode + 1))
                r += 1

        self.cluster_data = {"clusterer": self.clusterer, "reduced_vocab": reduced_vocab, "row_vectors_dict": row_vectors_dict}
        return the_html

@tile_class
class OrthogonalizingGAACCluster(TileBase):
    category = "clustering"
    save_attrs = TileBase.save_attrs + ["text_source", "number_of_clusters", "code_destination", "tokenizer", "stop_list"]
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

    def norm_vec(self, vec):
        mag = numpy.dot(vec, vec)
        if mag == 0:
            return vec
        else:
            return(vec / numpy.sqrt(mag))

    def orthogonalize(self, doc_vectors):
        total_v = numpy.zeros(len(doc_vectors[0]))
        for v in doc_vectors:
                total_v = total_v + v
        total_v = self.norm_vec(total_v)
        new_doc_vectors = []
        for v in doc_vectors:
            new_doc_vectors.append(self.norm_vec(v - numpy.dot(v, total_v) * total_v))
        return new_doc_vectors

    def top_words_from_centroid(self, vocab_list, n, to_print=10):
        result = [["word", "weight"]]
        sc = list(numpy.argsort(self.centroids[n]))
        sc.reverse()
        for i in range(to_print):
            result.append([vocab_list[sc[i]], round(self.centroids[n][sc[i]], 4)])
        return result

    def get_most_common(self, fdist, num):
        result = []
        for entry in fdist.most_common(num):
            result.append(entry[0])
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

    def create_word_cfdist(self, tokenized_rows, slist):
        fdist = nltk.FreqDist()
        slist_set = set(slist)
        for row in tokenized_rows:
            for w in row:
                if not (w in slist_set):
                    fdist[w] += 1
        return fdist

    def create_word_dfdist(self, tokenized_rows, slist):
        fdist = nltk.FreqDist()
        slist_set = set(slist)
        for row in tokenized_rows:
            lsrow = list(set(row))
            for w in lsrow:
                if not (w in slist_set):
                    fdist[w] += 1
        return fdist

    def render_content(self):
        if self.text_source is "":
            return "No text source selected."
        raw_text_dict = self.get_column_data_dict(self.text_source)
        self.tokenized_rows_dict = self.tokenize_docs(raw_text_dict, self.tokenizer)
        combined_text_rows = self.dict_to_list(self.tokenized_rows_dict)
        self.display_message("building vocabulary")
        self.cfdist = self.create_word_cfdist(combined_text_rows, self.get_user_list(self.stop_list))
        self.dfdist = self.create_word_dfdist(combined_text_rows, self.get_user_list(self.stop_list))
        # self._vocab = Vocabulary(combined_text_rows, self.get_user_list(self.stop_list))

        reduced_vocab = self.get_most_common(self.cfdist, self.vocab_size)

        self.display_message("building doc vectors")
        row_vectors_dict = {}
        for (doc_name, row_list) in self.tokenized_rows_dict.items():
            row_vectors_dict[doc_name] = []
            for r in row_list:
                r_vector = self.norm_vec([self.get_weight_function(self.weight_function)(r.count(word), self.dfdist[word], self.cfdist[word]) for word in reduced_vocab])
                row_vectors_dict[doc_name].append(r_vector)

        combined_row_vectors = self.dict_to_list(row_vectors_dict)
        self.display_message("orthogonalizing")
        new_vectors = self.orthogonalize(combined_row_vectors)
        name_dict = self.get_column_data_dict(self.names_source)
        combined_names = self.dict_to_list(name_dict)

        self.clusterer = nltk.cluster.gaac.GAAClusterer(normalise = False)
        self.clusterer.cluster(new_vectors, trace = True)
        self.clusterer.update_clusters(self.number_of_clusters)
        self.centroids = self.clusterer._centroids
        # groups = self.clusterer._name_dendogram.groups(self.number_of_clusters)

        the_html = ""

        for i in range(self.number_of_clusters):
            ctitle = "Cluster " + str(i + 1)
            the_html += self.build_html_table_from_data_list(self.top_words_from_centroid(reduced_vocab, i, 10), title=ctitle)

        for (dname, vec_list) in row_vectors_dict.items():
            r = 0
            self.autocodes_dict[dname] = []
            for vec in vec_list:
                autocode = self.clusterer.classify(vec)
                self.autocodes_dict[dname].append(autocode)
                self.set_cell(dname, r, self.code_destination, str(autocode), cellchange=False)
                r += 1

        return the_html

@tile_class
class ClusterViewer(TileBase):
    # save_attrs has the variables that will be saved when a project is saved
    save_attrs = TileBase.save_attrs + ["number_of_clusters", "cluster_data", "code_into_column", "code_destination", "palette_name"]
    category = "clustering"

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.cluster_data = None
        self.clusterer = None
        self.number_of_clusters = 5
        self.code_into_column = True
        self.code_destination = None
        self.palette_name = "Paired"
        # Any other initializations
        return

    @property
    def options(self):
        return  [
        {"name": "cluster_data", "type": "pipe_select","placeholder": self.cluster_data},
        {"name": "number_of_clusters", "type": "int","placeholder": self.number_of_clusters},
        {"name": "code_into_column", "type": "boolean","placeholder": self.code_into_column},
        {"name": "code_destination", "type": "column_select","placeholder": self.code_destination},
        {"name": "palette_name", "type": "palette_select", "placeholder": self.palette_name}
    ]

    def top_words_from_centroid(self, vocab_list, n, to_print=10):
        result = [["word", "weight"]]
        sc = list(numpy.argsort(self.centroids[n]))
        sc.reverse()
        for i in range(to_print):
            result.append([vocab_list[sc[i]], round(self.centroids[n][sc[i]], 4)])
        return result

    def render_content(self):
        if self.cluster_data is None:
            return "No source selected yet."
        cdata = self.get_pipe_value(self.cluster_data)
        self.clusterer = cdata["clusterer"]
        reduced_vocab = cdata["reduced_vocab"]
        row_vectors_dict = cdata["row_vectors_dict"]
        self.clusterer.update_clusters(self.number_of_clusters)
        self.centroids = self.clusterer._centroids

        the_html = ""

        for i in range(self.number_of_clusters):
            ctitle = "Cluster " + str(i + 1)
            the_html += self.build_html_table_from_data_list(self.top_words_from_centroid(reduced_vocab, i, 10), title=ctitle)

        self.autocodes_dict = {}
        if self.code_into_column:
            cmapper = ColorMapper(1, self.number_of_clusters, self.palette_name)

            for (dname, vec_list) in row_vectors_dict.items():
                r = 0
                self.autocodes_dict[dname] = []
                for vec in vec_list:
                    autocode = self.clusterer.classify(vec)
                    self.autocodes_dict[dname].append(autocode)
                    self.set_cell(dname, r, self.code_destination, str(autocode + 1), cellchange=False)
                    self.set_cell_background(dname, r, self.code_destination, cmapper.color_from_val(autocode + 1))
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
