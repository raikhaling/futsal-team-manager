import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import matchApi from "../api/matchApi";

function UpcomingMatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function loadMatches() {
      try {
        setLoading(true);
        setError("");

        const response = await matchApi.getUpcomingMatches();

        setMatches(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to load upcoming matches.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
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

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm text-slate-500">Loading upcoming matches...</p>
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

  const nextMatch = matches[0];

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm font-medium text-blue-600">Matches</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Upcoming Matches
        </h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          View upcoming futsal matches and check their details.
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center sm:p-8">
          <p className="text-sm text-slate-500">No upcoming matches.</p>
        </div>
      ) : (
        <>
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
              Next Match
            </h2>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {nextMatch.name}
                  </h3>

                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>📍 {nextMatch.location}</p>
                    <p>📅 {formatDate(nextMatch.matchDate)}</p>
                    <p>
                      🕘 {formatTime(nextMatch.startTime)} –{" "}
                      {formatTime(nextMatch.endTime)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/matches/${nextMatch.id}`)}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto"
                >
                  View Details
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                All Upcoming Matches
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Matches are ordered by the nearest scheduled date and time.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full min-w-175 text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Match</th>
                    <th className="px-4 py-3 font-semibold">Location</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Time</th>
                    <th className="px-4 py-3 font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {matches.map((match) => (
                    <tr key={match.id} className="transition hover:bg-slate-50">
                      <td className="px-4 py-4 font-medium text-slate-900">
                        {match.name}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {match.location}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {formatDate(match.matchDate)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                        {formatTime(match.startTime)} –{" "}
                        {formatTime(match.endTime)}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => navigate(`/matches/${match.id}`)}
                          className="whitespace-nowrap rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </section>
  );
}

export default UpcomingMatchesPage;
