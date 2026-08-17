import axiosClient from "./axiosClient";

const playerMatchApi = {
  getMatches() {
    return axiosClient.get("/api/player/matches");
  },

  joinMatch(matchId) {
    return axiosClient.post(`/api/player/matches/${matchId}/join`);
  },

  leaveMatch(matchId) {
    return axiosClient.delete(`/api/player/matches/${matchId}/leave`);
  },

  getMyParticipation(matchId) {
    return axiosClient.get(`/api/player/matches/${matchId}/participation`);
  },
  getMatchParticipants(matchId) {
    return axiosClient.get(`/api/player/matches/${matchId}/participants`);
  },
};

export default playerMatchApi;
