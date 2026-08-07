import React, { useEffect, useState } from "react";
import {
  Clock,
  Layers,
  Save,
  CheckCircle,
  Sliders,
} from "lucide-react";

import {
  calculateManualPlanning,
  fetchManualConfig,
  saveManualConfig,
  ManualCalculationResponse,
} from "../lib/api";

export interface DepartmentTaskInput {
  id: string;
  name: string;
  category: string;
  hours: number;
}

export const INITIAL_TASKS: DepartmentTaskInput[] = [
  {
    id: "welding",
    name: "Welding",
    category: "Heavy Fabrication",
    hours: 25000,
  },
  {
    id: "machining",
    name: "Machining",
    category: "Precision Turning & Milling",
    hours: 32000,
  },
  {
    id: "assembly",
    name: "Assembly",
    category: "Plant Equipment Assembly",
    hours: 22000,
  },
  {
    id: "rr",
    name: "Roll Repair (R&R)",
    category: "Refurbishment & Reconditioning",
    hours: 18000,
  },
  {
    id: "plating",
    name: "Plating",
    category: "Surface Treatment & Chrome",
    hours: 15000,
  },
];

export interface ManualInputPanelProps {
  onInputsChange?: (
    annualHours: number,
    tasks: DepartmentTaskInput[]
  ) => void;

  onCalculationResultChange?: (
    result: ManualCalculationResponse | null
  ) => void;
}

export const ManualInputPanel: React.FC<ManualInputPanelProps> = ({
  onInputsChange,
  onCalculationResultChange,
}) => {
  const initialTotalTaskHours = INITIAL_TASKS.reduce(
    (sum, task) => sum + task.hours,
    0
  );

  const [annualHours, setAnnualHours] = useState<number>(
    initialTotalTaskHours
  );

  const [year, setYear] = useState<number>(2026);

  const [tasks, setTasks] =
    useState<DepartmentTaskInput[]>(INITIAL_TASKS);

  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");

  const [calculationResult, setCalculationResult] =
    useState<ManualCalculationResponse | null>(null);

  const [isCalculating, setIsCalculating] =
    useState<boolean>(false);

  /*
   * ---------------------------------------------------------
   * LOAD SAVED CONFIGURATION
   * ---------------------------------------------------------
   */

  useEffect(() => {
    let isMounted = true;

    const localSaved = localStorage.getItem(
      "sms_capacity_planning_config"
    );

    if (localSaved) {
      try {
        const parsed = JSON.parse(localSaved);

        if (parsed.tasks && parsed.tasks.length > 0) {
          setTasks(parsed.tasks);

          const total = parsed.tasks.reduce(
            (sum: number, task: DepartmentTaskInput) =>
              sum + (Number(task.hours) || 0),
            0
          );

          setAnnualHours(total);
        }

        if (parsed.year) {
          setYear(parsed.year);
        }
      } catch (error) {
        console.warn(
          "Error reading local storage capacity config:",
          error
        );
      }
    }

    async function loadDbConfig() {
      try {
        const dbConfig = await fetchManualConfig();

        if (
          isMounted &&
          dbConfig &&
          dbConfig.tasks &&
          dbConfig.tasks.length > 0
        ) {
          setTasks(dbConfig.tasks);
          setYear(dbConfig.year || 2026);

          const total = dbConfig.tasks.reduce(
            (sum: number, task: DepartmentTaskInput) =>
              sum + (Number(task.hours) || 0),
            0
          );

          setAnnualHours(total);
        }
      } catch (error) {
        console.warn(
          "Unable to load manual configuration:",
          error
        );
      }
    }

    loadDbConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * SAVE CONFIGURATION
   * ---------------------------------------------------------
   */

  const persistConfig = (
    updatedYear: number,
    updatedTasks: DepartmentTaskInput[]
  ) => {
    localStorage.setItem(
      "sms_capacity_planning_config",
      JSON.stringify({
        year: updatedYear,
        tasks: updatedTasks,
      })
    );

    saveManualConfig(updatedYear, updatedTasks);
  };

  /*
   * ---------------------------------------------------------
   * KEEP ANNUAL HOURS IN SYNC WITH TASK HOURS
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const totalTaskHours = tasks.reduce(
      (sum, task) => sum + (Number(task.hours) || 0),
      0
    );

    if (totalTaskHours !== annualHours) {
      setAnnualHours(totalTaskHours);
    }
  }, [tasks, annualHours]);

  /*
   * ---------------------------------------------------------
   * CALCULATE PLANNING DATA
   *
   * IMPORTANT:
   * The result is NOT displayed here anymore.
   *
   * It is passed to Summary through:
   * onCalculationResultChange()
   * ---------------------------------------------------------
   */

  useEffect(() => {
    let isMounted = true;

    async function runCalculation() {
      setIsCalculating(true);

      try {
        const totalTaskHours = tasks.reduce(
          (sum, task) => sum + (Number(task.hours) || 0),
          0
        );

        const effectiveAnnualHours =
          tasks.length > 0 && totalTaskHours > 0
            ? totalTaskHours
            : annualHours;

        const result = await calculateManualPlanning(
          effectiveAnnualHours,
          year,
          tasks
        );

        if (!isMounted) {
          return;
        }

        if (result) {
          setCalculationResult(result);

          if (onCalculationResultChange) {
            onCalculationResultChange(result);
          }

          return;
        }

        /*
         * -----------------------------------------------------
         * LOCAL FALLBACK CALCULATION
         * -----------------------------------------------------
         */

        const isLeapYear =
          (year % 4 === 0 && year % 100 !== 0) ||
          year % 400 === 0;

        const totalDaysInYear = isLeapYear ? 366 : 365;

        const dailyAvailableHours =
          effectiveAnnualHours / totalDaysInYear;

        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        const daysPerMonth = [
          31,
          isLeapYear ? 29 : 28,
          31,
          30,
          31,
          30,
          31,
          31,
          30,
          31,
          30,
          31,
        ];

        const monthlyCalculations = monthNames.map(
          (monthName, index) => {
            const daysInMonth = daysPerMonth[index];

            let monthlyAvailableHours = 0;

            const taskBreakdown = tasks.map((task) => {
              const taskHours =
                Number(task.hours) || 0;

              const taskDailyHours =
                taskHours / totalDaysInYear;

              const taskMonthlyHours =
                taskDailyHours * daysInMonth;

              monthlyAvailableHours +=
                taskMonthlyHours;

              const share =
                totalTaskHours > 0
                  ? taskHours / totalTaskHours
                  : 1 / (tasks.length || 1);

              return {
                id: task.id,
                name: task.name,
                category: task.category,
                monthly_hours:
                  Math.round(
                    taskMonthlyHours * 100
                  ) / 100,

                daily_hours:
                  Math.round(
                    taskDailyHours * 100
                  ) / 100,

                days_in_month: daysInMonth,

                share_pct:
                  Math.round(
                    share * 10000
                  ) / 100,
              };
            });

            return {
              month: `${monthName} ${year}`,
              month_num: index + 1,
              days_in_month: daysInMonth,

              monthly_available_hours:
                Math.round(
                  monthlyAvailableHours * 100
                ) / 100,

              daily_available_hours:
                Math.round(
                  dailyAvailableHours * 10000
                ) / 10000,

              tasks: taskBreakdown,
            };
          }
        );

        const fallbackResult: ManualCalculationResponse = {
          status: "local_fallback",

          inputs: {
            annual_hours: effectiveAnnualHours,
            year: year,
            is_leap_year: isLeapYear,
            total_days_in_year: totalDaysInYear,
            daily_available_hours:
              Math.round(
                dailyAvailableHours * 10000
              ) / 10000,
            total_tasks_count: tasks.length,
          },

          monthly_calculations:
            monthlyCalculations,
        };

        setCalculationResult(fallbackResult);

        if (onCalculationResultChange) {
          onCalculationResultChange(fallbackResult);
        }
      } catch (error) {
        console.warn(
          "Manual calculation error:",
          error
        );

        if (isMounted) {
          setCalculationResult(null);

          if (onCalculationResultChange) {
            onCalculationResultChange(null);
          }
        }
      } finally {
        if (isMounted) {
          setIsCalculating(false);
        }
      }
    }

    runCalculation();

    return () => {
      isMounted = false;
    };
  }, [
    annualHours,
    year,
    tasks,
    onCalculationResultChange,
  ]);

  /*
   * ---------------------------------------------------------
   * YEAR CHANGE
   * ---------------------------------------------------------
   */

  const handleYearChange = (newYear: number) => {
    setYear(newYear);

    persistConfig(newYear, tasks);

    if (onInputsChange) {
      onInputsChange(annualHours, tasks);
    }
  };

  /*
   * ---------------------------------------------------------
   * TASK HOURS CHANGE
   * ---------------------------------------------------------
   */

  const handleTaskHoursChange = (
    id: string,
    value: number
  ) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            hours: Math.max(0, value),
          }
        : task
    );

    const newTotal = updatedTasks.reduce(
      (sum, task) =>
        sum + (Number(task.hours) || 0),
      0
    );

    setTasks(updatedTasks);
    setAnnualHours(newTotal);

    persistConfig(year, updatedTasks);

    if (onInputsChange) {
      onInputsChange(
        newTotal,
        updatedTasks
      );
    }
  };

  /*
   * ---------------------------------------------------------
   * SAVE
   * ---------------------------------------------------------
   */

  const handleSave = async () => {
    try {
      setSaveStatus("saving");

      await saveManualConfig(
        year,
        tasks
      );

      localStorage.setItem(
        "sms_capacity_planning_config",
        JSON.stringify({
          year,
          tasks,
        })
      );

      setSaveStatus("saved");

      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
    } catch (error) {
      console.error(
        "Error saving manual configuration:",
        error
      );

      setSaveStatus("idle");
    }
  };

  /*
   * ---------------------------------------------------------
   * CALCULATED VALUES
   * ---------------------------------------------------------
   */

  const totalAllocatedTaskHours =
    tasks.reduce(
      (sum, task) =>
        sum + (Number(task.hours) || 0),
      0
    );

  const inputsSummary =
    calculationResult?.inputs;

  const dailyAvailableHours =
    inputsSummary?.daily_available_hours ??
    annualHours / 365;

  const daysInYear =
    inputsSummary?.total_days_in_year ??
    365;

  /*
   * ---------------------------------------------------------
   * UI
   * ---------------------------------------------------------
   */

  return (
    <div
      className="glass-panel"
      style={{
        padding: "1.5rem",
        marginBottom: "2rem",
        border:
          "1px solid rgba(0, 210, 255, 0.25)",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.5rem",
          paddingBottom: "1rem",
          borderBottom:
            "1px solid var(--border-color)",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
            }}
          >
            <Sliders
              size={22}
              color="var(--accent-cyan)"
            />

            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: 800,
                color: "#ffffff",
              }}
            >
              Manual Data Input & Planning
              Calculations
            </h3>

            <span
              style={{
                background:
                  "rgba(0, 210, 255, 0.15)",
                color:
                  "var(--accent-cyan)",
                border:
                  "1px solid rgba(0, 210, 255, 0.3)",
                fontSize: "0.7rem",
                fontWeight: 700,
                padding:
                  "0.2rem 0.6rem",
                borderRadius: "12px",
              }}
            >
              SMS Group Requirements
            </span>
          </div>

          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              marginTop: "0.35rem",
            }}
          >
            Configure annual workload hours
            and planning year. Monthly
            calculations are displayed on
            the Summary page.
          </p>
        </div>

        <button
          onClick={handleSave}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background:
              saveStatus === "saved"
                ? "var(--accent-emerald)"
                : "linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))",
            color: "#ffffff",
            border: "none",
            padding: "0.5rem 1.1rem",
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer",
            boxShadow:
              "0 0 15px rgba(0, 210, 255, 0.3)",
          }}
        >
          {saveStatus === "saved" ? (
            <CheckCircle size={16} />
          ) : (
            <Save size={16} />
          )}

          {saveStatus === "saved"
            ? "Saved to Database!"
            : saveStatus === "saving"
            ? "Saving..."
            : "Save Manual Inputs"}
        </button>
      </div>

      {/* INPUT AREA */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 2fr",
          gap: "1.5rem",
          marginBottom: "1rem",
        }}
      >
        {/* ANNUAL HOURS */}

        <div
          className="glass-panel"
          style={{
            padding: "1.25rem",
            background:
              "rgba(10, 16, 30, 0.6)",
            border:
              "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            flexDirection: "column",
            justifyContent:
              "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  padding: "0.4rem",
                  background:
                    "rgba(0, 210, 255, 0.1)",
                  borderRadius: "8px",
                }}
              >
                <Clock
                  size={20}
                  color="var(--accent-cyan)"
                />
              </div>

              <div>
                <h4
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "#ffffff",
                  }}
                >
                  1. Annual Hours Output
                </h4>

                <span
                  style={{
                    fontSize: "0.725rem",
                    color:
                      "var(--text-muted)",
                  }}
                >
                  Total Plant Capacity
                </span>
              </div>
            </div>

            <label
              style={{
                display: "block",
                fontSize: "0.775rem",
                fontWeight: 600,
                color:
                  "var(--text-muted)",
                marginBottom: "0.5rem",
              }}
            >
              TOTAL AVAILABLE ANNUAL
              HOURS
            </label>

            <div
              style={{
                background:
                  "rgba(15, 23, 42, 0.9)",
                border:
                  "1px solid rgba(0, 210, 255, 0.35)",
                borderRadius: "8px",
                padding:
                  "0.85rem 1rem",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "space-between",
              }}
            >
              <span
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 800,
                  color:
                    "var(--accent-cyan)",
                }}
              >
                {annualHours.toLocaleString()}
              </span>

              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color:
                    "var(--text-muted)",
                }}
              >
                HRS / YEAR
              </span>
            </div>

            {/* YEAR */}

            <div
              style={{
                marginTop: "1.25rem",
              }}
            >
              <label
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color:
                    "var(--text-muted)",
                  marginBottom:
                    "0.35rem",
                }}
              >
                TARGET PLANNING YEAR
              </label>

              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                }}
              >
                {[2026, 2027, 2028].map(
                  (planningYear) => {
                    const leap =
                      (planningYear %
                        4 ===
                        0 &&
                        planningYear %
                          100 !==
                          0) ||
                      planningYear %
                        400 ===
                        0;

                    return (
                      <button
                        key={
                          planningYear
                        }
                        onClick={() =>
                          handleYearChange(
                            planningYear
                          )
                        }
                        style={{
                          flex: 1,
                          background:
                            year ===
                            planningYear
                              ? "rgba(0, 210, 255, 0.2)"
                              : "rgba(255, 255, 255, 0.04)",
                          border: `1px solid ${
                            year ===
                            planningYear
                              ? "var(--accent-cyan)"
                              : "var(--border-color)"
                          }`,
                          color:
                            year ===
                            planningYear
                              ? "var(--accent-cyan)"
                              : "var(--text-muted)",
                          padding:
                            "0.4rem 0.25rem",
                          borderRadius:
                            "6px",
                          fontSize:
                            "0.75rem",
                          fontWeight: 700,
                          cursor:
                            "pointer",
                        }}
                      >
                        {planningYear}{" "}
                        {leap
                          ? "(366d)"
                          : "(365d)"}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          {/* DAILY CAPACITY */}

          <div
            style={{
              background:
                "rgba(0, 210, 255, 0.06)",
              padding: "0.85rem",
              borderRadius: "8px",
              border:
                "1px solid rgba(0, 210, 255, 0.2)",
              marginTop: "1.25rem",
            }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                color:
                  "var(--text-muted)",
                fontWeight: 600,
                marginBottom:
                  "0.3rem",
              }}
            >
              CALCULATED 1-DAY
              AVAILABLE CAPACITY
            </div>

            <div
              style={{
                fontSize: "1.3rem",
                fontWeight: 800,
                color:
                  "var(--accent-cyan)",
              }}
            >
              {dailyAvailableHours.toFixed(
                2
              )}

              <span
                style={{
                  fontSize: "0.8rem",
                  color:
                    "var(--text-muted)",
                }}
              >
                {" "}
                hrs / day
              </span>
            </div>

            <div
              style={{
                fontSize: "0.675rem",
                color:
                  "var(--text-dim)",
                marginTop: "0.25rem",
              }}
            >
              Formula:{" "}
              {annualHours.toLocaleString()}{" "}
              annual hrs ÷{" "}
              {daysInYear} days
            </div>
          </div>
        </div>

        {/* TASK INPUT */}

        <div
          className="glass-panel"
          style={{
            padding: "1.25rem",
            background:
              "rgba(10, 16, 30, 0.6)",
            border:
              "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                padding: "0.4rem",
                background:
                  "rgba(58, 123, 213, 0.15)",
                borderRadius: "8px",
              }}
            >
              <Layers
                size={20}
                color="var(--accent-blue)"
              />
            </div>

            <div>
              <h4
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                2. Tasks Input Component
              </h4>

              <span
                style={{
                  fontSize: "0.725rem",
                  color:
                    "var(--text-muted)",
                }}
              >
                Target Annual Workload
                Hours
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection:
                "column",
              gap: "0.65rem",
            }}
          >
            {tasks.map(
              (task, index) => {
                const taskSharePct =
                  annualHours > 0
                    ? (
                        (task.hours /
                          annualHours) *
                        100
                      ).toFixed(1)
                    : "0";

                const taskDailyHours =
                  dailyAvailableHours *
                  (task.hours /
                    (totalAllocatedTaskHours ||
                      1));

                return (
                  <div
                    key={task.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "1.5fr 1fr 130px",
                      alignItems:
                        "center",
                      gap: "0.75rem",
                      background:
                        "rgba(15, 23, 42, 0.8)",
                      border:
                        "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "8px",
                      padding:
                        "0.65rem 0.85rem",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize:
                            "0.875rem",
                          fontWeight: 700,
                          color:
                            "#ffffff",
                        }}
                      >
                        {task.name}
                      </div>

                      <span
                        style={{
                          fontSize:
                            "0.675rem",
                          color:
                            "var(--text-dim)",
                        }}
                      >
                        Task #
                        {index + 1} —{" "}
                        {task.category}
                      </span>
                    </div>

                    <div
                      style={{
                        textAlign:
                          "right",
                      }}
                    >
                      <span
                        style={{
                          fontSize:
                            "0.75rem",
                          fontWeight: 700,
                          color:
                            "var(--accent-cyan)",
                        }}
                      >
                        {taskSharePct}%
                        Share
                      </span>

                      <span
                        style={{
                          display:
                            "block",
                          fontSize:
                            "0.65rem",
                          color:
                            "var(--text-dim)",
                        }}
                      >
                        ~
                        {taskDailyHours.toFixed(
                          1
                        )}{" "}
                        hrs/day
                      </span>
                    </div>

                    <div
                      style={{
                        position:
                          "relative",
                      }}
                    >
                      <input
                        type="number"
                        value={
                          task.hours
                        }
                        onChange={(
                          event
                        ) =>
                          handleTaskHoursChange(
                            task.id,
                            Number(
                              event
                                .target
                                .value
                            )
                          )
                        }
                        min={0}
                        step={500}
                        style={{
                          width:
                            "100%",
                          background:
                            "rgba(10, 14, 23, 0.8)",
                          border:
                            "1px solid rgba(0, 210, 255, 0.25)",
                          borderRadius:
                            "6px",
                          padding:
                            "0.4rem 2.2rem 0.4rem 0.5rem",
                          fontSize:
                            "0.875rem",
                          fontWeight: 700,
                          color:
                            "var(--accent-cyan)",
                          textAlign:
                            "right",
                          outline:
                            "none",
                        }}
                      />

                      <span
                        style={{
                          position:
                            "absolute",
                          right:
                            "0.4rem",
                          top: "50%",
                          transform:
                            "translateY(-50%)",
                          fontSize:
                            "0.65rem",
                          fontWeight: 800,
                          color:
                            "var(--text-dim)",
                        }}
                      >
                        HRS
                      </span>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          <div
            style={{
              marginTop: "0.85rem",
              paddingTop: "0.65rem",
              borderTop:
                "1px solid var(--border-color)",
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
            }}
          >
            <span
              style={{
                color:
                  "var(--text-muted)",
                fontWeight: 600,
                fontSize: "0.8rem",
              }}
            >
              Total Target Task
              Workload:
            </span>

            <span
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                color:
                  "var(--accent-emerald)",
              }}
            >
              {totalAllocatedTaskHours.toLocaleString()}{" "}
              hrs
            </span>
          </div>
        </div>
      </div>

      {/* CALCULATION STATUS */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "flex-end",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.75rem",
          color:
            "var(--text-muted)",
        }}
      >
        {isCalculating && (
          <>
            <span className="spinner-sm" />
            Updating planning
            calculations...
          </>
        )}

        {!isCalculating &&
          calculationResult && (
            <span
              style={{
                color:
                  "var(--accent-emerald)",
              }}
            >
              ✓ Planning calculations
              updated
            </span>
          )}
      </div>
    </div>
  );
};

export default ManualInputPanel;