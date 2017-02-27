
import copy, os

CHUNK_SIZE = int(os.environ.get("CHUNK_SIZE"))

STEP_SIZE = int(os.environ.get("STEP_SIZE"))

PROTECTED_METADATA_KEYS = ["_id", "file_id", "name", "my_class_for_recreate", "table_spec", "data_text", "length",
                           "data_rows", "header_list", "number_of_rows"]


class TableSpec(object):
    def __init__(self, doc_name=None, header_list=None, table_width=None, column_widths=None,
                 cell_backgrounds=None, hidden_columns_list=None):
        self.doc_name = doc_name
        if header_list is None:
            self.header_list = []
        else:
            self.header_list = header_list
        self.table_width = table_width
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

    def compile_save_dict(self):
        print "in table_spec compile_save_dict"
        return {"doc_name": self.doc_name, "header_list": self.header_list,
                "table_width": self.table_width, "column_widths": self.column_widths,
                "hidden_columns_list": self.hidden_columns_list}

    @staticmethod
    def recreate_from_save(save_dict):
        print "in table_spec recreate"
        new_instance = TableSpec(**save_dict)
        return new_instance

# Each doc should have fields:
# name, data_rows, cell_background, table_spec, metadata
class DocInfoAbstract(object):
    def __init__(self, f):
        self.name = f["name"]
        if "metadata" in f:
            self.metadata = f["metadata"]
        else:
            self.metadata = self.collect_legacy_metadata(f)
        if "header_list" in f:
            self.table_spec = TableSpec(f["name"], f["header_list"], None, None, None)  # Legacy older than 2-27-17
        else:
            self.table_spec = TableSpec(**f["table_spec"])
        return

    def collect_legacy_metadata(self, f):  # Legacy older than about 2-27-17
        mdata = {}
        for key, val in f.items():
            if key not in PROTECTED_METADATA_KEYS:
                mdata[key] = val
        return mdata

    def compile_metadata(self, f):
        return self.metadata

    def set_additional_metadata(self, mdict):
        for k, d in mdict.items():
            if k not in PROTECTED_METADATA_KEYS:
                self.metadata[k] = d
        return

    def compile_save_dict(self):
        print "in docinfo compile_save_Dict"
        result = {"name": self.name,
                  "metadata": self.metadata,
                  "table_spec": self.table_spec.compile_save_dict(),
                  }
        return result


class FreeformDocInfo(DocInfoAbstract):

    def __init__(self, f, data_text=None):
        DocInfoAbstract.__init__(self, f)
        if data_text is None:
            self.data_text = f["data_text"]
        else:
            self.data_text = data_text
        self.metadata["length"] = len(self.data_text)

    def compile_save_dict(self):
        result = DocInfoAbstract.compile_save_dict(self)
        result.update({"data_text": self.data_text,
                       "my_class_for_recreate": "FreeformDocInfo"})
        return result

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

    def get_actual_row(self, row_id):
        return row_id

    @staticmethod
    def recreate_from_save(save_dict):
        new_instance = FreeformDocInfo(save_dict)
        return new_instance


# noinspection PyPep8Naming
class docInfo(DocInfoAbstract):
    def __init__(self, f):
        DocInfoAbstract.__init__(self, f)
        self.data_rows = copy.deepcopy(f["data_rows"])  # All the data rows in the doc
        self.current_data_rows = self.data_rows  # The current filtered set of data rows


        self.start_of_current_chunk = None
        self.is_first_chunk = None
        self.infinite_scroll_required = None
        self.is_last_chunk = None

        self.configure_for_current_data()
        if len(self.data_rows.keys()) > CHUNK_SIZE:
            self.max_table_size = CHUNK_SIZE
        else:
            self.max_table_size = len(self.data_rows.keys())
        self.metadata["number_of_rows"] = len(f["data_rows"].keys())


    def set_background_color(self, row, column_header, color):
        if not str(row) in self.table_spec.cell_backgrounds:
            self.table_spec.cell_backgrounds[str(row)] = {}
        self.table_spec.cell_backgrounds[str(row)][column_header] = color

    @property
    def displayed_background_colors(self):
        result = {}
        sorted_int_keys = sorted([int(key) for key in self.current_data_rows.keys()])
        for i, r in enumerate(sorted_int_keys[self.start_of_current_chunk:(self.start_of_current_chunk + CHUNK_SIZE)]):
            if str(r) in self.table_spec.cell_backgrounds:
                result[i] = self.table_spec.cell_backgrounds[str(r)]
        return result

    @property
    def number_of_rows(self):
        return len(self.data_rows.keys())

    def get_row(self, row_id):
        return self.data_rows_int_keys[int(row_id)]

    def configure_for_current_data(self):
        self.start_of_current_chunk = 0
        self.is_first_chunk = True
        if len(self.current_data_rows.keys()) <= CHUNK_SIZE:
            self.infinite_scroll_required = False
            self.is_last_chunk = True
        else:
            self.infinite_scroll_required = True
            self.is_last_chunk = False

    def get_actual_row(self, row_id):
        for i, the_row in enumerate(self.displayed_data_rows):
            if str(row_id) == str(the_row["__id__"]):
                return i
        return None

    def compile_save_dict(self):
        result = DocInfoAbstract.compile_save_dict(self)
        result.update({"data_rows": self.data_rows,
                       "my_class_for_recreate": "docInfo"})
        return result

    def get_id_from_actual_row(self, actual_row):
        return self.sorted_data_rows[actual_row]["__id__"]

    @property
    def all_data(self):
        return self.data_rows

    @property
    def sorted_data_rows(self):
        result = []
        sorted_int_keys = sorted([int(key) for key in self.current_data_rows.keys()])
        for r in sorted_int_keys:
            result.append(self.data_rows[str(r)])
        return result

    @property
    def all_sorted_data_rows(self):
        result = []
        sorted_int_keys = sorted([int(key) for key in self.data_rows.keys()])
        for r in sorted_int_keys:
            result.append(self.data_rows[str(r)])
        return result

    @property
    def displayed_data_rows(self):
        if not self.infinite_scroll_required:
            return self.sorted_data_rows
        result = []
        sorted_int_keys = sorted([int(key) for key in self.current_data_rows.keys()])
        for r in sorted_int_keys[self.start_of_current_chunk:(self.start_of_current_chunk + CHUNK_SIZE)]:
            result.append(self.current_data_rows[str(r)])
        return result

    def advance_to_next_chunk(self):
        if self.is_last_chunk:
            return
        old_start = self.start_of_current_chunk
        self.start_of_current_chunk += STEP_SIZE
        self.is_first_chunk = False
        if (self.start_of_current_chunk + CHUNK_SIZE) >= len(self.current_data_rows):
            self.start_of_current_chunk = len(self.current_data_rows) - CHUNK_SIZE
            self.is_last_chunk = True
        return self.start_of_current_chunk - old_start

    def row_is_visible(self, row_id):
        sorted_int_keys = sorted([int(key) for key in self.current_data_rows.keys()])
        displayed_int_keys = sorted_int_keys[self.start_of_current_chunk:(self.start_of_current_chunk + STEP_SIZE)]
        return int(row_id) in displayed_int_keys

    def move_to_row(self, row_id):
        self.current_data_rows = self.data_rows  # Undo any filtering
        self.configure_for_current_data()
        while not self.is_last_chunk and not(self.row_is_visible(row_id)):
            self.advance_to_next_chunk()

    def go_to_previous_chunk(self):
        if self.is_first_chunk:
            return None
        old_start = self.start_of_current_chunk
        self.start_of_current_chunk -= STEP_SIZE
        self.is_last_chunk = False
        if self.start_of_current_chunk <= 0:
            self.start_of_current_chunk = 0
            self.is_first_chunk = True
        return old_start - self.start_of_current_chunk

    @property
    def data_rows_int_keys(self):
        result = {}
        for (key, val) in self.data_rows.items():
            result[int(key)] = val
        return result

    @staticmethod
    def recreate_from_save(save_dict):
        print "in docinfo recreate"
        new_instance = docInfo(save_dict)
        return new_instance
