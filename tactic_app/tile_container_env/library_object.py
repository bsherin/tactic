from communication_utils import debinarize_python_object
from document_object import DetachedTacticCollection, DetachedTacticDocument

_tworker = None


class TacticLibrary:
    def __init__(self):
        self._cnames = None
        self.lists = TacticListSet(self)
        self.functions = TacticFunctionSet(self)
        self.collections = TacticCollectionSet(self)

    @property
    def _tinst(self):
        return _tworker.tile_instance


class TacticResourceSet:
    def __init__(self, library_object, res_type):
        self._library_object = library_object
        self._res_type = res_type
        return

    def names(self, tag_filter=None, search_filter=None):
        return self.get_resource_names(tag_filter, search_filter)

    def get_resource_names(self, tag_filter=None, search_filter=None):
        self._tinst._save_stdout()
        result = _tworker.post_and_wait(self._tinst._main_id, "get_resource_names_task",
                                        {"user_id": self._tinst.user_id, "res_type": self._res_type,
                                         "tag_filter": tag_filter, "search_filter": search_filter})
        self._tinst._restore_stdout()
        return result["res_names"]

    @property
    def _tinst(self):
        return _tworker.tile_instance


class TacticResource:
    # noinspection PyUnusedLocal
    def __init__(self, raw_resource, metadata):
        self.metadata = metadata
        return

    def __getitem__(self, name):
        return


class TacticListSet(TacticResourceSet):
    def __init__(self, library_object):
        TacticResourceSet.__init__(self, library_object, "list")
        return

    def __getitem__(self, name):
        list_dict = self.get_user_list_with_metadata(name)
        return ListResource(list_dict["the_list"], list_dict["metadata"])

    def get_user_list_with_metadata(self, the_list):
        self._tinst._save_stdout()
        raw_result = _tworker.post_and_wait(self._tinst._main_id, "get_list_with_metadata",
                                            {"list_name": the_list})

        result = debinarize_python_object(raw_result["list_data"])

        self._tinst._restore_stdout()
        return result


class TacticCollectionSet(TacticResourceSet):
    def __init__(self, library_object):
        TacticResourceSet.__init__(self, library_object, "collection")
        return

    def __getitem__(self, name):
        collection_dict = self.get_user_collection_with_metadata(name)
        collection_metadata = collection_dict["collection_metadata"]
        doc_dict = collection_dict["the_collection"]
        doc_metadata = collection_dict["doc_metadata"]
        doc_object_dict = {}
        for docname, dlist in doc_dict.items():
            mdata = doc_metadata[docname]
            doc_object_dict[docname] = DetachedTacticDocument(dlist, docname, mdata)
        if "type" not in collection_metadata:
            collection_metadata["type"] = "table"
        return DetachedTacticCollection(collection_metadata["type"], doc_object_dict, collection_metadata)

    def get_user_collection_with_metadata(self, the_collection):
        self._tinst._save_stdout()
        raw_result = _tworker.post_and_wait(self._tinst._main_id, "get_user_collection_with_metadata",
                                            {"collection_name": the_collection, "user_id": self._tinst.user_id})
        result = debinarize_python_object(raw_result["collection_data"])
        self._tinst._restore_stdout()
        return result


class TacticFunctionSet(TacticResourceSet):
    def __init__(self, library_object):
        TacticResourceSet.__init__(self, library_object, "function")
        return

    def names(self, tag_filter=None, search_filter=None):
        self._tinst._save_stdout()
        result = _tworker.post_and_wait(self._tinst._main_id, "get_function_names",
                                        {"tag_filter": tag_filter, "search_filter": search_filter})
        self._tinst._restore_stdout()
        return result["function_names"]

    def __getitem__(self, name):
        function_dict = self._tinst.get_user_function_with_metadata(name)
        return FunctionResource(function_dict["the_function"], function_dict["metadata"],
                                function_dict["code_name"])


class ListResource(list):
    def __init__(self, the_list, metadata):
        self.metadata = metadata

        list.__init__(self, the_list)
        return


class FunctionResource:
    def __init__(self, the_function, metadata, code_resource):
        self.the_function = the_function
        self.metadata = metadata
        self.code_resource = code_resource

    def __call__(self, *argv):
        return self.the_function(*argv)


Library = TacticLibrary()
