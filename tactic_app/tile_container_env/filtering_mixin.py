
class FilteringMixin:
    def gmr(self, filter_function, document_name=None):
        return self.get_matching_rows(filter_function, document_name)


    def get_matching_rows(self, filter_function, document_name=None):
        self._save_stdout()
        result = []
        if document_name is not None:
            data_list = self.get_document_data_as_list(document_name)
            for r in data_list:
                if filter_function(r):
                    result.append(r)
        else:
            for docname in self.get_document_names():
                data_list = self.get_document_data_as_list(docname)
                for r in data_list:
                    if filter_function(r):
                        result.append(r)
        self._restore_stdout()
        return result


    def get_matching_documents(self, filter_function):
        self._save_stdout()
        jfilter_function = make_python_object_jsonizable(filter_function)
        result = self._tworker.post_and_wait(self._main_id, "get_matching_documents",
                                             {"filter_function": jfilter_function})
        self._restore_stdout()
        return result


    def dmr(self, filter_function, document_name=None):
        self.display_matching_rows(filter_function, document_name)
        return


    def display_matching_rows(self, filter_function, document_name=None):
        self._save_stdout()
        if self.doc_type == "table":
            if document_name is not None:
                result = []
                data_list = self.get_document_data_as_list(document_name)
                for r in data_list:
                    if filter_function(r):
                        result.append(r["__id__"])
            else:
                result = {}
                for docname in self.get_document_names():
                    result[docname] = []
                    data_list = self.get_document_data_as_list(docname)
                    for r in data_list:
                        if filter_function(r):
                            result[docname].append(r["__id__"])
        else:
            if document_name is not None:
                result = []
                data_list = self.get_document_data_as_list(document_name)
                for rnum, rtxt in enumerate(data_list):
                    if filter_function(rtxt):
                        result.append(rnum)
            else:
                result = {}
                for docname in self.get_document_names():
                    result[docname] = []
                    data_list = self.get_document_data_as_list(docname)
                    for rnum, rtxt in enumerate(data_list):
                        if filter_function(rtxt):
                            result[docname].append(rnum)
        self._tworker.post_task(self._main_id, "display_matching_rows",
                                {"result": result, "document_name": document_name})
        self._restore_stdout()
        return


    def cth(self):
        self.clear_table_highlighting()
        return


    def clear_table_highlighting(self):
        self._save_stdout()
        self.distribute_event("DehighlightTable", {})
        self._restore_stdout()
        return


    def hmt(self, txt):
        self.highlight_matching_text(txt)
        return


    def highlight_matching_text(self, txt):
        self._save_stdout()
        self.distribute_event("SearchTable", {"text_to_find": txt})
        self._restore_stdout()
        return


    def dar(self):
        self.display_all_rows()
        return


    def display_all_rows(self):
        self._save_stdout()
        self._tworker.post_task(self._main_id, "UnfilterTable")
        self._restore_stdout()
        return


    def atr(self, func, document_name=None, cellchange=False):
        self.apply_to_rows(func, document_name, cellchange)
        return


    def apply_to_rows(self, func, document_name=None, cellchange=False):
        self._save_stdout()
        if document_name is not None:
            doc_dict = self.get_document_data(document_name)
            new_doc_dict = {}
            for the_id, r in doc_dict.items():
                new_doc_dict[the_id] = func(r)
            self.set_document(document_name, new_doc_dict, cellchange)
            self._restore_stdout()
            return None
        else:
            for doc_name in self.get_document_names():
                self.apply_to_rows(func, doc_name, cellchange)
            self._restore_stdout()
            return None


    def sd(self, document_name, new_data, cellchange=False):
        self.set_document(document_name, new_data, cellchange)


    def set_document(self, document_name, new_data, cellchange=False):
        self._save_stdout()
        task_data = {"new_data": new_data,
                     "doc_name": document_name,
                     "cellchange": cellchange}
        self._tworker.post_and_wait(self._main_id, "SetDocument", task_data)
        self._restore_stdout()
        return