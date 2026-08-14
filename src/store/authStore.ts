import type { StateCreator } from "zustand";
import type { User } from "../types/user";

export type AuthSlice = {
    user: User | null;

    accessToken: string | null;

    refreshToken: string | null;

    isAuthenticated: boolean;

    isInitializing: boolean;

    setAuth: (
        user: User,
        accessToken: string,
        refreshToken: string
    ) => void;

    setAccessToken: (token: string) => void;

    restoreSession: () => Promise<void>;

    logout: () => void;
}

export const createAuthSlice: StateCreator<
    AuthSlice
> = (set) => ({
    user: null,
    accessToken: null,
    refreshToken: localStorage.getItem(
        "refreshToken"
    ),
    isAuthenticated: false,
    isInitializing: true,
    setAuth: (
        user,
        accessToken,
        refreshToken
    ) => {

        set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
        });
    },
    setAccessToken: (token) => {
        set({
            accessToken: token,
            isAuthenticated: true,
        });
    },
    restoreSession: async () => {
        const refreshToken =
            localStorage.getItem(
                "refreshToken"
            );
        // No refresh token 
        if (!refreshToken) {
            set({
                isInitializing: false,
            });

            return;
        }

        try {
            
            const response = await fetch(
                "https://dummyjson.com/auth/refresh",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        refreshToken,
                        expiresInMins: 30,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Refresh token expired"
                );
            }

            const data = await response.json();

            localStorage.setItem(
                "refreshToken",
                data.refreshToken
            );
            const userResponse = await fetch(
                "https://dummyjson.com/auth/me",
                {
                    headers: {
                        Authorization: `Bearer ${data.accessToken}`,
                    },
                }
            );

            if (!userResponse.ok) {
                throw new Error(
                    "Unable to restore session"
                );
            }

            const user = await userResponse.json();

            set({
                user,
                accessToken: data.accessToken,

                // New refresh token.
                refreshToken: data.refreshToken,

                isAuthenticated: true,

                isInitializing: false,
            });
        } catch (error) {
            console.error(
                "Session restoration failed:",
                error
            );
            localStorage.removeItem(
                "refreshToken"
            );

            set({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                isInitializing: false,
            });
        }
    },
    setTokens: (
        accessToken: string,
        refreshToken: string
    ) => {
        localStorage.setItem(
            "refreshToken",
            refreshToken
        );

        set({
            accessToken,
            refreshToken,
            isAuthenticated: true,
        });
    },
    logout: () => {
        localStorage.removeItem(
            "refreshToken"
        );
        localStorage.removeItem(
            "sprintdesk_seen_post_ids"
        );
        localStorage.removeItem(
            "sprintdesk_tasks"
        );

        set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
        });
    },
});

