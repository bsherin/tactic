import document_object


class DataAccessMixin:
    def gdn(self):
        return self.get_document_names()

    def get_document_names(self):
        self._save_stdout()
        result = self._get_main_property("doc_names")
        self._restore_stdout()
        return result

    def get_collection_info(self):
        self._save_stdout()
        result = self._tworker.post_and_wait(self._main_id, "get_collection_info")
        self._restore_stdout()
        return result

    def gcdn(self):
        return self.get_current_document_name()

    def get_current_document_name(self):
        self._save_stdout()
        result = self._get_main_property("visible_doc_name")
        self._restore_stdout()
        return result

    def gdd(self, document_name):
        return self.get_document_data(document_name)

    def get_document_data(self, document_name):
        self._save_stdout()
        result = self._tworker.post_and_wait(self._main_id, "get_document_data", {"document_name": document_name})
        self._restore_stdout()
        return result

    def gdm(self, document_name):
        return self.get_document_metadata(document_name)

    def get_document_metadata(self, document_name):
        self._save_stdout()
        result = self._tworker.post_and_wait(self._main_id, "get_document_metadata", {"document_name": document_name})
        self._restore_stdout()
        return result

    def sdm(self, document_name, metadata):
        self.set_document_metadata(document_name, metadata)
        return

    def set_document_metadata(self, document_name, metadata):
        self._save_stdout()
        self._tworker.post_task(self._main_id, "set_document_metadata", {"document_name": document_name,
                                                                         "metadata": metadata})
        self._restore_stdout()
        return

    def gddl(self, document_name):
        return self.get_document_data_as_list(document_name)

    def get_document_data_as_list(self, document_name):
        self._save_stdout()
        result = self._tworker.post_and_wait(self._main_id, "get_document_data_as_list",
                                             {"document_name": document_name})
        self._restore_stdout()
        return result["data_list"]

    def get_column_names(self, document_name):
        self._save_stdout()
        result = self._tworker.post_and_wait(self._main_id, "get_column_names", {"document_name": document_name})
        self._restore_stdout()
        return result["header_list"]

    def gcn(self, document_name):
        return self.get_column_names(document_name)

    def gnr(self, document_name):
        return self.get_number_rows(document_name)

    def get_number_rows(self, document_name):
        self._save_stdout()
        result = self._tworker.post_and_wait(self._main_id, "get_number_rows", {"document_name": document_name})
        self._restore_stdout()
        return result["number_rows"]

    def gr(self, document_name, row_id):
        return self.get_row(document_name, row_id)

    def get_row(self, document_name, row_id):
        self._save_stdout()
        data = {"document_name": document_name, "row_id": row_id}
        result = self._tworker.post_and_wait(self._main_id, "get_row", data)
        self._restore_stdout()
        return result

    def get_rows(self, document_name, start, stop):
        self._save_stdout()
        data = {"document_name": document_name, "start": start, "stop": stop}
        result = self._tworker.post_and_wait(self._main_id, "get_rows", data)
        self._restore_stdout()
        return result

    def gl(self, document_name, line_number):
        return self.get_line(document_name, line_number)

    def get_line(self, document_name, line_number):
        data = {"document_name": document_name, "line_number": line_number}
        result = self._tworker.post_and_wait(self._main_id, "get_line", data)
        return result

    def gc(self, document_name, row_id, column_name):
        return self.get_cell(document_name, row_id, column_name)

    def get_cell(self, document_name, row_id, column_name):
        self._save_stdout()
        data = {"document_name": document_name, "row_id": row_id, "column_name": column_name}
        result = self._tworker.post_and_wait(self._main_id, "get_cell", data)
        self._restore_stdout()
        return result["the_cell"]

    def gcd(self, column_name, document_name=None):
        return self.get_column_data(column_name, document_name)

    def get_column_data(self, column_name, document_name=None):
        self._save_stdout()

        if document_name is not None:
            task_data = {"column_name": column_name, "doc_name": document_name}
            result = self._tworker.post_and_wait(self._main_id, "get_column_data_for_doc", task_data)
        else:
            task_data = {"column_name": column_name}
            result = self._tworker.post_and_wait(self._main_id, "get_column_data", task_data)

        self._restore_stdout()
        return result

    def gcdd(self, column_name):
        return self.get_column_data_dict(column_name)

    def get_column_data_dict(self, column_name):
        self._save_stdout()
        result = {}
        for doc_name in self._get_main_property("doc_names"):
            task_data = {"column_name": column_name, "doc_name": doc_name}
            result[doc_name] = self._tworker.post_and_wait(self._main_id, "get_column_data_for_doc", task_data)
        self._restore_stdout()
        return result

    def sc(self, document_name, row_id, column_name, text, cellchange=True):
        self.set_cell(document_name, row_id, column_name, text, cellchange)
        return

    def set_cell(self, document_name, row_id, column_name, text, cellchange=True):
        self._save_stdout()
        task_data = {
            "doc_name": document_name,
            "id": row_id,
            "column_header": column_name,
            "new_content": text,
            "cellchange": cellchange
        }
        self._tworker.post_task(self._main_id, "SetCellContent", task_data)
        self._restore_stdout()
        return

    def scb(self, document_name, row_id, column_name, color):
        self.set_cell_background(document_name, row_id, column_name, color)
        return

    def set_cell_background(self, document_name, row_id, column_name, color):
        self._save_stdout()
        task_data = {"doc_name": document_name,
                     "row_id": row_id,
                     "column_name": column_name,
                     "color": color}
        self._tworker.post_task(self._main_id, "SetCellBackground", task_data)
        self._restore_stdout()
        return

    def stm(self, tile_name, event_name, data=None, callback_func=None):
        self.send_tile_message(tile_name, event_name, data, callback_func)
        return

    def send_tile_message(self, tile_name, event_name, data=None, callback_func=None):
        self._save_stdout()
        task_data = {"tile_name": tile_name,
                     "event_name": event_name,
                     "has_callback": callback_func is not None,
                     "event_data": data}
        if callback_func is None:
            cfunc = None
        else:
            cfunc = lambda resp: callback_func(resp["response"])
        self._tworker.post_task(self._main_id, "SendTileMessage", task_data,
                                callback_func=cfunc)
        self._restore_stdout()
        return

    def scd(self, document_name, column_name, data_list_or_dict, cellchange=False):
        self.set_column_data(document_name, column_name, data_list_or_dict, cellchange)
        return

    def set_column_data(self, document_name, column_name, data_list_or_dict, cellchange=False):
        self._save_stdout()
        task_data = {
            "doc_name": document_name,
            "column_header": column_name,
            "new_content": data_list_or_dict,
            "cellchange": cellchange
        }
        self._tworker.post_task(self._main_id, "SetColumnData", task_data)
        self._restore_stdout()
        return

    def cct(self, doc_name, row_id, column_name, tokenized_text, color_dict):
        self.color_cell_text(doc_name, row_id, column_name, tokenized_text, color_dict)
        return

    def color_cell_text(self, doc_name, row_id, column_name, tokenized_text, color_dict):
        self._save_stdout()
        data_dict = {"doc_name": doc_name,
                     "row_id": row_id,
                     "column_header": column_name,
                     "token_text": tokenized_text,
                     "color_dict": color_dict}
        self._tworker.post_task(self._main_id, "ColorTextInCell", data_dict)
        self._restore_stdout()
        return

    def insert_row(self, docname, position, row_dict):
        self._save_stdout()
        number_rows = self.get_number_rows(docname)
        result = self._tworker.post_and_wait(self._main_id, "insert_row",
                                             {"document_name": docname, "index": position, "row_dict": row_dict})

        if not result["success"]:
            self._restore_stdout()
            raise Exception(result["message"])
        document_object.Collection._reinitializeDoc(docname, number_rows + 1)
        self._restore_stdout()
        return

    def delete_row(self, docname, position):
        self._save_stdout()
        number_rows = self.get_number_rows(docname)
        result = self._tworker.post_and_wait(self._main_id, "delete_row",
                                             {"document_name": docname, "index": position})

        if not result["success"]:
            self._restore_stdout()
            raise Exception(result["message"])
        document_object.Collection._reinitializeDoc(docname, number_rows - 1)
        self._restore_stdout()
        return

    def remove_document(self, docname):
        self._save_stdout()
        result = self._tworker.post_and_wait(self._main_id, "remove_document",
                                             {"document_name": docname})

        if not result["success"]:
            self._restore_stdout()
            raise Exception(result["message"])
        document_object.Collection.__fully_initialize__()
        self._restore_stdout()
        return

    def rename_document(self, oldname, newname):
        self._save_stdout()
        result = self._tworker.post_and_wait(self._main_id, "rename_document",
                                             {"old_document_name": oldname,
                                              "new_document_name": newname})
        if not result["success"]:
            self._restore_stdout()
            raise Exception(result["message"])
        document_object.Collection.__fully_initialize__()
        self._restore_stdout()
        return result["message"]

    def add_document(self, docname, column_names, dict_list):
        self._save_stdout()
        result = self._tworker.post_and_wait(self._main_id, "add_document",
                                             {"document_name": docname, "column_names": column_names, "dict_list": dict_list})

        if not result["success"]:
            self._restore_stdout()
            raise Exception(result["message"])
        document_object.Collection.__fully_initialize__()
        self._restore_stdout()
        return

    def add_freeform_document(self, docname, doc_text):
        self._save_stdout()
        result = self._tworker.post_and_wait(self._main_id, "add_freeform_document",
                                             {"document_name": docname, "doc_text": doc_text})

        if not result["success"]:
            self._restore_stdout()
            raise Exception(result["message"])
        document_object.Collection.__fully_initialize__()
        self._restore_stdout()
        return
