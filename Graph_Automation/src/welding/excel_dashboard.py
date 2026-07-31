import matplotlib.pyplot as plt
import matplotlib.dates as mdates

from matplotlib.patches import Rectangle
from matplotlib.ticker import FuncFormatter

from pathlib import Path

from welding.summary import draw_summary


def plot_excel_dashboard(df, output_folder):

    # ----------------------------------------------------
    # Create Output Folder
    # ----------------------------------------------------

    Path(output_folder).mkdir(parents=True, exist_ok=True)

    # ----------------------------------------------------
    # Figure
    # ----------------------------------------------------

    fig = plt.figure(figsize=(18, 9), facecolor="white")

    gs = fig.add_gridspec(
        2,
        2,
        width_ratios=[1, 20],
        height_ratios=[1.2, 5]
    )

    # ----------------------------------------------------
    # Axes
    # ----------------------------------------------------

    ax_green = fig.add_subplot(gs[:, 0])
    ax_summary = fig.add_subplot(gs[0, 1])
    ax_chart = fig.add_subplot(gs[1, 1])

    # ----------------------------------------------------
    # Green Side Panel
    # ----------------------------------------------------

    ax_green.set_facecolor("#0B7A29")

    ax_green.set_xticks([])
    ax_green.set_yticks([])

    for spine in ax_green.spines.values():
        spine.set_visible(False)

    ax_green.text(
        0.5,
        0.5,
        "Schweißtechnik\nFertigung\n\nWelding\n\nKhurda (India)",
        color="white",
        fontsize=11,
        fontweight="bold",
        ha="center",
        va="center",
        rotation=90
    )

    # ----------------------------------------------------
    # Summary
    # ----------------------------------------------------

    draw_summary(ax_summary, df)

    # ----------------------------------------------------
    # Title
    # ----------------------------------------------------

    ax_chart.set_title(
        "Historical Welding Dashboard",
        fontsize=18,
        fontweight="bold",
        pad=20
    )

    # ----------------------------------------------------
    # Data
    # ----------------------------------------------------

    orders = df["Orders"]
    loi = df["LOI"]
    capacity = df["NPK + Labour Supply+ Job contractor capacity"]
    labour = df["NPK +LABOUR SUPPLY Capacity"]

    # ----------------------------------------------------
    # Grey Capacity Area
    # ----------------------------------------------------

    ax_chart.fill_between(
        df["Month"],
        capacity,
        color="#D9D9D9",
        zorder=1
    )

    # ----------------------------------------------------
    # Stacked Bars
    # ----------------------------------------------------

    ax_chart.bar(
        df["Month"],
        orders,
        width=12,
        color="#5B8CCB",
        edgecolor="black",
        linewidth=0.5,
        zorder=3,
        label="Orders"
    )

    ax_chart.bar(
        df["Month"],
        loi,
        bottom=orders,
        width=12,
        color="#1F3F69",
        edgecolor="black",
        linewidth=0.5,
        zorder=4,
        label="LOI"
    )

    # ----------------------------------------------------
    # Capacity Lines
    # ----------------------------------------------------

    ax_chart.plot(
        df["Month"],
        labour,
        color="black",
        linewidth=1.2,
        zorder=5
    )

    ax_chart.plot(
        df["Month"],
        capacity,
        color="black",
        linewidth=1.5,
        marker="o",
        markersize=4,
        markerfacecolor="white",
        markeredgecolor="black",
        zorder=6
    )

    # ----------------------------------------------------
    # Axis
    # ----------------------------------------------------

    ax_chart.set_ylim(0, 60000)

    ax_chart.set_ylabel("Hours", fontsize=11)

    ax_chart.set_xlabel("")

    ax_chart.set_yticks(range(0, 60001, 10000))

    ax_chart.yaxis.set_major_formatter(
        FuncFormatter(lambda x, pos: f"{int(x):,} h")
    )

    ax_chart.xaxis.set_major_formatter(
        mdates.DateFormatter("%b-%y")
    )

    plt.setp(
        ax_chart.get_xticklabels(),
        rotation=0,
        fontsize=9
    )

    ax_chart.grid(False)

    # ----------------------------------------------------
    # Legend
    # ----------------------------------------------------

    legend = [

        Rectangle(
            (0, 0),
            1,
            1,
            facecolor="#5B8CCB",
            edgecolor="black",
            label="Order backlog"
        ),

        Rectangle(
            (0, 0),
            1,
            1,
            facecolor="#1F3F69",
            edgecolor="black",
            label="LOI backlog"
        ),

        Rectangle(
            (0, 0),
            1,
            1,
            facecolor="#D9D9D9",
            edgecolor="black",
            label="Capacity"
        )

    ]

    ax_chart.legend(
        handles=legend,
        loc="upper center",
        bbox_to_anchor=(0.5, 1.08),
        ncol=3,
        frameon=False,
        fontsize=10
    )

    # ----------------------------------------------------
    # Border
    # ----------------------------------------------------

    for spine in ax_chart.spines.values():
        spine.set_linewidth(1)

    # ----------------------------------------------------
    # Layout
    # ----------------------------------------------------

    plt.tight_layout()

    plt.savefig(
        Path(output_folder) / "Historical_Welding_Dashboard.png",
        dpi=300,
        bbox_inches="tight"
    )

    plt.show()