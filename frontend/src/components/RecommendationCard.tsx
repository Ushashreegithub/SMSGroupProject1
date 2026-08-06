"use client";

import React from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Users,
  Wrench,
  ArrowUpRight,
} from "lucide-react";

export function RecommendationCard() {
  const recommendations = [
    {
      icon: <AlertTriangle size={20} color="#ff9800" />,
      title: "Balance Welding Load",
      description:
        "Heavy Welding is operating close to its capacity. Shift suitable work to Service Machining where possible.",
      priority: "High",
      color: "#ff9800",
    },
    {
      icon: <Users size={20} color="#00c853" />,
      title: "Optimize Manpower",
      description:
        "Current manpower allocation can support approximately 8% more production by redistributing resources.",
      priority: "Medium",
      color: "#00c853",
    },
    {
      icon: <Wrench size={20} color="#2196f3" />,
      title: "Increase Machine Utilization",
      description:
        "Plating and Roll Repair have available machine capacity for additional orders.",
      priority: "Low",
      color: "#2196f3",
    },
  ];

  return (
    <div
      className="glass-panel"
      style={{
        marginTop: 25,
        padding: 24,
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 25,
        }}
      >
        <Sparkles color="gold" size={28} />

        <div>
          <h2
            style={{
              margin: 0,
              fontWeight: 700,
            }}
          >
            AI Recommendations
          </h2>

          <p
            style={{
              marginTop: 5,
              color: "var(--text-muted)",
            }}
          >
            Suggested actions based on capacity planning analysis
          </p>
        </div>
      </div>

      {/* Cards */}

      <div
        style={{
          display: "grid",
          gap: 18,
        }}
      >
        {recommendations.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 18,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,.08)",
              background: "rgba(255,255,255,.02)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 18,
                alignItems: "flex-start",
              }}
            >
              {item.icon}

              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 18,
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    marginTop: 8,
                    color: "var(--text-muted)",
                    lineHeight: 1.6,
                  }}
                >
                  {item.description}
                </p>
              </div>
            </div>

            <div
              style={{
                textAlign: "right",
              }}
            >
              <div
                style={{
                  padding: "6px 12px",
                  borderRadius: 30,
                  background: item.color,
                  color: "white",
                  fontWeight: 600,
                  fontSize: 13,
                  marginBottom: 12,
                }}
              >
                {item.priority}
              </div>

              <ArrowUpRight
                color="var(--accent-cyan)"
                size={20}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}

      <div
        style={{
          marginTop: 30,
          padding: 20,
          borderRadius: 12,
          background: "rgba(0,255,255,.04)",
          border: "1px solid rgba(0,255,255,.08)",
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <CheckCircle2
          color="#00e676"
          size={28}
        />

        <div>
          <div
            style={{
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            Overall Planning Status
          </div>

          <div
            style={{
              color: "var(--text-muted)",
            }}
          >
            Production planning is healthy. Minor optimization in manpower
            allocation and department balancing can improve utilization by
            approximately <strong>6–10%</strong>.
          </div>
        </div>
      </div>
    </div>
  );
}