from pathlib import Path

# ======================================================
# OUTPUT DIRECTORY
# ======================================================

SERVICE_MACHINING_CHART_DIR = Path("output/service_machining")


# ======================================================
# DASHBOARD CONFIGURATION
# ======================================================

MILLING_DASHBOARD = {
    "title": "Milling Machine",
    "orders": "Orders CNC Milling",
    "service": "Service Basic Milling",
    "loi": "LOI Milling",
    "capacity": "NPK CNC Milling",
    "total": "Total Milling",
    "available": "Available Milling",
}


LATHE_DASHBOARD = {
    "title": "Lathe",
    "orders": "Orders Lathe",
    "service": "Service Basic Lathe",
    "loi": "LOI Lathe",
    "capacity": "NPK Lathe",
    "total": "Total Lathe",
    "available": "Available Lathe",
}