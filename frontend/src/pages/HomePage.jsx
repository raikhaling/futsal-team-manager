import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import matchApi from "../api/matchApi";
import playerAttendanceApi from "../api/playerAttendanceApi";
import leaderboardApi from "../api/leaderboardApi";

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

  if (authLoading || loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  const nextMatch = upcomingMatches[0];

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm font-medium text-blue-600">Futsal Team Manager</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Welcome, {user.name}
        </h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Manage your matches and keep track of your attendance.
        </p>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
            Upcoming Matches
          </h2>

          {upcomingMatches.length > 0 && (
            <Link
              to="/matches"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View All
            </Link>
          )}
        </div>

        {upcomingMatches.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
            <p className="text-sm text-slate-500">No upcoming matches.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Next Match
              </p>

              <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {nextMatch.name}
                  </h3>

                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>📍 {nextMatch.location}</p>
                    <p>📅 {formatDate(nextMatch.matchDate)}</p>
                    <p>
                      🕘 {formatTime(nextMatch.startTime)} -{" "}
                      {formatTime(nextMatch.endTime)}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/matches/${nextMatch.id}`}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto"
                >
                  View Details
                </Link>
              </div>
            </div>

            {upcomingMatches.length > 1 && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {upcomingMatches.slice(1, 3).map((match) => (
                  <div
                    key={match.id}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <h3 className="text-lg font-semibold text-slate-900">
                      {match.name}
                    </h3>

                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <p>📍 {match.location}</p>
                      <p>📅 {formatDate(match.matchDate)}</p>
                      <p>
                        🕘 {formatTime(match.startTime)} -{" "}
                        {formatTime(match.endTime)}
                      </p>
                    </div>

                    <Link
                      to={`/matches/${match.id}`}
                      className="mt-5 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
            My Attendance
          </h2>

          <Link
            to="/attendance"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View History
          </Link>
        </div>

        {attendance && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <p className="text-sm text-slate-500">Total Matches</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {attendance.totalMatches}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <p className="text-sm text-slate-500">Attended</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {attendance.attended}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <p className="text-sm text-slate-500">Missed</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {attendance.missed}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <p className="text-sm text-slate-500">Attendance Rate</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {attendance.attendancePercentage.toFixed(2)}%
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
            Attendance Leaderboard
          </h2>

          <Link
            to="/leaderboard"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View Full
          </Link>
        </div>

        {leaderboard.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
            <p className="text-sm text-slate-500">
              No leaderboard data available.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-175 text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Rank</th>
                  <th className="px-4 py-3 font-semibold">Player</th>
                  <th className="px-4 py-3 font-semibold">Matches</th>
                  <th className="px-4 py-3 font-semibold">Attended</th>
                  <th className="px-4 py-3 font-semibold">No Show</th>
                  <th className="px-4 py-3 font-semibold">Attendance</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {leaderboard.slice(0, 5).map((player, index) => (
                  <tr
                    key={player.playerName}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {player.playerName}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {player.matches}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {player.attended}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {player.noShow}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {player.attendancePercentage.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}

export default HomePage;
