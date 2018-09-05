import argparse
import app.gene_graph.source.reverse as reverse
from collections import OrderedDict

parser = argparse.ArgumentParser()
parser.add_argument('-i', '--input_file', default='no', type=str, help='input_file, generated by Orthofinder')
parser.add_argument('-o', '--out_file', default='paths', type=str, help='output file prefix (default paths)')
args = parser.parse_args()

graph = OrderedDict()
length_table = OrderedDict()

for line in open(args.input_file, 'r'):
	OG, string = line.split(': ')[0], line.split(': ')[1][:-1]
	stamms = string.split(' ')

	for stamm in stamms:
		name = stamm.split('|')[0]
		start_coord = int(stamm.split('|')[-2])
		end_coord = int(stamm.split('|')[-1])
		coord = int(stamm.split('|')[1])

		if name not in graph:
			graph.update([(name, [])])
			length_table.update([(name, {})])
			
		graph[name].append([coord, start_coord, end_coord, OG])

		if OG not in length_table[name]:
			length_table[name].update([(OG, end_coord - start_coord)])

out = open(args.out_file + '.sif', 'a+')
out_freq = open(args.out_file + '_freq.sif', 'a+')

edges = []

for name in graph:
	graph[name].sort()
	S = set([])
	G = set([])
	for i in graph[name]:
		if i[-1] in S:
			G.add(i[-1])
		S.add(i[-1])

	for i in range(len(graph[name]) - 1):
		if graph[name][i][1] > graph[name][i+1][1]:
			continue

		if graph[name][i+1][-1] in G:
			continue
			
		try:

			if graph[name][i][-1] in G and name == edges[-1][2]:
				edges.append((edges[-1][1], graph[name][i+1][-1], name, graph[name][i+1][1]))
				continue 
		except IndexError:
			continue

		edges.append((graph[name][i][-1], graph[name][i+1][-1], name, graph[name][i+1][1]))

graph = reverse.reverse(edges, length_table)

for name in graph:
	for contig in range(len(graph[name])):
		for i in range(len(graph[name][contig]) - 1):
			line = graph[name][contig][i] + ' ' + graph[name][contig][i + 1] + ' ' + name + '\n'
			out.write(line)

freq = {}
for name in graph:
	for contig in range(len(graph[name])):
		for i in range(len(graph[name][contig]) - 1):
			if graph[name][contig][i] + ' ' + graph[name][contig][i + 1] not in freq:
				freq.update([(graph[name][contig][i] + ' ' + graph[name][contig][i + 1], [name])])

			else:
				freq[graph[name][contig][i] + ' ' + graph[name][contig][i + 1]].append(name)

for pair in freq:
	out_freq.write(pair + ' ' + str(len(freq[pair])) + ' ')
	for name in freq[pair]:
		out_freq.write(name)
		if name == freq[pair][-1]:
			out_freq.write('\n')
			continue
		out_freq.write('|')


