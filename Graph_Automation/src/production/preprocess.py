import pandas as pd


def preprocess_production(df):

    # Header row
    headers = df.iloc[3].tolist()

    # Data starts after header
    df = df.iloc[4:].reset_index(drop=True)

    df.columns = headers

    # Remove empty first column
    df = df.loc[:, df.columns.notna()]

    # Remove summary rows
    df = df[df["Month"].notna()]
    df = df[df["Month"] != "∑"]

    # Month
    df["Month"] = pd.to_datetime(df["Month"], errors="coerce")

    # Convert every other column to numeric
    for col in df.columns:

        if col == "Month":
            continue

        df[col] = (
            df[col]
            .astype(str)
            .str.replace(",", "", regex=False)
            .str.strip()
        )

        df[col] = pd.to_numeric(df[col], errors="coerce")

    # Remove rows without dates
    df = df[df["Month"].notna()]

    return df.reset_index(drop=True)