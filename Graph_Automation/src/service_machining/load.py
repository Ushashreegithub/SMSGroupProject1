import pandas as pd

SERVICE_MACHINING_SHEET = "Service Machining"


def load_service_machining(excel_path):
    """
    Load Service Machining worksheet
    """
    df = pd.read_excel(
        excel_path,
        sheet_name=SERVICE_MACHINING_SHEET,
        header=None
    )

    return df