"use client";

import React from "react";
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";

export const MonthlyHealth = () => {
  const months = [
    { month: "Apr", status: "Healthy", color: "#22c55e", icon: CheckCircle2 },
    { month: "May", status: "Healthy", color: "#22c55e", icon: CheckCircle2 },
    { month: "Jun", status: "Warning", color: "#f59e0b", icon: AlertTriangle },
    { month: "Jul", status: "Healthy", color: "#22c55e", icon: CheckCircle2 },
    { month: "Aug", status: "Healthy", color: "#22c55e", icon: CheckCircle2 },
    { month: "Sep", status: "Critical", color: "#ef4444", icon: XCircle },
    { month: "Oct", status: "Healthy", color: "#22c55e", icon: CheckCircle2 },
    { month: "Nov", status: "Warning", color: "#f59e0b", icon: AlertTriangle },
    { month: "Dec", status: "Healthy", color: "#22c55e", icon: CheckCircle2 },
    { month: "Jan", status: "Healthy", color: "#22c55e", icon: CheckCircle2 },
    { month: "Feb", status: "Healthy", color: "#22c55e", icon: CheckCircle2 },
    { month: "Mar", status: "Healthy", color: "#22c55e", icon: CheckCircle2 },
  ];

  return (
    <div className="glass-panel" style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <Calendar color="#06b6d4" />
        <h3 style={{ fontSize: 20, fontWeight: 700 }}>
          Monthly Capacity Health
        </h3>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 15,
        }}
      >
        {months.map((m) => {
          const Icon = m.icon;

          return (
            <div
              key={m.month}
              style={{
                background: "#111827",
                border: `1px solid ${m.color}`,
                borderRadius: 12,
                padding: 18,
                textAlign: "center",
              }}
            >
              <Icon
                color={m.color}
                size={28}
                style={{ marginBottom: 10 }}
              />

              <div
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                {m.month}
              </div>

              <div
                style={{
                  color: m.color,
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                {m.status}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};