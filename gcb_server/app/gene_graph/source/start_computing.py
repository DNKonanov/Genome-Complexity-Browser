import argparse
import compute_complexity
import os
from collections import OrderedDict
import reverse

print('Example file:\n')
print('GENE0001 GENE0002 NameOfOrganism1\t(divided by space)\n...\nGENE3999 GENE4000 NameOfOrganism1\nGENE0001 GENE0002 NameOfOrganism2\n...\n')

parser = argparse.ArgumentParser(prog='start.sh')
parser.add_argument('-i', '--input_file', default='no', type=str, help='input_file (Orthofinder file)')
parser.add_argument('-o', '--output_dir', default='STDOUT', type=str, help='Output directory')
parser.add_argument('--reference_stamm', type=str, default='auto', help='name of reference stamm')
parser.add_argument('--window', type=int, default=20, help='Size of window (default is 20)')
parser.add_argument('--iterations', type=int, default=500, help='number of iterations in stat computing (default is 500)')
parser.add_argument('--names_list', type=str, default='all', help='names list txt file')


args = parser.parse_args()


f_in = open(args.input_file, 'r')


edge_table = []

if args.names_list != 'all':

	names_list = [name[:-1] for name in open(args.names_list, 'r')]

for line in f_in:

    string = line.split(' ')

    if len(string) < 3:
        continue

    start_gene = string[0]
    end_gene = string[1]
    stamm = string[2][:-1]

    if args.names_list != 'all' and stamm in names_list:
    	edge_table.append([start_gene, end_gene, stamm])
    	continue

    elif args.names_list == 'all':
	    edge_table.append([start_gene, end_gene, stamm])


graph = compute_complexity.generate_graph(edge_table)

print('Number of stamms is ' + str(len(graph)))

full_graph = compute_complexity.create_full_graph(edge_table)

reference_stamm = graph[args.reference_stamm]

number_of_contigs = len(reference_stamm)

print('Number of contig is ' + str(number_of_contigs))

try:
    os.stat(args.output_dir)
except:
    os.mkdir(args.output_dir)  

contig = 0

for main_chain in reference_stamm:

	print('Number of genes in contig ' + str(contig) + ':\t' + str(int(len(main_chain))))

	print('Computing with contig ' + str(contig) + '...')
	print('')

	full_complexity_table = compute_complexity.compute_complexity(graph, main_chain, args.window)

	f_IO = open(args.output_dir + '/IO_complexity_table_contig' + str(contig) + '.txt', 'a+')
	f_ab = open(args.output_dir + '/all_bridges_table_contig' + str(contig) + '.txt', 'a+')
	f_wc = open(args.output_dir + '/window_complexity_table_contig' + str(contig) + '.txt', 'a+')
	f_mc = open(args.output_dir + '/main_chain_contig' + str(contig) + '.txt', 'a+')


	for og in full_complexity_table[0]:
		f_IO.write(og + '\t' + str(full_complexity_table[0][og]) + '\n')
		f_mc.write(og + '\n')

	for bridge in full_complexity_table[1]:
		f_ab.write(bridge[0] + '\t' + bridge[1] + '\t' + str(full_complexity_table[1][bridge]) + '\n')

	for og in full_complexity_table[2]:
		f_wc.write(og + '\t' + str(full_complexity_table[2][og]) + '\n')



	print('Statistical computing with contig ' + str(contig) + '...')
	print('')
 
	full_complexity_table = compute_complexity.compute_stat_complexity(full_graph, main_chain, window=args.window, iterations=args.iterations)


	f_IO = open(args.output_dir + '/stat_IO_complexity_table_contig' + str(contig) + '.txt', 'a+')
	f_ab = open(args.output_dir + '/stat_all_bridges_table_contig' + str(contig) + '.txt', 'a+')
	f_wc = open(args.output_dir + '/stat_window_complexity_table_contig' + str(contig) + '.txt', 'a+')
	f_mc = open(args.output_dir + '/stat_main_chain_contig' + str(contig) + '.txt', 'a+')


	for og in full_complexity_table[0]:
		f_IO.write(og + '\t' + str(full_complexity_table[0][og]) + '\n')
		f_mc.write(og + '\n')

	for bridge in full_complexity_table[1]:
		f_ab.write(bridge[0] + '\t' + bridge[1] + '\t' + str(full_complexity_table[1][bridge]) + '\n')

	for og in full_complexity_table[2]:
		f_wc.write(og + '\t' + str(full_complexity_table[2][og]) + '\n')



	contig += 1

print('Completed!')


	
