from pathlib import Path

PLATING_CHART_DIR = Path("output/plating")

PLATING_CHARTS = [

    {
        "column": "Orders",
        "title": "Plating Orders",
        "ylabel": "Hours",
        "filename": "Orders.png",
        "color": "#5B8CCB",
    },

    {
        "column": "Service Basic",
        "title": "Service Basic",
        "ylabel": "Hours",
        "filename": "Service_Basic.png",
        "color": "#1F3D66",
    },

    {
        "column": "NPK",
        "title": "NPK Capacity",
        "ylabel": "Hours",
        "filename": "NPK.png",
        "color": "#999999",
    },
]