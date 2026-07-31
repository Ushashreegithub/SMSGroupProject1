import pandas as pd

class ExcelLoader:

    def __init__(self, file_path):
        self.file_path = file_path

    def get_sheet_names(self):
        excel = pd.ExcelFile(self.file_path)
        return excel.sheet_names

    def load_sheet(self, sheet_name):
        return pd.read_excel(
            self.file_path,
            sheet_name=sheet_name
        )