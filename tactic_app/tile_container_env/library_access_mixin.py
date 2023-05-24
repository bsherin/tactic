import uuid
from communication_utils import debinarize_python_object

class CollectionNotFound(Exception):
    pass

class ListNotFound(Exception):
    pass

class TileNotFound(Exception):
    pass

class ProjectNotFound(Exception):
    pass

class FunctionNotFound(Exception):
    pass

class ClassNotFound(Exception):
    pass


# noinspection PyClassHasNoInit
class LibraryAccessMixin:
    def gulist(self, the_list):
        return self.get_user_list(the_list)

    def get_user_list(self, the_list):
        self._save_stdout()
        # result = self._tworker.post_and_wait("host", "get_list", {"user_id": self.user_id, "list_name": the_list})
        raw_result = self._tworker.post_and_wait(self._main_id, "get_list_with_metadata", {"list_name": the_list})
        result = debinarize_python_object(raw_result["list_data"])
        self._restore_stdout()
        if result is None:
            raise ListNotFound(f"Couldn't find list {the_list}")
        return result["the_list"]

    def gufunction(self, function_name):
        return self.get_user_function(function_name)

    def get_user_function(self, function_name):
        result = self.get_user_function_with_metadata(function_name)
        return result["the_function"]

    def get_user_class(self, class_name):
        result = self.get_user_class_with_metadata(class_name)
        return result["the_class"]

    def guclass(self, class_name):
        return self.get_user_class(class_name)

    def gucol(self, collection_name):
        return self.get_user_collection(collection_name)

    def get_user_collection(self, collection_name):
        self._save_stdout()
        result = self._tworker.post_and_wait(self._main_id, "get_user_collection",
                                             {"user_id": self.user_id, "collection_name": collection_name})
        self._restore_stdout()
        if result["the_collection"] is None:
            raise CollectionNotFound(f"Couldn't find collection {collection_name}")
        return result["the_collection"]

    def get_collection_names(self):
        self._save_stdout()
        result = self._tworker.post_and_wait(self._main_id, "get_collection_names",
                                             {"user_id": self.user_id})
        self._restore_stdout()
        return result["collection_names"]

    def get_list_names(self):
        self._save_stdout()
        result = self._tworker.post_and_wait(self._main_id, "get_list_names",
                                             {"user_id": self.user_id})
        self._restore_stdout()
        return result["list_names"]

    def get_function_names(self, tag=None):
        self._save_stdout()
        result = self._tworker.post_and_wait(self._main_id, "get_function_names",
                                            {"tag_filter": tag, "search_filter": None})
        self._restore_stdout()
        return result["function_names"]

    def get_class_names(self, tag=None):
        self._save_stdout()
        result = self._tworker.post_and_wait(self._main_id, "get_class_names",
                                             {"tag_filter": tag, "search_filter": None})
        self._restore_stdout()
        return result["class_names"]

    def cc(self, name, doc_dict, doc_type="table", doc_metadata=None):
        self.create_collection(name, doc_dict, doc_type, doc_metadata)
        return

    def assemble_collection_data(self, name, doc_dict, doc_type="table", doc_metadata=None,
                                 header_list_dict=None, collection_metadata=None):
        if header_list_dict is None:
            header_list_dict = {}
        if doc_type == "table":
            for fname, dlist in doc_dict.items():
                if fname not in header_list_dict:
                    header_list = list(dlist[0].keys())
                else:
                    header_list = header_list_dict[fname]
                ndlist = []
                for r, the_row in enumerate(dlist):
                    the_row.pop("__id__", None)
                    the_row.pop("__filename__", None)
                    the_row["__id__"] = r
                    the_row["__filename__"] = fname
                    ndlist.append(the_row)
                if "__filename__" not in header_list:
                    header_list = ["__filename__"] + header_list
                if "__id__" not in header_list:
                    header_list = ["__id__"] + header_list
                header_list_dict[fname] = header_list
                doc_dict[fname] = ndlist

        data = {"name": name,
                "doc_dict": doc_dict,
                "doc_type": doc_type,
                "doc_metadata": doc_metadata,
                "header_list_dict": header_list_dict,
                "collection_metadata": collection_metadata}
        if doc_metadata is not None:
            data["doc_metadata"] = doc_metadata
        else:
            data["doc_metadata"] = {}
        return data

    def create_temp_collection(self, file_name, doc_dict, doc_type, doc_metadata, temp_type):
        self._save_stdout()
        data = self.assemble_collection_data("", doc_dict, doc_type, doc_metadata)
        data["temp_data"] = {"type": temp_type, "file_name": file_name}
        result = self._tworker.post_and_wait(self._main_id, "create_collection", data)
        self._restore_stdout()
        if not result["success"]:
            raise Exception(result["message"])
        return result

    def create_collection(self, name, doc_dict, doc_type="table", doc_metadata=None,
                          header_list_dict=None, collection_metadata=None):
        self._save_stdout()
        data = self.assemble_collection_data(name, doc_dict, doc_type, doc_metadata,
                                             header_list_dict, collection_metadata)
        result = self._tworker.post_and_wait(self._main_id, "create_collection", data)
        self._restore_stdout()
        if not result["success"]:
            raise Exception(result["message"])
        return result

    # deprecated
    def get_tokenizer(self, tokenizer_name):
        self._save_stdout()
        result = self.get_user_function(tokenizer_name)
        self._restore_stdout()
        return result

    # deprecated
    def get_cluster_metric(self, metric_name):
        self._save_stdout()
        result = self.get_user_function(metric_name)
        self._restore_stdout()
        return result

    # deprecated
    def get_weight_function(self, weight_function_name):
        self._save_stdout()
        result = self.get_user_function(weight_function_name)
        self._restore_stdout()
        return result

    # </editor-fold>

    # <editor-fold desc="Table Navigation">
    def gtd(self, doc_name):
        self.go_to_document(doc_name)
        return

    def go_to_document(self, doc_name):
        self._save_stdout()
        data = {"doc_name": doc_name, "row_id": 0}
        self._tworker.ask_host('go_to_row_in_document', data)
        self._restore_stdout()
        return

    def gtrid(self, doc_name, row_id):
        self.go_to_row_in_document(doc_name, row_id)
        return

    def go_to_row_in_document(self, doc_name, row_id):
        self._save_stdout()
        data = {"doc_name": doc_name,
                "row_id": row_id}
        self._tworker.ask_host('go_to_row_in_document', data)
        self._restore_stdout()
        return
