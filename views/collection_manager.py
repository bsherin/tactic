
import re, datetime, sys, os
from collections import OrderedDict
from flask_login import login_required, current_user
from flask import jsonify, render_template, url_for, request, send_file
from tactic_app.users import User
from tactic_app.docker_functions import create_container, ContainerCreateError
from tactic_app import app, db, fs, mongo_uri, use_ssl
from tactic_app.communication_utils import make_python_object_jsonizable, debinarize_python_object
from tactic_app.communication_utils import read_temp_data, delete_temp_data
import openpyxl
import cStringIO
import tactic_app
from tactic_app.file_handling import read_csv_file_to_dict, read_tsv_file_to_dict, read_txt_file_to_dict, read_excel_file
from tactic_app.file_handling import read_freeform_file
from tactic_app.users import load_user

from tactic_app.resource_manager import ResourceManager, UserManageResourceManager
global_tile_manager = tactic_app.global_tile_manager
repository_user = User.get_user_by_username("repository")

AUTOSPLIT = False
AUTOSPLIT_SIZE = 10000

import datetime
tstring = datetime.datetime.utcnow().strftime("%Y-%H-%M-%S")


# noinspection PyMethodMayBeStatic,PyBroadException,RegExpRedundantEscape
class CollectionManager(UserManageResourceManager):
    collection_list = "data_collections"
    collection_list_with_metadata = "data_collection_names_with_metadata"
    collection_name = ""
    name_field = ""

    def add_rules(self):
        app.add_url_rule('/new_notebook', "new_notebook", login_required(self.new_notebook), methods=['get'])
        app.add_url_rule('/open_notebook/<unique_id>', "open_notebook", login_required(self.open_notebook), methods=['get'])
        app.add_url_rule('/main/<collection_name>', "main", login_required(self.main), methods=['get'])
        app.add_url_rule('/import_as_table/<collection_name>/<user_manage_id>', "import_as_table",
                         login_required(self.import_as_table), methods=['get', "post"])
        app.add_url_rule('/import_as_freeform/<collection_name>/<user_manage_id>', "import_as_freeform",
                         login_required(self.import_as_freeform), methods=['get', "post"])
        app.add_url_rule('/delete_collection', "delete_collection",
                         login_required(self.delete_collection), methods=['post'])
        app.add_url_rule('/duplicate_collection', "duplicate_collection",
                         login_required(self.duplicate_collection), methods=['post', 'get'])
        app.add_url_rule('/download_collection/<collection_name>/<new_name>', "download_collection",
                         login_required(self.download_collection), methods=['post', 'get'])
        app.add_url_rule('/combine_collections/<base_collection_name>/<collection_to_add>', "combine_collections",
                         login_required(self.combine_collections), methods=['post', 'get'])

    def new_notebook(self):
        user_obj = current_user
        try:
            main_id, container_id = create_container("tactic_main_image", owner=user_obj.get_id(),
                                                     other_name="new_notebook")
        except ContainerCreateError:
            return render_template("error_window_template.html",
                                   window_tile="Load Failed",
                                   error_string="Load failed: Could not create container",
                                   version_string=tstring)
        return render_template("main.html",
                               collection_name="",
                               window_title="new notebook",
                               project_name='',
                               project_collection_name=user_obj.project_collection_name,
                               mongo_uri=mongo_uri,
                               base_figure_url=url_for("figure_source", tile_id="tile_id", figure_name="X")[:-1],
                               main_id=main_id,
                               temp_data_id="",
                               doc_names=[],
                               use_ssl=str(use_ssl),
                               console_html="",
                               is_table=False,
                               is_notebook=True,
                               is_freeform=False,
                               short_collection_name="",
                               uses_codemirror="True",
                               version_string=tstring)

    def open_notebook(self, unique_id):  # tactic_working
        the_data = read_temp_data(db, unique_id)
        user_obj = load_user(the_data["user_id"])
        try:
            main_id, container_id = create_container("tactic_main_image", owner=user_obj.get_id(),
                                                     other_name="new_notebook")
        except ContainerCreateError:
            return render_template("error_window_template.html",
                                   window_tile="Load Failed",
                                   error_string="Load failed: Could not create container",
                                   version_string=tstring)
        return render_template("main.html",
                               collection_name="",
                               window_title="new notebook",
                               project_name='',
                               project_collection_name=user_obj.project_collection_name,
                               mongo_uri=mongo_uri,
                               base_figure_url=url_for("figure_source", tile_id="tile_id", figure_name="X")[:-1],
                               main_id=main_id,
                               temp_data_id= unique_id,
                               doc_names=[],
                               use_ssl=str(use_ssl),
                               console_html="",  # tactic_working
                               is_table=False,
                               is_notebook=True,
                               is_freeform=False,
                               short_collection_name="",
                               uses_codemirror="True",
                               version_string=tstring)

    def main(self, collection_name):
        user_obj = current_user
        cname = user_obj.build_data_collection_name(collection_name)
        try:
            main_id, container_id = create_container("tactic_main_image", owner=user_obj.get_id(),
                                                     other_name=collection_name)
        except ContainerCreateError:
            return render_template("error_window_template.html",
                                   window_tile="Load Failed",
                                   error_string="Load failed: Could not create container",
                                   version_string=tstring)

        global_tile_manager.add_user(user_obj.username)

        the_collection = db[cname]
        mdata = the_collection.find_one({"name": "__metadata__"})
        if "type" in mdata and mdata["type"] == "freeform":
            doc_type = "freeform"
        else:
            doc_type = "table"

        short_collection_name = re.sub("^.*?\.data_collection\.", "", collection_name)

        doc_names = []

        for f in the_collection.find():
            fname = f["name"].encode("ascii", "ignore")
            if fname == "__metadata__":
                continue
            else:
                doc_names.append(fname)

        doc_names.sort()
        return render_template("main.html",
                               collection_name=cname,
                               window_title=short_collection_name,
                               project_name='',
                               project_collection_name=user_obj.project_collection_name,
                               mongo_uri=mongo_uri,
                               base_figure_url=url_for("figure_source", tile_id="tile_id", figure_name="X")[:-1],
                               main_id=main_id,
                               temp_data_id="",
                               doc_names=doc_names,
                               use_ssl=str(use_ssl),
                               console_html="",
                               is_table=(doc_type == "table"),
                               is_notebook=False,
                               is_freeform=(doc_type == 'freeform'),
                               short_collection_name=short_collection_name,
                               uses_codemirror="True",
                               version_string=tstring)

    def rename_me(self, old_name):
        try:
            new_name = request.json["new_name"]
            full_old_name = current_user.build_data_collection_name(old_name)
            full_new_name = current_user.build_data_collection_name(new_name)
            db[full_old_name].rename(full_new_name)
            # self.update_selector_list()
            return jsonify({"success": True, "message": "collection name changed", "alert_type": "alert-success"})
        except:
            error_string = "Error renaming collection " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
            return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

    def download_collection(self, collection_name, new_name):
        user_obj = current_user
        cname = user_obj.build_data_collection_name(collection_name)
        the_collection = db[cname]

        wb = openpyxl.Workbook()
        first = True
        for f in the_collection.find():
            doc_name = f["name"].encode("ascii", "ignore")
            if doc_name == "__metadata__":
                continue
            sheet_name = re.sub(r"[\[\]\*\/\\ \?\:]", r"-", doc_name)[:25]
            if first:
                ws = wb.active
                ws.title = sheet_name
                first = False
            else:
                ws = wb.create_sheet(title=sheet_name)
            data_rows = f["data_rows"]
            if "header_list" in f:
                header_list = f["header_list"]
            else:
                header_list = f["table_spec"]["header_list"]
            for c, header in enumerate(header_list, start=1):
                _ = ws.cell(row=1, column=c, value=header)
            sorted_int_keys = sorted([int(key) for key in data_rows.keys()])
            for r, id in enumerate(sorted_int_keys, start=2):
                row = data_rows[str(id)]
                for c, header in enumerate(header_list, start=1):
                    _ = ws.cell(row=r, column=c, value=row[header])
            # noinspection PyUnresolvedReferences
        virtual_notebook = openpyxl.writer.excel.save_virtual_workbook(wb)
        str_io = cStringIO.StringIO()
        str_io.write(virtual_notebook)
        str_io.seek(0)
        return send_file(str_io,
                         attachment_filename=new_name,
                         as_attachment=True)

    def grab_metadata(self, res_name):
        if self.is_repository:
            user_obj = repository_user
        else:
            user_obj = current_user
        cname = user_obj.build_data_collection_name(res_name)
        mdata = db[cname].find_one({"name": "__metadata__"})
        return mdata

    def save_metadata(self, res_name, tags, notes):
        cname = current_user.build_data_collection_name(res_name)
        mdata = db[cname].find_one({"name": "__metadata__"})
        if mdata is None:
            db[cname].insert_one({"name": "__metadata__", "tags": tags, "notes": notes})
        else:
            db[cname].update_one({"name": "__metadata__"},
                                 {'$set': {"tags": tags, "notes": notes}})

    def delete_tag(self, tag):
        cnames_with_metadata = current_user.data_collection_names_with_metadata
        for [res_name, mdata] in cnames_with_metadata:
            tagstring = mdata["tags"]
            taglist = tagstring.split()
            if tag in taglist:
                taglist.remove(tag)
                mdata["tags"] = " ".join(taglist)
                cname = current_user.build_data_collection_name(res_name)
                db[cname].update_one({"name": "__metadata__"},
                                     {'$set': {"tags": mdata["tags"], "notes": mdata["notes"]}})
        return

    def rename_tag(self, old_tag, new_tag):
        cnames_with_metadata = current_user.data_collection_names_with_metadata
        for [res_name, mdata] in cnames_with_metadata:
            tagstring = mdata["tags"]
            taglist = tagstring.split()
            if old_tag in taglist:
                taglist.remove(old_tag)
                if new_tag not in taglist:
                    taglist.append(new_tag)
                mdata["tags"] = " ".join(taglist)
                cname = current_user.build_data_collection_name(res_name)
                db[cname].update_one({"name": "__metadata__"},
                                     {'$set': {"tags": mdata["tags"], "notes": mdata["notes"]}})
        return

    def autosplit_doc(self, filename, full_dict):
        sorted_int_keys = sorted([int(key) for key in full_dict.keys()])
        counter = 0
        doc_list = []
        doc_rows = {}
        doc_counter = 1
        for r in sorted_int_keys:
            doc_rows[str(counter)] = full_dict[str(r)]
            counter += 1
            if counter == AUTOSPLIT_SIZE:
                doc_list.append({
                    "name": filename + "__" + str(doc_counter),
                    "data_rows": doc_rows
                })
                counter = 0
                doc_rows = {}
                doc_counter += 1
        if counter > 0:
            doc_list.append({
                "name": filename + "__" + str(doc_counter),
                "data_rows": doc_rows
            })
        return doc_list

    def combine_collections(self, base_collection_name, collection_to_add):
        try:
            user_obj = current_user
            base_full_name = user_obj.build_data_collection_name(base_collection_name)
            add_full_name = user_obj.build_data_collection_name(collection_to_add)
            base_collection = db[base_full_name]
            add_collection = db[add_full_name]
            for f in add_collection.find():
                fname = f["name"].encode("ascii", "ignore")
                if fname == "__metadata__":
                    continue
                base_collection.insert_one(f)
            db[base_full_name].update_one({"name": "__metadata__"},
                                          {'$set': {"updated": datetime.datetime.utcnow()}})
            self.update_number_of_docs(base_full_name)
            self.update_selector_list(base_collection_name)
            return jsonify({"message": "Collections successfull combined", "alert_type": "alert-success"})
        except:
            error_string = "Error combining collections: " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
            return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

    def import_as_table(self, collection_name, user_manage_id):
        user_obj = current_user
        file_list = request.files.getlist("file")
        full_collection_name = user_obj.build_data_collection_name(collection_name)
        if full_collection_name in db.collection_names():
            return jsonify({"success": False, "message": "There is already a collection with that name.",
                            "alert_type": "alert-warning"})
        mdata = global_tile_manager.create_initial_metadata()
        try:
            db[full_collection_name].insert_one({"name": "__metadata__", "datetime": mdata["datetime"],
                                                 "updated": mdata["updated"], "tags": "", "notes": "", "type": "table"})
        except:
            error_string = "Error creating collection: " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
            return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

        known_extensions = [".xlsx", ".csv", ".tsv", ".txt"]

        file_decoding_errors = OrderedDict()
        for the_file in file_list:
            multidoc = False
            filename, file_extension = os.path.splitext(the_file.filename)
            filename = filename.encode("ascii", "ignore")
            if file_extension not in known_extensions:
                return jsonify({"success": False, "message": "Invalid file extension " + file_extension,
                                "alert_type": "alert-warning"})
            success = None
            header_dict = None
            header_list = None
            decoding_problems = []
            if file_extension == ".xlsx":
                (success, result_dict, header_dict) = read_excel_file(the_file)
                multidoc = True
            else:
                self.show_um_message("Reading file {} and checking encoding".format(filename), user_manage_id,
                                     timeout=10)
                encoding = ""
                if file_extension == ".csv":
                    (success, result_dict, header_list, encoding, decoding_problems) = read_csv_file_to_dict(the_file)
                elif file_extension == ".tsv":
                    (success, result_dict, header_list, encoding, decoding_problems) = read_tsv_file_to_dict(the_file)
                elif file_extension == ".txt":
                    (success, result_dict, header_list, encoding, decoding_problems) = read_txt_file_to_dict(the_file)
                self.show_um_message("Got encoding {} for {}".format(encoding, filename), user_manage_id, timeout=10)

            if not success:  # then result_dict contains an error object
                e = result_dict
                return jsonify({"message": e["message"], "alert_type": "alert-danger"})

            if len(decoding_problems) > 0:
                file_decoding_errors[filename] = decoding_problems

            try:
                if multidoc:
                    for dname in result_dict.keys():
                        result_binary = make_python_object_jsonizable(result_dict[dname])
                        file_id = fs.put(result_binary)
                        db[full_collection_name].insert_one({"name": dname, "file_id": file_id,
                                                             "header_list": header_dict[dname]})
                else:
                    result_binary = make_python_object_jsonizable(result_dict)
                    file_id = fs.put(result_binary)
                    db[full_collection_name].insert_one({"name": filename, "file_id": file_id,
                                                         "header_list": header_list})
            except:
                error_string = "Error creating collection: " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
                return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

        self.update_number_of_docs(full_collection_name)
        table_row = self.create_new_row(collection_name, mdata)
        all_table_row = self.all_manager.create_new_all_row(collection_name, mdata, "collection")
        if len(file_decoding_errors.keys()) == 0:
            file_decoding_errors = None
        return jsonify({"success": True, "new_row": table_row, "new_all_row": all_table_row,
                        "message": "Collection successfully loaded", "alert_type": "alert-success",
                        "file_decoding_errors": file_decoding_errors})

    def import_as_freeform(self, collection_name, user_manage_id):
        user_obj = current_user
        file_list = request.files.getlist("file")
        full_collection_name = user_obj.build_data_collection_name(collection_name)
        if full_collection_name in db.collection_names():
            return jsonify({"success": False, "message": "There is already a collection with that name.",
                            "alert_type": "alert-warning"})
        mdata = global_tile_manager.create_initial_metadata()
        try:
            db[full_collection_name].insert_one({"name": "__metadata__", "datetime": mdata["datetime"],
                                                 "updated": mdata["updated"], "tags": "",
                                                 "notes": "", "type": "freeform"})
        except:
            error_string = "Error creating collection: " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
            return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

        file_decoding_errors = OrderedDict()
        for the_file in file_list:

            filename, file_extension = os.path.splitext(the_file.filename)
            filename = filename.encode("ascii", "ignore")
            self.show_um_message("Reading file {} and checking encoding".format(filename), user_manage_id, timeout=10)
            (success, result_txt, encoding, decoding_problems) = read_freeform_file(the_file)
            self.show_um_message("Got encoding {} for {}".format(encoding, filename), user_manage_id, timeout=10)
            if not success:  # then result_dict contains an error object
                e = result_txt
                return jsonify({"message": e.message, "alert_type": "alert-danger"})
            if len(decoding_problems) > 0:
                file_decoding_errors[filename] = decoding_problems
            try:
                save_dict = {"name": filename, "encoding": encoding, "file_id": fs.put(result_txt, encoding=encoding)}
                db[full_collection_name].insert_one(save_dict)
            except:
                error_string = "Error creating collection: " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
                return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

        self.update_number_of_docs(full_collection_name)
        table_row = self.create_new_row(collection_name, mdata)
        all_table_row = self.all_manager.create_new_all_row(collection_name, mdata, "collection")
        if len(file_decoding_errors.keys()) == 0:
            file_decoding_errors = None
        return jsonify({"success": True, "new_row": table_row, "new_all_row": all_table_row,
                        "alert_type": "alert-success",
                        "file_decoding_errors": file_decoding_errors})

    def delete_collection(self):
        user_obj = current_user
        collection_name = request.json["resource_name"]
        result = user_obj.remove_collection(collection_name)
        # self.update_selector_list()
        return jsonify({"success": result})

    def update_number_of_docs(self, collection_name):
        number_of_docs = db[collection_name].count() - 1
        db[collection_name].update_one({"name": "__metadata__"},
                                       {'$set': {"number_of_docs": number_of_docs}})

    def duplicate_collection(self):
        user_obj = current_user
        collection_to_copy = user_obj.full_collection_name(request.json['res_to_copy'])
        new_collection_name = user_obj.full_collection_name(request.json['new_res_name'])
        if new_collection_name in db.collection_names():
            return jsonify({"success": False, "message": "There is already a collection with that name.",
                            "alert_type": "alert-warning"})
        metadata = db[collection_to_copy].find_one({"name": "__metadata__"})

        if "number_of_docs" not in metadata:  # legacy this is a way to get this into older collections
            self.update_number_of_docs(collection_to_copy)

        for doc in db[collection_to_copy].find():
            if "file_id" in doc:
                doc_text = fs.get(doc["file_id"]).read()
                doc["file_id"] = fs.put(doc_text)
            db[new_collection_name].insert_one(doc)

        self.update_number_of_docs(new_collection_name)
        metadata = db[new_collection_name].find_one({"name": "__metadata__"})
        table_row = self.create_new_row(request.json['new_res_name'], metadata)
        all_table_row = self.all_manager.create_new_all_row(request.json['new_res_name'], metadata, "collection")
        return jsonify({"success": True, "new_row": table_row, "new_all_row": all_table_row})


class RepositoryCollectionManager(CollectionManager):
    rep_string = "repository-"
    is_repository = True

    def add_rules(self):
        pass
