from .load import load_scb_actual
from .preprocess import preprocess_summary
from .plot import plot_dashboard



def create_dashboard():

    # Load the SUMMARY-CP sheet
    raw_df = load_scb_actual()

    # Create the master dataframe
    dashboard_df = preprocess_summary(raw_df)

    print("\n========== MASTER DATAFRAME ==========\n")
    print(dashboard_df)

    # -------------------------------------------------
    # Print all GROUP COMPANY rows from the workbook
    # -------------------------------------------------

    group_rows = raw_df[raw_df.iloc[:, 1] == "GROUP COMPANY"]

    print("\n========== GROUP COMPANY ROWS ==========\n")

    if not group_rows.empty:
        print(group_rows.to_string())
    else:
        print("No GROUP COMPANY rows found.")

    # -------------------------------------------------
    # Print all CONTRACT MANUFACTURING rows
    # -------------------------------------------------

    contract_rows = raw_df[
        raw_df.iloc[:, 1] == "CONTRACT MANUFACTURING"
    ]

    print("\n========== CONTRACT MANUFACTURING ROWS ==========\n")

    if not contract_rows.empty:
        print(contract_rows.to_string())
    else:
        print("No CONTRACT MANUFACTURING rows found.")

    # -------------------------------------------------
    # Plot the stacked bar chart
    # -------------------------------------------------

    fig = plot_dashboard(dashboard_df)

    fig.savefig("output/scb_dashboard.png", dpi=300)

    print("\nDashboard saved successfully.")