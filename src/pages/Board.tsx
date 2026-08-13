import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";


import {
  FiPlus,
} from "react-icons/fi";

import {
  useState,
} from "react";

import {
  useAppStore,
} from "../store/appStore";

import type { BoardTask, TaskStatus,  } from "../types/task"

import { useBoardTasks } from "../hooks/useBoardTasks";
import KanbanColumn from "../components/Board/KanbanColumn";
import TaskCard from "../components/Board/TaskCard";
import TaskDrawer from "../components/Board/TaskDrawer";
import CreateTaskDrawer from "../components/Board/CreateTaskDrawer";
import { columns } from "../utils/utils";


function Board() {
  const { isLoading, error } =
    useBoardTasks();

  const tasks = useAppStore(
    (state) => state.tasks
  );

  const moveTask = useAppStore(
    (state) => state.moveTask
  );

  const moveTaskToColumn =
    useAppStore(
      (state) =>
        state.moveTaskToColumn
    );

  const [selectedTask, setSelectedTask] =
    useState<BoardTask | null>(null);

  const [isCreateOpen, setIsCreateOpen] =
    useState(false);

  const [activeTask, setActiveTask] =
    useState<BoardTask | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-[#090a0c] text-gray-400">
        Loading tasks...
      </div>
    );
  }

  if (error && tasks.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-[#090a0c] text-red-400">
        Failed to load tasks.
      </div>
    );
  }

  const handleDragStart = (
    event: any
  ) => {
    const task = tasks.find(
      (task) =>
        task.id === event.active.id
    );

    setActiveTask(task || null);
  };

  const handleDragEnd = (
    event: DragEndEvent
  ) => {
    setActiveTask(null);

    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeId =
      String(active.id);

    const overId =
      String(over.id);

    if (activeId === overId) {
      return;
    }

    const activeTask = tasks.find(
      (task) =>
        task.id === activeId
    );

    const overTask = tasks.find(
      (task) =>
        task.id === overId
    );

    if (!activeTask) {
      return;
    }

    /*
     * Dropped onto another task.
     */
    if (overTask) {
      if (
        activeTask.status !==
        overTask.status
      ) {
        moveTaskToColumn(
          activeId,
          overTask.status
        );
      }

      moveTask(
        activeId,
        overId
      );

      return;
    }

    /*
     * Dropped onto a column.
     */
    const targetColumn =
      columns.find(
        (column) =>
          column.id === overId
      );

    if (targetColumn) {
      moveTaskToColumn(
        activeId,
        targetColumn.id
      );
    }
  };

  return (
    <>
      <div className="h-full overflow-auto bg-[#090a0c] p-6 text-white">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">
              Sprint Board
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage and track your sprint
              tasks
            </p>
          </div>

          <button
            onClick={() =>
              setIsCreateOpen(true)
            }
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium transition hover:bg-blue-500"
          >
            <FiPlus size={17} />

            Create Task
          </button>
        </div>

        {/* Kanban */}
        <DndContext
          sensors={sensors}
          collisionDetection={
            closestCorners
          }
          onDragStart={
            handleDragStart
          }
          onDragEnd={
            handleDragEnd
          }
        >
          <div className="grid min-w-[1000px] grid-cols-4 gap-5">
            {columns.map(
              (column) => {
                const columnTasks =
                  tasks.filter(
                    (task) =>
                      task.status ===
                      column.id
                  );

                return (
                  <KanbanColumn
                    key={column.id}
                    column={column}
                    tasks={columnTasks}
                    onTaskClick={
                      setSelectedTask
                    }
                  />
                );
              }
            )}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="rotate-2">
                <TaskCard
                  task={activeTask}
                  onClick={() => { }}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Task drawer */}
      {selectedTask && (
        <TaskDrawer
          task={selectedTask}
          onClose={() =>
            setSelectedTask(null)
          }
        />
      )}

      {/* Create task */}
      {isCreateOpen && (
        <CreateTaskDrawer
          onClose={() =>
            setIsCreateOpen(false)
          }
        />
      )}
    </>
  );
}

export default Board;