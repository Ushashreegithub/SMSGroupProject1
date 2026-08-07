import React from "react";
import { SummaryOverview } from "./SummaryOverview";
import { DepartmentSummary } from "./DepartmentSummary";
import { MonthlyHealth } from "./MonthlyHealth";
import { CapacityAlerts } from "./CapacityAlerts";
import { PlanningInsights } from "./PlanningInsights";
import { RecommendationCard } from "./RecommendationCard";
import { MonthlyTaskBreakdown } from "./MonthlyTaskBreakdown";
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
        gap: "1.5rem",
      }}
    >
      <DepartmentSummary />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
      >
        <MonthlyHealth />
        <CapacityAlerts />
      </div>

      {/* Monthly calculated breakdown will be added here */}

      <PlanningInsights />

      <RecommendationCard />
    </div>
  );
};