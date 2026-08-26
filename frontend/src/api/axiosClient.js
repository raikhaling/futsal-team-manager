import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  const selectedTeamId = localStorage.getItem("futsal.selectedTeamId");

  if (selectedTeamId) {
    config.headers["X-Team-Id"] = selectedTeamId;
  }

  return config;
});

export default axiosClient;
