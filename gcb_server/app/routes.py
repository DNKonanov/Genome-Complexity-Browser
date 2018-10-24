from app import app
from flask import jsonify, session
from app.manage_db import get_complexity_from_db, get_coordinates_from_db, get_operons
import os
import math
import matplotlib.pyplot as plt
from gene_graph_lib.compute_complexity import GenomeGraph
from gene_graph_lib.generate_subgraph import get_subgraph
from gene_graph_lib.draw_graph import get_json_graph
import sqlite3


@app.route('/')
@app.route('/index')
def index():
    return "Hello, World!"

data_path = './data/'

methods = {'window complexity (w20)': 'win_var 20',
            'probabilistic window complexity (w20)': 'prob_win_var 20',
            'IO complexity': 'io 20',
            'probabilistic IO complexity': 'prob_io 20'}


@app.route('/org/<organism>/strain/<ref_strain>/contig/<contig>/start/<og_start>/end/<og_end>/window/<window>/tails/<tails>/pars/<pars>/operons/<operons>/depth/<depth>/freq_min/<freq_min>')
def subgraph(organism, ref_strain, contig, window, og_start, og_end, tails, pars, operons, depth, freq_min):

    if int(pars) == 0:
        paths = organism + '.dump'
    else:
        paths = organism + '_pars.dump'

    graph_file = data_path+organism+'/' + paths
    
    subgr = get_subgraph(graph_file, organism, ref_strain, window=int(window), start=og_start, end=og_end, tails=int(tails), depth=int(depth))[0]
    
    # Remove last EOL and split in lines
    subgr = subgr[0:-1].split('\n')

    graph_json = get_json_graph(subgr, int(freq_min))

    


    if int(pars) == 1:
        db = data_path + organism + '/' + organism + '_pars.db'
    
    elif int(pars) == 0:
        db = data_path + organism + '/' + organism + '.db'
    connect = sqlite3.connect(db)
    c = connect.cursor()

    nodes = graph_json['nodes']
    edges = graph_json['edges']

    query = 'SELECT MAX(edge_freq) FROM freq_table'
    max_width = [og for og in c.execute(query)][0][0]
    print('adding edges...')
    added_nodes = set([])
    for edge in edges:
        edge['data']['opacity'] = '1'
        edge['data']['eweight'] = '1'
        query = 'SELECT stamms_list, edge_freq FROM freq_table WHERE edge = "' + edge['data']['source'] + ' ' + edge['data']['target'] + '"'
        stamms = [og for og in c.execute(query)]
        if (len(stamms) > 0):
            edge['data']['description'] = stamms[0][0]

            edge['data']['penwidth'] = str(10*math.sqrt(stamms[0][1]/max_width))
            if ref_strain in stamms[0][0].split('\n'):

                if edge['data']['color'] == '#ff0000':
                    edge['data']['weight'] = '100'
                if edge['data']['color'] != '#ff0000':
                    edge['data']['color'] = '#ff0000'
                    edge['data']['opacity'] = '0.5'
                    edge['data']['eweight'] = '1'
                
                added_nodes.add(edge['data']['source'])
                added_nodes.add(edge['data']['target'])
        else:
            edge['data']['description'] = 'null'

    
    print('adding nodes...')
    
    
    coordinates = get_coordinates_from_db (data_path, organism, ref_strain, contig, int(pars))
    query = 'SELECT og, description, end_coord-start_coord FROM og_table'
    OGs = [og for og in c.execute(query)]
    og_list = [og[0] for og in OGs]
    descripton_list = [og[1] for og in OGs]
    length_list = [og[2] for og in OGs]

    if operons == '1':
        if pars == '1': operons_file = data_path + organism + '/ref_' + ref_strain + '/operons_pars.txt'
        
        else: operons_file = data_path + organism + '/ref_' + ref_strain + '/operons.txt'
            
        operons_list = get_operons(operons_file)

    
    for node in nodes:
        
        node['data']['bwidth'] = '0' 
        node['data']['bcolor'] = 'blue'

        if node['data']['id'] == 'main_ref':
            continue

        try:
            og_index = og_list.index(node['data']['id'])
        except:
            og_index = -1
        
        if (og_index != -1):
            node['data']['description'] = descripton_list[og_index] + ': ' + str(abs(length_list[og_index]))
        else:
            node['data']['description'] = 'null'
        if node['data']['id'] in added_nodes:
            try:
                coord_index = coordinates[0].index(node['data']['id'])
                node['data']['description'] = coordinates[2][coord_index] + ': ' + str(abs(length_list[og_index])) + ' (' + str(int(coordinates[1][coord_index])) + ')'
            except ValueError:
                pass
            if (node ['data']['color'] != '#ff0000' and node['data']['color'] != 'pink'):
                node['data']['color'] = 'pink'
            
            if operons == '0':
                continue

            for color in operons_list:
                if node['data']['id'] in operons_list[color]:
                    node['data']['bwidth'] = '5'
                    node['data']['bcolor'] = color


    print('adding nodes complete')
    

    
    return jsonify(graph_json)

@app.route('/org/')
def get_org_list():
    global org
    organisms = next(os.walk(data_path))[1]
    org = organisms[0]
    return jsonify(organisms)


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

@app.route('/org/<org>/stamms/<stamm>/contigs/<contig>/methods/<method>/pars/<pars>/complexity/')
def get_complexity(org, stamm, contig, pars, method):
    
    complexity = get_complexity_from_db(data_path, org, stamm, contig, int(pars), methods[method])
    return jsonify(complexity)