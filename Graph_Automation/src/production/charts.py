def plot_production_chart(
    df,
    x_column,
    y_column,
    title,
    y_label,
    output_folder,
    filename,
    color,
):

    import os
    import matplotlib.pyplot as plt

    fig, ax = plt.subplots(figsize=(12,6))

    x = df[x_column]

    y = df[y_column].astype(float)

    ax.fill_between(
        x,
        y,
        color=color,
        alpha=0.35,
    )

    ax.plot(
        x,
        y,
        color=color,
        linewidth=3,
    )

    ax.set_title(title)

    ax.set_ylabel(y_label)

    ax.grid(True)

    os.makedirs(output_folder, exist_ok=True)

    plt.savefig(
        os.path.join(output_folder, filename),
        dpi=300,
        bbox_inches="tight",
    )

    plt.close()