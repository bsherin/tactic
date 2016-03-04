@user_tile
class Collocations(TileBase):
    category = "word"
    exports = []
    measures = ["raw_freq", "student_t", "chi_sq", "pmi", "likelihood_ratio"]

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.word_fd = None
        self.bigram_fd = None
        self.number_to_display = 15
        self.min_occurrences = 7
        return

    @property
    def options(self):
        return  [
        {"name": "column_source", "type": "column_select"},
        {"name": "tokenizer", "type": "tokenizer_select"},
        {"name": "stop_list", "type": "list_select"},
        {"name": "bigram_measure", "type": "custom_list", "special_list": self.measures},
        {"name": "number_to_display", "type": "int"},
        {"name": "min_occurrences", "type": "int"}
    ]

    def create_word_fdist(self, tokenized_rows, slist):
        fdist = nltk.FreqDist()
        slist_set = set(slist)
        for row in tokenized_rows:
            for w in row:
                if not (w in slist_set):
                    fdist[w] += 1
        return fdist

    def create_bigram_fdist(self, tokenized_rows, slist):
        fdist = nltk.FreqDist()
        slist_set = set(slist)
        for row in tokenized_rows:
            bgs = nltk.bigrams(row)
            for ws in bgs:
                w1 = ws[0]
                w2 = ws[1]
                if not (w1 in slist_set) and not (w2 in slist_set):
                    fdist[(w1, w2)] += 1
        return fdist

    def tokenize_rows(self, the_rows, the_tokenizer):
        tokenized_rows = []
        tokenizer = self.get_tokenizer(self.tokenizer)
        for raw_row in the_rows:
            if raw_row != None:
                tokenized_rows.append(tokenizer(raw_row))
        return tokenized_rows

    def handle_tile_row_click(self, clicked_row, doc_name, active_row_index):
        word_pair = clicked_row[0] + " " + clicked_row[1]
        self.clear_table_highlighting()
        self.highlight_matching_text(word_pair)
        self.display_matching_rows(lambda x: word_pair in x[self.column_source], self.get_current_document_name())
        return

    def render_content(self):
        slist = self.get_user_list(self.stop_list)
        raw_rows = self.get_column_data(self.column_source)
        tokenized_rows = self.tokenize_rows(raw_rows, self.tokenizer)
        self.word_fdist = self.create_word_fdist(tokenized_rows, slist)
        self.bigram_fdist = self.create_bigram_fdist(tokenized_rows, slist)
        bigram_measures = nltk.collocations.BigramAssocMeasures()
        finder = nltk.collocations.BigramCollocationFinder(self.word_fdist, self.bigram_fdist)
        finder.apply_freq_filter(self.min_occurrences)
        measure = getattr(bigram_measures, self.bigram_measure)
        b_tuples = finder.nbest(measure, self.number_to_display)
        self.vdata_table = []
        for trow in b_tuples:
            self.vdata_table.append([trow[0],
                                    trow[1],
                                    round(finder.score_ngram(measure, trow[0], trow[1]), 2),
                                    self.bigram_fdist[trow]])
        self.vdata_table = [["w1", "w2", "score", "freq"]] + self.vdata_table
        the_html = self.build_html_table_from_data_list(self.vdata_table, title="Collocations", row_clickable=True)
        return the_html