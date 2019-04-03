from app import app
from flask import jsonify, session
from app.manage_db import get_complexity_from_db, get_coordinates_from_db, get_operons, get_windows_from_db
import os
import math
from gene_graph_lib.compute_complexity import GenomeGraph
from gene_graph_lib.generate_subgraph import get_subgraph
from gene_graph_lib.draw_graph import get_json_graph
import sqlite3
from flask import render_template
from app.process_graph import delete_double_edges 

data_path = './data/'

methods = {'by strains complexity': 'window_complexity',
            'probabilistic complexity': 'prob_window_complexity',
            'IO complexity': 'io_complexity',
            'probabilistic IO complexity': 'prob_io_complexity'}


@app.route('/org/<organism>/strain/<ref_strain>/contig/<contig>/start/<og_start>/end/<og_end>/window/<window>/tails/<tails>/pars/<pars>/operons/<operons>/depth/<depth>/freq_min/<freq_min>/hide_edges/<hide>')
def subgraph(organism, ref_strain, contig, window, og_start, og_end, tails, pars, operons, depth, freq_min, hide):
    print(hide)
    if int(pars) == 0:
        paths = organism + '.dump'
    else:
        paths = organism + '_pars.dump'

    graph_file = data_path+organism+'/' + paths
    
    subgr = get_subgraph(graph_file, organism, ref_strain, window=int(window), start=og_start, end=og_end, tails=int(tails), depth=int(depth))
    


    graph_json = get_json_graph(subgr, int(freq_min))
    if hide == 'true':
        graph_json = delete_double_edges(graph_json)
    
    if int(pars) == 1:
        db = data_path + organism + '/' + organism + '_pars.db'
    
    elif int(pars) == 0:
        db = data_path + organism + '/' + organism + '.db'
    connect = sqlite3.connect(db)
    c = connect.cursor()

    nodes = graph_json['nodes']
    edges = graph_json['edges']

    query = 'SELECT MAX(frequency) FROM edges_table'
    max_width = [og for og in c.execute(query)][0][0]


    query = 'select node_name, node_id from nodekey'
    nodes_keys = {i[0]: str(i[1]) for i in c.execute(query)}


    print('adding edges...')
    added_nodes = set([])

    genomes_names = {g[0]: g[1] for g in c.execute('select genome_code, genome_name from genomes_table')}

    for edge in edges:
        edge['data']['opacity'] = '1'
        edge['data']['eweight'] = '1'
        query = 'SELECT genomes, frequency FROM edges_table WHERE source =' + nodes_keys[edge['data']['source']] + ' and target =' + nodes_keys[edge['data']['target']]
        stamms = [og for og in c.execute(query)]

        genomes_list = ''

        if len(stamms) != 0:
            for st in stamms[0][0].split('\n'):
                genomes_list += st + '\t' + genomes_names[st] + '\n'

        if (len(stamms) > 0):
            edge['data']['description'] = genomes_list

            edge['data']['penwidth'] = str(10*math.sqrt(stamms[0][1]/max_width))

            list_ = [s.split('\t')[0] for s in stamms[0][0].split('\n')]

            if ref_strain in list_:

                if edge['data']['color'] == '#ff0000':
                    edge['data']['weight'] = '100'
                if edge['data']['color'] != '#ff0000':
                    edge['data']['color'] = '#ff0000'
                    edge['data']['opacity'] = '0.5'
                    edge['data']['eweight'] = '1'
                
                added_nodes.add(edge['data']['source'])
                added_nodes.add(edge['data']['target'])
        else:
            print(edge)
            edge['data']['description'] = 'null'
    
    print('adding nodes...')
    
    
    coordinates, contig_key = get_coordinates_from_db (data_path, organism, ref_strain, contig, int(pars))
    query = 'SELECT node_name, description, end_coord-start_coord FROM nodes_table'
    OGs = [og for og in c.execute(query)]
    og_list = [og[0] for og in OGs]
    descripton_list = [og[1] for og in OGs]
    length_list = [og[2] for og in OGs]

    if operons == '1':
        if pars == '1': operons_file = data_path + organism + '/ref_' + ref_strain + '/operons_pars.txt'
        
        else: operons_file = data_path + organism + '/ref_' + ref_strain + '/operons.txt'
            
        operons_list = get_operons(operons_file)


    ref = [q[0] for q in c.execute('select node_name from nodes_table where contig_id=' + str(contig_key))]
    
    
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
        if node['data']['id'] in ref:
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
                    print(node['data']['id'])
                    node['data']['bwidth'] = '5'
                    node['data']['bcolor'] = color


    print('adding nodes complete')
       
    return jsonify(graph_json)


@app.route('/')
def index():
    return render_template('index.html')

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
    
    stamms = [row for row in c.execute('SELECT genome_code, genome_name FROM genomes_table')]
    stamms.sort()
    answer = [[s[0] for s in stamms], [s[1] for s in stamms]]
    print(org)
    connect.close()
    return jsonify(answer)

@app.route('/org/<org>/stamms/<stamm>/contigs/')
def get_contig_list(org, stamm):
    connect = sqlite3.connect(data_path + org + '/' + org + '.db')
    c = connect.cursor()
    stamm_key = [row for row in c.execute('SELECT genome_id FROM genomes_table WHERE genome_code = "' + stamm + '"')][0][0]
    contigs = [row for row in c.execute('SELECT contig_code FROM contigs_table WHERE genome_id = ' + str(stamm_key))]
    contigs.sort()
    connect.close()
    return jsonify(contigs)

@app.route('/org/<org>/stamms/<stamm>/contigs/<contig>/methods/<method>/pars/<pars>/complexity/window/<window>/')
def get_complexity(org, stamm, contig, pars, method, window):
    
    complexity = get_complexity_from_db(data_path, org, stamm, contig, int(pars), methods[method], window)
    return jsonify(complexity)


@app.route('/org/<org>/stamms/<stamm>/complexity_windows/pars/<pars>/')
def get_complexity_windows(org, stamm, pars):

    windows = get_windows_from_db(data_path, org, stamm, int(pars))

    print(windows)
    return jsonify(windows)


@app.route('/search/org/<org>/strain/<stamm>/pars/<pars>/input/<input>/')
def search(org, stamm, pars, input):

    if pars == 'false':
        connect = sqlite3.connect(data_path + org + '/' + org + '.db')

    elif pars == 'true':
        connect = sqlite3.connect(data_path + org + '/' + org + '_pars.db')

    c = connect.cursor()

    stamm_key = [row for row in c.execute('SELECT genome_id FROM genomes_table WHERE genome_code = "' + stamm + '"')][0][0]
    contigs = [row for row in c.execute('SELECT contig_id, contig_code FROM contigs_table WHERE genome_id = ' + str(stamm_key))]

    table = []
    for contig in contigs:
        query = 'SELECT node_name, description, (start_coord+end_coord)/2 FROM nodes_table WHERE contig_id=' + str(contig[0])
        table += [list(q) + [contig[1]] for q in c.execute(query) if input.lower() in q[1].lower()]

    return jsonify(table)
