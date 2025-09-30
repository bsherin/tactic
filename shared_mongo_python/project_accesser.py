import re
import datetime
import copy
import pickle
import zlib
from bson import ObjectId
from communication_utils import make_jsonizable_and_compress, debinarize_python_object

class ProjectAccess(object):

    project_name_field = "project_name"
    project_content_field = "searchable_text"
    project_additional_mdata_fields = ["collection_name", "loaded_tiles", "type"]

    @property
    def project_collection_name(self):
        return '{}.projects'.format(self.username)

    def get_project_doc(self, project_name):
        doc = self.db[self.project_collection_name].find_one(
            {"project_name": project_name}, {"_id": 0}
        )
        return doc if doc else None

    def get_project_doc_from_id(self, project_id):
        doc = self.db[self.project_collection_name].find_one(
            {"_id": ObjectId(project_id)}, {"_id": 0}
        )
        return doc if doc else None

    def read_project_dict(self, project_name, include_metadata=True):
        return self.read_project_dict_from_doc(self.get_project_doc(project_name), include_metadata)

    def read_project_dict_from_doc(self, doc, include_metadata=False):
        if doc is None or "file_id" not in doc:
            return None
        file_id = doc["file_id"]
        mdata = doc.get("metadata", {})
        project_dict = None
        if "save_style" in mdata:
            if mdata["save_style"] == "b64save" or mdata["save_style"] == "b64save_react":
                binarized_python_object = zlib.decompress(self.fs.get(file_id).read())
                project_dict = debinarize_python_object(binarized_python_object)
        else:  # legacy
            project_dict = pickle.loads(
                zlib.decompress(self.fs.get(file_id).read()).decode("utf-8", "ignore").encode("ascii"))
        # legacy
        if "user_id" in project_dict:
            del project_dict["user_id"]
        if include_metadata:
            project_dict["metadata"] = mdata
        return project_dict

    def remove_project(self, project_name):
        save_dict = self.get_project_doc(project_name)
        if "file_id" in save_dict:
            self.fs.delete(save_dict["file_id"])
        self.db[self.project_collection_name].delete_one({"project_name": project_name})
        return

    def delete_all_projects(self):
        for proj in self.project_names:
            self.remove_project(proj)
        return

    def get_project_content(self, project_name):
        doc = self.db[self.project_collection_name].find_one(
            {"project_name": project_name}, {"searchable_text": 1, "_id": 0}
        )
        return doc.get("searchable_text", None) if doc else None

    def get_project_metadata(self, project_name):
        doc = self.db[self.project_collection_name].find_one(
            {"project_name": project_name}, {"metadata": 1, "_id": 0}
        )
        return doc.get("metadata", None) if doc else None

    def get_processed_project_metadata(self, project_name, search_inside=False, search_string=None):
        mdata = self.get_project_metadata(project_name)
        if mdata is None:
            return None
        else:
            result = self.process_metadata(mdata)
            search_context = None
            if search_inside and search_string is not None and len(search_string) > 0:
                searchable_text = self.get_project_content(project_name)
                if searchable_text is not None:
                    search_context = self.extract_search_context(searchable_text, search_string)
            result.update({"success": True, "res_name": project_name})
            if search_context is not None:
                result["search_context"] = search_context
            return result

    def project_name_exists(self, project_name):
        return self.db[self.project_collection_name].find_one(
            {"project_name": project_name}, {"_id": 1}
        ) is not None

    def get_project_content_with_metadata(self, project_name, process_metadata=False):
        doc = self.db[self.project_collection_name].find_one(
            {"project_name": project_name}, {"_id": 0, "searchable_text": 1, "metadata": 1, "project_name": 1}
        )
        if doc is None:
            return None
        searchable_text = doc.get("searchable_text", None)
        metadata = doc.get("metadata", None)
        if process_metadata and metadata is not None:
            metadata = self.process_metadata(metadata)
        return {
            "searchable_text": searchable_text,
            "metadata": metadata,
            "project_name": project_name
        }

    @property
    def project_names(self):
        names = [
            doc["project_name"]
            for doc in self.db[self.project_collection_name].find(
                {}, {"project_name": 1, "_id": 0}
            )
        ]
        return names

    @property
    def project_names_with_metadata(self):
        my_project_names = []
        for doc in self.db[self.project_collection_name].find({}, {"_id": 0, "metadata": 1, "project_name": 1}):
            if "metadata" in doc:
                my_project_names.append([doc["project_name"], doc["metadata"]])
            else:
                my_project_names.append([doc["project_name"], None])
        return sorted(my_project_names, key=self.sort_data_list_key)

    @property
    def project_tags_dict(self):
        tags = {}
        for doc in self.db[self.project_collection_name].find({}, {"_id": 0, "metadata": 1, "project_name": 1}):
            if "metadata" in doc:
                tags[doc["project_name"]] = doc["metadata"]["tags"]
            else:
                tags[doc["project_name"]] = ""
        return tags

    def get_all_project_tags(self, show_hidden=True):
        res_list = self.project_names_with_metadata
        result = []
        for res_item in res_list:
            mdata = res_item[1]
            if mdata and "tags" in mdata:
                result += str(mdata["tags"].lower()).split()
        all_tags = sorted(list(set(result)))
        if not show_hidden:
            all_tags = list(filter(lambda tag: not re.search("(^|/| )hidden($|/| )", tag), all_tags))
        return all_tags

    def grab_filtered_projects(self, search_text, search_spec, columns, is_repo=False):
        flist, all_tags =  self.grab_filtered_resources("project", self.project_collection_name, "project_name",
                                                        "searchable_text", self.project_additional_mdata_fields, search_text, search_spec,
                                                        columns, is_repo=is_repo)
        icon_dict = {"table": "icon:projects",
                     "freeform": "icon:projects",
                     "notebook": "icon:console",
                     "none": "icon:projects",
                     "jupyter": "icon:globe-network"}
        for val in flist:
            if "type" in val:
                val["icon:th"] = icon_dict[val["type"]]
            else:
                val["icon:th"] = icon_dict["table"]
            val["icon:upload"] = ""
        return flist, all_tags

    def create_new_jupyter_project(self, jupyter_name, jupyter_text):
        mdata = self.create_initial_metadata()
        mdata["type"] = "jupyter"
        mdata["save_style"] = "b64save_react"
        save_dict = {"metadata": mdata,
                     "project_name": jupyter_name}
        project_dict = {"jupyter_text": jupyter_text}

        pdict = make_jsonizable_and_compress(project_dict)
        save_dict["file_id"] = self.fs.put(pdict)
        self.db[self.project_collection_name].insert_one(save_dict)

    def create_assistant_save(self, new_name, interface_state):
        project_dict = {"doc_type": "notebook", "project_name": new_name}
        mdata = self.create_initial_metadata()
        mdata["type"] = "notebook"
        mdata["collection_name"] = ""
        mdata["loaded_tiles"] = []
        mdata["save_style"] = "b64save_react"
        project_dict["interface_state"] = interface_state
        save_dict = {"metadata": mdata,
                     "project_name": new_name}
        pdict = make_jsonizable_and_compress(project_dict)
        save_dict["file_id"] = self.fs.put(pdict)
        self.db[self.project_collection_name].insert_one(save_dict)
        return

    @staticmethod
    def get_text_from_console_items(console_items):
        text = ""
        for citem in console_items:
            if citem["type"] == "text":
                text += citem["console_text"] + "\n"
            elif citem["type"] == "code":
                text += citem["console_text"] + "\n"
        return text

    def prepare_project_data(self, project_name, project_dict, doc_type, collection_name, interface_state,
                             mdata=None, purgetiles=False, is_new_project=True):
        if mdata is None:
            mdata = self.create_initial_metadata()
        else:
            mdata = self.update_metadata(mdata)
        mdata["type"] = doc_type
        if not self.doc_type == "notebook":
            mdata["collection_name"] = collection_name
            mdata["loaded_tiles"] = project_dict["used_tile_types"]
            mdata["type"] = doc_type
            if purgetiles:
                project_dict["loaded_modules"] = project_dict["used_modules"]
        mdata["save_style"] = "b64save_react"
        project_dict["interface_state"] = interface_state
        project_dict["project_name"] = project_name  # these are synced up

        if is_new_project:
            save_dict = {"metadata": mdata,
                         "project_name": project_name,}
        else:
            save_dict = self.db[self.project_collection_name].find_one({"project_name": project_name})
            save_dict["metadata"] = mdata
        if "console_items" in interface_state:
            save_dict["searchable_text"] = self.get_text_from_console_items(
                interface_state["console_items"])
        else:
            save_dict["searchable_text"] = ""
        return save_dict, project_dict, mdata

    def save_new_project(self, doc, project_dict):
        # This is only called in main. That means that emit_status_message is available
        # and doesn't need a user_id
        self.emit_status_message("Pickle, convert, compress")
        pdict = make_jsonizable_and_compress(project_dict)
        self.emit_status_message("Writing the data")
        doc["file_id"] = self.fs.put(pdict)
        self.db[self.project_collection_name].insert_one(doc)
        return

    def update_project(self, doc, project_dict):
        self.emit_status_message("Pickle, convert, compress")
        pdict = make_jsonizable_and_compress(project_dict)
        self.emit_status_message("Writing the data")
        old_file_id = doc.get("file_id", None)
        doc["file_id"] = self.fs.put(pdict)
        self.db[self.project_collection_name].update_one(
            {"project_name": doc["project_name"]},
            {"$set": doc}
        )
        if old_file_id is not None:
            self.fs.delete(old_file_id)
        return

    def create_duplicate_project(self, new_project_name, template_name):
        if self.project_name_exists(new_project_name):
            raise ValueError(f"project with name {new_project_name} already exists.")
        template_doc = self.get_project_doc(template_name)

        if template_doc is None:
            raise ValueError(f"Template project {template_name} does not exist.")

        mdata = copy.copy(template_doc["metadata"])
        mdata = self.update_metadata(mdata, True)
        searchable_text = template_doc["searchable_text"]
        new_save_dict = {"metadata": mdata, "searchable_text": searchable_text,
                         "project_name": new_project_name}

        # uncompressing and compressing below is necessary because we need to change the project_name inside
        # the project dict. so, essentially, the project_name is stored in two places which is non-optimal
        # tactic_todo fix project_name being stored in two places in project saves

        project_dict = self.read_project_dict_from_doc(template_doc)
        project_dict["project_name"] = new_project_name
        pdict = make_jsonizable_and_compress(project_dict)
        new_save_dict["file_id"] = self.fs.put(pdict)
        self.db[self.project_collection_name].insert_one(new_save_dict)
        return

    def rename_project(self, old_name, new_name):
        if not self.project_name_exists(old_name):
            raise ValueError(f"project with name {old_name} does not exist.")
        if self.project_name_exists(new_name):
            raise ValueError(f"project with name {new_name} already exists.")
        self.db[self.project_collection_name].update_one(
            {"project_name": old_name},
            {"$set": {"project_name": new_name}}
        )
        return

    def save_project_metadata(self, project_name, metadata):
        if not self.project_name_exists(project_name):
            raise ValueError(f"project with name {project_name} does not exist.")
        mdata = self.get_project_metadata(project_name)
        if mdata is None:
            mdata = {}
        mdata.update(metadata)
        self.db[self.project_collection_name].update_one(
            {"project_name": project_name},
            {"$set": {"metadata": mdata}}
        )
        return

    def rename_tags_in_projects(self, tag_changes):
        if not tag_changes:
            return
        for doc in self.db[self.project_collection_name].find({}, {"_id": 0, "metadata": 1, "project_name": 1}):
            mdata = doc.get("metadata", None)
            if mdata is not None and "tags" in mdata:
                taglist = mdata["tags"].split()
                for old_tag, new_tag in tag_changes:
                    if old_tag in taglist:
                        taglist.remove(old_tag)
                        if new_tag not in taglist:
                            taglist.append(new_tag)
                        self.db[self.project_collection_name].update_one(
                            {"project_name": doc["project_name"]},
                            {"$set": {"metadata.tags": " ".join(taglist)}}
                        )
        return

    def delete_tag_in_projects(self, tag):
        if not tag:
            return
        for doc in self.db[self.project_collection_name].find({}, {"_id": 0, "metadata": 1, "project_name": 1}):
            mdata = doc.get("metadata", None)
            if mdata and "tags" in mdata:
                taglist = mdata["tags"].split()
                if tag in taglist:
                    taglist.remove(tag)
                    self.db[self.project_collection_name].update_one(
                        {"project_name": doc["project_name"]},
                        {"$set": {"metadata.tags": " ".join(taglist)}}
                    )
        return