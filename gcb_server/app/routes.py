from app import app
from flask import jsonify

import os
from gene_graph_lib.compute_complexity import GenomeGraph
from gene_graph_lib.generate_subgraph import get_subgraph
from gene_graph_lib.draw_graph import get_json_graph

@app.route('/')
@app.route('/index')
def index():
    return "Hello, World!"

global graph
graph = GenomeGraph('new')
data_path = '/home/dmitry/projects/Genome-Complexity-Browser-master/gcb_server/data/'

@app.route('/org/<organism>/strain/<ref_strain>/start/<og_start>/end/<og_end>/window/<window>/tails/<tails>/')
def subgraph(organism, ref_strain, window, og_start, og_end, tails):
    
    graph_file = data_path+organism+'/graph/paths.sif'
    try:
        if graph.name == organism:
            print('in memory')
            subgr, freq = get_subgraph(graph, organism, ref_strain, window=int(window), start=og_start, end=og_end, tails=int(tails))
        else:
            subgr, freq = get_subgraph(graph_file, organism, ref_strain, window=int(window), start=og_start, end=og_end, tails=int(tails))
    except:
        print('not in memory')
        subgr, freq = get_subgraph(graph_file, organism, ref_strain, window=int(window), start=og_start, end=og_end, tails=int(tails))
    
    # Remove last EOL and split in lines
    subgr = subgr[0:-1].split('\n')
    
    graph_json = get_json_graph(subgr, 1)

    return jsonify(graph_json)

@app.route('/org/')
def get_org_list():
    oranisms = next(os.walk(data_path))[1]

    return jsonify(oranisms)


