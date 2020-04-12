from argparse import ArgumentParser

parser = ArgumentParser()
parser.add_argument('-sif', default=None, type=str, help='path to the sif file')
args = parser.parse_args()

path = ''
name = args.sif.split('.sif')[0]
if '/' in args.sif:
    path = '/'.join(args.sif.split('/')[:-1])
    name = args.sif.split('/')[-1].split('.sif')[0]

graph = {}

for line in open(args.sif, 'r'):
    gene1, gene2, genome, contig = line[:-1].split(' ')

    if genome not in graph:
        graph[genome] = {}
    if contig not in graph[genome]:
        graph[genome][contig] = [gene2]
    
    graph[genome][contig].append(gene2)

for genome in graph:
    for contig in graph[genome]:
        graph[genome][contig].reverse()

out = open(path + '/' + name + '_reversed.sif', 'w')

for genome in graph:
    for contig in graph[genome]:
        c = graph[genome][contig]

        for i in range(len(c)-1):
            out.write(c[i] + ' ' + c[i+1] + ' ' + genome + ' ' + contig + ' \n')

out.close()
