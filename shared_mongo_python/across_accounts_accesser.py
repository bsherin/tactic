import datetime

from communication_utils import make_jsonizable_and_compress, generic_exception_handler

class AcrossAccountsAccess:
    def copy_between_accounts(self, source_user, dest_user, res_type, new_res_name, res_name):
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
            overall_res = [coll_mdata, {"success": result["success"],
                                        "message": "Resource Successfully Copied",
                                        "alert_type": "alert-success"}]
            return overall_res

        name_field = self.get_name_field(res_type)
        old_dict = self.get_resource_doc(res_type, res_name)
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
            project_dict = source_user.read_project_dict(res_name)
            pdict = make_jsonizable_and_compress(project_dict)
            new_res_dict["file_id"] = dest_user.fs.put(pdict)

        elif "file_id" in new_res_dict:
            doc_text = source_user.fs.get(new_res_dict["file_id"]).read()
            new_res_dict["file_id"] = dest_user.fs.put(doc_text)
        new_collection_name = dest_user.resource_collection_name(res_type)
        dest_user.db[new_collection_name].insert_one(new_res_dict)
        metadata = new_res_dict["metadata"]
        overall_res = [metadata, {"success": True, "message": "Resource Successfully Copied", "alert_type": "alert-success"}]
        return overall_res