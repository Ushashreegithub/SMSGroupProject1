import os
from .load import load_scb_actual
from .preprocess import preprocess_summary
from .plot import plot_dashboard


def create_dashboard(file_path=None, output_path=None):

    # Load the SUMMARY-CP sheet
    raw_df = load_scb_actual(file_path=file_path)

    # Create the master dataframe
    dashboard_df = preprocess_summary(raw_df)

    print("\n========== MASTER DATAFRAME ==========\n")
    print(dashboard_df)

    # -------------------------------------------------
    # Plot the stacked bar chart
    # -------------------------------------------------

    fig = plot_dashboard(dashboard_df)

    if not output_path:
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        output_dir = os.path.join(base_dir, "output")
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, "scb_dashboard.png")

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    fig.savefig(output_path, dpi=300)

    print(f"\nDashboard saved successfully to {output_path}.")
    return output_path