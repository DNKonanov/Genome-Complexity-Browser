from flask import Flask
from flask_cors import CORS
from app.gene_graph.source.compute_complexity import GenomeGraph

app = Flask(__name__)
CORS(app)



from app import routes