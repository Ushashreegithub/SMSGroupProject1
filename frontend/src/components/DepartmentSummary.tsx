import React from "react";

const departments = [
    { name: "Welding", value: 92 },
    { name: "Machining", value: 79 },
    { name: "Roll Refurbishment", value: 74 },
    { name: "Plating", value: 68 },
    { name: "Service Machining", value: 83 },
    
];

export const DepartmentSummary = () => {

    return (

        <div
            className="glass-panel"
            style={{
                padding: "1.5rem",
                flex: 1
            }}
        >

            <h3
                style={{
                    marginBottom: "1.2rem",
                    color: "white"
                }}
            >
                Department Utilization
            </h3>

            {departments.map((dept) => (

                <div
                    key={dept.name}
                    style={{
                        marginBottom: "1.1rem"
                    }}
                >

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: ".35rem"
                        }}
                    >

                        <span>{dept.name}</span>

                        <span
                            style={{
                                color: "var(--accent-cyan)"
                            }}
                        >
                            {dept.value}%
                        </span>

                    </div>

                    <div
                        style={{
                            height: 8,
                            background: "#232323",
                            borderRadius: 20
                        }}
                    >

                        <div
                            style={{
                                width: `${dept.value}%`,
                                height: "100%",
                                background:
                                    dept.value > 90
                                        ? "#ff9800"
                                        : "#00bcd4",
                                borderRadius: 20,
                                transition: "0.4s"
                            }}
                        />

                    </div>

                </div>

            ))}

        </div>

    );

};