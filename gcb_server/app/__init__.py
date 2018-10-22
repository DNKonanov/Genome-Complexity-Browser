from flask import Flask, session, redirect
from flask_cors import CORS
from gene_graph_lib.compute_complexity import GenomeGraph

app = Flask(__name__)
CORS(app)

from app import routes
