import re
import zlib
import datetime
import copy
import os
from bson import ObjectId
from collections import OrderedDict

from communication_utils import make_jsonizable_and_compress, debinarize_python_object

class CollectionAccess(object):

    collection_name_field = "collection_name"
    collection_content_field = None
    collection_additional_mdata_fields = ["type", "number_of_docs"]

    def collection_collection_name(self, username=None):
        username = username if username else self.username
        return '{}.data_collections'.format(username)

    def get_collection_doc(self, collection_name, username=None):
        username = username if username else self.username
        doc = self.db[self.collection_collection_name(username)].find_one(
            {"collection_name": collection_name}, {"_id": 0}
        )
        return doc if doc else None

    def get_collection_doc_from_id(self, collection_id, username=None):
        username = username if username else self.username
        doc = self.db[self.collection_collection_name(username)].find_one(
            {"_id": ObjectId(collection_id)}, {"_id": 0}
        )
        return doc if doc else None

    def remove_collection(self, collection_name, username=None):
        username = username if username else self.username
        save_dict = self.get_collection_doc(collection_name)
        if "file_id" in save_dict:
            self.fs.delete(save_dict["file_id"])
        self.db[self.collection_collection_name(username)].delete_one({"collection_name": collection_name})
        return


    def delete_all_data_collections(self, username=None):
        username = username if username else self.username
        for dcol in self.collection_names(username):
            self.remove_collection(dcol)
        return

    def get_collection_metadata(self, collection_name, username=None):
        username = username if username else self.username
        doc = self.db[self.collection_collection_name(username)].find_one(
            {"collection_name": collection_name}, {"metadata": 1, "_id": 0}
        )
        return doc.get("metadata", None) if doc else None

    def get_processed_collection_metadata(self, collection_name, search_inside=False, search_string=None, username=None):
        username = username if username else self.username
        mdata = self.get_collection_metadata(collection_name, username)
        if mdata is None:
            return None
        else:
            result = self.process_metadata(mdata)
            search_context = None
            if search_inside and search_string is not None and len(search_string) > 0:
                searchable_text = self.get_collection_content(collection_name)
                if searchable_text is not None:
                    search_context = self.extract_search_context(searchable_text, search_string)
            result.update({"success": True, "res_name": collection_name})
            if search_context is not None:
                result["search_context"] = search_context
            return result

    def collection_name_exists(self, collection_name, username=None):
        username = username if username else self.username
        return self.db[self.collection_collection_name(username)].find_one(
            {"collection_name": collection_name}, {"_id": 1}
        ) is not None


    def get_doc_type(self, coll_name, username=None):
        username = username if username else self.username
        coll_mdata = self.get_collection_metadata(coll_name, username)
        if "type" in coll_mdata and coll_mdata["type"] == "freeform":
            doc_type = "freeform"
        else:
            doc_type = "table"
        return doc_type

    def collection_names(self, username=None):
        username = username if username else self.username
        names = [
            doc["collection_name"]
            for doc in self.db[self.collection_collection_name(username)].find(
                {}, {"collection_name": 1, "_id": 0}
            )
        ]
        return names

    def collection_names_with_metadata(self, username=None):
        username = username if username else self.username
        my_collection_names = []
        for doc in self.db[self.collection_collection_name(username)].find({}, {"_id": 0, "metadata": 1, "collection_name": 1}):
            if "metadata" in doc:
                my_collection_names.append([doc["collection_name"], doc["metadata"]])
            else:
                my_collection_names.append([doc["collection_name"], None])
        return sorted(my_collection_names, key=self.sort_data_list_key)

    def collection_tags_dict(self, username):
        username = username if username else self.username
        tags = {}
        for doc in self.db['{}.data_collections'.format(username)].find({}, {"_id": 0, "metadata": 1, "collection_name": 1}):
            if "metadata" in doc:
                tags[doc["collection_name"]] = doc["metadata"]["tags"]
            else:
                tags[doc["collection_name"]] = ""
        return tags

    def get_all_collection_tags(self, show_hidden=True, username=None):
        username = username if username else self.username
        res_list = self.collection_names_with_metadata(username)
        result = []
        for res_item in res_list:
            mdata = res_item[1]
            if mdata and "tags" in mdata:
                result += str(mdata["tags"].lower()).split()
        all_tags = sorted(list(set(result)))
        if not show_hidden:
            all_tags = list(filter(lambda tag: not re.search("(^|/| )hidden($|/| )", tag), all_tags))
        return all_tags

    def grab_filtered_collections(self, search_text, search_spec, columns, is_repo=False, username=None):
        username = username if username else self.username
        flist, all_tags = self.grab_filtered_resources("collection", self.collection_collection_name(username), "collection_name",
                                                        None, self.collection_additional_mdata_fields, search_text, search_spec,
                                                        columns, is_repo=is_repo)

        icon_dict = {"table": "icon:th", "freeform": "icon:align-left"}
        for val in flist:
            if "type" in val:
                val["doc_type"] = icon_dict[val["type"]]
                val["icon:th"] = icon_dict[val["type"]]
            else:
                val["doc_type"] = icon_dict["table"]
                val["icon:th"] = val["doc_type"]
            val["icon:upload"] = ""
        return flist, all_tags


    def create_complete_collection(self, new_name, doc_dict, doc_type, document_metadata=None,
                                   header_list_dict=None, collection_metadata={}, temp_data=None, username=None):
        username = username if username else self.username
        if temp_data is None and new_name in self.collection_names(username):
            raise NameExistsError("Collection name {} already exists".format(new_name))
        mdata = self.create_initial_metadata()
        mdata["number_of_docs"] = len(list(doc_dict.keys()))
        mdata["type"] = doc_type
        mdata.update(collection_metadata)
        if document_metadata is None:
            document_metadata = {}
        for fname in doc_dict.keys():
            if fname not in document_metadata:
                document_metadata[fname] = {}
        if doc_type == "table":
            if header_list_dict is None:
                header_list_dict = {}
            for fname, dlist in doc_dict.items():
                if doc_type == "table":
                    if header_list_dict is None or fname not in header_list_dict:
                        header_list_dict[fname] = list(dlist[0].keys())
            collection_dict = {"doc_dict": doc_dict,
                               "doc_mdata_dict": document_metadata,
                               "header_list_dic": header_list_dict}
        else:
            collection_dict = {"doc_dict": doc_dict,
                               "doc_mdata_dict": document_metadata}
        new_save_dict = {"metadata": mdata,
                         "collection_name": new_name}
        cdict = make_jsonizable_and_compress(collection_dict)
        new_save_dict["file_id"] = self.fs.put(cdict)
        if temp_data is not None:
            new_save_dict.update(temp_data)
            unique_id = self.store_temp_data(new_save_dict)
            return {"success": True, "message": "Collection created", "temp_id": unique_id}
        else:
            self.db[self.collection_collection_name(username)].insert_one(new_save_dict)

        if "_id" in mdata:
            del mdata["_id"]  # without this can get an error submitting the result
        return {"success": True, "message": "Collection created"}

    def create_empty_collection(self, collection_name, doc_type, csv_options=None, username=None):
        username = username if username else self.username
        collection_mdata = {}
        if csv_options is not None:
            collection_mdata["csv_options"] = csv_options
        try:
            result = self.create_complete_collection(collection_name, {},
                                                     doc_type, collection_metadata=collection_mdata)
            result["message"] = "Collection {} created".format(collection_name)
            result["success"] = True
        except Exception as ex:
            msg = self.get_traceback_message(ex, "Error creating collection")
            result = {"success": False, "message": msg}
        return result

    def rename_collection(self, old_name, new_name, username=None):
        username = username if username else self.username
        if not self.collection_name_exists(old_name, username):
            raise ValueError(f"collection with name {old_name} does not exist.")
        if self.collection_name_exists(new_name, username):
            raise ValueError(f"collection with name {new_name} already exists.")
        self.db[self.collection_collection_name(username)].update_one(
            {"collection_name": old_name},
            {"$set": {"collection_name": new_name}}
        )
        return

    def save_collection_metadata(self, collection_name, metadata, username=None):
        username = username if username else self.username
        if not self.collection_name_exists(collection_name, username):
            raise ValueError(f"collection with name {collection_name} does not exist.")
        mdata = self.get_collection_metadata(collection_name, username)
        if mdata is None:
            mdata = {}
        mdata.update(metadata)
        self.db[self.collection_collection_name(username)].update_one(
            {"collection_name": collection_name},
            {"$set": {"metadata": mdata}}
        )
        return

    def rename_tags_in_collections(self, tag_changes, username=None):
        if not tag_changes:
            return
        for doc in self.db[self.collection_collection_name(username)].find({}, {"_id": 0, "metadata": 1, "collection_name": 1}):
            mdata = doc.get("metadata", None)
            if mdata is not None and "tags" in mdata:
                taglist = mdata["tags"].split()
                for old_tag, new_tag in tag_changes:
                    if old_tag in taglist:
                        taglist.remove(old_tag)
                        if new_tag not in taglist:
                            taglist.append(new_tag)
                        self.db[self.collection_collection_name(username)].update_one(
                            {"collection_name": doc["collection_name"]},
                            {"$set": {"metadata.tags": " ".join(taglist)}}
                        )
        return

    def delete_tag_in_collections(self, tag, username=None):
        if not tag:
            return
        for doc in self.db[self.collection_collection_name(username)].find({}, {"_id": 0, "metadata": 1, "collection_name": 1}):
            mdata = doc.get("metadata", None)
            if mdata and "tags" in mdata:
                taglist = mdata["tags"].split()
                if tag in taglist:
                    taglist.remove(tag)
                    self.db[self.collection_collection_name(username)].update_one(
                        {"collection_name": doc["collection_name"]},
                        {"$set": {"metadata.tags": " ".join(taglist)}}
                    )
        return

    def append_freeform_documents(self, collection_name, file_list, username=None):
        from file_handling import read_freeform_file
        user_obj = current_user
        new_doc_dict = {}
        file_decoding_errors = OrderedDict()
        successful_reads = []
        failed_reads = OrderedDict()

        for the_file in file_list:
            filename, file_extension = os.path.splitext(the_file.filename)
            filename = filename.encode("ascii", "ignore").decode()
            (success, result_txt, encoding, decoding_problems) = read_freeform_file(the_file)
            if not success:  # then result_txt contains an error object
                e = result_txt
                failed_reads[filename] = e["message"]
                continue
            new_doc_dict[filename] = result_txt
            if len(decoding_problems) > 0:
                file_decoding_errors[filename] = decoding_problems

        for dname, doc in new_doc_dict.items():
            try:
                _ = self.append_documents_to_collection(collection_name, {dname: doc}, "freeform", username=username)
            except Exception as ex:
                msg = self.get_traceback_message(ex, "Error appending document {}".format(dname))
                failed_reads[dname] = msg
                continue
            successful_reads.append(dname)

        if len(successful_reads) == 0:
            final_success = "false"
        elif len(failed_reads.keys()) > 0:
            final_success = "partial"
        else:
            final_success = "true"

        return {"success": final_success,
                "title": "Collection {} created".format(collection_name),
                "file_decoding_errors": file_decoding_errors,
                "successful_reads": successful_reads,
                "failed_reads": failed_reads}

    def append_table_documents(self, collection_name, file_list):
        from file_handling import read_csv_file_to_list, read_txt_file_to_list, read_excel_file
        new_doc_dict = {}
        header_list_dict = {}
        file_decoding_errors = OrderedDict()
        successful_reads = []
        failed_reads = OrderedDict()
        known_extensions = [".xlsx", ".csv", ".tsv", ".txt"]
        collection_mdata = self.get_collection_metadata(collection_name)
        if "csv_options" in collection_mdata:
            csv_options = collection_mdata["csv_options"]
        else:
            csv_options = None
        for the_file in file_list:
            filename, file_extension = os.path.splitext(the_file.filename)
            filename = filename.encode("ascii", "ignore").decode()
            if file_extension not in known_extensions:
                failed_reads[filename] = "Invalid file extension " + file_extension
                continue
            decoding_problems = []
            if file_extension == ".xlsx":
                (success, doc_dict, header_dict) = read_excel_file(the_file)

                if not success:  # then doc_dict contains an error object
                    e = doc_dict
                    failed_reads[filename] = e["message"]
                    continue
                new_doc_dict.update(doc_dict)
                header_list_dict.update(header_dict)
            else:
                if file_extension in [".csv", ".tsv"]:
                    (success, row_list, header_list, encoding, decoding_problems) = \
                        read_csv_file_to_list(the_file, csv_options)
                # elif file_extension == ".tsv":
                #     (success, row_list, header_list, encoding, decoding_problems) = read_tsv_file_to_list(the_file)
                elif file_extension == ".txt":
                    (success, row_list, header_list, encoding, decoding_problems) = read_txt_file_to_list(the_file)
                else:
                    failed_reads[filename] = "unkown file extension"
                    continue

                if not success:  # then row_list contains an error object
                    e = row_list
                    failed_reads[filename] = e["message"]
                    continue
                new_doc_dict[filename] = row_list
                header_list_dict[filename] = header_list

            if len(decoding_problems) > 0:
                file_decoding_errors[filename] = decoding_problems
        for dname, doc in new_doc_dict.items():
            try:
                _ = self.append_documents_to_collection(collection_name, {dname: doc}, "table",
                                                        {dname: header_list_dict[dname]})
            except Exception as ex:
                msg = self.extract_short_error_message(ex, "Error appending document {}".format(dname))
                failed_reads[dname] = msg
                continue
            successful_reads.append(dname)

        if len(successful_reads) == 0:
            return {"success": "false",
                    "title": "Failed to read document(s)",
                    "file_decoding_errors": file_decoding_errors,
                    "successful_reads": successful_reads,
                    "failed_reads": failed_reads}

        elif len(failed_reads.keys()) > 0 or len(file_decoding_errors.keys()) > 0:
            final_success = "partial"
            title = "Error(s) reading documents"
        else:
            final_success = "true"
            title = ""

        return {"success": final_success,
                "title": title,
                "file_decoding_errors": file_decoding_errors,
                "successful_reads": successful_reads,
                "failed_reads": failed_reads}

    def append_documents_to_collection(self, collection_name, doc_dict, doc_type,
                                       header_list_dict=None, doc_mddict=None, username=None):
        username = username if username else self.username
        name_exists = collection_name in self.collection_names(username)
        if not name_exists:
            raise NonexistentNameError("Base collection name {} doesn't exists".format(collection_name))
        old_doc_dict, old_doc_mddict, old_hl_dict, old_mdata = self.get_all_collection_info(collection_name, username)

        ndoc_mddict = {}
        if doc_mddict is not None:
            for fname, doc_mdata in doc_mddict.items():
                new_mdata = {}
                for k, val in doc_mdata.items():
                    if k not in PROTECTED_METADATA_KEYS:
                        new_mdata[k] = val
                ndoc_mddict[fname] = new_mdata
        for fname, dlist in doc_dict.items():
            ufname = self.make_name_unique(fname, list(old_doc_dict.keys()))
            if doc_type == "table":
                if header_list_dict is None or fname not in header_list_dict:
                    header_list = list(dlist[0].keys())
                else:
                    header_list = header_list_dict[fname]
                ndlist = []
                for r, the_row in enumerate(dlist):
                    the_row.pop("__id__", None)
                    the_row.pop("__filename__", None)
                    the_row["__id__"] = r
                    the_row["__filename__"] = ufname
                    ndlist.append(the_row)
                if "__filename__" not in header_list:
                    header_list = ["__filename__"] + header_list
                if "__id__" not in header_list:
                    header_list = ["__id__"] + header_list
                old_hl_dict[ufname] = header_list
                old_doc_dict[ufname] = dlist
            else:
                old_doc_dict[ufname] = dlist
            if fname in ndoc_mddict:
                old_doc_mddict[ufname] = ndoc_mddict[fname]
            else:
                old_doc_mddict[ufname] = {}
        old_mdata["number_of_docs"] = len(old_doc_dict.keys())
        new_save_dict = {"metadata": self.update_metadata(old_mdata),
                         "collection_name": collection_name}
        collection_dict = {"doc_dict": old_doc_dict,
                           "doc_mdata_dict": old_doc_mddict,
                           "header_list_dic": old_hl_dict}
        cdict = make_jsonizable_and_compress(collection_dict)
        new_save_dict["file_id"] = self.fs.put(cdict)
        old_save_dict = self.db[self.collection_collection_name(username)].find_one({"collection_name": collection_name})
        self.fs.delete(old_save_dict["file_id"])
        self.db[self.collection_collection_name(username)].update_one({"collection_name": collection_name},
                                                            {'$set': new_save_dict})
        return {"success": True}


    def get_all_collection_info(self, short_collection_name, return_lists=True, temp_id=None, username=None):
        username = username if username else self.username
        if temp_id is None and short_collection_name not in self.collection_names(username):
            raise NonexistentNameError("")
        else:
            if temp_id is None:
                save_dict = self.get_collection_doc(short_collection_name, username=username)
            else:
                save_dict = self.read_temp_data(temp_id)
            collection_metadata = save_dict["metadata"]
            if "type" in collection_metadata and collection_metadata["type"] == "freeform":
                doc_type = "freeform"
            else:
                doc_type = "table"
            file_id = save_dict["file_id"]
            binarized_python_object = zlib.decompress(self.fs.get(file_id).read())
            cdict = debinarize_python_object(binarized_python_object)
            if return_lists or doc_type == "freeform":
                new_doc_dict = cdict["doc_dict"]
            else:
                new_doc_dict = {}
                for fname, dlist in cdict["doc_dict"].items():
                    ndoc = {}
                    for r in dlist:
                        ndoc[str(r["__id__"])] = r
                    new_doc_dict[fname] = ndoc
            hld = cdict["header_list_dic"] if "header_list_dic" in cdict else {}
            return new_doc_dict, cdict["doc_mdata_dict"], hld, collection_metadata