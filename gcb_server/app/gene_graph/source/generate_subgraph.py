import argparse
import app.gene_graph.source.compute_complexity as compute_complexity   
import time
import os

def get_subgraph(input, reference_stamm, window=20, start=None, end=None, depth=-1, tails=5, names_list='all'):
    t = time.time()

    if names_list != 'all':
        names_list = [name[:-1] for name in names_list]

    edge_table = []

    # input_lines = input.splitlines()
    for line in input:
        string = line.split(' ')

        if len(string) < 3:
            continue

        start_gene = string[0]
        end_gene = string[1]
        stamm = string[2][:-1]

        if names_list != 'all' and stamm in names_list:
            edge_table.append([start_gene, end_gene, stamm])
            continue

        elif names_list == 'all':
            edge_table.append([start_gene, end_gene, stamm])

    print('file opening time:\t' + str(int(time.time()*100 - t*100)/100) + 's')

    graph = compute_complexity.generate_graph(edge_table)

    reference_chain = graph[reference_stamm]

    number_of_contigs = len(reference_chain)

    subgraph, aim_chain = compute_complexity.generate_subgraph(graph, start, end, reference_chain,
                                                            reference_stamm, window=window, tails=tails, depth=depth)

    f_out = ''
    f_freq = ''

    in_aim = 0
    is_ref = 0

    for stamm in subgraph:
        for contig in subgraph[stamm]:
            for i in range(len(contig) - 1):
                try:
                    if aim_chain.index(contig[i + 1]) - aim_chain.index(contig[i]) == 1:
                        in_aim = 1
                except ValueError:
                    pass

                try:
                    if subgraph[reference_stamm][0].index(contig[i + 1]) - subgraph[reference_stamm][0].index(contig[i]) == 1:
                        is_ref = 1
                except ValueError:
                    pass

                line = contig[i] + ' ' + contig[i + 1] + ' ' + \
                    stamm + ' ' + str(in_aim) + ' ' + str(is_ref) + '\n'
                f_out += line
                in_aim = 0
                is_ref = 0

    freq = {}

    for name in subgraph:
        for contig in subgraph[name]:
            for i in range(len(contig) - 1):
                if contig[i] + ' ' + contig[i + 1] not in freq:
                    freq.update([(contig[i] + ' ' + contig[i + 1], [name])])
                else:
                    freq[contig[i] + ' ' + contig[i + 1]].append(name)

    for pair in freq:
        f_freq += (pair + ' ' + str(len(freq[pair])) + ' ')
        for name in freq[pair]:
            f_freq += (name)
            if name == freq[pair][-1]:
                f_freq += ('\n')
                continue
            f_freq += ('|')

    print()
    print('Generation Completed!')

    return f_out, f_freq

def main():
    print('Example file:\n')
    print('GENE0001 GENE0002 NameOfOrganism1\t(divided by space)\n...\nGENE3999 GENE4000 NameOfOrganism1\nGENE0001 GENE0002 NameOfOrganism2\n...\n')

    parser = argparse.ArgumentParser()
    parser.add_argument('-i', '--input_file', default='no',
                        type=str, help='input_file')
    parser.add_argument('-o', '--outfile',
                        default='subgraph', help='out file prefix')
    parser.add_argument('--reference_stamm', type=str,
                        default='auto', help='name of reference stamm')
    parser.add_argument('--window', type=int, default=20,
                        help='Size of window (default is 20)')
    parser.add_argument('--start', type=str, default=None,
                        help='start og for subgraph generating')
    parser.add_argument('--end', type=str, default=None,
                        help='end og for subgraph generating')
    parser.add_argument('--depth', type=int, default=-1,
                        help='max paths depth (default len of baseline)')
    parser.add_argument('--tails', type=int, default=5,
                        help='length of tails (default 5)')
    parser.add_argument('--names_list', type=str,
                        default='all', help='names list txt file')

    args = parser.parse_args()

    f_in = open(args.input_file, 'r')

    input_lines = []
    with open(args.input_file, 'r') as input:
        input_lines = input.readlines()
    
    out, freq = get_subgraph(input_lines, args.reference_stamm, args.window, args.start, args.end, args.depth,
                            args.tails, args.names_list)

    f_out = open(args.outfile + '.sif', 'w')
    f_freq = open(args.outfile + '_freq.sif', 'w')

    f_out.write(out)
    f_freq.write(freq)

    f_out.close()
    f_freq.close()

    print()
    print('Writing to files Completed!')

#main()


