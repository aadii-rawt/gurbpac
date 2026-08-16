import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import {
  useNotificationPolling,
} from "../hooks/useNotificationPolling";
import React, { useState } from "react";

const Layout = React.memo(() => {
  useNotificationPolling();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#090a0c] text-white">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          onMenuClick={toggleSidebar}
        />

        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
});

export default Layout;