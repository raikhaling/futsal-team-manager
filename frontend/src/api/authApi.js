import axiosClient from "./axiosClient";

const authApi = {
  login(credentials) {
    return axiosClient.post("/api/auth/login", credentials);
  },
  getCurrentPlayer() {
    return axiosClient.get("/api/player/me");
  },
};

export default authApi;
