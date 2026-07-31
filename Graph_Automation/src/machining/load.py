import pandas as pd

from config import EXCEL_FILE


def load_machining_sheet():
    """
    Load the Machining worksheet from Excel.
    """

    df = pd.read_excel(
        EXCEL_FILE,
        sheet_name="Tab. Machining",
        header=3
    )

    return df