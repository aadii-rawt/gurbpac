import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import {
  useNotificationPolling,
} from "../hooks/useNotificationPolling";

function Layout() {
  useNotificationPolling();
  return (
   <div className="flex h-screen overflow-hidden bg-[#090a0c] text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Right side */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Only this area scrolls */}
        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;