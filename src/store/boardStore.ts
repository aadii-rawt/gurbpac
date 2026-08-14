import type {
    BoardTask,
    TaskStatus,
} from "../types/task";

export type BoardSlice = {
    tasks: BoardTask[];

    setTasks: (tasks: BoardTask[]) => void;

    addTask: (
        task: Omit<BoardTask, "id" | "comments">
    ) => void;
    isTasksLoading: boolean;
    updateTask: (
        id: string,
        updates: Partial<BoardTask>
    ) => void;

    deleteTask: (id: string) => void;

    moveTask: (
        taskId: string,
        status: string
    ) => void;

    moveTaskToColumn: (
        taskId: string,
        status: TaskStatus
    ) => void;

    addComment: (
        taskId: string,
        comment: string,
        author: string
    ) => void;

    undoMove: (() => void) | null;
    setUndoMove: (fn: (() => void) | null) => void;
    restoreTasks: (tasks: BoardTask[]) => void;

};

import type { StateCreator } from "zustand";

export const createBoardSlice: StateCreator<
    BoardSlice
> = (set, get) => ({
    tasks: JSON.parse(
        localStorage.getItem("sprintdesk_tasks") || "[]"
    ),
    isTasksLoading: true,
    setTasks: (tasks) => {
        console.log("🔥 setTasks CALLED");

        localStorage.setItem(
            "sprintdesk_tasks",
            JSON.stringify(tasks)
        );

        set({
            tasks,
            isTasksLoading: false,
        });

        console.log("🔥 task loading stop");
    },

    addTask: (task) => {
        const newTask: BoardTask = {
            ...task,
            id: crypto.randomUUID(),
            comments: [],
        };

        const tasks = [
            ...get().tasks,
            newTask,
        ];

        localStorage.setItem(
            "sprintdesk_tasks",
            JSON.stringify(tasks)
        );

        set({ tasks });
    },

    updateTask: (id, updates) => {
        const tasks = get().tasks.map((task) =>
            task.id === id
                ? {
                    ...task,
                    ...updates,
                }
                : task
        );

        localStorage.setItem(
            "sprintdesk_tasks",
            JSON.stringify(tasks)
        );

        set({ tasks });
    },

    deleteTask: (id) => {
        const tasks = get().tasks.filter(
            (task) => task.id !== id
        );

        localStorage.setItem(
            "sprintdesk_tasks",
            JSON.stringify(tasks)
        );

        set({ tasks });
    },

    moveTask: (
        taskId: string,
        status: TaskStatus
    ) => {
        const tasks: BoardTask[] =
            get().tasks.map((task) => {
                if (task.id !== taskId) {
                    return task;
                }

                return {
                    ...task,
                    status,
                    completedAt:
                        status === "done"
                            ? task.completedAt ||
                            new Date().toISOString()
                            : undefined,
                };
            });

        localStorage.setItem(
            "sprintdesk_tasks",
            JSON.stringify(tasks)
        );

        set({
            tasks,
        });
    },
    moveTaskToColumn: (taskId, status) => {
        const tasks = get().tasks.map((task) => {
            if (task.id !== taskId) {
                return task;
            }

            return {
                ...task,
                status,

                // Record completion time
                completedAt:
                    status === "done"
                        ? task.completedAt ||
                        new Date().toISOString()
                        : undefined,
            };
        });

        localStorage.setItem(
            "sprintdesk_tasks",
            JSON.stringify(tasks)
        );

        set({ tasks });
    },

    addComment: (
        taskId,
        comment,
        author
    ) => {
        const tasks = get().tasks.map((task) => {
            if (task.id !== taskId) {
                return task;
            }

            return {
                ...task,

                comments: [
                    ...task.comments,
                    {
                        id: crypto.randomUUID(),
                        text: comment,
                        author,
                        createdAt:
                            new Date().toISOString(),
                    },
                ],
            };
        });

        localStorage.setItem(
            "sprintdesk_tasks",
            JSON.stringify(tasks)
        );

        set({ tasks });
    },

    undoMove: null,

    setUndoMove: (fn) => {
        set({
            undoMove: fn,
        });
    },

    restoreTasks: (tasks) => {
        localStorage.setItem(
            "sprintdesk_tasks",
            JSON.stringify(tasks)
        );

        set({
            tasks: [...tasks],
        });
    },

});