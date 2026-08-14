import React from "react";
import type { TaskPriority } from "../../types/task";

const PriorityBadge = React.memo(
  ({
    priority,
  }: {
    priority?: TaskPriority;
  }) => {
    const styles: Record<
      TaskPriority,
      string
    > = {
      high: `
        bg-red-500/10
        text-red-600
        dark:text-red-400
      `,

      medium: `
        bg-yellow-500/10
        text-yellow-600
        dark:text-yellow-400
      `,

      low: `
        bg-green-500/10
        text-green-600
        dark:text-green-400
      `,
    };

    if (!priority) {
      return null;
    }

    return (
      <span
        className={`
          inline-flex
          rounded-md
          px-2
          py-1
          text-[11px]
          font-medium
          capitalize
          ${styles[priority]}
        `}
      >
        {priority}
      </span>
    );
  }
);

export default PriorityBadge;
