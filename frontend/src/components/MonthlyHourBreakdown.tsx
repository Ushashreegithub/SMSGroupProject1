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
        }}
      >
        <Calculator
          size={28}
          color="var(--accent-cyan)"
          style={{ marginBottom: "0.75rem" }}
        />

        <div style={{ fontWeight: 700, color: "#fff" }}>
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
        background: "rgba(10, 16, 30, 0.7)",
        borderRadius: "12px",
        padding: "1.25rem",
        border: "1px solid rgba(0, 210, 255, 0.2)",
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
              background: "rgba(0, 210, 255, 0.1)",
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
                color: "#fff",
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
            background: "rgba(0, 210, 255, 0.06)",
            border: "1px solid rgba(0, 210, 255, 0.15)",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              fontSize: "0.65rem",
              color: "var(--text-muted)",
              textTransform: "uppercase",
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
            background: "rgba(16, 185, 129, 0.06)",
            border: "1px solid rgba(16, 185, 129, 0.15)",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              fontSize: "0.65rem",
              color: "var(--text-muted)",
              textTransform: "uppercase",
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
            background: "rgba(58, 123, 213, 0.06)",
            border: "1px solid rgba(58, 123, 213, 0.15)",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              fontSize: "0.65rem",
              color: "var(--text-muted)",
              textTransform: "uppercase",
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
          border: "1px solid rgba(255,255,255,0.06)",
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
                background: "rgba(255,255,255,0.05)",
                borderBottom: "1px solid var(--border-color)",
              }}
            >
              <th
                style={{
                  padding: "0.8rem",
                  textAlign: "left",
                  color: "var(--text-muted)",
                }}
              >
                MONTH
              </th>

              <th
                style={{
                  padding: "0.8rem",
                  textAlign: "center",
                  color: "var(--text-muted)",
                }}
              >
                DAYS
              </th>

              <th
                style={{
                  padding: "0.8rem",
                  textAlign: "right",
                  color: "var(--accent-emerald)",
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
                  borderBottom:
                    "1px solid rgba(255,255,255,0.04)",
                  background:
                    index % 2 === 0
                      ? "transparent"
                      : "rgba(255,255,255,0.015)",
                }}
              >
                <td
                  style={{
                    padding: "0.7rem 0.8rem",
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {month.month}
                </td>

                <td
                  style={{
                    padding: "0.7rem 0.8rem",
                    textAlign: "center",
                    color: "var(--text-muted)",
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
                background: "rgba(0,210,255,0.08)",
                borderTop: "2px solid var(--accent-cyan)",
              }}
            >
              <td
                style={{
                  padding: "0.8rem",
                  fontWeight: 800,
                  color: "#fff",
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