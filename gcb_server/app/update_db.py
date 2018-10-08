import sqlite3
import os

data_path = '/home/dmitry/projects/Genome-Complexity-Browser-master/gcb_server/data/'

organisms = ['Escherichia_coli']

for org in organisms:
    print(org)

    connect = sqlite3.connect(data_path + org + '/' + org + '.db')
    c = connect.cursor()
    

    stamms = [i for i in range(0,327)]


    execute = ''
    for i in stamms:
        try:
            files = os.listdir(data_path + org + '/ref_' + str(i) + '/')

        except:
            print('not a dir')


        
        for file in files:
            if file.startswith('window'):

                print(file)

                file_in = open(data_path + org + '/ref_' + str(i) + '/' + file)

                contig = file.split('contig_')[1][:-4]
                contig_key = [row for row in c.execute('SELECT id FROM contigs_table WHERE (contig = "' + contig + '")')][0][0]
                for line in file_in:
                    string = line.split('\t')
                    execute += """
                    """ + 'UPDATE og_table SET win_var = ' + string[1][:-1] + ' WHERE (og = "' + string[0] + '" AND contig = ' + str(contig_key) + ')' 


                pass
            if file.startswith('prob_window'):
                
                file_in = open(data_path + org + '/ref_' + str(i) + '/' + file)

                contig = file.split('contig_')[1][:-4]
                contig_key = [row for row in c.execute('SELECT id FROM contigs_table WHERE (contig = "' + contig + '")')][0][0]
                for line in file_in:
                    string = line.split('\t')
                    execute +=  """
                    """ + 'UPDATE og_table SET prob_win_var = ' + string[1][:-1] + ' WHERE (og = "' + string[0] + '" AND contig = ' + str(contig_key) + ')' 

            if file.startswith('IO'):
                
                file_in = open(data_path + org + '/ref_' + str(i) + '/' + file)
                contig = file.split('contig_')[1][:-4]
                contig_key = [row for row in c.execute('SELECT id FROM contigs_table WHERE (contig = "' + contig + '")')][0][0]
                for line in file_in:
                    string = line.split('\t')
                    execute +=  """
                    """ + 'UPDATE og_table SET io = ' + string[1][:-1] + ' WHERE (og = "' + string[0] + '" AND contig = ' + str(contig_key) + ')' 
            if file.startswith('prob_IO'):
                
                file_in = open(data_path + org + '/ref_' + str(i) + '/' + file)
                contig = file.split('contig_')[1][:-4]
                contig_key = [row for row in c.execute('SELECT id FROM contigs_table WHERE (contig = "' + contig + '")')][0][0]
                for line in file_in:
                    string = line.split('\t')
                    execute +=  """
                    """ + 'UPDATE og_table SET prob_io = ' + string[1][:-1] + ' WHERE (og = "' + string[0] + '" AND contig = ' + str(contig_key) + ')' 
    
    print('updating...')
    f_out = open('script_update.txt', '+a')
    f_out.write(execute)
    print('Updated!')
    connect.commit()
    connect.close()
