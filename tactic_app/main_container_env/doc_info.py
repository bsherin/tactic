
import copy, os
from communication_utils import debinarize_python_object
from mongo_accesser import PROTECTED_METADATA_KEYS

CHUNK_SIZE = int(os.environ.get("CHUNK_SIZE"))


class TableSpec(object):
    def __init__(self, doc_name=None, header_list=None, table_width=None, column_widths=None,
                 cell_backgrounds=None, hidden_columns_list=None):
        self.doc_name = doc_name
        if header_list is None:
            self.header_list = []
        else:
            self.header_list = self.remove_duplicates(header_list)
        if column_widths is None:
            self.column_widths = None
        else:
            self.column_widths = column_widths
        if cell_backgrounds is None:
            self.cell_backgrounds = {}
        else:
            self.cell_backgrounds = cell_backgrounds
        if hidden_columns_list is None:
            self.hidden_columns_list = ["__filename__"]
        else:
            self.hidden_columns_list = hidden_columns_list

    @property
    def visible_columns(self):
        return [cname for cname in self.header_list if cname not in self.hidden_columns_list]

    def remove_duplicates(self, seq):
        seen = set()
        seen_add = seen.add
        return [x for x in seq if not (x in seen or seen_add(x))]

    def compile_save_dict(self):
        return {"doc_name": self.doc_name, "header_list": self.header_list,
                "column_widths": self.column_widths,
                "cell_backgrounds": self.cell_backgrounds, "hidden_columns_list": self.hidden_columns_list}

    @staticmethod
    def recreate_from_save(save_dict):
        new_instance = TableSpec(**save_dict)
        return new_instance


# Each doc should have fields:
# name, data_rows or data_text, cell_background, table_spec, metadata
class DocInfoAbstract(object):
    def __init__(self, name, metadata):
        self.name = name
        self.metadata = metadata
        return

    def set_additional_metadata(self, mdict):
        for k, d in mdict.items():
            if k not in PROTECTED_METADATA_KEYS:
                self.metadata[k] = d
        return

    def compile_save_dict(self):
        result = {"name": self.name,
                  "metadata": self.metadata,
                  "table_spec": self.table_spec.compile_save_dict()}
        return result


# Most of table_spec stuff, including table_width, doesn't do anything in freeform docs.
class FreeformDocInfo(DocInfoAbstract):

    def __init__(self, name=None, metadata=None, data_text=None):
        DocInfoAbstract.__init__(self, name, metadata)
        self.data_text = data_text
        self.metadata = metadata

        self.table_spec = TableSpec(doc_name=name)

        return

    @property
    def all_data(self):
        return self.data_text

    @property
    def all_sorted_data_rows(self):
        return self.data_text.splitlines()

    @property
    def number_of_rows(self):
        return len(self.data_text.splitlines())

    def get_row(self, line_number):
        return self.all_sorted_data_rows[line_number]

    def get_rows(self, start, stop):
        return self.all_sorted_data_rows[start:stop]

    def get_actual_row(self, row_id):
        return row_id

    def compile_save_dict(self):
        result = DocInfoAbstract.compile_save_dict(self)
        result.update({"data_text": self.data_text,
                       "my_class_for_recreate": "FreeformDocInfo"})
        return result

    @staticmethod
    def recreate_from_save(save_dict):
        if "metadata" in save_dict:  # legacy to handle old project saves
            mdata = save_dict["metadata"]
        else:
            mdata = {}
        new_instance = FreeformDocInfo(save_dict["name"], mdata, save_dict["data_text"])
        return new_instance


# noinspection PyPep8Naming
class docInfo(DocInfoAbstract):
    def __init__(self, name=None, header_list=None, metadata=None, data_rows=None, table_spec=None):
        print("*** in docInfo with data_rows of type " + str(type(data_rows)))

        DocInfoAbstract.__init__(self, name, metadata)
        if table_spec is not None:  # This will be the case if we are recreating
            self.table_spec = TableSpec(**table_spec)
        else:
            self.table_spec = TableSpec(name, header_list, None, None, None)
        self.data_rows = copy.deepcopy(data_rows)  # All the data rows in the doc
        self.current_data_rows = self.data_rows  # The current filtered set of data rows
        self.metadata["number_of_rows"] = len(data_rows.keys())
        print("** leaving docInfo")
        return

    def set_background_color(self, row, column_header, color):
        if not str(row) in self.table_spec.cell_backgrounds:
            self.table_spec.cell_backgrounds[str(row)] = {}
        self.table_spec.cell_backgrounds[str(row)][column_header] = color

    @property
    def number_of_rows(self):
        return len(self.data_rows.keys())

    def get_row(self, row_id):
        return self.data_rows_int_keys[int(row_id)]

    def get_rows(self, start, stop):
        return self.all_sorted_data_rows[start:stop]

    def get_id_from_actual_row(self, actual_row):
        return self.sorted_data_rows[actual_row]["__id__"]

    @property
    def all_data(self):
        return self.data_rows

    @property
    def sorted_data_rows(self):
        print("entering sorted_data_rows")
        result = []
        sorted_int_keys = sorted([int(key) for key in self.current_data_rows.keys()])
        for r in sorted_int_keys:
            result.append(self.data_rows[str(r)])
        print("leaving sorted_data_rows")
        return result

    @property
    def all_sorted_data_rows(self):
        result = []
        sorted_int_keys = sorted([int(key) for key in self.data_rows.keys()])
        for r in sorted_int_keys:
            result.append(self.data_rows[str(r)])
        return result

    @property
    def data_rows_int_keys(self):
        result = {}
        for (key, val) in self.data_rows.items():
            result[int(key)] = val
        return result

    def compile_save_dict(self):
        result = DocInfoAbstract.compile_save_dict(self)
        result.update({"data_rows": self.data_rows,
                       "my_class_for_recreate": "docInfo"})
        return result

    @staticmethod
    def recreate_from_save(save_dict):
        if "metadata" in save_dict:  # legacy to deal with old project saves
            mdata = save_dict["metadata"]
        else:
            mdata = {}
        new_instance = docInfo(name=save_dict["name"], metadata=mdata,
                               data_rows=save_dict["data_rows"], table_spec=save_dict["table_spec"])
        return new_instance
