import { create } from "zustand";
import type { BoardTask, TaskStatus } from "../types/task";
import { createAuthSlice } from "./authStore";
import { createBoardSlice } from "./boardStore";
import { createNotificationSlice } from "./notificationStore";

type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
};

type AppStore = {
  user: User | null;

  accessToken: string | null;

  refreshToken: string | null;

  isAuthenticated: boolean;

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
  isTasksLoading: boolean;
  addTask: (
    task: Omit<BoardTask, "id" | "comments">
  ) => void;

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
  (...args) => ({
    ...createAuthSlice(...args),
    ...createBoardSlice(...args),
    ...createNotificationSlice(...args),
  })
);