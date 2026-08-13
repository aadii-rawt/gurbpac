import { create } from "zustand";
import type { BoardTask, TaskStatus } from "../types/task";

type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
};

type Task = {
  id: number;
  title: string;
  status: "backlog" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  assignee: string;
  dueDate: string;
};

type AppStore = {
  user: User | null;

  // Access token exists only in memory.
  accessToken: string | null;

  // Refresh token is persisted in localStorage.
  refreshToken: string | null;


  isAuthenticated: boolean;

  // Used while checking the existing session.
  isInitializing: boolean;

  setAuth: (
    user: User,
    accessToken: string,
    refreshToken: string
  ) => void;

  setAccessToken: (token: string) => void;

  restoreSession: () => Promise<void>;

  logout: () => void;

  tasks: BoardTask[];

  setTasks: (tasks: BoardTask[]) => void;

  addTask: (
    task: Omit<BoardTask, "id" | "comments">
  ) => void;

  updateTask: (
    id: string,
    updates: Partial<BoardTask>
  ) => void;

  deleteTask: (id: string) => void;

  moveTask: (
    activeId: string,
    overId: string
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

  // notification type

  notifications: Notification[];

  seenPostIds: number[];

  isNotificationPanelOpen: boolean;

  notificationToast: string | null;

  addNotifications: (
    notifications: Notification[]
  ) => void;

  markNotificationAsRead: (
    id: string
  ) => void;

  markAllNotificationsAsRead: () => void;

  setNotificationPanelOpen: (
    open: boolean
  ) => void;
  setSeenPostIds: (
    ids: number[]
  ) => void;

  clearNotificationToast: () => void;

  simulateNotification: () => void;
};



export const useAppStore = create<AppStore>(
  (set, get) => ({
    user: null,
    accessToken: null,
    refreshToken: localStorage.getItem(
      "refreshToken"
    ),
    isAuthenticated: false,
    isInitializing: true,
    setAuth: (
      user,
      accessToken,
      refreshToken
    ) => {

      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
      });
    },
    setAccessToken: (token) => {
      set({
        accessToken: token,
        isAuthenticated: true,
      });
    },
    restoreSession: async () => {
      const refreshToken =
        localStorage.getItem(
          "refreshToken"
        );

      // No refresh token = no existing session.
      if (!refreshToken) {
        set({
          isInitializing: false,
        });

        return;
      }

      try {
        /*
         * Generate a NEW access token
         * using the refresh token.
         */
        const response = await fetch(
          "https://dummyjson.com/auth/refresh",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              refreshToken,
              expiresInMins: 30,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            "Refresh token expired"
          );
        }

        const data = await response.json();

        /*
         * Store the NEW refresh token.
         */
        localStorage.setItem(
          "refreshToken",
          data.refreshToken
        );

        /*
         * Get the user using the NEW access token.
         */
        const userResponse = await fetch(
          "https://dummyjson.com/auth/me",
          {
            headers: {
              Authorization: `Bearer ${data.accessToken}`,
            },
          }
        );

        if (!userResponse.ok) {
          throw new Error(
            "Unable to restore session"
          );
        }

        const user = await userResponse.json();

        set({
          user,

          // New access token in memory.
          accessToken: data.accessToken,

          // New refresh token.
          refreshToken: data.refreshToken,

          isAuthenticated: true,

          isInitializing: false,
        });
      } catch (error) {
        console.error(
          "Session restoration failed:",
          error
        );

        // Refresh token is invalid/expired.
        localStorage.removeItem(
          "refreshToken"
        );

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isInitializing: false,
        });
      }
    },
    setTokens: (
      accessToken: string,
      refreshToken: string
    ) => {
      localStorage.setItem(
        "refreshToken",
        refreshToken
      );

      set({
        accessToken,
        refreshToken,
        isAuthenticated: true,
      });
    },
    logout: () => {
      localStorage.removeItem(
        "refreshToken"
      );

      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      });
    },

    // task
    tasks: JSON.parse(
      localStorage.getItem("sprintdesk_tasks") || "[]"
    ),

    setTasks: (tasks) => {
      localStorage.setItem(
        "sprintdesk_tasks",
        JSON.stringify(tasks)
      );

      set({ tasks });
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

    moveTask: (activeId, overId) => {
      const tasks = [...get().tasks];

      const activeIndex = tasks.findIndex(
        (task) => task.id === activeId
      );

      const overIndex = tasks.findIndex(
        (task) => task.id === overId
      );

      if (
        activeIndex === -1 ||
        overIndex === -1
      ) {
        return;
      }

      const [movedTask] = tasks.splice(
        activeIndex,
        1
      );

      tasks.splice(
        overIndex,
        0,
        movedTask
      );

      localStorage.setItem(
        "sprintdesk_tasks",
        JSON.stringify(tasks)
      );

      set({ tasks });
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


    // notification 
    notifications: JSON.parse(
      localStorage.getItem(
        "sprintdesk_notifications"
      ) || "[]"
    ),

    seenPostIds: JSON.parse(
      localStorage.getItem(
        "sprintdesk_seen_post_ids"
      ) || "[]"
    ),

    isNotificationPanelOpen: false,

    notificationToast: null,

    setSeenPostIds: (ids) => {
      localStorage.setItem(
        "sprintdesk_seen_post_ids",
        JSON.stringify(ids)
      );

      set({
        seenPostIds: ids,
      });
    },

    addNotifications: (
      newNotifications
    ) => {
      const existing =
        get().notifications;

      const notifications = [
        ...newNotifications,
        ...existing,
      ].slice(0, 20);

      localStorage.setItem(
        "sprintdesk_notifications",
        JSON.stringify(notifications)
      );

      set({
        notifications,

        notificationToast:
          !get()
            .isNotificationPanelOpen &&
            newNotifications.length > 0
            ? `${newNotifications.length} new notification${newNotifications.length > 1
              ? "s"
              : ""
            }`
            : null,
      });
    },

    markNotificationAsRead: (id) => {
      const notifications =
        get().notifications.map(
          (notification) =>
            notification.id === id
              ? {
                ...notification,
                read: true,
              }
              : notification
        );

      localStorage.setItem(
        "sprintdesk_notifications",
        JSON.stringify(notifications)
      );

      set({
        notifications,
      });
    },

    markAllNotificationsAsRead: () => {
      const notifications =
        get().notifications.map(
          (notification) => ({
            ...notification,
            read: true,
          })
        );

      localStorage.setItem(
        "sprintdesk_notifications",
        JSON.stringify(notifications)
      );

      set({
        notifications,
      });
    },

    setNotificationPanelOpen: (
      open
    ) => {
      set({
        isNotificationPanelOpen: open,

        notificationToast: open
          ? null
          : get().notificationToast,
      });
    },

    clearNotificationToast: () => {
      set({
        notificationToast: null,
      });
    },

    simulateNotification: () => {
      const seenIds =
        get().seenPostIds;

      const nextId =
        Math.max(0, ...seenIds) + 1;

      const notification: Notification = {
        id: `post-${nextId}`,
        postId: nextId,
        title: "New post received",
        message: `Post ${nextId} has arrived.`,
        read: false,
        createdAt:
          new Date().toISOString(),
      };

      const newSeenIds = [
        ...seenIds,
        nextId,
      ];

      localStorage.setItem(
        "sprintdesk_seen_post_ids",
        JSON.stringify(newSeenIds)
      );

      set({
        seenPostIds: newSeenIds,
      });

      get().addNotifications([
        notification,
      ]);
    },
  })
);