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
  useMemo,
  useState,
} from "react";

import {
  useAppStore,
} from "../store/appStore";

import type {
  BoardTask,
  TaskStatus,
  TaskPriority,
} from "../types/task";

import { useBoardTasks } from "../hooks/useBoardTasks";
import KanbanColumn from "../components/Board/KanbanColumn";
import TaskCard from "../components/Board/TaskCard";
import TaskDrawer from "../components/Board/TaskDrawer";
import CreateTaskDrawer from "../components/Board/CreateTaskDrawer";
import { columns } from "../utils/utils";
import UndoToast from "../components/UI/UndoToast";
import BoardSkeleton from "../components/loading/BoardSkeleton";

function Board() {
  const { isLoading, error } =
    useBoardTasks();

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState<TaskPriority | "all">(
    "all"
  );

  const [
    assigneeFilter,
    setAssigneeFilter,
  ] = useState<string>("all");

  const tasks = useAppStore(
    (state) => state.tasks
  );

  const {
    setUndoMove,
    restoreTasks,
  } = useAppStore();

  const moveTask = useAppStore(
    (state) => state.moveTask
  );

  const [
    selectedTask,
    setSelectedTask,
  ] = useState<BoardTask | null>(null);

  const [
    isCreateOpen,
    setIsCreateOpen,
  ] = useState(false);

  const [
    activeTask,
    setActiveTask,
  ] = useState<BoardTask | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const assignees = useMemo(() => {
    return Array.from(
      new Set(
        tasks.map(
          (task) => task.assignee
        )
      )
    );
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesPriority =
        priorityFilter === "all" ||
        task.priority === priorityFilter;

      const matchesAssignee =
        assigneeFilter === "all" ||
        task.assignee === assigneeFilter;

      return (
        matchesPriority &&
        matchesAssignee
      );
    });
  }, [
    tasks,
    priorityFilter,
    assigneeFilter,
  ]);

  if (
    isLoading &&
    tasks.length === 0
  ) {
    return <BoardSkeleton />;
  }

  if (
    error &&
    tasks.length === 0
  ) {
    return (
      <div
        className="
          flex
          h-full
          items-center
          justify-center
          bg-gray-50
          text-red-500
          transition-colors
          duration-200

          dark:bg-[#090a0c]
          dark:text-red-400
        "
      >
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

    setActiveTask(
      task || null
    );
  };

  const handleDragEnd = (
    event: DragEndEvent
  ) => {
    const {
      active,
      over,
    } = event;

    if (!over) return;

    const activeId =
      String(active.id);

    const overId =
      String(over.id);

    const activeTask =
      tasks.find(
        (task) =>
          String(task.id) ===
          activeId
      );

    if (!activeTask) return;

    let destinationColumn =
      columns.find(
        (column) =>
          column.id === overId
      );

    if (!destinationColumn) {
      const overTask =
        tasks.find(
          (task) =>
            String(task.id) ===
            overId
        );

      if (overTask) {
        destinationColumn =
          columns.find(
            (column) =>
              column.id ===
              overTask.status
          );
      }
    }

    if (!destinationColumn) return;

    const newStatus =
      destinationColumn.id;

    if (
      activeTask.status ===
      newStatus
    ) {
      return;
    }

    const previousTasks =
      [...tasks];

    moveTask(
      activeId,
      destinationColumn.id
    );

    if (
      activeTask.status !==
      destinationColumn.id
    ) {
      setUndoMove(() => {
        restoreTasks(
          previousTasks
        );
      });
    }
  };

  return (
    <>
      <div
        className="
          h-full
          overflow-auto
          bg-gray-50
          p-6
          text-gray-900
          transition-colors
          duration-200

          dark:bg-[#090a0c]
          dark:text-white
        "
      >
        <div
          className="
            mb-6
            flex
            items-center
            justify-between
          "
        >
          <div>
            <h1
              className="
                text-xl
                font-semibold
                text-gray-900
                dark:text-white
              "
            >
              Sprint Board
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >
              Manage and track your sprint
              tasks
            </p>
          </div>

          <div
            className="
              mb-5
              flex
              flex-wrap
              items-center
              gap-3
            "
          >
            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(
                  e.target.value as
                    | TaskPriority
                    | "all"
                )
              }
              className="
                rounded-lg
                border
                border-gray-200
                bg-white
                px-3
                py-2
                text-sm
                text-gray-700
                outline-none
                transition
                focus:border-blue-500

                dark:border-white/[0.08]
                dark:bg-[#15181c]
                dark:text-gray-300
              "
              aria-label="Filter by priority"
            >
              <option value="all">
                All Priorities
              </option>

              <option value="high">
                High
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="low">
                Low
              </option>
            </select>

            <select
              value={assigneeFilter}
              onChange={(e) =>
                setAssigneeFilter(
                  e.target.value
                )
              }
              className="
                rounded-lg
                border
                border-gray-200
                bg-white
                px-3
                py-2
                text-sm
                text-gray-700
                outline-none
                transition
                focus:border-blue-500

                dark:border-white/[0.08]
                dark:bg-[#15181c]
                dark:text-gray-300
              "
              aria-label="Filter by assignee"
            >
              <option value="all">
                All Assignees
              </option>

              {assignees.map(
                (assignee) => (
                  <option
                    key={assignee}
                    value={assignee}
                  >
                    {assignee}
                  </option>
                )
              )}
            </select>

            {(priorityFilter !==
              "all" ||
              assigneeFilter !==
                "all") && (
              <button
                type="button"
                onClick={() => {
                  setPriorityFilter(
                    "all"
                  );
                  setAssigneeFilter(
                    "all"
                  );
                }}
                className="
                  rounded-lg
                  px-3
                  py-2
                  text-sm
                  text-gray-500
                  transition
                  hover:bg-gray-100
                  hover:text-gray-900

                  dark:hover:bg-white/[0.05]
                  dark:hover:text-white
                "
              >
                Clear Filters
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                setIsCreateOpen(true)
              }
              className="
                flex
                items-center
                gap-2
                rounded-lg
                bg-blue-600
                px-4
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-blue-500
              "
            >
              <FiPlus size={17} />

              Create Task
            </button>
          </div>
        </div>

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
          <div
            className="
              grid
              min-w-[1000px]
              grid-cols-4
              gap-5
            "
          >
            {columns.map(
              (column) => {
                const columnTasks =
                  filteredTasks.filter(
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
                  onClick={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {selectedTask && (
        <TaskDrawer
          task={selectedTask}
          onClose={() =>
            setSelectedTask(null)
          }
        />
      )}

      {isCreateOpen && (
        <CreateTaskDrawer
          onClose={() =>
            setIsCreateOpen(false)
          }
        />
      )}

      <UndoToast />
    </>
  );
}

export default Board;
