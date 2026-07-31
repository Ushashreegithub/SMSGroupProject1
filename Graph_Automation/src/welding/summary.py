from matplotlib.patches import Rectangle


def draw_summary(ax, df):

    ax.axis("off")

    # ---------------------------------------
    # Totals
    # ---------------------------------------

    total_orders = df["Orders"].sum()

    total_loi = df["LOI"].sum()

    total_npk = df["SMI"].sum()

    total_labour = df["NPK +LABOUR SUPPLY Capacity"].sum()

    total_capacity = df[
        "NPK + Labour Supply+ Job contractor capacity"
    ].sum()

    # ---------------------------------------
    # LEFT SIDE
    # ---------------------------------------

    left_items = [

        ("#7f7f7f",
         "NPK f. 12 Mth.",
         total_npk),

        ("#c0c0c0",
         "NPK + Lab. Cont.",
         total_labour),

        ("#dddddd",
         "NPK + Lab. & Job Cont.",
         total_capacity)

    ]

    y = 0.78

    for color, label, value in left_items:

        ax.add_patch(

            Rectangle(

                (0.04, y-0.045),

                0.025,

                0.09,

                facecolor=color,

                edgecolor="black"

            )

        )

        ax.text(

            0.09,

            y,

            label,

            fontsize=12,

            va="center"

        )

        ax.text(

            0.45,

            y,

            f"{value:,.0f} h",

            fontsize=12,

            fontweight="bold",

            ha="right",

            va="center"

        )

        y -= 0.28

    # ---------------------------------------
    # RIGHT SIDE
    # ---------------------------------------

    right_items = [

        ("#5B8CCB",

         "Order backlog f. 12 Mth.",

         total_orders),

        ("#1F3F69",

         "LOI backlog f. 12 Mth.",

         total_loi)

    ]

    y = 0.78

    for color, label, value in right_items:

        ax.add_patch(

            Rectangle(

                (0.56, y-0.045),

                0.025,

                0.09,

                facecolor=color,

                edgecolor="black"

            )

        )

        ax.text(

            0.61,

            y,

            label,

            fontsize=12,

            va="center"

        )

        ax.text(

            0.96,

            y,

            f"{value:,.0f} h",

            fontsize=12,

            fontweight="bold",

            ha="right",

            va="center"

        )

        y -= 0.28