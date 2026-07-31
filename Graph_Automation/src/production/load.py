import pandas as pd

from config import EXCEL_FILE


def load_production_sheet():
    """
    Load Production sheet from Excel workbook.
    """

    df = pd.read_excel(
        EXCEL_FILE,
        sheet_name="Tab. Production",
        header=None
    )

    print("\nPRODUCTION RAW DATA")
    print(df.head(10))

    return df