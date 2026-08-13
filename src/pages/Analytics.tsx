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

  /*
   * ==========================================
   * Task Status
   * ==========================================
   */

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

  /*
   * ==========================================
   * Priority Breakdown
   * ==========================================
   */

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

  /*
   * ==========================================
   * Completion Trend
   * ==========================================
   */

  const completionData =
    createCompletionTrend(tasks);

  /*
   * ==========================================
   * Sprint Velocity
   * ==========================================
   *
   * We group completed tasks by week.
   * Each week represents the current
   * sprint period in this frontend-only app.
   */

  const velocityData =
    createSprintVelocity(tasks);

  /*
   * ==========================================
   * Summary
   * ==========================================
   */

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
    <div className="min-h-full bg-[#090a0c] p-6 text-white">
      {/* Header */}

      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
          Analytics
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Track your sprint performance and
          task progress.
        </p>
      </div>

      {/* Summary */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AnalyticsStat
          title="Total Tasks"
          value={totalTasks}
          icon={<FiList size={19} />}
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
          icon={<FiClock size={19} />}
        />

        <AnalyticsStat
          title="Completion Rate"
          value={`${completionRate}%`}
          icon={
            <FiTrendingUp size={19} />
          }
        />
      </div>

      {/* Charts */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Sprint Velocity */}

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
                stroke="rgba(255,255,255,0.06)"
                vertical={false}
              />

              <XAxis
                dataKey="sprint"
                tick={{
                  fill: "#6b7280",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fill: "#6b7280",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  background:
                    "#15181c",
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  color: "#fff",
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

        {/* Task Status */}

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
                    "#15181c",
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />

              <Legend
                wrapperStyle={{
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Priority Breakdown */}

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
                stroke="rgba(255,255,255,0.06)"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                tick={{
                  fill: "#6b7280",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fill: "#6b7280",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  background:
                    "#15181c",
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                }}
              />

              <Legend />

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

        {/* Completion Trend */}

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
                stroke="rgba(255,255,255,0.06)"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                tick={{
                  fill: "#6b7280",
                  fontSize: 10,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fill: "#6b7280",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  background:
                    "#15181c",
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
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

/*
 * ==========================================
 * Helper: Priority count
 * ==========================================
 */

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

/*
 * ==========================================
 * Completion trend
 * ==========================================
 */

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

/*
 * ==========================================
 * Sprint velocity
 * ==========================================
 */

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

    /*
     * Use the ISO week as the sprint
     * period for this frontend-only board.
     */
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

/*
 * ==========================================
 * Chart card
 * ==========================================
 */

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
    <div className="min-w-0 rounded-xl border border-white/[0.06] bg-[#0d0f12] p-5">
      <div className="mb-5">
        <h2 className="text-sm font-semibold">
          {title}
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          {description}
        </p>
      </div>

      <div className="h-[280px] w-full min-w-0">
        {children}
      </div>
    </div>
  );
}

/*
 * ==========================================
 * Analytics stat
 * ==========================================
 */

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
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0f12] p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
        {icon}
      </div>

      <p className="mt-4 text-xs text-gray-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-semibold">
        {value}
      </p>
    </div>
  );
}

export default Analytics;