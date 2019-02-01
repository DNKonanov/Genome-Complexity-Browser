from pickle import dump
from gene_graph_lib.compute_complexity import GenomeGraph
import os

orgs = os.listdir('data/')

for o in orgs:
	try:
		files = os.listdir('data/' + o + '/')
		if '.dump' not in ' '.join(files):
			print(o, end=' ')
			print('dumping...')
			
			
			try:
				g = GenomeGraph()
				g.read_graph('data/' + o + '/' + o + '.sif')
				dump_file = open('data/' + o + '/' + o + '.dump', 'wb')
				dump(g, dump_file)
			except:
				pass

			try:
				g = GenomeGraph()
				g.read_graph('data/' + o + '/' + o + '_pars.sif')
				dump_file = open('data/' + o + '/' + o + '_pars.dump', 'wb')
				dump(g, dump_file)
			except:
				pass
	except:
		continue
