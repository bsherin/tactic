__author__ = 'bls910'
from tactic_app import app
from flask import render_template

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')