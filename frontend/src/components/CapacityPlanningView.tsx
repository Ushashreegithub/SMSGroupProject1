import React from "react";
import { ManualInputPanel } from "./ManualInputPanel";
import { ManualCalculationResponse } from "../lib/api";

interface CapacityPlanningViewProps {
  onCalculationResultChange?: (
    result: ManualCalculationResponse | null
  ) => void;
}

export const CapacityPlanningView: React.FC<CapacityPlanningViewProps> = ({
  onCalculationResultChange,
}) => {
  return (
    <div>
      <ManualInputPanel
        onCalculationResultChange={onCalculationResultChange}
      />
    </div>
  );
};