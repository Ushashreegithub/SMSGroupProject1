import pandas as pd


def preprocess_service_machining(df):
    """
    Clean Service Machining worksheet and return a structured dataframe.
    """

    # --------------------------------------------------
    # Header row
    # --------------------------------------------------
    df.columns = [
    "Month",
    "Orders CNC Milling",
    "Service Basic Milling",
    "LOI Milling",
    "Orders Lathe",
    "Service Basic Lathe",
    "last forecast",
    "report last Month",
    "LOI Lathe",
    "NPK CNC Milling",
    "NPK Lathe",
    "Total Milling",
    "Available Milling",
    "Total Lathe",
    "Available Lathe",
]

    # Data starts after header
    df = df.iloc[4:].reset_index(drop=True)

    # --------------------------------------------------
    # Remove unwanted rows
    # --------------------------------------------------
    df = df[df["Month"].notna()]

    df = df[df["Month"] != "∑"]

    df = df[df["Month"] != "Ø"]

    # Keep only the first 12 monthly rows
    df = df.iloc[:12].copy()

    # --------------------------------------------------
    # Convert Month
    # --------------------------------------------------
    df["Month"] = pd.to_datetime(df["Month"])


    print("\nColumns:")
    print(df.columns.tolist())

    print("\nDuplicate columns:")
    print(df.columns[df.columns.duplicated()].tolist())

    # --------------------------------------------------
    # Numeric columns
    # --------------------------------------------------
    numeric_columns = [
    "Orders CNC Milling",
    "Service Basic Milling",
    "LOI Milling",
    "Orders Lathe",
    "Service Basic Lathe",
    "last forecast",
    "report last Month",
    "LOI Lathe",
    "NPK CNC Milling",
    "NPK Lathe",
    "Total Milling",
    "Available Milling",
    "Total Lathe",
    "Available Lathe",
]

    for col in numeric_columns:
        if col in df.columns:
            print(f"{col} -> {type(df[col])}")
    # --------------------------------------------------
    # Preview
    # --------------------------------------------------
    print("\nSERVICE MACHINING DATA\n")
    print(df)

    return df