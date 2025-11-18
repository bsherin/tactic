import re
import datetime
import copy
from bson import ObjectId

from communication_utils import generic_exception_handler

default_tile_icons = {
    "standard": "application",
    "matplotlib": "timeline-line-chart",
    "d3": "code",
    "js": "code"
}

class TileAccess(object):

    tile_name_field = "tile_module_name"
    tile_content_field = "tile_module"
    tile_additional_mdata_fields = None

    def tile_collection_name(self, username=None):
        if username is None:
            username = self.username
        return '{}.tiles'.format(username)

    def get_tile_doc(self, tile_module_name, username=None):
        doc = self.db[self.get_tile_collection_name(username)].find_one(
            {"tile_module_name": tile_module_name}, {"_id": 0}
        )
        return doc if doc else None

    def get_tile_collection_name(self, username=None):
        return self.tile_collection_name(username)

    def get_tile_doc_from_id(self, tile_id):
        doc = self.db[self.tile_collection_name()].find_one(
            {"_id": ObjectId(tile_id)}, {"_id": 0}
        )
        return doc if doc else None

    def get_tile_id(self, tile_module_name):
        doc = self.db[self.tile_collection_name()].find_one(
            {"tile_module_name": tile_module_name}, {"_id": 1}
        )
        return str(doc["_id"]) if doc else None

    def get_tile_last_saved(self, tile_module_name):
        doc = self.get_tile_doc(tile_module_name)
        return doc.get("last_saved", "creator") if doc else None

    def remove_tile(self, tile_module_name):
        self.db[self.tile_collection_name()].delete_one(
            {"tile_module_name": tile_module_name}
        )
        return

    def get_tile_content(self, tile_module_name):
        doc = self.db[self.tile_collection_name()].find_one(
            {"tile_module_name": tile_module_name}, {"tile_module": 1, "_id": 0}
        )
        return doc.get("tile_module", None) if doc else None

    def get_tile_metadata(self, tile_module_name, username=None):
        doc = self.db[self.get_tile_collection_name(username)].find_one(
            {"tile_module_name": tile_module_name}, {"metadata": 1, "_id": 0}
        )
        mdata = doc.get("metadata", None) if doc else None
        if mdata is not None:
            mdata["icon"] = self.get_tile_icon_from_mdata(mdata)
            if "category" not in mdata:
                mdata["category"] = "nocat"
        return mdata

    # This used to use loaded_tile_management to get the
    def get_tile_icon(self, tile_module_name):
        mdata = self.get_tile_metadata(tile_module_name)
        return self.get_tile_icon_from_mdata(mdata)

    def get_tile_icon_from_mdata(self, mdata):
        tag_match_dict = {
            "cluster": "group-objects",
            "classify": "label",
            "network": "layout",
            "utility": "cog"
        }
        if mdata is not None:
            if "icon" in mdata:
                return mdata["icon"]
            if "tags" in mdata:
                for tagstr, icon in tag_match_dict.items():
                    if tagstr in mdata["tags"]:
                        return icon
            if "type" in mdata and mdata["type"] in ["matplotlib", "d3", "js"]:
                return default_tile_icons[mdata["type"]]
        return default_tile_icons["standard"]

    def get_processed_tile_metadata(self, tile_module_name, search_inside=False, search_string=None):
        mdata = self.get_tile_metadata(tile_module_name)
        if mdata is None:
            return None
        else:
            result = self.process_metadata(mdata)
            search_context = None
            if search_inside and search_string is not None and len(search_string) > 0:
                searchable_text = self.get_tile_content(tile_module_name)
                if searchable_text is not None:
                    search_context = self.extract_search_context(searchable_text, search_string)
            result.update({"success": True, "res_name": tile_module_name})
            if search_context is not None:
                result["search_context"] = search_context
            return result

    def tile_module_name_exists(self, tile_module_name, username=None):
        return self.db[self.get_tile_collection_name(username)].find_one(
            {"tile_module_name": tile_module_name}, {"_id": 1}
        ) is not None

    def get_tile_content_with_metadata(self, tile_module_name, process_metadata=False, username=None):
        doc = self.db[self.get_tile_collection_name(username)].find_one(
            {"tile_module_name": tile_module_name}, {"_id": 0, "tile_module": 1, "metadata": 1, "tile_module_name": 1}
        )
        if doc is None:
            return None
        tile_module = doc.get("tile_module", None)
        metadata = doc.get("metadata", None)
        if process_metadata and metadata is not None:
            metadata = self.process_metadata(metadata)
        return {
            "tile_module": tile_module,
            "metadata": metadata,
            "tile_module_name": tile_module_name
        }

    @property
    def tile_names(self):
        return self.tile_module_names

    @property
    def tile_module_names(self):
        names = [
            doc["tile_module_name"]
            for doc in self.db[self.tile_collection_name()].find(
                {}, {"tile_module_name": 1, "_id": 0}
            )
        ]
        return names

    @property
    def tile_module_names_with_metadata(self):
        my_tile_module_names = []
        for doc in self.db[self.tile_collection_name()].find({}, {"_id": 0, "metadata": 1, "tile_module_name": 1}):
            if "metadata" in doc:
                my_tile_module_names.append([doc["tile_module_name"], doc["metadata"]])
            else:
                my_tile_module_names.append([doc["tile_module_name"], None])
        return sorted(my_tile_module_names, key=self.sort_data_list_key)

    @property
    def tile_tags_dict(self):
        tags = {}
        for doc in self.db[self.tile_collection_name()].find({}, {"_id": 0, "metadata": 1, "tile_module_name": 1}):
            if "metadata" in doc:
                tags[doc["tile_module_name"]] = doc["metadata"]["tags"]
            else:
                tags[doc["tile_module_name"]] = ""
        return tags

    def get_all_tile_tags(self, show_hidden=True):
        res_list = self.tile_module_names_with_metadata
        result = []
        for res_item in res_list:
            mdata = res_item[1]
            if mdata and "tags" in mdata:
                result += str(mdata["tags"].lower()).split()
        all_tags = sorted(list(set(result)))
        if not show_hidden:
            all_tags = list(filter(lambda tag: not re.search("(^|/| )hidden($|/| )", tag), all_tags))
        return all_tags

    def grab_filtered_tiles(self, search_text, search_spec, columns, is_repo=False):
        from loaded_tile_management import loaded_tile_manager
        flist, all_tags = self.grab_filtered_resources("tile", self.tile_collection_name(), "tile_module_name",
                                                        "tile_module", self.tile_additional_mdata_fields, search_text, search_spec,
                                                         columns, is_repo=is_repo)
        if not is_repo:
            failed_loads = set(loaded_tile_manager.get_failed_loads_list(self.username))
            successful_loads = set(loaded_tile_manager.get_loaded_user_modules(self.username))
        else:
            failed_loads = []
            successful_loads = []
        for val in flist:
            if val["name"] in failed_loads:
                val["icon:upload"] = "icon:error"
            elif val["name"] in successful_loads:
                val["icon:upload"] = "icon:upload"
            else:
                val["icon:upload"] = ""
            if "icon" in val:
                val["icon:th"] = f"icon:{val['icon']}"
            elif "type" in val and val["type"] in type_dict:
                val["icon:th"] = type_dict[val["type"]]
            else:
                val["icon:th"] = type_dict["standard"]
            val["size"] = ""
        return flist, all_tags

    def create_tile(self, tile_module_name, template_name=None):
        if self.tile_module_name_exists(tile_module_name):
            raise ValueError(f"tile with name {tile_module_name} already exists.")
        if template_name is not None:
            template_data = self.get_tile_content_with_metadata(template_name)
            if template_data is None:
                raise ValueError(f"Template tile {template_name} does not exist.")
            metadata = copy.copy(template_data["metadata"])
            metadata = self.update_metadata(metadata, True)
            tile_module = template_data["tile_module"]
        else:
            metadata = self.create_initial_metadata()
            tile_module = []
        self.db[self.tile_collection_name()].insert_one({
            "tile_module_name": tile_module_name,
            "tile_module": tile_module,
            "metadata": metadata})
        return

    def create_tile_from_data(self, tile_module_name, tile_module, metadata=None):
        if self.tile_module_name_exists(tile_module_name):
            raise ValueError(f"tile with name {tile_module_name} already exists.")
        if metadata is None:
            metadata = self.create_initial_metadata()
        else:
            metadata = self.update_metadata(metadata, True)
        self.db[self.tile_collection_name()].insert_one({
            "tile_module_name": tile_module_name,
            "tile_module": tile_module,
            "metadata": metadata})
        return

    def create_tile_from_doc(self, tile_module_name, doc, last_saved="creator"):
        if self.tile_module_name_exists(tile_module_name):
            raise ValueError(f"tile with name {tile_module_name} already exists.")
        metadata = copy.copy(doc["metadata"])
        metadata = self.update_metadata(metadata, True)
        tile_module = doc["tile_module"]

        self.db[self.tile_collection_name()].insert_one({
            "tile_module_name": tile_module_name,
            "tile_module": tile_module,
            "last_saved": last_saved,
            "metadata": metadata})
        return


    def update_tile(self, tile_module_name, new_tile_code, last_saved=None, metadata=None, username=None):
        new_metadata = self.get_tile_metadata(tile_module_name, username=username)

        if new_metadata is None:
            new_metadata  = {}
        if metadata:
            new_metadata.update(metadata)
        new_metadata = self.update_metadata(new_metadata)
        if "additional_mdata" in new_metadata:
            del new_metadata["additional_mdata"]
        update_dict = {"tile_module": new_tile_code,
                      "metadata": new_metadata}
        if last_saved is not None:
            update_dict["last_saved"] = last_saved
        self.db[self.get_tile_collection_name(username)].update_one(
            {"tile_module_name": tile_module_name},
            {"$set": update_dict}
        )
        return

    def update_tile_from_doc(self, tile_module_name, doc, last_saved=None):
        if not self.tile_module_name_exists(tile_module_name):
            raise ValueError(f"tile with name {tile_module_name} does not exist.")
        metadata = self.get_tile_metadata(tile_module_name)
        if "metadata" in doc:
            metadata.update(doc["metadata"])
        metadata = self.update_metadata(metadata)
        if last_saved is not None:
            update_dict["last_saved"] = last_saved
        doc["metadata"] = metadata
        self.db[self.tile_collection_name()].update_one(
            {"tile_module_name": tile_module_name},
            {"$set": doc}
        )
        return

    def create_recent_checkpoint(self, module_name, username=None):
        try:
            doc = self.get_tile_doc(module_name, username)
            recent_history = doc.get("recent_history", [])
            recent_history.append({"updated": doc["metadata"]["updated"],
                                   "tile_module": doc["tile_module"]})
            self.db[self.get_tile_collection_name(username)].update_one({"tile_module_name": module_name},
                                                          {'$set': {"recent_history": recent_history}})
            return
        except Exception as ex:
            msg = generic_exception_handler.get_traceback_message(ex, "Error checkpointing module to recent")
            raise Exception(msg)

    def rename_tile(self, old_name, new_name):
        if not self.tile_module_name_exists(old_name):
            raise ValueError(f"tile with name {old_name} does not exist.")
        if self.tile_module_name_exists(new_name):
            raise ValueError(f"tile with name {new_name} already exists.")
        self.db[self.tile_collection_name()].update_one(
            {"tile_module_name": old_name},
            {"$set": {"tile_module_name": new_name}}
        )
        return

    def save_tile_metadata(self, tile_module_name, metadata, username=None):
        if not self.tile_module_name_exists(tile_module_name, username=username):
            raise ValueError(f"tile with name {tile_module_name} does not exist.")
        mdata = self.get_tile_metadata(tile_module_name, username=username)
        if mdata is None:
            mdata = {}
        mdata.update(metadata)
        if "additional_mdata" in mdata:
            del mdata["additional_mdata"]
        self.db[self.tile_collection_name(username)].update_one(
            {"tile_module_name": tile_module_name},
            {"$set": {"metadata": mdata}}
        )
        return

    def rename_tags_in_tiles(self, tag_changes):
        if not tag_changes:
            return
        for doc in self.db[self.tile_collection_name()].find({}, {"_id": 0, "metadata": 1, "tile_module_name": 1}):
            mdata = doc.get("metadata", None)
            if mdata is not None and "tags" in mdata:
                taglist = mdata["tags"].split()
                for old_tag, new_tag in tag_changes:
                    if old_tag in taglist:
                        taglist.remove(old_tag)
                        if new_tag not in taglist:
                            taglist.append(new_tag)
                        self.db[self.tile_collection_name()].update_one(
                            {"tile_module_name": doc["tile_module_name"]},
                            {"$set": {"metadata.tags": " ".join(taglist)}}
                        )
        return

    def delete_tag_in_tiles(self, tag):
        if not tag:
            return
        for doc in self.db[self.tile_collection_name()].find({}, {"_id": 0, "metadata": 1, "tile_module_name": 1}):
            mdata = doc.get("metadata", None)
            if mdata and "tags" in mdata:
                taglist = mdata["tags"].split()
                if tag in taglist:
                    taglist.remove(tag)
                    self.db[self.tile_collection_name()].update_one(
                        {"tile_module_name": doc["tile_module_name"]},
                        {"$set": {"metadata.tags": " ".join(taglist)}}
                    )
        return

    def set_recent_history(self, module_name, recent_history):
        self.db[self.tile_collection_name()].update_one({"tile_module_name": module_name},
                                                      {'$set': {"recent_history": recent_history}})

    def clear_old_recent_history(self, module_name):
        tile_dict = self.get_tile_doc(module_name)
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
        self.set_recent_history(module_name, recent_history)

    def get_checkpoint_history(self, module_name, include_code=False):
        tile_dict = self.get_tile_doc(module_name)
        checkpoints = []
        history_list = []
        if "history" in tile_dict:
            history = tile_dict["history"]
            for cp in history:
                history_list.append(cp["updated"])
                updatestring, updatestring_for_sort = self.get_timestrings(cp["updated"])
                if include_code:
                    checkpoints.append({"updatestring": updatestring,
                                        "updatestring_for_sort": updatestring_for_sort,
                                        "tile_module": cp["tile_module"]})
                else:
                    checkpoints.append({"updatestring": updatestring,
                                        "updatestring_for_sort": updatestring_for_sort})
        if "recent_history" in tile_dict:
            recent_history = tile_dict["recent_history"]
            for cp in recent_history:
                if cp["updated"] not in history_list:
                    updatestring, updatestring_for_sort = self.get_timestrings(cp["updated"])
                    if include_code:
                        checkpoints.append({"updatestring": updatestring,
                                            "updatestring_for_sort": updatestring_for_sort,
                                            "tile_module": cp["tile_module"]})
                    else:
                        checkpoints.append({"updatestring": updatestring,
                                            "updatestring_for_sort": updatestring_for_sort})

        checkpoints.sort(key=lambda x: x["updatestring_for_sort"])
        checkpoints.reverse()
        return checkpoints