
export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: string;
  comments: string[];
}

export type TaskStatus =
  | "backlog"
  | "in-progress"
  | "review"
  | "done";

export type TaskPriority =
  | "low"
  | "medium"
  | "high";

export type Comment = {
  id: string;
  text: string;
  author: string;
  createdAt: string;
};

export type BoardTask = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: string;
  comments: Comment[];
};

