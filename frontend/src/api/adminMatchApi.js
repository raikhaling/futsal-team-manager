import axiosClient from "./axiosClient";

const adminMatchApi = {
  getAllMatches() {
    return axiosClient.get("/api/teams/matches");
  },
  getMatchById(id) {
    return axiosClient.get(`/api/matches/${id}`);
  },

  createMatch(matchData) {
    return axiosClient.post("/api/teams/matches", matchData);
  },
  updateMatch(id, matchData) {
    return axiosClient.put(`/api/teams/matches/${id}`, matchData);
  },
  getParticipants(matchId) {
    return axiosClient.get(`/api/teams/matches/${matchId}/participants`);
  },
  addPlayer(matchId, playerId) {
    return axiosClient.post(`/api/teams/matches/${matchId}/participants`, {
      playerId,
    });
  },
  markAttendance(participationId) {
    return axiosClient.patch(
      `/api/teams/matches/participants/${participationId}/attendance`,
    );
  },

  markNoShow(participationId) {
    return axiosClient.patch(
      `/api/teams/matches/participants/${participationId}/no-show`,
    );
  },
};

export default adminMatchApi;
