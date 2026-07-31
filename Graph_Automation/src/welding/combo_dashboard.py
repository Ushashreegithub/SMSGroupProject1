import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from matplotlib.patches import Patch, Rectangle
from pathlib import Path


def plot_welding_dashboard(df, output_folder):

    # ---------------------------------------------------
    # Create Output Folder
    # ---------------------------------------------------

    Path(output_folder).mkdir(parents=True, exist_ok=True)

    # ---------------------------------------------------
    # Calculate Summary Values
    # ---------------------------------------------------

    total_orders = df["Orders"].sum()
    total_loi = df["LOI"].sum()
    total_npk = df["SMI"].sum()
    total_labour = df["NPK +LABOUR SUPPLY Capacity"].sum()
    total_capacity = df["NPK + Labour Supply+ Job contractor capacity"].sum()

    # ---------------------------------------------------
    # Figure Layout
    # ---------------------------------------------------

    fig = plt.figure(figsize=(18, 9), facecolor="white")

    gs = fig.add_gridspec(
        2,
        1,
        height_ratios=[1.2, 5]
    )

    ax_summary = fig.add_subplot(gs[0])
    ax_chart = fig.add_subplot(gs[1])

    ax_summary.axis("off")

    # ===================================================
    # SUMMARY (LEFT)
    # ===================================================

    summary_left = [

        ("#7F7F7F", "NPK f. 12 Mth.", total_npk),

        ("#BFBFBF", "NPK + Lab. Cont.", total_labour),

        ("#DDDDDD", "NPK + Lab. & Job Cont.", total_capacity)

    ]

    y = 0.75

    for color, label, value in summary_left:

        ax_summary.add_patch(
            Rectangle(
                (0.05, y-0.05),
                0.03,
                0.10,
                facecolor=color,
                edgecolor="black"
            )
        )

        ax_summary.text(
            0.10,
            y,
            label,
            fontsize=12,
            va="center"
        )

        ax_summary.text(
            0.42,
            y,
            f"{value:,.0f} h",
            fontsize=12,
            ha="right",
            va="center",
            fontweight="bold"
        )

        y -= 0.28

    # ===================================================
    # SUMMARY (RIGHT)
    # ===================================================

    summary_right = [

        ("#5B8CCB", "Order backlog f. 12 Mth.", total_orders),

        ("#1F3F69", "LOI backlog f. 12 Mth.", total_loi)

    ]

    y = 0.75

    for color, label, value in summary_right:

        ax_summary.add_patch(
            Rectangle(
                (0.55, y-0.05),
                0.03,
                0.10,
                facecolor=color,
                edgecolor="black"
            )
        )

        ax_summary.text(
            0.60,
            y,
            label,
            fontsize=12,
            va="center"
        )

        ax_summary.text(
            0.95,
            y,
            f"{value:,.0f} h",
            fontsize=12,
            ha="right",
            va="center",
            fontweight="bold"
        )

        y -= 0.28

    # ===================================================
    # STACKED BAR CHART
    # ===================================================

    ax_chart.bar(
    df["Month"],
    df["Orders"],
    width=12,
    color="#5B8CCB",
    edgecolor="black",
    linewidth=0.5,
    zorder=3
)

    ax_chart.bar(
    df["Month"],
    df["LOI"],
    bottom=df["Orders"],
    width=12,
    color="#1F3F69",
    edgecolor="black",
    linewidth=0.5,
    zorder=4
)
    # ===================================================
    # CAPACITY LINE
    # ===================================================

    capacity = df["NPK + Labour Supply+ Job contractor capacity"]
    labour_capacity = df["NPK +LABOUR SUPPLY Capacity"]

    # Grey background area
    ax_chart.fill_between(
        df["Month"],
        capacity,
        color="#D9D9D9",
        zorder=1
    )

    # Lower capacity line
    ax_chart.plot(
        df["Month"],
        labour_capacity,
        color="black",
        linewidth=1,
        zorder=2
    )

    # Upper capacity line
    ax_chart.plot(
        df["Month"],
        capacity,
        color="black",
        linewidth=1,
        marker="o",
        markersize=4,
        markerfacecolor="white",
        zorder=5
    )
        # ===================================================
        # TITLE
        # ===================================================

    ax_chart.set_title(
            "Historical Welding Dashboard",
            fontsize=18,
            fontweight="bold",
            pad=20
        )

        # ===================================================
        # AXES
        # ===================================================

    ax_chart.set_ylabel(
            "Hours",
            fontsize=12
        )

    ax_chart.set_xlabel(
            "Month",
            fontsize=12
        )

    ax_chart.xaxis.set_major_formatter(
            mdates.DateFormatter("%b-%y")
        )
    

    plt.setp(
    ax_chart.get_xticklabels(),
    rotation=0,
    fontsize=9
)

        # ===================================================
        # GRID
        # ===================================================

    ax_chart.grid(
            axis="y",
            linestyle="--",
            alpha=0.4
        )

    ax_chart.set_axisbelow(True)

        # ===================================================
        # LEGEND
        # ===================================================

    legend_elements = [

            Patch(facecolor="#5B8CCB", edgecolor="black", label="Order Backlog"),

            Patch(facecolor="#1F3F69", edgecolor="black", label="LOI Backlog"),

            Patch(facecolor="#DDDDDD", edgecolor="black", label="Capacity Line")

        ]

    ax_chart.legend(
            handles=legend_elements,
            loc="upper center",
            bbox_to_anchor=(0.5, 1.08),
            ncol=3,
            frameon=False,
            fontsize=11
        )

        # ===================================================
        # BORDER
        # ===================================================

    for spine in ax_chart.spines.values():
            spine.set_linewidth(1)

    plt.tight_layout()

    plt.savefig(
            Path(output_folder) / "Welding_Dashboard.png",
            dpi=300,
            bbox_inches="tight"
        )

    plt.show()