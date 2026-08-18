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
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm font-medium text-slate-500">
          Loading leaderboard...
        </p>
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

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Attendance Leaderboard
      </h1>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {leaderboard.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-500">
            No leaderboard data available.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Rank</th>
                  <th className="px-6 py-3 font-semibold">Player</th>
                  <th className="px-6 py-3 font-semibold">Matches</th>
                  <th className="px-6 py-3 font-semibold">Attended</th>
                  <th className="px-6 py-3 font-semibold">No Show</th>
                  <th className="px-6 py-3 font-semibold">Attendance Rate</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {leaderboard.map((player, index) => (
                  <tr
                    key={player.playerName}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      #{index + 1}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {player.playerName}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {player.matches}
                    </td>
                    <td className="px-6 py-4 font-medium text-emerald-600">
                      {player.attended}
                    </td>
                    <td className="px-6 py-4 font-medium text-rose-600">
                      {player.noShow}
                    </td>
                    <td className="px-6 py-4 font-semibold text-blue-600">
                      {player.attendancePercentage.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default AttendanceLeaderboardPage;
