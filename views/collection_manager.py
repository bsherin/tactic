
import re, datetime, sys, os
from flask_login import login_required, current_user
from flask import jsonify, render_template, url_for, request, send_file
from tactic_app.users import User
from tactic_app.docker_functions import create_container, ContainerCreateError
from tactic_app import app, db, fs, mongo_uri, use_ssl
import openpyxl
import cStringIO
import tactic_app
from tactic_app.file_handling import read_csv_file_to_dict, read_tsv_file_to_dict, read_txt_file_to_dict
from tactic_app.file_handling import read_freeform_file

from resource_manager import ResourceManager
global_tile_manager = tactic_app.global_tile_manager
repository_user = User.get_user_by_username("repository")

AUTOSPLIT = True
AUTOSPLIT_SIZE = 10000


# noinspection PyMethodMayBeStatic,PyBroadException
class CollectionManager(ResourceManager):
    collection_list = "data_collections"
    collection_list_with_metadata = "data_collection_names_with_metadata"
    collection_name = ""
    name_field = ""

    def add_rules(self):
        app.add_url_rule('/main/<collection_name>', "main", login_required(self.main), methods=['get'])
        app.add_url_rule('/import_as_table/<collection_name>', "import_as_table",
                         login_required(self.import_as_table), methods=['get', "post"])
        app.add_url_rule('/import_as_freeform/<collection_name>', "import_as_freeform",
                         login_required(self.import_as_freeform), methods=['get', "post"])
        app.add_url_rule('/delete_collection', "delete_collection",
                         login_required(self.delete_collection), methods=['post'])
        app.add_url_rule('/duplicate_collection', "duplicate_collection",
                         login_required(self.duplicate_collection), methods=['post', 'get'])
        app.add_url_rule('/download_collection/<collection_name>/<new_name>', "download_collection",
                         login_required(self.download_collection), methods=['post', 'get'])
        app.add_url_rule('/combine_collections/<base_collection_name>/<collection_to_add>', "combine_collections",
                         login_required(self.combine_collections), methods=['post', 'get'])

    def main(self, collection_name):
        user_obj = current_user
        cname = user_obj.build_data_collection_name(collection_name)
        try:
            main_id, container_id = create_container("tactic_main_image", owner=user_obj.get_id())
        except ContainerCreateError:
            return render_template("error_window_template.html",
                            window_tile="Load Failed",
                            error_string="Load failed: Could not create container")

        global_tile_manager.add_user(user_obj.username)

        the_collection = db[cname]
        mdata = the_collection.find_one({"name": "__metadata__"})
        if "type" in mdata and mdata["type"] == "freeform":
            doc_type = "freeform"
        else:
            doc_type = "table"

        data_dict = {"collection_name": cname,
                     "project_collection_name": user_obj.project_collection_name,
                     "mongo_uri": mongo_uri,
                     "doc_type": doc_type,
                     "base_figure_url": url_for("figure_source", tile_id="tile_id", figure_name="X")[:-1]}

        result = tactic_app.host_worker.post_and_wait(main_id, "initialize_mainwindow", data_dict)
        if not result["success"]:
            return result["message"]
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
                               main_id=main_id,
                               doc_names=doc_names,
                               use_ssl=str(use_ssl),
                               console_html="",
                               is_table=(doc_type == "table"),
                               short_collection_name=short_collection_name,
                               new_tile_info="",
                               uses_codemirror="True")

    def rename_me(self, old_name):
        try:
            new_name = request.json["new_name"]
            full_old_name = current_user.build_data_collection_name(old_name)
            full_new_name = current_user.build_data_collection_name(new_name)
            db[full_old_name].rename(full_new_name)
            self.update_selector_list()
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
            for r, row in enumerate(data_rows.values(), start=2):
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
                                          {'$set': {"updated": datetime.datetime.today()}})
            self.update_selector_list(base_collection_name)
            return jsonify({"message": "Collections successfull combined", "alert_type": "alert-success"})
        except:
            error_string = "Error combining collections: " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
            return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

    def import_as_table(self, collection_name):
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

        for the_file in file_list:
            filename, file_extension = os.path.splitext(the_file.filename)
            filename = filename.encode("ascii", "ignore")
            if file_extension == ".csv":
                (success, result_dict, header_list) = read_csv_file_to_dict(the_file)
            elif file_extension == ".tsv":
                (success, result_dict, header_list) = read_tsv_file_to_dict(the_file)
            elif file_extension == ".txt":
                (success, result_dict, header_list) = read_txt_file_to_dict(the_file)
            # elif file_extension == ".xml":
            #     (success, result_dict, header_list) = read_xml_file_to_dict(file)
            else:
                return jsonify({"success": False, "message": "Not a valid file extension " + file_extension,
                                "alert_type": "alert-warning"})
            if not success:  # then result_dict contains an error object
                e = result_dict
                return jsonify({"message": e.message, "alert_type": "alert-danger"})

            try:
                if AUTOSPLIT and len(result_dict.keys()) > AUTOSPLIT_SIZE:
                    docs = self.autosplit_doc(filename, result_dict)
                    for doc in docs:
                        db[full_collection_name].insert_one({"name": doc["name"], "data_rows": doc["data_rows"],
                                                             "header_list": header_list, "type": "table"})
                else:
                    db[full_collection_name].insert_one({"name": filename, "data_rows": result_dict,
                                                         "header_list": header_list})
            except:
                error_string = "Error creating collection: " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
                return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

        self.update_selector_list(collection_name)
        return jsonify({"message": "Collection successfully loaded", "alert_type": "alert-success"})

    def import_as_freeform(self, collection_name):
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

        for the_file in file_list:
            filename, file_extension = os.path.splitext(the_file.filename)
            filename = filename.encode("ascii", "ignore")
            (success, result_txt) = read_freeform_file(the_file)
            if not success:  # then result_dict contains an error object
                e = result_txt
                return jsonify({"message": e.message, "alert_type": "alert-danger"})

            try:
                save_dict = {"name": filename, "file_id": fs.put(result_txt)}
                db[full_collection_name].insert_one(save_dict)
            except:
                error_string = "Error creating collection: " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
                return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

        self.update_selector_list(collection_name)
        return jsonify({"message": "Collection successfully loaded", "alert_type": "alert-success"})

    def delete_collection(self):
        user_obj = current_user
        collection_name = request.json["resource_name"]
        result = user_obj.remove_collection(collection_name)
        self.update_selector_list()
        return jsonify({"success": result})

    def duplicate_collection(self):
        user_obj = current_user
        collection_to_copy = user_obj.full_collection_name(request.json['res_to_copy'])
        new_collection_name = user_obj.full_collection_name(request.json['new_res_name'])
        if new_collection_name in db.collection_names():
            return jsonify({"success": False, "message": "There is already a collection with that name.",
                            "alert_type": "alert-warning"})

        for doc in db[collection_to_copy].find():
            if "file_id" in doc:
                doc_text = fs.get(doc["file_id"]).read()
                doc["file_id"] = fs.put(doc_text)
            db[new_collection_name].insert_one(doc)
        self.update_selector_list(request.json['new_res_name'])
        return jsonify({"success": True})


class RepositoryCollectionManager(CollectionManager):
    rep_string = "repository-"
    is_repository = True

    def add_rules(self):
        pass
