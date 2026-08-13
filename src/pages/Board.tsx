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
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import {
  FiPlus,
  FiMoreHorizontal,
  FiCalendar,
  FiUser,
  FiTrash2,
  FiEdit2,
  FiMessageSquare,
  FiX,
} from "react-icons/fi";

import {
  useState,
} from "react";

import {
  useAppStore,
} from "../store/appStore";

import type { BoardTask, TaskStatus, TaskPriority } from "../types/task"

import { useBoardTasks } from "../hooks/useBoardTasks";

const columns: {
  id: TaskStatus;
  title: string;
}[] = [
    {
      id: "backlog",
      title: "Backlog",
    },
    {
      id: "in-progress",
      title: "In Progress",
    },
    {
      id: "review",
      title: "Review",
    },
    {
      id: "done",
      title: "Done",
    },
  ];

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

function KanbanColumn({
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
}) {
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

        <button className="text-gray-600 hover:text-white">
          <FiMoreHorizontal size={18} />
        </button>
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
function SortableTask({
  task,
  onClick,
}: {
  task: BoardTask;
  onClick: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(
      transform
    ),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`cursor-grab ${isDragging
          ? "opacity-30"
          : ""
        }`}
    >
      <TaskCard
        task={task}
        onClick={onClick}
      />
    </div>
  );
}
function TaskCard({
  task,
  onClick,
}: {
  task: BoardTask;
  onClick: () => void;
}) {
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
}

function TaskDrawer({
  task,
  onClose,
}: {
  task: BoardTask;
  onClose: () => void;
}) {
  const updateTask = useAppStore(
    (state) => state.updateTask
  );

  const deleteTask = useAppStore(
    (state) => state.deleteTask
  );

  const addComment = useAppStore(
    (state) => state.addComment
  );

  const user = useAppStore(
    (state) => state.user
  );

  // Editable fields
  const [title, setTitle] = useState(
    task.title
  );

  const [description, setDescription] =
    useState(task.description);

  const [priority, setPriority] =
    useState<TaskPriority>(
      task.priority
    );

  const [assignee, setAssignee] =
    useState(task.assignee);

  const [dueDate, setDueDate] =
    useState(task.dueDate);

  const [comment, setComment] =
    useState("");

  // Save all changes
  const handleSave = () => {
    updateTask(task.id, {
      title: title.trim(),
      description: description.trim(),
      priority,
      assignee,
      dueDate,
    });

    onClose();
  };

  // Delete
  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    deleteTask(task.id);

    onClose();
  };

  // Add comment
  const handleComment = () => {
    if (!comment.trim()) {
      return;
    }

    addComment(
      task.id,
      comment.trim(),
      user?.firstName || "User"
    );

    setComment("");
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col border-l border-white/[0.08] bg-[#0d0f12] text-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
          <h2 className="text-lg font-semibold">
            Edit Task
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-white/[0.05] hover:text-white"
          >
            <FiX size={19} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Title */}
          <div className="mb-5">
            <label className="mb-2 block text-xs font-medium text-gray-400">
              Title
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full rounded-lg border border-white/[0.08] bg-[#15181c] px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="mb-2 block text-xs font-medium text-gray-400">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={5}
              className="w-full resize-none rounded-lg border border-white/[0.08] bg-[#15181c] px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Priority */}
          <div className="mb-5">
            <label className="mb-2 block text-xs font-medium text-gray-400">
              Priority
            </label>

            <select
              value={priority}
              onChange={(e) =>
                setPriority(
                  e.target.value as TaskPriority
                )
              }
              className="w-full rounded-lg border border-white/[0.08] bg-[#15181c] px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
            >
              <option value="low">
                Low
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="high">
                High
              </option>
            </select>
          </div>

          {/* Assignee */}
          <div className="mb-5">
            <label className="mb-2 block text-xs font-medium text-gray-400">
              Assignee
            </label>

            <select
              value={assignee}
              onChange={(e) =>
                setAssignee(e.target.value)
              }
              className="w-full rounded-lg border border-white/[0.08] bg-[#15181c] px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
            >
              <option value="Alex">
                Alex
              </option>

              <option value="Sarah">
                Sarah
              </option>

              <option value="John">
                John
              </option>

              <option value="Emily">
                Emily
              </option>
            </select>
          </div>

          {/* Due Date */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-medium text-gray-400">
              Due Date
            </label>

            <input
              type="date"
              value={dueDate}
              onChange={(e) =>
                setDueDate(e.target.value)
              }
              className="w-full rounded-lg border border-white/[0.08] bg-[#15181c] px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            className="mb-8 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium hover:bg-blue-500"
          >
            Save Changes
          </button>

          {/* Comments */}
          <div className="border-t border-white/[0.06] pt-6">
            <div className="mb-4 flex items-center gap-2">
              <FiMessageSquare size={16} />

              <h3 className="text-sm font-semibold">
                Comments
              </h3>

              <span className="text-xs text-gray-600">
                {task.comments.length}
              </span>
            </div>

            <div className="space-y-3">
              {task.comments.map(
                (comment) => (
                  <div
                    key={comment.id}
                    className="rounded-lg bg-[#15181c] p-3"
                  >
                    <p className="text-sm text-gray-300">
                      {comment.text}
                    </p>

                    <p className="mt-2 text-xs text-gray-600">
                      {comment.author}
                    </p>
                  </div>
                )
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                value={comment}
                onChange={(e) =>
                  setComment(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleComment();
                  }
                }}
                placeholder="Add a comment..."
                className="flex-1 rounded-lg border border-white/[0.08] bg-[#15181c] px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />

              <button
                onClick={handleComment}
                className="rounded-lg bg-white/[0.08] px-3 text-sm hover:bg-white/[0.12]"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Delete */}
        <div className="border-t border-white/[0.06] p-6">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
          >
            <FiTrash2 size={16} />

            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}
function PriorityBadge({
  priority,
}: {
  priority: TaskPriority;
}) {
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
}

function CreateTaskDrawer({
  onClose,
}: {
  onClose: () => void;
}) {
  const addTask =
    useAppStore(
      (state) => state.addTask
    );

  const [title, setTitle] =
    useState("");
  const [description, setDescription] =
    useState("");

  const [priority, setPriority] =
    useState<TaskPriority>("medium");

  const [assignee, setAssignee] =
    useState("Alex");

  const [dueDate, setDueDate] =
    useState("");

  const handleSubmit = () => {
    if (!title.trim()) {
      return;
    }

    addTask({
      title: title.trim(),

      description: description.trim(),
      status: "backlog",

      priority,

      assignee,

      dueDate,

    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      <div className="absolute right-0 top-0 flex h-full w-full max-w-lg flex-col border-l border-white/[0.08] bg-[#0d0f12] text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
          <h2 className="text-lg font-semibold">
            Create Task
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white"
          >
            <FiX size={19} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 space-y-5 p-6">
          <div>
            <label className="mb-2 block text-xs text-gray-400">
              Title
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Task title"
              className="w-full rounded-lg border border-white/[0.08] bg-[#15181c] px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div>
  <label className="mb-2 block text-xs text-gray-400">
    Description
  </label>

  <textarea
    value={description}
    onChange={(e) =>
      setDescription(e.target.value)
    }
    placeholder="Describe the task..."
    rows={5}
    className="w-full resize-none rounded-lg border border-white/[0.08] bg-[#15181c] px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-blue-500"
  />
</div>

          <div>
            <label className="mb-2 block text-xs text-gray-400">
              Priority
            </label>

            <select
              value={priority}
              onChange={(e) =>
                setPriority(
                  e.target
                    .value as TaskPriority
                )
              }
              className="w-full rounded-lg border border-white/[0.08] bg-[#15181c] px-3 py-2.5 text-sm outline-none"
            >
              <option value="low">
                Low
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="high">
                High
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs text-gray-400">
              Assignee
            </label>

            <select
              value={assignee}
              onChange={(e) =>
                setAssignee(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-white/[0.08] bg-[#15181c] px-3 py-2.5 text-sm outline-none"
            >
              <option>Alex</option>
              <option>Sarah</option>
              <option>John</option>
              <option>Emily</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs text-gray-400">
              Due Date
            </label>

            <input
              type="date"
              value={dueDate}
              onChange={(e) =>
                setDueDate(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-white/[0.08] bg-[#15181c] px-3 py-2.5 text-sm outline-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-white/[0.06] p-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-white/[0.08] px-4 py-2.5 text-sm text-gray-400 hover:bg-white/[0.05]"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium hover:bg-blue-500"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default Board;