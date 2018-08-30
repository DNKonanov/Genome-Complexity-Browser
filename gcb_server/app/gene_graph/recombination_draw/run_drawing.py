import draw_graph
import argparse

print('Example file:\n')
print('GENE0001 GENE0002 NameOfOrganism1 1 1\t(divided by space)\n...\nGENE3999 GENE4000 NameOfOrganism1 0 1\nGENE0001 GENE0002 NameOfOrganism2 0 0\n...\n')

parser = argparse.ArgumentParser()
parser.add_argument('-i', '--input_file', default='no', type=str, help='input sif file')
parser.add_argument('-o', '--out', default='graph', type=str, help='output files prefix (default is "graph")')
parser.add_argument('--freq_min', default=1, type=int, help='minimal freq to draw edge (default is 1)')
parser.add_argument('--da', action='store_true', help='draw all nodes')


args = parser.parse_args()


f_in = open(args.input_file, 'r')
genes = []
genes = set(genes)
bonds = []

aim_chain = set([])
ref_chain = []

for i in f_in:
    line = i.split(' ')
    genes.add(line[0])
    genes.add(line[1])

    if line[3] == '1':
    	aim_chain.add(line[0])
    	aim_chain.add(line[1])

    if line[4][:-1] == '1':
        if line[0] not in ref_chain:
            ref_chain.append(line[0])
            last = line[1]

    bonds.append([line[0], line[1], 1])

ref_chain.append(last)


bonds = draw_graph.compute_frequence(bonds)
genes = list(genes)

print('Rendering...')
draw_graph.draw_graph([genes, bonds], args.out,  ref_chain=ref_chain, 
                    aim_chain=aim_chain, freq_min=args.freq_min, draw_all=args.da)
print('Complete!')
