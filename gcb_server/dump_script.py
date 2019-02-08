from pickle import dump
from gene_graph_lib.compute_complexity import GenomeGraph
import os
import sqlite3


data_path = 'data/'
orgs = os.listdir('data/')

f = open('strains_decode.txt')

codes = {}

for line in f:
    code = line.split(' ')[-1][:-3]
    name = ''.join(line.split(' ')[:-1])
    codes[code] = name



for org in orgs:
	try:
		files = os.listdir('data/' + org + '/')
		if '.dump' not in ' '.join(files):
			print(org, end=' ')
			print('dumping...')
			
			
			try:
				g = GenomeGraph()
				g.read_graph('data/' + org + '/' + org + '.sif')
				dump_file = open('data/' + org + '/' + org + '.dump', 'wb')
				dump(g, dump_file)
			except:
				pass

			try:
				g = GenomeGraph()
				g.read_graph('data/' + org + '/' + org + '_pars.sif')
				dump_file = open('data/' + org + '/' + org + '_pars.dump', 'wb')
				dump(g, dump_file)
			except:
				pass

			skip = os.path.isfile(data_path + org + '/' + org + '.db')

			if skip == True:
				connect = sqlite3.connect(data_path + org + '/' + org + '.db')
				c = connect.cursor()
				
				genome_codes = [q for q in c.execute('select genome_id,genome_code from genomes_table')]

				for code in genome_codes:
					for ref_code in codes:
						if ref_code in code[1]:
							c.execute('update genomes_table set genome_name="' + codes[ref_code] + '" where genome_id=' + str(code[0]))

				
				connect.commit()
				connect.close()

			#pars table
			skip = os.path.isfile(data_path + org + '/' + org + '_pars.db')

			if skip == True:
					
				connect = sqlite3.connect(data_path + org + '/' + org + '_pars.db')
				c = connect.cursor()
				
				genome_codes = [q for q in c.execute('select genome_id,genome_code from genomes_table')]

				for code in genome_codes:
					for ref_code in codes:
						if ref_code in code[1]:
							c.execute('update genomes_table set genome_name="' + codes[ref_code] + '" where genome_id=' + str(code[0]))

				connect.commit()
				connect.close()
			
	except:
		continue
