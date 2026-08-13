import { useEffect } from "react";

import {
  useAppStore,
} from "../store/appStore";

type Post = {
  id: number;
  title: string;
  body: string;
};

const POLLING_INTERVAL = 15000;

const API_URL =
  "https://jsonplaceholder.typicode.com/posts?_limit=5";

export function useNotificationPolling() {
  const seenPostIds = useAppStore(
    (state) => state.seenPostIds
  );

  const addNotifications =
    useAppStore(
      (state) => state.addNotifications
    );

  const setSeenPostIds =
    useAppStore(
      (state) => state.setSeenPostIds
    );

  useEffect(() => {
    let intervalId: number | null =
      null;

    let isPolling = false;

    const poll = async () => {
      // Don't poll when tab is hidden
      if (document.hidden) {
        return;
      }

      // Prevent overlapping requests
      if (isPolling) {
        return;
      }

      isPolling = true;

      try {
        const response = await fetch(
          API_URL
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch notifications"
          );
        }

        const posts: Post[] =
          await response.json();

        const currentSeenIds =
          useAppStore.getState()
            .seenPostIds;

        /*
         * First poll:
         *
         * Establish baseline.
         * Don't create notifications
         * for existing posts.
         */
        if (
          currentSeenIds.length === 0
        ) {
          const ids = posts.map(
            (post) => post.id
          );

          setSeenPostIds(ids);

          return;
        }

        /*
         * Find posts that we haven't
         * seen before.
         */
        const newPosts = posts.filter(
          (post) =>
            !currentSeenIds.includes(
              post.id
            )
        );

        if (newPosts.length === 0) {
          return;
        }

        /*
         * Convert posts into
         * notifications.
         */
        const notifications =
          newPosts.map((post) => ({
            id: `post-${post.id}`,

            postId: post.id,

            title:
              "New post received",

            message: post.title,

            read: false,

            createdAt:
              new Date().toISOString(),
          }));

        /*
         * Update seen IDs.
         */
        const updatedSeenIds = [
          ...currentSeenIds,
          ...newPosts.map(
            (post) => post.id
          ),
        ];

        setSeenPostIds(
          updatedSeenIds
        );

        /*
         * Add notifications.
         */
        addNotifications(
          notifications
        );
      } catch (error) {
        console.error(
          "Notification polling failed:",
          error
        );
      } finally {
        isPolling = false;
      }
    };

    const startPolling = () => {
      if (document.hidden) {
        return;
      }

      // Immediately check when
      // polling starts/resumes.
      poll();

      intervalId = window.setInterval(
        poll,
        POLLING_INTERVAL
      );
    };

    const stopPolling = () => {
      if (intervalId !== null) {
        window.clearInterval(
          intervalId
        );

        intervalId = null;
      }
    };

    const handleVisibilityChange =
      () => {
        if (document.hidden) {
          /*
           * Tab hidden
           * → stop polling
           */
          stopPolling();
        } else {
          /*
           * Tab visible
           * → resume polling
           */
          stopPolling();

          startPolling();
        }
      };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    startPolling();

    return () => {
      stopPolling();

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [
    addNotifications,
    setSeenPostIds,
  ]);
}