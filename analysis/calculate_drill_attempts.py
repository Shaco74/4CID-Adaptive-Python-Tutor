import pandas as pd
import glob
from pathlib import Path
import matplotlib.pyplot as plt
import seaborn as sns
import matplotlib.patches as mpatches
import numpy as np

# Same standards:
GROUP_COLORS = {'A': '#4C9BE8', 'B': '#E84C4C'}
GROUP_HATCH = {'A': '', 'B': '///'}

# Find files
export_dir = Path('analysis/exports')
participants_file = sorted(export_dir.glob('study_participants-*.csv'))[-1]
events_file = sorted(export_dir.glob('study_event_timeline-*.csv'))[-1]
drills_file = sorted(export_dir.glob('study_drill_events-*.csv'))[-1]

participants = pd.read_csv(participants_file)
events = pd.read_csv(events_file)
drills = pd.read_csv(drills_file)

# Filter admins
admin_mask = participants['participant_id'].astype(str).str.lower() == 'admin'
valid_ids = set(participants.loc[~admin_mask, 'participant_id'].astype(str))
events = events[events['participant_id'].astype(str).isin(valid_ids)].copy()

events['timestamp'] = pd.to_datetime(events['timestamp'])
drill_comps = events[events['event_type'].isin(['drill_mcq_completed', 'drill_code_completed'])].copy()
drill_comps['success'] = pd.to_numeric(drill_comps['success'], errors='coerce').fillna(0)

# Sort by time
drill_comps = drill_comps.sort_values(['participant_id', 'session_id', 'timestamp'])

# In the timeline, we don't have drill_id, but the session groups them. Wait, what about MCQ vs Code within a session?
# Usually one mcq and one code drill per session in 4C/ID. We should separate attempts for mcq vs attempts for code!
# Group by: participant_id, session_id, event_type (since there is 1 mcq and 1 code per session mostly)
results = []
for (pid, sid, etype), grp in drill_comps.groupby(['participant_id', 'session_id', 'event_type']):
    group_val = grp['group'].iloc[0]
    # find the index where success == 1
    success_flags = grp['success'].values
    
    if 1 in success_flags:
        # Number of attempts until first success
        attempts = list(success_flags).index(1) + 1
        solved = True
    else:
        attempts = len(success_flags)
        solved = False

    results.append({
        'participant_id': pid,
        'group': group_val,
        'drill_type': 'MCQ' if 'mcq' in etype else 'Code',
        'attempts_to_solve': attempts,
        'solved': solved
    })

res_df = pd.DataFrame(results)
print("Total drill tasks completed logic:")
print(res_df['solved'].value_counts())

# Now we categorize them
def bin_attempts(n):
    if n == 1: return '1. Versuch'
    if n == 2: return '2. Versuch'
    if n == 3: return '3. Versuch'
    return '4+ Versuche'

res_df['attempt_bin'] = res_df['attempts_to_solve'].apply(bin_attempts)

bin_order = ['1. Versuch','2. Versuch','3. Versuch','4+ Versuche']
# Counts
summary = res_df[res_df['solved']].groupby(['group', 'attempt_bin']).size().reset_index(name='count')
totals = summary.groupby('group')['count'].transform('sum')
summary['pct'] = (summary['count'] / totals * 100).round(1)

print("\n--- Summary ---")
print(summary)

# Plot
fig, ax = plt.subplots(figsize=(10, 6))
groups = ['A', 'B']
x_pos = np.arange(len(bin_order))
width = 0.35

for i, g in enumerate(groups):
    g_data = summary[summary['group'] == g].set_index('attempt_bin')
    vals = [g_data.loc[b, 'pct'] if b in g_data.index else 0 for b in bin_order]
    
    offset = (i - 0.5) * width
    bars = ax.bar(
        x_pos + offset, vals, width,
        color=GROUP_COLORS.get(g, 'gray'),
        edgecolor='black',
        hatch=GROUP_HATCH.get(g, ''),
        label=f'Gruppe {g}'
    )
    # labels
    for bar, val in zip(bars, vals):
        if val > 0:
            ax.text(bar.get_x() + bar.get_width()/2, val + 1, f'{val:.1f}%', ha='center', va='bottom', fontsize=9, fontweight='bold')

ax.set_xticks(x_pos)
ax.set_xticklabels(bin_order, fontsize=11)
ax.set_ylabel('Prozent der gelösten Drills (%)', fontsize=12, fontweight='bold')
ax.set_title('Benötigte Versuche zur Lösung eines Drills (Gruppe A vs. B)', fontsize=14, fontweight='bold', pad=15)
ax.legend(fontsize=11)

OUT_DIR = Path('analysis/output/neu')
OUT_DIR.mkdir(parents=True, exist_ok=True)
plt.savefig(OUT_DIR / 'drill_attempts_plot_detailed.png', dpi=200, bbox_inches='tight')
res_df.to_csv(OUT_DIR / 'drill_attempts_details.csv', index=False)
summary.to_csv(OUT_DIR / 'drill_attempts_summary.csv', index=False)
print("Plots and data saved in analysis/output/neu/")
