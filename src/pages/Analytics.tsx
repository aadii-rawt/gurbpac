import React from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import {
  FiCheckCircle,
  FiClock,
  FiList,
  FiTrendingUp,
} from "react-icons/fi";

import { useAppStore } from "../store/appStore";

function Analytics() {
  const tasks = useAppStore(
    (state) => state.tasks
  );

  const statusData = [
    {
      name: "Backlog",
      value: tasks.filter(
        (task) => task.status === "backlog"
      ).length,
    },
    {
      name: "In Progress",
      value: tasks.filter(
        (task) =>
          task.status === "in-progress"
      ).length,
    },
    {
      name: "Review",
      value: tasks.filter(
        (task) => task.status === "review"
      ).length,
    },
    {
      name: "Done",
      value: tasks.filter(
        (task) => task.status === "done"
      ).length,
    },
  ];

  const priorityData = [
    {
      name: "Low",
      Backlog: countPriority(
        tasks,
        "low",
        "backlog"
      ),
      "In Progress": countPriority(
        tasks,
        "low",
        "in-progress"
      ),
      Review: countPriority(
        tasks,
        "low",
        "review"
      ),
      Done: countPriority(
        tasks,
        "low",
        "done"
      ),
    },
    {
      name: "Medium",
      Backlog: countPriority(
        tasks,
        "medium",
        "backlog"
      ),
      "In Progress": countPriority(
        tasks,
        "medium",
        "in-progress"
      ),
      Review: countPriority(
        tasks,
        "medium",
        "review"
      ),
      Done: countPriority(
        tasks,
        "medium",
        "done"
      ),
    },
    {
      name: "High",
      Backlog: countPriority(
        tasks,
        "high",
        "backlog"
      ),
      "In Progress": countPriority(
        tasks,
        "high",
        "in-progress"
      ),
      Review: countPriority(
        tasks,
        "high",
        "review"
      ),
      Done: countPriority(
        tasks,
        "high",
        "done"
      ),
    },
  ];

  const completionData =
    createCompletionTrend(tasks);

  const velocityData =
    createSprintVelocity(tasks);

  const totalTasks = tasks.length;

  const completedTasks =
    tasks.filter(
      (task) => task.status === "done"
    ).length;

  const inProgressTasks =
    tasks.filter(
      (task) =>
        task.status === "in-progress"
    ).length;

  const completionRate =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks /
            totalTasks) *
            100
        );

  return (
    <div
      className="
        min-h-full
        bg-gray-50
        p-6
        text-gray-900
        transition-colors
        duration-200

        [--chart-grid:rgba(0,0,0,0.08)]
        [--chart-text:#6b7280]
        [--chart-tooltip-bg:#ffffff]
        [--chart-tooltip-border:rgba(0,0,0,0.08)]

        dark:bg-[#090a0c]
        dark:text-white
        dark:[--chart-grid:rgba(255,255,255,0.06)]
        dark:[--chart-text:#6b7280]
        dark:[--chart-tooltip-bg:#15181c]
        dark:[--chart-tooltip-border:rgba(255,255,255,0.08)]
      "
    >
      <div className="mb-8">
        <h1
          className="
            text-2xl
            font-semibold
            text-gray-900
            dark:text-white
          "
        >
          Analytics
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-gray-500
          "
        >
          Track your sprint performance and
          task progress.
        </p>
      </div>

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
        <AnalyticsStat
          title="Total Tasks"
          value={totalTasks}
          icon={
            <FiList size={19} />
          }
        />

        <AnalyticsStat
          title="Completed"
          value={completedTasks}
          icon={
            <FiCheckCircle size={19} />
          }
        />

        <AnalyticsStat
          title="In Progress"
          value={inProgressTasks}
          icon={
            <FiClock size={19} />
          }
        />

        <AnalyticsStat
          title="Completion Rate"
          value={`${completionRate}%`}
          icon={
            <FiTrendingUp size={19} />
          }
        />
      </div>

      <div
        className="
          grid
          grid-cols-1
          gap-5
          xl:grid-cols-2
        "
      >
        <ChartCard
          title="Sprint Velocity"
          description="Completed tasks over time"
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={velocityData}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid
                stroke="var(--chart-grid)"
                vertical={false}
              />

              <XAxis
                dataKey="sprint"
                tick={{
                  fill: "var(--chart-text)",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fill: "var(--chart-text)",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  background:
                    "var(--chart-tooltip-bg)",
                  border:
                    "1px solid var(--chart-tooltip-border)",
                  borderRadius: "8px",
                  color: "var(--chart-text)",
                }}
              />

              <Bar
                dataKey="completed"
                name="Completed"
                fill="#3b82f6"
                radius={[
                  5,
                  5,
                  0,
                  0,
                ]}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Task Status"
          description="Current distribution across board columns"
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="78%"
                paddingAngle={3}
                animationDuration={800}
              >
                <Cell fill="#64748b" />
                <Cell fill="#3b82f6" />
                <Cell fill="#a855f7" />
                <Cell fill="#22c55e" />
              </Pie>

              <Tooltip
                contentStyle={{
                  background:
                    "var(--chart-tooltip-bg)",
                  border:
                    "1px solid var(--chart-tooltip-border)",
                  borderRadius: "8px",
                  color: "var(--chart-text)",
                }}
              />

              <Legend
                wrapperStyle={{
                  fontSize: "12px",
                  color: "var(--chart-text)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Priority Breakdown"
          description="Priority distribution across board columns"
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={priorityData}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid
                stroke="var(--chart-grid)"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                tick={{
                  fill: "var(--chart-text)",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fill: "var(--chart-text)",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  background:
                    "var(--chart-tooltip-bg)",
                  border:
                    "1px solid var(--chart-tooltip-border)",
                  borderRadius: "8px",
                  color: "var(--chart-text)",
                }}
              />

              <Legend
                wrapperStyle={{
                  color: "var(--chart-text)",
                }}
              />

              <Bar
                dataKey="Backlog"
                fill="#64748b"
                animationDuration={700}
              />

              <Bar
                dataKey="In Progress"
                fill="#3b82f6"
                animationDuration={700}
              />

              <Bar
                dataKey="Review"
                fill="#a855f7"
                animationDuration={700}
              />

              <Bar
                dataKey="Done"
                fill="#22c55e"
                animationDuration={700}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Completion Trend"
          description="Tasks completed over time"
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart
              data={completionData}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid
                stroke="var(--chart-grid)"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                tick={{
                  fill: "var(--chart-text)",
                  fontSize: 10,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fill: "var(--chart-text)",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  background:
                    "var(--chart-tooltip-bg)",
                  border:
                    "1px solid var(--chart-tooltip-border)",
                  borderRadius: "8px",
                  color: "var(--chart-text)",
                }}
              />

              <Line
                type="monotone"
                dataKey="completed"
                name="Completed"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{
                  r: 3,
                }}
                activeDot={{
                  r: 5,
                }}
                animationDuration={900}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function countPriority(
  tasks: any[],
  priority: string,
  status: string
) {
  return tasks.filter(
    (task) =>
      task.priority === priority &&
      task.status === status
  ).length;
}

function createCompletionTrend(
  tasks: any[]
) {
  const completed = tasks.filter(
    (task) =>
      task.status === "done" &&
      task.completedAt
  );

  const grouped: Record<
    string,
    number
  > = {};

  completed.forEach((task) => {
    const date =
      new Date(
        task.completedAt
      ).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
        }
      );

    grouped[date] =
      (grouped[date] || 0) + 1;
  });

  return Object.entries(grouped).map(
    ([date, completed]) => ({
      date,
      completed,
    })
  );
}

function createSprintVelocity(
  tasks: any[]
) {
  const completed = tasks.filter(
    (task) =>
      task.status === "done" &&
      task.completedAt
  );

  const grouped: Record<
    string,
    number
  > = {};

  completed.forEach((task) => {
    const date = new Date(
      task.completedAt
    );

    const firstDay =
      new Date(
        date.getFullYear(),
        0,
        1
      );

    const week = Math.ceil(
      ((date.getTime() -
        firstDay.getTime()) /
        86400000 +
        firstDay.getDay() +
        1) /
        7
    );

    const sprint = `Sprint ${week}`;

    grouped[sprint] =
      (grouped[sprint] || 0) + 1;
  });

  return Object.entries(grouped).map(
    ([sprint, completed]) => ({
      sprint,
      completed,
    })
  );
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        min-w-0
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
      <div className="mb-5">
        <h2
          className="
            text-sm
            font-semibold
            text-gray-900
            dark:text-white
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-1
            text-xs
            text-gray-500
          "
        >
          {description}
        </p>
      </div>

      <div className="h-[280px] w-full min-w-0">
        {children}
      </div>
    </div>
  );
}

function AnalyticsStat({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
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
      <div
        className="
          flex h-9 w-9
          items-center justify-center
          rounded-lg
          bg-blue-500/10
          text-blue-600
          dark:text-blue-400
        "
      >
        {icon}
      </div>

      <p
        className="
          mt-4
          text-xs
          text-gray-500
        "
      >
        {title}
      </p>

      <p
        className="
          mt-1
          text-2xl
          font-semibold
          text-gray-900
          dark:text-white
        "
      >
        {value}
      </p>
    </div>
  );
}

export default Analytics;
