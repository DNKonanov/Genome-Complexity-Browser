import sqlite3
from app import app

methods = ['win_var', 'prob_win_var', 'IO', 'prob_IO']

def get_complexity_from_db(data_path, organism, reference, contig, pars, method, window):
    if pars == 0:
       
        db = data_path + organism + '/' + organism + '.db'

    else:
        db = data_path + organism + '/' + organism + '_pars.db'
        
    connect = sqlite3.connect(db)
    c = connect.cursor()
    stamm_key = [row for row in c.execute('SELECT genome_id FROM genomes_table WHERE genome_code = "' + reference + '"')][0][0]

    print(contig)
    contig_key = [row for row in c.execute('SELECT contig_id FROM contigs_table WHERE (genome_id = ' + str(stamm_key) + ' AND contig_code= "' + contig + '")')][0][0]



    full_data = [(value[0], float(value[1]), int(value[2])) for value in c.execute('select node_name, (start_coord+end_coord)/2, end_coord-start_coord from nodes_table where contig_id = ' + str(contig_key))]
    complexity_list = [float(value[0]) for value in c.execute('SELECT ' + method + ' FROM complexity_table WHERE contig_id = ' + str(contig_key) + ' and window = ' + str(window))]

    connect.close()

    if len(complexity_list) != len(full_data):
        complexity_list = [0 for _ in range(len(full_data))]

    return [complexity_list, [i[0] for i in full_data], [i[1] for i in full_data], [i[2] for i in full_data]]


def get_windows_from_db(data_path, organism, reference, pars):

    if pars == 0:
       
        db = data_path + organism + '/' + organism + '.db'

    else:
        db = data_path + organism + '/' + organism + '_pars.db'

    connect = sqlite3.connect(db)
    c = connect.cursor()

    stamm_key = [row for row in c.execute('SELECT genome_id FROM genomes_table WHERE genome_code = "' + reference + '"')][0][0]
    contig_key = [row for row in c.execute('SELECT contig_id FROM contigs_table WHERE genome_id = ' + str(stamm_key))][0][0]

    windows = list(set([int(value[0]) for value in c.execute('SELECT window FROM complexity_table WHERE contig_id = ' + str(contig_key))]))

    connect.close()

    return windows



def get_coordinates_from_db(data_path, organism, reference, contig, pars):
    if pars == 0:
       
        db = data_path + organism + '/' + organism + '.db'

    else:
        db = data_path + organism + '/' + organism + '_pars.db'
    
    print(contig, organism)
    connect = sqlite3.connect(db)
    c = connect.cursor()

    contig_key = [row for row in c.execute('SELECT contig_id FROM contigs_table WHERE contig_code = "' + contig + '"')][0][0]
    full_list = [(value[0], value[1], value[2], value[3]) for value in c.execute('SELECT description, start_coord, end_coord, node_name FROM nodes_table WHERE contig_id = ' + str(contig_key))]

    og_list = [i[3] for i in full_list]
    coord_list = [(i[1], i[2]) for i in full_list]
    description_list = [i[0] for i in full_list]

    connect.close()

    return [og_list, coord_list, description_list] , contig_key



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


        
