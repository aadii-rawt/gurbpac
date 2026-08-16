import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiColumns,
  FiBarChart2,
  FiX,
} from "react-icons/fi";
import React from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = React.memo(
  ({ isOpen, onClose }: SidebarProps) => {
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
      <>
        {/* Mobile backdrop */}
        {isOpen && (
          <div
            className="
              fixed inset-0 z-40
              bg-black/50
              backdrop-blur-[2px]
              md:hidden
            "
            onClick={onClose}
          />
        )}

        <aside
          className={`
            fixed left-0 top-0 z-50
            flex h-screen w-64
            flex-col
            border-r
            border-gray-200
            bg-white
            p-4
            text-gray-900
            shadow-xl
            transition-transform
            duration-300
            ease-in-out

            dark:border-white/[0.08]
            dark:bg-[#0d0f12]
            dark:text-white
            dark:shadow-black/40

            ${
              isOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }

            md:static
            md:z-auto
            md:translate-x-0
            md:shadow-none
          `}
        >
          {/* Logo */}
          <div className="mb-10 flex items-center justify-between px-2">
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

            {/* Mobile close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="
                flex h-9 w-9
                items-center justify-center
                rounded-lg
                text-gray-500
                transition
                hover:bg-gray-100
                hover:text-gray-900

                dark:text-gray-400
                dark:hover:bg-white/[0.05]
                dark:hover:text-white

                md:hidden
              "
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <NavLink
              to="/"
              className={navLinkClass}
              onClick={onClose}
            >
              <FiHome size={18} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/board"
              className={navLinkClass}
              onClick={onClose}
            >
              <FiColumns size={18} />
              <span>Sprint Board</span>
            </NavLink>

            <NavLink
              to="/analytics"
              className={navLinkClass}
              onClick={onClose}
            >
              <FiBarChart2 size={18} />
              <span>Analytics</span>
            </NavLink>
          </nav>
        </aside>
      </>
    );
  }
);

export default Sidebar;