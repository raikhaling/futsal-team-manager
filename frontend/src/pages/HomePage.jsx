import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import matchApi from "../api/matchApi";
import playerAttendanceApi from "../api/playerAttendanceApi";
import leaderboardApi from "../api/leaderboardApi";
import { Link } from "react-router-dom";

function HomePage() {
  const { user, loading: authLoading } = useAuth();

  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [matchesResponse, attendanceResponse, leaderboardResponse] =
          await Promise.all([
            matchApi.getUpcomingMatches(),
            playerAttendanceApi.getMyAttendance(),
            leaderboardApi.getAttendanceLeaderboard(),
          ]);

        setUpcomingMatches(matchesResponse.data);
        setAttendance(attendanceResponse.data);
        setLeaderboard(leaderboardResponse.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (authLoading || loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  function formatDate(date) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
  }

  function formatTime(time) {
    const [hours, minutes] = time.split(":");

    const date = new Date();
    date.setHours(Number(hours), Number(minutes));

    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  }

  return (
    <section>
      <h1>Futsal Team Manager</h1>

      <h2>Welcome, {user.name}</h2>

      <hr />

      <h2>Upcoming Matches</h2>

      {upcomingMatches.length === 0 ? (
        <p>No upcoming matches.</p>
      ) : (
        <div>
          {upcomingMatches.slice(0, 2).map((match) => (
            <div key={match.id}>
              <h3>{match.name}</h3>

              <p>📍 {match.location}</p>

              <p>📅 {formatDate(match.matchDate)}</p>

              <p>
                🕘 {formatTime(match.startTime)} - {formatTime(match.endTime)}
              </p>

              <Link to={`/matches/${match.id}`}>View Details</Link>

              <hr />
            </div>
          ))}
          <Link to="/matches">View All Matches</Link>
        </div>
      )}

      <h2>My Attendance</h2>

      {attendance && (
        <div>
          <p>Total Matches: {attendance.totalMatches}</p>
          <p>Attended: {attendance.attended}</p>
          <p>Missed: {attendance.missed}</p>
          <p>Attendance Rate: {attendance.attendancePercentage.toFixed(2)}%</p>
          <Link to="/attendance">View Attendance History</Link>
        </div>
      )}

      <h2>Attendance Leaderboard</h2>

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
              <th>Attendance</th>
            </tr>
          </thead>

          <tbody>
            {leaderboard.slice(0, 5).map((player, index) => (
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
      <Link to="/leaderboard">View Full Leaderboard</Link>
    </section>
  );
}

export default HomePage;
