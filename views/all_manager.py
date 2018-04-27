
import sys, datetime
from flask_login import login_required, current_user
from flask import jsonify, render_template, url_for, request

from tactic_app import app, db, use_ssl
import tactic_app

from tactic_app.resource_manager import ResourceManager
from tactic_app.users import User
global_tile_manager = tactic_app.global_tile_manager
repository_user = User.get_user_by_username("repository")


# noinspection PyMethodMayBeStatic
class AllManager(ResourceManager):
    collection_list = "list_names"
    collection_list_with_metadata = "all_names_with_metadata"
    button_groups = []

    def add_rules(self):
        pass


    def build_resource_array(self, res_list, user_obj=None):
        if user_obj == None:
            user_obj = current_user
        larray = [["Name", "Type", "Created", "Updated", "Tags"]]
        for res_item in res_list:
            mdata = res_item[1]
            if mdata is None:
                datestring = ""
                tagstring = ""
                updatestring = ""
                datestring_for_sort = ""
                updatestring_for_sort = ""
            else:
                if "datetime" in mdata:
                    localtime = user_obj.localize_time(mdata["datetime"])
                    datestring = localtime.strftime("%b %d, %Y, %H:%M")
                    datestring_for_sort = mdata["datetime"].strftime("%Y%m%d%H%M%S")
                else:
                    datestring = ""
                    datestring_for_sort = ""
                if "updated" in mdata:
                    localtime = user_obj.localize_time(mdata["updated"])
                    updatestring = localtime.strftime("%b %d, %Y, %H:%M")
                    updatestring_for_sort = mdata["updated"].strftime("%Y%m%d%H%M%S")
                else:
                    updatestring = datestring
                    updatestring_for_sort = datestring_for_sort
                tagstring = str(mdata["tags"])
            larray.append([res_item[0], res_item[2],[datestring, datestring_for_sort],
                           [updatestring, updatestring_for_sort], tagstring])
        return larray

    def create_new_all_row(self, res_name, metadata, type):
        new_all_item = [res_name, metadata, type]
        new_all_array = self.build_resource_array([new_all_item])
        all_table_row = self.build_one_table_row(new_all_array[1])
        return all_table_row

class RepositoryAllManager(AllManager):
    rep_string = "repository-"
    is_repository = True
    button_groups = [[{"name": "copy_button", "button_class": "btn-outline-secondary", "name_text": "Copy to library"}
                      ]]

    def add_rules(self):
        pass
