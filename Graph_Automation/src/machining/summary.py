from matplotlib.patches import Rectangle


def draw_summary(ax, df):

    ax.axis("off")

    # -----------------------------
    # Calculate Totals
    # -----------------------------

    total_orders = df["Orders"].sum()
    total_loi = df["LOI"].sum()
    total_service = df["Service Basic"].sum()
    total_npk = df["NPK"].sum()

    # -----------------------------
    # Left Section
    # -----------------------------

    left_items = [

        ("#BFBFBF", "NPK f. 12 Mth.", total_npk),

        ("#00A000", "Basic/Service f. 12 Mth.", total_service)

    ]

    # -----------------------------
    # Right Section
    # -----------------------------

    right_items = [

        ("#5B8CCB", "Order backlog f. 12 Mth.", total_orders),

        ("#1F3F69", "LOI backlog f. 12 Mth.", total_loi)

    ]

    y = 0.72

    for color, label, value in left_items:

        ax.add_patch(
            Rectangle(
                (0.05, y - 0.05),
                0.03,
                0.10,
                facecolor=color,
                edgecolor="black"
            )
        )

        ax.text(
            0.10,
            y,
            label,
            fontsize=11,
            va="center"
        )

        ax.text(
            0.45,
            y,
            f"{value:,.0f} h",
            fontsize=11,
            fontweight="bold",
            ha="right",
            va="center"
        )

        y -= 0.28

    y = 0.72

    for color, label, value in right_items:

        ax.add_patch(
            Rectangle(
                (0.55, y - 0.05),
                0.03,
                0.10,
                facecolor=color,
                edgecolor="black"
            )
        )

        ax.text(
            0.60,
            y,
            label,
            fontsize=11,
            va="center"
        )

        ax.text(
            0.95,
            y,
            f"{value:,.0f} h",
            fontsize=11,
            fontweight="bold",
            ha="right",
            va="center"
        )

        y -= 0.28