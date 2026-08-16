import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/appStore";
import NotificationPanel from "../components/NotificationPanel";
import {
  FiBell,
  FiX,
  FiMoon,
  FiSun,
  FiMenu,
} from "react-icons/fi";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = React.memo(({ onMenuClick }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  /*
   * Theme
   *
   * true  = dark
   * false = light
   */
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
      return false;
    }

    // Dark is the default theme
    return true;
  });

  /*
   * Apply theme to <html>
   */
  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const getPageTitle = () => {
    const pathname = location.pathname;

    if (pathname === "/") {
      return "Dashboard";
    }

    if (pathname === "/board") {
      return "Board";
    }

    if (pathname === "/analytics") {
      return "Analytics";
    }

    const routeName = pathname
      .split("/")
      .filter(Boolean)[0];

    if (!routeName) {
      return "Dashboard";
    }

    return routeName
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const pageTitle = getPageTitle();

  const firstName = user?.firstName || "User";
  const lastName = user?.lastName || "";

  const fullName = `${firstName} ${lastName}`.trim();

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const handleLogout = () => {
    setIsProfileOpen(false);

    logout();

    navigate("/login", {
      replace: true,
    });
  };

  const notifications = useAppStore(
    (state) => state.notifications
  );

  const isNotificationPanelOpen = useAppStore(
    (state) => state.isNotificationPanelOpen
  );

  const setNotificationPanelOpen = useAppStore(
    (state) => state.setNotificationPanelOpen
  );

  const notificationToast = useAppStore(
    (state) => state.notificationToast
  );

  const clearNotificationToast = useAppStore(
    (state) => state.clearNotificationToast
  );

  const unreadCount = notifications.filter(
    (notification: any) => !notification.read
  ).length;

  /*
   * Close notification panel when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationPanelOpen(false);
      }
    };

    if (isNotificationPanelOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    isNotificationPanelOpen,
    setNotificationPanelOpen,
  ]);

  /*
   * Close profile dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <header
      className="
        relative flex h-[72px] items-center justify-between
        border-b
        border-gray-200
        bg-white
        px-6
        text-gray-900
        transition-colors
        duration-200
        dark:border-white/[0.06]
        dark:bg-[#0d0f12]
        dark:text-white
      "
    >
      {/* Left side */}
      <div className="flex min-w-0 items-center gap-3">
        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="
      flex h-9 w-9
      shrink-0
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
          <FiMenu size={22} />
        </button>

        {/* Page title */}
        <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
          {pageTitle}
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">

        {/* Notification */}
        <div
          ref={notificationRef}
          className="relative"
        >
          <button
            type="button"
            aria-label="Notifications"
            onClick={() =>
              setNotificationPanelOpen(!isNotificationPanelOpen)
            }
            className="
              relative flex h-9 w-9 items-center justify-center
              rounded-lg
              text-gray-500
              transition
              hover:bg-gray-100
              hover:text-gray-900
              dark:text-gray-400
              dark:hover:bg-white/[0.05]
              dark:hover:text-white
            "
          >
            <FiBell size={20} />

            {unreadCount > 0 && (
              <span
                className="
                  absolute -right-0.5 -top-0.5
                  flex min-h-[16px] min-w-[16px]
                  items-center justify-center
                  rounded-full
                  bg-red-500
                  px-1
                  text-[9px]
                  font-bold
                  text-white
                "
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {isNotificationPanelOpen && (
            <NotificationPanel />
          )}
        </div>

        {/* Profile */}
        <div
          ref={profileRef}
          className="relative"
        >
          <button
            type="button"
            onClick={() =>
              setIsProfileOpen((previous) => !previous)
            }
            className="
              flex items-center gap-3
              rounded-xl
              px-2 py-1.5
              transition
              hover:bg-gray-100
              dark:hover:bg-white/[0.05]
            "
          >
            {/* Avatar */}
            {user?.image ? (
              <img
                src={user.image}
                alt={fullName}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-full
                  bg-orange-500
                  text-sm
                  font-semibold
                  text-white
                "
              >
                {initials}
              </div>
            )}

            {/* Name */}
            <div className="hidden text-left sm:block">
              <p
                className="
                  text-sm font-medium
                  text-gray-900
                  dark:text-gray-200
                "
              >
                {fullName}
              </p>

              <p
                className="
                  text-xs
                  text-gray-500
                  dark:text-gray-500
                "
              >
                {user?.email || "User"}
              </p>
            </div>

            {/* Chevron */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`
                text-gray-400
                dark:text-gray-500
                transition-transform
                ${isProfileOpen ? "rotate-180" : ""}
              `}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {/* Dropdown */}
          {isProfileOpen && (
            <div
              className="
                absolute right-0 top-[calc(100%+10px)]
                z-50 w-60 overflow-hidden
                rounded-xl
                border
                border-gray-200
                bg-white
                p-1.5
                shadow-xl
                shadow-gray-300/30

                dark:border-white/[0.08]
                dark:bg-[#15181c]
                dark:shadow-2xl
                dark:shadow-black/40
              "
            >
              {/* User info */}
              <div
                className="
                  border-b
                  border-gray-200
                  px-3 py-3
                  dark:border-white/[0.06]
                "
              >
                <div className="flex items-center gap-3">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={fullName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="
                        flex h-10 w-10
                        items-center justify-center
                        rounded-full
                        bg-orange-500
                        text-sm
                        font-semibold
                        text-white
                      "
                    >
                      {initials}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p
                      className="
                        truncate text-sm font-medium
                        text-gray-900
                        dark:text-white
                      "
                    >
                      {fullName}
                    </p>

                    <p
                      className="
                        truncate text-xs
                        text-gray-500
                        dark:text-gray-500
                      "
                    >
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Theme toggle */}
              <div className="my-1.5" />

              <button
                type="button"
                onClick={() => setDarkMode((prev) => !prev)}
                className="
                  flex w-full items-center justify-between
                  rounded-lg
                  px-3 py-2
                  text-sm
                  text-gray-700
                  transition
                  hover:bg-gray-100

                  dark:text-gray-300
                  dark:hover:bg-white/[0.05]
                "
              >
                <div className="flex items-center gap-3">
                  {darkMode ? (
                    <FiMoon size={16} />
                  ) : (
                    <FiSun size={16} />
                  )}

                  <span>
                    {darkMode ? "Dark Mode" : "Light Mode"}
                  </span>
                </div>

                {/* Switch */}
                <div
                  className={`
                    relative h-5 w-9
                    rounded-full
                    transition-colors
                    ${darkMode
                      ? "bg-blue-500"
                      : "bg-gray-300 dark:bg-gray-600"
                    }
                  `}
                >
                  <span
                    className={`
                      absolute top-0.5
                      h-4 w-4
                      rounded-full
                      bg-white
                      shadow-sm
                      transition-transform
                      ${darkMode
                        ? "-translate-x-4"
                        : "translate-x-0.5"
                      }
                    `}
                  />
                </div>
              </button>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="
                  flex w-full items-center gap-3
                  rounded-lg
                  px-3 py-2.5
                  text-sm
                  text-red-500
                  transition
                  hover:bg-red-500/10
                  hover:text-red-600

                  dark:text-red-400
                  dark:hover:bg-red-500/10
                  dark:hover:text-red-300
                "
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M10 17l5-5-5-5" />
                  <path d="M15 12H3" />
                  <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
                </svg>

                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      {notificationToast && !isNotificationPanelOpen && (
        <div
          className="
            fixed right-6 top-[88px]
            z-[100] w-[320px]
            rounded-xl
            border
            border-gray-200
            bg-white
            p-4
            shadow-xl
            shadow-gray-300/30

            dark:border-white/[0.08]
            dark:bg-[#15181c]
            dark:shadow-2xl
            dark:shadow-black/40
          "
        >
          <div className="flex items-start gap-3">
            <div
              className="
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-lg
                bg-blue-500/10
                text-blue-500
                dark:text-blue-400
              "
            >
              <FiBell size={17} />
            </div>

            <div className="min-w-0 flex-1">
              <p
                className="
                  text-sm font-medium
                  text-gray-900
                  dark:text-white
                "
              >
                New notification
              </p>

              <p
                className="
                  mt-1 text-xs
                  text-gray-500
                  dark:text-gray-500
                "
              >
                {notificationToast}
              </p>
            </div>

            <button
              onClick={clearNotificationToast}
              className="
                text-gray-400
                hover:text-gray-700
                dark:text-gray-600
                dark:hover:text-white
              "
            >
              <FiX size={15} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
});

export default Header;
