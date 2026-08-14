import React from "react";

const StatCard = React.memo(
  ({
    title,
    value,
    icon,
    iconClass,
  }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    iconClass: string;
  }) => {
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
          duration-200

          dark:border-white/[0.06]
          dark:bg-[#0d0f12]
          dark:shadow-none
        "
      >
        <div className="flex items-center justify-between">
          <div
            className={`
              flex h-10 w-10
              items-center justify-center
              rounded-lg
              ${iconClass}
            `}
          >
            {icon}
          </div>
        </div>

        <div className="mt-5">
          <p
            className="
              text-xs
              text-gray-500
              dark:text-gray-500
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
      </div>
    );
  }
);

export default StatCard;
