from pathlib import Path



# Project Root
BASE_DIR = Path(__file__).resolve().parent.parent

# Data Folder
DATA_DIR = BASE_DIR / "data"

# Excel File
EXCEL_FILE = DATA_DIR / "PD-Bhubaneswar-(India).xlsx"

# Output Folder
OUTPUT_DIR = BASE_DIR / "output"

# Charts Folder
CHART_DIR = OUTPUT_DIR / "charts"

# Welding Charts Folder
WELDING_CHART_DIR = CHART_DIR / "welding"

MACHINING_CHART_DIR = "outputs/machining"

ASSEMBLY_CHART_DIR = "output/assembly"

RR_CHART_DIR = OUTPUT_DIR / "rr"


PRODUCTION_CHART_DIR = OUTPUT_DIR / "Production"