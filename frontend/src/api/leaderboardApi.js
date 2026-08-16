import axiosClient from "./axiosClient";

const leaderboardApi = {
  getAttendanceLeaderboard(sort = "matches") {
    return axiosClient.get("/api/leaderboard/attendance", {
      params: { sort },
    });
  },
};

export default leaderboardApi;
