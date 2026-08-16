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
  deletePlayer(id) {
    return axiosClient.delete(`/api/admin/players/${id}`);
  },
  getPlayerById(id) {
    return axiosClient.get(`/api/admin/players/${id}`);
  },
  updatePlayer(id, data) {
    return axiosClient.put(`api/admin/players/${id}`, data);
  },
};

export default adminPlayerApi;
