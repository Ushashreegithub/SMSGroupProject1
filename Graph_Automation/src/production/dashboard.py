import os

import matplotlib.pyplot as plt
import matplotlib.dates as mdates

from matplotlib.patches import Rectangle
from matplotlib.ticker import FuncFormatter


def plot_production_dashboard(df, output_folder):

    # ======================================================
    # FIGURE
    # ======================================================

    fig = plt.figure(
        figsize=(16, 9),
        facecolor="white"
    )

    # ======================================================
    # LEFT GREEN STRIP
    # ======================================================

    ax_left = fig.add_axes([
        0.02,
        0.06,
        0.023,
        0.90
    ])

    # ======================================================
    # HEADER
    # ======================================================

    ax_header = fig.add_axes([
        0.07,
        0.83,
        0.90,
        0.13
    ])

    # ======================================================
    # MAIN CHART
    # ======================================================

    ax = fig.add_axes([
        0.065,
        0.10,
        0.89,
        0.68
    ])

    ax_left.axis("off")
    ax_header.axis("off")

    # ======================================================
    # LEFT GREEN PANEL
    # ======================================================

    ax_left.add_patch(
        Rectangle(
            (0, 0),
            1,
            1,
            transform=ax_left.transAxes,
            color="#0B7A18"
        )
    )

    ax_left.text(
        0.5,
        0.5,
        "Production: Khurda (India)",
        rotation=90,
        ha="center",
        va="center",
        color="white",
        fontsize=12,
        fontweight="bold"
    )

    # ======================================================
    # CHART TITLE
    # ======================================================

    ax_header.text(
        0.5,
        0.80,
        "Production Capacity Planning",
        ha="center",
        va="center",
        fontsize=18,
        fontweight="bold"
    )

   

    months = df["Month"]

    orders = df["Orders"]

    loi = df["LOI"]

    service = df["Service Basic"]

    smi = df["SMI"]

    labour_capacity = df["NPK +LABOUR SUPPLY Capacity"]

    total_capacity = df["NPK + Labour Supply+ Job contractor capacity"]

# ======================================================
# STACKED VALUES
# ======================================================

    bottom_loi = orders

    bottom_service = orders + loi

    remaining_smi = labour_capacity - (orders + loi + service)

# ======================================================
# GREY CAPACITY AREA
# ======================================================

    ax.fill_between(
    months,
    total_capacity,
    0,
    color="#D9D9D9",
    zorder=1,
)

# ======================================================
# CAPACITY LINES
# ======================================================

    ax.plot(
    months,
    labour_capacity,
    color="green",
    linewidth=2,
    marker="o",
    markersize=5,
    label="Labour Supply",
    zorder=6,
)

    ax.plot(
    months,
    total_capacity,
    color="black",
    linewidth=2.5,
    marker="o",
    markersize=5,
    label="Total Capacity",
    zorder=7,
)

# ======================================================
# STACKED BARS
# ======================================================

    bar_width = 18

    ax.bar(
    months,
    orders,
    width=bar_width,
    color="#5B8CCB",
    edgecolor="black",
    linewidth=0.4,
    label="Orders",
    zorder=3,
)

    ax.bar(
    months,
    loi,
    bottom=bottom_loi,
    width=bar_width,
    color="#1F3D66",
    edgecolor="black",
    linewidth=0.4,
    label="LOI",
    zorder=4,
)

    ax.bar(
    months,
    service,
    bottom=bottom_service,
    width=bar_width,
    color="#13A113",
    edgecolor="black",
    linewidth=0.4,
    label="Service Basic",
    zorder=5,
)

    ax.bar(
    months,
    remaining_smi,
    bottom=orders + loi + service,
    width=bar_width,
    color="#808080",
    edgecolor="black",
    linewidth=0.4,
    label="SMI",
    zorder=5,
)

# ======================================================
# AXES
# ======================================================

    ax.set_ylim(0, max(total_capacity) * 1.20)

    ax.yaxis.set_major_formatter(
    FuncFormatter(lambda x, pos: f"{int(x):,}")
)

    ax.set_ylabel(
    "Hours",
    fontsize=11,
    fontweight="bold",
)

    ax.xaxis.set_major_formatter(
    mdates.DateFormatter("%b-%y")
)

    ax.xaxis.set_major_locator(
    mdates.MonthLocator(interval=1)
)

    plt.setp(

        ax.get_xticklabels(),
        rotation=0,
        fontsize=9,
)

# ======================================================
# GRID
# ======================================================

    ax.grid(
    axis="y",
    linestyle="--",
    alpha=0.45,
)

    ax.set_axisbelow(True)

# ======================================================
# LEGEND
# ======================================================

    ax.legend(
    loc="upper center",
    bbox_to_anchor=(0.5, 1.03),
    ncol=6,
    frameon=False,
    fontsize=9,
)

    # ======================================================
    # SAVE
    # ======================================================

    os.makedirs(output_folder, exist_ok=True)

    plt.savefig(
        os.path.join(
            output_folder,
            "Historical_Production_Dashboard.png"
        ),
        dpi=300,
        bbox_inches="tight"
    )

    plt.close()