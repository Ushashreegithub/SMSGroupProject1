import os
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

from pathlib import Path

from matplotlib.gridspec import GridSpec
from matplotlib.ticker import FuncFormatter
from matplotlib.patches import Rectangle
from rr.summary import draw_summary


def plot_rr_dashboard(df, output_folder):

    # -------------------------------------------------------
    # Create Figure
    # -------------------------------------------------------

    fig = plt.figure(
        figsize=(16, 9),
        facecolor="white"
    )

    # -------------------------------------------------------
    # LEFT GREEN STRIP
    # -------------------------------------------------------

    ax_left = fig.add_axes([
        0.02,   # left
        0.06,   # bottom
        0.023,  # width
        0.90    # height
    ])

    # -------------------------------------------------------
    # HEADER
    # -------------------------------------------------------

    ax_header = fig.add_axes([
        0.07,
        0.83,
        0.90,
        0.13
    ])

    # -------------------------------------------------------
    # MAIN CHART
    # -------------------------------------------------------

    ax = fig.add_axes([
        0.065,
        0.10,
        0.89,
        0.68
    ])

    ax_left.axis("off")
    ax_header.axis("off")

    # =====================================================
# LEFT GREEN STRIP
# =====================================================

    ax_left.set_facecolor("#0B7A18")

# Green background
    ax_left.add_patch(
    Rectangle(
        (0, 0),
        1,
        1,
        transform=ax_left.transAxes,
        color="#0B7A18"
    )
)

# Vertical Text
    ax_left.text(
    0.5,
    0.5,
    "Roll Refurbishment: Khurda (India)",
    rotation=90,
    ha="center",
    va="center",
    color="white",
    fontsize=12,
    fontweight="bold"
)

    ax_left.set_xlim(0, 1)
    ax_left.set_ylim(0, 1)

    ax_left.set_xticks([])
    ax_left.set_yticks([])

    # =====================================================
# HEADER
# =====================================================

# Total values
    total_orders = int(df["Orders"].sum())
    total_service = int(df["Service Basic"].sum())
    total_capacity = int(df["NPK"].sum())

# ---- Left Legend (Grey) ----

    ax_header.add_patch(
    Rectangle(
        (0.05, 0.62),
        0.03,
        0.12,
        transform=ax_header.transAxes,
        facecolor="#C8C8C8",
        edgecolor="black",
        linewidth=0.8
    )
)

    ax_header.text(
    0.10,
    0.68,
    "NPK f. 12 Mth.:",
    fontsize=10,
    va="center"
)

    ax_header.text(
    0.22,
    0.68,
    f"{total_capacity:,.0f} h",
    fontsize=10,
    va="center"
)

# ---- Right Legends ----

# Orders
    ax_header.add_patch(
    Rectangle(
        (0.47, 0.62),
        0.03,
        0.12,
        transform=ax_header.transAxes,
        facecolor="#5B8CCB",
        edgecolor="black",
        linewidth=0.8
    )
)

    ax_header.text(
    0.515,
    0.68,
    "Order backlog f. 12 Mth.:",
    fontsize=10,
    va="center"
)

    ax_header.text(
    0.69,
    0.68,
    f"{total_orders:,.0f} h",
    fontsize=10,
    va="center"
)

# LOI
    ax_header.add_patch(
    Rectangle(
        (0.47, 0.42),
        0.03,
        0.12,
        transform=ax_header.transAxes,
        facecolor="#1F3D66",
        edgecolor="black",
        linewidth=0.8
    )
)

    ax_header.text(
    0.515,
    0.48,
    "LOI backlog f. 12 Mth.:",
    fontsize=10,
    va="center"
)

    ax_header.text(
    0.69,
    0.48,
    f"{total_service:,.0f} h",
    fontsize=10,
    va="center"
)

    # =====================================================
# CHART DATA
# =====================================================

    months = df["Month"]

    orders = df["Orders"]

    service = df["Service Basic"]

    capacity = df["NPK"]

# Total stacked bars
    total = orders + service

# =====================================================
# GREY CAPACITY AREA
# =====================================================

    ax.fill_between(
    months,
    capacity,
    0,
    color="#D9D9D9",
    alpha=1.0,
    zorder=1
)

# =====================================================
# CAPACITY LINE
# =====================================================

    ax.plot(
    months,
    capacity,
    color="black",
    linewidth=2.2,
    marker="o",
    markersize=6,
    markerfacecolor="white",
    markeredgecolor="black",
    markeredgewidth=1.5,
    zorder=5
)

# =====================================================
# ORDERS BAR
# =====================================================

    ax.bar(

    months,
    orders,
    width=18,
    color="#5B8CCB",
    edgecolor="black",
    linewidth=0.5,
    zorder=3
)

# =====================================================
# SERVICE BASIC BAR
# =====================================================

    ax.bar(
    months,
    service,
    bottom=orders,
    width=18,
    color="#1F3D66",
    edgecolor="black",
    linewidth=0.5,
    zorder=4
)

# =====================================================
# BAR LABELS
# =====================================================

    for x, value in zip(months, orders):

        if value > 0:

            ax.text(
            x,
            value / 2,
            f"{int(value):,}",
            ha="center",
            va="center",
            fontsize=8,
            fontweight="bold",
            color="black"
        )

    for x, order, serv in zip(months, orders, service):

        if serv > 0:

            ax.text(
            x,
            order + serv / 2,
            f"{int(serv):,}",
            ha="center",
            va="center",
            fontsize=8,
            fontweight="bold",
            color="white"
        )

# =====================================================
# CAPACITY LABELS
# =====================================================

    for x, y in zip(months, capacity):

        ax.text(
        x,
        y + 60,
        f"{int(y):,}",
        ha="center",
        va="bottom",
        fontsize=8,
        color="black"
    )

        # =====================================================
# Y AXIS
# =====================================================

    ax.set_ylim(0, 3000)

    ax.yaxis.set_major_formatter(
    FuncFormatter(lambda x, pos: f"{int(x):,}")
)

    ax.set_ylabel(
    "Hours",
    fontsize=11,
    fontweight="bold"
)

# =====================================================
# X AXIS
# =====================================================



    ax.xaxis.set_major_formatter(
    mdates.DateFormatter("%b-%y")
)

    ax.xaxis.set_major_locator(
    mdates.MonthLocator(interval=1)
)

    plt.setp(
    ax.get_xticklabels(),
    rotation=0,
    fontsize=9
)

# =====================================================
# GRID
# =====================================================

    ax.grid(
    axis="y",
    linestyle="--",
    linewidth=0.6,
    color="#BFBFBF",
    alpha=0.8
)

    ax.set_axisbelow(True)


# =====================================================
# LEGEND
# =====================================================




    legend_handles = [


    Rectangle(
        (0, 0),
        1,
        1,
        facecolor="#D9D9D9",
        edgecolor="black",
        label="NPK Capacity"
    ),

    Rectangle(
        (0, 0),
        1,
        1,
        facecolor="#5B8CCB",
        edgecolor="black",
        label="Orders"
    ),

    Rectangle(
        (0, 0),
        1,
        1,
        facecolor="#1F3D66",
        edgecolor="black",
        label="Service Basic"
    ),


]





    ax.legend(
    handles=legend_handles,
    loc="upper center",
    bbox_to_anchor=(0.5, 1.02),
    ncol=3,
    frameon=False,
    fontsize=10
)

# =====================================================
# BORDER
# =====================================================

    for spine in ax.spines.values():

        spine.set_linewidth(0.8)

        spine.set_color("black")

# =====================================================
# LAYOUT
# =====================================================

    plt.subplots_adjust(
    left=0.03,
    right=0.99,
    top=0.97,
    bottom=0.08
)

# =====================================================
# SAVE
# =====================================================

    os.makedirs(output_folder, exist_ok=True)

    plt.savefig(
    os.path.join(
        output_folder,
        "Historical_RR_Dashboard.png"
    ),
    dpi=300,
    bbox_inches="tight"
)

plt.show()

