import sqlite3
from app import app
import pandas as pd

methods = ['win_var', 'prob_win_var', 'IO', 'prob_IO']

def get_complexity_from_db(data_path, organism, reference, contig, pars, method):
    method, window = method.split(' ')[0], method.split(' ')[1]
    if pars == 0:
       
        db = data_path + organism + '/' + organism + '.db'

    else:
        db = data_path + organism + '/' + organism + '_pars.db'
        
    connect = sqlite3.connect(db)
    c = connect.cursor()
    stamm_key = [row for row in c.execute('SELECT id FROM stamms_table WHERE stamm = "' + reference + '"')][0][0]

    print(contig)
    contig_key = [row for row in c.execute('SELECT id FROM contigs_table WHERE (stamm_key = ' + str(stamm_key) + ' AND contig = "' + contig + '")')][0][0]

    complexity_list = [float(value[0]) for value in c.execute('SELECT ' + method + ' FROM og_complexity_table WHERE contig = ' + str(contig_key))]
    coord_list = [float(value[0]) for value in c.execute('SELECT (start_coord+end_coord)/2 FROM og_table WHERE contig = ' + str(contig_key))]
    og_list = [og[0] for og in c.execute('SELECT og FROM og_table WHERE contig = ' + str(contig_key))]
    length_table = [int(value[0]) for value in c.execute('SELECT end_coord - start_coord FROM og_table WHERE contig = ' + str(contig_key))]

    connect.close()

    return [complexity_list, og_list, coord_list, length_table]


def get_coordinates_from_db(data_path, organism, reference, contig, pars):
    if pars == 0:
       
        db = data_path + organism + '/' + organism + '.db'

    else:
        db = data_path + organism + '/' + organism + '_pars.db'
    
    print(contig, organism)
    connect = sqlite3.connect(db)
    c = connect.cursor()
    stamm_key = [row for row in c.execute('SELECT id FROM stamms_table WHERE stamm = "' + reference + '"')][0][0]

    contig_key = [row for row in c.execute('SELECT id FROM contigs_table WHERE (stamm_key = ' + str(stamm_key) + ' AND contig = "' + contig + '")')][0][0]
    full_list = [(value[0], float(value[1]), value[2]) for value in c.execute('SELECT description,(start_coord+end_coord)/2,og FROM og_table WHERE contig = ' + str(contig_key))]

    og_list = [i[2] for i in full_list]
    coord_list = [i[1] for i in full_list]
    description_list = [i[0] for i in full_list]

    og_list = [og[0] for og in c.execute('SELECT og FROM og_table WHERE contig = ' + str(contig_key))]

    connect.close()

    return [og_list, coord_list, description_list]



def get_operons(data_path):

    color_list = ['#9966CC', '#007FFF', '#CD7F32', '#964B00', '#0047AB', '#00FF00', '#00A86B', '#4B0082', '#483C32', '#FFFF00']

    color_table = {color: [] for color in color_list}
    try:
        file_operons = open(data_path)
    except:
        return color_table

    current_color = 0
    for line in file_operons:
        if current_color == len(color_list):
            current_color = 0

        string = line[:-1].split(' ')
        for og in string:
            color_table[color_list[current_color]].append(og)

        current_color += 1

    return color_table


        
