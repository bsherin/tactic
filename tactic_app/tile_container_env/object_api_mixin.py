from document_object import TacticDocument, FreeformTacticDocument
from document_object import DetachedTacticCollection, DetachedTacticRow, DetachedTacticDocument
from document_object import DetachedFreeformTacticDocument, DetachedTacticLine
import document_object


class ObjectAPIMixin:
    @property
    def collection(self):
        return document_object.Collection

    def get_document(self, docname=None):
        protected_standout = sys.stdout  # Need to do it this way because other calls were writing over self._old_stdout
        sys.stdout = sys.stderr
        if docname is None:
            docname = self.get_current_document_name()
        if self.doc_type == "freeform":
            result = FreeformTacticDocument(self, docname)
        else:
            result = TacticDocument(self, docname)
        sys.stdout = protected_standout
        return result

    def new_collection(self, doc_type, doc_dict=None):
        return DetachedTacticCollection(doc_type, doc_dict)

    def create_row(self, row_dict=None):
        if row_dict is None:
            row_dict = {}
        return DetachedTacticRow(row_dict)

    def create_line(self, txt=""):
        return DetachedTacticLine(txt)

    def create_document(self, docname, column_names, dict_or_detached_row_list=None, metadata=None):
        return DetachedTacticDocument(docname, column_names, dict_or_detached_row_list, metadata=None)

    def create_freeform_document(self, docname, lines=None, metadata=None):
        return DetachedFreeformTacticDocument(docname, lines, metadata)

    def create_collection_object(self, doc_type, doc_dict=None):
        return DetachedTacticCollection(doc_type, doc_dict)

    @property
    def tiles(self):
        if self._remote_tiles is None:
            self._remote_tiles = RemoteTiles()
        return self._remote_tiles