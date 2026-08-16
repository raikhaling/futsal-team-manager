import { useEffect, useState } from "react";
import leaderboardApi from "../api/leaderboardApi";

function AttendanceLeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        setLoading(true);
        setError("");

        const response = await leaderboardApi.getAttendanceLeaderboard();

        setLeaderboard(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load attendance leaderboard.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, []);

  if (loading) {
    return <p>Loading leaderboard...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h1>Attendance Leaderboard</h1>

      {leaderboard.length === 0 ? (
        <p>No leaderboard data available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Matches</th>
              <th>Attended</th>
              <th>No Show</th>
              <th>Attendance Rate</th>
            </tr>
          </thead>

          <tbody>
            {leaderboard.map((player, index) => (
              <tr key={player.playerName}>
                <td>{index + 1}</td>
                <td>{player.playerName}</td>
                <td>{player.matches}</td>
                <td>{player.attended}</td>
                <td>{player.noShow}</td>
                <td>{player.attendancePercentage.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default AttendanceLeaderboardPage;
