
import sys, datetime
from flask_login import login_required, current_user
from flask import jsonify, render_template, url_for, request

from tactic_app import app, db, use_ssl
import tactic_app

from resource_manager import ResourceManager
from users import User
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
        if user_obj is None:
            user_obj = current_user
        larray = [["Name", "Type", "Created", "Updated", "Tags"]]
        icon_dict = {"collection": "file-alt",
                     "project": "project-diagram",
                     "tile": "window",
                     "list": "list-alt",
                     "code": "file-code"}
        icon_template = "<span class ='fal fa-{}' data-restype='{}'></span>"
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
                    datestring, datestring_for_sort = user_obj.get_timestrings(mdata["datetime"])
                else:
                    datestring = ""
                    datestring_for_sort = ""
                if "updated" in mdata:
                    updatestring, updatestring_for_sort = user_obj.get_timestrings(mdata["updated"])
                else:
                    updatestring = datestring
                    updatestring_for_sort = datestring_for_sort
                tagstring = str(mdata["tags"])
            icon_html = icon_template.format(icon_dict[res_item[2]], res_item[2])
            larray.append([res_item[0], [icon_html, res_item[2], "center"], [datestring, datestring_for_sort],
                           [updatestring, updatestring_for_sort], tagstring])
        return larray

    def create_new_all_row(self, res_name, metadata, res_type):
        new_all_item = [res_name, metadata, res_type]
        new_all_array = self.build_resource_array([new_all_item])
        all_table_row = self.build_one_table_row(new_all_array[1])
        return all_table_row


class RepositoryAllManager(AllManager):
    rep_string = "repository-"
    is_repository = True
    button_groups = [[{"name": "copy_button", "button_class": "btn-outline-secondary",
                       "name_text": "Copy", "icon_name": "share"}]]

    def add_rules(self):
        pass
