import type { TaskStatus } from "../types/task";

export const columns: {
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
