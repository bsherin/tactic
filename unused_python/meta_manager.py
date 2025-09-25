import sys
import re
import os
import io
import zlib
from collections import OrderedDict
from flask import jsonify, request, url_for, render_template, send_file
from bson import ObjectId
from flask_login import login_required, current_user
from tactic_app import app, db, fs
from qworker import task_worthy
from docker_functions import create_container, main_container_info
from resource_manager import LibraryResourceManager, repository_user
from communication_utils import make_jsonizable_and_compress, read_project_dict, debinarize_python_object
import loaded_tile_management
from mongo_accesser import make_name_unique
from redis_tools import create_ready_block

def get_updated_metadata(doc):
    if "metadata" in doc:
        mdata = doc["metadata"]
    else:
        mdata = {}
    mdata["updated"] = datetime.datetime.utcnow()
    return mdata

class MetabookManager(LibraryResourceManager):
    collection_list = "metabook_names"
    collection_list_with_metadata = "metabook_names_with_metadata"
    collection_name = "metabook_collection_name"
    name_field = "metabook_name"



class RepositoryMetabookManager(MetabookManager):
    rep_string = "repository-"
    is_repository = True

