import pandas as pd


def preprocess_machining(df):
    """
    Clean the Machining worksheet.
    """

    # Remove completely empty rows
    df = df.dropna(how="all")

    # Convert Month column
    df["Month"] = pd.to_datetime(
        df["Month"],
        errors="coerce"
    )

    # Keep only valid months
    df = df.dropna(subset=["Month"])

    # Reset index
    df = df.reset_index(drop=True)

    # Convert numeric columns
    numeric_columns = [
        "Orders",
        "LOI",
        "Service Basic",
        "NPK"
    ]

    for col in numeric_columns:
        df[col] = pd.to_numeric(
            df[col],
            errors="coerce"
        ).fillna(0)

    return df