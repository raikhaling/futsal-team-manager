import axiosClient from "./axiosClient";

const playerMatchApi = {
  joinMatch(matchId) {
    return axiosClient.post(`/api/player/matches/${matchId}/participation`);
  },

  leaveMatch(matchId) {
    return axiosClient.delete(`/api/player/matches/${matchId}/participation`);
  },

  getMyParticipation(matchId) {
    return axiosClient.get(`/api/player/matches/${matchId}/participation`);
  },
  getMatchParticipants(matchId) {
    return axiosClient.get(`/api/player/matches/${matchId}/participants`);
  },
};

export default playerMatchApi;
