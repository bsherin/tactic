# These classes provide a more natural interface for getting and setting data in a project collection


class TacticRow:
    def __init__(self, tbinstance, rowid, docname, row_dict=None):
        self.__dict__["_rowid"] = rowid
        self.__dict__["_docname"] = docname
        self.__dict__["_tbinstance"] = tbinstance
        self.__dict__["_row_dict"] = row_dict

    def _get_field(self, colname):
        if self.__dict__["_row_dict"] is None:
            return self.__dict__["_tbinstance"].get_row(self.__dict__["_docname"], self.__dict__["_rowid"])[colname]
        else:
            return self.__dict__["_row_dict"][colname]

    def _set_field(self, colname, value):
        self.__dict__["_tbinstance"].set_cell(self.__dict__["_docname"],
                                              self.__dict__["_rowid"],
                                              colname,
                                              value,
                                              cellchange=False)
        if self.__dict__["_row_dict"] is not None:
            self.__dict__["_row_dict"][colname] = value
        return

    def set_background(self, column_name, color):
        self.set_cell_background(self.__dict__["_docname"], self.__dict__["_rowid"], column_name, color)
        return

    @property
    def row_dict(self):
        if self.__dict__["_row_dict"] is None:
            return self.__dict__["_tbinstance"].get_row(self.__dict__["_docname"], self.__dict__["_rowid"])
        else:
            return self.__dict__["_row_dict"]

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

    def __repr__(self):
        return "TacticRow(docname={}, rowid={})".format(self.__dict__["_docname"], self.__dict__["_rowid"])


class TacticLine:
    def __init__(self, tbinstance, line_number, docname, line_text):
        self.__dict__["_line_number"] = line_number
        self.__dict__["_docname"] = docname
        self.__dict__["_tbinstance"] = tbinstance
        self.__dict__["_text"] = line_text

    @property
    def text(self):
        return self._text

    @property
    def line_number(self):
        return self._line_number

    def __getitem__(self, charnum):
        return self.__dict__["line_text"][charnum]

    def __setitem__(self, colname, value):
        raise NotImplementedError

    def __repr__(self):
        return "TacticLine(docname={}, line_number={})".format(self.__dict__["_docname"], self.__dict__["_line_number"])


class FreeformTacticDocument:
    def __init__(self, tb_instance, docname):
        self._docname = docname
        self._tb_instance = tb_instance
        self._number_lines = self._tb_instance.get_number_rows(docname)
        self._iter_value = -1
        self._text = tb_instance.get_document_data(docname)
        lines = tb_instance.get_document_data_as_list(docname)
        self._line_list = [TacticLine(self._tb_instance, n, self._docname, the_line)
                           for n, the_line in enumerate(lines)]
        self._iter_value = -1

    @property
    def metadata(self):
        return self._tb_instance.get_document_metadata(self._docname)

    @metadata.setter
    def metadata(self, new_metadata):
        self._tb_instance.set_document_metadata(self._docname, new_metadata)
        return

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

    def __len__(self):
        return self._number_lines

    def __setitem__(self, colname, value):
        raise NotImplementedError

    def __repr__(self):
        return "FreeformTacticDocument({})".format(self._docname)


class TacticDocument:
    def __init__(self, tb_instance, docname, grab_all_rows=True):
        self._docname = docname
        self._tb_instance = tb_instance
        self._number_rows = self._tb_instance.get_number_rows(docname)
        self._column_names = self._tb_instance.get_column_names(docname)
        self._iter_value = -1
        self._grab_all_rows = grab_all_rows
        if grab_all_rows:
            dict_list = tb_instance.get_document_data_as_list(docname)
            self._row_list = [TacticRow(self._tb_instance, n, self._docname, rdict)
                              for n, rdict in enumerate(dict_list)]
        else:
            self._row_list = None

    @property
    def name(self):
        return self._docname

    @property
    def metadata(self):
        return self._tb_instance.get_document_metadata(self._docname)

    @metadata.setter
    def metadata(self, new_metadata):
        self._tb_instance.set_document_metadata(self._docname, new_metadata)
        return

    @property
    def column_names(self):
        return self._column_names

    @property
    def dict_list(self):
        if grab_all_rows:
            return [r.row_dict for r in self._row_list]
        else:
            return self._tb_instance.get_document_data_as_list(docname)

    def get_matching_rows(self, func):
        self.rewind()
        return [r for r in self if func(r.row_dict)]

    def set_column_data(self, column_name, data_list_or_dict, cellchange=False):
        self._tb_instance.set_column_data(self._docname, column_name, data_list_or_dict, cellchange)
        return

    def __getitem__(self, x):
        if self._grab_all_rows:
            return self._row_list[x]
        elif isinstance(x, slice):
            start, stop, step = x.indices(self._number_rows)
            return [TacticRow(self._tb_instance, n, self._docname) for n in range(start, stop, step)]
        else:
            return TacticRow(self._tb_instance, x, self._docname)

    def __iter__(self):
        return self

    def rewind(self):
        self._iter_value = -1

    def __next__(self):
        self._iter_value += 1
        if self._iter_value == self._number_rows:
            raise StopIteration
        else:
            return self[self._iter_value]

    def __len__(self):
        return self._number_rows

    def __setitem__(self, index, value):
        if isinstance(value, TacticRow):
            new_row = value
        else:
            new_row = TacticRow(self._tb_instance, index, self._docname, value)

        if self._grab_all_rows:
            self._row_list[index] = new_row

        rdict = new_row.__dict__["_row_dict"]
        if rdict is not None:
            self._tb_instance.set_document(self._docname, {index: rdict}, cellchange=False)
        return

    def __repr__(self):
        return "TacticDocument({})".format(self._docname)


class TacticCollection:
    def __init__(self, tb_instance, grab_all_docs=False):
        self._iter_value = -1
        self._tb_instance = tb_instance
        self._doc_type = tb_instance.doc_type
        self._doc_names = self._tb_instance.get_document_names()
        self._number_docs = len(self._doc_names)
        self._grab_all_docs = grab_all_docs
        if self._doc_type == "freeform":
            self._doc_class = FreeformTacticDocument
        else:
            self._doc_class = TacticDocument

        if grab_all_docs:
            self._doc_dict = {dname: self._doc_class(self._tb_instance, dname)
                              for dname in self._doc_names}
        else:
            self._doc_dict = None
        return

    @property
    def document_names(self):
        return self._doc_names

    @property
    def current_document(self):
        return self[self._tb_instance.get_current_document_name()]

    def __getitem__(self, x):
        if self._grab_all_docs:
            return self._doc_dict[x]
        else:
            return self._doc_class(self._tb_instance, x)

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

    def __setitem__(self, docname, new_data):
        raise NotImplementedError

    def __repr__(self):
        return "TacticCollection with {} docs".format(str(len(self)))