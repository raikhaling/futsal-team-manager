import axiosClient from "./axiosClient";

const teamApi = {
  getMyTeams() {
    return axiosClient.get("/api/teams/my");
  },
  getCurrentTeamJoinCode() {
    return axiosClient.get("/api/teams/current/join-code");
  },
  createTeam(teamData) {
    return axiosClient.post("/api/teams", teamData);
  },
  joinTeam(joinCode) {
    return axiosClient.post("/api/teams/join", { joinCode });
  },
  getMembers() {
    return axiosClient.get("/api/teams/members");
  },
  leaveTeam() {
    return axiosClient.delete("/api/teams/leave");
  },
  removeMember(playerId) {
    return axiosClient.delete(`/api/teams/members/${playerId}`);
  },
  updateMemberRole(playerId, role) {
    return axiosClient.patch(`/api/teams/members/${playerId}/role`, { role });
  },
};

export default teamApi;
