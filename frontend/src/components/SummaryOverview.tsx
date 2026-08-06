import React from "react";
import {
    Activity,
    Clock3,
    TrendingUp,
    AlertTriangle
} from "lucide-react";

export const SummaryOverview = () => {

    const cards = [
        {
            title: "TOTAL CAPACITY",
            value: "54,600 hrs",
            icon: Clock3,
            color: "var(--accent-cyan)"
        },
        {
            title: "UTILIZATION",
            value: "84%",
            icon: TrendingUp,
            color: "var(--accent-emerald)"
        },
        {
            title: "ACTIVE DEPARTMENTS",
            value: "5",
            icon: Activity,
            color: "var(--accent-blue)"
        },
        {
            title: "BOTTLENECKS",
            value: "2",
            icon: AlertTriangle,
            color: "var(--accent-amber)"
        }
    ];

    return (

        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: "1rem",
                marginBottom: "1.5rem"
            }}
        >

            {cards.map((card) => {

                const Icon = card.icon;

                return (

                    <div
                        key={card.title}
                        className="glass-panel"
                        style={{
                            padding: "1.25rem"
                        }}
                    >

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >

                            <span
                                style={{
                                    fontSize: ".75rem",
                                    color: "var(--text-muted)"
                                }}
                            >
                                {card.title}
                            </span>

                            <Icon
                                size={18}
                                color={card.color}
                            />

                        </div>

                        <h2
                            style={{
                                marginTop: ".8rem",
                                fontSize: "2rem",
                                color: "white"
                            }}
                        >
                            {card.value}
                        </h2>

                    </div>

                );

            })}

        </div>

    );

};