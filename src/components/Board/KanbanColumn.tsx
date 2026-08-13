import { FiMoreHorizontal } from "react-icons/fi";
import type { BoardTask, TaskStatus } from "../../types/task";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableTask from "./SortableTask";
import React from "react";

const KanbanColumn = React.memo(({
  column,
  tasks,
  onTaskClick,
}: {
  column: {
    id: TaskStatus;
    title: string;
  };

  tasks: BoardTask[];

  onTaskClick: (
    task: BoardTask
  ) => void;
}) => {
  return (
    <div className="flex min-h-[550px] flex-col rounded-xl border border-white/[0.06] bg-[#0d0f12]">
      {/* Column header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">
            {column.title}
          </h2>

          <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-xs text-gray-400">
            {tasks.length}
          </span>
        </div>

      </div>

      {/* Droppable column */}
      <SortableContext
        items={tasks.map(
          (task) => task.id
        )}
        strategy={
          verticalListSortingStrategy
        }
      >
        <div
          id={column.id}
          className="flex min-h-[500px] flex-1 flex-col gap-3 p-3"
        >
          {tasks.map((task) => (
            <SortableTask
              key={task.id}
              task={task}
              onClick={() =>
                onTaskClick(task)
              }
            />
          ))}

          {tasks.length === 0 && (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-white/[0.08] text-xs text-gray-600">
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
)

export default KanbanColumn