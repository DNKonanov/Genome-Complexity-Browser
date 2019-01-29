from gene_graph_lib.compute_complexity import GenomeGraph
import argparse
import os
import subprocess
from pickle import dump
import sqlite3

parser = argparse.ArgumentParser()
parser.add_argument('-i', type=str, default='no', help='orthofinder results file with otrhogroups (txt format)')
parser.add_argument('-name', type=str, default='no', help='output directory name (dataset will be available in service by this name)')
parser.add_argument('--window', type=int, default=20, help='window parameter for complexity computing (default 20)')
parser.add_argument('--iterations', type=int, default=500, help='iterations parameter for complexity computing (default 500)')
parser.add_argument('--min_depth', type=int, default=0, help='min length of deviating path (default is 0)')
parser.add_argument('--max_depth', type=int, default=-1, help='max length of deviating path (default is inf)')

args = parser.parse_args()


def compute_all(output_dir, name, W, I, maxD, minD):
    graph = GenomeGraph()

    graph.read_graph(output_dir + '/' + name + '.sif', names_list='all')

    with open(output_dir + '/' + name + '.dump', 'wb') as f:
        dump(graph, f)

    genomes = [g for g in graph.list_graph]

    try:
        os.mkdir(output_dir + '/refs' + str(W))
    except:
        os.mkdir(output_dir + '/refs' + str(W) + '_pars')
    for g in genomes:
        print('COMPUTING WITH ' + g)
        graph.compute_complexity(output_dir + '/refs' + str(W), g, window=W, iterations=I, min_depth=minD, max_depth=maxD, save_db=output_dir + '/' + name + '.db')


if args.i == 'no' or args.name == 'no':
    print('Choose input file and output directory!')

else:
    try:
        os.stat('data/' + args.name)

    except FileNotFoundError:
        os.mkdir('data/' + args.name)

    endcode = subprocess.call('python3 source/orthofinder_parse.py -i ' + args.i + ' -o data/' + args.name + '/' + args.name, shell=True)
    endcode = subprocess.call('python3 source/orthofinder_parse_par.py -i ' + args.i + ' -o data/' + args.name + '/' + args.name + '_pars', shell=True)
    
    

    
    f = open('strains_decode.txt')

    codes = {}

    data_path = 'data/'

    for line in f:
        code = line.split(' ')[-1][:-3]
        realname = ''.join(line.split(' ')[:-1])
        codes[code] = realname

    org = args.name

    print('Name in data directory: ' + org)
    #non-pars table
    connect = sqlite3.connect('data/' + org + '/' + org + '.db')
    c = connect.cursor()
    
    genome_codes = [q for q in c.execute('select genome_id,genome_code from genomes_table')]

    for code in genome_codes:
        for ref_code in codes:
            if ref_code in code[1]:
                c.execute('update genomes_table set genome_name="' + codes[ref_code] + '" where genome_id=' + str(code[0]))

    
    connect.commit()
    connect.close()


    connect = sqlite3.connect('data/' + org + '/' + org + '_pars.db')
    c = connect.cursor()
    
    genome_codes = [q for q in c.execute('select genome_id,genome_code from genomes_table')]

    for code in genome_codes:
        for ref_code in codes:
            if ref_code in code[1]:
                c.execute('update genomes_table set genome_name="' + codes[ref_code] + '" where genome_id=' + str(code[0]))

    connect.commit()
    connect.close()

    compute_all('data/' + args.name, args.name, args.window, args.iterations, args.max_depth, args.min_depth)
    compute_all('data/' + args.name, args.name + '_pars', args.window, args.iterations, args.max_depth, args.min_depth)


