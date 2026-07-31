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
    color,
):

    Path(output_folder).mkdir(
        parents=True,
        exist_ok=True,
    )

    plt.figure(figsize=(9, 4))

    plt.plot(
        df[x_column],
        df[y_column],
        color=color,
        linewidth=2,
        marker="o",
    )

    plt.title(title, fontsize=13)

    plt.ylabel(y_label)

    plt.grid(
        linestyle="--",
        alpha=0.35,
    )

    plt.gca().xaxis.set_major_formatter(
        mdates.DateFormatter("%b-%y")
    )

    plt.xticks(rotation=45)

    plt.tight_layout()

    plt.savefig(
        Path(output_folder) / filename,
        dpi=300,
    )

    plt.close()