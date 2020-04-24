# These classes provide a more natural interface for getting and setting data in a project collection

import os
import copy
# noinspection PyPackageRequirements
import pandas as _pd
CHUNK_SIZE = int(os.environ.get("CHUNK_SIZE"))
_protected_column_names = ["__id__", "__filename__"]

ROWS_TO_PRINT = 10


def remove_protected_fields_from_dict(adict):
    ndict = copy.copy(adict)
    for field in _protected_column_names:
        if field in ndict:
            del ndict[field]
    return ndict


def remove_protected_fields_from_list(alist):
    return [it for it in alist if it not in _protected_column_names]


_tworker = None


class TacticRow:
    _state_vars = ["_rowid", "_docname", "_row_dict"]

    def __init__(self, rowid, docname, row_dict=None):
        self.__dict__["_rowid"] = rowid
        self.__dict__["_docname"] = docname
        self.__dict__["_row_dict"] = row_dict

    def keys(self):
        return self.row_dict.keys()

    def detach(self):
        return DetachedTacticRow(self.row_dict)

    def _remove_protected_fields(self):
        self.__dict__["_row_dict"] = remove_protected_fields_from_dict(self.__dict__["_row_dict"])

    def _get_field(self, colname):
        if colname == "compile_save_dict":  # this is necessary for use of hasattr to check for this
            raise AttributeError
        if self.__dict__["_row_dict"] is None:
            return _tworker.tile_instance.get_row(self.__dict__["_docname"], self.__dict__["_rowid"])[colname]
        else:
            return self.__dict__["_row_dict"][colname]

    def _set_field(self, colname, value):
        _tworker.tile_instance.set_cell(self.__dict__["_docname"],
                                        self.__dict__["_rowid"],
                                        colname,
                                        value,
                                        cellchange=False)
        if self.__dict__["_row_dict"] is not None:
            self.__dict__["_row_dict"][colname] = value
        return

    def set_background(self, column_name, color):
        _tworker.tile_instance.set_cell_background(self.__dict__["_docname"],
                                                   self.__dict__["_rowid"], column_name, color)
        return

    @property
    def row_dict(self):
        if self.__dict__["_row_dict"] is None:
            return _tworker.tile_instance.get_row(self.__dict__["_docname"], self.__dict__["_rowid"])
        else:
            return copy.copy(self.__dict__["_row_dict"])

    @property
    def series(self):
        return _pd.Series(self.row_dict)

    def __getattr__(self, attr):
        return self._get_field(attr)

    def __getitem__(self, colname):
        return self._get_field(colname)

    def __setitem__(self, colname, value):
        self._set_field(colname, value)

    def __setattr__(self, colname, value):
        self._set_field(colname, value)

    def __contains__(self, name):
        return name in self.row_dict

    def __getstate__(self):
        return {k: self.__dict__[k] for k in self._state_vars}

    def __setstate__(self, state):
        for k in self._state_vars:
            self.__dict__[k] = state[k]
        return

    def __str__(self):
        return _tworker.tile_instance.html_table(dict(self),
                                                 header_style="font-size:12px",
                                                 body_style="font-size:12px")

    def __repr__(self):
        return "TacticRow({})".format(str(dict(self)))


class DetachedTacticRow:

    def __init__(self, row_dict):
        if isinstance(row_dict, _pd.Series):
            the_dict = row_dict.to_dict()
        else:
            the_dict = row_dict
        self.__dict__["_row_dict"] = the_dict
        return

    def keys(self):
        return self.row_dict.keys()

    def __getstate__(self):
        return {"_row_dict": self._row_dict}

    def __setstate__(self, state):
        self.__dict__["_row_dict"] = state["_row_dict"]
        return

    @property
    def row_dict(self):
        return copy.copy(self.__dict__["_row_dict"])

    @property
    def series(self):
        return _pd.Series(self.row_dict)

    def _set_field(self, colname, value):
        self.__dict__["_row_dict"][colname] = value
        return

    def __getattr__(self, attr):
        if attr == "compile_save_dict":  # this is necessary for use of hasattr to check for this
            raise AttributeError
        return self.__dict__["_row_dict"][attr]

    def __getitem__(self, colname):
        return self.__dict__["_row_dict"][colname]

    def __setitem__(self, colname, value):
        self._set_field(colname, value)

    def __setattr__(self, colname, value):
        self._set_field(colname, value)

    def __contains__(self, name):
        return name in self.row_dict

    def __str__(self):
        return _tworker.tile_instance.html_table(dict(self),
                                                 header_style="font-size:12px",
                                                 body_style="font-size:12px")

    def __repr__(self):
        return "DetachedTacticRow({})".format(str(dict(self)))

    def __delitem__(self, key):
        del self.__dict__["_row_dict"][key]

    def __delattr__(self, attr):
        self.__delitem__(attr)

    def set_background(self, column_name, color):
        raise NotImplementedError


class TacticLine:
    _state_vars = ["_line_number", "_docname", "_text"]

    def __init__(self, line_number, docname, line_text):
        self.__dict__["_line_number"] = line_number
        self.__dict__["_docname"] = docname
        self.__dict__["_text"] = line_text

    @property
    def text(self):
        return self._text

    @property
    def line_number(self):
        return self._line_number

    def detach(self):
        return DetachedTacticLine(self.text)

    def __getitem__(self, charnum):
        return self._text[charnum]

    def __setitem__(self, colname, value):
        raise NotImplementedError

    def __repr__(self):
        return 'TacticLine("{}")'.format(self.text)

    def __str__(self):
        return self.text

    def __getstate__(self):
        return {k: self.__dict__[k] for k in self._state_vars}

    def __setstate__(self, state):
        for k in self._state_vars:
            self.__dict__[k] = state[k]
        return


class DetachedTacticLine:
    def __init__(self, line_text=""):
        self._text = line_text

    def __getstate__(self):
        return {"_text": self.text}

    def __setstate__(self, state):
        self._text = state["_text"]
        return

    @property
    def text(self):
        return self._text

    @text.setter
    def text(self, new_text):
        self._text = new_text

    def __getitem__(self, charnum):
        return self.line_text[charnum]

    def __setitem__(self, charnum, value):
        raise NotImplementedError

    def __repr__(self):
        return 'DetachedTacticLine("{}")'.format(self.text)

    def __str__(self):
        return self.text

    def set_background(self, column_name, color):
        raise NotImplementedError


class FreeformTacticDocument:
    _state_vars = ["_docname", "_number_lines"]

    def __init__(self, docname, number_rows=None):
        self._docname = docname
        if number_rows is None:
            self._number_lines = _tworker.tile_instance.get_number_rows(docname)
        else:
            self._number_lines = number_rows
        self._initialize_state()

    def _initialize_state(self):
        self._iter_value = -1
        self._text = _tworker.tile_instance.get_document_data(self._docname)
        lines = _tworker.tile_instance.get_document_data_as_list(self._docname)
        self._line_list = [TacticLine(n, self._docname, the_line)
                           for n, the_line in enumerate(lines)]
        self._iter_value = -1

    def __getstate__(self):
        return {k: self.__dict__[k] for k in self._state_vars}

    def __setstate__(self, state):
        for k in self._state_vars:
            self.__dict__[k] = state[k]
        self._initialize_state()
        return

    @property
    def line_list(self):
        return self._line_list

    @property
    def name(self):
        return self._docname

    @property
    def metadata(self):
        return _tworker.tile_instance.get_document_metadata(self._docname)

    @metadata.setter
    def metadata(self, new_metadata):
        _tworker.tile_instance.set_document_metadata(self._docname, new_metadata)
        return

    def tokenize(self, tokenizer_func=None):
        if tokenizer_func is None:
            import nltk
            tokenizer_func = nltk.word_tokenize
        self.rewind()
        return [tokenizer_func(l.text) for l in self]

    @property
    def text(self):
        return self._text

    def __getitem__(self, x):
        return self._line_list[x]

    def __iter__(self):
        return self

    def __next__(self):
        self._iter_value += 1
        if self._iter_value == self._number_lines:
            raise StopIteration
        else:
            return self[self._iter_value]

    def rewind(self):
        self._iter_value = -1

    def __len__(self):
        return self._number_lines

    def detach(self):
        detached_lines = [line.detach() for line in self.line_list]
        return DetachedFreeformTacticDocument(self.name, detached_lines, self.metadata)

    def __setitem__(self, colname, value):
        raise NotImplementedError

    def __repr__(self):
        return "FreeformTacticDocument({})".format(self._docname)

    def __str__(self):
        res = ""
        to_print = min([ROWS_TO_PRINT, self._number_lines])
        for k in range(to_print):
            res += str(self[k]) + "\n"
        return "<pre>{}</pre>".format(res)


class DetachedFreeformTacticDocument(FreeformTacticDocument):
    def __init__(self, docname="document1", text=None, metadata=None):
        self._docname = docname
        self._iter_value = -1
        self._line_list = []
        if metadata is None:
            self._metadata = {}
        else:
            self._metadata = metadata
        if text is None:
            self._line_list = []
        elif isinstance(text, str):
            lines = text.split("\n")
            self._line_list = [DetachedTacticLine(the_line) for n, the_line in enumerate(lines)]
        elif isinstance(text, list):
            for the_line in text:
                if isinstance(the_line, DetachedTacticLine):
                    self._line_list.append(the_line)
                elif isinstance(the_line, str):
                    self._line_list.append(DetachedTacticLine(the_line))
                else:
                    raise TypeError("List argument to DetachedFreeformTacticDocument had an item of an unknown type.")
        else:
            raise TypeError("Text argument to DetachedFreeformTacticDocument is not a string or list")

        self.update_props()
        return

    def __getstate__(self):
        text_list = [l.text for l in self.line_list]
        return {"_docname": self._docname,
                "_metadata": self.metadata,
                "text_list": text_list}

    def __setstate__(self, state):
        self._docname = state["_docname"]
        self._metadata = state["_metadata"]
        self._line_list = []
        for txt in state["text_list"]:
            self._line_list.append(DetachedTacticLine(txt))
        self._iter_value = -1
        self.update_props()
        return

    @property
    def metadata(self):
        return self._metadata

    @metadata.setter
    def metadata(self, new_metadata):
        self._metadata = new_metadata
        self.update_props()
        return

    @property
    def name(self):
        return self._docname

    @name.setter
    def name(self, newname):
        self._docname = newname
        self.update_props()
        return

    def update_props(self):
        self._number_lines = len(self._line_list)
        self._metadata["number_of_lines"] = self._number_lines
        self._metadata["length"] = len(self.text)
        self._metadata["name"] = self._docname

    @property
    def text(self):
        txt = ""
        for l in self._line_list:
            txt = txt + l.text + "\n"
        return txt

    def __iadd__(self, other):
        if not isinstance(other, DetachedFreeformTacticDocument):
            raise TypeError("added object is not a DetachedFreeformTacticDocument")
        self._line_list += other._line_list
        self.update_props()
        return self

    def append(self, detached_line):
        if not isinstance(detached_line, DetachedTacticLine):
            raise TypeError("appended object is not a DetachedTacticLine")
        self._line_list.append(detached_line)
        self.update_props()
        return

    def __setitem__(self, index, value):
        if isinstance(value, DetachedTacticLine):
            new_line = value
        elif isinstance(value, str):
            new_line = DetachedTacticLine(value)
        else:
            raise TypeError("New line must be a DetachedTacticLine or a string")
        self._line_list[index] = new_line
        return


class TacticDocument:
    _state_vars = ["_docname", "_number_rows", "_column_names", "_unprotected_column_names"]

    def __init__(self, docname, number_rows=None, column_names=None):
        self._docname = docname
        self._iter_value = -1
        self._number_rows = number_rows
        self._column_names = column_names
        self._unprotected_column_names = remove_protected_fields_from_list(self._column_names)
        self._current_chunk_start = 0
        self._row_list = None
        self._get_chunk()
        return

    def _reinitialize(self, docname=None, number_rows=None, column_names=None):
        if docname is not None:
            self._docname = docname
        if number_rows is not None:
            self._number_rows = number_rows
        if column_names is not None:
            self._column_names = column_names
        self._get_chunk()
        return

    def __getstate__(self):
        return {k: self.__dict__[k] for k in self._state_vars}

    def __setstate__(self, state):
        for k in self._state_vars:
            self.__dict__[k] = state[k]
        self._iter_value = -1
        self._row_list = None
        self._current_chunk_start = 0
        self._get_chunk()
        return

    def _get_chunk(self):
        dict_list = _tworker.tile_instance.get_rows(self._docname, self._current_chunk_start,
                                                    self._current_chunk_start + CHUNK_SIZE)
        self._row_list = [TacticRow(n + self._current_chunk_start, self._docname, rdict)
                          for n, rdict in enumerate(dict_list)]
        return

    @property
    def name(self):
        return self._docname

    @property
    def metadata(self):
        return _tworker.tile_instance.get_document_metadata(self._docname)

    @metadata.setter
    def metadata(self, new_metadata):
        if not isinstance(new_metadata, dict):
            raise TypeError("Metadata must be set to a dict")
        _tworker.tile_instance.set_document_metadata(self._docname, new_metadata)
        return

    @property
    def column_names(self):
        return self._column_names

    @property
    def dict_list(self):
        return _tworker.tile_instance.get_document_data_as_list(self._docname)

    @property
    def df(self):
        return _pd.DataFrame(self.dict_list)

    def column(self, column_name):
        return _tworker.tile_instance.get_column_data(column_name, self.name)

    def get_matching_rows(self, func):
        self.rewind()
        return [r for r in self if func(r)]

    def set_column_data(self, column_name, data_list_or_dict, cellchange=False):
        _tworker.tile_instance.set_column_data(self._docname, column_name, data_list_or_dict, cellchange)
        return

    def _r_in_chunk(self, r):
        return (r >= self._current_chunk_start) and (r < self._current_chunk_start + CHUNK_SIZE)

    def _get_chunk_start(self, r):
        return int(r / CHUNK_SIZE) * CHUNK_SIZE

    def _relative_r(self, r):
        return r - self._current_chunk_start

    def _update_chunk(self, r):
        if self._r_in_chunk(r):
            return
        else:
            self._current_chunk_start = self._get_chunk_start(r)
            self._get_chunk()
        return

    def tokenize(self, column_name, tokenizer_func=None):
        if tokenizer_func is None:
            import nltk
            tokenizer_func = nltk.word_tokenize
        return [tokenizer_func(txt) for txt in self.column(column_name)]

    def to_html(self, title=None, click_type="word-clickable",
                sortable=True, sidebyside=False, has_header=True,
                max_rows=None, header_style=None, body_style=None,
                column_order=None, include_row_labels=False):
        self.rewind()
        return _tworker.tile_instance.html_table(self.df, title, click_type, sortable, sidebyside, has_header,
                                                 max_rows, header_style, body_style, column_order, include_row_labels)

    def detach(self):
        return DetachedTacticDocument(self.dict_list, self.name, self.metadata)

    def __getitem__(self, x):
        if isinstance(x, slice):
            start = x.start
            stop = x.stop
            if start is None:
                start = 0
            elif start < 0:
                start = self._number_rows + start
            if stop is None:
                stop = self._number_rows
            elif stop < 0:
                stop = self._number_rows + stop
            if stop <= start:
                return []
            if self._r_in_chunk(start) and self._r_in_chunk(stop):
                return self._row_list[self._relative_r(start):self._relative_r(stop)]
            elif (stop - start) < CHUNK_SIZE:
                self._current_chunk_start = start
                self._get_chunk()
                return self._row_list[:(stop - start)]
            else:
                return [TacticRow(n, self._docname) for n in range(start, stop)]
        else:
            if isinstance(x, str):
                x = int(x)
            if x < 0:
                x = self._number_rows + x
            self._update_chunk(x)
            return self._row_list[self._relative_r(x)]

    def __iter__(self):
        return self

    def rewind(self):
        self._iter_value = -1

    def insert(self, position, dict_or_element=None):
        if isinstance(dict_or_element, DetachedTacticRow):
            rdict = dict_or_element.row_dict
        else:
            rdict = dict_or_element
        _tworker.tile_instance.insert_row(self.name, position, rdict)
        return

    def __delitem__(self, rownum):
        _tworker.tile_instance.delete_row(self.name, rownum)

    def __next__(self):
        self._iter_value += 1
        if self._iter_value == self._number_rows:
            raise StopIteration
        else:
            return self[self._iter_value]

    def __len__(self):
        return self._number_rows

    def __setitem__(self, index, value):
        if isinstance(index, str):
            index = int(index)
        if isinstance(value, TacticRow):
            new_row = value
        else:
            new_row = TacticRow(index, self._docname, value)

        new_row._remove_protected_fields()

        assert set(new_row.row_dict.keys()) == set(self._unprotected_column_names), "New row doesn't have " \
                                                                                    "the correct field names."

        if self._r_in_chunk(index):
            old_row = self._row_list[self._relative_r(index)]
            for k in old_row.row_dict.keys():  # To get protected data
                if k not in new_row:
                    new_row[k] = old_row[k]
            self._row_list[self._relative_r(index)] = new_row

        rdict = new_row.__dict__["_row_dict"]
        if rdict is not None:
            _tworker.tile_instance.set_document(self._docname, {index: rdict}, cellchange=False)
        return

    def __repr__(self):
        return "TacticDocument({})".format(self._docname)

    def __str__(self):
        return _tworker.tile_instance.html_table(self.df.head(ROWS_TO_PRINT),
                                                 header_style="font-size:12px",
                                                 body_style="font-size:12px")


# To do: overload add

class DetachedTacticDocument(TacticDocument):
    def __init__(self, doc_data=None, docname="document1", metadata=None):
        self._docname = docname
        self._iter_value = -1
        self._column_names = []
        self._row_list = []
        if metadata is None:
            self._metadata = {}
        else:
            self._metadata = metadata
        if doc_data is not None:
            if isinstance(doc_data, _pd.DataFrame):
                for index, the_row in doc_data.iterrows():
                    self._row_list.append(DetachedTacticRow(the_row))
            else:
                for r in doc_data:
                    if isinstance(r, DetachedTacticRow):
                        self._row_list.append(r)
                    else:
                        self._row_list.append(DetachedTacticRow(r))
        self.update_props()
        return

    def __getstate__(self):
        return {"_docname": self._docname,
                "_metadata": self.metadata,
                "_column_names": self.column_names,
                "_dict_list": self.dict_list}

    def __setstate__(self, state):
        self._docname = state["_docname"]
        self._metadata = state["_metadata"]
        self._column_names = state["_column_names"]
        self._row_list = []
        for r in state["_dict_list"]:
            self._row_list.append(DetachedTacticRow(r))
        self._iter_value = -1
        self.update_props()
        return

    @property
    def name(self):
        return self._docname

    @name.setter
    def name(self, newname):
        self._docname = newname
        self.update_props()
        return

    @property
    def metadata(self):
        return self._metadata

    @metadata.setter
    def metadata(self, new_metadata):
        self._metadata = new_metadata
        self.update_props()
        return

    def column(self, column_name):
        data_list = []
        if column_name in self.column_names:
            self.rewind()
            for r in self:
                data_list.append(r[column_name])
        return data_list

    def update_props(self):
        self._number_rows = len(self._row_list)
        self._metadata["number_of_rows"] = self._number_rows
        self._metadata["name"] = self._docname
        if self._number_rows > 0:
            self._column_names = list(self.df.columns)

    @property
    def dict_list(self):
        return [r.row_dict for r in self._row_list]

    def __iadd__(self, tdoc):
        if not isinstance(tdoc, DetachedTacticDocument):
            raise TypeError("added object is not a DetachedTacticDocument")
        assert tdoc.column_names == self.column_names
        self._row_list += tdoc._row_list
        self.update_props()
        return self

    def add_column(self, column_name):
        self._column_names.append(column_name)
        for r in self._row_list:
            r[column_name] = None
        return

    def set_column_data(self, column_name, data_list, cellchange=None):
        for r, datum in enumerate(data_list):
            self[r][column_name] = datum
        return

    def append(self, detached_row):
        if not isinstance(detached_row, DetachedTacticRow):
            raise TypeError("appended object is not a DetachedTacticRow")
        self._row_list.append(detached_row)
        self.update_props()
        return

    def insert(self, position, element):
        if not isinstance(element, DetachedTacticRow):
            element = DetachedTacticRow(element)
        self._row_list.insert(position, element)
        self.update_props()
        return

    def __getitem__(self, x):
        nrows = len(self._row_list)
        if isinstance(x, slice):
            start = x.start
            stop = x.stop
            if start is None:
                start = 0
            elif start < 0:
                start = nrow + start
            if stop is None:
                stop = nrows
            elif stop < 0:
                stop = nrows + stop
            if stop <= start:
                return []

            return self._row_list[start:stop]
        else:
            if isinstance(x, str):
                x = int(x)
            if x < 0:
                x = nrows + x
            return self._row_list[x]

    def __setitem__(self, index, value):
        if isinstance(value, DetachedTacticRow):
            new_row = value
        elif isinstance(value, dict):
            new_row = DetachedTacticRow(value)
        else:
            raise TypeError("New row must be a DetachedTacticRow or a dict")
        for colname in new_row.row_dict.keys():
            if colname not in self.column_names:
                raise NameError("Fieldname {} is not a column in this document.".format(colname))
        for colname in self.column_names:
            if colname not in new_row:
                new_row[colname] = None
        if isinstance(index, str):
            index = int(index)
        self._row_list[index] = new_row
        return

    def __len__(self):
        return len(self._row_list)

    def __delitem__(self, index):
        if isinstance(index, str):
            index = int(index)
        del self._row_list[index]
        return

    def __repr__(self):
        return "DetachedTacticDocument({})".format(self._docname)


class TacticCollection:
    def __init__(self):
        self._iter_value = -1
        self._collection_info = None
        self._doc_type = None
        self._doc_names = None
        self._number_docs = None
        self._grab_all_docs = None
        self._doc_class = None
        self._doc_dict = None
        self._metadata = None
        return

    def __getstate__(self):
        return {"_grab_all_docs": self._grab_all_docs}

    def __setstate__(self, state):
        self._iter_value = -1
        self._collection_info = None
        self._doc_type = None
        self._doc_names = None
        self._number_docs = None
        self._grab_all_docs = state["_grab_all_docs"]
        self._doc_class = None
        self._doc_dict = None
        self._metadata = None
        self.__fully_initialize__(grab_all_docs=self._grab_all_docs)

    def __fully_initialize__(self, grab_all_docs=False):
        print('entering fully initialize')
        self._iter_value = -1
        self._collection_info = _tworker.tile_instance.get_collection_info()
        self._doc_type = _tworker.tile_instance.doc_type
        print('got doc type {}'.format(self._doc_type))
        self._doc_names = list(self._collection_info.keys())
        self._number_docs = len(self._doc_names)
        self._grab_all_docs = grab_all_docs
        if self._doc_type == "freeform":
            self._doc_class = FreeformTacticDocument
        else:
            self._doc_class = TacticDocument

        if grab_all_docs:
            self._doc_dict = {dname: self._create_doc_object(dname) for dname in self._doc_names}
        else:
            self._doc_dict = {}
        return

    def _reinitializeDoc(self, docname, number_rows):
        if docname in self._doc_dict:
            self._doc_dict[docname]._reinitialize(None, number_rows, None)
        return

    def detach(self):
        dict_for_detach = {}
        for name in self.document_names:
            dict_for_detach[name] = self[name].detach()
        return DetachedTacticCollection(self._doc_type, dict_for_detach)

    @property
    def document_names(self):
        return self._doc_names

    def matching_documents(self, filter_function):
        return _tworker.tile_instance.get_matching_documents(filter_function)

    @property
    def current_document(self):
        return self[_tworker.tile_instance.get_current_document_name()]

    def _create_doc_object(self, dname):
        if self._doc_type == "freeform":
            return self._doc_class(dname, self._collection_info[dname]["number_rows"])
        else:
            return self._doc_class(dname, self._collection_info[dname]["number_rows"],
                                   self._collection_info[dname]["column_names"])

    def column(self, column_name):
        if self._doc_type == "freeform":
            raise Exception("TacticCollection.column not defined for freeform collections")
        return _tworker.tile_instance.get_column_data(column_name)

    def tokenize(self, column_name=None, tokenizer_func=None):
        if tokenizer_func is None:
            import nltk
            tokenizer_func = nltk.word_tokenize
        if self._doc_type == "table":
            if column_name is None:
                raise ValueError("column_name required for table collections.")
            else:
                result = [tokenizer_func(txt) for txt in self.column(column_name)]
                return result
        else:
            result_list = []
            self.rewind()
            for doc in self:
                result_list += doc.tokenize(column_name, tokenizer_func)
            return result_list

    def __getitem__(self, x):
        if x not in self._doc_names:
            raise KeyError("No document named '{}'".format(x))
        if x not in self._doc_dict:
            self._doc_dict[x] = self._create_doc_object(x)
        return self._doc_dict[x]

    def __iter__(self):
        return self

    def rewind(self):
        self._iter_value = -1

    def __next__(self):
        self._iter_value += 1
        if self._iter_value == self._number_docs:
            raise StopIteration
        else:
            return self[self._doc_names[self._iter_value]]

    def __len__(self):
        return self._number_docs

    def append(self, new_doc):
        if self._doc_type == "freeform":
            if not isinstance(new_doc, DetachedFreeformTacticDocument):
                raise TypeError("Not a DetachedFreeformTacticDocument")
            _tworker.tile_instance.add_freeform_document(new_doc.name, new_doc.text)
        else:
            if not isinstance(new_doc, DetachedTacticDocument):
                raise TypeError("Not a DetachedTacticDocument")
            _tworker.tile_instance.add_document(new_doc.name, new_doc.column_names,
                                                new_doc.dict_list)

    def __setitem__(self, docname, new_doc):
        if self._doc_type == "freeform":
            if not isinstance(new_doc, DetachedFreeformTacticDocument):
                raise TypeError("Not a DetachedFreeformTacticDocument")
            new_doc._docname = docname
            _tworker.tile_instance.add_freeform_document(docname, new_doc.text)
        else:
            if not isinstance(new_doc, DetachedTacticDocument):
                raise TypeError("Not a DetachedTacticDocument")
            new_doc._docname = docname
            _tworker.tile_instance.add_document(docname, new_doc.column_names,
                                                new_doc.dict_list)

    def __delitem__(self, docname):
        _tworker.tile_instance.remove_document(docname)

    def __delattr__(self, attr):
        self.__delitem__(attr)

    def __repr__(self):
        return "TacticCollection with {} docs".format(str(len(self)))


class DetachedTacticCollection(TacticCollection):
    def __init__(self, doc_type, doc_dict=None, collection_metadata=None):
        self._iter_value = -1
        self._doc_type = doc_type
        self._doc_names = []
        self._number_docs = 0
        if self._doc_type == "freeform":
            self._doc_class = DetachedFreeformTacticDocument
        else:
            self._doc_class = DetachedTacticDocument
        self._grab_all_docs = True
        if doc_dict is None:
            self._doc_dict = {}
        else:
            for doc in doc_dict.values():
                if not isinstance(doc, self._doc_class):
                    raise TypeError("A new collection must be built from DetachedTacticDocument objects.")
            self._doc_dict = doc_dict
        if collection_metadata is None:
            self.metadata = {}
        else:
            self.metadata = collection_metadata
        self.update_props()
        return

    def __getstate__(self):
        return {"_doc_type": self._doc_type,
                "_doc_dict": self._doc_dict,
                "metadata": self.metadata}

    def __setstate__(self, state):
        self._doc_type = state["_doc_type"]
        if self._doc_type == "freeform":
            self._doc_class = DetachedFreeformTacticDocument
        else:
            self._doc_class = DetachedTacticDocument
        self._doc_dict = state["_doc_dict"]
        self.metadata = state["metadata"]
        self.update_props()
        return

    def append(self, detached_doc):
        if not isinstance(detached_doc, self._doc_class):
            raise TypeError("appended object is not a DetachedTacticDocument")
        if detached_doc.name in self._doc_dict:
            raise FileExistsError("document name exists")
        self._doc_dict[detached_doc.name] = detached_doc
        self.update_props()
        return

    def column(self, column_name):
        data_list = []
        self.rewind()
        for doc in self:
            data_list += doc.column(column_name)
        return data_list

    def update(self, other_collection):
        if not isinstance(other_collection, TacticCollection):
            raise TypeError("Argument is not a TacticCollection or DetachedTacticCollection")
        other_collection.rewind()
        for doc in other_collection:
            if not isinstance(doc, self._doc_class):
                detached_doc = doc.detach()
            else:
                detached_doc = doc
            self._doc_dict[detached_doc.name] = detached_doc
            self.update_props()
        return

    def __add__(self, other):
        if not isinstance(other_collection, TacticCollection):
            raise TypeError("Can only combine with a DetachedTacticCollection")
        new_doc_dict = self._doc_dict
        new_doc_dict.update(other._doc_dict)
        return DetachedTacticCollection(self._doc_type, new_doc_dict)

    def __iadd__(self, other):
        if not isinstance(other, DetachedTacticCollection):
            raise TypeError("Not a DetachedTacticCollection")
        self._doc_dict.update(other._doc_dict)
        self.update_props()
        return self

    def __getitem__(self, x):
        if x not in self._doc_names:
            raise KeyError("No document named '{}'".format(x))
        return self._doc_dict[x]

    def update_props(self):
        self._doc_names = list(self._doc_dict.keys())
        self._number_docs = len(self._doc_names)
        self.metadata["number_of_docs"] = self._number_docs
        return

    def current_document(self):
        raise NotImplementedError

    def __setitem__(self, docname, new_doc):
        if not isinstance(new_doc, DetachedTacticDocument):
            raise TypeError("Not a DetachedTacticDocument")
        new_doc._docname = docname
        self._doc_dict[docname] = new_doc
        self.update_props()

    def add_to_library(self, collection_name):
        full_collection = {}
        metadata_dict = {}
        self.rewind()
        for doc in self:
            full_collection[doc.name] = doc.dict_list
            metadata_dict[doc.name] = doc.metadata
        _tworker.tile_instance.create_collection(collection_name, full_collection, self._doc_type, metadata_dict)

    def __repr__(self):
        return "DetachedTacticCollection with {} docs".format(str(len(self)))


Collection = TacticCollection()
