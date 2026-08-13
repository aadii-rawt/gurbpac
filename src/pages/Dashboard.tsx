import {
  FiCheckCircle,
  FiClock,
  FiList,
  FiEye,
  FiArrowRight,
  FiCalendar,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import {
  useAppStore,
} from "../store/appStore";

function Dashboard() {
  const navigate = useNavigate();

  const user = useAppStore(
    (state) => state.user
  );

  const tasks = useAppStore(
    (state) => state.tasks
  );

  // =========================
  // Task counts
  // =========================

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

  // =========================
  // Progress
  // =========================

  const progress =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks /
            totalTasks) *
            100
        );

  // Latest 5 tasks
  const recentTasks = [...tasks]
    .slice(-5)
    .reverse();

  return (
    <div className="min-h-full bg-[#090a0c] p-6 text-white">
      {/* =========================
          Welcome
      ========================== */}

      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
          Good to see you,{" "}
          {user?.firstName || "User"} 👋
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with
          your sprint today.
        </p>
      </div>

      {/* =========================
          Stats
      ========================== */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          icon={<FiList size={20} />}
          iconClass="bg-blue-500/10 text-blue-400"
        />

        <StatCard
          title="In Progress"
          value={inProgressTasks}
          icon={<FiClock size={20} />}
          iconClass="bg-yellow-500/10 text-yellow-400"
        />

        <StatCard
          title="In Review"
          value={reviewTasks}
          icon={<FiEye size={20} />}
          iconClass="bg-purple-500/10 text-purple-400"
        />

        <StatCard
          title="Completed"
          value={completedTasks}
          icon={
            <FiCheckCircle size={20} />
          }
          iconClass="bg-green-500/10 text-green-400"
        />
      </div>

      {/* =========================
          Progress + Summary
      ========================== */}

      <div className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Sprint progress */}
        <div className="rounded-xl border border-white/[0.06] bg-[#0d0f12] p-5 xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">
                Sprint Progress
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Overall completion of your
                current sprint
              </p>
            </div>

            <span className="text-2xl font-semibold text-blue-400">
              {progress}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          {/* Breakdown */}
          <div className="mt-6 grid grid-cols-4 gap-3">
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

        {/* Quick action */}
        <div className="rounded-xl border border-white/[0.06] bg-[#0d0f12] p-5">
          <h2 className="text-sm font-semibold">
            Sprint Overview
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Current board status
          </p>

          <div className="mt-6 space-y-4">
            <OverviewRow
              label="Backlog"
              value={backlogTasks}
            />

            <OverviewRow
              label="In Progress"
              value={inProgressTasks}
            />

            <OverviewRow
              label="Review"
              value={reviewTasks}
            />

            <OverviewRow
              label="Completed"
              value={completedTasks}
            />
          </div>

          <button
            onClick={() =>
              navigate("/board")
            }
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-white/[0.06] px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/[0.1] hover:text-white"
          >
            Open Sprint Board

            <FiArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* =========================
          Recent Tasks
      ========================== */}

      <div className="rounded-xl border border-white/[0.06] bg-[#0d0f12]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold">
              Recent Tasks
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Recently added sprint tasks
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/board")
            }
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            View all
          </button>
        </div>

        {recentTasks.length === 0 ? (
          <div className="flex min-h-[180px] items-center justify-center text-sm text-gray-600">
            No tasks available
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-white/[0.02]"
              >
                {/* Task info */}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-200">
                    {task.title}
                  </p>

                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-600">
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

/* =================================
   Stat Card
================================= */

function StatCard({
  title,
  value,
  icon,
  iconClass,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0f12] p-5">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconClass}`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs text-gray-500">
          {title}
        </p>

        <p className="mt-1 text-2xl font-semibold">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =================================
   Progress Item
================================= */

function ProgressItem({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-lg font-semibold text-gray-200">
        {value}
      </p>
    </div>
  );
}

/* =================================
   Overview Row
================================= */

function OverviewRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-400">
        {label}
      </span>

      <span className="text-sm font-medium text-gray-200">
        {value}
      </span>
    </div>
  );
}

/* =================================
   Status Badge
================================= */

function StatusBadge({
  status,
}: {
  status:
    | "backlog"
    | "in-progress"
    | "review"
    | "done";
}) {
  const styles = {
    backlog:
      "bg-gray-500/10 text-gray-400",

    "in-progress":
      "bg-yellow-500/10 text-yellow-400",

    review:
      "bg-purple-500/10 text-purple-400",

    done:
      "bg-green-500/10 text-green-400",
  };

  const labels = {
    backlog: "Backlog",
    "in-progress": "In Progress",
    review: "Review",
    done: "Done",
  };

  return (
    <span
      className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

export default Dashboard;