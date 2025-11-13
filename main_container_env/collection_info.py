import copy

from mongo_accesser import PROTECTED_METADATA_KEYS

class CollectionInfo:
    large_params = ["current_data_rows", "data_rows", "data_text"]
    def __init__(self, ss, sid):
        self.ss = ss
        self.sid = sid

    @staticmethod
    def ci_base(doc_name):
        return f"collection_info.{doc_name}"

    @staticmethod
    def ts_base(doc_name):
        return f"collection_info.{doc_name}.table_spec"

    def delete_all_docs(self):
        for doc_name in self.doc_names:
            self.delete_doc(doc_name)

    def rename_doc(self, old_doc_name, new_doc_name):
        pattern = f"{self.sid}.collection_info.{old_doc_name}*"
        for old_key in self.ss.r.scan_iter(pattern):
            # construct the new key name
            new_key = old_key.decode().replace(
                f"{sid}.collection_info.{old_doc_name}",
                f"{sid}.collection_info.{new_doc_name}",
                1,  # only replace the first occurrence
            )
            self.ss.r.rename(old_key, new_key)

    def set_param(self, doc_name, param_name, value):
        if param_name in self.large_params:
            self.ss.put_hlarge(self.sid, self.ci_base(doc_name), param_name, value)
        else:
            self.ss.put_hsmall(self.sid, self.ci_base(doc_name), param_name, value)

    def get_param(self, doc_name, param_name):
        if param_name in self.large_params:
            return self.ss.get_hlarge(self.sid, self.ci_base(doc_name), param_name)
        return self.ss.get_hsmall(self.sid, self.ci_base(doc_name), param_name)

    def set_multi(self, doc_name, pdict):
        for k, v in pdict.items():
            self.set_param(doc_name, k, v)

    def set_table_spec_from_dict(self, doc_name, ts_dict):
        for param, val in ts_dict.items():
            self.set_table_spec_param(doc_name, param, val)

    def get_table_spec_params(self, doc_name):
        ts_dict = {}
        for param_name in self.table_spec_params.keys():
            ts_dict[param_name] = self.get_table_spec_param(doc_name, param_name)
        return ts_dict

    def get_doc_metadata(self, doc_name):
        return self.get_param(doc_name, "metadata")

    def set_doc_metadata(self, doc_name, mdata):
        return self.set_param(doc_name, "metadata", mdata)

    def set_additional_metadata(self, doc_name, mdict):
        current_mdata = self.get_doc_metadata(doc_name)
        for k, d in mdict.items():
            if k not in PROTECTED_METADATA_KEYS:
                current_mdata.metadata[k] = d
        self.set_doc_metadata(doc_name, current_mdata)
        return

    def update_metadata(self, doc_name, param, new_val):
        mdata = self.get_doc_metadata(doc_name)
        mdata[param] = new_val
        self.set_doc_metadata(doc_name, mdata)

    def duplicate_doc(self, doc_name, new_doc_name):
        pattern = f"sess.{{{self.sid}}}.v:collection_info.{doc_name}.*"
        cursor = 0
        doc_keys = []

        while True:
            cursor, keys = self.ss.r.scan(cursor=cursor, match=pattern, count=500)
            for key in keys:
                if isinstance(key, bytes):
                    key = key.decode("utf-8")
                key_name = key.split(f"{doc_name}.", 1)[1]
                doc_keys.append(key_name)
            if cursor == 0:
                break

        for key in doc_keys:
            if key == "table_spec":
                ts_dict = self.get_table_spec_params(doc_name)
                self.set_table_spec_from_dict(new_doc_name, ts_dict)
            else:
                self.set_param(new_doc_name, key, self.get_param(doc_name, key))


    @property
    def doc_names(self):
        pattern = f"sess.{{{self.sid}}}.v:collection_info.*"
        cursor = 0
        doc_names = []

        while True:
            cursor, keys = self.ss.r.scan(cursor=cursor, match=pattern, count=500)
            for key in keys:
                if isinstance(key, bytes):
                    key = key.decode("utf-8")
                doc_name = key.split("collection_info.", 1)[1]
                doc_names.append(doc_name)
            if cursor == 0:
                break
        return doc_names

class FreeformCollectionInfo(CollectionInfo):

    def add_doc(self, doc_name, dinfo):
        ddict = {
            "metadata": dinfo["metadata"],
            "data_text": dinfo["data_text"],
        }
        self.set_multi(doc_name, ddict)
        if "table_spec" in ddict:
            self.set_table_spec_from_dict(doc_name, ddict["table_spec"])

    def delete_doc(self, doc_name):
        self.ss.delete_large_bytes(self.sid, self.ci_base(doc_name), "data_text")
        self.ss.delete_small(self.sid, self.ci_base(doc_name))

    def all_data(self, doc_name):
        return self.get_param(doc_name, "data_text")

    def data_text(self, doc_name):
        return self.get_param(doc_name, "data_text")

    def all_sorted_data_rows(self, doc_name):
        return self.get_param(doc_name, "data_text").splitlines()

    def number_of_rows(self, doc_name):
        return len(self.get_param(doc_name, "data_text").splitlines())

    def get_row(self, doc_name, line_number):
        return self.all_sorted_data_rows(doc_name)[line_number]

    def get_rows(self, doc_name, start, stop):
        return self.all_sorted_data_rows(doc_name)[start:stop]

    def get_actual_row(self, row_id):
        return row_id

    def compile_save_dict(self):
        doc_dict = {}
        for doc_name in self.doc_names:
            ddict = {"name": doc_name,
                     "metadata": self.get_doc_metadata(doc_name),
                     "data_text": self.data_text(doc_name),
                     "table_spec": self.get_table_spec_params(doc_name),
                     }
            doc_dict[doc_name] = ddict
        return doc_dict


class TableCollectionInfo(CollectionInfo):
    table_spec_params = {
        "header_list": [],
        "column_widths": [],
        "cell_backgrounds": [],
        "hidden_columns_list": [],
        "doc_name": ""
    }

    @staticmethod
    def remove_duplicates(seq):
        seen = set()
        seen_add = seen.add
        return [x for x in seq if not (x in seen or seen_add(x))]

    def add_doc(self, doc_name, dinfo):
        ddict = {
            "metadata": dinfo["metadata"],
            "data_rows": dinfo["data_rows"],
            "current_data_rows": None
        }
        self.set_multi(doc_name, ddict)
        tspec = copy.copy(self.table_spec_params)
        tspec["doc_name"] = doc_name
        if "table_spec" in dinfo:
            tspec.update(dinfo["table_spec"])
            self.set_table_spec_from_dict(doc_name, tspec)
        else:
            tspec["header_list"] = list(dinfo["data_rows"].values())[0].keys()
            self.set_table_spec_from_dict(doc_name, tspec)

    def delete_doc(self, doc_name):
        self.ss.delete_large_bytes(self.sid, self.ci_base(doc_name), "data_rows")
        self.ss.delete_large_bytes(self.sid, self.ci_base(doc_name), "current_data_rows")
        self.ss.delete_small(self.sid, self.ci_base(doc_name))
        self.ss.delete_small(self.sid, self.ts_base(doc_name))

    def set_table_spec(self, doc_name, header_list=None, column_widths=None,
                       cell_backgrounds=None, hidden_columns_list=None):

        if header_list is None:
            header_list = []
        else:
            header_list = self.remove_duplicates(header_list)
        if hidden_columns_list is None:
            hidden_columns_list = ["__filename__"]

        self.set_table_spec_param(doc_name, "header_list", header_list)
        self.set_table_spec_param(doc_name, "column_widths", column_widths)
        self.set_table_spec_param(doc_name, "cell_backgrounds", cell_backgrounds)
        self.set_table_spec_param(doc_name, "hidden_columns_list", hidden_columns_list)

    def visible_columns(self, doc_name):
        header_list = self.get_table_spec_param(doc_name, "header_list")
        hidden_columns_list = self.get_table_spec_param(doc_name, "hidden_columns_list")
        omit_list = [*hidden_columns_list, "__id__"]
        return [cname for cname in header_list if cname not in omit_list]

    def set_table_spec_param(self, doc_name, param_name, value):
        self.ss.put_hsmall(self.sid, self.ts_base(doc_name), param_name, value)

    def get_table_spec_param(self, doc_name, param_name):
        return self.ss.get_hsmall(self.sid, self.ts_base(doc_name), param_name)

    def set_background_color(self, doc_name, row, column_header, color):
        cell_bgs = self.get_table_spec_param(doc_name, "cell_backgrounds")
        if not str(row) in cell_backgrounds:
            cell_backgrounds[str(row)] = {}
        cell_backgrounds[str(row)][column_header] = color
        self.set_table_spec_param(doc_name, "cell_backgrounds", cell_backgrounds)

    def get_header_list(self, doc_name):
        return self.get_table_spec_param(doc_name, "header_list")

    def get_hidden_columns_list(self, doc_name):
        return self.get_table_spec_param(doc_name, "hidden_columns_list")

    def get_column_widths(self, doc_name):
        return self.get_table_spec_param(doc_name, "column_widths")

    def get_data_rows(self, doc_name):
       return self.get_param(doc_name, "data_rows")

    def get_current_data_rows(self, doc_name):
        res = self.get_param(doc_name, "current_data_rows")
        if res is None:
            res = self.get_data_rows(doc_name)
        return res

    def number_of_rows(self, doc_name):
        return len(self.get_data_rows(doc_name))

    def get_row(self, row_id):
        return self.data_rows_int_keys(doc_name)[int(row_id)]

    def get_rows(self, doc_name, start, stop):
        return self.all_sorted_data_rows(doc_name)[start:stop]

    def get_id_from_actual_row(self, doc_name, actual_row):
        return self.sorted_data_rows(doc_name)[actual_row]["__id__"]

    def all_data(self, doc_name):
        return self.get_data_rows(doc_name)

    def sorted_data_rows(self, doc_name):
        result = []
        data_rows = self.get_current_data_rows(doc_name)
        if data_rows is None:
            data_rows = self.get_data_rows(doc_name)
        sorted_int_keys = sorted([int(key) for key in data_rows.keys()])
        for r in sorted_int_keys:
            result.append(data_rows[str(r)])
        print("leaving sorted_data_rows")
        return result

    def all_sorted_data_rows(self, doc_name):
        result = []
        data_rows = self.get_data_rows(doc_name)
        sorted_int_keys = sorted([int(key) for key in data_rows.keys()])
        for r in sorted_int_keys:
            result.append(self.data_rows[str(r)])
        return result

    def data_rows_int_keys(self, doc_name):
        data_rows = self.get_data_rows(doc_name)
        result = {}
        for (key, val) in data_rows.items():
            result[int(key)] = val
        return result

    def compile_save_dict(self):
        doc_dict = {}
        for doc_name in self.doc_names:
            ddict = {"name": doc_name,
                     "metadata": self.get_doc_metadata(doc_name),
                     "data_rows": self.get_data_rows(doc_name),
                     "table_spec": self.get_table_spec_params(doc_name),
                     }
            doc_dict[doc_name] = ddict
        return doc_dict
