import {
  FiCheckCircle,
  FiClock,
  FiList,
  FiEye,
  FiCalendar,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import {
  useAppStore,
} from "../store/appStore";

import StatCard from "../components/StatCard";
import ProgressItem from "../components/ProgressItem";
import StatusBadge from "../components/StatusBadge";
import DashboardSkeleton from "../components/loading/DashboardSkeleton";

function Dashboard() {
  const navigate = useNavigate();

  const user = useAppStore(
    (state) => state.user
  );

  const tasks = useAppStore(
    (state) => state.tasks
  );

  const totalTasks = tasks.length;

  const backlogTasks = tasks.filter(
    (task) =>
      task.status === "backlog"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) =>
      task.status === "in-progress"
  ).length;

  const reviewTasks = tasks.filter(
    (task) =>
      task.status === "review"
  ).length;

  const completedTasks = tasks.filter(
    (task) =>
      task.status === "done"
  ).length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round(
        (completedTasks /
          totalTasks) *
        100
      );

  const recentTasks = [...tasks]
    .slice(-5)
    .reverse();

  const isTasksLoading = useAppStore(
    (state) => state.isTasksLoading
  );

  console.log("isTasksLoading", isTasksLoading);
  // if (isTasksLoading) {
  //   return <DashboardSkeleton />;
  // }

  return (
    <div
      className="
        min-h-full
        bg-gray-50
        p-6
        text-gray-900
        transition-colors
        duration-200

        dark:bg-[#090a0c]
        dark:text-white
      "
    >
      {/* Welcome */}
      <div className="mb-8">
        <h1
          className="
            text-2xl
            font-semibold
            text-gray-900
            dark:text-white
          "
        >
          Good to see you,{" "}
          {user?.firstName || "User"} 👋
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-gray-500
            dark:text-gray-500
          "
        >
          Here's what's happening with
          your sprint today.
        </p>
      </div>

      {/* Stats */}
      <div
        className="
          mb-6
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          icon={
            <FiList size={20} />
          }
          iconClass="
            bg-blue-500/10
            text-blue-600
            dark:text-blue-400
          "
        />

        <StatCard
          title="In Progress"
          value={inProgressTasks}
          icon={
            <FiClock size={20} />
          }
          iconClass="
            bg-yellow-500/10
            text-yellow-600
            dark:text-yellow-400
          "
        />

        <StatCard
          title="In Review"
          value={reviewTasks}
          icon={
            <FiEye size={20} />
          }
          iconClass="
            bg-purple-500/10
            text-purple-600
            dark:text-purple-400
          "
        />

        <StatCard
          title="Completed"
          value={completedTasks}
          icon={
            <FiCheckCircle size={20} />
          }
          iconClass="
            bg-green-500/10
            text-green-600
            dark:text-green-400
          "
        />
      </div>

      {/* Sprint Progress */}
      <div className="mb-6">
        <div
          className="
            rounded-xl
            border
            border-gray-200
            bg-white
            p-5
            shadow-sm
            transition-colors

            dark:border-white/[0.06]
            dark:bg-[#0d0f12]
            dark:shadow-none
          "
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2
                className="
                  text-sm
                  font-semibold
                  text-gray-900
                  dark:text-white
                "
              >
                Sprint Progress
              </h2>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-500
                "
              >
                Overall completion of your
                current sprint
              </p>
            </div>

            <span
              className="
                text-2xl
                font-semibold
                text-blue-600
                dark:text-blue-400
              "
            >
              {progress}%
            </span>
          </div>

          {/* Progress bar */}
          <div
            className="
              h-2
              overflow-hidden
              rounded-full
              bg-gray-100
              dark:bg-white/[0.06]
            "
          >
            <div
              className="
                h-full
                rounded-full
                bg-blue-600
                transition-all
                duration-500
              "
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          {/* Breakdown */}
          <div
            className="
              mt-6
              grid
              grid-cols-4
              gap-3
            "
          >
            <ProgressItem
              label="Backlog"
              value={backlogTasks}
            />

            <ProgressItem
              label="In Progress"
              value={inProgressTasks}
            />

            <ProgressItem
              label="Review"
              value={reviewTasks}
            />

            <ProgressItem
              label="Done"
              value={completedTasks}
            />
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div
        className="
          rounded-xl
          border
          border-gray-200
          bg-white
          shadow-sm

          dark:border-white/[0.06]
          dark:bg-[#0d0f12]
          dark:shadow-none
        "
      >
        {/* Header */}
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-gray-200
            px-5 py-4

            dark:border-white/[0.06]
          "
        >
          <div>
            <h2
              className="
                text-sm
                font-semibold
                text-gray-900
                dark:text-white
              "
            >
              Recent Tasks
            </h2>

            <p
              className="
                mt-1
                text-xs
                text-gray-500
              "
            >
              Recently added sprint tasks
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/board")
            }
            className="
              text-xs
              text-blue-600
              transition
              hover:text-blue-700

              dark:text-blue-400
              dark:hover:text-blue-300
            "
          >
            View all
          </button>
        </div>

        {/* Empty state */}
        {recentTasks.length === 0 ? (
          <div
            className="
              flex
              min-h-[180px]
              items-center
              justify-center
              text-sm
              text-gray-400
              dark:text-gray-600
            "
          >
            No tasks available
          </div>
        ) : (
          <div
            className="
              divide-y
              divide-gray-100
              dark:divide-white/[0.05]
            "
          >
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  px-5 py-4
                  transition

                  hover:bg-gray-50

                  dark:hover:bg-white/[0.02]
                "
              >
                {/* Task info */}
                <div className="min-w-0">
                  <p
                    className="
                      truncate
                      text-sm
                      font-medium
                      text-gray-900
                      dark:text-gray-200
                    "
                  >
                    {task.title}
                  </p>

                  <div
                    className="
                      mt-1
                      flex
                      items-center
                      gap-3
                      text-xs
                      text-gray-400

                      dark:text-gray-600
                    "
                  >
                    <span>
                      {task.assignee}
                    </span>

                    <span className="flex items-center gap-1">
                      <FiCalendar
                        size={12}
                      />

                      {task.dueDate}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <StatusBadge
                  status={task.status}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
