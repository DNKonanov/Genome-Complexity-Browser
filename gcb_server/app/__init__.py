
from flask import Flask, session, redirect
from flask_cors import CORS

app = Flask(__name__, static_folder='../build/static', template_folder='../build')
CORS(app)

from app import routes

app.run()
