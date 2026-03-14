import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URI,
    withCredentials: true,
});

let isRefreshing = false;
// We must store both resolve and reject to prevent hanging promises
let refreshSubscribers: { resolve: Function; reject: Function }[] = [];

// Handle logout to prevent infinite loops
const handleLogout = () => {
    if (window.location.pathname !== "/login") {
        window.location.href = "/login"
    }
}

// Handle adding a new access token to queued requests
// const subscriberTokenRefresh = (callback: () => void) => {
//     refreshSubscribers.push(callback);
// }

// Execute queued requests after refresh
const onRefreshSuccess = () => {
    refreshSubscribers.forEach(({ resolve }) => resolve());
    refreshSubscribers = [];
};

const onRefreshFailure = (error: any) => {
    // FIX 2: Explicitly reject all queued requests so React Query can stop loading
    refreshSubscribers.forEach(({ reject }) => reject(error));
    refreshSubscribers = [];
};

// Handle API requests
axiosInstance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

// Handle expired tokens and refresh logic
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Queue this request and WAIT for the ongoing refresh to finish
                return new Promise((resolve, reject) => {
                    refreshSubscribers.push({
                        resolve: () => resolve(axiosInstance(originalRequest)),
                        reject: (err: any) => reject(err), // Pass the rejection down!
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true; // FIX 3: Actually lock the state!

            try {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_SERVER_URI}/api/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                isRefreshing = false;
                onRefreshSuccess();

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                onRefreshFailure(refreshError); // Reject all queued promises

                // FIX 4: Do NOT force a redirect if we were just checking the auth status.
                // If we redirect here, guests can never view the home page!
                if (!originalRequest.url?.includes("/api/logged-in-user")) {
                    handleLogout();
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;