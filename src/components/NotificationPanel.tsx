import {
  FiBell,
  FiCheck,
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
    <div
      className="
        absolute right-0 top-[calc(100%+10px)]
        z-50
        w-[360px]
        max-w-[calc(100vw-24px)]
        overflow-hidden
        rounded-xl
        border
        border-gray-200
        bg-white
        text-gray-900
        shadow-xl
        shadow-gray-300/30

        dark:border-white/[0.08]
        dark:bg-[#15181c]
        dark:text-white
        dark:shadow-2xl
        dark:shadow-black/50
      "
    >
      {/* Header */}
      <div
        className="
          flex items-center justify-between
          border-b
          border-gray-200
          px-4 py-4
          dark:border-white/[0.06]
        "
      >
        <div className="flex items-center gap-2">
          <FiBell
            size={16}
            className="
              text-gray-500
              dark:text-gray-400
            "
          />

          <h3
            className="
              text-sm font-semibold
              text-gray-900
              dark:text-white
            "
          >
            Notifications
          </h3>

          {unreadCount > 0 && (
            <span
              className="
                rounded-full
                bg-blue-500/10
                px-2 py-0.5
                text-[10px]
                font-medium
                text-blue-600
                dark:text-blue-400
              "
            >
              {unreadCount} unread
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={
              markAllNotificationsAsRead
            }
            className="
              text-xs
              text-blue-600
              hover:text-blue-700
              dark:text-blue-400
              dark:hover:text-blue-300
            "
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications */}
      <div className="max-h-[420px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div
            className="
              flex flex-col
              items-center
              justify-center
              px-6 py-12
              text-center
            "
          >
            <div
              className="
                mb-3
                flex h-10 w-10
                items-center justify-center
                rounded-full
                bg-gray-100
                dark:bg-white/[0.05]
              "
            >
              <FiBell
                size={18}
                className="
                  text-gray-400
                  dark:text-gray-600
                "
              />
            </div>

            <p
              className="
                text-sm
                text-gray-600
                dark:text-gray-400
              "
            >
              No notifications
            </p>

            <p
              className="
                mt-1 text-xs
                text-gray-400
                dark:text-gray-600
              "
            >
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
                className={`
                  flex w-full gap-3
                  border-b
                  px-4 py-4
                  text-left
                  transition

                  border-gray-100
                  hover:bg-gray-50

                  dark:border-white/[0.05]
                  dark:hover:bg-white/[0.03]

                  ${
                    notification.read
                      ? ""
                      : `
                        bg-blue-50/60
                        dark:bg-blue-500/[0.03]
                      `
                  }
                `}
              >
                {/* Unread indicator */}
                <div className="pt-1">
                  {!notification.read ? (
                    <span
                      className="
                        block h-2 w-2
                        rounded-full
                        bg-blue-500
                      "
                    />
                  ) : (
                    <FiCheck
                      size={13}
                      className="
                        text-gray-400
                        dark:text-gray-600
                      "
                    />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <p
                    className={`
                      text-sm
                      ${
                        notification.read
                          ? `
                            text-gray-500
                            dark:text-gray-400
                          `
                          : `
                            font-medium
                            text-gray-900
                            dark:text-gray-200
                          `
                      }
                    `}
                  >
                    {notification.title}
                  </p>

                  <p
                    className="
                      mt-1
                      line-clamp-2
                      text-xs
                      leading-5
                      text-gray-500
                      dark:text-gray-500
                    "
                  >
                    {notification.message}
                  </p>

                  <p
                    className="
                      mt-2
                      text-[10px]
                      text-gray-400
                      dark:text-gray-600
                    "
                  >
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
      <div
        className="
          border-t
          border-gray-200
          p-3
          dark:border-white/[0.06]
        "
      >
        <button
          onClick={
            simulateNotification
          }
          className="
            w-full
            rounded-lg
            border
            border-dashed
            border-gray-300
            px-3 py-2
            text-xs
            text-gray-500
            transition

            hover:border-blue-400
            hover:bg-blue-50
            hover:text-blue-600

            dark:border-white/[0.08]
            dark:hover:border-blue-500/30
            dark:hover:bg-blue-500/[0.03]
            dark:hover:text-blue-400
          "
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
