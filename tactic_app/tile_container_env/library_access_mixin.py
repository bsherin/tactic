
from communication_utils import debinarize_python_object

class LibraryAccessMixin:
    def gulist(self, the_list):
        return self.get_user_list(the_list)

    def get_user_list(self, the_list):
        self._save_stdout()
        # result = self._tworker.post_and_wait("host", "get_list", {"user_id": self.user_id, "list_name": the_list})
        raw_result = self._tworker.post_and_wait(self._main_id, "get_list_with_metadata", {"list_name": the_list})
        result = debinarize_python_object(raw_result["list_data"])
        self._restore_stdout()
        return result["the_list"]

    def gufunction(self, function_name):
        return self.get_user_function(function_name)

    def get_user_function(self, function_name):
        result = self.get_user_function_with_metadata(function_name)
        return result["the_function"]

    def guclass(self, class_name):
        return self.get_user_class(class_name)

    def gucol(self, collection_name):
        return self.get_user_collection(collection_name)

    def get_user_collection(self, collection_name):
        self._save_stdout()
        result = self._tworker.post_and_wait(self._main_id, "get_user_collection",
                                             {"user_id": self.user_id, "collection_name": collection_name})
        self._restore_stdout()
        if not result["success"]:
            raise CollectionNotFound("Couldn't find collection with name {}".format(collection_name))
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
        func_tag_dict = self._tworker.post_and_wait("host", "get_function_tags_dict",
                                                    {"user_id": self.user_id})["function_names"]
        if tag is None:
            fnames = list(func_tag_dict.keys())
        else:
            fnames = []
            for func_name, tags in func_tag_dict.items():
                if tag in tags.split():
                    fnames.append(func_name)
        return fnames

    def get_class_names(self, tag=None):
        class_tag_dict = self._tworker.post_and_wait("host", "get_class_tags_dict",
                                                     {"user_id": self.user_id})["class_names"]
        if tag is None:
            cnames = list(class_tag_dict.keys())
        else:
            cnames = []
            for class_name, tags in class_tag_dict.items():
                if tag in tags.split():
                    cnames.append(class_name)
        return cnames

    def cc(self, name, doc_dict, doc_type="table", doc_metadata=None):
        self.create_collection(name, doc_dict, doc_type, doc_metadata)
        return

    def create_collection(self, name, doc_dict, doc_type="table", doc_metadata=None):
        self._save_stdout()
        data = {"name": name,
                "doc_dict": doc_dict,
                "doc_type": doc_type}
        if doc_metadata is not None:
            data["doc_metadata"] = doc_metadata
        else:
            data["doc_metadata"] = {}
        result = self._tworker.post_and_wait(self._main_id, "create_collection", data)
        self._restore_stdout()
        if not result["success"]:
            raise Exception(result["message_string"])
        return result["message_string"]


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
        data = {"doc_name": doc_name}
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