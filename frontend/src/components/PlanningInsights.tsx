"use client";

import React from "react";
import {
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

export function PlanningInsights() {
  return (
    <div
      className="glass-panel"
      style={{
        padding: "24px",
        marginTop: "24px",
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "25px",
        }}
      >
        <BrainCircuit
          size={26}
          color="var(--accent-cyan)"
        />

        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: 700,
            }}
          >
            Planning Insights
          </h2>

          <p
            style={{
              color: "var(--text-muted)",
              marginTop: 4,
            }}
          >
            AI generated planning summary
          </p>
        </div>
      </div>

      {/* Insight Cards */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: "18px",
        }}
      >
        {/* Card 1 */}

        <div
          style={{
            background: "rgba(0,255,255,0.04)",
            border: "1px solid rgba(0,255,255,.15)",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <TrendingUp
            color="#3ddc97"
            size={30}
          />

          <h3 style={{ marginTop: 15 }}>
            Highest Utilization
          </h3>

          <h1
            style={{
              margin: "8px 0",
              color: "#3ddc97",
            }}
          >
            Welding
          </h1>

          <p style={{ color: "var(--text-muted)" }}>
            Current utilization is estimated around
            <b> 93%</b>.
          </p>
        </div>

        {/* Card 2 */}

        <div
          style={{
            background: "rgba(255,165,0,.05)",
            border: "1px solid rgba(255,165,0,.15)",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <TrendingDown
            color="#ffaa00"
            size={30}
          />

          <h3 style={{ marginTop: 15 }}>
            Lowest Utilization
          </h3>

          <h1
            style={{
              margin: "8px 0",
              color: "#ffaa00",
            }}
          >
            Plating
          </h1>

          <p style={{ color: "var(--text-muted)" }}>
            Available capacity remains for future
            production.
          </p>
        </div>

        {/* Card 3 */}

        <div
          style={{
            background: "rgba(0,120,255,.05)",
            border: "1px solid rgba(0,120,255,.15)",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <Lightbulb
            color="#55b5ff"
            size={30}
          />

          <h3 style={{ marginTop: 15 }}>
            Suggested Action
          </h3>

          <p
            style={{
              color: "var(--text-muted)",
              marginTop: 12,
            }}
          >
            Consider shifting workload from Welding
            to Service Machining to improve overall
            plant utilization.
          </p>

          <button
            style={{
              marginTop: 18,
              padding: "10px 18px",
              border: "none",
              borderRadius: 8,
              background: "var(--accent-cyan)",
              color: "black",
              cursor: "pointer",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            View Recommendation

            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}