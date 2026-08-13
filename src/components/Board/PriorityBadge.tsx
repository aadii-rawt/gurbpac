import React from "react";

const  PriorityBadge = React.memo(({
  priority,
}: {
  priority?: TaskPriority | any;
}) => {
  const styles = {
    high:
      "bg-red-500/10 text-red-400",

    medium:
      "bg-yellow-500/10 text-yellow-400",

    low:
      "bg-green-500/10 text-green-400",
  };

  return (
    <span
      className={`inline-flex rounded-md px-2 py-1 text-[11px] font-medium capitalize ${styles[priority]}`}
    >
      {priority}
    </span>
  );
})

export default PriorityBadge