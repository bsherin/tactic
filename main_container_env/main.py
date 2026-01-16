import sys
import re
import uuid
import copy
import datetime
import json
from loaded_tile_management import loaded_tile_manager
from mongo_accesser import MongoAccess
from main_tasks_mixin import StateTasksMixin, LoadSaveTasksMixin, APISupportTasksMixin
from main_tasks_mixin import ExportsTasksMixin, ConsoleTasksMixin, DataSupportTasksMixin
from main_tile_creation_tasks import TileCreationTasksMixin
from exception_mixin import ExceptionMixin
from mongo_db_fs import get_dbs
from list_accesser import ListAccess
from code_accesser import CodeAccess
from tile_accesser import TileAccess
from project_accesser import ProjectAccess
from collection_accesser import CollectionAccess
from metabook_accesser import MetabookAccess
from node_accesser import NodeAccess
from temp_data_accesser import TempDataAccess
from across_accounts_accesser import AcrossAccountsAccess
from aws_helpers import get_ssm_parameter
from tactic_logging import log

from main_session import MainSessionStore, MainSessionAccessor

INITIAL_LEFT_FRACTION = .69

db_name = get_ssm_parameter("DB_NAME", "tacticdb")

# noinspection PyPep8Naming,PyUnusedLocal,PyTypeChecker,PyMissingConstructor
class mainWindow(MongoAccess, StateTasksMixin, LoadSaveTasksMixin, TileCreationTasksMixin, APISupportTasksMixin,
                 ExportsTasksMixin, ConsoleTasksMixin, DataSupportTasksMixin, ExceptionMixin,
                 ListAccess, CodeAccess, TileAccess, ProjectAccess, CollectionAccess, MetabookAccess, NodeAccess,
                 TempDataAccess, AcrossAccountsAccess
                 ):
    save_attrs = ["short_collection_name", "collection_name",
                  "doc_dict", "project_name", "loaded_modules",
                  "doc_type", "purgetiles"]
    notebook_save_attrs = ["project_name", "doc_type"]
    update_events = ["CellChange", "FreeformTextChange", "CreateColumn", "DeleteColumn", "SearchTable",
                     "SaveTableSpec", "MainClose",
                     "DehighlightTable", "SetCellContent", "RemoveTile", "ColorTextInCell",
                     "FilterTable", "UnfilterTable", "TextSelect", "UpdateSortList", "UpdateLeftFraction",
                     "UpdateTableShrinkState", "UpdateHeaderListOrder", "HideColumnInAllDocs", "UpdateColumnWidths",
                     "UpdateTableSpec"]

    # noinspection PyUnresolvedReferences
    def __init__(self, mworker):
        self.mworker = mworker
        try:
            db, fs, repository_db, repository_fs = get_dbs()
            self.db = db
            self.fs = fs
        except Exception:
            log.exception("error getting pymongo client")
            sys.exit()

        self.ss = MainSessionStore()

    def get_session(self, sid):
        return MainSessionAccessor.create(self.ss, sid)

    def am_notebook_type(self, sid):
        sess = self.get_session(sid)
        return sess.doc_type in ["notebook", "jupyter"]

    def emit_status_message(self, sid, message, timeout=None):
        data = {"status_message": message, "timeout": timeout}
        self.mworker.emit_to_user(sid, "show-status-msg", data)

    def show_error_window(self, sid, error_string):
        data_dict = {"error_string": str(error_string),
                     "template_name": "error_window_template.html"}
        unique_id = self.store_temp_data(data_dict)
        self.mworker.emit_to_main_client(sid, "window-open", {"the_id": unique_id})
        return

    def emit_clear_status(self, sid):
        self.mworker.emit_to_user(sid, "clear-status-msg", {})

    def emit_stop_status_spinner(self, sid):
        self.mworker.emit_to_user(sid, 'stop-spinner', {})

    @staticmethod
    def convert_legacy_console(project_dict):
        from bs4 import BeautifulSoup
        import uuid
        soup = BeautifulSoup(project_dict["console_html"], "html.parser")
        if "console_cm_code" in project_dict:  # legacy to deal with saves older than about october 2016
            console_cm_code = project_dict["console_cm_code"]
        else:
            console_cm_code = None
        entries = []
        for item in soup.select(".card.log-panel"):
            try:
                summary_text = item.select(".log-panel-summary")[0].text.strip()
                am_shrunk = "log-panel-invisible" in item["class"]
                new_entry = {"summary_text": summary_text,
                             "am_shrunk": am_shrunk}
                if "text-log-item" in item["class"]:
                    new_entry["console_text"] = item.select(".console-text")[0].text.strip()
                    new_entry["unique_id"] = item["id"]
                    new_entry["type"] = "text"
                elif "fixed-log-panel" in item["class"]:
                    new_entry["console_text"] = item.select(".log-panel-body")[0].text.strip()
                    new_entry["type"] = "fixed"
                    new_entry["is_error"] = False
                    new_entry["unique_id"] = str(uuid.uuid4())
                elif console_cm_code is not None:
                    new_entry["unique_id"] = item.select(".console-code")[0]["id"]
                    new_entry["output_dict"] = {-1: str(item.select(".log-code-output")[0])}
                    new_entry["type"] = "code"
                    new_entry["console_text"] = console_cm_code[new_entry["unique_id"]]
                    new_entry["execution_count"] = 0
                entries.append(new_entry)
            except Exception as ex:
                log.exception("error converting one console cell")
        return entries

    @staticmethod
    def check_for_output_text(console_items):
        new_console_items = []
        for entry in console_items:
            if entry["type"] == "code":
                if "output_dict" not in entry:
                    if "output_text" in entry:
                        entry["output_dict"] = {-1: entry["output_text"]}
                        del entry["output_text"]
                    else:
                        entry["output_dict"] = {}
            new_console_items.append(entry)
        return new_console_items

    @staticmethod
    def add_missing_section_ends(console_items):
        new_console_items = []
        in_section = False
        for entry in console_items:
            if entry["type"] == "divider":
                if in_section:
                    end_section = {"unique_id": str(uuid.uuid4()), "type": "section-end"}
                    new_console_items.append(end_section)
                in_section = True
            if entry["type"] == "section-end":
                in_section = False
            new_console_items.append(entry)
        if in_section:
            end_section = {"unique_id": str(uuid.uuid4()), "type": "section-end"}
            new_console_items.append(end_section)
        return new_console_items

    def convert_legacy_save(self, project_dict):
        try:
            the_tile_list = []
            for tile_id in project_dict["tile_sort_list"]:
                tile_save_dict = project_dict["tile_instances"][tile_id]
                new_entry = {
                    "tile_name": tile_save_dict["tile_name"],
                    "tile_type": tile_save_dict["tile_type"],
                    "tile_id": tile_id,
                    "form_data": [],
                    "tile_height": tile_save_dict["full_tile_height"],
                    "tile_width": tile_save_dict["full_tile_width"],
                    "show_form": False,
                    "show_spinner": False,
                    "javascript_code": None,
                    "javascript_arg_dict": None,
                    "shrunk": False,
                    "log_content": "",
                    "show_log": False,
                    "source_changed": False,
                    "front_content": tile_save_dict["current_html"]
                }
                the_tile_list.append(new_entry)
            interface_state = {'height_fraction': .85, 'tile_list': the_tile_list,
                               'table_is_shrunk': project_dict["is_shrunk"], 'console_width_fraction': .85,
                               'console_is_shrunk': True, 'console_is_zoomed': False,
                               'show_exports_pane': False, 'horizontal_fraction': project_dict["left_fraction"],
                               "console_items": self.convert_legacy_console(project_dict)}
            return interface_state
        except Exception as ex:
            log.exception("got an error converting a legacy save")
            return False

    def get_collection_info(self, sid):
        return self.get_session(sid).collection_info

    def get_tile_info(self, sid):
        return self.get_session(sid).tile_info

    @staticmethod
    def remove_dead_tiles(pdictOriginal):
        pdict = copy.copy(pdictOriginal)
        if "interface_state" not in pdict:
            return pdict
        if "tile_list" in pdict["interface_state"]:
            interface_tile_ids = [entry["tile_id"] for entry in pdict["interface_state"]["tile_list"]]
        else:
            interface_tile_ids = []
        if "tile_instances" not in pdict:
            return pdict
        else:
            tile_instance_ids = list(pdict["tile_instances"].keys())
            ## get the ids that are in tile_instances but not in interface_state
            dead_tile_ids = [tid for tid in tile_instance_ids if tid not in interface_tile_ids]
            for dead_tile_id in dead_tile_ids:
                del pdict["tile_instances"][dead_tile_id]
            return pdict

    @staticmethod
    def is_legacy_save(mdata):
        return "save_style" not in mdata or mdata["save_style"] != "b64save_react"

    def recreate_from_save(self, sid, project_name, username, unique_id=None):
        if unique_id is None:
            try:
                project_dict = self.read_project_dict(project_name, username)
                mdata = self.get_project_metadata(project_name, username)
            except Exception as ex:
                log.exception("error reading project dict")
                error_string = self.handle_exception(sid, ex, "<pre>Error loading project dict</pre>", print_to_console=True)
                return_data = {"success": False, "message": error_string}
                return error_string, {}, "", False
        else:
            doc = self.read_temp_data(unique_id)
            doc["metadata"] = {"save_style": "b64save_react"}
            project_dict = self.read_project_dict_from_doc(doc)
            self.delete_temp_data(unique_id)

        project_dict = self.remove_dead_tiles(project_dict)
        error_messages = []
        if "doc_type" not in project_dict:  # legacy this is for backward compatibility
            project_dict["doc_type"] = "table"
        sdict = {}

        if project_dict["doc_type"] == "jupyter":
            jupyter_text = project_dict["jupyter_text"]
            jupyter_dict = json.loads(jupyter_text)
            converted_cells = self.convert_jupyter_cells(jupyter_dict["cells"])
            interface_state = {"console_items": converted_cells}
            sdict = {
                "doc_type": "jupyter",
            }
            return sdict, interface_state, {}

        for (attr, attr_val) in project_dict.items():
            if str(attr) not in ["tile_instances","pseudo_tile_instance", "pseudo_tile_id", "doc_dict"]:
                try:
                    if type(attr_val) == dict and ("my_class_for_recreate" in attr_val):
                        cls = getattr(sys.modules[__name__], attr_val["my_class_for_recreate"])
                        sdict[attr] = cls.recreate_from_save(attr_val)
                    elif (type(attr_val) == dict) and (len(attr_val) > 0) and \
                            ("my_class_for_recreate" in list(attr_val.values())[0]):
                        cls = getattr(sys.modules[__name__], list(attr_val.values())[0]["my_class_for_recreate"])
                        res = {}
                        for (key, val) in attr_val.items():
                            tinstance = cls.recreate_from_save(val)
                            if tinstance is not None:
                                res[key] = tinstance
                            else:
                                error_messages.append("error creating {}".format(key))
                        sdict[attr] = res

                    else:
                        sdict[attr] = attr_val
                except TypeError:
                    sdict[attr] = attr_val
                except Exception:
                    log.exception("error recreating one attribute in recreate_from_save", attr=attr)
            if "doc_dict" in project_dict:
                sdict["doc_dict"] = project_dict["doc_dict"]
        if sdict["doc_type"] == "notebook":
            save_attrs = self.notebook_save_attrs
        else:
            save_attrs = self.save_attrs
        for attr in save_attrs:
            if attr not in project_dict:
                sdict[attr] = ""

        if "pseudo_tile_instance" in project_dict:
            globals_dict = project_dict["pseudo_tile_instance"]
        else:
            globals_dict = None

        sdict["is_legacy_save"] = self.is_legacy_save(project_dict["metadata"])

        if project_dict["doc_type"] != "notebook":
            sdict["tile_instances"] = project_dict["tile_instances"]
            if sdict["doc_type"] == "none":
                sdict["visible_doc_name"] = ""
            else:
                sdict["visible_doc_name"] = list(project_dict["doc_dict"])[0]  # This is necessary for recreating the tiles
            if sdict["is_legacy_save"]:
                interface_state = self.convert_legacy_save(project_dict)
            else:
                interface_state = project_dict["interface_state"]
            if interface_state is not None:
                try:
                    interface_state["console_items"] = self.check_for_output_text(self.add_missing_section_ends(sdict["interface_state"]["console_items"]))
                except Exception as ex:
                    interface_state["console_items"] = []
                    log.exception("error adding missing sections to console items")
            return sdict, interface_state, globals_dict
        else:
            interface_state = {}
            if unique_id is None and sdict["is_legacy_save"]:
                interface_state = {
                    "console_items": self.convert_legacy_console(project_dict)
                }
            try:
                interface_state = project_dict["interface_state"]
                interface_state["console_items"] =  self.check_for_output_text(self.add_missing_section_ends(sdict["interface_state"]["console_items"]))
            except Exception as ex:
                interface_state["console_items"] = []
                log.exception("Error adding missing sections to console items")
            return sdict, interface_state, globals_dict


    # utility methods

    def build_doc_dict(self, sid):
        sess = self.get_session(sid)
        result = {}
        coll_dict, dm_dict, hl_dict, coll_mdata = self.get_all_collection_info(sess.short_collection_name,
                                                                               username=sess.username,
                                                                               return_lists=False)

        collection_info = sess.collection_info
        doc_type = sess.doc_type
        for fname in coll_dict.keys():
            if sess.doc_type == "table":
                dinfo = {
                    "metadata": dm_dict[fname],
                    "data_rows": coll_dict[fname],
                    "table_spec": {
                        "header_list": hl_dict[fname]
                    }
                }
                collection_info.add_doc(fname, dinfo)
            else:
                dinfo = {
                    "metadata": dm_dict[fname],
                    "data_text": coll_dict[fname]
                }
                collection_info.add_doc(fname, dinfo)
        sess.visible_doc_name = list(coll_dict.keys())[0]
        return result

    def _set_row_column_data(self, sid, doc_name, the_id, column_header, new_content):
        sess = self.get_session(sid)
        collection_info = sess.collection_info
        data_rows = collection_info.get_data_rows(doc_name)
        data_rows[str(the_id)][column_header] = new_content
        collection_info.set_param(doc_name, "data_rows", data_rows)
        return

    def _set_freeform_data(self, sid, doc_name, new_content):
        sess = self.get_session(sid)
        collection_info = sess.collection_info
        collection_info.set_param(doc_name, "data_text", new_contet)
        return

    def doc_names(self, sid):
        sess = self.get_session(sid)
        collection_info = sess.collection_info
        doc_names = collection_info.doc_names
        return doc_names

    def refill_table(self, sid):
        sess = self.get_session(sid)

        visible_doc_name = sess.visible_doc_name
        if sess.doc_type == "table":
            data_object = self.grab_chunk(sid, visible_doc_name, 0)
        else:
            data_text = sess.collection_info.data_text(visible_doc_name)
            data_object = {"data_text": data_text, "doc_name": visible_doc_name}
        self.mworker.emit_table_message(sid, "refill_table", data_object)

    def tile_ids(self, sid):
        sess = self.get_session(sid)
        tile_info = sess.tile_info
        tile_ids = tile_info.tile_ids
        return tile_ids

    def current_header_list(self, sid):
        sess = self.get_session(sid)
        doc_type = sess.doc_type
        if doc_type in ["freeform", "none"]:
            return []
        collection_info = sess.collection_info
        return collection_info.get_table_spec_param(sess.visible_doc_name, "header_list")

    def _delete_tile_instance(self, sid, tile_id):
        sess = self.get_session(sid)
        sess.tile_info.remove_tile(tile_id)

        pipe_dict = sess.pipe_dict
        if tile_id in pipe_dict:
            del pipe_dict[tile_id]
            sess.pipe_dict = pipe_dict
            self.mworker.post_task("main_service", "rebuild_tile_forms_task", {"sid": sid, "tile_id": None})

        self.mworker.ask_host(sid, "delete_container", {"container_id": tile_id, "notify": False})
        self.mworker.emit_export_viewer_message(sid, "update_exports_popup", {})
        return

    def handle_exception(self, sid, ex, special_string=None, print_to_console=True):
        error_string = self.get_traceback_message(ex, special_string)
        if print_to_console:
            title = "An exception of type {}".format(type(ex).__name__)
            self.mworker.send_error_entry(sid, title, error_string)
        return error_string

    def highlight_table_text(self, sid, txt):
        self.mworker.emit_table_message(sid, "highlightTxtInDocument", {"text_to_find": txt})

    def move_one_figure(self, sid, tid, figid):
        sess = self.get_session(sid)
        data = {"figure_name": figid}

        def got_image(img_data):
            encoded_img = img_data["img"]
            data["img"] = encoded_img
            self.mworker.post_task(sess.pseudo_tile_id, "store_image", data)

        self.mworker.post_task(tid, "get_image", data, got_image)
        return

    def move_figures_to_pseudo_tile(self, sid, html_string):
        sess = self.get_session(sid)
        matches = re.findall(r"/figure_source/(.*?)/([0-9A-Fa-f-]*)", html_string)
        new_html = html_string
        if sess.pseudo_tile_id is None:
            self.create_pseudo_tile(sid)
        for match in matches:
            tid = match[0]
            new_html = re.sub(tid, sess.pseudo_tile_id, new_html)
        for match in matches:
            tid = match[0]
            figid = match[1]
            self.move_one_figure(sid, match[0], match[1])
        return new_html

    @staticmethod
    def txt_in_dict(txt, d):
        for val in d.values():
            try:
                if str(txt).lower() in str(val).lower():
                    return True
            except UnicodeEncodeError:
                continue
        return False

    # Task Worthy methods. These are eligible to be the recipient of posted tasks.

    @staticmethod
    def microdsecs(tstart):
        tnow = datetime.datetime.now()
        td = tnow - tstart
        return td.seconds * 1000000 + td.microseconds

    def get_loaded_tile_code(self, sid, tile_type):
        sess = self.get_session(sid)
        return loaded_tile_manager.get_tile_code(tile_type, sess.username)

    def get_loaded_user_modules(self, sid=None, username=None):
        if sid:
            sess = self.get_session(sid)
            username = sess.username
        return loaded_tile_manager.get_loaded_user_modules(username)

    def get_tile_property(self, tile_id, prop_name, callback=None):
        if callback is None:
            result = self.mworker.post_and_wait(tile_id, '_get_property', {"property": prop_name})["val"]
            return result
        else:
            self.mworker.post_task(tile_id, '_get_property', {"property": prop_name}, callback)
            return {}

    def update_pipe_dict(self, sid, exports, tile_id, tile_name):
        sess = self.get_session(sid)
        pipe_dict = sess.pipe_dict
        if len(exports) == 0:
            if tile_id in pipe_dict:
                del pipe_dict[tile_id]
        else:
            pipe_dict[tile_id] = {}
            if not isinstance(exports[0], dict):
                # legacy old form of exports list of strings
                exports = [{"name": exp["name"], "tags": "", "type": "unknown"} for exp in exports]
            for export in exports:
                pipe_dict[tile_id][tile_name + "_" + export["name"]] = {
                    "export_name": export["name"],
                    "export_tags": export["tags"],
                    "type": export["type"],
                    "tile_id": tile_id}
        sess.pipe_dict = pipe_dict
        return

    def rebuild_other_tile_forms(self, sid, tile_id, form_info):
        sess = self.get_session(sid)
        tile_info = sess.tile_info
        for tid in tile_info.tile_ids:
            if tile_id is None or not tid == tile_id:
                form_info["other_tile_names"] = self.get_other_tile_names(tile_id, tile_info)
                self.mworker.post_task(tid, "RebuildTileForms", form_info)
        if sess.pseudo_tile_id is not None:
            self.mworker.post_task(sess.pseudo_tile_id, "RebuildTileForms", {})

    def compile_form_info(self, sid, tile_id):
        sess = self.get_session(sid)
        tile_info = sess.tile_info
        collection_info = sess.collection_info
        if tile_id is None:
            other_tile_names = tile_info.tile_ids
        else:
            other_tile_names = self.get_other_tile_names(tile_id, tile_info)
        form_info = {"current_header_list": self.current_header_list(sid),
                     "pipe_dict": sess.pipe_dict,
                     "doc_names": collection_info.doc_names,
                     "list_names": self.list_tags_dict(sess.username),
                     "function_names": self.function_tags_dict(sess.username),
                     "class_names": self.class_tags_dict(sess.username),
                     "collection_names": self.collection_tags_dict(sess.username),
                     "other_tile_names": other_tile_names}
        return form_info

    @staticmethod
    def get_other_tile_names(tile_id, tile_info):
        other_tile_names = []
        for n, tid in enumerate(tile_info.tile_names):
            if not tid == tile_id:
                other_tile_names.append(n)
        return other_tile_names

    def display_matching_rows_applying_filter(self, sid, filter_function, document_name=None):
        sess = self.get_session(sid)
        collection_info = sess.collection_info
        if document_name is not None:
            data_rows = collection_info.get_data_rows(document_name)
            current_data_rows = {}
            for (key, val) in data_rows.items():
                if filter_function(val):
                    current_data_rows[key] = val
            collection_info.set_param(document_name, "current_data_rows", current_data_rows)
            self.refill_table(sid)
        else:
            for doc_name in collection_info.doc_names:
                current_data_rows = {}
                data_rows = collection_info.get_data_rows(doc_name)
                for (key, val) in data_rows.items():
                    if filter_function(val):
                        current_data_rows[key] = val
                collection_info.set_param(document_name, "current_data_rows", current_data_rows)
            self.refill_table(sid)
        return

    # tactic_todo apply_to_rows not used here. eliminate?
    def apply_to_rows(self, sid, func, document_name=None):
        sess = self.get_session(sid)
        collection_info = sess.collection_info
        if document_name is not None:
            i = 0
            for r in collection_info.sorted_data_rows(document_name):
                new_r = func(r)
                for (key, val) in new_r.items():
                    self._set_cell_content(sid, document_name, i, key, val, cellchange=False)
                i += 1
        else:
            for doc_name in collection_info.doc_names:
                sorted_data_froms = collection_info.get_sorted_data_froms(doc_name)
                i = 0
                for r in sorted_data_rows:
                    new_r = func(r)
                    for (key, val) in new_r.itesm():
                        self._set_cell_content(sid, doc, i, key, val, cellchange=False)
                    i += 1
        return

    # _set_cell_content is called from several places
    def _set_cell_content(self, sid, doc_name, the_id, column_header, new_content, cellchange=True):
        sess = self.get_session(sid)
        collection_info = sess.collection_info
        the_row = collection_info.get_data_rows(doc_name)[str(the_id)]
        if column_header not in the_row:
            the_row[column_header] = None
        old_content = the_row[column_header]
        if new_content != old_content:
            data = {"doc_name": doc_name, "id": the_id, "column_header": column_header,
                    "new_content": new_content, "old_content": old_content, "sid": sid}

            # If cellchange is True then we use a CellChange event to handle any updates.
            # Otherwise, just change things right here.
            if cellchange:
                self.mworker.distribute_event(sid, "CellChange", data)
            else:
                self._set_row_column_data(sid, doc_name, the_id, column_header, new_content)
            if doc_name == sess.visible_doc_name:
                if str(the_id) in collection_info.get_current_data_rows(doc_name).keys():
                    data["row"] = the_id
                    self.mworker.emit_table_message(sid, "setCellContent", data)

    def _set_cell_background(self, sid, doc_name, the_id, column_header, color):
        sess = self.get_session(sid)
        collection_info = sess.collection_info
        collection_info.set_background_color(doc_name, the_id, column_header, color)
        if doc_name == self.visible_doc_name:
            data = {"row": the_id,
                    "doc_name": doc_name,
                    "column_header": column_header,
                    "color": color}
            self.mworker.emit_table_message(sid, "setCellBackground", data)
