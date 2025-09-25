
import re
import os
from datetime import datetime
from flask import jsonify, request
from flask_login import login_required, current_user
from tactic_app import app  # create_megaplex
from users import User

admin_user = User.get_user_by_username("admin")
LIBRARY_CHUNK_SIZE = int(int(os.environ.get("LIBRARY_CHUNK_SIZE")) / 2)

import loaded_tile_management

base_user_image_names = ["bsherin/tactic-tile", "bsherin/tactic-main", "bsherin/tactic-module-viewer"]

class ContainerManager(ResourceManager):

    def add_rules(self):
        app.add_url_rule('/container_logs/<cont_id>', "container_logs",
                         login_required(self.container_logs), methods=['get', 'post'])
        app.add_url_rule('/grab_container_list_chunk', "grab_container_list_chunk",
                         login_required(self.grab_container_list_chunk), methods=['get', 'post'])



