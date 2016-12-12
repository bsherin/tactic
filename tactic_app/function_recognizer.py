import re

# Python identifiers start with a letter or _,
#and continue with these or digits.
IDENT = '[A-Za-z_][A-Za-z_0-9]*'

IDENT_WITH_DEFAULT = '[A-Za-z_][A-Za-z_0-9\=\'\"]*'

# Commas between identifiers can have any amout of space on either side.
COMMA = '\s*,\s*'

# Parameter list can contain some positional parameters.
# For simplicity we ignore now named parameters, *args, and **kwargs.
# We catch the entire list.
PARAM_LIST = '\((' + IDENT+'?' + '(?:' + COMMA+IDENT + ')*'+ ')?\)'
PARAM_LIST_NO_CAPTURE = '\(' + IDENT_WITH_DEFAULT+'?' + '(?:' + COMMA+IDENT_WITH_DEFAULT + ')*'+ '?\)'

# Definition starts with 'def', then identifier, some space, and param list.

BODY = ':.*\n([\s\S]*?(?=$|\sdef ))'
BODY_NO_CAPTURE = '.*\n[\s\S]*?'
DEF = 'def\s+(' + IDENT + ')\s*' + PARAM_LIST + BODY
QUOTE = r'\'|\"|\"\"\"'


DECORATOR = ' *@' + IDENT + '\n'
DEF_LINE = '\n    *def\s+(' + IDENT + ')\s*' + PARAM_LIST_NO_CAPTURE + ":"

INIT_METHOD = '( *def *__init__[\s\S]*?)(?=(?:$| *?def | *?@))'
ASSIGNMENTS = 'self\.(' + IDENT + ') *\= *([\S]+)'

DEF_FULL_CODE = '((?:' + DECORATOR + ')?' + DEF_LINE + '[\s\S]*?)(?=(?:$|\n    def |\n    @))'

ident_rx = re.compile(IDENT)
def_rx = re.compile(DEF)
def_fc = re.compile(DEF_FULL_CODE)

init_rx = re.compile(INIT_METHOD)
ass_rx = re.compile(ASSIGNMENTS)

def RepresentsInt(s):
    try:
        int(s)
        return True
    except ValueError:
        return False

def RepresentsFloat(s):
    try:
        float(s)
        return True
    except ValueError:
        return False

def extract_init(the_str):
    return init_rx.findall(the_str)[0]

def remove_quotes(the_str):
    return re.findall('[\'|\"](.*)[\'|\"]', the_str)[0]

def convert_default(it):
    if RepresentsInt(it):
        return int(it)
    elif RepresentsFloat(it):
        return float(it)
    elif it == "None":
        return None
    return remove_quotes(it)

# tactic_todo This isn't general yet. It doesn't handle triple quotes and doesn't check for matching quotes
def get_assignments_from_init(the_str):
    tups = ass_rx.findall(extract_init(the_str))
    res = {}
    for tup in tups:
        res[tup[0]] = convert_default(tup[1])
    return res

# This function returns a tuple with (function_name, args, function_body)
def get_functions_parse(code):
    matches = def_rx.findall(code)
    return matches

def remove_trailing_spaces(the_str):
    res = the_str
    while (res[-1] == " "):
        res = res[:-1]
    return res

# This function returns a dictionary where the keys are function names and the values are the full function code
def get_functions_full_code(code):
    matches = def_fc.findall(code)
    func_dict = {}
    for tup in matches:
        func_dict[tup[1]] = remove_trailing_spaces(tup[0])
    return func_dict


def run_test(tstr):
    res = def_fc.findall(tstr)
    for i, m in enumerate(res):
        print "match " + str(i) + "\n"
        print m[0]

def run_ass_test(tstr):
    res = get_assignments_from_init(tstr)
    print res

test_string = """def test(s):
    match = def_rx.match(s)
    if match:
        name, paramlist = match.groups()
        # extract individual params
        params = [x.group() for x in ident_rx.finditer(paramlist or '')]
        print s, name, params
    else:
        print s, 'does not match'

def test2(b, c):
    print 'hello'
    return

def test3(d, e):
    print 'goodbye'
    return

def test4(d, e):
    print 'goodbye'
    return

    """

ts2 = """@user_tile
class WordFreqDist(TileBase):
    category = "word"
    exports = ["corpus_frequency_fdist", "document_frequency_fdist"]

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.corpus_frequency_fdist = None
        self.document_frequency_fdist = None
        self.number_to_display = 50
        self.save_attrs += self.exports + ["logging_html"]
        self.logging_html = ""
        self.teststing = "blah"
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

    def handle_tile_element_click(self, dataset, doc_name, active_row_index):
        text_to_find = dataset["val"]
        self.clear_table_highlighting()
        self.highlight_matching_text(text_to_find)

    def handle_log_tile(self):
        self.dm(self.logging_html)

    def render_content(self):
        def embedded_func(a, b, c):
            x = 3 + 2
            return x
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
        the_html = self.build_html_table_from_data_list(self.vdata_table, click_type="element-clickable", title="Frequency Distributions")
        self.logging_html = self.build_html_table_from_data_list(self.vdata_table, click_type="element-clickable",
                                                                 title="Frequency Distributions", sidebyside=True)
        return the_html


"""

# from function_recognizer import test_string, def_rx, def_fc, ts2, run_test, run_ass_test
# def_rx.findall(test_string)
# res = def_fc.findall(ts2)


