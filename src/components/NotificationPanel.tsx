import {
  FiBell,
  FiCheck,
  FiX,
} from "react-icons/fi";

import {
  useAppStore,
} from "../store/appStore";

function NotificationPanel() {
  const notifications =
    useAppStore(
      (state) => state.notifications
    );

  const markNotificationAsRead =
    useAppStore(
      (state) =>
        state.markNotificationAsRead
    );

  const markAllNotificationsAsRead =
    useAppStore(
      (state) =>
        state.markAllNotificationsAsRead
    );

  const simulateNotification =
    useAppStore(
      (state) =>
        state.simulateNotification
    );

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;

  return (
    <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[360px] max-w-[calc(100vw-24px)] overflow-hidden rounded-xl border border-white/[0.08] bg-[#15181c] shadow-2xl shadow-black/50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-4">
        <div className="flex items-center gap-2">
          <FiBell
            size={16}
            className="text-gray-400"
          />

          <h3 className="text-sm font-semibold">
            Notifications
          </h3>

          {unreadCount > 0 && (
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400">
              {unreadCount} unread
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={
              markAllNotificationsAsRead
            }
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications */}
      <div className="max-h-[420px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.05]">
              <FiBell
                size={18}
                className="text-gray-600"
              />
            </div>

            <p className="text-sm text-gray-400">
              No notifications
            </p>

            <p className="mt-1 text-xs text-gray-600">
              You're all caught up.
            </p>
          </div>
        ) : (
          notifications.map(
            (notification) => (
              <button
                key={notification.id}
                onClick={() =>
                  markNotificationAsRead(
                    notification.id
                  )
                }
                className={`flex w-full gap-3 border-b border-white/[0.05] px-4 py-4 text-left transition hover:bg-white/[0.03] ${
                  notification.read
                    ? ""
                    : "bg-blue-500/[0.03]"
                }`}
              >
                {/* Unread indicator */}
                <div className="pt-1">
                  {!notification.read ? (
                    <span className="block h-2 w-2 rounded-full bg-blue-500" />
                  ) : (
                    <FiCheck
                      size={13}
                      className="text-gray-600"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm ${
                      notification.read
                        ? "text-gray-400"
                        : "font-medium text-gray-200"
                    }`}
                  >
                    {notification.title}
                  </p>

                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
                    {notification.message}
                  </p>

                  <p className="mt-2 text-[10px] text-gray-600">
                    {formatNotificationTime(
                      notification.createdAt
                    )}
                  </p>
                </div>
              </button>
            )
          )
        )}
      </div>

      {/* Development test */}
      <div className="border-t border-white/[0.06] p-3">
        <button
          onClick={simulateNotification}
          className="w-full rounded-lg border border-dashed border-white/[0.08] px-3 py-2 text-xs text-gray-500 transition hover:border-blue-500/30 hover:bg-blue-500/[0.03] hover:text-blue-400"
        >
          Trigger New Notification
        </button>
      </div>
    </div>
  );
}

function formatNotificationTime(
  date: string
) {
  const difference =
    Date.now() -
    new Date(date).getTime();

  const seconds = Math.floor(
    difference / 1000
  );

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(
    seconds / 60
  );

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(
    hours / 24
  );

  return `${days}d ago`;
}

export default NotificationPanel;