from flask import Flask, jsonify, request

app = Flask(__name__)

awaiting_pipe = False
transmitted_pipe_value = None


@app.route('/submit_response', methods=["get", "post"])
def submit_response():
    global awaiting_pipe, transmitted_pipe_value
    transmitted_pipe_value = request.json["response_data"]
    awaiting_pipe = False
    return jsonify({"success": True})
