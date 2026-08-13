import React from "react";

const StatCard = React.memo(({
  title,
  value,
  icon,
  iconClass,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
})  => {
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
})

export default StatCard