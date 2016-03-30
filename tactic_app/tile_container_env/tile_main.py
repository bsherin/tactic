from flask import Flask
# from tile_base import TileBase

app = Flask(__name__)

@app.route('/')
def hello():
    return 'This is the provider communicating'

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)