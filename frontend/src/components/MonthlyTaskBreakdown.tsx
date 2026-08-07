import React from "react";
import { Calculator } from "lucide-react";
import { ManualCalculationResponse } from "../lib/api";

interface MonthlyTaskBreakdownProps {
  calculationResult?: ManualCalculationResponse | null;
}

export const MonthlyTaskBreakdown: React.FC<
  MonthlyTaskBreakdownProps
> = ({ calculationResult }) => {
  if (!calculationResult) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: "1.5rem",
          border:
            "1px solid rgba(0, 210, 255, 0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
          }}
        >
          <Calculator
            size={20}
            color="var(--accent-cyan)"
          />

          <h3
            style={{
              margin: 0,
              color: "#ffffff",
              fontSize: "1.05rem",
              fontWeight: 800,
            }}
          >
            Calculated Monthly Task Hours Breakdown
          </h3>
        </div>

        <p
          style={{
            marginTop: "0.75rem",
            color: "var(--text-muted)",
            fontSize: "0.8rem",
          }}
        >
          Monthly task calculations will appear here
          after planning data is available.
        </p>
      </div>
    );
  }

  const monthlyCalculations =
    calculationResult.monthly_calculations || [];

  const tasks =
    monthlyCalculations.length > 0
      ? monthlyCalculations[0].tasks
      : [];

  const inputs = calculationResult.inputs;

  const annualHours =
    inputs?.annual_hours || 0;

  const year =
    inputs?.year || new Date().getFullYear();

  const daysInYear =
    inputs?.total_days_in_year || 365;

  const dailyAvailableHours =
    inputs?.daily_available_hours || 0;

  return (
    <div
      className="glass-panel"
      style={{
        padding: "1.25rem",
        background:
          "rgba(10, 16, 30, 0.7)",
        borderRadius: "10px",
        border:
          "1px solid rgba(0, 210, 255, 0.2)",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
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
          <Calculator
            size={20}
            color="var(--accent-emerald)"
          />

          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "1.05rem",
                fontWeight: 800,
                color: "#ffffff",
              }}
            >
              Calculated Monthly Task Hours
              Breakdown
            </h3>

            <span
              style={{
                fontSize: "0.7rem",
                color:
                  "var(--text-muted)",
              }}
            >
              Planning Year: {year}
            </span>
          </div>
        </div>

        <div
          style={{
            background:
              "rgba(0, 210, 255, 0.08)",
            padding:
              "0.35rem 0.75rem",
            borderRadius: "6px",
            border:
              "1px solid rgba(0, 210, 255, 0.2)",
            color:
              "var(--accent-cyan)",
            fontSize: "0.72rem",
          }}
        >
          <strong>
            Task-Based Formula:
          </strong>{" "}
          Annual Task Hours ÷ {daysInYear} ×
          Days in Month
        </div>
      </div>

      {/* SUMMARY INFO */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, 1fr)",
          gap: "0.75rem",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            padding: "0.75rem",
            borderRadius: "8px",
            background:
              "rgba(15, 23, 42, 0.8)",
            border:
              "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div
            style={{
              fontSize: "0.65rem",
              color:
                "var(--text-muted)",
            }}
          >
            ANNUAL PLANT HOURS
          </div>

          <div
            style={{
              fontSize: "1.1rem",
              fontWeight: 800,
              color:
                "var(--accent-cyan)",
              marginTop: "0.2rem",
            }}
          >
            {annualHours.toLocaleString()} hrs
          </div>
        </div>

        <div
          style={{
            padding: "0.75rem",
            borderRadius: "8px",
            background:
              "rgba(15, 23, 42, 0.8)",
            border:
              "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div
            style={{
              fontSize: "0.65rem",
              color:
                "var(--text-muted)",
            }}
          >
            DAILY AVAILABLE
          </div>

          <div
            style={{
              fontSize: "1.1rem",
              fontWeight: 800,
              color:
                "var(--accent-emerald)",
              marginTop: "0.2rem",
            }}
          >
            {dailyAvailableHours.toFixed(
              2
            )}{" "}
            hrs/day
          </div>
        </div>

        <div
          style={{
            padding: "0.75rem",
            borderRadius: "8px",
            background:
              "rgba(15, 23, 42, 0.8)",
            border:
              "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div
            style={{
              fontSize: "0.65rem",
              color:
                "var(--text-muted)",
            }}
          >
            PLANNING YEAR
          </div>

          <div
            style={{
              fontSize: "1.1rem",
              fontWeight: 800,
              color: "#ffffff",
              marginTop: "0.2rem",
            }}
          >
            {year}
          </div>
        </div>
      </div>

      {/* TABLE */}

      <div
        style={{
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse",
            fontSize: "0.8rem",
          }}
        >
          <thead>
            <tr
              style={{
                background:
                  "rgba(255, 255, 255, 0.05)",
                borderBottom:
                  "1px solid var(--border-color)",
              }}
            >
              <th
                style={{
                  padding:
                    "0.75rem",
                  textAlign: "left",
                  color:
                    "var(--text-muted)",
                }}
              >
                MONTH
              </th>

              <th
                style={{
                  padding:
                    "0.75rem",
                  textAlign: "center",
                  color:
                    "var(--text-muted)",
                }}
              >
                DAYS
              </th>

              <th
                style={{
                  padding:
                    "0.75rem",
                  textAlign: "right",
                  color:
                    "var(--accent-emerald)",
                }}
              >
                MONTHLY AVL
                <br />
                <span
                  style={{
                    fontSize:
                      "0.65rem",
                  }}
                >
                  HRS
                </span>
              </th>

              {tasks.map((task) => (
                <th
                  key={task.id}
                  style={{
                    padding:
                      "0.75rem",
                    textAlign:
                      "right",
                    color:
                      "var(--accent-cyan)",
                    whiteSpace:
                      "nowrap",
                  }}
                >
                  {task.name.toUpperCase()}
                  <br />
                  <span
                    style={{
                      fontSize:
                        "0.65rem",
                    }}
                  >
                    HRS
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {monthlyCalculations.map(
              (month, index) => (
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
                      padding:
                        "0.65rem 0.75rem",
                      fontWeight: 700,
                      color:
                        "#ffffff",
                    }}
                  >
                    {month.month}
                  </td>

                  <td
                    style={{
                      padding:
                        "0.65rem 0.75rem",
                      textAlign:
                        "center",
                      color:
                        "var(--text-muted)",
                    }}
                  >
                    {month.days_in_month}d
                  </td>

                  <td
                    style={{
                      padding:
                        "0.65rem 0.75rem",
                      textAlign:
                        "right",
                      fontWeight: 800,
                      color:
                        "var(--accent-emerald)",
                    }}
                  >
                    {month.monthly_available_hours.toLocaleString()}
                  </td>

                  {month.tasks.map(
                    (task) => (
                      <td
                        key={task.id}
                        style={{
                          padding:
                            "0.65rem 0.75rem",
                          textAlign:
                            "right",
                          color:
                            "var(--text-main)",
                        }}
                      >
                        {task.monthly_hours.toLocaleString()}
                      </td>
                    )
                  )}
                </tr>
              )
            )}
          </tbody>

          {/* TOTAL */}

          <tfoot>
            <tr
              style={{
                background:
                  "rgba(0, 210, 255, 0.08)",
                borderTop:
                  "2px solid var(--accent-cyan)",
              }}
            >
              <td
                style={{
                  padding:
                    "0.75rem",
                  fontWeight: 800,
                  color: "#ffffff",
                }}
              >
                TOTAL ANNUAL
              </td>

              <td
                style={{
                  padding:
                    "0.75rem",
                  textAlign:
                    "center",
                  fontWeight: 800,
                  color:
                    "var(--accent-cyan)",
                }}
              >
                {daysInYear}d
              </td>

              <td
                style={{
                  padding:
                    "0.75rem",
                  textAlign:
                    "right",
                  fontWeight: 800,
                  color:
                    "var(--accent-emerald)",
                }}
              >
                {annualHours.toLocaleString()}
              </td>

              {tasks.map(
                (task) => {
                  const annualTaskTotal =
                    monthlyCalculations.reduce(
                      (
                        total,
                        month
                      ) => {
                        const found =
                          month.tasks.find(
                            (item) =>
                              item.id ===
                              task.id
                          );

                        return (
                          total +
                          (found?.monthly_hours ||
                            0)
                        );
                      },
                      0
                    );

                  return (
                    <td
                      key={
                        task.id
                      }
                      style={{
                        padding:
                          "0.75rem",
                        textAlign:
                          "right",
                        fontWeight:
                          800,
                        color:
                          "var(--accent-cyan)",
                      }}
                    >
                      {Math.round(
                        annualTaskTotal
                      ).toLocaleString()}
                    </td>
                  );
                }
              )}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default MonthlyTaskBreakdown;