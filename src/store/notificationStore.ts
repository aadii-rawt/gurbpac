import type { StateCreator } from "zustand";


export type NotificationSlice = {
    notifications: Notification[];

    seenPostIds: number[];

    isNotificationPanelOpen: boolean;

    notificationToast: string | null;

    addNotifications: (
        notifications: Notification[]
    ) => void;

    markNotificationAsRead: (
        id: string
    ) => void;

    markAllNotificationsAsRead: () => void;

    setNotificationPanelOpen: (
        open: boolean
    ) => void;
    setSeenPostIds: (
        ids: number[]
    ) => void;

    clearNotificationToast: () => void;

    simulateNotification: () => void;
}

export const createNotificationSlice:
    StateCreator<NotificationSlice> =
    (set, get) => ({
        notifications: JSON.parse(
            localStorage.getItem(
                "sprintdesk_notifications"
            ) || "[]"
        ),

        seenPostIds: JSON.parse(
            localStorage.getItem(
                "sprintdesk_seen_post_ids"
            ) || "[]"
        ),

        isNotificationPanelOpen: false,

        notificationToast: null,

        setSeenPostIds: (ids) => {
            localStorage.setItem(
                "sprintdesk_seen_post_ids",
                JSON.stringify(ids)
            );

            set({
                seenPostIds: ids,
            });
        },

        addNotifications: (
            newNotifications
        ) => {
            const existing =
                get().notifications;

            const notifications = [
                ...newNotifications,
                ...existing,
            ].slice(0, 20);

            localStorage.setItem(
                "sprintdesk_notifications",
                JSON.stringify(notifications)
            );

            set({
                notifications,

                notificationToast:
                    !get()
                        .isNotificationPanelOpen &&
                        newNotifications.length > 0
                        ? `${newNotifications.length} new notification${newNotifications.length > 1
                            ? "s"
                            : ""
                        }`
                        : null,
            });
        },

        markNotificationAsRead: (id) => {
            const notifications =
                get().notifications.map(
                    (notification) =>
                        notification.id === id
                            ? {
                                ...notification,
                                read: true,
                            }
                            : notification
                );

            localStorage.setItem(
                "sprintdesk_notifications",
                JSON.stringify(notifications)
            );

            set({
                notifications,
            });
        },

        markAllNotificationsAsRead: () => {
            const notifications =
                get().notifications.map(
                    (notification) => ({
                        ...notification,
                        read: true,
                    })
                );

            localStorage.setItem(
                "sprintdesk_notifications",
                JSON.stringify(notifications)
            );

            set({
                notifications,
            });
        },

        setNotificationPanelOpen: (
            open
        ) => {
            set({
                isNotificationPanelOpen: open,

                notificationToast: open
                    ? null
                    : get().notificationToast,
            });
        },

        clearNotificationToast: () => {
            set({
                notificationToast: null,
            });
        },

        simulateNotification: () => {
            const seenIds =
                get().seenPostIds;

            const nextId =
                Math.max(0, ...seenIds) + 1;

            const notification: Notification = {
                id: `post-${nextId}`,
                postId: nextId,
                title: "New post received",
                message: `Post ${nextId} has arrived.`,
                read: false,
                createdAt:
                    new Date().toISOString(),
            };

            const newSeenIds = [
                ...seenIds,
                nextId,
            ];

            localStorage.setItem(
                "sprintdesk_seen_post_ids",
                JSON.stringify(newSeenIds)
            );

            set({
                seenPostIds: newSeenIds,
            });

            get().addNotifications([
                notification,
            ]);
        },
    });