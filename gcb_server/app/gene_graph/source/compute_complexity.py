import random
import time
from collections import OrderedDict


def divide_by_stamm(edge_table):

	print('\n\tDividing to stamms...')
	stamm_table = OrderedDict([])

	for edge in edge_table:

		start_gene = edge[0]
		end_gene = edge[1]
		stamm = edge[2]

		if stamm not in stamm_table:
			stamm_table.update([(stamm, [[start_gene, end_gene]])])
			continue

		if start_gene == stamm_table[stamm][-1][-1]:
			stamm_table[stamm][-1].append(end_gene)
			continue

		else:
			stamm_table[stamm].append([start_gene, end_gene])
			continue


	print('\tDividing to stamms completed!!!')
	
	return stamm_table

def generate_graph(edge_table):

	print('-----------------------')
	t = time.time()
	print('Generating of graph...')
	graph = divide_by_stamm(edge_table)

	for stamm in graph:
		graph[stamm].sort(key=len, reverse=True)

	print('Completed!')
	print('Graph generation time:\t' + str(int(time.time()*100 - t*100)/100) + 's\n')

	return graph



def create_full_graph(edge_table):

	print('\nCreating of full graph...')

	full_graph = OrderedDict([])

	for edge in edge_table:

		start_gene = edge[0]
		end_gene = edge[1]

		if start_gene not in full_graph:
			full_graph.update([(start_gene, [])])

		if end_gene not in full_graph[start_gene]:

			full_graph[start_gene].append(end_gene)

	print('Full graph creating completed!\n')

	return full_graph




def find_stat_paths_from_gene(full_graph, start, main_chain, depth, iterations):

	start_index = main_chain.index(start)

	Paths = []


	for i in range(iterations):

		path = [start]

		current_gene = start

		break_point = 0

		while len(path) <= depth:

			if current_gene not in full_graph:
				break

			if break_point > 10:
				break

			if path[-1] in main_chain and path[-1] != start:

				if path not in Paths:
					Paths.append(path)
				break


			r = random.randint(0, len(full_graph[current_gene]) - 1)

			current_gene = full_graph[current_gene][r]

			if current_gene not in full_graph:
				break

			if current_gene in path:

				break_point += 1
				continue

			break_point = 0
			path.append(current_gene)

	return Paths



def find_paths_from_gene(graph, start, main_chain):

	Paths = []

	

	for stamm in graph:

		for contig in graph[stamm]:


			stamm_chain = contig

			if start in stamm_chain:

				path = [start]

				index = stamm_chain.index(start)
				for gene in stamm_chain[index + 1:]:
					path.append(gene)
					
					if gene in main_chain:

						if path in Paths:
							break


						Paths.append(path)

						break


	return Paths


def compute_stat_complexity(graph, main_chain, window=20, depth=10000, iterations=500):


	IO_complexity_table = OrderedDict([])
	all_bridges_table = OrderedDict([])
	window_complexity_table = OrderedDict([])

	base_genes = []
	for gene in main_chain:
		if gene not in base_genes:
			base_genes.append(gene)
			IO_complexity_table.update([(gene, 0)])
			window_complexity_table.update([(gene, 0)])


	N = len(base_genes)
	num = 1

	for gene in base_genes:
		print('Computing with ' + gene + ':\t' + str(num) + ' from ' + str(N), end='')
		num += 1

		found_paths = find_stat_paths_from_gene(graph, gene, main_chain, depth, iterations)

		for p in found_paths:

			bridge = (p[0], p[-1])

			if bridge not in all_bridges_table:
				all_bridges_table.update([(bridge, 1)])

			elif bridge in all_bridges_table:
				all_bridges_table[bridge] += 1


			IO_complexity_table[p[0]] += 1
			IO_complexity_table[p[-1]] += 1

			start_index = main_chain.index(p[0])
			end_index = main_chain.index(p[-1])

			if abs(start_index - end_index) <= window:

				for i in range(min(start_index, end_index), max(start_index, end_index) + 1):

					window_complexity_table[main_chain[i]] += 1

		print('\r', end='')

	for og in window_complexity_table:
		window_complexity_table[og] = window_complexity_table[og]/(min(N, base_genes.index(og) + window) - max(0, base_genes.index(og) - window))
	print()


	return [IO_complexity_table, all_bridges_table, window_complexity_table]


def generate_subgraph(graph, start_node, end_node, reference_chain, reference, window=20, tails=0, depth=-1):
	t = time.time()
	print('Generating subgraph...')

	subgraph = {}
	print('Reference is ' + reference)
	
	c = 0
	while (True):
		try:
			start = graph[reference][c][:].index(start_node)
			end = graph[reference][c][:].index(end_node)
			break


		except ValueError:
			c += 1
			pass

	if start > end:
		start, end = end, start

	base_chain = graph[reference][c][max(0, start - window):min(len(graph[reference][c]) - 1, end + window + 1)]

	if depth == -1:
		depth = len(base_chain)

	aim_chain = graph[reference][c][start:end + 1].copy()

	subgraph.update([( reference, [base_chain.copy()] )])

	for stamm in graph:
		if stamm not in subgraph:
			contigs = [[]]

			for j in graph[stamm]:
				current_depth = 0
				for gene in range(len(j)):
					if j[gene] in base_chain and contigs[-1] == []:
						current_depth = 0
						contigs[-1] = j[max(0, gene - tails):gene + 1]
					else:
						if contigs[-1] == []:
							continue

						contigs[-1].append(j[gene])
						if contigs[-1][-1] in base_chain and contigs[-1][-2] in base_chain:
							current_depth = 0
							continue

						else:
							current_depth += 1

						if current_depth >= depth:

							contigs[-1] = contigs[-1][:min(-depth + tails - 1, -0)]
							current_depth = 0
							contigs.append([])
							continue

						if j[gene] == j[-1]:

							contigs[-1] = contigs[-1][:min(-current_depth + tails - 1, -0)]
							current_depth = 0
							contigs.append([])
							continue

			subgraph.update([(stamm, contigs)])


	All_nodes = set([])

	for stamm in subgraph:
		for contig in subgraph[stamm]:
			for gene in contig:
				All_nodes.add(gene)

	l = graph[reference][c].index(subgraph[reference][0][0])
	r = graph[reference][c].index(subgraph[reference][0][-1])

	while True:
		if graph[reference][0][l - 1] in All_nodes:
			subgraph[reference][0] = [graph[reference][0][l - 1]] + subgraph[reference][0]
			for stamm in graph:
				for j in graph[stamm]:
					try:
						if j.index(graph[reference][0][l]) - j.index(graph[reference][0][l - 1]) == 1:
							subgraph[stamm].append([graph[reference][0][l - 1], graph[reference][0][l]])

					except ValueError:
						pass

			l -= 1

		else:
			break

	while True:
		if graph[reference][0][r + 1] in All_nodes:
			subgraph[reference][0] = subgraph[reference][0] + [graph[reference][0][r + 1]]

			for stamm in graph:
				for j in graph[stamm]:
					try:
						if j.index(graph[reference][0][r + 1]) - j.index(graph[reference][0][r]) == 1:
							subgraph[stamm].append([graph[reference][0][r], graph[reference][0][r + 1]])

					except ValueError:
						pass
			r += 1

		else:
			break

	print('Completed!')
	print('Generating subgraph time:\t' + str(int(time.time()*100 - t*100)/100) + 's')

	return subgraph, aim_chain

def compute_complexity(graph, main_chain, window=20):
	IO_complexity_table = OrderedDict([])
	all_bridges_table = OrderedDict([])
	window_complexity_table = OrderedDict([])

	base_genes = []
	for gene in main_chain:
		if gene not in base_genes:
			base_genes.append(gene)
			IO_complexity_table.update([(gene, 0)])
			window_complexity_table.update([(gene, 0)])

	N = len(base_genes)
	num = 1
	for gene in base_genes:

		print('Computing with ' + gene + ':\t' + str(num) + ' from ' + str(N), end='')
		num += 1

		found_paths = find_paths_from_gene(graph, gene, main_chain)

		for p in found_paths:

			bridge = (p[0], p[-1])

			if bridge not in all_bridges_table:
				all_bridges_table.update([(bridge, 1)])

			elif bridge in all_bridges_table:
				all_bridges_table[bridge] += 1
			
			IO_complexity_table[p[0]] += 1
			IO_complexity_table[p[-1]] += 1

			start_index = main_chain.index(p[0])
			end_index = main_chain.index(p[-1])

			if abs(start_index - end_index) <= window:
				for i in range(min(start_index, end_index), max(start_index, end_index) + 1):
					window_complexity_table[main_chain[i]] += 1

		print('\r', end='')

	for og in window_complexity_table:
		window_complexity_table[og] = window_complexity_table[og]/(min(N, base_genes.index(og) + window) - max(0, base_genes.index(og) - window))

	print()

	return [IO_complexity_table, all_bridges_table, window_complexity_table]

