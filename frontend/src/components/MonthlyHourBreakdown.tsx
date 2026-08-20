import React from "react";
import { Calculator } from "lucide-react";
import { ManualCalculationResponse } from "../lib/api";
import { DepartmentTaskInput } from "./ManualInputPanel";

interface MonthlyTaskBreakdownProps {
  calculationResult: ManualCalculationResponse | null;
  tasks: DepartmentTaskInput[];
  year: number;
  annualHours: number;
  isCalculating?: boolean;
}

export const MonthlyTaskBreakdown: React.FC<MonthlyTaskBreakdownProps> = ({
  calculationResult,
  tasks,
  year,
  annualHours,
  isCalculating = false,
}) => {
  if (!calculationResult) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "var(--text-muted)",
          background: "#ffffff",
          border: "1px solid #cbd5e1",
        }}
      >
        <Calculator
          size={28}
          color="var(--accent-cyan)"
          style={{ marginBottom: "0.75rem" }}
        />

        <div style={{ fontWeight: 700, color: "#0f172a" }}>
          Monthly calculation not available
        </div>

        <div style={{ fontSize: "0.8rem", marginTop: "0.35rem" }}>
          Enter planning inputs in Capacity Planning to generate the monthly
          breakdown.
        </div>
      </div>
    );
  }

  const daysInYear =
    calculationResult.inputs?.total_days_in_year ?? 365;

  const dailyAvailableHours =
    calculationResult.inputs?.daily_available_hours ??
    annualHours / daysInYear;

  return (
    <div
      className="glass-panel"
      style={{
        background: "#ffffff",
        borderRadius: "12px",
        padding: "1.25rem",
        border: "1px solid #cbd5e1",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.04)",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
          }}
        >
          <div
            style={{
              padding: "0.5rem",
              background: "rgba(2, 132, 199, 0.1)",
              borderRadius: "8px",
            }}
          >
            <Calculator size={20} color="var(--accent-cyan)" />
          </div>

          <div>
            <h3
              style={{
                fontSize: "1.05rem",
                fontWeight: 800,
                color: "#0f172a",
                margin: 0,
              }}
            >
              Calculated Monthly Task Hours Breakdown
            </h3>

            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
              }}
            >
              Planning year: {year}
            </span>
          </div>
        </div>

        {isCalculating && (
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--accent-cyan)",
            }}
          >
            Recalculating...
          </span>
        )}
      </div>

      {/* SUMMARY STRIP */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0.75rem",
          marginBottom: "1.25rem",
        }}
      >
        <div
          style={{
            padding: "0.8rem",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              fontSize: "0.65rem",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Annual Capacity
          </div>

          <div
            style={{
              fontSize: "1.2rem",
              fontWeight: 800,
              color: "var(--accent-cyan)",
              marginTop: "0.2rem",
            }}
          >
            {annualHours.toLocaleString()} hrs
          </div>
        </div>

        <div
          style={{
            padding: "0.8rem",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              fontSize: "0.65rem",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Daily Capacity
          </div>

          <div
            style={{
              fontSize: "1.2rem",
              fontWeight: 800,
              color: "var(--accent-emerald)",
              marginTop: "0.2rem",
            }}
          >
            {dailyAvailableHours.toFixed(2)} hrs
          </div>
        </div>

        <div
          style={{
            padding: "0.8rem",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              fontSize: "0.65rem",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Tasks
          </div>

          <div
            style={{
              fontSize: "1.2rem",
              fontWeight: 800,
              color: "var(--accent-blue)",
              marginTop: "0.2rem",
            }}
          >
            {tasks.length}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div
        style={{
          overflowX: "auto",
          borderRadius: "8px",
          border: "1px solid #cbd5e1",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.78rem",
            minWidth: "950px",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f1f5f9",
                borderBottom: "2px solid #cbd5e1",
              }}
            >
              <th
                style={{
                  padding: "0.8rem",
                  textAlign: "left",
                  color: "#334155",
                  fontWeight: 700,
                }}
              >
                MONTH
              </th>

              <th
                style={{
                  padding: "0.8rem",
                  textAlign: "center",
                  color: "#334155",
                  fontWeight: 700,
                }}
              >
                DAYS
              </th>

              <th
                style={{
                  padding: "0.8rem",
                  textAlign: "right",
                  color: "var(--accent-emerald)",
                  fontWeight: 700,
                }}
              >
                PLANT AVAILABLE
              </th>

              {tasks.map((task) => (
                <th
                  key={task.id}
                  style={{
                    padding: "0.8rem",
                    textAlign: "right",
                    color: "var(--accent-cyan)",
                    fontWeight: 700,
                  }}
                >
                  {task.name.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {calculationResult.monthly_calculations.map((month, index) => (
              <tr
                key={month.month}
                style={{
                  borderBottom: "1px solid #e2e8f0",
                  background: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                }}
              >
                <td
                  style={{
                    padding: "0.7rem 0.8rem",
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  {month.month}
                </td>

                <td
                  style={{
                    padding: "0.7rem 0.8rem",
                    textAlign: "center",
                    color: "#475569",
                  }}
                >
                  {month.days_in_month}
                </td>

                <td
                  style={{
                    padding: "0.7rem 0.8rem",
                    textAlign: "right",
                    fontWeight: 800,
                    color: "var(--accent-emerald)",
                  }}
                >
                  {month.monthly_available_hours.toLocaleString()} hrs
                </td>

                {month.tasks.map((task) => (
                  <td
                    key={task.id}
                    style={{
                      padding: "0.7rem 0.8rem",
                      textAlign: "right",
                      color: "var(--text-main)",
                      fontWeight: 600,
                    }}
                  >
                    {task.monthly_hours.toLocaleString()} hrs
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

          {/* TOTAL */}
          <tfoot>
            <tr
              style={{
                background: "#f1f5f9",
                borderTop: "2px solid #0284c7",
              }}
            >
              <td
                style={{
                  padding: "0.8rem",
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                TOTAL ANNUAL
              </td>

              <td
                style={{
                  padding: "0.8rem",
                  textAlign: "center",
                  fontWeight: 800,
                  color: "var(--accent-cyan)",
                }}
              >
                {daysInYear}d
              </td>

              <td
                style={{
                  padding: "0.8rem",
                  textAlign: "right",
                  fontWeight: 800,
                  color: "var(--accent-emerald)",
                }}
              >
                {annualHours.toLocaleString()} hrs
              </td>

              {tasks.map((task) => {
                const total = calculationResult.monthly_calculations.reduce(
                  (sum, month) => {
                    const found = month.tasks.find(
                      (x) => x.id === task.id
                    );

                    return sum + (found?.monthly_hours || 0);
                  },
                  0
                );

                return (
                  <td
                    key={task.id}
                    style={{
                      padding: "0.8rem",
                      textAlign: "right",
                      fontWeight: 800,
                      color: "var(--accent-cyan)",
                    }}
                  >
                    {Math.round(total).toLocaleString()} hrs
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* FORMULA */}
      <div
        style={{
          marginTop: "1rem",
          padding: "0.7rem 0.85rem",
          borderRadius: "7px",
          background: "rgba(0,210,255,0.05)",
          border: "1px solid rgba(0,210,255,0.12)",
          fontSize: "0.72rem",
          color: "var(--text-muted)",
        }}
      >
        <strong style={{ color: "var(--accent-cyan)" }}>
          Calculation:
        </strong>{" "}
        Annual Task Hours ÷ {daysInYear} days × Days in Month
      </div>
    </div>
  );
};