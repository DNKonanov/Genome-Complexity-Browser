import argparse
import numpy as np
from numpy.random import rand, randint, exponential

parser = argparse.ArgumentParser()

parser.add_argument('-o', '--output_file', default='model.sif', type=str, help='output file (default model.sif)')
parser.add_argument('--iter', default=500, type=int, help='number of iterations (default is 500)')
parser.add_argument('--org_num', default=100, type=int, help='number of organisms in Simulation (default is 100)')
parser.add_argument('--orb', default=10000, type=int, help='number of orbital genes (default is 10000)')
parser.add_argument('--invers_dist', default='no', type=str, help='file with inversions frequency distribution (5000 points)')
parser.add_argument('--insert_dist', default='no', type=str, help='file with insertions frequency distribution (5000 points)')
parser.add_argument('--delete_dist', default='no', type=str, help='file with deletions frequency distribution (5000 points)')
parser.add_argument('--transf_dist', default='no', type=str, help='file with HT frequency distribution (5000 points)')
parser.add_argument('--inv_prob', default=0.5, type=float, help='frequency of inversions, default is 0.5')
parser.add_argument('--ins_prob', default=0.5, type=float, help='frequency of insertions/deletions, default is 0.5')
parser.add_argument('--HT_prob', default=0.5, type=float, help='frequency of horizontal transfers, default is 0.5')
parser.add_argument('--inv_len', default=0.005, type=float, help='exponential coef in length distribution of inversions, default is 0.005')
parser.add_argument('--ins_len', default=0.005, type=float, help='exponential coef in length distribution of insertions/deletions, default is 0.005')
parser.add_argument('--HT_len', default=0.005, type=float, help='exponential coef in length distribution of horizontal transfers, default is 0.005')

args = parser.parse_args()




def choose_gene(sum_dist):

	s = np.max(sum_dist)
	r = rand() * s
	for i in range(len(sum_dist)):
		if sum_dist[i] > r:
			return i


invers_dist = [float(line[:-1]) for line in open(args.invers_dist)]
insert_dist = [float(line[:-1]) for line in open(args.insert_dist)]
delete_dist = [float(line[:-1]) for line in open(args.delete_dist)]
transf_dist = [float(line[:-1]) for line in open(args.transf_dist)]

sum_invers_dist = [np.sum(invers_dist[:i]) for i in range(len(invers_dist))]
sum_insert_dist = [np.sum(insert_dist[:i]) for i in range(len(insert_dist))]
sum_delete_dist = [np.sum(delete_dist[:i]) for i in range(len(delete_dist))]
sum_transf_dist = [np.sum(transf_dist[:i]) for i in range(len(transf_dist))]



orbital_genes = [i for i in range(5000,5000 + args.orb)]

base_genomes = [[i for i in range(5000)] for i in range(args.org_num)]

print('Simulation:')

for i in range(args.iter):
	print('\tMutation ' + str(i), end ='')
	r = index = randint(0, len(base_genomes))

	current_genome = base_genomes[r].copy()

	#insert + delete
	if rand() < args.ins_prob:

		length = int(exponential(args.ins_len)*len(current_genome))
		insert_gene = choose_gene(sum_insert_dist)
		del_gene = choose_gene(sum_delete_dist)
		insert_seq = []
		misses = 0
		while len(insert_seq) < length:
			r = randint(0, len(orbital_genes))

			if orbital_genes[r] not in current_genome and current_genome not in insert_seq:
				insert_seq.append(orbital_genes[r])
				misses = 0

			else:
				misses += 1

			if misses > 10:
				break

		if len(insert_seq) == length:
			current_genome = current_genome[:insert_gene] + insert_seq + current_genome[insert_gene:]

		del_index = del_gene
		if rand() < 0.5:
			if del_index - length < 0:
				current_genome = current_genome[length - del_index: -del_index]

			else:
				current_genome = current_genome[0:del_index - length] + current_genome[del_index:]

		else:
			if del_index + length > len(current_genome):
				current_genome = current_genome[len(current_genome) - del_index: len(current_genome) - del_index - length]

			else:
				current_genome = current_genome[0:del_index] + current_genome[del_index + length:]

		base_genomes.pop(index)
		base_genomes.append(current_genome)


	#inverse
	if rand() < args.inv_prob:
		gene1 = choose_gene(sum_invers_dist)
		length = int(exponential(args.inv_len)*len(current_genome))
		
		if rand() < 0.5:
			gene2 = gene1 + length

		else:
			gene2 = gene1 - length

		gene2 = choose_gene(sum_invers_dist)
		length = abs(gene1 - gene2)

		inverse_seq = current_genome[min(gene1,gene2):max(gene2, gene1)].copy()
		inverse_seq.reverse()

		current_genome = current_genome[:min(gene1,gene2)] + inverse_seq + current_genome[max(gene2, gene1):]
		base_genomes.pop(index)
		base_genomes.append(current_genome)


	#HT + delete
	if rand() < args.HT_prob:
		gene1 = choose_gene(sum_transf_dist)

		length = int(exponential(args.HT_len)*len(current_genome))


		if rand() < 0.5:
			gene2 = gene1 + length

		else:
			gene2 = gene1 - length

		HT_seq = current_genome[min(gene1, gene2):max(gene1, gene2)]

		other_index = randint(0, len(base_genomes))
		while other_index == index:
			other_index = randint(0, len(base_genomes))

		other_genome = base_genomes[other_index].copy()

		for gene in range(len(HT_seq)):
			if HT_seq[gene] in other_genome:
				r = randint(0, len(orbital_genes))
				while orbital_genes[r] in HT_seq or orbital_genes[r] in other_genome:
					r = randint(0, len(orbital_genes))

				HT_seq[gene] = orbital_genes[r]


		del_index = choose_gene(sum_delete_dist)
		if rand() < 0.5:
			if del_index - length < 0:
				other_genome = HT_seq[length - del_index:] + other_genome[length - del_index: -del_index] + HT_seq[:length - del_index]

			else:
				other_genome = other_genome[0:del_index - length] + HT_seq + other_genome[del_index:]

		else:
			if del_index + length > len(other_genome):
				other_genome = HT_seq[length - del_index:] + other_genome[len(other_genome) - del_index: len(other_genome) - del_index - length] + HT_seq[:length - del_index]

			else:
				other_genome = other_genome[0:del_index] + HT_seq + other_genome[del_index + length:]

		base_genomes.pop(other_index)
		base_genomes.append(other_genome)

	print('\r', end='')

print('Simulation completed!')

print('Writing file...')
out = open(args.output_file, '+a')

org = 0
for new_array in base_genomes:
    
    for i in range(len(new_array) - 1):
        out.write('OG' + str(new_array[i]) + ' OG' + str(new_array[i + 1]) + ' org' + str(org) + ' c_' + str(org) + '\n')

    org += 1

    
ref = [i for i in range(5000)]
for i in range(len(ref) - 1):
    out.write('OG' + str(ref[i]) + ' ' + 'OG' + str(ref[i + 1]) + ' ' + 'org_ref c_ref' + '\n')

print('Completed!')
