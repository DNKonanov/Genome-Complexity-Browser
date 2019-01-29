from gene_graph_lib.compute_complexity import GenomeGraph
from pickle import dump, load
from time import time
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('-i', '--input_file', default='no', type=str, help='input sif file')
parser.add_argument('-ip', default=0.5, type=float, help='intersection percent, default 0.5')
parser.add_argument('-ad', default=5, type=int, help='max number of paths from non-edge nodes')
parser.add_argument('-d', default=100, type=int, help='N value')
parser.add_argument('-il', default=20, type=int, help='max insertion length')
parser.add_argument('-nc', default=5, type=int, help='non conservativity of edge nodes')
args = parser.parse_args()

def find_uniq_paths(g, gene, ref, direction, depth=100):


    paths = []

    if direction == '+':
        step = 1
    elif direction == '-':
        step = -1

    for strain in g. list_graph:
        for contig in g.list_graph[strain]:
            c = g.list_graph[strain][contig]

            try:
                index = c.index(gene)
            except: continue
            
            path = [gene]
            index += step
            while len(path) <= depth:
                
                try:
                    if c[index] in ref:
                        path.append(c[index])
                        break

                except:
                    break

                path.append(c[index])
                index += step

            if path[-1] in ref:
                continue
            paths.append(path)


    used_genes = set([])
    for p in paths:
        for gene in p[:-1]:
            used_genes.add(gene)
        
    cleared_paths = []
    for p in paths:
        if p[-1] not in used_genes:
            if tuple(p) not in cleared_paths:
                cleared_paths.append(tuple(p))

    
    return len(cleared_paths)            


def check_edge_weight(g, gene_1, gene_2):
    
    value1 = value2 = 0

    try:
        for gene in g.dict_graph_freq[gene_1]:
            if gene[0] == gene_2:
                value1 = gene[1]
                break
    except:
        pass

    try:
        for gene in g.dict_graph_freq[gene_2]:
            if gene[0] == gene_1:
                value2 = gene[1]
                break
    except:
        pass

    return(max(value1, value2))

def check_insertion(g, gene_1, gene_2, insertion_len):
    
    insert_count = 0

    for strain in g.list_graph:
        for contig in g.list_graph[strain]:
            c = g.list_graph[strain][contig]

            try:
                d = abs(c.index(gene_1) - c.index(gene_2))
                if d < insertion_len:
                    insert_count += 1
            
            except:
                continue

    if insert_count > 0:
        return True

    else:
        return False

def find_template(g, depth=100, insertion_len=20, weight=0.05, uniq_paths=1):

    for name in g.list_graph:
        print(name)
        for contig in g.list_graph[name]:
            c = g.list_graph[name][contig]

            for i  in range(len(c)):
                insert = check_insertion(g, c[i], c[i + 1], insertion_len)
                if insert == False:
                    continue
                
                ref = c[max(0, i - depth):min(i + depth, len(c))]

                f_hits = find_uniq_paths(g, c[i+1], ref, '+',depth=depth)
                r_hits = find_uniq_paths(g, c[i], ref, '-', depth=depth)

                if f_hits >=uniq_paths and r_hits >= uniq_paths and check_edge_weight(g, c[i], c[i+1]) >= weight*len(g.list_graph):
                    print(name, g.genes_decode[c[i+1]], f_hits, g.genes_decode[c[i]], r_hits)



def check_conservativity(graph, start, end, main_chain, source, target, depth=100, filter=0.5):
    source_index = main_chain.index(source)
    target_index = main_chain.index(target)

    is_uniq_l = 0
    is_uniq_r = 0

    conservative = 0
    

    for genome in graph.list_graph:
        for contig in graph.list_graph[genome]:

            c = graph.list_graph[genome][contig]

            if start not in c or end not in c:
                continue

            start_index = c.index(start)
            end_index = c.index(end)

            for i in range(1, depth):
                try:
                    if c[start_index - i] in main_chain and c[start_index - i]:
                        if abs(main_chain.index(c[start_index - i]) - source_index) < depth:
                            is_uniq_l = 1
                            break
                        if abs(main_chain.index(c[start_index - i]) - target_index) < depth:
                            is_uniq_l = 1
                            break

                except:
                    pass
            for i in range(1, depth):
                try:
                    
                    if c[end_index + i] in main_chain and c[end_index + 1]:
                        if abs(main_chain.index(c[end_index + i]) - source_index) < depth:
                            is_uniq_r = 1
                            break
                        if abs(main_chain.index(c[end_index + i]) - target_index) < depth:
                            is_uniq_r = 1
                            break

                except:
                    pass
            if max(is_uniq_l, is_uniq_r) == 0:
                if check_intersection(graph, main_chain[source_index+1:target_index], genome, contig, filter=filter):
                    conservative += 1
                    

                
            is_uniq_l = 0
            is_uniq_r = 0
    return conservative



def check_intersection(graph, insertion_seq, genome, contig, filter=0.5):



    c = graph.list_graph[genome][contig]
    if insertion_seq[0] not in c or insertion_seq[-1] not in c:
        return False

    start_index = c.index(insertion_seq[0])
    end_index = c.index(insertion_seq[-1])

    if start_index > end_index:
        start_index, end_index = end_index, start_index


    set_1 = set(insertion_seq)
    set_2 = set(c[start_index:end_index + 1])


    if len(set_1.intersection(set_2)) < 0.5 * max(len(set_2), len(set_1)):
        return False

    return True
    
    

            
def reverse_graph(graph):
    reversed_graph = {}

    for node in graph.dict_graph:
        for node2 in graph.dict_graph[node]:
            if node2 not in reversed_graph:
                reversed_graph[node2] = [node]
            else:
                reversed_graph[node2].append(node) 

    return reversed_graph   


def find_smile_template(graph, depth=100, max_insertion_len=20, non_conservativity=5, allowed_deviating=2, filter=0.5):

    hits_sum = 0
    
    reversed_graph = reverse_graph(graph)
    for genome in graph.list_graph:
        
        print('Genome: ' + genome)
        
        for contig in graph.list_graph[genome]:
            hits = []
            print('\nContig: ' + contig)
            print('Template search...')
            c = graph.list_graph[genome][contig]

            for i in range(len(c)):
                
                
                for j in range(4, max_insertion_len):
                    
                    skipped = False

                    

                    if i + j >= len(c):
                        continue

                    for node in c[i+2:i + j - 1]:
                        try:
                            if len(graph.dict_graph[node]) > allowed_deviating or len(reversed_graph[node]) > allowed_deviating:
                                skipped = True
                                break
                        except:
                            break
                    
                    if skipped == True:
                        continue

                    if check_conservativity(graph, c[i+1], c[i+j-1], c, c[i], c[i+j], depth=depth, filter=filter) >= non_conservativity:
                        hits.append((graph.genes_decode[c[i]], graph.genes_decode[c[i+j]]))
                    
                
                
            print('Hits:')
            print(hits)
            hits_sum += len(hits)
        print('--------------------')

    print('SUM: ' + str(hits_sum))


print('Input file: ' + args.input_file)
g = GenomeGraph()
g.read_graph(args.input_file, generate_freq=True)
find_smile_template(g, allowed_deviating=args.ad, non_conservativity=args.nc, depth=args.d, max_insertion_len=args.il, filter=args.ip)




