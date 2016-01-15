@user_tile
class CentroidCluster(TileBase):
    category = "clustering"

    exports = ["cluster_data"]
    classifier_class = None
    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.tile_type = self.__class__.__name__
        self.tokenized_rows_dict = {}
        self.number_of_clusters = 5
        self.autocodes_dict = {}
        self.centroids = []
        self.vocab_size = 50
        self.orthogonalize = True
        self.palette_name = "Paired"
        self.clusterer = None
        self.cluster_data = None

    @property
    def options(self):
        return  [
        {"name": "text_source", "type": "column_select"},
        {"name": "number_of_clusters", "type": "int"},
        {"name": "names_source", "type": "column_select"},
        {"name": "code_destination", "type": "column_select"},
        {"name": "tokenizer", "type": "tokenizer_select"},
        {"name": "weight_function", "type": "weight_function_select"},
        {"name": "stop_list", "type": "list_select"},
        {"name": "vocab_size", "type": "int"},
        {"name": "orthogonalize", "type": "boolean"},
        {"name": "palette_name", "type": "palette_select"},
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