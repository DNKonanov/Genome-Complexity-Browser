import matplotlib.pyplot as plt
import pandas as pd

result = pd.read_csv('sin_out/prob_window_complexity_contig_c_ref.txt', sep='\t', header=None, names = ['gene', 'complexity'])
dist = pd.read_csv('sin', header=None, names=['freq'])

fig, axs = plt.subplots(2, 1)

axs[0].plot(dist.freq)
axs[1].plot(result.complexity)
axs[0].set_xlabel('position, node')
axs[1].set_xlabel('position, node')
axs[0].set_ylabel('rearrangements frequency')
axs[1].set_ylabel('complexity')
plt.tight_layout()
plt.savefig('sin_result.png', dpi=300, format='png')
plt.show()
