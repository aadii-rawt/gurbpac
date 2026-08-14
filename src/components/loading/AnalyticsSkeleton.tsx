function AnalyticsSkeleton() {
  return (
    <div className=" space-y-6 p-6 bg-white dark:bg-black h-full">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-7 w-36 rounded-md bg-gray-200 dark:bg-gray-800" />

        <div className="h-4 w-72 rounded-md bg-gray-200 dark:bg-gray-800" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sprint Velocity */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.08] dark:bg-gray-900">
          <div className="mb-6 h-5 w-40 rounded bg-gray-200 dark:bg-gray-800" />

          <div className="flex h-64 items-end gap-4">
            {Array.from({ length: 7 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t bg-gray-200 dark:bg-gray-800"
                  style={{
                    height: `${35 + ((index * 23) % 55)}%`,
                  }}
                />
              )
            )}
          </div>
        </div>

        {/* Task Status */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.08] dark:bg-gray-900">
          <div className="mb-6 h-5 w-32 rounded bg-gray-200 dark:bg-gray-800" />

          <div className="flex h-64 items-center justify-center">
            <div className="h-48 w-48 rounded-full border-[35px] border-gray-200 dark:border-gray-800" />
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.08] dark:bg-gray-900">
          <div className="mb-6 h-5 w-44 rounded bg-gray-200 dark:bg-gray-800" />

          <div className="flex h-64 items-end gap-5">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t bg-gray-200 dark:bg-gray-800"
                  style={{
                    height: `${30 + ((index * 19) % 60)}%`,
                  }}
                />
              )
            )}
          </div>
        </div>

        {/* Completion Trend */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.08] dark:bg-gray-900">
          <div className="mb-6 h-5 w-40 rounded bg-gray-200 dark:bg-gray-800" />

          <div className="relative h-64">
            <div className="absolute left-0 right-0 top-1/4 h-px bg-gray-200 dark:bg-gray-800" />

            <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-200 dark:bg-gray-800" />

            <div className="absolute left-0 right-0 top-3/4 h-px bg-gray-200 dark:bg-gray-800" />

            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200 dark:bg-gray-800" />

            <div className="absolute bottom-1/2 left-0 h-1 w-full rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsSkeleton;