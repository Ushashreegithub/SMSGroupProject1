import matplotlib.pyplot as plt


def draw_summary(ax, df):

    ax.axis("off")

    # ================================
    # Calculate Values
    # ================================

    total_orders = df["Orders"].sum()

    total_service = df["Service Basic"].sum()

    avg_orders = df["Orders"].mean()

    avg_capacity = df["NPK"].mean()

    utilization = (avg_orders / avg_capacity) * 100

    # ================================
    # Table
    # ================================

    table_data = [

        ["Metric", "Value"],

        ["Orders", f"{total_orders:,.0f}"],

        ["Service Basic", f"{total_service:,.0f}"],

        ["Average Orders", f"{avg_orders:,.0f}"],

        ["Average Capacity", f"{avg_capacity:,.0f}"],

        ["Utilization", f"{utilization:.1f}%"]

    ]

    table = ax.table(

        cellText=table_data,

        cellLoc="center",

        loc="center"

    )

    table.auto_set_font_size(False)

    table.set_fontsize(9)

    table.scale(1.2, 1.6)

    # ================================
    # Styling
    # ================================

    for (row, col), cell in table.get_celld().items():

        cell.set_edgecolor("black")

        cell.set_linewidth(0.6)

        if row == 0:

            cell.set_facecolor("#D9D9D9")

            cell.set_text_props(weight="bold")

        else:

            cell.set_facecolor("white")