import axiosClient from "./axiosClient";

const matchApi = {
  getUpcomingMatches() {
    return axiosClient.get("/api/matches/upcoming");
  },
  getMatchDetails(matchId) {
    return axiosClient.get(`/api/matches/${matchId}`);
  },
};

export default matchApi;
