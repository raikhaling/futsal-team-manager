import axiosClient from "./axiosClient";

const matchApi = {
  getUpcomingMatches() {
    return axiosClient.get("/api/matches/upcoming");
  },
};

export default matchApi;
