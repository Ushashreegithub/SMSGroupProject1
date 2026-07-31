import pandas as pd
from config import EXCEL_FILE

def load_welding_sheet():

    df = pd.read_excel(
        EXCEL_FILE,
        sheet_name="Tab. Welding",
        header=3
    )

    return df