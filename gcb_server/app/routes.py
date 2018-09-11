from app import app
from flask import jsonify, session
from app.manage_db import get_complexity_from_db
import os
from gene_graph_lib.compute_complexity import GenomeGraph
from gene_graph_lib.generate_subgraph import get_subgraph
from gene_graph_lib.draw_graph import get_json_graph
import sqlite3

@app.route('/')
@app.route('/index')
def index():
    return "Hello, World!"

data_path = '/mnt/c/Users/fedor/Documents/dev/gcb/gcb_server/data/'

@app.route('/org/<organism>/strain/<ref_strain>/start/<og_start>/end/<og_end>/window/<window>/tails/<tails>/pars/<pars>/')
def subgraph(organism, ref_strain, window, og_start, og_end, tails, pars):

    print(pars)
    if int(pars) == 0:
        paths = 'paths.sif'
    else:
        paths = 'paths_pars.sif'
    graph = GenomeGraph(name='new')
    graph_file = data_path+organism+'/graph/' + paths
    try:
        if graph.name == organism:
            print('in memory')
            subgr, freq = get_subgraph(graph, organism, ref_strain, window=int(window), start=og_start, end=og_end, tails=int(tails))
        else:
            print('not in memory')
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
    global org
    oranisms = next(os.walk(data_path))[1]
    org = oranisms[0]
    return jsonify(oranisms)


@app.route('/org/<org>/stamms/')
def get_stamm_list(org):
    connect = sqlite3.connect(data_path + org + '/' + org + '.db')
    c = connect.cursor()
    
    stamms = [row for row in c.execute('SELECT stamm FROM stamms_table')]
    stamms.sort()
    print(org)
    connect.close()
    return jsonify(stamms)

@app.route('/org/<org>/stamms/<stamm>/contigs/')
def get_contig_list(org, stamm):
    connect = sqlite3.connect(data_path + org + '/' + org + '.db')
    c = connect.cursor()
    stamm_key = [row for row in c.execute('SELECT id FROM stamms_table WHERE stamm = "' + stamm + '"')][0][0]
    contigs = [row for row in c.execute('SELECT contig FROM contigs_table WHERE stamm_key = ' + str(stamm_key))]
    contigs.sort()
    connect.close()
    return jsonify(contigs)

@app.route('/org/<org>/stamms/<stamm>/contigs/<contig>/complexity/')
def get_complexity(org, stamm, contig):
    complexity = get_complexity_from_db(data_path, org, stamm, contig, 'win_var')
    return jsonify(complexity)
