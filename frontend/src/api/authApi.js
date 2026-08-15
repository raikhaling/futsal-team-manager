import axiosClient from "./axiosClient";

const authApi = {
  login(credentials) {
    return axiosClient.post("/api/auth/login", credentials);
  },

  register(playerData) {
    return axiosClient.post("/api/auth/register", playerData);
  },

  getCurrentPlayer() {
    return axiosClient.get("/api/player/me");
  },

  logout() {
    return axiosClient.post("/api/auth/logout");
  },

  updateProfile(profile) {
    return axiosClient.put("/api/player/me", profile);
  },

  changePassword(passwordData) {
    return axiosClient.put("/api/player/me/password", passwordData);
  },
};

export default authApi;
