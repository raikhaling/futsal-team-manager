import { useEffect, useState } from "react";
import playerAttendanceApi from "../api/playerAttendanceApi";

function MyAttendancePage() {
  const [attendance, setAttendance] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAttendance() {
      try {
        setLoading(true);
        setError("");

        const [attendanceResponse, historyResponse] = await Promise.all([
          playerAttendanceApi.getMyAttendance(),
          playerAttendanceApi.getMyAttendanceHistory(),
        ]);

        setAttendance(attendanceResponse.data);
        setHistory(historyResponse.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load attendance information.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadAttendance();
  }, []);

  if (loading) {
    return <p>Loading attendance...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h1>My Attendance</h1>

      {attendance && (
        <>
          <h2>Attendance Summary</h2>

          <p>
            <strong>Total Matches:</strong> {attendance.totalMatches}
          </p>

          <p>
            <strong>Attended:</strong> {attendance.attended}
          </p>

          <p>
            <strong>Missed:</strong> {attendance.missed}
          </p>

          <p>
            <strong>Attendance Rate:</strong>{" "}
            {attendance.attendancePercentage.toFixed(2)}%
          </p>
        </>
      )}

      <h2>Attendance History</h2>

      {history.length === 0 ? (
        <p>No attendance history available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {history.map((match) => (
              <tr key={match.matchId}>
                <td>{match.matchDate}</td>
                <td>{match.startTime}</td>
                <td>{match.endTime}</td>
                <td>{match.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default MyAttendancePage;
