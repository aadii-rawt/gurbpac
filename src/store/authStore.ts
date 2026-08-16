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
        refreshToken: string,
        rememberMe: boolean
    ) => void;

    setAccessToken: (token: string) => void;

    restoreSession: () => Promise<void>;

    logout: () => void;

    rememberMe: boolean;
    rememberMeExpiry: number | null;

    setRememberMe: (value: boolean) => void;
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
        refreshToken,
        rememberMe
    ) => {
        localStorage.setItem(
            "refreshToken",
            refreshToken
        );

        if (rememberMe) {
            localStorage.setItem(
                "rememberMe",
                "true"
            );

            localStorage.setItem(
                "rememberMeExpiry",
                String(
                    Date.now() +
                    30 * 24 * 60 * 60 * 1000
                )
            );
        } else {
            localStorage.removeItem(
                "rememberMe"
            );

            localStorage.removeItem(
                "rememberMeExpiry"
            );
        }

        set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isInitializing: false,

            rememberMe,

            rememberMeExpiry: rememberMe
                ? Date.now() +
                30 * 24 * 60 * 60 * 1000
                : null,
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

        const rememberMe =
            localStorage.getItem(
                "rememberMe"
            ) === "true";

        const expiry = Number(
            localStorage.getItem(
                "rememberMeExpiry"
            )
        );

        // No refresh token
        if (!refreshToken) {
            set({
                isInitializing: false,
                isAuthenticated: false,
            });

            return;
        }

        // Remember Me expired
        if (
            rememberMe &&
            expiry &&
            Date.now() > expiry
        ) {
            localStorage.removeItem(
                "refreshToken"
            );

            localStorage.removeItem(
                "rememberMe"
            );

            localStorage.removeItem(
                "rememberMeExpiry"
            );

            set({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                isInitializing: false,
                rememberMe: false,
                rememberMeExpiry: null,
            });

            return;
        }

        try {
            // Your existing refresh API call
            const response = await axios.post(
                "https://dummyjson.com/auth/refresh",
                {
                    refreshToken,
                    expiresInMins: 30,
                }
            );

            const data = response.data;

            set({
                accessToken: data.accessToken,

                refreshToken:
                    data.refreshToken ||
                    refreshToken,

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
            "rememberMe"
        );

        localStorage.removeItem(
            "rememberMeExpiry"
        );

        set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isInitializing: false,
            rememberMe: false,
            rememberMeExpiry: null,
        });
    },

    setRememberMe: (value) => {
        if (value) {
            localStorage.setItem(
                "rememberMe",
                "true"
            );
        } else {
            localStorage.removeItem(
                "rememberMe"
            );

            localStorage.removeItem(
                "rememberMeExpiry"
            );
        }

        set({
            rememberMe: value,
            rememberMeExpiry: value
                ? Date.now() +
                30 * 24 * 60 * 60 * 1000
                : null,
        });
    },
    rememberMe:
        localStorage.getItem(
            "rememberMe"
        ) === "true",

    rememberMeExpiry:
        Number(
            localStorage.getItem(
                "rememberMeExpiry"
            )
        ) || null,
});

