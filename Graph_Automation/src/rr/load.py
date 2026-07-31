import pandas as pd
from config import EXCEL_FILE


def load_rr_sheet():

    df = pd.read_excel(
        EXCEL_FILE,
        sheet_name="Tab. RR",
        header=None
    )

    print(df.head(10))

    return df