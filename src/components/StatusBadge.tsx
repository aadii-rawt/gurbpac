import React from "react";

const StatusBadge = React.memo(({
    status,
}: {
    status:
    | "backlog"
    | "in-progress"
    | "review"
    | "done";
}) => {
    const styles = {
        backlog:
            "bg-gray-500/10 text-gray-400",

        "in-progress":
            "bg-yellow-500/10 text-yellow-400",

        review:
            "bg-purple-500/10 text-purple-400",

        done:
            "bg-green-500/10 text-green-400",
    };

    const labels = {
        backlog: "Backlog",
        "in-progress": "In Progress",
        review: "Review",
        done: "Done",
    };

    return (
        <span
            className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium ${styles[status]}`}
        >
            {labels[status]}
        </span>
    );
})

export default StatusBadge