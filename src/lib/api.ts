import axios from "axios";

const api = axios.create({
  baseURL: "https://blog-app-server-oyzn.onrender.com/api",
  withCredentials: true // Needed for refresh token cookie
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value: string | null) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      isRefreshing = true;
      try {
        const res = await api.post("/auth/refresh", {
          withCredentials: true
        });
        const newToken = res.data.accessToken;

        localStorage.setItem("accessToken", newToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        processQueue(null, newToken);

        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(
          refreshErr instanceof Error
            ? refreshErr
            : new Error(String(refreshErr)),
          null
        );
        return Promise.reject(
          refreshErr instanceof Error
            ? refreshErr
            : new Error(String(refreshErr))
        );
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err instanceof Error ? err : new Error(String(err)));
  }
);

export default api;
