from flask import Flask, jsonify, request
import sys
from tile_env import exec_tile_code, tile_class, tile_name

app = Flask(__name__)


@app.route('/')
def hello():
    return 'This is the provider communicating'


@app.route('/load_source', methods=["get", "post"])
def load_source():
    app.logger.debug("entering load_source")
    data_dict = request.json
    # app.logger.debug("data_dict is " + str(data_dict))
    tile_code = data_dict["tile_code"]
    result = exec_tile_code(tile_code)
    return jsonify(result)


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)