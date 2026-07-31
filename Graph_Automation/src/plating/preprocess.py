import pandas as pd


def preprocess_plating(df):

    # ---------------------------------------------
    # Header row
    # ---------------------------------------------

    df.columns = df.iloc[3]
    df = df.iloc[4:].reset_index(drop=True)

    # Remove empty columns
    df = df.loc[:, ~df.columns.isna()]

    # ---------------------------------------------
    # Keep only rows whose Month is a real date
    # ---------------------------------------------

    df["Month"] = pd.to_datetime(
        df["Month"],
        errors="coerce"
    )

    # Drop Total / Average / ∑ rows
    df = df[df["Month"].notna()].reset_index(drop=True)

    # ---------------------------------------------
    # Numeric columns
    # ---------------------------------------------

    numeric_cols = [
        "Orders",
        "Service Basic",
        "NPK",
    ]

    for col in numeric_cols:
        df[col] = pd.to_numeric(
            df[col],
            errors="coerce"
        ).fillna(0)

    # Planned Production
    df["Planned Production"] = (
        df["Orders"]
        +
        df["Service Basic"]
    )

    # Capacity Difference
    df["Capacity Difference"] = (
        df["NPK"]
        -
        df["Planned Production"]
    )

    return df