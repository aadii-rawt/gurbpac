import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiColumns,
  FiBarChart2,
} from "react-icons/fi";
import React from "react";

const Sidebar = React.memo(() => {
  const navLinkClass = ({
    isActive,
  }: {
    isActive: boolean;
  }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? `
          bg-blue-500/10
          text-blue-600
          dark:bg-blue-600/10
          dark:text-blue-400
        `
        : `
          text-gray-600
          hover:bg-gray-100
          hover:text-gray-900

          dark:text-gray-400
          dark:hover:bg-white/[0.05]
          dark:hover:text-white
        `
    }`;

  return (
    <aside
      className="
        sticky
        flex
        h-screen
        w-64
        flex-col
        border-r
        border-gray-200
        bg-white
        p-4
        text-gray-900
        transition-colors
        duration-200

        dark:border-white/[0.08]
        dark:bg-[#0d0f12]
        dark:text-white
      "
    >
      {/* Logo */}
      <div className="mb-10 flex items-center gap-3 px-2">
        <h1
          className="
            text-xl
            font-bold
            italic
            uppercase
            tracking-tight
            text-gray-900
            dark:text-white
          "
        >
          SPRINTDESK
        </h1>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        <NavLink
          to="/"
          className={navLinkClass}
        >
          <FiHome size={18} />

          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/board"
          className={navLinkClass}
        >
          <FiColumns size={18} />

          <span>Sprint Board</span>
        </NavLink>

        <NavLink
          to="/analytics"
          className={navLinkClass}
        >
          <FiBarChart2 size={18} />

          <span>Analytics</span>
        </NavLink>
      </nav>
    </aside>
  );
});

export default Sidebar;
