import { FiCalendar, FiMoreHorizontal, FiUser } from "react-icons/fi";
import type { BoardTask } from "../../types/task";
import PriorityBadge from "./PriorityBadge";
import React from "react";

const TaskCard = React.memo(({
  task,
  onClick,
}: {
  task: BoardTask;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="rounded-xl border border-white/[0.07] bg-[#15181c] p-4 transition hover:border-white/[0.14] hover:bg-[#181b20]"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-sm font-medium leading-5 text-gray-100">
          {task.title}
        </h3>

        <FiMoreHorizontal
          size={17}
          className="shrink-0 text-gray-600"
        />
      </div>

      <p className="mb-4 line-clamp-2 text-xs leading-5 text-gray-500">
        {task.description}
      </p>

      <PriorityBadge
        priority={task.priority}
      />

      <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <FiUser size={13} />

          {task.assignee}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <FiCalendar size={13} />

          {task.dueDate}
        </div>
      </div>
    </div>
  );
})

export default TaskCard