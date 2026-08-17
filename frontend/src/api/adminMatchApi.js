import axiosClient from "./axiosClient";

const adminMatchApi = {
  getAllMatches() {
    return axiosClient.get("/api/admin/matches");
  },
  getMatchById(id) {
    return axiosClient.get(`/api/matches/${id}`);
  },

  createMatch(matchData) {
    return axiosClient.post("/api/admin/matches", matchData);
  },
  updateMatch(id, matchData) {
    return axiosClient.put(`/api/admin/matches/${id}`, matchData);
  },
  getParticipants(matchId) {
    return axiosClient.get(`/api/admin/matches/${matchId}/participants`);
  },
  addPlayer(matchId, playerId) {
    return axiosClient.post(`/api/admin/matches/${matchId}/participants`, {
      playerId,
    });
  },
  markAttendance(participationId) {
    return axiosClient.patch(
      `/api/admin/matches/participants/${participationId}/attendance`,
    );
  },

  markNoShow(participationId) {
    return axiosClient.patch(
      `/api/admin/matches/participants/${participationId}/no-show`,
    );
  },
};

export default adminMatchApi;
