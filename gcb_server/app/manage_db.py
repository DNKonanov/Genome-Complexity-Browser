import sqlite3
from app import app

methods = ['win_var', 'prob_win_var', 'IO', 'prob_IO']

def get_complexity_from_db(data_path, organism, reference, contig, method):
    db = data_path + organism + '/' + organism + '.db'
    connect = sqlite3.connect(db)
    c = connect.cursor()

    stamm_key = [row for row in c.execute('SELECT id FROM stamms_table WHERE stamm = "' + reference + '"')][0][0]
    print(stamm_key)

    print(contig)
    contig_key = [row for row in c.execute('SELECT id FROM contigs_table WHERE (stamm_key = ' + str(stamm_key) + ' AND contig = "' + contig + '")')][0][0]
    
    print(contig_key)


    complexity_list = [float(value[0]) for value in c.execute('SELECT ' + method + ' FROM og_table WHERE contig = ' + str(contig_key))]
    og_list = [og[0] for og in c.execute('SELECT og FROM og_table WHERE contig = ' + str(contig_key))]

    connect.close()
    return [complexity_list, og_list]




