import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/appStore";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  /*
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target as Node
        )
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /*
   * Get page title from URL
   */
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

    /*
     * Fallback for future routes.
     *
     * /settings → Settings
     * /profile → Profile
     */
    const routeName = pathname
      .split("/")
      .filter(Boolean)[0];

    if (!routeName) {
      return "Dashboard";
    }

    return routeName
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  const pageTitle = getPageTitle();

  const firstName =
    user?.firstName || "User";

  const lastName =
    user?.lastName || "";

  const fullName =
    `${firstName} ${lastName}`.trim();

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`
      .toUpperCase();

  const handleLogout = () => {
    setIsProfileOpen(false);

    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <header className="relative flex h-[72px] items-center justify-between border-b border-white/[0.06] bg-[#0d0f12] px-6 text-white">
      {/* Page title */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          {pageTitle}
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">
        {/* Notification */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/[0.05] hover:text-white"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>

          {/* Notification dot */}
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange-500" />
        </button>

        {/* Profile */}
        <div
          ref={profileRef}
          className="relative"
        >
          <button
            type="button"
            onClick={() =>
              setIsProfileOpen(
                (previous) => !previous
              )
            }
            className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-white/[0.05]"
          >
            {/* Avatar */}
            {user?.image ? (
              <img
                src={user.image}
                alt={fullName}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-sm font-semibold text-white">
                {initials}
              </div>
            )}

            {/* Name */}
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium text-gray-200">
                {fullName}
              </p>

              <p className="text-xs text-gray-500">
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
              className={`text-gray-500 transition-transform ${
                isProfileOpen
                  ? "rotate-180"
                  : ""
              }`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {/* Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-60 overflow-hidden rounded-xl border border-white/[0.08] bg-[#15181c] p-1.5 shadow-2xl shadow-black/40">
              {/* User info */}
              <div className="border-b border-white/[0.06] px-3 py-3">
                <div className="flex items-center gap-3">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={fullName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-sm font-semibold">
                      {initials}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {fullName}
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile */}
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate("/profile");
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-300 transition hover:bg-white/[0.05] hover:text-white"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21a8 8 0 0 1 16 0" />
                </svg>

                Profile
              </button>

              {/* Settings */}
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate("/settings");
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-300 transition hover:bg-white/[0.05] hover:text-white"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.5 1.5-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2.12v-.4a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.5-1.5.06-.06A1.7 1.7 0 0 0 9.14 15a1.7 1.7 0 0 0-1.56-1.03H7.2v-2.12h.38A1.7 1.7 0 0 0 9.14 10a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.5-1.5.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.56V5h2.12v.4a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.5 1.5-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.56 1.03h.04v2.12h-.04A1.7 1.7 0 0 0 19.4 15Z" />
                </svg>

                Settings
              </button>

              {/* Divider */}
              <div className="my-1.5 border-t border-white/[0.06]" />

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
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
    </header>
  );
}

export default Header;