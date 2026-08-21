import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminPlayerApi from "../api/adminPlayerApi";

function AdminPlayersPage() {
  const [players, setPlayers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadPlayers() {
      try {
        setLoading(true);
        setError("");

        const response = await adminPlayerApi.getAllPlayers(page, 10);

        const pageData = response.data;

        if (pageData.totalPages > 0 && page >= pageData.totalPages) {
          setPage(pageData.totalPages - 1);
          return;
        }

        setPlayers(pageData.content);
        setTotalPages(pageData.totalPages);
        setTotalElements(pageData.totalElements);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load players.");
      } finally {
        setLoading(false);
      }
    }

    loadPlayers();
  }, [page, refreshKey]);

  async function handleDelete(player) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${player.name}?`,
    );

    if (!confirmed) {
      return;
    }

    setDeleteError("");
    setDeletingId(player.id);

    try {
      await adminPlayerApi.deletePlayer(player.id);

      setRefreshKey((currentKey) => currentKey + 1);
    } catch (error) {
      setDeleteError(
        error.response?.data?.message || "Failed to delete player.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm font-medium text-slate-500">Loading players...</p>
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
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Players
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Total Players: <span className="text-slate-900">{totalElements}</span>
        </p>
      </div>

      {deleteError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {deleteError}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {players.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-500">
            No players found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">ID</th>
                  <th className="px-6 py-3 font-semibold">Name</th>
                  <th className="px-6 py-3 font-semibold">Email</th>
                  <th className="px-6 py-3 font-semibold">Phone</th>
                  <th className="px-6 py-3 font-semibold">Position</th>
                  <th className="px-6 py-3 font-semibold">Jersey Number</th>
                  <th className="px-6 py-3 font-semibold">Role</th>
                  <th className="px-6 py-3 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {players.map((player) => (
                  <tr key={player.id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                      {player.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {player.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{player.email}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {player.phone || "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {player.preferredPosition}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {player.jerseyNumber ?? "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                        {player.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/admin/players/${player.id}`)
                          }
                          className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/admin/players/${player.id}/edit`)
                          }
                          className="rounded-md bg-blue-600 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(player)}
                          disabled={deletingId === player.id}
                          className="rounded-md bg-rose-600 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-rose-700 disabled:opacity-50"
                        >
                          {deletingId === player.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={() => setPage((currentPage) => currentPage - 1)}
            disabled={page === 0}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-xs text-slate-600">
            Page <span className="font-medium text-slate-900">{page + 1}</span>{" "}
            of <span className="font-medium text-slate-900">{totalPages}</span>
          </span>

          <button
            type="button"
            onClick={() => setPage((currentPage) => currentPage + 1)}
            disabled={page >= totalPages - 1}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

export default AdminPlayersPage;
