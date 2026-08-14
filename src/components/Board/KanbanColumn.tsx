import type {
  BoardTask,
  TaskStatus,
} from "../../types/task";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableTask from "./SortableTask";
import React from "react";

const KanbanColumn = React.memo(
  ({
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
      <div
        className="
          flex
          min-h-[550px]
          flex-col
          rounded-xl
          border
          border-gray-200
          bg-white
          shadow-sm
          transition-colors
          duration-200

          dark:border-white/[0.06]
          dark:bg-[#0d0f12]
          dark:shadow-none
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-gray-200
            px-4
            py-4

            dark:border-white/[0.06]
          "
        >
          <div className="flex items-center gap-2">
            <h2
              className="
                text-sm
                font-semibold
                text-gray-900
                dark:text-white
              "
            >
              {column.title}
            </h2>

            <span
              className="
                rounded-md
                bg-gray-100
                px-2
                py-0.5
                text-xs
                text-gray-500

                dark:bg-white/[0.06]
                dark:text-gray-400
              "
            >
              {tasks.length}
            </span>
          </div>
        </div>

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
            className="
              flex
              min-h-[500px]
              flex-1
              flex-col
              gap-3
              p-3
            "
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
              <div
                className="
                  flex
                  flex-1
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-dashed
                  border-gray-200
                  text-xs
                  text-gray-400

                  dark:border-white/[0.08]
                  dark:text-gray-600
                "
              >
                Drop tasks here
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    );
  }
);

export default KanbanColumn;
