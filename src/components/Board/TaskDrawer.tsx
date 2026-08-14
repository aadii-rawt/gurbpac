import {
  FiMessageSquare,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import {
  useAppStore,
} from "../../store/appStore";

import React, {
  useState,
} from "react";

import type {
  BoardTask,
  TaskPriority,
} from "../../types/task";

const TaskDrawer = React.memo(
  ({
    task,
    onClose,
  }: {
    task: BoardTask;
    onClose: () => void;
  }) => {
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
        <div
          onClick={onClose}
          className="absolute inset-0 bg-black/50"
        />

        <div
          className="
            absolute
            right-0
            top-0
            flex
            h-full
            w-full
            max-w-xl
            flex-col
            border-l
            border-gray-200
            bg-white
            text-gray-900
            shadow-2xl

            dark:border-white/[0.08]
            dark:bg-[#0d0f12]
            dark:text-white
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-gray-200
              px-6
              py-5

              dark:border-white/[0.06]
            "
          >
            <h2 className="text-lg font-semibold">
              Edit Task
            </h2>

            <button
              onClick={onClose}
              className="
                rounded-lg
                p-2
                text-gray-400
                transition
                hover:bg-gray-100
                hover:text-gray-900

                dark:text-gray-500
                dark:hover:bg-white/[0.05]
                dark:hover:text-white
              "
            >
              <FiX size={19} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-5">
              <label
                className="
                  mb-2
                  block
                  text-xs
                  font-medium
                  text-gray-600

                  dark:text-gray-400
                "
              >
                Title
              </label>

              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  bg-gray-50
                  px-3
                  py-2.5
                  text-sm
                  text-gray-900
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-blue-500

                  dark:border-white/[0.08]
                  dark:bg-[#15181c]
                  dark:text-white
                  dark:placeholder:text-gray-600
                "
              />
            </div>

            <div className="mb-5">
              <label
                className="
                  mb-2
                  block
                  text-xs
                  font-medium
                  text-gray-600

                  dark:text-gray-400
                "
              >
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows={5}
                className="
                  w-full
                  resize-none
                  rounded-lg
                  border
                  border-gray-200
                  bg-gray-50
                  px-3
                  py-2.5
                  text-sm
                  text-gray-900
                  outline-none
                  transition
                  focus:border-blue-500

                  dark:border-white/[0.08]
                  dark:bg-[#15181c]
                  dark:text-white
                "
              />
            </div>

            <div className="mb-5">
              <label
                className="
                  mb-2
                  block
                  text-xs
                  font-medium
                  text-gray-600

                  dark:text-gray-400
                "
              >
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(
                    e.target.value as TaskPriority
                  )
                }
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  bg-gray-50
                  px-3
                  py-2.5
                  text-sm
                  text-gray-900
                  outline-none
                  focus:border-blue-500

                  dark:border-white/[0.08]
                  dark:bg-[#15181c]
                  dark:text-white
                "
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

            <div className="mb-5">
              <label
                className="
                  mb-2
                  block
                  text-xs
                  font-medium
                  text-gray-600

                  dark:text-gray-400
                "
              >
                Assignee
              </label>

              <select
                value={assignee}
                onChange={(e) =>
                  setAssignee(e.target.value)
                }
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  bg-gray-50
                  px-3
                  py-2.5
                  text-sm
                  text-gray-900
                  outline-none
                  focus:border-blue-500

                  dark:border-white/[0.08]
                  dark:bg-[#15181c]
                  dark:text-white
                "
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

            <div className="mb-6">
              <label
                className="
                  mb-2
                  block
                  text-xs
                  font-medium
                  text-gray-600

                  dark:text-gray-400
                "
              >
                Due Date
              </label>

              <input
                type="date"
                value={dueDate}
                onChange={(e) =>
                  setDueDate(e.target.value)
                }
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  bg-gray-50
                  px-3
                  py-2.5
                  text-sm
                  text-gray-900
                  outline-none
                  focus:border-blue-500

                  dark:border-white/[0.08]
                  dark:bg-[#15181c]
                  dark:text-white
                "
              />
            </div>

            <button
              onClick={handleSave}
              className="
                mb-8
                w-full
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
              Save Changes
            </button>

            <div
              className="
                border-t
                border-gray-200
                pt-6

                dark:border-white/[0.06]
              "
            >
              <div className="mb-4 flex items-center gap-2">
                <FiMessageSquare size={16} />

                <h3 className="text-sm font-semibold">
                  Comments
                </h3>

                <span
                  className="
                    text-xs
                    text-gray-400

                    dark:text-gray-600
                  "
                >
                  {task.comments.length}
                </span>
              </div>

              <div className="space-y-3">
                {task.comments.map(
                  (comment) => (
                    <div
                      key={comment.id}
                      className="
                        rounded-lg
                        bg-gray-50
                        p-3

                        dark:bg-[#15181c]
                      "
                    >
                      <p
                        className="
                          text-sm
                          text-gray-700

                          dark:text-gray-300
                        "
                      >
                        {comment.text}
                      </p>

                      <p
                        className="
                          mt-2
                          text-xs
                          text-gray-400

                          dark:text-gray-600
                        "
                      >
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
                  className="
                    flex-1
                    rounded-lg
                    border
                    border-gray-200
                    bg-gray-50
                    px-3
                    py-2.5
                    text-sm
                    text-gray-900
                    outline-none
                    placeholder:text-gray-400
                    focus:border-blue-500

                    dark:border-white/[0.08]
                    dark:bg-[#15181c]
                    dark:text-white
                    dark:placeholder:text-gray-600
                  "
                />

                <button
                  onClick={handleComment}
                  className="
                    rounded-lg
                    bg-gray-100
                    px-3
                    text-sm
                    text-gray-700
                    transition
                    hover:bg-gray-200

                    dark:bg-white/[0.08]
                    dark:text-gray-300
                    dark:hover:bg-white/[0.12]
                  "
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div
            className="
              border-t
              border-gray-200
              p-6

              dark:border-white/[0.06]
            "
          >
            <button
              onClick={handleDelete}
              className="
                flex
                items-center
                gap-2
                text-sm
                text-red-600
                transition
                hover:text-red-500

                dark:text-red-400
                dark:hover:text-red-300
              "
            >
              <FiTrash2 size={16} />

              Delete Task
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default TaskDrawer;
