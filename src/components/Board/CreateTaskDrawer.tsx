import React, { useState } from "react";
import { useAppStore } from "../../store/appStore";
import type { TaskPriority } from "../../types/task";
import { FiX } from "react-icons/fi";

const  CreateTaskDrawer = React.memo(({
    onClose,
}: {
    onClose: () => void;
})  => {
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
})

export default CreateTaskDrawer