import React from "react";
import { SummaryOverview } from "./SummaryOverview";
import { DepartmentSummary } from "./DepartmentSummary";
import { MonthlyHealth } from "./MonthlyHealth";
import { CapacityAlerts } from "./CapacityAlerts";
import { PlanningInsights } from "./PlanningInsights";
import { RecommendationCard } from "./RecommendationCard";

export const SummaryView: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <SummaryOverview />

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

      <PlanningInsights />

      <RecommendationCard />
    </div>
  );
};
// import React from "react";

// import { SummaryOverview } from "./SummaryOverview";
// import { DepartmentSummary } from "./DepartmentSummary";
// import { MonthlyHealth } from "./MonthlyHealth";
// import { PlanningInsights } from "./PlanningInsights";
// import { RecommendationCard } from "./RecommendationCard";

// export const SummaryView = () => {

//     return (

//         <div>

//             <SummaryOverview />

//             <div
//                 style={{
//                     display: "grid",
//                     gridTemplateColumns: "2fr 1fr",
//                     gap: "1.5rem",
//                     marginBottom: "1.5rem"
//                 }}
//             >
//                 <DepartmentSummary />

//                 <MonthlyHealth />


//                 <div>
//                     <PlanningInsights />

//                     <div>
//                       <RecommendationCard />
//                     </div>
//                 </div>

//             </div>

//         </div>

        

//     );

// };