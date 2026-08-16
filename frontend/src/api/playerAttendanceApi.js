import axiosClient from "./axiosClient";

const playerAttendanceApi = {
  getMyAttendance() {
    return axiosClient.get("/api/player/attendance");
  },
  getMyAttendanceHistory() {
    return axiosClient.get("/api/player/attendance/history");
  },
};

export default playerAttendanceApi;
