
import datetime
import sys
import copy
import re
import os
import uuid
import pymongo
from flask import render_template, request, jsonify, url_for
from flask_login import login_required, current_user
import tactic_app
from tactic_app import app, db, socketio
from resource_manager import ResourceManager, LibraryResourceManager, repository_user
from users import User
from docker_functions import create_container

from js_source_management import js_source_dict, _develop, css_source
from redis_tools import create_ready_block
from tile_code_parser import TileParser

import loaded_tile_management

import datetime
tstring = datetime.datetime.utcnow().strftime("%Y-%H-%M-%S")

# noinspection PyMethodMayBeStatic,PyBroadException
class TileManager(LibraryResourceManager):
    collection_list = "tile_module_names"
    collection_list_with_metadata = "tile_module_names_with_metadata"
    collection_name = "tile_collection_name"
    name_field = "tile_module_name"

    def add_rules(self):
        app.add_url_rule('/view_module/<module_name>', "view_module",
                         login_required(self.view_module), methods=['get'])
        app.add_url_rule('/view_module_in_context', "view_module_in_context",
                         login_required(self.view_module_in_context), methods=['get', 'post'])
        app.add_url_rule('/get_module_code/<module_name>', "get_module_code",
                         login_required(self.get_module_code), methods=['get', 'post'])
        app.add_url_rule('/view_in_creator/<module_name>', "view_in_creator",
                         login_required(self.view_in_creator), methods=['get'])
        app.add_url_rule('/view_in_creator_in_context', "view_in_creator_in_context",
                         login_required(self.view_in_creator_in_context), methods=['get', 'post'])
        app.add_url_rule('/view_location_in_creator/<module_name>/<line_number>', "view_location_in_creator",
                         login_required(self.view_in_creator), methods=['get'])
        app.add_url_rule('/last_saved_view/<module_name>', "last_saved_view",
                         login_required(self.last_saved_view), methods=['get'])
        app.add_url_rule('/last_saved_view_in_context', "last_saved_view_in_context",
                         login_required(self.last_saved_view_in_context), methods=['get', 'post'])
        app.add_url_rule('/get_api_html', "get_api_html",
                         login_required(self.get_api_html), methods=['get', 'post'])
        app.add_url_rule('/unload_one_module/<module_name>', "unload_one_module",
                         login_required(self.unload_one_module), methods=['get', 'post'])
        app.add_url_rule('/unload_all_tiles', "unload_all_tiles",
                         login_required(self.unload_all_tiles), methods=['get', 'post'])
        app.add_url_rule('/add_tile_module', "add_tile_module",
                         login_required(self.add_tile_module), methods=['get', "post"])
        app.add_url_rule('/get_loaded_tile_lists', "get_loaded_tile_lists",
                         login_required(self.get_loaded_tile_lists), methods=['get', 'post'])
        app.add_url_rule('/create_tile_module', "create_tile_module",
                         login_required(self.create_tile_module), methods=['get', 'post'])
        app.add_url_rule('/create_duplicate_tile', "create_duplicate_tile",
                         login_required(self.create_duplicate_tile), methods=['get', 'post'])

    def rename_me(self, old_name):
        try:
            new_name = request.json["new_name"]
            self.db[current_user.tile_collection_name].update_one({"tile_module_name": old_name},
                                                             {'$set': {"tile_module_name": new_name}})
            return jsonify({"success": True, "message": "Module Successfully Saved", "alert_type": "alert-success"})
        except Exception as ex:
            return self.get_exception_for_ajax(ex, "Error renaming collection")

    def grab_metadata(self, res_name, user_obj=None):
        if user_obj is None:
            user_obj = current_user
        tile_dict = self.db[user_obj.tile_collection_name].find_one({self.name_field: res_name})
        if tile_dict is None:
            print("couldn't grab metadata for tile module " + str(res_name))
            return None
        if "metadata" in tile_dict:
            mdata = tile_dict["metadata"]
            mdata["icon"] = self.get_tile_icon_from_mdata(mdata)
            if "category" not in mdata:
                module_code = tile_dict["tile_module"]
                tp = TileParser(module_code)
                if hasattr(tp, "category"):
                    mdata["category"] = tp.category
                else:
                    mdata["category"] = "basic"
        else:
            mdata = None
        return mdata

    def get_tile_icon(self, tile_type, user_obj):
        module_name = loaded_tile_management.get_module_from_type(user_obj.username, tile_type)
        mdata = self.grab_metadata(module_name, user_obj)
        return self.get_tile_icon_from_mdata(mdata)

    def save_metadata(self, res_name, tags, notes, icon=None, uid=""):
        doc = self.db[current_user.tile_collection_name].find_one({"tile_module_name": res_name})
        if "metadata" in doc:
            mdata = doc["metadata"]
        else:
            mdata = {}
        mdata["tags"] = tags
        mdata["notes"] = notes
        mdata["mdata_uid"] = uid
        if icon is not None:
            mdata["icon"] = icon
        self.db[current_user.tile_collection_name].update_one({"tile_module_name": res_name},
                                                              {'$set': {"metadata": mdata}})

    def delete_tag(self, tag):
        doclist = self.db[current_user.tile_collection_name].find()
        for doc in doclist:
            if "metadata" not in doc:
                continue
            mdata = doc["metadata"]
            tagstring = mdata["tags"]
            taglist = tagstring.split()
            if tag in taglist:
                taglist.remove(tag)
                mdata["tags"] = " ".join(taglist)
                res_name = doc["tile_module_name"]
                self.db[current_user.tile_collection_name].update_one({"tile_module_name": res_name},
                                                                      {'$set': {"metadata": mdata}})
        return

    def rename_tag(self, tag_changes):
        doclist = self.db[current_user.tile_collection_name].find()
        for doc in doclist:
            if "metadata" not in doc:
                continue
            mdata = doc["metadata"]
            tagstring = mdata["tags"]
            taglist = tagstring.split()
            for old_tag, new_tag in tag_changes:
                if old_tag in taglist:
                    taglist.remove(old_tag)
                    if new_tag not in taglist:
                        taglist.append(new_tag)
                    mdata["tags"] = " ".join(taglist)
                    res_name = doc["tile_module_name"]
                    self.db[current_user.tile_collection_name].update_one({"tile_module_name": res_name},
                                                                     {'$set': {"metadata": mdata}})

    def get_api_html(self):
        return jsonify({"success": True, "api_html": api_html})

    def clear_old_recent_history(self, module_name):
        tile_dict = self.db[current_user.tile_collection_name].find_one({"tile_module_name": module_name})
        if "recent_history" not in tile_dict:
            return

        recent_history = []
        yesterday = datetime.datetime.utcnow() - datetime.timedelta(days=1)
        yesterday_date = yesterday.date()
        # We want to keep every element of the recent history from yesterday or today
        # Plus we want to keep the last entry from each date that appears.
        for cp in tile_dict["recent_history"]:
            cp_date = cp["updated"].date()
            if cp_date > yesterday_date:  # If it's more recent than yesterday, keep it.
                recent_history.append(cp)
            else:
                found = False
                for i, rh_item in enumerate(recent_history):
                    if cp_date == rh_item["updated"].date():
                        if cp["updated"] > rh_item["updated"]:
                            recent_history[i] = cp
                        found = True
                        break
                if not found:
                    recent_history.append(cp)
        recent_history.sort(key=lambda x: x["updated"].strftime("%Y%m%d%H%M%S"))

        self.db[current_user.tile_collection_name].update_one({"tile_module_name": module_name},
                                                         {'$set': {"recent_history": recent_history}})
        return

    def view_module(self, module_name):
        user_obj = current_user
        self.clear_old_recent_history(module_name)
        javascript_source = url_for('static', filename=js_source_dict["module_viewer_react"])
        return render_template("library/resource_viewer_react.html",
                               resource_name=module_name,
                               theme=user_obj.get_theme(),
                               develop=str(_develop),
                               has_openapi_key=current_user.has_openapi_key,
                               css_source=css_source("module_viewer_react"),
                               javascript_source=javascript_source,
                               version_string=tstring)

    def view_module_in_context(self):
        user_obj = current_user
        module_name = request.json["resource_name"]
        self.clear_old_recent_history(module_name)
        module_code = user_obj.get_tile_module(module_name)
        mdata = self.grab_metadata(module_name)
        mdata["icon"] = self.get_tile_icon_from_mdata(mdata)
        mdata = user_obj.process_metadata(mdata)
        data = {
            "success": True,
            "kind": "module-viewer",
            "res_type": "tile",
            "the_content": module_code,
            "mdata": mdata,
            "resource_name": module_name,
            "read_only": False,
            "is_repository": False,

        }
        return jsonify(data)

    def get_module_code(self, module_name):
        user_obj = current_user
        module_code = user_obj.get_tile_module(module_name)
        return jsonify({"success": True, "the_content": module_code})

    def last_saved_view_in_context(self):
        module_name = request.json["resource_name"]
        tile_dict = current_user.get_tile_dict(module_name)
        if "last_saved" in tile_dict and tile_dict["last_saved"] == "creator":
            result = self.view_in_creator_in_context()
        else:
            result = self.view_module_in_context()
        return result

    def last_saved_view(self, module_name):
        tile_dict = current_user.get_tile_dict(module_name)
        if "last_saved" in tile_dict and tile_dict["last_saved"] == "creator":
            result = self.view_in_creator(module_name)
        else:
            result = self.view_module(module_name)
        return result

    def initialize_module_viewer_container(self, module_name):
        user_obj = current_user
        rb_id = str(uuid.uuid4())
        environ = {"RB_ID": rb_id}
        vol_dict = {}
        if "USE_REMOTE_DATABASE" in os.environ:
            environ["USE_REMOTE_DATABASE"] = os.environ.get("USE_REMOTE_DATABASE")
            environ["REMOTE_KEY_FILE"] = os.environ.get("REMOTE_KEY_FILE")
            environ["REMOTE_USERNAME"] = os.environ.get("REMOTE_USERNAME")
            vol_dict[environ["REMOTE_KEY_FILE"]] = {"bind": environ["REMOTE_KEY_FILE"], "mode": "ro"}
        module_viewer_id, container_id = create_container("bsherin/tactic:module_viewer",
                                                          env_vars=environ,
                                                          volume_dict=vol_dict,
                                                          owner=user_obj.get_id(),
                                                          other_name=module_name, register_container=True)

        the_content = {"module_name": module_name,
                       "module_viewer_id": module_viewer_id,
                       "container_id": container_id,
                       "rb_id": rb_id,
                       "tile_collection_name": user_obj.tile_collection_name}

        return the_content

    def view_in_creator(self, module_name, line_number=0):

        return render_template("library/tile_creator_react.html",
                               module_name=module_name,
                               line_number=line_number,
                               css_source=css_source("tile_creator_react"),
                               module_source=js_source_dict["tile_creator_react"],
                               develop=str(_develop),
                               has_openapi_key=current_user.has_openapi_key,
                               theme=current_user.get_theme(),
                               version_string=tstring,)

    def view_in_creator_in_context(self):
        print("** in view_in_creator_in_context **")
        user_obj = current_user
        module_name = request.json["resource_name"]
        self.clear_old_recent_history(module_name)
        id_info = self.initialize_module_viewer_container(module_name)
        create_ready_block(id_info["rb_id"], user_obj.username, [id_info["module_viewer_id"], "client"],
                           id_info["module_viewer_id"])
        mdata = self.grab_metadata(module_name)

        mdata = user_obj.process_metadata(mdata)
        data = {
            "success": True,
            "kind": "creator-viewer",
            "res_type": "tile",
            "resource_name": module_name,
            "module_viewer_id": id_info["module_viewer_id"],
            "ready_block_id": id_info["rb_id"],
            "tile_collection_name": id_info["tile_collection_name"],
            "mdata": mdata
        }

        return jsonify(data)

    def unload_all_tiles(self):
        try:
            loaded_tile_management.unload_user_tiles(current_user.username)
            self.refresh_selector_list(current_user)
            socketio.emit('update-menus', {}, namespace='/main', room=current_user.get_id())
            return jsonify({"message": "Tiles successfully unloaded", "success": True})
        except Exception as ex:
            return self.get_exception_for_ajax(ex, "Error unloading tiles")

    def unload_one_module(self, module_name):
        user_obj = current_user
        loaded_tile_management.unload_one_module(user_obj.username, module_name)
        _id = user_obj.get_tile_dict(module_name)["_id"]
        self.update_selector_row({"name": module_name,  "doc_id": str(_id), "event_type": "update",
                                  "icon:upload": "", "res_type": "tile"}, user_obj)
        socketio.emit('update-menus', {}, namespace='/main', room=current_user.get_id())
        return jsonify({"success": True, "message": "Tile unloaded"})

    def add_tile_module(self):
        user_obj = current_user
        f = request.files['file']
        if self.db[user_obj.tile_collection_name].find_one({"tile_module_name": f.filename}) is not None:
            return jsonify({"success": False, "alert_type": "alert-warning",
                            "message": "A module with that name already exists"})
        the_module = f.read()
        metadata = loaded_tile_management.create_initial_metadata()
        tp = TileParser(the_module)
        metadata["type"] = tp.type
        data_dict = {"tile_module_name": f.filename, "tile_module": the_module, "metadata": metadata}
        self.db[user_obj.tile_collection_name].insert_one(data_dict)
        return jsonify({"success": True})

    def create_duplicate_tile(self):
        user_obj = current_user
        tile_to_copy = request.json['res_to_copy']
        new_tile_name = request.json['new_res_name']
        if self.db[user_obj.tile_collection_name].find_one({"tile_module_name": new_tile_name}) is not None:
            return jsonify({"success": False, "alert_type": "alert-warning",
                            "message": "A tile with that name already exists"})
        old_tile_dict = self.db[user_obj.tile_collection_name].find_one({"tile_module_name": tile_to_copy})
        metadata = copy.copy(old_tile_dict["metadata"])
        metadata["updated"] = datetime.datetime.utcnow()
        metadata["datetime"] = metadata["updated"]
        new_tile_dict = {"tile_module_name": new_tile_name, "tile_module": old_tile_dict["tile_module"],
                         "metadata": metadata, "last_saved": old_tile_dict["last_saved"]}
        self.db[user_obj.tile_collection_name].insert_one(new_tile_dict)
        return jsonify({"success": True})

    def create_tile_module(self):
        user_obj = current_user
        new_tile_name = request.json['new_res_name']
        template_name = request.json["template_name"]
        last_saved = request.json["last_saved"]
        if self.db[user_obj.tile_collection_name].find_one({"tile_module_name": new_tile_name}) is not None:
            return jsonify({"success": False, "alert_type": "alert-warning",
                            "message": "A module with that name already exists"})
        mongo_dict = self.db["repository.tiles"].find_one({"tile_module_name": template_name})
        template = mongo_dict["tile_module"]

        metadata = loaded_tile_management.create_initial_metadata()
        if "Matplotlib" in template_name:
            metadata["category"] = "plot"
        elif "JSON" in template_name:
            metadata["category"] = "js"
        else:
            metadata["category"] = "basic"
        metadata["type"] = ""

        data_dict = {"tile_module_name": new_tile_name, "tile_module": template, "metadata": metadata,
                     "last_saved": last_saved}
        self.db[current_user.tile_collection_name].insert_one(data_dict)
        return jsonify({"success": True})

    def loaded_tile_lists(self, user_obj=None):
        if user_obj is None:
            user_obj = current_user
        uname = user_obj.username
        result = {"nondefault_tiles": loaded_tile_management.get_nondefault_tiles_list(uname),
                  "default_tiles": loaded_tile_management.get_default_tiles(uname),
                  "failed_loads": loaded_tile_management.get_failed_loads_list(uname)}
        return result

    def get_loaded_tile_lists(self, user_obj=None):
        return jsonify({"success": True, "tile_load_dict": self.loaded_tile_lists(user_obj)})


# noinspection PyMethodOverriding
class RepositoryTileManager(TileManager):
    rep_string = "repository-"
    is_repository = True

    def add_rules(self):
        app.add_url_rule('/repository_view_module/<module_name>', "repository_view_module",
                         login_required(self.repository_view_module), methods=['get'])
        app.add_url_rule('/repository_view_module_in_context', "repository_view_module_in_context",
                         login_required(self.repository_view_module_in_context), methods=['get', 'post'])
        app.add_url_rule('/repository_get_module_code/<module_name>', "repository_get_module_code",
                         login_required(self.repository_get_module_code), methods=['get', 'post'])

    def grab_metadata(self, res_name):
        user_obj = repository_user
        doc = self.repository_db[user_obj.tile_collection_name].find_one({self.name_field: res_name})
        if "metadata" in doc:
            mdata = doc["metadata"]
        else:
            mdata = None
        return mdata

    def repository_view_module_in_context(self):
        module_name = request.json["resource_name"]
        module_code = repository_user.get_tile_module(module_name)
        mdata = repository_user.process_metadata(self.grab_metadata(module_name))
        data = {
            "success": True,
            "kind": "module-viewer",
            "res_type": "tile",
            "the_content": module_code,
            "mdata": mdata,
            "resource_name": module_name,
            "read_only": True,
            "is_repository": True,

        }
        return jsonify(data)

    def repository_view_module(self, module_name):
        javascript_source = url_for('static', filename=js_source_dict["module_viewer_react"])
        user_obj = current_user
        return render_template("library/resource_viewer_react.html",
                               resource_name=module_name,
                               include_metadata=True,
                               include_right=True,
                               include_above_main_area=False,
                               read_only=True,
                               theme=user_obj.get_theme(),
                               is_repository=True,
                               develop=str(_develop),
                               css_source=css_source("module_viewer_react"),
                               javascript_source=javascript_source,
                               version_string=tstring)

    def repository_get_module_code(self, module_name):
        user_obj = repository_user
        module_code = user_obj.get_tile_module(module_name)
        return jsonify({"success": True, "the_content": module_code})
