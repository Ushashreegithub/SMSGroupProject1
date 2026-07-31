import matplotlib.pyplot as plt

from service_machining.config import (
    SERVICE_MACHINING_CHART_DIR,
)

def create_dashboard(df, config):
    """
    Create a Service Machining dashboard
    for Milling or Lathe.
    """
    months = df["Month"]

    orders = df[config["orders"]]
    service = df[config["service"]]
    loi = df[config["loi"]]
    capacity = df[config["capacity"]]

    bottom_orders = 0

    bottom_loi = orders

    bottom_service = orders + loi

    fig, ax = plt.subplots(
    figsize=(15, 6)
)

    print(months.dtype)
    print(capacity.dtype)

    print(type(months))
    print(type(capacity))

    print(months.head())
    print(capacity.head())
    
    ax.fill_between(
    months,
    capacity,
    color="#D9D9D9",
    alpha=1,
    zorder=1,
)

    bar_width = 18

    ax.bar(
    months,
    orders,
    width=bar_width,
    color="#5B8CCB",
    edgecolor="black",
    linewidth=0.4,
    label="Orders",
    zorder=3,
)

    ax.bar(
    months,
    loi,
    bottom=bottom_loi,
    width=bar_width,
    color="#1F3D66",
    edgecolor="black",
    linewidth=0.4,
    label="LOI",
    zorder=4,
)

    ax.bar(
    months,
    service,
    bottom=bottom_service,
    width=bar_width,
    color="#13A113",
    edgecolor="black",
    linewidth=0.4,
    label="Service Basic",
    zorder=5,
)

    ax.plot(
    months,
    capacity,
    color="black",
    linewidth=2,
    zorder=6,
)

    orders_total = orders.sum()

    service_total = service.sum()

    loi_total = loi.sum()

    capacity_total = capacity.sum()

    output = (
    SERVICE_MACHINING_CHART_DIR
    / f"{config['title']}.png"
)

    plt.savefig(
    output,
    dpi=300,
    bbox_inches="tight"
)

plt.close()

