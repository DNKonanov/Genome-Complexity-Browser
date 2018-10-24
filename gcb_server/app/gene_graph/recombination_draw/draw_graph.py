import graphviz
from graphviz import Graph
from pygraphviz import AGraph
import math
import time


def get_json_graph(input_subgraph, freq_min, da=True):
    f_in = input_subgraph
    genes = set([])
    bonds = []

    aim_chain = set([])
    ref_chain = []

    last = ''

    for i in f_in:
        i = i +'\n'
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

    bonds = compute_frequence(bonds)
    genes = list(genes)

    print('Rendering...')
    json_graph = to_json_representation([genes, bonds], ref_chain=ref_chain,
                                        aim_chain=aim_chain, freq_min=freq_min, draw_all=da)
    return json_graph

# Returns JSON representation of subgraph ready for frontend consumption


def to_json_representation(input_subgraph, ref_chain=[], aim_chain=[], freq_min=1, draw_all=False):

    # Deleting nodes that occures less than freq_min times
    nodes = delete_nodes(ref_chain, input_subgraph[1], freq_min)

    print('Number of nodes: ', end='')

    if draw_all == False:
        print(len(nodes))
    elif draw_all == True:
        print(len(input_subgraph[1]))

    nodes_list = []
    nodes_list.append({'data':
                            {'id': 'main_ref'}})

    for i in range(len(ref_chain)):
        shape = 'circle'
        if ref_chain[i] in aim_chain:
            nodes_list.append({'data':
                {'id': ref_chain[i], 'shape': shape, 'color': '#ff0000', 'parent':'main_ref'}})
        else:
            nodes_list.append({'data':
                {'id': ref_chain[i], 'shape': shape, 'color': 'pink',  'parent':'main_ref'}})

    for i in input_subgraph[0]:
        if 'PATH' in i:
            shape = 'box'

        if i in aim_chain or i in ref_chain:
            continue

        if i in nodes:
            nodes_list.append({'data':{'id': str(i), 'shape': shape, 'color': 'green'}})
            continue

        else:
            if draw_all == True:
                nodes_list.append({'data':
                    {'id': str(i), 'shape': shape, 'color': 'grey'}})
                continue
    # print(nodes_list)

    edges_list = []
    for i in input_subgraph[1]:
        color = 'black'
        try:
            if ref_chain.index(i[1]) - ref_chain.index(i[0]) == 1:
                color = 'red'
                edges_list.append({'data':{'source': str(i[0]), 'target': str(i[1]),
                                    'color': '#ff0000', 'penwidth': str(math.sqrt(i[2]))}})
                continue
        except ValueError:
            pass

        if i[2] < freq_min:
            if draw_all == True:
                edges_list.append({'data':{'source': str(i[0]), 'target': str(i[1]),
                                   'color': 'grey', 'penwidth': str(math.sqrt(i[2]))}})

            continue

        elif i[0] in nodes and i[1] in nodes:
            edges_list.append({'data':{'source': str(i[0]), 'target': str(i[1]),
                               'color': color, 'penwidth': str(math.sqrt(i[2]))}})

        elif draw_all == True:
            edges_list.append({'data':{'source': str(i[0]), 'target': str(i[1]),
                               'color': 'grey', 'penwidth': str(math.sqrt(i[2]))}})

    # print(edges_list)

    return {'nodes': nodes_list, 'edges': edges_list}


def draw_graph(input_file, out, ref_chain=[], aim_chain=[], freq_min=1, draw_all=False):
    ps = AGraph(directed=True)
    ps.graph_attr['rankdir'] = 'LR'
    ps.graph_attr['mode'] = 'hier'

    # Deleting nodes that occures less than freq_min times
    nodes = delete_nodes(ref_chain, input_file[1], freq_min)

    print('Number of nodes: ', end='')

    if draw_all == False:
        print(len(nodes))
    elif draw_all == True:
        print(len(input_file[1]))

    cluster_main = ps.add_subgraph()
    cluster_main.graph_attr['rank'] = '0'

    nodes_list = []

    for i in range(len(ref_chain)):
        shape = 'circle'
        if ref_chain[i] in aim_chain:
            cluster_main.add_node(ref_chain[i], shape=shape, color='red')
            nodes_list.append(
                {'id': ref_chain[i], 'shape': shape, 'color': 'red'})
        else:
            cluster_main.add_node(ref_chain[i], shape=shape, color='pink')
            nodes_list.append(
                {'id': ref_chain[i], 'shape': shape, 'color': 'pink'})

    for i in input_file[0]:
        if 'PATH' in i:
            shape = 'box'

        if i in aim_chain or i in ref_chain:
            continue

        if i in nodes:
            ps.add_node(str(i))
            nodes_list.append({'id': str(i), 'shape': shape, 'color': 'green'})
            continue

        else:
            if draw_all == True:
                nodes_list.append(
                    {'id': str(i), 'shape': shape, 'color': 'grey'})
                ps.add_node(str(i), color='grey')
                continue
    print(nodes_list)

    edges_list = []
    for i in input_file[1]:
        color = 'black'
        try:
            if ref_chain.index(i[1]) - ref_chain.index(i[0]) == 1:
                color = 'red'
                ps.add_edge(str(i[0]), str(i[1]), color=color,
                            penwidth=str(math.sqrt(i[2])))
                edges_list.append({'source': str(i[0]),
                                   'target': str(i[1]),
                                   'color': color,
                                   'penwidth': str(math.sqrt(i[2]))})
                continue
        except ValueError:
            pass

        if i[2] < freq_min:
            if draw_all == True:
                ps.add_edge(str(i[0]), str(i[1]), color='grey', penwidth=str(
                    math.sqrt(i[2])), constraint='false')
                edges_list.append({'source': str(i[0]),
                                   'target': str(i[1]),
                                   'color': 'grey',
                                   'penwidth': str(math.sqrt(i[2]))})

            continue

        elif i[0] in nodes and i[1] in nodes:
            ps.add_edge(str(i[0]), str(i[1]), color=color,
                        penwidth=str(math.sqrt(i[2])))
            edges_list.append({'source': str(i[0]),
                               'target': str(i[1]),
                               'color': color,
                               'penwidth': str(math.sqrt(i[2]))})

        elif draw_all == True:
            ps.add_edge(str(i[0]), str(i[1]), color='grey',
                        penwidth=str(math.sqrt(i[2])), constraint='false')
            edges_list.append({'source': str(i[0]),
                               'target': str(i[1]),
                               'color': 'grey',
                               'penwidth': str(math.sqrt(i[2]))})

    print(edges_list)
    ps.draw(out + '.ps', prog='dot', format='png')
    ps.write(out + '.dot')


def compute_frequence(edges):
    edges.sort()
    for i in range(len(edges) - 1):
        for j in range(i+1, len(edges)):
            if edges[i][0] == edges[j][0] and edges[i][1] == edges[j][1]:
                edges[i][2] += 1
                edges[j][2] = -len(edges)
            else:
                break
    edges_frequency = []
    for i in edges:
        if i[2] > 0:
            edges_frequency.append(i)
    return edges_frequency


def delete_nodes(ref_chain, bonds, freq_min):
    nodes = []
    nodes = set(ref_chain.copy())
    count = 1

    while (count > 0):
        count = 0
        for i in bonds:
            if i[2] < freq_min:
                continue
            if i[0] in nodes and i[1] in nodes:
                continue
            if (i[0] in nodes or i[1] in nodes):
                nodes.add(i[0])
                nodes.add(i[1])
                count += 1

    return list(nodes)
