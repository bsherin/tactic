# These classes provide a more natural interface for getting and setting data in a project collection


class TacticRow:
    def __init__(self, tbinstance, rowid, docname, row_dict=None):
        self.__dict__["_rowid"] = rowid
        self.__dict__["_docname"] = docname
        self.__dict__["_tbinstance"] = tbinstance
        self.__dict__["_row_dict"] = row_dict

    def get_column(self, colname):
        if self.__dict__["_row_dict"] is None:
            return self.__dict__["_tbinstance"].get_row(self.__dict__["_docname"], self.__dict__["_rowid"])[colname]
        else:
            return self.__dict__["_row_dict"][colname]

    def set_column(self, colname, value):
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
        return self.get_column(attr)

    def __getitem__(self, colname):
        return self.get_column(colname)

    def __setitem__(self, colname, value):
        self.set_column(colname, value)

    def __setattr__(self, colname, value):
        self.set_column(colname, value)

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
        return "TacticLine(docname={}, line_number={})".format(self.__dict__["docname"], self.__dict__["line_number"])


class FreeformTacticDocument:
    def __init__(self, tb_instance, docname):
        self._docname = docname
        self._tb_instance = tb_instance
        self._number_lines = self._tb_instance.get_number_rows(docname)
        self._iter_value = -1
        self._text = tb_instance.get_document_data(docname)
        self._line_list = tb_instance.get_document_data_as_list(docname)
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
        if isinstance(x, slice):
            start, stop, step = x.indices(self._number_lines)
            return [TacticLine(self._tb_instance, n, self._docname, self._line_list[n])
                    for n in range(start, stop, step)]
        else:
            return TacticLine(self._tb_instance, x, self._docname, self._line_list[x])

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
        return "FreeformTacticDocument(docname)".format(self.__dict__["docname"])


class TacticDocument:
    def __init__(self, tb_instance, docname, grab_all_rows=True):
        self._docname = docname
        self._tb_instance = tb_instance
        self._number_rows = self._tb_instance.get_number_rows(docname)
        self._column_names = self._tb_instance.get_column_names(docname)
        self._iter_value = -1
        self._grab_all_rows = grab_all_rows
        if grab_all_rows:
            self._row_list = tb_instance.get_document_data_as_list(docname)
        else:
            self._row_list = None

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

    def get_matching_rows(self, func):
        self.rewind()
        return [r for r in self if func(r)]

    def __getitem__(self, x):
        if isinstance(x, slice):
            start, stop, step = x.indices(self._number_rows)
            if self._grab_all_rows:
                return [TacticRow(self._tb_instance, n, self._docname, self._row_list[n])
                        for n in range(start, stop, step)]
            else:
                return [TacticRow(self._tb_instance, n, self._docname) for n in range(start, stop, step)]
        else:
            if self._grab_all_rows:
                return TacticRow(self._tb_instance, x, self._docname, self._row_list[x])
            else:
                return TacticRow(self._tb_instance, x, self._docname)

    def update_document(self):
        self._number_rows = self._tb_instance.get_number_rows(docname)
        if grab_all_rows:
            self._row_list = self._tb_instance.get_document_data_as_list(self._docname)
        else:
            self._row_list = None

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
            new_value = value.row_dict
        else:
            new_value = value
        self._tb_instance.set_document(self, self._docname, {index: new_value})
        return

    def __repr__(self):
        return "TacticDocument(docname)".format(self.__dict__["docname"])
