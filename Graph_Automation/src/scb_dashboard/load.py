import pandas as pd


def load_scb_actual():

    file_path = "data/SCB Capacity Planning (1).xlsx"

    df = pd.read_excel(
        file_path,
        sheet_name="SCB ACTUAL",
        header=None
    )

    print(df.iloc[15:23])

    return df