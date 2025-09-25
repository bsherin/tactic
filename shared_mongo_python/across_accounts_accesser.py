import datetimecurr

from communication_utils import make_jsonizable_and_compress, generic_exception_handler

class AcrossAccountsAccesser:
    def copy_between_accounts(self, source_user, dest_user, res_type, new_res_name, res_name):
        try:
            if res_type == "collection":
                coll_dict, dm_dict, hl_dict, coll_mdata = source_user.get_all_collection_info(res_name)
                if "size" in coll_mdata and coll_mdata["size"] == 0:
                    del coll_mdata["size"]
                if "type" in coll_mdata:
                    ctype = coll_mdata["type"]
                else:
                    ctype = "table"  # For old collections
                result = dest_user.create_complete_collection(new_res_name,
                                                              coll_dict,
                                                              ctype,
                                                              dm_dict,
                                                              hl_dict,
                                                              coll_mdata)
                overall_res = [coll_mdata, jsonify({"success": result["success"],
                                                    "message": "Resource Successfully Copied",
                                                    "alert_type": "alert-success"})]
                return overall_res

            name_field = name_keys[res_type]
            collection_name = source_user.resource_collection_name(res_type)
            old_dict = source_user.db[collection_name].find_one({name_field: res_name})
            new_res_dict = {name_field: new_res_name}
            for (key, val) in old_dict.items():
                if (key == "_id") or (key == name_field):
                    continue
                new_res_dict[key] = val
            if "metadata" not in new_res_dict:
                mdata = {"datetime": datetime.datetime.utcnow(),
                         "updated": datetime.datetime.utcnow(),
                         "tags": "",
                         "notes": ""}
                new_res_dict["metadata"] = mdata
            if res_type == "project":
                project_dict = source_user.read_project_dict(self, new_res_dict["metadata"], old_dict["file_id"])
                pdict = make_jsonizable_and_compress(project_dict)
                new_res_dict["file_id"] = dest_user.fs.put(pdict)


            elif "file_id" in new_res_dict:
                doc_text = source_user.fs.get(new_res_dict["file_id"]).read()
                new_res_dict["file_id"] = dest_user.fs.put(doc_text)
            new_collection_name = dest_user.resource_collection_name(res_type)
            dest_user.db[new_collection_name].insert_one(new_res_dict)
            metadata = new_res_dict["metadata"]
            overall_res = [metadata, jsonify(
                {"success": True, "message": "Resource Successfully Copied", "alert_type": "alert-success"})]
            return overall_res
        except Exception as ex:
            overall_res = [None, generic_exception_handler.get_traceback_exception_for_ajax(ex, "Error copying resource")]
            return overall_res