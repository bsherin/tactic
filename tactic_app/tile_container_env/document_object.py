class TacticRow():
    def __init__(self, tbinstance, rowid, docname, row_dict=None):
        self.__dict__["rowid"] = rowid
        self.__dict__["docname"] = docname
        self.__dict__["tbinstance"] = tbinstance
        self.__dict__["row_dict"] = row_dict

    def get_column(self, colname):
        if self.__dict__["row_dict"] is None:
            return self.__dict__["tbinstance"].get_row(self.__dict__["docname"], self.__dict__["rowid"])[colname]
        else:
            return self.__dict__["row_dict"][colname]

    def set_column(self, colname, value):
        self.__dict__["tbinstance"].set_cell(self.__dict__["docname"],
                                             self.__dict__["rowid"],
                                             colname,
                                             value,
                                             cellchange=False)
        if self.__dict__["row_dict"] is not None:
            self.__dict__["row_dict"][colname] = value
        return

    def __getattr__(self, colname):
        return self.get_column(colname)

    def is_column(self, colname):
        return colname in self.__dict__["column_names"]

    def __getitem__(self, colname):
        return self.get_column(colname)

    def __setitem__(self, colname, value):
        self.set_column(colname, value)

    def __setattr__(self, colname, value):
        self.set_column(colname, value)

    def __repr__(self):
        return "TacticRow(docname={}, rowid={})".format(self.__dict__["rowid"], self.__dict__["docname"])


class TacticDocument():
    def __init__(self, tb_instance, docname, grab_all_rows=True):
        self.docname = docname
        self.tb_instance = tb_instance
        self.number_rows = self.tb_instance.get_number_rows(docname)
        self.iter_value = -1
        self.grab_all_rows = grab_all_rows
        if grab_all_rows:
            self.row_list = tb_instance.get_document_data_as_list(docname)
        else:
            self.row_list = None

    @property
    def metadata(self):
        return self.tb_instance.get_document_metadata(self.docname)

    def __getitem__(self, x):
        if isinstance(x, slice):
            start, stop, step = x.indices(self.number_rows)
            if self.grab_all_rows:
                return [TacticRow(self.tb_instance, n, self.docname, self.row_list[n]) for n in range(start, stop, step)]
            else:
                return [TacticRow(self.tb_instance, n, self.docname) for n in range(start, stop, step)]
        else:
            if self.grab_all_rows:
                return TacticRow(self.tb_instance, x, self.docname, self.row_list[x])
            else:
                return TacticRow(self.tb_instance, x, self.docname)

    def update_document(self):
        self.number_rows = self.tb_instance.get_number_rows(docname)
        if grab_all_rows:
            self.row_list = self.tb_instance.get_document_data_as_list(self.docname)
        else:
            self.row_list = None

    def __iter__(self):
        return self

    def __next__(self):
        self.iter_value += 1
        if self.iter_value == self.number_rows:
            raise StopIteration
        else:
            return self[self.iter_value]

    def __length__(self):
        return self.number_rows

    def __setitem__(self, index, value):
        if isinstance(value, TacticRow):
            new_value = value.row_dict
        else:
            new_value = value
        self.tb_instance.set_document(self, self.docname, {index: new_value})
        return

    def __repr__(self):
        return "TacticDocument(docname)".format(self.__dict__["docname"])