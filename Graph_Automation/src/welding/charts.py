import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from pathlib import Path


def plot_line_chart(
    df,
    x_column,
    y_column,
    title,
    y_label,
    output_folder,
    filename,
    color="royalblue"
):
    """
    Generic Line Chart Generator
    """

    Path(output_folder).mkdir(parents=True, exist_ok=True)

    plt.figure(figsize=(14, 7))

    plt.plot(
        df[x_column],
        df[y_column],
        marker="o",
        linewidth=3,
        markersize=8,
        color=color,
        label=y_column
    )

    # Data labels
    for x, y in zip(df[x_column], df[y_column]):
        if y == y:  # Ignore NaN values
            plt.text(
                x,
                y,
                f"{y:,.0f}",
                fontsize=9,
                ha="center",
                va="bottom"
            )

    # Month format
    plt.gca().xaxis.set_major_formatter(
        mdates.DateFormatter("%b-%y")
    )

    plt.xticks(rotation=45)

    plt.title(
        title,
        fontsize=18,
        fontweight="bold"
    )

    plt.xlabel("Month")
    plt.ylabel(y_label)

    plt.grid(
        linestyle="--",
        alpha=0.4
    )

    plt.legend()

    plt.tight_layout()

    plt.savefig(
        Path(output_folder) / filename,
        dpi=300,
        bbox_inches="tight"
    )

    plt.show()