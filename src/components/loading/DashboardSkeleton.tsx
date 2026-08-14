function DashboardSkeleton() {
  return (
    <div className=" space-y-6 p-6 bg-white dark:bg-black h-full">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-7 w-40 rounded-md bg-gray-200 dark:bg-[#28282B] animate-pulse" />

        <div className="h-4 w-64 rounded-md bg-gray-200 dark:bg-[#28282B] animate-pulse" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.08] dark:bg-[#181818]"
          >
            <div className="mb-4 h-4 w-24 rounded bg-gray-200 dark:bg-[#28282B] animate-pulse" />

            <div className="h-8 w-16 rounded bg-gray-200 dark:bg-[#28282B] animate-pulse" />

            <div className="mt-3 h-3 w-32 rounded bg-gray-200 dark:bg-[#28282B] animate-pulse" />
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.08] dark:bg-[#181818]">
          <div className="mb-6 h-5 w-36 rounded bg-gray-200 dark:bg-[#28282B] animate-pulse" />

          <div className="flex h-64 items-end gap-3">
            {Array.from({ length: 8 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t bg-gray-200 dark:bg-[#28282B] animate-pulse"
                  style={{
                    height: `${40 + ((index * 17) % 50)}%`,
                  }}
                />
              )
            )}
          </div>
        </div>

        {/* Recent tasks */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.08] dark:bg-[#181818]">
          <div className="mb-6 h-5 w-40 rounded bg-gray-200 dark:bg-[#28282B] animate-pulse" />

          <div className="space-y-4">
            {Array.from({ length: 5 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3"
                >
                  <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-[#28282B] animate-pulse" />

                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-[#28282B] animate-pulse" />

                    <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-[#28282B] animate-pulse" />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardSkeleton;