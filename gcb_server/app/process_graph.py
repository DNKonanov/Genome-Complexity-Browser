


def delete_double_edges(graph):

    edges = graph['edges']

    checked = {}
    double_edges = {}
    for e in edges:
        if (e['data']['target'], e['data']['source']) in checked:
            if float(e['data']['penwidth']) > checked[(e['data']['target'], e['data']['source'])]:
                remove = checked.pop((e['data']['target'], e['data']['source']), None)
            else:
                continue
        checked[(e['data']['source'], e['data']['target'])] = float(e['data']['penwidth'])

    new_edges = []
    for e in edges:
        if e['data']['color'] == '#ff0000':
            new_edges.append(e)
            continue
        if (e['data']['source'], e['data']['target']) in checked:
            new_edges.append(e)
    
    graph['edges'] = new_edges
    return graph