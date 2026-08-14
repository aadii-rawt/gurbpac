import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "../store/appStore";

type JSONPlaceholderTask = {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
};

const priorities = [
  "low",
  "medium",
  "high",
] as const;

const statuses = [
  "backlog",
  "in-progress",
  "review",
  "done",
] as const;

const assignees = [
  "Alex",
  "Sarah",
  "John",
  "Emily",
];

export function useBoardTasks() {
  const tasks = useAppStore(
    (state) => state.tasks
  );

  const setTasks = useAppStore(
    (state) => state.setTasks
  );

  const query = useQuery({
    queryKey: ["sprintdesk-tasks"],

    queryFn: async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=30"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch tasks"
        );
      }

      const data: JSONPlaceholderTask[] =
        await response.json();

      return data;
    },

    enabled: tasks.length === 0,

    staleTime: Infinity,
  });

  if (
    query.data &&
    tasks.length === 0
  ) {
    const boardTasks =
      query.data.map((task, index) => ({
        id: String(task.id),

        title:
          task.title
            .charAt(0)
            .toUpperCase() +
          task.title.slice(1),

        description:
          "Task imported from JSONPlaceholder.",

        status:
          task.completed
            ? "done"
            : statuses[index % statuses.length],

        priority:
          priorities[
            index % priorities.length
          ],

        assignee:
          assignees[
            index % assignees.length
          ],

        dueDate:
          new Date(
            Date.now() +
              (index + 1) *
                24 *
                60 *
                60 *
                1000
          )
            .toISOString()
            .split("T")[0],

        comments: [],
      }));

    setTasks(boardTasks);
  }

  return query;
}