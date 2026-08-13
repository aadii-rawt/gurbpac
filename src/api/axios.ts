import axios from "axios";
import { useAppStore } from "../store/appStore";

export const api = axios.create({
    baseURL: "https://dummyjson.com",
    headers: {
        "Content-Type": "application/json",
    },
});

/*
 * Attach access token to every API request
 */
api.interceptors.request.use((config) => {
    const accessToken = useAppStore.getState().accessToken;

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

/*
 * Handle expired access token
 *
 * 401
 *   ↓
 * Refresh token
 *   ↓
 * New access token
 *   ↓
 * Retry original request
 */
api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        // Only handle 401 responses
        if (
            error.response?.status !== 401 ||
            originalRequest?._retry
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        const refreshToken =
            useAppStore.getState().refreshToken;

        // No refresh token → logout
        if (!refreshToken) {
            useAppStore.getState().logout();

            return Promise.reject(error);
        }

        try {
            /*
             * Refresh access token.
             *
             * Use axios directly here instead of `api`
             * so this request doesn't trigger this interceptor.
             */
            const response = await axios.post(
                "https://dummyjson.com/auth/refresh",
                {
                    refreshToken,
                    expiresInMins: 30,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const newAccessToken =
                response.data.accessToken;

            const newRefreshToken =
                response.data.refreshToken;

            /*
             * Update Zustand + localStorage
             */
            useAppStore
                .getState()
                .setTokens(
                    newAccessToken,
                    newRefreshToken
                );

            /*
             * Add new token to the failed request
             */
            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            /*
             * Retry the original request
             */
            return api(originalRequest);
        } catch (refreshError) {
            /*
             * Refresh token is invalid/expired
             */
            useAppStore.getState().logout();

            return Promise.reject(refreshError);
        }
    }
);