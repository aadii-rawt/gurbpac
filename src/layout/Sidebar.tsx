import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiColumns,
  FiBarChart2,
} from "react-icons/fi";

function Sidebar() {
  return (
    <aside className="flex sticky h-screen w-64 flex-col border-r border-white/20 bg-[#0d0f12] p-4 text-white">
      {/* Logo */}
      <div className="mb-10 flex items-center gap-3 px-2">
      

        <h1 className="text-xl font-bold italic upppercase ">
          SPRINTDESK
        </h1>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? "bg-blue-600/10 text-blue-400"
                : "text-gray-400 hover:bg-white/[0.05] hover:text-white"
            }`
          }
        >
          <FiHome size={18} />

          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/board"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? "bg-blue-600/10 text-blue-400"
                : "text-gray-400 hover:bg-white/[0.05] hover:text-white"
            }`
          }
        >
          <FiColumns size={18} />

          <span>Sprint Board</span>
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? "bg-blue-600/10 text-blue-400"
                : "text-gray-400 hover:bg-white/[0.05] hover:text-white"
            }`
          }
        >
          <FiBarChart2 size={18} />

          <span>Analytics</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;