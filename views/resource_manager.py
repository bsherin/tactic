from flask import render_template
from flask_login import current_user
import traceback

import tactic_app
from tactic_app import socketio
from tactic_app.users import User

repository_user = User.get_user_by_username("repository")


def doflash(message, alert_type='alert-info', user_id=None):
    if user_id is None:
        user_id = current_user.get_id()
    data = {"message": message, "alert_type": alert_type}
    socketio.emit('stop-spinner', data, namespace='/user_manage', room=user_id)


# noinspection PyMethodMayBeStatic
class ResourceManager(object):
    is_repository = False
    rep_string = ""
    collection_list = ""
    collection_list_with_metadata = ""
    collection_name = ""
    name_field = ""

    def __init__(self, res_type):
        self.res_type = res_type
        if self.is_repository:
            self.module_id = "repository_" + self.res_type + "_module"
        else:
            self.module_id = self.res_type + "_module"
        self.add_rules()
        self.tag_list = []

    def handle_exception(self, ex, special_string=None):
        if special_string is None:
            template = "An exception of type {0} occured. Arguments:\n{1!r}\n"
        else:
            template = special_string + "\n" + "An exception of type {0} occurred. Arguments:\n{1!r}\n"
        error_string = template.format(type(ex).__name__, ex.args)
        error_string += traceback.format_exc()
        doflash("error_string", alert_type="alert-warning")
        return

    def add_rules(self):
        print "not implemented"

    def update_selector_list(self, select=None, user_obj=None):
        if user_obj is None:
            user_obj = current_user

        if self.is_repository:
            socketio.emit('update-selector-list',
                          {"html": self.request_update_selector_list(user_obj=repository_user),
                           "select": None,
                           "module_id": self.module_id,
                           "res_type": self.res_type},
                          namespace='/user_manage', room=user_obj.get_id())
        elif select is None:
            socketio.emit('update-selector-list',
                          {"html": self.request_update_selector_list(user_obj=user_obj),
                           "select": None,
                           "module_id": self.module_id,
                           "res_type": self.res_type},
                          namespace='/user_manage', room=user_obj.get_id())
        else:
            socketio.emit('update-selector-list',
                          {"html": self.request_update_selector_list(user_obj=user_obj),
                           "select": select,
                           "module_id": self.module_id,
                           "res_type": self.res_type},
                          namespace='/user_manage', room=user_obj.get_id())

    def get_resource_list(self):
        if self.is_repository:
            user_obj = repository_user
        else:
            user_obj = current_user
        return getattr(user_obj, self.collection_list)

    def get_resource_list_with_metadata(self, user_obj=None):
        if user_obj is None:
            if self.is_repository:
                user_obj = repository_user
            else:
                user_obj = current_user
        return getattr(user_obj, self.collection_list_with_metadata)

    def get_tag_list(self, user_obj=None):
        res_list = self.get_resource_list_with_metadata(user_obj)
        result = []
        for res_item in res_list:
            mdata = res_item[1]
            if mdata and "tags" in mdata:
                result += str(mdata["tags"].lower()).split()
        return sorted(list(set(result)))

    def request_update_tag_list(self, user_obj=None):
        self.tag_list = self.get_tag_list(user_obj)
        result = "<div class='tag-button-list'>" + self.create_button_list(self.tag_list) + "</div>"
        return result

    def create_button_list(self, the_list):
        the_html = render_template("user_manage/button_list_template.html",
                                   button_list=the_list, res_type=self.res_type)
        return the_html

    def request_update_selector_list(self, user_obj=None):
        res_list_with_metadata = self.get_resource_list_with_metadata(user_obj)
        res_array = self.build_resource_array(res_list_with_metadata)
        result = self.build_html_table_from_data_list(res_array)
        return result

    def show_um_message(self, message, user_manage_id, timeout=3):
        data = {"message": message, "timeout": timeout}

        socketio.emit('show-status-msg', data, namespace='/user_manage', room=user_manage_id)

    def clear_um_message(self, user_manage_id):
        socketio.emit('clear-status-msg', {}, namespace='/user_manage', room=user_manage_id)

    def build_html_table_from_data_list(self, data_list, title=None):
        the_html = "<table class='tile-table table sortable table-striped table-bordered table-condensed'>"
        if title is not None:
            the_html += "<caption>{0}</caption>".format(title)
        the_html += "<thead><tr>"
        for c in data_list[0]:
            the_html += "<th>{0}</th>".format(c)
        the_html += "</tr><tbody>"
        for r in data_list[1:]:
            the_html += "<tr class='selector-button' value='{1}' >".format(self.res_type, r[0])
            for c in r:
                if isinstance(c, list):
                    the_html += "<td sorttable_customkey='{0}'>{1}</td>".format(c[1], c[0])
                else:
                    the_html += "<td>{0}</td>".format(c)
            the_html += "</tr>"

        the_html += "</tbody></table>"
        return the_html

    def build_resource_array(self, res_list):
        larray = [["Name", "Created", "Updated", "Tags"]]
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
                    datestring = mdata["datetime"].strftime("%b %d, %Y, %H:%M")
                    datestring_for_sort = mdata["datetime"].strftime("%Y%m%d%H%M%S")
                else:
                    datestring = ""
                    datestring_for_sort = ""
                if "updated" in mdata:
                    updatestring = mdata["updated"].strftime("%b %d, %Y, %H:%M")
                    updatestring_for_sort = mdata["updated"].strftime("%Y%m%d%H%M%S")
                else:
                    updatestring = datestring
                    updatestring_for_sort = datestring_for_sort
                tagstring = str(mdata["tags"])
            larray.append([res_item[0], [datestring, datestring_for_sort],
                           [updatestring, updatestring_for_sort], tagstring])
        return larray

class UserManageResourceManager(ResourceManager):

    def __init__(self, res_type, all_manager):
        ResourceManager.__init__(self, res_type)
        self.all_manager = all_manager

    def update_selector_list(self, select=None, user_obj=None):
        if user_obj is None:
            user_obj = current_user

        if self.is_repository:
            socketio.emit('update-selector-list',
                          {"html": self.request_update_selector_list(user_obj=repository_user),
                           "select": None,
                           "module_id": self.module_id,
                           "res_type": self.res_type},
                          namespace='/user_manage', room=user_obj.get_id())
        elif select is None:
            socketio.emit('update-selector-list',
                          {"html": self.request_update_selector_list(user_obj=user_obj),
                           "select": None,
                           "module_id": self.module_id,
                           "res_type": self.res_type},
                          namespace='/user_manage', room=user_obj.get_id())
        else:
            socketio.emit('update-selector-list',
                          {"html": self.request_update_selector_list(user_obj=user_obj),
                           "select": select,
                           "module_id": self.module_id,
                           "res_type": self.res_type},
                          namespace='/user_manage', room=user_obj.get_id())
        self.all_manager.update_selector_list(select, user_obj)