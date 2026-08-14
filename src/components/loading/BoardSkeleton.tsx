function BoardSkeleton() {
  return (
    <div className=" space-y-6 p-6 bg-white dark:bg-black">
      {/* Board header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-36 rounded-md bg-gray-200 dark:bg-[#28282B] animate-pulse" />

          <div className="h-4 w-60 rounded-md bg-gray-200 dark:bg-[#28282B] animate-pulse" />
        </div>

        <div className="h-10 w-28 rounded-lg bg-gray-200 dark:bg-[#28282B] animate-pulse" />
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="h-9 w-36 rounded-lg bg-gray-200 dark:bg-[#28282B] animate-pulse" />

        <div className="h-9 w-36 rounded-lg bg-gray-200 dark:bg-[#28282B] animate-pulse" />
      </div>

      {/* Columns */}
      <div className="grid min-w-[1000px] grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map(
          (_, columnIndex) => (
            <div
              key={columnIndex}
              className="min-h-[500px] rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/[0.08] dark:bg-[#181818]/50"
            >
              {/* Column header */}
              <div className="mb-5 flex items-center justify-between">
                <div className="h-5 w-24 rounded bg-gray-200 dark:bg-[#28282B] animate-pulse" />

                <div className="h-5 w-7 rounded-full bg-gray-200 dark:bg-[#28282B] animate-pulse" />
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {Array.from({
                  length:
                    columnIndex === 0
                      ? 4
                      : columnIndex === 1
                        ? 3
                        : columnIndex === 2
                          ? 2
                          : 3,
                }).map((_, taskIndex) => (
                  <div
                    key={taskIndex}
                    className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.08] dark:bg-[#181818]"
                  >
                    <div className="h-4 w-full rounded bg-gray-200 dark:bg-[#28282B] animate-pulse" />

                    <div className="mt-2 h-3 w-3/4 rounded bg-gray-200 dark:bg-[#28282B] animate-pulse" />

                    <div className="mt-4 flex items-center justify-between">
                      <div className="h-5 w-14 rounded-full bg-gray-200 dark:bg-[#28282B] animate-pulse" />

                      <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-[#28282B] animate-pulse" />
                    </div>

                    <div className="mt-4 h-3 w-20 rounded bg-gray-200 dark:bg-[#28282B] animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default BoardSkeleton;