@user_tile
class WordFreqDist(TileBase):
    category = "word"
    exports = ["corpus_frequency_fdist", "document_frequency_fdist"]

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.corpus_frequency_fdist = None
        self.document_frequency_fdist = None
        self.number_to_display = 50
        self.save_attrs += self.exports
        return

    @property
    def options(self):
        return  [
        {"name": "column_source", "type": "column_select"},
        {"name": "tokenizer", "type": "tokenizer_select"},
        {"name": "stop_list", "type": "list_select"},
        {"name": "number_to_display", "type": "int"}
    ]

    @property
    def cf_list(self):
        word_list = []
        amount_list = []
        for entry in self.vdata_table:
            word_list.append(entry[0])
            amount_list.append(entry[1])
        data_dict = {"value_list": amount_list[1:], "xlabels": word_list[1:]}
        return data_dict

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

    def tokenize_rows(self, the_rows, the_tokenizer):
        tokenized_rows = []
        tokenizer = self.get_tokenizer(the_tokenizer)
        for raw_row in the_rows:
            if raw_row != None:
                tokenized_rows.append(tokenizer(raw_row))
        return tokenized_rows

    def render_content(self):
        slist = self.get_user_list(self.stop_list)
        raw_rows = self.get_column_data(self.column_source)
        tokenized_rows = self.tokenize_rows(raw_rows, self.tokenizer)
        self.corpus_frequency_fdist = self.create_word_cfdist(tokenized_rows, slist)
        self.document_frequency_fdist = self.create_word_dfdist(tokenized_rows, slist)
        mc_tuples = self.corpus_frequency_fdist.most_common(self.number_to_display)
        self.vdata_table = []
        for trow in mc_tuples:
            self.vdata_table.append([trow[0],
                                    trow[1],
                                    self.document_frequency_fdist[trow[0]]])
        self.vdata_table = [["word", "cf", "df"]] + self.vdata_table
        the_html = self.build_html_table_from_data_list(self.vdata_table, title="Frequency Distributions")
        return the_html
