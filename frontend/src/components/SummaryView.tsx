import React from "react";
import { Gauge, FolderKanban, Sparkles, Layers } from "lucide-react";
import { MonthlyTaskBreakdown } from "./MonthlyTaskBreakdown";
import { BackendProjectProgress } from "./BackendProjectProgress";
import { ManualCalculationResponse } from "../lib/api";

interface SummaryViewProps {
  calculationResult: ManualCalculationResponse | null;
}

export const SummaryView: React.FC<SummaryViewProps> = ({
  calculationResult,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      {/* SECTION 1: CAPACITY PLANNING SUMMARY (TABLE 3) */}
      <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 1.25rem",
            background: "linear-gradient(90deg, rgba(0, 210, 255, 0.12) 0%, rgba(10, 16, 30, 0.4) 100%)",
            borderLeft: "4px solid var(--accent-cyan)",
            borderRadius: "8px",
            borderTop: "1px solid rgba(0, 210, 255, 0.2)",
            borderRight: "1px solid rgba(0, 210, 255, 0.1)",
            borderBottom: "1px solid rgba(0, 210, 255, 0.1)",
          }}
        >
          <div
            style={{
              padding: "0.4rem",
              background: "rgba(0, 210, 255, 0.15)",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Gauge size={20} color="var(--accent-cyan)" />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 900,
                  color: "var(--accent-cyan)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  padding: "0.15rem 0.45rem",
                  background: "rgba(0, 210, 255, 0.15)",
                  borderRadius: "4px",
                }}
              >
                Part I
              </span>
              <h2 style={{ margin: 0, color: "#ffffff", fontSize: "1.1rem", fontWeight: 800 }}>
                Capacity Planning Summary
              </h2>
            </div>
            <p style={{ margin: "0.15rem 0 0 0", color: "var(--text-muted)", fontSize: "0.78rem" }}>
              Plant-wide Annual Available Capacity & Monthly Department Task Hours Breakdown (Table 3)
            </p>
          </div>
        </div>

        {/* TABLE 3: Calculated Monthly Task Hours Breakdown */}
        <MonthlyTaskBreakdown calculationResult={calculationResult} />
      </section>

      {/* DISTINCT VISUAL PARTITION DIVIDER */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0.5rem 0",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "1px",
            background: "linear-gradient(90deg, transparent 0%, rgba(0, 210, 255, 0.4) 50%, transparent 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            padding: "0.35rem 1.25rem",
            background: "#080e18",
            border: "1px solid rgba(0, 210, 255, 0.3)",
            borderRadius: "20px",
            color: "var(--accent-cyan)",
            fontSize: "0.72rem",
            fontWeight: 800,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            boxShadow: "0 0 15px rgba(0, 210, 255, 0.15)",
          }}
        >
          <Sparkles size={12} color="var(--accent-cyan)" />
          Distinct Summary View Partition
          <Sparkles size={12} color="var(--accent-cyan)" />
        </div>
      </div>

      {/* SECTION 2: INDIVIDUAL PROJECT PLANNING PROGRESS */}
      <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 1.25rem",
            background: "linear-gradient(90deg, rgba(16, 185, 129, 0.12) 0%, rgba(10, 16, 30, 0.4) 100%)",
            borderLeft: "4px solid var(--accent-emerald)",
            borderRadius: "8px",
            borderTop: "1px solid rgba(16, 185, 129, 0.2)",
            borderRight: "1px solid rgba(16, 185, 129, 0.1)",
            borderBottom: "1px solid rgba(16, 185, 129, 0.1)",
          }}
        >
          <div
            style={{
              padding: "0.4rem",
              background: "rgba(16, 185, 129, 0.15)",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FolderKanban size={20} color="var(--accent-emerald)" />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 900,
                  color: "var(--accent-emerald)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  padding: "0.15rem 0.45rem",
                  background: "rgba(16, 185, 129, 0.15)",
                  borderRadius: "4px",
                }}
              >
                Part II
              </span>
              <h2 style={{ margin: 0, color: "#ffffff", fontSize: "1.1rem", fontWeight: 800 }}>
                Project Planning & Task Breakdown Display
              </h2>
            </div>
            <p style={{ margin: "0.15rem 0 0 0", color: "var(--text-muted)", fontSize: "0.78rem" }}>
              Detailed Record of Projects Created in Project Planning with Calculated Task Distribution (e.g. Welding 15% Month 1 Ramp-up)
            </p>
          </div>
        </div>

        {/* BACKEND PROJECT PLANNING & ENGINE PROGRESS DISPLAY */}
        <BackendProjectProgress />
      </section>
    </div>
  );
};