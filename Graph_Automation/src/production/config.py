from pathlib import Path

# ======================================================
# OUTPUT DIRECTORY
# ======================================================

PRODUCTION_CHART_DIR = Path("output/production")


# ======================================================
# INDIVIDUAL CHARTS
# ======================================================

PRODUCTION_CHARTS = [

    {
        "column": "Orders",
        "title": "Production Orders",
        "ylabel": "Hours",
        "filename": "Orders.png",
        "color": "#5B8CCB",
    },

    {
        "column": "LOI",
        "title": "LOI Backlog",
        "ylabel": "Hours",
        "filename": "LOI.png",
        "color": "#1F3D66",
    },

    {
        "column": "Service Basic",
        "title": "Service Basic",
        "ylabel": "Hours",
        "filename": "Service_Basic.png",
        "color": "#0B9E16",
    },

    {
        "column": "SMI",
        "title": "SMI",
        "ylabel": "Hours",
        "filename": "SMI.png",
        "color": "#777777",
    },

    {
        "column": "NPK +LABOUR SUPPLY Capacity",
        "title": "NPK + Labour Supply Capacity",
        "ylabel": "Hours",
        "filename": "NPK_Labour.png",
        "color": "#999999",
    },

    {
        "column": "NPK + Labour Supply+ Job contractor capacity",
        "title": "NPK + Labour + Job Contractor Capacity",
        "ylabel": "Hours",
        "filename": "Total_Capacity.png",
        "color": "#BBBBBB",
    },

]