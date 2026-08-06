import React from "react";
import { AlertTriangle } from "lucide-react";

export const CapacityAlerts = () => {

const alerts=[

"Machining exceeds 95% utilization",

"April overloaded",

"Welding bottleneck detected",

];

return(

<div className="glass-panel" style={{padding:"1.5rem"}}>

<h3>Capacity Alerts</h3>

<div style={{marginTop:"1rem"}}>

{alerts.map(a=>(

<div
key={a}
style={{
display:"flex",
gap:"10px",
marginBottom:"1rem",
}}
>

<AlertTriangle color="orange"/>

<span>{a}</span>

</div>

))}

</div>

</div>

);

};