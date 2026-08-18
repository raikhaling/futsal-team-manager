import { useEffect, useState, useMemo } from "react";
import adminMatchApi from "../api/adminMatchApi";
import { Link } from "react-router-dom";

function AdminMatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadMatches() {
      try {
        setLoading(true);
        setError("");

        const response = await adminMatchApi.getAllMatches();
        setMatches(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load matches.");
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      const matchesSearch =
        match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.location.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === "upcoming") {
        return match.matchDate >= todayStr;
      }

      return true;
    });
  }, [matches, activeTab, searchQuery, todayStr]);

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

  function getStatusBadge(matchDate) {
    if (matchDate === todayStr) {
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
          Today
        </span>
      );
    }
    if (matchDate > todayStr) {
      return (
        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
          Upcoming
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
        Completed
      </span>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm font-medium text-slate-500">Loading matches...</p>
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Manage Matches
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View schedules, manage player attendance, and update match details.
          </p>
        </div>

        <Link
          to="/admin/matches/create"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 shadow-sm"
        >
          Create Match
        </Link>
      </div>

      {/* Filter Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("upcoming")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              activeTab === "upcoming"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Upcoming & Today
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              activeTab === "all"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Matches ({matches.length})
          </button>
        </div>

        <input
          type="text"
          placeholder="Search match or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-64"
        />
      </div>

      {/* Matches Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {filteredMatches.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No matches found for this view.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Match</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Location</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Time</th>
                  <th className="px-6 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {filteredMatches.map((match) => (
                  <tr key={match.id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {match.name}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(match.matchDate)}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {match.location}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatDate(match.matchDate)}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatTime(match.startTime)} –{" "}
                      {formatTime(match.endTime)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/matches/${match.id}`}
                          className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700"
                        >
                          Manage
                        </Link>
                        <Link
                          to={`/admin/matches/${match.id}/edit`}
                          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          Edit
                        </Link>
                      </div>
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

export default AdminMatchesPage;
