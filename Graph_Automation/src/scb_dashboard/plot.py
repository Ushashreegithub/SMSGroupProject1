import matplotlib.pyplot as plt
import numpy as np
import matplotlib.patches as patches
from matplotlib.lines import Line2D


def plot_dashboard(df):

    # ==========================================
    # Dashboard Canvas
    # ==========================================
    fig = plt.figure(figsize=(16, 9), facecolor="white")

    # Main chart area
    ax = fig.add_axes([
        0.06,   # left
        0.17,   # bottom
        0.72,   # width
        0.68    # height
    ])

    # ==========================================
    # Basic Data
    # ==========================================

    months = df["Month"]

    capacity = df["Capacity"]


    # ==========================================
# COLORS
# ==========================================

    colors = {
        "Welding": "#103B5C",
        "Machining": "#1C7893",
        "Assembly": "#36A8C7",
        "Roll Refurbishment": "#7FD6EA",
        "Plating": "#CFEFFA",
        

    }

    stack_order = [
    "Welding",
    "Machining",
    "Assembly",
    "Roll Refurbishment",
    "Plating",
    ]

    bottom = np.zeros(len(df))
    # ==========================================
# AVAILABLE CAPACITY AREA
# ==========================================

    x = np.arange(len(months))

    ax.fill_between(
        x,
        0,
        capacity,
        color="#DDEFD2",
        alpha=0.65,
        zorder=0,
        label="Available Capacity",
    )
    if "NPK Capacity" in df.columns:
        npk_capacity = df["NPK Capacity"]
    else:
        npk_capacity = capacity


       # ==========================================================
    # CAPACITY UTILIZATION (%)
    # ==========================================================
    
    planned_hours = (
                df["Welding"]
                + df["Machining"]
                + df["Assembly"]
                + df["Roll Refurbishment"]
                + df["Plating"]
            )
        
    utilization = (
                planned_hours / npk_capacity * 100
            ).round(0)
        
            # ==========================================================
        # CAPACITY UTILIZATION BOXES
        # ==========================================================
        
    y_box = max(capacity) + 5000
        
    # for xpos, util in zip(x, utilization):

    #     util = float(util)

    #     if util >= 100:
    #         color = "#8BC34A"
    #     elif util >= 75:
    #         color = "#F6C244"
    #     else:
    #         color = "#EF5350"

    #     # Don't display the percentage text
    #     label = ""

    #     ax.text(
    #         xpos,
    #         y_box,
    #         label,
    #         ha="center",
    #         va="center",
    #         fontsize=9,
    #         fontweight="bold",
    #         color="black",
    #         bbox=dict(
    #             facecolor=color,
    #             edgecolor="gray",
    #             boxstyle="round,pad=0.25",
    #         ),
    #         zorder=30,
    #     )

        

    # ==========================================
    # Title
    # ==========================================

    fig.text(
        0.06,
        0.955,
        "Production Bhubaneswar",
        fontsize=18,
        fontweight="bold",
        ha="left",
        va="top",
    )

    fig.text(
        0.36,
        0.955,
        " - Capacity Utilization",
        fontsize=18,
        color="#1D6FB8",
        fontweight="bold",
        
        va="top",
    )

    # ==========================================
    # Axis
    # ==========================================

    ymax = max(capacity) + 15000

    ax.set_ylim(0, ymax)

    ax.set_xlim(-0.6, len(months) - 0.4)

    x = np.arange(len(months))

    ax.set_xticks(x)
    ax.set_xticklabels([])

    ticks = np.arange(0, ymax + 1, 10000)

    ax.set_yticks(ticks)

    ax.set_yticklabels(
        [f"{int(t/1000)}" for t in ticks],
        fontsize=9,
    )

    ax.set_ylabel(
        "1000 Hours",
        fontsize=10,
        fontweight="bold",
    )

    # ==========================================
    # Grid
    # ==========================================

    ax.grid(
        axis="y",
        color="#D9D9D9",
        linestyle="--",
        linewidth=0.8,
    )

    ax.set_axisbelow(True)

    # ==========================================
    # Spines
    # ==========================================

    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)

    ax.spines["left"].set_color("#999999")
    ax.spines["bottom"].set_color("#999999")


    # ==========================================
# GREY NPK CAPACITY BACKGROUND
# ==========================================

    x = np.arange(len(months))

    ax.bar(
        x,
        npk_capacity,
        width=0.72,
        color="#ECECEC",
        alpha=0.65,
        edgecolor="#8A8A8A",
        linewidth=0.8,
        hatch="//",
        zorder=1,
        label="NPK Capacity",
    )

    # ==========================================
# STACKED PLANNED HOURS
# ==========================================

    for column in stack_order:

        bars = ax.bar(
            x,
            df[column],
            bottom=bottom,
            width=0.58,
            color=colors[column],
            edgecolor="white",
            linewidth=0.7,
            zorder=5,
            label=column,
        )

    # ----------------------------------------
    # Display value inside each stack segment
    # ----------------------------------------

        for bar, value in zip(bars, df[column]):

            # Skip tiny segments
            if value < 1000:
                continue

            x_text = bar.get_x() + bar.get_width() / 2
            y_text = bar.get_y() + bar.get_height() / 2

            # White text on dark colors
            if column in ["Welding", "Machining", "Assembly"]:
                txt_color = "white"
            else:
                txt_color = "black"

            ax.text(
                x_text,
                y_text,
                f"{value/10000:.1f}",
                ha="center",
                va="center",
                fontsize=7,
                fontweight="bold",
                color=txt_color,
                zorder=10,
            )

        bottom += df[column].values

# ==========================================================
# TOTAL PLANNED HOURS ABOVE EACH STACK
# ==========================================================

    for i, total in enumerate(bottom):

        ax.text(
            i,
            total + 800,          # Slightly above the stack
            f"{total/10000:.1f}",
            ha="center",
            va="bottom",
            fontsize=9,
            fontweight="bold",
            color="black",
            zorder=15,
        )
        # ==========================================================
# AVAILABLE CAPACITY LINE
# ==========================================================

    ax.plot(
            x,
            capacity,
            color="black",
            linewidth=2.4,
            marker="o",
            markersize=6,
            markerfacecolor="white",
            markeredgecolor="black",
            markeredgewidth=1.5,
            zorder=20,
            label="Available Capacity",
        )

        # -------------------------------------------------------
# GROUP COMPANY LINE
# -------------------------------------------------------

    group_company = df["Group Company"] * 1000

    ax.plot(
        months,
        group_company,
        color="#2F80ED",        # Blue
        marker="o",
        linewidth=2.5,
        markersize=6,
        label="Group Company",
        zorder=6
    )

    for xpos, value in zip(x, group_company):

        ax.text(
            xpos,
            value + 1200,
            f"{value/1000:.1f}",
            fontsize=7,
            ha="center",
            color="#1E88E5",
            va="bottom",
            zorder=30,
            fontweight="bold",
        )

    # ==========================================================
# CONTRACT MFG
# ==========================================================

    contract = df["Contract MFG"] * 1000

    ax.plot(
        x,
        contract,
        color="#F28C28",
        linewidth=2,
        marker="o",
        markersize=5,
        markerfacecolor="white",
        markeredgecolor="#F28C28",
        zorder=22,
        label="Contract MFG",
    )

    for xpos, value in zip(x, contract):

        ax.text(
            xpos,
            value + 1200,
            f"{value/1000:.1f}",
            fontsize=7,
            ha="center",
            color="#F28C28",
            zorder=30,
        )    

        # ==========================================================
# CAPACITY VALUES
# ==========================================================

    for xpos, value in zip(x, capacity):

        ax.text(
            xpos,
            value + 1200,
            f"{value/1000:.1f}",
            ha="center",
            va="bottom",
            fontsize=8,
            fontweight="bold",
            color="black",
            zorder=25,
        )

        # ==========================================================
# BOTTOM MONTH STRIP
# ==========================================================

    month_ax = fig.add_axes([0.06, 0.08, 0.72, 0.055])

    month_ax.set_xlim(-0.5, len(months) - 0.5)
    month_ax.set_ylim(0, 1)

    month_ax.set_facecolor("#EFEFEF")

    month_ax.set_xticks([])
    month_ax.set_yticks([])

    for spine in month_ax.spines.values():
        spine.set_color("#B0B0B0")
        spine.set_linewidth(0.8)

    for i, month in enumerate(months):

        month_ax.text(
            i,
            0.5,
            month,
            ha="center",
            va="center",
            fontsize=9,
            fontweight="bold",
            color="#404040",
        )

    for i in range(len(months) + 1):

        month_ax.plot(
            [i - 0.5, i - 0.5],
            [0, 1],
            color="#C8C8C8",
            linewidth=0.6,
        )

    # ==========================================================
# LEGEND
# ==========================================================
    print(df[["Capacity", "Group Company", "Contract MFG"]])
    legend_handles = [

        patches.Patch(color=colors["Welding"], label="Welding"),
        
        patches.Patch(color=colors["Machining"], label="Machining"),

        patches.Patch(color=colors["Assembly"], label="Assembly"),

        patches.Patch(color=colors["Roll Refurbishment"], label="Roll Refurbishment"),

        patches.Patch(color=colors["Plating"], label="Plating"),

        Line2D(
            [0], [0],
            color="black",
            marker="o",
            linewidth=2,
            label="Available Capacity"
        ),

        Line2D(
            [0], [0],
            color="#1E88E5",
            marker="o",
            linewidth=2,
            label="Group Company"
        ),

        Line2D(
            [0], [0],
            color="#F28C28",
            marker="o",
            linewidth=2,
            label="Contract MFG"
        ),
    ]

# ==========================================================
# RIGHT SIDE SUMMARY PANEL
# ==========================================================

    summary_ax = fig.add_axes([0.80, 0.22, 0.18, 0.55])
    summary_ax.axis("off")

    # Background
    summary_ax.add_patch(
        patches.FancyBboxPatch(
            (0, 0),
            1,
            1,
            boxstyle="round,pad=0.02",
            facecolor="#EAF5E3",
            edgecolor="#A0A0A0",
        )
    )

    planned = df["Planned Hours"].sum() / 10000
    capacity_total = df["Capacity"].sum() / 10000
    util_avg = df["Utilization"].mean()
    group_total = (df["Group Company"] * 1000).sum() / 10000
    contract_total = (df["Contract MFG"] * 1000).sum() / 10000

    summary_ax.text(
        0.5,
        0.95,
        "SUMMARY",
        ha="center",
        fontsize=13,
        fontweight="bold",
    )

    rows = [
        ("Planned Hours", planned),
        ("Available Capacity", capacity_total),
        ("Avg Utilization", util_avg),
        ("Group Company", group_total),
        ("Contract MFG", contract_total),
    ]

    y = 0.82

    for label, value in rows:

        if "Utilization" in label:
            txt = f"{value:.1f}%"
        else:
            txt = f"{value:.1f}"

        summary_ax.text(
            0.08,
            y,
            label,
            fontsize=10,
            fontweight="bold",
        )

        summary_ax.text(
            0.92,
            y,
            txt,
            ha="right",
            fontsize=10,
        )

        y -= 0.16


    # ==========================================================
# LEGEND
# ==========================================================

    legend_handles = [

        patches.Patch(
            facecolor="#103B5C",
            edgecolor="white",
            label="Welding"
        ),

        patches.Patch(
            facecolor="#1C7893",
            edgecolor="white",
            label="Machining"
        ),

        patches.Patch(
            facecolor="#36A8C7",
            edgecolor="white",
            label="Assembly"
        ),

        patches.Patch(
            facecolor="#7FD6EA",
            edgecolor="white",
            label="Roll Refurbishment"
        ),

        patches.Patch(
            facecolor="#CFEFFA",
            edgecolor="white",
            label="Plating"
        ),

        patches.Patch(
            facecolor="#ECECEC",
            edgecolor="#808080",
            hatch="....",
            label="NPK Capacity"
        ),


        Line2D(
            [0],
            [0],
            color="black",
            marker="o",
            linewidth=2.5,
            markersize=6,
            label="Available Capacity"
        ),

        Line2D(
            [0],
            [0],
            color="#2F80ED",
            marker="o",
            linewidth=2.5,
            markersize=6,
            label="Group Company"
        ),

        Line2D(
            [0],
            [0],
            color="#F28E2B",
            marker="o",
            linewidth=2.5,
            markersize=6,
            label="Contract MFG"
        ),
    ]

    ax.legend(
        handles=legend_handles,
        loc="upper center",
        bbox_to_anchor=(0.5, -0.13),
        ncol=5,
        fontsize=9,
        frameon=False,
    )

    # ==========================================================
# OUTER BORDER
# ==========================================================

    fig.add_artist(

        patches.Rectangle(

            (0.01, 0.01),
            0.98,
            0.98,

            transform=fig.transFigure,

            fill=False,

            edgecolor="#A8A8A8",

            linewidth=1.2,

        )
    )

    return fig
