from pathlib import Path

# Project root
BASE_DIR = Path(__file__).resolve().parents[2]

# Excel file
DATA_FILE = BASE_DIR / "data" / "SCB Capacity Planning (1).xlsx"

# Sheet name
SHEET_NAME = "SUMMARY-CP"

# Output directory
OUTPUT_DIR = BASE_DIR / "output" / "SCB Dashboard"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Output image
OUTPUT_IMAGE = OUTPUT_DIR / "SCB_Actual_Dashboard.png"