from config import (
    WELDING_CHART_DIR,
    MACHINING_CHART_DIR,
    ASSEMBLY_CHART_DIR,
    RR_CHART_DIR,
    PRODUCTION_CHART_DIR,
)

# =====================================================
# WELDING
# =====================================================

from welding.load import load_welding_sheet
from welding.preprocess import preprocess_welding
from welding.chart_config import WELDING_CHARTS
from welding.charts import plot_line_chart
from welding.combo_dashboard import plot_welding_dashboard
from welding.excel_dashboard import plot_excel_dashboard

# =====================================================
# MACHINING
# =====================================================

from machining.load import load_machining_sheet
from machining.preprocess import preprocess_machining
from machining.dashboard import plot_machining_dashboard

# =====================================================
# ROLL REFURBISHMENT
# =====================================================

from rr.load import load_rr_sheet
from rr.preprocess import preprocess_rr
from rr.chart_config import RR_CHARTS
from rr.charts import plot_line_chart as plot_rr_chart
from rr.dashboard import plot_rr_dashboard

from config import RR_CHART_DIR

from plating.load import load_plating_sheet
from plating.preprocess import preprocess_plating
from plating.config import (
    PLATING_CHARTS,
    PLATING_CHART_DIR,
)
from plating.charts import plot_plating_chart
from plating.dashboard import plot_plating_dashboard

from production.load import load_production_sheet
from production.preprocess import preprocess_production
from production.config import PRODUCTION_CHARTS
from production.charts import plot_production_chart
from production.dashboard import plot_production_dashboard


# from service_machining.load import load_service_machining
# from service_machining.preprocess import preprocess_service_machining
# # from service_machining.charts import plot_service_charts
# from service_machining.dashboard import create_dashboard
# from service_machining.config import (
#     MILLING_DASHBOARD,
#     LATHE_DASHBOARD,
# )

from scb_dashboard.dashboard import create_dashboard


create_dashboard()




def main():

    # =====================================================
    # WELDING
    # =====================================================

    print("\n" + "=" * 80)
    print("WELDING MODULE")
    print("=" * 80)

    welding_df = load_welding_sheet()
    welding_df = preprocess_welding(welding_df)

    print(welding_df)

    # Individual Charts
    for chart in WELDING_CHARTS:

        plot_line_chart(
            df=welding_df,
            x_column="Month",
            y_column=chart["column"],
            title=chart["title"],
            y_label=chart["ylabel"],
            output_folder=WELDING_CHART_DIR,
            filename=chart["filename"],
            color=chart["color"],
        )

    # Welding Dashboard
    plot_welding_dashboard(
        welding_df,
        WELDING_CHART_DIR,
    )

    # Excel Style Dashboard
    plot_excel_dashboard(
        welding_df,
        WELDING_CHART_DIR,
    )

    # =====================================================
    # MACHINING
    # =====================================================

    print("\n" + "=" * 80)
    print("MACHINING MODULE")
    print("=" * 80)

    machining_df = load_machining_sheet()
    machining_df = preprocess_machining(machining_df)

    print(machining_df)

    plot_machining_dashboard(
        machining_df,
        MACHINING_CHART_DIR,
    )

    # =====================================================
# ROLL REFURBISHMENT
# =====================================================

print("\n" + "=" * 80)
print("ROLL REFURBISHMENT MODULE")
print("=" * 80)

# -----------------------------
# Load Excel
# -----------------------------

rr_df = load_rr_sheet()

# -----------------------------
# Preprocess
# -----------------------------

rr_df = preprocess_rr(rr_df)

print("\nRR DATA")
print(rr_df)

# -----------------------------
# Individual Charts
# -----------------------------

for chart in RR_CHARTS:

    plot_rr_chart(
        df=rr_df,
        x_column="Month",
        y_column=chart["column"],
        title=chart["title"],
        y_label=chart["ylabel"],
        output_folder=RR_CHART_DIR,
        filename=chart["filename"],
        color=chart["color"],
    )

# -----------------------------
# Dashboard
# -----------------------------

plot_rr_dashboard(
    rr_df,
    RR_CHART_DIR,
)

    # # =====================================================
    # # ASSEMBLY
    # # =====================================================

    # print("\n" + "=" * 80)
    # print("ASSEMBLY MODULE")
    # print("=" * 80)

    # assembly_df = load_assembly_sheet()

    # print("\nRaw Assembly Columns:")
    # print(assembly_df.columns.tolist())

    # assembly_df = preprocess_assembly(assembly_df)
    # print(assembly_df.columns.tolist())

    # print(assembly_df.head())

    # print("\nCleaned Assembly Data:")
    # print(assembly_df)

    # Individual Charts
    # for chart in ASSEMBLY_CHARTS:

    #     plot_assembly_chart(
    #         df=assembly_df,
    #         x_column="Month",
    #         y_column=chart["column"],
    #         title=chart["title"],
    #         y_label=chart["ylabel"],
    #         output_folder=ASSEMBLY_CHART_DIR,
    #         filename=chart["filename"],
    #         color=chart["color"],
    #     )

    # # Dashboard
    # plot_assembly_dashboard(
    #     assembly_df,
    #     ASSEMBLY_CHART_DIR,
    # )

print("\n")
print("=" * 80)
print("ALL DASHBOARDS GENERATED SUCCESSFULLY")
print("=" * 80)


    # =====================================================
# ROLL REFURBISHMENT
# =====================================================

print("\n" + "=" * 80)
print("ROLL REFURBISHMENT MODULE")
print("=" * 80)

rr_df = load_rr_sheet()
rr_df = preprocess_rr(rr_df)

print("\nRR DATA")
print(rr_df)

# Individual Charts
for chart in RR_CHARTS:

    plot_rr_chart(
        df=rr_df,
        x_column="Month",
        y_column=chart["column"],
        title=chart["title"],
        y_label=chart["ylabel"],
        output_folder=RR_CHART_DIR,
        filename=chart["filename"],
        color=chart["color"],
    )

# Dashboard
plot_rr_dashboard(
    rr_df,
    RR_CHART_DIR,
)

# ==========================================================
# PLATING
# ==========================================================

plating_df = load_plating_sheet()

plating_df = preprocess_plating(plating_df)

print("\nPLATING DATA\n")
print(plating_df)

for chart in PLATING_CHARTS:

    plot_plating_chart(
        df=plating_df,
        x_column="Month",
        y_column=chart["column"],
        title=chart["title"],
        y_label=chart["ylabel"],
        output_folder=PLATING_CHART_DIR,
        filename=chart["filename"],
        color=chart["color"],
    )

    plot_plating_dashboard(
    plating_df,
    PLATING_CHART_DIR,
)

    # =====================================================
# PRODUCTION
# =====================================================

print("\n" + "=" * 80)
print("PRODUCTION MODULE")
print("=" * 80)

production_df = load_production_sheet()

print(production_df.head())

production_df = preprocess_production(production_df)

print("\nPRODUCTION DTYPES")
print(production_df.dtypes)

print("\nFIRST ROW")
print(production_df.iloc[0])
print("\nPRODUCTION COLUMNS")
print(production_df.columns.tolist())

print("\nFIRST 5 ROWS")
print(production_df.head())



print("\nPRODUCTION DATA")
print(production_df)

# -------------------------------------------------
# Individual Charts
# -------------------------------------------------

for chart in PRODUCTION_CHARTS:

    print("\nProduction dtypes")
    print(production_df.dtypes)

    print("\nChart column:")
    print(chart["column"])

    (production_df[chart["column"]].head())

    plot_production_chart(
        df=production_df,
        x_column="Month",
        y_column=chart["column"],
        title=chart["title"],
        y_label=chart["ylabel"],
        output_folder=PRODUCTION_CHART_DIR,
        filename=chart["filename"],
        color=chart["color"],
    )

# -------------------------------------------------
# Dashboard
# -------------------------------------------------

plot_production_dashboard(
    production_df,
    PRODUCTION_CHART_DIR,
)
file_path = "data/PD-Bhubaneswar-(India).xlsx"
# df = load_service_machining(file_path)
# df = preprocess_service_machining(df)

# create_dashboard(df, MILLING_DASHBOARD)
# create_dashboard(df, LATHE_DASHBOARD)


# print(df.columns.tolist())


if __name__ == "__main__":
    main()

