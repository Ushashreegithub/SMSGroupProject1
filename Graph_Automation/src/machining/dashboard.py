import matplotlib.pyplot as plt
import matplotlib.dates as mdates

from pathlib import Path
from matplotlib.patches import Rectangle
from matplotlib.ticker import FuncFormatter

from machining.summary import draw_summary


def plot_machining_dashboard(df, output_folder):

    # ---------------------------------------------------
    # Create Output Folder
    # ---------------------------------------------------

    Path(output_folder).mkdir(
        parents=True,
        exist_ok=True
    )

    # ---------------------------------------------------
    # Figure
    # ---------------------------------------------------

    fig = plt.figure(
        figsize=(16,5.8),
        facecolor="white"
    )

    gs = fig.add_gridspec(
        2,
        2,
        width_ratios=[0.6, 22],
        height_ratios=[0.9, 3.5]
    )

    # ---------------------------------------------------
    # Axes
    # ---------------------------------------------------

    ax_green = fig.add_subplot(gs[:, 0])
    ax_summary = fig.add_subplot(gs[0, 1])
    ax_chart = fig.add_subplot(gs[1, 1])

    # ---------------------------------------------------
    # Green Side Panel
    # ---------------------------------------------------

    ax_green.set_facecolor("#0B7A29")

    ax_green.set_xticks([])
    ax_green.set_yticks([])

    for spine in ax_green.spines.values():
        spine.set_visible(False)

    ax_green.text(
        0.5,
        0.5,
        "Mechanische\nFertigung\n\nMachining\n\nKhurda (India)",
        rotation=90,
        ha="center",
        va="center",
        fontsize=11,
        color="white",
        fontweight="bold"
    )

    # ---------------------------------------------------
    # Summary
    # ---------------------------------------------------

    draw_summary(ax_summary, df)

   #data

    orders = df["Orders"]
    loi = df["LOI"]
    service = df["Service Basic"]
    capacity = df["NPK"]

        # ---------------------------------------------------
    # Grey Capacity Area
    # ---------------------------------------------------

    ax_chart.fill_between(
        df["Month"],
        capacity,
        color="#D9D9D9",
        zorder=1
    )

    # ---------------------------------------------------
    # NPK Capacity Line
    # ---------------------------------------------------

    ax_chart.plot(
        df["Month"],
        capacity,
        color="black",
        linewidth=1.5,
        marker="o",
        markersize=4,
        markerfacecolor="white",
        markeredgecolor="black",
        zorder=5,
        label="NPK Capacity"
    )

    # ---------------------------------------------------
    # Service Basic Bars (Bottom)
    # ---------------------------------------------------

    ax_chart.bar(
        df["Month"],
        service,
        width=18,
        color="#00A000",
        edgecolor="black",
        linewidth=0.5,
        zorder=2,
        label="Service Basic"
    )

    # ---------------------------------------------------
    # Orders Bars (Middle)
    # ---------------------------------------------------

    ax_chart.bar(
        df["Month"],
        orders,
        bottom=service,
        width=18,
        color="#5B8CCB",
        edgecolor="black",
        linewidth=0.5,
        zorder=3,
        label="Orders"
    )

    # ---------------------------------------------------
    # LOI Bars (Top)
    # ---------------------------------------------------

    ax_chart.bar(
        df["Month"],
        loi,
        bottom=service + orders,
        width=18,
        color="#1F3F69",
        edgecolor="black",
        linewidth=0.5,
        zorder=4,
        label="LOI"
    )

    # ---------------------------------------------------
    # Value Labels (Excel Style)
    # ---------------------------------------------------

    total_stack = service + orders + loi

    for x, y in zip(df["Month"], total_stack):

        ax_chart.text(
            x,
            y + 120,
            f"{int(y):,}",
            ha="center",
            va="bottom",
            fontsize=8
        )

            # ---------------------------------------------------
    # Y Axis
    # ---------------------------------------------------

    ax_chart.set_ylim(0, 10000)

    ax_chart.set_ylabel(
        "Hours",
        fontsize=11
    )

    ax_chart.yaxis.set_major_formatter(
        FuncFormatter(
            lambda x, pos: f"{int(x):,} h"
        )
    )

    # ---------------------------------------------------
    # X Axis
    # ---------------------------------------------------

    ax_chart.xaxis.set_major_formatter(
        mdates.DateFormatter("%b-%y")
    )

    plt.setp(
        ax_chart.get_xticklabels(),
        rotation=0,
        fontsize=9
    )

    ax_chart.set_xlabel("")

    # ---------------------------------------------------
    # Grid
    # ---------------------------------------------------

    ax_chart.grid(
        axis="y",
        linestyle="--",
        alpha=0.35
    )

    ax_chart.set_axisbelow(True)

    # ---------------------------------------------------
    # Legend
    # ---------------------------------------------------

    legend_handles = [

        Rectangle(
            (0, 0),
            1,
            1,
            facecolor="#00A000",
            edgecolor="black",
            label="Service Basic"
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
            facecolor="#1F3F69",
            edgecolor="black",
            label="LOI"
        ),

        Rectangle(
            (0, 0),
            1,
            1,
            facecolor="#D9D9D9",
            edgecolor="black",
            label="NPK Capacity"
        )

    ]

    ax_chart.legend(
        handles=legend_handles,
        loc="upper center",
        bbox_to_anchor=(0.5, 1.08),
        ncol=4,
        frameon=False,
        fontsize=10
    )

    # ---------------------------------------------------
    # Border
    # ---------------------------------------------------

    for spine in ax_chart.spines.values():
        spine.set_color("black")
        spine.set_linewidth(0.8)

    # ---------------------------------------------------
    # Layout
    # ---------------------------------------------------

    plt.tight_layout()

    plt.savefig(
        Path(output_folder) / "Historical_Machining_Dashboard.png",
        dpi=300,
        bbox_inches="tight"
    )

    plt.show()