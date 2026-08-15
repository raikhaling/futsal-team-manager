import axiosClient from "./axiosClient";

const adminPlayerApi = {
  getAllPlayers(page = 0, size = 10) {
    return axiosClient.get("/api/admin/players", {
      params: {
        page,
        size,
      },
    });
  },
};

export default adminPlayerApi;
