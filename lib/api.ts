import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

export const getAccessToken = () => localStorage.getItem("accessToken");
export const setAccessToken = (accessToken: string) =>
  localStorage.setItem("accessToken", accessToken);
export const clearAccessToken = () => localStorage.removeItem("accessToken");

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (
      error.response?.status === 401 &&
      !error.config._retried &&
      !error.config.url.includes("/auth/refresh")
    ) {
      error.config._retried = true;
      try {
        const res = await api.post("/auth/refresh");
        const newAccessToken = res.data.accessToken;
        setAccessToken(newAccessToken);
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(error.config);
      } catch (refreshError) {
        clearAccessToken();
        console.error("Refresh failed", refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
