import numpy as np





def extract_hotspot_coordinates(complexity, positions, coef=1.5):

    median = np.median(complexity)
    quan_dist = np.quantile(complexity, 0.75) - np.quantile(complexity, 0.25)

    threshold = median + quan_dist*coef


    val = -0.1* np.max(complexity)

    hotspots = []

    hotspots_sym = []

    for i in range(len(positions)):
        if complexity[i] > threshold:
            hotspots.append(positions[i])
            hotspots_sym.append('+')

        else:
            hotspots_sym.append('-')

    return [hotspots, [val for _ in hotspots], hotspots_sym]