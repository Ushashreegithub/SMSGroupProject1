import pandas as pd


def preprocess_welding(df):
    """
    Clean the Welding sheet and keep only monthly data.
    """

    # ---------------------------------------
    # Remove completely empty columns
    # ---------------------------------------
    df = df.dropna(axis=1, how="all")

    # ---------------------------------------
    # Keep only rows where Month is a real date
    # ---------------------------------------
    df["Month"] = pd.to_datetime(
        df["Month"],
        errors="coerce"
    )

    # Remove rows like:
    # Total 12 months
    # ∑
    # Ø
    df = df[df["Month"].notna()]

    # ---------------------------------------
    # Rename unnamed columns
    # ---------------------------------------
    df = df.rename(columns={
        "Unnamed: 13": "Planned Production",
        "Unnamed: 14": "Capacity Difference"
    })

    # ---------------------------------------
    # Remove empty first column if it exists
    # ---------------------------------------
    if "Unnamed: 0" in df.columns:
        df = df.drop(columns=["Unnamed: 0"])

    # ---------------------------------------
    # Convert every remaining numeric column
    # ---------------------------------------
    numeric_columns = df.columns.drop("Month")

    df[numeric_columns] = df[numeric_columns].apply(
        pd.to_numeric,
        errors="coerce"
    )

    # Reset index
    df = df.reset_index(drop=True)

    return df