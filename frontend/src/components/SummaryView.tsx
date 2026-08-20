import React, { useEffect, useState } from "react";
import { Gauge, FolderKanban, Sparkles } from "lucide-react";
import { MonthlyTaskBreakdown } from "./MonthlyTaskBreakdown";
import { BackendProjectProgress } from "./BackendProjectProgress";
import {
  ManualCalculationResponse,
  fetchManualConfig,
  calculateManualPlanning,
} from "../lib/api";

interface SummaryViewProps {
  calculationResult: ManualCalculationResponse | null;
  onCalculationResultLoaded?: (
    result: ManualCalculationResponse | null
  ) => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({
  calculationResult,
  onCalculationResultLoaded,
}) => {
  const [displayCalculationResult, setDisplayCalculationResult] =
    useState<ManualCalculationResponse | null>(calculationResult);

  const [loadingCapacity, setLoadingCapacity] = useState<boolean>(false);

  useEffect(() => {
    setDisplayCalculationResult(calculationResult);
  }, [calculationResult]);

  /*
   * IMPORTANT:
   * Normal users cannot open Capacity Planning.
   *
   * Therefore, when Summary opens and calculationResult is empty,
   * we load the saved Capacity Planning configuration from backend
   * and calculate the result automatically.
   */
  useEffect(() => {
    const loadSavedCapacityPlanning = async () => {
      // If the result is already available, don't calculate again.
      if (calculationResult) {
        return;
      }

      try {
        setLoadingCapacity(true);

        const savedConfig = await fetchManualConfig();

        if (
          !savedConfig ||
          !savedConfig.tasks ||
          savedConfig.tasks.length === 0
        ) {
          setDisplayCalculationResult(null);
          return;
        }

        const result = await calculateManualPlanning(
          savedConfig.tasks.reduce(
            (total: number, task: any) =>
              total + Number(task.hours || task.allocated_hours || 0),
            0
          ),
          Number(savedConfig.year || 2026),
          savedConfig.tasks.map((task: any) => ({
            id: String(task.id),
            name: task.name || task.task_name || "Task",
            category: task.category || task.task_name || "General",
            hours: Number(
              task.hours || task.allocated_hours || 0
            ),
          }))
        );

        if (result) {
          setDisplayCalculationResult(result);

          if (onCalculationResultLoaded) {
            onCalculationResultLoaded(result);
          }
        }
      } catch (error) {
        console.warn(
          "Unable to load saved capacity planning data:",
          error
        );
        setDisplayCalculationResult(null);
      } finally {
        setLoadingCapacity(false);
      }
    };

    loadSavedCapacityPlanning();
  }, [calculationResult, onCalculationResultLoaded]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      {/* ============================================================
          SECTION 1: CAPACITY PLANNING SUMMARY
          ============================================================ */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {/* SECTION HEADER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 1.25rem",
            background:
              "#ffffff",
            borderLeft: "4px solid var(--accent-cyan)",
            borderRadius: "8px",
            borderTop: "1px solid #cbd5e1",
            borderRight: "1px solid #cbd5e1",
            borderBottom: "1px solid #cbd5e1",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
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

              <h2
                style={{
                  margin: 0,
                  color: "#0f172a",
                  fontSize: "1.1rem",
                  fontWeight: 800,
                }}
              >
                Capacity Planning Summary
              </h2>
            </div>

            <p
              style={{
                margin: "0.15rem 0 0 0",
                color: "var(--text-muted)",
                fontSize: "0.78rem",
              }}
            >
              Plant-wide Annual Available Capacity & Monthly Department Task
              Hours Breakdown (Table 3)
            </p>
          </div>
        </div>

        {/* ============================================================
            CAPACITY PLANNING TABLE
            ============================================================ */}

        {loadingCapacity ? (
          <div
            style={{
              padding: "2rem",
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "12px",
              textAlign: "center",
              color: "#334155",
              fontWeight: 600,
            }}
          >
            Loading capacity planning data...
          </div>
        ) : displayCalculationResult ? (
          <MonthlyTaskBreakdown
            calculationResult={displayCalculationResult}
          />
        ) : (
          <div
            style={{
              padding: "2rem",
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "12px",
              textAlign: "center",
              color: "#334155",
              fontWeight: 600,
            }}
          >
            No capacity planning data is available yet.
          </div>
        )}
      </section>

      {/* ============================================================
          DISTINCT VISUAL PARTITION DIVIDER
          ============================================================ */}
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
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0, 210, 255, 0.4) 50%, transparent 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            padding: "0.35rem 1.25rem",
            background: "#ffffff",
            border: "1px solid #cbd5e1",
            borderRadius: "20px",
            color: "var(--accent-cyan)",
            fontSize: "0.72rem",
            fontWeight: 800,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Sparkles size={12} color="var(--accent-cyan)" />

          Distinct Summary View Partition

          <Sparkles size={12} color="var(--accent-cyan)" />
        </div>
      </div>

      {/* ============================================================
          SECTION 2: PROJECT PLANNING
          ============================================================ */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {/* SECTION HEADER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 1.25rem",
            background:
              "#ffffff",
            borderLeft: "4px solid var(--accent-emerald)",
            borderRadius: "8px",
            borderTop: "1px solid #cbd5e1",
            borderRight: "1px solid #cbd5e1",
            borderBottom: "1px solid #cbd5e1",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
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
            <FolderKanban
              size={20}
              color="var(--accent-emerald)"
            />
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
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

              <h2
                style={{
                  margin: 0,
                  color: "#0f172a",
                  fontSize: "1.1rem",
                  fontWeight: 800,
                }}
              >
                Project Planning & Task Breakdown Display
              </h2>
            </div>

            <p
              style={{
                margin: "0.15rem 0 0 0",
                color: "var(--text-muted)",
                fontSize: "0.78rem",
              }}
            >
              Detailed Record of Projects Created in Project Planning with
              Calculated Task Distribution (e.g. Welding 15% Month 1 Ramp-up)
            </p>
          </div>
        </div>

        {/* PROJECT PLANNING DATA */}
        <BackendProjectProgress />
      </section>
    </div>
  );
};