import re
import datetime
import copy
import uuid
from bson import ObjectId
from utils import utcnow

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
            if "couple_save_attrs_and_exports" not in mdata:
                mdata["couple_save_attrs_and_exports"] = True
        return mdata

    # This used to use loaded_tile_management to get the
    def get_tile_icon(self, tile_module_name):
        mdata = self.get_tile_metadata(tile_module_name)
        return self.get_tile_icon_from_mdata(mdata)

    @staticmethod
    def get_tile_icon_from_mdata(mdata):
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
        res_list = self.tile_module_names_with_metadata()
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
        doc = self.get_tile_doc(module_name, username)
        checkpoint = self.build_history_entry(doc)
        self.db[self.get_tile_collection_name(username)].update_one(
            {"tile_module_name": module_name},
            {"$push": {"recent_history": checkpoint}}
        )

    @staticmethod
    def build_history_entry(doc, message=None, is_checkpoint=False):
        """Build a history record without changing the saved tile document.

        ``metadata`` and the checkpoint fields are optional additions to the
        historical schema, so existing history records remain readable.
        """
        checkpoint = {
            "history_id": str(uuid.uuid4()),
            "updated": doc["metadata"]["updated"],
            "tile_module": copy.deepcopy(doc["tile_module"]),
            "metadata": copy.deepcopy(doc["metadata"]),
        }
        if is_checkpoint:
            checkpoint["is_checkpoint"] = True
            checkpoint["message"] = message or ""
        return checkpoint

    def create_checkpoint(self, module_name, message=None, username=None):
        doc = self.get_tile_doc(module_name, username)
        if doc is None:
            return False
        checkpoint = self.build_history_entry(doc, message=message, is_checkpoint=True)
        self.db[self.get_tile_collection_name(username)].update_one(
            {"tile_module_name": module_name},
            {"$push": {"history": checkpoint}}
        )
        return True

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

    @staticmethod
    def prune_recent_history(history_entries, now=None):
        """Apply the rolling autosave policy while retaining protected entries."""
        recent_history = []
        history_by_old_date = {}
        now = now or utcnow()
        yesterday = now - datetime.timedelta(days=1)
        yesterday_date = yesterday.date()
        # We want to keep every element of the recent history from yesterday or today
        # Plus the last entry from each older date. Explicit checkpoints are
        # protected even if one is ever stored in recent_history.
        for cp in history_entries:
            updated = cp.get("updated")
            if cp.get("is_checkpoint") or not isinstance(updated, datetime.datetime):
                recent_history.append(cp)
                continue
            cp_date = updated.date()
            if cp_date >= yesterday_date:
                recent_history.append(cp)
                continue
            previous = history_by_old_date.get(cp_date)
            if previous is None or updated > previous["updated"]:
                history_by_old_date[cp_date] = cp
        recent_history.extend(history_by_old_date.values())
        recent_history.sort(key=lambda x: (
            x.get("updated").strftime("%Y%m%d%H%M%S%f")
            if isinstance(x.get("updated"), datetime.datetime) else ""
        ))
        return recent_history

    def clear_old_recent_history(self, module_name):
        tile_dict = self.get_tile_doc(module_name)
        if not tile_dict or "recent_history" not in tile_dict:
            return
        recent_history = self.prune_recent_history(tile_dict["recent_history"])
        self.set_recent_history(module_name, recent_history)

    def get_checkpoint_history(self, module_name, include_code=False):
        tile_dict = self.get_tile_doc(module_name)
        checkpoints = []
        history_list = []
        if tile_dict is None:
            return checkpoints

        def append_checkpoint(cp, is_checkpoint, source, source_index):
            updatestring, updatestring_for_sort = self.get_timestrings(cp["updated"])
            fractional_seconds = cp["updated"].strftime("%f").rstrip("0")
            updatestring_detailed = f'{updatestring}:{cp["updated"].strftime("%S")}'
            if fractional_seconds:
                updatestring_detailed += f".{fractional_seconds}"
            result = {
                "updatestring": updatestring,
                "updatestring_detailed": updatestring_detailed,
                "updatestring_for_sort": updatestring_for_sort,
                "checkpoint_id": cp.get(
                    "history_id", f'{source}:{source_index}:{cp["updated"].isoformat()}'
                ),
                "message": cp.get("message", ""),
                "is_checkpoint": cp.get("is_checkpoint", is_checkpoint),
            }
            if include_code:
                result["tile_module"] = cp["tile_module"]
                result["metadata_available"] = cp.get("metadata") is not None
                if result["metadata_available"]:
                    result["metadata"] = self.simple_process_metadata(copy.deepcopy(cp["metadata"]))
            checkpoints.append(result)

        if "history" in tile_dict:
            history = tile_dict["history"]
            for index, cp in enumerate(history):
                history_list.append(cp["updated"])
                append_checkpoint(cp, True, "history", index)
        if "recent_history" in tile_dict:
            recent_history = tile_dict["recent_history"]
            for index, cp in enumerate(recent_history):
                if cp["updated"] not in history_list:
                    append_checkpoint(cp, False, "recent", index)

        checkpoints.sort(key=lambda x: x["updatestring_for_sort"])
        checkpoints.reverse()
        return checkpoints
