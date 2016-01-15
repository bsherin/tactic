from tile_env import *


@tile_class
class SimpleCoder(TileBase):
    category = "utility"

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)

    def handle_button_click(self, value, doc_name, active_row_index):
        self.set_cell(doc_name, active_row_index, self.destination_column, value)
        return

    @property
    def options(self):
        return [
            {"name": "current_text",
            "type": "textarea"
        },
            {
                "name": "destination_column",
                "type": "column_select"
            }]

    def render_content(self):
        if self.current_text is None:
            return "Not yet configured"
        the_html = ""
        rows = self.current_text.split("\n")
        for r in rows:
            the_html += "<button value='{0}'>{0}</button>".format(r)
        return the_html


@tile_class
class WordnetSelectionTile(TileBase):
    category = "word"

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.display_message("Starting Wordnet")
        self.selected_text = "no selection"
        self.number_to_show = 5

    @property
    def options(self):
        return [
            {"name": "number_to_show", "type": "int"}
        ]

    def render_content(self):
        res = nltk.corpus.wordnet.synsets(self.selected_text)[:self.number_to_show]
        self.display_message("")
        return "<div>Synsets are:</div><div>{}</div>".format(res)

    def handle_text_select(self, selected_text, doc_name, active_row_index):
        self.selected_text = selected_text
        self.refresh_tile_now()


@tile_class
class WordFreqDist(TileBase):
    category = "word"
    exports = ["corpus_frequency_fdist", "document_frequency_fdist"]

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.corpus_frequency_fdist = None
        self.document_frequency_fdist = None
        self.number_to_display = 50
        self.vdata_table = None
        return

    @property
    def options(self):
        # options provides the specification for the options that appear on the back of the tile
        # there are 6 types: text, textarea, column_select, tokenizer_select, list_select, pipe_select
        return [{"name": "column_source", "type": "column_select"},
                {"name": "tokenizer", "type": "tokenizer_select"},
                {"name": "stop_list", "type": "list_select"},
                {"name": "number_to_display", "type": "int"}]

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

    def tokenize_rows(self, the_rows):
        tokenized_rows = []
        for raw_row in the_rows:
            if raw_row is not None:
                tokenized_rows.append(self.get_tokenizer(self.tokenizer)(raw_row))
        return tokenized_rows

    def render_content(self):
        if self.column_source is None:
            return "No column source selected."
        slist = self.get_user_list(self.stop_list)
        raw_rows = self.get_column_data(self.column_source)
        tokenized_rows = self.tokenize_rows(raw_rows)
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


@tile_class
class ListPlotter(TileBase):
    category = "plot"

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.N = 20

    @property
    def options(self):
        return [{"name": "data_source", "type": "pipe_select"},
                {"name": "N", "type": "int"}]

    def handle_size_change(self):
        if self.data_source is None:
            return
        data_dict = self.get_pipe_value(self.data_source)
        data_dict["value_list"] = data_dict["value_list"][:self.N]
        fig = GraphList(data_dict, self.width, self.height)
        new_html = self.create_figure_html(fig)
        self.refresh_tile_now(new_html)
        return

    def render_content(self):
        if self.data_source is None:
            return "No vocab source selected."
        data_dict = self.get_pipe_value(self.data_source)
        data_dict["value_list"] = data_dict["value_list"][:self.N]
        fig = GraphList(data_dict, self.width, self.height)
        return self.create_figure_html(fig)


@tile_class
class FreqDistPlotter(TileBase):
    category = "plot"

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.N = 20
        self.value_list = None
        self.word_list = None

    @property
    def options(self):
        return [{"name": "data_source", "type": "pipe_select"},
                {"name": "N", "type": "int"}]

    def handle_size_change(self):
        if self.value_list is None:
            return
        fig = GraphList(self.value_list, self.width, self.height, xlabels=self.word_list)
        new_html = self.create_figure_html(fig)
        self.refresh_tile_now(new_html)
        return

    def render_content(self):
        if self.data_source is None:
            return "No vocab source selected."
        fdist = self.get_pipe_value(self.data_source)
        mc_tuples = fdist.most_common(self.N)
        self.word_list = []
        self.value_list = []
        for tup in mc_tuples:
            self.word_list.append(tup[0])
            self.value_list.append(tup[1])
        fig = GraphList(self.value_list, self.width, self.height, xlabels=self.word_list)
        return self.create_figure_html(fig)


@tile_class
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
        self.word_fdist = None
        self.bigram_fdist = None
        self.vdata_table = None
        return

    @property
    def options(self):
        # options provides the specification for the options that appear on the back of the tile
        # there are 6 types: text, textarea, column_select, tokenizer_select, list_select, pipe_select
        return [{"name": "column_source", "type": "column_select"},
                {"name": "tokenizer", "type": "tokenizer_select"},
                {"name": "stop_list", "type": "list_select"},
                {"name": "bigram_measure", "type": "custom_list",
                 "special_list": Collocations.measures},
                {"name": "number_to_display", "type": "int"},
                {"name": "min_occurrences", "type": "int"}]

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

    def tokenize_rows(self, the_rows):
        tokenized_rows = []
        for raw_row in the_rows:
            if raw_row is not None:
                tokenized_rows.append(self.get_tokenizer(self.tokenizer)(raw_row))
        return tokenized_rows

    def handle_tile_row_click(self, clicked_row, doc_name, active_row_index):
        word_pair = clicked_row[0] + " " + clicked_row[1]
        self.clear_table_highlighting()
        self.highlight_matching_text(word_pair)
        self.display_matching_rows(lambda x: word_pair in x[self.column_source], self.get_current_document_name())
        return

    def render_content(self):
        if self.column_source is None:
            return "No column source selected."
        slist = self.get_user_list(self.stop_list)
        raw_rows = self.get_column_data(self.column_source)
        tokenized_rows = self.tokenize_rows(raw_rows)
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


@tile_class
class Heatmap(TileBase):
    category = "plot"

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.palette_name = "Paired"
        self.array = None
        return

    @property
    def options(self):
        return [{"name": "array_data", "type": "pipe_select"},
                {"name": "palette_name", "type": "palette_select"}]

    def handle_size_change(self):
        if self.array_data is None:
            return
        fig = ArrayHeatmap(self.array, self.width, self.height, palette_name=self.palette_name)
        new_html = self.create_figure_html(fig)
        self.refresh_tile_now(new_html)
        return

    def render_content(self):
        if self.array_data is None:
            return "No source selected yet."
        self.array = self.get_pipe_value(self.array_data)
        fig = ArrayHeatmap(self.array, self.width, self.height, palette_name=self.palette_name)
        return self.create_figure_html(fig)


@tile_class
class CommandTile(TileBase):
    category = "utility"
    exports = []

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        return

    @property
    def options(self):
        # options provides the specification for the options that appear on the back of the tile
        # there are 6 types: text, textarea, column_select, tokenizer_select, list_select, pipe_select
        return [{"name": "command_text", "type": "textarea"}]

    def render_content(self):
        if self.command_text is None:
            return "Not Configured"
        new_html = "<pre>" + self.command_text + "</pre>"
        exec self.command_text
        return new_html


@tile_class
class WordCloud(TileBase):
    category = "plot"

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.wordcloud = None
        self.the_text = None

    @property
    def options(self):
        return [{"name": "text_column", "type": "column_select"}]

    def handle_size_change(self):
        if self.the_text is None:
            return
        from wordcloud import WordCloud
        self.wordcloud = WordCloud(width=self.width,
                                   height=self.height,
                                   margin=1,
                                   scale=1,
                                   background_color="white").generate(self.the_text)
        fig = ImageShow(self.wordcloud, self.width, self.height)
        new_html = self.create_figure_html(fig)
        self.refresh_tile_now(new_html)
        return

    def render_content(self):
        from wordcloud import WordCloud
        if self.text_column is None:
            return "No text source selected."
        self.the_text = self.get_column_data(self.text_column)
        self.the_text = " ".join(self.the_text)
        self.wordcloud = WordCloud(width=self.width + 20,
                                   height=self.height + 20,
                                   margin=1,
                                   scale=1,
                                   background_color="white").generate(self.the_text)
        fig = ImageShow(self.wordcloud, self.width, self.height)
        return self.create_figure_html(fig)
