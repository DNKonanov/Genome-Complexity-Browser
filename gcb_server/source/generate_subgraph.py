from gene_graph_lib.compute_complexity import GenomeGraph
import time 
import argparse

print('Example file:\n')
print('GENE0001 GENE0002 NameOfOrganism1\t(divided by space)\n...\nGENE3999 GENE4000 NameOfOrganism1\nGENE0001 GENE0002 NameOfOrganism2\n...\n')

parser = argparse.ArgumentParser()
parser.add_argument('-i', '--input_file', default='no', type=str, help='input_file')
parser.add_argument('-o', '--outfile', default='subgraph', help='out file prefix')
parser.add_argument('--reference', type=str, default='auto', help='name of reference genome')
parser.add_argument('--window', type=int, default=20, help='Size of window (default is 20)')
parser.add_argument('--start', type=str, default=None, help='start og for subgraph generating')
parser.add_argument('--end', type=str, default=None, help='end og for subgraph generating')
parser.add_argument('--depth', type=int, default=-1, help='max paths depth (default len of baseline)')
parser.add_argument('--tails', type=int, default=5, help='length of tails (default 5)')
parser.add_argument('--names_list', type=str, default='all', help='names list txt file')

args = parser.parse_args()

graph = GenomeGraph()
graph.read_graph(args.input_file)


subgraph, aim_chain = graph.generate_subgraph(args.start, args.end, reference=args.reference, window=args.window, tails=args.tails, depth=args.depth)
f_out = open(args.outfile + '.sif', '+a')
f_freq = open(args.outfile + '_freq.sif', '+a')

in_aim = 0
is_ref = 0
for stamm in subgraph:
	print(stamm)
	for contig in subgraph[stamm]:
		for i in range(len(contig) - 1):

			try:
				if aim_chain.index(contig[i + 1]) - aim_chain.index(contig[i]) == 1:
					in_aim = 1
			except ValueError:
				pass

			try:
				if subgraph[args.reference][0].index(contig[i + 1]) - subgraph[args.reference][0].index(contig[i]) == 1:
					is_ref = 1
			except ValueError:
				pass


			line = graph.genes_decode[contig[i]] + ' ' + graph.genes_decode[contig[i + 1]] + ' ' + stamm + ' ' + str(in_aim) + ' ' + str(is_ref) + '\n'
			f_out.write(line)

			in_aim = 0
			is_ref = 0

f_out.close()
freq = {}

for name in subgraph:
	for contig in subgraph[name]:
		for i in range(len(contig) - 1):
			if graph.genes_decode[contig[i]] + ' ' + graph.genes_decode[contig[i + 1]] not in freq:
				freq[graph.genes_decode[contig[i]] + ' ' + graph.genes_decode[contig[i + 1]]] = [name]

			else:
				freq[graph.genes_decode[contig[i]] + ' ' + graph.genes_decode[contig[i + 1]]].append(name)


for pair in freq:
	f_freq.write(pair + ' ' + str(len(freq[pair])) + ' ')
	for name in freq[pair]:
		f_freq.write(name)
		if name == freq[pair][-1]:
			f_freq.write('\n')
			continue
		f_freq.write('|')

f_freq.close()