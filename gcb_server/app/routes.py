from app import app
from flask import jsonify

import os

from app.gene_graph.source.generate_subgraph import get_subgraph
from app.gene_graph.recombination_draw.draw_graph import get_json_graph

@app.route('/')
@app.route('/index')
def index():
    return "Hello, World!"

data_path = '/mnt/c/Users/fedor/Documents/dev/gcb/gcb_server/data/'

@app.route('/org/<organism>/strain/<ref_strain>/start/<og_start>/end/<og_end>')
def subgraph(organism, ref_strain, og_start, og_end):
    
    graph_file = data_path+organism+'/graph/paths.sif'
    input_lines = []
    with open(graph_file, 'r') as input:
        input_lines = input.readlines()
    
    subgr, freq = get_subgraph(input_lines, ref_strain, 5, og_start, og_end)
    
    # Remove last EOL and split in lines
    subgr = subgr[0:-1].split('\n')
    
    graph_json = get_json_graph(subgr, 1)

    return jsonify(graph_json)

@app.route('/org/')
def get_org_list():
    oranisms = next(os.walk(data_path))[1]

    return jsonify(oranisms)

